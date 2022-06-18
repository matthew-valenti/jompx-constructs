import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
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
    connectionArn: string;
}
export interface IEnvironmentPipeline {
    branch: string;
    pipelineStage: string;
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
 * The CICD test AWS account listens to branches with test in the branch name. It's important that test pipelines don't trigger on commits to main, test, sandbox1, etc.
 *
 * AWS CodePipeline recommends using a CodePipelineSource connection to securly connect to GitHub. However, CodeBuild only supports the old Github token authorization.
 * Stage branches use a connection. Regex stage branches use a token.
 * Setup steps are required to enable both a connection and a token.
 *
 * GitHub has a 20 web hook limit per event (per repo). It may be necessary to switch from web hook to polling or not create unused code pipelines (e.g. test-sandbox1 branch deploys may not be needed).
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
export declare class CdkPipeline extends Construct {
    environmentPipelines: IEnvironmentPipeline[];
    constructor(scope: Construct, id: string, props: ICdkPipelineProps);
}
