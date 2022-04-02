import * as appsync from '@aws-cdk/aws-appsync-alpha';
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import pluralize = require('pluralize');
// eslint-disable-next-line @typescript-eslint/no-require-imports
import set = require('set-value');
// import get = require('get-value');
import { IDataSource, ISchemaType } from '../../types/app-sync';
import { CustomDirective, PaginationType } from './directive';

/**
 * Cursor Edge Node: https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
 * Support relay or not?
 * https://medium.com/open-graphql/using-relay-with-aws-appsync-55c89ca02066
 * Joins should be connections and named as such. e.g. in post TagsConnection
 * https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo
 */

/*
type UserFriendsConnection {
  pageInfo: PageInfo!
  edges: [UserFriendsEdge]
}type UserFriendsEdge {
  cursor: String!
  node: User
}
*/

export class AppSyncSchema {

    // AppSync VTL snippet to pass all available params to Lambda function datasource.
    // private static readonly pipelineRequestMappingTemplate = `{
    //         "version" : "2017-02-28",
    //         "operation": "Invoke",
    //         "payload": {
    //             "context": $util.toJson($ctx),
    //             "selectionSetList": $utils.toJson($ctx.info.selectionSetList),
    //             "selectionSetGraphQL": $utils.toJson($ctx.info.selectionSetGraphQL)
    //         }
    //     }`;

    constructor(
        public graphqlApi: appsync.GraphqlApi,
        public dataSources: IDataSource,
        public schemaTypes: ISchemaType
    ) { }

    /**
     * Create pagination pageInfo types for offset and cursor based pagination.
     *
     * Cursor pagination. Page and sort by unique field. Concatenated fields can result in poor performance.
     * https://relay.dev/graphql/connections.htm#sec-Connection-Types
     * https://shopify.engineering/pagination-relative-cursors
     * https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
     */
    private addPageInfoType() {

        // Offset pagination.
        const pageInfoOffset = new appsync.ObjectType('PageInfoOffset', {
            definition: {
                skip: appsync.GraphqlType.int({ isRequired: true }),
                limit: appsync.GraphqlType.int({ isRequired: true })
            }
        });
        this.schemaTypes.PageInfoOffset = pageInfoOffset;
        this.graphqlApi.addType(pageInfoOffset);

        // Cursor pagination.
        const pageInfoCursor = new appsync.ObjectType('PageInfoCursor', {
            definition: {
                hasPreviousPage: appsync.GraphqlType.boolean({ isRequired: true }),
                hasNextPage: appsync.GraphqlType.boolean({ isRequired: true }),
                startCursor: appsync.GraphqlType.string({ isRequired: true }),
                endCursor: appsync.GraphqlType.string({ isRequired: true })
            }
        });
        this.schemaTypes.PageInfoCursor = pageInfoCursor;
        this.graphqlApi.addType(pageInfoCursor);
    }

    /**
     * Add sort input type for multi column sorting.
     */
    private addSortInput() {
        const sortInput = new appsync.InputType('SortInput', {
            definition: {
                fieldName: appsync.GraphqlType.string({ isRequired: true }),
                direction: appsync.GraphqlType.int({ isRequired: true })
            }
        });
        this.schemaTypes.SortInput = sortInput;
        this.graphqlApi.addType(sortInput);
    }

    public create() {

        this.addPageInfoType();
        this.addSortInput();

        Object.values(this.schemaTypes).forEach(schemaType => {
            if (schemaType instanceof appsync.ObjectType) {
                const operations = CustomDirective.getArgumentByIdentifier(schemaType.directives, 'operation', 'names');
                if (operations) {
                    if (operations.includes('find')) {
                        this.addFind(schemaType);
                        // Object.values(schemaType)[0]
                    }
                }
            }
        });
    }

    /**
     * 
     * https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
     */
    public addFind(objectType: appsync.ObjectType) {
        const objectTypeName = objectType.name;
        // const objectTypeNamePlural = pluralize(objectTypeName);
        const paginationType: PaginationType = CustomDirective.getArgumentByIdentifier(objectType?.directives, 'pagination', 'type') as PaginationType ?? 'offset';
        const dataSourceName = CustomDirective.getArgumentByIdentifier(objectType?.directives, 'datasource', 'name');

        if (dataSourceName) {
            const dataSource: appsync.LambdaDataSource = this.dataSources[dataSourceName];

            // Edge.
            const edgeObjectType = new appsync.ObjectType(`${objectTypeName}Edge`, {
                definition: {
                    ...(paginationType === 'cursor') && { cursor: appsync.GraphqlType.string({ isRequired: true }) }, // If pagination type cursor then include required cursor property.
                    node: objectType.attribute()
                }
            });
            this.graphqlApi.addType(edgeObjectType);

            // Connection. Based on relay specification: https://relay.dev/graphql/connections.htm#sec-Connection-Types
            const connectionObjectType = new appsync.ObjectType(`${objectTypeName}Connection`, {
                definition: {
                    edges: edgeObjectType.attribute({ isList: true }),
                    pageInfo: paginationType === 'cursor' ? this.schemaTypes.PageInfoCursor.attribute() : this.schemaTypes.PageInfoOffset.attribute(),
                    totalCount: appsync.GraphqlType.int() // Apollo suggests adding as a connection property: https://graphql.org/learn/pagination/
                }
            });
            this.graphqlApi.addType(connectionObjectType);

            // Add query arguments.
            const args = {};
            set(args, 'filter', appsync.GraphqlType.awsJson());
            set(args, 'sort', this.schemaTypes.SortInput.attribute({ isList: true }));

            // Add offset pagination arguments.
            if (paginationType === 'offset') {
                set(args, 'skip', appsync.GraphqlType.int());
                set(args, 'limit', appsync.GraphqlType.int());
            }

            // Add offset pagination arguments.
            if (paginationType === 'cursor') {
                set(args, 'first', appsync.GraphqlType.int());
                set(args, 'after', appsync.GraphqlType.string());
                set(args, 'last', appsync.GraphqlType.int());
                set(args, 'before', appsync.GraphqlType.string());
            }

            // Add query.
            // this.graphqlApi.addQuery(`find${objectTypeNamePlural}`, new appsync.ResolvableField({
            this.graphqlApi.addQuery(`${objectTypeName}Find`, new appsync.ResolvableField({
                returnType: connectionObjectType.attribute(),
                args,
                dataSource,
                pipelineConfig: [] // TODO: Add authorization Lambda function here.
                // Use the request mapping to inject stash variables (for use in Lambda function).
                // In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
                // Caution: payload should mimic Lambda resolver (no VTL). This syntax could change in the future.
                // requestMappingTemplate: appsync.MappingTemplate.fromString(`
                //     $util.qr($ctx.stash.put("method", "get"))
                //     $util.qr($ctx.stash.put("typeName", "${objectTypeName}"))
                //     $util.qr($ctx.stash.put("returnTypeName", "${connectionObjectType.name}"))
                //     ${AppSyncSchema.pipelineRequestMappingTemplate}
                // `)
            }));
        }
    }
}