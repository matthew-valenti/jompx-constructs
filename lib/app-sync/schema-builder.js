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
        var _b;
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
            directives: [...[appsync.Directive.iam(), appsync.Directive.cognito('admin')], ...((_b = returnType === null || returnType === void 0 ? void 0 : returnType.directives) !== null && _b !== void 0 ? _b : [])]
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
_a = JSII_RTTI_SYMBOL_1;
AppSyncSchemaBuilder[_a] = { fqn: "@jompx/constructs.AppSyncSchemaBuilder", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvc2NoZW1hLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsa0VBQXdEO0FBRXhELDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsaUVBQWlFO0FBQ2pFLDJDQUEyQztBQUMzQyxpRUFBaUU7QUFDakUsaUNBQWtDO0FBQ2xDLHFDQUFxQztBQUNyQyxxREFBbUg7QUFDbkgseURBQXFFO0FBQ3JFLHlFQUFrRjtBQUNsRixpREFBa0Q7QUFrRGxELE1BQWEsb0JBQW9CO0lBSzdCLFlBQ1csVUFBOEI7UUFBOUIsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFKbEMsZ0JBQVcsR0FBZ0IsRUFBRSxDQUFDO1FBQzlCLGdCQUFXLEdBQWlCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFJdEgsQ0FBQztJQUVMLG1IQUFtSDtJQUM1RyxhQUFhLENBQUMsRUFBVSxFQUFFLGNBQXdDLEVBQUUsT0FBbUM7UUFDMUcsTUFBTSxVQUFVLEdBQUcsb0JBQW9CLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNuRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDO1FBQ3BFLE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxjQUFjLENBQUMsV0FB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QUU7WUFDakQsVUFBVSxFQUFFO2dCQUNSLFNBQVMsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztnQkFDM0QsU0FBUyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO2FBQzNEO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUN0RCxDQUFDOztBQS9UTCxvREFxVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuaW1wb3J0IHsgT2JqZWN0VHlwZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuLy8gaW1wb3J0IHBsdXJhbGl6ZSA9IHJlcXVpcmUoJ3BsdXJhbGl6ZScpO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG5pbXBvcnQgc2V0ID0gcmVxdWlyZSgnc2V0LXZhbHVlJyk7XHJcbi8vIGltcG9ydCBnZXQgPSByZXF1aXJlKCdnZXQtdmFsdWUnKTtcclxuaW1wb3J0IHsgSURhdGFTb3VyY2UsIElTY2hlbWFUeXBlcywgRGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGUsIElBcHBTeW5jT3BlcmF0aW9uQXJncyB9IGZyb20gJy4vYXBwLXN5bmMudHlwZXMnO1xyXG5pbXBvcnQgeyBDdXN0b21EaXJlY3RpdmUsIFBhZ2luYXRpb25UeXBlIH0gZnJvbSAnLi9jdXN0b20tZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgQXBwU3luY015U3FsQ3VzdG9tRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRhc291cmNlcy9teXNxbC9teXNxbC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBKb21weEdyYXBocWxUeXBlIH0gZnJvbSAnLi9ncmFwaHFsLXR5cGUnO1xyXG5cclxuLyoqXHJcbiAqIEN1cnNvciBFZGdlIE5vZGU6IGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAqIFN1cHBvcnQgcmVsYXkgb3Igbm90P1xyXG4gKiBodHRwczovL21lZGl1bS5jb20vb3Blbi1ncmFwaHFsL3VzaW5nLXJlbGF5LXdpdGgtYXdzLWFwcHN5bmMtNTVjODljYTAyMDY2XHJcbiAqIEpvaW5zIHNob3VsZCBiZSBjb25uZWN0aW9ucyBhbmQgbmFtZWQgYXMgc3VjaC4gZS5nLiBpbiBwb3N0IFRhZ3NDb25uZWN0aW9uXHJcbiAqIGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy11bmRlZmluZWQuUGFnZUluZm9cclxuICogaHR0cHM6Ly9ncmFwaHFsLXJ1bGVzLmNvbS9ydWxlcy9saXN0LXBhZ2luYXRpb25cclxuICogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2Jhc2ljcy9kZXNpZ25pbmctZ3JhcGhxbC1tdXRhdGlvbnMvXHJcbiAqIC0gTXV0YXRpb246IFVzZSB0b3AgbGV2ZWwgaW5wdXQgdHlwZSBmb3IgYWdzLiBVc2UgdG9wIGxldmVsIHByb3BlcnR5IGZvciBvdXRwdXQgdHlwZS5cclxuICovXHJcblxyXG4vLyBUT0RPIE1ha2Ugc3VyZSB3ZSBjYW4gY2FsbCBhIG11dGF0aW9uIGFuZCBjYWxsIGEgcXVlcnk/IGh0dHBzOi8vZ3JhcGhxbC1ydWxlcy5jb20vcnVsZXMvbXV0YXRpb24tcGF5bG9hZC1xdWVyeVxyXG4vLyBUT0RPIEFkZCBzY2hlbWEgZG9jdW1lbnRpb24gbWFya3VwOiBodHRwOi8vc3BlYy5ncmFwaHFsLm9yZy9kcmFmdC8jc2VjLURlc2NyaXB0aW9uc1xyXG4vLyBJbnRlcmVzdGluZyB0eXBlZCBlcnJvcnM6IGh0dHBzOi8vZ3JhcGhxbC1ydWxlcy5jb20vcnVsZXMvbXV0YXRpb24tcGF5bG9hZC1lcnJvcnNcclxuXHJcbi8qXHJcbnR5cGUgVXNlckZyaWVuZHNDb25uZWN0aW9uIHtcclxuICBwYWdlSW5mbzogUGFnZUluZm8hXHJcbiAgZWRnZXM6IFtVc2VyRnJpZW5kc0VkZ2VdXHJcbn10eXBlIFVzZXJGcmllbmRzRWRnZSB7XHJcbiAgY3Vyc29yOiBTdHJpbmchXHJcbiAgbm9kZTogVXNlclxyXG59XHJcbiovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBZGRNdXRhdGlvbkFyZ3VtZW50cyB7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBtdXRhdGlvbiBhcyBpdCB3aWxsIGFwcGVhciBpbiB0aGUgR3JhcGhRTCBzY2hlbWEuXHJcbiAgICAgKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG11dGF0aW9uIGRhdGFzb3VyY2UuXHJcbiAgICAgKi9cclxuICAgIGRhdGFTb3VyY2VOYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIE11dGF0aW9uIGlucHV0IGFyZ3VtZW50cy4gVGhlc2Ugc2hvdWxkIGV4YWN0bHkgbWF0Y2ggdGhlIG51bWJlciBhbmQgb3JkZXIgb2YgYXJndW1lbnRzIGluIHRoZSBtZXRob2QgdGhlIG11dGF0aW9uIHdpbGwgY2FsbC5cclxuICAgICAqL1xyXG4gICAgYXJnczogSUFwcFN5bmNPcGVyYXRpb25BcmdzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbXV0YXRpb24gcmV0dXJuIG9iamVjdCB0eXBlLlxyXG4gICAgICovXHJcbiAgICByZXR1cm5UeXBlOiBhcHBzeW5jLk9iamVjdFR5cGU7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBtdXRhdGlvbiBtZXRob2QgdG8gY2FsbC5cclxuICAgICAqL1xyXG4gICAgbWV0aG9kTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmNTY2hlbWFCdWlsZGVyIHtcclxuXHJcbiAgICBwdWJsaWMgZGF0YVNvdXJjZXM6IElEYXRhU291cmNlID0ge307XHJcbiAgICBwdWJsaWMgc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlcyA9IHsgZW51bVR5cGVzOiB7fSwgaW5wdXRUeXBlczoge30sIGludGVyZmFjZVR5cGVzOiB7fSwgb2JqZWN0VHlwZXM6IHt9LCB1bmlvblR5cGVzOiB7fSB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBncmFwaHFsQXBpOiBhcHBzeW5jLkdyYXBocWxBcGlcclxuICAgICkgeyB9XHJcblxyXG4gICAgLy8gQWRkIGRhdGFzb3VyY2UgdG8gQXBwU3luYyBpbiBhbiBpbnRlcm5hbCBhcnJheS4gUmVtb3ZlIHRoaXMgd2hlbiBBcHBTeW5jIHByb3ZpZGVzIGEgd2F5IHRvIGl0ZXJhdGUgZGF0YXNvdXJjZXMpLlxyXG4gICAgcHVibGljIGFkZERhdGFTb3VyY2UoaWQ6IHN0cmluZywgbGFtYmRhRnVuY3Rpb246IGNkay5hd3NfbGFtYmRhLklGdW5jdGlvbiwgb3B0aW9ucz86IGFwcHN5bmMuRGF0YVNvdXJjZU9wdGlvbnMpOiBhcHBzeW5jLkxhbWJkYURhdGFTb3VyY2Uge1xyXG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBgQXBwU3luY0RhdGFTb3VyY2Uke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShpZCl9YDtcclxuICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5ncmFwaHFsQXBpLmFkZExhbWJkYURhdGFTb3VyY2UoaWRlbnRpZmllciwgbGFtYmRhRnVuY3Rpb24sIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSB7IC4uLnRoaXMuZGF0YVNvdXJjZXMsIC4uLnsgW2lkXTogZGF0YVNvdXJjZSB9IH07XHJcbiAgICAgICAgcmV0dXJuIGRhdGFTb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFNjaGVtYVR5cGVzKHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZXMpIHtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzID0geyAuLi50aGlzLnNjaGVtYVR5cGVzLCAuLi5zY2hlbWFUeXBlcyB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbXV0YXRpb24gdG8gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICogQHBhcmFtIG5hbWUgLSBOYW1lIG9mIHRoZSBtdXRhdGlvbiBhcyBpdCB3aWxsIGFwcGVhciBpbiB0aGUgR3JhcGhRTCBzY2hlbWEuXHJcbiAgICAgKiBAcGFyYW0gZGF0YVNvdXJjZU5hbWUgLSBZb3VyIGRhdGFzb3VyY2UgbmFtZSBlLmcuIG15U3FsLCBjb2duaXRvLCBwb3N0LlxyXG4gICAgICogQHBhcmFtIGFyZ3MgLSBNdXRhdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgKiBAcGFyYW0gcmV0dXJuVHlwZSAtIE11dGF0aW9uIHJldHVuIHR5cGUgKG9yIG91dHB1dCB0eXBlKS5cclxuICAgICAqIEBwYXJhbSBvcGVyYXRpb24gLSBDbGFzcyBtZXRob2QgdGhlIG11dGF0aW9uIHdpbGwgY2FsbCB0byByZXR1biByZXN1bHQuXHJcbiAgICAgKiBAcmV0dXJucyAtIFRoZSBtdXRhdGlvbi5cclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbXV0YXRpb24gdG8gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkTXV0YXRpb24oeyBuYW1lLCBkYXRhU291cmNlTmFtZSwgYXJncywgcmV0dXJuVHlwZSwgbWV0aG9kTmFtZSB9OiBJQWRkTXV0YXRpb25Bcmd1bWVudHMpOiBhcHBzeW5jLk9iamVjdFR5cGUge1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBBZGQgc2NoZW1hIHR5cGVzLlxyXG5cclxuICAgICAgICAvLyBDaGVjayBkYXRhc291cmNlIGV4aXN0cy5cclxuICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcbiAgICAgICAgaWYgKCFkYXRhU291cmNlKSB0aHJvdyBFcnJvcihgSm9tcHg6IGRhdGFTb3VyY2UgXCIke2RhdGFTb3VyY2VOYW1lfVwiIG5vdCBmb3VuZCFgKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGlucHV0IHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIGNvbnN0IGlucHV0VHlwZSA9IG5ldyBhcHBzeW5jLklucHV0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocmV0dXJuVHlwZS5uYW1lKX1JbnB1dGAsIHsgZGVmaW5pdGlvbjogYXJncyB9KTtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnB1dFR5cGUpO1xyXG5cclxuICAgICAgICAvLyBBZGQgb3V0cHV0IHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIGNvbnN0IG91dHB1dFR5cGUgPSBuZXcgT2JqZWN0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocmV0dXJuVHlwZS5uYW1lKX1QYXlsb2FkYCwge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiByZXR1cm5UeXBlLmRlZmluaXRpb24sXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpLFxyXG4gICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUob3V0cHV0VHlwZSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBwYXlsb2FkIHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIGNvbnN0IHBheWxvYWRUeXBlID0gbmV3IE9iamVjdFR5cGUoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHJldHVyblR5cGUubmFtZSl9T3V0cHV0YCwge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IG91dHB1dFR5cGUuYXR0cmlidXRlKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlyZWN0aXZlczogWy4uLlthcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKSwgYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKV0sIC4uLihyZXR1cm5UeXBlPy5kaXJlY3RpdmVzID8/IFtdKV1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShwYXlsb2FkVHlwZSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBhbnkgY2hpbGQgcmV0dXJuIHR5cGVzICh0byBHcmFwaFFMKS5cclxuICAgICAgICAvLyBUT0RPOiBNYWtlIHJlY3Vyc2l2ZS5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHJldHVyblR5cGUuZGVmaW5pdGlvbikuZm9yRWFjaChncmFwaHFsVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChncmFwaHFsVHlwZS50eXBlID09PSAnSU5URVJNRURJQVRFJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyYXBocWxUeXBlPy5pbnRlcm1lZGlhdGVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZ3JhcGhxbFR5cGUuaW50ZXJtZWRpYXRlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIG11dGF0aW9uICh0byBHcmFwaFFMKS5cclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaHFsQXBpLmFkZE11dGF0aW9uKG5hbWUsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgIHJldHVyblR5cGU6IHBheWxvYWRUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgICAgICAgICBhcmdzOiB7IGlucHV0OiBpbnB1dFR5cGUuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSB9LFxyXG4gICAgICAgICAgICBkYXRhU291cmNlLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKSxcclxuICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gcGlwZWxpbmVDb25maWc6IFtdLCAvLyBUT0RPOiBBZGQgYXV0aG9yaXphdGlvbiBMYW1iZGEgZnVuY3Rpb24gaGVyZS5cclxuICAgICAgICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcIm9wZXJhdGlvblwiLCBcIiR7bWV0aG9kTmFtZX1cIikpXHJcbiAgICAgICAgICAgICAgICAke0RlZmF1bHRSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlfVxyXG4gICAgICAgICAgICBgKVxyXG4gICAgICAgIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCkge1xyXG5cclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEoJ2RpcmVjdGl2ZSBAcmVhZG9ubHkodmFsdWU6IFN0cmluZykgb24gRklFTERfREVGSU5JVElPTicpO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShDdXN0b21EaXJlY3RpdmUuc2NoZW1hKCkpO1xyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShBcHBTeW5jTXlTcWxDdXN0b21EaXJlY3RpdmUuc2NoZW1hKCkpO1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBEZWxldGUgTWU/Pz9cclxuICAgICAgICAvLyBhcHBzeW5jLkVudW1UeXBlO1xyXG4gICAgICAgIC8vIGFwcHN5bmMuVW5pb25UeXBlO1xyXG5cclxuICAgICAgICB0aGlzLmFkZFBhZ2VJbmZvVHlwZSgpO1xyXG4gICAgICAgIHRoaXMuYWRkU29ydElucHV0KCk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5lbnVtVHlwZXMpLmZvckVhY2goZW51bVR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShlbnVtVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzKS5mb3JFYWNoKGlucHV0VHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGlucHV0VHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnRlcmZhY2VUeXBlcykuZm9yRWFjaChpbnRlcmZhY2VUeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW50ZXJmYWNlVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcykuZm9yRWFjaChvYmplY3RUeXBlID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9iamVjdChvYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0eXBlIHRvIEdyYXBoUUwuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKG9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcignb3BlcmF0aW9ucycsICduYW1lcycsIG9iamVjdFR5cGUuZGlyZWN0aXZlcyk7XHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9ucy5pbmNsdWRlcygnZmluZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRGaW5kKG9iamVjdFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy51bmlvblR5cGVzKS5mb3JFYWNoKHVuaW9uVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHVuaW9uVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcyBhbmQgdXBkYXRlIHJldHVyblR5cGUgb2YgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIGZyb20gc3RyaW5nIHR5cGUgdG8gYWN0dWFsIHR5cGUuXHJcbiAgICAgKiBXaHk/IEFwcFN5bmMgcmVzb2x2YWJsZSBmaWVsZHMgcmVxdWlyZSBhIGRhdGEgdHlwZS4gQnV0IHRoYXQgZGF0YSB0eXBlIG1heSBub3QgYWxyZWFkeSBleGlzdCB5ZXQuIEZvciBleGFtcGxlOlxyXG4gICAgICogICBQb3N0IG9iamVjdCB0eXBlIGhhcyBmaWVsZCBjb21tZW50cyBhbmQgQ29tbWVudCBvYmplY3QgdHlwZSBoYXMgZmllbGQgcG9zdC4gTm8gbWF0dGVyIHdoYXQgb3JkZXIgdGhlc2Ugb2JqZWN0IHR5cGVzIGFyZSBjcmVhdGVkIGluLCBhbiBvYmplY3QgdHlwZSB3b24ndCBleGlzdCB5ZXQuXHJcbiAgICAgKiAgIElmIGNvbW1lbnQgaXMgY3JlYXRlZCBmaXJzdCwgdGhlcmUgaXMgbm8gY29tbWVudCBvYmplY3QgdHlwZS4gSWYgY29tbWVudCBpcyBjcmVhdGVkIGZpcnN0LCB0aGVyZSBpcyBubyBwb3N0IG9iamVjdCB0eXBlLlxyXG4gICAgICogVG8gd29yayBhcm91bmQgdGhpcyBjaGlja2VuIG9yIGVnZyBsaW1pdGF0aW9uLCBKb21weCBkZWZpbmVzIGEgY3VzdG9tIHR5cGUgdGhhdCBhbGxvd3MgYSBzdHJpbmcgdHlwZSB0byBiZSBzcGVjaWZpZWQuIGUuZy5cclxuICAgICAqICAgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIEpvbXB4R3JhcGhxbFR5cGUub2JqZWN0VHlwZSh7IG9iamVjdFR5cGVOYW1lOiAnTVBvc3QnLCBpc0xpc3Q6IGZhbHNlIH0pLFxyXG4gICAgICogVGhpcyBtZXRob2QgdXNlcyB0aGUgc3RyaW5nIHR5cGUgdG8gYWRkIGFuIGFjdHVhbCB0eXBlLlxyXG4gICAgICpcclxuICAgICAqIENhdXRpb246IENoYW5nZXMgdG8gQXBwU3luYyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIG1heSBicmVhayB0aGlzIG1ldGhvZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZXNvbHZlT2JqZWN0KG9iamVjdFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICAvLyBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcy5cclxuICAgICAgICBPYmplY3QuZW50cmllcyhvYmplY3RUeXBlLmRlZmluaXRpb24pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBJZiBmaWVsZCBvZiBKb21weEdyYXBocWxUeXBlIHR5cGUgKHRoZW4gdXNlIHN0cmluZyB0eXBlIHRvIGFkZCBhY3R1YWwgdHlwZSkuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5maWVsZE9wdGlvbnM/LnJldHVyblR5cGUgaW5zdGFuY2VvZiBKb21weEdyYXBocWxUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBcIm9sZFwiIGZpZWxkIHdpdGggdGhlIG5ldyBcImZpZWxkXCIuXHJcbiAgICAgICAgICAgICAgICBvYmplY3RUeXBlLmRlZmluaXRpb25ba2V5XSA9IEFwcFN5bmNTY2hlbWFCdWlsZGVyLnJlc29sdmVSZXNvbHZhYmxlRmllbGQodGhpcy5zY2hlbWFUeXBlcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNvbHZlIGFuIEFwcFN5bmMgUmVzb2x2YWJsZUZpZWxkIHdpdGggYSBKb21weEdyYXBocWxUeXBlICh3aXRoIHN0cmluZyB0eXBlKSB0byBhIFJlc29sdmFibGVGaWVsZCB3aXRoIGEgR3JhcGhxbFR5cGUgKHdpdGggYW4gYWN0dWFsIHR5cGUpLlxyXG4gICAgICovXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L21lbWJlci1vcmRlcmluZ1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVzb2x2ZVJlc29sdmFibGVGaWVsZChzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzLCByZXNvbHZhYmxlRmllbGQ6IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKTogYXBwc3luYy5SZXNvbHZhYmxlRmllbGQge1xyXG5cclxuICAgICAgICBsZXQgcnYgPSByZXNvbHZhYmxlRmllbGQ7XHJcblxyXG4gICAgICAgIGlmIChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zPy5yZXR1cm5UeXBlIGluc3RhbmNlb2YgSm9tcHhHcmFwaHFsVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgR3JhcGhRTCBkYXRhdHlwZSB3aXRoIGFjdHVhbCB0eXBlLlxyXG4gICAgICAgICAgICBjb25zdCBuZXdHcmFwaHFsVHlwZSA9IHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMucmV0dXJuVHlwZS5yZXNvbHZlKHNjaGVtYVR5cGVzKTtcclxuICAgICAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIHJlc29sdmFibGUgZmllbGQgb3B0aW9ucyBcIm9sZFwiIEdyYXBoUUwgZGF0YXR5cGUgd2l0aCBcIm5ld1wiIEdyYXBoUUwgZGF0YXR5cGUuXHJcbiAgICAgICAgICAgIHNldChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zLCAncmV0dXJuVHlwZScsIG5ld0dyYXBocWxUeXBlKTtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyByZXNvbHZhYmxlIGZpZWxkIHdpdGggbW9kaWZpZWQgcmVzb2x2YWJsZSBmaWVsZCBvcHRpb25zLlxyXG4gICAgICAgICAgICBydiA9IG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkRmluZChvYmplY3RUeXBlOiBhcHBzeW5jLk9iamVjdFR5cGUpIHtcclxuXHJcbiAgICAgICAgY29uc3Qgb2JqZWN0VHlwZU5hbWUgPSBvYmplY3RUeXBlLm5hbWU7XHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvblR5cGU6IFBhZ2luYXRpb25UeXBlID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKCdwYWdpbmF0aW9uJywgJ3R5cGUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKSBhcyBQYWdpbmF0aW9uVHlwZSA/PyAnb2Zmc2V0JztcclxuICAgICAgICBjb25zdCBkYXRhU291cmNlTmFtZSA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcignZGF0YXNvdXJjZScsICduYW1lJywgb2JqZWN0VHlwZT8uZGlyZWN0aXZlcyk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhU291cmNlTmFtZVxyXG4gICAgICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yXHJcbiAgICAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXRcclxuICAgICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcblxyXG4gICAgICAgICAgICAvLyBFZGdlLlxyXG4gICAgICAgICAgICBjb25zdCBlZGdlT2JqZWN0VHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7b2JqZWN0VHlwZU5hbWV9RWRnZWAsIHtcclxuICAgICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAuLi4ocGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InKSAmJiB7IGN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sIC8vIElmIHBhZ2luYXRpb24gdHlwZSBjdXJzb3IgdGhlbiBpbmNsdWRlIHJlcXVpcmVkIGN1cnNvciBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgICBub2RlOiBvYmplY3RUeXBlLmF0dHJpYnV0ZSgpXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGVkZ2VPYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbm5lY3Rpb24uIEJhc2VkIG9uIHJlbGF5IHNwZWNpZmljYXRpb246IGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy1Db25uZWN0aW9uLVR5cGVzXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbm5lY3Rpb25PYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1Db25uZWN0aW9uYCwge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VzOiBlZGdlT2JqZWN0VHlwZS5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUluZm86IHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJyA/IHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3IuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSA6IHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXQuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbENvdW50OiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpIC8vIEFwb2xsbyBzdWdnZXN0cyBhZGRpbmcgYXMgYSBjb25uZWN0aW9uIHByb3BlcnR5OiBodHRwczovL2dyYXBocWwub3JnL2xlYXJuL3BhZ2luYXRpb24vXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGNvbm5lY3Rpb25PYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBkZWZhdWx0IHF1ZXJ5IGFyZ3VtZW50cy5cclxuICAgICAgICAgICAgY29uc3QgYXJncyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIGZpbHRlciBhcmd1bWVudC5cclxuICAgICAgICAgICAgc2V0KGFyZ3MsICdmaWx0ZXInLCBhcHBzeW5jLkdyYXBocWxUeXBlLmF3c0pzb24oKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgc29ydCBhcmd1bWVudC5cclxuICAgICAgICAgICAgc2V0KGFyZ3MsICdzb3J0JywgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dC5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIG9mZnNldCBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuICAgICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnb2Zmc2V0Jykge1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdza2lwJywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2xpbWl0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBjdXJzb3IgcGFnaW5hdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgICAgICAgIGlmIChwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicpIHtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnZmlyc3QnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnYWZ0ZXInLCBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnbGFzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdiZWZvcmUnLCBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHF1ZXJ5LlxyXG4gICAgICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkUXVlcnkoYGZpbmQke29iamVjdFR5cGVOYW1lUGx1cmFsfWAsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgJHtjaGFuZ2VDYXNlLmNhbWVsQ2FzZShvYmplY3RUeXBlTmFtZSl9RmluZGAsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBjb25uZWN0aW9uT2JqZWN0VHlwZS5hdHRyaWJ1dGUoKSxcclxuICAgICAgICAgICAgICAgIGFyZ3MsXHJcbiAgICAgICAgICAgICAgICBkYXRhU291cmNlLFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHRoZSByZXF1ZXN0IG1hcHBpbmcgdG8gaW5qZWN0IHN0YXNoIHZhcmlhYmxlcyAoZm9yIHVzZSBpbiBMYW1iZGEgZnVuY3Rpb24pLlxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvcGVyYXRpb25cIiwgXCJmaW5kXCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib2JqZWN0VHlwZU5hbWVcIiwgXCIke29iamVjdFR5cGVOYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcInJldHVyblR5cGVOYW1lXCIsIFwiJHtjb25uZWN0aW9uT2JqZWN0VHlwZS5uYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICAgICAke0RlZmF1bHRSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlfVxyXG4gICAgICAgICAgICAgICAgYClcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwYWdpbmF0aW9uIHBhZ2VJbmZvIHR5cGVzIGZvciBvZmZzZXQgYW5kIGN1cnNvciBiYXNlZCBwYWdpbmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEN1cnNvciBwYWdpbmF0aW9uLiBQYWdlIGFuZCBzb3J0IGJ5IHVuaXF1ZSBmaWVsZC4gQ29uY2F0ZW5hdGVkIGZpZWxkcyBjYW4gcmVzdWx0IGluIHBvb3IgcGVyZm9ybWFuY2UuXHJcbiAgICAgKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtQ29ubmVjdGlvbi1UeXBlc1xyXG4gICAgICogaHR0cHM6Ly9zaG9waWZ5LmVuZ2luZWVyaW5nL3BhZ2luYXRpb24tcmVsYXRpdmUtY3Vyc29yc1xyXG4gICAgICogaHR0cHM6Ly9tZWRpdW0uY29tL3N3bGgvaG93LXRvLWltcGxlbWVudC1jdXJzb3ItcGFnaW5hdGlvbi1saWtlLWEtcHJvLTUxMzE0MGI2NWYzMlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGFkZFBhZ2VJbmZvVHlwZSgpIHtcclxuXHJcbiAgICAgICAgLy8gT2Zmc2V0IHBhZ2luYXRpb24uXHJcbiAgICAgICAgY29uc3QgcGFnZUluZm9PZmZzZXQgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb09mZnNldCcsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgc2tpcDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgbGltaXQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKSxcclxuICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXQgPSBwYWdlSW5mb09mZnNldDtcclxuXHJcbiAgICAgICAgLy8gQ3Vyc29yIHBhZ2luYXRpb24uXHJcbiAgICAgICAgY29uc3QgcGFnZUluZm9DdXJzb3IgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb0N1cnNvcicsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgaGFzUHJldmlvdXNQYWdlOiBhcHBzeW5jLkdyYXBocWxUeXBlLmJvb2xlYW4oeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgaGFzTmV4dFBhZ2U6IGFwcHN5bmMuR3JhcGhxbFR5cGUuYm9vbGVhbih7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBzdGFydEN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgZW5kQ3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuaWFtKCksXHJcbiAgICAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5jb2duaXRvKCdhZG1pbicpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yID0gcGFnZUluZm9DdXJzb3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgc29ydCBpbnB1dCB0eXBlIGZvciBtdWx0aSBjb2x1bW4gc29ydGluZy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRTb3J0SW5wdXQoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHNvcnRJbnB1dCA9IG5ldyBhcHBzeW5jLklucHV0VHlwZSgnU29ydElucHV0Jywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0ID0gc29ydElucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGUuZy4gTVBvc3QgPiBtcG9zdCwgTXlTcWxQb3N0ID4gbXlTcWxQb3N0LCBNeVBvc3QgPiBteVBvc3RcclxuICAgIC8vIHByaXZhdGUgb3BlcmF0aW9uTmFtZUZyb21UeXBlKHM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAvLyAgICAgcmV0dXJuIHMuY2hhckF0KDApLnRvTG9jYWxlTG93ZXJDYXNlKCkgKyBzLmNoYXJBdCgxKS50b0xvY2FsZUxvd2VyQ2FzZSgpICsgcy5zbGljZSgyKTtcclxuICAgIC8vIH1cclxufVxyXG5cclxuXHJcbi8qXHJcbkNvbnNpZGVyOlxyXG50eXBlIFBhZ2luYXRpb25JbmZvIHtcclxuICAjIFRvdGFsIG51bWJlciBvZiBwYWdlc1xyXG4gIHRvdGFsUGFnZXM6IEludCFcclxuXHJcbiAgIyBUb3RhbCBudW1iZXIgb2YgaXRlbXNcclxuICB0b3RhbEl0ZW1zOiBJbnQhXHJcblxyXG4gICMgQ3VycmVudCBwYWdlIG51bWJlclxyXG4gIHBhZ2U6IEludCFcclxuXHJcbiAgIyBOdW1iZXIgb2YgaXRlbXMgcGVyIHBhZ2VcclxuICBwZXJQYWdlOiBJbnQhXHJcblxyXG4gICMgV2hlbiBwYWdpbmF0aW5nIGZvcndhcmRzLCBhcmUgdGhlcmUgbW9yZSBpdGVtcz9cclxuICBoYXNOZXh0UGFnZTogQm9vbGVhbiFcclxuXHJcbiAgIyBXaGVuIHBhZ2luYXRpbmcgYmFja3dhcmRzLCBhcmUgdGhlcmUgbW9yZSBpdGVtcz9cclxuICBoYXNQcmV2aW91c1BhZ2U6IEJvb2xlYW4hXHJcbn1cclxuKi9cclxuXHJcblxyXG4vKlxyXG5Eb2VzIEFwcEF5c25jIHN1cHBvcnQgdGhpcz9cclxuIyBBIHNpbmdsZSBsaW5lLCB0eXBlLWxldmVsIGRlc2NyaXB0aW9uXHJcblwiUGFzc2VuZ2VyIGRldGFpbHNcIlxyXG50eXBlIFBhc3NlbmdlciB7XHJcbiAgXCJcIlwiICBhIG11bHRpLWxpbmUgZGVzY3JpcHRpb25cclxuICB0aGUgaWQgaXMgZ2VuZXJhbCB1c2VyIGlkIFwiXCJcIlxyXG4gIGlkOiBJRCFcclxuICBuYW1lOiBTdHJpbmchXHJcbiAgYWdlOiBJbnQhXHJcbiAgYWRkcmVzczogU3RyaW5nIVxyXG4gIFwic2luZ2xlIGxpbmUgZGVzY3JpcHRpb246IGl0IGlzIHBhc3NlbmdlciBpZFwiXHJcbiAgcGFzc2VuZ2VySWQ6IElEIVxyXG59XHJcbiovIl19