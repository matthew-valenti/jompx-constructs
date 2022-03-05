import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { JompxCdkPipelineBranch, IJompxCdkPipelineBranchProps } from '../src/constructs/cdk-pipeline-branch.construct';
import { Config as JompxConfig } from './jompx.config';
import { Local as JompxLocalConfig } from './jompx.local';

describe('JompxCdkPipelineStack', () => {
    test('stack', () => {

        const app = new cdk.App({ context: { ...JompxConfig, ...JompxLocalConfig } });
        const stack = new cdk.Stack(app);

        const jompxCdkPipelineBranchProps: IJompxCdkPipelineBranchProps = {
            environmentNameSubstring: 'sandbox',
            gitHubOwner: 'owner',
            gitHubRepo: 'repo'
        };

        new JompxCdkPipelineBranch(stack, 'JompxCdkPipelineBranch', jompxCdkPipelineBranchProps);

        const template = Template.fromStack(stack);
        // console.log('template', JSON.stringify(template));
        template.resourceCountIs('AWS::S3::Bucket', 2); // One main bucket + one bucket for each sandbox (created by CodePipeline).
        template.resourceCountIs('AWS::CodePipeline::Pipeline', 1); // One bucket for each sandbox.
    });
});
