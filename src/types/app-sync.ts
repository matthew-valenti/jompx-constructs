// eslint-disable-next-line import/no-extraneous-dependencies
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { InputType, InterfaceType, ObjectType } from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';

export interface IDataSource {
    [key: string]: appsync.LambdaDataSource;
}

export interface ISchemaType {
    [key: string]: ISchemaInputType;
}

export type ISchemaInputType = InterfaceType | ObjectType | InputType;

export interface IAppSyncDataSourceLambdaProps {
    timeout: cdk.Duration;
    memorySize: number;
}

// TODO: Do we want to use abstract?
// export abstract class AppSyncCustomDirective {
//     abstract operations(directive: string[]): Directive;
// }