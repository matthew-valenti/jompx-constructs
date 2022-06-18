import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Config } from '../config/config';
import { Config as JompxConfig } from '../config/test/jompx.config';
import { CdkPipeline, ICdkPipelineProps } from './cdk-pipeline.construct';

describe('CdkPipelineStack', () => {
    test('stage=test creates code pipelines', () => {

        const app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'test' } } });
        const stack = new cdk.Stack(app);

        const config = new Config(app.node);

        const cdkPipelineProps: ICdkPipelineProps = {
            stage: config.stage(),
            gitHub: {
                owner: 'owner',
                repo: 'repo',
                // token: cdk.SecretValue.secretsManager('cicd/github/token')
                connectionArn: 'arn:aws:codestar-connections:us-west-2:863054937555:connection/38e739e3-ed21-4dbc-98f9-b97e40764d5b'
            }
        };

        const cdkPipeline = new CdkPipeline(stack, 'CdkPipeline', cdkPipelineProps);

        // Test branch names correct.
        const branches = cdkPipeline.environmentPipelines.map(o => o.branch);
        expect(branches).toEqual(['test-main', 'test-uat', 'test-test', 'test-sandbox1']);

        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::CodePipeline::Pipeline', branches.length);
    });

    test('stage=prod creates code pipelines', () => {

        const app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'prod' } } });
        const stack = new cdk.Stack(app);

        const config = new Config(app.node);

        const cdkPipelineProps: ICdkPipelineProps = {
            stage: config.stage(),
            gitHub: {
                owner: 'owner',
                repo: 'repo',
                // token: cdk.SecretValue.secretsManager('cicd/github/token')
                connectionArn: ''
            }
        };

        const cdkPipeline = new CdkPipeline(stack, 'CdkPipeline', cdkPipelineProps);

        // Test branch names correct.
        const branches = cdkPipeline.environmentPipelines.map(o => o.branch);
        expect(branches).toEqual(['main', 'uat', 'test', 'sandbox1']);

        const template = Template.fromStack(stack);
        // console.log('template', JSON.stringify(template));
        template.resourceCountIs('AWS::CodePipeline::Pipeline', branches.length);

        // Example of testing properties: https://docs.aws.amazon.com/cdk/v2/guide/testing.html
        // template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
        //   DeletionPolicy: 'Retain',
        //   UpdateReplacePolicy: 'Retain',
        // });
    });
});
