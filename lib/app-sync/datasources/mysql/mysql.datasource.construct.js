"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncMySqlDataSource = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const lambdanjs = require("aws-cdk-lib/aws-lambda-nodejs");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
const constructs_1 = require("constructs");
const app_sync_types_1 = require("../../app-sync.types");
/**
 * AWS AppSync (serverless GraphQL).
 */
class AppSyncMySqlDataSource extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.lambdaFunction = new lambdanjs.NodejsFunction(scope, 'handler', {
            // Defaults.
            ...app_sync_types_1.AppSyncLambdaDefaultProps,
            // Datasource overrides.
            description: `AppSync resolver for ${changeCase.pascalCase(id)} datasource.`,
            // Props overrides.
            ...props
        });
    }
}
exports.AppSyncMySqlDataSource = AppSyncMySqlDataSource;
_a = JSII_RTTI_SYMBOL_1;
AppSyncMySqlDataSource[_a] = { fqn: "@jompx/constructs.AppSyncMySqlDataSource", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuZGF0YXNvdXJjZS5jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwLXN5bmMvZGF0YXNvdXJjZXMvbXlzcWwvbXlzcWwuZGF0YXNvdXJjZS5jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSwyREFBMkQ7QUFDM0QsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQywyQ0FBdUM7QUFDdkMseURBQWlFO0FBTWpFOztHQUVHO0FBQ0gsTUFBYSxzQkFBdUIsU0FBUSxzQkFBUztJQUtqRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1DO1FBQ3pFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtZQUNqRSxZQUFZO1lBQ1osR0FBRywwQ0FBeUI7WUFDNUIsd0JBQXdCO1lBQ3hCLFdBQVcsRUFBRSx3QkFBd0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsY0FBYztZQUM1RSxtQkFBbUI7WUFDbkIsR0FBRyxLQUFLO1NBQ1gsQ0FBQyxDQUFDO0lBQ1AsQ0FBQzs7QUFsQkwsd0RBbUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0ICogYXMgbGFtYmRhbmpzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IEFwcFN5bmNMYW1iZGFEZWZhdWx0UHJvcHMgfSBmcm9tICcuLi8uLi9hcHAtc3luYy50eXBlcyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBcHBTeW5jTXlTcWxEYXRhU291cmNlUHJvcHMge1xyXG4gICAgbGFtYmRhRnVuY3Rpb25Qcm9wcz86IGNkay5hd3NfbGFtYmRhX25vZGVqcy5Ob2RlanNGdW5jdGlvblByb3BzO1xyXG59XHJcblxyXG4vKipcclxuICogQVdTIEFwcFN5bmMgKHNlcnZlcmxlc3MgR3JhcGhRTCkuXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQXBwU3luY015U3FsRGF0YVNvdXJjZSBleHRlbmRzIENvbnN0cnVjdCB7XHJcblxyXG4gICAgcHVibGljIGxhbWJkYUZ1bmN0aW9uOiBjZGsuYXdzX2xhbWJkYS5JRnVuY3Rpb247XHJcbiAgICBwdWJsaWMgcHJvcHM6IElBcHBTeW5jTXlTcWxEYXRhU291cmNlUHJvcHM7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IElBcHBTeW5jTXlTcWxEYXRhU291cmNlUHJvcHMpIHtcclxuICAgICAgICBzdXBlcihzY29wZSwgaWQpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzID0gcHJvcHM7XHJcblxyXG4gICAgICAgIHRoaXMubGFtYmRhRnVuY3Rpb24gPSBuZXcgbGFtYmRhbmpzLk5vZGVqc0Z1bmN0aW9uKHNjb3BlLCAnaGFuZGxlcicsIHtcclxuICAgICAgICAgICAgLy8gRGVmYXVsdHMuXHJcbiAgICAgICAgICAgIC4uLkFwcFN5bmNMYW1iZGFEZWZhdWx0UHJvcHMsXHJcbiAgICAgICAgICAgIC8vIERhdGFzb3VyY2Ugb3ZlcnJpZGVzLlxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogYEFwcFN5bmMgcmVzb2x2ZXIgZm9yICR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKGlkKX0gZGF0YXNvdXJjZS5gLFxyXG4gICAgICAgICAgICAvLyBQcm9wcyBvdmVycmlkZXMuXHJcbiAgICAgICAgICAgIC4uLnByb3BzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXX0=