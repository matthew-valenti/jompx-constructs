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
        this.outputs = {};
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
        this.outputs.pipeline = new codepipeline.Pipeline(this, `AppCodePipeline${stageNamePascalCase}${appNamePascalCase}`, {
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
        this.outputs.pipeline.addStage({
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
        this.outputs.pipeline.addStage({
            stageName: `app-build-${props.appName}`,
            actions: [codeBuildAction]
        });
        // const waitForCdkStage = this.outputs.pipeline.addStage({
        //     stageName: 'waitForCdkStage',
        //     transitionToEnabled: false,
        //     transitionDisabledReason: 'Manual transition only'
        // });
    }
}
exports.AppPipeline = AppPipeline;
_a = JSII_RTTI_SYMBOL_1;
AppPipeline[_a] = { fqn: "@jompx/constructs.AppPipeline", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZS9hcHAtcGlwZWxpbmUuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsdURBQXVEO0FBQ3ZELDZEQUE2RDtBQUM3RCw0RUFBNEU7QUFDNUUsMkNBQTJDO0FBRzNDLDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsMkNBQXVDO0FBQ3ZDLDZDQUEwQztBQTRCMUMsTUFBYSxXQUFZLFNBQVEsc0JBQVM7SUFLdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3Qjs7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUxkLHlCQUFvQixHQUEyQixFQUFFLENBQUM7UUFFbEQsWUFBTyxHQUF3QixFQUF5QixDQUFDO1FBSzVELE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pELE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0QsY0FBYztRQUNkLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEUsSUFBSSxFQUFDLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxNQUFNLENBQUE7WUFBRSxNQUFNLEtBQUssQ0FBQyx5RUFBeUUsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUN4SCxJQUFJLE1BQU0sR0FB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QVMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDO1lBQ3pFLFdBQVcsRUFBRSxnQkFBZ0I7U0FDaEMsQ0FBQyxDQUFDO1FBRUgsdUZBQXVGO1FBQ3ZGLDZDQUE2QztRQUM3QyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3RELE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7WUFDeEIsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUM7WUFDN0UsU0FBUyxFQUFFO2dCQUNQLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUztnQkFDN0IsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsSUFBSTthQUN2QztTQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUosa0VBQWtFO1FBQ2xFLE1BQU0sZUFBZSxHQUFHLElBQUksbUJBQW1CLENBQUMsZUFBZSxDQUFDO1lBQzVELFVBQVUsRUFBRSxxQkFBcUIsS0FBSyxDQUFDLE9BQU8sRUFBRTtZQUNoRCxLQUFLLEVBQUUsWUFBWTtZQUNuQixPQUFPLEVBQUUsaUJBQWlCO1NBQzdCLENBQUMsQ0FBQztRQUVILDhCQUE4QjtRQUM5QixvREFBb0Q7UUFDcEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQzNCLFNBQVMsRUFBRSxhQUFhLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDdkMsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO1NBQzdCLENBQUMsQ0FBQztRQUVILDJEQUEyRDtRQUMzRCxvQ0FBb0M7UUFDcEMsa0NBQWtDO1FBQ2xDLHlEQUF5RDtRQUN6RCxNQUFNO0lBQ1YsQ0FBQzs7QUF2Skwsa0NBd0pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xyXG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZSc7XHJcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZUFjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcclxuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG5pbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwUGlwZWxpbmVQcm9wcyB7XHJcbiAgICBzdGFnZTogc3RyaW5nO1xyXG4gICAgYXBwTmFtZTogc3RyaW5nO1xyXG4gICAgaG9zdGluZ0J1Y2tldDogczMuSUJ1Y2tldDtcclxuICAgIHBpcGVsaW5lZ0J1Y2tldDogczMuSUJ1Y2tldDtcclxuICAgIGdpdEh1YjogSUFwcFBpcGVsaW5lR2l0SHViUHJvcHM7XHJcbiAgICBjb2RlYnVpbGRCdWlsZFNwZWNPYmplY3Q6IG9iamVjdDtcclxuICAgIGJ1aWxkRW52aXJvbm1lbnQ/OiBjZGsuYXdzX2NvZGVidWlsZC5CdWlsZEVudmlyb25tZW50O1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBQaXBlbGluZUdpdEh1YlByb3BzIHtcclxuICAgIG93bmVyOiBzdHJpbmc7XHJcbiAgICByZXBvOiBzdHJpbmc7XHJcbiAgICAvLyBNdXN0IHVzZSBzZWNyZXQgdmFsdWUgYmVjYXVzZSBHaXRIdWJTb3VyY2VBY3Rpb24gb2F1dGhUb2tlbiBpcyBvZiB0eXBlIGNkay5TZWNyZXRWYWx1ZS5cclxuICAgIHRva2VuOiBjZGsuU2VjcmV0VmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudmlyb25tZW50UGlwZWxpbmUge1xyXG4gICAgYnJhbmNoOiBzdHJpbmc7XHJcbiAgICBwaXBlbGluZTogcGlwZWxpbmVzLkNvZGVQaXBlbGluZTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwUGlwZWxpbmVPdXRwdXRzIHtcclxuICAgIHBpcGVsaW5lOiBjZGsuYXdzX2NvZGVwaXBlbGluZS5QaXBlbGluZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFBpcGVsaW5lIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudFBpcGVsaW5lczogSUVudmlyb25tZW50UGlwZWxpbmVbXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBvdXRwdXRzOiBJQXBwUGlwZWxpbmVPdXRwdXRzID0ge30gYXMgSUFwcFBpcGVsaW5lT3V0cHV0cztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUFwcFBpcGVsaW5lUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKHRoaXMubm9kZSk7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSBjb25maWcuc3RhZ2UoKTtcclxuICAgICAgICBjb25zdCBzdGFnZU5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHN0YWdlKTtcclxuICAgICAgICBjb25zdCBhcHBOYW1lUGFzY2FsQ2FzZSA9IGNoYW5nZUNhc2UucGFzY2FsQ2FzZShwcm9wcy5hcHBOYW1lKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IGJyYW5jaC5cclxuICAgICAgICBjb25zdCBzdGFnZVZhbHVlID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhjb25maWcuc3RhZ2VzKCkhKSkuZ2V0KHN0YWdlKTtcclxuICAgICAgICBpZiAoIXN0YWdlVmFsdWU/LmJyYW5jaCkgdGhyb3cgRXJyb3IoYEpvbXB4OiBicmFuY2ggbm90IGZvdW5kISBCcmFuY2ggaXMgbWlzc2luZyBmcm9tIGpvbXB4LmNvbmZpZy50cyBzdGFnZSAke3N0YWdlfS5gKTtcclxuICAgICAgICBsZXQgYnJhbmNoID0gc3RhZ2VWYWx1ZS5icmFuY2g7XHJcblxyXG4gICAgICAgIC8vIElmIGJyYW5jaCBpcyByZWdleC5cclxuICAgICAgICBsZXQgYnJhbmNoUmVnZXggPSAnJztcclxuICAgICAgICBpZiAoYnJhbmNoLnN0YXJ0c1dpdGgoJygnKSAmJiBicmFuY2guZW5kc1dpdGgoJyknKSkge1xyXG4gICAgICAgICAgICBicmFuY2hSZWdleCA9IGJyYW5jaDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBwaXBlbGluZS5cclxuICAgICAgICB0aGlzLm91dHB1dHMucGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsIGBBcHBDb2RlUGlwZWxpbmUke3N0YWdlTmFtZVBhc2NhbENhc2V9JHthcHBOYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogYGFwcC1waXBlbGluZS0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9YFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBEZWZpbmUgcGlwZWxpbmUgc291cmNlQWN0aW9uLiBJZiBicmFuY2ggaXMgcmVnZXggdGhlbiBzb3VyY2UgaXMgUzMgZWxzZSBHaXRIdWIuXHJcbiAgICAgICAgbGV0IHNvdXJjZUFjdGlvbjogY2RrLmF3c19jb2RlcGlwZWxpbmVfYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24gfCBjZGsuYXdzX2NvZGVwaXBlbGluZV9hY3Rpb25zLlMzU291cmNlQWN0aW9uO1xyXG4gICAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcclxuXHJcbiAgICAgICAgaWYgKGJyYW5jaFJlZ2V4KSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBicmFuY2hGaWxlTmFtZSA9IGBicmFuY2gtJHtwcm9wcy5hcHBOYW1lfS56aXBgO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGdpdGh1YiBzb3VyY2UgKHNhbmRib3ggZmVhdHVyZSBicmFuY2gpLlxyXG4gICAgICAgICAgICBjb25zdCBnaXRIdWJCcmFuY2hTb3VyY2UgPSBjb2RlYnVpbGRcclxuICAgICAgICAgICAgICAgIC5Tb3VyY2UuZ2l0SHViKHtcclxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcHJvcHMuZ2l0SHViLm93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcG86IHByb3BzLmdpdEh1Yi5yZXBvLFxyXG4gICAgICAgICAgICAgICAgICAgIGZldGNoU3VibW9kdWxlczogdHJ1ZSwgLy8gRm9yIGFsbCBHaXQgc291cmNlcywgeW91IGNhbiBmZXRjaCBzdWJtb2R1bGVzIHdoaWxlIGNsb2luZyBnaXQgcmVwby5cclxuICAgICAgICAgICAgICAgICAgICB3ZWJob29rOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdlYmhvb2tGaWx0ZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVidWlsZC5GaWx0ZXJHcm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmRCcmFuY2hJc05vdCgnbWFpbicpIC8vIEZvciBhZGRpdGlvbmFsIHByb3RlY3Rpb24gb25seS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmRCcmFuY2hJcyhgLioke2JyYW5jaFJlZ2V4fS4qYCkgLy8gZS5nLiBhdXRob3Itc2FuZGJveDEtbXktZmVhdHVyZSwgdGVzdCA9IGF1dGhvci10ZXN0LW15LWZlYXR1cmVcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBidWlsZCBwcm9qZWN0ICh0byBjb3B5IGZlYXR1cmUgYnJhbmNoIGZpbGVzIHRvIFMzIG9uIGdpdGh1YiBwdXNoKS5cclxuICAgICAgICAgICAgY29uc3QgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCBgR2l0aHViQ29kZUJ1aWxkUHJvamVjdCR7c3RhZ2VOYW1lUGFzY2FsQ2FzZX0ke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgIHByb2plY3ROYW1lOiBgY29weS1naXRodWItJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfS1icmFuY2gtdG8tczNgLFxyXG4gICAgICAgICAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IDAuMixcclxuICAgICAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6ICcqKi8qJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBnaXRIdWJCcmFuY2hTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IGNvZGVidWlsZC5BcnRpZmFjdHMuczMoe1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldDogcHJvcHMucGlwZWxpbmVnQnVja2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIGluY2x1ZGVCdWlsZElkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBwYWNrYWdlWmlwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdHaXRodWJBcnRpZmFjdCdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29kZUJ1aWxkIHByb2plY3QgcmVxdWlyZXMgcGVybWlzc2lvbnMgdG8gUzMgYnVja2V0IG9iamVjdHMuXHJcbiAgICAgICAgICAgIGdpdGh1YkNvZGVCdWlsZFByb2plY3QuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnczM6TGlzdEJ1Y2tldCcsICdzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0JywgJ3MzOkRlbGV0ZU9iamVjdCddLFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMucGlwZWxpbmVnQnVja2V0LmJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgICAgICBgJHtwcm9wcy5waXBlbGluZWdCdWNrZXQuYnVja2V0QXJufS8qYFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgUzMgc291cmNlIGFjdGlvbi5cclxuICAgICAgICAgICAgc291cmNlQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZUFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogYHMzLXNvdXJjZS1hY3Rpb24tJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBidWNrZXQ6IHByb3BzLnBpcGVsaW5lZ0J1Y2tldCxcclxuICAgICAgICAgICAgICAgIGJ1Y2tldEtleTogYnJhbmNoRmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBHaXRIdWIgc291cmNlIGFjdGlvbi5cclxuICAgICAgICAgICAgc291cmNlQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZUFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6IGBnaXRodWItc291cmNlLWFjdGlvbi0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgICAgIG93bmVyOiBwcm9wcy5naXRIdWIub3duZXIsXHJcbiAgICAgICAgICAgICAgICByZXBvOiBwcm9wcy5naXRIdWIucmVwbyxcclxuICAgICAgICAgICAgICAgIG9hdXRoVG9rZW46IHByb3BzLmdpdEh1Yi50b2tlbixcclxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxyXG4gICAgICAgICAgICAgICAgYnJhbmNoOiBicmFuY2hcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQaXBlbGluZSBTdGFnZSAxOiBTZXQgcGlwZWxpbmUgc291cmNlIHRvIEdpdEh1YiAoc291cmNlIGFjdGlvbikuXHJcbiAgICAgICAgdGhpcy5vdXRwdXRzLnBpcGVsaW5lLmFkZFN0YWdlKHtcclxuICAgICAgICAgICAgc3RhZ2VOYW1lOiBgcGlwZWxpbmUtc291cmNlLSR7c3RhZ2V9LSR7cHJvcHMuYXBwTmFtZX1gLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiBbc291cmNlQWN0aW9uXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBVc2UgcHJvcCBpZiBleGlzdHMsIGVsc2UgZGVmYXVsdCB0byBzbWFsbC5cclxuICAgICAgICBjb25zdCBidWlsZEVudmlyb25tZW50ID0gcHJvcHMuYnVpbGRFbnZpcm9ubWVudCA/PyB7XHJcbiAgICAgICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuQU1BWk9OX0xJTlVYXzJfMyxcclxuICAgICAgICAgICAgY29tcHV0ZVR5cGU6IGNvZGVidWlsZC5Db21wdXRlVHlwZS5TTUFMTFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBjb2RlIGJ1aWxkIHBpcGVsaW5lIChjb21tYW5kcyB0byBidWlsZCBhcHAgY29kZSkuXHJcbiAgICAgICAgY29uc3QgY29kZWJ1aWxkUGlwZWxpbmUgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdCh0aGlzLCBgQ29kZUJ1aWxkJHtzdGFnZU5hbWVQYXNjYWxDYXNlfSR7YXBwTmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICBwcm9qZWN0TmFtZTogYGFwcC1jb2RlLWJ1aWxkLSR7cHJvcHMuYXBwTmFtZX1gLFxyXG4gICAgICAgICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdChwcm9wcy5jb2RlYnVpbGRCdWlsZFNwZWNPYmplY3QpLFxyXG4gICAgICAgICAgICBlbnZpcm9ubWVudDogYnVpbGRFbnZpcm9ubWVudFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBDb2RlIGJ1aWxkIHBpcGVsaW5lIHJlcXVpcmVzIHBlcm1pc3Npb25zIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiB0aGUgYXBwIFMzIGJ1Y2tldC5cclxuICAgICAgICAvLyBlLmcuIFN5bmMgZmlsZXMsIGNvcHkgZmlsZXMsIGRlbGV0ZSBmaWxlcy5cclxuICAgICAgICBjb2RlYnVpbGRQaXBlbGluZS5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IFsnczM6TGlzdEJ1Y2tldCcsICdzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0JywgJ3MzOkRlbGV0ZU9iamVjdCddLFxyXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICAgICAgICAgIHByb3BzLmhvc3RpbmdCdWNrZXQuYnVja2V0QXJuLFxyXG4gICAgICAgICAgICAgICAgYCR7cHJvcHMuaG9zdGluZ0J1Y2tldC5idWNrZXRBcm59LypgXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBjb2RlIHBpcGxpbmUgYnVpbGQgYWN0aW9uICh3aXRoIEdpdEh1YiBzb3VyY2UgYXMgaW5wdXQpLlxyXG4gICAgICAgIGNvbnN0IGNvZGVCdWlsZEFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVBY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6IGBjb2RlLWJ1aWxkLWFjdGlvbi0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcclxuICAgICAgICAgICAgcHJvamVjdDogY29kZWJ1aWxkUGlwZWxpbmVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHBpcGVsaW5lIHN0YWdlID0gYnVpbGQuXHJcbiAgICAgICAgLy8gUGlwZWxpbmUgU3RhZ2UgMjogU2V0IGFjdGlvbiB0byBidWlsZCAoYXBwIGNvZGUpLlxyXG4gICAgICAgIHRoaXMub3V0cHV0cy5waXBlbGluZS5hZGRTdGFnZSh7XHJcbiAgICAgICAgICAgIHN0YWdlTmFtZTogYGFwcC1idWlsZC0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgYWN0aW9uczogW2NvZGVCdWlsZEFjdGlvbl1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gY29uc3Qgd2FpdEZvckNka1N0YWdlID0gdGhpcy5vdXRwdXRzLnBpcGVsaW5lLmFkZFN0YWdlKHtcclxuICAgICAgICAvLyAgICAgc3RhZ2VOYW1lOiAnd2FpdEZvckNka1N0YWdlJyxcclxuICAgICAgICAvLyAgICAgdHJhbnNpdGlvblRvRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgLy8gICAgIHRyYW5zaXRpb25EaXNhYmxlZFJlYXNvbjogJ01hbnVhbCB0cmFuc2l0aW9uIG9ubHknXHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICB9XHJcbn1cclxuIl19