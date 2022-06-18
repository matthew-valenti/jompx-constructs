// eslint-disable-next-line import/no-extraneous-dependencies
import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import type { AppSyncResolverEvent } from 'aws-lambda';

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
    timeout: cdk.Duration.seconds(5),
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

export type IAppSyncResolverEvent = AppSyncResolverEvent<any>

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

/*
// Example IAM identity from AppSync event.
identity: {
    accountId: '066209653567',
    cognitoIdentityAuthProvider: null,
    cognitoIdentityAuthType: null,
    cognitoIdentityId: null,
    cognitoIdentityPoolId: null,
    sourceIp: [ '54.240.230.244' ],
    userArn: 'arn:aws:sts::066209653567:assumed-role/AWSReservedSSO_AdministratorAccess_95acdbc81c844c56/admin',
    username: 'AROAQ62THEM76XQ6TOUPK:admin'
}
// Example Cognito claim from AppSync event.
identity: {
    claims: {
      sub: '428532e3-4eb6-4889-ba94-726ffe0f0d87',
      'cognito:groups': [Array],
      email_verified: true,
      iss: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_1deStgXjc',
      'cognito:username': '428532e3-4eb6-4889-ba94-726ffe0f0d87',
      origin_jti: '5cc99050-08e1-4f50-8c77-076072b871b0',
      aud: '7jjkck35jqn3d9c13k1ht3fibk',
      event_id: 'efd0a5d9-785c-4b4e-8bd9-520e35a1fc63',
      token_use: 'id',
      auth_time: 1652661091,
      exp: 1652664691,
      iat: 1652661091,
      jti: 'b1f71e4b-1fa2-4c1c-b483-fc923acafd34',
      email: 'matthew@jompx.com'
    },
    defaultAuthStrategy: 'DENY',
    groups: [ 'admin' ],
    issuer: 'https://cognito-idp.us-west-2.amazonaws.com/us-west-2_1deStgXjc',
    sourceIp: [ '67.52.160.214' ],
    sub: '428532e3-4eb6-4889-ba94-726ffe0f0d87',
    username: '428532e3-4eb6-4889-ba94-726ffe0f0d87'
}
*/

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


