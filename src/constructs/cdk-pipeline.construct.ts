// import * as codebuild from 'aws-cdk-lib/aws-codebuild';
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
export class JompxCdkPipeline extends Construct {
    public readonly pipeline: pipelines.CodePipeline;

    constructor(scope: Construct, id: string, props: IJompxCdkPipelineProps) {
        super(scope, id);

        this.pipeline = new pipelines.CodePipeline(this, 'CodePipeline', {
            pipelineName: 'CdkPipeline',
            crossAccountKeys: true, // Required for cross account deploys.
            synth: new pipelines.ShellStep('Synth', {
                input: props.shellStepInput,
                commands: ['ls', 'npm install', 'npm -g install typescript', 'npm install -g nx', 'nx build cdk', 'nx synth cdk'], // AWS docs example commands: ['npm ci', 'npm run build', 'npx cdk synth']
                primaryOutputDirectory: 'apps/cdk/cdk.out'
            })
        });
    }
}

// 'npx nx build cdk', 'npx nx synth cdk'