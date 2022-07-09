"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSync = void 0;
const appsync = require("@aws-cdk/aws-appsync-alpha");
const ssm = require("aws-cdk-lib/aws-ssm");
const constructs_1 = require("constructs");
const schema_builder_1 = require("./schema-builder");
/**
 * AWS AppSync (serverless GraphQL).
 */
class AppSync extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _a, _b, _c;
        super(scope, id);
        this.activeAuthorizationTypes = [];
        this.graphqlApi = new appsync.GraphqlApi(this, 'AppSync', {
            name: props.name,
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.IAM
                },
                additionalAuthorizationModes: (_a = props.additionalAuthorizationModes) !== null && _a !== void 0 ? _a : []
            }
        });
        // Get active authorization types.
        this.activeAuthorizationTypes.push(appsync.AuthorizationType.IAM);
        this.activeAuthorizationTypes = this.activeAuthorizationTypes.concat((_c = (_b = props.additionalAuthorizationModes) === null || _b === void 0 ? void 0 : _b.map(o => o.authorizationType)) !== null && _c !== void 0 ? _c : []);
        // Add GraphQL url to parameter store.
        // Allow Lambda functions to call AppSync GraphQL operations.
        new ssm.StringParameter(this, 'AppsyncGraphqlUrl', {
            parameterName: '/appSync/graphqlUrl',
            stringValue: this.graphqlApi.graphqlUrl
        });
        // Add AppSync API ID to parameter store.
        // Allow resources to define an IAM security policy for AppSync data operations.
        new ssm.StringParameter(this, 'AppsyncGraphqlApiId', {
            parameterName: '/appSync/apiId',
            stringValue: this.graphqlApi.apiId
        });
        this.schemaBuilder = new schema_builder_1.AppSyncSchemaBuilder(this.graphqlApi, this.activeAuthorizationTypes);
    }
}
exports.AppSync = AppSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC1zeW5jL2FwcC1zeW5jLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBc0Q7QUFFdEQsMkNBQTJDO0FBQzNDLDJDQUF1QztBQUN2QyxxREFBd0Q7QUFXeEQ7O0dBRUc7QUFDSCxNQUFhLE9BQVEsU0FBUSxzQkFBUztJQUtsQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9COztRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSGQsNkJBQXdCLEdBQWdDLEVBQUUsQ0FBQztRQUs5RCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3RELElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixtQkFBbUIsRUFBRTtnQkFDakIsb0JBQW9CLEVBQUU7b0JBQ2xCLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHO2lCQUNuRDtnQkFDRCw0QkFBNEIsUUFBRSxLQUFLLENBQUMsNEJBQTRCLG1DQUFJLEVBQUU7YUFDekU7U0FDSixDQUFDLENBQUM7UUFFSCxrQ0FBa0M7UUFDbEMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEUsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLGFBQUMsS0FBSyxDQUFDLDRCQUE0QiwwQ0FBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLG9DQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRTlJLHNDQUFzQztRQUN0Qyw2REFBNkQ7UUFDN0QsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUMvQyxhQUFhLEVBQUUscUJBQXFCO1lBQ3BDLFdBQVcsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVU7U0FDMUMsQ0FBQyxDQUFDO1FBRUgseUNBQXlDO1FBQ3pDLGdGQUFnRjtRQUNoRixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFO1lBQ2pELGFBQWEsRUFBRSxnQkFBZ0I7WUFDL0IsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSztTQUNyQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkscUNBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUNsRyxDQUFDO0NBQ0o7QUF0Q0QsMEJBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIHNzbSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3NtJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IEFwcFN5bmNTY2hlbWFCdWlsZGVyIH0gZnJvbSAnLi9zY2hlbWEtYnVpbGRlcic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBTeW5jUHJvcHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBOYW1lIG9mIHRoZSBBcHBTeW5jIEdyYXBoUUwgcmVzb3VyY2UgYXMgaXQgYXBwZWFycyBpbiB0aGUgQVdTIENvbnNvbGUuXHJcbiAgICAgKi9cclxuICAgIG5hbWU6IHN0cmluZzsgLy8gVXNlIGtlYmFiLWNhc2UuXHJcbiAgICBhZGRpdGlvbmFsQXV0aG9yaXphdGlvbk1vZGVzPzogYXBwc3luYy5BdXRob3JpemF0aW9uTW9kZVtdO1xyXG4gICAgdXNlclBvb2w/OiBjZGsuYXdzX2NvZ25pdG8uVXNlclBvb2w7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBV1MgQXBwU3luYyAoc2VydmVybGVzcyBHcmFwaFFMKS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyBncmFwaHFsQXBpOiBhcHBzeW5jLkdyYXBocWxBcGk7XHJcbiAgICBwdWJsaWMgc2NoZW1hQnVpbGRlcjogQXBwU3luY1NjaGVtYUJ1aWxkZXI7XHJcbiAgICBwdWJsaWMgYWN0aXZlQXV0aG9yaXphdGlvblR5cGVzOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUFwcFN5bmNQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ0FwcFN5bmMnLCB7XHJcbiAgICAgICAgICAgIG5hbWU6IHByb3BzLm5hbWUsXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2RlczogcHJvcHMuYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2RlcyA/PyBbXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEdldCBhY3RpdmUgYXV0aG9yaXphdGlvbiB0eXBlcy5cclxuICAgICAgICB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcy5wdXNoKGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNKTtcclxuICAgICAgICB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcyA9IHRoaXMuYWN0aXZlQXV0aG9yaXphdGlvblR5cGVzLmNvbmNhdChwcm9wcy5hZGRpdGlvbmFsQXV0aG9yaXphdGlvbk1vZGVzPy5tYXAobyA9PiBvLmF1dGhvcml6YXRpb25UeXBlKSA/PyBbXSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBHcmFwaFFMIHVybCB0byBwYXJhbWV0ZXIgc3RvcmUuXHJcbiAgICAgICAgLy8gQWxsb3cgTGFtYmRhIGZ1bmN0aW9ucyB0byBjYWxsIEFwcFN5bmMgR3JhcGhRTCBvcGVyYXRpb25zLlxyXG4gICAgICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdBcHBzeW5jR3JhcGhxbFVybCcsIHtcclxuICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogJy9hcHBTeW5jL2dyYXBocWxVcmwnLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogdGhpcy5ncmFwaHFsQXBpLmdyYXBocWxVcmxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIEFwcFN5bmMgQVBJIElEIHRvIHBhcmFtZXRlciBzdG9yZS5cclxuICAgICAgICAvLyBBbGxvdyByZXNvdXJjZXMgdG8gZGVmaW5lIGFuIElBTSBzZWN1cml0eSBwb2xpY3kgZm9yIEFwcFN5bmMgZGF0YSBvcGVyYXRpb25zLlxyXG4gICAgICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdBcHBzeW5jR3JhcGhxbEFwaUlkJywge1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiAnL2FwcFN5bmMvYXBpSWQnLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogdGhpcy5ncmFwaHFsQXBpLmFwaUlkXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hQnVpbGRlciA9IG5ldyBBcHBTeW5jU2NoZW1hQnVpbGRlcih0aGlzLmdyYXBocWxBcGksIHRoaXMuYWN0aXZlQXV0aG9yaXphdGlvblR5cGVzKTtcclxuICAgIH1cclxufVxyXG4iXX0=