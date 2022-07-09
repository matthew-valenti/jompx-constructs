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
    public activeAuthorizationTypes: appsync.AuthorizationType[] = [];

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

        // Get active authorization types.
        this.activeAuthorizationTypes.push(appsync.AuthorizationType.IAM);
        this.activeAuthorizationTypes = this.activeAuthorizationTypes.concat(props.additionalAuthorizationModes?.map(o => o.authorizationType) ?? []);

        // Add GraphQL url to parameter store.
        // Allow Lambda functions to call AppSync GraphQL operations.
        new ssm.StringParameter(this, 'AppsyncGraphqlUrl', {
            parameterName: '/appSync/graphqlUrl',
            stringValue: this.graphqlApi.graphqlUrl
        });

        // Add AppSync API ID to parameter store.
        // Allow resources to define an IAM security policy for AppSync data operations.
        new ssm.StringParameter(this, 'AppsyncGraphqlApiId', {
            parameterName: '/appSync/apiId',
            stringValue: this.graphqlApi.apiId
        });

        this.schemaBuilder = new AppSyncSchemaBuilder(this.graphqlApi, this.activeAuthorizationTypes);
    }
}
