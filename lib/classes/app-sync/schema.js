"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncSchema = void 0;
const appsync = require("@aws-cdk/aws-appsync-alpha");
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import pluralize = require('pluralize');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const set = require("set-value");
const directive_1 = require("./directive");
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
            const operations = directive_1.CustomDirective.getArgumentByIdentifier('operation', 'names', objectType.directives);
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
        const paginationType = (_a = directive_1.CustomDirective.getArgumentByIdentifier('pagination', 'type', objectType === null || objectType === void 0 ? void 0 : objectType.directives)) !== null && _a !== void 0 ? _a : 'offset';
        const dataSourceName = directive_1.CustomDirective.getArgumentByIdentifier('datasource', 'name', objectType === null || objectType === void 0 ? void 0 : objectType.directives);
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
                    $util.qr($ctx.stash.put("typeName", "${objectTypeName}"))
                    $util.qr($ctx.stash.put("returnTypeName", "${connectionObjectType.name}"))
                    ${AppSyncSchema.pipelineRequestMappingTemplate}
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
// AppSync VTL snippet to pass event params to Lambda resolver.
// With no VTL, the Lambda event contains all properties below. However, selectionSetList is a child property of info.
// Thru trial and error there doesn't appear to be a way to add selectionSetList as a child property.
// We need VTL because this is the only known way to pass variables directly into the Lambda.
// However, when we specify any VTL we must specify all VTL. Adding data to the stash property results in an empty Lambda event.
// Stash variables can be added by appending additional VTL above this payload statement. i.e. $util.qr($ctx.stash.put("key", "value"))
// This VTL invokes a payload property which simply returns an object with properties (taken from the AppSync $context variable).
// Caution: payload should mimic a standard Lambda resolver (with no VTL). This object might change in the future.
// In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
AppSyncSchema.pipelineRequestMappingTemplate = `{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsYXNzZXMvYXBwLXN5bmMvc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFzRDtBQUV0RCxpRUFBaUU7QUFDakUsMkNBQTJDO0FBQzNDLGlFQUFpRTtBQUNqRSxpQ0FBa0M7QUFHbEMsMkNBQThEO0FBQzlELGlEQUFrRDtBQUVsRDs7Ozs7O0dBTUc7QUFFSDs7Ozs7Ozs7RUFRRTtBQUVGLE1BQWEsYUFBYTtJQTBCdEIsWUFDVyxVQUE4QixFQUM5QixXQUF3QixFQUN4QixXQUF3QjtRQUZ4QixlQUFVLEdBQVYsVUFBVSxDQUFvQjtRQUM5QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUMvQixDQUFDO0lBRUUsTUFBTTtRQUVULE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDakIsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUVsQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRXBCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDekQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzNELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9B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QUFDOztBQS9PTCxzQ0FnUEM7QUE5T0csK0RBQStEO0FBQy9ELHNIQUFzSDtBQUN0SCxxR0FBcUc7QUFDckcsNkZBQTZGO0FBQzdGLGdJQUFnSTtBQUNoSSx1SUFBdUk7QUFDdkksaUlBQWlJO0FBQ2pJLGtIQUFrSDtBQUNsSCx3SEFBd0g7QUFDaEcsNENBQThCLEdBQUc7Ozs7Ozs7Ozs7Ozs7VUFhbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgeyBSZXNvbHZhYmxlRmllbGQgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbi8vIGltcG9ydCBwbHVyYWxpemUgPSByZXF1aXJlKCdwbHVyYWxpemUnKTtcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuaW1wb3J0IHNldCA9IHJlcXVpcmUoJ3NldC12YWx1ZScpO1xyXG4vLyBpbXBvcnQgZ2V0ID0gcmVxdWlyZSgnZ2V0LXZhbHVlJyk7XHJcbmltcG9ydCB7IElEYXRhU291cmNlLCBJU2NoZW1hVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL2FwcC1zeW5jJztcclxuaW1wb3J0IHsgQ3VzdG9tRGlyZWN0aXZlLCBQYWdpbmF0aW9uVHlwZSB9IGZyb20gJy4vZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgSm9tcHhHcmFwaHFsVHlwZSB9IGZyb20gJy4vZ3JhcGhxbC10eXBlJztcclxuXHJcbi8qKlxyXG4gKiBDdXJzb3IgRWRnZSBOb2RlOiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvZXhwbGFpbmluZy1ncmFwaHFsLWNvbm5lY3Rpb25zL1xyXG4gKiBTdXBwb3J0IHJlbGF5IG9yIG5vdD9cclxuICogaHR0cHM6Ly9tZWRpdW0uY29tL29wZW4tZ3JhcGhxbC91c2luZy1yZWxheS13aXRoLWF3cy1hcHBzeW5jLTU1Yzg5Y2EwMjA2NlxyXG4gKiBKb2lucyBzaG91bGQgYmUgY29ubmVjdGlvbnMgYW5kIG5hbWVkIGFzIHN1Y2guIGUuZy4gaW4gcG9zdCBUYWdzQ29ubmVjdGlvblxyXG4gKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtdW5kZWZpbmVkLlBhZ2VJbmZvXHJcbiAqL1xyXG5cclxuLypcclxudHlwZSBVc2VyRnJpZW5kc0Nvbm5lY3Rpb24ge1xyXG4gIHBhZ2VJbmZvOiBQYWdlSW5mbyFcclxuICBlZGdlczogW1VzZXJGcmllbmRzRWRnZV1cclxufXR5cGUgVXNlckZyaWVuZHNFZGdlIHtcclxuICBjdXJzb3I6IFN0cmluZyFcclxuICBub2RlOiBVc2VyXHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jU2NoZW1hIHtcclxuXHJcbiAgICAvLyBBcHBTeW5jIFZUTCBzbmlwcGV0IHRvIHBhc3MgZXZlbnQgcGFyYW1zIHRvIExhbWJkYSByZXNvbHZlci5cclxuICAgIC8vIFdpdGggbm8gVlRMLCB0aGUgTGFtYmRhIGV2ZW50IGNvbnRhaW5zIGFsbCBwcm9wZXJ0aWVzIGJlbG93LiBIb3dldmVyLCBzZWxlY3Rpb25TZXRMaXN0IGlzIGEgY2hpbGQgcHJvcGVydHkgb2YgaW5mby5cclxuICAgIC8vIFRocnUgdHJpYWwgYW5kIGVycm9yIHRoZXJlIGRvZXNuJ3QgYXBwZWFyIHRvIGJlIGEgd2F5IHRvIGFkZCBzZWxlY3Rpb25TZXRMaXN0IGFzIGEgY2hpbGQgcHJvcGVydHkuXHJcbiAgICAvLyBXZSBuZWVkIFZUTCBiZWNhdXNlIHRoaXMgaXMgdGhlIG9ubHkga25vd24gd2F5IHRvIHBhc3MgdmFyaWFibGVzIGRpcmVjdGx5IGludG8gdGhlIExhbWJkYS5cclxuICAgIC8vIEhvd2V2ZXIsIHdoZW4gd2Ugc3BlY2lmeSBhbnkgVlRMIHdlIG11c3Qgc3BlY2lmeSBhbGwgVlRMLiBBZGRpbmcgZGF0YSB0byB0aGUgc3Rhc2ggcHJvcGVydHkgcmVzdWx0cyBpbiBhbiBlbXB0eSBMYW1iZGEgZXZlbnQuXHJcbiAgICAvLyBTdGFzaCB2YXJpYWJsZXMgY2FuIGJlIGFkZGVkIGJ5IGFwcGVuZGluZyBhZGRpdGlvbmFsIFZUTCBhYm92ZSB0aGlzIHBheWxvYWQgc3RhdGVtZW50LiBpLmUuICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwia2V5XCIsIFwidmFsdWVcIikpXHJcbiAgICAvLyBUaGlzIFZUTCBpbnZva2VzIGEgcGF5bG9hZCBwcm9wZXJ0eSB3aGljaCBzaW1wbHkgcmV0dXJucyBhbiBvYmplY3Qgd2l0aCBwcm9wZXJ0aWVzICh0YWtlbiBmcm9tIHRoZSBBcHBTeW5jICRjb250ZXh0IHZhcmlhYmxlKS5cclxuICAgIC8vIENhdXRpb246IHBheWxvYWQgc2hvdWxkIG1pbWljIGEgc3RhbmRhcmQgTGFtYmRhIHJlc29sdmVyICh3aXRoIG5vIFZUTCkuIFRoaXMgb2JqZWN0IG1pZ2h0IGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxyXG4gICAgLy8gSW4gdGhlb3J5LCB3ZSBjb3VsZCB1c2UgYSBMYW1iZGEgZnVuY3Rpb24gaW5zdGVhZCBvZiBWVEwgYnV0IHRoaXMgc2hvdWxkIGJlIG11Y2ggZmFzdGVyIHRoYW4gaW52b2tpbmcgYW5vdGhlciBMYW1iZGEuXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBwaXBlbGluZVJlcXVlc3RNYXBwaW5nVGVtcGxhdGUgPSBge1xyXG4gICAgICAgICAgICBcInZlcnNpb25cIiA6IFwiMjAxOC0wNS0yOVwiLFxyXG4gICAgICAgICAgICBcIm9wZXJhdGlvblwiOiBcIkludm9rZVwiLFxyXG4gICAgICAgICAgICBcInBheWxvYWRcIjoge1xyXG4gICAgICAgICAgICAgICAgXCJhcmd1bWVudHNcIjogJHV0aWxzLnRvSnNvbigkY29udGV4dC5hcmd1bWVudHMpLFxyXG4gICAgICAgICAgICAgICAgXCJpZGVudGl0eVwiOiAkdXRpbHMudG9Kc29uKCRjb250ZXh0LmlkZW50aXR5KSxcclxuICAgICAgICAgICAgICAgIFwic291cmNlXCI6ICR1dGlscy50b0pzb24oJGNvbnRleHQuc291cmNlKSxcclxuICAgICAgICAgICAgICAgIFwicmVxdWVzdFwiOiAkdXRpbHMudG9Kc29uKCRjb250ZXh0LnJlcXVlc3QpLFxyXG4gICAgICAgICAgICAgICAgXCJwcmV2XCI6ICR1dGlscy50b0pzb24oJGNvbnRleHQucHJldiksXHJcbiAgICAgICAgICAgICAgICBcImluZm9cIjogJHV0aWxzLnRvSnNvbigkY29udGV4dC5pbmZvKSxcclxuICAgICAgICAgICAgICAgIFwic3Rhc2hcIjogJHV0aWxzLnRvSnNvbigkY29udGV4dC5zdGFzaCksXHJcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvblNldExpc3RcIjogJHV0aWxzLnRvSnNvbigkY29udGV4dC5pbmZvLnNlbGVjdGlvblNldExpc3QpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9YDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgZ3JhcGhxbEFwaTogYXBwc3luYy5HcmFwaHFsQXBpLFxyXG4gICAgICAgIHB1YmxpYyBkYXRhU291cmNlczogSURhdGFTb3VyY2UsXHJcbiAgICAgICAgcHVibGljIHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZVxyXG4gICAgKSB7IH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCkge1xyXG5cclxuICAgICAgICBhcHBzeW5jLkVudW1UeXBlO1xyXG4gICAgICAgIGFwcHN5bmMuVW5pb25UeXBlO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFBhZ2VJbmZvVHlwZSgpO1xyXG4gICAgICAgIHRoaXMuYWRkU29ydElucHV0KCk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5lbnVtVHlwZXMpLmZvckVhY2goZW51bVR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShlbnVtVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzKS5mb3JFYWNoKGlucHV0VHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGlucHV0VHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnRlcmZhY2VUeXBlcykuZm9yRWFjaChpbnRlcmZhY2VUeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW50ZXJmYWNlVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcykuZm9yRWFjaChvYmplY3RUeXBlID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9iamVjdChvYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0eXBlIHRvIEdyYXBoUUwuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKG9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcignb3BlcmF0aW9uJywgJ25hbWVzJywgb2JqZWN0VHlwZS5kaXJlY3RpdmVzKTtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25zLmluY2x1ZGVzKCdmaW5kJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEZpbmQob2JqZWN0VHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLnVuaW9uVHlwZXMpLmZvckVhY2godW5pb25UeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUodW5pb25UeXBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGUgb2JqZWN0IHR5cGUgZmllbGRzIGFuZCB1cGRhdGUgcmV0dXJuVHlwZSBvZiBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUgZnJvbSBzdHJpbmcgdHlwZSB0byBhY3R1YWwgdHlwZS5cclxuICAgICAqIFdoeT8gQXBwU3luYyByZXNvbHZhYmxlIGZpZWxkcyByZXF1aXJlIGEgZGF0YSB0eXBlLiBCdXQgdGhhdCBkYXRhIHR5cGUgbWF5IG5vdCBhbHJlYWR5IGV4aXN0IHlldC4gRm9yIGV4YW1wbGU6XHJcbiAgICAgKiAgIFBvc3Qgb2JqZWN0IHR5cGUgaGFzIGZpZWxkIGNvbW1lbnRzIGFuZCBDb21tZW50IG9iamVjdCB0eXBlIGhhcyBmaWVsZCBwb3N0LiBObyBtYXR0ZXIgd2hhdCBvcmRlciB0aGVzZSBvYmplY3QgdHlwZXMgYXJlIGNyZWF0ZWQgaW4sIGFuIG9iamVjdCB0eXBlIHdvbid0IGV4aXN0IHlldC5cclxuICAgICAqICAgSWYgY29tbWVudCBpcyBjcmVhdGVkIGZpcnN0LCB0aGVyZSBpcyBubyBjb21tZW50IG9iamVjdCB0eXBlLiBJZiBjb21tZW50IGlzIGNyZWF0ZWQgZmlyc3QsIHRoZXJlIGlzIG5vIHBvc3Qgb2JqZWN0IHR5cGUuXHJcbiAgICAgKiBUbyB3b3JrIGFyb3VuZCB0aGlzIGNoaWNrZW4gb3IgZWdnIGxpbWl0YXRpb24sIEpvbXB4IGRlZmluZXMgYSBjdXN0b20gdHlwZSB0aGF0IGFsbG93cyBhIHN0cmluZyB0eXBlIHRvIGJlIHNwZWNpZmllZC4gZS5nLlxyXG4gICAgICogICBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlKHsgb2JqZWN0VHlwZU5hbWU6ICdNUG9zdCcsIGlzTGlzdDogZmFsc2UgfSksXHJcbiAgICAgKiBUaGlzIG1ldGhvZCB1c2VzIHRoZSBzdHJpbmcgdHlwZSB0byBhZGQgYW4gYWN0dWFsIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQ2F1dGlvbjogQ2hhbmdlcyB0byBBcHBTeW5jIGltcGxlbWVudGF0aW9uIGRldGFpbHMgbWF5IGJyZWFrIHRoaXMgbWV0aG9kLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlc29sdmVPYmplY3Qob2JqZWN0VHlwZTogYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcblxyXG4gICAgICAgIC8vIEl0ZXJhdGUgb2JqZWN0IHR5cGUgZmllbGRzLlxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG9iamVjdFR5cGUuZGVmaW5pdGlvbikuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIElmIGZpZWxkIG9mIEpvbXB4R3JhcGhxbFR5cGUgdHlwZSAodGhlbiB1c2Ugc3RyaW5nIHR5cGUgdG8gYWRkIGFjdHVhbCB0eXBlKS5cclxuICAgICAgICAgICAgaWYgKHZhbHVlLmZpZWxkT3B0aW9ucz8ucmV0dXJuVHlwZSBpbnN0YW5jZW9mIEpvbXB4R3JhcGhxbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIFwib2xkXCIgZmllbGQgd2l0aCB0aGUgbmV3IFwiZmllbGRcIi5cclxuICAgICAgICAgICAgICAgIG9iamVjdFR5cGUuZGVmaW5pdGlvbltrZXldID0gQXBwU3luY1NjaGVtYS5yZXNvbHZlUmVzb2x2YWJsZUZpZWxkKHRoaXMuc2NoZW1hVHlwZXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzb2x2ZSBhbiBBcHBTeW5jIFJlc29sdmFibGVGaWVsZCB3aXRoIGEgSm9tcHhHcmFwaHFsVHlwZSAod2l0aCBzdHJpbmcgdHlwZSkgdG8gYSBSZXNvbHZhYmxlRmllbGQgd2l0aCBhIEdyYXBocWxUeXBlICh3aXRoIGFuIGFjdHVhbCB0eXBlKS5cclxuICAgICAqL1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9tZW1iZXItb3JkZXJpbmdcclxuICAgIHByaXZhdGUgc3RhdGljIHJlc29sdmVSZXNvbHZhYmxlRmllbGQoc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlLCByZXNvbHZhYmxlRmllbGQ6IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKTogUmVzb2x2YWJsZUZpZWxkIHtcclxuXHJcbiAgICAgICAgbGV0IHJ2ID0gcmVzb2x2YWJsZUZpZWxkO1xyXG5cclxuICAgICAgICBpZiAocmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucz8ucmV0dXJuVHlwZSBpbnN0YW5jZW9mIEpvbXB4R3JhcGhxbFR5cGUpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IEdyYXBoUUwgZGF0YXR5cGUgd2l0aCBhY3R1YWwgdHlwZS5cclxuICAgICAgICAgICAgY29uc3QgbmV3R3JhcGhxbFR5cGUgPSByZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zLnJldHVyblR5cGUucmVzb2x2ZShzY2hlbWFUeXBlcyk7XHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBleGlzdGluZyByZXNvbHZhYmxlIGZpZWxkIG9wdGlvbnMgXCJvbGRcIiBHcmFwaFFMIGRhdGF0eXBlIHdpdGggXCJuZXdcIiBHcmFwaFFMIGRhdGF0eXBlLlxyXG4gICAgICAgICAgICBzZXQocmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucywgJ3JldHVyblR5cGUnLCBuZXdHcmFwaHFsVHlwZSk7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgcmVzb2x2YWJsZSBmaWVsZCB3aXRoIG1vZGlmaWVkIHJlc29sdmFibGUgZmllbGQgb3B0aW9ucy5cclxuICAgICAgICAgICAgcnYgPSBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQocmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvZXhwbGFpbmluZy1ncmFwaHFsLWNvbm5lY3Rpb25zL1xyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZEZpbmQob2JqZWN0VHlwZTogYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IG9iamVjdFR5cGVOYW1lID0gb2JqZWN0VHlwZS5uYW1lO1xyXG4gICAgICAgIGNvbnN0IHBhZ2luYXRpb25UeXBlOiBQYWdpbmF0aW9uVHlwZSA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcigncGFnaW5hdGlvbicsICd0eXBlJywgb2JqZWN0VHlwZT8uZGlyZWN0aXZlcykgYXMgUGFnaW5hdGlvblR5cGUgPz8gJ29mZnNldCc7XHJcbiAgICAgICAgY29uc3QgZGF0YVNvdXJjZU5hbWUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIoJ2RhdGFzb3VyY2UnLCAnbmFtZScsIG9iamVjdFR5cGU/LmRpcmVjdGl2ZXMpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YVNvdXJjZU5hbWVcclxuICAgICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvclxyXG4gICAgICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvT2Zmc2V0XHJcbiAgICAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcy5Tb3J0SW5wdXRcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YVNvdXJjZTogYXBwc3luYy5MYW1iZGFEYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcblxyXG4gICAgICAgICAgICAvLyBFZGdlLlxyXG4gICAgICAgICAgICBjb25zdCBlZGdlT2JqZWN0VHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7b2JqZWN0VHlwZU5hbWV9RWRnZWAsIHtcclxuICAgICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAuLi4ocGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InKSAmJiB7IGN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sIC8vIElmIHBhZ2luYXRpb24gdHlwZSBjdXJzb3IgdGhlbiBpbmNsdWRlIHJlcXVpcmVkIGN1cnNvciBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgICBub2RlOiBvYmplY3RUeXBlLmF0dHJpYnV0ZSgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShlZGdlT2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDb25uZWN0aW9uLiBCYXNlZCBvbiByZWxheSBzcGVjaWZpY2F0aW9uOiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtQ29ubmVjdGlvbi1UeXBlc1xyXG4gICAgICAgICAgICBjb25zdCBjb25uZWN0aW9uT2JqZWN0VHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7b2JqZWN0VHlwZU5hbWV9Q29ubmVjdGlvbmAsIHtcclxuICAgICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlczogZWRnZU9iamVjdFR5cGUuYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VJbmZvOiBwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicgPyB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yLmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgOiB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvT2Zmc2V0LmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxDb3VudDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSAvLyBBcG9sbG8gc3VnZ2VzdHMgYWRkaW5nIGFzIGEgY29ubmVjdGlvbiBwcm9wZXJ0eTogaHR0cHM6Ly9ncmFwaHFsLm9yZy9sZWFybi9wYWdpbmF0aW9uL1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoY29ubmVjdGlvbk9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGRlZmF1bHQgcXVlcnkgYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBjb25zdCBhcmdzID0ge307XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgZmlsdGVyIGFyZ3VtZW50LlxyXG4gICAgICAgICAgICBzZXQoYXJncywgJ2ZpbHRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuYXdzSnNvbigpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBzb3J0IGFyZ3VtZW50LlxyXG4gICAgICAgICAgICBzZXQoYXJncywgJ3NvcnQnLCB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0LmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdvZmZzZXQnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ3NraXAnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnbGltaXQnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGN1cnNvciBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuICAgICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJykge1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdmaXJzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdhZnRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdsYXN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2JlZm9yZScsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgcXVlcnkuXHJcbiAgICAgICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgZmluZCR7b2JqZWN0VHlwZU5hbWVQbHVyYWx9YCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGAke3RoaXMub3BlcmF0aW9uTmFtZUZyb21UeXBlKG9iamVjdFR5cGVOYW1lKX1GaW5kYCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgICAgIHJldHVyblR5cGU6IGNvbm5lY3Rpb25PYmplY3RUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgICAgICAgICAgICAgYXJncyxcclxuICAgICAgICAgICAgICAgIGRhdGFTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHRoZSByZXF1ZXN0IG1hcHBpbmcgdG8gaW5qZWN0IHN0YXNoIHZhcmlhYmxlcyAoZm9yIHVzZSBpbiBMYW1iZGEgZnVuY3Rpb24pLlxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvcGVyYXRpb25cIiwgXCJmaW5kXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwidHlwZU5hbWVcIiwgXCIke29iamVjdFR5cGVOYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcInJldHVyblR5cGVOYW1lXCIsIFwiJHtjb25uZWN0aW9uT2JqZWN0VHlwZS5uYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICAgICAke0FwcFN5bmNTY2hlbWEucGlwZWxpbmVSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlfVxyXG4gICAgICAgICAgICAgICAgYClcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwYWdpbmF0aW9uIHBhZ2VJbmZvIHR5cGVzIGZvciBvZmZzZXQgYW5kIGN1cnNvciBiYXNlZCBwYWdpbmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEN1cnNvciBwYWdpbmF0aW9uLiBQYWdlIGFuZCBzb3J0IGJ5IHVuaXF1ZSBmaWVsZC4gQ29uY2F0ZW5hdGVkIGZpZWxkcyBjYW4gcmVzdWx0IGluIHBvb3IgcGVyZm9ybWFuY2UuXHJcbiAgICAgKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtQ29ubmVjdGlvbi1UeXBlc1xyXG4gICAgICogaHR0cHM6Ly9zaG9waWZ5LmVuZ2luZWVyaW5nL3BhZ2luYXRpb24tcmVsYXRpdmUtY3Vyc29yc1xyXG4gICAgICogaHR0cHM6Ly9tZWRpdW0uY29tL3N3bGgvaG93LXRvLWltcGxlbWVudC1jdXJzb3ItcGFnaW5hdGlvbi1saWtlLWEtcHJvLTUxMzE0MGI2NWYzMlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFBhZ2VJbmZvVHlwZSgpIHtcclxuXHJcbiAgICAgICAgLy8gT2Zmc2V0IHBhZ2luYXRpb24uXHJcbiAgICAgICAgY29uc3QgcGFnZUluZm9PZmZzZXQgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb09mZnNldCcsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgc2tpcDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldCA9IHBhZ2VJbmZvT2Zmc2V0O1xyXG5cclxuICAgICAgICAvLyBDdXJzb3IgcGFnaW5hdGlvbi5cclxuICAgICAgICBjb25zdCBwYWdlSW5mb0N1cnNvciA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ1BhZ2VJbmZvQ3Vyc29yJywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBoYXNQcmV2aW91c1BhZ2U6IGFwcHN5bmMuR3JhcGhxbFR5cGUuYm9vbGVhbih7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBoYXNOZXh0UGFnZTogYXBwc3luYy5HcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0Q3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBlbmRDdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvciA9IHBhZ2VJbmZvQ3Vyc29yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHNvcnQgaW5wdXQgdHlwZSBmb3IgbXVsdGkgY29sdW1uIHNvcnRpbmcuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkU29ydElucHV0KCkge1xyXG5cclxuICAgICAgICBjb25zdCBzb3J0SW5wdXQgPSBuZXcgYXBwc3luYy5JbnB1dFR5cGUoJ1NvcnRJbnB1dCcsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgZmllbGROYW1lOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dCA9IHNvcnRJbnB1dDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlLmcuIE1Qb3N0ID4gbXBvc3QsIE15U3FsUG9zdCA+IG15U3FsUG9zdCwgTXlQb3N0ID4gbXlQb3N0XHJcbiAgICBwcml2YXRlIG9wZXJhdGlvbk5hbWVGcm9tVHlwZShzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBzLmNoYXJBdCgwKS50b0xvY2FsZUxvd2VyQ2FzZSgpICsgcy5jaGFyQXQoMSkudG9Mb2NhbGVMb3dlckNhc2UoKSArIHMuc2xpY2UoMik7XHJcbiAgICB9XHJcbn1cclxuIl19