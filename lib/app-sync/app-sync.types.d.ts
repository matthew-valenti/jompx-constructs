import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
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
export interface IAppSyncResolverEvent {
    arguments: any;
    identity: any;
    source: any;
    request: any;
    info: any;
    prev: any;
    stash: {
        [key: string]: any;
    };
    selectionSetList: string[];
}
export interface IAppSyncOperationArgs {
    [key: string]: appsync.GraphqlType;
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
export declare const DefaultRequestMappingTemplate = "{\n    \"version\" : \"2018-05-29\",\n    \"operation\": \"Invoke\",\n    \"payload\": {\n        \"arguments\": $utils.toJson($context.arguments),\n        \"identity\": $utils.toJson($context.identity),\n        \"source\": $utils.toJson($context.source),\n        \"request\": $utils.toJson($context.request),\n        \"prev\": $utils.toJson($context.prev),\n        \"info\": $utils.toJson($context.info),\n        \"stash\": $utils.toJson($context.stash),\n        \"selectionSetList\": $utils.toJson($context.info.selectionSetList)\n    }\n}";
