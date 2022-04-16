import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { Construct } from 'constructs';
import { AppSyncSchemaBuilder } from './schema-builder';

export interface IAppSyncProps {
    /**
     * Name of the AppSync GraphQL resource as it appears in the AWS Console.
     */
    name?: string; // Use kebab-case.
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
            name: props.name ?? 'api',
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.IAM
                }
                // additionalAuthorizationModes: [
                //     { authorizationType: appsync.AuthorizationType.API_KEY },
                //     { authorizationType: appsync.AuthorizationType.USER_POOL }
                // ]
            }
        });

        this.schemaBuilder = new AppSyncSchemaBuilder(this.graphqlApi);
    }
}
