import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { JompxCdkPipeline } from '../src/cdk-pipeline-construct';

describe('JompxCdkPipelineStack', () => {
    test('stack', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);

        new JompxCdkPipeline(stack, 'JompxCdkPipeline', { test: 'testmatthew' });

        const template = Template.fromStack(stack);
        console.log('template', JSON.stringify(template));
        template.resourceCountIs('AWS::CodePipeline::Pipeline', 1);

    // Example of testing properties: https://docs.aws.amazon.com/cdk/v2/guide/testing.html
    // template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
    //   DeletionPolicy: 'Retain',
    //   UpdateReplacePolicy: 'Retain',
    // });
    });
});
