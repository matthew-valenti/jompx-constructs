import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
// import { Config } from '../src/classes/config';
// import { AppSync, IAppSyncProps } from '../../src/constructs/app-sync/app-sync.construct';
import * as jompx from '../../src';
import { MySqlSchema } from '../app-sync/schema/mysql.schema';
import { Config as JompxConfig } from '../jompx.config';

export enum AppSyncDatasource {
    mySql = 'mySql',
    cognito = 'cognito'
}

describe('AppSyncStack', () => {
    test('stack > stage = test', () => {

        const app = new cdk.App({ context: { ...JompxConfig, '@jompx-local': { stage: 'test' } } });
        const stack = new cdk.Stack(app);

        // const config = new Config(app.node);

        const appSyncProps: jompx.IAppSyncProps = {
            name: 'api'
        };

        const appSync = new jompx.AppSync(stack, 'AppSync', appSyncProps);

        // Add MySQL datasource.
        const appSyncMySqlDataSource = new jompx.AppSyncMySqlDataSource(stack, AppSyncDatasource.mySql, {});
        appSync.addDataSource(AppSyncDatasource.mySql, appSyncMySqlDataSource.lambdaFunction);

        // Add MySQL schema.
        const mySqlSchema = new MySqlSchema();
        appSync.addSchemaTypes(mySqlSchema.types);

        appSync.createSchema();

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
