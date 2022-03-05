"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JompxCdkPipelineBranch = void 0;
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
// import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
// import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const pipelines = require("aws-cdk-lib/pipelines");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const constructs_1 = require("constructs");
const config_1 = require("../classes/config");
/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 * Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html
 * CDK doco: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
 * Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html
 * nx cicd: https://nx.dev/ci/monorepo-ci-circle-ci
 *
 * Trigger apps pipeline??? https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit
 */
class JompxCdkPipelineBranch extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _a;
        super(scope, id);
        this.environmentPipelines = [];
        const jompxConfig = new config_1.Config(this.node);
        // Create bucket to save github feature branch files (as zip).
        const bucketName = `${jompxConfig.organizationName()}-cdk-branch`;
        const gitHubBranchBucket = new s3.Bucket(this, `${jompxConfig.organizationNamePascalCase()}CdkBranch`, {
            bucketName,
            versioned: true,
            publicReadAccess: false,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            enforceSSL: true,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true // Delete all bucket objects on destory.
        });
        // Create a pipeline for each sandbox environment.
        // TODO: Get branch name. Use one pipeline for all feature branches.
        (_a = jompxConfig.environments()) === null || _a === void 0 ? void 0 : _a.filter(environment => environment.name.includes(props.environmentNameSubstring)).forEach((environment) => {
            const branchFileName = `branch-${environment.name}.zip`;
            const environmentNamePascalCase = changeCase.pascalCase(environment.name);
            let branchSubstring = environment.name;
            if (jompxConfig.stage() !== 'prod') {
                branchSubstring = `${jompxConfig.stage()}-${branchSubstring}`;
            }
            // Create github source (feature branch).
            const gitHubBranchSource = codebuild
                .Source.gitHub({
                owner: props.gitHubOwner,
                repo: props.gitHubRepo,
                webhook: true,
                webhookFilters: [
                    codebuild.FilterGroup
                        .inEventOf(codebuild.EventAction.PUSH)
                        .andBranchIsNot('main') // For additional protection only.
                        .andBranchIs(`(-${branchSubstring}-)`) // e.g. prod = mv-sandbox1-my-feature, test = mv-test-sandbox-my-feature
                ]
            });
            // Create build project (to copy feature branch files to S3 on github push).
            const githubCodeBuildProject = new codebuild.Project(this, `GithubCodeBuildProject${environmentNamePascalCase}`, {
                projectName: `copy-github-branch-${environment.name}-to-s3`,
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: 0.2,
                    artifacts: {
                        files: '**/*'
                    }
                }),
                source: gitHubBranchSource,
                artifacts: codebuild.Artifacts.s3({
                    name: branchFileName,
                    bucket: gitHubBranchBucket,
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
                    gitHubBranchBucket.bucketArn,
                    `${gitHubBranchBucket.bucketArn}/*`
                ]
            }));
            // Create pipeline (to deploy CDK GitHub branch files on S3 to an AWS account).
            // const pipelineId = camelCase(`Pipeline${props.infixBranchName}${i}`, { pascalCase: true });
            // const pipeline = new codepipeline.Pipeline(this, pipelineId, {
            //     pipelineName: `github-branch-pipeline-${environment.name}`
            // });
            // Create S3 source action (GitHub files in S3).
            // const sourceOutput = new codepipeline.Artifact();
            // const sourceAction = new codepipeline_actions.S3SourceAction({
            //     actionName: `s3-source-${environment.name}`,
            //     bucket: gitHubBranchBucket,
            //     bucketKey: branchFileName,
            //     output: sourceOutput
            // });
            const pipeline = new pipelines.CodePipeline(this, `CdkCodePipeline${environmentNamePascalCase}`, {
                pipelineName: 'cdk-pipeline-${environment.name}}',
                crossAccountKeys: true,
                synth: new pipelines.ShellStep('Synth', {
                    env: {
                        STAGE: environment.name
                    },
                    input: pipelines.CodePipelineSource.s3(gitHubBranchBucket, branchFileName),
                    commands: ['npm install', 'npm -g install typescript', 'npm install -g nx', 'nx build cdk', 'nx synth cdk --args="--context stage=$STAGE"'],
                    primaryOutputDirectory: 'apps/cdk/cdk.out'
                })
            });
            this.environmentPipelines.push({ environment, pipeline });
        });
    }
}
exports.JompxCdkPipelineBranch = JompxCdkPipelineBranch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWJyYW5jaC5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc3RydWN0cy9jZGstcGlwZWxpbmUtYnJhbmNoLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBQ3ZELGdFQUFnRTtBQUNoRSxnRkFBZ0Y7QUFDaEYsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6QyxtREFBbUQ7QUFDbkQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQywyQ0FBdUM7QUFDdkMsOENBQTJDO0FBa0IzQzs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsc0JBQXVCLFNBQVEsc0JBQVM7SUFFakQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFtQzs7UUFDekUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUZiLHlCQUFvQixHQUEyQixFQUFFLENBQUM7UUFJdEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFDLDhEQUE4RDtRQUM5RCxNQUFNLFVBQVUsR0FBRyxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUM7UUFDbEUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLDBCQUEwQixFQUFFLFdBQVcsRUFBRTtZQUNuRyxVQUFVO1lBQ1YsU0FBUyxFQUFFLElBQUk7WUFDZixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO1lBQ2pELFVBQVUsRUFBRSxJQUFJO1lBQ2hCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHdDQUF3QztTQUNuRSxDQUFDLENBQUM7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QUUsbUNBQW1DO2dCQUNqRCxnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixLQUFLLEVBQUUsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRTtvQkFDcEMsR0FBRyxFQUFFO3dCQUNELEtBQUssRUFBRSxXQUFXLENBQUMsSUFBSTtxQkFDMUI7b0JBQ0QsS0FBSyxFQUFFLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsa0JBQWtCLEVBQUUsY0FBYyxDQUFDO29CQUMxRSxRQUFRLEVBQUUsQ0FBQyxhQUFhLEVBQUUsMkJBQTJCLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLDhDQUE4QyxDQUFDO29CQUMzSSxzQkFBc0IsRUFBRSxrQkFBa0I7aUJBQzdDLENBQUM7YUFDTCxDQUFDLENBQUM7WUFFSCxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDOUQsQ0FBQyxFQUFFO0lBQ1AsQ0FBQztDQUNKO0FBeEdELHdEQXdHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcclxuLy8gaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xyXG4vLyBpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVfYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY2xhc3Nlcy9jb25maWcnO1xyXG5pbXBvcnQgeyBJRW52aXJvbm1lbnQgfSBmcm9tICcuLi90eXBlcy9jb25maWcuaW50ZXJmYWNlJztcclxuXHJcbi8qKlxyXG4gKiBJbXBvcnRhbnQ6IFNhbmRib3ggYWNjb3VudCBuYW1lIG11c3QgZW5kIGluIGEgbnVtYmVyIGUuZy4gc2FuZGJveDEuIFRPRE86IEhvdyBlbHNlIGNhbiB3ZSBhc3NvY2lhdGUgYSBicmFuY2ggd2l0aCBhbiBhY2NvdW50P1xyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUpvbXB4Q2RrUGlwZWxpbmVCcmFuY2hQcm9wcyB7XHJcbiAgICBlbnZpcm9ubWVudE5hbWVTdWJzdHJpbmc6IHN0cmluZztcclxuICAgIGdpdEh1Yk93bmVyOiBzdHJpbmc7XHJcbiAgICBnaXRIdWJSZXBvOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudmlyb25tZW50UGlwZWxpbmUge1xyXG4gICAgZW52aXJvbm1lbnQ6IElFbnZpcm9ubWVudDtcclxuICAgIHBpcGVsaW5lOiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lO1xyXG59XHJcblxyXG4vKipcclxuICogRGVwbG95IGluIHBhcmFsbGVsPyBSRUFEIFRISVM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YxL2RvY3MvcGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqIENvbnRpbnVvdXMgaW50ZWdyYXRpb24gYW5kIGRlbGl2ZXJ5IChDSS9DRCkgdXNpbmcgQ0RLIFBpcGVsaW5lczogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay92Mi9ndWlkZS9jZGtfcGlwZWxpbmUuaHRtbFxyXG4gKiBDREsgZG9jbzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogQnVpbGQgU3BlYyBSZWZlcmVuY2U6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1zcGVjLXJlZi5odG1sXHJcbiAqIG54IGNpY2Q6IGh0dHBzOi8vbnguZGV2L2NpL21vbm9yZXBvLWNpLWNpcmNsZS1jaVxyXG4gKlxyXG4gKiBUcmlnZ2VyIGFwcHMgcGlwZWxpbmU/Pz8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjI4NTc5MjUvaG93LXRvLWludm9rZS1hLXBpcGVsaW5lLWJhc2VkLW9uLWFub3RoZXItcGlwZWxpbmUtc3VjY2Vzcy11c2luZy1hd3MtY29kZWNvbW1pdFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEpvbXB4Q2RrUGlwZWxpbmVCcmFuY2ggZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljICBlbnZpcm9ubWVudFBpcGVsaW5lczogSUVudmlyb25tZW50UGlwZWxpbmVbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElKb21weENka1BpcGVsaW5lQnJhbmNoUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBqb21weENvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGJ1Y2tldCB0byBzYXZlIGdpdGh1YiBmZWF0dXJlIGJyYW5jaCBmaWxlcyAoYXMgemlwKS5cclxuICAgICAgICBjb25zdCBidWNrZXROYW1lID0gYCR7am9tcHhDb25maWcub3JnYW5pemF0aW9uTmFtZSgpfS1jZGstYnJhbmNoYDtcclxuICAgICAgICBjb25zdCBnaXRIdWJCcmFuY2hCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIGAke2pvbXB4Q29uZmlnLm9yZ2FuaXphdGlvbk5hbWVQYXNjYWxDYXNlKCl9Q2RrQnJhbmNoYCwge1xyXG4gICAgICAgICAgICBidWNrZXROYW1lLFxyXG4gICAgICAgICAgICB2ZXJzaW9uZWQ6IHRydWUsIC8vIFZlcnNpb24gYnVja2V0IHRvIHVzZSBhcyBDb2RlUGlwZWxpbmUgc291cmNlLlxyXG4gICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcclxuICAgICAgICAgICAgZW5mb3JjZVNTTDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSwgLy8gRGVzdHJveSBidWNrZXQgb24gc3RhY2sgZGVsZXRlLlxyXG4gICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSAvLyBEZWxldGUgYWxsIGJ1Y2tldCBvYmplY3RzIG9uIGRlc3RvcnkuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHBpcGVsaW5lIGZvciBlYWNoIHNhbmRib3ggZW52aXJvbm1lbnQuXHJcbiAgICAgICAgLy8gVE9ETzogR2V0IGJyYW5jaCBuYW1lLiBVc2Ugb25lIHBpcGVsaW5lIGZvciBhbGwgZmVhdHVyZSBicmFuY2hlcy5cclxuICAgICAgICBqb21weENvbmZpZy5lbnZpcm9ubWVudHMoKT8uZmlsdGVyKGVudmlyb25tZW50ID0+IGVudmlyb25tZW50Lm5hbWUuaW5jbHVkZXMocHJvcHMuZW52aXJvbm1lbnROYW1lU3Vic3RyaW5nKSkuZm9yRWFjaCgoZW52aXJvbm1lbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJyYW5jaEZpbGVOYW1lID0gYGJyYW5jaC0ke2Vudmlyb25tZW50Lm5hbWV9LnppcGA7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudmlyb25tZW50TmFtZVBhc2NhbENhc2UgPSBjaGFuZ2VDYXNlLnBhc2NhbENhc2UoZW52aXJvbm1lbnQubmFtZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnJhbmNoU3Vic3RyaW5nID0gZW52aXJvbm1lbnQubmFtZTtcclxuICAgICAgICAgICAgaWYgKGpvbXB4Q29uZmlnLnN0YWdlKCkgIT09ICdwcm9kJykge1xyXG4gICAgICAgICAgICAgICAgYnJhbmNoU3Vic3RyaW5nID0gYCR7am9tcHhDb25maWcuc3RhZ2UoKX0tJHticmFuY2hTdWJzdHJpbmd9YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGdpdGh1YiBzb3VyY2UgKGZlYXR1cmUgYnJhbmNoKS5cclxuICAgICAgICAgICAgY29uc3QgZ2l0SHViQnJhbmNoU291cmNlID0gY29kZWJ1aWxkXHJcbiAgICAgICAgICAgICAgICAuU291cmNlLmdpdEh1Yih7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHByb3BzLmdpdEh1Yk93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcG86IHByb3BzLmdpdEh1YlJlcG8sXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViaG9vazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB3ZWJob29rRmlsdGVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlYnVpbGQuRmlsdGVyR3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbkV2ZW50T2YoY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVU0gpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXNOb3QoJ21haW4nKSAvLyBGb3IgYWRkaXRpb25hbCBwcm90ZWN0aW9uIG9ubHkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXMoYCgtJHticmFuY2hTdWJzdHJpbmd9LSlgKSAvLyBlLmcuIHByb2QgPSBtdi1zYW5kYm94MS1teS1mZWF0dXJlLCB0ZXN0ID0gbXYtdGVzdC1zYW5kYm94LW15LWZlYXR1cmVcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBidWlsZCBwcm9qZWN0ICh0byBjb3B5IGZlYXR1cmUgYnJhbmNoIGZpbGVzIHRvIFMzIG9uIGdpdGh1YiBwdXNoKS5cclxuICAgICAgICAgICAgY29uc3QgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCBgR2l0aHViQ29kZUJ1aWxkUHJvamVjdCR7ZW52aXJvbm1lbnROYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogYGNvcHktZ2l0aHViLWJyYW5jaC0ke2Vudmlyb25tZW50Lm5hbWV9LXRvLXMzYCxcclxuICAgICAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiAnKiovKidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogZ2l0SHViQnJhbmNoU291cmNlLFxyXG4gICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiBjb2RlYnVpbGQuQXJ0aWZhY3RzLnMzKHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBicmFuY2hGaWxlTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBidWNrZXQ6IGdpdEh1YkJyYW5jaEJ1Y2tldCxcclxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlQnVpbGRJZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZVppcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnR2l0aHViQXJ0aWZhY3QnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gQ29kZUJ1aWxkIHByb2plY3QgcmVxdWlyZXMgcGVybWlzc2lvbnMgdG8gUzMgYnVja2V0IG9iamVjdHMuXHJcbiAgICAgICAgICAgIGdpdGh1YkNvZGVCdWlsZFByb2plY3QuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnczM6TGlzdEJ1Y2tldCcsICdzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0JywgJ3MzOkRlbGV0ZU9iamVjdCddLFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgZ2l0SHViQnJhbmNoQnVja2V0LmJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgICAgICBgJHtnaXRIdWJCcmFuY2hCdWNrZXQuYnVja2V0QXJufS8qYFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgcGlwZWxpbmUgKHRvIGRlcGxveSBDREsgR2l0SHViIGJyYW5jaCBmaWxlcyBvbiBTMyB0byBhbiBBV1MgYWNjb3VudCkuXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHBpcGVsaW5lSWQgPSBjYW1lbENhc2UoYFBpcGVsaW5lJHtwcm9wcy5pbmZpeEJyYW5jaE5hbWV9JHtpfWAsIHsgcGFzY2FsQ2FzZTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgLy8gY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsIHBpcGVsaW5lSWQsIHtcclxuICAgICAgICAgICAgLy8gICAgIHBpcGVsaW5lTmFtZTogYGdpdGh1Yi1icmFuY2gtcGlwZWxpbmUtJHtlbnZpcm9ubWVudC5uYW1lfWBcclxuICAgICAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgUzMgc291cmNlIGFjdGlvbiAoR2l0SHViIGZpbGVzIGluIFMzKS5cclxuICAgICAgICAgICAgLy8gY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xyXG4gICAgICAgICAgICAvLyAgICAgYWN0aW9uTmFtZTogYHMzLXNvdXJjZS0ke2Vudmlyb25tZW50Lm5hbWV9YCxcclxuICAgICAgICAgICAgLy8gICAgIGJ1Y2tldDogZ2l0SHViQnJhbmNoQnVja2V0LFxyXG4gICAgICAgICAgICAvLyAgICAgYnVja2V0S2V5OiBicmFuY2hGaWxlTmFtZSxcclxuICAgICAgICAgICAgLy8gICAgIG91dHB1dDogc291cmNlT3V0cHV0XHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCBgQ2RrQ29kZVBpcGVsaW5lJHtlbnZpcm9ubWVudE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogJ2Nkay1waXBlbGluZS0ke2Vudmlyb25tZW50Lm5hbWV9fScsXHJcbiAgICAgICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnY6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU1RBR0U6IGVudmlyb25tZW50Lm5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLnMzKGdpdEh1YkJyYW5jaEJ1Y2tldCwgYnJhbmNoRmlsZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBbJ25wbSBpbnN0YWxsJywgJ25wbSAtZyBpbnN0YWxsIHR5cGVzY3JpcHQnLCAnbnBtIGluc3RhbGwgLWcgbngnLCAnbnggYnVpbGQgY2RrJywgJ254IHN5bnRoIGNkayAtLWFyZ3M9XCItLWNvbnRleHQgc3RhZ2U9JFNUQUdFXCInXSwgLy8gQVdTIGRvY3MgZXhhbXBsZSBjb21tYW5kczogWyducG0gY2knLCAnbnBtIHJ1biBidWlsZCcsICducHggY2RrIHN5bnRoJ11cclxuICAgICAgICAgICAgICAgICAgICBwcmltYXJ5T3V0cHV0RGlyZWN0b3J5OiAnYXBwcy9jZGsvY2RrLm91dCdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudFBpcGVsaW5lcy5wdXNoKHsgZW52aXJvbm1lbnQsIHBpcGVsaW5lIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il19