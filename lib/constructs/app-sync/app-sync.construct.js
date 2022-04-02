"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSync = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
// eslint-disable-next-line import/no-extraneous-dependencies
const appsync = require("@aws-cdk/aws-appsync-alpha");
const constructs_1 = require("constructs");
const schema_1 = require("../../classes/app-sync/schema");
/**
 * AWS AppSync (serverless GraphQL).
 */
class AppSync extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _b;
        super(scope, id);
        this.dataSources = {};
        this.schemaTypes = {};
        this.graphqlApi = new appsync.GraphqlApi(this, 'AppSync', {
            name: (_b = props.name) !== null && _b !== void 0 ? _b : 'api',
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.IAM
                }
                // additionalAuthorizationModes: [
                //     { authorizationType: appsync.AuthorizationType.API_KEY },
                //     { authorizationType: appsync.AuthorizationType.USER_POOL }
                // ]
            }
        });
    }
    // Add datasource to AppSync and an internal array. Remove this when AppSync provides a way to iterate datasources).
    addDataSource(id, lambdaFunction, options) {
        const identifier = `AppSyncDataSource${id}`;
        const dataSource = this.graphqlApi.addLambdaDataSource(identifier, lambdaFunction, options);
        this.dataSources = { ...this.dataSources, ...{ [identifier]: dataSource } };
    }
    addSchemaTypes(schemaTypes) {
        // this.schemaTypes = this.schemaTypes.concat(schemaTypes);
        this.schemaTypes = { ...this.schemaTypes, ...schemaTypes };
    }
    createSchema() {
        const schema = new schema_1.AppSyncSchema(this.graphqlApi, this.dataSources, this.schemaTypes);
        schema.create();
    }
}
exports.AppSync = AppSync;
_a = JSII_RTTI_SYMBOL_1;
AppSync[_a] = { fqn: "@jompx/constructs.AppSync", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnN0cnVjdHMvYXBwLXN5bmMvYXBwLXN5bmMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkRBQTZEO0FBQzdELHNEQUFzRDtBQUV0RCwyQ0FBdUM7QUFDdkMsMERBQThEO0FBVzlEOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsc0JBQVM7SUFLbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFvQjs7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUpkLGdCQUFXLEdBQWdCLEVBQUUsQ0FBQztRQUM5QixnQkFBVyxHQUFnQixFQUFFLENBQUM7UUFLakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUN0RCxJQUFJLFFBQUUsS0FBSyxDQUFDLElBQUksbUNBQUksS0FBSztZQUN6QixtQkFBbUIsRUFBRTtnQkFDakIsb0JBQW9CLEVBQUU7b0JBQ2xCLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHO2lCQUNuRDtnQkFDRCxrQ0FBa0M7Z0JBQ2xDLGdFQUFnRTtnQkFDaEUsaUVBQWlFO2dCQUNqRSxJQUFJO2FBQ1A7U0FDSixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsb0hBQW9IO0lBQzdHLGFBQWEsQ0FBQyxFQUFVLEVBQUUsY0FBd0MsRUFBRSxPQUFtQztRQUMxRyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsRUFBRSxFQUFFLENBQUM7UUFDNUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQztJQUNoRixDQUFDO0lBRU0sY0FBYyxDQUFDLFdBQXdCO1FBQzFDLDJEQUEyRDtRQUMzRCxJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7SUFDL0QsQ0FBQztJQUVNLFlBQVk7UUFDZixNQUFNLE1BQU0sR0FBRyxJQUFJLHNCQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN0RixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDcEIsQ0FBQzs7QUFyQ0wsMEJBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IEFwcFN5bmNTY2hlbWEgfSBmcm9tICcuLi8uLi9jbGFzc2VzL2FwcC1zeW5jL3NjaGVtYSc7XHJcbmltcG9ydCB7IElEYXRhU291cmNlLCBJU2NoZW1hVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL2FwcC1zeW5jJztcclxuLy8gaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBwc3luYyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBTeW5jUHJvcHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBOYW1lIG9mIHRoZSBBcHBTeW5jIEdyYXBoUUwgcmVzb3VyY2UgYXMgaXQgYXBwZWFycyBpbiB0aGUgQVdTIENvbnNvbGUuXHJcbiAgICAgKi9cclxuICAgIG5hbWU/OiBzdHJpbmc7IC8vIFVzZSBrZWJhYi1jYXNlLlxyXG59XHJcblxyXG4vKipcclxuICogQVdTIEFwcFN5bmMgKHNlcnZlcmxlc3MgR3JhcGhRTCkuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwU3luYyBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgZ3JhcGhxbEFwaTogYXBwc3luYy5HcmFwaHFsQXBpO1xyXG4gICAgcHVibGljIGRhdGFTb3VyY2VzOiBJRGF0YVNvdXJjZSA9IHt9O1xyXG4gICAgcHVibGljIHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJQXBwU3luY1Byb3BzKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCAnQXBwU3luYycsIHtcclxuICAgICAgICAgICAgbmFtZTogcHJvcHMubmFtZSA/PyAnYXBpJyxcclxuICAgICAgICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdEF1dGhvcml6YXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IFtcclxuICAgICAgICAgICAgICAgIC8vICAgICB7IGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVkgfSxcclxuICAgICAgICAgICAgICAgIC8vICAgICB7IGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLlVTRVJfUE9PTCB9XHJcbiAgICAgICAgICAgICAgICAvLyBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgZGF0YXNvdXJjZSB0byBBcHBTeW5jIGFuZCBhbiBpbnRlcm5hbCBhcnJheS4gUmVtb3ZlIHRoaXMgd2hlbiBBcHBTeW5jIHByb3ZpZGVzIGEgd2F5IHRvIGl0ZXJhdGUgZGF0YXNvdXJjZXMpLlxyXG4gICAgcHVibGljIGFkZERhdGFTb3VyY2UoaWQ6IHN0cmluZywgbGFtYmRhRnVuY3Rpb246IGNkay5hd3NfbGFtYmRhLklGdW5jdGlvbiwgb3B0aW9ucz86IGFwcHN5bmMuRGF0YVNvdXJjZU9wdGlvbnMpIHtcclxuICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gYEFwcFN5bmNEYXRhU291cmNlJHtpZH1gO1xyXG4gICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmdyYXBocWxBcGkuYWRkTGFtYmRhRGF0YVNvdXJjZShpZGVudGlmaWVyLCBsYW1iZGFGdW5jdGlvbiwgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlcyA9IHsgLi4udGhpcy5kYXRhU291cmNlcywgLi4ueyBbaWRlbnRpZmllcl06IGRhdGFTb3VyY2UgfSB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRTY2hlbWFUeXBlcyhzY2hlbWFUeXBlczogSVNjaGVtYVR5cGUpIHtcclxuICAgICAgICAvLyB0aGlzLnNjaGVtYVR5cGVzID0gdGhpcy5zY2hlbWFUeXBlcy5jb25jYXQoc2NoZW1hVHlwZXMpO1xyXG4gICAgICAgIHRoaXMuc2NoZW1hVHlwZXMgPSB7IC4uLnRoaXMuc2NoZW1hVHlwZXMsIC4uLnNjaGVtYVR5cGVzIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVNjaGVtYSgpIHtcclxuICAgICAgICBjb25zdCBzY2hlbWEgPSBuZXcgQXBwU3luY1NjaGVtYSh0aGlzLmdyYXBocWxBcGksIHRoaXMuZGF0YVNvdXJjZXMsIHRoaXMuc2NoZW1hVHlwZXMpO1xyXG4gICAgICAgIHNjaGVtYS5jcmVhdGUoKTtcclxuICAgIH1cclxufVxyXG4iXX0=