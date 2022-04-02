"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncSchema = void 0;
const appsync = require("@aws-cdk/aws-appsync-alpha");
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import pluralize = require('pluralize');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const set = require("set-value");
const directive_1 = require("./directive");
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
class AppSyncSchema {
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
    constructor(graphqlApi, dataSources, schemaTypes) {
        this.graphqlApi = graphqlApi;
        this.dataSources = dataSources;
        this.schemaTypes = schemaTypes;
    }
    /**
     * Create pagination pageInfo types for offset and cursor based pagination.
     *
     * Cursor pagination. Page and sort by unique field. Concatenated fields can result in poor performance.
     * https://relay.dev/graphql/connections.htm#sec-Connection-Types
     * https://shopify.engineering/pagination-relative-cursors
     * https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
     */
    addPageInfoType() {
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
    addSortInput() {
        const sortInput = new appsync.InputType('SortInput', {
            definition: {
                fieldName: appsync.GraphqlType.string({ isRequired: true }),
                direction: appsync.GraphqlType.int({ isRequired: true })
            }
        });
        this.schemaTypes.SortInput = sortInput;
        this.graphqlApi.addType(sortInput);
    }
    create() {
        this.addPageInfoType();
        this.addSortInput();
        Object.values(this.schemaTypes).forEach(schemaType => {
            if (schemaType instanceof appsync.ObjectType) {
                const operations = directive_1.CustomDirective.getArgumentByIdentifier(schemaType.directives, 'operation', 'names');
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
    addFind(objectType) {
        var _a;
        const objectTypeName = objectType.name;
        // const objectTypeNamePlural = pluralize(objectTypeName);
        const paginationType = (_a = directive_1.CustomDirective.getArgumentByIdentifier(objectType === null || objectType === void 0 ? void 0 : objectType.directives, 'pagination', 'type')) !== null && _a !== void 0 ? _a : 'offset';
        const dataSourceName = directive_1.CustomDirective.getArgumentByIdentifier(objectType === null || objectType === void 0 ? void 0 : objectType.directives, 'datasource', 'name');
        if (dataSourceName) {
            const dataSource = this.dataSources[dataSourceName];
            // Edge.
            const edgeObjectType = new appsync.ObjectType(`${objectTypeName}Edge`, {
                definition: {
                    ...(paginationType === 'cursor') && { cursor: appsync.GraphqlType.string({ isRequired: true }) },
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
exports.AppSyncSchema = AppSyncSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsYXNzZXMvYXBwLXN5bmMvc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFzRDtBQUN0RCxpRUFBaUU7QUFDakUsMkNBQTJDO0FBQzNDLGlFQUFpRTtBQUNqRSxpQ0FBa0M7QUFHbEMsMkNBQThEO0FBRTlEOzs7Ozs7R0FNRztBQUVIOzs7Ozs7OztFQVFFO0FBRUYsTUFBYSxhQUFhO0lBRXRCLGtGQUFrRjtJQUNsRiw4REFBOEQ7SUFDOUQsb0NBQW9DO0lBQ3BDLGlDQUFpQztJQUNqQyx1QkFBdUI7SUFDdkIsNkNBQTZDO0lBQzdDLDZFQUE2RTtJQUM3RSxrRkFBa0Y7SUFDbEYsWUFBWTtJQUNaLFVBQVU7SUFFVixZQUNXLFVBQThCLEVBQzlCLFdBQXdCLEVBQ3hCLFdBQXdCO1FBRnhCLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBQzlCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQy9CLENBQUM7SUFFTDs7Ozs7OztPQU9HO0lBQ0ssZUFBZTtRQUVuQixxQkFBcUI7UUFDckIsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFO1lBQzVELFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ25ELEtBQUssRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUN2RDtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNqRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV4QyxxQkFBcUI7UUFDckIsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFO1lBQzVELFVBQVUsRUFBRTtnQkFDUixlQUFlLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ2xFLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztnQkFDOUQsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO2dCQUM3RCxTQUFTLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7YUFDOUQ7U0FDSixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDakQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVEOztPQUVHO0lBQ0ssWUFBWTtRQUNoQixNQUFNLFNBQVMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQ2pELFVBQVUsRUFBRTtnQkFDUixTQUFTLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQzNELFNBQVMsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUMzRDtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUN2QyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRU0sTUFBTTtRQUVULElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ2pELElBQUksVUFBVSxZQUFZLE9BQU8sQ0FBQyxVQUFVLEVBQUU7Z0JBQzFDLE1BQU0sVUFBVSxHQUFHLDJCQUFlLENBQUMsdUJBQXVCLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3hHLElBQUksVUFBVSxFQUFFO29CQUNaLElBQUksVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTt3QkFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzt3QkFDekIsK0JBQStCO3FCQUNsQztpQkFDSjthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ksT0FBTyxDQUFDLFVBQThCOztRQUN6QyxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQ3ZDLDBEQUEwRDtRQUMxRCxNQUFNLGNBQWMsU0FBbUIsMkJBQWUsQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLENBQW1CLG1DQUFJLFFBQVEsQ0FBQztRQUMzSixNQUFNLGNBQWMsR0FBRywyQkFBZSxDQUFDLHVCQUF1QixDQUFDLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTdHLElBQUksY0FBYyxFQUFFO1lBQ2hCLE1BQU0sVUFBVSxHQUE2QixJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRTlFLFFBQVE7WUFDUixNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxjQUFjLE1BQU0sRUFBRTtnQkFDbkUsVUFBVSxFQUFFO29CQUNSLEdBQUcsQ0FBQyxjQUFjLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtvQkFDaEcsSUFBSSxFQUFFLFVBQVUsQ0FBQyxTQUFTLEVBQUU7aUJBQy9CO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFeEMsMkdBQTJHO1lBQzNHLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsY0FBYyxZQUFZLEVBQUU7Z0JBQy9FLFVBQVUsRUFBRTtvQkFDUixLQUFLLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDakQsUUFBUSxFQUFFLGNBQWMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUU7b0JBQ2pJLFVBQVUsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLHlGQUF5RjtpQkFDbEk7YUFDSixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBRTlDLHVCQUF1QjtZQUN2QixNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7WUFDaEIsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFMUUsbUNBQW1DO1lBQ25DLElBQUksY0FBYyxLQUFLLFFBQVEsRUFBRTtnQkFDN0IsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUM3QyxHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDakQ7WUFFRCxtQ0FBbUM7WUFDbkMsSUFBSSxjQUFjLEtBQUssUUFBUSxFQUFFO2dCQUM3QixHQUFHLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQzlDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztnQkFDakQsR0FBRyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUM3QyxHQUFHLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7YUFDckQ7WUFFRCxhQUFhO1lBQ2Isd0ZBQXdGO1lBQ3hGLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsY0FBYyxNQUFNLEVBQUUsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDO2dCQUMxRSxVQUFVLEVBQUUsb0JBQW9CLENBQUMsU0FBUyxFQUFFO2dCQUM1QyxJQUFJO2dCQUNKLFVBQVU7Z0JBQ1YsY0FBYyxFQUFFLEVBQUUsQ0FBQyxnREFBZ0Q7Z0JBQ25FLGtGQUFrRjtnQkFDbEYsd0hBQXdIO2dCQUN4SCxrR0FBa0c7Z0JBQ2xHLCtEQUErRDtnQkFDL0QsZ0RBQWdEO2dCQUNoRCxnRUFBZ0U7Z0JBQ2hFLGlGQUFpRjtnQkFDakYsc0RBQXNEO2dCQUN0RCxLQUFLO2FBQ1IsQ0FBQyxDQUFDLENBQUM7U0FDUDtJQUNMLENBQUM7Q0FDSjtBQTFKRCxzQ0EwSkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuLy8gaW1wb3J0IHBsdXJhbGl6ZSA9IHJlcXVpcmUoJ3BsdXJhbGl6ZScpO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG5pbXBvcnQgc2V0ID0gcmVxdWlyZSgnc2V0LXZhbHVlJyk7XHJcbi8vIGltcG9ydCBnZXQgPSByZXF1aXJlKCdnZXQtdmFsdWUnKTtcclxuaW1wb3J0IHsgSURhdGFTb3VyY2UsIElTY2hlbWFUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMvYXBwLXN5bmMnO1xyXG5pbXBvcnQgeyBDdXN0b21EaXJlY3RpdmUsIFBhZ2luYXRpb25UeXBlIH0gZnJvbSAnLi9kaXJlY3RpdmUnO1xyXG5cclxuLyoqXHJcbiAqIEN1cnNvciBFZGdlIE5vZGU6IGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAqIFN1cHBvcnQgcmVsYXkgb3Igbm90P1xyXG4gKiBodHRwczovL21lZGl1bS5jb20vb3Blbi1ncmFwaHFsL3VzaW5nLXJlbGF5LXdpdGgtYXdzLWFwcHN5bmMtNTVjODljYTAyMDY2XHJcbiAqIEpvaW5zIHNob3VsZCBiZSBjb25uZWN0aW9ucyBhbmQgbmFtZWQgYXMgc3VjaC4gZS5nLiBpbiBwb3N0IFRhZ3NDb25uZWN0aW9uXHJcbiAqIGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy11bmRlZmluZWQuUGFnZUluZm9cclxuICovXHJcblxyXG4vKlxyXG50eXBlIFVzZXJGcmllbmRzQ29ubmVjdGlvbiB7XHJcbiAgcGFnZUluZm86IFBhZ2VJbmZvIVxyXG4gIGVkZ2VzOiBbVXNlckZyaWVuZHNFZGdlXVxyXG59dHlwZSBVc2VyRnJpZW5kc0VkZ2Uge1xyXG4gIGN1cnNvcjogU3RyaW5nIVxyXG4gIG5vZGU6IFVzZXJcclxufVxyXG4qL1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmNTY2hlbWEge1xyXG5cclxuICAgIC8vIEFwcFN5bmMgVlRMIHNuaXBwZXQgdG8gcGFzcyBhbGwgYXZhaWxhYmxlIHBhcmFtcyB0byBMYW1iZGEgZnVuY3Rpb24gZGF0YXNvdXJjZS5cclxuICAgIC8vIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IHBpcGVsaW5lUmVxdWVzdE1hcHBpbmdUZW1wbGF0ZSA9IGB7XHJcbiAgICAvLyAgICAgICAgIFwidmVyc2lvblwiIDogXCIyMDE3LTAyLTI4XCIsXHJcbiAgICAvLyAgICAgICAgIFwib3BlcmF0aW9uXCI6IFwiSW52b2tlXCIsXHJcbiAgICAvLyAgICAgICAgIFwicGF5bG9hZFwiOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBcImNvbnRleHRcIjogJHV0aWwudG9Kc29uKCRjdHgpLFxyXG4gICAgLy8gICAgICAgICAgICAgXCJzZWxlY3Rpb25TZXRMaXN0XCI6ICR1dGlscy50b0pzb24oJGN0eC5pbmZvLnNlbGVjdGlvblNldExpc3QpLFxyXG4gICAgLy8gICAgICAgICAgICAgXCJzZWxlY3Rpb25TZXRHcmFwaFFMXCI6ICR1dGlscy50b0pzb24oJGN0eC5pbmZvLnNlbGVjdGlvblNldEdyYXBoUUwpXHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9YDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgZ3JhcGhxbEFwaTogYXBwc3luYy5HcmFwaHFsQXBpLFxyXG4gICAgICAgIHB1YmxpYyBkYXRhU291cmNlczogSURhdGFTb3VyY2UsXHJcbiAgICAgICAgcHVibGljIHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZVxyXG4gICAgKSB7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwYWdpbmF0aW9uIHBhZ2VJbmZvIHR5cGVzIGZvciBvZmZzZXQgYW5kIGN1cnNvciBiYXNlZCBwYWdpbmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEN1cnNvciBwYWdpbmF0aW9uLiBQYWdlIGFuZCBzb3J0IGJ5IHVuaXF1ZSBmaWVsZC4gQ29uY2F0ZW5hdGVkIGZpZWxkcyBjYW4gcmVzdWx0IGluIHBvb3IgcGVyZm9ybWFuY2UuXHJcbiAgICAgKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtQ29ubmVjdGlvbi1UeXBlc1xyXG4gICAgICogaHR0cHM6Ly9zaG9waWZ5LmVuZ2luZWVyaW5nL3BhZ2luYXRpb24tcmVsYXRpdmUtY3Vyc29yc1xyXG4gICAgICogaHR0cHM6Ly9tZWRpdW0uY29tL3N3bGgvaG93LXRvLWltcGxlbWVudC1jdXJzb3ItcGFnaW5hdGlvbi1saWtlLWEtcHJvLTUxMzE0MGI2NWYzMlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFBhZ2VJbmZvVHlwZSgpIHtcclxuXHJcbiAgICAgICAgLy8gT2Zmc2V0IHBhZ2luYXRpb24uXHJcbiAgICAgICAgY29uc3QgcGFnZUluZm9PZmZzZXQgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb09mZnNldCcsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgc2tpcDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5QYWdlSW5mb09mZnNldCA9IHBhZ2VJbmZvT2Zmc2V0O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHBhZ2VJbmZvT2Zmc2V0KTtcclxuXHJcbiAgICAgICAgLy8gQ3Vyc29yIHBhZ2luYXRpb24uXHJcbiAgICAgICAgY29uc3QgcGFnZUluZm9DdXJzb3IgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb0N1cnNvcicsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgaGFzUHJldmlvdXNQYWdlOiBhcHBzeW5jLkdyYXBocWxUeXBlLmJvb2xlYW4oeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgaGFzTmV4dFBhZ2U6IGFwcHN5bmMuR3JhcGhxbFR5cGUuYm9vbGVhbih7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBzdGFydEN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgZW5kQ3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2NoZW1hVHlwZXMuUGFnZUluZm9DdXJzb3IgPSBwYWdlSW5mb0N1cnNvcjtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShwYWdlSW5mb0N1cnNvcik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgc29ydCBpbnB1dCB0eXBlIGZvciBtdWx0aSBjb2x1bW4gc29ydGluZy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRTb3J0SW5wdXQoKSB7XHJcbiAgICAgICAgY29uc3Qgc29ydElucHV0ID0gbmV3IGFwcHN5bmMuSW5wdXRUeXBlKCdTb3J0SW5wdXQnLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2NoZW1hVHlwZXMuU29ydElucHV0ID0gc29ydElucHV0O1xyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHNvcnRJbnB1dCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSgpIHtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRQYWdlSW5mb1R5cGUoKTtcclxuICAgICAgICB0aGlzLmFkZFNvcnRJbnB1dCgpO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMpLmZvckVhY2goc2NoZW1hVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChzY2hlbWFUeXBlIGluc3RhbmNlb2YgYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKHNjaGVtYVR5cGUuZGlyZWN0aXZlcywgJ29wZXJhdGlvbicsICduYW1lcycpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9ucy5pbmNsdWRlcygnZmluZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRmluZChzY2hlbWFUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT2JqZWN0LnZhbHVlcyhzY2hlbWFUeXBlKVswXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvZXhwbGFpbmluZy1ncmFwaHFsLWNvbm5lY3Rpb25zL1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkRmluZChvYmplY3RUeXBlOiBhcHBzeW5jLk9iamVjdFR5cGUpIHtcclxuICAgICAgICBjb25zdCBvYmplY3RUeXBlTmFtZSA9IG9iamVjdFR5cGUubmFtZTtcclxuICAgICAgICAvLyBjb25zdCBvYmplY3RUeXBlTmFtZVBsdXJhbCA9IHBsdXJhbGl6ZShvYmplY3RUeXBlTmFtZSk7XHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvblR5cGU6IFBhZ2luYXRpb25UeXBlID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKG9iamVjdFR5cGU/LmRpcmVjdGl2ZXMsICdwYWdpbmF0aW9uJywgJ3R5cGUnKSBhcyBQYWdpbmF0aW9uVHlwZSA/PyAnb2Zmc2V0JztcclxuICAgICAgICBjb25zdCBkYXRhU291cmNlTmFtZSA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcihvYmplY3RUeXBlPy5kaXJlY3RpdmVzLCAnZGF0YXNvdXJjZScsICduYW1lJyk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhU291cmNlTmFtZSkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhU291cmNlOiBhcHBzeW5jLkxhbWJkYURhdGFTb3VyY2UgPSB0aGlzLmRhdGFTb3VyY2VzW2RhdGFTb3VyY2VOYW1lXTtcclxuXHJcbiAgICAgICAgICAgIC8vIEVkZ2UuXHJcbiAgICAgICAgICAgIGNvbnN0IGVkZ2VPYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1FZGdlYCwge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLihwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicpICYmIHsgY3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgfSwgLy8gSWYgcGFnaW5hdGlvbiB0eXBlIGN1cnNvciB0aGVuIGluY2x1ZGUgcmVxdWlyZWQgY3Vyc29yIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IG9iamVjdFR5cGUuYXR0cmlidXRlKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGVkZ2VPYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbm5lY3Rpb24uIEJhc2VkIG9uIHJlbGF5IHNwZWNpZmljYXRpb246IGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy1Db25uZWN0aW9uLVR5cGVzXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbm5lY3Rpb25PYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1Db25uZWN0aW9uYCwge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VzOiBlZGdlT2JqZWN0VHlwZS5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUluZm86IHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJyA/IHRoaXMuc2NoZW1hVHlwZXMuUGFnZUluZm9DdXJzb3IuYXR0cmlidXRlKCkgOiB0aGlzLnNjaGVtYVR5cGVzLlBhZ2VJbmZvT2Zmc2V0LmF0dHJpYnV0ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsQ291bnQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkgLy8gQXBvbGxvIHN1Z2dlc3RzIGFkZGluZyBhcyBhIGNvbm5lY3Rpb24gcHJvcGVydHk6IGh0dHBzOi8vZ3JhcGhxbC5vcmcvbGVhcm4vcGFnaW5hdGlvbi9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGNvbm5lY3Rpb25PYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBxdWVyeSBhcmd1bWVudHMuXHJcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSB7fTtcclxuICAgICAgICAgICAgc2V0KGFyZ3MsICdmaWx0ZXInLCBhcHBzeW5jLkdyYXBocWxUeXBlLmF3c0pzb24oKSk7XHJcbiAgICAgICAgICAgIHNldChhcmdzLCAnc29ydCcsIHRoaXMuc2NoZW1hVHlwZXMuU29ydElucHV0LmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdvZmZzZXQnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ3NraXAnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnbGltaXQnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIG9mZnNldCBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuICAgICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJykge1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdmaXJzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdhZnRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdsYXN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2JlZm9yZScsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgcXVlcnkuXHJcbiAgICAgICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgZmluZCR7b2JqZWN0VHlwZU5hbWVQbHVyYWx9YCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGAke29iamVjdFR5cGVOYW1lfUZpbmRgLCBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogY29ubmVjdGlvbk9iamVjdFR5cGUuYXR0cmlidXRlKCksXHJcbiAgICAgICAgICAgICAgICBhcmdzLFxyXG4gICAgICAgICAgICAgICAgZGF0YVNvdXJjZSxcclxuICAgICAgICAgICAgICAgIHBpcGVsaW5lQ29uZmlnOiBbXSAvLyBUT0RPOiBBZGQgYXV0aG9yaXphdGlvbiBMYW1iZGEgZnVuY3Rpb24gaGVyZS5cclxuICAgICAgICAgICAgICAgIC8vIFVzZSB0aGUgcmVxdWVzdCBtYXBwaW5nIHRvIGluamVjdCBzdGFzaCB2YXJpYWJsZXMgKGZvciB1c2UgaW4gTGFtYmRhIGZ1bmN0aW9uKS5cclxuICAgICAgICAgICAgICAgIC8vIEluIHRoZW9yeSwgd2UgY291bGQgdXNlIGEgTGFtYmRhIGZ1bmN0aW9uIGluc3RlYWQgb2YgVlRMIGJ1dCB0aGlzIHNob3VsZCBiZSBtdWNoIGZhc3RlciB0aGFuIGludm9raW5nIGFub3RoZXIgTGFtYmRhLlxyXG4gICAgICAgICAgICAgICAgLy8gQ2F1dGlvbjogcGF5bG9hZCBzaG91bGQgbWltaWMgTGFtYmRhIHJlc29sdmVyIChubyBWVEwpLiBUaGlzIHN5bnRheCBjb3VsZCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cclxuICAgICAgICAgICAgICAgIC8vIHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IGFwcHN5bmMuTWFwcGluZ1RlbXBsYXRlLmZyb21TdHJpbmcoYFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwibWV0aG9kXCIsIFwiZ2V0XCIpKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwidHlwZU5hbWVcIiwgXCIke29iamVjdFR5cGVOYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgIC8vICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcInJldHVyblR5cGVOYW1lXCIsIFwiJHtjb25uZWN0aW9uT2JqZWN0VHlwZS5uYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgIC8vICAgICAke0FwcFN5bmNTY2hlbWEucGlwZWxpbmVSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlfVxyXG4gICAgICAgICAgICAgICAgLy8gYClcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==