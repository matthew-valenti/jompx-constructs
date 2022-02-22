import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
export interface IJompxCdkPipelineProps {
    shellStepInput: pipelines.IFileSetProducer;
}
/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 * Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html
 * CDK doco: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
 * Build Spec Reference: https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html
 * nx cicd: https://nx.dev/ci/monorepo-ci-circle-ci
 *
 * Trigger apps pipeline??? https://stackoverflow.com/questions/62857925/how-to-invoke-a-pipeline-based-on-another-pipeline-success-using-aws-codecommit
 */
export declare class JompxCdkPipeline extends Construct {
    readonly pipeline: pipelines.CodePipeline;
    constructor(scope: Construct, id: string, props: IJompxCdkPipelineProps);
}
