"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncSchema = void 0;
const appsync = require("@aws-cdk/aws-appsync-alpha");
// eslint-disable-next-line @typescript-eslint/no-require-imports
// import pluralize = require('pluralize');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const set = require("set-value");
const directive_1 = require("./directive");
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
class AppSyncSchema {
    // AppSync VTL snippet to pass all available params to Lambda function datasource.
    // private static readonly pipelineRequestMappingTemplate = `{
    //         "version" : "2017-02-28",
    //         "operation": "Invoke",
    //         "payload": {
    //             "context": $util.toJson($ctx),
    //             "selectionSetList": $utils.toJson($ctx.info.selectionSetList),
    //             "selectionSetGraphQL": $utils.toJson($ctx.info.selectionSetGraphQL)
    //         }
    //     }`;
    constructor(graphqlApi, dataSources, schemaTypes) {
        this.graphqlApi = graphqlApi;
        this.dataSources = dataSources;
        this.schemaTypes = schemaTypes;
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
        this.schemaTypes.PageInfoOffset = pageInfoOffset;
        this.graphqlApi.addType(pageInfoOffset);
        // Cursor pagination.
        const pageInfoCursor = new appsync.ObjectType('PageInfoCursor', {
            definition: {
                hasPreviousPage: appsync.GraphqlType.boolean({ isRequired: true }),
                hasNextPage: appsync.GraphqlType.boolean({ isRequired: true }),
                startCursor: appsync.GraphqlType.string({ isRequired: true }),
                endCursor: appsync.GraphqlType.string({ isRequired: true })
            }
        });
        this.schemaTypes.PageInfoCursor = pageInfoCursor;
        this.graphqlApi.addType(pageInfoCursor);
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
        this.schemaTypes.SortInput = sortInput;
        this.graphqlApi.addType(sortInput);
    }
    create() {
        this.addPageInfoType();
        this.addSortInput();
        Object.values(this.schemaTypes).forEach(schemaType => {
            if (schemaType instanceof appsync.ObjectType) {
                const operations = directive_1.CustomDirective.getArgumentByIdentifier(schemaType.directives, 'operation', 'names');
                if (operations) {
                    if (operations.includes('find')) {
                        this.addFind(schemaType);
                        // Object.values(schemaType)[0]
                    }
                }
            }
        });
    }
    /**
     *
     * https://www.apollographql.com/blog/graphql/explaining-graphql-connections/
     */
    addFind(objectType) {
        var _a;
        const objectTypeName = objectType.name;
        // const objectTypeNamePlural = pluralize(objectTypeName);
        const paginationType = (_a = directive_1.CustomDirective.getArgumentByIdentifier(objectType === null || objectType === void 0 ? void 0 : objectType.directives, 'pagination', 'type')) !== null && _a !== void 0 ? _a : 'offset';
        const dataSourceName = directive_1.CustomDirective.getArgumentByIdentifier(objectType === null || objectType === void 0 ? void 0 : objectType.directives, 'datasource', 'name');
        if (dataSourceName) {
            const dataSource = this.dataSources[dataSourceName];
            // Object.
            this.graphqlApi.addType(objectType);
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
                    pageInfo: paginationType === 'cursor' ? this.schemaTypes.PageInfoCursor.attribute() : this.schemaTypes.PageInfoOffset.attribute(),
                    totalCount: appsync.GraphqlType.int() // Apollo suggests adding as a connection property: https://graphql.org/learn/pagination/
                }
            });
            this.graphqlApi.addType(connectionObjectType);
            // Add query arguments.
            const args = {};
            set(args, 'filter', appsync.GraphqlType.awsJson());
            set(args, 'sort', this.schemaTypes.SortInput.attribute({ isList: true }));
            // Add offset pagination arguments.
            if (paginationType === 'offset') {
                set(args, 'skip', appsync.GraphqlType.int());
                set(args, 'limit', appsync.GraphqlType.int());
            }
            // Add offset pagination arguments.
            if (paginationType === 'cursor') {
                set(args, 'first', appsync.GraphqlType.int());
                set(args, 'after', appsync.GraphqlType.string());
                set(args, 'last', appsync.GraphqlType.int());
                set(args, 'before', appsync.GraphqlType.string());
            }
            // Add query.
            // this.graphqlApi.addQuery(`find${objectTypeNamePlural}`, new appsync.ResolvableField({
            this.graphqlApi.addQuery(`${objectTypeName}Find`, new appsync.ResolvableField({
                returnType: connectionObjectType.attribute(),
                args,
                dataSource,
                pipelineConfig: [] // TODO: Add authorization Lambda function here.
                // Use the request mapping to inject stash variables (for use in Lambda function).
                // In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
                // Caution: payload should mimic Lambda resolver (no VTL). This syntax could change in the future.
                // requestMappingTemplate: appsync.MappingTemplate.fromString(`
                //     $util.qr($ctx.stash.put("method", "get"))
                //     $util.qr($ctx.stash.put("typeName", "${objectTypeName}"))
                //     $util.qr($ctx.stash.put("returnTypeName", "${connectionObjectType.name}"))
                //     ${AppSyncSchema.pipelineRequestMappingTemplate}
                // `)
            }));
        }
    }
}
exports.AppSyncSchema = AppSyncSchema;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsYXNzZXMvYXBwLXN5bmMvc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFzRDtBQUN0RCxpRUFBaUU7QUFDakUsMkNBQTJDO0FBQzNDLGlFQUFpRTtBQUNqRSxpQ0FBa0M7QUFHbEMsMkNBQThEO0FBRTlEOzs7Ozs7R0FNRztBQUVIOzs7Ozs7OztFQVFFO0FBRUYsTUFBYSxhQUFhO0lBRXRCLGtGQUFrRjtJQUNsRiw4REFBOEQ7SUFDOUQsb0NBQW9DO0lBQ3BDLGlDQUFpQztJQUNqQyx1QkFBdUI7SUFDdkIsNkNBQTZDO0lBQzdDLDZFQUE2RTtJQUM3RSxrRkFBa0Y7SUFDbEYsWUFBWTtJQUNaLFVBQVU7SUFFVixZQUNXLFVBQThCLEVBQzlCLFdBQXdCLEVBQ3hCLFdBQXdCO1FBRnhCLGVBQVUsR0FBVixVQUFVLENBQW9CO1FBQzlCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQy9CLENBQUM7SUFFTDs7Ozs7OztPQU9HO0lBQ0ssZUFBZTtRQUVuQixxQkFBcUI7UUFDckIsTUFBTSxjQUFjLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLGdCQUFnQixFQUFFO1lBQzVELFVBQVUsRUFBRTtnQkFDUixJQUFJLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ25ELEtBQUssRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUN2RDtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztRQUNqRCxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV4Qyxx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QUNsRywrREFBK0Q7Z0JBQy9ELGdEQUFnRDtnQkFDaEQsZ0VBQWdFO2dCQUNoRSxpRkFBaUY7Z0JBQ2pGLHNEQUFzRDtnQkFDdEQsS0FBSzthQUNSLENBQUMsQ0FBQyxDQUFDO1NBQ1A7SUFDTCxDQUFDO0NBQ0o7QUE3SkQsc0NBNkpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXBwc3luYyBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbi8vIGltcG9ydCBwbHVyYWxpemUgPSByZXF1aXJlKCdwbHVyYWxpemUnKTtcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuaW1wb3J0IHNldCA9IHJlcXVpcmUoJ3NldC12YWx1ZScpO1xyXG4vLyBpbXBvcnQgZ2V0ID0gcmVxdWlyZSgnZ2V0LXZhbHVlJyk7XHJcbmltcG9ydCB7IElEYXRhU291cmNlLCBJU2NoZW1hVHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzL2FwcC1zeW5jJztcclxuaW1wb3J0IHsgQ3VzdG9tRGlyZWN0aXZlLCBQYWdpbmF0aW9uVHlwZSB9IGZyb20gJy4vZGlyZWN0aXZlJztcclxuXHJcbi8qKlxyXG4gKiBDdXJzb3IgRWRnZSBOb2RlOiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9ibG9nL2dyYXBocWwvZXhwbGFpbmluZy1ncmFwaHFsLWNvbm5lY3Rpb25zL1xyXG4gKiBTdXBwb3J0IHJlbGF5IG9yIG5vdD9cclxuICogaHR0cHM6Ly9tZWRpdW0uY29tL29wZW4tZ3JhcGhxbC91c2luZy1yZWxheS13aXRoLWF3cy1hcHBzeW5jLTU1Yzg5Y2EwMjA2NlxyXG4gKiBKb2lucyBzaG91bGQgYmUgY29ubmVjdGlvbnMgYW5kIG5hbWVkIGFzIHN1Y2guIGUuZy4gaW4gcG9zdCBUYWdzQ29ubmVjdGlvblxyXG4gKiBodHRwczovL3JlbGF5LmRldi9ncmFwaHFsL2Nvbm5lY3Rpb25zLmh0bSNzZWMtdW5kZWZpbmVkLlBhZ2VJbmZvXHJcbiAqL1xyXG5cclxuLypcclxudHlwZSBVc2VyRnJpZW5kc0Nvbm5lY3Rpb24ge1xyXG4gIHBhZ2VJbmZvOiBQYWdlSW5mbyFcclxuICBlZGdlczogW1VzZXJGcmllbmRzRWRnZV1cclxufXR5cGUgVXNlckZyaWVuZHNFZGdlIHtcclxuICBjdXJzb3I6IFN0cmluZyFcclxuICBub2RlOiBVc2VyXHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jU2NoZW1hIHtcclxuXHJcbiAgICAvLyBBcHBTeW5jIFZUTCBzbmlwcGV0IHRvIHBhc3MgYWxsIGF2YWlsYWJsZSBwYXJhbXMgdG8gTGFtYmRhIGZ1bmN0aW9uIGRhdGFzb3VyY2UuXHJcbiAgICAvLyBwcml2YXRlIHN0YXRpYyByZWFkb25seSBwaXBlbGluZVJlcXVlc3RNYXBwaW5nVGVtcGxhdGUgPSBge1xyXG4gICAgLy8gICAgICAgICBcInZlcnNpb25cIiA6IFwiMjAxNy0wMi0yOFwiLFxyXG4gICAgLy8gICAgICAgICBcIm9wZXJhdGlvblwiOiBcIkludm9rZVwiLFxyXG4gICAgLy8gICAgICAgICBcInBheWxvYWRcIjoge1xyXG4gICAgLy8gICAgICAgICAgICAgXCJjb250ZXh0XCI6ICR1dGlsLnRvSnNvbigkY3R4KSxcclxuICAgIC8vICAgICAgICAgICAgIFwic2VsZWN0aW9uU2V0TGlzdFwiOiAkdXRpbHMudG9Kc29uKCRjdHguaW5mby5zZWxlY3Rpb25TZXRMaXN0KSxcclxuICAgIC8vICAgICAgICAgICAgIFwic2VsZWN0aW9uU2V0R3JhcGhRTFwiOiAkdXRpbHMudG9Kc29uKCRjdHguaW5mby5zZWxlY3Rpb25TZXRHcmFwaFFMKVxyXG4gICAgLy8gICAgICAgICB9XHJcbiAgICAvLyAgICAgfWA7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIGdyYXBocWxBcGk6IGFwcHN5bmMuR3JhcGhxbEFwaSxcclxuICAgICAgICBwdWJsaWMgZGF0YVNvdXJjZXM6IElEYXRhU291cmNlLFxyXG4gICAgICAgIHB1YmxpYyBzY2hlbWFUeXBlczogSVNjaGVtYVR5cGVcclxuICAgICkgeyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgcGFnaW5hdGlvbiBwYWdlSW5mbyB0eXBlcyBmb3Igb2Zmc2V0IGFuZCBjdXJzb3IgYmFzZWQgcGFnaW5hdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBDdXJzb3IgcGFnaW5hdGlvbi4gUGFnZSBhbmQgc29ydCBieSB1bmlxdWUgZmllbGQuIENvbmNhdGVuYXRlZCBmaWVsZHMgY2FuIHJlc3VsdCBpbiBwb29yIHBlcmZvcm1hbmNlLlxyXG4gICAgICogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLUNvbm5lY3Rpb24tVHlwZXNcclxuICAgICAqIGh0dHBzOi8vc2hvcGlmeS5lbmdpbmVlcmluZy9wYWdpbmF0aW9uLXJlbGF0aXZlLWN1cnNvcnNcclxuICAgICAqIGh0dHBzOi8vbWVkaXVtLmNvbS9zd2xoL2hvdy10by1pbXBsZW1lbnQtY3Vyc29yLXBhZ2luYXRpb24tbGlrZS1hLXByby01MTMxNDBiNjVmMzJcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhZGRQYWdlSW5mb1R5cGUoKSB7XHJcblxyXG4gICAgICAgIC8vIE9mZnNldCBwYWdpbmF0aW9uLlxyXG4gICAgICAgIGNvbnN0IHBhZ2VJbmZvT2Zmc2V0ID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZSgnUGFnZUluZm9PZmZzZXQnLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIHNraXA6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiBhcHBzeW5jLkdyYXBocWxUeXBlLmludCh7IGlzUmVxdWlyZWQ6IHRydWUgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2NoZW1hVHlwZXMuUGFnZUluZm9PZmZzZXQgPSBwYWdlSW5mb09mZnNldDtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShwYWdlSW5mb09mZnNldCk7XHJcblxyXG4gICAgICAgIC8vIEN1cnNvciBwYWdpbmF0aW9uLlxyXG4gICAgICAgIGNvbnN0IHBhZ2VJbmZvQ3Vyc29yID0gbmV3IGFwcHN5bmMuT2JqZWN0VHlwZSgnUGFnZUluZm9DdXJzb3InLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIGhhc1ByZXZpb3VzUGFnZTogYXBwc3luYy5HcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGhhc05leHRQYWdlOiBhcHBzeW5jLkdyYXBocWxUeXBlLmJvb2xlYW4oeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRDdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGVuZEN1cnNvcjogYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLlBhZ2VJbmZvQ3Vyc29yID0gcGFnZUluZm9DdXJzb3I7XHJcbiAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUocGFnZUluZm9DdXJzb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHNvcnQgaW5wdXQgdHlwZSBmb3IgbXVsdGkgY29sdW1uIHNvcnRpbmcuXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgYWRkU29ydElucHV0KCkge1xyXG4gICAgICAgIGNvbnN0IHNvcnRJbnB1dCA9IG5ldyBhcHBzeW5jLklucHV0VHlwZSgnU29ydElucHV0Jywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWU6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNjaGVtYVR5cGVzLlNvcnRJbnB1dCA9IHNvcnRJbnB1dDtcclxuICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkVHlwZShzb3J0SW5wdXQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGUoKSB7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkUGFnZUluZm9UeXBlKCk7XHJcbiAgICAgICAgdGhpcy5hZGRTb3J0SW5wdXQoKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNjaGVtYVR5cGVzKS5mb3JFYWNoKHNjaGVtYVR5cGUgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc2NoZW1hVHlwZSBpbnN0YW5jZW9mIGFwcHN5bmMuT2JqZWN0VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9ucyA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcihzY2hlbWFUeXBlLmRpcmVjdGl2ZXMsICdvcGVyYXRpb24nLCAnbmFtZXMnKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbnMuaW5jbHVkZXMoJ2ZpbmQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEZpbmQoc2NoZW1hVHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9iamVjdC52YWx1ZXMoc2NoZW1hVHlwZSlbMF1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxyXG4gICAgICogaHR0cHM6Ly93d3cuYXBvbGxvZ3JhcGhxbC5jb20vYmxvZy9ncmFwaHFsL2V4cGxhaW5pbmctZ3JhcGhxbC1jb25uZWN0aW9ucy9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEZpbmQob2JqZWN0VHlwZTogYXBwc3luYy5PYmplY3RUeXBlKSB7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0VHlwZU5hbWUgPSBvYmplY3RUeXBlLm5hbWU7XHJcbiAgICAgICAgLy8gY29uc3Qgb2JqZWN0VHlwZU5hbWVQbHVyYWwgPSBwbHVyYWxpemUob2JqZWN0VHlwZU5hbWUpO1xyXG4gICAgICAgIGNvbnN0IHBhZ2luYXRpb25UeXBlOiBQYWdpbmF0aW9uVHlwZSA9IEN1c3RvbURpcmVjdGl2ZS5nZXRBcmd1bWVudEJ5SWRlbnRpZmllcihvYmplY3RUeXBlPy5kaXJlY3RpdmVzLCAncGFnaW5hdGlvbicsICd0eXBlJykgYXMgUGFnaW5hdGlvblR5cGUgPz8gJ29mZnNldCc7XHJcbiAgICAgICAgY29uc3QgZGF0YVNvdXJjZU5hbWUgPSBDdXN0b21EaXJlY3RpdmUuZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIob2JqZWN0VHlwZT8uZGlyZWN0aXZlcywgJ2RhdGFzb3VyY2UnLCAnbmFtZScpO1xyXG5cclxuICAgICAgICBpZiAoZGF0YVNvdXJjZU5hbWUpIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0YVNvdXJjZTogYXBwc3luYy5MYW1iZGFEYXRhU291cmNlID0gdGhpcy5kYXRhU291cmNlc1tkYXRhU291cmNlTmFtZV07XHJcblxyXG4gICAgICAgICAgICAvLyBPYmplY3QuXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGhxbEFwaS5hZGRUeXBlKG9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gRWRnZS5cclxuICAgICAgICAgICAgY29uc3QgZWRnZU9iamVjdFR5cGUgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKGAke29iamVjdFR5cGVOYW1lfUVkZ2VgLCB7XHJcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLi4uKHBhZ2luYXRpb25UeXBlID09PSAnY3Vyc29yJykgJiYgeyBjdXJzb3I6IGFwcHN5bmMuR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSB9LCAvLyBJZiBwYWdpbmF0aW9uIHR5cGUgY3Vyc29yIHRoZW4gaW5jbHVkZSByZXF1aXJlZCBjdXJzb3IgcHJvcGVydHkuXHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZTogb2JqZWN0VHlwZS5hdHRyaWJ1dGUoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoZWRnZU9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ29ubmVjdGlvbi4gQmFzZWQgb24gcmVsYXkgc3BlY2lmaWNhdGlvbjogaHR0cHM6Ly9yZWxheS5kZXYvZ3JhcGhxbC9jb25uZWN0aW9ucy5odG0jc2VjLUNvbm5lY3Rpb24tVHlwZXNcclxuICAgICAgICAgICAgY29uc3QgY29ubmVjdGlvbk9iamVjdFR5cGUgPSBuZXcgYXBwc3luYy5PYmplY3RUeXBlKGAke29iamVjdFR5cGVOYW1lfUNvbm5lY3Rpb25gLCB7XHJcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWRnZXM6IGVkZ2VPYmplY3RUeXBlLmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBwYWdlSW5mbzogcGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InID8gdGhpcy5zY2hlbWFUeXBlcy5QYWdlSW5mb0N1cnNvci5hdHRyaWJ1dGUoKSA6IHRoaXMuc2NoZW1hVHlwZXMuUGFnZUluZm9PZmZzZXQuYXR0cmlidXRlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxDb3VudDogYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSAvLyBBcG9sbG8gc3VnZ2VzdHMgYWRkaW5nIGFzIGEgY29ubmVjdGlvbiBwcm9wZXJ0eTogaHR0cHM6Ly9ncmFwaHFsLm9yZy9sZWFybi9wYWdpbmF0aW9uL1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaHFsQXBpLmFkZFR5cGUoY29ubmVjdGlvbk9iamVjdFR5cGUpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRkIHF1ZXJ5IGFyZ3VtZW50cy5cclxuICAgICAgICAgICAgY29uc3QgYXJncyA9IHt9O1xyXG4gICAgICAgICAgICBzZXQoYXJncywgJ2ZpbHRlcicsIGFwcHN5bmMuR3JhcGhxbFR5cGUuYXdzSnNvbigpKTtcclxuICAgICAgICAgICAgc2V0KGFyZ3MsICdzb3J0JywgdGhpcy5zY2hlbWFUeXBlcy5Tb3J0SW5wdXQuYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBvZmZzZXQgcGFnaW5hdGlvbiBhcmd1bWVudHMuXHJcbiAgICAgICAgICAgIGlmIChwYWdpbmF0aW9uVHlwZSA9PT0gJ29mZnNldCcpIHtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnc2tpcCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICAgICAgc2V0KGFyZ3MsICdsaW1pdCcsIGFwcHN5bmMuR3JhcGhxbFR5cGUuaW50KCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBZGQgb2Zmc2V0IHBhZ2luYXRpb24gYXJndW1lbnRzLlxyXG4gICAgICAgICAgICBpZiAocGFnaW5hdGlvblR5cGUgPT09ICdjdXJzb3InKSB7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2ZpcnN0JywgYXBwc3luYy5HcmFwaHFsVHlwZS5pbnQoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2FmdGVyJywgYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAgICBzZXQoYXJncywgJ2xhc3QnLCBhcHBzeW5jLkdyYXBocWxUeXBlLmludCgpKTtcclxuICAgICAgICAgICAgICAgIHNldChhcmdzLCAnYmVmb3JlJywgYXBwc3luYy5HcmFwaHFsVHlwZS5zdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEFkZCBxdWVyeS5cclxuICAgICAgICAgICAgLy8gdGhpcy5ncmFwaHFsQXBpLmFkZFF1ZXJ5KGBmaW5kJHtvYmplY3RUeXBlTmFtZVBsdXJhbH1gLCBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBocWxBcGkuYWRkUXVlcnkoYCR7b2JqZWN0VHlwZU5hbWV9RmluZGAsIG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBjb25uZWN0aW9uT2JqZWN0VHlwZS5hdHRyaWJ1dGUoKSxcclxuICAgICAgICAgICAgICAgIGFyZ3MsXHJcbiAgICAgICAgICAgICAgICBkYXRhU291cmNlLFxyXG4gICAgICAgICAgICAgICAgcGlwZWxpbmVDb25maWc6IFtdIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgICAgICAgICAgLy8gVXNlIHRoZSByZXF1ZXN0IG1hcHBpbmcgdG8gaW5qZWN0IHN0YXNoIHZhcmlhYmxlcyAoZm9yIHVzZSBpbiBMYW1iZGEgZnVuY3Rpb24pLlxyXG4gICAgICAgICAgICAgICAgLy8gSW4gdGhlb3J5LCB3ZSBjb3VsZCB1c2UgYSBMYW1iZGEgZnVuY3Rpb24gaW5zdGVhZCBvZiBWVEwgYnV0IHRoaXMgc2hvdWxkIGJlIG11Y2ggZmFzdGVyIHRoYW4gaW52b2tpbmcgYW5vdGhlciBMYW1iZGEuXHJcbiAgICAgICAgICAgICAgICAvLyBDYXV0aW9uOiBwYXlsb2FkIHNob3VsZCBtaW1pYyBMYW1iZGEgcmVzb2x2ZXIgKG5vIFZUTCkuIFRoaXMgc3ludGF4IGNvdWxkIGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxyXG4gICAgICAgICAgICAgICAgLy8gcmVxdWVzdE1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJtZXRob2RcIiwgXCJnZXRcIikpXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJHV0aWwucXIoJGN0eC5zdGFzaC5wdXQoXCJ0eXBlTmFtZVwiLCBcIiR7b2JqZWN0VHlwZU5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICR1dGlsLnFyKCRjdHguc3Rhc2gucHV0KFwicmV0dXJuVHlwZU5hbWVcIiwgXCIke2Nvbm5lY3Rpb25PYmplY3RUeXBlLm5hbWV9XCIpKVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICR7QXBwU3luY1NjaGVtYS5waXBlbGluZVJlcXVlc3RNYXBwaW5nVGVtcGxhdGV9XHJcbiAgICAgICAgICAgICAgICAvLyBgKVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19