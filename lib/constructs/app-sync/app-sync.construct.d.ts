import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IDataSource, ISchemaType } from '../../types/app-sync';
export interface IAppSyncProps {
    /**
     * Name of the AppSync GraphQL resource as it appears in the AWS Console.
     */
    name?: string;
}
/**
 * AWS AppSync (serverless GraphQL).
 */
export declare class AppSync extends Construct {
    graphqlApi: appsync.GraphqlApi;
    dataSources: IDataSource;
    schemaTypes: ISchemaType;
    constructor(scope: Construct, id: string, props: IAppSyncProps);
    addDataSource(id: string, lambdaFunction: cdk.aws_lambda.IFunction, options?: appsync.DataSourceOptions): void;
    addSchemaTypes(schemaTypes: ISchemaType): void;
    createSchema(): void;
}
