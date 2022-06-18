import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { IDataSource, ISchemaTypes, IAppSyncOperationArgs } from './app-sync.types';
/**
 * Cursor Edge Node: https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
 * Support relay or not?
 * https://medium.com/open-graphql/using-relay-with-aws-appsync-55c89ca02066
 * Joins should be connections and named as such. e.g. in post TagsConnection
 * https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo
 * https://graphql-rules.com/rules/list-pagination
 * https://www.apollographql.com/blog/graphql/basics/designing-graphql-mutations/
 * - Mutation: Use top level input type for ags. Use top level property for output type.
 */
export interface IAddMutationArguments {
    /**
     * The name of the mutation as it will appear in the GraphQL schema.
     */
    name: string;
    /**
     * The mutation datasource.
     */
    dataSourceName: string;
    /**
     * Mutation input arguments. These should exactly match the number and order of arguments in the method the mutation will call.
     */
    args: IAppSyncOperationArgs;
    /**
     * The mutation return object type.
     */
    returnType: appsync.ObjectType;
    /**
     * The mutation method to call.
     */
    methodName?: string;
}
export declare class AppSyncSchemaBuilder {
    graphqlApi: appsync.GraphqlApi;
    activeAuthorizationTypes: appsync.AuthorizationType[];
    dataSources: IDataSource;
    schemaTypes: ISchemaTypes;
    constructor(graphqlApi: appsync.GraphqlApi, activeAuthorizationTypes: appsync.AuthorizationType[]);
    addDataSource(id: string, lambdaFunction: cdk.aws_lambda.IFunction, options?: appsync.DataSourceOptions): appsync.LambdaDataSource;
    addSchemaTypes(schemaTypes: ISchemaTypes): void;
    /**
     * Add a mutation to the GraphQL schema.
     * @param name - Name of the mutation as it will appear in the GraphQL schema.
     * @param dataSourceName - Your datasource name e.g. mySql, cognito, post.
     * @param args - Mutation arguments.
     * @param returnType - Mutation retun type (or output type).
     * @param operation - Class method the mutation will call to retun result.
     * @returns - The mutation.
     */
    /**
     * Add a mutation to the GraphQL schema.
     */
    addMutation({ name, dataSourceName, args, returnType, methodName }: IAddMutationArguments): appsync.ObjectType;
    create(): void;
    /**
     * Iterate object type fields and update returnType of JompxGraphqlType.objectType from string type to actual type.
     * Why? AppSync resolvable fields require a data type. But that data type may not already exist yet. For example:
     *   Post object type has field comments and Comment object type has field post. No matter what order these object types are created in, an object type won't exist yet.
     *   If comment is created first, there is no comment object type. If comment is created first, there is no post object type.
     * To work around this chicken or egg limitation, Jompx defines a custom type that allows a string type to be specified. e.g.
     *   JompxGraphqlType.objectType JompxGraphqlType.objectType({ objectTypeName: 'MPost', isList: false }),
     * This method uses the string type to add an actual type.
     *
     * Caution: Changes to AppSync implementation details may break this method.
     */
    private resolveObject;
    /**
     * Resolve an AppSync ResolvableField with a JompxGraphqlType (with string type) to a ResolvableField with a GraphqlType (with an actual type).
     */
    private static resolveResolvableField;
    /**
     * https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
     */
    private addCustomDirectives;
    private addCustomSchema;
}
