"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncSchemaBuilder = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLWJ1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvc2NoZW1hLWJ1aWxkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsc0RBQXNEO0FBRXRELDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFDMUMsaUVBQWlFO0FBQ2pFLDJDQUEyQztBQUMzQyxpRUFBaUU7QUFDakUsaUNBQWtDO0FBQ2xDLHFDQUFxQztBQUNyQyxzREFBc0Q7QUFFdEQscUZBQXFGO0FBQ3JGLDJDQUEyQztBQUMzQyxpREFBa0Q7QUFDbEQsMkNBQTJDO0FBQzNDLHFDQUFxQztBQXVEckMsTUFBYSxvQkFBb0I7SUFLN0IsWUFDVyxVQUE4QixFQUM5Qix3QkFBcUQ7UUFEckQsZUFBVSxHQUFWLFVBQVUsQ0FBb0I7UUFDOUIsNkJBQXdCLEdBQXhCLHdCQUF3QixDQUE2QjtRQUx6RCxnQkFBVyxHQUFnQixFQUFFLENBQUM7UUFDOUIsZ0JBQVcsR0FBaUIsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUt0SCxDQUFDO0lBRUwsbUhBQW1IO0lBQzVHLGFBQWEsQ0FBQyxFQUFVLEVBQUUsY0FBd0MsRUFBRSxPQUFtQztRQUMxRyxNQUFNLFVBQVUsR0FBRyxvQkFBb0IsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ25FLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxFQUFF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QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBRXpFLFFBQVE7UUFDUix5SEFBeUg7UUFDekgseUNBQXlDO1FBQ3pDLGlDQUFpQztJQUNyQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLFdBQVcsQ0FBQyxDQUFNO1FBQ3RCLE9BQVEsQ0FBdUIsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDO0lBQzdELENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssWUFBWSxDQUFDLENBQU07UUFDdkIsT0FBUSxDQUF3QixDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUM7SUFDOUQsQ0FBQztDQXdGSjtBQXZqQkQsb0RBdWpCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG4vLyBpbXBvcnQgcGx1cmFsaXplID0gcmVxdWlyZSgncGx1cmFsaXplJyk7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbmltcG9ydCBzZXQgPSByZXF1aXJlKCdzZXQtdmFsdWUnKTtcclxuLy8gaW1wb3J0IGdldCA9IHJlcXVpcmUoJ2dldC12YWx1ZScpO1xyXG5pbXBvcnQgKiBhcyBkZWZpbml0aW9ucyBmcm9tICcuL2FwcC1zeW5jLWRlZmluaXRpb25zJztcclxuaW1wb3J0IHsgSURhdGFTb3VyY2UsIElTY2hlbWFUeXBlcywgSUFwcFN5bmNPcGVyYXRpb25GaWVsZHMgfSBmcm9tICcuL2FwcC1zeW5jLnR5cGVzJztcclxuLy8gaW1wb3J0IHsgQXBwU3luY015U3FsQ3VzdG9tRGlyZWN0aXZlIH0gZnJvbSAnLi9kYXRhc291cmNlcy9teXNxbC9teXNxbC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgKiBhcyBjZGlyZWN0aXZlIGZyb20gJy4vZGlyZWN0aXZlcyc7XHJcbmltcG9ydCB7IEpvbXB4R3JhcGhxbFR5cGUgfSBmcm9tICcuL2dyYXBocWwtdHlwZSc7XHJcbmltcG9ydCAqIGFzIGNvcGVyYXRpb24gZnJvbSAnLi9vcGVyYXRpb25zJztcclxuaW1wb3J0ICogYXMgY3NjaGVtYSBmcm9tICcuL3NjaGVtYXMnO1xyXG5cclxuLyoqXHJcbiAqIEdyYXBoUUwgU3BlYzogaHR0cHM6Ly9zcGVjLmdyYXBocWwub3JnLy4gTW9zdGx5IGZvciB0aGUgYmFja2VuZCBidXQgZ29vZCB0byBrbm93IGFib3V0LlxyXG4gKiBDdXJzb3IgRWRnZSBOb2RlOiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvZXhwbGFpbmluZy1ncmFwaHFsLWNvbm5lY3Rpb25zL1xyXG4gKiBTdXBwb3J0IHJlbGF5IG9yIG5vdD9cclxuICogaHR0cHM6Ly9tZWRpdW0uY29tL29wZW4tZ3JhcGhxbC91c2luZy1yZWxheS13aXRoLWF3cy1hcHBzeW5jLTU1Yzg5Y2EwMjA2NlxyXG4gKiBKb2lucyBzaG91bGQgYmUgY29ubmVjdGlvbnMgYW5kIG5hbWVkIGFzIHN1Y2guIGUuZy4gaW4gcG9zdCBUYWdzQ29ubmVjdGlvblxyXG4gKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtdW5kZWZpbmVkLlBhZ2VJbmZvXHJcbiAqIGh0dHBzOi8vZ3JhcGhxbC1ydWxlcy5jb20vcnVsZXMvbGlzdC1wYWdpbmF0aW9uXHJcbiAqIGh0dHBzOi8vd3d3LmFwb2xsb2dyYXBocWwuY29tL2Jsb2cvZ3JhcGhxbC9iYXNpY3MvZGVzaWduaW5nLWdyYXBocWwtbXV0YXRpb25zL1xyXG4gKiAtIE11dGF0aW9uOiBVc2UgdG9wIGxldmVsIGlucHV0IHR5cGUgZm9yIGFncy4gVXNlIHRvcCBsZXZlbCBwcm9wZXJ0eSBmb3Igb3V0cHV0IHR5cGUuXHJcbiAqL1xyXG5cclxuLy8gVE9ETyBNYWtlIHN1cmUgd2UgY2FuIGNhbGwgYSBtdXRhdGlvbiBhbmQgY2FsbCBhIHF1ZXJ5PyBodHRwczovL2dyYXBocWwtcnVsZXMuY29tL3J1bGVzL211dGF0aW9uLXBheWxvYWQtcXVlcnlcclxuLy8gVE9ETyBBZGQgc2NoZW1hIGRvY3VtZW50aW9uIG1hcmt1cDogaHR0cDovL3NwZWMuZ3JhcGhxbC5vcmcvZHJhZnQvI3NlYy1EZXNjcmlwdGlvbnNcclxuLy8gSW50ZXJlc3RpbmcgdHlwZWQgZXJyb3JzOiBodHRwczovL2dyYXBocWwtcnVsZXMuY29tL3J1bGVzL211dGF0aW9uLXBheWxvYWQtZXJyb3JzXHJcblxyXG4vKlxyXG50eXBlIFVzZXJGcmllbmRzQ29ubmVjdGlvbiB7XHJcbiAgcGFnZUluZm86IFBhZ2VJbmZvIVxyXG4gIGVkZ2VzOiBbVXNlckZyaWVuZHNFZGdlXVxyXG59dHlwZSBVc2VyRnJpZW5kc0VkZ2Uge1xyXG4gIGN1cnNvcjogU3RyaW5nIVxyXG4gIG5vZGU6IFVzZXJcclxufVxyXG4qL1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQWRkTXV0YXRpb25BcmdzIHtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIG11dGF0aW9uIGFzIGl0IHdpbGwgYXBwZWFyIGluIHRoZSBHcmFwaFFMIHNjaGVtYS5cclxuICAgICAqL1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgbXV0YXRpb24gZGF0YXNvdXJjZS5cclxuICAgICAqL1xyXG4gICAgZGF0YVNvdXJjZU5hbWU6IHN0cmluZztcclxuICAgIC8qKlxyXG4gICAgICogTXV0YXRpb24gaW5wdXQgKGFyZ3VtZW50cyB3cmFwcGVkIGluIGFuIGlucHV0IHByb3BlcnR5KS5cclxuICAgICAqL1xyXG4gICAgaW5wdXQ6IGFwcHN5bmMuSW5wdXRUeXBlIHwgSUFwcFN5bmNPcGVyYXRpb25GaWVsZHM7XHJcbiAgICAvKipcclxuICAgICAqIE11dGF0aW9uIG91dHB1dCAocmV0dXJuIHZhbHVlKS5cclxuICAgICAqL1xyXG4gICAgb3V0cHV0OiBhcHBzeW5jLk9iamVjdFR5cGUgfCBJQXBwU3luY09wZXJhdGlvbkZpZWxkcztcclxuICAgIC8qKlxyXG4gICAgICogTGlzdCBvZiBhdXRoIHJ1bGVzIHRvIGFwcGx5IHRvIHRoZSBtdXRhdGlvbiBhbmQgb3V0cHV0IHR5cGUuXHJcbiAgICAgKi9cclxuICAgIGF1dGg6IGFwcHN5bmMuRGlyZWN0aXZlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgY2xhc3MgbWV0aG9kIHRvIGNhbGwgb24gcmVxdWVzdCBtdXRhdGlvbi5cclxuICAgICAqL1xyXG4gICAgbWV0aG9kTmFtZT86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmNTY2hlbWFCdWlsZGVyIHtcclxuXHJcbiAgICBwdWJsaWMgZGF0YVNvdXJjZXM6IElEYXRhU291cmNlID0ge307XHJcbiAgICBwdWJsaWMgc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlcyA9IHsgZW51bVR5cGVzOiB7fSwgaW5wdXRUeXBlczoge30sIGludGVyZmFjZVR5cGVzOiB7fSwgb2JqZWN0VHlwZXM6IHt9LCB1bmlvblR5cGVzOiB7fSB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBncmFwaHFsQXBpOiBhcHBzeW5jLkdyYXBocWxBcGksXHJcbiAgICAgICAgcHVibGljIGFjdGl2ZUF1dGhvcml6YXRpb25UeXBlczogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZVtdXHJcbiAgICApIHsgfVxyXG5cclxuICAgIC8vIEFkZCBkYXRhc291cmNlIHRvIEFwcFN5bmMgaW4gYW4gaW50ZXJuYWwgYXJyYXkuIFJlbW92ZSB0aGlzIHdoZW4gQXBwU3luYyBwcm92aWRlcyBhIHdheSB0byBpdGVyYXRlIGRhdGFzb3VyY2VzKS5cclxuICAgIHB1YmxpYyBhZGREYXRhU291cmNlKGlkOiBzdHJpbmcsIGxhbWJkYUZ1bmN0aW9uOiBjZGsuYXdzX2xhbWJkYS5JRnVuY3Rpb24sIG9wdGlvbnM/OiBhcHBzeW5jLkRhdGFTb3VyY2VPcHRpb25zKTogYXBwc3luYy5MYW1iZGFEYXRhU291cmNlIHtcclxuICAgICAgICBjb25zdCBpZGVudGlmaWVyID0gYEFwcFN5bmNEYXRhU291cmNlJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UoaWQpfWA7XHJcbiAgICAgICAgY29uc3QgZGF0YVNvdXJjZSA9IHRoaXMuZ3JhcGhxbEFwaS5hZGRMYW1iZGFEYXRhU291cmNlKGlkZW50aWZpZXIsIGxhbWJkYUZ1bmN0aW9uLCBvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzID0geyAuLi50aGlzLmRhdGFTb3VyY2VzLCAuLi57IFtpZF06IGRhdGFTb3VyY2UgfSB9O1xyXG4gICAgICAgIHJldHVybiBkYXRhU291cmNlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRTY2hlbWFUeXBlcyhzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzKSB7XHJcbiAgICAgICAgdGhpcy5zY2hlbWFUeXBlcyA9IHsgLi4udGhpcy5zY2hlbWFUeXBlcywgLi4uc2NoZW1hVHlwZXMgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIG11dGF0aW9uIHRvIHRoZSBHcmFwaFFMIHNjaGVtYS5cclxuICAgICAqIFdyYXAgaW5wdXQgaW4gaW5wdXQgdHlwZSBhbmQgb3V0cHV0IGluIG91dHB1dCB0eXBlLlxyXG4gICAgICogaHR0cHM6Ly9ncmFwaHFsLXJ1bGVzLmNvbS9ydWxlcy9tdXRhdGlvbi1wYXlsb2FkXHJcbiAgICAgKiBAcmV0dXJucyAtIFRoZSBjcmVhdGVkIEFwcFN5bmMgbXV0YXRpb24gb2JqZWN0IHR5cGUuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRNdXRhdGlvbih7IG5hbWUsIGRhdGFTb3VyY2VOYW1lLCBpbnB1dCwgb3V0cHV0LCBhdXRoLCBtZXRob2ROYW1lIH06IElBZGRNdXRhdGlvbkFyZ3MpOiBhcHBzeW5jLk9iamVjdFR5cGUge1xyXG5cclxuICAgICAgICAvLyBDaGVjayBkYXRhc291cmNlIGV4aXN0cy5cclxuICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcbiAgICAgICAgaWYgKCFkYXRhU291cmNlKSB0aHJvdyBFcnJvcihgSm9tcHggYWRkTXV0YXRpb246IGRhdGFTb3VyY2UgXCIke2RhdGFTb3VyY2VOYW1lfVwiIG5vdCBmb3VuZCFgKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIGlucHV0IHR5cGUgKHRvIEdyYXBoUUwgc2NoZW1hKS4gSXQncyBHcmFwaFFMIGJlc3QgcHJhY3RpY2UgdG8gd3JhcCBhbGwgaW5wdXQgYXJndW1lbnRzIGluIGEgc2luZ2xlIGlucHV0IHR5cGUuXHJcbiAgICAgICAgbGV0IGlucHV0VHlwZTogYXBwc3luYy5JbnB1dFR5cGU7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbnB1dFR5cGUoaW5wdXQpKSB7XHJcbiAgICAgICAgICAgIGlucHV0VHlwZSA9IGlucHV0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlucHV0VHlwZSA9IHRoaXMuYWRkT3BlcmF0aW9uSW5wdXRzKG5hbWUsIGlucHV0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEFkZCBvdXRwdXQgdHlwZSAodG8gR3JhcGhRTCkuIE91dHB1dCB3aWxsIGNvbnRhaW4gdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbXV0YXRpb24gKGFuZCB3aWxsIGJlIHdyYXBwZWQgaW4gYSBQYXlsb2FkIHR5cGUpLlxyXG4gICAgICAgIGxldCBvdXRwdXRUeXBlOiBhcHBzeW5jLk9iamVjdFR5cGU7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNPYmplY3RUeXBlKG91dHB1dCkpIHtcclxuICAgICAgICAgICAgb3V0cHV0VHlwZSA9IG91dHB1dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBvdXRwdXREaXJlY3RpdmVzID0gW2F1dGhdO1xyXG4gICAgICAgICAgICBvdXRwdXRUeXBlID0gdGhpcy5hZGRPcGVyYXRpb25PdXRwdXRzKG5hbWUsIG91dHB1dCwgb3V0cHV0RGlyZWN0aXZlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAvLyBBZGQgcGF5bG9hZCB0eXBlICh0byBHcmFwaFFMIHNjaGVtYSkuIC8vIFRPRE86IE5vdCBzdXJlISBXZSBuZWVkIHRvIGJlIGluIHN5bmMgd2l0aCB3aGF0ZXZlciBHcmFwaFFMIHR5cGVzIGFyZSBhdXRvIGdlbmVyYXRlZC5cclxuICAgICAgICAvLyBjb25zdCBwYXlsb2FkVHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKG5hbWUpfVBheWxvYWRgLCB7XHJcbiAgICAgICAgLy8gICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAvLyAgICAgICAgIG91dHB1dDogb3V0cHV0VHlwZS5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAvLyAgICAgICAgIGF1dGhcclxuICAgICAgICAvLyAgICAgXVxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKHBheWxvYWRUeXBlKTtcclxuXHJcbiAgICAgICAgLy8gQWRkIG11dGF0aW9uICh0byBHcmFwaFFMKS5cclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaHFsQXBpLmFkZE11dGF0aW9uKG5hbWUsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgIHJldHVyblR5cGU6IG91dHB1dFR5cGUuYXR0cmlidXRlKCksXHJcbiAgICAgICAgICAgIGFyZ3M6IHsgaW5wdXQ6IGlucHV0VHlwZS5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sXHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2UsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgIGF1dGhcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gcGlwZWxpbmVDb25maWc6IFtdLCAvLyBUT0RPOiBBZGQgYXV0aG9yaXphdGlvbiBMYW1iZGEgZnVuY3Rpb24gaGVyZT9cclxuICAgICAgICAgICAgLy8gVE9ETzogQ2xlYW4gdXAgcGFyYW1zIHBhc3NpbmcgdG8gTGFtYmRhLlxyXG4gICAgICAgICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib3BlcmF0aW9uXCIsIFwiJHttZXRob2ROYW1lfVwiKSlcclxuICAgICAgICAgICAgICAgICR7ZGVmaW5pdGlvbnMuRGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAgICAgICAgIGApXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSXRlcmF0ZSBhIGxpc3Qgb3IgbmVzdGVkIGxpc3Qgb2YgQXBwU3luYyBmaWVsZHMgYW5kIGNyZWF0ZSBpbnB1dCB0eXBlKHMpLlxyXG4gICAgICogR3JhcGhRTCBkb2Vzbid0IHN1cHBvcnQgbmVzdGVkIHR5cGVzIHNvIGNyZWF0ZSBhIHR5cGUgZm9yIGVhY2ggbmVzdGVkIHR5cGUgcmVjdXJzaXZlbHkuXHJcbiAgICAgKiBUeXBlcyBhcmUgYWRkZWQgdG8gdGhlIGdyYXBocWxBcGkuXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAtIENyZWF0ZSBhbiBpbnB1dCB0eXBlIHdpdGggdGhpcyBuYW1lIGFuZCBhbiBcIklucHV0XCIgc3VmZml4LlxyXG4gICAgICogQHBhcmFtIG9wZXJhdGlvbkZpZWxkcyAtIGxpc3Qgb2YgZmllbGRzIG9yIG5lc3RlZCBsaXN0IG9mIEFwcFN5bmMgZmllbGRzIGUuZy5cclxuICAgICAqIHtcclxuICAgICAqICAgICBudW1iZXIxOiBHcmFwaHFsVHlwZS5pbnQoKSxcclxuICAgICAqICAgICBudW1iZXIyOiBHcmFwaHFsVHlwZS5pbnQoKSxcclxuICAgICAqICAgICB0ZXN0OiB7XHJcbiAgICAgKiAgICAgICAgIG51bWJlcjE6IEdyYXBocWxUeXBlLmludCgpLFxyXG4gICAgICogICAgICAgICBudW1iZXIyOiBHcmFwaHFsVHlwZS5pbnQoKSxcclxuICAgICAqICAgICB9XHJcbiAgICAgKiB9O1xyXG4gICAgICogQHJldHVybnMgLSBBbiBBcHBTeW5jIGlucHV0IHR5cGUgKHdpdGggcmVmZXJlbmNlcyB0byBuZXN0ZWQgdHlwZXMgaWYgYW55KS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZE9wZXJhdGlvbklucHV0cyhuYW1lOiBzdHJpbmcsIG9wZXJhdGlvbkZpZWxkczogSUFwcFN5bmNPcGVyYXRpb25GaWVsZHMsIHN1ZmZpeCA9ICdJbnB1dCcpOiBhcHBzeW5jLklucHV0VHlwZSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGlucHV0VHlwZSA9IG5ldyBhcHBzeW5jLklucHV0VHlwZShgJHtjaGFuZ2VDYXNlLnBhc2NhbENhc2UobmFtZSl9JHtzdWZmaXh9YCwgeyBkZWZpbml0aW9uOiB7fSB9KTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCBmaWVsZF0gb2YgT2JqZWN0LmVudHJpZXMob3BlcmF0aW9uRmllbGRzKSkge1xyXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZmllbGQpLmluY2x1ZGVzKCdpbnRlcm1lZGlhdGVUeXBlJykpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0VHlwZS5hZGRGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lOiBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGZpZWxkIGFzIGFwcHN5bmMuSUZpZWxkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5lc3RlZElucHV0VHlwZSA9IHRoaXMuYWRkT3BlcmF0aW9uSW5wdXRzKGAke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShuYW1lKX0ke2NoYW5nZUNhc2UucGFzY2FsQ2FzZShrZXkpfWAsIGZpZWxkIGFzIElBcHBTeW5jT3BlcmF0aW9uRmllbGRzKTtcclxuICAgICAgICAgICAgICAgIGlucHV0VHlwZS5hZGRGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lOiBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ6IG5lc3RlZElucHV0VHlwZS5hdHRyaWJ1dGUoKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnB1dFR5cGUpO1xyXG4gICAgICAgIHJldHVybiBpbnB1dFR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJdGVyYXRlIGEgbGlzdCBvciBuZXN0ZWQgbGlzdCBvZiBBcHBTeW5jIGZpZWxkcyBhbmQgY3JlYXRlIG91dHB1dCB0eXBlKHMpLlxyXG4gICAgICogR3JhcGhRTCBkb2Vzbid0IHN1cHBvcnQgbmVzdGVkIHR5cGVzIHNvIGNyZWF0ZSBhIHR5cGUgZm9yIGVhY2ggbmVzdGVkIHR5cGUgcmVjdXJzaXZlbHkuXHJcbiAgICAgKiBUeXBlcyBhcmUgYWRkZWQgdG8gdGhlIGdyYXBocWxBcGkuXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAtIENyZWF0ZSBhbiBvdXRwdXQgdHlwZSB3aXRoIHRoaXMgbmFtZSBhbmQgYW4gXCJPdXRwdXRcIiBzdWZmaXguXHJcbiAgICAgKiBAcGFyYW0gb3BlcmF0aW9uRmllbGRzIC0gbGlzdCBvZiBmaWVsZHMgb3IgbmVzdGVkIGxpc3Qgb2YgQXBwU3luYyBmaWVsZHMgZS5nLlxyXG4gICAgICoge1xyXG4gICAgICogICAgIG51bWJlcjE6IEdyYXBocWxUeXBlLmludCgpLFxyXG4gICAgICogICAgIG51bWJlcjI6IEdyYXBocWxUeXBlLmludCgpLFxyXG4gICAgICogICAgIHRlc3Q6IHtcclxuICAgICAqICAgICAgICAgbnVtYmVyMTogR3JhcGhxbFR5cGUuaW50KCksXHJcbiAgICAgKiAgICAgICAgIG51bWJlcjI6IEdyYXBocWxUeXBlLmludCgpLFxyXG4gICAgICogICAgIH1cclxuICAgICAqIH07XHJcbiAgICAgKiBAcmV0dXJucyAtIEFuIEFwcFN5bmMgaW5wdXQgdHlwZSAod2l0aCByZWZlcmVuY2VzIHRvIG5lc3RlZCB0eXBlcyBpZiBhbnkpLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkT3BlcmF0aW9uT3V0cHV0cyhuYW1lOiBzdHJpbmcsIG9wZXJhdGlvbkZpZWxkczogSUFwcFN5bmNPcGVyYXRpb25GaWVsZHMsIGRpcmVjdGl2ZXM6IGFwcHN5bmMuRGlyZWN0aXZlW10sIHN1ZmZpeCA9ICdPdXRwdXQnKTogYXBwc3luYy5PYmplY3RUeXBlIHtcclxuXHJcbiAgICAgICAgY29uc3Qgb3V0cHV0VHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKG5hbWUpfSR7c3VmZml4fWAsIHtcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge30sXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgIC4uLmRpcmVjdGl2ZXNcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIGZpZWxkXSBvZiBPYmplY3QuZW50cmllcyhvcGVyYXRpb25GaWVsZHMpKSB7XHJcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhmaWVsZCkuaW5jbHVkZXMoJ2ludGVybWVkaWF0ZVR5cGUnKSkge1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0VHlwZS5hZGRGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lOiBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGZpZWxkIGFzIGFwcHN5bmMuSUZpZWxkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5lc3RlZE91dHB1dFR5cGUgPSB0aGlzLmFkZE9wZXJhdGlvbk91dHB1dHMoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKG5hbWUpfSR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKGtleSl9YCwgZmllbGQgYXMgSUFwcFN5bmNPcGVyYXRpb25GaWVsZHMsIGRpcmVjdGl2ZXMpO1xyXG4gICAgICAgICAgICAgICAgb3V0cHV0VHlwZS5hZGRGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGROYW1lOiBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgZmllbGQ6IG5lc3RlZE91dHB1dFR5cGUuYXR0cmlidXRlKClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUob3V0cHV0VHlwZSk7XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dFR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gcHVibGljIGFkZE11dGF0aW9uKHsgbmFtZSwgZGF0YVNvdXJjZU5hbWUsIGFyZ3MsIHJldHVyblR5cGUsIG1ldGhvZE5hbWUgfTogSUFkZE11dGF0aW9uQXJndW1lbnRzKTogYXBwc3luYy5PYmplY3RUeXBlIHtcclxuXHJcbiAgICAvLyAgICAgLy8gVE9ETzogQWRkIHNjaGVtYSB0eXBlcy5cclxuXHJcbiAgICAvLyAgICAgLy8gQ2hlY2sgZGF0YXNvdXJjZSBleGlzdHMuXHJcbiAgICAvLyAgICAgY29uc3QgZGF0YVNvdXJjZSA9IHRoaXMuZGF0YVNvdXJjZXNbZGF0YVNvdXJjZU5hbWVdO1xyXG4gICAgLy8gICAgIGlmICghZGF0YVNvdXJjZSkgdGhyb3cgRXJyb3IoYEpvbXB4OiBkYXRhU291cmNlIFwiJHtkYXRhU291cmNlTmFtZX1cIiBub3QgZm91bmQhYCk7XHJcblxyXG4gICAgLy8gICAgIC8vIEFkZCBpbnB1dCB0eXBlICh0byBHcmFwaFFMKS5cclxuICAgIC8vICAgICBjb25zdCBpbnB1dFR5cGUgPSBuZXcgYXBwc3luYy5JbnB1dFR5cGUoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHJldHVyblR5cGUubmFtZSl9SW5wdXRgLCB7IGRlZmluaXRpb246IGFyZ3MgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW5wdXRUeXBlKTtcclxuXHJcbiAgICAvLyAgICAgLy8gQWRkIG91dHB1dCB0eXBlICh0byBHcmFwaFFMKS5cclxuICAgIC8vICAgICBjb25zdCBvdXRwdXRUeXBlID0gbmV3IE9iamVjdFR5cGUoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHJldHVyblR5cGUubmFtZSl9UGF5bG9hZGAsIHtcclxuICAgIC8vICAgICAgICAgZGVmaW5pdGlvbjogcmV0dXJuVHlwZS5kZWZpbml0aW9uLFxyXG4gICAgLy8gICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICBhcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKVxyXG4gICAgLy8gICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgLy8gICAgICAgICBdXHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUob3V0cHV0VHlwZSk7XHJcblxyXG4gICAgLy8gICAgIC8vIEFkZCBwYXlsb2FkIHR5cGUgKHRvIEdyYXBoUUwpLlxyXG4gICAgLy8gICAgIGNvbnN0IHBheWxvYWRUeXBlID0gbmV3IE9iamVjdFR5cGUoYCR7Y2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHJldHVyblR5cGUubmFtZSl9T3V0cHV0YCwge1xyXG4gICAgLy8gICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBvdXRwdXQ6IG91dHB1dFR5cGUuYXR0cmlidXRlKClcclxuICAgIC8vICAgICAgICAgfSxcclxuICAgIC8vICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgLy8gICAgICAgICAgICAgLi4uW1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGFwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy8gYXBwc3luYy5EaXJlY3RpdmUuY29nbml0bygnYWRtaW4nKVxyXG4gICAgLy8gICAgICAgICAgICAgXSxcclxuICAgIC8vICAgICAgICAgICAgIC4uLihyZXR1cm5UeXBlPy5kaXJlY3RpdmVzID8/IFtdKVxyXG4gICAgLy8gICAgICAgICBdXHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUocGF5bG9hZFR5cGUpO1xyXG5cclxuICAgIC8vICAgICAvLyBBZGQgYW55IGNoaWxkIHJldHVybiB0eXBlcyAodG8gR3JhcGhRTCkuXHJcbiAgICAvLyAgICAgLy8gVE9ETzogTWFrZSByZWN1cnNpdmUuXHJcbiAgICAvLyAgICAgT2JqZWN0LnZhbHVlcyhyZXR1cm5UeXBlLmRlZmluaXRpb24pLmZvckVhY2goZ3JhcGhxbFR5cGUgPT4ge1xyXG4gICAgLy8gICAgICAgICBpZiAoZ3JhcGhxbFR5cGUudHlwZSA9PT0gJ0lOVEVSTUVESUFURScpIHtcclxuICAgIC8vICAgICAgICAgICAgIGlmIChncmFwaHFsVHlwZT8uaW50ZXJtZWRpYXRlVHlwZSkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGdyYXBocWxUeXBlLmludGVybWVkaWF0ZVR5cGUpO1xyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfSk7XHJcblxyXG4gICAgLy8gICAgIC8vIEFkZCBtdXRhdGlvbiAodG8gR3JhcGhRTCkuXHJcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuZ3JhcGhxbEFwaS5hZGRNdXRhdGlvbihuYW1lLCBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgLy8gICAgICAgICByZXR1cm5UeXBlOiBwYXlsb2FkVHlwZS5hdHRyaWJ1dGUoKSxcclxuICAgIC8vICAgICAgICAgYXJnczogeyBpbnB1dDogaW5wdXRUeXBlLmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSkgfSxcclxuICAgIC8vICAgICAgICAgZGF0YVNvdXJjZSxcclxuICAgIC8vICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgLy8gICAgICAgICAgICAgYXBwc3luYy5EaXJlY3RpdmUuaWFtKClcclxuICAgIC8vICAgICAgICAgICAgIC8vIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgIC8vICAgICAgICAgXSxcclxuICAgIC8vICAgICAgICAgLy8gcGlwZWxpbmVDb25maWc6IFtdLCAvLyBUT0RPOiBBZGQgYXV0aG9yaXphdGlvbiBMYW1iZGEgZnVuY3Rpb24gaGVyZS5cclxuICAgIC8vICAgICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAvLyAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcIm9wZXJhdGlvblwiLCBcIiR7bWV0aG9kTmFtZX1cIikpXHJcbiAgICAvLyAgICAgICAgICAgICAke2RlZmluaXRpb25zLkRlZmF1bHRSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlfVxyXG4gICAgLy8gICAgICAgICBgKVxyXG4gICAgLy8gICAgIH0pKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlKCkge1xyXG5cclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEoJ2RpcmVjdGl2ZSBAcmVhZG9ubHkodmFsdWU6IFN0cmluZykgb24gRklFTERfREVGSU5JVElPTicpO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShDdXN0b21EaXJlY3RpdmUuZGVmaW5pdGlvbnMoKSk7XHJcblxyXG4gICAgICAgIC8vIFRPRE86IEhvdyBhcmUgd2UgZ29pbmcgdG8gYWRkIE15U3FsIGN1c3RvbSBkaXJlY3RpdmVzPyBhbmQgc2NoZW1hP1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShBcHBTeW5jTXlTcWxDdXN0b21EaXJlY3RpdmUuc2NoZW1hKCkpO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEN1c3RvbURpcmVjdGl2ZXMoKTtcclxuICAgICAgICB0aGlzLmFkZEN1c3RvbVNjaGVtYSgpO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMuZW51bVR5cGVzKS5mb3JFYWNoKGVudW1UeXBlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZW51bVR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcykuZm9yRWFjaChpbnB1dFR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnB1dFR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMuaW50ZXJmYWNlVHlwZXMpLmZvckVhY2goaW50ZXJmYWNlVHlwZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGludGVyZmFjZVR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMpLmZvckVhY2gob2JqZWN0VHlwZSA9PiB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVPYmplY3Qob2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgdHlwZSB0byBHcmFwaFFMLlxyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShvYmplY3RUeXBlKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbnNEaXJlY3RpdmUgPSBuZXcgY2RpcmVjdGl2ZS5PcGVyYXRpb25zRGlyZWN0aXZlKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBvcGVyYXRpb25zRGlyZWN0aXZlLnZhbHVlKG9iamVjdFR5cGUuZGlyZWN0aXZlcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAob3BlcmF0aW9ucz8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9ucy5pbmNsdWRlcygnZmluZCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmluZE9wZXJhdGlvbiA9IG5ldyBjb3BlcmF0aW9uLkZpbmRPcGVyYXRpb24odGhpcy5ncmFwaHFsQXBpLCB0aGlzLmRhdGFTb3VyY2VzLCB0aGlzLnNjaGVtYVR5cGVzKTtcclxuICAgICAgICAgICAgICAgICAgICBmaW5kT3BlcmF0aW9uLnNjaGVtYShvYmplY3RUeXBlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMudW5pb25UeXBlcykuZm9yRWFjaCh1bmlvblR5cGUgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZSh1bmlvblR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSXRlcmF0ZSBvYmplY3QgdHlwZSBmaWVsZHMgYW5kIHVwZGF0ZSByZXR1cm5UeXBlIG9mIEpvbXB4R3JhcGhxbFR5cGUub2JqZWN0VHlwZSBmcm9tIHN0cmluZyB0eXBlIHRvIGFjdHVhbCB0eXBlLlxyXG4gICAgICogV2h5PyBBcHBTeW5jIHJlc29sdmFibGUgZmllbGRzIHJlcXVpcmUgYSBkYXRhIHR5cGUuIEJ1dCB0aGF0IGRhdGEgdHlwZSBtYXkgbm90IGFscmVhZHkgZXhpc3QgeWV0LiBGb3IgZXhhbXBsZTpcclxuICAgICAqICAgUG9zdCBvYmplY3QgdHlwZSBoYXMgZmllbGQgY29tbWVudHMgYW5kIENvbW1lbnQgb2JqZWN0IHR5cGUgaGFzIGZpZWxkIHBvc3QuIE5vIG1hdHRlciB3aGF0IG9yZGVyIHRoZXNlIG9iamVjdCB0eXBlcyBhcmUgY3JlYXRlZCBpbiwgYW4gb2JqZWN0IHR5cGUgd29uJ3QgZXhpc3QgeWV0LlxyXG4gICAgICogICBJZiBjb21tZW50IGlzIGNyZWF0ZWQgZmlyc3QsIHRoZXJlIGlzIG5vIGNvbW1lbnQgb2JqZWN0IHR5cGUuIElmIGNvbW1lbnQgaXMgY3JlYXRlZCBmaXJzdCwgdGhlcmUgaXMgbm8gcG9zdCBvYmplY3QgdHlwZS5cclxuICAgICAqIFRvIHdvcmsgYXJvdW5kIHRoaXMgY2hpY2tlbiBvciBlZ2cgbGltaXRhdGlvbiwgSm9tcHggZGVmaW5lcyBhIGN1c3RvbSB0eXBlIHRoYXQgYWxsb3dzIGEgc3RyaW5nIHR5cGUgdG8gYmUgc3BlY2lmaWVkLiBlLmcuXHJcbiAgICAgKiAgIEpvbXB4R3JhcGhxbFR5cGUub2JqZWN0VHlwZSBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUoeyBvYmplY3RUeXBlTmFtZTogJ01Qb3N0JywgaXNMaXN0OiBmYWxzZSB9KSxcclxuICAgICAqIFRoaXMgbWV0aG9kIHVzZXMgdGhlIHN0cmluZyB0eXBlIHRvIGFkZCBhbiBhY3R1YWwgdHlwZS5cclxuICAgICAqXHJcbiAgICAgKiBDYXV0aW9uOiBDaGFuZ2VzIHRvIEFwcFN5bmMgaW1wbGVtZW50YXRpb24gZGV0YWlscyBtYXkgYnJlYWsgdGhpcyBtZXRob2QuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgcmVzb2x2ZU9iamVjdChvYmplY3RUeXBlOiBhcHBzeW5jLk9iamVjdFR5cGUpIHtcclxuXHJcbiAgICAgICAgLy8gSXRlcmF0ZSBvYmplY3QgdHlwZSBmaWVsZHMuXHJcbiAgICAgICAgT2JqZWN0LmVudHJpZXMob2JqZWN0VHlwZS5kZWZpbml0aW9uKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuICAgICAgICAgICAgLy8gSWYgZmllbGQgb2YgSm9tcHhHcmFwaHFsVHlwZSB0eXBlICh0aGVuIHVzZSBzdHJpbmcgdHlwZSB0byBhZGQgYWN0dWFsIHR5cGUpLlxyXG4gICAgICAgICAgICBpZiAodmFsdWUuZmllbGRPcHRpb25zPy5yZXR1cm5UeXBlIGluc3RhbmNlb2YgSm9tcHhHcmFwaHFsVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgXCJvbGRcIiBmaWVsZCB3aXRoIHRoZSBuZXcgXCJmaWVsZFwiLlxyXG4gICAgICAgICAgICAgICAgb2JqZWN0VHlwZS5kZWZpbml0aW9uW2tleV0gPSBBcHBTeW5jU2NoZW1hQnVpbGRlci5yZXNvbHZlUmVzb2x2YWJsZUZpZWxkKHRoaXMuc2NoZW1hVHlwZXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVzb2x2ZSBhbiBBcHBTeW5jIFJlc29sdmFibGVGaWVsZCB3aXRoIGEgSm9tcHhHcmFwaHFsVHlwZSAod2l0aCBzdHJpbmcgdHlwZSkgdG8gYSBSZXNvbHZhYmxlRmllbGQgd2l0aCBhIEdyYXBocWxUeXBlICh3aXRoIGFuIGFjdHVhbCB0eXBlKS5cclxuICAgICAqL1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9tZW1iZXItb3JkZXJpbmdcclxuICAgIHByaXZhdGUgc3RhdGljIHJlc29sdmVSZXNvbHZhYmxlRmllbGQoc2NoZW1hVHlwZXM6IElTY2hlbWFUeXBlcywgcmVzb2x2YWJsZUZpZWxkOiBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCk6IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkIHtcclxuXHJcbiAgICAgICAgbGV0IHJ2ID0gcmVzb2x2YWJsZUZpZWxkO1xyXG5cclxuICAgICAgICBpZiAocmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucz8ucmV0dXJuVHlwZSBpbnN0YW5jZW9mIEpvbXB4R3JhcGhxbFR5cGUpIHtcclxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IEdyYXBoUUwgZGF0YXR5cGUgd2l0aCBhY3R1YWwgdHlwZS5cclxuICAgICAgICAgICAgY29uc3QgbmV3R3JhcGhxbFR5cGUgPSByZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zLnJldHVyblR5cGUucmVzb2x2ZShzY2hlbWFUeXBlcyk7XHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBleGlzdGluZyByZXNvbHZhYmxlIGZpZWxkIG9wdGlvbnMgXCJvbGRcIiBHcmFwaFFMIGRhdGF0eXBlIHdpdGggXCJuZXdcIiBHcmFwaFFMIGRhdGF0eXBlLlxyXG4gICAgICAgICAgICBzZXQocmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucywgJ3JldHVyblR5cGUnLCBuZXdHcmFwaHFsVHlwZSk7XHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgcmVzb2x2YWJsZSBmaWVsZCB3aXRoIG1vZGlmaWVkIHJlc29sdmFibGUgZmllbGQgb3B0aW9ucy5cclxuICAgICAgICAgICAgcnYgPSBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQocmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvZXhwbGFpbmluZy1ncmFwaHFsLWNvbm5lY3Rpb25zL1xyXG4gICAgICovXHJcbiAgICAvLyBwcml2YXRlIGFkZEZpbmRDb25uZWN0aW9uKG9iamVjdFR5cGU6IGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG5cclxuICAgIC8vICAgICBjb25zdCBvYmplY3RUeXBlTmFtZSA9IG9iamVjdFR5cGUubmFtZTtcclxuICAgIC8vICAgICBjb25zdCBwYWdpbmF0aW9uVHlwZTogSUN1c3RvbURpcmVjdGl2ZVBhZ2luYXRpb25UeXBlID0gQ3VzdG9tRGlyZWN0aXZlLmdldElkZW50aWZpZXJBcmd1bWVudCgncGFnaW5hdGlvbicsICd0eXBlJywgb2JqZWN0VHlwZT8uZGlyZWN0aXZlcykgYXMgSUN1c3RvbURpcmVjdGl2ZVBhZ2luYXRpb25UeXBlID8/ICdvZmZzZXQnO1xyXG4gICAgLy8gICAgIGNvbnN0IGRhdGFTb3VyY2VOYW1lID0gQ3VzdG9tRGlyZWN0aXZlLmdldElkZW50aWZpZXJBcmd1bWVudCgnZGF0YXNvdXJjZScsICduYW1lJywgb2JqZWN0VHlwZT8uZGlyZWN0aXZlcyk7XHJcblxyXG4gICAgLy8gICAgIGlmIChkYXRhU291cmNlTmFtZVxyXG4gICAgLy8gICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvQ3Vyc29yXHJcbiAgICAvLyAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXRcclxuICAgIC8vICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dFxyXG4gICAgLy8gICAgICkge1xyXG4gICAgLy8gICAgICAgICBjb25zdCBkYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGF1dGhSdWxlcyA9IEN1c3RvbURpcmVjdGl2ZS5hdXRoVG9PYmplY3Qob2JqZWN0VHlwZT8uZGlyZWN0aXZlcyk7XHJcblxyXG4gICAgLy8gICAgICAgICAvLyBFZGdlLlxyXG4gICAgLy8gICAgICAgICBjb25zdCBlZGdlT2JqZWN0VHlwZSA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoYCR7b2JqZWN0VHlwZU5hbWV9RWRnZWAsIHtcclxuICAgIC8vICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAuLi4ocGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InKSAmJiB7IGN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sIC8vIElmIHBhZ2luYXRpb24gdHlwZSBjdXJzb3IgdGhlbiBpbmNsdWRlIHJlcXVpcmVkIGN1cnNvciBwcm9wZXJ0eS5cclxuICAgIC8vICAgICAgICAgICAgICAgICBub2RlOiBvYmplY3RUeXBlLmF0dHJpYnV0ZSgpXHJcbiAgICAvLyAgICAgICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIC4uLmF1dGhSdWxlcz8uZmluZChvID0+IG8ucHJvdmlkZXIgPT09IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNKSA/IFthcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKV0gOiBbXVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIC8vIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgIC8vICAgICAgICAgICAgIF1cclxuICAgIC8vICAgICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGVkZ2VPYmplY3RUeXBlKTtcclxuXHJcbiAgICAvLyAgICAgICAgIC8vIENvbm5lY3Rpb24uIEJhc2VkIG9uIHJlbGF5IHNwZWNpZmljYXRpb246IGh0dHBzOi8vcmVsYXkuZGV2L2dyYXBocWwvY29ubmVjdGlvbnMuaHRtI3NlYy1Db25uZWN0aW9uLVR5cGVzXHJcbiAgICAvLyAgICAgICAgIGNvbnN0IGNvbm5lY3Rpb25PYmplY3RUeXBlID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZShgJHtvYmplY3RUeXBlTmFtZX1Db25uZWN0aW9uYCwge1xyXG4gICAgLy8gICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGVkZ2VzOiBlZGdlT2JqZWN0VHlwZS5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSksXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgcGFnZUluZm86IHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJyA/IHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3IuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSA6IHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXQuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgIC8vICAgICAgICAgICAgICAgICB0b3RhbENvdW50OiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpIC8vIEFwb2xsbyBzdWdnZXN0cyBhZGRpbmcgYXMgYSBjb25uZWN0aW9uIHByb3BlcnR5OiBodHRwczovL2dyYXBocWwub3JnL2xlYXJuL3BhZ2luYXRpb24vXHJcbiAgICAvLyAgICAgICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIC4uLmF1dGhSdWxlcz8uZmluZChvID0+IG8ucHJvdmlkZXIgPT09IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNKSA/IFthcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKV0gOiBbXVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIC8vIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgIC8vICAgICAgICAgICAgIF1cclxuICAgIC8vICAgICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGNvbm5lY3Rpb25PYmplY3RUeXBlKTtcclxuXHJcbiAgICAvLyAgICAgICAgIC8vIEFkZCBkZWZhdWx0IHF1ZXJ5IGFyZ3VtZW50cy5cclxuICAgIC8vICAgICAgICAgY29uc3QgYXJncyA9IHt9O1xyXG5cclxuICAgIC8vICAgICAgICAgLy8gQWRkIGZpbHRlciBhcmd1bWVudC5cclxuICAgIC8vICAgICAgICAgc2V0KGFyZ3MsICdmaWx0ZXInLCBhcHBzeW5jLkdyYXBocWxUeXBlLmF3c0pzb24oKSk7XHJcblxyXG4gICAgLy8gICAgICAgICAvLyBBZGQgc29ydCBhcmd1bWVudC5cclxuICAgIC8vICAgICAgICAgc2V0KGFyZ3MsICdzb3J0JywgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dC5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSkpO1xyXG5cclxuICAgIC8vICAgICAgICAgLy8gQWRkIG9mZnNldCBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuICAgIC8vICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnb2Zmc2V0Jykge1xyXG4gICAgLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdza2lwJywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAvLyAgICAgICAgICAgICBzZXQoYXJncywgJ2xpbWl0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAvLyAgICAgICAgIH1cclxuXHJcbiAgICAvLyAgICAgICAgIC8vIEFkZCBjdXJzb3IgcGFnaW5hdGlvbiBhcmd1bWVudHMuXHJcbiAgICAvLyAgICAgICAgIGlmIChwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicpIHtcclxuICAgIC8vICAgICAgICAgICAgIHNldChhcmdzLCAnZmlyc3QnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgIC8vICAgICAgICAgICAgIHNldChhcmdzLCAnYWZ0ZXInLCBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpKTtcclxuICAgIC8vICAgICAgICAgICAgIHNldChhcmdzLCAnbGFzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdiZWZvcmUnLCBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpKTtcclxuICAgIC8vICAgICAgICAgfVxyXG5cclxuICAgIC8vICAgICAgICAgLy8gQWRkIHF1ZXJ5LlxyXG4gICAgLy8gICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkUXVlcnkoYGZpbmQke29iamVjdFR5cGVOYW1lUGx1cmFsfWAsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAvLyAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgJHtjaGFuZ2VDYXNlLmNhbWVsQ2FzZShvYmplY3RUeXBlTmFtZSl9RmluZGAsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAvLyAgICAgICAgICAgICByZXR1cm5UeXBlOiBjb25uZWN0aW9uT2JqZWN0VHlwZS5hdHRyaWJ1dGUoKSxcclxuICAgIC8vICAgICAgICAgICAgIGFyZ3MsXHJcbiAgICAvLyAgICAgICAgICAgICBkYXRhU291cmNlLFxyXG4gICAgLy8gICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIC4uLmF1dGhSdWxlcz8uZmluZChvID0+IG8ucHJvdmlkZXIgPT09IGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNKSA/IFthcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKV0gOiBbXVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIC8vIGFwcHN5bmMuRGlyZWN0aXZlLmNvZ25pdG8oJ2FkbWluJylcclxuICAgIC8vICAgICAgICAgICAgIF0sXHJcbiAgICAvLyAgICAgICAgICAgICAvLyBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgLy8gICAgICAgICAgICAgLy8gVXNlIHRoZSByZXF1ZXN0IG1hcHBpbmcgdG8gaW5qZWN0IHN0YXNoIHZhcmlhYmxlcyAoZm9yIHVzZSBpbiBMYW1iZGEgZnVuY3Rpb24pLlxyXG4gICAgLy8gICAgICAgICAgICAgcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJvcGVyYXRpb25cIiwgXCJmaW5kXCIpKVxyXG4gICAgLy8gICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib2JqZWN0VHlwZU5hbWVcIiwgXCIke29iamVjdFR5cGVOYW1lfVwiKSlcclxuICAgIC8vICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcInJldHVyblR5cGVOYW1lXCIsIFwiJHtjb25uZWN0aW9uT2JqZWN0VHlwZS5uYW1lfVwiKSlcclxuICAgIC8vICAgICAgICAgICAgICAgICAke0RlZmF1bHRSZXF1ZXN0TWFwcGluZ1RlbXBsYXRlfVxyXG4gICAgLy8gICAgICAgICAgICAgYClcclxuICAgIC8vICAgICAgICAgfSkpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZEN1c3RvbURpcmVjdGl2ZXMoKSB7XHJcblxyXG4gICAgICAgIC8vIEF1dGguXHJcbiAgICAgICAgY29uc3QgYXV0aCA9IG5ldyBjZGlyZWN0aXZlLkF1dGhEaXJlY3RpdmUoKTtcclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEoYXV0aC5kZWZpbml0aW9uKCkpO1xyXG4gICAgICAgIGF1dGguc2NoZW1hKHRoaXMuc2NoZW1hVHlwZXMpO1xyXG5cclxuICAgICAgICAvLyBDb2duaXRvLlxyXG4gICAgICAgIGNvbnN0IGNvZ25pdG8gPSBuZXcgY2RpcmVjdGl2ZS5Db2duaXRvRGlyZWN0aXZlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKGNvZ25pdG8uZGVmaW5pdGlvbigpKTtcclxuICAgICAgICBjb2duaXRvLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzKTtcclxuXHJcbiAgICAgICAgLy8gRGF0YXNvdXJjZS5cclxuICAgICAgICBjb25zdCBkYXRhc291cmNlID0gbmV3IGNkaXJlY3RpdmUuRGF0YXNvdXJjZURpcmVjdGl2ZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShkYXRhc291cmNlLmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgZGF0YXNvdXJjZS5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIExvb2t1cC5cclxuICAgICAgICBjb25zdCBsb29rdXAgPSBuZXcgY2RpcmVjdGl2ZS5Mb29rdXBEaXJlY3RpdmUoKTtcclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEobG9va3VwLmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgbG9va3VwLnNjaGVtYSh0aGlzLnNjaGVtYVR5cGVzKTtcclxuXHJcbiAgICAgICAgLy8gT3BlcmF0aW9ucy5cclxuICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gbmV3IGNkaXJlY3RpdmUuT3BlcmF0aW9uc0RpcmVjdGl2ZSgpO1xyXG4gICAgICAgIC8vIHRoaXMuZ3JhcGhxbEFwaS5hZGRUb1NjaGVtYShvcGVyYXRpb25zLmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgb3BlcmF0aW9ucy5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcblxyXG4gICAgICAgIC8vIFBhZ2luYXRpb24uXHJcbiAgICAgICAgY29uc3QgcGFnaW5hdGlvbiA9IG5ldyBjZGlyZWN0aXZlLlBhZ2luYXRpb25EaXJlY3RpdmUoKTtcclxuICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkVG9TY2hlbWEocGFnaW5hdGlvbi5kZWZpbml0aW9uKCkpO1xyXG4gICAgICAgIHBhZ2luYXRpb24uc2NoZW1hKHRoaXMuc2NoZW1hVHlwZXMpO1xyXG5cclxuICAgICAgICAvLyBSZWFkb25seS5cclxuICAgICAgICBjb25zdCByZWFkb25seSA9IG5ldyBjZGlyZWN0aXZlLlJlYWRvbmx5RGlyZWN0aXZlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKHJlYWRvbmx5LmRlZmluaXRpb24oKSk7XHJcbiAgICAgICAgcmVhZG9ubHkuc2NoZW1hKHRoaXMuc2NoZW1hVHlwZXMpO1xyXG5cclxuICAgICAgICAvLyBTb3VyY2UuXHJcbiAgICAgICAgY29uc3Qgc291cmNlID0gbmV3IGNkaXJlY3RpdmUuU291cmNlRGlyZWN0aXZlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFRvU2NoZW1hKHNvdXJjZS5kZWZpbml0aW9uKCkpO1xyXG4gICAgICAgIHNvdXJjZS5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRDdXN0b21TY2hlbWEoKSB7XHJcblxyXG4gICAgICAgIC8vIFBhZ2luYXRpb24gY3Vyc29yLlxyXG4gICAgICAgIGNvbnN0IHBhZ2luYXRpb25DdXJzb3IgPSBuZXcgY3NjaGVtYS5QYWdpbmF0aW9uQ3Vyc29yU2NoZW1hKCk7XHJcbiAgICAgICAgcGFnaW5hdGlvbkN1cnNvci5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcywgdGhpcy5hY3RpdmVBdXRob3JpemF0aW9uVHlwZXMpO1xyXG5cclxuICAgICAgICAvLyBQYWdpbmF0aW9uIG9mZnNldFxyXG4gICAgICAgIGNvbnN0IHBhZ2luYXRpb25PZmZzZXQgPSBuZXcgY3NjaGVtYS5QYWdpbmF0aW9uT2Zmc2V0U2NoZW1hKCk7XHJcbiAgICAgICAgcGFnaW5hdGlvbk9mZnNldC5zY2hlbWEodGhpcy5zY2hlbWFUeXBlcywgdGhpcy5hY3RpdmVBdXRob3JpemF0aW9uVHlwZXMpO1xyXG5cclxuICAgICAgICAvLyBTb3J0LlxyXG4gICAgICAgIC8vIFRPRE86IEpTT04gc29ydCB0byBtYXRjaCBNb25nb0RCIHNvcnQ/IEZpZWxkIGxpc3QgaW5wdXQgdHlwZSBpcyBiZXR0ZXIgYnV0IG5vdCBhIGdvb2QgZml0IGZvciB1bmxpbWl0ZWQgbmVzdGVkIGZpZWxkcy5cclxuICAgICAgICAvLyBjb25zdCBzb3J0ID0gbmV3IGNzY2hlbWEuU29ydFNjaGVtYSgpO1xyXG4gICAgICAgIC8vIHNvcnQuc2NoZW1hKHRoaXMuc2NoZW1hVHlwZXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5wdXRUeXBlIHR5cGUgZ3VhcmQuXHJcbiAgICAgKiBAcGFyYW0gbyAtIE9iamVjdCB0byB0ZXN0LlxyXG4gICAgICogQHJldHVybnMgLSB0cnVlIGlmIG9iamVjdCBpcyBvZiB0eXBlIElucHV0VHlwZSAoaS5lLiBoYXMgZGVmaW5pdGlvbiBwcm9wZXJ0eSkuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaXNJbnB1dFR5cGUobzogYW55KTogbyBpcyBhcHBzeW5jLklucHV0VHlwZSB7XHJcbiAgICAgICAgcmV0dXJuIChvIGFzIGFwcHN5bmMuSW5wdXRUeXBlKS5kZWZpbml0aW9uICE9PSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPYmplY3RUeXBlIHR5cGUgZ3VhcmQuXHJcbiAgICAgKiBAcGFyYW0gbyAtIE9iamVjdCB0byB0ZXN0LlxyXG4gICAgICogQHJldHVybnMgLSB0cnVlIGlmIG9iamVjdCBpcyBvZiB0eXBlIE9iamVjdFR5cGUgKGkuZS4gaGFzIGludGVyZmFjZVR5cGVzIHByb3BlcnR5KS5cclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBpc09iamVjdFR5cGUobzogYW55KTogbyBpcyBhcHBzeW5jLk9iamVjdFR5cGUge1xyXG4gICAgICAgIHJldHVybiAobyBhcyBhcHBzeW5jLk9iamVjdFR5cGUpLmRlZmluaXRpb24gIT09IHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBZGQgYXV0aCBkaXJlY3RpdmUgYW5kIHN1cHBvcnRpbmcgdHlwZXMuXHJcbiAgICAvLyBCYXNlZCBvbiBBbXBsaWZ5IGRlZmluaXRpb24uXHJcbiAgICAvLyBwcml2YXRlIGFkZEF1dGhTY2hlbWEoKSB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IGF1dGhTdHJhdGVneSA9IG5ldyBhcHBzeW5jLkVudW1UeXBlKCdBdXRoU3RyYXRlZ3knLCB7XHJcbiAgICAvLyAgICAgICAgIGRlZmluaXRpb246IGNkaXJlY3RpdmUuYXV0aFN0cmF0ZWd5XHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5zY2hlbWFUeXBlcy5lbnVtVHlwZXMuQXV0aFN0cmF0ZWd5ID0gYXV0aFN0cmF0ZWd5O1xyXG5cclxuICAgIC8vICAgICBjb25zdCBhdXRoUHJvdmlkZXIgPSBuZXcgYXBwc3luYy5FbnVtVHlwZSgnQXV0aFByb3ZpZGVyJywge1xyXG4gICAgLy8gICAgICAgICBkZWZpbml0aW9uOiBjZGlyZWN0aXZlLmF1dGhQcm92aWRlclxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICAgIHRoaXMuc2NoZW1hVHlwZXMuZW51bVR5cGVzLkF1dGhQcm92aWRlciA9IGF1dGhQcm92aWRlcjtcclxuXHJcbiAgICAvLyAgICAgY29uc3QgYXV0aE9wZXJhdGlvbiA9IG5ldyBhcHBzeW5jLkVudW1UeXBlKCdBdXRoT3BlcmF0aW9uJywge1xyXG4gICAgLy8gICAgICAgICBkZWZpbml0aW9uOiBjZGlyZWN0aXZlLm9wZXJhdGlvblxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICAgIHRoaXMuc2NoZW1hVHlwZXMuZW51bVR5cGVzLkF1dGhPcGVyYXRpb24gPSBhdXRoT3BlcmF0aW9uO1xyXG5cclxuICAgIC8vICAgICBjb25zdCBhdXRoUnVsZSA9IG5ldyBhcHBzeW5jLklucHV0VHlwZSgnQXV0aFJ1bGUnLCB7XHJcbiAgICAvLyAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgIC8vICAgICAgICAgICAgIGFsbG93OiBhdXRoU3RyYXRlZ3kuYXR0cmlidXRlKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSwgLy8gcHVibGljLCBwcml2YXRlLCBvd25lciwgZ3JvdXBzLlxyXG4gICAgLy8gICAgICAgICAgICAgcHJvdmlkZXI6IGF1dGhQcm92aWRlci5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLCAvLyBOb3QgcmVxdWlyZWQgaW4gQW1wbGlmeS4gU2V0IGFzIHJlcXVpcmVkIGZvciBzY2hlbWEgY2xhcml0eS5cclxuICAgIC8vICAgICAgICAgICAgIG93bmVyRmllbGQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCksIC8vIERlZmF1bHRzIHRvIG93bmVyLlxyXG4gICAgLy8gICAgICAgICAgICAgaWRlbnRpdHlDbGFpbTogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSwgLy8gRGVmYXVsdHMgdG86IHN1Yjo6dXNlcm5hbWUuXHJcbiAgICAvLyAgICAgICAgICAgICBncm91cHNGaWVsZDogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSwgLy8gRGVmYXVsdHMgdG8gZmllbGQ6IGdyb3Vwcy5cclxuICAgIC8vICAgICAgICAgICAgIGdyb3VwQ2xhaW06IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKCksIC8vIERlZmF1bHRzIHRvOiBjb2duaXRvOmdyb3VwLlxyXG4gICAgLy8gICAgICAgICAgICAgZ3JvdXBzOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzTGlzdDogdHJ1ZSB9KSwgLy8gTGlzdCBvZiBDb2duaXRvIGdyb3Vwcy5cclxuICAgIC8vICAgICAgICAgICAgIG9wZXJhdGlvbnM6IGF1dGhPcGVyYXRpb24uYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pXHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuQXV0aFJ1bGUgPSBhdXRoUnVsZTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBwYWdpbmF0aW9uIHBhZ2VJbmZvIHR5cGVzIGZvciBvZmZzZXQgYW5kIGN1cnNvciBiYXNlZCBwYWdpbmF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEN1cnNvciBwYWdpbmF0aW9uLiBQYWdlIGFuZCBzb3J0IGJ5IHVuaXF1ZSBmaWVsZC4gQ29uY2F0ZW5hdGVkIGZpZWxkcyBjYW4gcmVzdWx0IGluIHBvb3IgcGVyZm9ybWFuY2UuXHJcbiAgICAgKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtQ29ubmVjdGlvbi1UeXBlc1xyXG4gICAgICogaHR0cHM6Ly9zaG9waWZ5LmVuZ2luZWVyaW5nL3BhZ2luYXRpb24tcmVsYXRpdmUtY3Vyc29yc1xyXG4gICAgICogaHR0cHM6Ly9tZWRpdW0uY29tL3N3bGgvaG93LXRvLWltcGxlbWVudC1jdXJzb3ItcGFnaW5hdGlvbi1saWtlLWEtcHJvLTUxMzE0MGI2NWYzMlxyXG4gICAgICovXHJcbiAgICAvLyBwcml2YXRlIGFkZFBhZ2luYXRpbm9TY2hlbWEoKSB7XHJcblxyXG4gICAgLy8gICAgIC8vIE9mZnNldCBwYWdpbmF0aW9uLlxyXG4gICAgLy8gICAgIGNvbnN0IHBhZ2VJbmZvT2Zmc2V0ID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZSgnUGFnZUluZm9PZmZzZXQnLCB7XHJcbiAgICAvLyAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgIC8vICAgICAgICAgICAgIHNraXA6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgIC8vICAgICAgICAgICAgIGxpbWl0OiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuICAgIC8vICAgICAgICAgfSxcclxuICAgIC8vICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgLy8gICAgICAgICAgICAgLi4uIHRoaXMuYWN0aXZlQXV0aG9yaXphdGlvblR5cGVzLmluY2x1ZGVzKGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuSUFNKSA/IFthcHBzeW5jLkRpcmVjdGl2ZS5pYW0oKV0gOiBbXSxcclxuICAgIC8vICAgICAgICAgICAgIC4uLiB0aGlzLmFjdGl2ZUF1dGhvcml6YXRpb25UeXBlcy5pbmNsdWRlcyhhcHBzeW5jLkF1dGhvcml6YXRpb25UeXBlLlVTRVJfUE9PTCkgPyBbQ3VzdG9tRGlyZWN0aXZlLmNvZ25pdG9BbGxHcm91cHMoKV0gOiBbXSAvLyBBbGxvdyBhbGwgQ29nbml0byBhdXRoZW50aWNhdGVkIHVzZXJzLlxyXG4gICAgLy8gICAgICAgICBdXHJcbiAgICAvLyAgICAgfSk7XHJcbiAgICAvLyAgICAgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldCA9IHBhZ2VJbmZvT2Zmc2V0O1xyXG5cclxuICAgIC8vICAgICAvLyBDdXJzb3IgcGFnaW5hdGlvbi5cclxuICAgIC8vICAgICBjb25zdCBwYWdlSW5mb0N1cnNvciA9IG5ldyBhcHBzeW5jLk9iamVjdFR5cGUoJ1BhZ2VJbmZvQ3Vyc29yJywge1xyXG4gICAgLy8gICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBoYXNQcmV2aW91c1BhZ2U6IGFwcHN5bmMuR3JhcGhxbFR5cGUuYm9vbGVhbih7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAvLyAgICAgICAgICAgICBoYXNOZXh0UGFnZTogYXBwc3luYy5HcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgIC8vICAgICAgICAgICAgIHN0YXJ0Q3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAvLyAgICAgICAgICAgICBlbmRDdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KVxyXG4gICAgLy8gICAgICAgICB9LFxyXG4gICAgLy8gICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAvLyAgICAgICAgICAgICAuLi4gdGhpcy5hY3RpdmVBdXRob3JpemF0aW9uVHlwZXMuaW5jbHVkZXMoYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5JQU0pID8gW2FwcHN5bmMuRGlyZWN0aXZlLmlhbSgpXSA6IFtdLFxyXG4gICAgLy8gICAgICAgICAgICAgLi4uIHRoaXMuYWN0aXZlQXV0aG9yaXphdGlvblR5cGVzLmluY2x1ZGVzKGFwcHN5bmMuQXV0aG9yaXphdGlvblR5cGUuVVNFUl9QT09MKSA/IFthcHBzeW5jLkRpcmVjdGl2ZS5jdXN0b20oJ0Bhd3NfY29nbml0b191c2VyX3Bvb2xzJyldIDogW10gLy8gQWxsb3cgYWxsIENvZ25pdG8gYXV0aGVudGljYXRlZCB1c2Vycy5cclxuICAgIC8vICAgICAgICAgXVxyXG4gICAgLy8gICAgIH0pO1xyXG4gICAgLy8gICAgIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3IgPSBwYWdlSW5mb0N1cnNvcjtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBzb3J0IGlucHV0IHR5cGUgZm9yIG11bHRpIGNvbHVtbiBzb3J0aW5nLlxyXG4gICAgICovXHJcbiAgICAvLyBwcml2YXRlIGFkZFNvcnRTY2hlbWEoKSB7XHJcblxyXG4gICAgLy8gICAgIGNvbnN0IHNvcnRJbnB1dCA9IG5ldyBhcHBzeW5jLklucHV0VHlwZSgnU29ydElucHV0Jywge1xyXG4gICAgLy8gICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAvLyAgICAgICAgICAgICBmaWVsZE5hbWU6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgIC8vICAgICAgICAgICAgIGRpcmVjdGlvbjogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAvLyAgICAgICAgIH1cclxuICAgIC8vICAgICB9KTtcclxuICAgIC8vICAgICB0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMuU29ydElucHV0ID0gc29ydElucHV0O1xyXG4gICAgLy8gfVxyXG59XHJcbiJdfQ==