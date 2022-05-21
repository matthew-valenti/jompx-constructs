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
            name: 'api',
            additionalAuthorizationModes: []
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAtc3luYy90ZXN0L2FwcC1zeW5jLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLHVEQUFrRDtBQUNsRCxrREFBa0Q7QUFDbEQsNkZBQTZGO0FBQzdGLHNDQUFzQztBQUN0QyxpRUFBdUU7QUFDdkUsaURBQTZDO0FBRTdDLDZFQUE2RTtBQUM3RSxJQUFZLGlCQUdYO0FBSEQsV0FBWSxpQkFBaUI7SUFDekIsb0NBQWUsQ0FBQTtJQUNmLHdDQUFtQixDQUFBO0FBQ3ZCLENBQUMsRUFIVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQUc1QjtBQUVELFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFOztRQUV2QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxHQUFHLHFCQUFXLEVBQUUsY0FBYyxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzVGLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVqQyx1Q0FBdUM7UUFFdkMsTUFBTSxZQUFZLEdBQXdCO1lBQ3RDLElBQUksRUFBRSxLQUFLO1lBQ1gsNEJBQTRCLEVBQUUsRUFBRTtTQUNuQyxDQUFDO1FBRUYsK0JBQStCO1FBQy9CLE1BQU0sT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFFNUMsd0JBQXdCO1FBQ3hCLE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNwRyxhQUFhLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxzQkFBc0IsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUU1RixvQkFBb0I7UUFDcEIsTUFBTSxXQUFXLEdBQUcsSUFBSSwwQkFBVyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMvRCxhQUFhLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVoRCxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdkIsTUFBTSxRQUFRLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MscUNBQXFDO1FBQ3JDLFFBQVEsQ0FBQyxlQUFlLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDeEQsUUFBUSxDQUFDLGVBQWUsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUzRCxpRUFBaUU7UUFDakUsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2RCxNQUFNLE1BQU0sZUFBRyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsMENBQUUsVUFBVSwwQ0FBRSxVQUFVLENBQUM7UUFDdkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XHJcbi8vIGltcG9ydCB7IENvbmZpZyB9IGZyb20gJy4uL3NyYy9jbGFzc2VzL2NvbmZpZyc7XHJcbi8vIGltcG9ydCB7IEFwcFN5bmMsIElBcHBTeW5jUHJvcHMgfSBmcm9tICcuLi8uLi9zcmMvY29uc3RydWN0cy9hcHAtc3luYy9hcHAtc3luYy5jb25zdHJ1Y3QnO1xyXG5pbXBvcnQgKiBhcyBqb21weCBmcm9tICcuLi8uLi8uLi9zcmMnO1xyXG5pbXBvcnQgeyBDb25maWcgYXMgSm9tcHhDb25maWcgfSBmcm9tICcuLi8uLi9jb25maWcvdGVzdC9qb21weC5jb25maWcnO1xyXG5pbXBvcnQgeyBNeVNxbFNjaGVtYSB9IGZyb20gJy4vbXlzcWwuc2NoZW1hJztcclxuXHJcbi8vIEZvciBjb252ZW5pZW5jZSBhbmQgc3Ryb25nIHR5cGluZywgdXNlIGFuIGVudW0gZm9yIEFwcFN5bmMgZGF0YXNvdXJjZSBpZHMuXHJcbmV4cG9ydCBlbnVtIEFwcFN5bmNEYXRhc291cmNlIHtcclxuICAgIG15U3FsID0gJ215U3FsJyxcclxuICAgIGNvZ25pdG8gPSAnY29nbml0bydcclxufVxyXG5cclxuZGVzY3JpYmUoJ0FwcFN5bmNTdGFjaycsICgpID0+IHtcclxuICAgIHRlc3QoJ2NyZWF0ZSBzY2hlbWEnLCAoKSA9PiB7XHJcblxyXG4gICAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKHsgY29udGV4dDogeyAuLi5Kb21weENvbmZpZywgJ0Bqb21weC1sb2NhbCc6IHsgc3RhZ2U6ICd0ZXN0JyB9IH0gfSk7XHJcbiAgICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IGNvbmZpZyA9IG5ldyBDb25maWcoYXBwLm5vZGUpO1xyXG5cclxuICAgICAgICBjb25zdCBhcHBTeW5jUHJvcHM6IGpvbXB4LklBcHBTeW5jUHJvcHMgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdhcGknLFxyXG4gICAgICAgICAgICBhZGRpdGlvbmFsQXV0aG9yaXphdGlvbk1vZGVzOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBBV1MgQXBwU3luYyByZXNvdXJjZS5cclxuICAgICAgICBjb25zdCBhcHBTeW5jID0gbmV3IGpvbXB4LkFwcFN5bmMoc3RhY2ssICdBcHBTeW5jJywgYXBwU3luY1Byb3BzKTtcclxuICAgICAgICBjb25zdCBzY2hlbWFCdWlsZGVyID0gYXBwU3luYy5zY2hlbWFCdWlsZGVyO1xyXG5cclxuICAgICAgICAvLyBBZGQgTXlTUUwgZGF0YXNvdXJjZS5cclxuICAgICAgICBjb25zdCBhcHBTeW5jTXlTcWxEYXRhU291cmNlID0gbmV3IGpvbXB4LkFwcFN5bmNNeVNxbERhdGFTb3VyY2Uoc3RhY2ssIEFwcFN5bmNEYXRhc291cmNlLm15U3FsLCB7fSk7XHJcbiAgICAgICAgc2NoZW1hQnVpbGRlci5hZGREYXRhU291cmNlKEFwcFN5bmNEYXRhc291cmNlLm15U3FsLCBhcHBTeW5jTXlTcWxEYXRhU291cmNlLmxhbWJkYUZ1bmN0aW9uKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIE15U1FMIHNjaGVtYS5cclxuICAgICAgICBjb25zdCBteVNxbFNjaGVtYSA9IG5ldyBNeVNxbFNjaGVtYShzY2hlbWFCdWlsZGVyLmRhdGFTb3VyY2VzKTtcclxuICAgICAgICBzY2hlbWFCdWlsZGVyLmFkZFNjaGVtYVR5cGVzKG15U3FsU2NoZW1hLnR5cGVzKTtcclxuXHJcbiAgICAgICAgc2NoZW1hQnVpbGRlci5jcmVhdGUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRlbXBsYXRlLCAndGVtcGxhdGUnKTtcclxuICAgICAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6QXBwU3luYzo6R3JhcGhRTEFwaScsIDEpO1xyXG4gICAgICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpBcHBTeW5jOjpHcmFwaFFMU2NoZW1hJywgMSk7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEhvdyBkbyB3ZSBjb25maXJtIHRoZSBjb3JyZWN0IHNjaGVtYSBpcyBiZWluZyBnZW5lcmF0ZWQuXHJcbiAgICAgICAgY29uc3QgZ3JhcGhRTFNjaGVtYSA9IHRlbXBsYXRlLmZpbmRSZXNvdXJjZXMoJ0FXUzo6QXBwU3luYzo6R3JhcGhRTFNjaGVtYScpO1xyXG4gICAgICAgIGNvbnN0IGdyYXBoUUxTY2hlbWFLZXkgPSBPYmplY3Qua2V5cyhncmFwaFFMU2NoZW1hKVswXTtcclxuICAgICAgICBjb25zdCBzY2hlbWEgPSBncmFwaFFMU2NoZW1hW2dyYXBoUUxTY2hlbWFLZXldPy5Qcm9wZXJ0aWVzPy5EZWZpbml0aW9uO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdzY2hlbWEnLCBzY2hlbWEpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iXX0=