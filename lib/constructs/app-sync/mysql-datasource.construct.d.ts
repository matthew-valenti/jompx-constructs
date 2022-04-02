import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IAppSyncDataSourceLambdaProps } from '../../types/app-sync';
export interface IAppSyncMySqlDataSourceProps {
    lambda?: IAppSyncDataSourceLambdaProps;
}
/**
 * AWS AppSync (serverless GraphQL).
 */
export declare class AppSyncMySqlDataSource extends Construct {
    lambdaFunction: cdk.aws_lambda.IFunction;
    constructor(scope: Construct, id: string, props: IAppSyncMySqlDataSourceProps);
}
