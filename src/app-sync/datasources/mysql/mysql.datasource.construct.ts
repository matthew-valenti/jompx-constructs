import * as cdk from 'aws-cdk-lib';
import * as lambdanjs from 'aws-cdk-lib/aws-lambda-nodejs';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';
import { AppSyncLambdaDefaultProps } from '../../app-sync.types';

export interface IAppSyncMySqlDataSourceProps {
    lambdaFunctionProps?: cdk.aws_lambda_nodejs.NodejsFunctionProps;
}

/**
 * AWS AppSync (serverless GraphQL).
 */
export class AppSyncMySqlDataSource extends Construct {

    public lambdaFunction: cdk.aws_lambda.IFunction;

    constructor(scope: Construct, id: string, props: IAppSyncMySqlDataSourceProps) {
        super(scope, id);

        this.lambdaFunction = new lambdanjs.NodejsFunction(scope, 'handler', {
            // Defaults.
            ...{ AppSyncLambdaDefaultProps },
            // Datasource overrides.
            description: `AppSync resolver for ${changeCase.pascalCase(id)} datasource.`,
            // Props overrides.
            ...{ props }
        });
    }
}