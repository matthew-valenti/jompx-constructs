"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const config_1 = require("../config/config");
const jompx_config_1 = require("../config/test/jompx.config");
// import { HostingS3 } from '../hosting/s3.construct';
const app_pipeline_construct_1 = require("./app-pipeline.construct");
describe('IAppPipelineProps', () => {
    test('stage=test creates code pipelines', () => {
        const app = new cdk.App({ context: { ...jompx_config_1.Config, '@jompx-local': { stage: 'sandbox1' } } });
        const stack = new cdk.Stack(app);
        const config = new config_1.Config(app.node);
        const stages = new Map(Object.entries(config.stages()));
        const stage = config.stage();
        const domainName = 'jompx.com';
        const appNames = ['admin', 'client'];
        appNames.forEach(appName => {
            const appNamePascalCase = changeCase.pascalCase(appName);
            const codebuildBuildSpecObject = {};
            new app_pipeline_construct_1.AppPipeline(stack, `AppPipeline${appNamePascalCase}`, {
                stage,
                domainName,
                appName,
                gitHub: {
                    owner: 'matthew-valenti',
                    repo: 'jompx-org',
                    token: cdk.SecretValue.secretsManager('cicd/github/token')
                },
                codebuildBuildSpecObject
            });
        });
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::CodePipeline::Pipeline', appNames.length * stages.size); // One pipeline per app per stage.
        // template.resourceCountIs('AWS::CodeBuild::Project', 0); // TODO
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0IGNvcHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGlwZWxpbmUvYXBwLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0IGNvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsdURBQWtEO0FBQ2xELDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsNkNBQTBDO0FBQzFDLDhEQUFvRTtBQUNwRSx1REFBdUQ7QUFDdkQscUVBQXVEO0FBRXZELFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHLHFCQUFXLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU3QixNQUFNLFVBQVUsR0FBRyxXQUFXLENBQUM7UUFDL0IsTUFBTSxRQUFRLEdBQUcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFckMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUN2QixNQUFNLGlCQUFpQixHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFekQsTUFBTSx3QkFBd0IsR0FBRyxFQUFFLENBQUM7WUFFcEMsSUFBSSxvQ0FBVyxDQUFDLEtBQUssRUFBRSxjQUFjLGlCQUFpQixFQUFFLEVBQUU7Z0JBQ3RELEtBQUs7Z0JBQ0wsVUFBVTtnQkFDVixPQUFPO2dCQUNQLE1BQU0sRUFBRTtvQkFDSixLQUFLLEVBQUUsaUJBQWlCO29CQUN4QixJQUFJLEVBQUUsV0FBVztvQkFDakIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDO2lCQUM3RDtnQkFDRCx3QkFBd0I7YUFDM0IsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQyxRQUFRLENBQUMsZUFBZSxDQUFDLDZCQUE2QixFQUFFLFFBQVEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsa0NBQWtDO1FBQzFILGtFQUFrRTtJQUN0RSxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL2NvbmZpZyc7XHJcbmltcG9ydCB7IENvbmZpZyBhcyBKb21weENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy90ZXN0L2pvbXB4LmNvbmZpZyc7XHJcbi8vIGltcG9ydCB7IEhvc3RpbmdTMyB9IGZyb20gJy4uL2hvc3RpbmcvczMuY29uc3RydWN0JztcclxuaW1wb3J0IHsgQXBwUGlwZWxpbmUgfSBmcm9tICcuL2FwcC1waXBlbGluZS5jb25zdHJ1Y3QnO1xyXG5cclxuZGVzY3JpYmUoJ0lBcHBQaXBlbGluZVByb3BzJywgKCkgPT4ge1xyXG4gICAgdGVzdCgnc3RhZ2U9dGVzdCBjcmVhdGVzIGNvZGUgcGlwZWxpbmVzJywgKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7IGNvbnRleHQ6IHsgLi4uSm9tcHhDb25maWcsICdAam9tcHgtbG9jYWwnOiB7IHN0YWdlOiAnc2FuZGJveDEnIH0gfSB9KTtcclxuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcclxuXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gbmV3IENvbmZpZyhhcHAubm9kZSk7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhjb25maWcuc3RhZ2VzKCkhKSk7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSBjb25maWcuc3RhZ2UoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZG9tYWluTmFtZSA9ICdqb21weC5jb20nO1xyXG4gICAgICAgIGNvbnN0IGFwcE5hbWVzID0gWydhZG1pbicsICdjbGllbnQnXTtcclxuXHJcbiAgICAgICAgYXBwTmFtZXMuZm9yRWFjaChhcHBOYW1lID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYXBwTmFtZVBhc2NhbENhc2UgPSBjaGFuZ2VDYXNlLnBhc2NhbENhc2UoYXBwTmFtZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb2RlYnVpbGRCdWlsZFNwZWNPYmplY3QgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIG5ldyBBcHBQaXBlbGluZShzdGFjaywgYEFwcFBpcGVsaW5lJHthcHBOYW1lUGFzY2FsQ2FzZX1gLCB7XHJcbiAgICAgICAgICAgICAgICBzdGFnZSxcclxuICAgICAgICAgICAgICAgIGRvbWFpbk5hbWUsXHJcbiAgICAgICAgICAgICAgICBhcHBOYW1lLFxyXG4gICAgICAgICAgICAgICAgZ2l0SHViOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6ICdtYXR0aGV3LXZhbGVudGknLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlcG86ICdqb21weC1vcmcnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuOiBjZGsuU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2NpY2QvZ2l0aHViL3Rva2VuJylcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBjb2RlYnVpbGRCdWlsZFNwZWNPYmplY3RcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcclxuICAgICAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIGFwcE5hbWVzLmxlbmd0aCAqIHN0YWdlcy5zaXplKTsgLy8gT25lIHBpcGVsaW5lIHBlciBhcHAgcGVyIHN0YWdlLlxyXG4gICAgICAgIC8vIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCAwKTsgLy8gVE9ET1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXX0=