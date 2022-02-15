import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
export interface IJompxCdkPipelineProps {
    shellStepInput: pipelines.IFileSetProducer;
}
/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 */
export declare class JompxCdkPipeline extends Construct {
    readonly pipeline: pipelines.CodePipeline;
    constructor(scope: Construct, id: string, props: IJompxCdkPipelineProps);
}
