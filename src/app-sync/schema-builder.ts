import * as appsync from '@aws-cdk/aws-appsync-alpha';
import * as cdk from 'aws-cdk-lib';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import pluralize = require('pluralize');
// eslint-disable-next-line @typescript-eslint/no-require-imports
import set = require('set-value');
// import get = require('get-value');
import * as definitions from './app-sync-definitions';
import { IDataSource, ISchemaTypes, IAppSyncOperationFields } from './app-sync.types';
// import { AppSyncMySqlCustomDirective } from './datasources/mysql/mysql.directive';
import * as cdirective from './directives';
import { JompxGraphqlType } from './graphql-type';
import * as coperation from './operations';
import * as cschema from './schemas';

/**
 * GraphQL Spec: https://spec.graphql.org/. Mostly for the backend but good to know about.
 * Cursor Edge Node: https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
 * Support relay or not?
 * https://medium.com/open-graphql/using-relay-with-aws-appsync-55c89ca02066
 * Joins should be connections and named as such. e.g. in post TagsConnection
 * https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo
 * https://graphql-rules.com/rules/list-pagination
 * https://www.apollographql.com/blog/graphql/basics/designing-graphql-mutations/
 * - Mutation: Use top level input type for ags. Use top level property for output type.
 */

// TODO Make sure we can call a mutation and call a query? https://graphql-rules.com/rules/mutation-payload-query
// TODO Add schema documention markup: http://spec.graphql.org/draft/#sec-Descriptions
// Interesting typed errors: https://graphql-rules.com/rules/mutation-payload-errors

/*
type UserFriendsConnection {
  pageInfo: PageInfo!
  edges: [UserFriendsEdge]
}type UserFriendsEdge {
  cursor: String!
  node: User
}
*/

export interface IAddMutationArgs {
    /**
     * The name of the mutation as it will appear in the GraphQL schema.
     */
    name: string;
    /**
     * The mutation datasource.
     */
    dataSourceName: string;
    /**
     * Mutation input (arguments wrapped in an input property).
     */
    input: appsync.InputType | IAppSyncOperationFields;
    /**
     * Mutation output (return value).
     */
    output: appsync.ObjectType | IAppSyncOperationFields;
    /**
     * List of auth rules to apply to the mutation and output type.
     */
    auth: appsync.Directive;
    /**
     * The class method to call on request mutation.
     */
    methodName?: string;
}

export class AppSyncSchemaBuilder {

