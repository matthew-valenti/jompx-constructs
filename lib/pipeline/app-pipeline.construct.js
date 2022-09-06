"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPipeline = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const codepipelineActions = require("aws-cdk-lib/aws-codepipeline-actions");
const iam = require("aws-cdk-lib/aws-iam");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const constructs_1 = require("constructs");
const config_1 = require("../config/config");
class AppPipeline extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _b;
        super(scope, id);
        this.environmentPipelines = [];
        const config = new config_1.Config(this.node);
        const stage = config.stage();
        const stageNamePascalCase = changeCase.pascalCase(stage);
        const appNamePascalCase = changeCase.pascalCase(props.appName);
        // Get branch.
        const stageValue = new Map(Object.entries(config.stages())).get(stage);
        if (!(stageValue === null || stageValue === void 0 ? void 0 : stageValue.branch))
            throw Error(`Jompx: branch not found! Branch is missing from jompx.config.ts stage ${stage}.`);
        let branch = stageValue.branch;
        // If branch is regex.
        let branchRegex = '';
        if (branch.startsWith('(') && branch.endsWith(')')) {
            branchRegex = branch;
        }
        // Create pipeline.
        this.pipeline = new codepipeline.Pipeline(this, `AppCodePipeline${stageNamePascalCase}${appNamePascalCase}`, {
            pipelineName: `app-pipeline-${stage}-${props.appName}`
        });
        // Define pipeline sourceAction. If branch is regex then source is S3 else GitHub.
        let sourceAction;
        const sourceOutput = new codepipeline.Artifact();
        if (branchRegex) {
            const branchFileName = `branch-${props.appName}.zip`;
            // Create github source (sandbox feature branch).
            const gitHubBranchSource = codebuild
                .Source.gitHub({
                owner: props.gitHub.owner,
                repo: props.gitHub.repo,
                fetchSubmodules: true,
                webhook: true,
                webhookFilters: [
                    codebuild.FilterGroup
                        .inEventOf(codebuild.EventAction.PUSH)
                        .andBranchIsNot('main') // For additional protection only.
                        .andBranchIs(`.*${branchRegex}.*`) // e.g. author-sandbox1-my-feature, test = author-test-my-feature
                ]
            });
            // Create build project (to copy feature branch files to S3 on github push).
            const githubCodeBuildProject = new codebuild.Project(this, `GithubCodeBuildProject${stageNamePascalCase}${appNamePascalCase}`, {
                projectName: `copy-github-${stage}-${props.appName}-branch-to-s3`,
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: 0.2,
                    artifacts: {
                        files: '**/*'
                    }
                }),
                source: gitHubBranchSource,
                artifacts: codebuild.Artifacts.s3({
                    name: branchFileName,
                    bucket: props.pipelinegBucket,
                    includeBuildId: false,
                    packageZip: true,
                    identifier: 'GithubArtifact'
                })
            });
            // CodeBuild project requires permissions to S3 bucket objects.
            githubCodeBuildProject.addToRolePolicy(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
                resources: [
                    props.pipelinegBucket.bucketArn,
                    `${props.pipelinegBucket.bucketArn}/*`
                ]
            }));
            // Create S3 source action.
            sourceAction = new codepipelineActions.S3SourceAction({
                actionName: `s3-source-action-${stage}-${props.appName}`,
                bucket: props.pipelinegBucket,
                bucketKey: branchFileName,
                output: sourceOutput
            });
        }
        else {
            // Create GitHub source action.
            sourceAction = new codepipelineActions.GitHubSourceAction({
                actionName: `github-source-action-${stage}-${props.appName}`,
                owner: props.gitHub.owner,
                repo: props.gitHub.repo,
                oauthToken: props.gitHub.token,
                output: sourceOutput,
                branch: branch
            });
        }
        // Pipeline Stage 1: Set pipeline source to GitHub (source action).
        this.pipeline.addStage({
            stageName: `pipeline-source-${stage}-${props.appName}`,
            actions: [sourceAction]
        });
        // Use prop if exists, else default to small.
        const buildEnvironment = (_b = props.buildEnvironment) !== null && _b !== void 0 ? _b : {
            buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
            computeType: codebuild.ComputeType.SMALL
        };
        // Create code build pipeline (commands to build app code).
        const codebuildPipeline = new codebuild.PipelineProject(this, `CodeBuild${stageNamePascalCase}${appNamePascalCase}`, {
            projectName: `app-code-build-${props.appName}`,
            buildSpec: codebuild.BuildSpec.fromObject(props.codebuildBuildSpecObject),
            environment: buildEnvironment
        });
        // Code build pipeline requires permissions to perform operations on the app S3 bucket.
        // e.g. Sync files, copy files, delete files.
        codebuildPipeline.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
            resources: [
                props.hostingBucket.bucketArn,
                `${props.hostingBucket.bucketArn}/*`
            ]
        }));
        // Create code pipline build action (with GitHub source as input).
        const codeBuildAction = new codepipelineActions.CodeBuildAction({
            actionName: `code-build-action-${props.appName}`,
            input: sourceOutput,
            project: codebuildPipeline
        });
        // Set pipeline stage = build.
        // Pipeline Stage 2: Set action to build (app code).
        this.pipeline.addStage({
            stageName: `app-build-${props.appName}`,
            actions: [codeBuildAction]
        });
        // const waitForCdkStage = this.pipeline.addStage({
        //     stageName: 'waitForCdkStage',
        //     transitionToEnabled: false,
        //     transitionDisabledReason: 'Manual transition only'
        // });
    }
}
exports.AppPipeline = AppPipeline;
_a = JSII_RTTI_SYMBOL_1;
AppPipeline[_a] = { fqn: "@jompx/constructs.AppPipeline", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZS9hcHAtcGlwZWxpbmUuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsdURBQXVEO0FBQ3ZELDZEQUE2RDtBQUM3RCw0RUFBNEU7QUFDNUUsMkNBQTJDO0FBRzNDLDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsMkNBQXVDO0FBQ3ZDLDZDQUEwQztBQXdCMUMsTUFBYSxXQUFZLFNBQVEsc0JBQVM7SUFLdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3Qjs7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUxkLHlCQUFvQixHQUEyQixFQUFFLENBQUM7UUFPckQsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixNQUFNLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekQsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUvRCxjQUFjO1FBQ2QsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4RSxJQUFJLEVBQUMsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLE1BQU0sQ0FBQTtZQUFFLE1BQU0sS0FBSyxDQUFDLHlFQUF5RSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ3hILElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFFL0Is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QVcsRUFBRSxnQkFBZ0I7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsdUZBQXVGO1FBQ3ZGLDZDQUE2QztRQUM3QyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RELE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDeEIsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUM7WUFDN0UsU0FBUyxFQUFFO2dCQUNQLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUztnQkFDN0IsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsSUFBSTthQUN2QztTQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUosa0VBQWtFO1FBQ2xFLE1BQU0sZUFBZSxHQUFHLElBQUksbUJBQW1CLENBQUMsZUFBZSxDQUFDO1lBQzVELFVBQVUsRUFBRSxxQkFBcUIsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNoRCxLQUFLLEVBQUUsWUFBWTtZQUNuQixPQUFPLEVBQUUsaUJBQWlCO1NBQzdCLENBQUMsQ0FBQztRQUVILDhCQUE4QjtRQUM5QixvREFBb0Q7UUFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDbkIsU0FBUyxFQUFFLGFBQWEsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUN2QyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7U0FDN0IsQ0FBQyxDQUFDO1FBRUgsbURBQW1EO1FBQ25ELG9DQUFvQztRQUNwQyxrQ0FBa0M7UUFDbEMseURBQXlEO1FBQ3pELE1BQU07SUFDVixDQUFDOztBQXZKTCxrQ0F3SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XHJcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcclxuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lQWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBQaXBlbGluZVByb3BzIHtcclxuICAgIHN0YWdlOiBzdHJpbmc7XHJcbiAgICBhcHBOYW1lOiBzdHJpbmc7XHJcbiAgICBob3N0aW5nQnVja2V0OiBzMy5JQnVja2V0O1xyXG4gICAgcGlwZWxpbmVnQnVja2V0OiBzMy5JQnVja2V0O1xyXG4gICAgZ2l0SHViOiBJQXBwUGlwZWxpbmVHaXRIdWJQcm9wcztcclxuICAgIGNvZGVidWlsZEJ1aWxkU3BlY09iamVjdDogb2JqZWN0O1xyXG4gICAgYnVpbGRFbnZpcm9ubWVudD86IGNkay5hd3NfY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFwcFBpcGVsaW5lR2l0SHViUHJvcHMge1xyXG4gICAgb3duZXI6IHN0cmluZztcclxuICAgIHJlcG86IHN0cmluZztcclxuICAgIC8vIE11c3QgdXNlIHNlY3JldCB2YWx1ZSBiZWNhdXNlIEdpdEh1YlNvdXJjZUFjdGlvbiBvYXV0aFRva2VuIGlzIG9mIHR5cGUgY2RrLlNlY3JldFZhbHVlLlxyXG4gICAgdG9rZW46IGNkay5TZWNyZXRWYWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRW52aXJvbm1lbnRQaXBlbGluZSB7XHJcbiAgICBicmFuY2g6IHN0cmluZztcclxuICAgIHBpcGVsaW5lOiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwUGlwZWxpbmUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljIGVudmlyb25tZW50UGlwZWxpbmVzOiBJRW52aXJvbm1lbnRQaXBlbGluZVtdID0gW107XHJcblxyXG4gICAgcHVibGljIHBpcGVsaW5lOiBjZGsuYXdzX2NvZGVwaXBlbGluZS5QaXBlbGluZSB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUFwcFBpcGVsaW5lUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKHRoaXMubm9kZSk7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSBjb25maWcuc3RhZ2UoKTtcclxuICAgICAgICBjb25zdCBzdGFnZU5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHN0YWdlKTtcclxuICAgICAgICBjb25zdCBhcHBOYW1lUGFzY2FsQ2FzZSA9IGNoYW5nZUNhc2UucGFzY2FsQ2FzZShwcm9wcy5hcHBOYW1lKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IGJyYW5jaC5cclxuICAgICAgICBjb25zdCBzdGFnZVZhbHVlID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhjb25maWcuc3RhZ2VzKCkhKSkuZ2V0KHN0YWdlKTtcclxuICAgICAgICBpZiAoIXN0YWdlVmFsdWU/LmJyYW5jaCkgdGhyb3cgRXJyb3IoYEpvbXB4OiBicmFuY2ggbm90IGZvdW5kISBCcmFuY2ggaXMgbWlzc2luZyBmcm9tIGpvbXB4LmNvbmZpZy50cyBzdGFnZSAke3N0YWdlfS5gKTtcclxuICAgICAgICBsZXQgYnJhbmNoID0gc3RhZ2VWYWx1ZS5icmFuY2g7XHJcblxyXG4gICAgICAgIC8vIElmIGJyYW5jaCBpcyByZWdleC5cclxuICAgICAgICBsZXQgYnJhbmNoUmVnZXggPSAnJztcclxuICAgICAgICBpZiAoYnJhbmNoLnN0YXJ0c1dpdGgoJygnKSAmJiBicmFuY2guZW5kc1dpdGgoJyknKSkge1xyXG4gICAgICAgICAgICBicmFuY2hSZWdleCA9IGJyYW5jaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBwaXBlbGluZS5cclxuICAgICAgICB0aGlzLnBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZSh0aGlzLCBgQXBwQ29kZVBpcGVsaW5lJHtzdGFnZU5hbWVQYXNjYWxDYXNlfSR7YXBwTmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICBwaXBlbGluZU5hbWU6IGBhcHAtcGlwZWxpbmUtJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfWBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gRGVmaW5lIHBpcGVsaW5lIHNvdXJjZUFjdGlvbi4gSWYgYnJhbmNoIGlzIHJlZ2V4IHRoZW4gc291cmNlIGlzIFMzIGVsc2UgR2l0SHViLlxyXG4gICAgICAgIGxldCBzb3VyY2VBY3Rpb246IGNkay5hd3NfY29kZXBpcGVsaW5lX2FjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uIHwgY2RrLmF3c19jb2RlcGlwZWxpbmVfYWN0aW9ucy5TM1NvdXJjZUFjdGlvbjtcclxuICAgICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XHJcblxyXG4gICAgICAgIGlmIChicmFuY2hSZWdleCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYnJhbmNoRmlsZU5hbWUgPSBgYnJhbmNoLSR7cHJvcHMuYXBwTmFtZX0uemlwYDtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBnaXRodWIgc291cmNlIChzYW5kYm94IGZlYXR1cmUgYnJhbmNoKS5cclxuICAgICAgICAgICAgY29uc3QgZ2l0SHViQnJhbmNoU291cmNlID0gY29kZWJ1aWxkXHJcbiAgICAgICAgICAgICAgICAuU291cmNlLmdpdEh1Yih7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHByb3BzLmdpdEh1Yi5vd25lcixcclxuICAgICAgICAgICAgICAgICAgICByZXBvOiBwcm9wcy5naXRIdWIucmVwbyxcclxuICAgICAgICAgICAgICAgICAgICBmZXRjaFN1Ym1vZHVsZXM6IHRydWUsIC8vIEZvciBhbGwgR2l0IHNvdXJjZXMsIHlvdSBjYW4gZmV0Y2ggc3VibW9kdWxlcyB3aGlsZSBjbG9pbmcgZ2l0IHJlcG8uXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViaG9vazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB3ZWJob29rRmlsdGVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlYnVpbGQuRmlsdGVyR3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbkV2ZW50T2YoY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVU0gpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXNOb3QoJ21haW4nKSAvLyBGb3IgYWRkaXRpb25hbCBwcm90ZWN0aW9uIG9ubHkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXMoYC4qJHticmFuY2hSZWdleH0uKmApIC8vIGUuZy4gYXV0aG9yLXNhbmRib3gxLW15LWZlYXR1cmUsIHRlc3QgPSBhdXRob3ItdGVzdC1teS1mZWF0dXJlXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYnVpbGQgcHJvamVjdCAodG8gY29weSBmZWF0dXJlIGJyYW5jaCBmaWxlcyB0byBTMyBvbiBnaXRodWIgcHVzaCkuXHJcbiAgICAgICAgICAgIGNvbnN0IGdpdGh1YkNvZGVCdWlsZFByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgYEdpdGh1YkNvZGVCdWlsZFByb2plY3Qke3N0YWdlTmFtZVBhc2NhbENhc2V9JHthcHBOYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogYGNvcHktZ2l0aHViLSR7c3RhZ2V9LSR7cHJvcHMuYXBwTmFtZX0tYnJhbmNoLXRvLXMzYCxcclxuICAgICAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiAnKiovKidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogZ2l0SHViQnJhbmNoU291cmNlLFxyXG4gICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiBjb2RlYnVpbGQuQXJ0aWZhY3RzLnMzKHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBicmFuY2hGaWxlTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBidWNrZXQ6IHByb3BzLnBpcGVsaW5lZ0J1Y2tldCxcclxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlQnVpbGRJZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZVppcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnR2l0aHViQXJ0aWZhY3QnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvZGVCdWlsZCBwcm9qZWN0IHJlcXVpcmVzIHBlcm1pc3Npb25zIHRvIFMzIGJ1Y2tldCBvYmplY3RzLlxyXG4gICAgICAgICAgICBnaXRodWJDb2RlQnVpbGRQcm9qZWN0LmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnLCAnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuICAgICAgICAgICAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BzLnBpcGVsaW5lZ0J1Y2tldC5idWNrZXRBcm4sXHJcbiAgICAgICAgICAgICAgICAgICAgYCR7cHJvcHMucGlwZWxpbmVnQnVja2V0LmJ1Y2tldEFybn0vKmBcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIFMzIHNvdXJjZSBhY3Rpb24uXHJcbiAgICAgICAgICAgIHNvdXJjZUFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVBY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6IGBzMy1zb3VyY2UtYWN0aW9uLSR7c3RhZ2V9LSR7cHJvcHMuYXBwTmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgYnVja2V0OiBwcm9wcy5waXBlbGluZWdCdWNrZXQsXHJcbiAgICAgICAgICAgICAgICBidWNrZXRLZXk6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXRcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgR2l0SHViIHNvdXJjZSBhY3Rpb24uXHJcbiAgICAgICAgICAgIHNvdXJjZUFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVBY3Rpb25zLkdpdEh1YlNvdXJjZUFjdGlvbih7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiBgZ2l0aHViLXNvdXJjZS1hY3Rpb24tJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBvd25lcjogcHJvcHMuZ2l0SHViLm93bmVyLFxyXG4gICAgICAgICAgICAgICAgcmVwbzogcHJvcHMuZ2l0SHViLnJlcG8sXHJcbiAgICAgICAgICAgICAgICBvYXV0aFRva2VuOiBwcm9wcy5naXRIdWIudG9rZW4sXHJcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogYnJhbmNoXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUGlwZWxpbmUgU3RhZ2UgMTogU2V0IHBpcGVsaW5lIHNvdXJjZSB0byBHaXRIdWIgKHNvdXJjZSBhY3Rpb24pLlxyXG4gICAgICAgIHRoaXMucGlwZWxpbmUuYWRkU3RhZ2Uoe1xyXG4gICAgICAgICAgICBzdGFnZU5hbWU6IGBwaXBlbGluZS1zb3VyY2UtJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IFtzb3VyY2VBY3Rpb25dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFVzZSBwcm9wIGlmIGV4aXN0cywgZWxzZSBkZWZhdWx0IHRvIHNtYWxsLlxyXG4gICAgICAgIGNvbnN0IGJ1aWxkRW52aXJvbm1lbnQgPSBwcm9wcy5idWlsZEVudmlyb25tZW50ID8/IHtcclxuICAgICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl8zLFxyXG4gICAgICAgICAgICBjb21wdXRlVHlwZTogY29kZWJ1aWxkLkNvbXB1dGVUeXBlLlNNQUxMXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGNvZGUgYnVpbGQgcGlwZWxpbmUgKGNvbW1hbmRzIHRvIGJ1aWxkIGFwcCBjb2RlKS5cclxuICAgICAgICBjb25zdCBjb2RlYnVpbGRQaXBlbGluZSA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHRoaXMsIGBDb2RlQnVpbGQke3N0YWdlTmFtZVBhc2NhbENhc2V9JHthcHBOYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgIHByb2plY3ROYW1lOiBgYXBwLWNvZGUtYnVpbGQtJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHByb3BzLmNvZGVidWlsZEJ1aWxkU3BlY09iamVjdCksXHJcbiAgICAgICAgICAgIGVudmlyb25tZW50OiBidWlsZEVudmlyb25tZW50XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIENvZGUgYnVpbGQgcGlwZWxpbmUgcmVxdWlyZXMgcGVybWlzc2lvbnMgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIHRoZSBhcHAgUzMgYnVja2V0LlxyXG4gICAgICAgIC8vIGUuZy4gU3luYyBmaWxlcywgY29weSBmaWxlcywgZGVsZXRlIGZpbGVzLlxyXG4gICAgICAgIGNvZGVidWlsZFBpcGVsaW5lLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgYWN0aW9uczogWydzMzpMaXN0QnVja2V0JywgJ3MzOkdldE9iamVjdCcsICdzMzpQdXRPYmplY3QnLCAnczM6RGVsZXRlT2JqZWN0J10sXHJcbiAgICAgICAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgICAgICAgICAgcHJvcHMuaG9zdGluZ0J1Y2tldC5idWNrZXRBcm4sXHJcbiAgICAgICAgICAgICAgICBgJHtwcm9wcy5ob3N0aW5nQnVja2V0LmJ1Y2tldEFybn0vKmBcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGNvZGUgcGlwbGluZSBidWlsZCBhY3Rpb24gKHdpdGggR2l0SHViIHNvdXJjZSBhcyBpbnB1dCkuXHJcbiAgICAgICAgY29uc3QgY29kZUJ1aWxkQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZUFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcclxuICAgICAgICAgICAgYWN0aW9uTmFtZTogYGNvZGUtYnVpbGQtYWN0aW9uLSR7cHJvcHMuYXBwTmFtZX1gLFxyXG4gICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxyXG4gICAgICAgICAgICBwcm9qZWN0OiBjb2RlYnVpbGRQaXBlbGluZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTZXQgcGlwZWxpbmUgc3RhZ2UgPSBidWlsZC5cclxuICAgICAgICAvLyBQaXBlbGluZSBTdGFnZSAyOiBTZXQgYWN0aW9uIHRvIGJ1aWxkIChhcHAgY29kZSkuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZS5hZGRTdGFnZSh7XHJcbiAgICAgICAgICAgIHN0YWdlTmFtZTogYGFwcC1idWlsZC0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgYWN0aW9uczogW2NvZGVCdWlsZEFjdGlvbl1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY29uc3Qgd2FpdEZvckNka1N0YWdlID0gdGhpcy5waXBlbGluZS5hZGRTdGFnZSh7XHJcbiAgICAgICAgLy8gICAgIHN0YWdlTmFtZTogJ3dhaXRGb3JDZGtTdGFnZScsXHJcbiAgICAgICAgLy8gICAgIHRyYW5zaXRpb25Ub0VuYWJsZWQ6IGZhbHNlLFxyXG4gICAgICAgIC8vICAgICB0cmFuc2l0aW9uRGlzYWJsZWRSZWFzb246ICdNYW51YWwgdHJhbnNpdGlvbiBvbmx5J1xyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==