import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { ResolvableField } from '@aws-cdk/aws-appsync-alpha';
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import pluralize = require('pluralize');
// eslint-disable-next-line @typescript-eslint/no-require-imports
import set = require('set-value');
// import get = require('get-value');
import { IDataSource, ISchemaTypes, DefaultRequestMappingTemplate } from './app-sync.types';
import { CustomDirective, PaginationType } from './custom-directive';
import { JompxGraphqlType } from './graphql-type';

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

export class AppSyncSchema {

    constructor(
        public graphqlApi: appsync.GraphqlApi,
        public dataSources: IDataSource,
        public schemaTypes: ISchemaTypes
    ) { }

    public create() {

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

            const operations = CustomDirective.getArgumentByIdentifier('operation', 'names', objectType.directives);
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
    private resolveObject(objectType: appsync.ObjectType) {

        // Iterate object type fields.
        Object.entries(objectType.definition).forEach(([key, value]) => {
            // If field of JompxGraphqlType type (then use string type to add actual type).
            if (value.fieldOptions?.returnType instanceof JompxGraphqlType) {
                // Replace the "old" field with the new "field".
                objectType.definition[key] = AppSyncSchema.resolveResolvableField(this.schemaTypes, value);
            }
        });
    }

    /**
     * Resolve an AppSync ResolvableField with a JompxGraphqlType (with string type) to a ResolvableField with a GraphqlType (with an actual type).
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    private static resolveResolvableField(schemaTypes: ISchemaTypes, resolvableField: appsync.ResolvableField): ResolvableField {

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
    private addFind(objectType: appsync.ObjectType) {

        const objectTypeName = objectType.name;
        const paginationType: PaginationType = CustomDirective.getArgumentByIdentifier('pagination', 'type', objectType?.directives) as PaginationType ?? 'offset';
        const dataSourceName = CustomDirective.getArgumentByIdentifier('datasource', 'name', objectType?.directives);

        if (dataSourceName
            && this.schemaTypes.objectTypes.PageInfoCursor
            && this.schemaTypes.objectTypes.PageInfoOffset
            && this.schemaTypes.inputTypes.SortInput
        ) {
            const dataSource = this.dataSources[dataSourceName];

            // Edge.
            const edgeObjectType = new appsync.ObjectType(`${objectTypeName}Edge`, {
                definition: {
                    ...(paginationType === 'cursor') && { cursor: appsync.GraphqlType.string({ isRequired: true }) }, // If pagination type cursor then include required cursor property.
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
                    ${DefaultRequestMappingTemplate}
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
    private addPageInfoType() {

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
    private addSortInput() {

        const sortInput = new appsync.InputType('SortInput', {
            definition: {
                fieldName: appsync.GraphqlType.string({ isRequired: true }),
                direction: appsync.GraphqlType.int({ isRequired: true })
            }
        });
        this.schemaTypes.inputTypes.SortInput = sortInput;
    }

    // e.g. MPost > mpost, MySqlPost > mySqlPost, MyPost > myPost
    private operationNameFromType(s: string): string {
        return s.charAt(0).toLocaleLowerCase() + s.charAt(1).toLocaleLowerCase() + s.slice(2);
    }
}
