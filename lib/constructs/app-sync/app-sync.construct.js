"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSync = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const appsync = require("@aws-cdk/aws-appsync-alpha");
const constructs_1 = require("constructs");
const schema_1 = require("../../classes/app-sync/schema");
/**
 * AWS AppSync (serverless GraphQL).
 */
class AppSync extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _a;
        super(scope, id);
        this.dataSources = {};
        this.schemaTypes = {};
        this.graphqlApi = new appsync.GraphqlApi(this, 'AppSync', {
            name: (_a = props.name) !== null && _a !== void 0 ? _a : 'api',
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
        // schema.addSort(this.schemaTypes);
        // schema.addPagination(this.schemaTypes);
        // Object.values(this.schemaTypes).forEach(schemaType => {
        //     schema.addType(schemaType);
        // });
        schema.create();
    }
}
exports.AppSync = AppSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbnN0cnVjdHMvYXBwLXN5bmMvYXBwLXN5bmMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZEQUE2RDtBQUM3RCxzREFBc0Q7QUFFdEQsMkNBQXVDO0FBQ3ZDLDBEQUE4RDtBQVc5RDs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLHNCQUFTO0lBS2xDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBb0I7O1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFKZCxnQkFBVyxHQUFnQixFQUFFLENBQUM7UUFDOUIsZ0JBQVcsR0FBZ0IsRUFBRSxDQUFDO1FBS2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDdEQsSUFBSSxRQUFFLEtBQUssQ0FBQyxJQUFJLG1DQUFJLEtBQUs7WUFDekIsbUJBQW1CLEVBQUU7Z0JBQ2pCLG9CQUFvQixFQUFFO29CQUNsQixpQkFBaUIsRUFBRSxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRztpQkFDbkQ7Z0JBQ0Qsa0NBQWtDO2dCQUNsQyxnRUFBZ0U7Z0JBQ2hFLGlFQUFpRTtnQkFDakUsSUFBSTthQUNQO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELG9IQUFvSDtJQUM3RyxhQUFhLENBQUMsRUFBVSxFQUFFLGNBQXdDLEVBQUUsT0FBbUM7UUFDMUcsTUFBTSxVQUFVLEdBQUcsb0JBQW9CLEVBQUUsRUFBRSxDQUFDO1FBQzVDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUM7SUFDaEYsQ0FBQztJQUVNLGNBQWMsQ0FBQyxXQUF3QjtRQUMxQywyREFBMkQ7UUFDM0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO0lBQy9ELENBQUM7SUFFTSxZQUFZO1FBQ2YsTUFBTSxNQUFNLEdBQUcsSUFBSSxzQkFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEYsb0NBQW9DO1FBQ3BDLDBDQUEwQztRQUMxQywwREFBMEQ7UUFDMUQsa0NBQWtDO1FBQ2xDLE1BQU07UUFDTixNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDcEIsQ0FBQztDQVVKO0FBcERELDBCQW9EQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBBcHBTeW5jU2NoZW1hIH0gZnJvbSAnLi4vLi4vY2xhc3Nlcy9hcHAtc3luYy9zY2hlbWEnO1xyXG5pbXBvcnQgeyBJRGF0YVNvdXJjZSwgSVNjaGVtYVR5cGUgfSBmcm9tICcuLi8uLi90eXBlcy9hcHAtc3luYyc7XHJcbi8vIGltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwcHN5bmMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQXBwU3luY1Byb3BzIHtcclxuICAgIC8qKlxyXG4gICAgICogTmFtZSBvZiB0aGUgQXBwU3luYyBHcmFwaFFMIHJlc291cmNlIGFzIGl0IGFwcGVhcnMgaW4gdGhlIEFXUyBDb25zb2xlLlxyXG4gICAgICovXHJcbiAgICBuYW1lPzogc3RyaW5nOyAvLyBVc2Uga2ViYWItY2FzZS5cclxufVxyXG5cclxuLyoqXHJcbiAqIEFXUyBBcHBTeW5jIChzZXJ2ZXJsZXNzIEdyYXBoUUwpLlxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmMgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xyXG4gICAgcHVibGljIGdyYXBocWxBcGk6IGFwcHN5bmMuR3JhcGhxbEFwaTtcclxuICAgIHB1YmxpYyBkYXRhU291cmNlczogSURhdGFTb3VyY2UgPSB7fTtcclxuICAgIHB1YmxpYyBzY2hlbWFUeXBlczogSVNjaGVtYVR5cGUgPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUFwcFN5bmNQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaSA9IG5ldyBhcHBzeW5jLkdyYXBocWxBcGkodGhpcywgJ0FwcFN5bmMnLCB7XHJcbiAgICAgICAgICAgIG5hbWU6IHByb3BzLm5hbWUgPz8gJ2FwaScsXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb25Db25maWc6IHtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBhZGRpdGlvbmFsQXV0aG9yaXphdGlvbk1vZGVzOiBbXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgeyBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZIH0sXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgeyBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wgfVxyXG4gICAgICAgICAgICAgICAgLy8gXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGRhdGFzb3VyY2UgdG8gQXBwU3luYyBhbmQgYW4gaW50ZXJuYWwgYXJyYXkuIFJlbW92ZSB0aGlzIHdoZW4gQXBwU3luYyBwcm92aWRlcyBhIHdheSB0byBpdGVyYXRlIGRhdGFzb3VyY2VzKS5cclxuICAgIHB1YmxpYyBhZGREYXRhU291cmNlKGlkOiBzdHJpbmcsIGxhbWJkYUZ1bmN0aW9uOiBjZGsuYXdzX2xhbWJkYS5JRnVuY3Rpb24sIG9wdGlvbnM/OiBhcHBzeW5jLkRhdGFTb3VyY2VPcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IGBBcHBTeW5jRGF0YVNvdXJjZSR7aWR9YDtcclxuICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5ncmFwaHFsQXBpLmFkZExhbWJkYURhdGFTb3VyY2UoaWRlbnRpZmllciwgbGFtYmRhRnVuY3Rpb24sIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSB7IC4uLnRoaXMuZGF0YVNvdXJjZXMsIC4uLnsgW2lkZW50aWZpZXJdOiBkYXRhU291cmNlIH0gfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkU2NoZW1hVHlwZXMoc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlKSB7XHJcbiAgICAgICAgLy8gdGhpcy5zY2hlbWFUeXBlcyA9IHRoaXMuc2NoZW1hVHlwZXMuY29uY2F0KHNjaGVtYVR5cGVzKTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzID0geyAuLi50aGlzLnNjaGVtYVR5cGVzLCAuLi5zY2hlbWFUeXBlcyB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVTY2hlbWEoKSB7XHJcbiAgICAgICAgY29uc3Qgc2NoZW1hID0gbmV3IEFwcFN5bmNTY2hlbWEodGhpcy5ncmFwaHFsQXBpLCB0aGlzLmRhdGFTb3VyY2VzLCB0aGlzLnNjaGVtYVR5cGVzKTtcclxuICAgICAgICAvLyBzY2hlbWEuYWRkU29ydCh0aGlzLnNjaGVtYVR5cGVzKTtcclxuICAgICAgICAvLyBzY2hlbWEuYWRkUGFnaW5hdGlvbih0aGlzLnNjaGVtYVR5cGVzKTtcclxuICAgICAgICAvLyBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMpLmZvckVhY2goc2NoZW1hVHlwZSA9PiB7XHJcbiAgICAgICAgLy8gICAgIHNjaGVtYS5hZGRUeXBlKHNjaGVtYVR5cGUpO1xyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIHNjaGVtYS5jcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgZGlyZWN0aXZlPFQ+KGRpcmVjdGl2ZTogYW55KSB7XHJcblxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIEFkZCBhcHBzeW5jIHNjaGVtYSB0eXBlIHRvIGludGVybmFsIGFycmF5IGZvciBwb3N0IHByb2Nlc3NpbmcuXHJcbiAgICAvLyBwdWJsaWMgYWRkU2NoZW1hVHlwZShpZDogc3RyaW5nLCBzY2hlbWFUeXBlOiBJU2NoZW1hSW5wdXRUeXBlKSB7XHJcbiAgICAvLyAgICAgdGhpcy5zY2hlbWFUeXBlcz8ucHVzaCh7IFtpZF06IHNjaGVtYVR5cGUgfSk7XHJcbiAgICAvLyB9XHJcbn1cclxuIl19