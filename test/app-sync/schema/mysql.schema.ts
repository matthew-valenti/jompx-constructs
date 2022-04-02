// import * as appsync from '@aws-cdk/aws-appsync-alpha';
// import { Directive, Field, GraphqlType, InputType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';
import { GraphqlType, InterfaceType, ObjectType } from '@aws-cdk/aws-appsync-alpha';
import { AppSyncMySqlCustomDirective as CustomDirective } from '../../../src/classes/app-sync/datasources/mysql.directive';
import { ISchemaType } from '../../../src/types/app-sync';
import { AppSyncDatasource } from '../app-sync.test';

export class MySqlSchema {

    public types: ISchemaType = {};

    constructor(
    ) {

        // Interface types.

        const mnode = new InterfaceType('mnode', {
            definition: {
                id: GraphqlType.id({ isRequired: true }),
                isDeleted: GraphqlType.boolean({ isRequired: true }),
                dateCreated: GraphqlType.awsDateTime({ isRequired: true }),
                dateUpdated: GraphqlType.awsDateTime({ isRequired: true })
            }
        });
        this.types.mnode = mnode;

        // Object types.

        const mpost = new ObjectType('mpost', {
            interfaceTypes: [mnode],
            definition: {
                id: GraphqlType.id({ isRequired: true }),
                title: GraphqlType.string()
            },
            directives: [
                CustomDirective.datasource(AppSyncDatasource.mySql),
                CustomDirective.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'deleteOne', 'deleteMany', 'destroyOne', 'destoryMany']),
                // CustomDirective.permissions(['read', 'create', 'update', 'delete'])
            ]
        });
        this.types.mpost = mpost;

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