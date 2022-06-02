"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const config_1 = require("../config/config");
const jompx_config_1 = require("../config/test/jompx.config");
const s3_construct_1 = require("../hosting/s3.construct");
const app_pipeline_s3_construct_1 = require("../pipeline/app-pipeline-s3.construct");
const app_pipeline_construct_1 = require("./app-pipeline.construct");
describe('IAppPipelineProps', () => {
    test('stage=test creates code pipelines', () => {
        const app = new cdk.App({ context: { ...jompx_config_1.Config, '@jompx-local': { stage: 'sandbox1' } } });
        const stack = new cdk.Stack(app);
        const config = new config_1.Config(app.node);
        const stage = config.stage();
        const domainName = 'jompx.com';
        const appNames = ['admin', 'client'];
        appNames.forEach(appName => {
            const appNamePascalCase = changeCase.pascalCase(appName);
            const hostingS3 = new s3_construct_1.HostingS3(stack, `HostingS3${appNamePascalCase}`, {
                domainName,
                appName
            });
            const pipelineS3 = new app_pipeline_s3_construct_1.AppPipelineS3(stack, `AppPipelineS3${appNamePascalCase}`);
            const codebuildBuildSpecObject = {};
            new app_pipeline_construct_1.AppPipeline(stack, `AppPipeline${appNamePascalCase}`, {
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
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::CodePipeline::Pipeline', 2); // One pipeline per app.
        // template.resourceCountIs('AWS::CodeBuild::Project', 0); // TODO
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BpcGVsaW5lL2FwcC1waXBlbGluZS1jb25zdHJ1Y3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyx1REFBa0Q7QUFDbEQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQyw2Q0FBMEM7QUFDMUMsOERBQW9FO0FBQ3BFLDBEQUFvRDtBQUNwRCxxRkFBc0U7QUFDdEUscUVBQXVEO0FBRXZELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHLHFCQUFXLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTdCLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQztRQUMvQixNQUFNLFFBQVEsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVyQyxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0saUJBQWlCLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV6RCxNQUFNLFNBQVMsR0FBRyxJQUFJLHdCQUFTLENBQUMsS0FBSyxFQUFFLFlBQVksaUJBQWlCLEVBQUUsRUFBRTtnQkFDcEUsVUFBVTtnQkFDVixPQUFPO2FBQ1YsQ0FBQyxDQUFDO1lBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSx5Q0FBYSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1lBRWpGLE1BQU0sd0JBQXdCLEdBQUcsRUFBRSxDQUFDO1lBQ3BDLElBQUksb0NBQVcsQ0FBQyxLQUFLLEVBQUUsY0FBYyxpQkFBaUIsRUFBRSxFQUFFO2dCQUN0RCxLQUFLO2dCQUNMLE9BQU87Z0JBQ1AsYUFBYSxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFDdkMsZUFBZSxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsTUFBTTtnQkFDMUMsTUFBTSxFQUFFO29CQUNKLEtBQUssRUFBRSxpQkFBaUI7b0JBQ3hCLElBQUksRUFBRSxXQUFXO29CQUNqQixLQUFLLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLENBQUM7aUJBQzdEO2dCQUNELHdCQUF3QjthQUMzQixDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLFFBQVEsQ0FBQyxlQUFlLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyx3QkFBd0I7UUFDcEYsa0VBQWtFO0lBQ3RFLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuaW1wb3J0IHsgQ29uZmlnIGFzIEpvbXB4Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL3Rlc3Qvam9tcHguY29uZmlnJztcclxuaW1wb3J0IHsgSG9zdGluZ1MzIH0gZnJvbSAnLi4vaG9zdGluZy9zMy5jb25zdHJ1Y3QnO1xyXG5pbXBvcnQgeyBBcHBQaXBlbGluZVMzIH0gZnJvbSAnLi4vcGlwZWxpbmUvYXBwLXBpcGVsaW5lLXMzLmNvbnN0cnVjdCc7XHJcbmltcG9ydCB7IEFwcFBpcGVsaW5lIH0gZnJvbSAnLi9hcHAtcGlwZWxpbmUuY29uc3RydWN0JztcclxuXHJcbmRlc2NyaWJlKCdJQXBwUGlwZWxpbmVQcm9wcycsICgpID0+IHtcclxuICAgIHRlc3QoJ3N0YWdlPXRlc3QgY3JlYXRlcyBjb2RlIHBpcGVsaW5lcycsICgpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IC4uLkpvbXB4Q29uZmlnLCAnQGpvbXB4LWxvY2FsJzogeyBzdGFnZTogJ3NhbmRib3gxJyB9IH0gfSk7XHJcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcoYXBwLm5vZGUpO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlID0gY29uZmlnLnN0YWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRvbWFpbk5hbWUgPSAnam9tcHguY29tJztcclxuICAgICAgICBjb25zdCBhcHBOYW1lcyA9IFsnYWRtaW4nLCAnY2xpZW50J107XHJcblxyXG4gICAgICAgIGFwcE5hbWVzLmZvckVhY2goYXBwTmFtZSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFwcE5hbWVQYXNjYWxDYXNlID0gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKGFwcE5hbWUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaG9zdGluZ1MzID0gbmV3IEhvc3RpbmdTMyhzdGFjaywgYEhvc3RpbmdTMyR7YXBwTmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICAgICAgZG9tYWluTmFtZSxcclxuICAgICAgICAgICAgICAgIGFwcE5hbWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZVMzID0gbmV3IEFwcFBpcGVsaW5lUzMoc3RhY2ssIGBBcHBQaXBlbGluZVMzJHthcHBOYW1lUGFzY2FsQ2FzZX1gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvZGVidWlsZEJ1aWxkU3BlY09iamVjdCA9IHt9O1xyXG4gICAgICAgICAgICBuZXcgQXBwUGlwZWxpbmUoc3RhY2ssIGBBcHBQaXBlbGluZSR7YXBwTmFtZVBhc2NhbENhc2V9YCwge1xyXG4gICAgICAgICAgICAgICAgc3RhZ2UsXHJcbiAgICAgICAgICAgICAgICBhcHBOYW1lLFxyXG4gICAgICAgICAgICAgICAgaG9zdGluZ0J1Y2tldDogaG9zdGluZ1MzLm91dHB1dHMuYnVja2V0LFxyXG4gICAgICAgICAgICAgICAgcGlwZWxpbmVnQnVja2V0OiBwaXBlbGluZVMzLm91dHB1dHMuYnVja2V0LFxyXG4gICAgICAgICAgICAgICAgZ2l0SHViOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6ICdtYXR0aGV3LXZhbGVudGknLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcG86ICdqb21weC1vcmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiBjZGsuU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2NpY2QvZ2l0aHViL3Rva2VuJylcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb2RlYnVpbGRCdWlsZFNwZWNPYmplY3RcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcclxuICAgICAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIDIpOyAvLyBPbmUgcGlwZWxpbmUgcGVyIGFwcC5cclxuICAgICAgICAvLyB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0JywgMCk7IC8vIFRPRE9cclxuICAgIH0pO1xyXG59KTtcclxuIl19