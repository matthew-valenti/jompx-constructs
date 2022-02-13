import * as cdk from 'aws-cdk-lib';
import {
    CodePipeline,
    CodePipelineSource,
    ShellStep,
} from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';

export interface IJompxCdkPipelineProps {
    test: string;
}

/**
 * Deploy in parallel? READ THIS: https://docs.aws.amazon.com/cdk/api/v1/docs/pipelines-readme.html
 */
export class JompxCdkPipeline extends Construct {
    public readonly pipeline: cdk.pipelines.CodePipeline;

    constructor(scope: Construct, id: string, props: IJompxCdkPipelineProps = { test: 'hello; ' }) {
        super(scope, id);

        this.pipeline = this.pipeline = new CodePipeline(this, 'CodePipeline', {
            pipelineName: 'CdkPipeline',
            crossAccountKeys: true, // Required for cross account deploys.
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.gitHub(
                    'matthew-valenti/jompx-org',
                    'ci', // Branch.
                    {
                        // authentication: cdk.SecretValue.ssmSecure('/cicd/github/token', '1'),
                        authentication: cdk.SecretValue.secretsManager('cicd/github/token'),
                    },
                ), // AWS Secrets: github-token
                // commands: ['npm ci', 'npm run build', 'npx cdk synth']
                // npx -p typescript tsc   ???????????????
                commands: ['npm -g install typescript', 'npm install -g nx', 'ls', 'cd apps/cdk', 'npm ci', 'npx nx build cdk', 'npx nx synth cdk'],
                primaryOutputDirectory: 'apps/cdk/cdk.out',
            }),
        });

        console.log('!!!props.test!!!', props.test);
    }
}
