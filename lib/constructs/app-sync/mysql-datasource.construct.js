"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncMySqlDataSource = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
// eslint-disable-next-line import/no-extraneous-dependencies
// import * as appsync from '@aws-cdk/aws-appsync-alpha';
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");
const lambdanjs = require("aws-cdk-lib/aws-lambda-nodejs");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const constructs_1 = require("constructs");
/**
 * AWS AppSync (serverless GraphQL).
 */
class AppSyncMySqlDataSource extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _b, _c, _d, _e;
        super(scope, id);
        this.lambdaFunction = new lambdanjs.NodejsFunction(scope, 'handler', {
            description: `AppSync resolver for ${changeCase.pascalCase(id)} datasource.`,
            runtime: lambda.Runtime.NODEJS_14_X,
            timeout: (_c = (_b = props.lambda) === null || _b === void 0 ? void 0 : _b.timeout) !== null && _c !== void 0 ? _c : cdk.Duration.seconds(10),
            memorySize: (_e = (_d = props.lambda) === null || _d === void 0 ? void 0 : _d.memorySize) !== null && _e !== void 0 ? _e : 128,
            // TODO: Do we want to hard code?
            bundling: {
                minify: true,
                sourceMap: true
            }
        });
    }
}
exports.AppSyncMySqlDataSource = AppSyncMySqlDataSource;
_a = JSII_RTTI_SYMBOL_1;
AppSyncMySqlDataSource[_a] = { fqn: "@jompx/constructs.AppSyncMySqlDataSource", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwtZGF0YXNvdXJjZS5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29uc3RydWN0cy9hcHAtc3luYy9teXNxbC1kYXRhc291cmNlLmNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZEQUE2RDtBQUM3RCx5REFBeUQ7QUFDekQsbUNBQW1DO0FBQ25DLGlEQUFpRDtBQUNqRCwyREFBMkQ7QUFDM0QsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQywyQ0FBdUM7QUFRdkM7O0dBRUc7QUFDSCxNQUFhLHNCQUF1QixTQUFRLHNCQUFTO0lBSWpELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBbUM7O1FBQ3pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNqRSxXQUFXLEVBQUUsd0JBQXdCLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGNBQWM7WUFDNUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLGNBQUUsS0FBSyxDQUFDLE1BQU0sMENBQUUsT0FBTyxtQ0FBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDMUQsVUFBVSxjQUFFLEtBQUssQ0FBQyxNQUFNLDBDQUFFLFVBQVUsbUNBQUksR0FBRztZQUMzQyxpQ0FBaUM7WUFDakMsUUFBUSxFQUFFO2dCQUNOLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFNBQVMsRUFBRSxJQUFJO2FBQ2xCO1NBQ0osQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7QUFsQkwsd0RBbUJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG4vLyBpbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgKiBhcyBsYW1iZGFuanMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ub2RlanMnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgSUFwcFN5bmNEYXRhU291cmNlTGFtYmRhUHJvcHMgfSBmcm9tICcuLi8uLi90eXBlcy9hcHAtc3luYyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBTeW5jTXlTcWxEYXRhU291cmNlUHJvcHMge1xyXG4gICAgLy8gZ3JhcGhxbEFwaTogYXBwc3luYy5HcmFwaHFsQXBpO1xyXG4gICAgbGFtYmRhPzogSUFwcFN5bmNEYXRhU291cmNlTGFtYmRhUHJvcHM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBV1MgQXBwU3luYyAoc2VydmVybGVzcyBHcmFwaFFMKS5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jTXlTcWxEYXRhU291cmNlIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuXHJcbiAgICBwdWJsaWMgbGFtYmRhRnVuY3Rpb246IGNkay5hd3NfbGFtYmRhLklGdW5jdGlvbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogSUFwcFN5bmNNeVNxbERhdGFTb3VyY2VQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIHRoaXMubGFtYmRhRnVuY3Rpb24gPSBuZXcgbGFtYmRhbmpzLk5vZGVqc0Z1bmN0aW9uKHNjb3BlLCAnaGFuZGxlcicsIHtcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBBcHBTeW5jIHJlc29sdmVyIGZvciAke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShpZCl9IGRhdGFzb3VyY2UuYCxcclxuICAgICAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXHJcbiAgICAgICAgICAgIHRpbWVvdXQ6IHByb3BzLmxhbWJkYT8udGltZW91dCA/PyBjZGsuRHVyYXRpb24uc2Vjb25kcygxMCksXHJcbiAgICAgICAgICAgIG1lbW9yeVNpemU6IHByb3BzLmxhbWJkYT8ubWVtb3J5U2l6ZSA/PyAxMjgsXHJcbiAgICAgICAgICAgIC8vIFRPRE86IERvIHdlIHdhbnQgdG8gaGFyZCBjb2RlP1xyXG4gICAgICAgICAgICBidW5kbGluZzoge1xyXG4gICAgICAgICAgICAgICAgbWluaWZ5OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc291cmNlTWFwOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdfQ==