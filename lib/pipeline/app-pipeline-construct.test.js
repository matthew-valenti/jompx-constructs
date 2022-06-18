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
/**
 * npx jest app-pipeline-construct.test.ts
 */
describe('IAppPipelineProps', () => {
    test('stage=test creates code pipelines', () => {
        const cdkApp = new cdk.App({ context: { ...jompx_config_1.Config, '@jompx-local': { stage: 'sandbox1' } } });
        const stack = new cdk.Stack(cdkApp);
        const config = new config_1.Config(cdkApp.node);
        const stage = config.stage();
        const apps = config.apps();
        apps === null || apps === void 0 ? void 0 : apps.forEach(app => {
            const appNamePascalCase = changeCase.pascalCase(app.name);
            // Dervie the app domain name from stage e.g. admin.jompx.com, admin.test.jompx.com, admin.sandbox1.admin.com
            const domainName = stage === 'prod' ? `${app.name}.${app.rootDomainName}` : `${app.name}.${stage}.${app.rootDomainName}`;
            // Create one S3 bucket per app.
            const hostingS3 = new s3_construct_1.HostingS3(stack, `HostingS3${appNamePascalCase}`, {
                domainName
            });
            const pipelineS3 = new app_pipeline_s3_construct_1.AppPipelineS3(stack, `AppPipelineS3${appNamePascalCase}`);
            const codebuildBuildSpecObject = {};
            new app_pipeline_construct_1.AppPipeline(stack, `AppPipeline${appNamePascalCase}`, {
                stage,
                appName: app.name,
                hostingBucket: hostingS3.bucket,
                pipelinegBucket: pipelineS3.bucket,
                gitHub: {
                    owner: 'matthew-valenti',
                    repo: 'jompx-org',
                    token: cdk.SecretValue.secretsManager('/cicd/github/token')
                },
                codebuildBuildSpecObject
            });
        });
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::CodePipeline::Pipeline', 2); // One pipeline per app.
        // template.resourceCountIs('AWS::CodeBuild::Project', 0); // TODO
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BpcGVsaW5lL2FwcC1waXBlbGluZS1jb25zdHJ1Y3QudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyx1REFBa0Q7QUFDbEQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQyw2Q0FBMEM7QUFDMUMsOERBQW9FO0FBQ3BFLDBEQUFvRDtBQUNwRCxxRkFBc0U7QUFDdEUscUVBQXVEO0FBRXZEOztHQUVHO0FBRUgsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBRTNDLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcscUJBQVcsRUFBRSxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbkcsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFN0IsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRzNCLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDaEIsTUFBTSxpQkFBaUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUUxRCw2R0FBNkc7WUFDN0csTUFBTSxVQUFVLEdBQUcsS0FBSyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLEtBQUssSUFBSSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFekgsZ0NBQWdDO1lBQ2hDLE1BQU0sU0FBUyxHQUFHLElBQUksd0JBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxpQkFBaUIsRUFBRSxFQUFFO2dCQUNwRSxVQUFVO2FBQ2IsQ0FBQyxDQUFDO1lBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSx5Q0FBYSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDO1lBRWpGLE1BQU0sd0JBQXdCLEdBQUcsRUFBRSxDQUFDO1lBRXBDLElBQUksb0NBQVcsQ0FBQyxLQUFLLEVBQUUsY0FBYyxpQkFBaUIsRUFBRSxFQUFFO2dCQUN0RCxLQUFLO2dCQUNMLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSTtnQkFDakIsYUFBYSxFQUFFLFNBQVMsQ0FBQyxNQUFNO2dCQUMvQixlQUFlLEVBQUUsVUFBVSxDQUFDLE1BQU07Z0JBQ2xDLE1BQU0sRUFBRTtvQkFDSixLQUFLLEVBQUUsaUJBQWlCO29CQUN4QixJQUFJLEVBQUUsV0FBVztvQkFDakIsS0FBSyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLG9CQUFvQixDQUFDO2lCQUM5RDtnQkFDRCx3QkFBd0I7YUFDM0IsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxFQUFFO1FBRUgsTUFBTSxRQUFRLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsUUFBUSxDQUFDLGVBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLHdCQUF3QjtRQUNwRixrRUFBa0U7SUFDdEUsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcnO1xyXG5pbXBvcnQgeyBDb25maWcgYXMgSm9tcHhDb25maWcgfSBmcm9tICcuLi9jb25maWcvdGVzdC9qb21weC5jb25maWcnO1xyXG5pbXBvcnQgeyBIb3N0aW5nUzMgfSBmcm9tICcuLi9ob3N0aW5nL3MzLmNvbnN0cnVjdCc7XHJcbmltcG9ydCB7IEFwcFBpcGVsaW5lUzMgfSBmcm9tICcuLi9waXBlbGluZS9hcHAtcGlwZWxpbmUtczMuY29uc3RydWN0JztcclxuaW1wb3J0IHsgQXBwUGlwZWxpbmUgfSBmcm9tICcuL2FwcC1waXBlbGluZS5jb25zdHJ1Y3QnO1xyXG5cclxuLyoqXHJcbiAqIG5weCBqZXN0IGFwcC1waXBlbGluZS1jb25zdHJ1Y3QudGVzdC50c1xyXG4gKi9cclxuXHJcbmRlc2NyaWJlKCdJQXBwUGlwZWxpbmVQcm9wcycsICgpID0+IHtcclxuICAgIHRlc3QoJ3N0YWdlPXRlc3QgY3JlYXRlcyBjb2RlIHBpcGVsaW5lcycsICgpID0+IHtcclxuXHJcbiAgICAgICAgY29uc3QgY2RrQXBwID0gbmV3IGNkay5BcHAoeyBjb250ZXh0OiB7IC4uLkpvbXB4Q29uZmlnLCAnQGpvbXB4LWxvY2FsJzogeyBzdGFnZTogJ3NhbmRib3gxJyB9IH0gfSk7XHJcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGNka0FwcCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcoY2RrQXBwLm5vZGUpO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlID0gY29uZmlnLnN0YWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFwcHMgPSBjb25maWcuYXBwcygpO1xyXG5cclxuXHJcbiAgICAgICAgYXBwcz8uZm9yRWFjaChhcHAgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhcHBOYW1lUGFzY2FsQ2FzZSA9IGNoYW5nZUNhc2UucGFzY2FsQ2FzZShhcHAubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBEZXJ2aWUgdGhlIGFwcCBkb21haW4gbmFtZSBmcm9tIHN0YWdlIGUuZy4gYWRtaW4uam9tcHguY29tLCBhZG1pbi50ZXN0LmpvbXB4LmNvbSwgYWRtaW4uc2FuZGJveDEuYWRtaW4uY29tXHJcbiAgICAgICAgICAgIGNvbnN0IGRvbWFpbk5hbWUgPSBzdGFnZSA9PT0gJ3Byb2QnID8gYCR7YXBwLm5hbWV9LiR7YXBwLnJvb3REb21haW5OYW1lfWAgOiBgJHthcHAubmFtZX0uJHtzdGFnZX0uJHthcHAucm9vdERvbWFpbk5hbWV9YDtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBvbmUgUzMgYnVja2V0IHBlciBhcHAuXHJcbiAgICAgICAgICAgIGNvbnN0IGhvc3RpbmdTMyA9IG5ldyBIb3N0aW5nUzMoc3RhY2ssIGBIb3N0aW5nUzMke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgIGRvbWFpbk5hbWVcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZVMzID0gbmV3IEFwcFBpcGVsaW5lUzMoc3RhY2ssIGBBcHBQaXBlbGluZVMzJHthcHBOYW1lUGFzY2FsQ2FzZX1gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvZGVidWlsZEJ1aWxkU3BlY09iamVjdCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgbmV3IEFwcFBpcGVsaW5lKHN0YWNrLCBgQXBwUGlwZWxpbmUke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuICAgICAgICAgICAgICAgIHN0YWdlLFxyXG4gICAgICAgICAgICAgICAgYXBwTmFtZTogYXBwLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBob3N0aW5nQnVja2V0OiBob3N0aW5nUzMuYnVja2V0LFxyXG4gICAgICAgICAgICAgICAgcGlwZWxpbmVnQnVja2V0OiBwaXBlbGluZVMzLmJ1Y2tldCxcclxuICAgICAgICAgICAgICAgIGdpdEh1Yjoge1xyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiAnbWF0dGhldy12YWxlbnRpJyxcclxuICAgICAgICAgICAgICAgICAgICByZXBvOiAnam9tcHgtb3JnJyxcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbjogY2RrLlNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCcvY2ljZC9naXRodWIvdG9rZW4nKVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGNvZGVidWlsZEJ1aWxkU3BlY09iamVjdFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xyXG4gICAgICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgMik7IC8vIE9uZSBwaXBlbGluZSBwZXIgYXBwLlxyXG4gICAgICAgIC8vIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCAwKTsgLy8gVE9ET1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXX0=