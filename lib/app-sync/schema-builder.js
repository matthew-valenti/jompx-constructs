"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncSchemaBuilder = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
        // Check datasource exists.
        const dataSource = this.dataSources[dataSourceName];
        if (!dataSource)
            throw Error(`Jompx: dataSource "${dataSourceName}" not found!`);
        // Add input type (to GraphQL).
        const inputType = new appsync.InputType(`${returnType.name}Input`, { definition: args });
        this.graphqlApi.addType(inputType);
        // Add output type (to GraphQL).
        const outputType = new aws_appsync_alpha_1.ObjectType(`${returnType.name}Payload`, { definition: returnType.definition });
        this.graphqlApi.addType(outputType);
        // Add payload type (to GraphQL).
        const payloadType = new aws_appsync_alpha_1.ObjectType(`${returnType.name}Output`, {
            definition: {
                output: outputType.attribute()
            },
            directives: returnType === null || returnType === void 0 ? void 0 : returnType.directives
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
            // pipelineConfig: [], // TODO: Add authorization Lambda function here.
            requestMappingTemplate: appsync.MappingTemplate.fromString(`
                $util.qr($ctx.stash.put("operation", "${methodName}"))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvc2NoZW1hLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsa0VBQXdEO0FBRXhELDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsaUVBQWlFO0FBQ2pFLDJDQUEyQztBQUMzQyxpRUFBaUU7QUFDakUsaUNBQWtDO0FBQ2xDLHFDQUFxQztBQUNyQyxxREFBbUg7QUFDbkgseURBQXFFO0FBQ3JFLGlEQUFrRDtBQWtEbEQsTUFBYSxvQkFBb0I7SUFLN0IsWUFDVyxVQUE4QjtRQUE5QixlQUFVLEdBQVYsVUFBVSxDQUFvQjtRQUpsQyxnQkFBVyxHQUFnQixFQUFFLENBQUM7UUFDOUIsZ0JBQVcsR0FBaUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUl0SCxDQUFDO0lBRUwsbUhBQW1IO0lBQzVHLGFBQWEsQ0FBQyxFQUFVLEVBQUUsY0FBd0MsRUFBRSxPQUFtQztRQUMxRyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ25FLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUM7UUFDcEUsT0FBTyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUVNLGNBQWMsQ0FBQyxXQUF5QjtRQUMzQyxJQUFJ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Q0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDdEQsQ0FBQztJQUVELDZEQUE2RDtJQUNyRCxxQkFBcUIsQ0FBQyxDQUFTO1FBQ25DLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7O0FBalNMLG9EQWtTQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgeyBPYmplY3RUeXBlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG4vLyBpbXBvcnQgcGx1cmFsaXplID0gcmVxdWlyZSgncGx1cmFsaXplJyk7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbmltcG9ydCBzZXQgPSByZXF1aXJlKCdzZXQtdmFsdWUnKTtcclxuLy8gaW1wb3J0IGdldCA9IHJlcXVpcmUoJ2dldC12YWx1ZScpO1xyXG5pbXBvcnQgeyBJRGF0YVNvdXJjZSwgSVNjaGVtYVR5cGVzLCBEZWZhdWx0UmVxdWVzdE1hcHBpbmdUZW1wbGF0ZSwgSUFwcFN5bmNPcGVyYXRpb25BcmdzIH0gZnJvbSAnLi9hcHAtc3luYy50eXBlcyc7XHJcbmltcG9ydCB7IEN1c3RvbURpcmVjdGl2ZSwgUGFnaW5hdGlvblR5cGUgfSBmcm9tICcuL2N1c3RvbS1kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBKb21weEdyYXBocWxUeXBlIH0gZnJvbSAnLi9ncmFwaHFsLXR5cGUnO1xyXG5cclxuLyoqXHJcbiAqIEN1cnNvciBFZGdlIE5vZGU6IGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAqIFN1cHBvcnQgcmVsYXkgb3Igbm90P1xyXG4gKiBodHRwczovL21lZGl1bS5jb20vb3Blbi1ncmFwaHFsL3VzaW5nLXJlbGF5LXdpdGgtYXdzLWFwcHN5bmMtNTVjODljYTAyMDY2XHJcbiAqIEpvaW5zIHNob3VsZCBiZSBjb25uZWN0aW9ucyBhbmQgbmFtZWQgYXMgc3VjaC4gZS5nLiBpbiBwb3N0IFRhZ3NDb25uZWN0aW9uXHJcbiAqIGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy11bmRlZmluZWQuUGFnZUluZm9cclxuICogaHR0cHM6Ly9ncmFwaHFsLXJ1bGVzLmNvbS9ydWxlcy9saXN0LXBhZ2luYXRpb25cclxuICogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2Jhc2ljcy9kZXNpZ25pbmctZ3JhcGhxbC1tdXRhdGlvbnMvXHJcbiAqIC0gTXV0YXRpb246IFVzZSB0b3AgbGV2ZWwgaW5wdXQgdHlwZSBmb3IgYWdzLiBVc2UgdG9wIGxldmVsIHByb3BlcnR5IGZvciBvdXRwdXQgdHlwZS5cclxuICovXHJcblxyXG4vLyBUT0RPIE1ha2Ugc3VyZSB3ZSBjYW4gY2FsbCBhIG11dGF0aW9uIGFuZCBjYWxsIGEgcXVlcnk/IGh0dHBzOi8vZ3JhcGhxbC1ydWxlcy5jb20vcnVsZXMvbXV0YXRpb24tcGF5bG9hZC1xdWVyeVxyXG4vLyBUT0RPIEFkZCBzY2hlbWEgZG9jdW1lbnRpb24gbWFya3VwOiBodHRwOi8vc3BlYy5ncmFwaHFsLm9yZy9kcmFmdC8jc2VjLURlc2NyaXB0aW9uc1xyXG4vLyBJbnRlcmVzdGluZyB0eXBlZCBlcnJvcnM6IGh0dHBzOi8vZ3JhcGhxbC1ydWxlcy5jb20vcnVsZXMvbXV0YXRpb24tcGF5bG9hZC1lcnJvcnNcclxuXHJcbi8qXHJcbnR5cGUgVXNlckZyaWVuZHNDb25uZWN0aW9uIHtcclxuICBwYWdlSW5mbzogUGFnZUluZm8hXHJcbiAgZWRnZXM6IFtVc2VyRnJpZW5kc0VkZ2VdXHJcbn10eXBlIFVzZXJGcmllbmRzRWRnZSB7XHJcbiAgY3Vyc29yOiBTdHJpbmchXHJcbiAgbm9kZTogVXNlclxyXG59XHJcbiovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBZGRNdXRhdGlvbkFyZ3VtZW50cyB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBtdXRhdGlvbiBhcyBpdCB3aWxsIGFwcGVhciBpbiB0aGUgR3JhcGhRTCBzY2hlbWEuXHJcbiAgICAgKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG11dGF0aW9uIGRhdGFzb3VyY2UuXHJcbiAgICAgKi9cclxuICAgIGRhdGFTb3VyY2VOYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIE11dGF0aW9uIGlucHV0IGFyZ3VtZW50cy4gVGhlc2Ugc2hvdWxkIGV4YWN0bHkgbWF0Y2ggdGhlIG51bWJlciBhbmQgb3JkZXIgb2YgYXJndW1lbnRzIGluIHRoZSBtZXRob2QgdGhlIG11dGF0aW9uIHdpbGwgY2FsbC5cclxuICAgICAqL1xyXG4gICAgYXJnczogSUFwcFN5bmNPcGVyYXRpb25BcmdzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbXV0YXRpb24gcmV0dXJuIG9iamVjdCB0eXBlLlxyXG4gICAgICovXHJcbiAgICByZXR1cm5UeXBlOiBhcHBzeW5jLk9iamVjdFR5cGU7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBtdXRhdGlvbiBtZXRob2QgdG8gY2FsbC5cclxuICAgICAqL1xyXG4gICAgbWV0aG9kTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmNTY2hlbWFCdWlsZGVyIHtcclxuXHJcbiAgICBwdWJsaWMgZGF0YVNvdXJjZXM6IElEYXRhU291cmNlID0ge307XHJcbiAgICBwdWJsaWMgc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlcyA9IHsgZW51bVR5cGVzOiB7fSwgaW5wdXRUeXBlczoge30sIGludGVyZmFjZVR5cGVzOiB7fSwgb2JqZWN0VHlwZXM6IHt9LCB1bmlvblR5cGVzOiB7fSB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBncmFwaHFsQXBpOiBhcHBzeW5jLkdyYXBocWxBcGlcclxuICAgICkgeyB9XHJcblxyXG4gICAgLy8gQWRkIGRhdGFzb3VyY2UgdG8gQXBwU3luYyBpbiBhbiBpbnRlcm5hbCBhcnJheS4gUmVtb3ZlIHRoaXMgd2hlbiBBcHBTeW5jIHByb3ZpZGVzIGEgd2F5IHRvIGl0ZXJhdGUgZGF0YXNvdXJjZXMpLlxyXG4gICAgcHVibGljIGFkZERhdGFTb3VyY2UoaWQ6IHN0cmluZywgbGFtYmRhRnVuY3Rpb246IGNkay5hd3NfbGFtYmRhLklGdW5jdGlvbiwgb3B0aW9ucz86IGFwcHN5bmMuRGF0YVNvdXJjZU9wdGlvbnMpOiBhcHBzeW5jLkxhbWJkYURhdGFTb3VyY2Uge1xyXG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBgQXBwU3luY0RhdGFTb3VyY2Uke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShpZCl9YDtcclxuICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5ncmFwaHFsQXBpLmFkZExhbWJkYURhdGFTb3VyY2UoaWRlbnRpZmllciwgbGFtYmRhRnVuY3Rpb24sIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSB7IC4uLnRoaXMuZGF0YVNvdXJjZXMsIC4uLnsgW2lkXTogZGF0YVNvdXJjZSB9IH07XHJcbiAgICAgICAgcmV0dXJuIGRhdGFTb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFNjaGVtYVR5cGVzKHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZXMpIHtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzID0geyAuLi50aGlzLnNjaGVtYVR5cGVzLCAuLi5zY2hlbWFUeXBlcyB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbXV0YXRpb24gdG8gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICogQHBhcmFtIG5hbWUgLSBOYW1lIG9mIHRoZSBtdXRhdGlvbiBhcyBpdCB3aWxsIGFwcGVhciBpbiB0aGUgR3JhcGhRTCBzY2hlbWEuXHJcbiAgICAgKiBAcGFyYW0gZGF0YVNvdXJjZU5hbWUgLSBZb3VyIGRhdGFzb3VyY2UgbmFtZSBlLmcuIG15U3FsLCBjb2duaXRvLCBwb3N0LlxyXG4gICAgICogQHBhcmFtIGFyZ3MgLSBNdXRhdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgKiBAcGFyYW0gcmV0dXJuVHlwZSAtIE11dGF0aW9uIHJldHVuIHR5cGUgKG9yIG91dHB1dCB0eXBlKS5cclxuICAgICAqIEBwYXJhbSBvcGVyYXRpb24gLSBDbGFzcyBtZXRob2QgdGhlIG11dGF0aW9uIHdpbGwgY2FsbCB0byByZXR1biByZXN1bHQuXHJcbiAgICAgKiBAcmV0dXJucyAtIFRoZSBtdXRhdGlvbi5cclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbXV0YXRpb24gdG8gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkTXV0YXRpb24oeyBuYW1lLCBkYXRhU291cmNlTmFtZSwgYXJncywgcmV0dXJuVHlwZSwgbWV0aG9kTmFtZSB9OiBJQWRkTXV0YXRpb25Bcmd1bWVudHMpOiBhcHBzeW5jLk9iamVjdFR5cGUge1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBBZGQgc2NoZW1hIHR5cGVzLlxyXG5cclxuICAgICAgICAvLyBDaGVjayBkYXRhc291cmNlIGV4aXN0cy5cclxuICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcbiAgICAgICAgaWYgKCFkYXRhU291cmNlKSB0aHJvdyBFcnJvcihgSm9tcHg6IGRhdGFTb3VyY2UgXCIke2RhdGFTb3VyY2VOYW1lfVwiIG5vdCBmb3VuZCFgKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGlucHV0IHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIGNvbnN0IGlucHV0VHlwZSA9IG5ldyBhcHBzeW5jLklucHV0VHlwZShgJHtyZXR1cm5UeXBlLm5hbWV9SW5wdXRgLCB7IGRlZmluaXRpb246IGFyZ3MgfSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW5wdXRUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIG91dHB1dCB0eXBlICh0byBHcmFwaFFMKS5cclxuICAgICAgICBjb25zdCBvdXRwdXRUeXBlID0gbmV3IE9iamVjdFR5cGUoYCR7cmV0dXJuVHlwZS5uYW1lfVBheWxvYWRgLCB7IGRlZmluaXRpb246IHJldHVyblR5cGUuZGVmaW5pdGlvbiB9KTtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShvdXRwdXRUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHBheWxvYWQgdHlwZSAodG8gR3JhcGhRTCkuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZFR5cGUgPSBuZXcgT2JqZWN0VHlwZShgJHtyZXR1cm5UeXBlLm5hbWV9T3V0cHV0YCwge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IG91dHB1dFR5cGUuYXR0cmlidXRlKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlyZWN0aXZlczogcmV0dXJuVHlwZT8uZGlyZWN0aXZlc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHBheWxvYWRUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGFueSBjaGlsZCByZXR1cm4gdHlwZXMgKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIC8vIFRPRE86IE1ha2UgcmVjdXJzaXZlLlxyXG4gICAgICAgIE9iamVjdC52YWx1ZXMocmV0dXJuVHlwZS5kZWZpbml0aW9uKS5mb3JFYWNoKGdyYXBocWxUeXBlID0+IHtcclxuICAgICAgICAgICAgaWYgKGdyYXBocWxUeXBlLnR5cGUgPT09ICdJTlRFUk1FRElBVEUnKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JhcGhxbFR5cGU/LmludGVybWVkaWF0ZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShncmFwaHFsVHlwZS5pbnRlcm1lZGlhdGVUeXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBBZGQgbXV0YXRpb24gKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmdyYXBocWxBcGkuYWRkTXV0YXRpb24obmFtZSwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgcmV0dXJuVHlwZTogcGF5bG9hZFR5cGUuYXR0cmlidXRlKCksXHJcbiAgICAgICAgICAgIGFyZ3M6IHsgaW5wdXQ6IGlucHV0VHlwZS5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sXHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2UsXHJcbiAgICAgICAgICAgIC8vIHBpcGVsaW5lQ29uZmlnOiBbXSwgLy8gVE9ETzogQWRkIGF1dGhvcml6YXRpb24gTGFtYmRhIGZ1bmN0aW9uIGhlcmUuXHJcbiAgICAgICAgICAgIHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IGFwcHN5bmMuTWFwcGluZ1RlbXBsYXRlLmZyb21TdHJpbmcoYFxyXG4gICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvcGVyYXRpb25cIiwgXCIke21ldGhvZE5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgJHtEZWZhdWx0UmVxdWVzdE1hcHBpbmdUZW1wbGF0ZX1cclxuICAgICAgICAgICAgYClcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZSgpIHtcclxuXHJcbiAgICAgICAgYXBwc3luYy5FbnVtVHlwZTtcclxuICAgICAgICBhcHBzeW5jLlVuaW9uVHlwZTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRQYWdlSW5mb1R5cGUoKTtcclxuICAgICAgICB0aGlzLmFkZFNvcnRJbnB1dCgpO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMuZW51bVR5cGVzKS5mb3JFYWNoKGVudW1UeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZW51bVR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcykuZm9yRWFjaChpbnB1dFR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnB1dFR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMuaW50ZXJmYWNlVHlwZXMpLmZvckVhY2goaW50ZXJmYWNlVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGludGVyZmFjZVR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMpLmZvckVhY2gob2JqZWN0VHlwZSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVPYmplY3Qob2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgdHlwZSB0byBHcmFwaFFMLlxyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShvYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBDdXN0b21EaXJlY3RpdmUuZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIoJ29wZXJhdGlvbicsICduYW1lcycsIG9iamVjdFR5cGUuZGlyZWN0aXZlcyk7XHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9ucy5pbmNsdWRlcygnZmluZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRGaW5kKG9iamVjdFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy51bmlvblR5cGVzKS5mb3JFYWNoKHVuaW9uVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHVuaW9uVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcyBhbmQgdXBkYXRlIHJldHVyblR5cGUgb2YgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIGZyb20gc3RyaW5nIHR5cGUgdG8gYWN0dWFsIHR5cGUuXHJcbiAgICAgKiBXaHk/IEFwcFN5bmMgcmVzb2x2YWJsZSBmaWVsZHMgcmVxdWlyZSBhIGRhdGEgdHlwZS4gQnV0IHRoYXQgZGF0YSB0eXBlIG1heSBub3QgYWxyZWFkeSBleGlzdCB5ZXQuIEZvciBleGFtcGxlOlxyXG4gICAgICogICBQb3N0IG9iamVjdCB0eXBlIGhhcyBmaWVsZCBjb21tZW50cyBhbmQgQ29tbWVudCBvYmplY3QgdHlwZSBoYXMgZmllbGQgcG9zdC4gTm8gbWF0dGVyIHdoYXQgb3JkZXIgdGhlc2Ugb2JqZWN0IHR5cGVzIGFyZSBjcmVhdGVkIGluLCBhbiBvYmplY3QgdHlwZSB3b24ndCBleGlzdCB5ZXQuXHJcbiAgICAgKiAgIElmIGNvbW1lbnQgaXMgY3JlYXRlZCBmaXJzdCwgdGhlcmUgaXMgbm8gY29tbWVudCBvYmplY3QgdHlwZS4gSWYgY29tbWVudCBpcyBjcmVhdGVkIGZpcnN0LCB0aGVyZSBpcyBubyBwb3N0IG9iamVjdCB0eXBlLlxyXG4gICAgICogVG8gd29yayBhcm91bmQgdGhpcyBjaGlja2VuIG9yIGVnZyBsaW1pdGF0aW9uLCBKb21weCBkZWZpbmVzIGEgY3VzdG9tIHR5cGUgdGhhdCBhbGxvd3MgYSBzdHJpbmcgdHlwZSB0byBiZSBzcGVjaWZpZWQuIGUuZy5cclxuICAgICAqICAgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIEpvbXB4R3JhcGhxbFR5cGUub2JqZWN0VHlwZSh7IG9iamVjdFR5cGVOYW1lOiAnTVBvc3QnLCBpc0xpc3Q6IGZhbHNlIH0pLFxyXG4gICAgICogVGhpcyBtZXRob2QgdXNlcyB0aGUgc3RyaW5nIHR5cGUgdG8gYWRkIGFuIGFjdHVhbCB0eXBlLlxyXG4gICAgICpcclxuICAgICAqIENhdXRpb246IENoYW5nZXMgdG8gQXBwU3luYyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIG1heSBicmVhayB0aGlzIG1ldGhvZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZXNvbHZlT2JqZWN0KG9iamVjdFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICAvLyBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcy5cclxuICAgICAgICBPYmplY3QuZW50cmllcyhvYmplY3RUeXBlLmRlZmluaXRpb24pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBJZiBmaWVsZCBvZiBKb21weEdyYXBocWxUeXBlIHR5cGUgKHRoZW4gdXNlIHN0cmluZyB0eXBlIHRvIGFkZCBhY3R1YWwgdHlwZSkuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5maWVsZE9wdGlvbnM/LnJldHVyblR5cGUgaW5zdGFuY2VvZiBKb21weEdyYXBocWxUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBcIm9sZFwiIGZpZWxkIHdpdGggdGhlIG5ldyBcImZpZWxkXCIuXHJcbiAgICAgICAgICAgICAgICBvYmplY3RUeXBlLmRlZmluaXRpb25ba2V5XSA9IEFwcFN5bmNTY2hlbWFCdWlsZGVyLnJlc29sdmVSZXNvbHZhYmxlRmllbGQodGhpcy5zY2hlbWFUeXBlcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNvbHZlIGFuIEFwcFN5bmMgUmVzb2x2YWJsZUZpZWxkIHdpdGggYSBKb21weEdyYXBocWxUeXBlICh3aXRoIHN0cmluZyB0eXBlKSB0byBhIFJlc29sdmFibGVGaWVsZCB3aXRoIGEgR3JhcGhxbFR5cGUgKHdpdGggYW4gYWN0dWFsIHR5cGUpLlxyXG4gICAgICovXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L21lbWJlci1vcmRlcmluZ1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVzb2x2ZVJlc29sdmFibGVGaWVsZChzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzLCByZXNvbHZhYmxlRmllbGQ6IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKTogYXBwc3luYy5SZXNvbHZhYmxlRmllbGQge1xyXG5cclxuICAgICAgICBsZXQgcnYgPSByZXNvbHZhYmxlRmllbGQ7XHJcblxyXG4gICAgICAgIGlmIChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zPy5yZXR1cm5UeXBlIGluc3RhbmNlb2YgSm9tcHhHcmFwaHFsVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgR3JhcGhRTCBkYXRhdHlwZSB3aXRoIGFjdHVhbCB0eXBlLlxyXG4gICAgICAgICAgICBjb25zdCBuZXdHcmFwaHFsVHlwZSA9IHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMucmV0dXJuVHlwZS5yZXNvbHZlKHNjaGVtYVR5cGVzKTtcclxuICAgICAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIHJlc29sdmFibGUgZmllbGQgb3B0aW9ucyBcIm9sZFwiIEdyYXBoUUwgZGF0YXR5cGUgd2l0aCBcIm5ld1wiIEdyYXBoUUwgZGF0YXR5cGUuXHJcbiAgICAgICAgICAgIHNldChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zLCAncmV0dXJuVHlwZScsIG5ld0dyYXBocWxUeXBlKTtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyByZXNvbHZhYmxlIGZpZWxkIHdpdGggbW9kaWZpZWQgcmVzb2x2YWJsZSBmaWVsZCBvcHRpb25zLlxyXG4gICAgICAgICAgICBydiA9IG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkRmluZChvYmplY3RUeXBlOiBhcHBzeW5jLk9iamVjdFR5cGUpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqZWN0VHlwZU5hbWUgPSBvYmplY3RUeXBlLm5hbWU7XHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvblR5cGU6IFBhZ2luYXRpb25UeXBlID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKCdwYWdpbmF0aW9uJywgJ3R5cGUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKSBhcyBQYWdpbmF0aW9uVHlwZSA/PyAnb2Zmc2V0JztcclxuICAgICAgICBjb25zdCBkYXRhU291cmNlTmFtZSA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcignZGF0YXNvdXJjZScsICduYW1lJywgb2JqZWN0VHlwZT8uZGlyZWN0aXZlcyk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhU291cmNlTmFtZVxyXG4gICAgICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yXHJcbiAgICAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXRcclxuICAgICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcblxyXG4gICAgICAgICAgICAvLyBFZGdlLlxyXG4gICAgICAgICAgICBjb25zdCBlZGdlT2JqZWN0VHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7b2JqZWN0VHlwZU5hbWV9RWRnZWAsIHtcclxuICAgICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAuLi4ocGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InKSAmJiB7IGN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sIC8vIElmIHBhZ2luYXRpb24gdHlwZSBjdXJzb3IgdGhlbiBpbmNsdWRlIHJlcXVpcmVkIGN1cnNvciBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgICBub2RlOiBvYmplY3RUeXBlLmF0dHJpYnV0ZSgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShlZGdlT2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDb25uZWN0aW9uLiBCYXNlZCBvbiByZWxheSBzcGVjaWZpY2F0aW9uOiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtQ29ubmVjdGlvbi1UeXBlc1xyXG4gICAgICAgICAgICBjb25zdCBjb25uZWN0aW9uT2JqZWN0VHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7b2JqZWN0VHlwZU5hbWV9Q29ubmVjdGlvbmAsIHtcclxuICAgICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICBlZGdlczogZWRnZU9iamVjdFR5cGUuYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VJbmZvOiBwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicgPyB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yLmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgOiB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvT2Zmc2V0LmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxDb3VudDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSAvLyBBcG9sbG8gc3VnZ2VzdHMgYWRkaW5nIGFzIGEgY29ubmVjdGlvbiBwcm9wZXJ0eTogaHR0cHM6Ly9ncmFwaHFsLm9yZy9sZWFybi9wYWdpbmF0aW9uL1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoY29ubmVjdGlvbk9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGRlZmF1bHQgcXVlcnkgYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBjb25zdCBhcmdzID0ge307XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgZmlsdGVyIGFyZ3VtZW50LlxyXG4gICAgICAgICAgICBzZXQoYXJncywgJ2ZpbHRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuYXdzSnNvbigpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBzb3J0IGFyZ3VtZW50LlxyXG4gICAgICAgICAgICBzZXQoYXJncywgJ3NvcnQnLCB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0LmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdvZmZzZXQnKSB7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ3NraXAnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnbGltaXQnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGN1cnNvciBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuICAgICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJykge1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdmaXJzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdhZnRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdsYXN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2JlZm9yZScsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgcXVlcnkuXHJcbiAgICAgICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgZmluZCR7b2JqZWN0VHlwZU5hbWVQbHVyYWx9YCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGAke3RoaXMub3BlcmF0aW9uTmFtZUZyb21UeXBlKG9iamVjdFR5cGVOYW1lKX1GaW5kYCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgICAgIHJldHVyblR5cGU6IGNvbm5lY3Rpb25PYmplY3RUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgICAgICAgICAgICAgYXJncyxcclxuICAgICAgICAgICAgICAgIGRhdGFTb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHRoZSByZXF1ZXN0IG1hcHBpbmcgdG8gaW5qZWN0IHN0YXNoIHZhcmlhYmxlcyAoZm9yIHVzZSBpbiBMYW1iZGEgZnVuY3Rpb24pLlxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvcGVyYXRpb25cIiwgXCJmaW5kXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib2JqZWN0VHlwZU5hbWVcIiwgXCIke29iamVjdFR5cGVOYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcInJldHVyblR5cGVOYW1lXCIsIFwiJHtjb25uZWN0aW9uT2JqZWN0VHlwZS5uYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICAgICAke0RlZmF1bHRSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlfVxyXG4gICAgICAgICAgICAgICAgYClcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwYWdpbmF0aW9uIHBhZ2VJbmZvIHR5cGVzIGZvciBvZmZzZXQgYW5kIGN1cnNvciBiYXNlZCBwYWdpbmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEN1cnNvciBwYWdpbmF0aW9uLiBQYWdlIGFuZCBzb3J0IGJ5IHVuaXF1ZSBmaWVsZC4gQ29uY2F0ZW5hdGVkIGZpZWxkcyBjYW4gcmVzdWx0IGluIHBvb3IgcGVyZm9ybWFuY2UuXHJcbiAgICAgKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtQ29ubmVjdGlvbi1UeXBlc1xyXG4gICAgICogaHR0cHM6Ly9zaG9waWZ5LmVuZ2luZWVyaW5nL3BhZ2luYXRpb24tcmVsYXRpdmUtY3Vyc29yc1xyXG4gICAgICogaHR0cHM6Ly9tZWRpdW0uY29tL3N3bGgvaG93LXRvLWltcGxlbWVudC1jdXJzb3ItcGFnaW5hdGlvbi1saWtlLWEtcHJvLTUxMzE0MGI2NWYzMlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFBhZ2VJbmZvVHlwZSgpIHtcclxuXHJcbiAgICAgICAgLy8gT2Zmc2V0IHBhZ2luYXRpb24uXHJcbiAgICAgICAgY29uc3QgcGFnZUluZm9PZmZzZXQgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb09mZnNldCcsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgc2tpcDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldCA9IHBhZ2VJbmZvT2Zmc2V0O1xyXG5cclxuICAgICAgICAvLyBDdXJzb3IgcGFnaW5hdGlvbi5cclxuICAgICAgICBjb25zdCBwYWdlSW5mb0N1cnNvciA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ1BhZ2VJbmZvQ3Vyc29yJywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBoYXNQcmV2aW91c1BhZ2U6IGFwcHN5bmMuR3JhcGhxbFR5cGUuYm9vbGVhbih7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBoYXNOZXh0UGFnZTogYXBwc3luYy5HcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0Q3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBlbmRDdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvciA9IHBhZ2VJbmZvQ3Vyc29yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHNvcnQgaW5wdXQgdHlwZSBmb3IgbXVsdGkgY29sdW1uIHNvcnRpbmcuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkU29ydElucHV0KCkge1xyXG5cclxuICAgICAgICBjb25zdCBzb3J0SW5wdXQgPSBuZXcgYXBwc3luYy5JbnB1dFR5cGUoJ1NvcnRJbnB1dCcsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgZmllbGROYW1lOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dCA9IHNvcnRJbnB1dDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBlLmcuIE1Qb3N0ID4gbXBvc3QsIE15U3FsUG9zdCA+IG15U3FsUG9zdCwgTXlQb3N0ID4gbXlQb3N0XHJcbiAgICBwcml2YXRlIG9wZXJhdGlvbk5hbWVGcm9tVHlwZShzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBzLmNoYXJBdCgwKS50b0xvY2FsZUxvd2VyQ2FzZSgpICsgcy5jaGFyQXQoMSkudG9Mb2NhbGVMb3dlckNhc2UoKSArIHMuc2xpY2UoMik7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4vKlxyXG5Db25zaWRlcjpcclxudHlwZSBQYWdpbmF0aW9uSW5mbyB7XHJcbiAgIyBUb3RhbCBudW1iZXIgb2YgcGFnZXNcclxuICB0b3RhbFBhZ2VzOiBJbnQhXHJcblxyXG4gICMgVG90YWwgbnVtYmVyIG9mIGl0ZW1zXHJcbiAgdG90YWxJdGVtczogSW50IVxyXG5cclxuICAjIEN1cnJlbnQgcGFnZSBudW1iZXJcclxuICBwYWdlOiBJbnQhXHJcblxyXG4gICMgTnVtYmVyIG9mIGl0ZW1zIHBlciBwYWdlXHJcbiAgcGVyUGFnZTogSW50IVxyXG5cclxuICAjIFdoZW4gcGFnaW5hdGluZyBmb3J3YXJkcywgYXJlIHRoZXJlIG1vcmUgaXRlbXM/XHJcbiAgaGFzTmV4dFBhZ2U6IEJvb2xlYW4hXHJcblxyXG4gICMgV2hlbiBwYWdpbmF0aW5nIGJhY2t3YXJkcywgYXJlIHRoZXJlIG1vcmUgaXRlbXM/XHJcbiAgaGFzUHJldmlvdXNQYWdlOiBCb29sZWFuIVxyXG59XHJcbiovXHJcblxyXG5cclxuLypcclxuRG9lcyBBcHBBeXNuYyBzdXBwb3J0IHRoaXM/XHJcbiMgQSBzaW5nbGUgbGluZSwgdHlwZS1sZXZlbCBkZXNjcmlwdGlvblxyXG5cIlBhc3NlbmdlciBkZXRhaWxzXCJcclxudHlwZSBQYXNzZW5nZXIge1xyXG4gIFwiXCJcIiAgYSBtdWx0aS1saW5lIGRlc2NyaXB0aW9uXHJcbiAgdGhlIGlkIGlzIGdlbmVyYWwgdXNlciBpZCBcIlwiXCJcclxuICBpZDogSUQhXHJcbiAgbmFtZTogU3RyaW5nIVxyXG4gIGFnZTogSW50IVxyXG4gIGFkZHJlc3M6IFN0cmluZyFcclxuICBcInNpbmdsZSBsaW5lIGRlc2NyaXB0aW9uOiBpdCBpcyBwYXNzZW5nZXIgaWRcIlxyXG4gIHBhc3NlbmdlcklkOiBJRCFcclxufVxyXG4qLyJdfQ==