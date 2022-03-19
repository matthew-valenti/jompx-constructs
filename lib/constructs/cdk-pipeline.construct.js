"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipeline = void 0;
const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
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
class CdkPipeline extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _a, _b;
        super(scope, id);
        this.environmentPipelines = [];
        const config = new config_1.Config(this.node);
        const commands = ['ls apps/cdk', 'npm install', 'npm -g install typescript', 'npm install -g nx', 'nx build cdk', 'nx synth cdk --args="--quiet --context stage=$STAGE"', 'ls apps/cdk/', 'ls apps/cdk/cdk.out/']; // AWS docs example commands: ['npm ci', 'npm run build', 'npx cdk synth']
        const primaryOutputDirectory = 'apps/cdk/cdk.out';
        const stages = new Map(Object.entries(config.stages()));
        const branchStages = new Map([...stages].filter(([_, v]) => v.branch && !v.branch.startsWith(')') && !v.branch.endsWith(')')));
        const branchRegexStages = new Map([...stages].filter(([_, v]) => v.branch && v.branch.startsWith('(') && v.branch.endsWith(')')));
        // For static branches e.g. main, test
        for (const [stageName, stage] of branchStages.entries()) {
            const branch = (props.stage === 'prod') ? stage.branch : `${props.stage}-${stage.branch}`;
            // create a standard cdk pipeline for static branches. Performance is better (no S3 file copy required).
            const pipeline = new pipelines.CodePipeline(this, `CdkCodePipeline${changeCase.pascalCase(branch)}`, {
                pipelineName: `cdk-pipeline-${branch}`,
                crossAccountKeys: true,
                synth: new pipelines.ShellStep('Synth', {
                    env: {
                        STAGE: `${stageName}`
                    },
                    input: pipelines.CodePipelineSource.gitHub(`${props.gitHub.owner}/${props.gitHub.repo}`, branch, { authentication: props.gitHub.token }),
                    commands: (_a = props.commands) !== null && _a !== void 0 ? _a : commands,
                    primaryOutputDirectory
                })
            });
            this.environmentPipelines.push({ branch, pipeline });
        }
        if (branchRegexStages.size) {
            // Create bucket to save github sandbox feature branch files (as zip).
            // const bucketName = `${config.organizationName()}-cdk-pipeline-${account}`; // Must be unique across all buckets.
            const bucket = new s3.Bucket(this, `${config.organizationNamePascalCase()}CdkPipelineBranch`, {
                // bucketName,
                versioned: true,
                publicReadAccess: false,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                enforceSSL: true,
                removalPolicy: cdk.RemovalPolicy.DESTROY,
                autoDeleteObjects: true // Delete all bucket objects on destory.
            });
            for (const [stageName, stage] of branchRegexStages.entries()) {
                const branchFileName = `branch-${stageName}.zip`;
                const stageNamePascalCase = changeCase.pascalCase(stageName);
                const branchRegex = (props.stage === 'prod') ? stage.branch : [stage.branch.slice(0, 1), `-${props.stage}`, stage.branch.slice(1)].join(''); // e.g. main, (-test-main-)
                console.log('branchRegex', branchRegex);
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
                            .andBranchIs(`.*${branchRegex}.*`) // e.g. prod = mv-sandbox1-my-feature, test = mv-test-sandbox1-my-feature
                    ]
                });
                // Create build project (to copy feature branch files to S3 on github push).
                const githubCodeBuildProject = new codebuild.Project(this, `GithubCodeBuildProject${stageNamePascalCase}`, {
                    projectName: `copy-github-${stageName}-branch-to-s3`,
                    buildSpec: codebuild.BuildSpec.fromObject({
                        version: 0.2,
                        artifacts: {
                            files: '**/*'
                        }
                    }),
                    source: gitHubBranchSource,
                    artifacts: codebuild.Artifacts.s3({
                        name: branchFileName,
                        bucket,
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
                        bucket.bucketArn,
                        `${bucket.bucketArn}/*`
                    ]
                }));
                const pipeline = new pipelines.CodePipeline(this, `CdkCodePipeline${stageNamePascalCase}`, {
                    pipelineName: `cdk-pipeline-${stageName}`,
                    crossAccountKeys: true,
                    synth: new pipelines.ShellStep('Synth', {
                        env: {
                            STAGE: stageName
                        },
                        input: pipelines.CodePipelineSource.s3(bucket, branchFileName),
                        commands: (_b = props.commands) !== null && _b !== void 0 ? _b : commands,
                        primaryOutputDirectory
                    })
                });
                const branch = branchRegex.slice(1, -1); // Remove parenthesis first and last char.
                this.environmentPipelines.push({ branch, pipeline });
            }
        }
    }
}
exports.CdkPipeline = CdkPipeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdHJ1Y3RzL2Nkay1waXBlbGluZS5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLHVEQUF1RDtBQUN2RCwyQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLG1EQUFtRDtBQUNuRCw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw4Q0FBMkM7QUFtQjNDOzs7Ozs7OztHQVFHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsc0JBQVM7SUFHdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3Qjs7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUhkLHlCQUFvQixHQUEyQixFQUFFLENBQUM7UUFLckQsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSwyQkFBMkIsRUFBRSxtQkFBbUIsRUFBRSxjQUFjLEVBQUUsc0RBQXNELEVBQUUsY0FBYyxFQUFFLHNCQUFzQixDQUFDLENBQUMsQ0FBQywwRUFBMEU7UUFDN1IsTUFBTSxzQkFBc0IsR0FBRyxrQkFBa0IsQ0FBQztRQUVsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxV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QUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsMENBQTBDO2dCQUNuRixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDeEQ7U0FDSjtJQUNMLENBQUM7Q0FDSjtBQTFIRCxrQ0EwSEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XHJcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jbGFzc2VzL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDZGtQaXBlbGluZVByb3BzIHtcclxuICAgIHN0YWdlOiBzdHJpbmc7XHJcbiAgICBnaXRIdWI6IElDZGtQaXBlbGluZUdpdEh1YlByb3BzO1xyXG4gICAgY29tbWFuZHM/OiBzdHJpbmdbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2RrUGlwZWxpbmVHaXRIdWJQcm9wcyB7XHJcbiAgICBvd25lcjogc3RyaW5nO1xyXG4gICAgcmVwbzogc3RyaW5nO1xyXG4gICAgdG9rZW46IGNkay5TZWNyZXRWYWx1ZTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRW52aXJvbm1lbnRQaXBlbGluZSB7XHJcbiAgICBicmFuY2g6IHN0cmluZztcclxuICAgIHBpcGVsaW5lOiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lO1xyXG59XHJcblxyXG4vKipcclxuICogRGVwbG95IGluIHBhcmFsbGVsPyBSRUFEIFRISVM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YxL2RvY3MvcGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqIENvbnRpbnVvdXMgaW50ZWdyYXRpb24gYW5kIGRlbGl2ZXJ5IChDSS9DRCkgdXNpbmcgQ0RLIFBpcGVsaW5lczogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay92Mi9ndWlkZS9jZGtfcGlwZWxpbmUuaHRtbFxyXG4gKiBDREsgZG9jbzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogQnVpbGQgU3BlYyBSZWZlcmVuY2U6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlYnVpbGQvbGF0ZXN0L3VzZXJndWlkZS9idWlsZC1zcGVjLXJlZi5odG1sXHJcbiAqIG54IGNpY2Q6IGh0dHBzOi8vbnguZGV2L2NpL21vbm9yZXBvLWNpLWNpcmNsZS1jaVxyXG4gKlxyXG4gKiBUcmlnZ2VyIGFwcHMgcGlwZWxpbmU/Pz8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjI4NTc5MjUvaG93LXRvLWludm9rZS1hLXBpcGVsaW5lLWJhc2VkLW9uLWFub3RoZXItcGlwZWxpbmUtc3VjY2Vzcy11c2luZy1hd3MtY29kZWNvbW1pdFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudFBpcGVsaW5lczogSUVudmlyb25tZW50UGlwZWxpbmVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQ2RrUGlwZWxpbmVQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBjb21tYW5kcyA9IFsnbHMgYXBwcy9jZGsnLCAnbnBtIGluc3RhbGwnLCAnbnBtIC1nIGluc3RhbGwgdHlwZXNjcmlwdCcsICducG0gaW5zdGFsbCAtZyBueCcsICdueCBidWlsZCBjZGsnLCAnbnggc3ludGggY2RrIC0tYXJncz1cIi0tcXVpZXQgLS1jb250ZXh0IHN0YWdlPSRTVEFHRVwiJywgJ2xzIGFwcHMvY2RrLycsICdscyBhcHBzL2Nkay9jZGsub3V0LyddOyAvLyBBV1MgZG9jcyBleGFtcGxlIGNvbW1hbmRzOiBbJ25wbSBjaScsICducG0gcnVuIGJ1aWxkJywgJ25weCBjZGsgc3ludGgnXVxyXG4gICAgICAgIGNvbnN0IHByaW1hcnlPdXRwdXREaXJlY3RvcnkgPSAnYXBwcy9jZGsvY2RrLm91dCc7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YWdlcyA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoY29uZmlnLnN0YWdlcygpISkpO1xyXG4gICAgICAgIGNvbnN0IGJyYW5jaFN0YWdlcyA9IG5ldyBNYXAoWy4uLnN0YWdlc10uZmlsdGVyKChbXywgdl0pID0+IHYuYnJhbmNoICYmICF2LmJyYW5jaC5zdGFydHNXaXRoKCcpJykgJiYgIXYuYnJhbmNoLmVuZHNXaXRoKCcpJykpKTtcclxuICAgICAgICBjb25zdCBicmFuY2hSZWdleFN0YWdlcyA9IG5ldyBNYXAoWy4uLnN0YWdlc10uZmlsdGVyKChbXywgdl0pID0+IHYuYnJhbmNoICYmIHYuYnJhbmNoLnN0YXJ0c1dpdGgoJygnKSAmJiB2LmJyYW5jaC5lbmRzV2l0aCgnKScpKSk7XHJcblxyXG4gICAgICAgIC8vIEZvciBzdGF0aWMgYnJhbmNoZXMgZS5nLiBtYWluLCB0ZXN0XHJcbiAgICAgICAgZm9yIChjb25zdCBbc3RhZ2VOYW1lLCBzdGFnZV0gb2YgYnJhbmNoU3RhZ2VzLmVudHJpZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYnJhbmNoID0gKHByb3BzLnN0YWdlID09PSAncHJvZCcpID8gc3RhZ2UuYnJhbmNoIDogYCR7cHJvcHMuc3RhZ2V9LSR7c3RhZ2UuYnJhbmNofWA7XHJcblxyXG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBzdGFuZGFyZCBjZGsgcGlwZWxpbmUgZm9yIHN0YXRpYyBicmFuY2hlcy4gUGVyZm9ybWFuY2UgaXMgYmV0dGVyIChubyBTMyBmaWxlIGNvcHkgcmVxdWlyZWQpLlxyXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsIGBDZGtDb2RlUGlwZWxpbmUke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShicmFuY2gpfWAsIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogYGNkay1waXBlbGluZS0ke2JyYW5jaH1gLFxyXG4gICAgICAgICAgICAgICAgY3Jvc3NBY2NvdW50S2V5czogdHJ1ZSwgLy8gUmVxdWlyZWQgZm9yIGNyb3NzIGFjY291bnQgZGVwbG95cy5cclxuICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW52OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFNUQUdFOiBgJHtzdGFnZU5hbWV9YFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuZ2l0SHViKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtwcm9wcy5naXRIdWIub3duZXJ9LyR7cHJvcHMuZ2l0SHViLnJlcG99YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJhbmNoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGF1dGhlbnRpY2F0aW9uOiBwcm9wcy5naXRIdWIudG9rZW4gfVxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IHByb3BzLmNvbW1hbmRzID8/IGNvbW1hbmRzLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3RvcnlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudFBpcGVsaW5lcy5wdXNoKHsgYnJhbmNoLCBwaXBlbGluZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChicmFuY2hSZWdleFN0YWdlcy5zaXplKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBidWNrZXQgdG8gc2F2ZSBnaXRodWIgc2FuZGJveCBmZWF0dXJlIGJyYW5jaCBmaWxlcyAoYXMgemlwKS5cclxuICAgICAgICAgICAgLy8gY29uc3QgYnVja2V0TmFtZSA9IGAke2NvbmZpZy5vcmdhbml6YXRpb25OYW1lKCl9LWNkay1waXBlbGluZS0ke2FjY291bnR9YDsgLy8gTXVzdCBiZSB1bmlxdWUgYWNyb3NzIGFsbCBidWNrZXRzLlxyXG4gICAgICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIGAke2NvbmZpZy5vcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpfUNka1BpcGVsaW5lQnJhbmNoYCwge1xyXG4gICAgICAgICAgICAgICAgLy8gYnVja2V0TmFtZSxcclxuICAgICAgICAgICAgICAgIHZlcnNpb25lZDogdHJ1ZSwgLy8gVmVyc2lvbiBidWNrZXQgdG8gdXNlIGFzIENvZGVQaXBlbGluZSBzb3VyY2UuXHJcbiAgICAgICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSwgLy8gVE9ETzogSXMgdGhpcyBuZWVkZWQ/XHJcbiAgICAgICAgICAgICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxyXG4gICAgICAgICAgICAgICAgZW5mb3JjZVNTTDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIERlc3Ryb3kgYnVja2V0IG9uIHN0YWNrIGRlbGV0ZS5cclxuICAgICAgICAgICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlIC8vIERlbGV0ZSBhbGwgYnVja2V0IG9iamVjdHMgb24gZGVzdG9yeS5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtzdGFnZU5hbWUsIHN0YWdlXSBvZiBicmFuY2hSZWdleFN0YWdlcy5lbnRyaWVzKCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBicmFuY2hGaWxlTmFtZSA9IGBicmFuY2gtJHtzdGFnZU5hbWV9LnppcGA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFnZU5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHN0YWdlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYnJhbmNoUmVnZXggPSAocHJvcHMuc3RhZ2UgPT09ICdwcm9kJykgPyBzdGFnZS5icmFuY2ggOiBbc3RhZ2UuYnJhbmNoLnNsaWNlKDAsIDEpLCBgLSR7cHJvcHMuc3RhZ2V9YCwgc3RhZ2UuYnJhbmNoLnNsaWNlKDEpXS5qb2luKCcnKTsgLy8gZS5nLiBtYWluLCAoLXRlc3QtbWFpbi0pXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYnJhbmNoUmVnZXgnLCBicmFuY2hSZWdleCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGdpdGh1YiBzb3VyY2UgKHNhbmRib3ggZmVhdHVyZSBicmFuY2gpLlxyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2l0SHViQnJhbmNoU291cmNlID0gY29kZWJ1aWxkXHJcbiAgICAgICAgICAgICAgICAgICAgLlNvdXJjZS5naXRIdWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogcHJvcHMuZ2l0SHViLm93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBvOiBwcm9wcy5naXRIdWIucmVwbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hTdWJtb2R1bGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJob29rOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJob29rRmlsdGVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXNOb3QoJ21haW4nKSAvLyBGb3IgYWRkaXRpb25hbCBwcm90ZWN0aW9uIG9ubHkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZEJyYW5jaElzKGAuKiR7YnJhbmNoUmVnZXh9LipgKSAvLyBlLmcuIHByb2QgPSBtdi1zYW5kYm94MS1teS1mZWF0dXJlLCB0ZXN0ID0gbXYtdGVzdC1zYW5kYm94MS1teS1mZWF0dXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYnVpbGQgcHJvamVjdCAodG8gY29weSBmZWF0dXJlIGJyYW5jaCBmaWxlcyB0byBTMyBvbiBnaXRodWIgcHVzaCkuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnaXRodWJDb2RlQnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHRoaXMsIGBHaXRodWJDb2RlQnVpbGRQcm9qZWN0JHtzdGFnZU5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogYGNvcHktZ2l0aHViLSR7c3RhZ2VOYW1lfS1icmFuY2gtdG8tczNgLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogMC4yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiAnKiovKidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZ2l0SHViQnJhbmNoU291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFydGlmYWN0czogY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVCdWlsZElkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZVppcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ0dpdGh1YkFydGlmYWN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIENvZGVCdWlsZCBwcm9qZWN0IHJlcXVpcmVzIHBlcm1pc3Npb25zIHRvIFMzIGJ1Y2tldCBvYmplY3RzLlxyXG4gICAgICAgICAgICAgICAgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdC5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnLCAnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVja2V0LmJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYCR7YnVja2V0LmJ1Y2tldEFybn0vKmBcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCBgQ2RrQ29kZVBpcGVsaW5lJHtzdGFnZU5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBwaXBlbGluZU5hbWU6IGBjZGstcGlwZWxpbmUtJHtzdGFnZU5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU1RBR0U6IHN0YWdlTmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dDogcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5zMyhidWNrZXQsIGJyYW5jaEZpbGVOYW1lKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IHByb3BzLmNvbW1hbmRzID8/IGNvbW1hbmRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmltYXJ5T3V0cHV0RGlyZWN0b3J5XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJyYW5jaCA9IGJyYW5jaFJlZ2V4LnNsaWNlKDEsIC0xKTsgLy8gUmVtb3ZlIHBhcmVudGhlc2lzIGZpcnN0IGFuZCBsYXN0IGNoYXIuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmVudmlyb25tZW50UGlwZWxpbmVzLnB1c2goeyBicmFuY2gsIHBpcGVsaW5lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==