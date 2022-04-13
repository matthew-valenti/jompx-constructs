import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { IDataSource, ISchemaType } from '../../types/app-sync';
/**
 * Cursor Edge Node: https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
 * Support relay or not?
 * https://medium.com/open-graphql/using-relay-with-aws-appsync-55c89ca02066
 * Joins should be connections and named as such. e.g. in post TagsConnection
 * https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo
 */
export declare class AppSyncSchema {
    graphqlApi: appsync.GraphqlApi;
    dataSources: IDataSource;
    schemaTypes: ISchemaType;
    private static readonly pipelineRequestMappingTemplate;
    constructor(graphqlApi: appsync.GraphqlApi, dataSources: IDataSource, schemaTypes: ISchemaType);
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
    private addFind;
    /**
     * Create pagination pageInfo types for offset and cursor based pagination.
     *
     * Cursor pagination. Page and sort by unique field. Concatenated fields can result in poor performance.
     * https://relay.dev/graphql/connections.htm#sec-Connection-Types
     * https://shopify.engineering/pagination-relative-cursors
     * https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
     */
    private addPageInfoType;
    /**
     * Add sort input type for multi column sorting.
     */
    private addSortInput;
    private operationNameFromType;
}
