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
 *
 * Deployments supported:
 * - Manual CDK Pipeline stack deployment to CICD test and prod environments.
 * - GitHub triggered deployments across all branches and all CICD stage branches e.g. (prod & test-prod, test & test-test, sandbox1 & test-sandbox1).
 * - Manual CDK stack deploys (to any env). e.g. deploy stack to sandbox1, deploy stack to test, deploy stack to prod.
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
        const branchStages = new Map([...stages].filter(([_, v]) => v.branch && !v.branch.startsWith('(') && !v.branch.endsWith(')')));
        const branchRegexStages = new Map([...stages].filter(([_, v]) => v.branch && v.branch.startsWith('(') && v.branch.endsWith(')')));
        // For static branches e.g. main, test.
        for (const [stage, stageValue] of branchStages.entries()) {
            const branch = (props.stage === 'prod') ? stageValue.branch : `${props.stage}-${stageValue.branch}`;
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
                    commands: (_b = props.commands) !== null && _b !== void 0 ? _b : commands,
                    primaryOutputDirectory
                })
            });
            this.environmentPipelines.push({ stage, branch, pipeline });
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
            for (const [stage, stageValue] of branchRegexStages.entries()) {
                const branchFileName = `branch-${stage}.zip`;
                const stagePascalCase = changeCase.pascalCase(stage);
                const branchRegex = (props.stage === 'prod') ? stageValue.branch : [stageValue.branch.slice(0, 1), `-${props.stage}`, stageValue.branch.slice(1)].join(''); // e.g. main, (-test-main-)
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
                const githubCodeBuildProject = new codebuild.Project(this, `GithubCodeBuildProject${stagePascalCase}`, {
                    projectName: `copy-github-${stage}-branch-to-s3`,
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
                const pipeline = new pipelines.CodePipeline(this, `CdkCodePipeline${stagePascalCase}`, {
                    pipelineName: `cdk-pipeline-${stage}`,
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
                this.environmentPipelines.push({ stage, branch, pipeline });
            }
        }
    }
}
exports.CdkPipeline = CdkPipeline;
_a = JSII_RTTI_SYMBOL_1;
CdkPipeline[_a] = { fqn: "@jompx/constructs.CdkPipeline", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLXBpcGVsaW5lLmNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9waXBlbGluZS9jZGstcGlwZWxpbmUuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbUNBQW1DO0FBQ25DLHVEQUF1RDtBQUN2RCwyQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLG1EQUFtRDtBQUNuRCw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLDJDQUF1QztBQUN2Qyw2Q0FBMEM7QUF3QjFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDRztBQUNILE1BQWEsV0FBWSxTQUFRLHNCQUFTO0lBR3RDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBd0I7O1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIZCx5QkFBb0IsR0FBMkIsRUFBRSxDQUFDO1FBS3JELE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxNQUFNLFFBQVEsR0FBRyxDQUFDLGFBQWEsRUFBRSwyQkFBMkIsRUFBRSxtQkFBbUIsRUFBRSxjQUFjLEVBQUUsc0RBQXNELENBQUMsQ0FBQyxDQUFDLDBFQUEwRTtRQUN0TyxNQUFNLHNCQUFzQixHQUFHLGtCQUFrQixDQUFDO1FBRWxELE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRyxDQUFDLENBQUMsQ0FBQztRQUN6RCxNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxD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QUFLLENBQUMsUUFBUSxtQ0FBSSxRQUFRO3dCQUNwQyxzQkFBc0I7cUJBQ3pCLENBQUM7aUJBQ0wsQ0FBQyxDQUFDO2dCQUVILE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQywwQ0FBMEM7Z0JBQ25GLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7YUFDL0Q7U0FDSjtJQUNMLENBQUM7O0FBOUhMLGtDQStIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcclxuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG5pbXBvcnQgKiBhcyBwaXBlbGluZXMgZnJvbSAnYXdzLWNkay1saWIvcGlwZWxpbmVzJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2RrUGlwZWxpbmVQcm9wcyB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBDSUNEIHN0YWdlLiBUeXBpY2FsbHkgcHJvZCBvciB0ZXN0LlxyXG4gICAgICovXHJcbiAgICBzdGFnZTogc3RyaW5nO1xyXG4gICAgZ2l0SHViOiBJQ2RrUGlwZWxpbmVHaXRIdWJQcm9wcztcclxuICAgIGNvbW1hbmRzPzogc3RyaW5nW107XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNka1BpcGVsaW5lR2l0SHViUHJvcHMge1xyXG4gICAgb3duZXI6IHN0cmluZztcclxuICAgIHJlcG86IHN0cmluZztcclxuICAgIC8vIHRva2VuOiBjZGsuU2VjcmV0VmFsdWU7IC8vIFRPRE86IEFsbG93IEdpdEh1YiB0b2tlbiBvcHRpb24uXHJcbiAgICBjb25uZWN0aW9uQXJuOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudmlyb25tZW50UGlwZWxpbmUge1xyXG4gICAgc3RhZ2U6IHN0cmluZztcclxuICAgIGJyYW5jaDogc3RyaW5nO1xyXG4gICAgcGlwZWxpbmU6IHBpcGVsaW5lcy5Db2RlUGlwZWxpbmU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb250aW51b3VzIGludGVncmF0aW9uIGFuZCBkZWxpdmVyeSAoQ0kvQ0QpIHVzaW5nIENESyBQaXBlbGluZXM6XHJcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvdjIvZ3VpZGUvY2RrX3BpcGVsaW5lLmh0bWxcclxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5waXBlbGluZXMtcmVhZG1lLmh0bWxcclxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvdjIvZG9jcy9hd3MtY2RrLWxpYi5hd3NfY29kZWJ1aWxkLXJlYWRtZS5odG1sXHJcbiAqXHJcbiAqIEJ1aWxkIFNwZWMgUmVmZXJlbmNlOiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvYnVpbGQtc3BlYy1yZWYuaHRtbFxyXG4gKlxyXG4gKiBUT0RPOiBueCBhZmZlY3RlZDpcclxuICogaHR0cHM6Ly9ueC5kZXYvY2kvbW9ub3JlcG8tY2ktY2lyY2xlLWNpXHJcbiAqXHJcbiAqICAqIFRPRE8gZGVwbG95IGluIHBhcmFsbGVsOlxyXG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS92MS9kb2NzL3BpcGVsaW5lcy1yZWFkbWUuaHRtbFxyXG4gKlxyXG4gKiBUT0RPOiBUcmlnZ2VyIGFwcHMgcGlwZWxpbmVcclxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNjI4NTc5MjUvaG93LXRvLWludm9rZS1hLXBpcGVsaW5lLWJhc2VkLW9uLWFub3RoZXItcGlwZWxpbmUtc3VjY2Vzcy11c2luZy1hd3MtY29kZWNvbW1pdFxyXG4gKlxyXG4gKiBDcmVhdGUgQ0RLIHBpcGVsaW5lcyB0aGF0IGRlcGxveSBDREsgY29kZSBhY3Jvc3MgQVdTIGFjY291bnRzIG9uIEdpdEh1YiBicmFuY2ggdXBkYXRlcy5cclxuICogQWxsIENESyBwaXBlbGluZSByZXNvdXJjZXMgcmVzaWRlIG9uIGEgc2luZ2xlIEFXUyBhY2NvdW50IChwcmVmZXJyYWJseSBhIGRlZGljYXRlZCBDSUNEIEFXUyBhY2NvdW50KVxyXG4gKiBUaGlzIGRlZGljYXRlZCBBV1MgYWNjb3VudCB3aWxsIGhhdmUgcGVybWlzc2lvbnMgdG8gZGVwbG95IHRvIGFsbCBvdGhlciBhY2NvdW50cyAoYXMgbmVlZGVkKS4gRGV2ZWxvcGVycyBjYW4gYWxzbyBiZSBnaXZlbiBhZG1pbiBvciByZWFkb25seSBwZXJtaXNzaW9ucyB0byB0cm91Ymxlc2hvb3QgQ0RLIGRlcGxveW1lbnQgZXJyb3JzLlxyXG4gKiBBbGxvdyBmb3IgYm90aCB0ZXN0IGFuZCBwcm9kIENJQ0QgQVdTIGFjY291bnRzLiBDSUNEIGVuaGFuY2VtZW50cyBjYW4gYmUgZG9uZSBzYWZlbHkgb24gdGhlIHRlc3QgQ0lDRCBBV1MgYWNjb3VudCB3aXRob3V0IGFmZmVjdGluZyBwcm9kdWN0aW9uIGRlcGxveW1lbnRzLlxyXG4gKiBDcmVhdGUgYSBDREsgcGlwZWxpbmUgZm9yIGVhY2ggc3RhZ2UgKGUuZy4gc2FuZGJveDEsIHRlc3QsIHByb2QpIHdoZXJlIGVhY2ggc3RhZ2UgaXMgYW4gQVdTIGFjY291bnQgKGUuZy4gcHJvZCByZXNvdXJjZXMgcmVzaWRlIG9uIGEgcHJvZCBBV1MgYWNjb3VudCkuXHJcbiAqIEVhY2ggc3RhZ2UgaXMgY29tcHJvbWlzZWQgb2YgYSBzZXQgb2YgXCJDREsgc3RhZ2VzXCIgd2hpY2ggY2FuIGJlIGRlcGxveWVkIHRvIGFueSBhY2NvdW50LiBUaGlzIGFsbG93cyBjb21tb24gQ0RLIHJlc291cmNlcyB0byBiZSBkZXBsb3llZCB0byBhIGNvbW1vbiBBV1MgYWNjb3VudCAoZS5nLiBBV1Mgd0FGIGNhbiBiZSBkZXBsb3llZCB0byBhIGNvbW1vbiBBV1MgYWNjb3VudCBhbmQgc2hhcmVkIGFjcm9zcyBzdGFnZXMgc2FuZGJveDEsIHRlc3QsIHByb2QpLlxyXG4gKiBBIGdpdGh1YiBicmFuY2ggdXBkYXRlIHdpbGwgdHJpZ2dlciBhIENESyBwaXBlbGluZSB0byBzdGFydC5cclxuICogRWFjaCBzdGFnZSBpcyBhc3NvY2lhdGVkIHdpdGggYSBicmFuY2ggKGUuZy4gdXBkYXRlcyB0byB0aGUgbWFpbiBicmFuY2ggdHJpZ2dlcnMgdGhlIHByb2QgcGlwZWxpbmUgdG8gc3RhcnQsIHVwZGF0ZXMgdG8gdGhlIHNhbmRib3gxIGJyYW5jaCB0cmlnZ2VycyB0aGUgc2FuZGJveDEgcGlwZWxpZW4gdG8gc3RhcnQpLlxyXG4gKiBBbiBDREsgc3RhZ2VzIGlzIGNvbXByaXNlZCBvciBvbmUgb3IgbW9yZSBDREsgc3RhY2tzLlxyXG4gKiBEZXZlbG9wZXJzIGNhbiBhbHNvIG1hbnVhbGx5IGRlcGxveSBzdGFja3MgKGlmIHRoZXkgaGF2ZSB0aGUgYXBwcm9wcmlhdGUgQVdTIGFjY291bnQgcGVybWlzc2lvbnMgc2V0dXAgb24gdGhlaXIgbG9jYWwpLlxyXG4gKiBEdXJpbmcgZGV2ZWxvcG1lbnQsIGRldmVsb3BlcnMgd2lsbCB0eXBpY2FsbHkgbWFudWFsbHkgZGVwbG95IGEgc3RhY2sgdGhleSdyZSB3b3JraW5nIG9uIHRvIHRoZWlyIHNhbmRib3ggQVdTIGFjY291bnQuXHJcbiAqIEEgbWFudWFsIGRlcGxveW1lbnQgb2YgdGhlIENESyBwaXBlbGluZSBzdGFjayBpcyBuZWVkZWQgdG8gdGhlIHRlc3QgYW5kIHByb2QgQ0lDRCBBV1MgYWNjb3VudHMuXHJcbiAqIFN1cHBvcnRzIGNvbmZpZ3VyYXRpb24gdG8gYWxsb3cgYSBjb21wYW55IHRvIGhhdmUgYW55IG51bWJlciBvZiBzdGFnZXMsIGFjY291bnRzLCBhbmQgQ0RLIHN0YWdlcy5cclxuICpcclxuICogQVdTIERvY3M6IFRoZSBwaXBlbGluZSBpcyBzZWxmLW11dGF0aW5nLCB3aGljaCBtZWFucyB0aGF0IGlmIHlvdSBhZGQgbmV3IGFwcGxpY2F0aW9uIHN0YWdlcyBpbiB0aGUgc291cmNlIGNvZGUsIG9yIG5ldyBzdGFja3MgdG8gTXlBcHBsaWNhdGlvbiwgdGhlIHBpcGVsaW5lIHdpbGwgYXV0b21hdGljYWxseSByZWNvbmZpZ3VyZSBpdHNlbGYgdG8gZGVwbG95IHRob3NlIG5ldyBzdGFnZXMgYW5kIHN0YWNrcy5cclxuICpcclxuICogSW1wb3J0YW50OlxyXG4gKiAtIFRoZSBDREsgcGlwZWxpbmUgYWN0cyBpbiB0aGUgY29udGV4dCBvZiBhIHN0YWdlIChlLmcuIHNhbmRib3gxLCB0ZXN0LCBwcm9kKSBhbmQgYSBzdGFnZSBpcyB0eXBpY2FsbHkgYXNzb2NpYXRlZCB3aXRoIG9uZSBBV1MgYWNjb3VudCAoZS5nLiBwcm9kIEFXUyBhY2NvdW50KS5cclxuICogLSBBIHN0YWdlIHBhcmFtZXRlciBtdXN0IGFsd2F5cyBiZSBhdmFpbGFibGUuIFRoaXMgcGFyYW1ldGVyIGNhbiBiZSBzcGVjaWZpZWQgb24gdGhlIGNvbW1hbmQgbGluZSAod2hpY2ggYWx3YXlzIHRha2VzIHByZWNlZGVuY2UpIG9yIGZyb20gYSBjb25maWcgZmlsZS5cclxuICogLSBUaGUgY2RrIHN5bnRoIGNvbW1hbmQgaW4gdGhlIHBpcGVsaW5lIGluY2x1ZGVzIGEgc3RhZ2UgcGFyYW0uIFdoZW4gdGhlIHBpcGVsaW5lIHJ1bnMsIHRoZSBzdGFnZSBwYXJhbSBpcyBhdmFpbGFibGUgaW4gb3VyIENESyBjb2RlLlxyXG4gKiBlLmcuIFdoZW4gdGhlIG1haW4gYnJhbmNoIGlzIHVwZGF0ZWQsIGl0IHRyaWdnZXJzIHRoZSBwcm9kIHBpcGVsaW5lIHRvIHN5bnRoIGFuZCBkZXBsb3kgQ0RLIGNoYW5nZXMgd2l0aCBzdGFnZSBwYXJhbSA9ICdwcm9kJy4gVGhpcyBhbGxvd3MgZGV2ZWxvcGVycyB0byB3cml0ZSBjb25kaXRpb25hbCBDREsgY29kZSBlLmcuIGlmIChzdGF0dXMgPT09ICdwcm9kJykuXHJcbiAqIC0gQSBDREsgcGlwZWxpbmUgaXMgY29ubmVjdGVkIHRvIG9uZSBHaXRIdWIgYnJhbmNoIChhbmQgbGlzdGVucyB0byB0aGF0IGJyYW5jaCBmb3IgdXBkYXRlcykuXHJcbiAqXHJcbiAqIERlcGxveW1lbnRzIHN1cHBvcnRlZDpcclxuICogLSBNYW51YWwgQ0RLIFBpcGVsaW5lIHN0YWNrIGRlcGxveW1lbnQgdG8gQ0lDRCB0ZXN0IGFuZCBwcm9kIGVudmlyb25tZW50cy5cclxuICogLSBHaXRIdWIgdHJpZ2dlcmVkIGRlcGxveW1lbnRzIGFjcm9zcyBhbGwgYnJhbmNoZXMgYW5kIGFsbCBDSUNEIHN0YWdlIGJyYW5jaGVzIGUuZy4gKHByb2QgJiB0ZXN0LXByb2QsIHRlc3QgJiB0ZXN0LXRlc3QsIHNhbmRib3gxICYgdGVzdC1zYW5kYm94MSkuXHJcbiAqIC0gTWFudWFsIENESyBzdGFjayBkZXBsb3lzICh0byBhbnkgZW52KS4gZS5nLiBkZXBsb3kgc3RhY2sgdG8gc2FuZGJveDEsIGRlcGxveSBzdGFjayB0byB0ZXN0LCBkZXBsb3kgc3RhY2sgdG8gcHJvZC5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBDZGtQaXBlbGluZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRQaXBlbGluZXM6IElFbnZpcm9ubWVudFBpcGVsaW5lW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUNka1BpcGVsaW5lUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKHRoaXMubm9kZSk7XHJcbiAgICAgICAgY29uc3QgY29tbWFuZHMgPSBbJ25wbSBpbnN0YWxsJywgJ25wbSAtZyBpbnN0YWxsIHR5cGVzY3JpcHQnLCAnbnBtIGluc3RhbGwgLWcgbngnLCAnbnggYnVpbGQgY2RrJywgJ254IHN5bnRoIGNkayAtLWFyZ3M9XCItLXF1aWV0IC0tY29udGV4dCBzdGFnZT0kU1RBR0VcIiddOyAvLyBBV1MgZG9jcyBleGFtcGxlIGNvbW1hbmRzOiBbJ25wbSBjaScsICducG0gcnVuIGJ1aWxkJywgJ25weCBjZGsgc3ludGgnXVxyXG4gICAgICAgIGNvbnN0IHByaW1hcnlPdXRwdXREaXJlY3RvcnkgPSAnYXBwcy9jZGsvY2RrLm91dCc7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YWdlcyA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoY29uZmlnLnN0YWdlcygpISkpO1xyXG4gICAgICAgIGNvbnN0IGJyYW5jaFN0YWdlcyA9IG5ldyBNYXAoWy4uLnN0YWdlc10uZmlsdGVyKChbXywgdl0pID0+IHYuYnJhbmNoICYmICF2LmJyYW5jaC5zdGFydHNXaXRoKCcoJykgJiYgIXYuYnJhbmNoLmVuZHNXaXRoKCcpJykpKTtcclxuICAgICAgICBjb25zdCBicmFuY2hSZWdleFN0YWdlcyA9IG5ldyBNYXAoWy4uLnN0YWdlc10uZmlsdGVyKChbXywgdl0pID0+IHYuYnJhbmNoICYmIHYuYnJhbmNoLnN0YXJ0c1dpdGgoJygnKSAmJiB2LmJyYW5jaC5lbmRzV2l0aCgnKScpKSk7XHJcblxyXG4gICAgICAgIC8vIEZvciBzdGF0aWMgYnJhbmNoZXMgZS5nLiBtYWluLCB0ZXN0LlxyXG4gICAgICAgIGZvciAoY29uc3QgW3N0YWdlLCBzdGFnZVZhbHVlXSBvZiBicmFuY2hTdGFnZXMuZW50cmllcygpKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBicmFuY2ggPSAocHJvcHMuc3RhZ2UgPT09ICdwcm9kJykgPyBzdGFnZVZhbHVlLmJyYW5jaCA6IGAke3Byb3BzLnN0YWdlfS0ke3N0YWdlVmFsdWUuYnJhbmNofWA7XHJcblxyXG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBzdGFuZGFyZCBjZGsgcGlwZWxpbmUgZm9yIHN0YXRpYyBicmFuY2hlcy4gUGVyZm9ybWFuY2UgaXMgYmV0dGVyIChubyBTMyBmaWxlIGNvcHkgcmVxdWlyZWQpLlxyXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsIGBDZGtDb2RlUGlwZWxpbmUke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShicmFuY2gpfWAsIHtcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lTmFtZTogYGNkay1waXBlbGluZS0ke2JyYW5jaH1gLFxyXG4gICAgICAgICAgICAgICAgY3Jvc3NBY2NvdW50S2V5czogdHJ1ZSwgLy8gUmVxdWlyZWQgZm9yIGNyb3NzIGFjY291bnQgZGVwbG95cy5cclxuICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW52OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFNUQUdFOiBgJHtwcm9wcy5zdGFnZX1gIC8vIFRoZSBDSUNEIHN0YWdlIHR5cGljYWxseSB0ZXN0IG9yIHByb2QuXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBBbGxvdyBHaXRIdWIgdG9rZW4gb3B0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLmdpdEh1YihcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgYCR7cHJvcHMuZ2l0SHViLm93bmVyfS8ke3Byb3BzLmdpdEh1Yi5yZXBvfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIGJyYW5jaCxcclxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgeyBhdXRoZW50aWNhdGlvbjogcHJvcHMuZ2l0SHViLnRva2VuIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyApLFxyXG4gICAgICAgICAgICAgICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLmNvbm5lY3Rpb24oYCR7cHJvcHMuZ2l0SHViLm93bmVyfS8ke3Byb3BzLmdpdEh1Yi5yZXBvfWAsIGJyYW5jaCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uQXJuOiBwcm9wcy5naXRIdWIuY29ubmVjdGlvbkFybixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZUJ1aWxkQ2xvbmVPdXRwdXQ6IHRydWVcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogcHJvcHMuY29tbWFuZHMgPz8gY29tbWFuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJpbWFyeU91dHB1dERpcmVjdG9yeVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVudmlyb25tZW50UGlwZWxpbmVzLnB1c2goeyBzdGFnZSwgYnJhbmNoLCBwaXBlbGluZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChicmFuY2hSZWdleFN0YWdlcy5zaXplKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBidWNrZXQgdG8gc2F2ZSBnaXRodWIgc2FuZGJveCBmZWF0dXJlIGJyYW5jaCBmaWxlcyAoYXMgemlwKS5cclxuICAgICAgICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBgJHtjb25maWcub3JnYW5pemF0aW9uTmFtZVBhc2NhbENhc2UoKX1DZGtQaXBlbGluZUJyYW5jaGAsIHtcclxuICAgICAgICAgICAgICAgIC8vIFZlcnNpb24gbXVzdCBiZSB0cnVlIHRvIHVzZSBhcyBDb2RlUGlwZWxpbmUgc291cmNlLlxyXG4gICAgICAgICAgICAgICAgdmVyc2lvbmVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsIC8vIFRPRE86IElzIHRoaXMgbmVlZGVkP1xyXG4gICAgICAgICAgICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcclxuICAgICAgICAgICAgICAgIGVuZm9yY2VTU0w6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAvLyBEZXN0cm95IGJ1Y2tldCBvbiBzdGFjayBkZWxldGUuIEJ1Y2tldCBjb250YWlucyB0ZW1wb3JhcnkgY29weSBvZiBzb3VyY2UgY29udHJvbCBmaWxlcyBvbmx5LlxyXG4gICAgICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBhbGwgYnVja2V0IG9iamVjdHMgb24gYnVja2V0L3N0YWNrIGRlc3Ryb3kuXHJcbiAgICAgICAgICAgICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgW3N0YWdlLCBzdGFnZVZhbHVlXSBvZiBicmFuY2hSZWdleFN0YWdlcy5lbnRyaWVzKCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBicmFuY2hGaWxlTmFtZSA9IGBicmFuY2gtJHtzdGFnZX0uemlwYDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YWdlUGFzY2FsQ2FzZSA9IGNoYW5nZUNhc2UucGFzY2FsQ2FzZShzdGFnZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYnJhbmNoUmVnZXggPSAocHJvcHMuc3RhZ2UgPT09ICdwcm9kJykgPyBzdGFnZVZhbHVlLmJyYW5jaCA6IFtzdGFnZVZhbHVlLmJyYW5jaC5zbGljZSgwLCAxKSwgYC0ke3Byb3BzLnN0YWdlfWAsIHN0YWdlVmFsdWUuYnJhbmNoLnNsaWNlKDEpXS5qb2luKCcnKTsgLy8gZS5nLiBtYWluLCAoLXRlc3QtbWFpbi0pXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGdpdGh1YiBzb3VyY2UgKHNhbmRib3ggZmVhdHVyZSBicmFuY2gpLlxyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2l0SHViQnJhbmNoU291cmNlID0gY29kZWJ1aWxkXHJcbiAgICAgICAgICAgICAgICAgICAgLlNvdXJjZS5naXRIdWIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lcjogcHJvcHMuZ2l0SHViLm93bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBvOiBwcm9wcy5naXRIdWIucmVwbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmV0Y2hTdWJtb2R1bGVzOiB0cnVlLCAvLyBGb3IgYWxsIEdpdCBzb3VyY2VzLCB5b3UgY2FuIGZldGNoIHN1Ym1vZHVsZXMgd2hpbGUgY2xvaW5nIGdpdCByZXBvLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJob29rOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3ZWJob29rRmlsdGVyczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuYW5kQnJhbmNoSXNOb3QoJ21haW4nKSAvLyBGb3IgYWRkaXRpb25hbCBwcm90ZWN0aW9uIG9ubHkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmFuZEJyYW5jaElzKGAuKiR7YnJhbmNoUmVnZXh9LipgKSAvLyBlLmcuIGF1dGhvci1zYW5kYm94MS1teS1mZWF0dXJlLCB0ZXN0ID0gYXV0aG9yLXRlc3Qtc2FuZGJveDEtbXktZmVhdHVyZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGJ1aWxkIHByb2plY3QgKHRvIGNvcHkgZmVhdHVyZSBicmFuY2ggZmlsZXMgdG8gUzMgb24gZ2l0aHViIHB1c2gpLlxyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2l0aHViQ29kZUJ1aWxkUHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdCh0aGlzLCBgR2l0aHViQ29kZUJ1aWxkUHJvamVjdCR7c3RhZ2VQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9qZWN0TmFtZTogYGNvcHktZ2l0aHViLSR7c3RhZ2V9LWJyYW5jaC10by1zM2AsXHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiAwLjIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFydGlmYWN0czoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsZXM6ICcqKi8qJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgc291cmNlOiBnaXRIdWJCcmFuY2hTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYXJ0aWZhY3RzOiBjb2RlYnVpbGQuQXJ0aWZhY3RzLnMzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogYnJhbmNoRmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1Y2tldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5jbHVkZUJ1aWxkSWQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWNrYWdlWmlwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZGVudGlmaWVyOiAnR2l0aHViQXJ0aWZhY3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8gQ29kZUJ1aWxkIHByb2plY3QgcmVxdWlyZXMgcGVybWlzc2lvbnMgdG8gUzMgYnVja2V0IG9iamVjdHMuXHJcbiAgICAgICAgICAgICAgICBnaXRodWJDb2RlQnVpbGRQcm9qZWN0LmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbnM6IFsnczM6TGlzdEJ1Y2tldCcsICdzMzpHZXRPYmplY3QnLCAnczM6UHV0T2JqZWN0JywgJ3MzOkRlbGV0ZU9iamVjdCddLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWNrZXQuYnVja2V0QXJuLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtidWNrZXQuYnVja2V0QXJufS8qYFxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBwaXBlbGluZXMuQ29kZVBpcGVsaW5lKHRoaXMsIGBDZGtDb2RlUGlwZWxpbmUke3N0YWdlUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiBgY2RrLXBpcGVsaW5lLSR7c3RhZ2V9YCxcclxuICAgICAgICAgICAgICAgICAgICBjcm9zc0FjY291bnRLZXlzOiB0cnVlLCAvLyBSZXF1aXJlZCBmb3IgY3Jvc3MgYWNjb3VudCBkZXBsb3lzLlxyXG4gICAgICAgICAgICAgICAgICAgIHN5bnRoOiBuZXcgcGlwZWxpbmVzLlNoZWxsU3RlcCgnU3ludGgnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgU1RBR0U6IHByb3BzLnN0YWdlIC8vIFRoZSBDSUNEIHN0YWdlIHR5cGljYWxseSB0ZXN0IG9yIHByb2QuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiBwaXBlbGluZXMuQ29kZVBpcGVsaW5lU291cmNlLnMzKGJ1Y2tldCwgYnJhbmNoRmlsZU5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kczogcHJvcHMuY29tbWFuZHMgPz8gY29tbWFuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaW1hcnlPdXRwdXREaXJlY3RvcnlcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYnJhbmNoID0gYnJhbmNoUmVnZXguc2xpY2UoMSwgLTEpOyAvLyBSZW1vdmUgcGFyZW50aGVzaXMgZmlyc3QgYW5kIGxhc3QgY2hhci5cclxuICAgICAgICAgICAgICAgIHRoaXMuZW52aXJvbm1lbnRQaXBlbGluZXMucHVzaCh7IHN0YWdlLCBicmFuY2gsIHBpcGVsaW5lIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==