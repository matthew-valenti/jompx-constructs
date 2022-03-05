import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { JompxCdkPipeline, IJompxCdkPipelineProps } from '../src/constructs/cdk-pipeline.construct';

describe('JompxCdkPipelineStack', () => {
    test('stack', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);

        const jompxCdkPipelineProps: IJompxCdkPipelineProps = {
            stage: 'test',
            shellStepInput: CodePipelineSource.gitHub(
                'owner/repo',
                'main',
                { authentication: cdk.SecretValue.secretsManager('cicd/github/token') }
            )
        };

        new JompxCdkPipeline(stack, 'JompxCdkPipeline', jompxCdkPipelineProps);

        const template = Template.fromStack(stack);
        // console.log('template', JSON.stringify(template));
        template.resourceCountIs('AWS::CodePipeline::Pipeline', 1);

        // Example of testing properties: https://docs.aws.amazon.com/cdk/v2/guide/testing.html
        // template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
        //   DeletionPolicy: 'Retain',
        //   UpdateReplacePolicy: 'Retain',
        // });
    });
});
