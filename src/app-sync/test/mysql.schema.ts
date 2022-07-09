// import * as appsync from '@aws-cdk/aws-appsync-alpha';
// import { Directive, Field, GraphqlType, InputType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';
import { Field, GraphqlType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';
// import { GraphqlTypeOptions, IIntermediateType, IntermediateType } from '@aws-cdk/aws-appsync-alpha';
// import { JompxGraphqlType } from '../../../src/classes/app-sync/graphql-type';
// import { JompxResolvableField } from '../../../src/classes/app-sync/graphql-type';
import { ISchemaTypes, IDataSource } from '../app-sync.types';
import { auth, datasource, lookup, operations, readonly, source } from '../directives';
import { JompxGraphqlType } from '../graphql-type';
import { AppSyncDatasource } from './app-sync.test'; // TODO: This looks like a bug! Why import something from our test?

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
                        readonly(true)
                    ]
                }),
                createdAt: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        readonly(true)
                    ]
                }),
                createdBy: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        readonly(true)
                    ]
                }),
                updatedAt: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        readonly(true)
                    ]
                }),
                updatedBy: new Field({
                    returnType: GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        readonly(true)
                    ]
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' }
                ])
                // Directive.cognito(),
                // Directive.iam()
            ]
        });
        this.types.interfaceTypes.MNode = MNode;

        const MMovie = new ObjectType('MMovie', {
            interfaceTypes: [MNode],
            definition: {
                name: GraphqlType.string({ isRequired: true }),
                exampleBoolean: GraphqlType.boolean(),
                exampleFloat: GraphqlType.float(),
                exampleInt: GraphqlType.int(),
                exampleDate: GraphqlType.awsDate(),
                exampleDateTime: GraphqlType.awsDateTime(),
                exampleEmail: GraphqlType.awsEmail(),
                exampleIpAddress: GraphqlType.awsIpAddress(),
                exampleJson: GraphqlType.awsJson(),
                examplePhone: GraphqlType.awsPhone(),
                exampleTime: GraphqlType.awsTime(),
                exampleTimestamp: GraphqlType.awsTimestamp(),
                exampleUrl: GraphqlType.awsUrl(),
                exampleSourceField: new Field({
                    returnType: GraphqlType.string(),
                    directives: [
                        source('sourceField')
                    ]
                }),
                mMovieActors: new ResolvableField({
                    // A movie must have actors.
                    returnType: JompxGraphqlType.objectType({ typeName: 'MMovieActor', isList: true, isRequiredList: true }), // String return type.
                    dataSource: this.datasources[AppSyncDatasource.mySql],
                    directives: [
                        lookup({ from: 'MMovieActor', localField: 'id', foreignField: 'movieId' })
                    ]
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' }
                ]),
                datasource(AppSyncDatasource.mySql),
                source('pilot'),
                operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes.MMovie = MMovie;

        const MMovieActor = new ObjectType('MMovieActor', {
            interfaceTypes: [MNode],
            definition: {
                movieId: GraphqlType.id({ isRequired: true }),
                actorId: GraphqlType.id({ isRequired: true }),
                mMovie: new ResolvableField({
                    returnType: MMovie.attribute({ isRequired: true }),
                    dataSource: this.datasources[AppSyncDatasource.mySql],
                    directives: [
                        lookup({ from: 'MMovie', localField: 'movieId', foreignField: 'id' })
                    ]
                }),
                mActor: new ResolvableField({
                    returnType: MMovie.attribute({ isRequired: true }),
                    dataSource: this.datasources[AppSyncDatasource.mySql],
                    directives: [
                        lookup({ from: 'MActor', localField: 'actorId', foreignField: 'id' })
                    ]
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' }
                ]),
                datasource(AppSyncDatasource.mySql),
                source('movieActor'),
                operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes.MMovieActor = MMovieActor;

        const MActor = new ObjectType('MActor', {
            interfaceTypes: [MNode],
            definition: {
                name: GraphqlType.string({ isRequired: true }),
                // An actor can have 0 or more movies.
                mMovieActors: new ResolvableField({
                    returnType: MMovieActor.attribute({ isList: true }),
                    dataSource: this.datasources[AppSyncDatasource.mySql],
                    directives: [
                        lookup({ from: 'MMovieActor', localField: 'id', foreignField: 'actorId' })
                    ]
                })
            },
            directives: [
                auth([
                    { allow: 'private', provider: 'iam' }
                ]),
                datasource(AppSyncDatasource.mySql),
                source('comment'),
                operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes.MActor = MActor;

        // Intermediate Types

        // const intermediateType = new IntermediateType('MMovie', {
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

        // api.addQuery('getMUser', new ResolvableField({
        //     returnType: MUser.attribute(),
        //     dataSource: datasources.get('mysql'),
        //     pipelineConfig: [], // TODO: Add authorization Lambda function here.
        //     // Use the request mapping to inject stash variables (for use in Lambda function).
        //     // In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
        //     // Caution: payload should mimic Lambda resolver (no VTL). This syntax could change in the future.
        // }));

        // api.addMutation('myCustomMutation', new ResolvableField({
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