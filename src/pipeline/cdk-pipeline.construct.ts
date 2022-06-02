import * as cdk from 'aws-cdk-lib';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as pipelines from 'aws-cdk-lib/pipelines';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';
import { Config } from '../config/config';

export interface ICdkPipelineProps {
    /**
     * The CICD stage. Typically prod or test.
     */
    stage: string;
    gitHub: ICdkPipelineGitHubProps;
    commands?: string[];
}

export interface ICdkPipelineGitHubProps {
    owner: string;
    repo: string;
    // token: cdk.SecretValue; // TODO: Allow GitHub token option.
    connectionArn: string;
}

export interface IEnvironmentPipeline {
    stage: string;
    branch: string;
    pipeline: pipelines.CodePipeline;
}

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
export class CdkPipeline extends Construct {
    public environmentPipelines: IEnvironmentPipeline[] = [];

    constructor(scope: Construct, id: string, props: ICdkPipelineProps) {
        super(scope, id);

        const config = new Config(this.node);
        const commands = ['npm install', 'npm -g install typescript', 'npm install -g nx', 'nx build cdk', 'nx synth cdk --args="--quiet --context stage=$STAGE"']; // AWS docs example commands: ['npm ci', 'npm run build', 'npx cdk synth']
        const primaryOutputDirectory = 'apps/cdk/cdk.out';

        const stages = new Map(Object.entries(config.stages()!));
        const branchStages = new Map([...stages].filter(([_, v]) => v.branch && !v.branch.startsWith('(') && !v.branch.endsWith(')')));
        const branchRegexStages = new Map([...stages].filter(([_, v]) => v.branch && v.branch.startsWith('(') && v.branch.endsWith(')')));

        // For static branches e.g. main, test.
        for (const [stage, stageValue] of branchStages.entries()) {

            const branch = (props.stage === 'prod') ? stageValue.branch : `${props.stage}-${stageValue.branch}`;

            // create a standard cdk pipeline for static branches. Performance is better (no S3 file copy required).
            const pipeline = new pipelines.CodePipeline(this, `CdkCodePipeline${changeCase.pascalCase(branch)}`, {
                pipelineName: `cdk-pipeline-${branch}`,
                crossAccountKeys: true, // Required for cross account deploys.
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
                    commands: props.commands ?? commands,
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
                publicReadAccess: false, // TODO: Is this needed?
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
                        fetchSubmodules: true, // For all Git sources, you can fetch submodules while cloing git repo.
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
                    crossAccountKeys: true, // Required for cross account deploys.
                    synth: new pipelines.ShellStep('Synth', {
                        env: {
                            STAGE: props.stage // The CICD stage typically test or prod.
                        },
                        input: pipelines.CodePipelineSource.s3(bucket, branchFileName),
                        commands: props.commands ?? commands,
                        primaryOutputDirectory
                    })
                });

                const branch = branchRegex.slice(1, -1); // Remove parenthesis first and last char.
                this.environmentPipelines.push({ stage, branch, pipeline });
            }
        }
    }
}
