import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
export interface ICdkPipelineProps {
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
 */
export declare class CdkPipeline extends Construct {
    environmentPipelines: IEnvironmentPipeline[];
    constructor(scope: Construct, id: string, props: ICdkPipelineProps);
}
