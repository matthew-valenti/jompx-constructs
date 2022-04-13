// eslint-disable-next-line import/no-extraneous-dependencies
// import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdanjs from 'aws-cdk-lib/aws-lambda-nodejs';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';
import { IAppSyncDataSourceLambdaProps } from '../../types/app-sync';

export interface IAppSyncMySqlDataSourceProps {
    // graphqlApi: appsync.GraphqlApi;
    lambda?: IAppSyncDataSourceLambdaProps;
}

/**
 * AWS AppSync (serverless GraphQL).
 */
export class AppSyncMySqlDataSource extends Construct {

    public lambdaFunction: cdk.aws_lambda.IFunction;

    constructor(scope: Construct, id: string, props: IAppSyncMySqlDataSourceProps) {
        super(scope, id);

        this.lambdaFunction = new lambdanjs.NodejsFunction(scope, 'handler', {
            description: `AppSync resolver for ${changeCase.pascalCase(id)} datasource.`,
            runtime: lambda.Runtime.NODEJS_14_X,
            timeout: props.lambda?.timeout ?? cdk.Duration.seconds(10),
            memorySize: props.lambda?.memorySize ?? 128,
            // TODO: Do we want to hard code?
            bundling: {
                minify: true,
                sourceMap: true
            }
        });
    }
}