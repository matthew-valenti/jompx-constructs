import * as appsync from '@aws-cdk/aws-appsync-alpha';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as changeCase from 'change-case';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import set = require('set-value');
import * as definitions from '../app-sync-definitions';
import { IDataSource, ISchemaTypes } from '../app-sync.types';
import { AuthDirective, DatasourceDirective, PaginationDirective } from '../directives';

// export class AuthDirective extends CustomDirective {
export class FindOperation {

    // public schemaTypes: ISchemaTypes = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };

    constructor(
        public graphqlApi: appsync.GraphqlApi,
        public dataSources: IDataSource,
        public schemaTypes: ISchemaTypes
    ) { }

    public schema(objectType: appsync.ObjectType) {

        const objectTypeName = objectType.name;

        const paginationDirective = new PaginationDirective();
        const paginationType = paginationDirective.value(objectType?.directives) ?? 'offset';
        // const paginationType: ICustomDirectivePaginationType = CustomDirective.getIdentifierArgument('pagination', 'type', objectType?.directives) as ICustomDirectivePaginationType ?? 'offset';

        const datasourceDirective = new DatasourceDirective();
        const dataSourceName = datasourceDirective.value(objectType?.directives);
        // const dataSourceName = CustomDirective.getIdentifierArgument('datasource', 'name', objectType?.directives);

        const authDirective = new AuthDirective();
        const authRules = authDirective.value(objectType?.directives);
        // const authRules = CustomDirective.authToObject(objectType?.directives);

        if (!dataSourceName) throw Error(`Jompx: find operation build failed! Datasource directive is missing from object ${objectTypeName}.`);

        if (dataSourceName
            && this.schemaTypes.objectTypes.PageInfoCursor
            && this.schemaTypes.objectTypes.PageInfoOffset
        ) {
            const dataSource = this.dataSources[dataSourceName];

            // Edge.
            const edgeObjectType = new appsync.ObjectType(`${objectTypeName}Edge`, {
                definition: {
                    ...(paginationType === 'cursor') && { cursor: appsync.GraphqlType.string({ isRequired: true }) }, // If pagination type cursor then include required cursor property.
                    node: objectType.attribute()
                },
                directives: [
                    ...authRules?.find(o => o.provider === appsync.AuthorizationType.IAM) ? [appsync.Directive.iam()] : []
                    // appsync.Directive.cognito('admin')
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
                    ...authRules?.find(o => o.provider === appsync.AuthorizationType.IAM) ? [appsync.Directive.iam()] : []
                    // appsync.Directive.cognito('admin')
                ]
            });
            this.graphqlApi.addType(connectionObjectType);

            // Add default query arguments.
            const args = {};

            // Add filter argument.
            set(args, 'filter', appsync.GraphqlType.awsJson());

            // Add sort argument.
            set(args, 'sort', appsync.GraphqlType.awsJson());
            // set(args, 'sort', this.schemaTypes.inputTypes.SortInput.attribute({ isList: true }));

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
                    ...authRules?.find(o => o.provider === appsync.AuthorizationType.IAM) ? [appsync.Directive.iam()] : []
                    // appsync.Directive.cognito('admin')
                ],
                // pipelineConfig: [], // TODO: Add authorization Lambda function here.
                // Use the request mapping to inject stash variables (for use in Lambda function).
                requestMappingTemplate: appsync.MappingTemplate.fromString(`
                    $util.qr($ctx.stash.put("operation", "find"))
                    $util.qr($ctx.stash.put("objectTypeName", "${objectTypeName}"))
                    $util.qr($ctx.stash.put("returnTypeName", "${connectionObjectType.name}"))
                    ${definitions.DefaultRequestMappingTemplate}
                `)
            }));
        }
    }
}