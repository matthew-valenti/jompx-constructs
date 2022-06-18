"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncDatasource = void 0;
const appsync = require("@aws-cdk/aws-appsync-alpha");
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
// import { Config } from '../src/classes/config';
// import { AppSync, IAppSyncProps } from '../../src/constructs/app-sync/app-sync.construct';
const jompx = require("../../../src");
const jompx_config_1 = require("../../config/test/jompx.config");
const mysql_schema_1 = require("./mysql.schema");
/**
 * npx jest app-sync.test.ts
 */
// For convenience and strong typing, use an enum for AppSync datasource ids.
var AppSyncDatasource;
(function (AppSyncDatasource) {
    AppSyncDatasource["mySql"] = "mySql";
    AppSyncDatasource["cognito"] = "cognito";
})(AppSyncDatasource = exports.AppSyncDatasource || (exports.AppSyncDatasource = {}));
describe('AppSyncStack', () => {
    test('create schema', () => {
        const app = new cdk.App({ context: { ...jompx_config_1.Config, '@jompx-local': { stage: 'test' } } });
        const stack = new cdk.Stack(app);
        // const config = new Config(app.node);
        // Create Cognito resource.
        const jompxCognito = new jompx.Cognito(stack, 'Cognito', {
            name: 'apps',
            appCodes: ['admin']
        });
        const appSyncProps = {
            name: 'api',
            additionalAuthorizationModes: [
                {
                    authorizationType: appsync.AuthorizationType.USER_POOL,
                    userPoolConfig: { userPool: jompxCognito.userPool }
                }
            ]
        };
        // Create AWS AppSync resource.
        const jompxAppSync = new jompx.AppSync(stack, 'AppSync', appSyncProps);
        const schemaBuilder = jompxAppSync.schemaBuilder;
        // Add MySQL datasource.
        const appSyncMySqlDataSource = new jompx.AppSyncMySqlDataSource(stack, AppSyncDatasource.mySql, {});
        schemaBuilder.addDataSource(AppSyncDatasource.mySql, appSyncMySqlDataSource.lambdaFunction);
        // Add MySQL schema.
        const mySqlSchema = new mysql_schema_1.MySqlSchema(schemaBuilder.dataSources);
        schemaBuilder.addSchemaTypes(mySqlSchema.types);
        schemaBuilder.create();
        // schemaBuilder.create({ schema: true, operations: true });
        const template = assertions_1.Template.fromStack(stack);
        // console.log(template, 'template');
        template.resourceCountIs('AWS::AppSync::GraphQLApi', 1);
        template.resourceCountIs('AWS::AppSync::GraphQLSchema', 1);
        // TODO: How do we confirm the correct schema is being generated.
        // const graphQLSchema = template.findResources('AWS::AppSync::GraphQLSchema');
        // const graphQLSchemaKey = Object.keys(graphQLSchema)[0];
        // const schema = graphQLSchema[graphQLSchemaKey]?.Properties?.Definition;
        // console.log('schema', schema);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAtc3luYy90ZXN0L2FwcC1zeW5jLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQXNEO0FBQ3RELG1DQUFtQztBQUNuQyx1REFBa0Q7QUFDbEQsa0RBQWtEO0FBQ2xELDZGQUE2RjtBQUM3RixzQ0FBc0M7QUFDdEMsaUVBQXVFO0FBQ3ZFLGlEQUE2QztBQUU3Qzs7R0FFRztBQUVILDZFQUE2RTtBQUM3RSxJQUFZLGlCQUdYO0FBSEQsV0FBWSxpQkFBaUI7SUFDekIsb0NBQWUsQ0FBQTtJQUNmLHdDQUFtQixDQUFBO0FBQ3ZCLENBQUMsRUFIVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQUc1QjtBQUVELFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBRXZCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEdBQUcscUJBQVcsRUFBRSxjQUFjLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDNUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWpDLHVDQUF1QztRQUV2QywyQkFBMkI7UUFDM0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7WUFDckQsSUFBSSxFQUFFLE1BQU07WUFDWixRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQXdCO1lBQ3RDLElBQUksRUFBRSxLQUFLO1lBQ1gsNEJBQTRCLEVBQUU7Z0JBQzFCO29CQUNJLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO29CQUN0RCxjQUFjLEVBQUUsRUFBRSxRQUFRLEVBQUUsWUFBWSxDQUFDLFFBQVEsRUFBRTtpQkFDdEQ7YUFDSjtTQUNKLENBQUM7UUFFRiwrQkFBK0I7UUFDL0IsTUFBTSxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDdkUsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQztRQUVqRCx3QkFBd0I7UUFDeEIsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BHLGFBQWEsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLHNCQUFzQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTVGLG9CQUFvQjtRQUNwQixNQUFNLFdBQVcsR0FBRyxJQUFJLDBCQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQy9ELGFBQWEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWhELGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUN2Qiw0REFBNEQ7UUFFNUQsTUFBTSxRQUFRLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MscUNBQXFDO1FBQ3JDLFFBQVEsQ0FBQyxlQUFlLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEQsUUFBUSxDQUFDLGVBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUzRCxpRUFBaUU7UUFDakUsK0VBQStFO1FBQy9FLDBEQUEwRDtRQUMxRCwwRUFBMEU7UUFDMUUsaUNBQWlDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcclxuLy8gaW1wb3J0IHsgQ29uZmlnIH0gZnJvbSAnLi4vc3JjL2NsYXNzZXMvY29uZmlnJztcclxuLy8gaW1wb3J0IHsgQXBwU3luYywgSUFwcFN5bmNQcm9wcyB9IGZyb20gJy4uLy4uL3NyYy9jb25zdHJ1Y3RzL2FwcC1zeW5jL2FwcC1zeW5jLmNvbnN0cnVjdCc7XHJcbmltcG9ydCAqIGFzIGpvbXB4IGZyb20gJy4uLy4uLy4uL3NyYyc7XHJcbmltcG9ydCB7IENvbmZpZyBhcyBKb21weENvbmZpZyB9IGZyb20gJy4uLy4uL2NvbmZpZy90ZXN0L2pvbXB4LmNvbmZpZyc7XHJcbmltcG9ydCB7IE15U3FsU2NoZW1hIH0gZnJvbSAnLi9teXNxbC5zY2hlbWEnO1xyXG5cclxuLyoqXHJcbiAqIG5weCBqZXN0IGFwcC1zeW5jLnRlc3QudHNcclxuICovXHJcblxyXG4vLyBGb3IgY29udmVuaWVuY2UgYW5kIHN0cm9uZyB0eXBpbmcsIHVzZSBhbiBlbnVtIGZvciBBcHBTeW5jIGRhdGFzb3VyY2UgaWRzLlxyXG5leHBvcnQgZW51bSBBcHBTeW5jRGF0YXNvdXJjZSB7XHJcbiAgICBteVNxbCA9ICdteVNxbCcsXHJcbiAgICBjb2duaXRvID0gJ2NvZ25pdG8nXHJcbn1cclxuXHJcbmRlc2NyaWJlKCdBcHBTeW5jU3RhY2snLCAoKSA9PiB7XHJcbiAgICB0ZXN0KCdjcmVhdGUgc2NoZW1hJywgKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7IGNvbnRleHQ6IHsgLi4uSm9tcHhDb25maWcsICdAam9tcHgtbG9jYWwnOiB7IHN0YWdlOiAndGVzdCcgfSB9IH0pO1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKGFwcC5ub2RlKTtcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIENvZ25pdG8gcmVzb3VyY2UuXHJcbiAgICAgICAgY29uc3Qgam9tcHhDb2duaXRvID0gbmV3IGpvbXB4LkNvZ25pdG8oc3RhY2ssICdDb2duaXRvJywge1xyXG4gICAgICAgICAgICBuYW1lOiAnYXBwcycsXHJcbiAgICAgICAgICAgIGFwcENvZGVzOiBbJ2FkbWluJ11cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgYXBwU3luY1Byb3BzOiBqb21weC5JQXBwU3luY1Byb3BzID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnYXBpJyxcclxuICAgICAgICAgICAgYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2RlczogW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLlVTRVJfUE9PTCxcclxuICAgICAgICAgICAgICAgICAgICB1c2VyUG9vbENvbmZpZzogeyB1c2VyUG9vbDogam9tcHhDb2duaXRvLnVzZXJQb29sIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBBV1MgQXBwU3luYyByZXNvdXJjZS5cclxuICAgICAgICBjb25zdCBqb21weEFwcFN5bmMgPSBuZXcgam9tcHguQXBwU3luYyhzdGFjaywgJ0FwcFN5bmMnLCBhcHBTeW5jUHJvcHMpO1xyXG4gICAgICAgIGNvbnN0IHNjaGVtYUJ1aWxkZXIgPSBqb21weEFwcFN5bmMuc2NoZW1hQnVpbGRlcjtcclxuXHJcbiAgICAgICAgLy8gQWRkIE15U1FMIGRhdGFzb3VyY2UuXHJcbiAgICAgICAgY29uc3QgYXBwU3luY015U3FsRGF0YVNvdXJjZSA9IG5ldyBqb21weC5BcHBTeW5jTXlTcWxEYXRhU291cmNlKHN0YWNrLCBBcHBTeW5jRGF0YXNvdXJjZS5teVNxbCwge30pO1xyXG4gICAgICAgIHNjaGVtYUJ1aWxkZXIuYWRkRGF0YVNvdXJjZShBcHBTeW5jRGF0YXNvdXJjZS5teVNxbCwgYXBwU3luY015U3FsRGF0YVNvdXJjZS5sYW1iZGFGdW5jdGlvbik7XHJcblxyXG4gICAgICAgIC8vIEFkZCBNeVNRTCBzY2hlbWEuXHJcbiAgICAgICAgY29uc3QgbXlTcWxTY2hlbWEgPSBuZXcgTXlTcWxTY2hlbWEoc2NoZW1hQnVpbGRlci5kYXRhU291cmNlcyk7XHJcbiAgICAgICAgc2NoZW1hQnVpbGRlci5hZGRTY2hlbWFUeXBlcyhteVNxbFNjaGVtYS50eXBlcyk7XHJcblxyXG4gICAgICAgIHNjaGVtYUJ1aWxkZXIuY3JlYXRlKCk7XHJcbiAgICAgICAgLy8gc2NoZW1hQnVpbGRlci5jcmVhdGUoeyBzY2hlbWE6IHRydWUsIG9wZXJhdGlvbnM6IHRydWUgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0ZW1wbGF0ZSwgJ3RlbXBsYXRlJyk7XHJcbiAgICAgICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OkFwcFN5bmM6OkdyYXBoUUxBcGknLCAxKTtcclxuICAgICAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwU3luYzo6R3JhcGhRTFNjaGVtYScsIDEpO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBIb3cgZG8gd2UgY29uZmlybSB0aGUgY29ycmVjdCBzY2hlbWEgaXMgYmVpbmcgZ2VuZXJhdGVkLlxyXG4gICAgICAgIC8vIGNvbnN0IGdyYXBoUUxTY2hlbWEgPSB0ZW1wbGF0ZS5maW5kUmVzb3VyY2VzKCdBV1M6OkFwcFN5bmM6OkdyYXBoUUxTY2hlbWEnKTtcclxuICAgICAgICAvLyBjb25zdCBncmFwaFFMU2NoZW1hS2V5ID0gT2JqZWN0LmtleXMoZ3JhcGhRTFNjaGVtYSlbMF07XHJcbiAgICAgICAgLy8gY29uc3Qgc2NoZW1hID0gZ3JhcGhRTFNjaGVtYVtncmFwaFFMU2NoZW1hS2V5XT8uUHJvcGVydGllcz8uRGVmaW5pdGlvbjtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2NoZW1hJywgc2NoZW1hKTtcclxuICAgIH0pO1xyXG59KTtcclxuIl19