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
const definitions = require("./app-sync-definitions");
// import { AppSyncMySqlCustomDirective } from './datasources/mysql/mysql.directive';
const cdirective = require("./directives");
const graphql_type_1 = require("./graphql-type");
const cschema = require("./schemas");
const coperation = require("./operations");
class AppSyncSchemaBuilder {
    constructor(graphqlApi, activeAuthorizationTypes) {
        this.graphqlApi = graphqlApi;
        this.activeAuthorizationTypes = activeAuthorizationTypes;
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
                // appsync.Directive.cognito('admin')
            ]
        });
        this.graphqlApi.addType(outputType);
        // Add payload type (to GraphQL).
        const payloadType = new aws_appsync_alpha_1.ObjectType(`${changeCase.pascalCase(returnType.name)}Output`, {
            definition: {
                output: outputType.attribute()
            },
            directives: [
                ...[
                    appsync.Directive.iam()
                    // appsync.Directive.cognito('admin')
                ],
                ...((_b = returnType === null || returnType === void 0 ? void 0 : returnType.directives) !== null && _b !== void 0 ? _b : [])
            ]
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
                // appsync.Directive.cognito('admin')
            ],
            // pipelineConfig: [], // TODO: Add authorization Lambda function here.
            requestMappingTemplate: appsync.MappingTemplate.fromString(`
                $util.qr($ctx.stash.put("operation", "${methodName}"))
                ${definitions.DefaultRequestMappingTemplate}
            `)
        }));
    }
    create() {
        // this.graphqlApi.addToSchema('directive @readonly(value: String) on FIELD_DEFINITION');
        // this.graphqlApi.addToSchema(CustomDirective.definitions());
        // TODO: How are we going to add MySql custom directives? and schema?
        // this.graphqlApi.addToSchema(AppSyncMySqlCustomDirective.schema());
        this.addCustomDirectives();
        this.addCustomSchema();
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
            const operationsDirective = new cdirective.OperationsDirective();
            const operations = operationsDirective.value(objectType.directives);
            if (operations === null || operations === void 0 ? void 0 : operations.length) {
                if (operations.includes('find')) {
                    const findOperation = new coperation.FindOperation(this.graphqlApi, this.dataSources, this.schemaTypes);
                    findOperation.schema(objectType);
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
    // private addFindConnection(objectType: appsync.ObjectType) {
    //     const objectTypeName = objectType.name;
    //     const paginationType: ICustomDirectivePaginationType = CustomDirective.getIdentifierArgument('pagination', 'type', objectType?.directives) as ICustomDirectivePaginationType ?? 'offset';
    //     const dataSourceName = CustomDirective.getIdentifierArgument('datasource', 'name', objectType?.directives);
    //     if (dataSourceName
    //         && this.schemaTypes.objectTypes.PageInfoCursor
    //         && this.schemaTypes.objectTypes.PageInfoOffset
    //         && this.schemaTypes.inputTypes.SortInput
    //     ) {
    //         const dataSource = this.dataSources[dataSourceName];
    //         const authRules = CustomDirective.authToObject(objectType?.directives);
    //         // Edge.
    //         const edgeObjectType = new appsync.ObjectType(`${objectTypeName}Edge`, {
    //             definition: {
    //                 ...(paginationType === 'cursor') && { cursor: appsync.GraphqlType.string({ isRequired: true }) }, // If pagination type cursor then include required cursor property.
    //                 node: objectType.attribute()
    //             },
    //             directives: [
    //                 ...authRules?.find(o => o.provider === appsync.AuthorizationType.IAM) ? [appsync.Directive.iam()] : []
    //                 // appsync.Directive.cognito('admin')
    //             ]
    //         });
    //         this.graphqlApi.addType(edgeObjectType);
    //         // Connection. Based on relay specification: https://relay.dev/graphql/connections.htm#sec-Connection-Types
    //         const connectionObjectType = new appsync.ObjectType(`${objectTypeName}Connection`, {
    //             definition: {
    //                 edges: edgeObjectType.attribute({ isList: true }),
    //                 pageInfo: paginationType === 'cursor' ? this.schemaTypes.objectTypes.PageInfoCursor.attribute({ isRequired: true }) : this.schemaTypes.objectTypes.PageInfoOffset.attribute({ isRequired: true }),
    //                 totalCount: appsync.GraphqlType.int() // Apollo suggests adding as a connection property: https://graphql.org/learn/pagination/
    //             },
    //             directives: [
    //                 ...authRules?.find(o => o.provider === appsync.AuthorizationType.IAM) ? [appsync.Directive.iam()] : []
    //                 // appsync.Directive.cognito('admin')
    //             ]
    //         });
    //         this.graphqlApi.addType(connectionObjectType);
    //         // Add default query arguments.
    //         const args = {};
    //         // Add filter argument.
    //         set(args, 'filter', appsync.GraphqlType.awsJson());
    //         // Add sort argument.
    //         set(args, 'sort', this.schemaTypes.inputTypes.SortInput.attribute({ isList: true }));
    //         // Add offset pagination arguments.
    //         if (paginationType === 'offset') {
    //             set(args, 'skip', appsync.GraphqlType.int());
    //             set(args, 'limit', appsync.GraphqlType.int());
    //         }
    //         // Add cursor pagination arguments.
    //         if (paginationType === 'cursor') {
    //             set(args, 'first', appsync.GraphqlType.int());
    //             set(args, 'after', appsync.GraphqlType.string());
    //             set(args, 'last', appsync.GraphqlType.int());
    //             set(args, 'before', appsync.GraphqlType.string());
    //         }
    //         // Add query.
    //         // this.graphqlApi.addQuery(`find${objectTypeNamePlural}`, new appsync.ResolvableField({
    //         this.graphqlApi.addQuery(`${changeCase.camelCase(objectTypeName)}Find`, new appsync.ResolvableField({
    //             returnType: connectionObjectType.attribute(),
    //             args,
    //             dataSource,
    //             directives: [
    //                 ...authRules?.find(o => o.provider === appsync.AuthorizationType.IAM) ? [appsync.Directive.iam()] : []
    //                 // appsync.Directive.cognito('admin')
    //             ],
    //             // pipelineConfig: [], // TODO: Add authorization Lambda function here.
    //             // Use the request mapping to inject stash variables (for use in Lambda function).
    //             requestMappingTemplate: appsync.MappingTemplate.fromString(`
    //                 $util.qr($ctx.stash.put("operation", "find"))
    //                 $util.qr($ctx.stash.put("objectTypeName", "${objectTypeName}"))
    //                 $util.qr($ctx.stash.put("returnTypeName", "${connectionObjectType.name}"))
    //                 ${DefaultRequestMappingTemplate}
    //             `)
    //         }));
    //     }
    // }
    addCustomDirectives() {
        // Auth.
        const auth = new cdirective.AuthDirective();
        // this.graphqlApi.addToSchema(auth.definition());
        auth.schema(this.schemaTypes);
        // Cognito.
        const cognito = new cdirective.CognitoDirective();
        // this.graphqlApi.addToSchema(cognito.definition());
        cognito.schema(this.schemaTypes);
        // Datasource.
        const datasource = new cdirective.DatasourceDirective();
        // this.graphqlApi.addToSchema(datasource.definition());
        datasource.schema(this.schemaTypes);
        // Lookup.
        const lookup = new cdirective.LookupDirective();
        // this.graphqlApi.addToSchema(lookup.definition());
        lookup.schema(this.schemaTypes);
        // Operations.
        const operations = new cdirective.OperationsDirective();
        // this.graphqlApi.addToSchema(operations.definition());
        operations.schema(this.schemaTypes);
        // Pagination.
        const pagination = new cdirective.PaginationDirective();
        // this.graphqlApi.addToSchema(pagination.definition());
        pagination.schema(this.schemaTypes);
        // Readonly.
        const readonly = new cdirective.ReadonlyDirective();
        // this.graphqlApi.addToSchema(readonly.definition());
        readonly.schema(this.schemaTypes);
        // Source.
        const source = new cdirective.SourceDirective();
        // this.graphqlApi.addToSchema(source.definition());
        source.schema(this.schemaTypes);
    }
    addCustomSchema() {
        // Pagination cursor.
        const paginationCursor = new cschema.PaginationCursorSchema();
        paginationCursor.schema(this.schemaTypes, this.activeAuthorizationTypes);
        // Pagination offset
        const paginationOffset = new cschema.PaginationOffsetSchema();
        paginationOffset.schema(this.schemaTypes, this.activeAuthorizationTypes);
        // Sort.
        // TODO: JSON sort to match MongoDB sort? Field list input type is better but not a good fit for unlimited nested fields.
        // const sort = new cschema.SortSchema();
        // sort.schema(this.schemaTypes);
    }
}
exports.AppSyncSchemaBuilder = AppSyncSchemaBuilder;
_a = JSII_RTTI_SYMBOL_1;
AppSyncSchemaBuilder[_a] = { fqn: "@jompx/constructs.AppSyncSchemaBuilder", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvc2NoZW1hLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBc0Q7QUFDdEQsa0VBQXdEO0FBRXhELDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsaUVBQWlFO0FBQ2pFLDJDQUEyQztBQUMzQyxpRUFBaUU7QUFDakUsaUNBQWtDO0FBQ2xDLHFDQUFxQztBQUNyQyxzREFBc0Q7QUFFdEQscUZBQXFGO0FBQ3JGLDJDQUEyQztBQUMzQyxpREFBa0Q7QUFDbEQscUNBQXFDO0FBQ3JDLDJDQUEyQztBQW1EM0MsTUFBYSxvQkFBb0I7SUFLN0IsWUFDVyxVQUE4QixFQUM5Qix3QkFBcUQ7UUFEckQsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFDOUIsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUE2QjtRQUx6RCxnQkFBVyxHQUFnQixFQUFFLENBQUM7UUFDOUIsZ0JBQVcsR0FBaUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUt0SCxDQUFDO0lBRUwsbUhBQW1IO0lBQzVHLGFBQWEsQ0FBQyxFQUFVLEVBQUUsY0FBd0MsRUFBRSxPQUFtQztRQUMxRyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ25FLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFF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QkFBd0IsQ0FBQyxDQUFDO1FBRXpFLG9CQUFvQjtRQUNwQixNQUFNLGdCQUFnQixHQUFHLElBQUksT0FBTyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUQsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFekUsUUFBUTtRQUNSLHlIQUF5SDtRQUN6SCx5Q0FBeUM7UUFDekMsaUNBQWlDO0lBQ3JDLENBQUM7O0FBOVVMLG9EQXNhQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgeyBPYmplY3RUeXBlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG4vLyBpbXBvcnQgcGx1cmFsaXplID0gcmVxdWlyZSgncGx1cmFsaXplJyk7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbmltcG9ydCBzZXQgPSByZXF1aXJlKCdzZXQtdmFsdWUnKTtcclxuLy8gaW1wb3J0IGdldCA9IHJlcXVpcmUoJ2dldC12YWx1ZScpO1xyXG5pbXBvcnQgKiBhcyBkZWZpbml0aW9ucyBmcm9tICcuL2FwcC1zeW5jLWRlZmluaXRpb25zJztcclxuaW1wb3J0IHsgSURhdGFTb3VyY2UsIElTY2hlbWFUeXBlcywgSUFwcFN5bmNPcGVyYXRpb25BcmdzIH0gZnJvbSAnLi9hcHAtc3luYy50eXBlcyc7XHJcbi8vIGltcG9ydCB7IEFwcFN5bmNNeVNxbEN1c3RvbURpcmVjdGl2ZSB9IGZyb20gJy4vZGF0YXNvdXJjZXMvbXlzcWwvbXlzcWwuZGlyZWN0aXZlJztcclxuaW1wb3J0ICogYXMgY2RpcmVjdGl2ZSBmcm9tICcuL2RpcmVjdGl2ZXMnO1xyXG5pbXBvcnQgeyBKb21weEdyYXBocWxUeXBlIH0gZnJvbSAnLi9ncmFwaHFsLXR5cGUnO1xyXG5pbXBvcnQgKiBhcyBjc2NoZW1hIGZyb20gJy4vc2NoZW1hcyc7XHJcbmltcG9ydCAqIGFzIGNvcGVyYXRpb24gZnJvbSAnLi9vcGVyYXRpb25zJztcclxuXHJcblxyXG4vKipcclxuICogQ3Vyc29yIEVkZ2UgTm9kZTogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2V4cGxhaW5pbmctZ3JhcGhxbC1jb25uZWN0aW9ucy9cclxuICogU3VwcG9ydCByZWxheSBvciBub3Q/XHJcbiAqIGh0dHBzOi8vbWVkaXVtLmNvbS9vcGVuLWdyYXBocWwvdXNpbmctcmVsYXktd2l0aC1hd3MtYXBwc3luYy01NWM4OWNhMDIwNjZcclxuICogSm9pbnMgc2hvdWxkIGJlIGNvbm5lY3Rpb25zIGFuZCBuYW1lZCBhcyBzdWNoLiBlLmcuIGluIHBvc3QgVGFnc0Nvbm5lY3Rpb25cclxuICogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLXVuZGVmaW5lZC5QYWdlSW5mb1xyXG4gKiBodHRwczovL2dyYXBocWwtcnVsZXMuY29tL3J1bGVzL2xpc3QtcGFnaW5hdGlvblxyXG4gKiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvYmFzaWNzL2Rlc2lnbmluZy1ncmFwaHFsLW11dGF0aW9ucy9cclxuICogLSBNdXRhdGlvbjogVXNlIHRvcCBsZXZlbCBpbnB1dCB0eXBlIGZvciBhZ3MuIFVzZSB0b3AgbGV2ZWwgcHJvcGVydHkgZm9yIG91dHB1dCB0eXBlLlxyXG4gKi9cclxuXHJcbi8vIFRPRE8gTWFrZSBzdXJlIHdlIGNhbiBjYWxsIGEgbXV0YXRpb24gYW5kIGNhbGwgYSBxdWVyeT8gaHR0cHM6Ly9ncmFwaHFsLXJ1bGVzLmNvbS9ydWxlcy9tdXRhdGlvbi1wYXlsb2FkLXF1ZXJ5XHJcbi8vIFRPRE8gQWRkIHNjaGVtYSBkb2N1bWVudGlvbiBtYXJrdXA6IGh0dHA6Ly9zcGVjLmdyYXBocWwub3JnL2RyYWZ0LyNzZWMtRGVzY3JpcHRpb25zXHJcbi8vIEludGVyZXN0aW5nIHR5cGVkIGVycm9yczogaHR0cHM6Ly9ncmFwaHFsLXJ1bGVzLmNvbS9ydWxlcy9tdXRhdGlvbi1wYXlsb2FkLWVycm9yc1xyXG5cclxuLypcclxudHlwZSBVc2VyRnJpZW5kc0Nvbm5lY3Rpb24ge1xyXG4gIHBhZ2VJbmZvOiBQYWdlSW5mbyFcclxuICBlZGdlczogW1VzZXJGcmllbmRzRWRnZV1cclxufXR5cGUgVXNlckZyaWVuZHNFZGdlIHtcclxuICBjdXJzb3I6IFN0cmluZyFcclxuICBub2RlOiBVc2VyXHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUFkZE11dGF0aW9uQXJndW1lbnRzIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIG11dGF0aW9uIGFzIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBHcmFwaFFMIHNjaGVtYS5cclxuICAgICAqL1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbXV0YXRpb24gZGF0YXNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgZGF0YVNvdXJjZU5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogTXV0YXRpb24gaW5wdXQgYXJndW1lbnRzLiBUaGVzZSBzaG91bGQgZXhhY3RseSBtYXRjaCB0aGUgbnVtYmVyIGFuZCBvcmRlciBvZiBhcmd1bWVudHMgaW4gdGhlIG1ldGhvZCB0aGUgbXV0YXRpb24gd2lsbCBjYWxsLlxyXG4gICAgICovXHJcbiAgICBhcmdzOiBJQXBwU3luY09wZXJhdGlvbkFyZ3M7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBtdXRhdGlvbiByZXR1cm4gb2JqZWN0IHR5cGUuXHJcbiAgICAgKi9cclxuICAgIHJldHVyblR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZTtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG11dGF0aW9uIG1ldGhvZCB0byBjYWxsLlxyXG4gICAgICovXHJcbiAgICBtZXRob2ROYW1lPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwU3luY1NjaGVtYUJ1aWxkZXIge1xyXG5cclxuICAgIHB1YmxpYyBkYXRhU291cmNlczogSURhdGFTb3VyY2UgPSB7fTtcclxuICAgIHB1YmxpYyBzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzID0geyBlbnVtVHlwZXM6IHt9LCBpbnB1dFR5cGVzOiB7fSwgaW50ZXJmYWNlVHlwZXM6IHt9LCBvYmplY3RUeXBlczoge30sIHVuaW9uVHlwZXM6IHt9IH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIGdyYXBocWxBcGk6IGFwcHN5bmMuR3JhcGhxbEFwaSxcclxuICAgICAgICBwdWJsaWMgYWN0aXZlQXV0aG9yaXphdGlvblR5cGVzOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlW11cclxuICAgICkgeyB9XHJcblxyXG4gICAgLy8gQWRkIGRhdGFzb3VyY2UgdG8gQXBwU3luYyBpbiBhbiBpbnRlcm5hbCBhcnJheS4gUmVtb3ZlIHRoaXMgd2hlbiBBcHBTeW5jIHByb3ZpZGVzIGEgd2F5IHRvIGl0ZXJhdGUgZGF0YXNvdXJjZXMpLlxyXG4gICAgcHVibGljIGFkZERhdGFTb3VyY2UoaWQ6IHN0cmluZywgbGFtYmRhRnVuY3Rpb246IGNkay5hd3NfbGFtYmRhLklGdW5jdGlvbiwgb3B0aW9ucz86IGFwcHN5bmMuRGF0YVNvdXJjZU9wdGlvbnMpOiBhcHBzeW5jLkxhbWJkYURhdGFTb3VyY2Uge1xyXG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBgQXBwU3luY0RhdGFTb3VyY2Uke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShpZCl9YDtcclxuICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5ncmFwaHFsQXBpLmFkZExhbWJkYURhdGFTb3VyY2UoaWRlbnRpZmllciwgbGFtYmRhRnVuY3Rpb24sIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSB7IC4uLnRoaXMuZGF0YVNvdXJjZXMsIC4uLnsgW2lkXTogZGF0YVNvdXJjZSB9IH07XHJcbiAgICAgICAgcmV0dXJuIGRhdGFTb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFNjaGVtYVR5cGVzKHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZXMpIHtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzID0geyAuLi50aGlzLnNjaGVtYVR5cGVzLCAuLi5zY2hlbWFUeXBlcyB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbXV0YXRpb24gdG8gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICogQHBhcmFtIG5hbWUgLSBOYW1lIG9mIHRoZSBtdXRhdGlvbiBhcyBpdCB3aWxsIGFwcGVhciBpbiB0aGUgR3JhcGhRTCBzY2hlbWEuXHJcbiAgICAgKiBAcGFyYW0gZGF0YVNvdXJjZU5hbWUgLSBZb3VyIGRhdGFzb3VyY2UgbmFtZSBlLmcuIG15U3FsLCBjb2duaXRvLCBwb3N0LlxyXG4gICAgICogQHBhcmFtIGFyZ3MgLSBNdXRhdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgKiBAcGFyYW0gcmV0dXJuVHlwZSAtIE11dGF0aW9uIHJldHVuIHR5cGUgKG9yIG91dHB1dCB0eXBlKS5cclxuICAgICAqIEBwYXJhbSBvcGVyYXRpb24gLSBDbGFzcyBtZXRob2QgdGhlIG11dGF0aW9uIHdpbGwgY2FsbCB0byByZXR1biByZXN1bHQuXHJcbiAgICAgKiBAcmV0dXJucyAtIFRoZSBtdXRhdGlvbi5cclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbXV0YXRpb24gdG8gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkTXV0YXRpb24oeyBuYW1lLCBkYXRhU291cmNlTmFtZSwgYXJncywgcmV0dXJuVHlwZSwgbWV0aG9kTmFtZSB9OiBJQWRkTXV0YXRpb25Bcmd1bWVudHMpOiBhcHBzeW5jLk9iamVjdFR5cGUge1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBBZGQgc2NoZW1hIHR5cGVzLlxyXG5cclxuICAgICAgICAvLyBDaGVjayBkYXRhc291cmNlIGV4aXN0cy5cclxuICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcbiAgICAgICAgaWYgKCFkYXRhU291cmNlKSB0aHJvdyBFcnJvcihgSm9tcHg6IGRhdGFTb3VyY2UgXCIke2RhdGFTb3VyY2VOYW1lfVwiIG5vdCBmb3VuZCFgKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGlucHV0IHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIGNvbnN0IGlucHV0VHlwZSA9IG5ldyBhcHBzeW5jLklucHV0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocmV0dXJuVHlwZS5uYW1lKX1JbnB1dGAsIHsgZGVmaW5pdGlvbjogYXJncyB9KTtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnB1dFR5cGUpO1xyXG5cclxuICAgICAgICAvLyBBZGQgb3V0cHV0IHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIGNvbnN0IG91dHB1dFR5cGUgPSBuZXcgT2JqZWN0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocmV0dXJuVHlwZS5uYW1lKX1QYXlsb2FkYCwge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiByZXR1cm5UeXBlLmRlZmluaXRpb24sXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXHJcbiAgICAgICAgICAgICAgICAvLyBhcHBzeW5jLkRpcmVjdGl2ZS5jb2duaXRvKCdhZG1pbicpXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShvdXRwdXRUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIHBheWxvYWQgdHlwZSAodG8gR3JhcGhRTCkuXHJcbiAgICAgICAgY29uc3QgcGF5bG9hZFR5cGUgPSBuZXcgT2JqZWN0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocmV0dXJuVHlwZS5uYW1lKX1PdXRwdXRgLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0VHlwZS5hdHRyaWJ1dGUoKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAuLi5bXHJcbiAgICAgICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuaWFtKClcclxuICAgICAgICAgICAgICAgICAgICAvLyBhcHBzeW5jLkRpcmVjdGl2ZS5jb2duaXRvKCdhZG1pbicpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgLi4uKHJldHVyblR5cGU/LmRpcmVjdGl2ZXMgPz8gW10pXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShwYXlsb2FkVHlwZSk7XHJcblxyXG4gICAgICAgIC8vIEFkZCBhbnkgY2hpbGQgcmV0dXJuIHR5cGVzICh0byBHcmFwaFFMKS5cclxuICAgICAgICAvLyBUT0RPOiBNYWtlIHJlY3Vyc2l2ZS5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHJldHVyblR5cGUuZGVmaW5pdGlvbikuZm9yRWFjaChncmFwaHFsVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChncmFwaHFsVHlwZS50eXBlID09PSAnSU5URVJNRURJQVRFJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyYXBocWxUeXBlPy5pbnRlcm1lZGlhdGVUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZ3JhcGhxbFR5cGUuaW50ZXJtZWRpYXRlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gQWRkIG11dGF0aW9uICh0byBHcmFwaFFMKS5cclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaHFsQXBpLmFkZE11dGF0aW9uKG5hbWUsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgIHJldHVyblR5cGU6IHBheWxvYWRUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgICAgICAgICBhcmdzOiB7IGlucHV0OiBpbnB1dFR5cGUuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSB9LFxyXG4gICAgICAgICAgICBkYXRhU291cmNlLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKVxyXG4gICAgICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib3BlcmF0aW9uXCIsIFwiJHttZXRob2ROYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICR7ZGVmaW5pdGlvbnMuRGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAgICAgICAgIGApXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYSgnZGlyZWN0aXZlIEByZWFkb25seSh2YWx1ZTogU3RyaW5nKSBvbiBGSUVMRF9ERUZJTklUSU9OJyk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKEN1c3RvbURpcmVjdGl2ZS5kZWZpbml0aW9ucygpKTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSG93IGFyZSB3ZSBnb2luZyB0byBhZGQgTXlTcWwgY3VzdG9tIGRpcmVjdGl2ZXM/IGFuZCBzY2hlbWE/XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKEFwcFN5bmNNeVNxbEN1c3RvbURpcmVjdGl2ZS5zY2hlbWEoKSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ3VzdG9tRGlyZWN0aXZlcygpO1xyXG4gICAgICAgIHRoaXMuYWRkQ3VzdG9tU2NoZW1hKCk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5lbnVtVHlwZXMpLmZvckVhY2goZW51bVR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShlbnVtVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzKS5mb3JFYWNoKGlucHV0VHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGlucHV0VHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnRlcmZhY2VUeXBlcykuZm9yRWFjaChpbnRlcmZhY2VUeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW50ZXJmYWNlVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcykuZm9yRWFjaChvYmplY3RUeXBlID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9iamVjdChvYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0eXBlIHRvIEdyYXBoUUwuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKG9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uc0RpcmVjdGl2ZSA9IG5ldyBjZGlyZWN0aXZlLk9wZXJhdGlvbnNEaXJlY3RpdmUoKTtcclxuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IG9wZXJhdGlvbnNEaXJlY3RpdmUudmFsdWUob2JqZWN0VHlwZS5kaXJlY3RpdmVzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb25zPy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25zLmluY2x1ZGVzKCdmaW5kJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaW5kT3BlcmF0aW9uID0gbmV3IGNvcGVyYXRpb24uRmluZE9wZXJhdGlvbih0aGlzLmdyYXBocWxBcGksIHRoaXMuZGF0YVNvdXJjZXMsIHRoaXMuc2NoZW1hVHlwZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmRPcGVyYXRpb24uc2NoZW1hKG9iamVjdFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy51bmlvblR5cGVzKS5mb3JFYWNoKHVuaW9uVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHVuaW9uVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcyBhbmQgdXBkYXRlIHJldHVyblR5cGUgb2YgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIGZyb20gc3RyaW5nIHR5cGUgdG8gYWN0dWFsIHR5cGUuXHJcbiAgICAgKiBXaHk/IEFwcFN5bmMgcmVzb2x2YWJsZSBmaWVsZHMgcmVxdWlyZSBhIGRhdGEgdHlwZS4gQnV0IHRoYXQgZGF0YSB0eXBlIG1heSBub3QgYWxyZWFkeSBleGlzdCB5ZXQuIEZvciBleGFtcGxlOlxyXG4gICAgICogICBQb3N0IG9iamVjdCB0eXBlIGhhcyBmaWVsZCBjb21tZW50cyBhbmQgQ29tbWVudCBvYmplY3QgdHlwZSBoYXMgZmllbGQgcG9zdC4gTm8gbWF0dGVyIHdoYXQgb3JkZXIgdGhlc2Ugb2JqZWN0IHR5cGVzIGFyZSBjcmVhdGVkIGluLCBhbiBvYmplY3QgdHlwZSB3b24ndCBleGlzdCB5ZXQuXHJcbiAgICAgKiAgIElmIGNvbW1lbnQgaXMgY3JlYXRlZCBmaXJzdCwgdGhlcmUgaXMgbm8gY29tbWVudCBvYmplY3QgdHlwZS4gSWYgY29tbWVudCBpcyBjcmVhdGVkIGZpcnN0LCB0aGVyZSBpcyBubyBwb3N0IG9iamVjdCB0eXBlLlxyXG4gICAgICogVG8gd29yayBhcm91bmQgdGhpcyBjaGlja2VuIG9yIGVnZyBsaW1pdGF0aW9uLCBKb21weCBkZWZpbmVzIGEgY3VzdG9tIHR5cGUgdGhhdCBhbGxvd3MgYSBzdHJpbmcgdHlwZSB0byBiZSBzcGVjaWZpZWQuIGUuZy5cclxuICAgICAqICAgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIEpvbXB4R3JhcGhxbFR5cGUub2JqZWN0VHlwZSh7IG9iamVjdFR5cGVOYW1lOiAnTVBvc3QnLCBpc0xpc3Q6IGZhbHNlIH0pLFxyXG4gICAgICogVGhpcyBtZXRob2QgdXNlcyB0aGUgc3RyaW5nIHR5cGUgdG8gYWRkIGFuIGFjdHVhbCB0eXBlLlxyXG4gICAgICpcclxuICAgICAqIENhdXRpb246IENoYW5nZXMgdG8gQXBwU3luYyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIG1heSBicmVhayB0aGlzIG1ldGhvZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZXNvbHZlT2JqZWN0KG9iamVjdFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICAvLyBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcy5cclxuICAgICAgICBPYmplY3QuZW50cmllcyhvYmplY3RUeXBlLmRlZmluaXRpb24pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBJZiBmaWVsZCBvZiBKb21weEdyYXBocWxUeXBlIHR5cGUgKHRoZW4gdXNlIHN0cmluZyB0eXBlIHRvIGFkZCBhY3R1YWwgdHlwZSkuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5maWVsZE9wdGlvbnM/LnJldHVyblR5cGUgaW5zdGFuY2VvZiBKb21weEdyYXBocWxUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBcIm9sZFwiIGZpZWxkIHdpdGggdGhlIG5ldyBcImZpZWxkXCIuXHJcbiAgICAgICAgICAgICAgICBvYmplY3RUeXBlLmRlZmluaXRpb25ba2V5XSA9IEFwcFN5bmNTY2hlbWFCdWlsZGVyLnJlc29sdmVSZXNvbHZhYmxlRmllbGQodGhpcy5zY2hlbWFUeXBlcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNvbHZlIGFuIEFwcFN5bmMgUmVzb2x2YWJsZUZpZWxkIHdpdGggYSBKb21weEdyYXBocWxUeXBlICh3aXRoIHN0cmluZyB0eXBlKSB0byBhIFJlc29sdmFibGVGaWVsZCB3aXRoIGEgR3JhcGhxbFR5cGUgKHdpdGggYW4gYWN0dWFsIHR5cGUpLlxyXG4gICAgICovXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L21lbWJlci1vcmRlcmluZ1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVzb2x2ZVJlc29sdmFibGVGaWVsZChzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzLCByZXNvbHZhYmxlRmllbGQ6IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKTogYXBwc3luYy5SZXNvbHZhYmxlRmllbGQge1xyXG5cclxuICAgICAgICBsZXQgcnYgPSByZXNvbHZhYmxlRmllbGQ7XHJcblxyXG4gICAgICAgIGlmIChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zPy5yZXR1cm5UeXBlIGluc3RhbmNlb2YgSm9tcHhHcmFwaHFsVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgR3JhcGhRTCBkYXRhdHlwZSB3aXRoIGFjdHVhbCB0eXBlLlxyXG4gICAgICAgICAgICBjb25zdCBuZXdHcmFwaHFsVHlwZSA9IHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMucmV0dXJuVHlwZS5yZXNvbHZlKHNjaGVtYVR5cGVzKTtcclxuICAgICAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIHJlc29sdmFibGUgZmllbGQgb3B0aW9ucyBcIm9sZFwiIEdyYXBoUUwgZGF0YXR5cGUgd2l0aCBcIm5ld1wiIEdyYXBoUUwgZGF0YXR5cGUuXHJcbiAgICAgICAgICAgIHNldChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zLCAncmV0dXJuVHlwZScsIG5ld0dyYXBocWxUeXBlKTtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyByZXNvbHZhYmxlIGZpZWxkIHdpdGggbW9kaWZpZWQgcmVzb2x2YWJsZSBmaWVsZCBvcHRpb25zLlxyXG4gICAgICAgICAgICBydiA9IG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAgICAgKi9cclxuICAgIC8vIHByaXZhdGUgYWRkRmluZENvbm5lY3Rpb24ob2JqZWN0VHlwZTogYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IG9iamVjdFR5cGVOYW1lID0gb2JqZWN0VHlwZS5uYW1lO1xyXG4gICAgLy8gICAgIGNvbnN0IHBhZ2luYXRpb25UeXBlOiBJQ3VzdG9tRGlyZWN0aXZlUGFnaW5hdGlvblR5cGUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0SWRlbnRpZmllckFyZ3VtZW50KCdwYWdpbmF0aW9uJywgJ3R5cGUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKSBhcyBJQ3VzdG9tRGlyZWN0aXZlUGFnaW5hdGlvblR5cGUgPz8gJ29mZnNldCc7XHJcbiAgICAvLyAgICAgY29uc3QgZGF0YVNvdXJjZU5hbWUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0SWRlbnRpZmllckFyZ3VtZW50KCdkYXRhc291cmNlJywgJ25hbWUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKTtcclxuXHJcbiAgICAvLyAgICAgaWYgKGRhdGFTb3VyY2VOYW1lXHJcbiAgICAvLyAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3JcclxuICAgIC8vICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldFxyXG4gICAgLy8gICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0XHJcbiAgICAvLyAgICAgKSB7XHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmRhdGFTb3VyY2VzW2RhdGFTb3VyY2VOYW1lXTtcclxuICAgIC8vICAgICAgICAgY29uc3QgYXV0aFJ1bGVzID0gQ3VzdG9tRGlyZWN0aXZlLmF1dGhUb09iamVjdChvYmplY3RUeXBlPy5kaXJlY3RpdmVzKTtcclxuXHJcbiAgICAvLyAgICAgICAgIC8vIEVkZ2UuXHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGVkZ2VPYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1FZGdlYCwge1xyXG4gICAgLy8gICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIC4uLihwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicpICYmIHsgY3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgfSwgLy8gSWYgcGFnaW5hdGlvbiB0eXBlIGN1cnNvciB0aGVuIGluY2x1ZGUgcmVxdWlyZWQgY3Vyc29yIHByb3BlcnR5LlxyXG4gICAgLy8gICAgICAgICAgICAgICAgIG5vZGU6IG9iamVjdFR5cGUuYXR0cmlidXRlKClcclxuICAgIC8vICAgICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLi4uYXV0aFJ1bGVzPy5maW5kKG8gPT4gby5wcm92aWRlciA9PT0gYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU0pID8gW2FwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXSA6IFtdXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgLy8gICAgICAgICAgICAgXVxyXG4gICAgLy8gICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZWRnZU9iamVjdFR5cGUpO1xyXG5cclxuICAgIC8vICAgICAgICAgLy8gQ29ubmVjdGlvbi4gQmFzZWQgb24gcmVsYXkgc3BlY2lmaWNhdGlvbjogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLUNvbm5lY3Rpb24tVHlwZXNcclxuICAgIC8vICAgICAgICAgY29uc3QgY29ubmVjdGlvbk9iamVjdFR5cGUgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKGAke29iamVjdFR5cGVOYW1lfUNvbm5lY3Rpb25gLCB7XHJcbiAgICAvLyAgICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgZWRnZXM6IGVkZ2VPYmplY3RUeXBlLmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSxcclxuICAgIC8vICAgICAgICAgICAgICAgICBwYWdlSW5mbzogcGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InID8gdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvci5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIDogdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldC5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRvdGFsQ291bnQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkgLy8gQXBvbGxvIHN1Z2dlc3RzIGFkZGluZyBhcyBhIGNvbm5lY3Rpb24gcHJvcGVydHk6IGh0dHBzOi8vZ3JhcGhxbC5vcmcvbGVhcm4vcGFnaW5hdGlvbi9cclxuICAgIC8vICAgICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLi4uYXV0aFJ1bGVzPy5maW5kKG8gPT4gby5wcm92aWRlciA9PT0gYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU0pID8gW2FwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXSA6IFtdXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgLy8gICAgICAgICAgICAgXVxyXG4gICAgLy8gICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoY29ubmVjdGlvbk9iamVjdFR5cGUpO1xyXG5cclxuICAgIC8vICAgICAgICAgLy8gQWRkIGRlZmF1bHQgcXVlcnkgYXJndW1lbnRzLlxyXG4gICAgLy8gICAgICAgICBjb25zdCBhcmdzID0ge307XHJcblxyXG4gICAgLy8gICAgICAgICAvLyBBZGQgZmlsdGVyIGFyZ3VtZW50LlxyXG4gICAgLy8gICAgICAgICBzZXQoYXJncywgJ2ZpbHRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuYXdzSnNvbigpKTtcclxuXHJcbiAgICAvLyAgICAgICAgIC8vIEFkZCBzb3J0IGFyZ3VtZW50LlxyXG4gICAgLy8gICAgICAgICBzZXQoYXJncywgJ3NvcnQnLCB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0LmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSk7XHJcblxyXG4gICAgLy8gICAgICAgICAvLyBBZGQgb2Zmc2V0IHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgLy8gICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdvZmZzZXQnKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBzZXQoYXJncywgJ3NraXAnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgIC8vICAgICAgICAgICAgIHNldChhcmdzLCAnbGltaXQnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgIC8vICAgICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgICAgLy8gQWRkIGN1cnNvciBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuICAgIC8vICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJykge1xyXG4gICAgLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdmaXJzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdhZnRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdsYXN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAvLyAgICAgICAgICAgICBzZXQoYXJncywgJ2JlZm9yZScsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgLy8gICAgICAgICB9XHJcblxyXG4gICAgLy8gICAgICAgICAvLyBBZGQgcXVlcnkuXHJcbiAgICAvLyAgICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgZmluZCR7b2JqZWN0VHlwZU5hbWVQbHVyYWx9YCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgIC8vICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGAke2NoYW5nZUNhc2UuY2FtZWxDYXNlKG9iamVjdFR5cGVOYW1lKX1GaW5kYCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVyblR5cGU6IGNvbm5lY3Rpb25PYmplY3RUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgLy8gICAgICAgICAgICAgYXJncyxcclxuICAgIC8vICAgICAgICAgICAgIGRhdGFTb3VyY2UsXHJcbiAgICAvLyAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLi4uYXV0aFJ1bGVzPy5maW5kKG8gPT4gby5wcm92aWRlciA9PT0gYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU0pID8gW2FwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXSA6IFtdXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgLy8gICAgICAgICAgICAgXSxcclxuICAgIC8vICAgICAgICAgICAgIC8vIHBpcGVsaW5lQ29uZmlnOiBbXSwgLy8gVE9ETzogQWRkIGF1dGhvcml6YXRpb24gTGFtYmRhIGZ1bmN0aW9uIGhlcmUuXHJcbiAgICAvLyAgICAgICAgICAgICAvLyBVc2UgdGhlIHJlcXVlc3QgbWFwcGluZyB0byBpbmplY3Qgc3Rhc2ggdmFyaWFibGVzIChmb3IgdXNlIGluIExhbWJkYSBmdW5jdGlvbikuXHJcbiAgICAvLyAgICAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgIC8vICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcIm9wZXJhdGlvblwiLCBcImZpbmRcIikpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvYmplY3RUeXBlTmFtZVwiLCBcIiR7b2JqZWN0VHlwZU5hbWV9XCIpKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwicmV0dXJuVHlwZU5hbWVcIiwgXCIke2Nvbm5lY3Rpb25PYmplY3RUeXBlLm5hbWV9XCIpKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICR7RGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAvLyAgICAgICAgICAgICBgKVxyXG4gICAgLy8gICAgICAgICB9KSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgYWRkQ3VzdG9tRGlyZWN0aXZlcygpIHtcclxuXHJcbiAgICAgICAgLy8gQXV0aC5cclxuICAgICAgICBjb25zdCBhdXRoID0gbmV3IGNkaXJlY3RpdmUuQXV0aERpcmVjdGl2ZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShhdXRoLmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgYXV0aC5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIENvZ25pdG8uXHJcbiAgICAgICAgY29uc3QgY29nbml0byA9IG5ldyBjZGlyZWN0aXZlLkNvZ25pdG9EaXJlY3RpdmUoKTtcclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEoY29nbml0by5kZWZpbml0aW9uKCkpO1xyXG4gICAgICAgIGNvZ25pdG8uc2NoZW1hKHRoaXMuc2NoZW1hVHlwZXMpO1xyXG5cclxuICAgICAgICAvLyBEYXRhc291cmNlLlxyXG4gICAgICAgIGNvbnN0IGRhdGFzb3VyY2UgPSBuZXcgY2RpcmVjdGl2ZS5EYXRhc291cmNlRGlyZWN0aXZlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKGRhdGFzb3VyY2UuZGVmaW5pdGlvbigpKTtcclxuICAgICAgICBkYXRhc291cmNlLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzKTtcclxuXHJcbiAgICAgICAgLy8gTG9va3VwLlxyXG4gICAgICAgIGNvbnN0IGxvb2t1cCA9IG5ldyBjZGlyZWN0aXZlLkxvb2t1cERpcmVjdGl2ZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShsb29rdXAuZGVmaW5pdGlvbigpKTtcclxuICAgICAgICBsb29rdXAuc2NoZW1hKHRoaXMuc2NoZW1hVHlwZXMpO1xyXG5cclxuICAgICAgICAvLyBPcGVyYXRpb25zLlxyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBuZXcgY2RpcmVjdGl2ZS5PcGVyYXRpb25zRGlyZWN0aXZlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKG9wZXJhdGlvbnMuZGVmaW5pdGlvbigpKTtcclxuICAgICAgICBvcGVyYXRpb25zLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzKTtcclxuXHJcbiAgICAgICAgLy8gUGFnaW5hdGlvbi5cclxuICAgICAgICBjb25zdCBwYWdpbmF0aW9uID0gbmV3IGNkaXJlY3RpdmUuUGFnaW5hdGlvbkRpcmVjdGl2ZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShwYWdpbmF0aW9uLmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgcGFnaW5hdGlvbi5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIFJlYWRvbmx5LlxyXG4gICAgICAgIGNvbnN0IHJlYWRvbmx5ID0gbmV3IGNkaXJlY3RpdmUuUmVhZG9ubHlEaXJlY3RpdmUoKTtcclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEocmVhZG9ubHkuZGVmaW5pdGlvbigpKTtcclxuICAgICAgICByZWFkb25seS5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIFNvdXJjZS5cclxuICAgICAgICBjb25zdCBzb3VyY2UgPSBuZXcgY2RpcmVjdGl2ZS5Tb3VyY2VEaXJlY3RpdmUoKTtcclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEoc291cmNlLmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgc291cmNlLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZEN1c3RvbVNjaGVtYSgpIHtcclxuXHJcbiAgICAgICAgLy8gUGFnaW5hdGlvbiBjdXJzb3IuXHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvbkN1cnNvciA9IG5ldyBjc2NoZW1hLlBhZ2luYXRpb25DdXJzb3JTY2hlbWEoKTtcclxuICAgICAgICBwYWdpbmF0aW9uQ3Vyc29yLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzLCB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIFBhZ2luYXRpb24gb2Zmc2V0XHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvbk9mZnNldCA9IG5ldyBjc2NoZW1hLlBhZ2luYXRpb25PZmZzZXRTY2hlbWEoKTtcclxuICAgICAgICBwYWdpbmF0aW9uT2Zmc2V0LnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzLCB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIFNvcnQuXHJcbiAgICAgICAgLy8gVE9ETzogSlNPTiBzb3J0IHRvIG1hdGNoIE1vbmdvREIgc29ydD8gRmllbGQgbGlzdCBpbnB1dCB0eXBlIGlzIGJldHRlciBidXQgbm90IGEgZ29vZCBmaXQgZm9yIHVubGltaXRlZCBuZXN0ZWQgZmllbGRzLlxyXG4gICAgICAgIC8vIGNvbnN0IHNvcnQgPSBuZXcgY3NjaGVtYS5Tb3J0U2NoZW1hKCk7XHJcbiAgICAgICAgLy8gc29ydC5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQWRkIGF1dGggZGlyZWN0aXZlIGFuZCBzdXBwb3J0aW5nIHR5cGVzLlxyXG4gICAgLy8gQmFzZWQgb24gQW1wbGlmeSBkZWZpbml0aW9uLlxyXG4gICAgLy8gcHJpdmF0ZSBhZGRBdXRoU2NoZW1hKCkge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBhdXRoU3RyYXRlZ3kgPSBuZXcgYXBwc3luYy5FbnVtVHlwZSgnQXV0aFN0cmF0ZWd5Jywge1xyXG4gICAgLy8gICAgICAgICBkZWZpbml0aW9uOiBjZGlyZWN0aXZlLmF1dGhTdHJhdGVneVxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICAgIHRoaXMuc2NoZW1hVHlwZXMuZW51bVR5cGVzLkF1dGhTdHJhdGVneSA9IGF1dGhTdHJhdGVneTtcclxuXHJcbiAgICAvLyAgICAgY29uc3QgYXV0aFByb3ZpZGVyID0gbmV3IGFwcHN5bmMuRW51bVR5cGUoJ0F1dGhQcm92aWRlcicsIHtcclxuICAgIC8vICAgICAgICAgZGVmaW5pdGlvbjogY2RpcmVjdGl2ZS5hdXRoUHJvdmlkZXJcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICB0aGlzLnNjaGVtYVR5cGVzLmVudW1UeXBlcy5BdXRoUHJvdmlkZXIgPSBhdXRoUHJvdmlkZXI7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IGF1dGhPcGVyYXRpb24gPSBuZXcgYXBwc3luYy5FbnVtVHlwZSgnQXV0aE9wZXJhdGlvbicsIHtcclxuICAgIC8vICAgICAgICAgZGVmaW5pdGlvbjogY2RpcmVjdGl2ZS5vcGVyYXRpb25cclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICB0aGlzLnNjaGVtYVR5cGVzLmVudW1UeXBlcy5BdXRoT3BlcmF0aW9uID0gYXV0aE9wZXJhdGlvbjtcclxuXHJcbiAgICAvLyAgICAgY29uc3QgYXV0aFJ1bGUgPSBuZXcgYXBwc3luYy5JbnB1dFR5cGUoJ0F1dGhSdWxlJywge1xyXG4gICAgLy8gICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBhbGxvdzogYXV0aFN0cmF0ZWd5LmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSksIC8vIHB1YmxpYywgcHJpdmF0ZSwgb3duZXIsIGdyb3Vwcy5cclxuICAgIC8vICAgICAgICAgICAgIHByb3ZpZGVyOiBhdXRoUHJvdmlkZXIuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSwgLy8gTm90IHJlcXVpcmVkIGluIEFtcGxpZnkuIFNldCBhcyByZXF1aXJlZCBmb3Igc2NoZW1hIGNsYXJpdHkuXHJcbiAgICAvLyAgICAgICAgICAgICBvd25lckZpZWxkOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpLCAvLyBEZWZhdWx0cyB0byBvd25lci5cclxuICAgIC8vICAgICAgICAgICAgIGlkZW50aXR5Q2xhaW06IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCksIC8vIERlZmF1bHRzIHRvOiBzdWI6OnVzZXJuYW1lLlxyXG4gICAgLy8gICAgICAgICAgICAgZ3JvdXBzRmllbGQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCksIC8vIERlZmF1bHRzIHRvIGZpZWxkOiBncm91cHMuXHJcbiAgICAvLyAgICAgICAgICAgICBncm91cENsYWltOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpLCAvLyBEZWZhdWx0cyB0bzogY29nbml0bzpncm91cC5cclxuICAgIC8vICAgICAgICAgICAgIGdyb3VwczogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc0xpc3Q6IHRydWUgfSksIC8vIExpc3Qgb2YgQ29nbml0byBncm91cHMuXHJcbiAgICAvLyAgICAgICAgICAgICBvcGVyYXRpb25zOiBhdXRoT3BlcmF0aW9uLmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLkF1dGhSdWxlID0gYXV0aFJ1bGU7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgcGFnaW5hdGlvbiBwYWdlSW5mbyB0eXBlcyBmb3Igb2Zmc2V0IGFuZCBjdXJzb3IgYmFzZWQgcGFnaW5hdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBDdXJzb3IgcGFnaW5hdGlvbi4gUGFnZSBhbmQgc29ydCBieSB1bmlxdWUgZmllbGQuIENvbmNhdGVuYXRlZCBmaWVsZHMgY2FuIHJlc3VsdCBpbiBwb29yIHBlcmZvcm1hbmNlLlxyXG4gICAgICogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLUNvbm5lY3Rpb24tVHlwZXNcclxuICAgICAqIGh0dHBzOi8vc2hvcGlmeS5lbmdpbmVlcmluZy9wYWdpbmF0aW9uLXJlbGF0aXZlLWN1cnNvcnNcclxuICAgICAqIGh0dHBzOi8vbWVkaXVtLmNvbS9zd2xoL2hvdy10by1pbXBsZW1lbnQtY3Vyc29yLXBhZ2luYXRpb24tbGlrZS1hLXByby01MTMxNDBiNjVmMzJcclxuICAgICAqL1xyXG4gICAgLy8gcHJpdmF0ZSBhZGRQYWdpbmF0aW5vU2NoZW1hKCkge1xyXG5cclxuICAgIC8vICAgICAvLyBPZmZzZXQgcGFnaW5hdGlvbi5cclxuICAgIC8vICAgICBjb25zdCBwYWdlSW5mb09mZnNldCA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ1BhZ2VJbmZvT2Zmc2V0Jywge1xyXG4gICAgLy8gICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBza2lwOiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAvLyAgICAgICAgICAgICBsaW1pdDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAvLyAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgIC8vICAgICAgICAgICAgIC4uLiB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcy5pbmNsdWRlcyhhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLklBTSkgPyBbYXBwc3luYy5EaXJlY3RpdmUuaWFtKCldIDogW10sXHJcbiAgICAvLyAgICAgICAgICAgICAuLi4gdGhpcy5hY3RpdmVBdXRob3JpemF0aW9uVHlwZXMuaW5jbHVkZXMoYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wpID8gW0N1c3RvbURpcmVjdGl2ZS5jb2duaXRvQWxsR3JvdXBzKCldIDogW10gLy8gQWxsb3cgYWxsIENvZ25pdG8gYXV0aGVudGljYXRlZCB1c2Vycy5cclxuICAgIC8vICAgICAgICAgXVxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICAgIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXQgPSBwYWdlSW5mb09mZnNldDtcclxuXHJcbiAgICAvLyAgICAgLy8gQ3Vyc29yIHBhZ2luYXRpb24uXHJcbiAgICAvLyAgICAgY29uc3QgcGFnZUluZm9DdXJzb3IgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb0N1cnNvcicsIHtcclxuICAgIC8vICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgLy8gICAgICAgICAgICAgaGFzUHJldmlvdXNQYWdlOiBhcHBzeW5jLkdyYXBocWxUeXBlLmJvb2xlYW4oeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgLy8gICAgICAgICAgICAgaGFzTmV4dFBhZ2U6IGFwcHN5bmMuR3JhcGhxbFR5cGUuYm9vbGVhbih7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAvLyAgICAgICAgICAgICBzdGFydEN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgLy8gICAgICAgICAgICAgZW5kQ3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuICAgIC8vICAgICAgICAgfSxcclxuICAgIC8vICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgLy8gICAgICAgICAgICAgLi4uIHRoaXMuYWN0aXZlQXV0aG9yaXphdGlvblR5cGVzLmluY2x1ZGVzKGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNKSA/IFthcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKV0gOiBbXSxcclxuICAgIC8vICAgICAgICAgICAgIC4uLiB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcy5pbmNsdWRlcyhhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLlVTRVJfUE9PTCkgPyBbYXBwc3luYy5EaXJlY3RpdmUuY3VzdG9tKCdAYXdzX2NvZ25pdG9fdXNlcl9wb29scycpXSA6IFtdIC8vIEFsbG93IGFsbCBDb2duaXRvIGF1dGhlbnRpY2F0ZWQgdXNlcnMuXHJcbiAgICAvLyAgICAgICAgIF1cclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yID0gcGFnZUluZm9DdXJzb3I7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgc29ydCBpbnB1dCB0eXBlIGZvciBtdWx0aSBjb2x1bW4gc29ydGluZy5cclxuICAgICAqL1xyXG4gICAgLy8gcHJpdmF0ZSBhZGRTb3J0U2NoZW1hKCkge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBzb3J0SW5wdXQgPSBuZXcgYXBwc3luYy5JbnB1dFR5cGUoJ1NvcnRJbnB1dCcsIHtcclxuICAgIC8vICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgLy8gICAgICAgICAgICAgZmllbGROYW1lOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAvLyAgICAgICAgICAgICBkaXJlY3Rpb246IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dCA9IHNvcnRJbnB1dDtcclxuICAgIC8vIH1cclxufVxyXG4iXX0=