"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlSchema = void 0;
const appsync = require("@aws-cdk/aws-appsync-alpha");
// import { Directive, Field, GraphqlType, InputType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
const mysql_directive_1 = require("../datasources/mysql/mysql.directive");
const graphql_type_1 = require("../graphql-type");
const app_sync_test_1 = require("../test/app-sync.test"); // TODO: This looks like a bug! Why import something from our test?
/**
 * Use GraphqlType for simple fields.
 * Use Field if additional attributes are required e.g. directives.
 * Use ResolvableField if the field exists in another type or datasource.
  */
class MySqlSchema {
    constructor(datasources) {
        // Interface types.
        this.datasources = datasources;
        this.types = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };
        const MNode = new aws_appsync_alpha_1.InterfaceType('MNode', {
            definition: {
                id: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.id({ isRequired: true }),
                    directives: [
                        mysql_directive_1.AppSyncMySqlCustomDirective.readonly(true)
                    ]
                }),
                isDeleted: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.boolean({ isRequired: true }),
                    directives: [
                        mysql_directive_1.AppSyncMySqlCustomDirective.readonly(true)
                    ]
                }),
                dateCreated: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        mysql_directive_1.AppSyncMySqlCustomDirective.readonly(true)
                    ]
                }),
                dateUpdated: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        mysql_directive_1.AppSyncMySqlCustomDirective.readonly(true)
                    ]
                })
            }
        });
        this.types.interfaceTypes.MNode = MNode;
        // Intermediate Types
        // const intermediateType = new IntermediateType('MPost', {
        //     interfaceTypes: [MNode],
        //     definition: {
        //         matthew: GraphqlType.string(),
        //     },
        //     directives: [
        //         CustomDirective.datasource(AppSyncDatasource.mySql),
        //         CustomDirective.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'destroyOne', 'destoryMany'])
        //         // CustomDirective.permissions(['read', 'create', 'update', 'delete'])
        //     ]
        // });
        // Object types.
        // const x = new Field({ returnType: GraphqlType.awsDateTime(), directives: [Directive.custom('@relation(local: "clientId",foreign: "_id")')] });
        const MPost = new aws_appsync_alpha_1.ObjectType('MPost', {
            interfaceTypes: [MNode],
            definition: {
                date: aws_appsync_alpha_1.GraphqlType.awsDateTime(),
                title: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.string(),
                    directives: [
                        mysql_directive_1.AppSyncMySqlCustomDirective.source('title')
                    ]
                }),
                mcomments: new appsync.ResolvableField({
                    returnType: graphql_type_1.JompxGraphqlType.objectType({ typeName: 'MComment', isList: true }),
                    dataSource: this.datasources[app_sync_test_1.AppSyncDatasource.mySql],
                    directives: [
                        mysql_directive_1.AppSyncMySqlCustomDirective.lookup({ from: 'MComment', localField: 'id', foreignField: 'mpostId' })
                    ]
                })
            },
            directives: [
                mysql_directive_1.AppSyncMySqlCustomDirective.datasource(app_sync_test_1.AppSyncDatasource.mySql),
                mysql_directive_1.AppSyncMySqlCustomDirective.source('post'),
                mysql_directive_1.AppSyncMySqlCustomDirective.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'destroyOne', 'destoryMany'])
                // CustomDirective.permissions(['read', 'create', 'update', 'delete'])
            ]
        });
        this.types.objectTypes.MPost = MPost;
        const MComment = new aws_appsync_alpha_1.ObjectType('MComment', {
            interfaceTypes: [MNode],
            definition: {
                id: aws_appsync_alpha_1.GraphqlType.id({ isRequired: true }),
                html: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.string(),
                    directives: [
                        mysql_directive_1.AppSyncMySqlCustomDirective.source('content')
                    ]
                }),
                mpostId: aws_appsync_alpha_1.GraphqlType.id(),
                // mpost: new appsync.ResolvableField({
                //     returnType: JompxGraphqlType.objectType({ typeName: 'MPost', isRequired: true }),
                //     dataSource: this.datasources[AppSyncDatasource.mySql]
                // }),
                mpost: new appsync.ResolvableField({
                    returnType: MPost.attribute(),
                    dataSource: this.datasources[app_sync_test_1.AppSyncDatasource.mySql],
                    directives: [
                        mysql_directive_1.AppSyncMySqlCustomDirective.lookup({ from: 'MPost', localField: 'mpostId', foreignField: 'id' })
                    ]
                })
            },
            directives: [
                mysql_directive_1.AppSyncMySqlCustomDirective.datasource(app_sync_test_1.AppSyncDatasource.mySql),
                mysql_directive_1.AppSyncMySqlCustomDirective.source('comment'),
                mysql_directive_1.AppSyncMySqlCustomDirective.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'destroyOne', 'destoryMany'])
                // CustomDirective.permissions(['read', 'create', 'update', 'delete'])
            ]
        });
        this.types.objectTypes.MComment = MComment;
        // const SAccount = new ObjectType('SAccount', {
        //     definition: {
        //         accountId: GraphqlType.id({ isRequired: true }),
        //         accountName: GraphqlType.string()
        //     },
        //     directives: [
        //         Directive.custom('@datasource(name: "mysql")'),
        //         Directive.custom('@key(fields: "id")')
        //     ]
        // });
        // types.set('SAccount', SAccount);
        // const CUser = new ObjectType('CUser', {
        //     definition: {
        //         email: GraphqlType.string({ isRequired: true }),
        //         phone: GraphqlType.string(),
        //     },
        //     directives: [
        //         Directive.custom('@datasource(name: "mysql")'),
        //         Directive.custom('@key(fields: "id")')
        //     ]
        // });
        // types.set('CUser', CUser);
        // const MUser = new ObjectType('MUser', {
        //     interfaceTypes: [MNode],
        //     definition: {
        //         email: GraphqlType.id({ isRequired: true }),
        //         firstName: GraphqlType.string(),
        //         lastName: GraphqlType.string(),
        //         sAccount: new ResolvableField({
        //             returnType: SAccount.attribute({ isList: false }),
        //             dataSource: datasources.get('mysql')
        //         }),
        //         CUser: new ResolvableField({
        //             returnType: CUser.attribute({ isList: false }),
        //             dataSource: datasources.get('mysql')
        //         }),
        //         user: new Field({ returnType: CUser.attribute(), directives: [Directive.custom('@relation(local: "userId", foreign: "_id")')] }),
        //     },
        //     directives: [
        //         Directive.custom('@datasource(name: "mysql")'),
        //         Directive.custom('@key(fields: "id")'),
        //         Directive.custom('@method(names: "get,create,update,delete")')
        //     ]
        // });
        // types.set('MUser', MUser);
        // api.addQuery('getMUser', new appsync.ResolvableField({
        //     returnType: MUser.attribute(),
        //     dataSource: datasources.get('mysql'),
        //     pipelineConfig: [], // TODO: Add authorization Lambda function here.
        //     // Use the request mapping to inject stash variables (for use in Lambda function).
        //     // In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
        //     // Caution: payload should mimic Lambda resolver (no VTL). This syntax could change in the future.
        // }));
        // api.addMutation('myCustomMutation', new appsync.ResolvableField({
        //     returnType: appsync.GraphqlType.awsJson(),
        //     args: { myVar1: appsync.GraphqlType.id({ isRequired: true }), myVar2: appsync.GraphqlType.id({ isRequired: true }) },
        //     dataSource: datasources.get('mysql'),
        //     pipelineConfig: [], // Add authentication Lambda function here.
        // }));
        // Auto generate method schema.
        // const schemaHelper = new SchemaHelper(api, datasources, types);
        // types.forEach((type) => {
        //     schemaHelper.addType(type);
        // });
    }
}
exports.MySqlSchema = MySqlSchema;
// User.addField({ fieldName: 'userSecurityRoles', field: new Field({ returnType: UserSecurityRole.attribute({ isList: true }), directives: [Directive.custom('@relation(local: "_id", foreign: "userId")')] }) });
// SecurityRole.addField({ fieldName: 'userSecurityRoles', field: new Field({ returnType: UserSecurityRole.attribute({ isList: true }), directives: [Directive.custom('@relation(local: "_id", foreign: "securityRoleId")')] }) });
// https://stackoverflow.com/questions/41515679/can-you-make-a-graphql-type-both-an-input-and-output-type
// const UserType = `
//     name: String!,
//     surname: String!
// `;
// const schema = graphql.buildSchema(`
//     type User {
//         ${UserType}
//     }
//     input InputUser {
//         ${UserType}
//     }
// `)
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuc2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC1zeW5jL3Rlc3QvbXlzcWwuc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFzRDtBQUN0RCxxSUFBcUk7QUFDckksa0VBQTJGO0FBSzNGLDBFQUFzRztBQUN0RyxrREFBbUQ7QUFDbkQseURBQTBELENBQUMsbUVBQW1FO0FBRTlIOzs7O0lBSUk7QUFDSixNQUFhLFdBQVc7SUFJcEIsWUFDWSxXQUF3QjtRQUdoQyxtQkFBbUI7UUFIWCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUg3QixVQUFLLEdBQWlCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFRaEgsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQ0FBYSxDQUFDLE9BQU8sRUFBRTtZQUNyQyxVQUFVLEVBQUU7Z0JBQ1IsRUFBRSxFQUFFLElBQUkseUJBQUssQ0FBQztvQkFDVixVQUFVLEVBQUUsK0JBQVcsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ2hELFVBQVUsRUFBRTt3QkFDUiw2Q0FBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7cUJBQ2pDO2lCQUNKLENBQUM7Z0JBQ0YsU0FBUyxFQUFFLElBQUkseUJBQUssQ0FBQztvQkFDakIsVUFBVSxFQUFFLCtCQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDO29CQUNyRCxVQUFVLEVBQUU7d0JBQ1IsNkNBQWUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDO3FCQUNqQztpQkFDSixDQUFDO2dCQUNGLFdBQVcsRUFBRSxJQUFJLHlCQUFLLENBQUM7b0JBQ25CLFVBQVUsRUFBRSwrQkFBVyxDQUFDLFdBQVcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQztvQkFDekQsVUFBVSxFQUFFO3dCQUNSLDZDQUFlLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztxQkFDakM7aUJBQ0osQ0FBQztnQkFDRixXQUFXLEVBQUUsSUFBSSx5QkFBSyxDQUFDO29CQUNuQixVQUFVLEVBQUUsK0JBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3pELFVBQVUsRUFBRTt3QkFDUiw2Q0FBZSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7cUJBQ2pDO2lCQUNKLENBQUM7YUFDTDtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFeEMscUJBQXFCO1FBRXJCLDJEQUEyRDtRQUMzRCwrQkFBK0I7UUFDL0Isb0JBQW9CO1FBQ3BCLHlDQUF5QztRQUN6QyxTQUFTO1FBQ1Qsb0JBQW9CO1FBQ3BCLCtEQUErRDtRQUMvRCx3S0FBd0s7UUFDeEssaUZBQWlGO1FBQ2pGLFFBQVE7UUFDUixNQUFNO1FBRU4sZ0JBQWdCO1FBRWhCLGlKQUFpSjtRQUVqSixNQUFNLEtBQUssR0FBRyxJQUFJLDhCQUFVLENBQUMsT0FBTyxFQUFFO1lBQ2xDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FBQztZQUN2QixVQUFVLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLCtCQUFXLENBQUMsV0FBVyxFQUFFO2dCQUMvQixLQUFLLEVBQUUsSUFBSSx5QkFBSyxDQUFDO29CQUNiLFVBQVUsRUFBRSwrQkFBVyxDQUFDLE1BQU0sRUFBRTtvQkFDaEMsVUFBVSxFQUFFO3dCQUNSLDZDQUFlLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztxQkFDbEM7aUJBQ0osQ0FBQztnQkFDRixTQUFTLEVBQUUsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDO29CQUNuQyxVQUFVLEVBQUUsK0JBQWdCLENBQUMsVUFBVSxDQUFDLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQy9FLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGlDQUFpQixDQUFDLEtBQUssQ0FBQztvQkFDckQsVUFBVSxFQUFFO3dCQUNSLDZDQUFlLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsQ0FBQztxQkFDMUY7aUJBQ0osQ0FBQzthQUNMO1lBQ0QsVUFBVSxFQUFFO2dCQUNSLDZDQUFlLENBQUMsVUFBVSxDQUFDLGlDQUFpQixDQUFDLEtBQUssQ0FBQztnQkFDbkQsNkNBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUM5Qiw2Q0FBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGFBQWEsQ0FBQyxDQUFDO2dCQUM3SixzRUFBc0U7YUFDekU7U0FDSixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRXJDLE1BQU0sUUFBUSxHQUFHLElBQUksOEJBQVUsQ0FBQyxVQUFVLEVBQUU7WUFDeEMsY0FBYyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQ3ZCLFVBQVUsRUFBRTtnQkFDUixFQUFFLEVBQUUsK0JBQVcsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7Z0JBQ3hDLElBQUksRUFBRSxJQUFJLHlCQUFLLENBQUM7b0JBQ1osVUFBVSxFQUFFLCtCQUFXLENBQUMsTUFBTSxFQUFFO29CQUNoQyxVQUFVLEVBQUU7d0JBQ1IsNkNBQWUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO3FCQUNwQztpQkFDSixDQUFDO2dCQUNGLE9BQU8sRUFBRSwrQkFBVyxDQUFDLEVBQUUsRUFBRTtnQkFDekIsdUNBQXVDO2dCQUN2Qyx3RkFBd0Y7Z0JBQ3hGLDREQUE0RDtnQkFDNUQsTUFBTTtnQkFDTixLQUFLLEVBQUUsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDO29CQUMvQixVQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVMsRUFBRTtvQkFDN0IsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsaUNBQWlCLENBQUMsS0FBSyxDQUFDO29CQUNyRCxVQUFVLEVBQUU7d0JBQ1IsNkNBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxDQUFDO3FCQUN2RjtpQkFDSixDQUFDO2FBQ0w7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsNkNBQWUsQ0FBQyxVQUFVLENBQUMsaUNBQWlCLENBQUMsS0FBSyxDQUFDO2dCQUNuRCw2Q0FBZSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7Z0JBQ2pDLDZDQUFlLENBQUMsVUFBVSxDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDLENBQUM7Z0JBQzdKLHNFQUFzRTthQUN6RTtTQUNKLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFM0MsZ0RBQWdEO1FBQ2hELG9CQUFvQjtRQUNwQiwyREFBMkQ7UUFDM0QsNENBQTRDO1FBQzVDLFNBQVM7UUFDVCxvQkFBb0I7UUFDcEIsMERBQTBEO1FBQzFELGlEQUFpRDtRQUNqRCxRQUFRO1FBQ1IsTUFBTTtRQUNOLG1DQUFtQztRQUVuQywwQ0FBMEM7UUFDMUMsb0JBQW9CO1FBQ3BCLDJEQUEyRDtRQUMzRCx1Q0FBdUM7UUFDdkMsU0FBUztRQUNULG9CQUFvQjtRQUNwQiwwREFBMEQ7UUFDMUQsaURBQWlEO1FBQ2pELFFBQVE7UUFDUixNQUFNO1FBQ04sNkJBQTZCO1FBRTdCLDBDQUEwQztRQUMxQywrQkFBK0I7UUFDL0Isb0JBQW9CO1FBQ3BCLHVEQUF1RDtRQUN2RCwyQ0FBMkM7UUFDM0MsMENBQTBDO1FBQzFDLDBDQUEwQztRQUMxQyxpRUFBaUU7UUFDakUsbURBQW1EO1FBQ25ELGNBQWM7UUFDZCx1Q0FBdUM7UUFDdkMsOERBQThEO1FBQzlELG1EQUFtRDtRQUNuRCxjQUFjO1FBQ2QsNElBQTRJO1FBQzVJLFNBQVM7UUFDVCxvQkFBb0I7UUFDcEIsMERBQTBEO1FBQzFELGtEQUFrRDtRQUNsRCx5RUFBeUU7UUFDekUsUUFBUTtRQUNSLE1BQU07UUFDTiw2QkFBNkI7UUFFN0IseURBQXlEO1FBQ3pELHFDQUFxQztRQUNyQyw0Q0FBNEM7UUFDNUMsMkVBQTJFO1FBQzNFLHlGQUF5RjtRQUN6RiwrSEFBK0g7UUFDL0gseUdBQXlHO1FBQ3pHLE9BQU87UUFFUCxvRUFBb0U7UUFDcEUsaURBQWlEO1FBQ2pELDRIQUE0SDtRQUM1SCw0Q0FBNEM7UUFDNUMsc0VBQXNFO1FBQ3RFLE9BQU87UUFFUCwrQkFBK0I7UUFDL0Isa0VBQWtFO1FBQ2xFLDRCQUE0QjtRQUM1QixrQ0FBa0M7UUFDbEMsTUFBTTtJQUNWLENBQUM7Q0FDSjtBQTNMRCxrQ0EyTEM7QUFFRCxtTkFBbU47QUFDbk4sbU9BQW1PO0FBRW5PLHlHQUF5RztBQUN6RyxxQkFBcUI7QUFDckIscUJBQXFCO0FBQ3JCLHVCQUF1QjtBQUN2QixLQUFLO0FBRUwsdUNBQXVDO0FBQ3ZDLGtCQUFrQjtBQUNsQixzQkFBc0I7QUFDdEIsUUFBUTtBQUNSLHdCQUF3QjtBQUN4QixzQkFBc0I7QUFDdEIsUUFBUTtBQUNSLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuLy8gaW1wb3J0IHsgRGlyZWN0aXZlLCBGaWVsZCwgR3JhcGhxbFR5cGUsIElucHV0VHlwZSwgSW50ZXJmYWNlVHlwZSwgT2JqZWN0VHlwZSwgUmVzb2x2YWJsZUZpZWxkIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgeyBGaWVsZCwgR3JhcGhxbFR5cGUsIEludGVyZmFjZVR5cGUsIE9iamVjdFR5cGUgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbi8vIGltcG9ydCB7IEdyYXBocWxUeXBlT3B0aW9ucywgSUludGVybWVkaWF0ZVR5cGUsIEludGVybWVkaWF0ZVR5cGUgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbi8vIGltcG9ydCB7IEpvbXB4R3JhcGhxbFR5cGUgfSBmcm9tICcuLi8uLi8uLi9zcmMvY2xhc3Nlcy9hcHAtc3luYy9ncmFwaHFsLXR5cGUnO1xyXG4vLyBpbXBvcnQgeyBKb21weFJlc29sdmFibGVGaWVsZCB9IGZyb20gJy4uLy4uLy4uL3NyYy9jbGFzc2VzL2FwcC1zeW5jL2dyYXBocWwtdHlwZSc7XHJcbmltcG9ydCB7IElTY2hlbWFUeXBlcywgSURhdGFTb3VyY2UgfSBmcm9tICcuLi9hcHAtc3luYy50eXBlcyc7XHJcbmltcG9ydCB7IEFwcFN5bmNNeVNxbEN1c3RvbURpcmVjdGl2ZSBhcyBDdXN0b21EaXJlY3RpdmUgfSBmcm9tICcuLi9kYXRhc291cmNlcy9teXNxbC9teXNxbC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBKb21weEdyYXBocWxUeXBlIH0gZnJvbSAnLi4vZ3JhcGhxbC10eXBlJztcclxuaW1wb3J0IHsgQXBwU3luY0RhdGFzb3VyY2UgfSBmcm9tICcuLi90ZXN0L2FwcC1zeW5jLnRlc3QnOyAvLyBUT0RPOiBUaGlzIGxvb2tzIGxpa2UgYSBidWchIFdoeSBpbXBvcnQgc29tZXRoaW5nIGZyb20gb3VyIHRlc3Q/XHJcblxyXG4vKipcclxuICogVXNlIEdyYXBocWxUeXBlIGZvciBzaW1wbGUgZmllbGRzLlxyXG4gKiBVc2UgRmllbGQgaWYgYWRkaXRpb25hbCBhdHRyaWJ1dGVzIGFyZSByZXF1aXJlZCBlLmcuIGRpcmVjdGl2ZXMuXHJcbiAqIFVzZSBSZXNvbHZhYmxlRmllbGQgaWYgdGhlIGZpZWxkIGV4aXN0cyBpbiBhbm90aGVyIHR5cGUgb3IgZGF0YXNvdXJjZS5cclxuICAqL1xyXG5leHBvcnQgY2xhc3MgTXlTcWxTY2hlbWEge1xyXG5cclxuICAgIHB1YmxpYyB0eXBlczogSVNjaGVtYVR5cGVzID0geyBlbnVtVHlwZXM6IHt9LCBpbnB1dFR5cGVzOiB7fSwgaW50ZXJmYWNlVHlwZXM6IHt9LCBvYmplY3RUeXBlczoge30sIHVuaW9uVHlwZXM6IHt9IH07XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSBkYXRhc291cmNlczogSURhdGFTb3VyY2VcclxuICAgICkge1xyXG5cclxuICAgICAgICAvLyBJbnRlcmZhY2UgdHlwZXMuXHJcblxyXG4gICAgICAgIGNvbnN0IE1Ob2RlID0gbmV3IEludGVyZmFjZVR5cGUoJ01Ob2RlJywge1xyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogbmV3IEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBHcmFwaHFsVHlwZS5pZCh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDdXN0b21EaXJlY3RpdmUucmVhZG9ubHkodHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGlzRGVsZXRlZDogbmV3IEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBHcmFwaHFsVHlwZS5ib29sZWFuKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEN1c3RvbURpcmVjdGl2ZS5yZWFkb25seSh0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgZGF0ZUNyZWF0ZWQ6IG5ldyBGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogR3JhcGhxbFR5cGUuYXdzRGF0ZVRpbWUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ3VzdG9tRGlyZWN0aXZlLnJlYWRvbmx5KHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBkYXRlVXBkYXRlZDogbmV3IEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBHcmFwaHFsVHlwZS5hd3NEYXRlVGltZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDdXN0b21EaXJlY3RpdmUucmVhZG9ubHkodHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50eXBlcy5pbnRlcmZhY2VUeXBlcy5NTm9kZSA9IE1Ob2RlO1xyXG5cclxuICAgICAgICAvLyBJbnRlcm1lZGlhdGUgVHlwZXNcclxuXHJcbiAgICAgICAgLy8gY29uc3QgaW50ZXJtZWRpYXRlVHlwZSA9IG5ldyBJbnRlcm1lZGlhdGVUeXBlKCdNUG9zdCcsIHtcclxuICAgICAgICAvLyAgICAgaW50ZXJmYWNlVHlwZXM6IFtNTm9kZV0sXHJcbiAgICAgICAgLy8gICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAvLyAgICAgICAgIG1hdHRoZXc6IEdyYXBocWxUeXBlLnN0cmluZygpLFxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgLy8gICAgICAgICBDdXN0b21EaXJlY3RpdmUuZGF0YXNvdXJjZShBcHBTeW5jRGF0YXNvdXJjZS5teVNxbCksXHJcbiAgICAgICAgLy8gICAgICAgICBDdXN0b21EaXJlY3RpdmUub3BlcmF0aW9ucyhbJ2ZpbmQnLCAnZmluZE9uZScsICdpbnNlcnRPbmUnLCAnaW5zZXJ0TWFueScsICd1cGRhdGVPbmUnLCAndXBkYXRlTWFueScsICdkZWxldGVPbmUnLCAnZGVsZXRlTWFueScsICdkZXN0cm95T25lJywgJ2Rlc3RvcnlNYW55J10pXHJcbiAgICAgICAgLy8gICAgICAgICAvLyBDdXN0b21EaXJlY3RpdmUucGVybWlzc2lvbnMoWydyZWFkJywgJ2NyZWF0ZScsICd1cGRhdGUnLCAnZGVsZXRlJ10pXHJcbiAgICAgICAgLy8gICAgIF1cclxuICAgICAgICAvLyB9KTtcclxuXHJcbiAgICAgICAgLy8gT2JqZWN0IHR5cGVzLlxyXG5cclxuICAgICAgICAvLyBjb25zdCB4ID0gbmV3IEZpZWxkKHsgcmV0dXJuVHlwZTogR3JhcGhxbFR5cGUuYXdzRGF0ZVRpbWUoKSwgZGlyZWN0aXZlczogW0RpcmVjdGl2ZS5jdXN0b20oJ0ByZWxhdGlvbihsb2NhbDogXCJjbGllbnRJZFwiLGZvcmVpZ246IFwiX2lkXCIpJyldIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBNUG9zdCA9IG5ldyBPYmplY3RUeXBlKCdNUG9zdCcsIHtcclxuICAgICAgICAgICAgaW50ZXJmYWNlVHlwZXM6IFtNTm9kZV0sXHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIGRhdGU6IEdyYXBocWxUeXBlLmF3c0RhdGVUaW1lKCksXHJcbiAgICAgICAgICAgICAgICB0aXRsZTogbmV3IEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBHcmFwaHFsVHlwZS5zdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEN1c3RvbURpcmVjdGl2ZS5zb3VyY2UoJ3RpdGxlJylcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIG1jb21tZW50czogbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBKb21weEdyYXBocWxUeXBlLm9iamVjdFR5cGUoeyB0eXBlTmFtZTogJ01Db21tZW50JywgaXNMaXN0OiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFTb3VyY2U6IHRoaXMuZGF0YXNvdXJjZXNbQXBwU3luY0RhdGFzb3VyY2UubXlTcWxdLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ3VzdG9tRGlyZWN0aXZlLmxvb2t1cCh7IGZyb206ICdNQ29tbWVudCcsIGxvY2FsRmllbGQ6ICdpZCcsIGZvcmVpZ25GaWVsZDogJ21wb3N0SWQnIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgQ3VzdG9tRGlyZWN0aXZlLmRhdGFzb3VyY2UoQXBwU3luY0RhdGFzb3VyY2UubXlTcWwpLFxyXG4gICAgICAgICAgICAgICAgQ3VzdG9tRGlyZWN0aXZlLnNvdXJjZSgncG9zdCcpLFxyXG4gICAgICAgICAgICAgICAgQ3VzdG9tRGlyZWN0aXZlLm9wZXJhdGlvbnMoWydmaW5kJywgJ2ZpbmRPbmUnLCAnaW5zZXJ0T25lJywgJ2luc2VydE1hbnknLCAndXBkYXRlT25lJywgJ3VwZGF0ZU1hbnknLCAnZGVsZXRlT25lJywgJ2RlbGV0ZU1hbnknLCAnZGVzdHJveU9uZScsICdkZXN0b3J5TWFueSddKVxyXG4gICAgICAgICAgICAgICAgLy8gQ3VzdG9tRGlyZWN0aXZlLnBlcm1pc3Npb25zKFsncmVhZCcsICdjcmVhdGUnLCAndXBkYXRlJywgJ2RlbGV0ZSddKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50eXBlcy5vYmplY3RUeXBlcy5NUG9zdCA9IE1Qb3N0O1xyXG5cclxuICAgICAgICBjb25zdCBNQ29tbWVudCA9IG5ldyBPYmplY3RUeXBlKCdNQ29tbWVudCcsIHtcclxuICAgICAgICAgICAgaW50ZXJmYWNlVHlwZXM6IFtNTm9kZV0sXHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIGlkOiBHcmFwaHFsVHlwZS5pZCh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICBodG1sOiBuZXcgRmllbGQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblR5cGU6IEdyYXBocWxUeXBlLnN0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ3VzdG9tRGlyZWN0aXZlLnNvdXJjZSgnY29udGVudCcpXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBtcG9zdElkOiBHcmFwaHFsVHlwZS5pZCgpLFxyXG4gICAgICAgICAgICAgICAgLy8gbXBvc3Q6IG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgcmV0dXJuVHlwZTogSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlKHsgdHlwZU5hbWU6ICdNUG9zdCcsIGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgZGF0YVNvdXJjZTogdGhpcy5kYXRhc291cmNlc1tBcHBTeW5jRGF0YXNvdXJjZS5teVNxbF1cclxuICAgICAgICAgICAgICAgIC8vIH0pLFxyXG4gICAgICAgICAgICAgICAgbXBvc3Q6IG5ldyBhcHBzeW5jLlJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogTVBvc3QuYXR0cmlidXRlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVNvdXJjZTogdGhpcy5kYXRhc291cmNlc1tBcHBTeW5jRGF0YXNvdXJjZS5teVNxbF0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDdXN0b21EaXJlY3RpdmUubG9va3VwKHsgZnJvbTogJ01Qb3N0JywgbG9jYWxGaWVsZDogJ21wb3N0SWQnLCBmb3JlaWduRmllbGQ6ICdpZCcgfSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBDdXN0b21EaXJlY3RpdmUuZGF0YXNvdXJjZShBcHBTeW5jRGF0YXNvdXJjZS5teVNxbCksXHJcbiAgICAgICAgICAgICAgICBDdXN0b21EaXJlY3RpdmUuc291cmNlKCdjb21tZW50JyksXHJcbiAgICAgICAgICAgICAgICBDdXN0b21EaXJlY3RpdmUub3BlcmF0aW9ucyhbJ2ZpbmQnLCAnZmluZE9uZScsICdpbnNlcnRPbmUnLCAnaW5zZXJ0TWFueScsICd1cGRhdGVPbmUnLCAndXBkYXRlTWFueScsICdkZWxldGVPbmUnLCAnZGVsZXRlTWFueScsICdkZXN0cm95T25lJywgJ2Rlc3RvcnlNYW55J10pXHJcbiAgICAgICAgICAgICAgICAvLyBDdXN0b21EaXJlY3RpdmUucGVybWlzc2lvbnMoWydyZWFkJywgJ2NyZWF0ZScsICd1cGRhdGUnLCAnZGVsZXRlJ10pXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnR5cGVzLm9iamVjdFR5cGVzLk1Db21tZW50ID0gTUNvbW1lbnQ7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IFNBY2NvdW50ID0gbmV3IE9iamVjdFR5cGUoJ1NBY2NvdW50Jywge1xyXG4gICAgICAgIC8vICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgLy8gICAgICAgICBhY2NvdW50SWQ6IEdyYXBocWxUeXBlLmlkKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAvLyAgICAgICAgIGFjY291bnROYW1lOiBHcmFwaHFsVHlwZS5zdHJpbmcoKVxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgLy8gICAgICAgICBEaXJlY3RpdmUuY3VzdG9tKCdAZGF0YXNvdXJjZShuYW1lOiBcIm15c3FsXCIpJyksXHJcbiAgICAgICAgLy8gICAgICAgICBEaXJlY3RpdmUuY3VzdG9tKCdAa2V5KGZpZWxkczogXCJpZFwiKScpXHJcbiAgICAgICAgLy8gICAgIF1cclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICAvLyB0eXBlcy5zZXQoJ1NBY2NvdW50JywgU0FjY291bnQpO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBDVXNlciA9IG5ldyBPYmplY3RUeXBlKCdDVXNlcicsIHtcclxuICAgICAgICAvLyAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgIC8vICAgICAgICAgZW1haWw6IEdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgLy8gICAgICAgICBwaG9uZTogR3JhcGhxbFR5cGUuc3RyaW5nKCksXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAvLyAgICAgICAgIERpcmVjdGl2ZS5jdXN0b20oJ0BkYXRhc291cmNlKG5hbWU6IFwibXlzcWxcIiknKSxcclxuICAgICAgICAvLyAgICAgICAgIERpcmVjdGl2ZS5jdXN0b20oJ0BrZXkoZmllbGRzOiBcImlkXCIpJylcclxuICAgICAgICAvLyAgICAgXVxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIC8vIHR5cGVzLnNldCgnQ1VzZXInLCBDVXNlcik7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IE1Vc2VyID0gbmV3IE9iamVjdFR5cGUoJ01Vc2VyJywge1xyXG4gICAgICAgIC8vICAgICBpbnRlcmZhY2VUeXBlczogW01Ob2RlXSxcclxuICAgICAgICAvLyAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgIC8vICAgICAgICAgZW1haWw6IEdyYXBocWxUeXBlLmlkKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAvLyAgICAgICAgIGZpcnN0TmFtZTogR3JhcGhxbFR5cGUuc3RyaW5nKCksXHJcbiAgICAgICAgLy8gICAgICAgICBsYXN0TmFtZTogR3JhcGhxbFR5cGUuc3RyaW5nKCksXHJcbiAgICAgICAgLy8gICAgICAgICBzQWNjb3VudDogbmV3IFJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuVHlwZTogU0FjY291bnQuYXR0cmlidXRlKHsgaXNMaXN0OiBmYWxzZSB9KSxcclxuICAgICAgICAvLyAgICAgICAgICAgICBkYXRhU291cmNlOiBkYXRhc291cmNlcy5nZXQoJ215c3FsJylcclxuICAgICAgICAvLyAgICAgICAgIH0pLFxyXG4gICAgICAgIC8vICAgICAgICAgQ1VzZXI6IG5ldyBSZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIHJldHVyblR5cGU6IENVc2VyLmF0dHJpYnV0ZSh7IGlzTGlzdDogZmFsc2UgfSksXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgZGF0YVNvdXJjZTogZGF0YXNvdXJjZXMuZ2V0KCdteXNxbCcpXHJcbiAgICAgICAgLy8gICAgICAgICB9KSxcclxuICAgICAgICAvLyAgICAgICAgIHVzZXI6IG5ldyBGaWVsZCh7IHJldHVyblR5cGU6IENVc2VyLmF0dHJpYnV0ZSgpLCBkaXJlY3RpdmVzOiBbRGlyZWN0aXZlLmN1c3RvbSgnQHJlbGF0aW9uKGxvY2FsOiBcInVzZXJJZFwiLCBmb3JlaWduOiBcIl9pZFwiKScpXSB9KSxcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgIC8vICAgICAgICAgRGlyZWN0aXZlLmN1c3RvbSgnQGRhdGFzb3VyY2UobmFtZTogXCJteXNxbFwiKScpLFxyXG4gICAgICAgIC8vICAgICAgICAgRGlyZWN0aXZlLmN1c3RvbSgnQGtleShmaWVsZHM6IFwiaWRcIiknKSxcclxuICAgICAgICAvLyAgICAgICAgIERpcmVjdGl2ZS5jdXN0b20oJ0BtZXRob2QobmFtZXM6IFwiZ2V0LGNyZWF0ZSx1cGRhdGUsZGVsZXRlXCIpJylcclxuICAgICAgICAvLyAgICAgXVxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIC8vIHR5cGVzLnNldCgnTVVzZXInLCBNVXNlcik7XHJcblxyXG4gICAgICAgIC8vIGFwaS5hZGRRdWVyeSgnZ2V0TVVzZXInLCBuZXcgYXBwc3luYy5SZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgIC8vICAgICByZXR1cm5UeXBlOiBNVXNlci5hdHRyaWJ1dGUoKSxcclxuICAgICAgICAvLyAgICAgZGF0YVNvdXJjZTogZGF0YXNvdXJjZXMuZ2V0KCdteXNxbCcpLFxyXG4gICAgICAgIC8vICAgICBwaXBlbGluZUNvbmZpZzogW10sIC8vIFRPRE86IEFkZCBhdXRob3JpemF0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgIC8vICAgICAvLyBVc2UgdGhlIHJlcXVlc3QgbWFwcGluZyB0byBpbmplY3Qgc3Rhc2ggdmFyaWFibGVzIChmb3IgdXNlIGluIExhbWJkYSBmdW5jdGlvbikuXHJcbiAgICAgICAgLy8gICAgIC8vIEluIHRoZW9yeSwgd2UgY291bGQgdXNlIGEgTGFtYmRhIGZ1bmN0aW9uIGluc3RlYWQgb2YgVlRMIGJ1dCB0aGlzIHNob3VsZCBiZSBtdWNoIGZhc3RlciB0aGFuIGludm9raW5nIGFub3RoZXIgTGFtYmRhLlxyXG4gICAgICAgIC8vICAgICAvLyBDYXV0aW9uOiBwYXlsb2FkIHNob3VsZCBtaW1pYyBMYW1iZGEgcmVzb2x2ZXIgKG5vIFZUTCkuIFRoaXMgc3ludGF4IGNvdWxkIGNoYW5nZSBpbiB0aGUgZnV0dXJlLlxyXG4gICAgICAgIC8vIH0pKTtcclxuXHJcbiAgICAgICAgLy8gYXBpLmFkZE11dGF0aW9uKCdteUN1c3RvbU11dGF0aW9uJywgbmV3IGFwcHN5bmMuUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuVHlwZTogYXBwc3luYy5HcmFwaHFsVHlwZS5hd3NKc29uKCksXHJcbiAgICAgICAgLy8gICAgIGFyZ3M6IHsgbXlWYXIxOiBhcHBzeW5jLkdyYXBocWxUeXBlLmlkKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSwgbXlWYXIyOiBhcHBzeW5jLkdyYXBocWxUeXBlLmlkKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSB9LFxyXG4gICAgICAgIC8vICAgICBkYXRhU291cmNlOiBkYXRhc291cmNlcy5nZXQoJ215c3FsJyksXHJcbiAgICAgICAgLy8gICAgIHBpcGVsaW5lQ29uZmlnOiBbXSwgLy8gQWRkIGF1dGhlbnRpY2F0aW9uIExhbWJkYSBmdW5jdGlvbiBoZXJlLlxyXG4gICAgICAgIC8vIH0pKTtcclxuXHJcbiAgICAgICAgLy8gQXV0byBnZW5lcmF0ZSBtZXRob2Qgc2NoZW1hLlxyXG4gICAgICAgIC8vIGNvbnN0IHNjaGVtYUhlbHBlciA9IG5ldyBTY2hlbWFIZWxwZXIoYXBpLCBkYXRhc291cmNlcywgdHlwZXMpO1xyXG4gICAgICAgIC8vIHR5cGVzLmZvckVhY2goKHR5cGUpID0+IHtcclxuICAgICAgICAvLyAgICAgc2NoZW1hSGVscGVyLmFkZFR5cGUodHlwZSk7XHJcbiAgICAgICAgLy8gfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFVzZXIuYWRkRmllbGQoeyBmaWVsZE5hbWU6ICd1c2VyU2VjdXJpdHlSb2xlcycsIGZpZWxkOiBuZXcgRmllbGQoeyByZXR1cm5UeXBlOiBVc2VyU2VjdXJpdHlSb2xlLmF0dHJpYnV0ZSh7IGlzTGlzdDogdHJ1ZSB9KSwgZGlyZWN0aXZlczogW0RpcmVjdGl2ZS5jdXN0b20oJ0ByZWxhdGlvbihsb2NhbDogXCJfaWRcIiwgZm9yZWlnbjogXCJ1c2VySWRcIiknKV0gfSkgfSk7XHJcbi8vIFNlY3VyaXR5Um9sZS5hZGRGaWVsZCh7IGZpZWxkTmFtZTogJ3VzZXJTZWN1cml0eVJvbGVzJywgZmllbGQ6IG5ldyBGaWVsZCh7IHJldHVyblR5cGU6IFVzZXJTZWN1cml0eVJvbGUuYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pLCBkaXJlY3RpdmVzOiBbRGlyZWN0aXZlLmN1c3RvbSgnQHJlbGF0aW9uKGxvY2FsOiBcIl9pZFwiLCBmb3JlaWduOiBcInNlY3VyaXR5Um9sZUlkXCIpJyldIH0pIH0pO1xyXG5cclxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDE1MTU2NzkvY2FuLXlvdS1tYWtlLWEtZ3JhcGhxbC10eXBlLWJvdGgtYW4taW5wdXQtYW5kLW91dHB1dC10eXBlXHJcbi8vIGNvbnN0IFVzZXJUeXBlID0gYFxyXG4vLyAgICAgbmFtZTogU3RyaW5nISxcclxuLy8gICAgIHN1cm5hbWU6IFN0cmluZyFcclxuLy8gYDtcclxuXHJcbi8vIGNvbnN0IHNjaGVtYSA9IGdyYXBocWwuYnVpbGRTY2hlbWEoYFxyXG4vLyAgICAgdHlwZSBVc2VyIHtcclxuLy8gICAgICAgICAke1VzZXJUeXBlfVxyXG4vLyAgICAgfVxyXG4vLyAgICAgaW5wdXQgSW5wdXRVc2VyIHtcclxuLy8gICAgICAgICAke1VzZXJUeXBlfVxyXG4vLyAgICAgfVxyXG4vLyBgKSJdfQ==