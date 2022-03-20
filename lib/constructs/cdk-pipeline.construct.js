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
 * Continuous integration and delivery (CI/CD) using CDK Pipelines:
 * https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html
 * https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
 * https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild-readme.html
 *
 * Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html
 *
 * TODO: nx affected:
 * https://nx.dev/ci/monorepo-ci-circle-ci
 *
 *  * TODO deploy in parallel:
 * https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 *
 * TODO: Trigger apps pipeline
 * https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit
 */
class CdkPipeline extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _a, _b;
        super(scope, id);
        this.environmentPipelines = [];
        const config = new config_1.Config(this.node);
        const commands = ['npm install', 'npm -g install typescript', 'npm install -g nx', 'nx build cdk', 'nx synth cdk --args="--quiet --context stage=$STAGE"']; // AWS docs example commands: ['npm ci', 'npm run build', 'npx cdk synth']
        const primaryOutputDirectory = 'apps/cdk/cdk.out';
        const stages = new Map(Object.entries(config.stages()));
        const branchStages = new Map([...stages].filter(([_, v]) => v.branch && !v.branch.startsWith(')') && !v.branch.endsWith(')')));
        const branchRegexStages = new Map([...stages].filter(([_, v]) => v.branch && v.branch.startsWith('(') && v.branch.endsWith(')')));
        // For static branches e.g. main, test
        for (const stage of branchStages.values()) {
            const branch = (props.stage === 'prod') ? stage.branch : `${props.stage}-${stage.branch}`;
            // create a standard cdk pipeline for static branches. Performance is better (no S3 file copy required).
            const pipeline = new pipelines.CodePipeline(this, `CdkCodePipeline${changeCase.pascalCase(branch)}`, {
                pipelineName: `cdk-pipeline-${branch}`,
                crossAccountKeys: true,
                synth: new pipelines.ShellStep('Synth', {
                    env: {
                        STAGE: `${props.stage}` // The CICD stage typically test or prod.
                    },
                    // input: pipelines.CodePipelineSource.gitHub(
                    //     `${props.gitHub.owner}/${props.gitHub.repo}`,
                    //     branch,
                    //     { authentication: props.gitHub.token }
                    // ),
                    input: pipelines.CodePipelineSource.connection(`${props.gitHub.owner}/${props.gitHub.repo}`, branch, {
                        connectionArn: props.gitHub.connectionArn,
                        codeBuildCloneOutput: true
                    }),
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
                            STAGE: props.stage // The CICD stage typically test or prod.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdHJ1Y3RzL2Nkay1waXBlbGluZS5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLHVEQUF1RDtBQUN2RCwyQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLG1EQUFtRDtBQUNuRCw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw4Q0FBMkM7QUFvQjNDOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsc0JBQVM7SUFHdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3Qjs7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUhkLHlCQUFvQixHQUEyQixFQUFFLENBQUM7UUFLckQsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLENBQUMsYUFBYSxFQUFFLDJCQUEyQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxzREFBc0QsQ0FBQyxDQUFDLENBQUMsMEVBQTBFO1FBQ3RPLE1BQU0sc0JBQXNCLEdBQUcsa0JBQWtCLENBQUM7UUFFbEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJ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LE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywwQ0FBMEM7Z0JBQ25GLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUN4RDtTQUNKO0lBQ0wsQ0FBQztDQUNKO0FBN0hELGtDQTZIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcclxuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG5pbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NsYXNzZXMvY29uZmlnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNka1BpcGVsaW5lUHJvcHMge1xyXG4gICAgc3RhZ2U6IHN0cmluZztcclxuICAgIGdpdEh1YjogSUNka1BpcGVsaW5lR2l0SHViUHJvcHM7XHJcbiAgICBjb21tYW5kcz86IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDZGtQaXBlbGluZUdpdEh1YlByb3BzIHtcclxuICAgIG93bmVyOiBzdHJpbmc7XHJcbiAgICByZXBvOiBzdHJpbmc7XHJcbiAgICAvLyB0b2tlbjogY2RrLlNlY3JldFZhbHVlO1xyXG4gICAgY29ubmVjdGlvbkFybjogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnZpcm9ubWVudFBpcGVsaW5lIHtcclxuICAgIGJyYW5jaDogc3RyaW5nO1xyXG4gICAgcGlwZWxpbmU6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb250aW51b3VzIGludGVncmF0aW9uIGFuZCBkZWxpdmVyeSAoQ0kvQ0QpIHVzaW5nIENESyBQaXBlbGluZXM6XHJcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvdjIvZ3VpZGUvY2RrX3BpcGVsaW5lLmh0bWxcclxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5hd3NfY29kZWJ1aWxkLXJlYWRtZS5odG1sXHJcbiAqXHJcbiAqIEJ1aWxkIFNwZWMgUmVmZXJlbmNlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvYnVpbGQtc3BlYy1yZWYuaHRtbFxyXG4gKlxyXG4gKiBUT0RPOiBueCBhZmZlY3RlZDpcclxuICogaHR0cHM6Ly9ueC5kZXYvY2kvbW9ub3JlcG8tY2ktY2lyY2xlLWNpXHJcbiAqXHJcbiAqICAqIFRPRE8gZGVwbG95IGluIHBhcmFsbGVsOlxyXG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92MS9kb2NzL3BpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKlxyXG4gKiBUT0RPOiBUcmlnZ2VyIGFwcHMgcGlwZWxpbmVcclxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjI4NTc5MjUvaG93LXRvLWludm9rZS1hLXBpcGVsaW5lLWJhc2VkLW9uLWFub3RoZXItcGlwZWxpbmUtc3VjY2Vzcy11c2luZy1hd3MtY29kZWNvbW1pdFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudFBpcGVsaW5lczogSUVudmlyb25tZW50UGlwZWxpbmVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQ2RrUGlwZWxpbmVQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBjb21tYW5kcyA9IFsnbnBtIGluc3RhbGwnLCAnbnBtIC1nIGluc3RhbGwgdHlwZXNjcmlwdCcsICducG0gaW5zdGFsbCAtZyBueCcsICdueCBidWlsZCBjZGsnLCAnbnggc3ludGggY2RrIC0tYXJncz1cIi0tcXVpZXQgLS1jb250ZXh0IHN0YWdlPSRTVEFHRVwiJ107IC8vIEFXUyBkb2NzIGV4YW1wbGUgY29tbWFuZHM6IFsnbnBtIGNpJywgJ25wbSBydW4gYnVpbGQnLCAnbnB4IGNkayBzeW50aCddXHJcbiAgICAgICAgY29uc3QgcHJpbWFyeU91dHB1dERpcmVjdG9yeSA9ICdhcHBzL2Nkay9jZGsub3V0JztcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhjb25maWcuc3RhZ2VzKCkhKSk7XHJcbiAgICAgICAgY29uc3QgYnJhbmNoU3RhZ2VzID0gbmV3IE1hcChbLi4uc3RhZ2VzXS5maWx0ZXIoKFtfLCB2XSkgPT4gdi5icmFuY2ggJiYgIXYuYnJhbmNoLnN0YXJ0c1dpdGgoJyknKSAmJiAhdi5icmFuY2guZW5kc1dpdGgoJyknKSkpO1xyXG4gICAgICAgIGNvbnN0IGJyYW5jaFJlZ2V4U3RhZ2VzID0gbmV3IE1hcChbLi4uc3RhZ2VzXS5maWx0ZXIoKFtfLCB2XSkgPT4gdi5icmFuY2ggJiYgdi5icmFuY2guc3RhcnRzV2l0aCgnKCcpICYmIHYuYnJhbmNoLmVuZHNXaXRoKCcpJykpKTtcclxuXHJcbiAgICAgICAgLy8gRm9yIHN0YXRpYyBicmFuY2hlcyBlLmcuIG1haW4sIHRlc3RcclxuICAgICAgICBmb3IgKGNvbnN0IHN0YWdlIG9mIGJyYW5jaFN0YWdlcy52YWx1ZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYnJhbmNoID0gKHByb3BzLnN0YWdlID09PSAncHJvZCcpID8gc3RhZ2UuYnJhbmNoIDogYCR7cHJvcHMuc3RhZ2V9LSR7c3RhZ2UuYnJhbmNofWA7XHJcblxyXG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBzdGFuZGFyZCBjZGsgcGlwZWxpbmUgZm9yIHN0YXRpYyBicmFuY2hlcy4gUGVyZm9ybWFuY2UgaXMgYmV0dGVyIChubyBTMyBmaWxlIGNvcHkgcmVxdWlyZWQpLlxyXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsIGBDZGtDb2RlUGlwZWxpbmUke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShicmFuY2gpfWAsIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogYGNkay1waXBlbGluZS0ke2JyYW5jaH1gLFxyXG4gICAgICAgICAgICAgICAgY3Jvc3NBY2NvdW50S2V5czogdHJ1ZSwgLy8gUmVxdWlyZWQgZm9yIGNyb3NzIGFjY291bnQgZGVwbG95cy5cclxuICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW52OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFNUQUdFOiBgJHtwcm9wcy5zdGFnZX1gIC8vIFRoZSBDSUNEIHN0YWdlIHR5cGljYWxseSB0ZXN0IG9yIHByb2QuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBpbnB1dDogcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5naXRIdWIoXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGAke3Byb3BzLmdpdEh1Yi5vd25lcn0vJHtwcm9wcy5naXRIdWIucmVwb31gLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBicmFuY2gsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHsgYXV0aGVudGljYXRpb246IHByb3BzLmdpdEh1Yi50b2tlbiB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gKSxcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dDogcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5jb25uZWN0aW9uKGAke3Byb3BzLmdpdEh1Yi5vd25lcn0vJHtwcm9wcy5naXRIdWIucmVwb31gLCBicmFuY2gsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbkFybjogcHJvcHMuZ2l0SHViLmNvbm5lY3Rpb25Bcm4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVCdWlsZENsb25lT3V0cHV0OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IHByb3BzLmNvbW1hbmRzID8/IGNvbW1hbmRzLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3RvcnlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudFBpcGVsaW5lcy5wdXNoKHsgYnJhbmNoLCBwaXBlbGluZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChicmFuY2hSZWdleFN0YWdlcy5zaXplKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBidWNrZXQgdG8gc2F2ZSBnaXRodWIgc2FuZGJveCBmZWF0dXJlIGJyYW5jaCBmaWxlcyAoYXMgemlwKS5cclxuICAgICAgICAgICAgLy8gY29uc3QgYnVja2V0TmFtZSA9IGAke2NvbmZpZy5vcmdhbml6YXRpb25OYW1lKCl9LWNkay1waXBlbGluZS0ke2FjY291bnR9YDsgLy8gTXVzdCBiZSB1bmlxdWUgYWNyb3NzIGFsbCBidWNrZXRzLlxyXG4gICAgICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIGAke2NvbmZpZy5vcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpfUNka1BpcGVsaW5lQnJhbmNoYCwge1xyXG4gICAgICAgICAgICAgICAgLy8gYnVja2V0TmFtZSxcclxuICAgICAgICAgICAgICAgIHZlcnNpb25lZDogdHJ1ZSwgLy8gVmVyc2lvbiBidWNrZXQgdG8gdXNlIGFzIENvZGVQaXBlbGluZSBzb3VyY2UuXHJcbiAgICAgICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSwgLy8gVE9ETzogSXMgdGhpcyBuZWVkZWQ/XHJcbiAgICAgICAgICAgICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxyXG4gICAgICAgICAgICAgICAgZW5mb3JjZVNTTDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIERlc3Ryb3kgYnVja2V0IG9uIHN0YWNrIGRlbGV0ZS5cclxuICAgICAgICAgICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlIC8vIERlbGV0ZSBhbGwgYnVja2V0IG9iamVjdHMgb24gZGVzdG9yeS5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtzdGFnZU5hbWUsIHN0YWdlXSBvZiBicmFuY2hSZWdleFN0YWdlcy5lbnRyaWVzKCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBicmFuY2hGaWxlTmFtZSA9IGBicmFuY2gtJHtzdGFnZU5hbWV9LnppcGA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFnZU5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHN0YWdlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYnJhbmNoUmVnZXggPSAocHJvcHMuc3RhZ2UgPT09ICdwcm9kJykgPyBzdGFnZS5icmFuY2ggOiBbc3RhZ2UuYnJhbmNoLnNsaWNlKDAsIDEpLCBgLSR7cHJvcHMuc3RhZ2V9YCwgc3RhZ2UuYnJhbmNoLnNsaWNlKDEpXS5qb2luKCcnKTsgLy8gZS5nLiBtYWluLCAoLXRlc3QtbWFpbi0pXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGdpdGh1YiBzb3VyY2UgKHNhbmRib3ggZmVhdHVyZSBicmFuY2gpLlxyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2l0SHViQnJhbmNoU291cmNlID0gY29kZWJ1aWxkXHJcbiAgICAgICAgICAgICAgICAgICAgLlNvdXJjZS5naXRIdWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogcHJvcHMuZ2l0SHViLm93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBvOiBwcm9wcy5naXRIdWIucmVwbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hTdWJtb2R1bGVzOiB0cnVlLCAvLyBGb3IgYWxsIEdpdCBzb3VyY2VzLCB5b3UgY2FuIGZldGNoIHN1Ym1vZHVsZXMgd2hpbGUgY2xvaW5nIGdpdCByZXBvLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJob29rOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJob29rRmlsdGVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXNOb3QoJ21haW4nKSAvLyBGb3IgYWRkaXRpb25hbCBwcm90ZWN0aW9uIG9ubHkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZEJyYW5jaElzKGAuKiR7YnJhbmNoUmVnZXh9LipgKSAvLyBlLmcuIHByb2QgPSBtdi1zYW5kYm94MS1teS1mZWF0dXJlLCB0ZXN0ID0gbXYtdGVzdC1zYW5kYm94MS1teS1mZWF0dXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYnVpbGQgcHJvamVjdCAodG8gY29weSBmZWF0dXJlIGJyYW5jaCBmaWxlcyB0byBTMyBvbiBnaXRodWIgcHVzaCkuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnaXRodWJDb2RlQnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHRoaXMsIGBHaXRodWJDb2RlQnVpbGRQcm9qZWN0JHtzdGFnZU5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogYGNvcHktZ2l0aHViLSR7c3RhZ2VOYW1lfS1icmFuY2gtdG8tczNgLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogMC4yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiAnKiovKidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZ2l0SHViQnJhbmNoU291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFydGlmYWN0czogY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVCdWlsZElkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZVppcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ0dpdGh1YkFydGlmYWN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIENvZGVCdWlsZCBwcm9qZWN0IHJlcXVpcmVzIHBlcm1pc3Npb25zIHRvIFMzIGJ1Y2tldCBvYmplY3RzLlxyXG4gICAgICAgICAgICAgICAgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdC5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnLCAnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVja2V0LmJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYCR7YnVja2V0LmJ1Y2tldEFybn0vKmBcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCBgQ2RrQ29kZVBpcGVsaW5lJHtzdGFnZU5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBwaXBlbGluZU5hbWU6IGBjZGstcGlwZWxpbmUtJHtzdGFnZU5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU1RBR0U6IHByb3BzLnN0YWdlIC8vIFRoZSBDSUNEIHN0YWdlIHR5cGljYWxseSB0ZXN0IG9yIHByb2QuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLnMzKGJ1Y2tldCwgYnJhbmNoRmlsZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogcHJvcHMuY29tbWFuZHMgPz8gY29tbWFuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3RvcnlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYnJhbmNoID0gYnJhbmNoUmVnZXguc2xpY2UoMSwgLTEpOyAvLyBSZW1vdmUgcGFyZW50aGVzaXMgZmlyc3QgYW5kIGxhc3QgY2hhci5cclxuICAgICAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnRQaXBlbGluZXMucHVzaCh7IGJyYW5jaCwgcGlwZWxpbmUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19