"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipelineBranch = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
class CdkPipelineBranch extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _b;
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
        (_b = jompxConfig.environments()) === null || _b === void 0 ? void 0 : _b.filter(environment => environment.name.includes(props.environmentNameSubstring)).forEach((environment) => {
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
                pipelineName: `cdk-pipeline-${environment.name}`,
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
exports.CdkPipelineBranch = CdkPipelineBranch;
_a = JSII_RTTI_SYMBOL_1;
CdkPipelineBranch[_a] = { fqn: "@jompx/constructs.CdkPipelineBranch", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWJyYW5jaC5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc3RydWN0cy9jZGstcGlwZWxpbmUtYnJhbmNoLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1DQUFtQztBQUNuQyx1REFBdUQ7QUFDdkQsZ0VBQWdFO0FBQ2hFLGdGQUFnRjtBQUNoRiwyQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLG1EQUFtRDtBQUNuRCw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw4Q0FBMkM7QUFrQjNDOzs7Ozs7OztHQVFHO0FBQ0gsTUFBYSxpQkFBa0IsU0FBUSxzQkFBUztJQUU1QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQThCOztRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRmIseUJBQW9CLEdBQTJCLEVBQUUsQ0FBQztRQUl0RCxNQUFNLFdBQVcsR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUMsOERBQThEO1FBQzlELE1BQU0sVUFBVSxHQUFHLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQztRQUNsRSxNQUFNLGtCQUFrQixHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxXQUFXLENBQUMsMEJBQTBCLEVBQUUsV0FBVyxFQUFFO1lBQ25HLFVBQVU7WUFDVixTQUFTLEVBQUUsSUFBSTtZQUNmLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVM7WUFDakQsVUFBVSxFQUFFLElBQUk7WUFDaEIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsd0NBQXdDO1NBQ25FLENBQUMsQ0FB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RUFBRSxnQkFBZ0IsV0FBVyxDQUFDLElBQUksRUFBRTtnQkFDaEQsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUU7b0JBQ3BDLEdBQUcsRUFBRTt3QkFDRCxLQUFLLEVBQUUsV0FBVyxDQUFDLElBQUk7cUJBQzFCO29CQUNELEtBQUssRUFBRSxTQUFTLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLGNBQWMsQ0FBQztvQkFDMUUsUUFBUSxFQUFFLENBQUMsYUFBYSxFQUFFLDJCQUEyQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSw4Q0FBOEMsQ0FBQztvQkFDM0ksc0JBQXNCLEVBQUUsa0JBQWtCO2lCQUM3QyxDQUFDO2FBQ0wsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLFdBQVcsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzlELENBQUMsRUFBRTtJQUNQLENBQUM7O0FBdkdMLDhDQXdHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcclxuLy8gaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xyXG4vLyBpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVfYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY2xhc3Nlcy9jb25maWcnO1xyXG5pbXBvcnQgeyBJRW52aXJvbm1lbnQgfSBmcm9tICcuLi90eXBlcy9jb25maWcuaW50ZXJmYWNlJztcclxuXHJcbi8qKlxyXG4gKiBJbXBvcnRhbnQ6IFNhbmRib3ggYWNjb3VudCBuYW1lIG11c3QgZW5kIGluIGEgbnVtYmVyIGUuZy4gc2FuZGJveDEuIFRPRE86IEhvdyBlbHNlIGNhbiB3ZSBhc3NvY2lhdGUgYSBicmFuY2ggd2l0aCBhbiBhY2NvdW50P1xyXG4gKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNka1BpcGVsaW5lQnJhbmNoUHJvcHMge1xyXG4gICAgZW52aXJvbm1lbnROYW1lU3Vic3RyaW5nOiBzdHJpbmc7XHJcbiAgICBnaXRIdWJPd25lcjogc3RyaW5nO1xyXG4gICAgZ2l0SHViUmVwbzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnZpcm9ubWVudFBpcGVsaW5lIHtcclxuICAgIGVudmlyb25tZW50OiBJRW52aXJvbm1lbnQ7XHJcbiAgICBwaXBlbGluZTogcGlwZWxpbmVzLkNvZGVQaXBlbGluZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlcGxveSBpbiBwYXJhbGxlbD8gUkVBRCBUSElTOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92MS9kb2NzL3BpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKiBDb250aW51b3VzIGludGVncmF0aW9uIGFuZCBkZWxpdmVyeSAoQ0kvQ0QpIHVzaW5nIENESyBQaXBlbGluZXM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvdjIvZ3VpZGUvY2RrX3BpcGVsaW5lLmh0bWxcclxuICogQ0RLIGRvY286IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIucGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqIEJ1aWxkIFNwZWMgUmVmZXJlbmNlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvYnVpbGQtc3BlYy1yZWYuaHRtbFxyXG4gKiBueCBjaWNkOiBodHRwczovL254LmRldi9jaS9tb25vcmVwby1jaS1jaXJjbGUtY2lcclxuICpcclxuICogVHJpZ2dlciBhcHBzIHBpcGVsaW5lPz8/IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYyODU3OTI1L2hvdy10by1pbnZva2UtYS1waXBlbGluZS1iYXNlZC1vbi1hbm90aGVyLXBpcGVsaW5lLXN1Y2Nlc3MtdXNpbmctYXdzLWNvZGVjb21taXRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDZGtQaXBlbGluZUJyYW5jaCBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgIGVudmlyb25tZW50UGlwZWxpbmVzOiBJRW52aXJvbm1lbnRQaXBlbGluZVtdID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUNka1BpcGVsaW5lQnJhbmNoUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBqb21weENvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGJ1Y2tldCB0byBzYXZlIGdpdGh1YiBmZWF0dXJlIGJyYW5jaCBmaWxlcyAoYXMgemlwKS5cclxuICAgICAgICBjb25zdCBidWNrZXROYW1lID0gYCR7am9tcHhDb25maWcub3JnYW5pemF0aW9uTmFtZSgpfS1jZGstYnJhbmNoYDtcclxuICAgICAgICBjb25zdCBnaXRIdWJCcmFuY2hCdWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIGAke2pvbXB4Q29uZmlnLm9yZ2FuaXphdGlvbk5hbWVQYXNjYWxDYXNlKCl9Q2RrQnJhbmNoYCwge1xyXG4gICAgICAgICAgICBidWNrZXROYW1lLFxyXG4gICAgICAgICAgICB2ZXJzaW9uZWQ6IHRydWUsIC8vIFZlcnNpb24gYnVja2V0IHRvIHVzZSBhcyBDb2RlUGlwZWxpbmUgc291cmNlLlxyXG4gICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcclxuICAgICAgICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcclxuICAgICAgICAgICAgZW5mb3JjZVNTTDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSwgLy8gRGVzdHJveSBidWNrZXQgb24gc3RhY2sgZGVsZXRlLlxyXG4gICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSAvLyBEZWxldGUgYWxsIGJ1Y2tldCBvYmplY3RzIG9uIGRlc3RvcnkuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhIHBpcGVsaW5lIGZvciBlYWNoIHNhbmRib3ggZW52aXJvbm1lbnQuXHJcbiAgICAgICAgLy8gVE9ETzogR2V0IGJyYW5jaCBuYW1lLiBVc2Ugb25lIHBpcGVsaW5lIGZvciBhbGwgZmVhdHVyZSBicmFuY2hlcy5cclxuICAgICAgICBqb21weENvbmZpZy5lbnZpcm9ubWVudHMoKT8uZmlsdGVyKGVudmlyb25tZW50ID0+IGVudmlyb25tZW50Lm5hbWUuaW5jbHVkZXMocHJvcHMuZW52aXJvbm1lbnROYW1lU3Vic3RyaW5nKSkuZm9yRWFjaCgoZW52aXJvbm1lbnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJyYW5jaEZpbGVOYW1lID0gYGJyYW5jaC0ke2Vudmlyb25tZW50Lm5hbWV9LnppcGA7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudmlyb25tZW50TmFtZVBhc2NhbENhc2UgPSBjaGFuZ2VDYXNlLnBhc2NhbENhc2UoZW52aXJvbm1lbnQubmFtZSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnJhbmNoU3Vic3RyaW5nID0gZW52aXJvbm1lbnQubmFtZTtcclxuICAgICAgICAgICAgaWYgKGpvbXB4Q29uZmlnLnN0YWdlKCkgIT09ICdwcm9kJykge1xyXG4gICAgICAgICAgICAgICAgYnJhbmNoU3Vic3RyaW5nID0gYCR7am9tcHhDb25maWcuc3RhZ2UoKX0tJHticmFuY2hTdWJzdHJpbmd9YDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGdpdGh1YiBzb3VyY2UgKGZlYXR1cmUgYnJhbmNoKS5cclxuICAgICAgICAgICAgY29uc3QgZ2l0SHViQnJhbmNoU291cmNlID0gY29kZWJ1aWxkXHJcbiAgICAgICAgICAgICAgICAuU291cmNlLmdpdEh1Yih7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHByb3BzLmdpdEh1Yk93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcG86IHByb3BzLmdpdEh1YlJlcG8sXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViaG9vazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB3ZWJob29rRmlsdGVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlYnVpbGQuRmlsdGVyR3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbkV2ZW50T2YoY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVU0gpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXNOb3QoJ21haW4nKSAvLyBGb3IgYWRkaXRpb25hbCBwcm90ZWN0aW9uIG9ubHkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXMoYCgtJHticmFuY2hTdWJzdHJpbmd9LSlgKSAvLyBlLmcuIHByb2QgPSBtdi1zYW5kYm94MS1teS1mZWF0dXJlLCB0ZXN0ID0gbXYtdGVzdC1zYW5kYm94LW15LWZlYXR1cmVcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBidWlsZCBwcm9qZWN0ICh0byBjb3B5IGZlYXR1cmUgYnJhbmNoIGZpbGVzIHRvIFMzIG9uIGdpdGh1YiBwdXNoKS5cclxuICAgICAgICAgICAgY29uc3QgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCBgR2l0aHViQ29kZUJ1aWxkUHJvamVjdCR7ZW52aXJvbm1lbnROYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogYGNvcHktZ2l0aHViLWJyYW5jaC0ke2Vudmlyb25tZW50Lm5hbWV9LXRvLXMzYCxcclxuICAgICAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiAnKiovKidcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogZ2l0SHViQnJhbmNoU291cmNlLFxyXG4gICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiBjb2RlYnVpbGQuQXJ0aWZhY3RzLnMzKHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBicmFuY2hGaWxlTmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBidWNrZXQ6IGdpdEh1YkJyYW5jaEJ1Y2tldCxcclxuICAgICAgICAgICAgICAgICAgICBpbmNsdWRlQnVpbGRJZDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFja2FnZVppcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnR2l0aHViQXJ0aWZhY3QnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLy8gQ29kZUJ1aWxkIHByb2plY3QgcmVxdWlyZXMgcGVybWlzc2lvbnMgdG8gUzMgYnVja2V0IG9iamVjdHMuXHJcbiAgICAgICAgICAgIGdpdGh1YkNvZGVCdWlsZFByb2plY3QuYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnczM6TGlzdEJ1Y2tldCcsICdzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0JywgJ3MzOkRlbGV0ZU9iamVjdCddLFxyXG4gICAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgZ2l0SHViQnJhbmNoQnVja2V0LmJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgICAgICBgJHtnaXRIdWJCcmFuY2hCdWNrZXQuYnVja2V0QXJufS8qYFxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgcGlwZWxpbmUgKHRvIGRlcGxveSBDREsgR2l0SHViIGJyYW5jaCBmaWxlcyBvbiBTMyB0byBhbiBBV1MgYWNjb3VudCkuXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHBpcGVsaW5lSWQgPSBjYW1lbENhc2UoYFBpcGVsaW5lJHtwcm9wcy5pbmZpeEJyYW5jaE5hbWV9JHtpfWAsIHsgcGFzY2FsQ2FzZTogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgLy8gY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHRoaXMsIHBpcGVsaW5lSWQsIHtcclxuICAgICAgICAgICAgLy8gICAgIHBpcGVsaW5lTmFtZTogYGdpdGh1Yi1icmFuY2gtcGlwZWxpbmUtJHtlbnZpcm9ubWVudC5uYW1lfWBcclxuICAgICAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgUzMgc291cmNlIGFjdGlvbiAoR2l0SHViIGZpbGVzIGluIFMzKS5cclxuICAgICAgICAgICAgLy8gY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xyXG4gICAgICAgICAgICAvLyAgICAgYWN0aW9uTmFtZTogYHMzLXNvdXJjZS0ke2Vudmlyb25tZW50Lm5hbWV9YCxcclxuICAgICAgICAgICAgLy8gICAgIGJ1Y2tldDogZ2l0SHViQnJhbmNoQnVja2V0LFxyXG4gICAgICAgICAgICAvLyAgICAgYnVja2V0S2V5OiBicmFuY2hGaWxlTmFtZSxcclxuICAgICAgICAgICAgLy8gICAgIG91dHB1dDogc291cmNlT3V0cHV0XHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCBgQ2RrQ29kZVBpcGVsaW5lJHtlbnZpcm9ubWVudE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogYGNkay1waXBlbGluZS0ke2Vudmlyb25tZW50Lm5hbWV9YCxcclxuICAgICAgICAgICAgICAgIGNyb3NzQWNjb3VudEtleXM6IHRydWUsIC8vIFJlcXVpcmVkIGZvciBjcm9zcyBhY2NvdW50IGRlcGxveXMuXHJcbiAgICAgICAgICAgICAgICBzeW50aDogbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTVEFHRTogZW52aXJvbm1lbnQubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuczMoZ2l0SHViQnJhbmNoQnVja2V0LCBicmFuY2hGaWxlTmFtZSksXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IFsnbnBtIGluc3RhbGwnLCAnbnBtIC1nIGluc3RhbGwgdHlwZXNjcmlwdCcsICducG0gaW5zdGFsbCAtZyBueCcsICdueCBidWlsZCBjZGsnLCAnbnggc3ludGggY2RrIC0tYXJncz1cIi0tY29udGV4dCBzdGFnZT0kU1RBR0VcIiddLCAvLyBBV1MgZG9jcyBleGFtcGxlIGNvbW1hbmRzOiBbJ25wbSBjaScsICducG0gcnVuIGJ1aWxkJywgJ25weCBjZGsgc3ludGgnXVxyXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3Rvcnk6ICdhcHBzL2Nkay9jZGsub3V0J1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50UGlwZWxpbmVzLnB1c2goeyBlbnZpcm9ubWVudCwgcGlwZWxpbmUgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=