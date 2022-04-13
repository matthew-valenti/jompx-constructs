import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
export interface IDataSource {
    [key: string]: appsync.LambdaDataSource;
}
export interface ISchemaType {
    enumTypes: {
        [key: string]: appsync.EnumType;
    };
    inputTypes: {
        [key: string]: appsync.InputType;
    };
    interfaceTypes: {
        [key: string]: appsync.InterfaceType;
    };
    objectTypes: {
        [key: string]: appsync.ObjectType;
    };
    unionTypes: {
        [key: string]: appsync.UnionType;
    };
}
export interface IAppSyncDataSourceLambdaProps {
    timeout: cdk.Duration;
    memorySize: number;
}
