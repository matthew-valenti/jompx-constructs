"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSync = void 0;
const appsync = require("@aws-cdk/aws-appsync-alpha");
const constructs_1 = require("constructs");
const schema_builder_1 = require("./schema-builder");
/**
 * AWS AppSync (serverless GraphQL).
 */
class AppSync extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _a;
        super(scope, id);
        this.graphqlApi = new appsync.GraphqlApi(this, 'AppSync', {
            name: (_a = props.name) !== null && _a !== void 0 ? _a : 'api',
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.IAM
                },
                additionalAuthorizationModes: [
                    { authorizationType: appsync.AuthorizationType.USER_POOL }
                    // { authorizationType: appsync.AuthorizationType.API_KEY }
                ]
            }
        });
        this.schemaBuilder = new schema_builder_1.AppSyncSchemaBuilder(this.graphqlApi);
    }
}
exports.AppSync = AppSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMuY29uc3RydWN0IGNvcHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvYXBwLXN5bmMuY29uc3RydWN0IGNvcHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQXNEO0FBQ3RELDJDQUF1QztBQUN2QyxxREFBd0Q7QUFTeEQ7O0dBRUc7QUFDSCxNQUFhLE9BQVEsU0FBUSxzQkFBUztJQUlsQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9COztRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDdEQsSUFBSSxRQUFFLEtBQUssQ0FBQyxJQUFJLG1DQUFJLEtBQUs7WUFDekIsbUJBQW1CLEVBQUU7Z0JBQ2pCLG9CQUFvQixFQUFFO29CQUNsQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRztpQkFDbkQ7Z0JBQ0QsNEJBQTRCLEVBQUU7b0JBQzFCLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFNBQVMsRUFBRTtvQkFDMUQsMkRBQTJEO2lCQUM5RDthQUNKO1NBQ0osQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLHFDQUFvQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuRSxDQUFDO0NBQ0o7QUF0QkQsMEJBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBBcHBTeW5jU2NoZW1hQnVpbGRlciB9IGZyb20gJy4vc2NoZW1hLWJ1aWxkZXInO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwU3luY1Byb3BzIHtcclxuICAgIC8qKlxyXG4gICAgICogTmFtZSBvZiB0aGUgQXBwU3luYyBHcmFwaFFMIHJlc291cmNlIGFzIGl0IGFwcGVhcnMgaW4gdGhlIEFXUyBDb25zb2xlLlxyXG4gICAgICovXHJcbiAgICBuYW1lPzogc3RyaW5nOyAvLyBVc2Uga2ViYWItY2FzZS5cclxufVxyXG5cclxuLyoqXHJcbiAqIEFXUyBBcHBTeW5jIChzZXJ2ZXJsZXNzIEdyYXBoUUwpLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljIGdyYXBocWxBcGk6IGFwcHN5bmMuR3JhcGhxbEFwaTtcclxuICAgIHB1YmxpYyBzY2hlbWFCdWlsZGVyOiBBcHBTeW5jU2NoZW1hQnVpbGRlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUFwcFN5bmNQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ0FwcFN5bmMnLCB7XHJcbiAgICAgICAgICAgIG5hbWU6IHByb3BzLm5hbWUgPz8gJ2FwaScsXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2RlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuVVNFUl9QT09MIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyB7IGF1dGhvcml6YXRpb25UeXBlOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVkgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NoZW1hQnVpbGRlciA9IG5ldyBBcHBTeW5jU2NoZW1hQnVpbGRlcih0aGlzLmdyYXBocWxBcGkpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==