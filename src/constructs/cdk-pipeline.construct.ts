import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { IEnvironment, Stage } from '../classes/environment';

export interface IJompxCdkPipelineProps {
    shellStepInput: pipelines.IFileSetProducer;
}

/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 * Continuous integration and delivery (CI/CD) using CDK Pipelines: https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html
 * CDK doco: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html
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
                commands: ['npm install', 'npm -g install typescript', 'npm install -g nx', 'cd apps/cdk', 'npm run build', 'npx cdk synth'], // AWS docs example commands: ['npm ci', 'npm run build', 'npx cdk synth']
                primaryOutputDirectory: 'apps/cdk/cdk.out'
            })
        });

        // TODO: Consider moving the commands to a separate script file? Not sure if this helps or hurts us.
        // stage.addPost(new ShellStep('validate', {
        //     input: source,
        //     commands: ['sh ./tests/validate.sh']
        // }));
    }
}

// 'npx nx build cdk', 'npx nx synth cdk'