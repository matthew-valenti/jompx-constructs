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
 *
 * Create CDK pipelines that deploy CDK code across AWS accounts on GitHub branch updates.
 * All CDK pipeline resources reside on a single AWS account (preferrably a dedicated CICD AWS account)
 * This dedicated AWS account will have permissions to deploy to all other accounts (as needed). Developers can also be given admin or readonly permissions to troubleshoot CDK deployment errors.
 * Allow for both test and prod CICD AWS accounts. CICD enhancements can be done safely on the test CICD AWS account without affecting production deployments.
 * Create a CDK pipeline for each stage (e.g. sandbox1, test, prod) where each stage is an AWS account (e.g. prod resources reside on a prod AWS account).
 * Each stage is compromised of a set of "CDK stages" which can be deployed to any account. This allows common CDK resources to be deployed to a common AWS account (e.g. AWS wAF can be deployed to a common AWS account and shared across stages sandbox1, test, prod).
 * A github branch update will trigger a CDK pipeline to start.
 * Each stage is associated with a branch (e.g. updates to the main branch triggers the prod pipeline to start, updates to the sandbox1 branch triggers the sandbox1 pipelien to start).
 * An CDK stages is comprised or one or more CDK stacks.
 * Developers can also manually deploy stacks (if they have the appropriate AWS account permissions setup on their local).
 * During development, developers will typically manually deploy a stack they're working on to their sandbox AWS account.
 * A manual deployment of the CDK pipeline stack is needed to the test and prod CICD AWS accounts.
 * Supports configuration to allow a company to have any number of stages, accounts, and CDK stages.
 *
 * AWS Docs: The pipeline is self-mutating, which means that if you add new application stages in the source code, or new stacks to MyApplication, the pipeline will automatically reconfigure itself to deploy those new stages and stacks.
 *
 * Important:
 * - The CDK pipeline acts in the context of a stage (e.g. sandbox1, test, prod) and a stage is typically associated with one AWS account (e.g. prod AWS account).
 * - A stage parameter must always be available. This parameter can be specified on the command line (which always takes precedence) or from a config file.
 * - The cdk synth command in the pipeline includes a stage param. When the pipeline runs, the stage param is available in our CDK code.
 * e.g. When the main branch is updated, it triggers the prod pipeline to synth and deploy CDK changes with stage param = 'prod'. This allows developers to write conditional CDK code e.g. if (status === 'prod').
 * - A CDK pipeline is connected to one GitHub branch (and listens to that branch for updates).
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
        const branchStages = new Map([...stages].filter(([_, v]) => v.branch && !v.branch.startsWith('(') && !v.branch.endsWith(')')));
        const branchRegexStages = new Map([...stages].filter(([_, v]) => v.branch && v.branch.startsWith('(') && v.branch.endsWith(')')));
        // For static branches e.g. main, test.
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
                            .andBranchIs(`.*${branchRegex}.*`) // e.g. author-sandbox1-my-feature, test = author-test-sandbox1-my-feature
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZS9jZGstcGlwZWxpbmUuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUNuQyx1REFBdUQ7QUFDdkQsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6QyxtREFBbUQ7QUFDbkQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQywyQ0FBdUM7QUFDdkMsNkNBQTBDO0FBb0IxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUNHO0FBQ0gsTUFBYSxXQUFZLFNBQVEsc0JBQVM7SUFHdEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF3Qjs7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUhkLHlCQUFvQixHQUEyQixFQUFFLENBQUM7UUFLckQsTUFBTSxNQUFNLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sUUFBUSxHQUFHLENBQUMsYUFBYSxFQUFFLDJCQUEyQixFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxzREFBc0QsQ0FBQyxDQUFDLENBQUMsMEVBQTBFO1FBQ3RPLE1BQU0sc0JBQXNCLEdBQUcsa0JBQWtCLENBQUM7UUFFbEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFB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LHNCQUFzQjtxQkFDekIsQ0FBQztpQkFDTCxDQUFDLENBQUM7Z0JBRUgsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLDBDQUEwQztnQkFDbkYsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO2FBQ3hEO1NBQ0o7SUFDTCxDQUFDO0NBQ0o7QUEvSEQsa0NBK0hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xyXG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XHJcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XHJcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdhd3MtY2RrLWxpYi9waXBlbGluZXMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDZGtQaXBlbGluZVByb3BzIHtcclxuICAgIHN0YWdlOiBzdHJpbmc7XHJcbiAgICBnaXRIdWI6IElDZGtQaXBlbGluZUdpdEh1YlByb3BzO1xyXG4gICAgY29tbWFuZHM/OiBzdHJpbmdbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2RrUGlwZWxpbmVHaXRIdWJQcm9wcyB7XHJcbiAgICBvd25lcjogc3RyaW5nO1xyXG4gICAgcmVwbzogc3RyaW5nO1xyXG4gICAgLy8gdG9rZW46IGNkay5TZWNyZXRWYWx1ZTsgLy8gVE9ETzogQWxsb3cgR2l0SHViIHRva2VuIG9wdGlvbi5cclxuICAgIGNvbm5lY3Rpb25Bcm46IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJRW52aXJvbm1lbnRQaXBlbGluZSB7XHJcbiAgICBicmFuY2g6IHN0cmluZztcclxuICAgIHBpcGVsaW5lOiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lO1xyXG59XHJcblxyXG4vKipcclxuICogQ29udGludW91cyBpbnRlZ3JhdGlvbiBhbmQgZGVsaXZlcnkgKENJL0NEKSB1c2luZyBDREsgUGlwZWxpbmVzOlxyXG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL3YyL2d1aWRlL2Nka19waXBlbGluZS5odG1sXHJcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIucGlwZWxpbmVzLXJlYWRtZS5odG1sXHJcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL3YyL2RvY3MvYXdzLWNkay1saWIuYXdzX2NvZGVidWlsZC1yZWFkbWUuaHRtbFxyXG4gKlxyXG4gKiBCdWlsZCBTcGVjIFJlZmVyZW5jZTogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL2J1aWxkLXNwZWMtcmVmLmh0bWxcclxuICpcclxuICogVE9ETzogbnggYWZmZWN0ZWQ6XHJcbiAqIGh0dHBzOi8vbnguZGV2L2NpL21vbm9yZXBvLWNpLWNpcmNsZS1jaVxyXG4gKlxyXG4gKiAgKiBUT0RPIGRlcGxveSBpbiBwYXJhbGxlbDpcclxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjEvZG9jcy9waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICpcclxuICogVE9ETzogVHJpZ2dlciBhcHBzIHBpcGVsaW5lXHJcbiAqIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYyODU3OTI1L2hvdy10by1pbnZva2UtYS1waXBlbGluZS1iYXNlZC1vbi1hbm90aGVyLXBpcGVsaW5lLXN1Y2Nlc3MtdXNpbmctYXdzLWNvZGVjb21taXRcclxuICpcclxuICogQ3JlYXRlIENESyBwaXBlbGluZXMgdGhhdCBkZXBsb3kgQ0RLIGNvZGUgYWNyb3NzIEFXUyBhY2NvdW50cyBvbiBHaXRIdWIgYnJhbmNoIHVwZGF0ZXMuXHJcbiAqIEFsbCBDREsgcGlwZWxpbmUgcmVzb3VyY2VzIHJlc2lkZSBvbiBhIHNpbmdsZSBBV1MgYWNjb3VudCAocHJlZmVycmFibHkgYSBkZWRpY2F0ZWQgQ0lDRCBBV1MgYWNjb3VudClcclxuICogVGhpcyBkZWRpY2F0ZWQgQVdTIGFjY291bnQgd2lsbCBoYXZlIHBlcm1pc3Npb25zIHRvIGRlcGxveSB0byBhbGwgb3RoZXIgYWNjb3VudHMgKGFzIG5lZWRlZCkuIERldmVsb3BlcnMgY2FuIGFsc28gYmUgZ2l2ZW4gYWRtaW4gb3IgcmVhZG9ubHkgcGVybWlzc2lvbnMgdG8gdHJvdWJsZXNob290IENESyBkZXBsb3ltZW50IGVycm9ycy5cclxuICogQWxsb3cgZm9yIGJvdGggdGVzdCBhbmQgcHJvZCBDSUNEIEFXUyBhY2NvdW50cy4gQ0lDRCBlbmhhbmNlbWVudHMgY2FuIGJlIGRvbmUgc2FmZWx5IG9uIHRoZSB0ZXN0IENJQ0QgQVdTIGFjY291bnQgd2l0aG91dCBhZmZlY3RpbmcgcHJvZHVjdGlvbiBkZXBsb3ltZW50cy5cclxuICogQ3JlYXRlIGEgQ0RLIHBpcGVsaW5lIGZvciBlYWNoIHN0YWdlIChlLmcuIHNhbmRib3gxLCB0ZXN0LCBwcm9kKSB3aGVyZSBlYWNoIHN0YWdlIGlzIGFuIEFXUyBhY2NvdW50IChlLmcuIHByb2QgcmVzb3VyY2VzIHJlc2lkZSBvbiBhIHByb2QgQVdTIGFjY291bnQpLlxyXG4gKiBFYWNoIHN0YWdlIGlzIGNvbXByb21pc2VkIG9mIGEgc2V0IG9mIFwiQ0RLIHN0YWdlc1wiIHdoaWNoIGNhbiBiZSBkZXBsb3llZCB0byBhbnkgYWNjb3VudC4gVGhpcyBhbGxvd3MgY29tbW9uIENESyByZXNvdXJjZXMgdG8gYmUgZGVwbG95ZWQgdG8gYSBjb21tb24gQVdTIGFjY291bnQgKGUuZy4gQVdTIHdBRiBjYW4gYmUgZGVwbG95ZWQgdG8gYSBjb21tb24gQVdTIGFjY291bnQgYW5kIHNoYXJlZCBhY3Jvc3Mgc3RhZ2VzIHNhbmRib3gxLCB0ZXN0LCBwcm9kKS5cclxuICogQSBnaXRodWIgYnJhbmNoIHVwZGF0ZSB3aWxsIHRyaWdnZXIgYSBDREsgcGlwZWxpbmUgdG8gc3RhcnQuXHJcbiAqIEVhY2ggc3RhZ2UgaXMgYXNzb2NpYXRlZCB3aXRoIGEgYnJhbmNoIChlLmcuIHVwZGF0ZXMgdG8gdGhlIG1haW4gYnJhbmNoIHRyaWdnZXJzIHRoZSBwcm9kIHBpcGVsaW5lIHRvIHN0YXJ0LCB1cGRhdGVzIHRvIHRoZSBzYW5kYm94MSBicmFuY2ggdHJpZ2dlcnMgdGhlIHNhbmRib3gxIHBpcGVsaWVuIHRvIHN0YXJ0KS5cclxuICogQW4gQ0RLIHN0YWdlcyBpcyBjb21wcmlzZWQgb3Igb25lIG9yIG1vcmUgQ0RLIHN0YWNrcy5cclxuICogRGV2ZWxvcGVycyBjYW4gYWxzbyBtYW51YWxseSBkZXBsb3kgc3RhY2tzIChpZiB0aGV5IGhhdmUgdGhlIGFwcHJvcHJpYXRlIEFXUyBhY2NvdW50IHBlcm1pc3Npb25zIHNldHVwIG9uIHRoZWlyIGxvY2FsKS5cclxuICogRHVyaW5nIGRldmVsb3BtZW50LCBkZXZlbG9wZXJzIHdpbGwgdHlwaWNhbGx5IG1hbnVhbGx5IGRlcGxveSBhIHN0YWNrIHRoZXkncmUgd29ya2luZyBvbiB0byB0aGVpciBzYW5kYm94IEFXUyBhY2NvdW50LlxyXG4gKiBBIG1hbnVhbCBkZXBsb3ltZW50IG9mIHRoZSBDREsgcGlwZWxpbmUgc3RhY2sgaXMgbmVlZGVkIHRvIHRoZSB0ZXN0IGFuZCBwcm9kIENJQ0QgQVdTIGFjY291bnRzLlxyXG4gKiBTdXBwb3J0cyBjb25maWd1cmF0aW9uIHRvIGFsbG93IGEgY29tcGFueSB0byBoYXZlIGFueSBudW1iZXIgb2Ygc3RhZ2VzLCBhY2NvdW50cywgYW5kIENESyBzdGFnZXMuXHJcbiAqXHJcbiAqIEFXUyBEb2NzOiBUaGUgcGlwZWxpbmUgaXMgc2VsZi1tdXRhdGluZywgd2hpY2ggbWVhbnMgdGhhdCBpZiB5b3UgYWRkIG5ldyBhcHBsaWNhdGlvbiBzdGFnZXMgaW4gdGhlIHNvdXJjZSBjb2RlLCBvciBuZXcgc3RhY2tzIHRvIE15QXBwbGljYXRpb24sIHRoZSBwaXBlbGluZSB3aWxsIGF1dG9tYXRpY2FsbHkgcmVjb25maWd1cmUgaXRzZWxmIHRvIGRlcGxveSB0aG9zZSBuZXcgc3RhZ2VzIGFuZCBzdGFja3MuXHJcbiAqXHJcbiAqIEltcG9ydGFudDpcclxuICogLSBUaGUgQ0RLIHBpcGVsaW5lIGFjdHMgaW4gdGhlIGNvbnRleHQgb2YgYSBzdGFnZSAoZS5nLiBzYW5kYm94MSwgdGVzdCwgcHJvZCkgYW5kIGEgc3RhZ2UgaXMgdHlwaWNhbGx5IGFzc29jaWF0ZWQgd2l0aCBvbmUgQVdTIGFjY291bnQgKGUuZy4gcHJvZCBBV1MgYWNjb3VudCkuXHJcbiAqIC0gQSBzdGFnZSBwYXJhbWV0ZXIgbXVzdCBhbHdheXMgYmUgYXZhaWxhYmxlLiBUaGlzIHBhcmFtZXRlciBjYW4gYmUgc3BlY2lmaWVkIG9uIHRoZSBjb21tYW5kIGxpbmUgKHdoaWNoIGFsd2F5cyB0YWtlcyBwcmVjZWRlbmNlKSBvciBmcm9tIGEgY29uZmlnIGZpbGUuXHJcbiAqIC0gVGhlIGNkayBzeW50aCBjb21tYW5kIGluIHRoZSBwaXBlbGluZSBpbmNsdWRlcyBhIHN0YWdlIHBhcmFtLiBXaGVuIHRoZSBwaXBlbGluZSBydW5zLCB0aGUgc3RhZ2UgcGFyYW0gaXMgYXZhaWxhYmxlIGluIG91ciBDREsgY29kZS5cclxuICogZS5nLiBXaGVuIHRoZSBtYWluIGJyYW5jaCBpcyB1cGRhdGVkLCBpdCB0cmlnZ2VycyB0aGUgcHJvZCBwaXBlbGluZSB0byBzeW50aCBhbmQgZGVwbG95IENESyBjaGFuZ2VzIHdpdGggc3RhZ2UgcGFyYW0gPSAncHJvZCcuIFRoaXMgYWxsb3dzIGRldmVsb3BlcnMgdG8gd3JpdGUgY29uZGl0aW9uYWwgQ0RLIGNvZGUgZS5nLiBpZiAoc3RhdHVzID09PSAncHJvZCcpLlxyXG4gKiAtIEEgQ0RLIHBpcGVsaW5lIGlzIGNvbm5lY3RlZCB0byBvbmUgR2l0SHViIGJyYW5jaCAoYW5kIGxpc3RlbnMgdG8gdGhhdCBicmFuY2ggZm9yIHVwZGF0ZXMpLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIENka1BpcGVsaW5lIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudFBpcGVsaW5lczogSUVudmlyb25tZW50UGlwZWxpbmVbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQ2RrUGlwZWxpbmVQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcodGhpcy5ub2RlKTtcclxuICAgICAgICBjb25zdCBjb21tYW5kcyA9IFsnbnBtIGluc3RhbGwnLCAnbnBtIC1nIGluc3RhbGwgdHlwZXNjcmlwdCcsICducG0gaW5zdGFsbCAtZyBueCcsICdueCBidWlsZCBjZGsnLCAnbnggc3ludGggY2RrIC0tYXJncz1cIi0tcXVpZXQgLS1jb250ZXh0IHN0YWdlPSRTVEFHRVwiJ107IC8vIEFXUyBkb2NzIGV4YW1wbGUgY29tbWFuZHM6IFsnbnBtIGNpJywgJ25wbSBydW4gYnVpbGQnLCAnbnB4IGNkayBzeW50aCddXHJcbiAgICAgICAgY29uc3QgcHJpbWFyeU91dHB1dERpcmVjdG9yeSA9ICdhcHBzL2Nkay9jZGsub3V0JztcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhjb25maWcuc3RhZ2VzKCkhKSk7XHJcbiAgICAgICAgY29uc3QgYnJhbmNoU3RhZ2VzID0gbmV3IE1hcChbLi4uc3RhZ2VzXS5maWx0ZXIoKFtfLCB2XSkgPT4gdi5icmFuY2ggJiYgIXYuYnJhbmNoLnN0YXJ0c1dpdGgoJygnKSAmJiAhdi5icmFuY2guZW5kc1dpdGgoJyknKSkpO1xyXG4gICAgICAgIGNvbnN0IGJyYW5jaFJlZ2V4U3RhZ2VzID0gbmV3IE1hcChbLi4uc3RhZ2VzXS5maWx0ZXIoKFtfLCB2XSkgPT4gdi5icmFuY2ggJiYgdi5icmFuY2guc3RhcnRzV2l0aCgnKCcpICYmIHYuYnJhbmNoLmVuZHNXaXRoKCcpJykpKTtcclxuXHJcbiAgICAgICAgLy8gRm9yIHN0YXRpYyBicmFuY2hlcyBlLmcuIG1haW4sIHRlc3QuXHJcbiAgICAgICAgZm9yIChjb25zdCBzdGFnZSBvZiBicmFuY2hTdGFnZXMudmFsdWVzKCkpIHtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJyYW5jaCA9IChwcm9wcy5zdGFnZSA9PT0gJ3Byb2QnKSA/IHN0YWdlLmJyYW5jaCA6IGAke3Byb3BzLnN0YWdlfS0ke3N0YWdlLmJyYW5jaH1gO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIGEgc3RhbmRhcmQgY2RrIHBpcGVsaW5lIGZvciBzdGF0aWMgYnJhbmNoZXMuIFBlcmZvcm1hbmNlIGlzIGJldHRlciAobm8gUzMgZmlsZSBjb3B5IHJlcXVpcmVkKS5cclxuICAgICAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCBgQ2RrQ29kZVBpcGVsaW5lJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UoYnJhbmNoKX1gLCB7XHJcbiAgICAgICAgICAgICAgICBwaXBlbGluZU5hbWU6IGBjZGstcGlwZWxpbmUtJHticmFuY2h9YCxcclxuICAgICAgICAgICAgICAgIGNyb3NzQWNjb3VudEtleXM6IHRydWUsIC8vIFJlcXVpcmVkIGZvciBjcm9zcyBhY2NvdW50IGRlcGxveXMuXHJcbiAgICAgICAgICAgICAgICBzeW50aDogbmV3IHBpcGVsaW5lcy5TaGVsbFN0ZXAoJ1N5bnRoJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTVEFHRTogYCR7cHJvcHMuc3RhZ2V9YCAvLyBUaGUgQ0lDRCBzdGFnZSB0eXBpY2FsbHkgdGVzdCBvciBwcm9kLlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogQWxsb3cgR2l0SHViIHRva2VuIG9wdGlvbi5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpbnB1dDogcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5naXRIdWIoXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGAke3Byb3BzLmdpdEh1Yi5vd25lcn0vJHtwcm9wcy5naXRIdWIucmVwb31gLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBicmFuY2gsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHsgYXV0aGVudGljYXRpb246IHByb3BzLmdpdEh1Yi50b2tlbiB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gKSxcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dDogcGlwZWxpbmVzLkNvZGVQaXBlbGluZVNvdXJjZS5jb25uZWN0aW9uKGAke3Byb3BzLmdpdEh1Yi5vd25lcn0vJHtwcm9wcy5naXRIdWIucmVwb31gLCBicmFuY2gsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29ubmVjdGlvbkFybjogcHJvcHMuZ2l0SHViLmNvbm5lY3Rpb25Bcm4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGVCdWlsZENsb25lT3V0cHV0OiB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZHM6IHByb3BzLmNvbW1hbmRzID8/IGNvbW1hbmRzLFxyXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3RvcnlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lbnZpcm9ubWVudFBpcGVsaW5lcy5wdXNoKHsgYnJhbmNoLCBwaXBlbGluZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChicmFuY2hSZWdleFN0YWdlcy5zaXplKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBidWNrZXQgdG8gc2F2ZSBnaXRodWIgc2FuZGJveCBmZWF0dXJlIGJyYW5jaCBmaWxlcyAoYXMgemlwKS5cclxuICAgICAgICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBgJHtjb25maWcub3JnYW5pemF0aW9uTmFtZVBhc2NhbENhc2UoKX1DZGtQaXBlbGluZUJyYW5jaGAsIHtcclxuICAgICAgICAgICAgICAgIC8vIFZlcnNpb24gbXVzdCBiZSB0cnVlIHRvIHVzZSBhcyBDb2RlUGlwZWxpbmUgc291cmNlLlxyXG4gICAgICAgICAgICAgICAgdmVyc2lvbmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsIC8vIFRPRE86IElzIHRoaXMgbmVlZGVkP1xyXG4gICAgICAgICAgICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcclxuICAgICAgICAgICAgICAgIGVuZm9yY2VTU0w6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAvLyBEZXN0cm95IGJ1Y2tldCBvbiBzdGFjayBkZWxldGUuIEJ1Y2tldCBjb250YWlucyB0ZW1wb3JhcnkgY29weSBvZiBzb3VyY2UgY29udHJvbCBmaWxlcyBvbmx5LlxyXG4gICAgICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBhbGwgYnVja2V0IG9iamVjdHMgb24gYnVja2V0L3N0YWNrIGRlc3Ryb3kuXHJcbiAgICAgICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgW3N0YWdlTmFtZSwgc3RhZ2VdIG9mIGJyYW5jaFJlZ2V4U3RhZ2VzLmVudHJpZXMoKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGJyYW5jaEZpbGVOYW1lID0gYGJyYW5jaC0ke3N0YWdlTmFtZX0uemlwYDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWdlTmFtZVBhc2NhbENhc2UgPSBjaGFuZ2VDYXNlLnBhc2NhbENhc2Uoc3RhZ2VOYW1lKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBicmFuY2hSZWdleCA9IChwcm9wcy5zdGFnZSA9PT0gJ3Byb2QnKSA/IHN0YWdlLmJyYW5jaCA6IFtzdGFnZS5icmFuY2guc2xpY2UoMCwgMSksIGAtJHtwcm9wcy5zdGFnZX1gLCBzdGFnZS5icmFuY2guc2xpY2UoMSldLmpvaW4oJycpOyAvLyBlLmcuIG1haW4sICgtdGVzdC1tYWluLSlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgZ2l0aHViIHNvdXJjZSAoc2FuZGJveCBmZWF0dXJlIGJyYW5jaCkuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnaXRIdWJCcmFuY2hTb3VyY2UgPSBjb2RlYnVpbGRcclxuICAgICAgICAgICAgICAgICAgICAuU291cmNlLmdpdEh1Yih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG93bmVyOiBwcm9wcy5naXRIdWIub3duZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcG86IHByb3BzLmdpdEh1Yi5yZXBvLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmZXRjaFN1Ym1vZHVsZXM6IHRydWUsIC8vIEZvciBhbGwgR2l0IHNvdXJjZXMsIHlvdSBjYW4gZmV0Y2ggc3VibW9kdWxlcyB3aGlsZSBjbG9pbmcgZ2l0IHJlcG8uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYmhvb2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdlYmhvb2tGaWx0ZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlYnVpbGQuRmlsdGVyR3JvdXBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5FdmVudE9mKGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVVNIKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5hbmRCcmFuY2hJc05vdCgnbWFpbicpIC8vIEZvciBhZGRpdGlvbmFsIHByb3RlY3Rpb24gb25seS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXMoYC4qJHticmFuY2hSZWdleH0uKmApIC8vIGUuZy4gYXV0aG9yLXNhbmRib3gxLW15LWZlYXR1cmUsIHRlc3QgPSBhdXRob3ItdGVzdC1zYW5kYm94MS1teS1mZWF0dXJlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgYnVpbGQgcHJvamVjdCAodG8gY29weSBmZWF0dXJlIGJyYW5jaCBmaWxlcyB0byBTMyBvbiBnaXRodWIgcHVzaCkuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBnaXRodWJDb2RlQnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHRoaXMsIGBHaXRodWJDb2RlQnVpbGRQcm9qZWN0JHtzdGFnZU5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogYGNvcHktZ2l0aHViLSR7c3RhZ2VOYW1lfS1icmFuY2gtdG8tczNgLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogMC4yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnRpZmFjdHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVzOiAnKiovKidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZTogZ2l0SHViQnJhbmNoU291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFydGlmYWN0czogY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGJyYW5jaEZpbGVOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWNrZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluY2x1ZGVCdWlsZElkOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGFja2FnZVppcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWRlbnRpZmllcjogJ0dpdGh1YkFydGlmYWN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIENvZGVCdWlsZCBwcm9qZWN0IHJlcXVpcmVzIHBlcm1pc3Npb25zIHRvIFMzIGJ1Y2tldCBvYmplY3RzLlxyXG4gICAgICAgICAgICAgICAgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdC5hZGRUb1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb25zOiBbJ3MzOkxpc3RCdWNrZXQnLCAnczM6R2V0T2JqZWN0JywgJ3MzOlB1dE9iamVjdCcsICdzMzpEZWxldGVPYmplY3QnXSxcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVja2V0LmJ1Y2tldEFybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgYCR7YnVja2V0LmJ1Y2tldEFybn0vKmBcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNvZGVQaXBlbGluZSh0aGlzLCBgQ2RrQ29kZVBpcGVsaW5lJHtzdGFnZU5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBwaXBlbGluZU5hbWU6IGBjZGstcGlwZWxpbmUtJHtzdGFnZU5hbWV9YCxcclxuICAgICAgICAgICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU1RBR0U6IHByb3BzLnN0YWdlIC8vIFRoZSBDSUNEIHN0YWdlIHR5cGljYWxseSB0ZXN0IG9yIHByb2QuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLnMzKGJ1Y2tldCwgYnJhbmNoRmlsZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogcHJvcHMuY29tbWFuZHMgPz8gY29tbWFuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3RvcnlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYnJhbmNoID0gYnJhbmNoUmVnZXguc2xpY2UoMSwgLTEpOyAvLyBSZW1vdmUgcGFyZW50aGVzaXMgZmlyc3QgYW5kIGxhc3QgY2hhci5cclxuICAgICAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnRQaXBlbGluZXMucHVzaCh7IGJyYW5jaCwgcGlwZWxpbmUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19