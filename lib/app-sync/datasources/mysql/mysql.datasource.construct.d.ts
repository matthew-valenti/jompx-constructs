import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
export interface IAppSyncMySqlDataSourceProps {
    lambdaFunctionProps?: cdk.aws_lambda_nodejs.NodejsFunctionProps;
}
/**
 * AWS AppSync (serverless GraphQL).
 */
export declare class AppSyncMySqlDataSource extends Construct {
    lambdaFunction: cdk.aws_lambda.IFunction;
    props: IAppSyncMySqlDataSourceProps;
    constructor(scope: Construct, id: string, props: IAppSyncMySqlDataSourceProps);
}
