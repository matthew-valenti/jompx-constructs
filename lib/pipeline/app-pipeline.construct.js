"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPipeline = void 0;
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
        var _a;
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
        const buildEnvironment = (_a = props.buildEnvironment) !== null && _a !== void 0 ? _a : {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZS9hcHAtcGlwZWxpbmUuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVEQUF1RDtBQUN2RCw2REFBNkQ7QUFDN0QsNEVBQTRFO0FBQzVFLDJDQUEyQztBQUczQyw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw2Q0FBMEM7QUF3QjFDLE1BQWEsV0FBWSxTQUFRLHNCQUFTO0lBS3RDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7O1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFMZCx5QkFBb0IsR0FBMkIsRUFBRSxDQUFDO1FBT3JELE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pELE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFL0QsY0FBYztRQUNkLE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEUsSUFBSSxFQUFDLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxNQUFNLENBQUE7WUFBRSxNQUFNLEtBQUssQ0FBQyx5RUFBeUUsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUN4SCxJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1FBRS9CLHNC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LEVBQUUsZ0JBQWdCO1NBQ2hDLENBQUMsQ0FBQztRQUVILHVGQUF1RjtRQUN2Riw2Q0FBNkM7UUFDN0MsaUJBQWlCLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN0RCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixDQUFDO1lBQzdFLFNBQVMsRUFBRTtnQkFDUCxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVM7Z0JBQzdCLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLElBQUk7YUFDdkM7U0FDSixDQUFDLENBQUMsQ0FBQztRQUVKLGtFQUFrRTtRQUNsRSxNQUFNLGVBQWUsR0FBRyxJQUFJLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztZQUM1RCxVQUFVLEVBQUUscUJBQXFCLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDaEQsS0FBSyxFQUFFLFlBQVk7WUFDbkIsT0FBTyxFQUFFLGlCQUFpQjtTQUM3QixDQUFDLENBQUM7UUFFSCw4QkFBOEI7UUFDOUIsb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ25CLFNBQVMsRUFBRSxhQUFhLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDdkMsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO1NBQzdCLENBQUMsQ0FBQztRQUVILG1EQUFtRDtRQUNuRCxvQ0FBb0M7UUFDcEMsa0NBQWtDO1FBQ2xDLHlEQUF5RDtRQUN6RCxNQUFNO0lBQ1YsQ0FBQztDQUNKO0FBeEpELGtDQXdKQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcclxuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xyXG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVBY3Rpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XHJcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFwcFBpcGVsaW5lUHJvcHMge1xyXG4gICAgc3RhZ2U6IHN0cmluZztcclxuICAgIGFwcE5hbWU6IHN0cmluZztcclxuICAgIGhvc3RpbmdCdWNrZXQ6IHMzLklCdWNrZXQ7XHJcbiAgICBwaXBlbGluZWdCdWNrZXQ6IHMzLklCdWNrZXQ7XHJcbiAgICBnaXRIdWI6IElBcHBQaXBlbGluZUdpdEh1YlByb3BzO1xyXG4gICAgY29kZWJ1aWxkQnVpbGRTcGVjT2JqZWN0OiBvYmplY3Q7XHJcbiAgICBidWlsZEVudmlyb25tZW50PzogY2RrLmF3c19jb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwUGlwZWxpbmVHaXRIdWJQcm9wcyB7XHJcbiAgICBvd25lcjogc3RyaW5nO1xyXG4gICAgcmVwbzogc3RyaW5nO1xyXG4gICAgLy8gTXVzdCB1c2Ugc2VjcmV0IHZhbHVlIGJlY2F1c2UgR2l0SHViU291cmNlQWN0aW9uIG9hdXRoVG9rZW4gaXMgb2YgdHlwZSBjZGsuU2VjcmV0VmFsdWUuXHJcbiAgICB0b2tlbjogY2RrLlNlY3JldFZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnZpcm9ubWVudFBpcGVsaW5lIHtcclxuICAgIGJyYW5jaDogc3RyaW5nO1xyXG4gICAgcGlwZWxpbmU6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBQaXBlbGluZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRQaXBlbGluZXM6IElFbnZpcm9ubWVudFBpcGVsaW5lW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgcGlwZWxpbmU6IGNkay5hd3NfY29kZXBpcGVsaW5lLlBpcGVsaW5lIHwgdW5kZWZpbmVkO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQXBwUGlwZWxpbmVQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IGNvbmZpZy5zdGFnZSgpO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlTmFtZVBhc2NhbENhc2UgPSBjaGFuZ2VDYXNlLnBhc2NhbENhc2Uoc3RhZ2UpO1xyXG4gICAgICAgIGNvbnN0IGFwcE5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHByb3BzLmFwcE5hbWUpO1xyXG5cclxuICAgICAgICAvLyBHZXQgYnJhbmNoLlxyXG4gICAgICAgIGNvbnN0IHN0YWdlVmFsdWUgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKGNvbmZpZy5zdGFnZXMoKSEpKS5nZXQoc3RhZ2UpO1xyXG4gICAgICAgIGlmICghc3RhZ2VWYWx1ZT8uYnJhbmNoKSB0aHJvdyBFcnJvcihgSm9tcHg6IGJyYW5jaCBub3QgZm91bmQhIEJyYW5jaCBpcyBtaXNzaW5nIGZyb20gam9tcHguY29uZmlnLnRzIHN0YWdlICR7c3RhZ2V9LmApO1xyXG4gICAgICAgIGxldCBicmFuY2ggPSBzdGFnZVZhbHVlLmJyYW5jaDtcclxuXHJcbiAgICAgICAgLy8gSWYgYnJhbmNoIGlzIHJlZ2V4LlxyXG4gICAgICAgIGxldCBicmFuY2hSZWdleCA9ICcnO1xyXG4gICAgICAgIGlmIChicmFuY2guc3RhcnRzV2l0aCgnKCcpICYmIGJyYW5jaC5lbmRzV2l0aCgnKScpKSB7XHJcbiAgICAgICAgICAgIGJyYW5jaFJlZ2V4ID0gYnJhbmNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHBpcGVsaW5lLlxyXG4gICAgICAgIHRoaXMucGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsIGBBcHBDb2RlUGlwZWxpbmUke3N0YWdlTmFtZVBhc2NhbENhc2V9JHthcHBOYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogYGFwcC1waXBlbGluZS0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9YFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBEZWZpbmUgcGlwZWxpbmUgc291cmNlQWN0aW9uLiBJZiBicmFuY2ggaXMgcmVnZXggdGhlbiBzb3VyY2UgaXMgUzMgZWxzZSBHaXRIdWIuXHJcbiAgICAgICAgbGV0IHNvdXJjZUFjdGlvbjogY2RrLmF3c19jb2RlcGlwZWxpbmVfYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24gfCBjZGsuYXdzX2NvZGVwaXBlbGluZV9hY3Rpb25zLlMzU291cmNlQWN0aW9uO1xyXG4gICAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcclxuXHJcbiAgICAgICAgaWYgKGJyYW5jaFJlZ2V4KSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBicmFuY2hGaWxlTmFtZSA9IGBicmFuY2gtJHtwcm9wcy5hcHBOYW1lfS56aXBgO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGdpdGh1YiBzb3VyY2UgKHNhbmRib3ggZmVhdHVyZSBicmFuY2gpLlxyXG4gICAgICAgICAgICBjb25zdCBnaXRIdWJCcmFuY2hTb3VyY2UgPSBjb2RlYnVpbGRcclxuICAgICAgICAgICAgICAgIC5Tb3VyY2UuZ2l0SHViKHtcclxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcHJvcHMuZ2l0SHViLm93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcG86IHByb3BzLmdpdEh1Yi5yZXBvLFxyXG4gICAgICAgICAgICAgICAgICAgIGZldGNoU3VibW9kdWxlczogdHJ1ZSwgLy8gRm9yIGFsbCBHaXQgc291cmNlcywgeW91IGNhbiBmZXRjaCBzdWJtb2R1bGVzIHdoaWxlIGNsb2luZyBnaXQgcmVwby5cclxuICAgICAgICAgICAgICAgICAgICB3ZWJob29rOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdlYmhvb2tGaWx0ZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVidWlsZC5GaWx0ZXJHcm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmRCcmFuY2hJc05vdCgnbWFpbicpIC8vIEZvciBhZGRpdGlvbmFsIHByb3RlY3Rpb24gb25seS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmRCcmFuY2hJcyhgLioke2JyYW5jaFJlZ2V4fS4qYCkgLy8gZS5nLiBhdXRob3Itc2FuZGJveDEtbXktZmVhdHVyZSwgdGVzdCA9IGF1dGhvci10ZXN0LW15LWZlYXR1cmVcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBidWlsZCBwcm9qZWN0ICh0byBjb3B5IGZlYXR1cmUgYnJhbmNoIGZpbGVzIHRvIFMzIG9uIGdpdGh1YiBwdXNoKS5cclxuICAgICAgICAgICAgY29uc3QgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCBgR2l0aHViQ29kZUJ1aWxkUHJvamVjdCR7c3RhZ2VOYW1lUGFzY2FsQ2FzZX0ke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgIHByb2plY3ROYW1lOiBgY29weS1naXRodWItJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfS1icmFuY2gtdG8tczNgLFxyXG4gICAgICAgICAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IDAuMixcclxuICAgICAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6ICcqKi8qJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBnaXRIdWJCcmFuY2hTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IGNvZGVidWlsZC5BcnRpZmFjdHMuczMoe1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldDogcHJvcHMucGlwZWxpbmVnQnVja2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIGluY2x1ZGVCdWlsZElkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBwYWNrYWdlWmlwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdHaXRodWJBcnRpZmFjdCdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29kZUJ1aWxkIHByb2plY3QgcmVxdWlyZXMgcGVybWlzc2lvbnMgdG8gUzMgYnVja2V0IG9iamVjdHMuXHJcbiAgICAgICAgICAgIGdpdGh1YkNvZGVCdWlsZFByb2plY3QuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnczM6TGlzdEJ1Y2tldCcsICdzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0JywgJ3MzOkRlbGV0ZU9iamVjdCddLFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcHMucGlwZWxpbmVnQnVja2V0LmJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgICAgICBgJHtwcm9wcy5waXBlbGluZWdCdWNrZXQuYnVja2V0QXJufS8qYFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgUzMgc291cmNlIGFjdGlvbi5cclxuICAgICAgICAgICAgc291cmNlQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZUFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogYHMzLXNvdXJjZS1hY3Rpb24tJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBidWNrZXQ6IHByb3BzLnBpcGVsaW5lZ0J1Y2tldCxcclxuICAgICAgICAgICAgICAgIGJ1Y2tldEtleTogYnJhbmNoRmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBHaXRIdWIgc291cmNlIGFjdGlvbi5cclxuICAgICAgICAgICAgc291cmNlQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZUFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6IGBnaXRodWItc291cmNlLWFjdGlvbi0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgICAgIG93bmVyOiBwcm9wcy5naXRIdWIub3duZXIsXHJcbiAgICAgICAgICAgICAgICByZXBvOiBwcm9wcy5naXRIdWIucmVwbyxcclxuICAgICAgICAgICAgICAgIG9hdXRoVG9rZW46IHByb3BzLmdpdEh1Yi50b2tlbixcclxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxyXG4gICAgICAgICAgICAgICAgYnJhbmNoOiBicmFuY2hcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQaXBlbGluZSBTdGFnZSAxOiBTZXQgcGlwZWxpbmUgc291cmNlIHRvIEdpdEh1YiAoc291cmNlIGFjdGlvbikuXHJcbiAgICAgICAgdGhpcy5waXBlbGluZS5hZGRTdGFnZSh7XHJcbiAgICAgICAgICAgIHN0YWdlTmFtZTogYHBpcGVsaW5lLXNvdXJjZS0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gVXNlIHByb3AgaWYgZXhpc3RzLCBlbHNlIGRlZmF1bHQgdG8gc21hbGwuXHJcbiAgICAgICAgY29uc3QgYnVpbGRFbnZpcm9ubWVudCA9IHByb3BzLmJ1aWxkRW52aXJvbm1lbnQgPz8ge1xyXG4gICAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yXzMsXHJcbiAgICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuU01BTExcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgY29kZSBidWlsZCBwaXBlbGluZSAoY29tbWFuZHMgdG8gYnVpbGQgYXBwIGNvZGUpLlxyXG4gICAgICAgIGNvbnN0IGNvZGVidWlsZFBpcGVsaW5lID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QodGhpcywgYENvZGVCdWlsZCR7c3RhZ2VOYW1lUGFzY2FsQ2FzZX0ke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgcHJvamVjdE5hbWU6IGBhcHAtY29kZS1idWlsZC0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3QocHJvcHMuY29kZWJ1aWxkQnVpbGRTcGVjT2JqZWN0KSxcclxuICAgICAgICAgICAgZW52aXJvbm1lbnQ6IGJ1aWxkRW52aXJvbm1lbnRcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQ29kZSBidWlsZCBwaXBlbGluZSByZXF1aXJlcyBwZXJtaXNzaW9ucyB0byBwZXJmb3JtIG9wZXJhdGlvbnMgb24gdGhlIGFwcCBTMyBidWNrZXQuXHJcbiAgICAgICAgLy8gZS5nLiBTeW5jIGZpbGVzLCBjb3B5IGZpbGVzLCBkZWxldGUgZmlsZXMuXHJcbiAgICAgICAgY29kZWJ1aWxkUGlwZWxpbmUuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnLCAnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbXHJcbiAgICAgICAgICAgICAgICBwcm9wcy5ob3N0aW5nQnVja2V0LmJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgIGAke3Byb3BzLmhvc3RpbmdCdWNrZXQuYnVja2V0QXJufS8qYFxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgY29kZSBwaXBsaW5lIGJ1aWxkIGFjdGlvbiAod2l0aCBHaXRIdWIgc291cmNlIGFzIGlucHV0KS5cclxuICAgICAgICBjb25zdCBjb2RlQnVpbGRBY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lQWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBhY3Rpb25OYW1lOiBgY29kZS1idWlsZC1hY3Rpb24tJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXHJcbiAgICAgICAgICAgIHByb2plY3Q6IGNvZGVidWlsZFBpcGVsaW5lXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFNldCBwaXBlbGluZSBzdGFnZSA9IGJ1aWxkLlxyXG4gICAgICAgIC8vIFBpcGVsaW5lIFN0YWdlIDI6IFNldCBhY3Rpb24gdG8gYnVpbGQgKGFwcCBjb2RlKS5cclxuICAgICAgICB0aGlzLnBpcGVsaW5lLmFkZFN0YWdlKHtcclxuICAgICAgICAgICAgc3RhZ2VOYW1lOiBgYXBwLWJ1aWxkLSR7cHJvcHMuYXBwTmFtZX1gLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiBbY29kZUJ1aWxkQWN0aW9uXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBjb25zdCB3YWl0Rm9yQ2RrU3RhZ2UgPSB0aGlzLnBpcGVsaW5lLmFkZFN0YWdlKHtcclxuICAgICAgICAvLyAgICAgc3RhZ2VOYW1lOiAnd2FpdEZvckNka1N0YWdlJyxcclxuICAgICAgICAvLyAgICAgdHJhbnNpdGlvblRvRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgLy8gICAgIHRyYW5zaXRpb25EaXNhYmxlZFJlYXNvbjogJ01hbnVhbCB0cmFuc2l0aW9uIG9ubHknXHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICB9XHJcbn1cclxuIl19