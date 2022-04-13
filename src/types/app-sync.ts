// eslint-disable-next-line import/no-extraneous-dependencies
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';

export interface IDataSource {
    [key: string]: appsync.LambdaDataSource;
}

// export interface ISchemaType {
//     [key: string]: ISchemaInputType;
// }
// export type ISchemaInputType = InterfaceType | ObjectType | InputType;

// Typescript instanceof produces unpredictable results (e.g. myObjectType instanceof InterfaceType returns true). Use explicit types instead.
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

// TODO: Do we want to use abstract?
// export abstract class AppSyncCustomDirective {
//     abstract operations(directive: string[]): Directive;
// }