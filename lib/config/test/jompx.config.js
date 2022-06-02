"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
/*
TODO: I think we want to rename stages to this:
stages: {
    prod: {
        branch: 'main',
        deploys: [
            {
                stageName: 'cicd', // This is the CDK stage but doesn't need to match the name exactly - it's just a lookup. Maybe we should type this? Or make it match exactly?
                deployToAccount: 'cicd-prod', // This is a pointer to the AWS account.
            },
            {
                cdkStage: 'network',
                deployToAccount: 'prod'
            },
            {
                stageName: 'common',
                deployToAccount: 'common-prod'
            },
            {
                stageName: 'app',
                deployToAccount: 'prod'
            }
        ]
    }
*/
// Change test to sit (systems integration testing)???
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
                        type: 'app',
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
                        type: 'app',
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
                        type: 'app',
                        name: 'test'
                    }
                ]
            },
            sandbox1: {
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
                        type: 'app',
                        name: 'sandbox1'
                    }
                ]
            }
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9tcHguY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbmZpZy90ZXN0L2pvbXB4LmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBd0JFO0FBRUYsc0RBQXNEO0FBRXpDLFFBQUEsTUFBTSxHQUFZO0lBQzNCLFFBQVEsRUFBRTtRQUNOLGdCQUFnQixFQUFFLFFBQVE7UUFDMUIsMkZBQTJGO1FBQzNGLFlBQVksRUFBRTtZQUNWO2dCQUNJLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsV0FBVztnQkFDbkIsSUFBSSxFQUFFLFdBQVc7YUFDcEI7WUFDRDtnQkFDSSxTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLElBQUksRUFBRSxXQUFXO2FBQ3BCO1lBQ0Q7Z0JBQ0ksU0FBUyxFQUFFLGNBQWM7Z0JBQ3pCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixJQUFJLEVBQUUsTUFBTTthQUNmO1lBQ0Q7Z0JBQ0ksU0FBUyxFQUFFLGNBQWM7Z0JBQ3pCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixJQUFJLEVBQUUsTUFBTTthQUNmO1lBQ0Q7Z0JBQ0ksU0FBUyxFQUFFLGNBQWM7Z0JBQ3pCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixJQUFJLEVBQUUsVUFBVTthQUNuQjtTQUNKO1FBQ0QsTUFBTSxFQUFFO1lBQ0osSUFBSSxFQUFFO2dCQUNGLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFlBQVksRUFBRTtvQkFDVjt3QkFDSSxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsV0FBVztxQkFDcEI7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLGFBQWE7cUJBQ3RCO29CQUNEO3dCQUNJLElBQUksRUFBRSxLQUFLO3dCQUNYLElBQUksRUFBRSxNQUFNO3FCQUNmO2lCQUNKO2FBQ0o7WUFDRCxHQUFHLEVBQUU7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsWUFBWSxFQUFFO29CQUNWO3dCQUNJLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRSxXQUFXO3FCQUNwQjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsYUFBYTtxQkFDdEI7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLEtBQUs7d0JBQ1gsSUFBSSxFQUFFLEtBQUs7cUJBQ2Q7aUJBQ0o7YUFDSjtZQUNELElBQUksRUFBRTtnQkFDRixNQUFNLEVBQUUsTUFBTTtnQkFDZCxZQUFZLEVBQUU7b0JBQ1Y7d0JBQ0ksSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLFdBQVc7cUJBQ3BCO29CQUNEO3dCQUNJLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxhQUFhO3FCQUN0QjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsS0FBSzt3QkFDWCxJQUFJLEVBQUUsTUFBTTtxQkFDZjtpQkFDSjthQUNKO1lBQ0QsUUFBUSxFQUFFO2dCQUNOLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixZQUFZLEVBQUU7b0JBQ1Y7d0JBQ0ksSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLFdBQVc7cUJBQ3BCO29CQUNEO3dCQUNJLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxhQUFhO3FCQUN0QjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsS0FBSzt3QkFDWCxJQUFJLEVBQUUsVUFBVTtxQkFDbkI7aUJBQ0o7YUFDSjtTQUNKO0tBQ0o7Q0FDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy50eXBlcyc7XHJcblxyXG4vKlxyXG5UT0RPOiBJIHRoaW5rIHdlIHdhbnQgdG8gcmVuYW1lIHN0YWdlcyB0byB0aGlzOlxyXG5zdGFnZXM6IHtcclxuICAgIHByb2Q6IHtcclxuICAgICAgICBicmFuY2g6ICdtYWluJyxcclxuICAgICAgICBkZXBsb3lzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0YWdlTmFtZTogJ2NpY2QnLCAvLyBUaGlzIGlzIHRoZSBDREsgc3RhZ2UgYnV0IGRvZXNuJ3QgbmVlZCB0byBtYXRjaCB0aGUgbmFtZSBleGFjdGx5IC0gaXQncyBqdXN0IGEgbG9va3VwLiBNYXliZSB3ZSBzaG91bGQgdHlwZSB0aGlzPyBPciBtYWtlIGl0IG1hdGNoIGV4YWN0bHk/XHJcbiAgICAgICAgICAgICAgICBkZXBsb3lUb0FjY291bnQ6ICdjaWNkLXByb2QnLCAvLyBUaGlzIGlzIGEgcG9pbnRlciB0byB0aGUgQVdTIGFjY291bnQuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGNka1N0YWdlOiAnbmV0d29yaycsXHJcbiAgICAgICAgICAgICAgICBkZXBsb3lUb0FjY291bnQ6ICdwcm9kJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBzdGFnZU5hbWU6ICdjb21tb24nLFxyXG4gICAgICAgICAgICAgICAgZGVwbG95VG9BY2NvdW50OiAnY29tbW9uLXByb2QnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHN0YWdlTmFtZTogJ2FwcCcsXHJcbiAgICAgICAgICAgICAgICBkZXBsb3lUb0FjY291bnQ6ICdwcm9kJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG4qL1xyXG5cclxuLy8gQ2hhbmdlIHRlc3QgdG8gc2l0IChzeXN0ZW1zIGludGVncmF0aW9uIHRlc3RpbmcpPz8/XHJcblxyXG5leHBvcnQgY29uc3QgQ29uZmlnOiBJQ29uZmlnID0ge1xyXG4gICAgJ0Bqb21weCc6IHtcclxuICAgICAgICBvcmdhbml6YXRpb25OYW1lOiAnbXktb3JnJywgLy8gTG93ZXIgY2FzZSAodXNlIGRhc2hlcyBpZiBuZWVkZWQpLiBVc2VkIHRvIHVuaXF1ZWx5IG5hbWUgcmVzb3VyY2VzIGUuZy4gUzMgYnVja2V0IG5hbWUuXHJcbiAgICAgICAgLy8gQW4gZW52aXJvbm1lbnQgaXMgdGhlIHRhcmdldCBBV1MgYWNjb3VudCBhbmQgcmVnaW9uIGludG8gd2hpY2ggYSBzdGFjayB3aWxsIGJlIGRlcGxveWVkLlxyXG4gICAgICAgIGVudmlyb25tZW50czogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICc4NjMwNTQ5Mzc1NTUnLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdjaWNkLXRlc3QnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFjY291bnRJZDogJzg5NjM3MTI0OTYxNicsXHJcbiAgICAgICAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtcHJvZCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnMjgxNjYwMDIwMzE4JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncHJvZCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnNzA2NDU3NDIyMDQ0JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAndGVzdCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnMDY2MjA5NjUzNTY3JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2FuZGJveDEnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIHN0YWdlczoge1xyXG4gICAgICAgICAgICBwcm9kOiB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2g6ICdtYWluJyxcclxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC1wcm9kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi1wcm9kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Byb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1YXQ6IHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogJ3VhdCcsXHJcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtcHJvZCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbW1vbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24tcHJvZCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FwcCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICd1YXQnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0ZXN0OiB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2g6ICd0ZXN0JyxcclxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC10ZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi10ZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Rlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzYW5kYm94MToge1xyXG4gICAgICAgICAgICAgICAgYnJhbmNoOiAnKC1zYW5kYm94MS0pJyxcclxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC10ZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi10ZXN0J1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnYXBwJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3NhbmRib3gxJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuIl19