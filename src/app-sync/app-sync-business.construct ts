// eslint-disable-next-line import/no-extraneous-dependencies
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
import { Construct } from 'constructs';
import { AppSyncSchema } from '../../classes/app-sync/schema';
import { IDataSource, ISchemaType } from '../../types/app-sync';
// import * as appsync from 'aws-cdk-lib/aws-appsync';

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
    public dataSources: IDataSource = {};
    public schemaTypes: ISchemaType = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };

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
    }

    // Add datasource to AppSync and an internal array. Remove this when AppSync provides a way to iterate datasources).
    public addDataSource(id: string, lambdaFunction: cdk.aws_lambda.IFunction, options?: appsync.DataSourceOptions) {
        const identifier = `AppSyncDataSource${changeCase.pascalCase(id)}`;
        const dataSource = this.graphqlApi.addLambdaDataSource(identifier, lambdaFunction, options);
        this.dataSources = { ...this.dataSources, ...{ [id]: dataSource } };
    }

    public addSchemaTypes(schemaTypes: ISchemaType) {
        this.schemaTypes = { ...this.schemaTypes, ...schemaTypes };
    }

    public createSchema() {
        const schema = new AppSyncSchema(this.graphqlApi, this.dataSources, this.schemaTypes);
        schema.create();
    }
}
