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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGNkay1waXBlbGluZS5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc3RydWN0cy94Y2RrLXBpcGVsaW5lLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBQ3ZELGdFQUFnRTtBQUNoRSxnRkFBZ0Y7QUFDaEYsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6QyxtREFBbUQ7QUFDbkQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQywyQ0FBdUM7QUFDdkMsOENBQTJDO0FBa0IzQzs7Ozs7Ozs7R0FRRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsc0JBQVM7SUFFNUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE4Qjs7UUFDcEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUZiLHlCQUFvQixHQUEyQixFQUFFLENBQUM7UUFJdEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFDLDhEQUE4RDtRQUM5RCxNQUFNLFVBQVUsR0FBRyxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUM7UUFDbEUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsV0FBVyxDQUFDLDBCQUEwQixFQUFFLFdBQVcsRUFBRTtZQUNuRyxVQUFVO1lBQ1YsU0FBUyxFQUFFLElBQUk7WUFDZixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO1lBQ2pELFVBQVUsRUFBRSxJQUFJO1lBQ2hCLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87WUFDeEMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLHdDQUF3QztTQUNuRSxDQUFDLENBQUM7UUFFSCxrREFBa0Q7UUFDbEQsb0VBQW9FO1FBQ3BFLE1BQUEsV0FBVyxDQUFDLFlBQVksRUFBRSwwQ0FBRSxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUVqSSxNQUFNLGNBQWMsR0FBRyxVQUFVLFdBQVcsQ0FBQyxJQUFJLE1BQU0sQ0FBQztZQUN4RCxNQUFNLHlCQUF5QixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRTFFLElBQUksZUFBZSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDdkMsSUFBSSxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssTUFBTSxFQUFFO2dCQUNoQyxlQUFlLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksZUFBZSxFQUFFLENBQUM7YUFDakU7WUFFRCx5Q0FBeUM7WUFDekMsTUFBTSxrQkFBa0IsR0FBRyxTQUFTO2lCQUMvQixNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNYLEtBQUssRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDeEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxVQUFVO2dCQUN0QixPQUFPLEVBQUUsSUFBSTtnQkFDYixjQUFjLEVBQUU7b0JBQ1osU0FBUyxDQUFDLFdBQVc7eUJBQ2hCLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQzt5QkFDckMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLGtDQUFrQzt5QkFDekQsV0FBVyxDQUFDLEtBQUssZUFBZSxJQUFJLENBQUMsQ0FBQyx3RUFBd0U7aUJBQ3RIO2FBQ0osQ0FBQyxDQUFDO1lBRVAsNEVBQTRFO1lBQzVFLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSx5QkFBeUIseUJBQXlCLEVBQUUsRUFBRTtnQkFDN0csV0FBVyxFQUFFLHNCQUFzQixXQUFXLENBQUMsSUFBSSxRQUFRO2dCQUMzRCxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7b0JBQ3RDLE9BQU8sRUFBRSxHQUFHO29CQUNaLFNBQVMsRUFBRTt3QkFDUCxLQUFLLEVBQUUsTUFBTTtxQkFDaEI7aUJBQ0osQ0FBQztnQkFDRixNQUFNLEVBQUUsa0JBQWtCO2dCQUMxQixTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUM7b0JBQzlCLElBQUksRUFBRSxjQUFjO29CQUNwQixNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixjQUFjLEVBQUUsS0FBSztvQkFDckIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLFVBQVUsRUFBRSxnQkFBZ0I7aUJBQy9CLENBQUM7YUFDTCxDQUFDLENBQUM7WUFDSCwrREFBK0Q7WUFDL0Qsc0JBQXNCLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztnQkFDM0QsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztnQkFDeEIsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLGNBQWMsRUFBRSxjQUFjLEVBQUUsaUJBQWlCLENBQUM7Z0JBQzdFLFNBQVMsRUFBRTtvQkFDUCxrQkFBa0IsQ0FBQyxTQUFTO29CQUM1QixHQUFHLGtCQUFrQixDQUFDLFNBQVMsSUFBSTtpQkFDdEM7YUFDSixDQUFDLENBQUMsQ0FBQztZQUVKLCtFQUErRTtZQUMvRSw4RkFBOEY7WUFDOUYsaUVBQWlFO1lBQ2pFLGlFQUFpRTtZQUNqRSxNQUFNO1lBRU4sZ0RBQWdEO1lBQ2hELG9EQUFvRDtZQUNwRCxpRUFBaUU7WUFDakUsbURBQW1EO1lBQ25ELGtDQUFrQztZQUNsQyxpQ0FBaUM7WUFDakMsMkJBQTJCO1lBQzNCLE1BQU07WUFFTixNQUFNLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGtCQUFrQix5QkFBeUIsRUFBRSxFQUFFO2dCQUM3RixZQUFZLEVBQUUsZ0JBQWdCLFdBQVcsQ0FBQyxJQUFJLEVBQUU7Z0JBQ2hELGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFO29CQUNwQyxHQUFHLEVBQUU7d0JBQ0QsS0FBSyxFQUFFLFdBQVcsQ0FBQyxJQUFJO3FCQUMxQjtvQkFDRCxLQUFLLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLENBQUM7b0JBQzFFLFFBQVEsRUFBRSxDQUFDLGFBQWEsRUFBRSwyQkFBMkIsRUFBRSxtQkFBbUIsRUFBRSxjQUFjLEVBQUUsOENBQThDLENBQUM7b0JBQzNJLHNCQUFzQixFQUFFLGtCQUFrQjtpQkFDN0MsQ0FBQzthQUNMLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM5RCxDQUFDLEVBQUU7SUFDUCxDQUFDO0NBQ0o7QUF4R0QsOENBd0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xyXG4vLyBpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZSc7XHJcbi8vIGltcG9ydCAqIGFzIGNvZGVwaXBlbGluZV9hY3Rpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XHJcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jbGFzc2VzL2NvbmZpZyc7XHJcbmltcG9ydCB7IElFbnZpcm9ubWVudCB9IGZyb20gJy4uL3R5cGVzL2NvbmZpZy5pbnRlcmZhY2UnO1xyXG5cclxuLyoqXHJcbiAqIEltcG9ydGFudDogU2FuZGJveCBhY2NvdW50IG5hbWUgbXVzdCBlbmQgaW4gYSBudW1iZXIgZS5nLiBzYW5kYm94MS4gVE9ETzogSG93IGVsc2UgY2FuIHdlIGFzc29jaWF0ZSBhIGJyYW5jaCB3aXRoIGFuIGFjY291bnQ/XHJcbiAqL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2RrUGlwZWxpbmVCcmFuY2hQcm9wcyB7XHJcbiAgICBlbnZpcm9ubWVudE5hbWVTdWJzdHJpbmc6IHN0cmluZztcclxuICAgIGdpdEh1Yk93bmVyOiBzdHJpbmc7XHJcbiAgICBnaXRIdWJSZXBvOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudmlyb25tZW50UGlwZWxpbmUge1xyXG4gICAgZW52aXJvbm1lbnQ6IElFbnZpcm9ubWVudDtcclxuICAgIHBpcGVsaW5lOiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lO1xyXG59XHJcblxyXG4vKipcclxuICogRGVwbG95IGluIHBhcmFsbGVsPyBSRUFEIFRISVM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YxL2RvY3MvcGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqIENvbnRpbnVvdXMgaW50ZWdyYXRpb24gYW5kIGRlbGl2ZXJ5IChDSS9DRCkgdXNpbmcgQ0RLIFBpcGVsaW5lczogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay92Mi9ndWlkZS9jZGtfcGlwZWxpbmUuaHRtbFxyXG4gKiBDREsgZG9jbzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogQnVpbGQgU3BlYyBSZWZlcmVuY2U6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1zcGVjLXJlZi5odG1sXHJcbiAqIG54IGNpY2Q6IGh0dHBzOi8vbnguZGV2L2NpL21vbm9yZXBvLWNpLWNpcmNsZS1jaVxyXG4gKlxyXG4gKiBUcmlnZ2VyIGFwcHMgcGlwZWxpbmU/Pz8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjI4NTc5MjUvaG93LXRvLWludm9rZS1hLXBpcGVsaW5lLWJhc2VkLW9uLWFub3RoZXItcGlwZWxpbmUtc3VjY2Vzcy11c2luZy1hd3MtY29kZWNvbW1pdFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lQnJhbmNoIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyAgZW52aXJvbm1lbnRQaXBlbGluZXM6IElFbnZpcm9ubWVudFBpcGVsaW5lW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQ2RrUGlwZWxpbmVCcmFuY2hQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGpvbXB4Q29uZmlnID0gbmV3IENvbmZpZyh0aGlzLm5vZGUpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgYnVja2V0IHRvIHNhdmUgZ2l0aHViIGZlYXR1cmUgYnJhbmNoIGZpbGVzIChhcyB6aXApLlxyXG4gICAgICAgIGNvbnN0IGJ1Y2tldE5hbWUgPSBgJHtqb21weENvbmZpZy5vcmdhbml6YXRpb25OYW1lKCl9LWNkay1icmFuY2hgO1xyXG4gICAgICAgIGNvbnN0IGdpdEh1YkJyYW5jaEJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgYCR7am9tcHhDb25maWcub3JnYW5pemF0aW9uTmFtZVBhc2NhbENhc2UoKX1DZGtCcmFuY2hgLCB7XHJcbiAgICAgICAgICAgIGJ1Y2tldE5hbWUsXHJcbiAgICAgICAgICAgIHZlcnNpb25lZDogdHJ1ZSwgLy8gVmVyc2lvbiBidWNrZXQgdG8gdXNlIGFzIENvZGVQaXBlbGluZSBzb3VyY2UuXHJcbiAgICAgICAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLFxyXG4gICAgICAgICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxyXG4gICAgICAgICAgICBlbmZvcmNlU1NMOiB0cnVlLFxyXG4gICAgICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLCAvLyBEZXN0cm95IGJ1Y2tldCBvbiBzdGFjayBkZWxldGUuXHJcbiAgICAgICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlIC8vIERlbGV0ZSBhbGwgYnVja2V0IG9iamVjdHMgb24gZGVzdG9yeS5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGEgcGlwZWxpbmUgZm9yIGVhY2ggc2FuZGJveCBlbnZpcm9ubWVudC5cclxuICAgICAgICAvLyBUT0RPOiBHZXQgYnJhbmNoIG5hbWUuIFVzZSBvbmUgcGlwZWxpbmUgZm9yIGFsbCBmZWF0dXJlIGJyYW5jaGVzLlxyXG4gICAgICAgIGpvbXB4Q29uZmlnLmVudmlyb25tZW50cygpPy5maWx0ZXIoZW52aXJvbm1lbnQgPT4gZW52aXJvbm1lbnQubmFtZS5pbmNsdWRlcyhwcm9wcy5lbnZpcm9ubWVudE5hbWVTdWJzdHJpbmcpKS5mb3JFYWNoKChlbnZpcm9ubWVudCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYnJhbmNoRmlsZU5hbWUgPSBgYnJhbmNoLSR7ZW52aXJvbm1lbnQubmFtZX0uemlwYDtcclxuICAgICAgICAgICAgY29uc3QgZW52aXJvbm1lbnROYW1lUGFzY2FsQ2FzZSA9IGNoYW5nZUNhc2UucGFzY2FsQ2FzZShlbnZpcm9ubWVudC5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBicmFuY2hTdWJzdHJpbmcgPSBlbnZpcm9ubWVudC5uYW1lO1xyXG4gICAgICAgICAgICBpZiAoam9tcHhDb25maWcuc3RhZ2UoKSAhPT0gJ3Byb2QnKSB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2hTdWJzdHJpbmcgPSBgJHtqb21weENvbmZpZy5zdGFnZSgpfS0ke2JyYW5jaFN1YnN0cmluZ31gO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgZ2l0aHViIHNvdXJjZSAoZmVhdHVyZSBicmFuY2gpLlxyXG4gICAgICAgICAgICBjb25zdCBnaXRIdWJCcmFuY2hTb3VyY2UgPSBjb2RlYnVpbGRcclxuICAgICAgICAgICAgICAgIC5Tb3VyY2UuZ2l0SHViKHtcclxuICAgICAgICAgICAgICAgICAgICBvd25lcjogcHJvcHMuZ2l0SHViT3duZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVwbzogcHJvcHMuZ2l0SHViUmVwbyxcclxuICAgICAgICAgICAgICAgICAgICB3ZWJob29rOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdlYmhvb2tGaWx0ZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVidWlsZC5GaWx0ZXJHcm91cFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmRCcmFuY2hJc05vdCgnbWFpbicpIC8vIEZvciBhZGRpdGlvbmFsIHByb3RlY3Rpb24gb25seS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmRCcmFuY2hJcyhgKC0ke2JyYW5jaFN1YnN0cmluZ30tKWApIC8vIGUuZy4gcHJvZCA9IG12LXNhbmRib3gxLW15LWZlYXR1cmUsIHRlc3QgPSBtdi10ZXN0LXNhbmRib3gtbXktZmVhdHVyZVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGJ1aWxkIHByb2plY3QgKHRvIGNvcHkgZmVhdHVyZSBicmFuY2ggZmlsZXMgdG8gUzMgb24gZ2l0aHViIHB1c2gpLlxyXG4gICAgICAgICAgICBjb25zdCBnaXRodWJDb2RlQnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHRoaXMsIGBHaXRodWJDb2RlQnVpbGRQcm9qZWN0JHtlbnZpcm9ubWVudE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgIHByb2plY3ROYW1lOiBgY29weS1naXRodWItYnJhbmNoLSR7ZW52aXJvbm1lbnQubmFtZX0tdG8tczNgLFxyXG4gICAgICAgICAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgIHZlcnNpb246IDAuMixcclxuICAgICAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6ICcqKi8qJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBnaXRIdWJCcmFuY2hTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IGNvZGVidWlsZC5BcnRpZmFjdHMuczMoe1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1Y2tldDogZ2l0SHViQnJhbmNoQnVja2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIGluY2x1ZGVCdWlsZElkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBwYWNrYWdlWmlwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkZW50aWZpZXI6ICdHaXRodWJBcnRpZmFjdCdcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBDb2RlQnVpbGQgcHJvamVjdCByZXF1aXJlcyBwZXJtaXNzaW9ucyB0byBTMyBidWNrZXQgb2JqZWN0cy5cclxuICAgICAgICAgICAgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdC5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxyXG4gICAgICAgICAgICAgICAgYWN0aW9uczogWydzMzpMaXN0QnVja2V0JywgJ3MzOkdldE9iamVjdCcsICdzMzpQdXRPYmplY3QnLCAnczM6RGVsZXRlT2JqZWN0J10sXHJcbiAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICBnaXRIdWJCcmFuY2hCdWNrZXQuYnVja2V0QXJuLFxyXG4gICAgICAgICAgICAgICAgICAgIGAke2dpdEh1YkJyYW5jaEJ1Y2tldC5idWNrZXRBcm59LypgXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBwaXBlbGluZSAodG8gZGVwbG95IENESyBHaXRIdWIgYnJhbmNoIGZpbGVzIG9uIFMzIHRvIGFuIEFXUyBhY2NvdW50KS5cclxuICAgICAgICAgICAgLy8gY29uc3QgcGlwZWxpbmVJZCA9IGNhbWVsQ2FzZShgUGlwZWxpbmUke3Byb3BzLmluZml4QnJhbmNoTmFtZX0ke2l9YCwgeyBwYXNjYWxDYXNlOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUodGhpcywgcGlwZWxpbmVJZCwge1xyXG4gICAgICAgICAgICAvLyAgICAgcGlwZWxpbmVOYW1lOiBgZ2l0aHViLWJyYW5jaC1waXBlbGluZS0ke2Vudmlyb25tZW50Lm5hbWV9YFxyXG4gICAgICAgICAgICAvLyB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBTMyBzb3VyY2UgYWN0aW9uIChHaXRIdWIgZmlsZXMgaW4gUzMpLlxyXG4gICAgICAgICAgICAvLyBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHNvdXJjZUFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XHJcbiAgICAgICAgICAgIC8vICAgICBhY3Rpb25OYW1lOiBgczMtc291cmNlLSR7ZW52aXJvbm1lbnQubmFtZX1gLFxyXG4gICAgICAgICAgICAvLyAgICAgYnVja2V0OiBnaXRIdWJCcmFuY2hCdWNrZXQsXHJcbiAgICAgICAgICAgIC8vICAgICBidWNrZXRLZXk6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAvLyAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXRcclxuICAgICAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsIGBDZGtDb2RlUGlwZWxpbmUke2Vudmlyb25tZW50TmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiBgY2RrLXBpcGVsaW5lLSR7ZW52aXJvbm1lbnQubmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgY3Jvc3NBY2NvdW50S2V5czogdHJ1ZSwgLy8gUmVxdWlyZWQgZm9yIGNyb3NzIGFjY291bnQgZGVwbG95cy5cclxuICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW52OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFNUQUdFOiBlbnZpcm9ubWVudC5uYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dDogcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5zMyhnaXRIdWJCcmFuY2hCdWNrZXQsIGJyYW5jaEZpbGVOYW1lKSxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogWyducG0gaW5zdGFsbCcsICducG0gLWcgaW5zdGFsbCB0eXBlc2NyaXB0JywgJ25wbSBpbnN0YWxsIC1nIG54JywgJ254IGJ1aWxkIGNkaycsICdueCBzeW50aCBjZGsgLS1hcmdzPVwiLS1jb250ZXh0IHN0YWdlPSRTVEFHRVwiJ10sIC8vIEFXUyBkb2NzIGV4YW1wbGUgY29tbWFuZHM6IFsnbnBtIGNpJywgJ25wbSBydW4gYnVpbGQnLCAnbnB4IGNkayBzeW50aCddXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbWFyeU91dHB1dERpcmVjdG9yeTogJ2FwcHMvY2RrL2Nkay5vdXQnXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnRQaXBlbGluZXMucHVzaCh7IGVudmlyb25tZW50LCBwaXBlbGluZSB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdfQ==