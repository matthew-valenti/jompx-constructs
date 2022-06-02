"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSync = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const appsync = require("@aws-cdk/aws-appsync-alpha");
const ssm = require("aws-cdk-lib/aws-ssm");
const constructs_1 = require("constructs");
const schema_builder_1 = require("./schema-builder");
/**
 * AWS AppSync (serverless GraphQL).
 */
class AppSync extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _b;
        super(scope, id);
        this.graphqlApi = new appsync.GraphqlApi(this, 'AppSync', {
            name: props.name,
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.IAM
                },
                additionalAuthorizationModes: (_b = props.additionalAuthorizationModes) !== null && _b !== void 0 ? _b : []
            }
        });
        // Add GraphQL url to parameter store.
        new ssm.StringParameter(this, 'AppsyncGraphqlUrl', {
            parameterName: '/appSync/graphqlUrl',
            stringValue: this.graphqlApi.graphqlUrl
        });
        this.schemaBuilder = new schema_builder_1.AppSyncSchemaBuilder(this.graphqlApi);
    }
}
exports.AppSync = AppSync;
_a = JSII_RTTI_SYMBOL_1;
AppSync[_a] = { fqn: "@jompx/constructs.AppSync", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC1zeW5jL2FwcC1zeW5jLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUFzRDtBQUV0RCwyQ0FBMkM7QUFDM0MsMkNBQXVDO0FBQ3ZDLHFEQUF3RDtBQVd4RDs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLHNCQUFTO0lBSWxDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7O1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUN0RCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsbUJBQW1CLEVBQUU7Z0JBQ2pCLG9CQUFvQixFQUFFO29CQUNsQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRztpQkFDbkQ7Z0JBQ0QsNEJBQTRCLFFBQUUsS0FBSyxDQUFDLDRCQUE0QixtQ0FBSSxFQUFFO2FBQ3pFO1NBQ0osQ0FBQyxDQUFDO1FBRUgsc0NBQXNDO1FBQ3RDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDL0MsYUFBYSxFQUFFLHFCQUFxQjtZQUNwQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVO1NBQzFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxxQ0FBb0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkUsQ0FBQzs7QUF4QkwsMEJBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCAqIGFzIHNzbSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3NtJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IEFwcFN5bmNTY2hlbWFCdWlsZGVyIH0gZnJvbSAnLi9zY2hlbWEtYnVpbGRlcic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBTeW5jUHJvcHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBOYW1lIG9mIHRoZSBBcHBTeW5jIEdyYXBoUUwgcmVzb3VyY2UgYXMgaXQgYXBwZWFycyBpbiB0aGUgQVdTIENvbnNvbGUuXHJcbiAgICAgKi9cclxuICAgIG5hbWU6IHN0cmluZzsgLy8gVXNlIGtlYmFiLWNhc2UuXHJcbiAgICBhZGRpdGlvbmFsQXV0aG9yaXphdGlvbk1vZGVzPzogYXBwc3luYy5BdXRob3JpemF0aW9uTW9kZVtdO1xyXG4gICAgdXNlclBvb2w/OiBjZGsuYXdzX2NvZ25pdG8uVXNlclBvb2w7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBV1MgQXBwU3luYyAoc2VydmVybGVzcyBHcmFwaFFMKS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuICAgIHB1YmxpYyBncmFwaHFsQXBpOiBhcHBzeW5jLkdyYXBocWxBcGk7XHJcbiAgICBwdWJsaWMgc2NoZW1hQnVpbGRlcjogQXBwU3luY1NjaGVtYUJ1aWxkZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElBcHBTeW5jUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkgPSBuZXcgYXBwc3luYy5HcmFwaHFsQXBpKHRoaXMsICdBcHBTeW5jJywge1xyXG4gICAgICAgICAgICBuYW1lOiBwcm9wcy5uYW1lLFxyXG4gICAgICAgICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLklBTVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IHByb3BzLmFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXMgPz8gW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBZGQgR3JhcGhRTCB1cmwgdG8gcGFyYW1ldGVyIHN0b3JlLlxyXG4gICAgICAgIG5ldyBzc20uU3RyaW5nUGFyYW1ldGVyKHRoaXMsICdBcHBzeW5jR3JhcGhxbFVybCcsIHtcclxuICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogJy9hcHBTeW5jL2dyYXBocWxVcmwnLFxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogdGhpcy5ncmFwaHFsQXBpLmdyYXBocWxVcmxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlbWFCdWlsZGVyID0gbmV3IEFwcFN5bmNTY2hlbWFCdWlsZGVyKHRoaXMuZ3JhcGhxbEFwaSk7XHJcbiAgICB9XHJcbn1cclxuIl19