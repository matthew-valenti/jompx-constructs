import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
import { IDataSource, ISchemaTypes, IAppSyncOperationFields } from './app-sync.types';
/**
 * GraphQL Spec: https://spec.graphql.org/. Mostly for the backend but good to know about.
 * Cursor Edge Node: https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
 * Support relay or not?
 * https://medium.com/open-graphql/using-relay-with-aws-appsync-55c89ca02066
 * Joins should be connections and named as such. e.g. in post TagsConnection
 * https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo
 * https://graphql-rules.com/rules/list-pagination
 * https://www.apollographql.com/blog/graphql/basics/designing-graphql-mutations/
 * - Mutation: Use top level input type for ags. Use top level property for output type.
 */
export interface IAddMutationArgs {
    /**
     * The name of the mutation as it will appear in the GraphQL schema.
     */
    name: string;
    /**
     * The mutation datasource.
     */
    dataSourceName: string;
    /**
     * Mutation input (arguments wrapped in an input property).
     */
    input: appsync.InputType | IAppSyncOperationFields;
    /**
     * Mutation output (return value).
     */
    output: appsync.ObjectType | IAppSyncOperationFields;
    /**
     * List of auth rules to apply to the mutation and output type.
     */
    auth: appsync.Directive;
    /**
     * The class method to call on request mutation.
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
     * Wrap input in input type and output in output type.
     * https://graphql-rules.com/rules/mutation-payload
     * @returns - The created AppSync mutation object type.
     */
    addMutation({ name, dataSourceName, input, output, auth, methodName }: IAddMutationArgs): appsync.ObjectType;
    /**
     * Iterate a list or nested list of AppSync fields and create input type(s).
     * GraphQL doesn't support nested types so create a type for each nested type recursively.
     * Types are added to the graphqlApi.
     * @param name - Create an input type with this name and an "Input" suffix.
     * @param operationFields - list of fields or nested list of AppSync fields e.g.
     * {
     *     number1: GraphqlType.int(),
     *     number2: GraphqlType.int(),
     *     test: {
     *         number1: GraphqlType.int(),
     *         number2: GraphqlType.int(),
     *     }
     * };
     * @returns - An AppSync input type (with references to nested types if any).
     */
    addOperationInputs(name: string, operationFields: IAppSyncOperationFields, suffix?: string): appsync.InputType;
    /**
     * Iterate a list or nested list of AppSync fields and create output type(s).
     * GraphQL doesn't support nested types so create a type for each nested type recursively.
     * Types are added to the graphqlApi.
     * @param name - Create an output type with this name and an "Output" suffix.
     * @param operationFields - list of fields or nested list of AppSync fields e.g.
     * {
     *     number1: GraphqlType.int(),
     *     number2: GraphqlType.int(),
     *     test: {
     *         number1: GraphqlType.int(),
     *         number2: GraphqlType.int(),
     *     }
     * };
     * @returns - An AppSync input type (with references to nested types if any).
     */
    addOperationOutputs(name: string, operationFields: IAppSyncOperationFields, directives: appsync.Directive[], suffix?: string): appsync.ObjectType;
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
    /**
     * InputType type guard.
     * @param o - Object to test.
     * @returns - true if object is of type InputType (i.e. has definition property).
     */
    private isInputType;
    /**
     * ObjectType type guard.
     * @param o - Object to test.
     * @returns - true if object is of type ObjectType (i.e. has interfaceTypes property).
     */
    private isObjectType;
}
