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
const mysql_directive_1 = require("./datasources/mysql/mysql.directive");
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
                appsync.Directive.iam()
            ]
        });
        this.graphqlApi.addType(outputType);
        // Add payload type (to GraphQL).
        const payloadType = new aws_appsync_alpha_1.ObjectType(`${changeCase.pascalCase(returnType.name)}Output`, {
            definition: {
                output: outputType.attribute()
            },
            directives: [...[appsync.Directive.iam()], ...((_b = returnType === null || returnType === void 0 ? void 0 : returnType.directives) !== null && _b !== void 0 ? _b : [])]
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
                appsync.Directive.iam()
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
                    appsync.Directive.iam()
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
                    appsync.Directive.iam()
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
                    appsync.Directive.iam()
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
                appsync.Directive.iam()
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
                appsync.Directive.iam()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvc2NoZW1hLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsa0VBQXdEO0FBRXhELDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsaUVBQWlFO0FBQ2pFLDJDQUEyQztBQUMzQyxpRUFBaUU7QUFDakUsaUNBQWtDO0FBQ2xDLHFDQUFxQztBQUNyQyxxREFBbUg7QUFDbkgseURBQXFFO0FBQ3JFLGlEQUFrRDtBQUNsRCx5RUFBa0Y7QUFrRGxGLE1BQWEsb0JBQW9CO0lBSzdCLFlBQ1csVUFBOEI7UUFBOUIsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFKbEMsZ0JBQVcsR0FBZ0IsRUFBRSxDQUFDO1FBQzlCLGdCQUFXLEdBQWlCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFJdEgsQ0FBQztJQUVMLG1IQUFtSDtJQUM1RyxhQUFhLENBQUMsRUFBVSxFQUFFLGNBQXdDLEVBQUUsT0FBbUM7UUFDMUcsTUFBTSxVQUFVLEdBQUcsb0JBQW9CLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUNuRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUYsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDO1FBQ3BFLE9BQU8sVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxjQUFjLENBQUMsV0FB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O2dCQUNSLGVBQWUsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztnQkFDbEUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO2dCQUM5RCxXQUFXLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQzdELFNBQVMsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUM5RDtZQUNELFVBQVUsRUFBRTtnQkFDUixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTthQUMxQjtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7SUFDakUsQ0FBQztJQUVEOztPQUVHO0lBQ0ssWUFBWTtRQUVoQixNQUFNLFNBQVMsR0FBRyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFO1lBQ2pELFVBQVUsRUFBRTtnQkFDUixTQUFTLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQzNELFNBQVMsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUMzRDtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDdEQsQ0FBQzs7QUF4VEwsb0RBOFRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbmltcG9ydCB7IE9iamVjdFR5cGUgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbi8vIGltcG9ydCBwbHVyYWxpemUgPSByZXF1aXJlKCdwbHVyYWxpemUnKTtcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuaW1wb3J0IHNldCA9IHJlcXVpcmUoJ3NldC12YWx1ZScpO1xyXG4vLyBpbXBvcnQgZ2V0ID0gcmVxdWlyZSgnZ2V0LXZhbHVlJyk7XHJcbmltcG9ydCB7IElEYXRhU291cmNlLCBJU2NoZW1hVHlwZXMsIERlZmF1bHRSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlLCBJQXBwU3luY09wZXJhdGlvbkFyZ3MgfSBmcm9tICcuL2FwcC1zeW5jLnR5cGVzJztcclxuaW1wb3J0IHsgQ3VzdG9tRGlyZWN0aXZlLCBQYWdpbmF0aW9uVHlwZSB9IGZyb20gJy4vY3VzdG9tLWRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IEpvbXB4R3JhcGhxbFR5cGUgfSBmcm9tICcuL2dyYXBocWwtdHlwZSc7XHJcbmltcG9ydCB7IEFwcFN5bmNNeVNxbEN1c3RvbURpcmVjdGl2ZSB9IGZyb20gJy4vZGF0YXNvdXJjZXMvbXlzcWwvbXlzcWwuZGlyZWN0aXZlJztcclxuXHJcbi8qKlxyXG4gKiBDdXJzb3IgRWRnZSBOb2RlOiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvZXhwbGFpbmluZy1ncmFwaHFsLWNvbm5lY3Rpb25zL1xyXG4gKiBTdXBwb3J0IHJlbGF5IG9yIG5vdD9cclxuICogaHR0cHM6Ly9tZWRpdW0uY29tL29wZW4tZ3JhcGhxbC91c2luZy1yZWxheS13aXRoLWF3cy1hcHBzeW5jLTU1Yzg5Y2EwMjA2NlxyXG4gKiBKb2lucyBzaG91bGQgYmUgY29ubmVjdGlvbnMgYW5kIG5hbWVkIGFzIHN1Y2guIGUuZy4gaW4gcG9zdCBUYWdzQ29ubmVjdGlvblxyXG4gKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtdW5kZWZpbmVkLlBhZ2VJbmZvXHJcbiAqIGh0dHBzOi8vZ3JhcGhxbC1ydWxlcy5jb20vcnVsZXMvbGlzdC1wYWdpbmF0aW9uXHJcbiAqIGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9iYXNpY3MvZGVzaWduaW5nLWdyYXBocWwtbXV0YXRpb25zL1xyXG4gKiAtIE11dGF0aW9uOiBVc2UgdG9wIGxldmVsIGlucHV0IHR5cGUgZm9yIGFncy4gVXNlIHRvcCBsZXZlbCBwcm9wZXJ0eSBmb3Igb3V0cHV0IHR5cGUuXHJcbiAqL1xyXG5cclxuLy8gVE9ETyBNYWtlIHN1cmUgd2UgY2FuIGNhbGwgYSBtdXRhdGlvbiBhbmQgY2FsbCBhIHF1ZXJ5PyBodHRwczovL2dyYXBocWwtcnVsZXMuY29tL3J1bGVzL211dGF0aW9uLXBheWxvYWQtcXVlcnlcclxuLy8gVE9ETyBBZGQgc2NoZW1hIGRvY3VtZW50aW9uIG1hcmt1cDogaHR0cDovL3NwZWMuZ3JhcGhxbC5vcmcvZHJhZnQvI3NlYy1EZXNjcmlwdGlvbnNcclxuLy8gSW50ZXJlc3RpbmcgdHlwZWQgZXJyb3JzOiBodHRwczovL2dyYXBocWwtcnVsZXMuY29tL3J1bGVzL211dGF0aW9uLXBheWxvYWQtZXJyb3JzXHJcblxyXG4vKlxyXG50eXBlIFVzZXJGcmllbmRzQ29ubmVjdGlvbiB7XHJcbiAgcGFnZUluZm86IFBhZ2VJbmZvIVxyXG4gIGVkZ2VzOiBbVXNlckZyaWVuZHNFZGdlXVxyXG59dHlwZSBVc2VyRnJpZW5kc0VkZ2Uge1xyXG4gIGN1cnNvcjogU3RyaW5nIVxyXG4gIG5vZGU6IFVzZXJcclxufVxyXG4qL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQWRkTXV0YXRpb25Bcmd1bWVudHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbXV0YXRpb24gYXMgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICovXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBtdXRhdGlvbiBkYXRhc291cmNlLlxyXG4gICAgICovXHJcbiAgICBkYXRhU291cmNlTmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBNdXRhdGlvbiBpbnB1dCBhcmd1bWVudHMuIFRoZXNlIHNob3VsZCBleGFjdGx5IG1hdGNoIHRoZSBudW1iZXIgYW5kIG9yZGVyIG9mIGFyZ3VtZW50cyBpbiB0aGUgbWV0aG9kIHRoZSBtdXRhdGlvbiB3aWxsIGNhbGwuXHJcbiAgICAgKi9cclxuICAgIGFyZ3M6IElBcHBTeW5jT3BlcmF0aW9uQXJncztcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG11dGF0aW9uIHJldHVybiBvYmplY3QgdHlwZS5cclxuICAgICAqL1xyXG4gICAgcmV0dXJuVHlwZTogYXBwc3luYy5PYmplY3RUeXBlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbXV0YXRpb24gbWV0aG9kIHRvIGNhbGwuXHJcbiAgICAgKi9cclxuICAgIG1ldGhvZE5hbWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jU2NoZW1hQnVpbGRlciB7XHJcblxyXG4gICAgcHVibGljIGRhdGFTb3VyY2VzOiBJRGF0YVNvdXJjZSA9IHt9O1xyXG4gICAgcHVibGljIHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZXMgPSB7IGVudW1UeXBlczoge30sIGlucHV0VHlwZXM6IHt9LCBpbnRlcmZhY2VUeXBlczoge30sIG9iamVjdFR5cGVzOiB7fSwgdW5pb25UeXBlczoge30gfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgZ3JhcGhxbEFwaTogYXBwc3luYy5HcmFwaHFsQXBpXHJcbiAgICApIHsgfVxyXG5cclxuICAgIC8vIEFkZCBkYXRhc291cmNlIHRvIEFwcFN5bmMgaW4gYW4gaW50ZXJuYWwgYXJyYXkuIFJlbW92ZSB0aGlzIHdoZW4gQXBwU3luYyBwcm92aWRlcyBhIHdheSB0byBpdGVyYXRlIGRhdGFzb3VyY2VzKS5cclxuICAgIHB1YmxpYyBhZGREYXRhU291cmNlKGlkOiBzdHJpbmcsIGxhbWJkYUZ1bmN0aW9uOiBjZGsuYXdzX2xhbWJkYS5JRnVuY3Rpb24sIG9wdGlvbnM/OiBhcHBzeW5jLkRhdGFTb3VyY2VPcHRpb25zKTogYXBwc3luYy5MYW1iZGFEYXRhU291cmNlIHtcclxuICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gYEFwcFN5bmNEYXRhU291cmNlJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UoaWQpfWA7XHJcbiAgICAgICAgY29uc3QgZGF0YVNvdXJjZSA9IHRoaXMuZ3JhcGhxbEFwaS5hZGRMYW1iZGFEYXRhU291cmNlKGlkZW50aWZpZXIsIGxhbWJkYUZ1bmN0aW9uLCBvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzID0geyAuLi50aGlzLmRhdGFTb3VyY2VzLCAuLi57IFtpZF06IGRhdGFTb3VyY2UgfSB9O1xyXG4gICAgICAgIHJldHVybiBkYXRhU291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRTY2hlbWFUeXBlcyhzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzKSB7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcyA9IHsgLi4udGhpcy5zY2hlbWFUeXBlcywgLi4uc2NoZW1hVHlwZXMgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG11dGF0aW9uIHRvIHRoZSBHcmFwaFFMIHNjaGVtYS5cclxuICAgICAqIEBwYXJhbSBuYW1lIC0gTmFtZSBvZiB0aGUgbXV0YXRpb24gYXMgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICogQHBhcmFtIGRhdGFTb3VyY2VOYW1lIC0gWW91ciBkYXRhc291cmNlIG5hbWUgZS5nLiBteVNxbCwgY29nbml0bywgcG9zdC5cclxuICAgICAqIEBwYXJhbSBhcmdzIC0gTXV0YXRpb24gYXJndW1lbnRzLlxyXG4gICAgICogQHBhcmFtIHJldHVyblR5cGUgLSBNdXRhdGlvbiByZXR1biB0eXBlIChvciBvdXRwdXQgdHlwZSkuXHJcbiAgICAgKiBAcGFyYW0gb3BlcmF0aW9uIC0gQ2xhc3MgbWV0aG9kIHRoZSBtdXRhdGlvbiB3aWxsIGNhbGwgdG8gcmV0dW4gcmVzdWx0LlxyXG4gICAgICogQHJldHVybnMgLSBUaGUgbXV0YXRpb24uXHJcbiAgICAgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG11dGF0aW9uIHRvIHRoZSBHcmFwaFFMIHNjaGVtYS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZE11dGF0aW9uKHsgbmFtZSwgZGF0YVNvdXJjZU5hbWUsIGFyZ3MsIHJldHVyblR5cGUsIG1ldGhvZE5hbWUgfTogSUFkZE11dGF0aW9uQXJndW1lbnRzKTogYXBwc3luYy5PYmplY3RUeXBlIHtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogQWRkIHNjaGVtYSB0eXBlcy5cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgZGF0YXNvdXJjZSBleGlzdHMuXHJcbiAgICAgICAgY29uc3QgZGF0YVNvdXJjZSA9IHRoaXMuZGF0YVNvdXJjZXNbZGF0YVNvdXJjZU5hbWVdO1xyXG4gICAgICAgIGlmICghZGF0YVNvdXJjZSkgdGhyb3cgRXJyb3IoYEpvbXB4OiBkYXRhU291cmNlIFwiJHtkYXRhU291cmNlTmFtZX1cIiBub3QgZm91bmQhYCk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBpbnB1dCB0eXBlICh0byBHcmFwaFFMKS5cclxuICAgICAgICBjb25zdCBpbnB1dFR5cGUgPSBuZXcgYXBwc3luYy5JbnB1dFR5cGUoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHJldHVyblR5cGUubmFtZSl9SW5wdXRgLCB7IGRlZmluaXRpb246IGFyZ3MgfSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW5wdXRUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIG91dHB1dCB0eXBlICh0byBHcmFwaFFMKS5cclxuICAgICAgICBjb25zdCBvdXRwdXRUeXBlID0gbmV3IE9iamVjdFR5cGUoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHJldHVyblR5cGUubmFtZSl9UGF5bG9hZGAsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjogcmV0dXJuVHlwZS5kZWZpbml0aW9uLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUob3V0cHV0VHlwZSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBwYXlsb2FkIHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIGNvbnN0IHBheWxvYWRUeXBlID0gbmV3IE9iamVjdFR5cGUoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHJldHVyblR5cGUubmFtZSl9T3V0cHV0YCwge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IG91dHB1dFR5cGUuYXR0cmlidXRlKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlyZWN0aXZlczogWy4uLlthcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKV0sIC4uLihyZXR1cm5UeXBlPy5kaXJlY3RpdmVzID8/IFtdKV1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShwYXlsb2FkVHlwZSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBhbnkgY2hpbGQgcmV0dXJuIHR5cGVzICh0byBHcmFwaFFMKS5cclxuICAgICAgICAvLyBUT0RPOiBNYWtlIHJlY3Vyc2l2ZS5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHJldHVyblR5cGUuZGVmaW5pdGlvbikuZm9yRWFjaChncmFwaHFsVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChncmFwaHFsVHlwZS50eXBlID09PSAnSU5URVJNRURJQVRFJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyYXBocWxUeXBlPy5pbnRlcm1lZGlhdGVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZ3JhcGhxbFR5cGUuaW50ZXJtZWRpYXRlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIG11dGF0aW9uICh0byBHcmFwaFFMKS5cclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaHFsQXBpLmFkZE11dGF0aW9uKG5hbWUsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgIHJldHVyblR5cGU6IHBheWxvYWRUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgICAgICAgICBhcmdzOiB7IGlucHV0OiBpbnB1dFR5cGUuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSB9LFxyXG4gICAgICAgICAgICBkYXRhU291cmNlLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib3BlcmF0aW9uXCIsIFwiJHttZXRob2ROYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICR7RGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAgICAgICAgIGApXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYSgnZGlyZWN0aXZlIEByZWFkb25seSh2YWx1ZTogU3RyaW5nKSBvbiBGSUVMRF9ERUZJTklUSU9OJyk7XHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKEN1c3RvbURpcmVjdGl2ZS5zY2hlbWEoKSk7XHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKEFwcFN5bmNNeVNxbEN1c3RvbURpcmVjdGl2ZS5zY2hlbWEoKSk7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IERlbGV0ZSBNZT8/P1xyXG4gICAgICAgIC8vIGFwcHN5bmMuRW51bVR5cGU7XHJcbiAgICAgICAgLy8gYXBwc3luYy5VbmlvblR5cGU7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkUGFnZUluZm9UeXBlKCk7XHJcbiAgICAgICAgdGhpcy5hZGRTb3J0SW5wdXQoKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLmVudW1UeXBlcykuZm9yRWFjaChlbnVtVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGVudW1UeXBlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMpLmZvckVhY2goaW5wdXRUeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW5wdXRUeXBlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLmludGVyZmFjZVR5cGVzKS5mb3JFYWNoKGludGVyZmFjZVR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnRlcmZhY2VUeXBlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzKS5mb3JFYWNoKG9iamVjdFR5cGUgPT4ge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlT2JqZWN0KG9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHR5cGUgdG8gR3JhcGhRTC5cclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUob2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKCdvcGVyYXRpb25zJywgJ25hbWVzJywgb2JqZWN0VHlwZS5kaXJlY3RpdmVzKTtcclxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25zLmluY2x1ZGVzKCdmaW5kJykpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEZpbmQob2JqZWN0VHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLnVuaW9uVHlwZXMpLmZvckVhY2godW5pb25UeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUodW5pb25UeXBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGUgb2JqZWN0IHR5cGUgZmllbGRzIGFuZCB1cGRhdGUgcmV0dXJuVHlwZSBvZiBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUgZnJvbSBzdHJpbmcgdHlwZSB0byBhY3R1YWwgdHlwZS5cclxuICAgICAqIFdoeT8gQXBwU3luYyByZXNvbHZhYmxlIGZpZWxkcyByZXF1aXJlIGEgZGF0YSB0eXBlLiBCdXQgdGhhdCBkYXRhIHR5cGUgbWF5IG5vdCBhbHJlYWR5IGV4aXN0IHlldC4gRm9yIGV4YW1wbGU6XHJcbiAgICAgKiAgIFBvc3Qgb2JqZWN0IHR5cGUgaGFzIGZpZWxkIGNvbW1lbnRzIGFuZCBDb21tZW50IG9iamVjdCB0eXBlIGhhcyBmaWVsZCBwb3N0LiBObyBtYXR0ZXIgd2hhdCBvcmRlciB0aGVzZSBvYmplY3QgdHlwZXMgYXJlIGNyZWF0ZWQgaW4sIGFuIG9iamVjdCB0eXBlIHdvbid0IGV4aXN0IHlldC5cclxuICAgICAqICAgSWYgY29tbWVudCBpcyBjcmVhdGVkIGZpcnN0LCB0aGVyZSBpcyBubyBjb21tZW50IG9iamVjdCB0eXBlLiBJZiBjb21tZW50IGlzIGNyZWF0ZWQgZmlyc3QsIHRoZXJlIGlzIG5vIHBvc3Qgb2JqZWN0IHR5cGUuXHJcbiAgICAgKiBUbyB3b3JrIGFyb3VuZCB0aGlzIGNoaWNrZW4gb3IgZWdnIGxpbWl0YXRpb24sIEpvbXB4IGRlZmluZXMgYSBjdXN0b20gdHlwZSB0aGF0IGFsbG93cyBhIHN0cmluZyB0eXBlIHRvIGJlIHNwZWNpZmllZC4gZS5nLlxyXG4gICAgICogICBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlKHsgb2JqZWN0VHlwZU5hbWU6ICdNUG9zdCcsIGlzTGlzdDogZmFsc2UgfSksXHJcbiAgICAgKiBUaGlzIG1ldGhvZCB1c2VzIHRoZSBzdHJpbmcgdHlwZSB0byBhZGQgYW4gYWN0dWFsIHR5cGUuXHJcbiAgICAgKlxyXG4gICAgICogQ2F1dGlvbjogQ2hhbmdlcyB0byBBcHBTeW5jIGltcGxlbWVudGF0aW9uIGRldGFpbHMgbWF5IGJyZWFrIHRoaXMgbWV0aG9kLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIHJlc29sdmVPYmplY3Qob2JqZWN0VHlwZTogYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcblxyXG4gICAgICAgIC8vIEl0ZXJhdGUgb2JqZWN0IHR5cGUgZmllbGRzLlxyXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKG9iamVjdFR5cGUuZGVmaW5pdGlvbikuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIElmIGZpZWxkIG9mIEpvbXB4R3JhcGhxbFR5cGUgdHlwZSAodGhlbiB1c2Ugc3RyaW5nIHR5cGUgdG8gYWRkIGFjdHVhbCB0eXBlKS5cclxuICAgICAgICAgICAgaWYgKHZhbHVlLmZpZWxkT3B0aW9ucz8ucmV0dXJuVHlwZSBpbnN0YW5jZW9mIEpvbXB4R3JhcGhxbFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIFwib2xkXCIgZmllbGQgd2l0aCB0aGUgbmV3IFwiZmllbGRcIi5cclxuICAgICAgICAgICAgICAgIG9iamVjdFR5cGUuZGVmaW5pdGlvbltrZXldID0gQXBwU3luY1NjaGVtYUJ1aWxkZXIucmVzb2x2ZVJlc29sdmFibGVGaWVsZCh0aGlzLnNjaGVtYVR5cGVzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlc29sdmUgYW4gQXBwU3luYyBSZXNvbHZhYmxlRmllbGQgd2l0aCBhIEpvbXB4R3JhcGhxbFR5cGUgKHdpdGggc3RyaW5nIHR5cGUpIHRvIGEgUmVzb2x2YWJsZUZpZWxkIHdpdGggYSBHcmFwaHFsVHlwZSAod2l0aCBhbiBhY3R1YWwgdHlwZSkuXHJcbiAgICAgKi9cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbWVtYmVyLW9yZGVyaW5nXHJcbiAgICBwcml2YXRlIHN0YXRpYyByZXNvbHZlUmVzb2x2YWJsZUZpZWxkKHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZXMsIHJlc29sdmFibGVGaWVsZDogYXBwc3luYy5SZXNvbHZhYmxlRmllbGQpOiBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCB7XHJcblxyXG4gICAgICAgIGxldCBydiA9IHJlc29sdmFibGVGaWVsZDtcclxuXHJcbiAgICAgICAgaWYgKHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnM/LnJldHVyblR5cGUgaW5zdGFuY2VvZiBKb21weEdyYXBocWxUeXBlKSB7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBHcmFwaFFMIGRhdGF0eXBlIHdpdGggYWN0dWFsIHR5cGUuXHJcbiAgICAgICAgICAgIGNvbnN0IG5ld0dyYXBocWxUeXBlID0gcmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucy5yZXR1cm5UeXBlLnJlc29sdmUoc2NoZW1hVHlwZXMpO1xyXG4gICAgICAgICAgICAvLyBVcGRhdGUgZXhpc3RpbmcgcmVzb2x2YWJsZSBmaWVsZCBvcHRpb25zIFwib2xkXCIgR3JhcGhRTCBkYXRhdHlwZSB3aXRoIFwibmV3XCIgR3JhcGhRTCBkYXRhdHlwZS5cclxuICAgICAgICAgICAgc2V0KHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMsICdyZXR1cm5UeXBlJywgbmV3R3JhcGhxbFR5cGUpO1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbmV3IHJlc29sdmFibGUgZmllbGQgd2l0aCBtb2RpZmllZCByZXNvbHZhYmxlIGZpZWxkIG9wdGlvbnMuXHJcbiAgICAgICAgICAgIHJ2ID0gbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2V4cGxhaW5pbmctZ3JhcGhxbC1jb25uZWN0aW9ucy9cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRGaW5kKG9iamVjdFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICBjb25zdCBvYmplY3RUeXBlTmFtZSA9IG9iamVjdFR5cGUubmFtZTtcclxuICAgICAgICBjb25zdCBwYWdpbmF0aW9uVHlwZTogUGFnaW5hdGlvblR5cGUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIoJ3BhZ2luYXRpb24nLCAndHlwZScsIG9iamVjdFR5cGU/LmRpcmVjdGl2ZXMpIGFzIFBhZ2luYXRpb25UeXBlID8/ICdvZmZzZXQnO1xyXG4gICAgICAgIGNvbnN0IGRhdGFTb3VyY2VOYW1lID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKCdkYXRhc291cmNlJywgJ25hbWUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKTtcclxuXHJcbiAgICAgICAgaWYgKGRhdGFTb3VyY2VOYW1lXHJcbiAgICAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3JcclxuICAgICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldFxyXG4gICAgICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0XHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmRhdGFTb3VyY2VzW2RhdGFTb3VyY2VOYW1lXTtcclxuXHJcbiAgICAgICAgICAgIC8vIEVkZ2UuXHJcbiAgICAgICAgICAgIGNvbnN0IGVkZ2VPYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1FZGdlYCwge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIC4uLihwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicpICYmIHsgY3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgfSwgLy8gSWYgcGFnaW5hdGlvbiB0eXBlIGN1cnNvciB0aGVuIGluY2x1ZGUgcmVxdWlyZWQgY3Vyc29yIHByb3BlcnR5LlxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IG9iamVjdFR5cGUuYXR0cmlidXRlKClcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuaWFtKClcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGVkZ2VPYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENvbm5lY3Rpb24uIEJhc2VkIG9uIHJlbGF5IHNwZWNpZmljYXRpb246IGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy1Db25uZWN0aW9uLVR5cGVzXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbm5lY3Rpb25PYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1Db25uZWN0aW9uYCwge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVkZ2VzOiBlZGdlT2JqZWN0VHlwZS5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZUluZm86IHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJyA/IHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3IuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSA6IHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXQuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbENvdW50OiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpIC8vIEFwb2xsbyBzdWdnZXN0cyBhZGRpbmcgYXMgYSBjb25uZWN0aW9uIHByb3BlcnR5OiBodHRwczovL2dyYXBocWwub3JnL2xlYXJuL3BhZ2luYXRpb24vXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShjb25uZWN0aW9uT2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgZGVmYXVsdCBxdWVyeSBhcmd1bWVudHMuXHJcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBmaWx0ZXIgYXJndW1lbnQuXHJcbiAgICAgICAgICAgIHNldChhcmdzLCAnZmlsdGVyJywgYXBwc3luYy5HcmFwaHFsVHlwZS5hd3NKc29uKCkpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHNvcnQgYXJndW1lbnQuXHJcbiAgICAgICAgICAgIHNldChhcmdzLCAnc29ydCcsIHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcy5Tb3J0SW5wdXQuYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgcGFnaW5hdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgICAgICAgIGlmIChwYWdpbmF0aW9uVHlwZSA9PT0gJ29mZnNldCcpIHtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnc2tpcCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdsaW1pdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgY3Vyc29yIHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InKSB7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2ZpcnN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2FmdGVyJywgYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2xhc3QnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnYmVmb3JlJywgYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBxdWVyeS5cclxuICAgICAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGBmaW5kJHtvYmplY3RUeXBlTmFtZVBsdXJhbH1gLCBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkUXVlcnkoYCR7Y2hhbmdlQ2FzZS5jYW1lbENhc2Uob2JqZWN0VHlwZU5hbWUpfUZpbmRgLCBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogY29ubmVjdGlvbk9iamVjdFR5cGUuYXR0cmlidXRlKCksXHJcbiAgICAgICAgICAgICAgICBhcmdzLFxyXG4gICAgICAgICAgICAgICAgZGF0YVNvdXJjZSxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIC8vIHBpcGVsaW5lQ29uZmlnOiBbXSwgLy8gVE9ETzogQWRkIGF1dGhvcml6YXRpb24gTGFtYmRhIGZ1bmN0aW9uIGhlcmUuXHJcbiAgICAgICAgICAgICAgICAvLyBVc2UgdGhlIHJlcXVlc3QgbWFwcGluZyB0byBpbmplY3Qgc3Rhc2ggdmFyaWFibGVzIChmb3IgdXNlIGluIExhbWJkYSBmdW5jdGlvbikuXHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcIm9wZXJhdGlvblwiLCBcImZpbmRcIikpXHJcbiAgICAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvYmplY3RUeXBlTmFtZVwiLCBcIiR7b2JqZWN0VHlwZU5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwicmV0dXJuVHlwZU5hbWVcIiwgXCIke2Nvbm5lY3Rpb25PYmplY3RUeXBlLm5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgICR7RGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAgICAgICAgICAgICBgKVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHBhZ2luYXRpb24gcGFnZUluZm8gdHlwZXMgZm9yIG9mZnNldCBhbmQgY3Vyc29yIGJhc2VkIHBhZ2luYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQ3Vyc29yIHBhZ2luYXRpb24uIFBhZ2UgYW5kIHNvcnQgYnkgdW5pcXVlIGZpZWxkLiBDb25jYXRlbmF0ZWQgZmllbGRzIGNhbiByZXN1bHQgaW4gcG9vciBwZXJmb3JtYW5jZS5cclxuICAgICAqIGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy1Db25uZWN0aW9uLVR5cGVzXHJcbiAgICAgKiBodHRwczovL3Nob3BpZnkuZW5naW5lZXJpbmcvcGFnaW5hdGlvbi1yZWxhdGl2ZS1jdXJzb3JzXHJcbiAgICAgKiBodHRwczovL21lZGl1bS5jb20vc3dsaC9ob3ctdG8taW1wbGVtZW50LWN1cnNvci1wYWdpbmF0aW9uLWxpa2UtYS1wcm8tNTEzMTQwYjY1ZjMyXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkUGFnZUluZm9UeXBlKCkge1xyXG5cclxuICAgICAgICAvLyBPZmZzZXQgcGFnaW5hdGlvbi5cclxuICAgICAgICBjb25zdCBwYWdlSW5mb09mZnNldCA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ1BhZ2VJbmZvT2Zmc2V0Jywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBza2lwOiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvT2Zmc2V0ID0gcGFnZUluZm9PZmZzZXQ7XHJcblxyXG4gICAgICAgIC8vIEN1cnNvciBwYWdpbmF0aW9uLlxyXG4gICAgICAgIGNvbnN0IHBhZ2VJbmZvQ3Vyc29yID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZSgnUGFnZUluZm9DdXJzb3InLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIGhhc1ByZXZpb3VzUGFnZTogYXBwc3luYy5HcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGhhc05leHRQYWdlOiBhcHBzeW5jLkdyYXBocWxUeXBlLmJvb2xlYW4oeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRDdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGVuZEN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yID0gcGFnZUluZm9DdXJzb3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgc29ydCBpbnB1dCB0eXBlIGZvciBtdWx0aSBjb2x1bW4gc29ydGluZy5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRTb3J0SW5wdXQoKSB7XHJcblxyXG4gICAgICAgIGNvbnN0IHNvcnRJbnB1dCA9IG5ldyBhcHBzeW5jLklucHV0VHlwZSgnU29ydElucHV0Jywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0ID0gc29ydElucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGUuZy4gTVBvc3QgPiBtcG9zdCwgTXlTcWxQb3N0ID4gbXlTcWxQb3N0LCBNeVBvc3QgPiBteVBvc3RcclxuICAgIC8vIHByaXZhdGUgb3BlcmF0aW9uTmFtZUZyb21UeXBlKHM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAvLyAgICAgcmV0dXJuIHMuY2hhckF0KDApLnRvTG9jYWxlTG93ZXJDYXNlKCkgKyBzLmNoYXJBdCgxKS50b0xvY2FsZUxvd2VyQ2FzZSgpICsgcy5zbGljZSgyKTtcclxuICAgIC8vIH1cclxufVxyXG5cclxuXHJcbi8qXHJcbkNvbnNpZGVyOlxyXG50eXBlIFBhZ2luYXRpb25JbmZvIHtcclxuICAjIFRvdGFsIG51bWJlciBvZiBwYWdlc1xyXG4gIHRvdGFsUGFnZXM6IEludCFcclxuXHJcbiAgIyBUb3RhbCBudW1iZXIgb2YgaXRlbXNcclxuICB0b3RhbEl0ZW1zOiBJbnQhXHJcblxyXG4gICMgQ3VycmVudCBwYWdlIG51bWJlclxyXG4gIHBhZ2U6IEludCFcclxuXHJcbiAgIyBOdW1iZXIgb2YgaXRlbXMgcGVyIHBhZ2VcclxuICBwZXJQYWdlOiBJbnQhXHJcblxyXG4gICMgV2hlbiBwYWdpbmF0aW5nIGZvcndhcmRzLCBhcmUgdGhlcmUgbW9yZSBpdGVtcz9cclxuICBoYXNOZXh0UGFnZTogQm9vbGVhbiFcclxuXHJcbiAgIyBXaGVuIHBhZ2luYXRpbmcgYmFja3dhcmRzLCBhcmUgdGhlcmUgbW9yZSBpdGVtcz9cclxuICBoYXNQcmV2aW91c1BhZ2U6IEJvb2xlYW4hXHJcbn1cclxuKi9cclxuXHJcblxyXG4vKlxyXG5Eb2VzIEFwcEF5c25jIHN1cHBvcnQgdGhpcz9cclxuIyBBIHNpbmdsZSBsaW5lLCB0eXBlLWxldmVsIGRlc2NyaXB0aW9uXHJcblwiUGFzc2VuZ2VyIGRldGFpbHNcIlxyXG50eXBlIFBhc3NlbmdlciB7XHJcbiAgXCJcIlwiICBhIG11bHRpLWxpbmUgZGVzY3JpcHRpb25cclxuICB0aGUgaWQgaXMgZ2VuZXJhbCB1c2VyIGlkIFwiXCJcIlxyXG4gIGlkOiBJRCFcclxuICBuYW1lOiBTdHJpbmchXHJcbiAgYWdlOiBJbnQhXHJcbiAgYWRkcmVzczogU3RyaW5nIVxyXG4gIFwic2luZ2xlIGxpbmUgZGVzY3JpcHRpb246IGl0IGlzIHBhc3NlbmdlciBpZFwiXHJcbiAgcGFzc2VuZ2VySWQ6IElEIVxyXG59XHJcbiovIl19