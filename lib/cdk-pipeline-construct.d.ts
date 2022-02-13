import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface IJompxCdkPipelineProps {
    test: string;
}
/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 */
export declare class JompxCdkPipeline extends Construct {
    readonly pipeline: cdk.pipelines.CodePipeline;
    constructor(scope: Construct, id: string, props?: IJompxCdkPipelineProps);
}
