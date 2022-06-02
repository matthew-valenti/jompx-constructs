"use strict";
// import * as cdk from 'aws-cdk-lib';
// import { Template } from 'aws-cdk-lib/assertions';
// // eslint-disable-next-line import/no-extraneous-dependencies
// import * as changeCase from 'change-case';
// import { Config } from '../config/config';
// import { Config as JompxConfig } from '../config/test/jompx.config';
// // import { HostingS3 } from '../hosting/s3.construct';
// import { AppPipeline } from './app-pipeline.construct';
// describe('IAppPipelineProps', () => {
//     test('stage=test creates code pipelines', () => {
//         const app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'sandbox1' } } });
//         const stack = new cdk.Stack(app);
//         const config = new Config(app.node);
//         const stages = new Map(Object.entries(config.stages()!));
//         const stage = config.stage();
//         const domainName = 'jompx.com';
//         const appNames = ['admin', 'client'];
//         appNames.forEach(appName => {
//             const appNamePascalCase = changeCase.pascalCase(appName);
//             const codebuildBuildSpecObject = {};
//             new AppPipeline(stack, `AppPipeline${appNamePascalCase}`, {
//                 stage,
//                 domainName,
//                 appName,
//                 gitHub: {
//                     owner: 'matthew-valenti',
//                     repo: 'jompx-org',
//                     token: cdk.SecretValue.secretsManager('cicd/github/token')
//                 },
//                 codebuildBuildSpecObject
//             });
//         });
//         const template = Template.fromStack(stack);
//         template.resourceCountIs('AWS::CodePipeline::Pipeline', appNames.length * stages.size); // One pipeline per app per stage.
//         // template.resourceCountIs('AWS::CodeBuild::Project', 0); // TODO
//     });
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0Lm1hbnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGlwZWxpbmUvYXBwLXBpcGVsaW5lLWNvbnN0cnVjdC50ZXN0Lm1hbnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUFzQztBQUN0QyxxREFBcUQ7QUFDckQsZ0VBQWdFO0FBQ2hFLDZDQUE2QztBQUM3Qyw2Q0FBNkM7QUFDN0MsdUVBQXVFO0FBQ3ZFLDBEQUEwRDtBQUMxRCwwREFBMEQ7QUFFMUQsd0NBQXdDO0FBQ3hDLHdEQUF3RDtBQUV4RCwyR0FBMkc7QUFDM0csNENBQTRDO0FBRTVDLCtDQUErQztBQUMvQyxvRUFBb0U7QUFDcEUsd0NBQXdDO0FBRXhDLDBDQUEwQztBQUMxQyxnREFBZ0Q7QUFFaEQsd0NBQXdDO0FBQ3hDLHdFQUF3RTtBQUV4RSxtREFBbUQ7QUFFbkQsMEVBQTBFO0FBQzFFLHlCQUF5QjtBQUN6Qiw4QkFBOEI7QUFDOUIsMkJBQTJCO0FBQzNCLDRCQUE0QjtBQUM1QixnREFBZ0Q7QUFDaEQseUNBQXlDO0FBQ3pDLGlGQUFpRjtBQUNqRixxQkFBcUI7QUFDckIsMkNBQTJDO0FBQzNDLGtCQUFrQjtBQUNsQixjQUFjO0FBRWQsc0RBQXNEO0FBQ3RELHFJQUFxSTtBQUNySSw2RUFBNkU7QUFDN0UsVUFBVTtBQUNWLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xyXG4vLyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbi8vIGltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG4vLyBpbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9jb25maWcvY29uZmlnJztcclxuLy8gaW1wb3J0IHsgQ29uZmlnIGFzIEpvbXB4Q29uZmlnIH0gZnJvbSAnLi4vY29uZmlnL3Rlc3Qvam9tcHguY29uZmlnJztcclxuLy8gLy8gaW1wb3J0IHsgSG9zdGluZ1MzIH0gZnJvbSAnLi4vaG9zdGluZy9zMy5jb25zdHJ1Y3QnO1xyXG4vLyBpbXBvcnQgeyBBcHBQaXBlbGluZSB9IGZyb20gJy4vYXBwLXBpcGVsaW5lLmNvbnN0cnVjdCc7XHJcblxyXG4vLyBkZXNjcmliZSgnSUFwcFBpcGVsaW5lUHJvcHMnLCAoKSA9PiB7XHJcbi8vICAgICB0ZXN0KCdzdGFnZT10ZXN0IGNyZWF0ZXMgY29kZSBwaXBlbGluZXMnLCAoKSA9PiB7XHJcblxyXG4vLyAgICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyAuLi5Kb21weENvbmZpZywgJ0Bqb21weC1sb2NhbCc6IHsgc3RhZ2U6ICdzYW5kYm94MScgfSB9IH0pO1xyXG4vLyAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xyXG5cclxuLy8gICAgICAgICBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKGFwcC5ub2RlKTtcclxuLy8gICAgICAgICBjb25zdCBzdGFnZXMgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKGNvbmZpZy5zdGFnZXMoKSEpKTtcclxuLy8gICAgICAgICBjb25zdCBzdGFnZSA9IGNvbmZpZy5zdGFnZSgpO1xyXG5cclxuLy8gICAgICAgICBjb25zdCBkb21haW5OYW1lID0gJ2pvbXB4LmNvbSc7XHJcbi8vICAgICAgICAgY29uc3QgYXBwTmFtZXMgPSBbJ2FkbWluJywgJ2NsaWVudCddO1xyXG5cclxuLy8gICAgICAgICBhcHBOYW1lcy5mb3JFYWNoKGFwcE5hbWUgPT4ge1xyXG4vLyAgICAgICAgICAgICBjb25zdCBhcHBOYW1lUGFzY2FsQ2FzZSA9IGNoYW5nZUNhc2UucGFzY2FsQ2FzZShhcHBOYW1lKTtcclxuXHJcbi8vICAgICAgICAgICAgIGNvbnN0IGNvZGVidWlsZEJ1aWxkU3BlY09iamVjdCA9IHt9O1xyXG5cclxuLy8gICAgICAgICAgICAgbmV3IEFwcFBpcGVsaW5lKHN0YWNrLCBgQXBwUGlwZWxpbmUke2FwcE5hbWVQYXNjYWxDYXNlfWAsIHtcclxuLy8gICAgICAgICAgICAgICAgIHN0YWdlLFxyXG4vLyAgICAgICAgICAgICAgICAgZG9tYWluTmFtZSxcclxuLy8gICAgICAgICAgICAgICAgIGFwcE5hbWUsXHJcbi8vICAgICAgICAgICAgICAgICBnaXRIdWI6IHtcclxuLy8gICAgICAgICAgICAgICAgICAgICBvd25lcjogJ21hdHRoZXctdmFsZW50aScsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgcmVwbzogJ2pvbXB4LW9yZycsXHJcbi8vICAgICAgICAgICAgICAgICAgICAgdG9rZW46IGNkay5TZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignY2ljZC9naXRodWIvdG9rZW4nKVxyXG4vLyAgICAgICAgICAgICAgICAgfSxcclxuLy8gICAgICAgICAgICAgICAgIGNvZGVidWlsZEJ1aWxkU3BlY09iamVjdFxyXG4vLyAgICAgICAgICAgICB9KTtcclxuLy8gICAgICAgICB9KTtcclxuXHJcbi8vICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xyXG4vLyAgICAgICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgYXBwTmFtZXMubGVuZ3RoICogc3RhZ2VzLnNpemUpOyAvLyBPbmUgcGlwZWxpbmUgcGVyIGFwcCBwZXIgc3RhZ2UuXHJcbi8vICAgICAgICAgLy8gdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIDApOyAvLyBUT0RPXHJcbi8vICAgICB9KTtcclxuLy8gfSk7XHJcbiJdfQ==