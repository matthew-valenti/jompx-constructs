"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncSchemaBuilder = void 0;
const appsync = require("@aws-cdk/aws-appsync-alpha");
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import pluralize = require('pluralize');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const set = require("set-value");
// import get = require('get-value');
const app_sync_types_1 = require("./app-sync.types");
const custom_directive_1 = require("./custom-directive");
const mysql_directive_1 = require("./datasources/mysql/mysql.directive");
const graphql_type_1 = require("./graphql-type");
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
        return dataSource;
    }
    addSchemaTypes(schemaTypes) {
        this.schemaTypes = { ...this.schemaTypes, ...schemaTypes };
    }
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
    addMutation({ name, dataSourceName, args, returnType, methodName }) {
        // TODO: Add schema types.
        var _a;
        // Check datasource exists.
        const dataSource = this.dataSources[dataSourceName];
        if (!dataSource)
            throw Error(`Jompx: dataSource "${dataSourceName}" not found!`);
        // Add input type (to GraphQL).
        const inputType = new appsync.InputType(`${changeCase.pascalCase(returnType.name)}Input`, { definition: args });
        this.graphqlApi.addType(inputType);
        // Add output type (to GraphQL).
        const outputType = new aws_appsync_alpha_1.ObjectType(`${changeCase.pascalCase(returnType.name)}Payload`, {
            definition: returnType.definition,
            directives: [
                appsync.Directive.iam(),
                appsync.Directive.cognito('admin')
            ]
        });
        this.graphqlApi.addType(outputType);
        // Add payload type (to GraphQL).
        const payloadType = new aws_appsync_alpha_1.ObjectType(`${changeCase.pascalCase(returnType.name)}Output`, {
            definition: {
                output: outputType.attribute()
            },
            directives: [...[appsync.Directive.iam(), appsync.Directive.cognito('admin')], ...((_a = returnType === null || returnType === void 0 ? void 0 : returnType.directives) !== null && _a !== void 0 ? _a : [])]
        });
        this.graphqlApi.addType(payloadType);
        // Add any child return types (to GraphQL).
        // TODO: Make recursive.
        Object.values(returnType.definition).forEach(graphqlType => {
            if (graphqlType.type === 'INTERMEDIATE') {
                if (graphqlType === null || graphqlType === void 0 ? void 0 : graphqlType.intermediateType) {
                    this.graphqlApi.addType(graphqlType.intermediateType);
                }
            }
        });
        // Add mutation (to GraphQL).
        return this.graphqlApi.addMutation(name, new appsync.ResolvableField({
            returnType: payloadType.attribute(),
            args: { input: inputType.attribute({ isRequired: true }) },
            dataSource,
            directives: [
                appsync.Directive.iam(),
                appsync.Directive.cognito('admin')
            ],
            // pipelineConfig: [], // TODO: Add authorization Lambda function here.
            requestMappingTemplate: appsync.MappingTemplate.fromString(`
                $util.qr($ctx.stash.put("operation", "${methodName}"))
                ${app_sync_types_1.DefaultRequestMappingTemplate}
            `)
        }));
    }
    create() {
        // this.graphqlApi.addToSchema('directive @readonly(value: String) on FIELD_DEFINITION');
        this.graphqlApi.addToSchema(custom_directive_1.CustomDirective.schema());
        this.graphqlApi.addToSchema(mysql_directive_1.AppSyncMySqlCustomDirective.schema());
        // TODO: Delete Me???
        // appsync.EnumType;
        // appsync.UnionType;
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
            const operations = custom_directive_1.CustomDirective.getArgumentByIdentifier('operations', 'names', objectType.directives);
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
                objectType.definition[key] = AppSyncSchemaBuilder.resolveResolvableField(this.schemaTypes, value);
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
                },
                directives: [
                    appsync.Directive.iam(),
                    appsync.Directive.cognito('admin')
                ]
            });
            this.graphqlApi.addType(edgeObjectType);
            // Connection. Based on relay specification: https://relay.dev/graphql/connections.htm#sec-Connection-Types
            const connectionObjectType = new appsync.ObjectType(`${objectTypeName}Connection`, {
                definition: {
                    edges: edgeObjectType.attribute({ isList: true }),
                    pageInfo: paginationType === 'cursor' ? this.schemaTypes.objectTypes.PageInfoCursor.attribute({ isRequired: true }) : this.schemaTypes.objectTypes.PageInfoOffset.attribute({ isRequired: true }),
                    totalCount: appsync.GraphqlType.int() // Apollo suggests adding as a connection property: https://graphql.org/learn/pagination/
                },
                directives: [
                    appsync.Directive.iam(),
                    appsync.Directive.cognito('admin')
                ]
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
            this.graphqlApi.addQuery(`${changeCase.camelCase(objectTypeName)}Find`, new appsync.ResolvableField({
                returnType: connectionObjectType.attribute(),
                args,
                dataSource,
                directives: [
                    appsync.Directive.iam(),
                    appsync.Directive.cognito('admin')
                ],
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
            },
            directives: [
                appsync.Directive.iam(),
                appsync.Directive.cognito('admin')
            ]
        });
        this.schemaTypes.objectTypes.PageInfoOffset = pageInfoOffset;
        // Cursor pagination.
        const pageInfoCursor = new appsync.ObjectType('PageInfoCursor', {
            definition: {
                hasPreviousPage: appsync.GraphqlType.boolean({ isRequired: true }),
                hasNextPage: appsync.GraphqlType.boolean({ isRequired: true }),
                startCursor: appsync.GraphqlType.string({ isRequired: true }),
                endCursor: appsync.GraphqlType.string({ isRequired: true })
            },
            directives: [
                appsync.Directive.iam(),
                appsync.Directive.cognito('admin')
            ]
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
}
exports.AppSyncSchemaBuilder = AppSyncSchemaBuilder;
/*
Consider:
type PaginationInfo {
  # Total number of pages
  totalPages: Int!

  # Total number of items
  totalItems: Int!

  # Current page number
  page: Int!

  # Number of items per page
  perPage: Int!

  # When paginating forwards, are there more items?
  hasNextPage: Boolean!

  # When paginating backwards, are there more items?
  hasPreviousPage: Boolean!
}
*/
/*
Does AppAysnc support this?
# A single line, type-level description
"Passenger details"
type Passenger {
  """  a multi-line description
  the id is general user id """
  id: ID!
  name: String!
  age: Int!
  address: String!
  "single line description: it is passenger id"
  passengerId: ID!
}
*/ 
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvc2NoZW1hLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQXNEO0FBQ3RELGtFQUF3RDtBQUV4RCw2REFBNkQ7QUFDN0QsMENBQTBDO0FBQzFDLGlFQUFpRTtBQUNqRSwyQ0FBMkM7QUFDM0MsaUVBQWlFO0FBQ2pFLGlDQUFrQztBQUNsQyxxQ0FBcUM7QUFDckMscURBQW1IO0FBQ25ILHlEQUFxRTtBQUNyRSx5RUFBa0Y7QUFDbEYsaURBQWtEO0FBa0RsRCxNQUFhLG9CQUFvQjtJQUs3QixZQUNXLFVBQThCO1FBQTlCLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBSmxDLGdCQUFXLEdBQWdCLEVBQUUsQ0FBQztRQUM5QixnQkFBVyxHQUFpQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBSXRILENBQUM7SUFFTCxtSEFBbUg7SUFDNUcsYUFBYSxDQUFDLEVBQVUsRUFBRSxjQUF3QyxFQUFFLE9BQW1DO1FBQzFHLE1BQU0sVUFBVSxHQUFHLG9CQUFvQixVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDbkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQztRQUNwRSxPQUFPLFVBQVUsQ0FBQztJQUN0QixDQUFDO0lBRU0sY0FBYyxDQUFDLFdBQXlC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O1lBQ2pELFVBQVUsRUFBRTtnQkFDUixTQUFTLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQzNELFNBQVMsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUMzRDtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDdEQsQ0FBQztDQU1KO0FBclVELG9EQXFVQztBQUdEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFxQkU7QUFHRjs7Ozs7Ozs7Ozs7Ozs7RUFjRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgeyBPYmplY3RUeXBlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG4vLyBpbXBvcnQgcGx1cmFsaXplID0gcmVxdWlyZSgncGx1cmFsaXplJyk7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbmltcG9ydCBzZXQgPSByZXF1aXJlKCdzZXQtdmFsdWUnKTtcclxuLy8gaW1wb3J0IGdldCA9IHJlcXVpcmUoJ2dldC12YWx1ZScpO1xyXG5pbXBvcnQgeyBJRGF0YVNvdXJjZSwgSVNjaGVtYVR5cGVzLCBEZWZhdWx0UmVxdWVzdE1hcHBpbmdUZW1wbGF0ZSwgSUFwcFN5bmNPcGVyYXRpb25BcmdzIH0gZnJvbSAnLi9hcHAtc3luYy50eXBlcyc7XHJcbmltcG9ydCB7IEN1c3RvbURpcmVjdGl2ZSwgUGFnaW5hdGlvblR5cGUgfSBmcm9tICcuL2N1c3RvbS1kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBBcHBTeW5jTXlTcWxDdXN0b21EaXJlY3RpdmUgfSBmcm9tICcuL2RhdGFzb3VyY2VzL215c3FsL215c3FsLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IEpvbXB4R3JhcGhxbFR5cGUgfSBmcm9tICcuL2dyYXBocWwtdHlwZSc7XHJcblxyXG4vKipcclxuICogQ3Vyc29yIEVkZ2UgTm9kZTogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2V4cGxhaW5pbmctZ3JhcGhxbC1jb25uZWN0aW9ucy9cclxuICogU3VwcG9ydCByZWxheSBvciBub3Q/XHJcbiAqIGh0dHBzOi8vbWVkaXVtLmNvbS9vcGVuLWdyYXBocWwvdXNpbmctcmVsYXktd2l0aC1hd3MtYXBwc3luYy01NWM4OWNhMDIwNjZcclxuICogSm9pbnMgc2hvdWxkIGJlIGNvbm5lY3Rpb25zIGFuZCBuYW1lZCBhcyBzdWNoLiBlLmcuIGluIHBvc3QgVGFnc0Nvbm5lY3Rpb25cclxuICogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLXVuZGVmaW5lZC5QYWdlSW5mb1xyXG4gKiBodHRwczovL2dyYXBocWwtcnVsZXMuY29tL3J1bGVzL2xpc3QtcGFnaW5hdGlvblxyXG4gKiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvYmFzaWNzL2Rlc2lnbmluZy1ncmFwaHFsLW11dGF0aW9ucy9cclxuICogLSBNdXRhdGlvbjogVXNlIHRvcCBsZXZlbCBpbnB1dCB0eXBlIGZvciBhZ3MuIFVzZSB0b3AgbGV2ZWwgcHJvcGVydHkgZm9yIG91dHB1dCB0eXBlLlxyXG4gKi9cclxuXHJcbi8vIFRPRE8gTWFrZSBzdXJlIHdlIGNhbiBjYWxsIGEgbXV0YXRpb24gYW5kIGNhbGwgYSBxdWVyeT8gaHR0cHM6Ly9ncmFwaHFsLXJ1bGVzLmNvbS9ydWxlcy9tdXRhdGlvbi1wYXlsb2FkLXF1ZXJ5XHJcbi8vIFRPRE8gQWRkIHNjaGVtYSBkb2N1bWVudGlvbiBtYXJrdXA6IGh0dHA6Ly9zcGVjLmdyYXBocWwub3JnL2RyYWZ0LyNzZWMtRGVzY3JpcHRpb25zXHJcbi8vIEludGVyZXN0aW5nIHR5cGVkIGVycm9yczogaHR0cHM6Ly9ncmFwaHFsLXJ1bGVzLmNvbS9ydWxlcy9tdXRhdGlvbi1wYXlsb2FkLWVycm9yc1xyXG5cclxuLypcclxudHlwZSBVc2VyRnJpZW5kc0Nvbm5lY3Rpb24ge1xyXG4gIHBhZ2VJbmZvOiBQYWdlSW5mbyFcclxuICBlZGdlczogW1VzZXJGcmllbmRzRWRnZV1cclxufXR5cGUgVXNlckZyaWVuZHNFZGdlIHtcclxuICBjdXJzb3I6IFN0cmluZyFcclxuICBub2RlOiBVc2VyXHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFkZE11dGF0aW9uQXJndW1lbnRzIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIG11dGF0aW9uIGFzIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBHcmFwaFFMIHNjaGVtYS5cclxuICAgICAqL1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbXV0YXRpb24gZGF0YXNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgZGF0YVNvdXJjZU5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogTXV0YXRpb24gaW5wdXQgYXJndW1lbnRzLiBUaGVzZSBzaG91bGQgZXhhY3RseSBtYXRjaCB0aGUgbnVtYmVyIGFuZCBvcmRlciBvZiBhcmd1bWVudHMgaW4gdGhlIG1ldGhvZCB0aGUgbXV0YXRpb24gd2lsbCBjYWxsLlxyXG4gICAgICovXHJcbiAgICBhcmdzOiBJQXBwU3luY09wZXJhdGlvbkFyZ3M7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBtdXRhdGlvbiByZXR1cm4gb2JqZWN0IHR5cGUuXHJcbiAgICAgKi9cclxuICAgIHJldHVyblR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG11dGF0aW9uIG1ldGhvZCB0byBjYWxsLlxyXG4gICAgICovXHJcbiAgICBtZXRob2ROYW1lPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwU3luY1NjaGVtYUJ1aWxkZXIge1xyXG5cclxuICAgIHB1YmxpYyBkYXRhU291cmNlczogSURhdGFTb3VyY2UgPSB7fTtcclxuICAgIHB1YmxpYyBzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzID0geyBlbnVtVHlwZXM6IHt9LCBpbnB1dFR5cGVzOiB7fSwgaW50ZXJmYWNlVHlwZXM6IHt9LCBvYmplY3RUeXBlczoge30sIHVuaW9uVHlwZXM6IHt9IH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIGdyYXBocWxBcGk6IGFwcHN5bmMuR3JhcGhxbEFwaVxyXG4gICAgKSB7IH1cclxuXHJcbiAgICAvLyBBZGQgZGF0YXNvdXJjZSB0byBBcHBTeW5jIGluIGFuIGludGVybmFsIGFycmF5LiBSZW1vdmUgdGhpcyB3aGVuIEFwcFN5bmMgcHJvdmlkZXMgYSB3YXkgdG8gaXRlcmF0ZSBkYXRhc291cmNlcykuXHJcbiAgICBwdWJsaWMgYWRkRGF0YVNvdXJjZShpZDogc3RyaW5nLCBsYW1iZGFGdW5jdGlvbjogY2RrLmF3c19sYW1iZGEuSUZ1bmN0aW9uLCBvcHRpb25zPzogYXBwc3luYy5EYXRhU291cmNlT3B0aW9ucyk6IGFwcHN5bmMuTGFtYmRhRGF0YVNvdXJjZSB7XHJcbiAgICAgICAgY29uc3QgaWRlbnRpZmllciA9IGBBcHBTeW5jRGF0YVNvdXJjZSR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKGlkKX1gO1xyXG4gICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmdyYXBocWxBcGkuYWRkTGFtYmRhRGF0YVNvdXJjZShpZGVudGlmaWVyLCBsYW1iZGFGdW5jdGlvbiwgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlcyA9IHsgLi4udGhpcy5kYXRhU291cmNlcywgLi4ueyBbaWRdOiBkYXRhU291cmNlIH0gfTtcclxuICAgICAgICByZXR1cm4gZGF0YVNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkU2NoZW1hVHlwZXMoc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlcykge1xyXG4gICAgICAgIHRoaXMuc2NoZW1hVHlwZXMgPSB7IC4uLnRoaXMuc2NoZW1hVHlwZXMsIC4uLnNjaGVtYVR5cGVzIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBtdXRhdGlvbiB0byB0aGUgR3JhcGhRTCBzY2hlbWEuXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAtIE5hbWUgb2YgdGhlIG11dGF0aW9uIGFzIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBHcmFwaFFMIHNjaGVtYS5cclxuICAgICAqIEBwYXJhbSBkYXRhU291cmNlTmFtZSAtIFlvdXIgZGF0YXNvdXJjZSBuYW1lIGUuZy4gbXlTcWwsIGNvZ25pdG8sIHBvc3QuXHJcbiAgICAgKiBAcGFyYW0gYXJncyAtIE11dGF0aW9uIGFyZ3VtZW50cy5cclxuICAgICAqIEBwYXJhbSByZXR1cm5UeXBlIC0gTXV0YXRpb24gcmV0dW4gdHlwZSAob3Igb3V0cHV0IHR5cGUpLlxyXG4gICAgICogQHBhcmFtIG9wZXJhdGlvbiAtIENsYXNzIG1ldGhvZCB0aGUgbXV0YXRpb24gd2lsbCBjYWxsIHRvIHJldHVuIHJlc3VsdC5cclxuICAgICAqIEByZXR1cm5zIC0gVGhlIG11dGF0aW9uLlxyXG4gICAgICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBtdXRhdGlvbiB0byB0aGUgR3JhcGhRTCBzY2hlbWEuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRNdXRhdGlvbih7IG5hbWUsIGRhdGFTb3VyY2VOYW1lLCBhcmdzLCByZXR1cm5UeXBlLCBtZXRob2ROYW1lIH06IElBZGRNdXRhdGlvbkFyZ3VtZW50cyk6IGFwcHN5bmMuT2JqZWN0VHlwZSB7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEFkZCBzY2hlbWEgdHlwZXMuXHJcblxyXG4gICAgICAgIC8vIENoZWNrIGRhdGFzb3VyY2UgZXhpc3RzLlxyXG4gICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmRhdGFTb3VyY2VzW2RhdGFTb3VyY2VOYW1lXTtcclxuICAgICAgICBpZiAoIWRhdGFTb3VyY2UpIHRocm93IEVycm9yKGBKb21weDogZGF0YVNvdXJjZSBcIiR7ZGF0YVNvdXJjZU5hbWV9XCIgbm90IGZvdW5kIWApO1xyXG5cclxuICAgICAgICAvLyBBZGQgaW5wdXQgdHlwZSAodG8gR3JhcGhRTCkuXHJcbiAgICAgICAgY29uc3QgaW5wdXRUeXBlID0gbmV3IGFwcHN5bmMuSW5wdXRUeXBlKGAke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShyZXR1cm5UeXBlLm5hbWUpfUlucHV0YCwgeyBkZWZpbml0aW9uOiBhcmdzIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGlucHV0VHlwZSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBvdXRwdXQgdHlwZSAodG8gR3JhcGhRTCkuXHJcbiAgICAgICAgY29uc3Qgb3V0cHV0VHlwZSA9IG5ldyBPYmplY3RUeXBlKGAke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShyZXR1cm5UeXBlLm5hbWUpfVBheWxvYWRgLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHJldHVyblR5cGUuZGVmaW5pdGlvbixcclxuICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuaWFtKCksXHJcbiAgICAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5jb2duaXRvKCdhZG1pbicpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShvdXRwdXRUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHBheWxvYWQgdHlwZSAodG8gR3JhcGhRTCkuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZFR5cGUgPSBuZXcgT2JqZWN0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocmV0dXJuVHlwZS5uYW1lKX1PdXRwdXRgLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0VHlwZS5hdHRyaWJ1dGUoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbLi4uW2FwcHN5bmMuRGlyZWN0aXZlLmlhbSgpLCBhcHBzeW5jLkRpcmVjdGl2ZS5jb2duaXRvKCdhZG1pbicpXSwgLi4uKHJldHVyblR5cGU/LmRpcmVjdGl2ZXMgPz8gW10pXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHBheWxvYWRUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGFueSBjaGlsZCByZXR1cm4gdHlwZXMgKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIC8vIFRPRE86IE1ha2UgcmVjdXJzaXZlLlxyXG4gICAgICAgIE9iamVjdC52YWx1ZXMocmV0dXJuVHlwZS5kZWZpbml0aW9uKS5mb3JFYWNoKGdyYXBocWxUeXBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGdyYXBocWxUeXBlLnR5cGUgPT09ICdJTlRFUk1FRElBVEUnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JhcGhxbFR5cGU/LmludGVybWVkaWF0ZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShncmFwaHFsVHlwZS5pbnRlcm1lZGlhdGVUeXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBZGQgbXV0YXRpb24gKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmdyYXBocWxBcGkuYWRkTXV0YXRpb24obmFtZSwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgcmV0dXJuVHlwZTogcGF5bG9hZFR5cGUuYXR0cmlidXRlKCksXHJcbiAgICAgICAgICAgIGFyZ3M6IHsgaW5wdXQ6IGlucHV0VHlwZS5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sXHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2UsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpLFxyXG4gICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib3BlcmF0aW9uXCIsIFwiJHttZXRob2ROYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICR7RGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAgICAgICAgIGApXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYSgnZGlyZWN0aXZlIEByZWFkb25seSh2YWx1ZTogU3RyaW5nKSBvbiBGSUVMRF9ERUZJTklUSU9OJyk7XHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKEN1c3RvbURpcmVjdGl2ZS5zY2hlbWEoKSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKEFwcFN5bmNNeVNxbEN1c3RvbURpcmVjdGl2ZS5zY2hlbWEoKSk7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IERlbGV0ZSBNZT8/P1xyXG4gICAgICAgIC8vIGFwcHN5bmMuRW51bVR5cGU7XHJcbiAgICAgICAgLy8gYXBwc3luYy5VbmlvblR5cGU7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkUGFnZUluZm9UeXBlKCk7XHJcbiAgICAgICAgdGhpcy5hZGRTb3J0SW5wdXQoKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLmVudW1UeXBlcykuZm9yRWFjaChlbnVtVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGVudW1UeXBlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMpLmZvckVhY2goaW5wdXRUeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW5wdXRUeXBlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLmludGVyZmFjZVR5cGVzKS5mb3JFYWNoKGludGVyZmFjZVR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnRlcmZhY2VUeXBlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzKS5mb3JFYWNoKG9iamVjdFR5cGUgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlT2JqZWN0KG9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHR5cGUgdG8gR3JhcGhRTC5cclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUob2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKCdvcGVyYXRpb25zJywgJ25hbWVzJywgb2JqZWN0VHlwZS5kaXJlY3RpdmVzKTtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25zLmluY2x1ZGVzKCdmaW5kJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEZpbmQob2JqZWN0VHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLnVuaW9uVHlwZXMpLmZvckVhY2godW5pb25UeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUodW5pb25UeXBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGUgb2JqZWN0IHR5cGUgZmllbGRzIGFuZCB1cGRhdGUgcmV0dXJuVHlwZSBvZiBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUgZnJvbSBzdHJpbmcgdHlwZSB0byBhY3R1YWwgdHlwZS5cclxuICAgICAqIFdoeT8gQXBwU3luYyByZXNvbHZhYmxlIGZpZWxkcyByZXF1aXJlIGEgZGF0YSB0eXBlLiBCdXQgdGhhdCBkYXRhIHR5cGUgbWF5IG5vdCBhbHJlYWR5IGV4aXN0IHlldC4gRm9yIGV4YW1wbGU6XHJcbiAgICAgKiAgIFBvc3Qgb2JqZWN0IHR5cGUgaGFzIGZpZWxkIGNvbW1lbnRzIGFuZCBDb21tZW50IG9iamVjdCB0eXBlIGhhcyBmaWVsZCBwb3N0LiBObyBtYXR0ZXIgd2hhdCBvcmRlciB0aGVzZSBvYmplY3QgdHlwZXMgYXJlIGNyZWF0ZWQgaW4sIGFuIG9iamVjdCB0eXBlIHdvbid0IGV4aXN0IHlldC5cclxuICAgICAqICAgSWYgY29tbWVudCBpcyBjcmVhdGVkIGZpcnN0LCB0aGVyZSBpcyBubyBjb21tZW50IG9iamVjdCB0eXBlLiBJZiBjb21tZW50IGlzIGNyZWF0ZWQgZmlyc3QsIHRoZXJlIGlzIG5vIHBvc3Qgb2JqZWN0IHR5cGUuXHJcbiAgICAgKiBUbyB3b3JrIGFyb3VuZCB0aGlzIGNoaWNrZW4gb3IgZWdnIGxpbWl0YXRpb24sIEpvbXB4IGRlZmluZXMgYSBjdXN0b20gdHlwZSB0aGF0IGFsbG93cyBhIHN0cmluZyB0eXBlIHRvIGJlIHNwZWNpZmllZC4gZS5nLlxyXG4gICAgICogICBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlKHsgb2JqZWN0VHlwZU5hbWU6ICdNUG9zdCcsIGlzTGlzdDogZmFsc2UgfSksXHJcbiAgICAgKiBUaGlzIG1ldGhvZCB1c2VzIHRoZSBzdHJpbmcgdHlwZSB0byBhZGQgYW4gYWN0dWFsIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQ2F1dGlvbjogQ2hhbmdlcyB0byBBcHBTeW5jIGltcGxlbWVudGF0aW9uIGRldGFpbHMgbWF5IGJyZWFrIHRoaXMgbWV0aG9kLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlc29sdmVPYmplY3Qob2JqZWN0VHlwZTogYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcblxyXG4gICAgICAgIC8vIEl0ZXJhdGUgb2JqZWN0IHR5cGUgZmllbGRzLlxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG9iamVjdFR5cGUuZGVmaW5pdGlvbikuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIElmIGZpZWxkIG9mIEpvbXB4R3JhcGhxbFR5cGUgdHlwZSAodGhlbiB1c2Ugc3RyaW5nIHR5cGUgdG8gYWRkIGFjdHVhbCB0eXBlKS5cclxuICAgICAgICAgICAgaWYgKHZhbHVlLmZpZWxkT3B0aW9ucz8ucmV0dXJuVHlwZSBpbnN0YW5jZW9mIEpvbXB4R3JhcGhxbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIFwib2xkXCIgZmllbGQgd2l0aCB0aGUgbmV3IFwiZmllbGRcIi5cclxuICAgICAgICAgICAgICAgIG9iamVjdFR5cGUuZGVmaW5pdGlvbltrZXldID0gQXBwU3luY1NjaGVtYUJ1aWxkZXIucmVzb2x2ZVJlc29sdmFibGVGaWVsZCh0aGlzLnNjaGVtYVR5cGVzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc29sdmUgYW4gQXBwU3luYyBSZXNvbHZhYmxlRmllbGQgd2l0aCBhIEpvbXB4R3JhcGhxbFR5cGUgKHdpdGggc3RyaW5nIHR5cGUpIHRvIGEgUmVzb2x2YWJsZUZpZWxkIHdpdGggYSBHcmFwaHFsVHlwZSAod2l0aCBhbiBhY3R1YWwgdHlwZSkuXHJcbiAgICAgKi9cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbWVtYmVyLW9yZGVyaW5nXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZXNvbHZlUmVzb2x2YWJsZUZpZWxkKHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZXMsIHJlc29sdmFibGVGaWVsZDogYXBwc3luYy5SZXNvbHZhYmxlRmllbGQpOiBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCB7XHJcblxyXG4gICAgICAgIGxldCBydiA9IHJlc29sdmFibGVGaWVsZDtcclxuXHJcbiAgICAgICAgaWYgKHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnM/LnJldHVyblR5cGUgaW5zdGFuY2VvZiBKb21weEdyYXBocWxUeXBlKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBHcmFwaFFMIGRhdGF0eXBlIHdpdGggYWN0dWFsIHR5cGUuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0dyYXBocWxUeXBlID0gcmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucy5yZXR1cm5UeXBlLnJlc29sdmUoc2NoZW1hVHlwZXMpO1xyXG4gICAgICAgICAgICAvLyBVcGRhdGUgZXhpc3RpbmcgcmVzb2x2YWJsZSBmaWVsZCBvcHRpb25zIFwib2xkXCIgR3JhcGhRTCBkYXRhdHlwZSB3aXRoIFwibmV3XCIgR3JhcGhRTCBkYXRhdHlwZS5cclxuICAgICAgICAgICAgc2V0KHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMsICdyZXR1cm5UeXBlJywgbmV3R3JhcGhxbFR5cGUpO1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IHJlc29sdmFibGUgZmllbGQgd2l0aCBtb2RpZmllZCByZXNvbHZhYmxlIGZpZWxkIG9wdGlvbnMuXHJcbiAgICAgICAgICAgIHJ2ID0gbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2V4cGxhaW5pbmctZ3JhcGhxbC1jb25uZWN0aW9ucy9cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRGaW5kKG9iamVjdFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICBjb25zdCBvYmplY3RUeXBlTmFtZSA9IG9iamVjdFR5cGUubmFtZTtcclxuICAgICAgICBjb25zdCBwYWdpbmF0aW9uVHlwZTogUGFnaW5hdGlvblR5cGUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIoJ3BhZ2luYXRpb24nLCAndHlwZScsIG9iamVjdFR5cGU/LmRpcmVjdGl2ZXMpIGFzIFBhZ2luYXRpb25UeXBlID8/ICdvZmZzZXQnO1xyXG4gICAgICAgIGNvbnN0IGRhdGFTb3VyY2VOYW1lID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKCdkYXRhc291cmNlJywgJ25hbWUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGFTb3VyY2VOYW1lXHJcbiAgICAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3JcclxuICAgICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldFxyXG4gICAgICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0XHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmRhdGFTb3VyY2VzW2RhdGFTb3VyY2VOYW1lXTtcclxuXHJcbiAgICAgICAgICAgIC8vIEVkZ2UuXHJcbiAgICAgICAgICAgIGNvbnN0IGVkZ2VPYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1FZGdlYCwge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLihwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicpICYmIHsgY3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgfSwgLy8gSWYgcGFnaW5hdGlvbiB0eXBlIGN1cnNvciB0aGVuIGluY2x1ZGUgcmVxdWlyZWQgY3Vyc29yIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IG9iamVjdFR5cGUuYXR0cmlidXRlKClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuaWFtKCksXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZWRnZU9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29ubmVjdGlvbi4gQmFzZWQgb24gcmVsYXkgc3BlY2lmaWNhdGlvbjogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLUNvbm5lY3Rpb24tVHlwZXNcclxuICAgICAgICAgICAgY29uc3QgY29ubmVjdGlvbk9iamVjdFR5cGUgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKGAke29iamVjdFR5cGVOYW1lfUNvbm5lY3Rpb25gLCB7XHJcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZXM6IGVkZ2VPYmplY3RUeXBlLmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBwYWdlSW5mbzogcGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InID8gdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvci5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIDogdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldC5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsQ291bnQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkgLy8gQXBvbGxvIHN1Z2dlc3RzIGFkZGluZyBhcyBhIGNvbm5lY3Rpb24gcHJvcGVydHk6IGh0dHBzOi8vZ3JhcGhxbC5vcmcvbGVhcm4vcGFnaW5hdGlvbi9cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuaWFtKCksXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoY29ubmVjdGlvbk9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGRlZmF1bHQgcXVlcnkgYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBjb25zdCBhcmdzID0ge307XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgZmlsdGVyIGFyZ3VtZW50LlxyXG4gICAgICAgICAgICBzZXQoYXJncywgJ2ZpbHRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuYXdzSnNvbigpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBzb3J0IGFyZ3VtZW50LlxyXG4gICAgICAgICAgICBzZXQoYXJncywgJ3NvcnQnLCB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0LmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdvZmZzZXQnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ3NraXAnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnbGltaXQnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGN1cnNvciBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuICAgICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJykge1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdmaXJzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdhZnRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdsYXN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2JlZm9yZScsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgcXVlcnkuXHJcbiAgICAgICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgZmluZCR7b2JqZWN0VHlwZU5hbWVQbHVyYWx9YCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGAke2NoYW5nZUNhc2UuY2FtZWxDYXNlKG9iamVjdFR5cGVOYW1lKX1GaW5kYCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgICAgIHJldHVyblR5cGU6IGNvbm5lY3Rpb25PYmplY3RUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgICAgICAgICAgICAgYXJncyxcclxuICAgICAgICAgICAgICAgIGRhdGFTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuaWFtKCksXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIC8vIHBpcGVsaW5lQ29uZmlnOiBbXSwgLy8gVE9ETzogQWRkIGF1dGhvcml6YXRpb24gTGFtYmRhIGZ1bmN0aW9uIGhlcmUuXHJcbiAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIHJlcXVlc3QgbWFwcGluZyB0byBpbmplY3Qgc3Rhc2ggdmFyaWFibGVzIChmb3IgdXNlIGluIExhbWJkYSBmdW5jdGlvbikuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcIm9wZXJhdGlvblwiLCBcImZpbmRcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvYmplY3RUeXBlTmFtZVwiLCBcIiR7b2JqZWN0VHlwZU5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwicmV0dXJuVHlwZU5hbWVcIiwgXCIke2Nvbm5lY3Rpb25PYmplY3RUeXBlLm5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR7RGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAgICAgICAgICAgICBgKVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHBhZ2luYXRpb24gcGFnZUluZm8gdHlwZXMgZm9yIG9mZnNldCBhbmQgY3Vyc29yIGJhc2VkIHBhZ2luYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQ3Vyc29yIHBhZ2luYXRpb24uIFBhZ2UgYW5kIHNvcnQgYnkgdW5pcXVlIGZpZWxkLiBDb25jYXRlbmF0ZWQgZmllbGRzIGNhbiByZXN1bHQgaW4gcG9vciBwZXJmb3JtYW5jZS5cclxuICAgICAqIGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy1Db25uZWN0aW9uLVR5cGVzXHJcbiAgICAgKiBodHRwczovL3Nob3BpZnkuZW5naW5lZXJpbmcvcGFnaW5hdGlvbi1yZWxhdGl2ZS1jdXJzb3JzXHJcbiAgICAgKiBodHRwczovL21lZGl1bS5jb20vc3dsaC9ob3ctdG8taW1wbGVtZW50LWN1cnNvci1wYWdpbmF0aW9uLWxpa2UtYS1wcm8tNTEzMTQwYjY1ZjMyXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkUGFnZUluZm9UeXBlKCkge1xyXG5cclxuICAgICAgICAvLyBPZmZzZXQgcGFnaW5hdGlvbi5cclxuICAgICAgICBjb25zdCBwYWdlSW5mb09mZnNldCA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ1BhZ2VJbmZvT2Zmc2V0Jywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBza2lwOiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpLFxyXG4gICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldCA9IHBhZ2VJbmZvT2Zmc2V0O1xyXG5cclxuICAgICAgICAvLyBDdXJzb3IgcGFnaW5hdGlvbi5cclxuICAgICAgICBjb25zdCBwYWdlSW5mb0N1cnNvciA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ1BhZ2VJbmZvQ3Vyc29yJywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBoYXNQcmV2aW91c1BhZ2U6IGFwcHN5bmMuR3JhcGhxbFR5cGUuYm9vbGVhbih7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBoYXNOZXh0UGFnZTogYXBwc3luYy5HcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0Q3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBlbmRDdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKSxcclxuICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3IgPSBwYWdlSW5mb0N1cnNvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBzb3J0IGlucHV0IHR5cGUgZm9yIG11bHRpIGNvbHVtbiBzb3J0aW5nLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFNvcnRJbnB1dCgpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgc29ydElucHV0ID0gbmV3IGFwcHN5bmMuSW5wdXRUeXBlKCdTb3J0SW5wdXQnLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcy5Tb3J0SW5wdXQgPSBzb3J0SW5wdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZS5nLiBNUG9zdCA+IG1wb3N0LCBNeVNxbFBvc3QgPiBteVNxbFBvc3QsIE15UG9zdCA+IG15UG9zdFxyXG4gICAgLy8gcHJpdmF0ZSBvcGVyYXRpb25OYW1lRnJvbVR5cGUoczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgIC8vICAgICByZXR1cm4gcy5jaGFyQXQoMCkudG9Mb2NhbGVMb3dlckNhc2UoKSArIHMuY2hhckF0KDEpLnRvTG9jYWxlTG93ZXJDYXNlKCkgKyBzLnNsaWNlKDIpO1xyXG4gICAgLy8gfVxyXG59XHJcblxyXG5cclxuLypcclxuQ29uc2lkZXI6XHJcbnR5cGUgUGFnaW5hdGlvbkluZm8ge1xyXG4gICMgVG90YWwgbnVtYmVyIG9mIHBhZ2VzXHJcbiAgdG90YWxQYWdlczogSW50IVxyXG5cclxuICAjIFRvdGFsIG51bWJlciBvZiBpdGVtc1xyXG4gIHRvdGFsSXRlbXM6IEludCFcclxuXHJcbiAgIyBDdXJyZW50IHBhZ2UgbnVtYmVyXHJcbiAgcGFnZTogSW50IVxyXG5cclxuICAjIE51bWJlciBvZiBpdGVtcyBwZXIgcGFnZVxyXG4gIHBlclBhZ2U6IEludCFcclxuXHJcbiAgIyBXaGVuIHBhZ2luYXRpbmcgZm9yd2FyZHMsIGFyZSB0aGVyZSBtb3JlIGl0ZW1zP1xyXG4gIGhhc05leHRQYWdlOiBCb29sZWFuIVxyXG5cclxuICAjIFdoZW4gcGFnaW5hdGluZyBiYWNrd2FyZHMsIGFyZSB0aGVyZSBtb3JlIGl0ZW1zP1xyXG4gIGhhc1ByZXZpb3VzUGFnZTogQm9vbGVhbiFcclxufVxyXG4qL1xyXG5cclxuXHJcbi8qXHJcbkRvZXMgQXBwQXlzbmMgc3VwcG9ydCB0aGlzP1xyXG4jIEEgc2luZ2xlIGxpbmUsIHR5cGUtbGV2ZWwgZGVzY3JpcHRpb25cclxuXCJQYXNzZW5nZXIgZGV0YWlsc1wiXHJcbnR5cGUgUGFzc2VuZ2VyIHtcclxuICBcIlwiXCIgIGEgbXVsdGktbGluZSBkZXNjcmlwdGlvblxyXG4gIHRoZSBpZCBpcyBnZW5lcmFsIHVzZXIgaWQgXCJcIlwiXHJcbiAgaWQ6IElEIVxyXG4gIG5hbWU6IFN0cmluZyFcclxuICBhZ2U6IEludCFcclxuICBhZGRyZXNzOiBTdHJpbmchXHJcbiAgXCJzaW5nbGUgbGluZSBkZXNjcmlwdGlvbjogaXQgaXMgcGFzc2VuZ2VyIGlkXCJcclxuICBwYXNzZW5nZXJJZDogSUQhXHJcbn1cclxuKi8iXX0=