import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { AppSyncSchemaBuilder } from './schema-builder';

export interface IAppSyncProps {
    /**
     * Name of the AppSync GraphQL resource as it appears in the AWS Console.
     */
    name: string; // Use kebab-case.
    additionalAuthorizationModes?: appsync.AuthorizationMode[];
    userPool?: cdk.aws_cognito.UserPool;
}

/**
 * AWS AppSync (serverless GraphQL).
 */
export class AppSync extends Construct {
    public graphqlApi: appsync.GraphqlApi;
    public schemaBuilder: AppSyncSchemaBuilder;

    constructor(scope: Construct, id: string, props: IAppSyncProps) {
        super(scope, id);

        this.graphqlApi = new appsync.GraphqlApi(this, 'AppSync', {
            name: props.name,
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.IAM
                },
                additionalAuthorizationModes: props.additionalAuthorizationModes ?? []
            }
        });

        // Add GraphQL url to parameter store.
        new ssm.StringParameter(this, 'AppsyncGraphqlUrl', {
            parameterName: '/appSync/graphqlUrl',
            stringValue: this.graphqlApi.graphqlUrl
        });

        this.schemaBuilder = new AppSyncSchemaBuilder(this.graphqlApi);
    }
}
