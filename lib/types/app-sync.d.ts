import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { InputType, InterfaceType, ObjectType } from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
export interface IDataSource {
    [key: string]: appsync.LambdaDataSource;
}
export interface ISchemaType {
    [key: string]: ISchemaInputType;
}
export declare type ISchemaInputType = InterfaceType | ObjectType | InputType;
export interface IAppSyncDataSourceLambdaProps {
    timeout: cdk.Duration;
    memorySize: number;
}
