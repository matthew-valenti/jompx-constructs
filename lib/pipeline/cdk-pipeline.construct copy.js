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
const config_1 = require("../config/config");
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
                    // TODO: Allow GitHub token option.
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
            const bucket = new s3.Bucket(this, `${config.organizationNamePascalCase()}CdkPipelineBranch`, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLmNvbnN0cnVjdCBjb3B5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BpcGVsaW5lL2Nkay1waXBlbGluZS5jb25zdHJ1Y3QgY29weS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBQ3ZELDJDQUEyQztBQUMzQyx5Q0FBeUM7QUFDekMsbURBQW1EO0FBQ25ELDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsMkNBQXVDO0FBQ3ZDLDZDQUEwQztBQW9CMUM7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFhLFdBQVksU0FBUSxzQkFBUztJQUd0QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCOztRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSGQseUJBQW9CLEdBQTJCLEVBQUUsQ0FBQztRQUtyRCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxhQUFhLEVBQUUsMkJBQTJCLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLHNEQUFzRCxDQUFDLENBQUMsQ0FBQywwRUFBMEU7UUFDdE8sTUFBTSxzQkFBc0IsR0FBRyxrQkFBa0IsQ0FBQztRQUVsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxD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QUFNLE1BQU0sR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsMENBQTBDO2dCQUNuRixJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDeEQ7U0FDSjtJQUNMLENBQUM7Q0FDSjtBQTVIRCxrQ0E0SEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XHJcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuaW1wb3J0ICogYXMgcGlwZWxpbmVzIGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNka1BpcGVsaW5lUHJvcHMge1xyXG4gICAgc3RhZ2U6IHN0cmluZztcclxuICAgIGdpdEh1YjogSUNka1BpcGVsaW5lR2l0SHViUHJvcHM7XHJcbiAgICBjb21tYW5kcz86IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDZGtQaXBlbGluZUdpdEh1YlByb3BzIHtcclxuICAgIG93bmVyOiBzdHJpbmc7XHJcbiAgICByZXBvOiBzdHJpbmc7XHJcbiAgICAvLyB0b2tlbjogY2RrLlNlY3JldFZhbHVlOyAvLyBUT0RPOiBBbGxvdyBHaXRIdWIgdG9rZW4gb3B0aW9uLlxyXG4gICAgY29ubmVjdGlvbkFybjogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElFbnZpcm9ubWVudFBpcGVsaW5lIHtcclxuICAgIGJyYW5jaDogc3RyaW5nO1xyXG4gICAgcGlwZWxpbmU6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb250aW51b3VzIGludGVncmF0aW9uIGFuZCBkZWxpdmVyeSAoQ0kvQ0QpIHVzaW5nIENESyBQaXBlbGluZXM6XHJcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvdjIvZ3VpZGUvY2RrX3BpcGVsaW5lLmh0bWxcclxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5hd3NfY29kZWJ1aWxkLXJlYWRtZS5odG1sXHJcbiAqXHJcbiAqIEJ1aWxkIFNwZWMgUmVmZXJlbmNlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvYnVpbGQtc3BlYy1yZWYuaHRtbFxyXG4gKlxyXG4gKiBUT0RPOiBueCBhZmZlY3RlZDpcclxuICogaHR0cHM6Ly9ueC5kZXYvY2kvbW9ub3JlcG8tY2ktY2lyY2xlLWNpXHJcbiAqXHJcbiAqICAqIFRPRE8gZGVwbG95IGluIHBhcmFsbGVsOlxyXG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92MS9kb2NzL3BpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKlxyXG4gKiBUT0RPOiBUcmlnZ2VyIGFwcHMgcGlwZWxpbmVcclxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjI4NTc5MjUvaG93LXRvLWludm9rZS1hLXBpcGVsaW5lLWJhc2VkLW9uLWFub3RoZXItcGlwZWxpbmUtc3VjY2Vzcy11c2luZy1hd3MtY29kZWNvbW1pdFxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudFBpcGVsaW5lczogSUVudmlyb25tZW50UGlwZWxpbmVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQ2RrUGlwZWxpbmVQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBjb21tYW5kcyA9IFsnbnBtIGluc3RhbGwnLCAnbnBtIC1nIGluc3RhbGwgdHlwZXNjcmlwdCcsICducG0gaW5zdGFsbCAtZyBueCcsICdueCBidWlsZCBjZGsnLCAnbnggc3ludGggY2RrIC0tYXJncz1cIi0tcXVpZXQgLS1jb250ZXh0IHN0YWdlPSRTVEFHRVwiJ107IC8vIEFXUyBkb2NzIGV4YW1wbGUgY29tbWFuZHM6IFsnbnBtIGNpJywgJ25wbSBydW4gYnVpbGQnLCAnbnB4IGNkayBzeW50aCddXHJcbiAgICAgICAgY29uc3QgcHJpbWFyeU91dHB1dERpcmVjdG9yeSA9ICdhcHBzL2Nkay9jZGsub3V0JztcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhjb25maWcuc3RhZ2VzKCkhKSk7XHJcbiAgICAgICAgY29uc3QgYnJhbmNoU3RhZ2VzID0gbmV3IE1hcChbLi4uc3RhZ2VzXS5maWx0ZXIoKFtfLCB2XSkgPT4gdi5icmFuY2ggJiYgIXYuYnJhbmNoLnN0YXJ0c1dpdGgoJyknKSAmJiAhdi5icmFuY2guZW5kc1dpdGgoJyknKSkpO1xyXG4gICAgICAgIGNvbnN0IGJyYW5jaFJlZ2V4U3RhZ2VzID0gbmV3IE1hcChbLi4uc3RhZ2VzXS5maWx0ZXIoKFtfLCB2XSkgPT4gdi5icmFuY2ggJiYgdi5icmFuY2guc3RhcnRzV2l0aCgnKCcpICYmIHYuYnJhbmNoLmVuZHNXaXRoKCcpJykpKTtcclxuXHJcbiAgICAgICAgLy8gRm9yIHN0YXRpYyBicmFuY2hlcyBlLmcuIG1haW4sIHRlc3RcclxuICAgICAgICBmb3IgKGNvbnN0IHN0YWdlIG9mIGJyYW5jaFN0YWdlcy52YWx1ZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYnJhbmNoID0gKHByb3BzLnN0YWdlID09PSAncHJvZCcpID8gc3RhZ2UuYnJhbmNoIDogYCR7cHJvcHMuc3RhZ2V9LSR7c3RhZ2UuYnJhbmNofWA7XHJcblxyXG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBzdGFuZGFyZCBjZGsgcGlwZWxpbmUgZm9yIHN0YXRpYyBicmFuY2hlcy4gUGVyZm9ybWFuY2UgaXMgYmV0dGVyIChubyBTMyBmaWxlIGNvcHkgcmVxdWlyZWQpLlxyXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsIGBDZGtDb2RlUGlwZWxpbmUke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShicmFuY2gpfWAsIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogYGNkay1waXBlbGluZS0ke2JyYW5jaH1gLFxyXG4gICAgICAgICAgICAgICAgY3Jvc3NBY2NvdW50S2V5czogdHJ1ZSwgLy8gUmVxdWlyZWQgZm9yIGNyb3NzIGFjY291bnQgZGVwbG95cy5cclxuICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW52OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFNUQUdFOiBgJHtwcm9wcy5zdGFnZX1gIC8vIFRoZSBDSUNEIHN0YWdlIHR5cGljYWxseSB0ZXN0IG9yIHByb2QuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBBbGxvdyBHaXRIdWIgdG9rZW4gb3B0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLmdpdEh1YihcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgYCR7cHJvcHMuZ2l0SHViLm93bmVyfS8ke3Byb3BzLmdpdEh1Yi5yZXBvfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGJyYW5jaCxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgeyBhdXRoZW50aWNhdGlvbjogcHJvcHMuZ2l0SHViLnRva2VuIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyApLFxyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLmNvbm5lY3Rpb24oYCR7cHJvcHMuZ2l0SHViLm93bmVyfS8ke3Byb3BzLmdpdEh1Yi5yZXBvfWAsIGJyYW5jaCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uQXJuOiBwcm9wcy5naXRIdWIuY29ubmVjdGlvbkFybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZUJ1aWxkQ2xvbmVPdXRwdXQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogcHJvcHMuY29tbWFuZHMgPz8gY29tbWFuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbWFyeU91dHB1dERpcmVjdG9yeVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50UGlwZWxpbmVzLnB1c2goeyBicmFuY2gsIHBpcGVsaW5lIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGJyYW5jaFJlZ2V4U3RhZ2VzLnNpemUpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGJ1Y2tldCB0byBzYXZlIGdpdGh1YiBzYW5kYm94IGZlYXR1cmUgYnJhbmNoIGZpbGVzIChhcyB6aXApLlxyXG4gICAgICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIGAke2NvbmZpZy5vcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpfUNka1BpcGVsaW5lQnJhbmNoYCwge1xyXG4gICAgICAgICAgICAgICAgdmVyc2lvbmVkOiB0cnVlLCAvLyBWZXJzaW9uIGJ1Y2tldCB0byB1c2UgYXMgQ29kZVBpcGVsaW5lIHNvdXJjZS5cclxuICAgICAgICAgICAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLCAvLyBUT0RPOiBJcyB0aGlzIG5lZWRlZD9cclxuICAgICAgICAgICAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBzMy5CbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTEwsXHJcbiAgICAgICAgICAgICAgICBlbmZvcmNlU1NMOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSwgLy8gRGVzdHJveSBidWNrZXQgb24gc3RhY2sgZGVsZXRlLlxyXG4gICAgICAgICAgICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUgLy8gRGVsZXRlIGFsbCBidWNrZXQgb2JqZWN0cyBvbiBkZXN0b3J5LlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgW3N0YWdlTmFtZSwgc3RhZ2VdIG9mIGJyYW5jaFJlZ2V4U3RhZ2VzLmVudHJpZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJyYW5jaEZpbGVOYW1lID0gYGJyYW5jaC0ke3N0YWdlTmFtZX0uemlwYDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWdlTmFtZVBhc2NhbENhc2UgPSBjaGFuZ2VDYXNlLnBhc2NhbENhc2Uoc3RhZ2VOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBicmFuY2hSZWdleCA9IChwcm9wcy5zdGFnZSA9PT0gJ3Byb2QnKSA/IHN0YWdlLmJyYW5jaCA6IFtzdGFnZS5icmFuY2guc2xpY2UoMCwgMSksIGAtJHtwcm9wcy5zdGFnZX1gLCBzdGFnZS5icmFuY2guc2xpY2UoMSldLmpvaW4oJycpOyAvLyBlLmcuIG1haW4sICgtdGVzdC1tYWluLSlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgZ2l0aHViIHNvdXJjZSAoc2FuZGJveCBmZWF0dXJlIGJyYW5jaCkuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnaXRIdWJCcmFuY2hTb3VyY2UgPSBjb2RlYnVpbGRcclxuICAgICAgICAgICAgICAgICAgICAuU291cmNlLmdpdEh1Yih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBwcm9wcy5naXRIdWIub3duZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcG86IHByb3BzLmdpdEh1Yi5yZXBvLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmZXRjaFN1Ym1vZHVsZXM6IHRydWUsIC8vIEZvciBhbGwgR2l0IHNvdXJjZXMsIHlvdSBjYW4gZmV0Y2ggc3VibW9kdWxlcyB3aGlsZSBjbG9pbmcgZ2l0IHJlcG8uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYmhvb2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYmhvb2tGaWx0ZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlYnVpbGQuRmlsdGVyR3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5FdmVudE9mKGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVVNIKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmRCcmFuY2hJc05vdCgnbWFpbicpIC8vIEZvciBhZGRpdGlvbmFsIHByb3RlY3Rpb24gb25seS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXMoYC4qJHticmFuY2hSZWdleH0uKmApIC8vIGUuZy4gcHJvZCA9IG12LXNhbmRib3gxLW15LWZlYXR1cmUsIHRlc3QgPSBtdi10ZXN0LXNhbmRib3gxLW15LWZlYXR1cmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBidWlsZCBwcm9qZWN0ICh0byBjb3B5IGZlYXR1cmUgYnJhbmNoIGZpbGVzIHRvIFMzIG9uIGdpdGh1YiBwdXNoKS5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGdpdGh1YkNvZGVCdWlsZFByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3QodGhpcywgYEdpdGh1YkNvZGVCdWlsZFByb2plY3Qke3N0YWdlTmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2plY3ROYW1lOiBgY29weS1naXRodWItJHtzdGFnZU5hbWV9LWJyYW5jaC10by1zM2AsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFydGlmYWN0czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6ICcqKi8qJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBnaXRIdWJCcmFuY2hTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiBjb2RlYnVpbGQuQXJ0aWZhY3RzLnMzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYnJhbmNoRmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1Y2tldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZUJ1aWxkSWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlWmlwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnR2l0aHViQXJ0aWZhY3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gQ29kZUJ1aWxkIHByb2plY3QgcmVxdWlyZXMgcGVybWlzc2lvbnMgdG8gUzMgYnVja2V0IG9iamVjdHMuXHJcbiAgICAgICAgICAgICAgICBnaXRodWJDb2RlQnVpbGRQcm9qZWN0LmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnczM6TGlzdEJ1Y2tldCcsICdzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0JywgJ3MzOkRlbGV0ZU9iamVjdCddLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWNrZXQuYnVja2V0QXJuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtidWNrZXQuYnVja2V0QXJufS8qYFxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsIGBDZGtDb2RlUGlwZWxpbmUke3N0YWdlTmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogYGNkay1waXBlbGluZS0ke3N0YWdlTmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgICAgIGNyb3NzQWNjb3VudEtleXM6IHRydWUsIC8vIFJlcXVpcmVkIGZvciBjcm9zcyBhY2NvdW50IGRlcGxveXMuXHJcbiAgICAgICAgICAgICAgICAgICAgc3ludGg6IG5ldyBwaXBlbGluZXMuU2hlbGxTdGVwKCdTeW50aCcsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTVEFHRTogcHJvcHMuc3RhZ2UgLy8gVGhlIENJQ0Qgc3RhZ2UgdHlwaWNhbGx5IHRlc3Qgb3IgcHJvZC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuczMoYnVja2V0LCBicmFuY2hGaWxlTmFtZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBwcm9wcy5jb21tYW5kcyA/PyBjb21tYW5kcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJpbWFyeU91dHB1dERpcmVjdG9yeVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBicmFuY2ggPSBicmFuY2hSZWdleC5zbGljZSgxLCAtMSk7IC8vIFJlbW92ZSBwYXJlbnRoZXNpcyBmaXJzdCBhbmQgbGFzdCBjaGFyLlxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudFBpcGVsaW5lcy5wdXNoKHsgYnJhbmNoLCBwaXBlbGluZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=