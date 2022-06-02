import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
export interface IAppPipelineProps {
    stage: string;
    appName: string;
    domainName: string;
    gitHub: IAppPipelineGitHubProps;
    codebuildBuildSpecObject: object;
    buildEnvironment?: cdk.aws_codebuild.BuildEnvironment;
}
export interface IAppPipelineGitHubProps {
    owner: string;
    repo: string;
    token: cdk.SecretValue;
}
export interface IEnvironmentPipeline {
    branch: string;
    pipeline: pipelines.CodePipeline;
}
export interface IAppPipelineOutputs {
    pipeline: cdk.aws_codepipeline.Pipeline;
}
export declare class AppPipeline extends Construct {
    environmentPipelines: IEnvironmentPipeline[];
    outputs: IAppPipelineOutputs;
    constructor(scope: Construct, id: string, props: IAppPipelineProps);
}
