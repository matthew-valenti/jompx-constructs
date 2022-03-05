import { IConfig } from '../src/types/config.interface';

export const Config: IConfig = {
    '@jompx': {
        organizationName: 'test-org', // Lower case (use dashes if needed). Used to uniquely name resources e.g. S3 bucket name.
        gitHub: {
            repo: 'owner/repo'
        },
        // An environment is the target AWS account and region into which a stack will be deployed.
        environments: [
            {
                accountId: '863054937555',
                region: 'us-west-2',
                name: 'cicd-test'
            },
            {
                accountId: '896371249616',
                region: 'us-west-2',
                name: 'cicd-prod'
            },
            {
                accountId: 'abc123',
                region: 'us-west-2',
                name: 'prod'
            },
            {
                accountId: '706457422044',
                region: 'us-west-2',
                name: 'test'
            },
            {
                accountId: '066209653567',
                region: 'us-west-2',
                name: 'sandbox1'
            }
        ],
        stages: {
            prod: {
                environments: [
                    {
                        environmentType: 'cicd',
                        environmentName: 'cicd-prod'
                    },
                    {
                        environmentType: 'common',
                        environmentName: 'common-prod'
                    },
                    {
                        environmentType: 'cdk',
                        environmentName: 'prod'
                    }
                ]
            },
            uat: {
                environments: [
                    {
                        environmentType: 'cicd',
                        environmentName: 'cicd-prod'
                    },
                    {
                        environmentType: 'common',
                        environmentName: 'common-prod'
                    },
                    {
                        environmentType: 'cdk',
                        environmentName: 'uat'
                    }
                ]
            },
            test: {
                environments: [
                    {
                        environmentType: 'cicd',
                        environmentName: 'cicd-test'
                    },
                    {
                        environmentType: 'common',
                        environmentName: 'common-test'
                    },
                    {
                        environmentType: 'cdk',
                        environmentName: 'test'
                    }
                ]
            },
            sandbox1: {
                environments: [
                    {
                        environmentType: 'cicd',
                        environmentName: 'cicd-test'
                    },
                    {
                        environmentType: 'common',
                        environmentName: 'common-test'
                    },
                    {
                        environmentType: 'cdk',
                        environmentName: 'sandbox1'
                    }
                ]
            }
        }
    }
};
