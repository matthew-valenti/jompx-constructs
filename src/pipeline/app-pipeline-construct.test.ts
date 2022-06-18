import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Config } from '../config/config';
import { Config as JompxConfig } from '../config/test/jompx.config';
import { HostingS3 } from '../hosting/s3.construct';
import { AppPipelineS3 } from '../pipeline/app-pipeline-s3.construct';
import { AppPipeline } from './app-pipeline.construct';

/**
 * npx jest app-pipeline-construct.test.ts
 */

describe('IAppPipelineProps', () => {
    test('stage=test creates code pipelines', () => {

        const cdkApp = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'sandbox1' } } });
        const stack = new cdk.Stack(cdkApp);

        const config = new Config(cdkApp.node);
        const stage = config.stage();

        const apps = config.apps();


        apps?.forEach(app => {
            const appNamePascalCase = changeCase.pascalCase(app.name);

            // Dervie the app domain name from stage e.g. admin.jompx.com, admin.test.jompx.com, admin.sandbox1.admin.com
            const domainName = stage === 'prod' ? `${app.name}.${app.rootDomainName}` : `${app.name}.${stage}.${app.rootDomainName}`;

            // Create one S3 bucket per app.
            const hostingS3 = new HostingS3(stack, `HostingS3${appNamePascalCase}`, {
                domainName
            });

            const pipelineS3 = new AppPipelineS3(stack, `AppPipelineS3${appNamePascalCase}`);

            const codebuildBuildSpecObject = {};

            new AppPipeline(stack, `AppPipeline${appNamePascalCase}`, {
                stage,
                appName: app.name,
                hostingBucket: hostingS3.bucket,
                pipelinegBucket: pipelineS3.bucket,
                gitHub: {
                    owner: 'matthew-valenti',
                    repo: 'jompx-org',
                    token: cdk.SecretValue.secretsManager('/cicd/github/token')
                },
                codebuildBuildSpecObject
            });
        });

        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::CodePipeline::Pipeline', 2); // One pipeline per app.
        // template.resourceCountIs('AWS::CodeBuild::Project', 0); // TODO
    });
});
