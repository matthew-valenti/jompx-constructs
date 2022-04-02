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
    constructor(graphqlApi: appsync.GraphqlApi, dataSources: IDataSource, schemaTypes: ISchemaType);
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
    create(): void;
    /**
     *
     * https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
     */
    addFind(objectType: appsync.ObjectType): void;
}
