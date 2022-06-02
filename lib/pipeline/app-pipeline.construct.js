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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZS9hcHAtcGlwZWxpbmUuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHVEQUF1RDtBQUN2RCw2REFBNkQ7QUFDN0QsNEVBQTRFO0FBQzVFLDJDQUEyQztBQUczQyw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw2Q0FBMEM7QUE0QjFDLE1BQWEsV0FBWSxTQUFRLHNCQUFTO0lBS3RDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7O1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFMZCx5QkFBb0IsR0FBMkIsRUFBRSxDQUFDO1FBRWxELFlBQU8sR0FBd0IsRUFBeUIsQ0FBQztRQUs1RCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6RCxNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRS9ELGNBQWM7UUFDZCxNQUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hFLElBQUksRUFBQyxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsTUFBTSxDQUFBO1lBQUUsTUFBTSxLQUFLLENBQUMseUVBQXlFLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDeEgsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztRQUUvQixzQkFBc0I7UUFDdEIsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2hELFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDeEI7UUFFRCxtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxrQkFBa0IsbUJBQW1CLEdBQUcsaUJBQWlCLEVBQUUsRUFBRTtZQUNqSCxZQUFZLEVBQUUsZ0JBQWdCLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1NBQ3pELENBQUMsQ0FBQztRQUVILGtGQUFrRjtRQUNsRixJQUFJLFlBQTJHLENBQUM7UUFDaEgsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFakQsSUFBSSxXQUFXLEVBQUU7WUFFYixNQUFNLGNBQWMsR0FBRyxVQUFVLEtBQUssQ0FBQyxPQUFPLE1BQU0sQ0FBQztZQUVyRCxpREFBaUQ7WUFDakQsTUFBTSxrQkFBa0IsR0FBRyxTQUFTO2lCQUMvQixNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNYLEtBQUssRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUs7Z0JBQ3pCLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUk7Z0JBQ3ZCLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixPQUFPLEVBQUUsSUFBSTtnQkFDYixjQUFjLEVBQUU7b0JBQ1osU0FBUyxDQUFDLFdBQVc7eUJBQ2hCLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQzt5QkFDckMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGtDQUFrQzt5QkFDekQsV0FBVyxDQUFDLEtBQUssV0FBVyxJQUFJLENBQUMsQ0FBQyxpRUFBaUU7aUJBQzNHO2FBQ0osQ0FBQyxDQUFDO1lBRVAsNEVBQTRFO1lBQzVFLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSx5QkFBeUIsbUJBQW1CLEdBQUcsaUJBQWlCLEVBQUUsRUFBRTtnQkFDM0gsV0FBVyxFQUFFLGVBQWUsS0FBSyxJQUFJLEtBQUssQ0FBQyxPQUFPLGVBQWU7Z0JBQ2pFLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztvQkFDdEMsT0FBTyxFQUFFLEdBQUc7b0JBQ1osU0FBUyxFQUFFO3dCQUNQLEtBQUssRUFBRSxNQUFNO3FCQUNoQjtpQkFDSixDQUFDO2dCQUNGLE1BQU0sRUFBRSxrQkFBa0I7Z0JBQzFCLFNBQVMsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztvQkFDOUIsSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLE1BQU0sRUFBRSxLQUFLLENBQUMsZUFBZTtvQkFDN0IsY0FBYyxFQUFFLEtBQUs7b0JBQ3JCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixVQUFVLEVBQUUsZ0JBQWdCO2lCQUMvQixDQUFDO2FBQ0wsQ0FBQyxDQUFDO1lBRUgsK0RBQStEO1lBQy9ELHNCQUFzQixDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7Z0JBQzNELE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7Z0JBQ3hCLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixDQUFDO2dCQUM3RSxTQUFTLEVBQUU7b0JBQ1AsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUFTO29CQUMvQixHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsU0FBUyxJQUFJO2lCQUN6QzthQUNKLENBQUMsQ0FBQyxDQUFDO1lBRUosMkJBQTJCO1lBQzNCLFlBQVksR0FBRyxJQUFJLG1CQUFtQixDQUFDLGNBQWMsQ0FBQztnQkFDbEQsVUFBVSxFQUFFLG9CQUFvQixLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtnQkFDeEQsTUFBTSxFQUFFLEtBQUssQ0FBQyxlQUFlO2dCQUM3QixTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLFlBQVk7YUFDdkIsQ0FBQyxDQUFDO1NBRU47YUFBTTtZQUVILCtCQUErQjtZQUMvQixZQUFZLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQztnQkFDdEQsVUFBVSxFQUFFLHdCQUF3QixLQUFLLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtnQkFDNUQsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztnQkFDekIsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSTtnQkFDdkIsVUFBVSxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSztnQkFDOUIsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLE1BQU0sRUFBRSxNQUFNO2FBQ2pCLENBQUMsQ0FBQztTQUNOO1FBRUQsbUVBQW1FO1FBQ25FLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUMzQixTQUFTLEVBQUUsbUJBQW1CLEtBQUssSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ3RELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUMxQixDQUFDLENBQUM7UUFFSCw2Q0FBNkM7UUFDN0MsTUFBTSxnQkFBZ0IsU0FBRyxLQUFLLENBQUMsZ0JBQWdCLG1DQUFJO1lBQy9DLFVBQVUsRUFBRSxTQUFTLENBQUMsZUFBZSxDQUFDLGdCQUFnQjtZQUN0RCxXQUFXLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQyxLQUFLO1NBQzNDLENBQUM7UUFFRiwyREFBMkQ7UUFDM0QsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFlBQVksbUJBQW1CLEdBQUcsaUJBQWlCLEVBQUUsRUFBRTtZQUNqSCxXQUFXLEVBQUUsa0JBQWtCLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDOUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztZQUN6RSxXQUFXLEVBQUUsZ0JBQWdCO1NBQ2hDLENBQUMsQ0FBQztRQUVILHVGQUF1RjtRQUN2Riw2Q0FBNkM7UUFDN0MsaUJBQWlCLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN0RCxNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLO1lBQ3hCLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixDQUFDO1lBQzdFLFNBQVMsRUFBRTtnQkFDUCxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVM7Z0JBQzdCLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxTQUFTLElBQUk7YUFDdkM7U0FDSixDQUFDLENBQUMsQ0FBQztRQUVKLGtFQUFrRTtRQUNsRSxNQUFNLGVBQWUsR0FBRyxJQUFJLG1CQUFtQixDQUFDLGVBQWUsQ0FBQztZQUM1RCxVQUFVLEVBQUUscUJBQXFCLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDaEQsS0FBSyxFQUFFLFlBQVk7WUFDbkIsT0FBTyxFQUFFLGlCQUFpQjtTQUM3QixDQUFDLENBQUM7UUFFSCw4QkFBOEI7UUFDOUIsb0RBQW9EO1FBQ3BELElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUMzQixTQUFTLEVBQUUsYUFBYSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ3ZDLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztTQUM3QixDQUFDLENBQUM7UUFFSCwyREFBMkQ7UUFDM0Qsb0NBQW9DO1FBQ3BDLGtDQUFrQztRQUNsQyx5REFBeUQ7UUFDekQsTUFBTTtJQUNWLENBQUM7Q0FDSjtBQXhKRCxrQ0F3SkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XHJcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcclxuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lQWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBQaXBlbGluZVByb3BzIHtcclxuICAgIHN0YWdlOiBzdHJpbmc7XHJcbiAgICBhcHBOYW1lOiBzdHJpbmc7XHJcbiAgICBob3N0aW5nQnVja2V0OiBzMy5JQnVja2V0O1xyXG4gICAgcGlwZWxpbmVnQnVja2V0OiBzMy5JQnVja2V0O1xyXG4gICAgZ2l0SHViOiBJQXBwUGlwZWxpbmVHaXRIdWJQcm9wcztcclxuICAgIGNvZGVidWlsZEJ1aWxkU3BlY09iamVjdDogb2JqZWN0O1xyXG4gICAgYnVpbGRFbnZpcm9ubWVudD86IGNkay5hd3NfY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnQ7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFwcFBpcGVsaW5lR2l0SHViUHJvcHMge1xyXG4gICAgb3duZXI6IHN0cmluZztcclxuICAgIHJlcG86IHN0cmluZztcclxuICAgIC8vIE11c3QgdXNlIHNlY3JldCB2YWx1ZSBiZWNhdXNlIEdpdEh1YlNvdXJjZUFjdGlvbiBvYXV0aFRva2VuIGlzIG9mIHR5cGUgY2RrLlNlY3JldFZhbHVlLlxyXG4gICAgdG9rZW46IGNkay5TZWNyZXRWYWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRW52aXJvbm1lbnRQaXBlbGluZSB7XHJcbiAgICBicmFuY2g6IHN0cmluZztcclxuICAgIHBpcGVsaW5lOiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBQaXBlbGluZU91dHB1dHMge1xyXG4gICAgcGlwZWxpbmU6IGNkay5hd3NfY29kZXBpcGVsaW5lLlBpcGVsaW5lO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwUGlwZWxpbmUgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljIGVudmlyb25tZW50UGlwZWxpbmVzOiBJRW52aXJvbm1lbnRQaXBlbGluZVtdID0gW107XHJcblxyXG4gICAgcHVibGljIG91dHB1dHM6IElBcHBQaXBlbGluZU91dHB1dHMgPSB7fSBhcyBJQXBwUGlwZWxpbmVPdXRwdXRzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQXBwUGlwZWxpbmVQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IGNvbmZpZy5zdGFnZSgpO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlTmFtZVBhc2NhbENhc2UgPSBjaGFuZ2VDYXNlLnBhc2NhbENhc2Uoc3RhZ2UpO1xyXG4gICAgICAgIGNvbnN0IGFwcE5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHByb3BzLmFwcE5hbWUpO1xyXG5cclxuICAgICAgICAvLyBHZXQgYnJhbmNoLlxyXG4gICAgICAgIGNvbnN0IHN0YWdlVmFsdWUgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKGNvbmZpZy5zdGFnZXMoKSEpKS5nZXQoc3RhZ2UpO1xyXG4gICAgICAgIGlmICghc3RhZ2VWYWx1ZT8uYnJhbmNoKSB0aHJvdyBFcnJvcihgSm9tcHg6IGJyYW5jaCBub3QgZm91bmQhIEJyYW5jaCBpcyBtaXNzaW5nIGZyb20gam9tcHguY29uZmlnLnRzIHN0YWdlICR7c3RhZ2V9LmApO1xyXG4gICAgICAgIGxldCBicmFuY2ggPSBzdGFnZVZhbHVlLmJyYW5jaDtcclxuXHJcbiAgICAgICAgLy8gSWYgYnJhbmNoIGlzIHJlZ2V4LlxyXG4gICAgICAgIGxldCBicmFuY2hSZWdleCA9ICcnO1xyXG4gICAgICAgIGlmIChicmFuY2guc3RhcnRzV2l0aCgnKCcpICYmIGJyYW5jaC5lbmRzV2l0aCgnKScpKSB7XHJcbiAgICAgICAgICAgIGJyYW5jaFJlZ2V4ID0gYnJhbmNoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIHBpcGVsaW5lLlxyXG4gICAgICAgIHRoaXMub3V0cHV0cy5waXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUodGhpcywgYEFwcENvZGVQaXBlbGluZSR7c3RhZ2VOYW1lUGFzY2FsQ2FzZX0ke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiBgYXBwLXBpcGVsaW5lLSR7c3RhZ2V9LSR7cHJvcHMuYXBwTmFtZX1gXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIERlZmluZSBwaXBlbGluZSBzb3VyY2VBY3Rpb24uIElmIGJyYW5jaCBpcyByZWdleCB0aGVuIHNvdXJjZSBpcyBTMyBlbHNlIEdpdEh1Yi5cclxuICAgICAgICBsZXQgc291cmNlQWN0aW9uOiBjZGsuYXdzX2NvZGVwaXBlbGluZV9hY3Rpb25zLkdpdEh1YlNvdXJjZUFjdGlvbiB8IGNkay5hd3NfY29kZXBpcGVsaW5lX2FjdGlvbnMuUzNTb3VyY2VBY3Rpb247XHJcbiAgICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xyXG5cclxuICAgICAgICBpZiAoYnJhbmNoUmVnZXgpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJyYW5jaEZpbGVOYW1lID0gYGJyYW5jaC0ke3Byb3BzLmFwcE5hbWV9LnppcGA7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgZ2l0aHViIHNvdXJjZSAoc2FuZGJveCBmZWF0dXJlIGJyYW5jaCkuXHJcbiAgICAgICAgICAgIGNvbnN0IGdpdEh1YkJyYW5jaFNvdXJjZSA9IGNvZGVidWlsZFxyXG4gICAgICAgICAgICAgICAgLlNvdXJjZS5naXRIdWIoe1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBwcm9wcy5naXRIdWIub3duZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVwbzogcHJvcHMuZ2l0SHViLnJlcG8sXHJcbiAgICAgICAgICAgICAgICAgICAgZmV0Y2hTdWJtb2R1bGVzOiB0cnVlLCAvLyBGb3IgYWxsIEdpdCBzb3VyY2VzLCB5b3UgY2FuIGZldGNoIHN1Ym1vZHVsZXMgd2hpbGUgY2xvaW5nIGdpdCByZXBvLlxyXG4gICAgICAgICAgICAgICAgICAgIHdlYmhvb2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViaG9va0ZpbHRlcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5FdmVudE9mKGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVVNIKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZEJyYW5jaElzTm90KCdtYWluJykgLy8gRm9yIGFkZGl0aW9uYWwgcHJvdGVjdGlvbiBvbmx5LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZEJyYW5jaElzKGAuKiR7YnJhbmNoUmVnZXh9LipgKSAvLyBlLmcuIGF1dGhvci1zYW5kYm94MS1teS1mZWF0dXJlLCB0ZXN0ID0gYXV0aG9yLXRlc3QtbXktZmVhdHVyZVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGJ1aWxkIHByb2plY3QgKHRvIGNvcHkgZmVhdHVyZSBicmFuY2ggZmlsZXMgdG8gUzMgb24gZ2l0aHViIHB1c2gpLlxyXG4gICAgICAgICAgICBjb25zdCBnaXRodWJDb2RlQnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHRoaXMsIGBHaXRodWJDb2RlQnVpbGRQcm9qZWN0JHtzdGFnZU5hbWVQYXNjYWxDYXNlfSR7YXBwTmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdE5hbWU6IGBjb3B5LWdpdGh1Yi0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9LWJyYW5jaC10by1zM2AsXHJcbiAgICAgICAgICAgICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogMC4yLFxyXG4gICAgICAgICAgICAgICAgICAgIGFydGlmYWN0czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogJyoqLyonXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGdpdEh1YkJyYW5jaFNvdXJjZSxcclxuICAgICAgICAgICAgICAgIGFydGlmYWN0czogY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogYnJhbmNoRmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVja2V0OiBwcm9wcy5waXBlbGluZWdCdWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZUJ1aWxkSWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhY2thZ2VaaXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ0dpdGh1YkFydGlmYWN0J1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDb2RlQnVpbGQgcHJvamVjdCByZXF1aXJlcyBwZXJtaXNzaW9ucyB0byBTMyBidWNrZXQgb2JqZWN0cy5cclxuICAgICAgICAgICAgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdC5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uczogWydzMzpMaXN0QnVja2V0JywgJ3MzOkdldE9iamVjdCcsICdzMzpQdXRPYmplY3QnLCAnczM6RGVsZXRlT2JqZWN0J10sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wcy5waXBlbGluZWdCdWNrZXQuYnVja2V0QXJuLFxyXG4gICAgICAgICAgICAgICAgICAgIGAke3Byb3BzLnBpcGVsaW5lZ0J1Y2tldC5idWNrZXRBcm59LypgXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBTMyBzb3VyY2UgYWN0aW9uLlxyXG4gICAgICAgICAgICBzb3VyY2VBY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lQWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiBgczMtc291cmNlLWFjdGlvbi0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgICAgIGJ1Y2tldDogcHJvcHMucGlwZWxpbmVnQnVja2V0LFxyXG4gICAgICAgICAgICAgICAgYnVja2V0S2V5OiBicmFuY2hGaWxlTmFtZSxcclxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIEdpdEh1YiBzb3VyY2UgYWN0aW9uLlxyXG4gICAgICAgICAgICBzb3VyY2VBY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lQWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24oe1xyXG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogYGdpdGh1Yi1zb3VyY2UtYWN0aW9uLSR7c3RhZ2V9LSR7cHJvcHMuYXBwTmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgb3duZXI6IHByb3BzLmdpdEh1Yi5vd25lcixcclxuICAgICAgICAgICAgICAgIHJlcG86IHByb3BzLmdpdEh1Yi5yZXBvLFxyXG4gICAgICAgICAgICAgICAgb2F1dGhUb2tlbjogcHJvcHMuZ2l0SHViLnRva2VuLFxyXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXHJcbiAgICAgICAgICAgICAgICBicmFuY2g6IGJyYW5jaFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFBpcGVsaW5lIFN0YWdlIDE6IFNldCBwaXBlbGluZSBzb3VyY2UgdG8gR2l0SHViIChzb3VyY2UgYWN0aW9uKS5cclxuICAgICAgICB0aGlzLm91dHB1dHMucGlwZWxpbmUuYWRkU3RhZ2Uoe1xyXG4gICAgICAgICAgICBzdGFnZU5hbWU6IGBwaXBlbGluZS1zb3VyY2UtJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgIGFjdGlvbnM6IFtzb3VyY2VBY3Rpb25dXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIFVzZSBwcm9wIGlmIGV4aXN0cywgZWxzZSBkZWZhdWx0IHRvIHNtYWxsLlxyXG4gICAgICAgIGNvbnN0IGJ1aWxkRW52aXJvbm1lbnQgPSBwcm9wcy5idWlsZEVudmlyb25tZW50ID8/IHtcclxuICAgICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl8zLFxyXG4gICAgICAgICAgICBjb21wdXRlVHlwZTogY29kZWJ1aWxkLkNvbXB1dGVUeXBlLlNNQUxMXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGNvZGUgYnVpbGQgcGlwZWxpbmUgKGNvbW1hbmRzIHRvIGJ1aWxkIGFwcCBjb2RlKS5cclxuICAgICAgICBjb25zdCBjb2RlYnVpbGRQaXBlbGluZSA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHRoaXMsIGBDb2RlQnVpbGQke3N0YWdlTmFtZVBhc2NhbENhc2V9JHthcHBOYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgIHByb2plY3ROYW1lOiBgYXBwLWNvZGUtYnVpbGQtJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHByb3BzLmNvZGVidWlsZEJ1aWxkU3BlY09iamVjdCksXHJcbiAgICAgICAgICAgIGVudmlyb25tZW50OiBidWlsZEVudmlyb25tZW50XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIENvZGUgYnVpbGQgcGlwZWxpbmUgcmVxdWlyZXMgcGVybWlzc2lvbnMgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIHRoZSBhcHAgUzMgYnVja2V0LlxyXG4gICAgICAgIC8vIGUuZy4gU3luYyBmaWxlcywgY29weSBmaWxlcywgZGVsZXRlIGZpbGVzLlxyXG4gICAgICAgIGNvZGVidWlsZFBpcGVsaW5lLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgYWN0aW9uczogWydzMzpMaXN0QnVja2V0JywgJ3MzOkdldE9iamVjdCcsICdzMzpQdXRPYmplY3QnLCAnczM6RGVsZXRlT2JqZWN0J10sXHJcbiAgICAgICAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgICAgICAgICAgcHJvcHMuaG9zdGluZ0J1Y2tldC5idWNrZXRBcm4sXHJcbiAgICAgICAgICAgICAgICBgJHtwcm9wcy5ob3N0aW5nQnVja2V0LmJ1Y2tldEFybn0vKmBcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGNvZGUgcGlwbGluZSBidWlsZCBhY3Rpb24gKHdpdGggR2l0SHViIHNvdXJjZSBhcyBpbnB1dCkuXHJcbiAgICAgICAgY29uc3QgY29kZUJ1aWxkQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZUFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcclxuICAgICAgICAgICAgYWN0aW9uTmFtZTogYGNvZGUtYnVpbGQtYWN0aW9uLSR7cHJvcHMuYXBwTmFtZX1gLFxyXG4gICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxyXG4gICAgICAgICAgICBwcm9qZWN0OiBjb2RlYnVpbGRQaXBlbGluZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBTZXQgcGlwZWxpbmUgc3RhZ2UgPSBidWlsZC5cclxuICAgICAgICAvLyBQaXBlbGluZSBTdGFnZSAyOiBTZXQgYWN0aW9uIHRvIGJ1aWxkIChhcHAgY29kZSkuXHJcbiAgICAgICAgdGhpcy5vdXRwdXRzLnBpcGVsaW5lLmFkZFN0YWdlKHtcclxuICAgICAgICAgICAgc3RhZ2VOYW1lOiBgYXBwLWJ1aWxkLSR7cHJvcHMuYXBwTmFtZX1gLFxyXG4gICAgICAgICAgICBhY3Rpb25zOiBbY29kZUJ1aWxkQWN0aW9uXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBjb25zdCB3YWl0Rm9yQ2RrU3RhZ2UgPSB0aGlzLm91dHB1dHMucGlwZWxpbmUuYWRkU3RhZ2Uoe1xyXG4gICAgICAgIC8vICAgICBzdGFnZU5hbWU6ICd3YWl0Rm9yQ2RrU3RhZ2UnLFxyXG4gICAgICAgIC8vICAgICB0cmFuc2l0aW9uVG9FbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAvLyAgICAgdHJhbnNpdGlvbkRpc2FibGVkUmVhc29uOiAnTWFudWFsIHRyYW5zaXRpb24gb25seSdcclxuICAgICAgICAvLyB9KTtcclxuICAgIH1cclxufVxyXG4iXX0=