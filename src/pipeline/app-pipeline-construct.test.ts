import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Config } from '../config/config';
import { Config as JompxConfig } from '../config/test/jompx.config';
import { HostingS3 } from '../hosting/s3.construct';
import { AppPipelineS3 } from '../pipeline/app-pipeline-s3.construct';
import { AppPipeline } from './app-pipeline.construct';

describe('IAppPipelineProps', () => {
    test('stage=test creates code pipelines', () => {

        const app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'sandbox1' } } });
        const stack = new cdk.Stack(app);

        const config = new Config(app.node);
        const stage = config.stage();

        const domainName = 'jompx.com';
        const appNames = ['admin', 'client'];

        appNames.forEach(appName => {
            const appNamePascalCase = changeCase.pascalCase(appName);

            const hostingS3 = new HostingS3(stack, `HostingS3${appNamePascalCase}`, {
                domainName,
                appName
            });

            const pipelineS3 = new AppPipelineS3(stack, `AppPipelineS3${appNamePascalCase}`);

            const codebuildBuildSpecObject = {};
            new AppPipeline(stack, `AppPipeline${appNamePascalCase}`, {
                stage,
                appName,
                hostingBucket: hostingS3.outputs.bucket,
                pipelinegBucket: pipelineS3.outputs.bucket,
                gitHub: {
                    owner: 'matthew-valenti',
                    repo: 'jompx-org',
                    token: cdk.SecretValue.secretsManager('cicd/github/token')
                },
                codebuildBuildSpecObject
            });
        });

        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::CodePipeline::Pipeline', 2); // One pipeline per app.
        // template.resourceCountIs('AWS::CodeBuild::Project', 0); // TODO
    });
});
