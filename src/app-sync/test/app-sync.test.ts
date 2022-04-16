import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
// import { Config } from '../src/classes/config';
// import { AppSync, IAppSyncProps } from '../../src/constructs/app-sync/app-sync.construct';
import * as jompx from '../../../src';
import { Config as JompxConfig } from '../../config/test/jompx.config';
import { MySqlSchema } from './mysql.schema';

// For convenience and strong typing, use an enum for AppSync datasource ids.
export enum AppSyncDatasource {
    mySql = 'mySql',
    cognito = 'cognito'
}

describe('AppSyncStack', () => {
    test('create schema', () => {

        const app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'test' } } });
        const stack = new cdk.Stack(app);

        // const config = new Config(app.node);

        const appSyncProps: jompx.IAppSyncProps = {
            name: 'api'
        };

        // Create AWS AppSync resource.
        const appSync = new jompx.AppSync(stack, 'AppSync', appSyncProps);
        const schemaBuilder = appSync.schemaBuilder;

        // Add MySQL datasource.
        const appSyncMySqlDataSource = new jompx.AppSyncMySqlDataSource(stack, AppSyncDatasource.mySql, {});
        schemaBuilder.addDataSource(AppSyncDatasource.mySql, appSyncMySqlDataSource.lambdaFunction);

        // Add MySQL schema.
        const mySqlSchema = new MySqlSchema(schemaBuilder.dataSources);
        schemaBuilder.addSchemaTypes(mySqlSchema.types);

        schemaBuilder.create();

        const template = Template.fromStack(stack);
        // console.log(template, 'template');
        template.resourceCountIs('AWS::AppSync::GraphQLApi', 1);
        template.resourceCountIs('AWS::AppSync::GraphQLSchema', 1);

        // TODO: How do we confirm the correct schema is being generated.
        const graphQLSchema = template.findResources('AWS::AppSync::GraphQLSchema');
        const graphQLSchemaKey = Object.keys(graphQLSchema)[0];
        const schema = graphQLSchema[graphQLSchemaKey]?.Properties?.Definition;
        console.log('schema', schema);
    });
});
