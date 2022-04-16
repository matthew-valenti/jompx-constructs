"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSync = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const appsync = require("@aws-cdk/aws-appsync-alpha");
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
        this.schemaBuilder = new schema_builder_1.AppSyncSchemaBuilder(this.graphqlApi);
    }
}
exports.AppSync = AppSync;
_a = JSII_RTTI_SYMBOL_1;
AppSync[_a] = { fqn: "@jompx/constructs.AppSync", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC1zeW5jL2FwcC1zeW5jLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUFzRDtBQUN0RCwyQ0FBdUM7QUFDdkMscURBQXdEO0FBU3hEOztHQUVHO0FBQ0gsTUFBYSxPQUFRLFNBQVEsc0JBQVM7SUFJbEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFvQjs7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3RELElBQUksUUFBRSxLQUFLLENBQUMsSUFBSSxtQ0FBSSxLQUFLO1lBQ3pCLG1CQUFtQixFQUFFO2dCQUNqQixvQkFBb0IsRUFBRTtvQkFDbEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUc7aUJBQ25EO2dCQUNELGtDQUFrQztnQkFDbEMsZ0VBQWdFO2dCQUNoRSxpRUFBaUU7Z0JBQ2pFLElBQUk7YUFDUDtTQUNKLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxxQ0FBb0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbkUsQ0FBQzs7QUFyQkwsMEJBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBBcHBTeW5jU2NoZW1hQnVpbGRlciB9IGZyb20gJy4vc2NoZW1hLWJ1aWxkZXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwU3luY1Byb3BzIHtcclxuICAgIC8qKlxyXG4gICAgICogTmFtZSBvZiB0aGUgQXBwU3luYyBHcmFwaFFMIHJlc291cmNlIGFzIGl0IGFwcGVhcnMgaW4gdGhlIEFXUyBDb25zb2xlLlxyXG4gICAgICovXHJcbiAgICBuYW1lPzogc3RyaW5nOyAvLyBVc2Uga2ViYWItY2FzZS5cclxufVxyXG5cclxuLyoqXHJcbiAqIEFXUyBBcHBTeW5jIChzZXJ2ZXJsZXNzIEdyYXBoUUwpLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljIGdyYXBocWxBcGk6IGFwcHN5bmMuR3JhcGhxbEFwaTtcclxuICAgIHB1YmxpYyBzY2hlbWFCdWlsZGVyOiBBcHBTeW5jU2NoZW1hQnVpbGRlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUFwcFN5bmNQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ0FwcFN5bmMnLCB7XHJcbiAgICAgICAgICAgIG5hbWU6IHByb3BzLm5hbWUgPz8gJ2FwaScsXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBhZGRpdGlvbmFsQXV0aG9yaXphdGlvbk1vZGVzOiBbXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgeyBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZIH0sXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgeyBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wgfVxyXG4gICAgICAgICAgICAgICAgLy8gXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hQnVpbGRlciA9IG5ldyBBcHBTeW5jU2NoZW1hQnVpbGRlcih0aGlzLmdyYXBocWxBcGkpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==