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
        var _b, _c, _d;
        super(scope, id);
        this.activeAuthorizationTypes = [];
        this.graphqlApi = new appsync.GraphqlApi(this, 'AppSync', {
            name: props.name,
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.IAM
                },
                additionalAuthorizationModes: (_b = props.additionalAuthorizationModes) !== null && _b !== void 0 ? _b : []
            }
        });
        // Get active authorization types.
        this.activeAuthorizationTypes.push(appsync.AuthorizationType.IAM);
        this.activeAuthorizationTypes = this.activeAuthorizationTypes.concat((_d = (_c = props.additionalAuthorizationModes) === null || _c === void 0 ? void 0 : _c.map(o => o.authorizationType)) !== null && _d !== void 0 ? _d : []);
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
_a = JSII_RTTI_SYMBOL_1;
AppSync[_a] = { fqn: "@jompx/constructs.AppSync", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC1zeW5jL2FwcC1zeW5jLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUFzRDtBQUV0RCwyQ0FBMkM7QUFDM0MsMkNBQXVDO0FBQ3ZDLHFEQUF3RDtBQVd4RDs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLHNCQUFTO0lBS2xDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7O1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFIZCw2QkFBd0IsR0FBZ0MsRUFBRSxDQUFDO1FBSzlELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDdEQsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLG1CQUFtQixFQUFFO2dCQUNqQixvQkFBb0IsRUFBRTtvQkFDbEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUc7aUJBQ25EO2dCQUNELDRCQUE0QixRQUFFLEtBQUssQ0FBQyw0QkFBNEIsbUNBQUksRUFBRTthQUN6RTtTQUNKLENBQUMsQ0FBQztRQUVILGtDQUFrQztRQUNsQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sYUFBQyxLQUFLLENBQUMsNEJBQTRCLDBDQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsb0NBQUssRUFBRSxDQUFDLENBQUM7UUFFOUksc0NBQXNDO1FBQ3RDLDZEQUE2RDtRQUM3RCxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQy9DLGFBQWEsRUFBRSxxQkFBcUI7WUFDcEMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVTtTQUMxQyxDQUFDLENBQUM7UUFFSCx5Q0FBeUM7UUFDekMsZ0ZBQWdGO1FBQ2hGLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLEVBQUU7WUFDakQsYUFBYSxFQUFFLGdCQUFnQjtZQUMvQixXQUFXLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLO1NBQ3JDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxxQ0FBb0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7O0FBckNMLDBCQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnYXdzLWNkay1saWIvYXdzLXNzbSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBBcHBTeW5jU2NoZW1hQnVpbGRlciB9IGZyb20gJy4vc2NoZW1hLWJ1aWxkZXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwU3luY1Byb3BzIHtcclxuICAgIC8qKlxyXG4gICAgICogTmFtZSBvZiB0aGUgQXBwU3luYyBHcmFwaFFMIHJlc291cmNlIGFzIGl0IGFwcGVhcnMgaW4gdGhlIEFXUyBDb25zb2xlLlxyXG4gICAgICovXHJcbiAgICBuYW1lOiBzdHJpbmc7IC8vIFVzZSBrZWJhYi1jYXNlLlxyXG4gICAgYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2Rlcz86IGFwcHN5bmMuQXV0aG9yaXphdGlvbk1vZGVbXTtcclxuICAgIHVzZXJQb29sPzogY2RrLmF3c19jb2duaXRvLlVzZXJQb29sO1xyXG59XHJcblxyXG4vKipcclxuICogQVdTIEFwcFN5bmMgKHNlcnZlcmxlc3MgR3JhcGhRTCkuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwU3luYyBleHRlbmRzIENvbnN0cnVjdCB7XHJcbiAgICBwdWJsaWMgZ3JhcGhxbEFwaTogYXBwc3luYy5HcmFwaHFsQXBpO1xyXG4gICAgcHVibGljIHNjaGVtYUJ1aWxkZXI6IEFwcFN5bmNTY2hlbWFCdWlsZGVyO1xyXG4gICAgcHVibGljIGFjdGl2ZUF1dGhvcml6YXRpb25UeXBlczogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElBcHBTeW5jUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkgPSBuZXcgYXBwc3luYy5HcmFwaHFsQXBpKHRoaXMsICdBcHBTeW5jJywge1xyXG4gICAgICAgICAgICBuYW1lOiBwcm9wcy5uYW1lLFxyXG4gICAgICAgICAgICBhdXRob3JpemF0aW9uQ29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0QXV0aG9yaXphdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLklBTVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IHByb3BzLmFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXMgPz8gW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBHZXQgYWN0aXZlIGF1dGhvcml6YXRpb24gdHlwZXMuXHJcbiAgICAgICAgdGhpcy5hY3RpdmVBdXRob3JpemF0aW9uVHlwZXMucHVzaChhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLklBTSk7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVBdXRob3JpemF0aW9uVHlwZXMgPSB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcy5jb25jYXQocHJvcHMuYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2Rlcz8ubWFwKG8gPT4gby5hdXRob3JpemF0aW9uVHlwZSkgPz8gW10pO1xyXG5cclxuICAgICAgICAvLyBBZGQgR3JhcGhRTCB1cmwgdG8gcGFyYW1ldGVyIHN0b3JlLlxyXG4gICAgICAgIC8vIEFsbG93IExhbWJkYSBmdW5jdGlvbnMgdG8gY2FsbCBBcHBTeW5jIEdyYXBoUUwgb3BlcmF0aW9ucy5cclxuICAgICAgICBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcih0aGlzLCAnQXBwc3luY0dyYXBocWxVcmwnLCB7XHJcbiAgICAgICAgICAgIHBhcmFtZXRlck5hbWU6ICcvYXBwU3luYy9ncmFwaHFsVXJsJyxcclxuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IHRoaXMuZ3JhcGhxbEFwaS5ncmFwaHFsVXJsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBBcHBTeW5jIEFQSSBJRCB0byBwYXJhbWV0ZXIgc3RvcmUuXHJcbiAgICAgICAgLy8gQWxsb3cgcmVzb3VyY2VzIHRvIGRlZmluZSBhbiBJQU0gc2VjdXJpdHkgcG9saWN5IGZvciBBcHBTeW5jIGRhdGEgb3BlcmF0aW9ucy5cclxuICAgICAgICBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcih0aGlzLCAnQXBwc3luY0dyYXBocWxBcGlJZCcsIHtcclxuICAgICAgICAgICAgcGFyYW1ldGVyTmFtZTogJy9hcHBTeW5jL2FwaUlkJyxcclxuICAgICAgICAgICAgc3RyaW5nVmFsdWU6IHRoaXMuZ3JhcGhxbEFwaS5hcGlJZFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNjaGVtYUJ1aWxkZXIgPSBuZXcgQXBwU3luY1NjaGVtYUJ1aWxkZXIodGhpcy5ncmFwaHFsQXBpLCB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcyk7XHJcbiAgICB9XHJcbn1cclxuIl19