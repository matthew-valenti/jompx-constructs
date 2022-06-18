"use strict";
// import * as appsync from '@aws-cdk/aws-appsync-alpha';
// import { ResolvableField } from '@aws-cdk/aws-appsync-alpha';
// // eslint-disable-next-line @typescript-eslint/no-require-imports
// // import pluralize = require('pluralize');
// // eslint-disable-next-line @typescript-eslint/no-require-imports
// import set = require('set-value');
// // import get = require('get-value');
// import { IDataSource, ISchemaTypes, DefaultRequestMappingTemplate } from './app-sync.types';
// import { CustomDirective, PaginationType } from './custom-directive';
// import { JompxGraphqlType } from './graphql-type';
// /**
//  * Cursor Edge Node: https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
//  * Support relay or not?
//  * https://medium.com/open-graphql/using-relay-with-aws-appsync-55c89ca02066
//  * Joins should be connections and named as such. e.g. in post TagsConnection
//  * https://relay.dev/graphql/connections.htm#sec-undefined.PageInfo
//  */
// /*
// type UserFriendsConnection {
//   pageInfo: PageInfo!
//   edges: [UserFriendsEdge]
// }type UserFriendsEdge {
//   cursor: String!
//   node: User
// }
// */
// export class AppSyncSchema {
//     constructor(
//         public graphqlApi: appsync.GraphqlApi,
//         public dataSources: IDataSource,
//         public schemaTypes: ISchemaTypes
//     ) { }
//     public create() {
//         appsync.EnumType;
//         appsync.UnionType;
//         this.addPageInfoType();
//         this.addSortInput();
//         Object.values(this.schemaTypes.enumTypes).forEach(enumType => {
//             this.graphqlApi.addType(enumType);
//         });
//         Object.values(this.schemaTypes.inputTypes).forEach(inputType => {
//             this.graphqlApi.addType(inputType);
//         });
//         Object.values(this.schemaTypes.interfaceTypes).forEach(interfaceType => {
//             this.graphqlApi.addType(interfaceType);
//         });
//         Object.values(this.schemaTypes.objectTypes).forEach(objectType => {
//             this.resolveObject(objectType);
//             // Add type to GraphQL.
//             this.graphqlApi.addType(objectType);
//             const operations = CustomDirective.getArgumentByIdentifier('operation', 'names', objectType.directives);
//             if (operations) {
//                 if (operations.includes('find')) {
//                     this.addFind(objectType);
//                 }
//             }
//         });
//         Object.values(this.schemaTypes.unionTypes).forEach(unionType => {
//             this.graphqlApi.addType(unionType);
//         });
//     }
//     /**
//      * Iterate object type fields and update returnType of JompxGraphqlType.objectType from string type to actual type.
//      * Why? AppSync resolvable fields require a data type. But that data type may not already exist yet. For example:
//      *   Post object type has field comments and Comment object type has field post. No matter what order these object types are created in, an object type won't exist yet.
//      *   If comment is created first, there is no comment object type. If comment is created first, there is no post object type.
//      * To work around this chicken or egg limitation, Jompx defines a custom type that allows a string type to be specified. e.g.
//      *   JompxGraphqlType.objectType JompxGraphqlType.objectType({ objectTypeName: 'MPost', isList: false }),
//      * This method uses the string type to add an actual type.
//      *
//      * Caution: Changes to AppSync implementation details may break this method.
//      */
//     private resolveObject(objectType: appsync.ObjectType) {
//         // Iterate object type fields.
//         Object.entries(objectType.definition).forEach(([key, value]) => {
//             // If field of JompxGraphqlType type (then use string type to add actual type).
//             if (value.fieldOptions?.returnType instanceof JompxGraphqlType) {
//                 // Replace the "old" field with the new "field".
//                 objectType.definition[key] = AppSyncSchema.resolveResolvableField(this.schemaTypes, value);
//             }
//         });
//     }
//     /**
//      * Resolve an AppSync ResolvableField with a JompxGraphqlType (with string type) to a ResolvableField with a GraphqlType (with an actual type).
//      */
//     // eslint-disable-next-line @typescript-eslint/member-ordering
//     private static resolveResolvableField(schemaTypes: ISchemaTypes, resolvableField: appsync.ResolvableField): ResolvableField {
//         let rv = resolvableField;
//         if (resolvableField.fieldOptions?.returnType instanceof JompxGraphqlType) {
//             // Create a new GraphQL datatype with actual type.
//             const newGraphqlType = resolvableField.fieldOptions.returnType.resolve(schemaTypes);
//             // Update existing resolvable field options "old" GraphQL datatype with "new" GraphQL datatype.
//             set(resolvableField.fieldOptions, 'returnType', newGraphqlType);
//             // Create new resolvable field with modified resolvable field options.
//             rv = new appsync.ResolvableField(resolvableField.fieldOptions);
//         }
//         return rv;
//     }
//     /**
//      * https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
//      */
//     private addFind(objectType: appsync.ObjectType) {
//         const objectTypeName = objectType.name;
//         const paginationType: PaginationType = CustomDirective.getArgumentByIdentifier('pagination', 'type', objectType?.directives) as PaginationType ?? 'offset';
//         const dataSourceName = CustomDirective.getArgumentByIdentifier('datasource', 'name', objectType?.directives);
//         if (dataSourceName
//             && this.schemaTypes.objectTypes.PageInfoCursor
//             && this.schemaTypes.objectTypes.PageInfoOffset
//             && this.schemaTypes.inputTypes.SortInput
//         ) {
//             const dataSource = this.dataSources[dataSourceName];
//             // Edge.
//             const edgeObjectType = new appsync.ObjectType(`${objectTypeName}Edge`, {
//                 definition: {
//                     ...(paginationType === 'cursor') && { cursor: appsync.GraphqlType.string({ isRequired: true }) }, // If pagination type cursor then include required cursor property.
//                     node: objectType.attribute()
//                 }
//             });
//             this.graphqlApi.addType(edgeObjectType);
//             // Connection. Based on relay specification: https://relay.dev/graphql/connections.htm#sec-Connection-Types
//             const connectionObjectType = new appsync.ObjectType(`${objectTypeName}Connection`, {
//                 definition: {
//                     edges: edgeObjectType.attribute({ isList: true }),
//                     pageInfo: paginationType === 'cursor' ? this.schemaTypes.objectTypes.PageInfoCursor.attribute({ isRequired: true }) : this.schemaTypes.objectTypes.PageInfoOffset.attribute({ isRequired: true }),
//                     totalCount: appsync.GraphqlType.int() // Apollo suggests adding as a connection property: https://graphql.org/learn/pagination/
//                 }
//             });
//             this.graphqlApi.addType(connectionObjectType);
//             // Add default query arguments.
//             const args = {};
//             // Add filter argument.
//             set(args, 'filter', appsync.GraphqlType.awsJson());
//             // Add sort argument.
//             set(args, 'sort', this.schemaTypes.inputTypes.SortInput.attribute({ isList: true }));
//             // Add offset pagination arguments.
//             if (paginationType === 'offset') {
//                 set(args, 'skip', appsync.GraphqlType.int());
//                 set(args, 'limit', appsync.GraphqlType.int());
//             }
//             // Add cursor pagination arguments.
//             if (paginationType === 'cursor') {
//                 set(args, 'first', appsync.GraphqlType.int());
//                 set(args, 'after', appsync.GraphqlType.string());
//                 set(args, 'last', appsync.GraphqlType.int());
//                 set(args, 'before', appsync.GraphqlType.string());
//             }
//             // Add query.
//             // this.graphqlApi.addQuery(`find${objectTypeNamePlural}`, new appsync.ResolvableField({
//             this.graphqlApi.addQuery(`${this.operationNameFromType(objectTypeName)}Find`, new appsync.ResolvableField({
//                 returnType: connectionObjectType.attribute(),
//                 args,
//                 dataSource,
//                 // pipelineConfig: [], // TODO: Add authorization Lambda function here.
//                 // Use the request mapping to inject stash variables (for use in Lambda function).
//                 requestMappingTemplate: appsync.MappingTemplate.fromString(`
//                     $util.qr($ctx.stash.put("operation", "find"))
//                     $util.qr($ctx.stash.put("objectTypeName", "${objectTypeName}"))
//                     $util.qr($ctx.stash.put("returnTypeName", "${connectionObjectType.name}"))
//                     ${DefaultRequestMappingTemplate}
//                 `)
//             }));
//         }
//     }
//     /**
//      * Create pagination pageInfo types for offset and cursor based pagination.
//      *
//      * Cursor pagination. Page and sort by unique field. Concatenated fields can result in poor performance.
//      * https://relay.dev/graphql/connections.htm#sec-Connection-Types
//      * https://shopify.engineering/pagination-relative-cursors
//      * https://medium.com/swlh/how-to-implement-cursor-pagination-like-a-pro-513140b65f32
//      */
//     private addPageInfoType() {
//         // Offset pagination.
//         const pageInfoOffset = new appsync.ObjectType('PageInfoOffset', {
//             definition: {
//                 skip: appsync.GraphqlType.int({ isRequired: true }),
//                 limit: appsync.GraphqlType.int({ isRequired: true })
//             }
//         });
//         this.schemaTypes.objectTypes.PageInfoOffset = pageInfoOffset;
//         // Cursor pagination.
//         const pageInfoCursor = new appsync.ObjectType('PageInfoCursor', {
//             definition: {
//                 hasPreviousPage: appsync.GraphqlType.boolean({ isRequired: true }),
//                 hasNextPage: appsync.GraphqlType.boolean({ isRequired: true }),
//                 startCursor: appsync.GraphqlType.string({ isRequired: true }),
//                 endCursor: appsync.GraphqlType.string({ isRequired: true })
//             }
//         });
//         this.schemaTypes.objectTypes.PageInfoCursor = pageInfoCursor;
//     }
//     /**
//      * Add sort input type for multi column sorting.
//      */
//     private addSortInput() {
//         const sortInput = new appsync.InputType('SortInput', {
//             definition: {
//                 fieldName: appsync.GraphqlType.string({ isRequired: true }),
//                 direction: appsync.GraphqlType.int({ isRequired: true })
//             }
//         });
//         this.schemaTypes.inputTypes.SortInput = sortInput;
//     }
//     // e.g. MPost > mpost, MySqlPost > mySqlPost, MyPost > myPost
//     private operationNameFromType(s: string): string {
//         return s.charAt(0).toLocaleLowerCase() + s.charAt(1).toLocaleLowerCase() + s.slice(2);
//     }
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hIG9sZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAtc3luYy9zY2hlbWEgb2xkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSx5REFBeUQ7QUFDekQsZ0VBQWdFO0FBQ2hFLG9FQUFvRTtBQUNwRSw4Q0FBOEM7QUFDOUMsb0VBQW9FO0FBQ3BFLHFDQUFxQztBQUNyQyx3Q0FBd0M7QUFDeEMsK0ZBQStGO0FBQy9GLHdFQUF3RTtBQUN4RSxxREFBcUQ7QUFFckQsTUFBTTtBQUNOLGtHQUFrRztBQUNsRywyQkFBMkI7QUFDM0IsK0VBQStFO0FBQy9FLGdGQUFnRjtBQUNoRixzRUFBc0U7QUFDdEUsTUFBTTtBQUVOLEtBQUs7QUFDTCwrQkFBK0I7QUFDL0Isd0JBQXdCO0FBQ3hCLDZCQUE2QjtBQUM3QiwwQkFBMEI7QUFDMUIsb0JBQW9CO0FBQ3BCLGVBQWU7QUFDZixJQUFJO0FBQ0osS0FBSztBQUVMLCtCQUErQjtBQUUvQixtQkFBbUI7QUFDbkIsaURBQWlEO0FBQ2pELDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsWUFBWTtBQUVaLHdCQUF3QjtBQUV4Qiw0QkFBNEI7QUFDNUIsNkJBQTZCO0FBRTdCLGtDQUFrQztBQUNsQywrQkFBK0I7QUFFL0IsMEVBQTBFO0FBQzFFLGlEQUFpRDtBQUNqRCxjQUFjO0FBRWQsNEVBQTRFO0FBQzVFLGtEQUFrRDtBQUNsRCxjQUFjO0FBRWQsb0ZBQW9GO0FBQ3BGLHNEQUFzRDtBQUN0RCxjQUFjO0FBRWQsOEVBQThFO0FBRTlFLDhDQUE4QztBQUU5QyxzQ0FBc0M7QUFDdEMsbURBQW1EO0FBRW5ELHVIQUF1SDtBQUN2SCxnQ0FBZ0M7QUFDaEMscURBQXFEO0FBQ3JELGdEQUFnRDtBQUNoRCxvQkFBb0I7QUFDcEIsZ0JBQWdCO0FBQ2hCLGNBQWM7QUFFZCw0RUFBNEU7QUFDNUUsa0RBQWtEO0FBQ2xELGNBQWM7QUFDZCxRQUFRO0FBRVIsVUFBVTtBQUNWLDBIQUEwSDtB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QUFDUixJQUFJIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbi8vIGltcG9ydCB7IFJlc29sdmFibGVGaWVsZCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuLy8gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuLy8gLy8gaW1wb3J0IHBsdXJhbGl6ZSA9IHJlcXVpcmUoJ3BsdXJhbGl6ZScpO1xyXG4vLyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG4vLyBpbXBvcnQgc2V0ID0gcmVxdWlyZSgnc2V0LXZhbHVlJyk7XHJcbi8vIC8vIGltcG9ydCBnZXQgPSByZXF1aXJlKCdnZXQtdmFsdWUnKTtcclxuLy8gaW1wb3J0IHsgSURhdGFTb3VyY2UsIElTY2hlbWFUeXBlcywgRGVmYXVsdFJlcXVlc3RNYXBwaW5nVGVtcGxhdGUgfSBmcm9tICcuL2FwcC1zeW5jLnR5cGVzJztcclxuLy8gaW1wb3J0IHsgQ3VzdG9tRGlyZWN0aXZlLCBQYWdpbmF0aW9uVHlwZSB9IGZyb20gJy4vY3VzdG9tLWRpcmVjdGl2ZSc7XHJcbi8vIGltcG9ydCB7IEpvbXB4R3JhcGhxbFR5cGUgfSBmcm9tICcuL2dyYXBocWwtdHlwZSc7XHJcblxyXG4vLyAvKipcclxuLy8gICogQ3Vyc29yIEVkZ2UgTm9kZTogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2V4cGxhaW5pbmctZ3JhcGhxbC1jb25uZWN0aW9ucy9cclxuLy8gICogU3VwcG9ydCByZWxheSBvciBub3Q/XHJcbi8vICAqIGh0dHBzOi8vbWVkaXVtLmNvbS9vcGVuLWdyYXBocWwvdXNpbmctcmVsYXktd2l0aC1hd3MtYXBwc3luYy01NWM4OWNhMDIwNjZcclxuLy8gICogSm9pbnMgc2hvdWxkIGJlIGNvbm5lY3Rpb25zIGFuZCBuYW1lZCBhcyBzdWNoLiBlLmcuIGluIHBvc3QgVGFnc0Nvbm5lY3Rpb25cclxuLy8gICogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLXVuZGVmaW5lZC5QYWdlSW5mb1xyXG4vLyAgKi9cclxuXHJcbi8vIC8qXHJcbi8vIHR5cGUgVXNlckZyaWVuZHNDb25uZWN0aW9uIHtcclxuLy8gICBwYWdlSW5mbzogUGFnZUluZm8hXHJcbi8vICAgZWRnZXM6IFtVc2VyRnJpZW5kc0VkZ2VdXHJcbi8vIH10eXBlIFVzZXJGcmllbmRzRWRnZSB7XHJcbi8vICAgY3Vyc29yOiBTdHJpbmchXHJcbi8vICAgbm9kZTogVXNlclxyXG4vLyB9XHJcbi8vICovXHJcblxyXG4vLyBleHBvcnQgY2xhc3MgQXBwU3luY1NjaGVtYSB7XHJcblxyXG4vLyAgICAgY29uc3RydWN0b3IoXHJcbi8vICAgICAgICAgcHVibGljIGdyYXBocWxBcGk6IGFwcHN5bmMuR3JhcGhxbEFwaSxcclxuLy8gICAgICAgICBwdWJsaWMgZGF0YVNvdXJjZXM6IElEYXRhU291cmNlLFxyXG4vLyAgICAgICAgIHB1YmxpYyBzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzXHJcbi8vICAgICApIHsgfVxyXG5cclxuLy8gICAgIHB1YmxpYyBjcmVhdGUoKSB7XHJcblxyXG4vLyAgICAgICAgIGFwcHN5bmMuRW51bVR5cGU7XHJcbi8vICAgICAgICAgYXBwc3luYy5VbmlvblR5cGU7XHJcblxyXG4vLyAgICAgICAgIHRoaXMuYWRkUGFnZUluZm9UeXBlKCk7XHJcbi8vICAgICAgICAgdGhpcy5hZGRTb3J0SW5wdXQoKTtcclxuXHJcbi8vICAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLmVudW1UeXBlcykuZm9yRWFjaChlbnVtVHlwZSA9PiB7XHJcbi8vICAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGVudW1UeXBlKTtcclxuLy8gICAgICAgICB9KTtcclxuXHJcbi8vICAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLmlucHV0VHlwZXMpLmZvckVhY2goaW5wdXRUeXBlID0+IHtcclxuLy8gICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoaW5wdXRUeXBlKTtcclxuLy8gICAgICAgICB9KTtcclxuXHJcbi8vICAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLmludGVyZmFjZVR5cGVzKS5mb3JFYWNoKGludGVyZmFjZVR5cGUgPT4ge1xyXG4vLyAgICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShpbnRlcmZhY2VUeXBlKTtcclxuLy8gICAgICAgICB9KTtcclxuXHJcbi8vICAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzKS5mb3JFYWNoKG9iamVjdFR5cGUgPT4ge1xyXG5cclxuLy8gICAgICAgICAgICAgdGhpcy5yZXNvbHZlT2JqZWN0KG9iamVjdFR5cGUpO1xyXG5cclxuLy8gICAgICAgICAgICAgLy8gQWRkIHR5cGUgdG8gR3JhcGhRTC5cclxuLy8gICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUob2JqZWN0VHlwZSk7XHJcblxyXG4vLyAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb25zID0gQ3VzdG9tRGlyZWN0aXZlLmdldEFyZ3VtZW50QnlJZGVudGlmaWVyKCdvcGVyYXRpb24nLCAnbmFtZXMnLCBvYmplY3RUeXBlLmRpcmVjdGl2ZXMpO1xyXG4vLyAgICAgICAgICAgICBpZiAob3BlcmF0aW9ucykge1xyXG4vLyAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbnMuaW5jbHVkZXMoJ2ZpbmQnKSkge1xyXG4vLyAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRmluZChvYmplY3RUeXBlKTtcclxuLy8gICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH0pO1xyXG5cclxuLy8gICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2NoZW1hVHlwZXMudW5pb25UeXBlcykuZm9yRWFjaCh1bmlvblR5cGUgPT4ge1xyXG4vLyAgICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZSh1bmlvblR5cGUpO1xyXG4vLyAgICAgICAgIH0pO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIC8qKlxyXG4vLyAgICAgICogSXRlcmF0ZSBvYmplY3QgdHlwZSBmaWVsZHMgYW5kIHVwZGF0ZSByZXR1cm5UeXBlIG9mIEpvbXB4R3JhcGhxbFR5cGUub2JqZWN0VHlwZSBmcm9tIHN0cmluZyB0eXBlIHRvIGFjdHVhbCB0eXBlLlxyXG4vLyAgICAgICogV2h5PyBBcHBTeW5jIHJlc29sdmFibGUgZmllbGRzIHJlcXVpcmUgYSBkYXRhIHR5cGUuIEJ1dCB0aGF0IGRhdGEgdHlwZSBtYXkgbm90IGFscmVhZHkgZXhpc3QgeWV0LiBGb3IgZXhhbXBsZTpcclxuLy8gICAgICAqICAgUG9zdCBvYmplY3QgdHlwZSBoYXMgZmllbGQgY29tbWVudHMgYW5kIENvbW1lbnQgb2JqZWN0IHR5cGUgaGFzIGZpZWxkIHBvc3QuIE5vIG1hdHRlciB3aGF0IG9yZGVyIHRoZXNlIG9iamVjdCB0eXBlcyBhcmUgY3JlYXRlZCBpbiwgYW4gb2JqZWN0IHR5cGUgd29uJ3QgZXhpc3QgeWV0LlxyXG4vLyAgICAgICogICBJZiBjb21tZW50IGlzIGNyZWF0ZWQgZmlyc3QsIHRoZXJlIGlzIG5vIGNvbW1lbnQgb2JqZWN0IHR5cGUuIElmIGNvbW1lbnQgaXMgY3JlYXRlZCBmaXJzdCwgdGhlcmUgaXMgbm8gcG9zdCBvYmplY3QgdHlwZS5cclxuLy8gICAgICAqIFRvIHdvcmsgYXJvdW5kIHRoaXMgY2hpY2tlbiBvciBlZ2cgbGltaXRhdGlvbiwgSm9tcHggZGVmaW5lcyBhIGN1c3RvbSB0eXBlIHRoYXQgYWxsb3dzIGEgc3RyaW5nIHR5cGUgdG8gYmUgc3BlY2lmaWVkLiBlLmcuXHJcbi8vICAgICAgKiAgIEpvbXB4R3JhcGhxbFR5cGUub2JqZWN0VHlwZSBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUoeyBvYmplY3RUeXBlTmFtZTogJ01Qb3N0JywgaXNMaXN0OiBmYWxzZSB9KSxcclxuLy8gICAgICAqIFRoaXMgbWV0aG9kIHVzZXMgdGhlIHN0cmluZyB0eXBlIHRvIGFkZCBhbiBhY3R1YWwgdHlwZS5cclxuLy8gICAgICAqXHJcbi8vICAgICAgKiBDYXV0aW9uOiBDaGFuZ2VzIHRvIEFwcFN5bmMgaW1wbGVtZW50YXRpb24gZGV0YWlscyBtYXkgYnJlYWsgdGhpcyBtZXRob2QuXHJcbi8vICAgICAgKi9cclxuLy8gICAgIHByaXZhdGUgcmVzb2x2ZU9iamVjdChvYmplY3RUeXBlOiBhcHBzeW5jLk9iamVjdFR5cGUpIHtcclxuXHJcbi8vICAgICAgICAgLy8gSXRlcmF0ZSBvYmplY3QgdHlwZSBmaWVsZHMuXHJcbi8vICAgICAgICAgT2JqZWN0LmVudHJpZXMob2JqZWN0VHlwZS5kZWZpbml0aW9uKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcclxuLy8gICAgICAgICAgICAgLy8gSWYgZmllbGQgb2YgSm9tcHhHcmFwaHFsVHlwZSB0eXBlICh0aGVuIHVzZSBzdHJpbmcgdHlwZSB0byBhZGQgYWN0dWFsIHR5cGUpLlxyXG4vLyAgICAgICAgICAgICBpZiAodmFsdWUuZmllbGRPcHRpb25zPy5yZXR1cm5UeXBlIGluc3RhbmNlb2YgSm9tcHhHcmFwaHFsVHlwZSkge1xyXG4vLyAgICAgICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgXCJvbGRcIiBmaWVsZCB3aXRoIHRoZSBuZXcgXCJmaWVsZFwiLlxyXG4vLyAgICAgICAgICAgICAgICAgb2JqZWN0VHlwZS5kZWZpbml0aW9uW2tleV0gPSBBcHBTeW5jU2NoZW1hLnJlc29sdmVSZXNvbHZhYmxlRmllbGQodGhpcy5zY2hlbWFUeXBlcywgdmFsdWUpO1xyXG4vLyAgICAgICAgICAgICB9XHJcbi8vICAgICAgICAgfSk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiBSZXNvbHZlIGFuIEFwcFN5bmMgUmVzb2x2YWJsZUZpZWxkIHdpdGggYSBKb21weEdyYXBocWxUeXBlICh3aXRoIHN0cmluZyB0eXBlKSB0byBhIFJlc29sdmFibGVGaWVsZCB3aXRoIGEgR3JhcGhxbFR5cGUgKHdpdGggYW4gYWN0dWFsIHR5cGUpLlxyXG4vLyAgICAgICovXHJcbi8vICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L21lbWJlci1vcmRlcmluZ1xyXG4vLyAgICAgcHJpdmF0ZSBzdGF0aWMgcmVzb2x2ZVJlc29sdmFibGVGaWVsZChzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVzLCByZXNvbHZhYmxlRmllbGQ6IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKTogUmVzb2x2YWJsZUZpZWxkIHtcclxuXHJcbi8vICAgICAgICAgbGV0IHJ2ID0gcmVzb2x2YWJsZUZpZWxkO1xyXG5cclxuLy8gICAgICAgICBpZiAocmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucz8ucmV0dXJuVHlwZSBpbnN0YW5jZW9mIEpvbXB4R3JhcGhxbFR5cGUpIHtcclxuLy8gICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IEdyYXBoUUwgZGF0YXR5cGUgd2l0aCBhY3R1YWwgdHlwZS5cclxuLy8gICAgICAgICAgICAgY29uc3QgbmV3R3JhcGhxbFR5cGUgPSByZXNvbHZhYmxlRmllbGQuZmllbGRPcHRpb25zLnJldHVyblR5cGUucmVzb2x2ZShzY2hlbWFUeXBlcyk7XHJcbi8vICAgICAgICAgICAgIC8vIFVwZGF0ZSBleGlzdGluZyByZXNvbHZhYmxlIGZpZWxkIG9wdGlvbnMgXCJvbGRcIiBHcmFwaFFMIGRhdGF0eXBlIHdpdGggXCJuZXdcIiBHcmFwaFFMIGRhdGF0eXBlLlxyXG4vLyAgICAgICAgICAgICBzZXQocmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucywgJ3JldHVyblR5cGUnLCBuZXdHcmFwaHFsVHlwZSk7XHJcbi8vICAgICAgICAgICAgIC8vIENyZWF0ZSBuZXcgcmVzb2x2YWJsZSBmaWVsZCB3aXRoIG1vZGlmaWVkIHJlc29sdmFibGUgZmllbGQgb3B0aW9ucy5cclxuLy8gICAgICAgICAgICAgcnYgPSBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQocmVzb2x2YWJsZUZpZWxkLmZpZWxkT3B0aW9ucyk7XHJcbi8vICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICByZXR1cm4gcnY7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvZXhwbGFpbmluZy1ncmFwaHFsLWNvbm5lY3Rpb25zL1xyXG4vLyAgICAgICovXHJcbi8vICAgICBwcml2YXRlIGFkZEZpbmQob2JqZWN0VHlwZTogYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcblxyXG4vLyAgICAgICAgIGNvbnN0IG9iamVjdFR5cGVOYW1lID0gb2JqZWN0VHlwZS5uYW1lO1xyXG4vLyAgICAgICAgIGNvbnN0IHBhZ2luYXRpb25UeXBlOiBQYWdpbmF0aW9uVHlwZSA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcigncGFnaW5hdGlvbicsICd0eXBlJywgb2JqZWN0VHlwZT8uZGlyZWN0aXZlcykgYXMgUGFnaW5hdGlvblR5cGUgPz8gJ29mZnNldCc7XHJcbi8vICAgICAgICAgY29uc3QgZGF0YVNvdXJjZU5hbWUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIoJ2RhdGFzb3VyY2UnLCAnbmFtZScsIG9iamVjdFR5cGU/LmRpcmVjdGl2ZXMpO1xyXG5cclxuLy8gICAgICAgICBpZiAoZGF0YVNvdXJjZU5hbWVcclxuLy8gICAgICAgICAgICAgJiYgdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvclxyXG4vLyAgICAgICAgICAgICAmJiB0aGlzLnNjaGVtYVR5cGVzLm9iamVjdFR5cGVzLlBhZ2VJbmZvT2Zmc2V0XHJcbi8vICAgICAgICAgICAgICYmIHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcy5Tb3J0SW5wdXRcclxuLy8gICAgICAgICApIHtcclxuLy8gICAgICAgICAgICAgY29uc3QgZGF0YVNvdXJjZSA9IHRoaXMuZGF0YVNvdXJjZXNbZGF0YVNvdXJjZU5hbWVdO1xyXG5cclxuLy8gICAgICAgICAgICAgLy8gRWRnZS5cclxuLy8gICAgICAgICAgICAgY29uc3QgZWRnZU9iamVjdFR5cGUgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKGAke29iamVjdFR5cGVOYW1lfUVkZ2VgLCB7XHJcbi8vICAgICAgICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgLi4uKHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJykgJiYgeyBjdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSB9LCAvLyBJZiBwYWdpbmF0aW9uIHR5cGUgY3Vyc29yIHRoZW4gaW5jbHVkZSByZXF1aXJlZCBjdXJzb3IgcHJvcGVydHkuXHJcbi8vICAgICAgICAgICAgICAgICAgICAgbm9kZTogb2JqZWN0VHlwZS5hdHRyaWJ1dGUoKVxyXG4vLyAgICAgICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgICAgICB9KTtcclxuLy8gICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZWRnZU9iamVjdFR5cGUpO1xyXG5cclxuLy8gICAgICAgICAgICAgLy8gQ29ubmVjdGlvbi4gQmFzZWQgb24gcmVsYXkgc3BlY2lmaWNhdGlvbjogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLUNvbm5lY3Rpb24tVHlwZXNcclxuLy8gICAgICAgICAgICAgY29uc3QgY29ubmVjdGlvbk9iamVjdFR5cGUgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKGAke29iamVjdFR5cGVOYW1lfUNvbm5lY3Rpb25gLCB7XHJcbi8vICAgICAgICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgZWRnZXM6IGVkZ2VPYmplY3RUeXBlLmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSxcclxuLy8gICAgICAgICAgICAgICAgICAgICBwYWdlSW5mbzogcGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InID8gdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb0N1cnNvci5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIDogdGhpcy5zY2hlbWFUeXBlcy5vYmplY3RUeXBlcy5QYWdlSW5mb09mZnNldC5hdHRyaWJ1dGUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4vLyAgICAgICAgICAgICAgICAgICAgIHRvdGFsQ291bnQ6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkgLy8gQXBvbGxvIHN1Z2dlc3RzIGFkZGluZyBhcyBhIGNvbm5lY3Rpb24gcHJvcGVydHk6IGh0dHBzOi8vZ3JhcGhxbC5vcmcvbGVhcm4vcGFnaW5hdGlvbi9cclxuLy8gICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKGNvbm5lY3Rpb25PYmplY3RUeXBlKTtcclxuXHJcbi8vICAgICAgICAgICAgIC8vIEFkZCBkZWZhdWx0IHF1ZXJ5IGFyZ3VtZW50cy5cclxuLy8gICAgICAgICAgICAgY29uc3QgYXJncyA9IHt9O1xyXG5cclxuLy8gICAgICAgICAgICAgLy8gQWRkIGZpbHRlciBhcmd1bWVudC5cclxuLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdmaWx0ZXInLCBhcHBzeW5jLkdyYXBocWxUeXBlLmF3c0pzb24oKSk7XHJcblxyXG4vLyAgICAgICAgICAgICAvLyBBZGQgc29ydCBhcmd1bWVudC5cclxuLy8gICAgICAgICAgICAgc2V0KGFyZ3MsICdzb3J0JywgdGhpcy5zY2hlbWFUeXBlcy5pbnB1dFR5cGVzLlNvcnRJbnB1dC5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSkpO1xyXG5cclxuLy8gICAgICAgICAgICAgLy8gQWRkIG9mZnNldCBwYWdpbmF0aW9uIGFyZ3VtZW50cy5cclxuLy8gICAgICAgICAgICAgaWYgKHBhZ2luYXRpb25UeXBlID09PSAnb2Zmc2V0Jykge1xyXG4vLyAgICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdza2lwJywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbi8vICAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2xpbWl0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbi8vICAgICAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgICAgIC8vIEFkZCBjdXJzb3IgcGFnaW5hdGlvbiBhcmd1bWVudHMuXHJcbi8vICAgICAgICAgICAgIGlmIChwYWdpbmF0aW9uVHlwZSA9PT0gJ2N1cnNvcicpIHtcclxuLy8gICAgICAgICAgICAgICAgIHNldChhcmdzLCAnZmlyc3QnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuLy8gICAgICAgICAgICAgICAgIHNldChhcmdzLCAnYWZ0ZXInLCBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpKTtcclxuLy8gICAgICAgICAgICAgICAgIHNldChhcmdzLCAnbGFzdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4vLyAgICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdiZWZvcmUnLCBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZygpKTtcclxuLy8gICAgICAgICAgICAgfVxyXG5cclxuLy8gICAgICAgICAgICAgLy8gQWRkIHF1ZXJ5LlxyXG4vLyAgICAgICAgICAgICAvLyB0aGlzLmdyYXBocWxBcGkuYWRkUXVlcnkoYGZpbmQke29iamVjdFR5cGVOYW1lUGx1cmFsfWAsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbi8vICAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRRdWVyeShgJHt0aGlzLm9wZXJhdGlvbk5hbWVGcm9tVHlwZShvYmplY3RUeXBlTmFtZSl9RmluZGAsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbi8vICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBjb25uZWN0aW9uT2JqZWN0VHlwZS5hdHRyaWJ1dGUoKSxcclxuLy8gICAgICAgICAgICAgICAgIGFyZ3MsXHJcbi8vICAgICAgICAgICAgICAgICBkYXRhU291cmNlLFxyXG4vLyAgICAgICAgICAgICAgICAgLy8gcGlwZWxpbmVDb25maWc6IFtdLCAvLyBUT0RPOiBBZGQgYXV0aG9yaXphdGlvbiBMYW1iZGEgZnVuY3Rpb24gaGVyZS5cclxuLy8gICAgICAgICAgICAgICAgIC8vIFVzZSB0aGUgcmVxdWVzdCBtYXBwaW5nIHRvIGluamVjdCBzdGFzaCB2YXJpYWJsZXMgKGZvciB1c2UgaW4gTGFtYmRhIGZ1bmN0aW9uKS5cclxuLy8gICAgICAgICAgICAgICAgIHJlcXVlc3RNYXBwaW5nVGVtcGxhdGU6IGFwcHN5bmMuTWFwcGluZ1RlbXBsYXRlLmZyb21TdHJpbmcoYFxyXG4vLyAgICAgICAgICAgICAgICAgICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwib3BlcmF0aW9uXCIsIFwiZmluZFwiKSlcclxuLy8gICAgICAgICAgICAgICAgICAgICAkdXRpbC5xcigkY3R4LnN0YXNoLnB1dChcIm9iamVjdFR5cGVOYW1lXCIsIFwiJHtvYmplY3RUeXBlTmFtZX1cIikpXHJcbi8vICAgICAgICAgICAgICAgICAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJyZXR1cm5UeXBlTmFtZVwiLCBcIiR7Y29ubmVjdGlvbk9iamVjdFR5cGUubmFtZX1cIikpXHJcbi8vICAgICAgICAgICAgICAgICAgICAgJHtEZWZhdWx0UmVxdWVzdE1hcHBpbmdUZW1wbGF0ZX1cclxuLy8gICAgICAgICAgICAgICAgIGApXHJcbi8vICAgICAgICAgICAgIH0pKTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLyoqXHJcbi8vICAgICAgKiBDcmVhdGUgcGFnaW5hdGlvbiBwYWdlSW5mbyB0eXBlcyBmb3Igb2Zmc2V0IGFuZCBjdXJzb3IgYmFzZWQgcGFnaW5hdGlvbi5cclxuLy8gICAgICAqXHJcbi8vICAgICAgKiBDdXJzb3IgcGFnaW5hdGlvbi4gUGFnZSBhbmQgc29ydCBieSB1bmlxdWUgZmllbGQuIENvbmNhdGVuYXRlZCBmaWVsZHMgY2FuIHJlc3VsdCBpbiBwb29yIHBlcmZvcm1hbmNlLlxyXG4vLyAgICAgICogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLUNvbm5lY3Rpb24tVHlwZXNcclxuLy8gICAgICAqIGh0dHBzOi8vc2hvcGlmeS5lbmdpbmVlcmluZy9wYWdpbmF0aW9uLXJlbGF0aXZlLWN1cnNvcnNcclxuLy8gICAgICAqIGh0dHBzOi8vbWVkaXVtLmNvbS9zd2xoL2hvdy10by1pbXBsZW1lbnQtY3Vyc29yLXBhZ2luYXRpb24tbGlrZS1hLXByby01MTMxNDBiNjVmMzJcclxuLy8gICAgICAqL1xyXG4vLyAgICAgcHJpdmF0ZSBhZGRQYWdlSW5mb1R5cGUoKSB7XHJcblxyXG4vLyAgICAgICAgIC8vIE9mZnNldCBwYWdpbmF0aW9uLlxyXG4vLyAgICAgICAgIGNvbnN0IHBhZ2VJbmZvT2Zmc2V0ID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZSgnUGFnZUluZm9PZmZzZXQnLCB7XHJcbi8vICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuLy8gICAgICAgICAgICAgICAgIHNraXA6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuLy8gICAgICAgICAgICAgICAgIGxpbWl0OiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9PZmZzZXQgPSBwYWdlSW5mb09mZnNldDtcclxuXHJcbi8vICAgICAgICAgLy8gQ3Vyc29yIHBhZ2luYXRpb24uXHJcbi8vICAgICAgICAgY29uc3QgcGFnZUluZm9DdXJzb3IgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKCdQYWdlSW5mb0N1cnNvcicsIHtcclxuLy8gICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4vLyAgICAgICAgICAgICAgICAgaGFzUHJldmlvdXNQYWdlOiBhcHBzeW5jLkdyYXBocWxUeXBlLmJvb2xlYW4oeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4vLyAgICAgICAgICAgICAgICAgaGFzTmV4dFBhZ2U6IGFwcHN5bmMuR3JhcGhxbFR5cGUuYm9vbGVhbih7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbi8vICAgICAgICAgICAgICAgICBzdGFydEN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4vLyAgICAgICAgICAgICAgICAgZW5kQ3Vyc29yOiBhcHBzeW5jLkdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgIHRoaXMuc2NoZW1hVHlwZXMub2JqZWN0VHlwZXMuUGFnZUluZm9DdXJzb3IgPSBwYWdlSW5mb0N1cnNvcjtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvKipcclxuLy8gICAgICAqIEFkZCBzb3J0IGlucHV0IHR5cGUgZm9yIG11bHRpIGNvbHVtbiBzb3J0aW5nLlxyXG4vLyAgICAgICovXHJcbi8vICAgICBwcml2YXRlIGFkZFNvcnRJbnB1dCgpIHtcclxuXHJcbi8vICAgICAgICAgY29uc3Qgc29ydElucHV0ID0gbmV3IGFwcHN5bmMuSW5wdXRUeXBlKCdTb3J0SW5wdXQnLCB7XHJcbi8vICAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuLy8gICAgICAgICAgICAgICAgIGZpZWxkTmFtZTogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4vLyAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH0pO1xyXG4vLyAgICAgICAgIHRoaXMuc2NoZW1hVHlwZXMuaW5wdXRUeXBlcy5Tb3J0SW5wdXQgPSBzb3J0SW5wdXQ7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLy8gZS5nLiBNUG9zdCA+IG1wb3N0LCBNeVNxbFBvc3QgPiBteVNxbFBvc3QsIE15UG9zdCA+IG15UG9zdFxyXG4vLyAgICAgcHJpdmF0ZSBvcGVyYXRpb25OYW1lRnJvbVR5cGUoczogc3RyaW5nKTogc3RyaW5nIHtcclxuLy8gICAgICAgICByZXR1cm4gcy5jaGFyQXQoMCkudG9Mb2NhbGVMb3dlckNhc2UoKSArIHMuY2hhckF0KDEpLnRvTG9jYWxlTG93ZXJDYXNlKCkgKyBzLnNsaWNlKDIpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbiJdfQ==