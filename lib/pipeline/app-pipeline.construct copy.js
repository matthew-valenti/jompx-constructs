"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppPipeline = void 0;
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const codepipelineActions = require("aws-cdk-lib/aws-codepipeline-actions");
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
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
        const appNamePascalCase = changeCase.pascalCase(props.appName);
        const stages = new Map(Object.entries(config.stages()));
        // Create bucket to save github sandbox feature branch files (as zip).
        const branchBucket = new s3.Bucket(this, `${config.organizationNamePascalCase()}AppPipelineBranch${appNamePascalCase}`, {
            // Version must be true to use as CodePipeline source.
            versioned: true,
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            // Destroy bucket on stack delete. Bucket contains temporary copy of source control files only.
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            // Delete all bucket objects on bucket/stack destroy.
            autoDeleteObjects: true
        });
        for (const [stage, stageValue] of stages.entries()) {
            const stageNamePascalCase = changeCase.pascalCase(stage);
            // Get branch.
            if (!(stageValue === null || stageValue === void 0 ? void 0 : stageValue.branch))
                throw Error(`Jompx: branch not found! Branch is missing from jompx.config.ts stage ${stage}.`);
            let branch = stageValue.branch;
            // If branch is regex.
            let branchRegex = '';
            if (!branch.startsWith(')') && !branch.endsWith(')')) {
                branchRegex = branch;
                branch = branchRegex.slice(1, -1); // Remove parenthesis first and last char.
            }
            // Create pipeline.
            this.outputs.pipeline = new codepipeline.Pipeline(this, `AppCodePipeline${stageNamePascalCase}${appNamePascalCase}`, {
                pipelineName: `app-pipeline-${stage}-${props.appName}`
            });
            // Define pipeline sourceAction. If branch is regex then source is S3 else GitHub.
            let sourceAction;
            const sourceOutput = new codepipeline.Artifact();
            if (branchRegex) {
                const branchFileName = `branch-${stage}-${props.appName}.zip`;
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
                        bucket: branchBucket,
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
                        branchBucket.bucketArn,
                        `${branchBucket.bucketArn}/*`
                    ]
                }));
                // Create S3 source action.
                sourceAction = new codepipelineActions.S3SourceAction({
                    actionName: `s3-source-action-${stage}-${props.appName}`,
                    bucket: branchBucket,
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
                    oauthToken: cdk.SecretValue.secretsManager('cicd/github/token'),
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
                projectName: `apps-code-build-${props.appName}`,
                buildSpec: codebuild.BuildSpec.fromObject(props.codebuildBuildSpecObject),
                environment: buildEnvironment
            });
            const bucketArn = stage === 'prod' ? `arn:aws:s3:::${props.appName}.${props.domainName}` : `arn:aws:s3:::${props.appName}.${stage}.${props.domainName}`;
            const environment = config.environmentByName(stage);
            const hostingBucket = s3.Bucket.fromBucketAttributes(this, `HostingBucket${stageNamePascalCase}${appNamePascalCase}`, {
                bucketArn,
                account: environment === null || environment === void 0 ? void 0 : environment.accountId,
                region: environment === null || environment === void 0 ? void 0 : environment.region
            });
            // Code build pipeline requires permissions to perform operations on the app S3 bucket.
            // e.g. Sync files, copy files, delete files.
            codebuildPipeline.addToRolePolicy(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['s3:ListBucket', 's3:GetObject', 's3:PutObject', 's3:DeleteObject'],
                resources: [
                    hostingBucket.bucketArn,
                    `${hostingBucket.bucketArn}/*`
                ]
            }));
            // Create code pipline build action (with GitHub source as input).
            const codeBuildAction = new codepipelineActions.CodeBuildAction({
                actionName: `app-code-build-action-${props.appName}`,
                input: sourceOutput,
                project: codebuildPipeline
            });
            // Set pipeline stage = build.
            // Pipeline Stage 2: Set action to build (app code).
            this.outputs.pipeline.addStage({
                stageName: `apps-build-${props.appName}`,
                actions: [codeBuildAction]
            });
            // const waitForCdkStage = this.outputs.pipeline.addStage({
            //     stageName: 'waitForCdkStage',
            //     transitionToEnabled: false,
            //     transitionDisabledReason: 'Manual transition only'
            // });
        }
        ;
    }
}
exports.AppPipeline = AppPipeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLmNvbnN0cnVjdCBjb3B5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BpcGVsaW5lL2FwcC1waXBlbGluZS5jb25zdHJ1Y3QgY29weS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBQ3ZELDZEQUE2RDtBQUM3RCw0RUFBNEU7QUFDNUUsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUV6Qyw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw2Q0FBMEM7QUEyQjFDLE1BQWEsV0FBWSxTQUFRLHNCQUFTO0lBS3RDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7O1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFMZCx5QkFBb0IsR0FBMkIsRUFBRSxDQUFDO1FBRWxELFlBQU8sR0FBd0IsRUFBeUIsQ0FBQztRQUs1RCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUvRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUcsQ0FBQyxDQUFDLENBQUM7UUFFekQsc0VBQXNFO1FBQ3RFLE1BQU0sWUFBWSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsMEJBQTBCLEVBQUUsb0JBQW9CLGlCQUFpQixFQUFFLEVBQUU7WUFDcEgsc0RBQXNEO1lBQ3RELFNBQVMsRUFBRSxJQUFJO1lBQ2YsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixpQkFBaUIsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUztZQUNqRCxV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bXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XHJcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcclxuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lQWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBQaXBlbGluZVByb3BzIHtcclxuICAgIHN0YWdlOiBzdHJpbmc7XHJcbiAgICBhcHBOYW1lOiBzdHJpbmc7XHJcbiAgICBkb21haW5OYW1lOiBzdHJpbmc7XHJcbiAgICBnaXRIdWI6IElBcHBQaXBlbGluZUdpdEh1YlByb3BzO1xyXG4gICAgY29kZWJ1aWxkQnVpbGRTcGVjT2JqZWN0OiBvYmplY3Q7XHJcbiAgICBidWlsZEVudmlyb25tZW50PzogY2RrLmF3c19jb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudDtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwUGlwZWxpbmVHaXRIdWJQcm9wcyB7XHJcbiAgICBvd25lcjogc3RyaW5nO1xyXG4gICAgcmVwbzogc3RyaW5nO1xyXG4gICAgLy8gTXVzdCB1c2Ugc2VjcmV0IHZhbHVlIGJlY2F1c2UgR2l0SHViU291cmNlQWN0aW9uIG9hdXRoVG9rZW4gaXMgb2YgdHlwZSBjZGsuU2VjcmV0VmFsdWUuXHJcbiAgICB0b2tlbjogY2RrLlNlY3JldFZhbHVlO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnZpcm9ubWVudFBpcGVsaW5lIHtcclxuICAgIGJyYW5jaDogc3RyaW5nO1xyXG4gICAgcGlwZWxpbmU6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFwcFBpcGVsaW5lT3V0cHV0cyB7XHJcbiAgICBwaXBlbGluZTogY2RrLmF3c19jb2RlcGlwZWxpbmUuUGlwZWxpbmU7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBQaXBlbGluZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRQaXBlbGluZXM6IElFbnZpcm9ubWVudFBpcGVsaW5lW10gPSBbXTtcclxuXHJcbiAgICBwdWJsaWMgb3V0cHV0czogSUFwcFBpcGVsaW5lT3V0cHV0cyA9IHt9IGFzIElBcHBQaXBlbGluZU91dHB1dHM7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElBcHBQaXBlbGluZVByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IENvbmZpZyh0aGlzLm5vZGUpO1xyXG4gICAgICAgIGNvbnN0IGFwcE5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHByb3BzLmFwcE5hbWUpO1xyXG5cclxuICAgICAgICBjb25zdCBzdGFnZXMgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKGNvbmZpZy5zdGFnZXMoKSEpKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGJ1Y2tldCB0byBzYXZlIGdpdGh1YiBzYW5kYm94IGZlYXR1cmUgYnJhbmNoIGZpbGVzIChhcyB6aXApLlxyXG4gICAgICAgIGNvbnN0IGJyYW5jaEJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgYCR7Y29uZmlnLm9yZ2FuaXphdGlvbk5hbWVQYXNjYWxDYXNlKCl9QXBwUGlwZWxpbmVCcmFuY2gke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgLy8gVmVyc2lvbiBtdXN0IGJlIHRydWUgdG8gdXNlIGFzIENvZGVQaXBlbGluZSBzb3VyY2UuXHJcbiAgICAgICAgICAgIHZlcnNpb25lZDogdHJ1ZSxcclxuICAgICAgICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsIC8vIFRPRE86IElzIHRoaXMgbmVlZGVkP1xyXG4gICAgICAgICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxyXG4gICAgICAgICAgICBlbmZvcmNlU1NMOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBEZXN0cm95IGJ1Y2tldCBvbiBzdGFjayBkZWxldGUuIEJ1Y2tldCBjb250YWlucyB0ZW1wb3JhcnkgY29weSBvZiBzb3VyY2UgY29udHJvbCBmaWxlcyBvbmx5LlxyXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG4gICAgICAgICAgICAvLyBEZWxldGUgYWxsIGJ1Y2tldCBvYmplY3RzIG9uIGJ1Y2tldC9zdGFjayBkZXN0cm95LlxyXG4gICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IFtzdGFnZSwgc3RhZ2VWYWx1ZV0gb2Ygc3RhZ2VzLmVudHJpZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3RhZ2VOYW1lUGFzY2FsQ2FzZSA9IGNoYW5nZUNhc2UucGFzY2FsQ2FzZShzdGFnZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBHZXQgYnJhbmNoLlxyXG4gICAgICAgICAgICBpZiAoIXN0YWdlVmFsdWU/LmJyYW5jaCkgdGhyb3cgRXJyb3IoYEpvbXB4OiBicmFuY2ggbm90IGZvdW5kISBCcmFuY2ggaXMgbWlzc2luZyBmcm9tIGpvbXB4LmNvbmZpZy50cyBzdGFnZSAke3N0YWdlfS5gKTtcclxuICAgICAgICAgICAgbGV0IGJyYW5jaCA9IHN0YWdlVmFsdWUuYnJhbmNoO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgYnJhbmNoIGlzIHJlZ2V4LlxyXG4gICAgICAgICAgICBsZXQgYnJhbmNoUmVnZXggPSAnJztcclxuICAgICAgICAgICAgaWYgKCFicmFuY2guc3RhcnRzV2l0aCgnKScpICYmICFicmFuY2guZW5kc1dpdGgoJyknKSkge1xyXG4gICAgICAgICAgICAgICAgYnJhbmNoUmVnZXggPSBicmFuY2g7XHJcbiAgICAgICAgICAgICAgICBicmFuY2ggPSBicmFuY2hSZWdleC5zbGljZSgxLCAtMSk7IC8vIFJlbW92ZSBwYXJlbnRoZXNpcyBmaXJzdCBhbmQgbGFzdCBjaGFyLlxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgcGlwZWxpbmUuXHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0cy5waXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUodGhpcywgYEFwcENvZGVQaXBlbGluZSR7c3RhZ2VOYW1lUGFzY2FsQ2FzZX0ke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogYGFwcC1waXBlbGluZS0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9YFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIERlZmluZSBwaXBlbGluZSBzb3VyY2VBY3Rpb24uIElmIGJyYW5jaCBpcyByZWdleCB0aGVuIHNvdXJjZSBpcyBTMyBlbHNlIEdpdEh1Yi5cclxuICAgICAgICAgICAgbGV0IHNvdXJjZUFjdGlvbjogY2RrLmF3c19jb2RlcGlwZWxpbmVfYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24gfCBjZGsuYXdzX2NvZGVwaXBlbGluZV9hY3Rpb25zLlMzU291cmNlQWN0aW9uO1xyXG4gICAgICAgICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYnJhbmNoUmVnZXgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBicmFuY2hGaWxlTmFtZSA9IGBicmFuY2gtJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfS56aXBgO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBnaXRodWIgc291cmNlIChzYW5kYm94IGZlYXR1cmUgYnJhbmNoKS5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGdpdEh1YkJyYW5jaFNvdXJjZSA9IGNvZGVidWlsZFxyXG4gICAgICAgICAgICAgICAgICAgIC5Tb3VyY2UuZ2l0SHViKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXI6IHByb3BzLmdpdEh1Yi5vd25lcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwbzogcHJvcHMuZ2l0SHViLnJlcG8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZldGNoU3VibW9kdWxlczogdHJ1ZSwgLy8gRm9yIGFsbCBHaXQgc291cmNlcywgeW91IGNhbiBmZXRjaCBzdWJtb2R1bGVzIHdoaWxlIGNsb2luZyBnaXQgcmVwby5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2ViaG9vazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2ViaG9va0ZpbHRlcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVidWlsZC5GaWx0ZXJHcm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbkV2ZW50T2YoY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVU0gpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZEJyYW5jaElzTm90KCdtYWluJykgLy8gRm9yIGFkZGl0aW9uYWwgcHJvdGVjdGlvbiBvbmx5LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmRCcmFuY2hJcyhgLioke2JyYW5jaFJlZ2V4fS4qYCkgLy8gZS5nLiBhdXRob3Itc2FuZGJveDEtbXktZmVhdHVyZSwgdGVzdCA9IGF1dGhvci10ZXN0LW15LWZlYXR1cmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBidWlsZCBwcm9qZWN0ICh0byBjb3B5IGZlYXR1cmUgYnJhbmNoIGZpbGVzIHRvIFMzIG9uIGdpdGh1YiBwdXNoKS5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGdpdGh1YkNvZGVCdWlsZFByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgYEdpdGh1YkNvZGVCdWlsZFByb2plY3Qke3N0YWdlTmFtZVBhc2NhbENhc2V9JHthcHBOYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvamVjdE5hbWU6IGBjb3B5LWdpdGh1Yi0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9LWJyYW5jaC10by1zM2AsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFydGlmYWN0czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6ICcqKi8qJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBnaXRIdWJCcmFuY2hTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiBjb2RlYnVpbGQuQXJ0aWZhY3RzLnMzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYnJhbmNoRmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1Y2tldDogYnJhbmNoQnVja2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmNsdWRlQnVpbGRJZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhY2thZ2VaaXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdHaXRodWJBcnRpZmFjdCdcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29kZUJ1aWxkIHByb2plY3QgcmVxdWlyZXMgcGVybWlzc2lvbnMgdG8gUzMgYnVja2V0IG9iamVjdHMuXHJcbiAgICAgICAgICAgICAgICBnaXRodWJDb2RlQnVpbGRQcm9qZWN0LmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnczM6TGlzdEJ1Y2tldCcsICdzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0JywgJ3MzOkRlbGV0ZU9iamVjdCddLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmFuY2hCdWNrZXQuYnVja2V0QXJuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHticmFuY2hCdWNrZXQuYnVja2V0QXJufS8qYFxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgUzMgc291cmNlIGFjdGlvbi5cclxuICAgICAgICAgICAgICAgIHNvdXJjZUFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVBY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiBgczMtc291cmNlLWFjdGlvbi0ke3N0YWdlfS0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICBidWNrZXQ6IGJyYW5jaEJ1Y2tldCxcclxuICAgICAgICAgICAgICAgICAgICBidWNrZXRLZXk6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIEdpdEh1YiBzb3VyY2UgYWN0aW9uLlxyXG4gICAgICAgICAgICAgICAgc291cmNlQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZUFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiBgZ2l0aHViLXNvdXJjZS1hY3Rpb24tJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHByb3BzLmdpdEh1Yi5vd25lcixcclxuICAgICAgICAgICAgICAgICAgICByZXBvOiBwcm9wcy5naXRIdWIucmVwbyxcclxuICAgICAgICAgICAgICAgICAgICBvYXV0aFRva2VuOiBjZGsuU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2NpY2QvZ2l0aHViL3Rva2VuJyksXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXHJcbiAgICAgICAgICAgICAgICAgICAgYnJhbmNoOiBicmFuY2hcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBQaXBlbGluZSBTdGFnZSAxOiBTZXQgcGlwZWxpbmUgc291cmNlIHRvIEdpdEh1YiAoc291cmNlIGFjdGlvbikuXHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0cy5waXBlbGluZS5hZGRTdGFnZSh7XHJcbiAgICAgICAgICAgICAgICBzdGFnZU5hbWU6IGBwaXBlbGluZS1zb3VyY2UtJHtzdGFnZX0tJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBbc291cmNlQWN0aW9uXVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVzZSBwcm9wIGlmIGV4aXN0cywgZWxzZSBkZWZhdWx0IHRvIHNtYWxsLlxyXG4gICAgICAgICAgICBjb25zdCBidWlsZEVudmlyb25tZW50ID0gcHJvcHMuYnVpbGRFbnZpcm9ubWVudCA/PyB7XHJcbiAgICAgICAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yXzMsXHJcbiAgICAgICAgICAgICAgICBjb21wdXRlVHlwZTogY29kZWJ1aWxkLkNvbXB1dGVUeXBlLlNNQUxMXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgY29kZSBidWlsZCBwaXBlbGluZSAoY29tbWFuZHMgdG8gYnVpbGQgYXBwIGNvZGUpLlxyXG4gICAgICAgICAgICBjb25zdCBjb2RlYnVpbGRQaXBlbGluZSA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHRoaXMsIGBDb2RlQnVpbGQke3N0YWdlTmFtZVBhc2NhbENhc2V9JHthcHBOYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogYGFwcHMtY29kZS1idWlsZC0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHByb3BzLmNvZGVidWlsZEJ1aWxkU3BlY09iamVjdCksXHJcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudDogYnVpbGRFbnZpcm9ubWVudFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJ1Y2tldEFybiA9IHN0YWdlID09PSAncHJvZCcgPyBgYXJuOmF3czpzMzo6OiR7cHJvcHMuYXBwTmFtZX0uJHtwcm9wcy5kb21haW5OYW1lfWAgOiBgYXJuOmF3czpzMzo6OiR7cHJvcHMuYXBwTmFtZX0uJHtzdGFnZX0uJHtwcm9wcy5kb21haW5OYW1lfWA7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudmlyb25tZW50ID0gY29uZmlnLmVudmlyb25tZW50QnlOYW1lKHN0YWdlKTtcclxuICAgICAgICAgICAgY29uc3QgaG9zdGluZ0J1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0QXR0cmlidXRlcyh0aGlzLCBgSG9zdGluZ0J1Y2tldCR7c3RhZ2VOYW1lUGFzY2FsQ2FzZX0ke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgIGJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgIGFjY291bnQ6IGVudmlyb25tZW50Py5hY2NvdW50SWQsXHJcbiAgICAgICAgICAgICAgICByZWdpb246IGVudmlyb25tZW50Py5yZWdpb25cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDb2RlIGJ1aWxkIHBpcGVsaW5lIHJlcXVpcmVzIHBlcm1pc3Npb25zIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiB0aGUgYXBwIFMzIGJ1Y2tldC5cclxuICAgICAgICAgICAgLy8gZS5nLiBTeW5jIGZpbGVzLCBjb3B5IGZpbGVzLCBkZWxldGUgZmlsZXMuXHJcbiAgICAgICAgICAgIGNvZGVidWlsZFBpcGVsaW5lLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnLCAnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuICAgICAgICAgICAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIGhvc3RpbmdCdWNrZXQuYnVja2V0QXJuLFxyXG4gICAgICAgICAgICAgICAgICAgIGAke2hvc3RpbmdCdWNrZXQuYnVja2V0QXJufS8qYFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgY29kZSBwaXBsaW5lIGJ1aWxkIGFjdGlvbiAod2l0aCBHaXRIdWIgc291cmNlIGFzIGlucHV0KS5cclxuICAgICAgICAgICAgY29uc3QgY29kZUJ1aWxkQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZUFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6IGBhcHAtY29kZS1idWlsZC1hY3Rpb24tJHtwcm9wcy5hcHBOYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdDogY29kZWJ1aWxkUGlwZWxpbmVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgcGlwZWxpbmUgc3RhZ2UgPSBidWlsZC5cclxuICAgICAgICAgICAgLy8gUGlwZWxpbmUgU3RhZ2UgMjogU2V0IGFjdGlvbiB0byBidWlsZCAoYXBwIGNvZGUpLlxyXG4gICAgICAgICAgICB0aGlzLm91dHB1dHMucGlwZWxpbmUuYWRkU3RhZ2Uoe1xyXG4gICAgICAgICAgICAgICAgc3RhZ2VOYW1lOiBgYXBwcy1idWlsZC0ke3Byb3BzLmFwcE5hbWV9YCxcclxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFtjb2RlQnVpbGRBY3Rpb25dXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc3Qgd2FpdEZvckNka1N0YWdlID0gdGhpcy5vdXRwdXRzLnBpcGVsaW5lLmFkZFN0YWdlKHtcclxuICAgICAgICAgICAgLy8gICAgIHN0YWdlTmFtZTogJ3dhaXRGb3JDZGtTdGFnZScsXHJcbiAgICAgICAgICAgIC8vICAgICB0cmFuc2l0aW9uVG9FbmFibGVkOiBmYWxzZSxcclxuICAgICAgICAgICAgLy8gICAgIHRyYW5zaXRpb25EaXNhYmxlZFJlYXNvbjogJ01hbnVhbCB0cmFuc2l0aW9uIG9ubHknXHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIl19