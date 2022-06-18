import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppSyncSchemaBuilder } from './schema-builder';
export interface IAppSyncProps {
    /**
     * Name of the AppSync GraphQL resource as it appears in the AWS Console.
     */
    name: string;
    additionalAuthorizationModes?: appsync.AuthorizationMode[];
    userPool?: cdk.aws_cognito.UserPool;
}
/**
 * AWS AppSync (serverless GraphQL).
 */
export declare class AppSync extends Construct {
    graphqlApi: appsync.GraphqlApi;
    schemaBuilder: AppSyncSchemaBuilder;
    activeAuthorizationTypes: appsync.AuthorizationType[];
    constructor(scope: Construct, id: string, props: IAppSyncProps);
}
