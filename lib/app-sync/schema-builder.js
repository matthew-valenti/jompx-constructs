"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncSchemaBuilder = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const appsync = require("@aws-cdk/aws-appsync-alpha");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
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
class AppSyncSchemaBuilder {
    constructor(graphqlApi) {
        this.graphqlApi = graphqlApi;
        this.dataSources = {};
        this.schemaTypes = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };
    }
    // Add datasource to AppSync in an internal array. Remove this when AppSync provides a way to iterate datasources).
    addDataSource(id, lambdaFunction, options) {
        const identifier = `AppSyncDataSource${changeCase.pascalCase(id)}`;
        const dataSource = this.graphqlApi.addLambdaDataSource(identifier, lambdaFunction, options);
        this.dataSources = { ...this.dataSources, ...{ [id]: dataSource } };
    }
    addSchemaTypes(schemaTypes) {
        this.schemaTypes = { ...this.schemaTypes, ...schemaTypes };
    }
    addMutation(operation, lambdaFunction, args, returnType) {
        this.graphqlApi.addQuery(operation, new appsync.ResolvableField({
            returnType: returnType.attribute(),
            args,
            dataSource: lambdaFunction,
            // pipelineConfig: [], // TODO: Add authorization Lambda function here.
            requestMappingTemplate: appsync.MappingTemplate.fromString(`
                $util.qr($ctx.stash.put("operation", operation))
                ${app_sync_types_1.DefaultRequestMappingTemplate}
            `)
        }));
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
            var _b;
            // If field of JompxGraphqlType type (then use string type to add actual type).
            if (((_b = value.fieldOptions) === null || _b === void 0 ? void 0 : _b.returnType) instanceof graphql_type_1.JompxGraphqlType) {
                // Replace the "old" field with the new "field".
                objectType.definition[key] = AppSyncSchemaBuilder.resolveResolvableField(this.schemaTypes, value);
            }
        });
    }
    /**
     * Resolve an AppSync ResolvableField with a JompxGraphqlType (with string type) to a ResolvableField with a GraphqlType (with an actual type).
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    static resolveResolvableField(schemaTypes, resolvableField) {
        var _b;
        let rv = resolvableField;
        if (((_b = resolvableField.fieldOptions) === null || _b === void 0 ? void 0 : _b.returnType) instanceof graphql_type_1.JompxGraphqlType) {
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
        var _b;
        const objectTypeName = objectType.name;
        const paginationType = (_b = custom_directive_1.CustomDirective.getArgumentByIdentifier('pagination', 'type', objectType === null || objectType === void 0 ? void 0 : objectType.directives)) !== null && _b !== void 0 ? _b : 'offset';
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
exports.AppSyncSchemaBuilder = AppSyncSchemaBuilder;
_a = JSII_RTTI_SYMBOL_1;
AppSyncSchemaBuilder[_a] = { fqn: "@jompx/constructs.AppSyncSchemaBuilder", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvc2NoZW1hLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBc0Q7QUFFdEQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQyxpRUFBaUU7QUFDakUsMkNBQTJDO0FBQzNDLGlFQUFpRTtBQUNqRSxpQ0FBa0M7QUFDbEMscUNBQXFDO0FBQ3JDLHFEQUFtSDtBQUNuSCx5REFBcUU7QUFDckUsaURBQWtEO0FBRWxEOzs7Ozs7R0FNRztBQUVIOzs7Ozs7OztFQVFFO0FBRUYsTUFBYSxvQkFBb0I7SUFLN0IsWUFDVyxVQUE4QjtRQUE5QixlQUFVLEdBQVYsVUFBVSxDQUFvQjtRQUpsQyxnQkFBVyxHQUFnQixFQUFFLENBQUM7UUFDOUIsZ0JBQVcsR0FBaUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUl0SCxDQUFDO0lBRUwsbUhBQW1IO0lBQzVHLGFBQWEsQ0FBQyxFQUFVLEVBQUUsY0FBd0MsRUFBRSxPQUFtQztRQUMxRyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ25FLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUM7SUFDeEUsQ0FBQztJQUVNLGNBQWMsQ0FBQyxXQUF5QjtRQUMzQyxJQUFJLENB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Q29udGVudCI6WyJpbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuLy8gaW1wb3J0IHBsdXJhbGl6ZSA9IHJlcXVpcmUoJ3BsdXJhbGl6ZScpO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG5pbXBvcnQgc2V0ID0gcmVxdWlyZSgnc2V0LXZhbHVlJyk7XHJcbi8vIGltcG9ydCBnZXQgPSByZXF1aXJlKCdnZXQtdmFsdWUnKTtcclxuaW1wb3J0IHsgSURhdGFTb3VyY2UsIElTY2hlbWFUeXBlcywgRGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGUsIElBcHBTeW5jT3BlcmF0aW9uQXJncyB9IGZyb20gJy4vYXBwLXN5bmMudHlwZXMnO1xyXG5pbXBvcnQgeyBDdXN0b21EaXJlY3RpdmUsIFBhZ2luYXRpb25UeXBlIH0gZnJvbSAnLi9jdXN0b20tZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgSm9tcHhHcmFwaHFsVHlwZSB9IGZyb20gJy4vZ3JhcGhxbC10eXBlJztcclxuXHJcbi8qKlxyXG4gKiBDdXJzb3IgRWRnZSBOb2RlOiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvZXhwbGFpbmluZy1ncmFwaHFsLWNvbm5lY3Rpb25zL1xyXG4gKiBTdXBwb3J0IHJlbGF5IG9yIG5vdD9cclxuICogaHR0cHM6Ly9tZWRpdW0uY29tL29wZW4tZ3JhcGhxbC91c2luZy1yZWxheS13aXRoLWF3cy1hcHBzeW5jLTU1Yzg5Y2EwMjA2NlxyXG4gKiBKb2lucyBzaG91bGQgYmUgY29ubmVjdGlvbnMgYW5kIG5hbWVkIGFzIHN1Y2guIGUuZy4gaW4gcG9zdCBUYWdzQ29ubmVjdGlvblxyXG4gKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtdW5kZWZpbmVkLlBhZ2VJbmZvXHJcbiAqL1xyXG5cclxuLypcclxudHlwZSBVc2VyRnJpZW5kc0Nvbm5lY3Rpb24ge1xyXG4gIHBhZ2VJbmZvOiBQYWdlSW5mbyFcclxuICBlZGdlczogW1VzZXJGcmllbmRzRWRnZV1cclxufXR5cGUgVXNlckZyaWVuZHNFZGdlIHtcclxuICBjdXJzb3I6IFN0cmluZyFcclxuICBub2RlOiBVc2VyXHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jU2NoZW1hQnVpbGRlciB7XHJcblxyXG4gICAgcHVibGljIGRhdGFTb3VyY2VzOiBJRGF0YVNvdXJjZSA9IHt9O1xyXG4gICAgcHVibGljIHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZXMgPSB7IGVudW1UeXBlczoge30sIGlucHV0VHlwZXM6IHt9LCBpbnRlcmZhY2VUeXBlczoge30sIG9iamVjdFR5cGVzOiB7fSwgdW5pb25UeXBlczoge30gfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgZ3JhcGhxbEFwaTogYXBwc3luYy5HcmFwaHFsQXBpXHJcbiAgICApIHsgfVxyXG5cclxuICAgIC8vIEFkZCBkYXRhc291cmNlIHRvIEFwcFN5bmMgaW4gYW4gaW50ZXJuYWwgYXJyYXkuIFJlbW92ZSB0aGlzIHdoZW4gQXBwU3luYyBwcm92aWRlcyBhIHdheSB0byBpdGVyYXRlIGRhdGFzb3VyY2VzKS5cclxuICAgIHB1YmxpYyBhZGREYXRhU291cmNlKGlkOiBzdHJpbmcsIGxhbWJkYUZ1bmN0aW9uOiBjZGsuYXdzX2xhbWJkYS5JRnVuY3Rpb24sIG9wdGlvbnM/OiBhcHBzeW5jLkRhdGFTb3VyY2VPcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IGBBcHBTeW5jRGF0YVNvdXJjZSR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKGlkKX1gO1xyXG4gICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmdyYXBocWxBcGkuYWRkTGFtYmRhRGF0YVNvdXJjZShpZGVudGlmaWVyLCBsYW1iZGFGdW5jdGlvbiwgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlcyA9IHsgLi4udGhpcy5kYXRhU291cmNlcywgLi4ueyBbaWRdOiBkYXRhU291cmNlIH0gfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkU2NoZW1hVHlwZXMoc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlcykge1xyXG4gICAgICAgIHRoaXMuc2NoZW1hVHlwZXMgPSB7IC4uLnRoaXMuc2NoZW1hVHlwZXMsIC4uLnNjaGVtYVR5cGVzIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE11dGF0aW9uKG9wZXJhdGlvbjogc3RyaW5nLCBsYW1iZGFGdW5jdGlvbjogYXBwc3luYy5MYW1iZGFEYXRhU291cmNlLCBhcmdzOiBJQXBwU3luY09wZXJhdGlvbkFyZ3MsIHJldHVyblR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkUXVlcnkob3BlcmF0aW9uLCBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgICAgICByZXR1cm5UeXBlOiByZXR1cm5UeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgICAgICAgICBhcmdzLFxyXG4gICAgICAgICAgICBkYXRhU291cmNlOiBsYW1iZGFGdW5jdGlvbixcclxuICAgICAgICAgICAgLy8gcGlwZWxpbmVDb25maWc6IFtdLCAvLyBUT0RPOiBBZGQgYXV0aG9yaXphdGlvbiBMYW1iZGEgZnVuY3Rpb24gaGVyZS5cclxuICAgICAgICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcIm9wZXJhdGlvblwiLCBvcGVyYXRpb24pKVxyXG4gICAgICAgICAgICAgICAgJHtEZWZhdWx0UmVxdWVzdE1hcHBpbmdUZW1wbGF0ZX1cclxuICAgICAgICAgICAgYClcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSgpIHtcclxuXHJcbiAgICAgICAgYXBwc3luYy5FbnVtVHlwZTtcclxuICAgICAgICBhcHBzeW5jLlVuaW9uVHlwZTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRQYWdlSW5mb1R5cGUoKTtcclxuICAgICAgICB0aGlzLmFkZFNvcnRJbnB1dCgpO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMuZW51bVR5cGVzKS5mb3JFYWNoKGVudW1UeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZW51bVR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcykuZm9yRWFjaChpbnB1dFR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnB1dFR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMuaW50ZXJmYWNlVHlwZXMpLmZvckVhY2goaW50ZXJmYWNlVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGludGVyZmFjZVR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMpLmZvckVhY2gob2JqZWN0VHlwZSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVPYmplY3Qob2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgdHlwZSB0byBHcmFwaFFMLlxyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShvYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBDdXN0b21EaXJlY3RpdmUuZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIoJ29wZXJhdGlvbicsICduYW1lcycsIG9iamVjdFR5cGUuZGlyZWN0aXZlcyk7XHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9ucy5pbmNsdWRlcygnZmluZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRGaW5kKG9iamVjdFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy51bmlvblR5cGVzKS5mb3JFYWNoKHVuaW9uVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHVuaW9uVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcyBhbmQgdXBkYXRlIHJldHVyblR5cGUgb2YgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIGZyb20gc3RyaW5nIHR5cGUgdG8gYWN0dWFsIHR5cGUuXHJcbiAgICAgKiBXaHk/IEFwcFN5bmMgcmVzb2x2YWJsZSBmaWVsZHMgcmVxdWlyZSBhIGRhdGEgdHlwZS4gQnV0IHRoYXQgZGF0YSB0eXBlIG1heSBub3QgYWxyZWFkeSBleGlzdCB5ZXQuIEZvciBleGFtcGxlOlxyXG4gICAgICogICBQb3N0IG9iamVjdCB0eXBlIGhhcyBmaWVsZCBjb21tZW50cyBhbmQgQ29tbWVudCBvYmplY3QgdHlwZSBoYXMgZmllbGQgcG9zdC4gTm8gbWF0dGVyIHdoYXQgb3JkZXIgdGhlc2Ugb2JqZWN0IHR5cGVzIGFyZSBjcmVhdGVkIGluLCBhbiBvYmplY3QgdHlwZSB3b24ndCBleGlzdCB5ZXQuXHJcbiAgICAgKiAgIElmIGNvbW1lbnQgaXMgY3JlYXRlZCBmaXJzdCwgdGhlcmUgaXMgbm8gY29tbWVudCBvYmplY3QgdHlwZS4gSWYgY29tbWVudCBpcyBjcmVhdGVkIGZpcnN0LCB0aGVyZSBpcyBubyBwb3N0IG9iamVjdCB0eXBlLlxyXG4gICAgICogVG8gd29yayBhcm91bmQgdGhpcyBjaGlja2VuIG9yIGVnZyBsaW1pdGF0aW9uLCBKb21weCBkZWZpbmVzIGEgY3VzdG9tIHR5cGUgdGhhdCBhbGxvd3MgYSBzdHJpbmcgdHlwZSB0byBiZSBzcGVjaWZpZWQuIGUuZy5cclxuICAgICAqICAgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIEpvbXB4R3JhcGhxbFR5cGUub2JqZWN0VHlwZSh7IG9iamVjdFR5cGVOYW1lOiAnTVBvc3QnLCBpc0xpc3Q6IGZhbHNlIH0pLFxyXG4gICAgICogVGhpcyBtZXRob2QgdXNlcyB0aGUgc3RyaW5nIHR5cGUgdG8gYWRkIGFuIGFjdHVhbCB0eXBlLlxyXG4gICAgICpcclxuICAgICAqIENhdXRpb246IENoYW5nZXMgdG8gQXBwU3luYyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIG1heSBicmVhayB0aGlzIG1ldGhvZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZXNvbHZlT2JqZWN0KG9iamVjdFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICAvLyBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcy5cclxuICAgICAgICBPYmplY3QuZW50cmllcyhvYmplY3RUeXBlLmRlZmluaXRpb24pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBJZiBmaWVsZCBvZiBKb21weEdyYXBocWxUeXBlIHR5cGUgKHRoZW4gdXNlIHN0cmluZyB0eXBlIHRvIGFkZCBhY3R1YWwgdHlwZSkuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5maWVsZE9wdGlvbnM/LnJldHVyblR5cGUgaW5zdGFuY2VvZiBKb21weEdyYXBocWxUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBcIm9sZFwiIGZpZWxkIHdpdGggdGhlIG5ldyBcImZpZWxkXCIuXHJcbiAgICAgICAgICAgICAgICBvYmplY3RUeXBlLmRlZmluaXRpb25ba2V5XSA9IEFwcFN5bmNTY2hlbWFCdWlsZGVyLnJlc29sdmVSZXNvbHZhYmxlRmllbGQodGhpcy5zY2hlbWFUeXBlcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNvbHZlIGFuIEFwcFN5bmMgUmVzb2x2YWJsZUZpZWxkIHdpdGggYSBKb21weEdyYXBocWxUeXBlICh3aXRoIHN0cmluZyB0eXBlKSB0byBhIFJlc29sdmFibGVGaWVsZCB3aXRoIGEgR3JhcGhxbFR5cGUgKHdpdGggYW4gYWN0dWFsIHR5cGUpLlxyXG4gICAgICovXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L21lbWJlci1vcmRlcmluZ1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVzb2x2ZVJlc29sdmFibGVGaWVsZChzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzLCByZXNvbHZhYmxlRmllbGQ6IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKTogYXBwc3luYy5SZXNvbHZhYmxlRmllbGQge1xyXG5cclxuICAgICAgICBsZXQgcnYgPSByZXNvbHZhYmxlRmllbGQ7XHJcblxyXG4gICAgICAgIGlmIChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zPy5yZXR1cm5UeXBlIGluc3RhbmNlb2YgSm9tcHhHcmFwaHFsVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgR3JhcGhRTCBkYXRhdHlwZSB3aXRoIGFjdHVhbCB0eXBlLlxyXG4gICAgICAgICAgICBjb25zdCBuZXdHcmFwaHFsVHlwZSA9IHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMucmV0dXJuVHlwZS5yZXNvbHZlKHNjaGVtYVR5cGVzKTtcclxuICAgICAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIHJlc29sdmFibGUgZmllbGQgb3B0aW9ucyBcIm9sZFwiIEdyYXBoUUwgZGF0YXR5cGUgd2l0aCBcIm5ld1wiIEdyYXBoUUwgZGF0YXR5cGUuXHJcbiAgICAgICAgICAgIHNldChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zLCAncmV0dXJuVHlwZScsIG5ld0dyYXBocWxUeXBlKTtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyByZXNvbHZhYmxlIGZpZWxkIHdpdGggbW9kaWZpZWQgcmVzb2x2YWJsZSBmaWVsZCBvcHRpb25zLlxyXG4gICAgICAgICAgICBydiA9IG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkRmluZChvYmplY3RUeXBlOiBhcHBzeW5jLk9iamVjdFR5cGUpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqZWN0VHlwZU5hbWUgPSBvYmplY3RUeXBlLm5hbWU7XHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvblR5cGU6IFBhZ2luYXRpb25UeXBlID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKCdwYWdpbmF0aW9uJywgJ3R5cGUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKSBhcyBQYWdpbmF0aW9uVHlwZSA/PyAnb2Zmc2V0JztcclxuICAgICAgICBjb25zdCBkYXRhU291cmNlTmFtZSA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcignZGF0YXNvdXJjZScsICduYW1lJywgb2JqZWN0VHlwZT8uZGlyZWN0aXZlcyk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhU291cmNlTmFtZVxyXG4gICAgICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yXHJcbiAgICAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXRcclxuICAgICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcblxyXG4gICAgICAgICAgICAvLyBFZGdlLlxyXG4gICAgICAgICAgICBjb25zdCBlZGdlT2JqZWN0VHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7b2JqZWN0VHlwZU5hbWV9RWRnZWAsIHtcclxuICAgICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAuLi4ocGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InKSAmJiB7IGN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sIC8vIElmIHBhZ2luYXRpb24gdHlwZSBjdXJzb3IgdGhlbiBpbmNsdWRlIHJlcXVpcmVkIGN1cnNvciBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgICBub2RlOiBvYmplY3RUeXBlLmF0dHJpYnV0ZSgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShlZGdlT2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDb25uZWN0aW9uLiBCYXNlZCBvbiByZWxheSBzcGVjaWZpY2F0aW9uOiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtQ29ubmVjdGlvbi1UeXBlc1xyXG4gICAgICAgICAgICBjb25zdCBjb25uZWN0aW9uT2JqZWN0VHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7b2JqZWN0VHlwZU5hbWV9Q29ubmVjdGlvbmAsIHtcclxuICAgICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlczogZWRnZU9iamVjdFR5cGUuYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VJbmZvOiBwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicgPyB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yLmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgOiB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvT2Zmc2V0LmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxDb3VudDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSAvLyBBcG9sbG8gc3VnZ2VzdHMgYWRkaW5nIGFzIGEgY29ubmVjdGlvbiBwcm9wZXJ0eTogaHR0cHM6Ly9ncmFwaHFsLm9yZy9sZWFybi9wYWdpbmF0aW9uL1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoY29ubmVjdGlvbk9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGRlZmF1bHQgcXVlcnkgYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBjb25zdCBhcmdzID0ge307XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgZmlsdGVyIGFyZ3VtZW50LlxyXG4gICAgICAgICAgICBzZXQoYXJncywgJ2ZpbHRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuYXdzSnNvbigpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBzb3J0IGFyZ3VtZW50LlxyXG4gICAgICAgICAgICBzZXQoYXJncywgJ3NvcnQnLCB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0LmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdvZmZzZXQnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ3NraXAnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnbGltaXQnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGN1cnNvciBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuICAgICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJykge1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdmaXJzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdhZnRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdsYXN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2JlZm9yZScsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgcXVlcnkuXHJcbiAgICAgICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgZmluZCR7b2JqZWN0VHlwZU5hbWVQbHVyYWx9YCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGAke3RoaXMub3BlcmF0aW9uTmFtZUZyb21UeXBlKG9iamVjdFR5cGVOYW1lKX1GaW5kYCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgICAgIHJldHVyblR5cGU6IGNvbm5lY3Rpb25PYmplY3RUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgICAgICAgICAgICAgYXJncyxcclxuICAgICAgICAgICAgICAgIGRhdGFTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHRoZSByZXF1ZXN0IG1hcHBpbmcgdG8gaW5qZWN0IHN0YXNoIHZhcmlhYmxlcyAoZm9yIHVzZSBpbiBMYW1iZGEgZnVuY3Rpb24pLlxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvcGVyYXRpb25cIiwgXCJmaW5kXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib2JqZWN0VHlwZU5hbWVcIiwgXCIke29iamVjdFR5cGVOYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcInJldHVyblR5cGVOYW1lXCIsIFwiJHtjb25uZWN0aW9uT2JqZWN0VHlwZS5uYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICAgICAke0RlZmF1bHRSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlfVxyXG4gICAgICAgICAgICAgICAgYClcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwYWdpbmF0aW9uIHBhZ2VJbmZvIHR5cGVzIGZvciBvZmZzZXQgYW5kIGN1cnNvciBiYXNlZCBwYWdpbmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEN1cnNvciBwYWdpbmF0aW9uLiBQYWdlIGFuZCBzb3J0IGJ5IHVuaXF1ZSBmaWVsZC4gQ29uY2F0ZW5hdGVkIGZpZWxkcyBjYW4gcmVzdWx0IGluIHBvb3IgcGVyZm9ybWFuY2UuXHJcbiAgICAgKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtQ29ubmVjdGlvbi1UeXBlc1xyXG4gICAgICogaHR0cHM6Ly9zaG9waWZ5LmVuZ2luZWVyaW5nL3BhZ2luYXRpb24tcmVsYXRpdmUtY3Vyc29yc1xyXG4gICAgICogaHR0cHM6Ly9tZWRpdW0uY29tL3N3bGgvaG93LXRvLWltcGxlbWVudC1jdXJzb3ItcGFnaW5hdGlvbi1saWtlLWEtcHJvLTUxMzE0MGI2NWYzMlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFBhZ2VJbmZvVHlwZSgpIHtcclxuXHJcbiAgICAgICAgLy8gT2Zmc2V0IHBhZ2luYXRpb24uXHJcbiAgICAgICAgY29uc3QgcGFnZUluZm9PZmZzZXQgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb09mZnNldCcsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgc2tpcDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldCA9IHBhZ2VJbmZvT2Zmc2V0O1xyXG5cclxuICAgICAgICAvLyBDdXJzb3IgcGFnaW5hdGlvbi5cclxuICAgICAgICBjb25zdCBwYWdlSW5mb0N1cnNvciA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ1BhZ2VJbmZvQ3Vyc29yJywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBoYXNQcmV2aW91c1BhZ2U6IGFwcHN5bmMuR3JhcGhxbFR5cGUuYm9vbGVhbih7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBoYXNOZXh0UGFnZTogYXBwc3luYy5HcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0Q3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBlbmRDdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvciA9IHBhZ2VJbmZvQ3Vyc29yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHNvcnQgaW5wdXQgdHlwZSBmb3IgbXVsdGkgY29sdW1uIHNvcnRpbmcuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkU29ydElucHV0KCkge1xyXG5cclxuICAgICAgICBjb25zdCBzb3J0SW5wdXQgPSBuZXcgYXBwc3luYy5JbnB1dFR5cGUoJ1NvcnRJbnB1dCcsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgZmllbGROYW1lOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dCA9IHNvcnRJbnB1dDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlLmcuIE1Qb3N0ID4gbXBvc3QsIE15U3FsUG9zdCA+IG15U3FsUG9zdCwgTXlQb3N0ID4gbXlQb3N0XHJcbiAgICBwcml2YXRlIG9wZXJhdGlvbk5hbWVGcm9tVHlwZShzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBzLmNoYXJBdCgwKS50b0xvY2FsZUxvd2VyQ2FzZSgpICsgcy5jaGFyQXQoMSkudG9Mb2NhbGVMb3dlckNhc2UoKSArIHMuc2xpY2UoMik7XHJcbiAgICB9XHJcbn1cclxuIl19