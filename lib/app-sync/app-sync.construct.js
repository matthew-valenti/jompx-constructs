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
        var _a;
        super(scope, id);
        this.graphqlApi = new appsync.GraphqlApi(this, 'AppSync', {
            name: props.name,
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.IAM
                },
                additionalAuthorizationModes: (_a = props.additionalAuthorizationModes) !== null && _a !== void 0 ? _a : []
            }
        });
        // Add project ids to parameter store.
        new ssm.StringParameter(this, 'AppsyncGraphqlUrl', {
            parameterName: '/appSync2/graphqlUrl',
            stringValue: this.graphqlApi.graphqlUrl
        });
        this.schemaBuilder = new schema_builder_1.AppSyncSchemaBuilder(this.graphqlApi);
    }
}
exports.AppSync = AppSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC1zeW5jL2FwcC1zeW5jLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxzREFBc0Q7QUFFdEQsMkNBQTJDO0FBQzNDLDJDQUF1QztBQUN2QyxxREFBd0Q7QUFXeEQ7O0dBRUc7QUFDSCxNQUFhLE9BQVEsU0FBUSxzQkFBUztJQUlsQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9COztRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDdEQsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLG1CQUFtQixFQUFFO2dCQUNqQixvQkFBb0IsRUFBRTtvQkFDbEIsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLGlCQUFpQixDQUFDLEdBQUc7aUJBQ25EO2dCQUNELDRCQUE0QixRQUFFLEtBQUssQ0FBQyw0QkFBNEIsbUNBQUksRUFBRTthQUN6RTtTQUNKLENBQUMsQ0FBQztRQUVILHNDQUFzQztRQUN0QyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLG1CQUFtQixFQUFFO1lBQy9DLGFBQWEsRUFBRSxzQkFBc0I7WUFDckMsV0FBVyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVTtTQUMxQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkscUNBQW9CLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25FLENBQUM7Q0FDSjtBQXpCRCwwQkF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgc3NtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zc20nO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgQXBwU3luY1NjaGVtYUJ1aWxkZXIgfSBmcm9tICcuL3NjaGVtYS1idWlsZGVyJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFwcFN5bmNQcm9wcyB7XHJcbiAgICAvKipcclxuICAgICAqIE5hbWUgb2YgdGhlIEFwcFN5bmMgR3JhcGhRTCByZXNvdXJjZSBhcyBpdCBhcHBlYXJzIGluIHRoZSBBV1MgQ29uc29sZS5cclxuICAgICAqL1xyXG4gICAgbmFtZTogc3RyaW5nOyAvLyBVc2Uga2ViYWItY2FzZS5cclxuICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM/OiBhcHBzeW5jLkF1dGhvcml6YXRpb25Nb2RlW107XHJcbiAgICB1c2VyUG9vbD86IGNkay5hd3NfY29nbml0by5Vc2VyUG9vbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFXUyBBcHBTeW5jIChzZXJ2ZXJsZXNzIEdyYXBoUUwpLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljIGdyYXBocWxBcGk6IGFwcHN5bmMuR3JhcGhxbEFwaTtcclxuICAgIHB1YmxpYyBzY2hlbWFCdWlsZGVyOiBBcHBTeW5jU2NoZW1hQnVpbGRlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUFwcFN5bmNQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ0FwcFN5bmMnLCB7XHJcbiAgICAgICAgICAgIG5hbWU6IHByb3BzLm5hbWUsXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2RlczogcHJvcHMuYWRkaXRpb25hbEF1dGhvcml6YXRpb25Nb2RlcyA/PyBbXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBwcm9qZWN0IGlkcyB0byBwYXJhbWV0ZXIgc3RvcmUuXHJcbiAgICAgICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIodGhpcywgJ0FwcHN5bmNHcmFwaHFsVXJsJywge1xyXG4gICAgICAgICAgICBwYXJhbWV0ZXJOYW1lOiAnL2FwcFN5bmMyL2dyYXBocWxVcmwnLCAvLyBUT0RPOiBSZW1vdmUgMi4gL2FwcFN5bmMvZ3JhcGhxbFVybCBhbHJlYWR5IGV4aXN0cyBlcnJvciB3aGVuIGl0J3MgYmVlbiBkZWxldGVkLlxyXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZTogdGhpcy5ncmFwaHFsQXBpLmdyYXBocWxVcmxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2hlbWFCdWlsZGVyID0gbmV3IEFwcFN5bmNTY2hlbWFCdWlsZGVyKHRoaXMuZ3JhcGhxbEFwaSk7XHJcbiAgICB9XHJcbn1cclxuIl19