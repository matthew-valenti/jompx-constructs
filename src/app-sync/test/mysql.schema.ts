import * as appsync from '@aws-cdk/aws-appsync-alpha';
// import { Directive, Field, GraphqlType, InputType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';
import { Field, GraphqlType, InterfaceType, ObjectType } from '@aws-cdk/aws-appsync-alpha';
// import { GraphqlTypeOptions, IIntermediateType, IntermediateType } from '@aws-cdk/aws-appsync-alpha';
// import { JompxGraphqlType } from '../../../src/classes/app-sync/graphql-type';
// import { JompxResolvableField } from '../../../src/classes/app-sync/graphql-type';
import { ISchemaTypes, IDataSource } from '../app-sync.types';
import { AppSyncMySqlCustomDirective as CustomDirective } from '../datasources/mysql/mysql.directive';
import { JompxGraphqlType } from '../graphql-type';
import { AppSyncDatasource } from '../test/app-sync.test'; // TODO: This looks like a bug! Why import something from our test?

/**
 * Use GraphqlType for simple fields.
 * Use Field if additional attributes are required e.g. directives.
 * Use ResolvableField if the field exists in another type or datasource.
  */
export class MySqlSchema {

    public types: ISchemaTypes = { enumTypes: {}, inputTypes: {}, interfaceTypes: {}, objectTypes: {}, unionTypes: {} };

    constructor(
        private datasources: IDataSource
    ) {

        // Interface types.

        const MNode = new InterfaceType('MNode', {
            definition: {
                id: new Field({
                    returnType: GraphqlType.id({ isRequired: true }),
                    directives: [
                        CustomDirective.readonly(true)
                    ]
                }),
                isDeleted: new Field({
                    returnType: GraphqlType.boolean({ isRequired: true }),
                    directives: [
                        CustomDirective.readonly(true)
                    ]
                }),
                dateCreated: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        CustomDirective.readonly(true)
                    ]
                }),
                dateUpdated: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        CustomDirective.readonly(true)
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

        const MPost = new ObjectType('MPost', {
            interfaceTypes: [MNode],
            definition: {
                date: GraphqlType.awsDateTime(),
                title: new Field({
                    returnType: GraphqlType.string(),
                    directives: [
                        CustomDirective.source('title')
                    ]
                }),
                mcomments: new appsync.ResolvableField({
                    returnType: JompxGraphqlType.objectType({ typeName: 'MComment', isList: true }),
                    dataSource: this.datasources[AppSyncDatasource.mySql],
                    directives: [
                        CustomDirective.lookup({ from: 'MComment', localField: 'id', foreignField: 'mpostId' })
                    ]
                })
            },
            directives: [
                CustomDirective.datasource(AppSyncDatasource.mySql),
                CustomDirective.source('post'),
                CustomDirective.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'destroyOne', 'destoryMany'])
                // CustomDirective.permissions(['read', 'create', 'update', 'delete'])
            ]
        });
        this.types.objectTypes.MPost = MPost;

        const MComment = new ObjectType('MComment', {
            interfaceTypes: [MNode],
            definition: {
                id: GraphqlType.id({ isRequired: true }),
                html: new Field({
                    returnType: GraphqlType.string(),
                    directives: [
                        CustomDirective.source('content')
                    ]
                }),
                mpostId: GraphqlType.id(),
                // mpost: new appsync.ResolvableField({
                //     returnType: JompxGraphqlType.objectType({ typeName: 'MPost', isRequired: true }),
                //     dataSource: this.datasources[AppSyncDatasource.mySql]
                // }),
                mpost: new appsync.ResolvableField({
                    returnType: MPost.attribute(),
                    dataSource: this.datasources[AppSyncDatasource.mySql],
                    directives: [
                        CustomDirective.lookup({ from: 'MPost', localField: 'mpostId', foreignField: 'id' })
                    ]
                })
            },
            directives: [
                CustomDirective.datasource(AppSyncDatasource.mySql),
                CustomDirective.source('comment'),
                CustomDirective.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'destroyOne', 'destoryMany'])
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