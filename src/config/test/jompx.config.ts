import { IConfig } from '../config.types';

/*
TODO: I think we want to rename stages to this:
stages: {
    prod: {
        branch: 'main',
        deployments: [
            {
                stage: 'cicd', // This is the CDK stage but doesn't need to match the name exactly - it's just a lookup. Maybe we should type this? Or make it match exactly?
                environment: 'cicd-prod', // This is a pointer to the AWS account.
            },
            {
                stage: 'network',
                environment: 'prod'
            },
            {
                stage: 'common',
                environment: 'common-prod'
            },
            {
                stage: 'app',
                environment: 'prod'
            }
        ]
    }
*/

export const Config: IConfig = {
    '@jompx': {
        organizationName: 'my-org', // Lower case (use dashes if needed). Used to uniquely name resources e.g. S3 bucket name.
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
                accountId: '281660020318',
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
                deployments: [
                    {
                        type: 'cicd',
                        environmentName: 'cicd-prod'
                    },
                    {
                        type: 'common',
                        environmentName: 'common-prod'
                    },
                    {
                        type: 'app',
                        environmentName: 'prod'
                    }
                ]
            },
            uat: {
                branch: 'uat',
                deployments: [
                    {
                        type: 'cicd',
                        environmentName: 'cicd-prod'
                    },
                    {
                        type: 'common',
                        environmentName: 'common-prod'
                    },
                    {
                        type: 'app',
                        environmentName: 'uat'
                    }
                ]
            },
            test: {
                branch: 'test',
                deployments: [
                    {
                        type: 'cicd',
                        environmentName: 'cicd-test'
                    },
                    {
                        type: 'common',
                        environmentName: 'common-test'
                    },
                    {
                        type: 'app',
                        environmentName: 'test'
                    }
                ]
            },
            sandbox1: {
                branch: '(-sandbox1-)',
                deployments: [
                    {
                        type: 'cicd',
                        environmentName: 'cicd-test'
                    },
                    {
                        type: 'common',
                        environmentName: 'common-test'
                    },
                    {
                        type: 'app',
                        environmentName: 'sandbox1'
                    }
                ]
            }
        }
    }
};


// Old names.
// export const Config: IConfig = {
//     '@jompx': {
//         organizationName: 'my-org', // Lower case (use dashes if needed). Used to uniquely name resources e.g. S3 bucket name.
//         // An environment is the target AWS account and region into which a stack will be deployed.
//         environments: [
//             {
//                 accountId: '863054937555',
//                 region: 'us-west-2',
//                 name: 'cicd-test'
//             },
//             {
//                 accountId: '896371249616',
//                 region: 'us-west-2',
//                 name: 'cicd-prod'
//             },
//             {
//                 accountId: '281660020318',
//                 region: 'us-west-2',
//                 name: 'prod'
//             },
//             {
//                 accountId: '706457422044',
//                 region: 'us-west-2',
//                 name: 'test'
//             },
//             {
//                 accountId: '066209653567',
//                 region: 'us-west-2',
//                 name: 'sandbox1'
//             }
//         ],
//         stages: {
//             prod: {
//                 branch: 'main',
//                 environments: [
//                     {
//                         type: 'cicd',
//                         name: 'cicd-prod'
//                     },
//                     {
//                         type: 'common',
//                         name: 'common-prod'
//                     },
//                     {
//                         type: 'app',
//                         name: 'prod'
//                     }
//                 ]
//             },
//             uat: {
//                 branch: 'uat',
//                 environments: [
//                     {
//                         type: 'cicd',
//                         name: 'cicd-prod'
//                     },
//                     {
//                         type: 'common',
//                         name: 'common-prod'
//                     },
//                     {
//                         type: 'app',
//                         name: 'uat'
//                     }
//                 ]
//             },
//             test: {
//                 branch: 'test',
//                 environments: [
//                     {
//                         type: 'cicd',
//                         name: 'cicd-test'
//                     },
//                     {
//                         type: 'common',
//                         name: 'common-test'
//                     },
//                     {
//                         type: 'app',
//                         name: 'test'
//                     }
//                 ]
//             },
//             sandbox1: {
//                 branch: '(-sandbox1-)',
//                 environments: [
//                     {
//                         type: 'cicd',
//                         name: 'cicd-test'
//                     },
//                     {
//                         type: 'common',
//                         name: 'common-test'
//                     },
//                     {
//                         type: 'app',
//                         name: 'sandbox1'
//                     }
//                 ]
//             }
//         }
//     }
// };
