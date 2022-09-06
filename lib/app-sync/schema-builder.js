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
const definitions = require("./app-sync-definitions");
// import { AppSyncMySqlCustomDirective } from './datasources/mysql/mysql.directive';
const cdirective = require("./directives");
const graphql_type_1 = require("./graphql-type");
const coperation = require("./operations");
const cschema = require("./schemas");
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
     * Wrap input in input type and output in output type.
     * https://graphql-rules.com/rules/mutation-payload
     * @returns - The created AppSync mutation object type.
     */
    addMutation({ name, dataSourceName, input, output, auth, methodName }) {
        // Check datasource exists.
        const dataSource = this.dataSources[dataSourceName];
        if (!dataSource)
            throw Error(`Jompx addMutation: dataSource "${dataSourceName}" not found!`);
        // Add input type (to GraphQL schema). It's GraphQL best practice to wrap all input arguments in a single input type.
        let inputType;
        if (this.isInputType(input)) {
            inputType = input;
        }
        else {
            inputType = this.addOperationInputs(name, input);
        }
        // Add output type (to GraphQL). Output will contain the return value of the mutation (and will be wrapped in a Payload type).
        let outputType;
        if (this.isObjectType(output)) {
            outputType = output;
        }
        else {
            const outputDirectives = [auth];
            outputType = this.addOperationOutputs(name, output, outputDirectives);
        }
        // // Add payload type (to GraphQL schema). // TODO: Not sure! We need to be in sync with whatever GraphQL types are auto generated.
        // const payloadType = new appsync.ObjectType(`${changeCase.pascalCase(name)}Payload`, {
        //     definition: {
        //         output: outputType.attribute({ isRequired: true })
        //     },
        //     directives: [
        //         auth
        //     ]
        // });
        // this.graphqlApi.addType(payloadType);
        // Add mutation (to GraphQL).
        return this.graphqlApi.addMutation(name, new appsync.ResolvableField({
            returnType: outputType.attribute(),
            args: { input: inputType.attribute({ isRequired: true }) },
            dataSource,
            directives: [
                auth
            ],
            // pipelineConfig: [], // TODO: Add authorization Lambda function here?
            // TODO: Clean up params passing to Lambda.
            requestMappingTemplate: appsync.MappingTemplate.fromString(`
                $util.qr($ctx.stash.put("operation", "${methodName}"))
                ${definitions.DefaultRequestMappingTemplate}
            `)
        }));
    }
    /**
     * Iterate a list or nested list of AppSync fields and create input type(s).
     * GraphQL doesn't support nested types so create a type for each nested type recursively.
     * Types are added to the graphqlApi.
     * @param name - Create an input type with this name and an "Input" suffix.
     * @param operationFields - list of fields or nested list of AppSync fields e.g.
     * {
     *     number1: GraphqlType.int(),
     *     number2: GraphqlType.int(),
     *     test: {
     *         number1: GraphqlType.int(),
     *         number2: GraphqlType.int(),
     *     }
     * };
     * @returns - An AppSync input type (with references to nested types if any).
     */
    addOperationInputs(name, operationFields, suffix = 'Input') {
        const inputType = new appsync.InputType(`${changeCase.pascalCase(name)}${suffix}`, { definition: {} });
        for (const [key, field] of Object.entries(operationFields)) {
            if (Object.keys(field).includes('intermediateType')) {
                inputType.addField({
                    fieldName: key,
                    field: field
                });
            }
            else {
                const nestedInputType = this.addOperationInputs(`${changeCase.pascalCase(name)}${changeCase.pascalCase(key)}`, field);
                inputType.addField({
                    fieldName: key,
                    field: nestedInputType.attribute()
                });
            }
        }
        ;
        this.graphqlApi.addType(inputType);
        return inputType;
    }
    /**
     * Iterate a list or nested list of AppSync fields and create output type(s).
     * GraphQL doesn't support nested types so create a type for each nested type recursively.
     * Types are added to the graphqlApi.
     * @param name - Create an output type with this name and an "Output" suffix.
     * @param operationFields - list of fields or nested list of AppSync fields e.g.
     * {
     *     number1: GraphqlType.int(),
     *     number2: GraphqlType.int(),
     *     test: {
     *         number1: GraphqlType.int(),
     *         number2: GraphqlType.int(),
     *     }
     * };
     * @returns - An AppSync input type (with references to nested types if any).
     */
    addOperationOutputs(name, operationFields, directives, suffix = 'Output') {
        const outputType = new appsync.ObjectType(`${changeCase.pascalCase(name)}${suffix}`, {
            definition: {},
            directives: [
                ...directives
            ]
        });
        for (const [key, field] of Object.entries(operationFields)) {
            if (Object.keys(field).includes('intermediateType')) {
                outputType.addField({
                    fieldName: key,
                    field: field
                });
            }
            else {
                const nestedOutputType = this.addOperationOutputs(`${changeCase.pascalCase(name)}${changeCase.pascalCase(key)}`, field, directives);
                outputType.addField({
                    fieldName: key,
                    field: nestedOutputType.attribute()
                });
            }
        }
        ;
        this.graphqlApi.addType(outputType);
        return outputType;
    }
    // public addMutation({ name, dataSourceName, args, returnType, methodName }: IAddMutationArguments): appsync.ObjectType {
    //     // TODO: Add schema types.
    //     // Check datasource exists.
    //     const dataSource = this.dataSources[dataSourceName];
    //     if (!dataSource) throw Error(`Jompx: dataSource "${dataSourceName}" not found!`);
    //     // Add input type (to GraphQL).
    //     const inputType = new appsync.InputType(`${changeCase.pascalCase(returnType.name)}Input`, { definition: args });
    //     this.graphqlApi.addType(inputType);
    //     // Add output type (to GraphQL).
    //     const outputType = new ObjectType(`${changeCase.pascalCase(returnType.name)}Payload`, {
    //         definition: returnType.definition,
    //         directives: [
    //             appsync.Directive.iam()
    //             // appsync.Directive.cognito('admin')
    //         ]
    //     });
    //     this.graphqlApi.addType(outputType);
    //     // Add payload type (to GraphQL).
    //     const payloadType = new ObjectType(`${changeCase.pascalCase(returnType.name)}Output`, {
    //         definition: {
    //             output: outputType.attribute()
    //         },
    //         directives: [
    //             ...[
    //                 appsync.Directive.iam()
    //                 // appsync.Directive.cognito('admin')
    //             ],
    //             ...(returnType?.directives ?? [])
    //         ]
    //     });
    //     this.graphqlApi.addType(payloadType);
    //     // Add any child return types (to GraphQL).
    //     // TODO: Make recursive.
    //     Object.values(returnType.definition).forEach(graphqlType => {
    //         if (graphqlType.type === 'INTERMEDIATE') {
    //             if (graphqlType?.intermediateType) {
    //                 this.graphqlApi.addType(graphqlType.intermediateType);
    //             }
    //         }
    //     });
    //     // Add mutation (to GraphQL).
    //     return this.graphqlApi.addMutation(name, new appsync.ResolvableField({
    //         returnType: payloadType.attribute(),
    //         args: { input: inputType.attribute({ isRequired: true }) },
    //         dataSource,
    //         directives: [
    //             appsync.Directive.iam()
    //             // appsync.Directive.cognito('admin')
    //         ],
    //         // pipelineConfig: [], // TODO: Add authorization Lambda function here.
    //         requestMappingTemplate: appsync.MappingTemplate.fromString(`
    //             $util.qr($ctx.stash.put("operation", "${methodName}"))
    //             ${definitions.DefaultRequestMappingTemplate}
    //         `)
    //     }));
    // }
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
    /**
     * InputType type guard.
     * @param o - Object to test.
     * @returns - true if object is of type InputType (i.e. has definition property).
     */
    isInputType(o) {
        return o.definition !== undefined;
    }
    /**
     * ObjectType type guard.
     * @param o - Object to test.
     * @returns - true if object is of type ObjectType (i.e. has interfaceTypes property).
     */
    isObjectType(o) {
        return o.definition !== undefined;
    }
}
exports.AppSyncSchemaBuilder = AppSyncSchemaBuilder;
_a = JSII_RTTI_SYMBOL_1;
AppSyncSchemaBuilder[_a] = { fqn: "@jompx/constructs.AppSyncSchemaBuilder", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvc2NoZW1hLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBc0Q7QUFFdEQsNkRBQTZEO0FBQzdELDBDQUEwQztBQUMxQyxpRUFBaUU7QUFDakUsMkNBQTJDO0FBQzNDLGlFQUFpRTtBQUNqRSxpQ0FBa0M7QUFDbEMscUNBQXFDO0FBQ3JDLHNEQUFzRDtBQUV0RCxxRkFBcUY7QUFDckYsMkNBQTJDO0FBQzNDLGlEQUFrRDtBQUNsRCwyQ0FBMkM7QUFDM0MscUNBQXFDO0FBdURyQyxNQUFhLG9CQUFvQjtJQUs3QixZQUNXLFVBQThCLEVBQzlCLHdCQUFxRDtRQURyRCxlQUFVLEdBQVYsVUFBVSxDQUFvQjtRQUM5Qiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTZCO1FBTHpELGdCQUFXLEdBQWdCLEVBQUUsQ0FBQztRQUM5QixnQkFBVyxHQUFpQixFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBS3RILENBQUM7SUFFTCxtSEFBbUg7SUFDNUcsYUFBYSxDQUFDLEVBQVUsRUFBRSxjQUF3QyxFQUFFLE9BQW1DO1FBQzFHLE1BQU0sVUFBVSxHQUFHLG9CQUFvQixVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDbkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEVB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QWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFFekUsUUFBUTtRQUNSLHlIQUF5SDtRQUN6SCx5Q0FBeUM7UUFDekMsaUNBQWlDO0lBQ3JDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssV0FBVyxDQUFDLENBQU07UUFDdEIsT0FBUSxDQUF1QixDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxZQUFZLENBQUMsQ0FBTTtRQUN2QixPQUFRLENBQXdCLENBQUMsVUFBVSxLQUFLLFNBQVMsQ0FBQztJQUM5RCxDQUFDOztBQS9kTCxvREF1akJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbi8vIGltcG9ydCBwbHVyYWxpemUgPSByZXF1aXJlKCdwbHVyYWxpemUnKTtcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuaW1wb3J0IHNldCA9IHJlcXVpcmUoJ3NldC12YWx1ZScpO1xyXG4vLyBpbXBvcnQgZ2V0ID0gcmVxdWlyZSgnZ2V0LXZhbHVlJyk7XHJcbmltcG9ydCAqIGFzIGRlZmluaXRpb25zIGZyb20gJy4vYXBwLXN5bmMtZGVmaW5pdGlvbnMnO1xyXG5pbXBvcnQgeyBJRGF0YVNvdXJjZSwgSVNjaGVtYVR5cGVzLCBJQXBwU3luY09wZXJhdGlvbkZpZWxkcyB9IGZyb20gJy4vYXBwLXN5bmMudHlwZXMnO1xyXG4vLyBpbXBvcnQgeyBBcHBTeW5jTXlTcWxDdXN0b21EaXJlY3RpdmUgfSBmcm9tICcuL2RhdGFzb3VyY2VzL215c3FsL215c3FsLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCAqIGFzIGNkaXJlY3RpdmUgZnJvbSAnLi9kaXJlY3RpdmVzJztcclxuaW1wb3J0IHsgSm9tcHhHcmFwaHFsVHlwZSB9IGZyb20gJy4vZ3JhcGhxbC10eXBlJztcclxuaW1wb3J0ICogYXMgY29wZXJhdGlvbiBmcm9tICcuL29wZXJhdGlvbnMnO1xyXG5pbXBvcnQgKiBhcyBjc2NoZW1hIGZyb20gJy4vc2NoZW1hcyc7XHJcblxyXG4vKipcclxuICogR3JhcGhRTCBTcGVjOiBodHRwczovL3NwZWMuZ3JhcGhxbC5vcmcvLiBNb3N0bHkgZm9yIHRoZSBiYWNrZW5kIGJ1dCBnb29kIHRvIGtub3cgYWJvdXQuXHJcbiAqIEN1cnNvciBFZGdlIE5vZGU6IGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAqIFN1cHBvcnQgcmVsYXkgb3Igbm90P1xyXG4gKiBodHRwczovL21lZGl1bS5jb20vb3Blbi1ncmFwaHFsL3VzaW5nLXJlbGF5LXdpdGgtYXdzLWFwcHN5bmMtNTVjODljYTAyMDY2XHJcbiAqIEpvaW5zIHNob3VsZCBiZSBjb25uZWN0aW9ucyBhbmQgbmFtZWQgYXMgc3VjaC4gZS5nLiBpbiBwb3N0IFRhZ3NDb25uZWN0aW9uXHJcbiAqIGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy11bmRlZmluZWQuUGFnZUluZm9cclxuICogaHR0cHM6Ly9ncmFwaHFsLXJ1bGVzLmNvbS9ydWxlcy9saXN0LXBhZ2luYXRpb25cclxuICogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2Jhc2ljcy9kZXNpZ25pbmctZ3JhcGhxbC1tdXRhdGlvbnMvXHJcbiAqIC0gTXV0YXRpb246IFVzZSB0b3AgbGV2ZWwgaW5wdXQgdHlwZSBmb3IgYWdzLiBVc2UgdG9wIGxldmVsIHByb3BlcnR5IGZvciBvdXRwdXQgdHlwZS5cclxuICovXHJcblxyXG4vLyBUT0RPIE1ha2Ugc3VyZSB3ZSBjYW4gY2FsbCBhIG11dGF0aW9uIGFuZCBjYWxsIGEgcXVlcnk/IGh0dHBzOi8vZ3JhcGhxbC1ydWxlcy5jb20vcnVsZXMvbXV0YXRpb24tcGF5bG9hZC1xdWVyeVxyXG4vLyBUT0RPIEFkZCBzY2hlbWEgZG9jdW1lbnRpb24gbWFya3VwOiBodHRwOi8vc3BlYy5ncmFwaHFsLm9yZy9kcmFmdC8jc2VjLURlc2NyaXB0aW9uc1xyXG4vLyBJbnRlcmVzdGluZyB0eXBlZCBlcnJvcnM6IGh0dHBzOi8vZ3JhcGhxbC1ydWxlcy5jb20vcnVsZXMvbXV0YXRpb24tcGF5bG9hZC1lcnJvcnNcclxuXHJcbi8qXHJcbnR5cGUgVXNlckZyaWVuZHNDb25uZWN0aW9uIHtcclxuICBwYWdlSW5mbzogUGFnZUluZm8hXHJcbiAgZWRnZXM6IFtVc2VyRnJpZW5kc0VkZ2VdXHJcbn10eXBlIFVzZXJGcmllbmRzRWRnZSB7XHJcbiAgY3Vyc29yOiBTdHJpbmchXHJcbiAgbm9kZTogVXNlclxyXG59XHJcbiovXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBZGRNdXRhdGlvbkFyZ3Mge1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbXV0YXRpb24gYXMgaXQgd2lsbCBhcHBlYXIgaW4gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICovXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBtdXRhdGlvbiBkYXRhc291cmNlLlxyXG4gICAgICovXHJcbiAgICBkYXRhU291cmNlTmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBNdXRhdGlvbiBpbnB1dCAoYXJndW1lbnRzIHdyYXBwZWQgaW4gYW4gaW5wdXQgcHJvcGVydHkpLlxyXG4gICAgICovXHJcbiAgICBpbnB1dDogYXBwc3luYy5JbnB1dFR5cGUgfCBJQXBwU3luY09wZXJhdGlvbkZpZWxkcztcclxuICAgIC8qKlxyXG4gICAgICogTXV0YXRpb24gb3V0cHV0IChyZXR1cm4gdmFsdWUpLlxyXG4gICAgICovXHJcbiAgICBvdXRwdXQ6IGFwcHN5bmMuT2JqZWN0VHlwZSB8IElBcHBTeW5jT3BlcmF0aW9uRmllbGRzO1xyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0IG9mIGF1dGggcnVsZXMgdG8gYXBwbHkgdG8gdGhlIG11dGF0aW9uIGFuZCBvdXRwdXQgdHlwZS5cclxuICAgICAqL1xyXG4gICAgYXV0aDogYXBwc3luYy5EaXJlY3RpdmU7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBjbGFzcyBtZXRob2QgdG8gY2FsbCBvbiByZXF1ZXN0IG11dGF0aW9uLlxyXG4gICAgICovXHJcbiAgICBtZXRob2ROYW1lPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwU3luY1NjaGVtYUJ1aWxkZXIge1xyXG5cclxuICAgIHB1YmxpYyBkYXRhU291cmNlczogSURhdGFTb3VyY2UgPSB7fTtcclxuICAgIHB1YmxpYyBzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzID0geyBlbnVtVHlwZXM6IHt9LCBpbnB1dFR5cGVzOiB7fSwgaW50ZXJmYWNlVHlwZXM6IHt9LCBvYmplY3RUeXBlczoge30sIHVuaW9uVHlwZXM6IHt9IH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIGdyYXBocWxBcGk6IGFwcHN5bmMuR3JhcGhxbEFwaSxcclxuICAgICAgICBwdWJsaWMgYWN0aXZlQXV0aG9yaXphdGlvblR5cGVzOiBhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlW11cclxuICAgICkgeyB9XHJcblxyXG4gICAgLy8gQWRkIGRhdGFzb3VyY2UgdG8gQXBwU3luYyBpbiBhbiBpbnRlcm5hbCBhcnJheS4gUmVtb3ZlIHRoaXMgd2hlbiBBcHBTeW5jIHByb3ZpZGVzIGEgd2F5IHRvIGl0ZXJhdGUgZGF0YXNvdXJjZXMpLlxyXG4gICAgcHVibGljIGFkZERhdGFTb3VyY2UoaWQ6IHN0cmluZywgbGFtYmRhRnVuY3Rpb246IGNkay5hd3NfbGFtYmRhLklGdW5jdGlvbiwgb3B0aW9ucz86IGFwcHN5bmMuRGF0YVNvdXJjZU9wdGlvbnMpOiBhcHBzeW5jLkxhbWJkYURhdGFTb3VyY2Uge1xyXG4gICAgICAgIGNvbnN0IGlkZW50aWZpZXIgPSBgQXBwU3luY0RhdGFTb3VyY2Uke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShpZCl9YDtcclxuICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5ncmFwaHFsQXBpLmFkZExhbWJkYURhdGFTb3VyY2UoaWRlbnRpZmllciwgbGFtYmRhRnVuY3Rpb24sIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSB7IC4uLnRoaXMuZGF0YVNvdXJjZXMsIC4uLnsgW2lkXTogZGF0YVNvdXJjZSB9IH07XHJcbiAgICAgICAgcmV0dXJuIGRhdGFTb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFNjaGVtYVR5cGVzKHNjaGVtYVR5cGVzOiBJU2NoZW1hVHlwZXMpIHtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzID0geyAuLi50aGlzLnNjaGVtYVR5cGVzLCAuLi5zY2hlbWFUeXBlcyB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgbXV0YXRpb24gdG8gdGhlIEdyYXBoUUwgc2NoZW1hLlxyXG4gICAgICogV3JhcCBpbnB1dCBpbiBpbnB1dCB0eXBlIGFuZCBvdXRwdXQgaW4gb3V0cHV0IHR5cGUuXHJcbiAgICAgKiBodHRwczovL2dyYXBocWwtcnVsZXMuY29tL3J1bGVzL211dGF0aW9uLXBheWxvYWRcclxuICAgICAqIEByZXR1cm5zIC0gVGhlIGNyZWF0ZWQgQXBwU3luYyBtdXRhdGlvbiBvYmplY3QgdHlwZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZE11dGF0aW9uKHsgbmFtZSwgZGF0YVNvdXJjZU5hbWUsIGlucHV0LCBvdXRwdXQsIGF1dGgsIG1ldGhvZE5hbWUgfTogSUFkZE11dGF0aW9uQXJncyk6IGFwcHN5bmMuT2JqZWN0VHlwZSB7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGRhdGFzb3VyY2UgZXhpc3RzLlxyXG4gICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmRhdGFTb3VyY2VzW2RhdGFTb3VyY2VOYW1lXTtcclxuICAgICAgICBpZiAoIWRhdGFTb3VyY2UpIHRocm93IEVycm9yKGBKb21weCBhZGRNdXRhdGlvbjogZGF0YVNvdXJjZSBcIiR7ZGF0YVNvdXJjZU5hbWV9XCIgbm90IGZvdW5kIWApO1xyXG5cclxuICAgICAgICAvLyBBZGQgaW5wdXQgdHlwZSAodG8gR3JhcGhRTCBzY2hlbWEpLiBJdCdzIEdyYXBoUUwgYmVzdCBwcmFjdGljZSB0byB3cmFwIGFsbCBpbnB1dCBhcmd1bWVudHMgaW4gYSBzaW5nbGUgaW5wdXQgdHlwZS5cclxuICAgICAgICBsZXQgaW5wdXRUeXBlOiBhcHBzeW5jLklucHV0VHlwZTtcclxuICAgICAgICBpZiAodGhpcy5pc0lucHV0VHlwZShpbnB1dCkpIHtcclxuICAgICAgICAgICAgaW5wdXRUeXBlID0gaW5wdXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW5wdXRUeXBlID0gdGhpcy5hZGRPcGVyYXRpb25JbnB1dHMobmFtZSwgaW5wdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQWRkIG91dHB1dCB0eXBlICh0byBHcmFwaFFMKS4gT3V0cHV0IHdpbGwgY29udGFpbiB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBtdXRhdGlvbiAoYW5kIHdpbGwgYmUgd3JhcHBlZCBpbiBhIFBheWxvYWQgdHlwZSkuXHJcbiAgICAgICAgbGV0IG91dHB1dFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZTtcclxuICAgICAgICBpZiAodGhpcy5pc09iamVjdFR5cGUob3V0cHV0KSkge1xyXG4gICAgICAgICAgICBvdXRwdXRUeXBlID0gb3V0cHV0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG91dHB1dERpcmVjdGl2ZXMgPSBbYXV0aF07XHJcbiAgICAgICAgICAgIG91dHB1dFR5cGUgPSB0aGlzLmFkZE9wZXJhdGlvbk91dHB1dHMobmFtZSwgb3V0cHV0LCBvdXRwdXREaXJlY3RpdmVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIC8vIEFkZCBwYXlsb2FkIHR5cGUgKHRvIEdyYXBoUUwgc2NoZW1hKS4gLy8gVE9ETzogTm90IHN1cmUhIFdlIG5lZWQgdG8gYmUgaW4gc3luYyB3aXRoIHdoYXRldmVyIEdyYXBoUUwgdHlwZXMgYXJlIGF1dG8gZ2VuZXJhdGVkLlxyXG4gICAgICAgIC8vIGNvbnN0IHBheWxvYWRUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UobmFtZSl9UGF5bG9hZGAsIHtcclxuICAgICAgICAvLyAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgIC8vICAgICAgICAgb3V0cHV0OiBvdXRwdXRUeXBlLmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgIC8vICAgICAgICAgYXV0aFxyXG4gICAgICAgIC8vICAgICBdXHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUocGF5bG9hZFR5cGUpO1xyXG5cclxuICAgICAgICAvLyBBZGQgbXV0YXRpb24gKHRvIEdyYXBoUUwpLlxyXG4gICAgICAgIHJldHVybiB0aGlzLmdyYXBocWxBcGkuYWRkTXV0YXRpb24obmFtZSwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgcmV0dXJuVHlwZTogb3V0cHV0VHlwZS5hdHRyaWJ1dGUoKSxcclxuICAgICAgICAgICAgYXJnczogeyBpbnB1dDogaW5wdXRUeXBlLmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgfSxcclxuICAgICAgICAgICAgZGF0YVNvdXJjZSxcclxuICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgYXV0aFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlP1xyXG4gICAgICAgICAgICAvLyBUT0RPOiBDbGVhbiB1cCBwYXJhbXMgcGFzc2luZyB0byBMYW1iZGEuXHJcbiAgICAgICAgICAgIHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IGFwcHN5bmMuTWFwcGluZ1RlbXBsYXRlLmZyb21TdHJpbmcoYFxyXG4gICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvcGVyYXRpb25cIiwgXCIke21ldGhvZE5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgJHtkZWZpbml0aW9ucy5EZWZhdWx0UmVxdWVzdE1hcHBpbmdUZW1wbGF0ZX1cclxuICAgICAgICAgICAgYClcclxuICAgICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlIGEgbGlzdCBvciBuZXN0ZWQgbGlzdCBvZiBBcHBTeW5jIGZpZWxkcyBhbmQgY3JlYXRlIGlucHV0IHR5cGUocykuXHJcbiAgICAgKiBHcmFwaFFMIGRvZXNuJ3Qgc3VwcG9ydCBuZXN0ZWQgdHlwZXMgc28gY3JlYXRlIGEgdHlwZSBmb3IgZWFjaCBuZXN0ZWQgdHlwZSByZWN1cnNpdmVseS5cclxuICAgICAqIFR5cGVzIGFyZSBhZGRlZCB0byB0aGUgZ3JhcGhxbEFwaS5cclxuICAgICAqIEBwYXJhbSBuYW1lIC0gQ3JlYXRlIGFuIGlucHV0IHR5cGUgd2l0aCB0aGlzIG5hbWUgYW5kIGFuIFwiSW5wdXRcIiBzdWZmaXguXHJcbiAgICAgKiBAcGFyYW0gb3BlcmF0aW9uRmllbGRzIC0gbGlzdCBvZiBmaWVsZHMgb3IgbmVzdGVkIGxpc3Qgb2YgQXBwU3luYyBmaWVsZHMgZS5nLlxyXG4gICAgICoge1xyXG4gICAgICogICAgIG51bWJlcjE6IEdyYXBocWxUeXBlLmludCgpLFxyXG4gICAgICogICAgIG51bWJlcjI6IEdyYXBocWxUeXBlLmludCgpLFxyXG4gICAgICogICAgIHRlc3Q6IHtcclxuICAgICAqICAgICAgICAgbnVtYmVyMTogR3JhcGhxbFR5cGUuaW50KCksXHJcbiAgICAgKiAgICAgICAgIG51bWJlcjI6IEdyYXBocWxUeXBlLmludCgpLFxyXG4gICAgICogICAgIH1cclxuICAgICAqIH07XHJcbiAgICAgKiBAcmV0dXJucyAtIEFuIEFwcFN5bmMgaW5wdXQgdHlwZSAod2l0aCByZWZlcmVuY2VzIHRvIG5lc3RlZCB0eXBlcyBpZiBhbnkpLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkT3BlcmF0aW9uSW5wdXRzKG5hbWU6IHN0cmluZywgb3BlcmF0aW9uRmllbGRzOiBJQXBwU3luY09wZXJhdGlvbkZpZWxkcywgc3VmZml4ID0gJ0lucHV0Jyk6IGFwcHN5bmMuSW5wdXRUeXBlIHtcclxuXHJcbiAgICAgICAgY29uc3QgaW5wdXRUeXBlID0gbmV3IGFwcHN5bmMuSW5wdXRUeXBlKGAke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShuYW1lKX0ke3N1ZmZpeH1gLCB7IGRlZmluaXRpb246IHt9IH0pO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGZpZWxkXSBvZiBPYmplY3QuZW50cmllcyhvcGVyYXRpb25GaWVsZHMpKSB7XHJcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhmaWVsZCkuaW5jbHVkZXMoJ2ludGVybWVkaWF0ZVR5cGUnKSkge1xyXG4gICAgICAgICAgICAgICAgaW5wdXRUeXBlLmFkZEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGtleSxcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZDogZmllbGQgYXMgYXBwc3luYy5JRmllbGRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmVzdGVkSW5wdXRUeXBlID0gdGhpcy5hZGRPcGVyYXRpb25JbnB1dHMoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKG5hbWUpfSR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKGtleSl9YCwgZmllbGQgYXMgSUFwcFN5bmNPcGVyYXRpb25GaWVsZHMpO1xyXG4gICAgICAgICAgICAgICAgaW5wdXRUeXBlLmFkZEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGtleSxcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZDogbmVzdGVkSW5wdXRUeXBlLmF0dHJpYnV0ZSgpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGlucHV0VHlwZSk7XHJcbiAgICAgICAgcmV0dXJuIGlucHV0VHlwZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEl0ZXJhdGUgYSBsaXN0IG9yIG5lc3RlZCBsaXN0IG9mIEFwcFN5bmMgZmllbGRzIGFuZCBjcmVhdGUgb3V0cHV0IHR5cGUocykuXHJcbiAgICAgKiBHcmFwaFFMIGRvZXNuJ3Qgc3VwcG9ydCBuZXN0ZWQgdHlwZXMgc28gY3JlYXRlIGEgdHlwZSBmb3IgZWFjaCBuZXN0ZWQgdHlwZSByZWN1cnNpdmVseS5cclxuICAgICAqIFR5cGVzIGFyZSBhZGRlZCB0byB0aGUgZ3JhcGhxbEFwaS5cclxuICAgICAqIEBwYXJhbSBuYW1lIC0gQ3JlYXRlIGFuIG91dHB1dCB0eXBlIHdpdGggdGhpcyBuYW1lIGFuZCBhbiBcIk91dHB1dFwiIHN1ZmZpeC5cclxuICAgICAqIEBwYXJhbSBvcGVyYXRpb25GaWVsZHMgLSBsaXN0IG9mIGZpZWxkcyBvciBuZXN0ZWQgbGlzdCBvZiBBcHBTeW5jIGZpZWxkcyBlLmcuXHJcbiAgICAgKiB7XHJcbiAgICAgKiAgICAgbnVtYmVyMTogR3JhcGhxbFR5cGUuaW50KCksXHJcbiAgICAgKiAgICAgbnVtYmVyMjogR3JhcGhxbFR5cGUuaW50KCksXHJcbiAgICAgKiAgICAgdGVzdDoge1xyXG4gICAgICogICAgICAgICBudW1iZXIxOiBHcmFwaHFsVHlwZS5pbnQoKSxcclxuICAgICAqICAgICAgICAgbnVtYmVyMjogR3JhcGhxbFR5cGUuaW50KCksXHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogfTtcclxuICAgICAqIEByZXR1cm5zIC0gQW4gQXBwU3luYyBpbnB1dCB0eXBlICh3aXRoIHJlZmVyZW5jZXMgdG8gbmVzdGVkIHR5cGVzIGlmIGFueSkuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRPcGVyYXRpb25PdXRwdXRzKG5hbWU6IHN0cmluZywgb3BlcmF0aW9uRmllbGRzOiBJQXBwU3luY09wZXJhdGlvbkZpZWxkcywgZGlyZWN0aXZlczogYXBwc3luYy5EaXJlY3RpdmVbXSwgc3VmZml4ID0gJ091dHB1dCcpOiBhcHBzeW5jLk9iamVjdFR5cGUge1xyXG5cclxuICAgICAgICBjb25zdCBvdXRwdXRUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UobmFtZSl9JHtzdWZmaXh9YCwge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7fSxcclxuICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgLi4uZGlyZWN0aXZlc1xyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgZmllbGRdIG9mIE9iamVjdC5lbnRyaWVzKG9wZXJhdGlvbkZpZWxkcykpIHtcclxuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGZpZWxkKS5pbmNsdWRlcygnaW50ZXJtZWRpYXRlVHlwZScpKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRUeXBlLmFkZEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGtleSxcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZDogZmllbGQgYXMgYXBwc3luYy5JRmllbGRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmVzdGVkT3V0cHV0VHlwZSA9IHRoaXMuYWRkT3BlcmF0aW9uT3V0cHV0cyhgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UobmFtZSl9JHtjaGFuZ2VDYXNlLnBhc2NhbENhc2Uoa2V5KX1gLCBmaWVsZCBhcyBJQXBwU3luY09wZXJhdGlvbkZpZWxkcywgZGlyZWN0aXZlcyk7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXRUeXBlLmFkZEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGtleSxcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZDogbmVzdGVkT3V0cHV0VHlwZS5hdHRyaWJ1dGUoKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShvdXRwdXRUeXBlKTtcclxuICAgICAgICByZXR1cm4gb3V0cHV0VHlwZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwdWJsaWMgYWRkTXV0YXRpb24oeyBuYW1lLCBkYXRhU291cmNlTmFtZSwgYXJncywgcmV0dXJuVHlwZSwgbWV0aG9kTmFtZSB9OiBJQWRkTXV0YXRpb25Bcmd1bWVudHMpOiBhcHBzeW5jLk9iamVjdFR5cGUge1xyXG5cclxuICAgIC8vICAgICAvLyBUT0RPOiBBZGQgc2NoZW1hIHR5cGVzLlxyXG5cclxuICAgIC8vICAgICAvLyBDaGVjayBkYXRhc291cmNlIGV4aXN0cy5cclxuICAgIC8vICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcbiAgICAvLyAgICAgaWYgKCFkYXRhU291cmNlKSB0aHJvdyBFcnJvcihgSm9tcHg6IGRhdGFTb3VyY2UgXCIke2RhdGFTb3VyY2VOYW1lfVwiIG5vdCBmb3VuZCFgKTtcclxuXHJcbiAgICAvLyAgICAgLy8gQWRkIGlucHV0IHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgLy8gICAgIGNvbnN0IGlucHV0VHlwZSA9IG5ldyBhcHBzeW5jLklucHV0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocmV0dXJuVHlwZS5uYW1lKX1JbnB1dGAsIHsgZGVmaW5pdGlvbjogYXJncyB9KTtcclxuICAgIC8vICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnB1dFR5cGUpO1xyXG5cclxuICAgIC8vICAgICAvLyBBZGQgb3V0cHV0IHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgLy8gICAgIGNvbnN0IG91dHB1dFR5cGUgPSBuZXcgT2JqZWN0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocmV0dXJuVHlwZS5uYW1lKX1QYXlsb2FkYCwge1xyXG4gICAgLy8gICAgICAgICBkZWZpbml0aW9uOiByZXR1cm5UeXBlLmRlZmluaXRpb24sXHJcbiAgICAvLyAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgIC8vICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXHJcbiAgICAvLyAgICAgICAgICAgICAvLyBhcHBzeW5jLkRpcmVjdGl2ZS5jb2duaXRvKCdhZG1pbicpXHJcbiAgICAvLyAgICAgICAgIF1cclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShvdXRwdXRUeXBlKTtcclxuXHJcbiAgICAvLyAgICAgLy8gQWRkIHBheWxvYWQgdHlwZSAodG8gR3JhcGhRTCkuXHJcbiAgICAvLyAgICAgY29uc3QgcGF5bG9hZFR5cGUgPSBuZXcgT2JqZWN0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UocmV0dXJuVHlwZS5uYW1lKX1PdXRwdXRgLCB7XHJcbiAgICAvLyAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgIC8vICAgICAgICAgICAgIG91dHB1dDogb3V0cHV0VHlwZS5hdHRyaWJ1dGUoKVxyXG4gICAgLy8gICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICAuLi5bXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuaWFtKClcclxuICAgIC8vICAgICAgICAgICAgICAgICAvLyBhcHBzeW5jLkRpcmVjdGl2ZS5jb2duaXRvKCdhZG1pbicpXHJcbiAgICAvLyAgICAgICAgICAgICBdLFxyXG4gICAgLy8gICAgICAgICAgICAgLi4uKHJldHVyblR5cGU/LmRpcmVjdGl2ZXMgPz8gW10pXHJcbiAgICAvLyAgICAgICAgIF1cclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShwYXlsb2FkVHlwZSk7XHJcblxyXG4gICAgLy8gICAgIC8vIEFkZCBhbnkgY2hpbGQgcmV0dXJuIHR5cGVzICh0byBHcmFwaFFMKS5cclxuICAgIC8vICAgICAvLyBUT0RPOiBNYWtlIHJlY3Vyc2l2ZS5cclxuICAgIC8vICAgICBPYmplY3QudmFsdWVzKHJldHVyblR5cGUuZGVmaW5pdGlvbikuZm9yRWFjaChncmFwaHFsVHlwZSA9PiB7XHJcbiAgICAvLyAgICAgICAgIGlmIChncmFwaHFsVHlwZS50eXBlID09PSAnSU5URVJNRURJQVRFJykge1xyXG4gICAgLy8gICAgICAgICAgICAgaWYgKGdyYXBocWxUeXBlPy5pbnRlcm1lZGlhdGVUeXBlKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZ3JhcGhxbFR5cGUuaW50ZXJtZWRpYXRlVHlwZSk7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KTtcclxuXHJcbiAgICAvLyAgICAgLy8gQWRkIG11dGF0aW9uICh0byBHcmFwaFFMKS5cclxuICAgIC8vICAgICByZXR1cm4gdGhpcy5ncmFwaHFsQXBpLmFkZE11dGF0aW9uKG5hbWUsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAvLyAgICAgICAgIHJldHVyblR5cGU6IHBheWxvYWRUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgLy8gICAgICAgICBhcmdzOiB7IGlucHV0OiBpbnB1dFR5cGUuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSB9LFxyXG4gICAgLy8gICAgICAgICBkYXRhU291cmNlLFxyXG4gICAgLy8gICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKVxyXG4gICAgLy8gICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgLy8gICAgICAgICBdLFxyXG4gICAgLy8gICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgLy8gICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgIC8vICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib3BlcmF0aW9uXCIsIFwiJHttZXRob2ROYW1lfVwiKSlcclxuICAgIC8vICAgICAgICAgICAgICR7ZGVmaW5pdGlvbnMuRGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAvLyAgICAgICAgIGApXHJcbiAgICAvLyAgICAgfSkpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKSB7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYSgnZGlyZWN0aXZlIEByZWFkb25seSh2YWx1ZTogU3RyaW5nKSBvbiBGSUVMRF9ERUZJTklUSU9OJyk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKEN1c3RvbURpcmVjdGl2ZS5kZWZpbml0aW9ucygpKTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogSG93IGFyZSB3ZSBnb2luZyB0byBhZGQgTXlTcWwgY3VzdG9tIGRpcmVjdGl2ZXM/IGFuZCBzY2hlbWE/XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKEFwcFN5bmNNeVNxbEN1c3RvbURpcmVjdGl2ZS5zY2hlbWEoKSk7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQ3VzdG9tRGlyZWN0aXZlcygpO1xyXG4gICAgICAgIHRoaXMuYWRkQ3VzdG9tU2NoZW1hKCk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5lbnVtVHlwZXMpLmZvckVhY2goZW51bVR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShlbnVtVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzKS5mb3JFYWNoKGlucHV0VHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGlucHV0VHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5pbnRlcmZhY2VUeXBlcykuZm9yRWFjaChpbnRlcmZhY2VUeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW50ZXJmYWNlVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcykuZm9yRWFjaChvYmplY3RUeXBlID0+IHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZU9iamVjdChvYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCB0eXBlIHRvIEdyYXBoUUwuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKG9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uc0RpcmVjdGl2ZSA9IG5ldyBjZGlyZWN0aXZlLk9wZXJhdGlvbnNEaXJlY3RpdmUoKTtcclxuICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IG9wZXJhdGlvbnNEaXJlY3RpdmUudmFsdWUob2JqZWN0VHlwZS5kaXJlY3RpdmVzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvcGVyYXRpb25zPy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25zLmluY2x1ZGVzKCdmaW5kJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaW5kT3BlcmF0aW9uID0gbmV3IGNvcGVyYXRpb24uRmluZE9wZXJhdGlvbih0aGlzLmdyYXBocWxBcGksIHRoaXMuZGF0YVNvdXJjZXMsIHRoaXMuc2NoZW1hVHlwZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbmRPcGVyYXRpb24uc2NoZW1hKG9iamVjdFR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zY2hlbWFUeXBlcy51bmlvblR5cGVzKS5mb3JFYWNoKHVuaW9uVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHVuaW9uVHlwZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcyBhbmQgdXBkYXRlIHJldHVyblR5cGUgb2YgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIGZyb20gc3RyaW5nIHR5cGUgdG8gYWN0dWFsIHR5cGUuXHJcbiAgICAgKiBXaHk/IEFwcFN5bmMgcmVzb2x2YWJsZSBmaWVsZHMgcmVxdWlyZSBhIGRhdGEgdHlwZS4gQnV0IHRoYXQgZGF0YSB0eXBlIG1heSBub3QgYWxyZWFkeSBleGlzdCB5ZXQuIEZvciBleGFtcGxlOlxyXG4gICAgICogICBQb3N0IG9iamVjdCB0eXBlIGhhcyBmaWVsZCBjb21tZW50cyBhbmQgQ29tbWVudCBvYmplY3QgdHlwZSBoYXMgZmllbGQgcG9zdC4gTm8gbWF0dGVyIHdoYXQgb3JkZXIgdGhlc2Ugb2JqZWN0IHR5cGVzIGFyZSBjcmVhdGVkIGluLCBhbiBvYmplY3QgdHlwZSB3b24ndCBleGlzdCB5ZXQuXHJcbiAgICAgKiAgIElmIGNvbW1lbnQgaXMgY3JlYXRlZCBmaXJzdCwgdGhlcmUgaXMgbm8gY29tbWVudCBvYmplY3QgdHlwZS4gSWYgY29tbWVudCBpcyBjcmVhdGVkIGZpcnN0LCB0aGVyZSBpcyBubyBwb3N0IG9iamVjdCB0eXBlLlxyXG4gICAgICogVG8gd29yayBhcm91bmQgdGhpcyBjaGlja2VuIG9yIGVnZyBsaW1pdGF0aW9uLCBKb21weCBkZWZpbmVzIGEgY3VzdG9tIHR5cGUgdGhhdCBhbGxvd3MgYSBzdHJpbmcgdHlwZSB0byBiZSBzcGVjaWZpZWQuIGUuZy5cclxuICAgICAqICAgSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlIEpvbXB4R3JhcGhxbFR5cGUub2JqZWN0VHlwZSh7IG9iamVjdFR5cGVOYW1lOiAnTVBvc3QnLCBpc0xpc3Q6IGZhbHNlIH0pLFxyXG4gICAgICogVGhpcyBtZXRob2QgdXNlcyB0aGUgc3RyaW5nIHR5cGUgdG8gYWRkIGFuIGFjdHVhbCB0eXBlLlxyXG4gICAgICpcclxuICAgICAqIENhdXRpb246IENoYW5nZXMgdG8gQXBwU3luYyBpbXBsZW1lbnRhdGlvbiBkZXRhaWxzIG1heSBicmVhayB0aGlzIG1ldGhvZC5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSByZXNvbHZlT2JqZWN0KG9iamVjdFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgICAgICAvLyBJdGVyYXRlIG9iamVjdCB0eXBlIGZpZWxkcy5cclxuICAgICAgICBPYmplY3QuZW50cmllcyhvYmplY3RUeXBlLmRlZmluaXRpb24pLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBJZiBmaWVsZCBvZiBKb21weEdyYXBocWxUeXBlIHR5cGUgKHRoZW4gdXNlIHN0cmluZyB0eXBlIHRvIGFkZCBhY3R1YWwgdHlwZSkuXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5maWVsZE9wdGlvbnM/LnJldHVyblR5cGUgaW5zdGFuY2VvZiBKb21weEdyYXBocWxUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBcIm9sZFwiIGZpZWxkIHdpdGggdGhlIG5ldyBcImZpZWxkXCIuXHJcbiAgICAgICAgICAgICAgICBvYmplY3RUeXBlLmRlZmluaXRpb25ba2V5XSA9IEFwcFN5bmNTY2hlbWFCdWlsZGVyLnJlc29sdmVSZXNvbHZhYmxlRmllbGQodGhpcy5zY2hlbWFUeXBlcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXNvbHZlIGFuIEFwcFN5bmMgUmVzb2x2YWJsZUZpZWxkIHdpdGggYSBKb21weEdyYXBocWxUeXBlICh3aXRoIHN0cmluZyB0eXBlKSB0byBhIFJlc29sdmFibGVGaWVsZCB3aXRoIGEgR3JhcGhxbFR5cGUgKHdpdGggYW4gYWN0dWFsIHR5cGUpLlxyXG4gICAgICovXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L21lbWJlci1vcmRlcmluZ1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVzb2x2ZVJlc29sdmFibGVGaWVsZChzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzLCByZXNvbHZhYmxlRmllbGQ6IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKTogYXBwc3luYy5SZXNvbHZhYmxlRmllbGQge1xyXG5cclxuICAgICAgICBsZXQgcnYgPSByZXNvbHZhYmxlRmllbGQ7XHJcblxyXG4gICAgICAgIGlmIChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zPy5yZXR1cm5UeXBlIGluc3RhbmNlb2YgSm9tcHhHcmFwaHFsVHlwZSkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgYSBuZXcgR3JhcGhRTCBkYXRhdHlwZSB3aXRoIGFjdHVhbCB0eXBlLlxyXG4gICAgICAgICAgICBjb25zdCBuZXdHcmFwaHFsVHlwZSA9IHJlc29sdmFibGVGaWVsZC5maWVsZE9wdGlvbnMucmV0dXJuVHlwZS5yZXNvbHZlKHNjaGVtYVR5cGVzKTtcclxuICAgICAgICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIHJlc29sdmFibGUgZmllbGQgb3B0aW9ucyBcIm9sZFwiIEdyYXBoUUwgZGF0YXR5cGUgd2l0aCBcIm5ld1wiIEdyYXBoUUwgZGF0YXR5cGUuXHJcbiAgICAgICAgICAgIHNldChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zLCAncmV0dXJuVHlwZScsIG5ld0dyYXBocWxUeXBlKTtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG5ldyByZXNvbHZhYmxlIGZpZWxkIHdpdGggbW9kaWZpZWQgcmVzb2x2YWJsZSBmaWVsZCBvcHRpb25zLlxyXG4gICAgICAgICAgICBydiA9IG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZChyZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9leHBsYWluaW5nLWdyYXBocWwtY29ubmVjdGlvbnMvXHJcbiAgICAgKi9cclxuICAgIC8vIHByaXZhdGUgYWRkRmluZENvbm5lY3Rpb24ob2JqZWN0VHlwZTogYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IG9iamVjdFR5cGVOYW1lID0gb2JqZWN0VHlwZS5uYW1lO1xyXG4gICAgLy8gICAgIGNvbnN0IHBhZ2luYXRpb25UeXBlOiBJQ3VzdG9tRGlyZWN0aXZlUGFnaW5hdGlvblR5cGUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0SWRlbnRpZmllckFyZ3VtZW50KCdwYWdpbmF0aW9uJywgJ3R5cGUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKSBhcyBJQ3VzdG9tRGlyZWN0aXZlUGFnaW5hdGlvblR5cGUgPz8gJ29mZnNldCc7XHJcbiAgICAvLyAgICAgY29uc3QgZGF0YVNvdXJjZU5hbWUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0SWRlbnRpZmllckFyZ3VtZW50KCdkYXRhc291cmNlJywgJ25hbWUnLCBvYmplY3RUeXBlPy5kaXJlY3RpdmVzKTtcclxuXHJcbiAgICAvLyAgICAgaWYgKGRhdGFTb3VyY2VOYW1lXHJcbiAgICAvLyAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3JcclxuICAgIC8vICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldFxyXG4gICAgLy8gICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0XHJcbiAgICAvLyAgICAgKSB7XHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGRhdGFTb3VyY2UgPSB0aGlzLmRhdGFTb3VyY2VzW2RhdGFTb3VyY2VOYW1lXTtcclxuICAgIC8vICAgICAgICAgY29uc3QgYXV0aFJ1bGVzID0gQ3VzdG9tRGlyZWN0aXZlLmF1dGhUb09iamVjdChvYmplY3RUeXBlPy5kaXJlY3RpdmVzKTtcclxuXHJcbiAgICAvLyAgICAgICAgIC8vIEVkZ2UuXHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGVkZ2VPYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1FZGdlYCwge1xyXG4gICAgLy8gICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIC4uLihwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicpICYmIHsgY3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgfSwgLy8gSWYgcGFnaW5hdGlvbiB0eXBlIGN1cnNvciB0aGVuIGluY2x1ZGUgcmVxdWlyZWQgY3Vyc29yIHByb3BlcnR5LlxyXG4gICAgLy8gICAgICAgICAgICAgICAgIG5vZGU6IG9iamVjdFR5cGUuYXR0cmlidXRlKClcclxuICAgIC8vICAgICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLi4uYXV0aFJ1bGVzPy5maW5kKG8gPT4gby5wcm92aWRlciA9PT0gYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU0pID8gW2FwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXSA6IFtdXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgLy8gICAgICAgICAgICAgXVxyXG4gICAgLy8gICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZWRnZU9iamVjdFR5cGUpO1xyXG5cclxuICAgIC8vICAgICAgICAgLy8gQ29ubmVjdGlvbi4gQmFzZWQgb24gcmVsYXkgc3BlY2lmaWNhdGlvbjogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLUNvbm5lY3Rpb24tVHlwZXNcclxuICAgIC8vICAgICAgICAgY29uc3QgY29ubmVjdGlvbk9iamVjdFR5cGUgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKGAke29iamVjdFR5cGVOYW1lfUNvbm5lY3Rpb25gLCB7XHJcbiAgICAvLyAgICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgZWRnZXM6IGVkZ2VPYmplY3RUeXBlLmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSxcclxuICAgIC8vICAgICAgICAgICAgICAgICBwYWdlSW5mbzogcGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InID8gdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvci5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIDogdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldC5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRvdGFsQ291bnQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkgLy8gQXBvbGxvIHN1Z2dlc3RzIGFkZGluZyBhcyBhIGNvbm5lY3Rpb24gcHJvcGVydHk6IGh0dHBzOi8vZ3JhcGhxbC5vcmcvbGVhcm4vcGFnaW5hdGlvbi9cclxuICAgIC8vICAgICAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLi4uYXV0aFJ1bGVzPy5maW5kKG8gPT4gby5wcm92aWRlciA9PT0gYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU0pID8gW2FwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXSA6IFtdXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgLy8gICAgICAgICAgICAgXVxyXG4gICAgLy8gICAgICAgICB9KTtcclxuICAgIC8vICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoY29ubmVjdGlvbk9iamVjdFR5cGUpO1xyXG5cclxuICAgIC8vICAgICAgICAgLy8gQWRkIGRlZmF1bHQgcXVlcnkgYXJndW1lbnRzLlxyXG4gICAgLy8gICAgICAgICBjb25zdCBhcmdzID0ge307XHJcblxyXG4gICAgLy8gICAgICAgICAvLyBBZGQgZmlsdGVyIGFyZ3VtZW50LlxyXG4gICAgLy8gICAgICAgICBzZXQoYXJncywgJ2ZpbHRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuYXdzSnNvbigpKTtcclxuXHJcbiAgICAvLyAgICAgICAgIC8vIEFkZCBzb3J0IGFyZ3VtZW50LlxyXG4gICAgLy8gICAgICAgICBzZXQoYXJncywgJ3NvcnQnLCB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0LmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSk7XHJcblxyXG4gICAgLy8gICAgICAgICAvLyBBZGQgb2Zmc2V0IHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgLy8gICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdvZmZzZXQnKSB7XHJcbiAgICAvLyAgICAgICAgICAgICBzZXQoYXJncywgJ3NraXAnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgIC8vICAgICAgICAgICAgIHNldChhcmdzLCAnbGltaXQnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgIC8vICAgICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgICAgLy8gQWRkIGN1cnNvciBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuICAgIC8vICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJykge1xyXG4gICAgLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdmaXJzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdhZnRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdsYXN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAvLyAgICAgICAgICAgICBzZXQoYXJncywgJ2JlZm9yZScsIGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCkpO1xyXG4gICAgLy8gICAgICAgICB9XHJcblxyXG4gICAgLy8gICAgICAgICAvLyBBZGQgcXVlcnkuXHJcbiAgICAvLyAgICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgZmluZCR7b2JqZWN0VHlwZU5hbWVQbHVyYWx9YCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgIC8vICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGAke2NoYW5nZUNhc2UuY2FtZWxDYXNlKG9iamVjdFR5cGVOYW1lKX1GaW5kYCwgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgIC8vICAgICAgICAgICAgIHJldHVyblR5cGU6IGNvbm5lY3Rpb25PYmplY3RUeXBlLmF0dHJpYnV0ZSgpLFxyXG4gICAgLy8gICAgICAgICAgICAgYXJncyxcclxuICAgIC8vICAgICAgICAgICAgIGRhdGFTb3VyY2UsXHJcbiAgICAvLyAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLi4uYXV0aFJ1bGVzPy5maW5kKG8gPT4gby5wcm92aWRlciA9PT0gYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU0pID8gW2FwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXSA6IFtdXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgLy8gICAgICAgICAgICAgXSxcclxuICAgIC8vICAgICAgICAgICAgIC8vIHBpcGVsaW5lQ29uZmlnOiBbXSwgLy8gVE9ETzogQWRkIGF1dGhvcml6YXRpb24gTGFtYmRhIGZ1bmN0aW9uIGhlcmUuXHJcbiAgICAvLyAgICAgICAgICAgICAvLyBVc2UgdGhlIHJlcXVlc3QgbWFwcGluZyB0byBpbmplY3Qgc3Rhc2ggdmFyaWFibGVzIChmb3IgdXNlIGluIExhbWJkYSBmdW5jdGlvbikuXHJcbiAgICAvLyAgICAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgIC8vICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcIm9wZXJhdGlvblwiLCBcImZpbmRcIikpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvYmplY3RUeXBlTmFtZVwiLCBcIiR7b2JqZWN0VHlwZU5hbWV9XCIpKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwicmV0dXJuVHlwZU5hbWVcIiwgXCIke2Nvbm5lY3Rpb25PYmplY3RUeXBlLm5hbWV9XCIpKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICR7RGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAvLyAgICAgICAgICAgICBgKVxyXG4gICAgLy8gICAgICAgICB9KSk7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG5cclxuICAgIHByaXZhdGUgYWRkQ3VzdG9tRGlyZWN0aXZlcygpIHtcclxuXHJcbiAgICAgICAgLy8gQXV0aC5cclxuICAgICAgICBjb25zdCBhdXRoID0gbmV3IGNkaXJlY3RpdmUuQXV0aERpcmVjdGl2ZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShhdXRoLmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgYXV0aC5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIENvZ25pdG8uXHJcbiAgICAgICAgY29uc3QgY29nbml0byA9IG5ldyBjZGlyZWN0aXZlLkNvZ25pdG9EaXJlY3RpdmUoKTtcclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEoY29nbml0by5kZWZpbml0aW9uKCkpO1xyXG4gICAgICAgIGNvZ25pdG8uc2NoZW1hKHRoaXMuc2NoZW1hVHlwZXMpO1xyXG5cclxuICAgICAgICAvLyBEYXRhc291cmNlLlxyXG4gICAgICAgIGNvbnN0IGRhdGFzb3VyY2UgPSBuZXcgY2RpcmVjdGl2ZS5EYXRhc291cmNlRGlyZWN0aXZlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKGRhdGFzb3VyY2UuZGVmaW5pdGlvbigpKTtcclxuICAgICAgICBkYXRhc291cmNlLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzKTtcclxuXHJcbiAgICAgICAgLy8gTG9va3VwLlxyXG4gICAgICAgIGNvbnN0IGxvb2t1cCA9IG5ldyBjZGlyZWN0aXZlLkxvb2t1cERpcmVjdGl2ZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShsb29rdXAuZGVmaW5pdGlvbigpKTtcclxuICAgICAgICBsb29rdXAuc2NoZW1hKHRoaXMuc2NoZW1hVHlwZXMpO1xyXG5cclxuICAgICAgICAvLyBPcGVyYXRpb25zLlxyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBuZXcgY2RpcmVjdGl2ZS5PcGVyYXRpb25zRGlyZWN0aXZlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKG9wZXJhdGlvbnMuZGVmaW5pdGlvbigpKTtcclxuICAgICAgICBvcGVyYXRpb25zLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzKTtcclxuXHJcbiAgICAgICAgLy8gUGFnaW5hdGlvbi5cclxuICAgICAgICBjb25zdCBwYWdpbmF0aW9uID0gbmV3IGNkaXJlY3RpdmUuUGFnaW5hdGlvbkRpcmVjdGl2ZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShwYWdpbmF0aW9uLmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgcGFnaW5hdGlvbi5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIFJlYWRvbmx5LlxyXG4gICAgICAgIGNvbnN0IHJlYWRvbmx5ID0gbmV3IGNkaXJlY3RpdmUuUmVhZG9ubHlEaXJlY3RpdmUoKTtcclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEocmVhZG9ubHkuZGVmaW5pdGlvbigpKTtcclxuICAgICAgICByZWFkb25seS5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIFNvdXJjZS5cclxuICAgICAgICBjb25zdCBzb3VyY2UgPSBuZXcgY2RpcmVjdGl2ZS5Tb3VyY2VEaXJlY3RpdmUoKTtcclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEoc291cmNlLmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgc291cmNlLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZEN1c3RvbVNjaGVtYSgpIHtcclxuXHJcbiAgICAgICAgLy8gUGFnaW5hdGlvbiBjdXJzb3IuXHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvbkN1cnNvciA9IG5ldyBjc2NoZW1hLlBhZ2luYXRpb25DdXJzb3JTY2hlbWEoKTtcclxuICAgICAgICBwYWdpbmF0aW9uQ3Vyc29yLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzLCB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIFBhZ2luYXRpb24gb2Zmc2V0XHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvbk9mZnNldCA9IG5ldyBjc2NoZW1hLlBhZ2luYXRpb25PZmZzZXRTY2hlbWEoKTtcclxuICAgICAgICBwYWdpbmF0aW9uT2Zmc2V0LnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzLCB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIFNvcnQuXHJcbiAgICAgICAgLy8gVE9ETzogSlNPTiBzb3J0IHRvIG1hdGNoIE1vbmdvREIgc29ydD8gRmllbGQgbGlzdCBpbnB1dCB0eXBlIGlzIGJldHRlciBidXQgbm90IGEgZ29vZCBmaXQgZm9yIHVubGltaXRlZCBuZXN0ZWQgZmllbGRzLlxyXG4gICAgICAgIC8vIGNvbnN0IHNvcnQgPSBuZXcgY3NjaGVtYS5Tb3J0U2NoZW1hKCk7XHJcbiAgICAgICAgLy8gc29ydC5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnB1dFR5cGUgdHlwZSBndWFyZC5cclxuICAgICAqIEBwYXJhbSBvIC0gT2JqZWN0IHRvIHRlc3QuXHJcbiAgICAgKiBAcmV0dXJucyAtIHRydWUgaWYgb2JqZWN0IGlzIG9mIHR5cGUgSW5wdXRUeXBlIChpLmUuIGhhcyBkZWZpbml0aW9uIHByb3BlcnR5KS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpc0lucHV0VHlwZShvOiBhbnkpOiBvIGlzIGFwcHN5bmMuSW5wdXRUeXBlIHtcclxuICAgICAgICByZXR1cm4gKG8gYXMgYXBwc3luYy5JbnB1dFR5cGUpLmRlZmluaXRpb24gIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE9iamVjdFR5cGUgdHlwZSBndWFyZC5cclxuICAgICAqIEBwYXJhbSBvIC0gT2JqZWN0IHRvIHRlc3QuXHJcbiAgICAgKiBAcmV0dXJucyAtIHRydWUgaWYgb2JqZWN0IGlzIG9mIHR5cGUgT2JqZWN0VHlwZSAoaS5lLiBoYXMgaW50ZXJmYWNlVHlwZXMgcHJvcGVydHkpLlxyXG4gICAgICovXHJcbiAgICBwcml2YXRlIGlzT2JqZWN0VHlwZShvOiBhbnkpOiBvIGlzIGFwcHN5bmMuT2JqZWN0VHlwZSB7XHJcbiAgICAgICAgcmV0dXJuIChvIGFzIGFwcHN5bmMuT2JqZWN0VHlwZSkuZGVmaW5pdGlvbiAhPT0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFkZCBhdXRoIGRpcmVjdGl2ZSBhbmQgc3VwcG9ydGluZyB0eXBlcy5cclxuICAgIC8vIEJhc2VkIG9uIEFtcGxpZnkgZGVmaW5pdGlvbi5cclxuICAgIC8vIHByaXZhdGUgYWRkQXV0aFNjaGVtYSgpIHtcclxuXHJcbiAgICAvLyAgICAgY29uc3QgYXV0aFN0cmF0ZWd5ID0gbmV3IGFwcHN5bmMuRW51bVR5cGUoJ0F1dGhTdHJhdGVneScsIHtcclxuICAgIC8vICAgICAgICAgZGVmaW5pdGlvbjogY2RpcmVjdGl2ZS5hdXRoU3RyYXRlZ3lcclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICB0aGlzLnNjaGVtYVR5cGVzLmVudW1UeXBlcy5BdXRoU3RyYXRlZ3kgPSBhdXRoU3RyYXRlZ3k7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IGF1dGhQcm92aWRlciA9IG5ldyBhcHBzeW5jLkVudW1UeXBlKCdBdXRoUHJvdmlkZXInLCB7XHJcbiAgICAvLyAgICAgICAgIGRlZmluaXRpb246IGNkaXJlY3RpdmUuYXV0aFByb3ZpZGVyXHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5zY2hlbWFUeXBlcy5lbnVtVHlwZXMuQXV0aFByb3ZpZGVyID0gYXV0aFByb3ZpZGVyO1xyXG5cclxuICAgIC8vICAgICBjb25zdCBhdXRoT3BlcmF0aW9uID0gbmV3IGFwcHN5bmMuRW51bVR5cGUoJ0F1dGhPcGVyYXRpb24nLCB7XHJcbiAgICAvLyAgICAgICAgIGRlZmluaXRpb246IGNkaXJlY3RpdmUub3BlcmF0aW9uXHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5zY2hlbWFUeXBlcy5lbnVtVHlwZXMuQXV0aE9wZXJhdGlvbiA9IGF1dGhPcGVyYXRpb247XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IGF1dGhSdWxlID0gbmV3IGFwcHN5bmMuSW5wdXRUeXBlKCdBdXRoUnVsZScsIHtcclxuICAgIC8vICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgLy8gICAgICAgICAgICAgYWxsb3c6IGF1dGhTdHJhdGVneS5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLCAvLyBwdWJsaWMsIHByaXZhdGUsIG93bmVyLCBncm91cHMuXHJcbiAgICAvLyAgICAgICAgICAgICBwcm92aWRlcjogYXV0aFByb3ZpZGVyLmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSksIC8vIE5vdCByZXF1aXJlZCBpbiBBbXBsaWZ5LiBTZXQgYXMgcmVxdWlyZWQgZm9yIHNjaGVtYSBjbGFyaXR5LlxyXG4gICAgLy8gICAgICAgICAgICAgb3duZXJGaWVsZDogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSwgLy8gRGVmYXVsdHMgdG8gb3duZXIuXHJcbiAgICAvLyAgICAgICAgICAgICBpZGVudGl0eUNsYWltOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpLCAvLyBEZWZhdWx0cyB0bzogc3ViOjp1c2VybmFtZS5cclxuICAgIC8vICAgICAgICAgICAgIGdyb3Vwc0ZpZWxkOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpLCAvLyBEZWZhdWx0cyB0byBmaWVsZDogZ3JvdXBzLlxyXG4gICAgLy8gICAgICAgICAgICAgZ3JvdXBDbGFpbTogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSwgLy8gRGVmYXVsdHMgdG86IGNvZ25pdG86Z3JvdXAuXHJcbiAgICAvLyAgICAgICAgICAgICBncm91cHM6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNMaXN0OiB0cnVlIH0pLCAvLyBMaXN0IG9mIENvZ25pdG8gZ3JvdXBzLlxyXG4gICAgLy8gICAgICAgICAgICAgb3BlcmF0aW9uczogYXV0aE9wZXJhdGlvbi5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSlcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICAgIHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcy5BdXRoUnVsZSA9IGF1dGhSdWxlO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIHBhZ2luYXRpb24gcGFnZUluZm8gdHlwZXMgZm9yIG9mZnNldCBhbmQgY3Vyc29yIGJhc2VkIHBhZ2luYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQ3Vyc29yIHBhZ2luYXRpb24uIFBhZ2UgYW5kIHNvcnQgYnkgdW5pcXVlIGZpZWxkLiBDb25jYXRlbmF0ZWQgZmllbGRzIGNhbiByZXN1bHQgaW4gcG9vciBwZXJmb3JtYW5jZS5cclxuICAgICAqIGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy1Db25uZWN0aW9uLVR5cGVzXHJcbiAgICAgKiBodHRwczovL3Nob3BpZnkuZW5naW5lZXJpbmcvcGFnaW5hdGlvbi1yZWxhdGl2ZS1jdXJzb3JzXHJcbiAgICAgKiBodHRwczovL21lZGl1bS5jb20vc3dsaC9ob3ctdG8taW1wbGVtZW50LWN1cnNvci1wYWdpbmF0aW9uLWxpa2UtYS1wcm8tNTEzMTQwYjY1ZjMyXHJcbiAgICAgKi9cclxuICAgIC8vIHByaXZhdGUgYWRkUGFnaW5hdGlub1NjaGVtYSgpIHtcclxuXHJcbiAgICAvLyAgICAgLy8gT2Zmc2V0IHBhZ2luYXRpb24uXHJcbiAgICAvLyAgICAgY29uc3QgcGFnZUluZm9PZmZzZXQgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb09mZnNldCcsIHtcclxuICAgIC8vICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgLy8gICAgICAgICAgICAgc2tpcDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgLy8gICAgICAgICAgICAgbGltaXQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgLy8gICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICAuLi4gdGhpcy5hY3RpdmVBdXRob3JpemF0aW9uVHlwZXMuaW5jbHVkZXMoYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU0pID8gW2FwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXSA6IFtdLFxyXG4gICAgLy8gICAgICAgICAgICAgLi4uIHRoaXMuYWN0aXZlQXV0aG9yaXphdGlvblR5cGVzLmluY2x1ZGVzKGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuVVNFUl9QT09MKSA/IFtDdXN0b21EaXJlY3RpdmUuY29nbml0b0FsbEdyb3VwcygpXSA6IFtdIC8vIEFsbG93IGFsbCBDb2duaXRvIGF1dGhlbnRpY2F0ZWQgdXNlcnMuXHJcbiAgICAvLyAgICAgICAgIF1cclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvT2Zmc2V0ID0gcGFnZUluZm9PZmZzZXQ7XHJcblxyXG4gICAgLy8gICAgIC8vIEN1cnNvciBwYWdpbmF0aW9uLlxyXG4gICAgLy8gICAgIGNvbnN0IHBhZ2VJbmZvQ3Vyc29yID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZSgnUGFnZUluZm9DdXJzb3InLCB7XHJcbiAgICAvLyAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgIC8vICAgICAgICAgICAgIGhhc1ByZXZpb3VzUGFnZTogYXBwc3luYy5HcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgIC8vICAgICAgICAgICAgIGhhc05leHRQYWdlOiBhcHBzeW5jLkdyYXBocWxUeXBlLmJvb2xlYW4oeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgLy8gICAgICAgICAgICAgc3RhcnRDdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgIC8vICAgICAgICAgICAgIGVuZEN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAvLyAgICAgICAgIH0sXHJcbiAgICAvLyAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgIC8vICAgICAgICAgICAgIC4uLiB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcy5pbmNsdWRlcyhhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLklBTSkgPyBbYXBwc3luYy5EaXJlY3RpdmUuaWFtKCldIDogW10sXHJcbiAgICAvLyAgICAgICAgICAgICAuLi4gdGhpcy5hY3RpdmVBdXRob3JpemF0aW9uVHlwZXMuaW5jbHVkZXMoYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wpID8gW2FwcHN5bmMuRGlyZWN0aXZlLmN1c3RvbSgnQGF3c19jb2duaXRvX3VzZXJfcG9vbHMnKV0gOiBbXSAvLyBBbGxvdyBhbGwgQ29nbml0byBhdXRoZW50aWNhdGVkIHVzZXJzLlxyXG4gICAgLy8gICAgICAgICBdXHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvciA9IHBhZ2VJbmZvQ3Vyc29yO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHNvcnQgaW5wdXQgdHlwZSBmb3IgbXVsdGkgY29sdW1uIHNvcnRpbmcuXHJcbiAgICAgKi9cclxuICAgIC8vIHByaXZhdGUgYWRkU29ydFNjaGVtYSgpIHtcclxuXHJcbiAgICAvLyAgICAgY29uc3Qgc29ydElucHV0ID0gbmV3IGFwcHN5bmMuSW5wdXRUeXBlKCdTb3J0SW5wdXQnLCB7XHJcbiAgICAvLyAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgIC8vICAgICAgICAgICAgIGZpZWxkTmFtZTogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgLy8gICAgICAgICAgICAgZGlyZWN0aW9uOiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICAgIHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcy5Tb3J0SW5wdXQgPSBzb3J0SW5wdXQ7XHJcbiAgICAvLyB9XHJcbn1cclxuIl19