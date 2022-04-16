"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncSchema = void 0;
const appsync = require("@aws-cdk/aws-appsync-alpha");
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import pluralize = require('pluralize');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const set = require("set-value");
// import get = require('get-value');
const app_sync_types_1 = require("./app-sync.types");
const custom_directive_1 = require("./custom-directive");
const graphql_type_1 = require("./graphql-type");
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
    constructor(graphqlApi, dataSources, schemaTypes) {
        this.graphqlApi = graphqlApi;
        this.dataSources = dataSources;
        this.schemaTypes = schemaTypes;
    }
    create() {
        appsync.EnumType;
        appsync.UnionType;
        this.addPageInfoType();
        this.addSortInput();
        Object.values(this.schemaTypes.enumTypes).forEach(enumType => {
            this.graphqlApi.addType(enumType);
        });
        Object.values(this.schemaTypes.inputTypes).forEach(inputType => {
            this.graphqlApi.addType(inputType);
        });
        Object.values(this.schemaTypes.interfaceTypes).forEach(interfaceType => {
            this.graphqlApi.addType(interfaceType);
        });
        Object.values(this.schemaTypes.objectTypes).forEach(objectType => {
            this.resolveObject(objectType);
            // Add type to GraphQL.
            this.graphqlApi.addType(objectType);
            const operations = custom_directive_1.CustomDirective.getArgumentByIdentifier('operation', 'names', objectType.directives);
            if (operations) {
                if (operations.includes('find')) {
                    this.addFind(objectType);
                }
            }
        });
        Object.values(this.schemaTypes.unionTypes).forEach(unionType => {
            this.graphqlApi.addType(unionType);
        });
    }
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
    resolveObject(objectType) {
        // Iterate object type fields.
        Object.entries(objectType.definition).forEach(([key, value]) => {
            var _a;
            // If field of JompxGraphqlType type (then use string type to add actual type).
            if (((_a = value.fieldOptions) === null || _a === void 0 ? void 0 : _a.returnType) instanceof graphql_type_1.JompxGraphqlType) {
                // Replace the "old" field with the new "field".
                objectType.definition[key] = AppSyncSchema.resolveResolvableField(this.schemaTypes, value);
            }
        });
    }
    /**
     * Resolve an AppSync ResolvableField with a JompxGraphqlType (with string type) to a ResolvableField with a GraphqlType (with an actual type).
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    static resolveResolvableField(schemaTypes, resolvableField) {
        var _a;
        let rv = resolvableField;
        if (((_a = resolvableField.fieldOptions) === null || _a === void 0 ? void 0 : _a.returnType) instanceof graphql_type_1.JompxGraphqlType) {
            // Create a new GraphQL datatype with actual type.
            const newGraphqlType = resolvableField.fieldOptions.returnType.resolve(schemaTypes);
            // Update existing resolvable field options "old" GraphQL datatype with "new" GraphQL datatype.
            set(resolvableField.fieldOptions, 'returnType', newGraphqlType);
            // Create new resolvable field with modified resolvable field options.
            rv = new appsync.ResolvableField(resolvableField.fieldOptions);
        }
        return rv;
    }
    /**
     * https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
     */
    addFind(objectType) {
        var _a;
        const objectTypeName = objectType.name;
        const paginationType = (_a = custom_directive_1.CustomDirective.getArgumentByIdentifier('pagination', 'type', objectType === null || objectType === void 0 ? void 0 : objectType.directives)) !== null && _a !== void 0 ? _a : 'offset';
        const dataSourceName = custom_directive_1.CustomDirective.getArgumentByIdentifier('datasource', 'name', objectType === null || objectType === void 0 ? void 0 : objectType.directives);
        if (dataSourceName
            && this.schemaTypes.objectTypes.PageInfoCursor
            && this.schemaTypes.objectTypes.PageInfoOffset
            && this.schemaTypes.inputTypes.SortInput) {
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
                    pageInfo: paginationType === 'cursor' ? this.schemaTypes.objectTypes.PageInfoCursor.attribute({ isRequired: true }) : this.schemaTypes.objectTypes.PageInfoOffset.attribute({ isRequired: true }),
                    totalCount: appsync.GraphqlType.int() // Apollo suggests adding as a connection property: https://graphql.org/learn/pagination/
                }
            });
            this.graphqlApi.addType(connectionObjectType);
            // Add default query arguments.
            const args = {};
            // Add filter argument.
            set(args, 'filter', appsync.GraphqlType.awsJson());
            // Add sort argument.
            set(args, 'sort', this.schemaTypes.inputTypes.SortInput.attribute({ isList: true }));
            // Add offset pagination arguments.
            if (paginationType === 'offset') {
                set(args, 'skip', appsync.GraphqlType.int());
                set(args, 'limit', appsync.GraphqlType.int());
            }
            // Add cursor pagination arguments.
            if (paginationType === 'cursor') {
                set(args, 'first', appsync.GraphqlType.int());
                set(args, 'after', appsync.GraphqlType.string());
                set(args, 'last', appsync.GraphqlType.int());
                set(args, 'before', appsync.GraphqlType.string());
            }
            // Add query.
            // this.graphqlApi.addQuery(`find${objectTypeNamePlural}`, new appsync.ResolvableField({
            this.graphqlApi.addQuery(`${this.operationNameFromType(objectTypeName)}Find`, new appsync.ResolvableField({
                returnType: connectionObjectType.attribute(),
                args,
                dataSource,
                // pipelineConfig: [], // TODO: Add authorization Lambda function here.
                // Use the request mapping to inject stash variables (for use in Lambda function).
                requestMappingTemplate: appsync.MappingTemplate.fromString(`
                    $util.qr($ctx.stash.put("operation", "find"))
                    $util.qr($ctx.stash.put("objectTypeName", "${objectTypeName}"))
                    $util.qr($ctx.stash.put("returnTypeName", "${connectionObjectType.name}"))
                    ${app_sync_types_1.DefaultRequestMappingTemplate}
                `)
            }));
        }
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
        this.schemaTypes.objectTypes.PageInfoOffset = pageInfoOffset;
        // Cursor pagination.
        const pageInfoCursor = new appsync.ObjectType('PageInfoCursor', {
            definition: {
                hasPreviousPage: appsync.GraphqlType.boolean({ isRequired: true }),
                hasNextPage: appsync.GraphqlType.boolean({ isRequired: true }),
                startCursor: appsync.GraphqlType.string({ isRequired: true }),
                endCursor: appsync.GraphqlType.string({ isRequired: true })
            }
        });
        this.schemaTypes.objectTypes.PageInfoCursor = pageInfoCursor;
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
        this.schemaTypes.inputTypes.SortInput = sortInput;
    }
    // e.g. MPost > mpost, MySqlPost > mySqlPost, MyPost > myPost
    operationNameFromType(s) {
        return s.charAt(0).toLocaleLowerCase() + s.charAt(1).toLocaleLowerCase() + s.slice(2);
    }
}
exports.AppSyncSchema = AppSyncSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hIG9sZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAtc3luYy9zY2hlbWEgb2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFzRDtBQUV0RCxpRUFBaUU7QUFDakUsMkNBQTJDO0FBQzNDLGlFQUFpRTtBQUNqRSxpQ0FBa0M7QUFDbEMscUNBQXFDO0FBQ3JDLHFEQUE0RjtBQUM1Rix5REFBcUU7QUFDckUsaURBQWtEO0FBRWxEOzs7Ozs7R0FNRztBQUVIOzs7Ozs7OztFQVFFO0FBRUYsTUFBYSxhQUFhO0lBRXRCLFlBQ1csVUFBOEIsRUFDOUIsV0FBd0IsRUFDeEIsV0FBeUI7UUFGekIsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFDOUIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWM7SUFDaEMsQ0FBQztJQUVFLE1BQU07UUFFVCxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ2pCLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFFbEIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUVwQixNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3pELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMzRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDbkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBRTdELElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7WUFFL0IsdUJBQXVCO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXBDLE1BQU0sVUFBVSxHQUFHLGtDQUFlLENBQUMsdUJBQXVCLENBQUMsV0FBVyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEcsSUFBSSxVQUFVLEVBQUU7Z0JBQ1osSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lCQUM1QjthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzNELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7Ozs7O09BVUc7SUFDSyxhQUFhLENBQUMsVUFBOEI7UUFFaEQsOEJBQThCO1FBQzlCLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUU7O1lBQzNELCtFQUErRTtZQUMvRSxJQUFJLE9BQUEsS0FBSyxDQUFDLFlBQVksMENBQUUsVUFBVSxhQUFZLCtCQUFnQixFQUFFO2dCQUM1RCxnREFBZ0Q7Z0JBQ2hELFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDOUY7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7T0FFRztJQUNILDhEQUE4RDtJQUN0RCxNQUFNLENBQUMsc0JBQXNCLENBQUMsV0FBeUIsRUFBRSxlQUF3Qzs7UUFFckcsSUFBSSxFQUFFLEdBQUcsZUFBZSxDQUFDO1FBRXpCLElBQUksT0FBQSxlQUFlLENBQUMsWUFBWSwwQ0FBRSxVQUFVLGFBQVksK0JBQWdCLEVBQUU7WUFDdEUsa0RBQWtEO1lBQ2xELE1BQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNwRiwrRkFBK0Y7WUFDL0YsR0FBRyxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2hFLHNFQUFzRTtZQUN0RSxFQUFFLEdBQUcsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNsRTtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVEOztPQUVHO0lBQ0ssT0FBTyxDQUFDLFVBQThCOztRQUUxQyxNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO1FBQ3ZDLE1BQU0sY0FBYyxTQUFtQixrQ0FBZSxDQUFDLHVCQUF1QixDQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsVUFBVSxhQUFWLFVBQVUsdUJBQVYsVUFBVSxDQUFFLFVBQVUsQ0FBbUIsbUNBQUksUUFBUSxDQUFDO1FBQzNKLE1BQU0sY0FBYyxHQUFHLGtDQUFlLENBQUMsdUJBQXVCLENBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsVUFBVSxDQUFDLENBQUM7UUFFN0csSUFBSSxjQUFjO2VBQ1gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsY0FBYztlQUMzQyxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxjQUFjO2VBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFDMUM7WUFDRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBRXBELFFBQVE7WUFDUixNQUFNLGNBQWMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxjQUFjLE1BQU0sRUFBRTtnQkFDbkUsVUFBVSxFQUFFO29CQUNSLEdBQUcsQ0FBQyxjQUFjLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRTtvQkFDaEcsSUFBSSxFQUFFLFVBQVUsQ0FBQyxTQUFTLEVBQUU7aUJBQy9CO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFeEMsMkdBQTJHO1lBQzNHLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsY0FBYyxZQUFZLEVBQUU7Z0JBQy9FLFVBQVUsRUFBRTtvQkFDUixLQUFLLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDakQsUUFBUSxFQUFFLGNBQWMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDak0sVUFBVSxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMseUZBQXlGO2lCQUNsSTthQUNKLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFFOUMsK0JBQStCO1lBQy9CLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUVoQix1QkFBdUI7WUFDdkIsR0FBRyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBRW5ELHFCQUFxQjtZQUNyQixHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVyRixtQ0FBbUM7WUFDbkMsSUFBSSxjQUFjLEtBQUssUUFBUSxFQUFFO2dCQUM3QixHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQzdDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQzthQUNqRDtZQUVELG1DQUFtQztZQUNuQyxJQUFJLGNBQWMsS0FBSyxRQUFRLEVBQUU7Z0JBQzdCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztnQkFDOUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRCxHQUFHLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQzdDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzthQUNyRDtZQUVELGFBQWE7WUFDYix3RkFBd0Y7WUFDeEYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxJQUFJLE9BQU8sQ0FBQyxlQUFlLENBQUM7Z0JBQ3RHLFVBQVUsRUFBRSxvQkFBb0IsQ0FBQyxTQUFTLEVBQUU7Z0JBQzVDLElBQUk7Z0JBQ0osVUFBVTtnQkFDVix1RUFBdUU7Z0JBQ3ZFLGtGQUFrRjtnQkFDbEYsc0JBQXNCLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUM7O2lFQUVWLGNBQWM7aUVBQ2Qsb0JBQW9CLENBQUMsSUFBSTtzQkFDcEUsOENBQTZCO2lCQUNsQyxDQUFDO2FBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDUDtJQUNMLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ssZUFBZTtRQUVuQixxQkFBcUI7UUFDckIsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFO1lBQzVELFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ25ELEtBQUssRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUN2RDtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFFN0QscUJBQXFCO1FBQ3JCLE1BQU0sY0FBYyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRTtZQUM1RCxVQUFVLEVBQUU7Z0JBQ1IsZUFBZSxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO2dCQUNsRSxXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQzlELFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztnQkFDN0QsU0FBUyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQzlEO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7O09BRUc7SUFDSyxZQUFZO1FBRWhCLE1BQU0sU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7WUFDakQsVUFBVSxFQUFFO2dCQUNSLFNBQVMsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztnQkFDM0QsU0FBUyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQzNEO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsNkRBQTZEO0lBQ3JELHFCQUFxQixDQUFDLENBQVM7UUFDbkMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUYsQ0FBQztDQUNKO0FBeE5ELHNDQXdOQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgeyBSZXNvbHZhYmxlRmllbGQgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbi8vIGltcG9ydCBwbHVyYWxpemUgPSByZXF1aXJlKCdwbHVyYWxpemUnKTtcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuaW1wb3J0IHNldCA9IHJlcXVpcmUoJ3NldC12YWx1ZScpO1xyXG4vLyBpbXBvcnQgZ2V0ID0gcmVxdWlyZSgnZ2V0LXZhbHVlJyk7XHJcbmltcG9ydCB7IElEYXRhU291cmNlLCBJU2NoZW1hVHlwZXMsIERlZmF1bHRSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlIH0gZnJvbSAnLi9hcHAtc3luYy50eXBlcyc7XHJcbmltcG9ydCB7IEN1c3RvbURpcmVjdGl2ZSwgUGFnaW5hdGlvblR5cGUgfSBmcm9tICcuL2N1c3RvbS1kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBKb21weEdyYXBocWxUeXBlIH0gZnJvbSAnLi9ncmFwaHFsLXR5cGUnO1xyXG5cclxuLyoqXHJcbiAqIEN1cnNvciBFZGdlIE5vZGU6IGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAqIFN1cHBvcnQgcmVsYXkgb3Igbm90P1xyXG4gKiBodHRwczovL21lZGl1bS5jb20vb3Blbi1ncmFwaHFsL3VzaW5nLXJlbGF5LXdpdGgtYXdzLWFwcHN5bmMtNTVjODljYTAyMDY2XHJcbiAqIEpvaW5zIHNob3VsZCBiZSBjb25uZWN0aW9ucyBhbmQgbmFtZWQgYXMgc3VjaC4gZS5nLiBpbiBwb3N0IFRhZ3NDb25uZWN0aW9uXHJcbiAqIGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy11bmRlZmluZWQuUGFnZUluZm9cclxuICovXHJcblxyXG4vKlxyXG50eXBlIFVzZXJGcmllbmRzQ29ubmVjdGlvbiB7XHJcbiAgcGFnZUluZm86IFBhZ2VJbmZvIVxyXG4gIGVkZ2VzOiBbVXNlckZyaWVuZHNFZGdlXVxyXG59dHlwZSBVc2VyRnJpZW5kc0VkZ2Uge1xyXG4gIGN1cnNvcjogU3RyaW5nIVxyXG4gIG5vZGU6IFVzZXJcclxufVxyXG4qL1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmNTY2hlbWEge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBncmFwaHFsQXBpOiBhcHBzeW5jLkdyYXBocWxBcGksXHJcbiAgICAgICAgcHVibGljIGRhdGFTb3VyY2VzOiBJRGF0YVNvdXJjZSxcclxuICAgICAgICBwdWJsaWMgc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlc1xyXG4gICAgKSB7IH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCkge1xyXG5cclxuICAgICAgICBhcHBzeW5jLkVudW1UeXBlO1xyXG4gICAgICAgIGFwcHN5bmMuVW5pb25UeXBlO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFBhZ2VJbmZvVHlwZSgpO1xyXG4gICAgICAgIHRoaXMuYWRkU29ydElucHV0KCk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5lbnVtVHlwZXMpLmZvckVhY2goZW51bVR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShlbnVtVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzKS5mb3JFYWNoKGlucHV0VHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGlucHV0VHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnRlcmZhY2VUeXBlcykuZm9yRWFjaChpbnRlcmZhY2VUeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW50ZXJmYWNlVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcykuZm9yRWFjaChvYmplY3RUeXBlID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9iamVjdChvYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0eXBlIHRvIEdyYXBoUUwuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKG9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcignb3BlcmF0aW9uJywgJ25hbWVzJywgb2JqZWN0VHlwZS5kaXJlY3RpdmVzKTtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25zLmluY2x1ZGVzKCdmaW5kJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEZpbmQob2JqZWN0VHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLnVuaW9uVHlwZXMpLmZvckVhY2godW5pb25UeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUodW5pb25UeXBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGUgb2JqZWN0IHR5cGUgZmllbGRzIGFuZCB1cGRhdGUgcmV0dXJuVHlwZSBvZiBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUgZnJvbSBzdHJpbmcgdHlwZSB0byBhY3R1YWwgdHlwZS5cclxuICAgICAqIFdoeT8gQXBwU3luYyByZXNvbHZhYmxlIGZpZWxkcyByZXF1aXJlIGEgZGF0YSB0eXBlLiBCdXQgdGhhdCBkYXRhIHR5cGUgbWF5IG5vdCBhbHJlYWR5IGV4aXN0IHlldC4gRm9yIGV4YW1wbGU6XHJcbiAgICAgKiAgIFBvc3Qgb2JqZWN0IHR5cGUgaGFzIGZpZWxkIGNvbW1lbnRzIGFuZCBDb21tZW50IG9iamVjdCB0eXBlIGhhcyBmaWVsZCBwb3N0LiBObyBtYXR0ZXIgd2hhdCBvcmRlciB0aGVzZSBvYmplY3QgdHlwZXMgYXJlIGNyZWF0ZWQgaW4sIGFuIG9iamVjdCB0eXBlIHdvbid0IGV4aXN0IHlldC5cclxuICAgICAqICAgSWYgY29tbWVudCBpcyBjcmVhdGVkIGZpcnN0LCB0aGVyZSBpcyBubyBjb21tZW50IG9iamVjdCB0eXBlLiBJZiBjb21tZW50IGlzIGNyZWF0ZWQgZmlyc3QsIHRoZXJlIGlzIG5vIHBvc3Qgb2JqZWN0IHR5cGUuXHJcbiAgICAgKiBUbyB3b3JrIGFyb3VuZCB0aGlzIGNoaWNrZW4gb3IgZWdnIGxpbWl0YXRpb24sIEpvbXB4IGRlZmluZXMgYSBjdXN0b20gdHlwZSB0aGF0IGFsbG93cyBhIHN0cmluZyB0eXBlIHRvIGJlIHNwZWNpZmllZC4gZS5nLlxyXG4gICAgICogICBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlKHsgb2JqZWN0VHlwZU5hbWU6ICdNUG9zdCcsIGlzTGlzdDogZmFsc2UgfSksXHJcbiAgICAgKiBUaGlzIG1ldGhvZCB1c2VzIHRoZSBzdHJpbmcgdHlwZSB0byBhZGQgYW4gYWN0dWFsIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQ2F1dGlvbjogQ2hhbmdlcyB0byBBcHBTeW5jIGltcGxlbWVudGF0aW9uIGRldGFpbHMgbWF5IGJyZWFrIHRoaXMgbWV0aG9kLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlc29sdmVPYmplY3Qob2JqZWN0VHlwZTogYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcblxyXG4gICAgICAgIC8vIEl0ZXJhdGUgb2JqZWN0IHR5cGUgZmllbGRzLlxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG9iamVjdFR5cGUuZGVmaW5pdGlvbikuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIElmIGZpZWxkIG9mIEpvbXB4R3JhcGhxbFR5cGUgdHlwZSAodGhlbiB1c2Ugc3RyaW5nIHR5cGUgdG8gYWRkIGFjdHVhbCB0eXBlKS5cclxuICAgICAgICAgICAgaWYgKHZhbHVlLmZpZWxkT3B0aW9ucz8ucmV0dXJuVHlwZSBpbnN0YW5jZW9mIEpvbXB4R3JhcGhxbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIFwib2xkXCIgZmllbGQgd2l0aCB0aGUgbmV3IFwiZmllbGRcIi5cclxuICAgICAgICAgICAgICAgIG9iamVjdFR5cGUuZGVmaW5pdGlvbltrZXldID0gQXBwU3luY1NjaGVtYS5yZXNvbHZlUmVzb2x2YWJsZUZpZWxkKHRoaXMuc2NoZW1hVHlwZXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzb2x2ZSBhbiBBcHBTeW5jIFJlc29sdmFibGVGaWVsZCB3aXRoIGEgSm9tcHhHcmFwaHFsVHlwZSAod2l0aCBzdHJpbmcgdHlwZSkgdG8gYSBSZXNvbHZhYmxlRmllbGQgd2l0aCBhIEdyYXBocWxUeXBlICh3aXRoIGFuIGFjdHVhbCB0eXBlKS5cclxuICAgICAqL1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9tZW1iZXItb3JkZXJpbmdcclxuICAgIHByaXZhdGUgc3RhdGljIHJlc29sdmVSZXNvbHZhYmxlRmllbGQoc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlcywgcmVzb2x2YWJsZUZpZWxkOiBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCk6IFJlc29sdmFibGVGaWVsZCB7XHJcblxyXG4gICAgICAgIGxldCBydiA9IHJlc29sdmFibGVGaWVsZDtcclxuXHJcbiAgICAgICAgaWYgKHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnM/LnJldHVyblR5cGUgaW5zdGFuY2VvZiBKb21weEdyYXBocWxUeXBlKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBHcmFwaFFMIGRhdGF0eXBlIHdpdGggYWN0dWFsIHR5cGUuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0dyYXBocWxUeXBlID0gcmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucy5yZXR1cm5UeXBlLnJlc29sdmUoc2NoZW1hVHlwZXMpO1xyXG4gICAgICAgICAgICAvLyBVcGRhdGUgZXhpc3RpbmcgcmVzb2x2YWJsZSBmaWVsZCBvcHRpb25zIFwib2xkXCIgR3JhcGhRTCBkYXRhdHlwZSB3aXRoIFwibmV3XCIgR3JhcGhRTCBkYXRhdHlwZS5cclxuICAgICAgICAgICAgc2V0KHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMsICdyZXR1cm5UeXBlJywgbmV3R3JhcGhxbFR5cGUpO1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IHJlc29sdmFibGUgZmllbGQgd2l0aCBtb2RpZmllZCByZXNvbHZhYmxlIGZpZWxkIG9wdGlvbnMuXHJcbiAgICAgICAgICAgIHJ2ID0gbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2V4cGxhaW5pbmctZ3JhcGhxbC1jb25uZWN0aW9ucy9cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRGaW5kKG9iamVjdFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICBjb25zdCBvYmplY3RUeXBlTmFtZSA9IG9iamVjdFR5cGUubmFtZTtcclxuICAgICAgICBjb25zdCBwYWdpbmF0aW9uVHlwZTogUGFnaW5hdGlvblR5cGUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIoJ3BhZ2luYXRpb24nLCAndHlwZScsIG9iamVjdFR5cGU/LmRpcmVjdGl2ZXMpIGFzIFBhZ2luYXRpb25UeXBlID8/ICdvZmZzZXQnO1xyXG4gICAgICAgIGNvbnN0IGRhdGFTb3VyY2VOYW1lID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKCdkYXRhc291cmNlJywgJ25hbWUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGFTb3VyY2VOYW1lXHJcbiAgICAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3JcclxuICAgICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldFxyXG4gICAgICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0XHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmRhdGFTb3VyY2VzW2RhdGFTb3VyY2VOYW1lXTtcclxuXHJcbiAgICAgICAgICAgIC8vIEVkZ2UuXHJcbiAgICAgICAgICAgIGNvbnN0IGVkZ2VPYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1FZGdlYCwge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLihwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicpICYmIHsgY3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgfSwgLy8gSWYgcGFnaW5hdGlvbiB0eXBlIGN1cnNvciB0aGVuIGluY2x1ZGUgcmVxdWlyZWQgY3Vyc29yIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IG9iamVjdFR5cGUuYXR0cmlidXRlKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGVkZ2VPYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbm5lY3Rpb24uIEJhc2VkIG9uIHJlbGF5IHNwZWNpZmljYXRpb246IGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy1Db25uZWN0aW9uLVR5cGVzXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbm5lY3Rpb25PYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1Db25uZWN0aW9uYCwge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VzOiBlZGdlT2JqZWN0VHlwZS5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUluZm86IHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJyA/IHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3IuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSA6IHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXQuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbENvdW50OiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpIC8vIEFwb2xsbyBzdWdnZXN0cyBhZGRpbmcgYXMgYSBjb25uZWN0aW9uIHByb3BlcnR5OiBodHRwczovL2dyYXBocWwub3JnL2xlYXJuL3BhZ2luYXRpb24vXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShjb25uZWN0aW9uT2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgZGVmYXVsdCBxdWVyeSBhcmd1bWVudHMuXHJcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBmaWx0ZXIgYXJndW1lbnQuXHJcbiAgICAgICAgICAgIHNldChhcmdzLCAnZmlsdGVyJywgYXBwc3luYy5HcmFwaHFsVHlwZS5hd3NKc29uKCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHNvcnQgYXJndW1lbnQuXHJcbiAgICAgICAgICAgIHNldChhcmdzLCAnc29ydCcsIHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcy5Tb3J0SW5wdXQuYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgcGFnaW5hdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgICAgICAgIGlmIChwYWdpbmF0aW9uVHlwZSA9PT0gJ29mZnNldCcpIHtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnc2tpcCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdsaW1pdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgY3Vyc29yIHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InKSB7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2ZpcnN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2FmdGVyJywgYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2xhc3QnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnYmVmb3JlJywgYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBxdWVyeS5cclxuICAgICAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGBmaW5kJHtvYmplY3RUeXBlTmFtZVBsdXJhbH1gLCBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkUXVlcnkoYCR7dGhpcy5vcGVyYXRpb25OYW1lRnJvbVR5cGUob2JqZWN0VHlwZU5hbWUpfUZpbmRgLCBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogY29ubmVjdGlvbk9iamVjdFR5cGUuYXR0cmlidXRlKCksXHJcbiAgICAgICAgICAgICAgICBhcmdzLFxyXG4gICAgICAgICAgICAgICAgZGF0YVNvdXJjZSxcclxuICAgICAgICAgICAgICAgIC8vIHBpcGVsaW5lQ29uZmlnOiBbXSwgLy8gVE9ETzogQWRkIGF1dGhvcml6YXRpb24gTGFtYmRhIGZ1bmN0aW9uIGhlcmUuXHJcbiAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIHJlcXVlc3QgbWFwcGluZyB0byBpbmplY3Qgc3Rhc2ggdmFyaWFibGVzIChmb3IgdXNlIGluIExhbWJkYSBmdW5jdGlvbikuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcIm9wZXJhdGlvblwiLCBcImZpbmRcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvYmplY3RUeXBlTmFtZVwiLCBcIiR7b2JqZWN0VHlwZU5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwicmV0dXJuVHlwZU5hbWVcIiwgXCIke2Nvbm5lY3Rpb25PYmplY3RUeXBlLm5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR7RGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAgICAgICAgICAgICBgKVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHBhZ2luYXRpb24gcGFnZUluZm8gdHlwZXMgZm9yIG9mZnNldCBhbmQgY3Vyc29yIGJhc2VkIHBhZ2luYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQ3Vyc29yIHBhZ2luYXRpb24uIFBhZ2UgYW5kIHNvcnQgYnkgdW5pcXVlIGZpZWxkLiBDb25jYXRlbmF0ZWQgZmllbGRzIGNhbiByZXN1bHQgaW4gcG9vciBwZXJmb3JtYW5jZS5cclxuICAgICAqIGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy1Db25uZWN0aW9uLVR5cGVzXHJcbiAgICAgKiBodHRwczovL3Nob3BpZnkuZW5naW5lZXJpbmcvcGFnaW5hdGlvbi1yZWxhdGl2ZS1jdXJzb3JzXHJcbiAgICAgKiBodHRwczovL21lZGl1bS5jb20vc3dsaC9ob3ctdG8taW1wbGVtZW50LWN1cnNvci1wYWdpbmF0aW9uLWxpa2UtYS1wcm8tNTEzMTQwYjY1ZjMyXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkUGFnZUluZm9UeXBlKCkge1xyXG5cclxuICAgICAgICAvLyBPZmZzZXQgcGFnaW5hdGlvbi5cclxuICAgICAgICBjb25zdCBwYWdlSW5mb09mZnNldCA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ1BhZ2VJbmZvT2Zmc2V0Jywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBza2lwOiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvT2Zmc2V0ID0gcGFnZUluZm9PZmZzZXQ7XHJcblxyXG4gICAgICAgIC8vIEN1cnNvciBwYWdpbmF0aW9uLlxyXG4gICAgICAgIGNvbnN0IHBhZ2VJbmZvQ3Vyc29yID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZSgnUGFnZUluZm9DdXJzb3InLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIGhhc1ByZXZpb3VzUGFnZTogYXBwc3luYy5HcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGhhc05leHRQYWdlOiBhcHBzeW5jLkdyYXBocWxUeXBlLmJvb2xlYW4oeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRDdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGVuZEN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yID0gcGFnZUluZm9DdXJzb3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgc29ydCBpbnB1dCB0eXBlIGZvciBtdWx0aSBjb2x1bW4gc29ydGluZy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRTb3J0SW5wdXQoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHNvcnRJbnB1dCA9IG5ldyBhcHBzeW5jLklucHV0VHlwZSgnU29ydElucHV0Jywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0ID0gc29ydElucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGUuZy4gTVBvc3QgPiBtcG9zdCwgTXlTcWxQb3N0ID4gbXlTcWxQb3N0LCBNeVBvc3QgPiBteVBvc3RcclxuICAgIHByaXZhdGUgb3BlcmF0aW9uTmFtZUZyb21UeXBlKHM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHMuY2hhckF0KDApLnRvTG9jYWxlTG93ZXJDYXNlKCkgKyBzLmNoYXJBdCgxKS50b0xvY2FsZUxvd2VyQ2FzZSgpICsgcy5zbGljZSgyKTtcclxuICAgIH1cclxufVxyXG4iXX0=