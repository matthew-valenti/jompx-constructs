"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncDatasource = void 0;
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
// import { Config } from '../src/classes/config';
// import { AppSync, IAppSyncProps } from '../../src/constructs/app-sync/app-sync.construct';
const jompx = require("../../../src");
const jompx_config_1 = require("../../config/test/jompx.config");
const mysql_schema_1 = require("./mysql.schema");
// For convenience and strong typing, use an enum for AppSync datasource ids.
var AppSyncDatasource;
(function (AppSyncDatasource) {
    AppSyncDatasource["mySql"] = "mySql";
    AppSyncDatasource["cognito"] = "cognito";
})(AppSyncDatasource = exports.AppSyncDatasource || (exports.AppSyncDatasource = {}));
describe('AppSyncStack', () => {
    test('create schema', () => {
        var _a, _b;
        const app = new cdk.App({ context: { ...jompx_config_1.Config, '@jompx-local': { stage: 'test' } } });
        const stack = new cdk.Stack(app);
        // const config = new Config(app.node);
        const appSyncProps = {
            name: 'api'
        };
        // Create AWS AppSync resource.
        const appSync = new jompx.AppSync(stack, 'AppSync', appSyncProps);
        const schemaBuilder = appSync.schemaBuilder;
        // Add MySQL datasource.
        const appSyncMySqlDataSource = new jompx.AppSyncMySqlDataSource(stack, AppSyncDatasource.mySql, {});
        schemaBuilder.addDataSource(AppSyncDatasource.mySql, appSyncMySqlDataSource.lambdaFunction);
        // Add MySQL schema.
        const mySqlSchema = new mysql_schema_1.MySqlSchema(schemaBuilder.dataSources);
        schemaBuilder.addSchemaTypes(mySqlSchema.types);
        schemaBuilder.create();
        const template = assertions_1.Template.fromStack(stack);
        // console.log(template, 'template');
        template.resourceCountIs('AWS::AppSync::GraphQLApi', 1);
        template.resourceCountIs('AWS::AppSync::GraphQLSchema', 1);
        // TODO: How do we confirm the correct schema is being generated.
        const graphQLSchema = template.findResources('AWS::AppSync::GraphQLSchema');
        const graphQLSchemaKey = Object.keys(graphQLSchema)[0];
        const schema = (_b = (_a = graphQLSchema[graphQLSchemaKey]) === null || _a === void 0 ? void 0 : _a.Properties) === null || _b === void 0 ? void 0 : _b.Definition;
        console.log('schema', schema);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAtc3luYy90ZXN0L2FwcC1zeW5jLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLHVEQUFrRDtBQUNsRCxrREFBa0Q7QUFDbEQsNkZBQTZGO0FBQzdGLHNDQUFzQztBQUN0QyxpRUFBdUU7QUFDdkUsaURBQTZDO0FBRTdDLDZFQUE2RTtBQUM3RSxJQUFZLGlCQUdYO0FBSEQsV0FBWSxpQkFBaUI7SUFDekIsb0NBQWUsQ0FBQTtJQUNmLHdDQUFtQixDQUFBO0FBQ3ZCLENBQUMsRUFIVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQUc1QjtBQUVELFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFOztRQUV2QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHLHFCQUFXLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVGLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQyx1Q0FBdUM7UUFFdkMsTUFBTSxZQUFZLEdBQXdCO1lBQ3RDLElBQUksRUFBRSxLQUFLO1NBQ2QsQ0FBQztRQUVGLCtCQUErQjtRQUMvQixNQUFNLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNsRSxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBRTVDLHdCQUF3QjtRQUN4QixNQUFNLHNCQUFzQixHQUFHLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDcEcsYUFBYSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsc0JBQXNCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFNUYsb0JBQW9CO1FBQ3BCLE1BQU0sV0FBVyxHQUFHLElBQUksMEJBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDL0QsYUFBYSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFaEQsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXZCLE1BQU0sUUFBUSxHQUFHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNDLHFDQUFxQztRQUNyQyxRQUFRLENBQUMsZUFBZSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3hELFFBQVEsQ0FBQyxlQUFlLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFM0QsaUVBQWlFO1FBQ2pFLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsNkJBQTZCLENBQUMsQ0FBQztRQUM1RSxNQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkQsTUFBTSxNQUFNLGVBQUcsYUFBYSxDQUFDLGdCQUFnQixDQUFDLDBDQUFFLFVBQVUsMENBQUUsVUFBVSxDQUFDO1FBQ3ZFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2Fzc2VydGlvbnMnO1xyXG4vLyBpbXBvcnQgeyBDb25maWcgfSBmcm9tICcuLi9zcmMvY2xhc3Nlcy9jb25maWcnO1xyXG4vLyBpbXBvcnQgeyBBcHBTeW5jLCBJQXBwU3luY1Byb3BzIH0gZnJvbSAnLi4vLi4vc3JjL2NvbnN0cnVjdHMvYXBwLXN5bmMvYXBwLXN5bmMuY29uc3RydWN0JztcclxuaW1wb3J0ICogYXMgam9tcHggZnJvbSAnLi4vLi4vLi4vc3JjJztcclxuaW1wb3J0IHsgQ29uZmlnIGFzIEpvbXB4Q29uZmlnIH0gZnJvbSAnLi4vLi4vY29uZmlnL3Rlc3Qvam9tcHguY29uZmlnJztcclxuaW1wb3J0IHsgTXlTcWxTY2hlbWEgfSBmcm9tICcuL215c3FsLnNjaGVtYSc7XHJcblxyXG4vLyBGb3IgY29udmVuaWVuY2UgYW5kIHN0cm9uZyB0eXBpbmcsIHVzZSBhbiBlbnVtIGZvciBBcHBTeW5jIGRhdGFzb3VyY2UgaWRzLlxyXG5leHBvcnQgZW51bSBBcHBTeW5jRGF0YXNvdXJjZSB7XHJcbiAgICBteVNxbCA9ICdteVNxbCcsXHJcbiAgICBjb2duaXRvID0gJ2NvZ25pdG8nXHJcbn1cclxuXHJcbmRlc2NyaWJlKCdBcHBTeW5jU3RhY2snLCAoKSA9PiB7XHJcbiAgICB0ZXN0KCdjcmVhdGUgc2NoZW1hJywgKCkgPT4ge1xyXG5cclxuICAgICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7IGNvbnRleHQ6IHsgLi4uSm9tcHhDb25maWcsICdAam9tcHgtbG9jYWwnOiB7IHN0YWdlOiAndGVzdCcgfSB9IH0pO1xyXG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBjb25maWcgPSBuZXcgQ29uZmlnKGFwcC5ub2RlKTtcclxuXHJcbiAgICAgICAgY29uc3QgYXBwU3luY1Byb3BzOiBqb21weC5JQXBwU3luY1Byb3BzID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnYXBpJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBBV1MgQXBwU3luYyByZXNvdXJjZS5cclxuICAgICAgICBjb25zdCBhcHBTeW5jID0gbmV3IGpvbXB4LkFwcFN5bmMoc3RhY2ssICdBcHBTeW5jJywgYXBwU3luY1Byb3BzKTtcclxuICAgICAgICBjb25zdCBzY2hlbWFCdWlsZGVyID0gYXBwU3luYy5zY2hlbWFCdWlsZGVyO1xyXG5cclxuICAgICAgICAvLyBBZGQgTXlTUUwgZGF0YXNvdXJjZS5cclxuICAgICAgICBjb25zdCBhcHBTeW5jTXlTcWxEYXRhU291cmNlID0gbmV3IGpvbXB4LkFwcFN5bmNNeVNxbERhdGFTb3VyY2Uoc3RhY2ssIEFwcFN5bmNEYXRhc291cmNlLm15U3FsLCB7fSk7XHJcbiAgICAgICAgc2NoZW1hQnVpbGRlci5hZGREYXRhU291cmNlKEFwcFN5bmNEYXRhc291cmNlLm15U3FsLCBhcHBTeW5jTXlTcWxEYXRhU291cmNlLmxhbWJkYUZ1bmN0aW9uKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIE15U1FMIHNjaGVtYS5cclxuICAgICAgICBjb25zdCBteVNxbFNjaGVtYSA9IG5ldyBNeVNxbFNjaGVtYShzY2hlbWFCdWlsZGVyLmRhdGFTb3VyY2VzKTtcclxuICAgICAgICBzY2hlbWFCdWlsZGVyLmFkZFNjaGVtYVR5cGVzKG15U3FsU2NoZW1hLnR5cGVzKTtcclxuXHJcbiAgICAgICAgc2NoZW1hQnVpbGRlci5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRlbXBsYXRlLCAndGVtcGxhdGUnKTtcclxuICAgICAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwU3luYzo6R3JhcGhRTEFwaScsIDEpO1xyXG4gICAgICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpBcHBTeW5jOjpHcmFwaFFMU2NoZW1hJywgMSk7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEhvdyBkbyB3ZSBjb25maXJtIHRoZSBjb3JyZWN0IHNjaGVtYSBpcyBiZWluZyBnZW5lcmF0ZWQuXHJcbiAgICAgICAgY29uc3QgZ3JhcGhRTFNjaGVtYSA9IHRlbXBsYXRlLmZpbmRSZXNvdXJjZXMoJ0FXUzo6QXBwU3luYzo6R3JhcGhRTFNjaGVtYScpO1xyXG4gICAgICAgIGNvbnN0IGdyYXBoUUxTY2hlbWFLZXkgPSBPYmplY3Qua2V5cyhncmFwaFFMU2NoZW1hKVswXTtcclxuICAgICAgICBjb25zdCBzY2hlbWEgPSBncmFwaFFMU2NoZW1hW2dyYXBoUUxTY2hlbWFLZXldPy5Qcm9wZXJ0aWVzPy5EZWZpbml0aW9uO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzY2hlbWEnLCBzY2hlbWEpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXX0=