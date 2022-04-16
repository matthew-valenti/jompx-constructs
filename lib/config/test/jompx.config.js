"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
exports.Config = {
    '@jompx': {
        organizationName: 'test-org',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9tcHguY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbmZpZy90ZXN0L2pvbXB4LmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLE1BQU0sR0FBWTtJQUMzQixRQUFRLEVBQUU7UUFDTixnQkFBZ0IsRUFBRSxVQUFVO1FBQzVCLE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRSxZQUFZO1NBQ3JCO1FBQ0QsMkZBQTJGO1FBQzNGLFlBQVksRUFBRTtZQUNWO2dCQUNJLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsV0FBVztnQkFDbkIsSUFBSSxFQUFFLFdBQVc7YUFDcEI7WUFDRDtnQkFDSSxTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLElBQUksRUFBRSxXQUFXO2FBQ3BCO1lBQ0Q7Z0JBQ0ksU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixJQUFJLEVBQUUsTUFBTTthQUNmO1lBQ0Q7Z0JBQ0ksU0FBUyxFQUFFLGNBQWM7Z0JBQ3pCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixJQUFJLEVBQUUsTUFBTTthQUNmO1lBQ0Q7Z0JBQ0ksU0FBUyxFQUFFLGNBQWM7Z0JBQ3pCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixJQUFJLEVBQUUsVUFBVTthQUNuQjtTQUNKO1FBQ0QsTUFBTSxFQUFFO1lBQ0osSUFBSSxFQUFFO2dCQUNGLE1BQU0sRUFBRSxNQUFNO2dCQUNkLFlBQVksRUFBRTtvQkFDVjt3QkFDSSxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsV0FBVztxQkFDcEI7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLGFBQWE7cUJBQ3RCO29CQUNEO3dCQUNJLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRSxNQUFNO3FCQUNmO2lCQUNKO2FBQ0o7WUFDRCxHQUFHLEVBQUU7Z0JBQ0QsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsWUFBWSxFQUFFO29CQUNWO3dCQUNJLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRSxXQUFXO3FCQUNwQjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsYUFBYTtxQkFDdEI7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLEtBQUs7cUJBQ2Q7aUJBQ0o7YUFDSjtZQUNELElBQUksRUFBRTtnQkFDRixNQUFNLEVBQUUsTUFBTTtnQkFDZCxZQUFZLEVBQUU7b0JBQ1Y7d0JBQ0ksSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLFdBQVc7cUJBQ3BCO29CQUNEO3dCQUNJLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxhQUFhO3FCQUN0QjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsTUFBTTtxQkFDZjtpQkFDSjthQUNKO1lBQ0QsVUFBVSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixZQUFZLEVBQUU7b0JBQ1Y7d0JBQ0ksSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLFdBQVc7cUJBQ3BCO29CQUNEO3dCQUNJLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxhQUFhO3FCQUN0QjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsVUFBVTtxQkFDbkI7aUJBQ0o7YUFDSjtTQUNKO0tBQ0o7Q0FDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUNvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy50eXBlcyc7XHJcblxyXG5leHBvcnQgY29uc3QgQ29uZmlnOiBJQ29uZmlnID0ge1xyXG4gICAgJ0Bqb21weCc6IHtcclxuICAgICAgICBvcmdhbml6YXRpb25OYW1lOiAndGVzdC1vcmcnLCAvLyBMb3dlciBjYXNlICh1c2UgZGFzaGVzIGlmIG5lZWRlZCkuIFVzZWQgdG8gdW5pcXVlbHkgbmFtZSByZXNvdXJjZXMgZS5nLiBTMyBidWNrZXQgbmFtZS5cclxuICAgICAgICBnaXRIdWI6IHtcclxuICAgICAgICAgICAgcmVwbzogJ293bmVyL3JlcG8nXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBBbiBlbnZpcm9ubWVudCBpcyB0aGUgdGFyZ2V0IEFXUyBhY2NvdW50IGFuZCByZWdpb24gaW50byB3aGljaCBhIHN0YWNrIHdpbGwgYmUgZGVwbG95ZWQuXHJcbiAgICAgICAgZW52aXJvbm1lbnRzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFjY291bnRJZDogJzg2MzA1NDkzNzU1NScsXHJcbiAgICAgICAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtdGVzdCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnODk2MzcxMjQ5NjE2JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC1wcm9kJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICdhYmMxMjMnLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdwcm9kJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICc3MDY0NTc0MjIwNDQnLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICd0ZXN0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICcwNjYyMDk2NTM1NjcnLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdzYW5kYm94MSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgc3RhZ2VzOiB7XHJcbiAgICAgICAgICAgIHByb2Q6IHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogJ21haW4nLFxyXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2ljZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjaWNkLXByb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb21tb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uLXByb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYWluJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Byb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB1YXQ6IHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogJ3VhdCcsXHJcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtcHJvZCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbW1vbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24tcHJvZCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21haW4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAndWF0J1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVzdDoge1xyXG4gICAgICAgICAgICAgICAgYnJhbmNoOiAndGVzdCcsXHJcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtdGVzdCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbW1vbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24tdGVzdCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21haW4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAndGVzdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNhbmRib3gxMjM6IHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogJygtc2FuZGJveDEtKScsXHJcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaWNkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtdGVzdCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NvbW1vbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjb21tb24tdGVzdCdcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ21haW4nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnc2FuZGJveDEnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4iXX0=