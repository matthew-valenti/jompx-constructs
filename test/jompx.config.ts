import { IConfig } from '../src/types/config';

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
                branch: 'main',
                environments: [
                    {
                        type: 'cicd',
                        name: 'cicd-prod'
                    },
                    {
                        type: 'common',
                        name: 'common-prod'
                    },
                    {
                        type: 'main',
                        name: 'prod'
                    }
                ]
            },
            uat: {
                branch: 'uat',
                environments: [
                    {
                        type: 'cicd',
                        name: 'cicd-prod'
                    },
                    {
                        type: 'common',
                        name: 'common-prod'
                    },
                    {
                        type: 'main',
                        name: 'uat'
                    }
                ]
            },
            test: {
                branch: 'test',
                environments: [
                    {
                        type: 'cicd',
                        name: 'cicd-test'
                    },
                    {
                        type: 'common',
                        name: 'common-test'
                    },
                    {
                        type: 'main',
                        name: 'test'
                    }
                ]
            },
            sandbox123: {
                branch: '(-sandbox1-)',
                environments: [
                    {
                        type: 'cicd',
                        name: 'cicd-test'
                    },
                    {
                        type: 'common',
                        name: 'common-test'
                    },
                    {
                        type: 'main',
                        name: 'sandbox1'
                    }
                ]
            }
        }
    }
};
