import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import type { AppSyncResolverEvent } from 'aws-lambda';
export interface IDataSource {
    [key: string]: appsync.LambdaDataSource;
}
export interface ISchemaTypes {
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
export declare const AppSyncLambdaDefaultProps: cdk.aws_lambda_nodejs.NodejsFunctionProps;
export declare type IAppSyncResolverEvent = AppSyncResolverEvent<any>;
export interface IAppSyncOperationFields {
    [key: string]: appsync.GraphqlType | IAppSyncOperationFields;
}
export interface IAppSyncConnection {
    edges?: [{
        cursor?: string;
        node: any;
    }];
    pageInfo: IAppSyncPageInfoOffset | IAppSyncPageInfoCursor;
    totalCount?: number;
}
export interface IAppSyncPageInfoOffset {
    skip: number;
    limit: number;
}
export interface IAppSyncPageInfoCursor {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
}
export interface AppSyncIFields {
    [key: string]: AppSyncIFields | appsync.IField;
}
export interface IAppSyncMethodPropsCognito {
    sub: string;
    email: string;
    groups: string[];
    authorization: string;
}
export interface IAppSyncMethodProps {
    cognito?: IAppSyncMethodPropsCognito;
    event: any;
}
declare const paginationType: string[];
export declare type IAppSyncPaginationType = typeof paginationType[number];
export {};
