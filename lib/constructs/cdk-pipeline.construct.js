"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdkPipeline = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
        var _b, _c;
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
                    input: pipelines.CodePipelineSource.gitHub(`${props.gitHub.owner}/${props.gitHub.repo}`, branch, { authentication: props.gitHub.token }),
                    commands: (_b = props.commands) !== null && _b !== void 0 ? _b : commands,
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
                        commands: (_c = props.commands) !== null && _c !== void 0 ? _c : commands,
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
_a = JSII_RTTI_SYMBOL_1;
CdkPipeline[_a] = { fqn: "@jompx/constructs.CdkPipeline", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb25zdHJ1Y3RzL2Nkay1waXBlbGluZS5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQXVEO0FBQ3ZELDJDQUEyQztBQUMzQyx5Q0FBeUM7QUFDekMsbURBQW1EO0FBQ25ELDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsMkNBQXVDO0FBQ3ZDLDhDQUEyQztBQW1CM0M7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFhLFdBQVksU0FBUSxzQkFBUztJQUd0QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCOztRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSGQseUJBQW9CLEdBQTJCLEVBQUUsQ0FBQztRQUtyRCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxhQUFhLEVBQUUsMkJBQTJCLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLHNEQUFzRCxDQUFDLENBQUMsQ0FBQywwRUFBMEU7UUFDdE8sTUFBTSxzQkFBc0IsR0FBRyxrQkFBa0IsQ0FBQztRQUVsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxZQUFZLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxD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QkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQzthQUN4RDtTQUNKO0lBQ0wsQ0FBQzs7QUF4SEwsa0NBeUhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY2xhc3Nlcy9jb25maWcnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2RrUGlwZWxpbmVQcm9wcyB7XHJcbiAgICBzdGFnZTogc3RyaW5nO1xyXG4gICAgZ2l0SHViOiBJQ2RrUGlwZWxpbmVHaXRIdWJQcm9wcztcclxuICAgIGNvbW1hbmRzPzogc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNka1BpcGVsaW5lR2l0SHViUHJvcHMge1xyXG4gICAgb3duZXI6IHN0cmluZztcclxuICAgIHJlcG86IHN0cmluZztcclxuICAgIHRva2VuOiBjZGsuU2VjcmV0VmFsdWU7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudmlyb25tZW50UGlwZWxpbmUge1xyXG4gICAgYnJhbmNoOiBzdHJpbmc7XHJcbiAgICBwaXBlbGluZTogcGlwZWxpbmVzLkNvZGVQaXBlbGluZTtcclxufVxyXG5cclxuLyoqXHJcbiAqIERlcGxveSBpbiBwYXJhbGxlbD8gUkVBRCBUSElTOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92MS9kb2NzL3BpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKiBDb250aW51b3VzIGludGVncmF0aW9uIGFuZCBkZWxpdmVyeSAoQ0kvQ0QpIHVzaW5nIENESyBQaXBlbGluZXM6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvdjIvZ3VpZGUvY2RrX3BpcGVsaW5lLmh0bWxcclxuICogQ0RLIGRvY286IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIucGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqIEJ1aWxkIFNwZWMgUmVmZXJlbmNlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvYnVpbGQtc3BlYy1yZWYuaHRtbFxyXG4gKiBueCBjaWNkOiBodHRwczovL254LmRldi9jaS9tb25vcmVwby1jaS1jaXJjbGUtY2lcclxuICpcclxuICogVHJpZ2dlciBhcHBzIHBpcGVsaW5lPz8/IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYyODU3OTI1L2hvdy10by1pbnZva2UtYS1waXBlbGluZS1iYXNlZC1vbi1hbm90aGVyLXBpcGVsaW5lLXN1Y2Nlc3MtdXNpbmctYXdzLWNvZGVjb21taXRcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDZGtQaXBlbGluZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRQaXBlbGluZXM6IElFbnZpcm9ubWVudFBpcGVsaW5lW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUNka1BpcGVsaW5lUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKHRoaXMubm9kZSk7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZHMgPSBbJ25wbSBpbnN0YWxsJywgJ25wbSAtZyBpbnN0YWxsIHR5cGVzY3JpcHQnLCAnbnBtIGluc3RhbGwgLWcgbngnLCAnbnggYnVpbGQgY2RrJywgJ254IHN5bnRoIGNkayAtLWFyZ3M9XCItLXF1aWV0IC0tY29udGV4dCBzdGFnZT0kU1RBR0VcIiddOyAvLyBBV1MgZG9jcyBleGFtcGxlIGNvbW1hbmRzOiBbJ25wbSBjaScsICducG0gcnVuIGJ1aWxkJywgJ25weCBjZGsgc3ludGgnXVxyXG4gICAgICAgIGNvbnN0IHByaW1hcnlPdXRwdXREaXJlY3RvcnkgPSAnYXBwcy9jZGsvY2RrLm91dCc7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YWdlcyA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoY29uZmlnLnN0YWdlcygpISkpO1xyXG4gICAgICAgIGNvbnN0IGJyYW5jaFN0YWdlcyA9IG5ldyBNYXAoWy4uLnN0YWdlc10uZmlsdGVyKChbXywgdl0pID0+IHYuYnJhbmNoICYmICF2LmJyYW5jaC5zdGFydHNXaXRoKCcpJykgJiYgIXYuYnJhbmNoLmVuZHNXaXRoKCcpJykpKTtcclxuICAgICAgICBjb25zdCBicmFuY2hSZWdleFN0YWdlcyA9IG5ldyBNYXAoWy4uLnN0YWdlc10uZmlsdGVyKChbXywgdl0pID0+IHYuYnJhbmNoICYmIHYuYnJhbmNoLnN0YXJ0c1dpdGgoJygnKSAmJiB2LmJyYW5jaC5lbmRzV2l0aCgnKScpKSk7XHJcblxyXG4gICAgICAgIC8vIEZvciBzdGF0aWMgYnJhbmNoZXMgZS5nLiBtYWluLCB0ZXN0XHJcbiAgICAgICAgZm9yIChjb25zdCBzdGFnZSBvZiBicmFuY2hTdGFnZXMudmFsdWVzKCkpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJyYW5jaCA9IChwcm9wcy5zdGFnZSA9PT0gJ3Byb2QnKSA/IHN0YWdlLmJyYW5jaCA6IGAke3Byb3BzLnN0YWdlfS0ke3N0YWdlLmJyYW5jaH1gO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIGEgc3RhbmRhcmQgY2RrIHBpcGVsaW5lIGZvciBzdGF0aWMgYnJhbmNoZXMuIFBlcmZvcm1hbmNlIGlzIGJldHRlciAobm8gUzMgZmlsZSBjb3B5IHJlcXVpcmVkKS5cclxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCBgQ2RrQ29kZVBpcGVsaW5lJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UoYnJhbmNoKX1gLCB7XHJcbiAgICAgICAgICAgICAgICBwaXBlbGluZU5hbWU6IGBjZGstcGlwZWxpbmUtJHticmFuY2h9YCxcclxuICAgICAgICAgICAgICAgIGNyb3NzQWNjb3VudEtleXM6IHRydWUsIC8vIFJlcXVpcmVkIGZvciBjcm9zcyBhY2NvdW50IGRlcGxveXMuXHJcbiAgICAgICAgICAgICAgICBzeW50aDogbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTVEFHRTogYCR7cHJvcHMuc3RhZ2V9YCAvLyBUaGUgQ0lDRCBzdGFnZSB0eXBpY2FsbHkgdGVzdCBvciBwcm9kLlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQ6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmVTb3VyY2UuZ2l0SHViKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtwcm9wcy5naXRIdWIub3duZXJ9LyR7cHJvcHMuZ2l0SHViLnJlcG99YCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJhbmNoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGF1dGhlbnRpY2F0aW9uOiBwcm9wcy5naXRIdWIudG9rZW4gfVxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IHByb3BzLmNvbW1hbmRzID8/IGNvbW1hbmRzLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3RvcnlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudFBpcGVsaW5lcy5wdXNoKHsgYnJhbmNoLCBwaXBlbGluZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChicmFuY2hSZWdleFN0YWdlcy5zaXplKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBidWNrZXQgdG8gc2F2ZSBnaXRodWIgc2FuZGJveCBmZWF0dXJlIGJyYW5jaCBmaWxlcyAoYXMgemlwKS5cclxuICAgICAgICAgICAgLy8gY29uc3QgYnVja2V0TmFtZSA9IGAke2NvbmZpZy5vcmdhbml6YXRpb25OYW1lKCl9LWNkay1waXBlbGluZS0ke2FjY291bnR9YDsgLy8gTXVzdCBiZSB1bmlxdWUgYWNyb3NzIGFsbCBidWNrZXRzLlxyXG4gICAgICAgICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHRoaXMsIGAke2NvbmZpZy5vcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpfUNka1BpcGVsaW5lQnJhbmNoYCwge1xyXG4gICAgICAgICAgICAgICAgLy8gYnVja2V0TmFtZSxcclxuICAgICAgICAgICAgICAgIHZlcnNpb25lZDogdHJ1ZSwgLy8gVmVyc2lvbiBidWNrZXQgdG8gdXNlIGFzIENvZGVQaXBlbGluZSBzb3VyY2UuXHJcbiAgICAgICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSwgLy8gVE9ETzogSXMgdGhpcyBuZWVkZWQ/XHJcbiAgICAgICAgICAgICAgICBibG9ja1B1YmxpY0FjY2VzczogczMuQmxvY2tQdWJsaWNBY2Nlc3MuQkxPQ0tfQUxMLFxyXG4gICAgICAgICAgICAgICAgZW5mb3JjZVNTTDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIERlc3Ryb3kgYnVja2V0IG9uIHN0YWNrIGRlbGV0ZS5cclxuICAgICAgICAgICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlIC8vIERlbGV0ZSBhbGwgYnVja2V0IG9iamVjdHMgb24gZGVzdG9yeS5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IFtzdGFnZU5hbWUsIHN0YWdlXSBvZiBicmFuY2hSZWdleFN0YWdlcy5lbnRyaWVzKCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBicmFuY2hGaWxlTmFtZSA9IGBicmFuY2gtJHtzdGFnZU5hbWV9LnppcGA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFnZU5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHN0YWdlTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYnJhbmNoUmVnZXggPSAocHJvcHMuc3RhZ2UgPT09ICdwcm9kJykgPyBzdGFnZS5icmFuY2ggOiBbc3RhZ2UuYnJhbmNoLnNsaWNlKDAsIDEpLCBgLSR7cHJvcHMuc3RhZ2V9YCwgc3RhZ2UuYnJhbmNoLnNsaWNlKDEpXS5qb2luKCcnKTsgLy8gZS5nLiBtYWluLCAoLXRlc3QtbWFpbi0pXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGdpdGh1YiBzb3VyY2UgKHNhbmRib3ggZmVhdHVyZSBicmFuY2gpLlxyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2l0SHViQnJhbmNoU291cmNlID0gY29kZWJ1aWxkXHJcbiAgICAgICAgICAgICAgICAgICAgLlNvdXJjZS5naXRIdWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogcHJvcHMuZ2l0SHViLm93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBvOiBwcm9wcy5naXRIdWIucmVwbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hTdWJtb2R1bGVzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJob29rOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJob29rRmlsdGVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXNOb3QoJ21haW4nKSAvLyBGb3IgYWRkaXRpb25hbCBwcm90ZWN0aW9uIG9ubHkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZEJyYW5jaElzKGAuKiR7YnJhbmNoUmVnZXh9LipgKSAvLyBlLmcuIHByb2QgPSBtdi1zYW5kYm94MS1teS1mZWF0dXJlLCB0ZXN0ID0gbXYtdGVzdC1zYW5kYm94MS1teS1mZWF0dXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYnVpbGQgcHJvamVjdCAodG8gY29weSBmZWF0dXJlIGJyYW5jaCBmaWxlcyB0byBTMyBvbiBnaXRodWIgcHVzaCkuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnaXRodWJDb2RlQnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHRoaXMsIGBHaXRodWJDb2RlQnVpbGRQcm9qZWN0JHtzdGFnZU5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogYGNvcHktZ2l0aHViLSR7c3RhZ2VOYW1lfS1icmFuY2gtdG8tczNgLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogMC4yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiAnKiovKidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZ2l0SHViQnJhbmNoU291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFydGlmYWN0czogY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVCdWlsZElkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZVppcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ0dpdGh1YkFydGlmYWN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIENvZGVCdWlsZCBwcm9qZWN0IHJlcXVpcmVzIHBlcm1pc3Npb25zIHRvIFMzIGJ1Y2tldCBvYmplY3RzLlxyXG4gICAgICAgICAgICAgICAgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdC5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnLCAnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVja2V0LmJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYCR7YnVja2V0LmJ1Y2tldEFybn0vKmBcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCBgQ2RrQ29kZVBpcGVsaW5lJHtzdGFnZU5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBwaXBlbGluZU5hbWU6IGBjZGstcGlwZWxpbmUtJHtzdGFnZU5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU1RBR0U6IHByb3BzLnN0YWdlIC8vIFRoZSBDSUNEIHN0YWdlIHR5cGljYWxseSB0ZXN0IG9yIHByb2QuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLnMzKGJ1Y2tldCwgYnJhbmNoRmlsZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogcHJvcHMuY29tbWFuZHMgPz8gY29tbWFuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3RvcnlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYnJhbmNoID0gYnJhbmNoUmVnZXguc2xpY2UoMSwgLTEpOyAvLyBSZW1vdmUgcGFyZW50aGVzaXMgZmlyc3QgYW5kIGxhc3QgY2hhci5cclxuICAgICAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnRQaXBlbGluZXMucHVzaCh7IGJyYW5jaCwgcGlwZWxpbmUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19