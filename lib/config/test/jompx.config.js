"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
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
exports.Config = {
    '@jompx': {
        organizationName: 'my-org',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9tcHguY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbmZpZy90ZXN0L2pvbXB4LmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBd0JFO0FBRVcsUUFBQSxNQUFNLEdBQVk7SUFDM0IsUUFBUSxFQUFFO1FBQ04sZ0JBQWdCLEVBQUUsUUFBUTtRQUMxQiwyRkFBMkY7UUFDM0YsWUFBWSxFQUFFO1lBQ1Y7Z0JBQ0ksU0FBUyxFQUFFLGNBQWM7Z0JBQ3pCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixJQUFJLEVBQUUsV0FBVzthQUNwQjtZQUNEO2dCQUNJLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsV0FBVztnQkFDbkIsSUFBSSxFQUFFLFdBQVc7YUFDcEI7WUFDRDtnQkFDSSxTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLElBQUksRUFBRSxNQUFNO2FBQ2Y7WUFDRDtnQkFDSSxTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLElBQUksRUFBRSxNQUFNO2FBQ2Y7WUFDRDtnQkFDSSxTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLElBQUksRUFBRSxVQUFVO2FBQ25CO1NBQ0o7UUFDRCxNQUFNLEVBQUU7WUFDSixJQUFJLEVBQUU7Z0JBQ0YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsV0FBVyxFQUFFO29CQUNUO3dCQUNJLElBQUksRUFBRSxNQUFNO3dCQUNaLGVBQWUsRUFBRSxXQUFXO3FCQUMvQjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsUUFBUTt3QkFDZCxlQUFlLEVBQUUsYUFBYTtxQkFDakM7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLEtBQUs7d0JBQ1gsZUFBZSxFQUFFLE1BQU07cUJBQzFCO2lCQUNKO2FBQ0o7WUFDRCxHQUFHLEVBQUU7Z0JB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QzFDLGtDQUFrQztBQUNsQyx3QkFBd0I7QUFDeEIsd0NBQXdDO0FBQ3hDLDRDQUE0QztBQUM1Qyx5QkFBeUI7QUFDekIsd0JBQXdCO0FBQ3hCLDBDQUEwQztBQUMxQyw4Q0FBOEM7QUFDOUMseUJBQXlCO0FBQ3pCLHdCQUF3QjtBQUN4Qix1Q0FBdUM7QUFDdkMsMkNBQTJDO0FBQzNDLHdCQUF3QjtBQUN4QixvQkFBb0I7QUFDcEIsZ0JBQWdCO0FBQ2hCLFlBQVk7QUFDWixRQUFRO0FBQ1IsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDb25maWcgfSBmcm9tICcuLi9jb25maWcudHlwZXMnO1xyXG5cclxuLypcclxuVE9ETzogSSB0aGluayB3ZSB3YW50IHRvIHJlbmFtZSBzdGFnZXMgdG8gdGhpczpcclxuc3RhZ2VzOiB7XHJcbiAgICBwcm9kOiB7XHJcbiAgICAgICAgYnJhbmNoOiAnbWFpbicsXHJcbiAgICAgICAgZGVwbG95bWVudHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3RhZ2U6ICdjaWNkJywgLy8gVGhpcyBpcyB0aGUgQ0RLIHN0YWdlIGJ1dCBkb2Vzbid0IG5lZWQgdG8gbWF0Y2ggdGhlIG5hbWUgZXhhY3RseSAtIGl0J3MganVzdCBhIGxvb2t1cC4gTWF5YmUgd2Ugc2hvdWxkIHR5cGUgdGhpcz8gT3IgbWFrZSBpdCBtYXRjaCBleGFjdGx5P1xyXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnQ6ICdjaWNkLXByb2QnLCAvLyBUaGlzIGlzIGEgcG9pbnRlciB0byB0aGUgQVdTIGFjY291bnQuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0YWdlOiAnbmV0d29yaycsXHJcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudDogJ3Byb2QnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0YWdlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiAnY29tbW9uLXByb2QnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0YWdlOiAnYXBwJyxcclxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50OiAncHJvZCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxuKi9cclxuXHJcbmV4cG9ydCBjb25zdCBDb25maWc6IElDb25maWcgPSB7XHJcbiAgICAnQGpvbXB4Jzoge1xyXG4gICAgICAgIG9yZ2FuaXphdGlvbk5hbWU6ICdteS1vcmcnLCAvLyBMb3dlciBjYXNlICh1c2UgZGFzaGVzIGlmIG5lZWRlZCkuIFVzZWQgdG8gdW5pcXVlbHkgbmFtZSByZXNvdXJjZXMgZS5nLiBTMyBidWNrZXQgbmFtZS5cclxuICAgICAgICAvLyBBbiBlbnZpcm9ubWVudCBpcyB0aGUgdGFyZ2V0IEFXUyBhY2NvdW50IGFuZCByZWdpb24gaW50byB3aGljaCBhIHN0YWNrIHdpbGwgYmUgZGVwbG95ZWQuXHJcbiAgICAgICAgZW52aXJvbm1lbnRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFjY291bnRJZDogJzg2MzA1NDkzNzU1NScsXHJcbiAgICAgICAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtdGVzdCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnODk2MzcxMjQ5NjE2JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC1wcm9kJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICcyODE2NjAwMjAzMTgnLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdwcm9kJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICc3MDY0NTc0MjIwNDQnLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICd0ZXN0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICcwNjYyMDk2NTM1NjcnLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzYW5kYm94MSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgc3RhZ2VzOiB7XHJcbiAgICAgICAgICAgIHByb2Q6IHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogJ21haW4nLFxyXG4gICAgICAgICAgICAgICAgZGVwbG95bWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY2ljZC1wcm9kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY29tbW9uLXByb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudE5hbWU6ICdwcm9kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdWF0OiB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2g6ICd1YXQnLFxyXG4gICAgICAgICAgICAgICAgZGVwbG95bWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY2ljZC1wcm9kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY29tbW9uLXByb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudE5hbWU6ICd1YXQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZXN0OiB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2g6ICd0ZXN0JyxcclxuICAgICAgICAgICAgICAgIGRlcGxveW1lbnRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2ljZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50TmFtZTogJ2NpY2QtdGVzdCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbW1vbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50TmFtZTogJ2NvbW1vbi10ZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAndGVzdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNhbmRib3gxOiB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2g6ICcoLXNhbmRib3gxLSknLFxyXG4gICAgICAgICAgICAgICAgZGVwbG95bWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY2ljZC10ZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY29tbW9uLXRlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudE5hbWU6ICdzYW5kYm94MSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuLy8gT2xkIG5hbWVzLlxyXG4vLyBleHBvcnQgY29uc3QgQ29uZmlnOiBJQ29uZmlnID0ge1xyXG4vLyAgICAgJ0Bqb21weCc6IHtcclxuLy8gICAgICAgICBvcmdhbml6YXRpb25OYW1lOiAnbXktb3JnJywgLy8gTG93ZXIgY2FzZSAodXNlIGRhc2hlcyBpZiBuZWVkZWQpLiBVc2VkIHRvIHVuaXF1ZWx5IG5hbWUgcmVzb3VyY2VzIGUuZy4gUzMgYnVja2V0IG5hbWUuXHJcbi8vICAgICAgICAgLy8gQW4gZW52aXJvbm1lbnQgaXMgdGhlIHRhcmdldCBBV1MgYWNjb3VudCBhbmQgcmVnaW9uIGludG8gd2hpY2ggYSBzdGFjayB3aWxsIGJlIGRlcGxveWVkLlxyXG4vLyAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4vLyAgICAgICAgICAgICB7XHJcbi8vICAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICc4NjMwNTQ5Mzc1NTUnLFxyXG4vLyAgICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuLy8gICAgICAgICAgICAgICAgIG5hbWU6ICdjaWNkLXRlc3QnXHJcbi8vICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgIGFjY291bnRJZDogJzg5NjM3MTI0OTYxNicsXHJcbi8vICAgICAgICAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxyXG4vLyAgICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtcHJvZCdcclxuLy8gICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgYWNjb3VudElkOiAnMjgxNjYwMDIwMzE4JyxcclxuLy8gICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbi8vICAgICAgICAgICAgICAgICBuYW1lOiAncHJvZCdcclxuLy8gICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgYWNjb3VudElkOiAnNzA2NDU3NDIyMDQ0JyxcclxuLy8gICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbi8vICAgICAgICAgICAgICAgICBuYW1lOiAndGVzdCdcclxuLy8gICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgYWNjb3VudElkOiAnMDY2MjA5NjUzNTY3JyxcclxuLy8gICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbi8vICAgICAgICAgICAgICAgICBuYW1lOiAnc2FuZGJveDEnXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICBdLFxyXG4vLyAgICAgICAgIHN0YWdlczoge1xyXG4vLyAgICAgICAgICAgICBwcm9kOiB7XHJcbi8vICAgICAgICAgICAgICAgICBicmFuY2g6ICdtYWluJyxcclxuLy8gICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC1wcm9kJ1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi1wcm9kJ1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Byb2QnXHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgXVxyXG4vLyAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICB1YXQ6IHtcclxuLy8gICAgICAgICAgICAgICAgIGJyYW5jaDogJ3VhdCcsXHJcbi8vICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudHM6IFtcclxuLy8gICAgICAgICAgICAgICAgICAgICB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtcHJvZCdcclxuLy8gICAgICAgICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbW1vbicsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24tcHJvZCdcclxuLy8gICAgICAgICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcCcsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd1YXQnXHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgXVxyXG4vLyAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICB0ZXN0OiB7XHJcbi8vICAgICAgICAgICAgICAgICBicmFuY2g6ICd0ZXN0JyxcclxuLy8gICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC10ZXN0J1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi10ZXN0J1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Rlc3QnXHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgXVxyXG4vLyAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICBzYW5kYm94MToge1xyXG4vLyAgICAgICAgICAgICAgICAgYnJhbmNoOiAnKC1zYW5kYm94MS0pJyxcclxuLy8gICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC10ZXN0J1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi10ZXN0J1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3NhbmRib3gxJ1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgIF1cclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy8gfTtcclxuIl19