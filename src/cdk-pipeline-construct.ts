import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export interface IJompxCdkPipelineProps {
    shellStepInput: pipelines.IFileSetProducer;
}

/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
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
                commands: ['npm ci', 'npm -g install typescript', 'npm install -g nx', 'cd apps/cdk', 'npm run build', 'npx cdk synth'], // AWS docs example commands: ['npm ci', 'npm run build', 'npx cdk synth']
                primaryOutputDirectory: 'apps/cdk/cdk.out'
            })
        });
    }
}

// 'npx nx build cdk', 'npx nx synth cdk'