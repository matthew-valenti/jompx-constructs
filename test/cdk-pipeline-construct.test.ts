import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
// import { CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Config } from '../src/classes/config';
import { CdkPipeline, ICdkPipelineProps } from '../src/constructs/cdk-pipeline.construct';
import { Config as JompxConfig } from './jompx.config';
// import { Local as JompxLocalConfig } from './jompx.local';

describe('CdkPipelineStack', () => {
    test('stack > stage = prod', () => {

        const app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'prod' } } });
        const stack = new cdk.Stack(app);

        const config = new Config(app.node);

        const cdkPipelineProps: ICdkPipelineProps = {
            stage: config.stage(),
            gitHub: {
                owner: 'owner',
                repo: 'repo',
                token: cdk.SecretValue.secretsManager('cicd/github/token')
            }
        };

        const cdkPipeline = new CdkPipeline(stack, 'CdkPipeline', cdkPipelineProps);

        // Test branch names correct.
        const branches = cdkPipeline.environmentPipelines.map(o => o.branch);
        expect(branches).toEqual(['main', 'uat', 'test', '-sandbox1-']);

        const template = Template.fromStack(stack);
        // console.log('template', JSON.stringify(template));
        template.resourceCountIs('AWS::CodePipeline::Pipeline', branches.length);

        // Example of testing properties: https://docs.aws.amazon.com/cdk/v2/guide/testing.html
        // template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
        //   DeletionPolicy: 'Retain',
        //   UpdateReplacePolicy: 'Retain',
        // });
    });

    test('stack > stage = test', () => {

        const app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'test' } } });
        const stack = new cdk.Stack(app);

        const config = new Config(app.node);

        const cdkPipelineProps: ICdkPipelineProps = {
            stage: config.stage(),
            gitHub: {
                owner: 'owner',
                repo: 'repo',
                token: cdk.SecretValue.secretsManager('cicd/github/token')
            }
        };

        const cdkPipeline = new CdkPipeline(stack, 'CdkPipeline', cdkPipelineProps);

        // Test branch names correct.
        const branches = cdkPipeline.environmentPipelines.map(o => o.branch);
        expect(branches).toEqual(['test-main', 'test-uat', 'test-test', '-test-sandbox1-']);

        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::CodePipeline::Pipeline', branches.length);
    });
});
