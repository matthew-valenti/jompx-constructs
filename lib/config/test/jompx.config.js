"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
exports.Config = {
    '@jompx': {
        organizationName: 'test-org',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiam9tcHguY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbmZpZy90ZXN0L2pvbXB4LmNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLE1BQU0sR0FBWTtJQUMzQixRQUFRLEVBQUU7UUFDTixnQkFBZ0IsRUFBRSxVQUFVO1FBQzVCLDJGQUEyRjtRQUMzRixZQUFZLEVBQUU7WUFDVjtnQkFDSSxTQUFTLEVBQUUsY0FBYztnQkFDekIsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLElBQUksRUFBRSxXQUFXO2FBQ3BCO1lBQ0Q7Z0JBQ0ksU0FBUyxFQUFFLGNBQWM7Z0JBQ3pCLE1BQU0sRUFBRSxXQUFXO2dCQUNuQixJQUFJLEVBQUUsV0FBVzthQUNwQjtZQUNEO2dCQUNJLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixNQUFNLEVBQUUsV0FBVztnQkFDbkIsSUFBSSxFQUFFLE1BQU07YUFDZjtZQUNEO2dCQUNJLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsV0FBVztnQkFDbkIsSUFBSSxFQUFFLE1BQU07YUFDZjtZQUNEO2dCQUNJLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsV0FBVztnQkFDbkIsSUFBSSxFQUFFLFVBQVU7YUFDbkI7U0FDSjtRQUNELE1BQU0sRUFBRTtZQUNKLElBQUksRUFBRTtnQkFDRixNQUFNLEVBQUUsTUFBTTtnQkFDZCxZQUFZLEVBQUU7b0JBQ1Y7d0JBQ0ksSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLFdBQVc7cUJBQ3BCO29CQUNEO3dCQUNJLElBQUksRUFBRSxRQUFRO3dCQUNkLElBQUksRUFBRSxhQUFhO3FCQUN0QjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsTUFBTTtxQkFDZjtpQkFDSjthQUNKO1lBQ0QsR0FBRyxFQUFFO2dCQUNELE1BQU0sRUFBRSxLQUFLO2dCQUNiLFlBQVksRUFBRTtvQkFDVjt3QkFDSSxJQUFJLEVBQUUsTUFBTTt3QkFDWixJQUFJLEVBQUUsV0FBVztxQkFDcEI7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLFFBQVE7d0JBQ2QsSUFBSSxFQUFFLGFBQWE7cUJBQ3RCO29CQUNEO3dCQUNJLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRSxLQUFLO3FCQUNkO2lCQUNKO2FBQ0o7WUFDRCxJQUFJLEVBQUU7Z0JBQ0YsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsWUFBWSxFQUFFO29CQUNWO3dCQUNJLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRSxXQUFXO3FCQUNwQjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsYUFBYTtxQkFDdEI7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLE1BQU07cUJBQ2Y7aUJBQ0o7YUFDSjtZQUNELFVBQVUsRUFBRTtnQkFDUixNQUFNLEVBQUUsY0FBYztnQkFDdEIsWUFBWSxFQUFFO29CQUNWO3dCQUNJLElBQUksRUFBRSxNQUFNO3dCQUNaLElBQUksRUFBRSxXQUFXO3FCQUNwQjtvQkFDRDt3QkFDSSxJQUFJLEVBQUUsUUFBUTt3QkFDZCxJQUFJLEVBQUUsYUFBYTtxQkFDdEI7b0JBQ0Q7d0JBQ0ksSUFBSSxFQUFFLE1BQU07d0JBQ1osSUFBSSxFQUFFLFVBQVU7cUJBQ25CO2lCQUNKO2FBQ0o7U0FDSjtLQUNKO0NBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDb25maWcgfSBmcm9tICcuLi9jb25maWcudHlwZXMnO1xyXG5cclxuZXhwb3J0IGNvbnN0IENvbmZpZzogSUNvbmZpZyA9IHtcclxuICAgICdAam9tcHgnOiB7XHJcbiAgICAgICAgb3JnYW5pemF0aW9uTmFtZTogJ3Rlc3Qtb3JnJywgLy8gTG93ZXIgY2FzZSAodXNlIGRhc2hlcyBpZiBuZWVkZWQpLiBVc2VkIHRvIHVuaXF1ZWx5IG5hbWUgcmVzb3VyY2VzIGUuZy4gUzMgYnVja2V0IG5hbWUuXHJcbiAgICAgICAgLy8gQW4gZW52aXJvbm1lbnQgaXMgdGhlIHRhcmdldCBBV1MgYWNjb3VudCBhbmQgcmVnaW9uIGludG8gd2hpY2ggYSBzdGFjayB3aWxsIGJlIGRlcGxveWVkLlxyXG4gICAgICAgIGVudmlyb25tZW50czogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhY2NvdW50SWQ6ICc4NjMwNTQ5Mzc1NTUnLFxyXG4gICAgICAgICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdjaWNkLXRlc3QnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFjY291bnRJZDogJzg5NjM3MTI0OTYxNicsXHJcbiAgICAgICAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NpY2QtcHJvZCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnYWJjMTIzJyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAncHJvZCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnNzA2NDU3NDIyMDQ0JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAndGVzdCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWNjb3VudElkOiAnMDY2MjA5NjUzNTY3JyxcclxuICAgICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2FuZGJveDEnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIHN0YWdlczoge1xyXG4gICAgICAgICAgICBwcm9kOiB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2g6ICdtYWluJyxcclxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NpY2QnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY2ljZC1wcm9kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY29tbW9uJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ2NvbW1vbi1wcm9kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbWFpbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdwcm9kJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdWF0OiB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2g6ICd1YXQnLFxyXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2ljZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjaWNkLXByb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb21tb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uLXByb2QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYWluJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3VhdCdcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHRlc3Q6IHtcclxuICAgICAgICAgICAgICAgIGJyYW5jaDogJ3Rlc3QnLFxyXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2ljZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjaWNkLXRlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb21tb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uLXRlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYWluJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3Rlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzYW5kYm94MTIzOiB7XHJcbiAgICAgICAgICAgICAgICBicmFuY2g6ICcoLXNhbmRib3gxLSknLFxyXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnY2ljZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdjaWNkLXRlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdjb21tb24nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnY29tbW9uLXRlc3QnXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdtYWluJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3NhbmRib3gxJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuIl19