// eslint-disable-next-line import/no-extraneous-dependencies
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export interface IDataSource {
    [key: string]: appsync.LambdaDataSource;
}

// export interface ISchemaTypes {
//     [key: string]: ISchemaInputType;
// }
// export type ISchemaInputType = InterfaceType | ObjectType | InputType;

// Typescript instanceof produces unpredictable results due to use of extends (e.g. myObjectType instanceof InterfaceType returns true). Use explicit types instead.
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

export const AppSyncLambdaDefaultProps: cdk.aws_lambda_nodejs.NodejsFunctionProps = {
    runtime: lambda.Runtime.NODEJS_14_X,
    timeout: cdk.Duration.seconds(8),
    bundling: {
        minify: true,
        sourceMap: true
    }
};

/*
export interface AppSyncResolverEvent<TArguments, TSource = Record<string, any> | null> {
    arguments: TArguments;
    identity?: AppSyncIdentity;
    source: TSource;
    request: {
        headers: AppSyncResolverEventHeaders;
    };
    info: {
        selectionSetList: string[];
        selectionSetGraphQL: string;
        parentTypeName: string;
        fieldName: string;
        variables: { [key: string]: any };
    };
    prev: { result: { [key: string]: any } } | null;
    stash: { [key: string]: any };
}
*/

// TODO: Currently a copy of AppSyncResolverEvent CDK v1. Replace with v2 when available or cleanup types.
export interface IAppSyncResolverEvent {
    arguments: any;
    identity: any;
    source: any;
    request: any;
    info: any;
    prev: any;
    stash: { [key: string]: any };
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

// List of nested IFields.
export interface AppSyncIFields {
    [key: string]: AppSyncIFields | appsync.IField;
}

// AppSync VTL snippet to pass event params to Lambda resolver: https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-programming-guide.html
// With no VTL, the Lambda event contains all properties below. However, selectionSetList is a child property of info.
// Thru trial and error there doesn't appear to be a way to add selectionSetList as a child property.
// We need VTL because this is the only known way to pass variables directly into the Lambda.
// However, when we specify any VTL we must specify all VTL. Adding data to the stash property results in an empty Lambda event.
// Stash variables can be added by appending additional VTL above this payload statement. i.e. $util.qr($ctx.stash.put("key", "value"))
// This VTL invokes a payload property which simply returns an object with properties (taken from the AppSync $context variable).
// Caution: payload should mimic a standard Lambda resolver (with no VTL). This object might change in the future.
// In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
export const DefaultRequestMappingTemplate = `{
    "version" : "2018-05-29",
    "operation": "Invoke",
    "payload": {
        "arguments": $utils.toJson($context.arguments),
        "identity": $utils.toJson($context.identity),
        "source": $utils.toJson($context.source),
        "request": $utils.toJson($context.request),
        "prev": $utils.toJson($context.prev),
        "info": $utils.toJson($context.info),
        "stash": $utils.toJson($context.stash),
        "selectionSetList": $utils.toJson($context.info.selectionSetList)
    }
}`;