    public dataSources: IDataSource = {};
    public schemaTypes: ISchemaTypes = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };

    constructor(
        public graphqlApi: appsync.GraphqlApi,
        public activeAuthorizationTypes: appsync.AuthorizationType[]
    ) { }

    // Add datasource to AppSync in an internal array. Remove this when AppSync provides a way to iterate datasources).
    public addDataSource(id: string, lambdaFunction: cdk.aws_lambda.IFunction, options?: appsync.DataSourceOptions): appsync.LambdaDataSource {
        const identifier = `AppSyncDataSource${changeCase.pascalCase(id)}`;
        const dataSource = this.graphqlApi.addLambdaDataSource(identifier, lambdaFunction, options);
        this.dataSources = { ...this.dataSources, ...{ [id]: dataSource } };
        return dataSource;
    }

    public addSchemaTypes(schemaTypes: ISchemaTypes) {
        this.schemaTypes = { ...this.schemaTypes, ...schemaTypes };
    }

    /**
     * Add a mutation to the GraphQL schema.
     * Wrap input in input type and output in output type.
     * https://graphql-rules.com/rules/mutation-payload
     * @returns - The created AppSync mutation object type.
     */
    public addMutation({ name, dataSourceName, input, output, auth, methodName }: IAddMutationArgs): appsync.ObjectType {

        // Check datasource exists.
        const dataSource = this.dataSources[dataSourceName];
        if (!dataSource) throw Error(`Jompx addMutation: dataSource "${dataSourceName}" not found!`);

        // Add input type (to GraphQL schema). It's GraphQL best practice to wrap all input arguments in a single input type.
        let inputType: appsync.InputType;
        if (this.isInputType(input)) {
            inputType = input;
        } else {
            inputType = this.addOperationInputs(name, input);
        }

        // Add output type (to GraphQL). Output will contain the return value of the mutation (and will be wrapped in a Payload type).
        let outputType: appsync.ObjectType;
        if (this.isObjectType(output)) {
            outputType = output;
        } else {
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
    public addOperationInputs(name: string, operationFields: IAppSyncOperationFields, suffix = 'Input'): appsync.InputType {

        const inputType = new appsync.InputType(`${changeCase.pascalCase(name)}${suffix}`, { definition: {} });

        for (const [key, field] of Object.entries(operationFields)) {
            if (Object.keys(field).includes('intermediateType')) {
                inputType.addField({
                    fieldName: key,
                    field: field as appsync.IField
                });
            } else {
                const nestedInputType = this.addOperationInputs(`${changeCase.pascalCase(name)}${changeCase.pascalCase(key)}`, field as IAppSyncOperationFields);
                inputType.addField({
                    fieldName: key,
                    field: nestedInputType.attribute()
                });
            }
        };

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
    public addOperationOutputs(name: string, operationFields: IAppSyncOperationFields, directives: appsync.Directive[], suffix = 'Output'): appsync.ObjectType {

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
                    field: field as appsync.IField
                });
            } else {
                const nestedOutputType = this.addOperationOutputs(`${changeCase.pascalCase(name)}${changeCase.pascalCase(key)}`, field as IAppSyncOperationFields, directives);
                outputType.addField({
                    fieldName: key,
                    field: nestedOutputType.attribute()
                });
            }
        };

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

    public create() {

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

            if (operations?.length) {
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
    private resolveObject(objectType: appsync.ObjectType) {

        // Iterate object type fields.
        Object.entries(objectType.definition).forEach(([key, value]) => {
            // If field of JompxGraphqlType type (then use string type to add actual type).
            if (value.fieldOptions?.returnType instanceof JompxGraphqlType) {
                // Replace the "old" field with the new "field".
                objectType.definition[key] = AppSyncSchemaBuilder.resolveResolvableField(this.schemaTypes, value);
            }
        });
    }

    /**
     * Resolve an AppSync ResolvableField with a JompxGraphqlType (with string type) to a ResolvableField with a GraphqlType (with an actual type).
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    private static resolveResolvableField(schemaTypes: ISchemaTypes, resolvableField: appsync.ResolvableField): appsync.ResolvableField {

        let rv = resolvableField;

        if (resolvableField.fieldOptions?.returnType instanceof JompxGraphqlType) {
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

    private addCustomDirectives() {

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

    private addCustomSchema() {

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
    private isInputType(o: any): o is appsync.InputType {
        return (o as appsync.InputType).definition !== undefined;
    }

    /**
     * ObjectType type guard.
     * @param o - Object to test.
     * @returns - true if object is of type ObjectType (i.e. has interfaceTypes property).
     */
    private isObjectType(o: any): o is appsync.ObjectType {
        return (o as appsync.ObjectType).definition !== undefined;
    }

    // Add auth directive and supporting types.
    // Based on Amplify definition.
    // private addAuthSchema() {

    //     const authStrategy = new appsync.EnumType('AuthStrategy', {
    //         definition: cdirective.authStrategy
    //     });
    //     this.schemaTypes.enumTypes.AuthStrategy = authStrategy;

    //     const authProvider = new appsync.EnumType('AuthProvider', {
    //         definition: cdirective.authProvider
    //     });
    //     this.schemaTypes.enumTypes.AuthProvider = authProvider;

    //     const authOperation = new appsync.EnumType('AuthOperation', {
    //         definition: cdirective.operation
    //     });
    //     this.schemaTypes.enumTypes.AuthOperation = authOperation;

    //     const authRule = new appsync.InputType('AuthRule', {
    //         definition: {
    //             allow: authStrategy.attribute({ isRequired: true }), // public, private, owner, groups.
    //             provider: authProvider.attribute({ isRequired: true }), // Not required in Amplify. Set as required for schema clarity.
    //             ownerField: appsync.GraphqlType.string(), // Defaults to owner.
    //             identityClaim: appsync.GraphqlType.string(), // Defaults to: sub::username.
    //             groupsField: appsync.GraphqlType.string(), // Defaults to field: groups.
    //             groupClaim: appsync.GraphqlType.string(), // Defaults to: cognito:group.
    //             groups: appsync.GraphqlType.string({ isList: true }), // List of Cognito groups.
    //             operations: authOperation.attribute({ isList: true })
    //         }
    //     });
    //     this.schemaTypes.inputTypes.AuthRule = authRule;
    // }

    /**
     * Create pagination pageInfo types for offset and cursor based pagination.
     *
     * Cursor pagination. Page and sort by unique field. Concatenated fields can result in poor performance.
     * https://relay.dev/graphql/connections.htm#sec-Connection-Types
     * https://shopify.engineering/pagination-relative-cursors
     * https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
     */
    // private addPaginatinoSchema() {

    //     // Offset pagination.
    //     const pageInfoOffset = new appsync.ObjectType('PageInfoOffset', {
    //         definition: {
    //             skip: appsync.GraphqlType.int({ isRequired: true }),
    //             limit: appsync.GraphqlType.int({ isRequired: true })
    //         },
    //         directives: [
    //             ... this.activeAuthorizationTypes.includes(appsync.AuthorizationType.IAM) ? [appsync.Directive.iam()] : [],
    //             ... this.activeAuthorizationTypes.includes(appsync.AuthorizationType.USER_POOL) ? [CustomDirective.cognitoAllGroups()] : [] // Allow all Cognito authenticated users.
    //         ]
    //     });
    //     this.schemaTypes.objectTypes.PageInfoOffset = pageInfoOffset;

    //     // Cursor pagination.
    //     const pageInfoCursor = new appsync.ObjectType('PageInfoCursor', {
    //         definition: {
    //             hasPreviousPage: appsync.GraphqlType.boolean({ isRequired: true }),
    //             hasNextPage: appsync.GraphqlType.boolean({ isRequired: true }),
    //             startCursor: appsync.GraphqlType.string({ isRequired: true }),
    //             endCursor: appsync.GraphqlType.string({ isRequired: true })
    //         },
    //         directives: [
    //             ... this.activeAuthorizationTypes.includes(appsync.AuthorizationType.IAM) ? [appsync.Directive.iam()] : [],
    //             ... this.activeAuthorizationTypes.includes(appsync.AuthorizationType.USER_POOL) ? [appsync.Directive.custom('@aws_cognito_user_pools')] : [] // Allow all Cognito authenticated users.
    //         ]
    //     });
    //     this.schemaTypes.objectTypes.PageInfoCursor = pageInfoCursor;
    // }

    /**
     * Add sort input type for multi column sorting.
     */
    // private addSortSchema() {

    //     const sortInput = new appsync.InputType('SortInput', {
    //         definition: {
    //             fieldName: appsync.GraphqlType.string({ isRequired: true }),
    //             direction: appsync.GraphqlType.int({ isRequired: true })
    //         }
    //     });
    //     this.schemaTypes.inputTypes.SortInput = sortInput;
    // }
}
