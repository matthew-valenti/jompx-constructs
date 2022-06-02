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
/**
 * I prefer the concept of all pipelines being on a single CICD AWS account.
 * - We can secure the GitHub token.
 * - No sandbox clutter.
 * - 1x S3 passthru source.
 * However, what do we do about test vs. prod? It over complicates things.
 * It's so simple to have one pipeline per account. I can make a change test and deploy it without affecting all accounts. This is the biggest advantage.
 */
export declare class AppPipeline extends Construct {
    environmentPipelines: IEnvironmentPipeline[];
    outputs: IAppPipelineOutputs;
    constructor(scope: Construct, id: string, props: IAppPipelineProps);
}
