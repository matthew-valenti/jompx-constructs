"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
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
        apps: [
            {
                name: 'admin',
                rootDomainName: 'jompx.com'
            },
            {
                name: 'app',
                rootDomainName: 'jompx.com'
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
                branch: '(sandbox1)',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9tcHguY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbmZpZy90ZXN0L2pvbXB4LmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLE1BQU0sR0FBWTtJQUMzQixRQUFRLEVBQUU7UUFDTixnQkFBZ0IsRUFBRSxRQUFRO1FBQzFCLDJGQUEyRjtRQUMzRixZQUFZLEVBQUU7WUFDVjtnQkFDSSxTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLElBQUksRUFBRSxXQUFXO2FBQ3BCO1lBQ0Q7Z0JBQ0ksU0FBUyxFQUFFLGNBQWM7Z0JBQ3pCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixJQUFJLEVBQUUsV0FBVzthQUNwQjtZQUNEO2dCQUNJLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsV0FBVztnQkFDbkIsSUFBSSxFQUFFLE1BQU07YUFDZjtZQUNEO2dCQUNJLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsV0FBVztnQkFDbkIsSUFBSSxFQUFFLE1BQU07YUFDZjtZQUNEO2dCQUNJLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsV0FBVztnQkFDbkIsSUFBSSxFQUFFLFVBQVU7YUFDbkI7U0FDSjtRQUNELElBQUksRUFBRTtZQUNGO2dCQUNJLElBQUksRUFBRSxPQUFPO2dCQUNiLGNBQWMsRUFBRSxXQUFXO2FBQzlCO1lBQ0Q7Z0JBQ0ksSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsY0FBYyxFQUFFLFdBQVc7YUFDOUI7U0FDSjtRQUNELE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRTtnQkFDRixNQUFNLEVBQUUsTUFBTTtnQkFDZCxXQUFXLEVBQUU7b0JBQ1Q7d0JBQ0ksSUFBSSxFQUFFLE1BQU07d0JBQ1osZUFBZSxFQUFFLFdBQVc7cUJBQy9CO29CQUNEO3dCQUNJLElBQUksRUFBRSxRQUFRO3dCQUNkLGVBQWUsRUFBRSxhQUFh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QUN4Qix1Q0FBdUM7QUFDdkMsdUNBQXVDO0FBQ3ZDLHdCQUF3QjtBQUN4QixvQkFBb0I7QUFDcEIsaUJBQWlCO0FBQ2pCLDBCQUEwQjtBQUMxQiwwQ0FBMEM7QUFDMUMsa0NBQWtDO0FBQ2xDLHdCQUF3QjtBQUN4Qix3Q0FBd0M7QUFDeEMsNENBQTRDO0FBQzVDLHlCQUF5QjtBQUN6Qix3QkFBd0I7QUFDeEIsMENBQTBDO0FBQzFDLDhDQUE4QztBQUM5Qyx5QkFBeUI7QUFDekIsd0JBQXdCO0FBQ3hCLHVDQUF1QztBQUN2QywyQ0FBMkM7QUFDM0Msd0JBQXdCO0FBQ3hCLG9CQUFvQjtBQUNwQixnQkFBZ0I7QUFDaEIsWUFBWTtBQUNaLFFBQVE7QUFDUixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy50eXBlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgQ29uZmlnOiBJQ29uZmlnID0ge1xyXG4gICAgJ0Bqb21weCc6IHtcclxuICAgICAgICBvcmdhbml6YXRpb25OYW1lOiAnbXktb3JnJywgLy8gTG93ZXIgY2FzZSAodXNlIGRhc2hlcyBpZiBuZWVkZWQpLiBVc2VkIHRvIHVuaXF1ZWx5IG5hbWUgcmVzb3VyY2VzIGUuZy4gUzMgYnVja2V0IG5hbWUuXHJcbiAgICAgICAgLy8gQW4gZW52aXJvbm1lbnQgaXMgdGhlIHRhcmdldCBBV1MgYWNjb3VudCBhbmQgcmVnaW9uIGludG8gd2hpY2ggYSBzdGFjayB3aWxsIGJlIGRlcGxveWVkLlxyXG4gICAgICAgIGVudmlyb25tZW50czogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICc4NjMwNTQ5Mzc1NTUnLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdjaWNkLXRlc3QnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFjY291bnRJZDogJzg5NjM3MTI0OTYxNicsXHJcbiAgICAgICAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtcHJvZCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnMjgxNjYwMDIwMzE4JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncHJvZCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnNzA2NDU3NDIyMDQ0JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAndGVzdCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnMDY2MjA5NjUzNTY3JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2FuZGJveDEnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIGFwcHM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FkbWluJyxcclxuICAgICAgICAgICAgICAgIHJvb3REb21haW5OYW1lOiAnam9tcHguY29tJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXBwJyxcclxuICAgICAgICAgICAgICAgIHJvb3REb21haW5OYW1lOiAnam9tcHguY29tJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBzdGFnZXM6IHtcclxuICAgICAgICAgICAgcHJvZDoge1xyXG4gICAgICAgICAgICAgICAgYnJhbmNoOiAnbWFpbicsXHJcbiAgICAgICAgICAgICAgICBkZXBsb3ltZW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudE5hbWU6ICdjaWNkLXByb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb21tb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudE5hbWU6ICdjb21tb24tcHJvZCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50TmFtZTogJ3Byb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1YXQ6IHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogJ3VhdCcsXHJcbiAgICAgICAgICAgICAgICBkZXBsb3ltZW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudE5hbWU6ICdjaWNkLXByb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb21tb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudE5hbWU6ICdjb21tb24tcHJvZCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVudmlyb25tZW50TmFtZTogJ3VhdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlc3Q6IHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogJ3Rlc3QnLFxyXG4gICAgICAgICAgICAgICAgZGVwbG95bWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY2ljZC10ZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY29tbW9uLXRlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudE5hbWU6ICd0ZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2FuZGJveDE6IHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogJyhzYW5kYm94MSknLFxyXG4gICAgICAgICAgICAgICAgZGVwbG95bWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY2ljZC10ZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW52aXJvbm1lbnROYW1lOiAnY29tbW9uLXRlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcHAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudE5hbWU6ICdzYW5kYm94MSdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuLy8gT2xkIG5hbWVzLlxyXG4vLyBleHBvcnQgY29uc3QgQ29uZmlnOiBJQ29uZmlnID0ge1xyXG4vLyAgICAgJ0Bqb21weCc6IHtcclxuLy8gICAgICAgICBvcmdhbml6YXRpb25OYW1lOiAnbXktb3JnJywgLy8gTG93ZXIgY2FzZSAodXNlIGRhc2hlcyBpZiBuZWVkZWQpLiBVc2VkIHRvIHVuaXF1ZWx5IG5hbWUgcmVzb3VyY2VzIGUuZy4gUzMgYnVja2V0IG5hbWUuXHJcbi8vICAgICAgICAgLy8gQW4gZW52aXJvbm1lbnQgaXMgdGhlIHRhcmdldCBBV1MgYWNjb3VudCBhbmQgcmVnaW9uIGludG8gd2hpY2ggYSBzdGFjayB3aWxsIGJlIGRlcGxveWVkLlxyXG4vLyAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4vLyAgICAgICAgICAgICB7XHJcbi8vICAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICc4NjMwNTQ5Mzc1NTUnLFxyXG4vLyAgICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuLy8gICAgICAgICAgICAgICAgIG5hbWU6ICdjaWNkLXRlc3QnXHJcbi8vICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgIGFjY291bnRJZDogJzg5NjM3MTI0OTYxNicsXHJcbi8vICAgICAgICAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxyXG4vLyAgICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtcHJvZCdcclxuLy8gICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgYWNjb3VudElkOiAnMjgxNjYwMDIwMzE4JyxcclxuLy8gICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbi8vICAgICAgICAgICAgICAgICBuYW1lOiAncHJvZCdcclxuLy8gICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgYWNjb3VudElkOiAnNzA2NDU3NDIyMDQ0JyxcclxuLy8gICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbi8vICAgICAgICAgICAgICAgICBuYW1lOiAndGVzdCdcclxuLy8gICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgYWNjb3VudElkOiAnMDY2MjA5NjUzNTY3JyxcclxuLy8gICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbi8vICAgICAgICAgICAgICAgICBuYW1lOiAnc2FuZGJveDEnXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICBdLFxyXG4vLyAgICAgICAgIHN0YWdlczoge1xyXG4vLyAgICAgICAgICAgICBwcm9kOiB7XHJcbi8vICAgICAgICAgICAgICAgICBicmFuY2g6ICdtYWluJyxcclxuLy8gICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC1wcm9kJ1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi1wcm9kJ1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Byb2QnXHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgXVxyXG4vLyAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICB1YXQ6IHtcclxuLy8gICAgICAgICAgICAgICAgIGJyYW5jaDogJ3VhdCcsXHJcbi8vICAgICAgICAgICAgICAgICBlbnZpcm9ubWVudHM6IFtcclxuLy8gICAgICAgICAgICAgICAgICAgICB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtcHJvZCdcclxuLy8gICAgICAgICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbW1vbicsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24tcHJvZCdcclxuLy8gICAgICAgICAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcCcsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd1YXQnXHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgXVxyXG4vLyAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICB0ZXN0OiB7XHJcbi8vICAgICAgICAgICAgICAgICBicmFuY2g6ICd0ZXN0JyxcclxuLy8gICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC10ZXN0J1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi10ZXN0J1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Rlc3QnXHJcbi8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICAgICAgXVxyXG4vLyAgICAgICAgICAgICB9LFxyXG4vLyAgICAgICAgICAgICBzYW5kYm94MToge1xyXG4vLyAgICAgICAgICAgICAgICAgYnJhbmNoOiAnKC1zYW5kYm94MS0pJyxcclxuLy8gICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC10ZXN0J1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi10ZXN0J1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgICAgICAgICAge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3NhbmRib3gxJ1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgICAgIF1cclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy8gfTtcclxuIl19