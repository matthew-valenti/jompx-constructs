"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipelineBranch = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLWJyYW5jaC5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc3RydWN0cy9jZGstcGlwZWxpbmUtYnJhbmNoLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBQ3ZELGdFQUFnRTtBQUNoRSxnRkFBZ0Y7QUFDaEYsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6QyxtREFBbUQ7QUFDbkQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQywyQ0FBdUM7QUFDdkMsOENBQTJDO0FBa0IzQzs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsc0JBQVM7SUFFNUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE4Qjs7UUFDcEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUZkLHlCQUFvQixHQUEyQixFQUFFLENBQUM7UUFJckQsTUFBTSxXQUFXLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFDLDhEQUE4RDtRQUM5RCxNQUFNLFVBQVUsR0FBRyxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUM7UUFDbEUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLDBCQUEwQixFQUFFLFdBQVcsRUFBRTtZQUNuRyxVQUFVO1lBQ1YsU0FBUyxFQUFFLElBQUk7WUFDZixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO1lBQ2pELFVBQVUsRUFBRSxJQUFJO1lBQ2hCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHdDQUF3QztTQUNuRSxDQUFDLENBQUM7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QUUsZ0JBQWdCLFdBQVcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hELGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO29CQUNwQyxHQUFHLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLFdBQVcsQ0FBQyxJQUFJO3FCQUMxQjtvQkFDRCxLQUFLLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLENBQUM7b0JBQzFFLFFBQVEsRUFBRSxDQUFDLGFBQWEsRUFBRSwyQkFBMkIsRUFBRSxtQkFBbUIsRUFBRSxjQUFjLEVBQUUsOENBQThDLENBQUM7b0JBQzNJLHNCQUFzQixFQUFFLGtCQUFrQjtpQkFDN0MsQ0FBQzthQUNMLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM5RCxDQUFDLEVBQUU7SUFDUCxDQUFDO0NBQ0o7QUF4R0QsOENBd0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xyXG4vLyBpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZSc7XHJcbi8vIGltcG9ydCAqIGFzIGNvZGVwaXBlbGluZV9hY3Rpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XHJcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jbGFzc2VzL2NvbmZpZyc7XHJcbmltcG9ydCB7IElFbnZpcm9ubWVudCB9IGZyb20gJy4uL3R5cGVzL2NvbmZpZy5pbnRlcmZhY2UnO1xyXG5cclxuLyoqXHJcbiAqIEltcG9ydGFudDogU2FuZGJveCBhY2NvdW50IG5hbWUgbXVzdCBlbmQgaW4gYSBudW1iZXIgZS5nLiBzYW5kYm94MS4gVE9ETzogSG93IGVsc2UgY2FuIHdlIGFzc29jaWF0ZSBhIGJyYW5jaCB3aXRoIGFuIGFjY291bnQ/XHJcbiAqL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2RrUGlwZWxpbmVCcmFuY2hQcm9wcyB7XHJcbiAgICBlbnZpcm9ubWVudE5hbWVTdWJzdHJpbmc6IHN0cmluZztcclxuICAgIGdpdEh1Yk93bmVyOiBzdHJpbmc7XHJcbiAgICBnaXRIdWJSZXBvOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudmlyb25tZW50UGlwZWxpbmUge1xyXG4gICAgZW52aXJvbm1lbnQ6IElFbnZpcm9ubWVudDtcclxuICAgIHBpcGVsaW5lOiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lO1xyXG59XHJcblxyXG4vKipcclxuICogRGVwbG95IGluIHBhcmFsbGVsPyBSRUFEIFRISVM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YxL2RvY3MvcGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqIENvbnRpbnVvdXMgaW50ZWdyYXRpb24gYW5kIGRlbGl2ZXJ5IChDSS9DRCkgdXNpbmcgQ0RLIFBpcGVsaW5lczogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay92Mi9ndWlkZS9jZGtfcGlwZWxpbmUuaHRtbFxyXG4gKiBDREsgZG9jbzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogQnVpbGQgU3BlYyBSZWZlcmVuY2U6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1zcGVjLXJlZi5odG1sXHJcbiAqIG54IGNpY2Q6IGh0dHBzOi8vbnguZGV2L2NpL21vbm9yZXBvLWNpLWNpcmNsZS1jaVxyXG4gKlxyXG4gKiBUcmlnZ2VyIGFwcHMgcGlwZWxpbmU/Pz8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjI4NTc5MjUvaG93LXRvLWludm9rZS1hLXBpcGVsaW5lLWJhc2VkLW9uLWFub3RoZXItcGlwZWxpbmUtc3VjY2Vzcy11c2luZy1hd3MtY29kZWNvbW1pdFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lQnJhbmNoIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudFBpcGVsaW5lczogSUVudmlyb25tZW50UGlwZWxpbmVbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElDZGtQaXBlbGluZUJyYW5jaFByb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgY29uc3Qgam9tcHhDb25maWcgPSBuZXcgQ29uZmlnKHRoaXMubm9kZSk7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBidWNrZXQgdG8gc2F2ZSBnaXRodWIgZmVhdHVyZSBicmFuY2ggZmlsZXMgKGFzIHppcCkuXHJcbiAgICAgICAgY29uc3QgYnVja2V0TmFtZSA9IGAke2pvbXB4Q29uZmlnLm9yZ2FuaXphdGlvbk5hbWUoKX0tY2RrLWJyYW5jaGA7XHJcbiAgICAgICAgY29uc3QgZ2l0SHViQnJhbmNoQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBgJHtqb21weENvbmZpZy5vcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpfUNka0JyYW5jaGAsIHtcclxuICAgICAgICAgICAgYnVja2V0TmFtZSxcclxuICAgICAgICAgICAgdmVyc2lvbmVkOiB0cnVlLCAvLyBWZXJzaW9uIGJ1Y2tldCB0byB1c2UgYXMgQ29kZVBpcGVsaW5lIHNvdXJjZS5cclxuICAgICAgICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXHJcbiAgICAgICAgICAgIGVuZm9yY2VTU0w6IHRydWUsXHJcbiAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIERlc3Ryb3kgYnVja2V0IG9uIHN0YWNrIGRlbGV0ZS5cclxuICAgICAgICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUgLy8gRGVsZXRlIGFsbCBidWNrZXQgb2JqZWN0cyBvbiBkZXN0b3J5LlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYSBwaXBlbGluZSBmb3IgZWFjaCBzYW5kYm94IGVudmlyb25tZW50LlxyXG4gICAgICAgIC8vIFRPRE86IEdldCBicmFuY2ggbmFtZS4gVXNlIG9uZSBwaXBlbGluZSBmb3IgYWxsIGZlYXR1cmUgYnJhbmNoZXMuXHJcbiAgICAgICAgam9tcHhDb25maWcuZW52aXJvbm1lbnRzKCk/LmZpbHRlcihlbnZpcm9ubWVudCA9PiBlbnZpcm9ubWVudC5uYW1lLmluY2x1ZGVzKHByb3BzLmVudmlyb25tZW50TmFtZVN1YnN0cmluZykpLmZvckVhY2goKGVudmlyb25tZW50KSA9PiB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBicmFuY2hGaWxlTmFtZSA9IGBicmFuY2gtJHtlbnZpcm9ubWVudC5uYW1lfS56aXBgO1xyXG4gICAgICAgICAgICBjb25zdCBlbnZpcm9ubWVudE5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKGVudmlyb25tZW50Lm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgbGV0IGJyYW5jaFN1YnN0cmluZyA9IGVudmlyb25tZW50Lm5hbWU7XHJcbiAgICAgICAgICAgIGlmIChqb21weENvbmZpZy5zdGFnZSgpICE9PSAncHJvZCcpIHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaFN1YnN0cmluZyA9IGAke2pvbXB4Q29uZmlnLnN0YWdlKCl9LSR7YnJhbmNoU3Vic3RyaW5nfWA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBnaXRodWIgc291cmNlIChmZWF0dXJlIGJyYW5jaCkuXHJcbiAgICAgICAgICAgIGNvbnN0IGdpdEh1YkJyYW5jaFNvdXJjZSA9IGNvZGVidWlsZFxyXG4gICAgICAgICAgICAgICAgLlNvdXJjZS5naXRIdWIoe1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiBwcm9wcy5naXRIdWJPd25lcixcclxuICAgICAgICAgICAgICAgICAgICByZXBvOiBwcm9wcy5naXRIdWJSZXBvLFxyXG4gICAgICAgICAgICAgICAgICAgIHdlYmhvb2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2ViaG9va0ZpbHRlcnM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5FdmVudE9mKGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVVNIKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZEJyYW5jaElzTm90KCdtYWluJykgLy8gRm9yIGFkZGl0aW9uYWwgcHJvdGVjdGlvbiBvbmx5LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZEJyYW5jaElzKGAoLSR7YnJhbmNoU3Vic3RyaW5nfS0pYCkgLy8gZS5nLiBwcm9kID0gbXYtc2FuZGJveDEtbXktZmVhdHVyZSwgdGVzdCA9IG12LXRlc3Qtc2FuZGJveC1teS1mZWF0dXJlXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYnVpbGQgcHJvamVjdCAodG8gY29weSBmZWF0dXJlIGJyYW5jaCBmaWxlcyB0byBTMyBvbiBnaXRodWIgcHVzaCkuXHJcbiAgICAgICAgICAgIGNvbnN0IGdpdGh1YkNvZGVCdWlsZFByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgYEdpdGh1YkNvZGVCdWlsZFByb2plY3Qke2Vudmlyb25tZW50TmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdE5hbWU6IGBjb3B5LWdpdGh1Yi1icmFuY2gtJHtlbnZpcm9ubWVudC5uYW1lfS10by1zM2AsXHJcbiAgICAgICAgICAgICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogMC4yLFxyXG4gICAgICAgICAgICAgICAgICAgIGFydGlmYWN0czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxlczogJyoqLyonXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IGdpdEh1YkJyYW5jaFNvdXJjZSxcclxuICAgICAgICAgICAgICAgIGFydGlmYWN0czogY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogYnJhbmNoRmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVja2V0OiBnaXRIdWJCcmFuY2hCdWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5jbHVkZUJ1aWxkSWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhY2thZ2VaaXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ0dpdGh1YkFydGlmYWN0J1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIENvZGVCdWlsZCBwcm9qZWN0IHJlcXVpcmVzIHBlcm1pc3Npb25zIHRvIFMzIGJ1Y2tldCBvYmplY3RzLlxyXG4gICAgICAgICAgICBnaXRodWJDb2RlQnVpbGRQcm9qZWN0LmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXHJcbiAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnLCAnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuICAgICAgICAgICAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIGdpdEh1YkJyYW5jaEJ1Y2tldC5idWNrZXRBcm4sXHJcbiAgICAgICAgICAgICAgICAgICAgYCR7Z2l0SHViQnJhbmNoQnVja2V0LmJ1Y2tldEFybn0vKmBcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIHBpcGVsaW5lICh0byBkZXBsb3kgQ0RLIEdpdEh1YiBicmFuY2ggZmlsZXMgb24gUzMgdG8gYW4gQVdTIGFjY291bnQpLlxyXG4gICAgICAgICAgICAvLyBjb25zdCBwaXBlbGluZUlkID0gY2FtZWxDYXNlKGBQaXBlbGluZSR7cHJvcHMuaW5maXhCcmFuY2hOYW1lfSR7aX1gLCB7IHBhc2NhbENhc2U6IHRydWUgfSk7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZSh0aGlzLCBwaXBlbGluZUlkLCB7XHJcbiAgICAgICAgICAgIC8vICAgICBwaXBlbGluZU5hbWU6IGBnaXRodWItYnJhbmNoLXBpcGVsaW5lLSR7ZW52aXJvbm1lbnQubmFtZX1gXHJcbiAgICAgICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIFMzIHNvdXJjZSBhY3Rpb24gKEdpdEh1YiBmaWxlcyBpbiBTMykuXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcclxuICAgICAgICAgICAgLy8gY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcclxuICAgICAgICAgICAgLy8gICAgIGFjdGlvbk5hbWU6IGBzMy1zb3VyY2UtJHtlbnZpcm9ubWVudC5uYW1lfWAsXHJcbiAgICAgICAgICAgIC8vICAgICBidWNrZXQ6IGdpdEh1YkJyYW5jaEJ1Y2tldCxcclxuICAgICAgICAgICAgLy8gICAgIGJ1Y2tldEtleTogYnJhbmNoRmlsZU5hbWUsXHJcbiAgICAgICAgICAgIC8vICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dFxyXG4gICAgICAgICAgICAvLyB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmUodGhpcywgYENka0NvZGVQaXBlbGluZSR7ZW52aXJvbm1lbnROYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgICAgICBwaXBlbGluZU5hbWU6IGBjZGstcGlwZWxpbmUtJHtlbnZpcm9ubWVudC5uYW1lfWAsXHJcbiAgICAgICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcclxuICAgICAgICAgICAgICAgICAgICBlbnY6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgU1RBR0U6IGVudmlyb25tZW50Lm5hbWVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLnMzKGdpdEh1YkJyYW5jaEJ1Y2tldCwgYnJhbmNoRmlsZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBbJ25wbSBpbnN0YWxsJywgJ25wbSAtZyBpbnN0YWxsIHR5cGVzY3JpcHQnLCAnbnBtIGluc3RhbGwgLWcgbngnLCAnbnggYnVpbGQgY2RrJywgJ254IHN5bnRoIGNkayAtLWFyZ3M9XCItLWNvbnRleHQgc3RhZ2U9JFNUQUdFXCInXSwgLy8gQVdTIGRvY3MgZXhhbXBsZSBjb21tYW5kczogWyducG0gY2knLCAnbnBtIHJ1biBidWlsZCcsICducHggY2RrIHN5bnRoJ11cclxuICAgICAgICAgICAgICAgICAgICBwcmltYXJ5T3V0cHV0RGlyZWN0b3J5OiAnYXBwcy9jZGsvY2RrLm91dCdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudFBpcGVsaW5lcy5wdXNoKHsgZW52aXJvbm1lbnQsIHBpcGVsaW5lIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il19