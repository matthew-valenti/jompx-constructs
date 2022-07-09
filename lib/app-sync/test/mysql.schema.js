"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySqlSchema = void 0;
// import * as appsync from '@aws-cdk/aws-appsync-alpha';
// import { Directive, Field, GraphqlType, InputType, InterfaceType, ObjectType, ResolvableField } from '@aws-cdk/aws-appsync-alpha';
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
const directives_1 = require("../directives");
const graphql_type_1 = require("../graphql-type");
const app_sync_test_1 = require("./app-sync.test"); // TODO: This looks like a bug! Why import something from our test?
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
                        directives_1.readonly(true)
                    ]
                }),
                createdAt: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        directives_1.readonly(true)
                    ]
                }),
                createdBy: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        directives_1.readonly(true)
                    ]
                }),
                updatedAt: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        directives_1.readonly(true)
                    ]
                }),
                updatedBy: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.awsDateTime({ isRequired: true }),
                    directives: [
                        directives_1.readonly(true)
                    ]
                })
            },
            directives: [
                directives_1.auth([
                    { allow: 'private', provider: 'iam' }
                ])
                // Directive.cognito(),
                // Directive.iam()
            ]
        });
        this.types.interfaceTypes.MNode = MNode;
        const MMovie = new aws_appsync_alpha_1.ObjectType('MMovie', {
            interfaceTypes: [MNode],
            definition: {
                name: aws_appsync_alpha_1.GraphqlType.string({ isRequired: true }),
                exampleBoolean: aws_appsync_alpha_1.GraphqlType.boolean(),
                exampleFloat: aws_appsync_alpha_1.GraphqlType.float(),
                exampleInt: aws_appsync_alpha_1.GraphqlType.int(),
                exampleDate: aws_appsync_alpha_1.GraphqlType.awsDate(),
                exampleDateTime: aws_appsync_alpha_1.GraphqlType.awsDateTime(),
                exampleEmail: aws_appsync_alpha_1.GraphqlType.awsEmail(),
                exampleIpAddress: aws_appsync_alpha_1.GraphqlType.awsIpAddress(),
                exampleJson: aws_appsync_alpha_1.GraphqlType.awsJson(),
                examplePhone: aws_appsync_alpha_1.GraphqlType.awsPhone(),
                exampleTime: aws_appsync_alpha_1.GraphqlType.awsTime(),
                exampleTimestamp: aws_appsync_alpha_1.GraphqlType.awsTimestamp(),
                exampleUrl: aws_appsync_alpha_1.GraphqlType.awsUrl(),
                exampleSourceField: new aws_appsync_alpha_1.Field({
                    returnType: aws_appsync_alpha_1.GraphqlType.string(),
                    directives: [
                        directives_1.source('sourceField')
                    ]
                }),
                mMovieActors: new aws_appsync_alpha_1.ResolvableField({
                    // A movie must have actors.
                    returnType: graphql_type_1.JompxGraphqlType.objectType({ typeName: 'MMovieActor', isList: true, isRequiredList: true }),
                    dataSource: this.datasources[app_sync_test_1.AppSyncDatasource.mySql],
                    directives: [
                        directives_1.lookup({ from: 'MMovieActor', localField: 'id', foreignField: 'movieId' })
                    ]
                })
            },
            directives: [
                directives_1.auth([
                    { allow: 'private', provider: 'iam' }
                ]),
                directives_1.datasource(app_sync_test_1.AppSyncDatasource.mySql),
                directives_1.source('pilot'),
                directives_1.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes.MMovie = MMovie;
        const MMovieActor = new aws_appsync_alpha_1.ObjectType('MMovieActor', {
            interfaceTypes: [MNode],
            definition: {
                movieId: aws_appsync_alpha_1.GraphqlType.id({ isRequired: true }),
                actorId: aws_appsync_alpha_1.GraphqlType.id({ isRequired: true }),
                mMovie: new aws_appsync_alpha_1.ResolvableField({
                    returnType: MMovie.attribute({ isRequired: true }),
                    dataSource: this.datasources[app_sync_test_1.AppSyncDatasource.mySql],
                    directives: [
                        directives_1.lookup({ from: 'MMovie', localField: 'movieId', foreignField: 'id' })
                    ]
                }),
                mActor: new aws_appsync_alpha_1.ResolvableField({
                    returnType: MMovie.attribute({ isRequired: true }),
                    dataSource: this.datasources[app_sync_test_1.AppSyncDatasource.mySql],
                    directives: [
                        directives_1.lookup({ from: 'MActor', localField: 'actorId', foreignField: 'id' })
                    ]
                })
            },
            directives: [
                directives_1.auth([
                    { allow: 'private', provider: 'iam' }
                ]),
                directives_1.datasource(app_sync_test_1.AppSyncDatasource.mySql),
                directives_1.source('movieActor'),
                directives_1.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
            ]
        });
        this.types.objectTypes.MMovieActor = MMovieActor;
        const MActor = new aws_appsync_alpha_1.ObjectType('MActor', {
            interfaceTypes: [MNode],
            definition: {
                name: aws_appsync_alpha_1.GraphqlType.string({ isRequired: true }),
                // An actor can have 0 or more movies.
                mMovieActors: new aws_appsync_alpha_1.ResolvableField({
                    returnType: MMovieActor.attribute({ isList: true }),
                    dataSource: this.datasources[app_sync_test_1.AppSyncDatasource.mySql],
                    directives: [
                        directives_1.lookup({ from: 'MMovieActor', localField: 'id', foreignField: 'actorId' })
                    ]
                })
            },
            directives: [
                directives_1.auth([
                    { allow: 'private', provider: 'iam' }
                ]),
                directives_1.datasource(app_sync_test_1.AppSyncDatasource.mySql),
                directives_1.source('comment'),
                directives_1.operations(['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'])
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuc2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC1zeW5jL3Rlc3QvbXlzcWwuc2NoZW1hLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlEQUF5RDtBQUN6RCxxSUFBcUk7QUFDckksa0VBQTRHO0FBSzVHLDhDQUF1RjtBQUN2RixrREFBbUQ7QUFDbkQsbURBQW9ELENBQUMsbUVBQW1FO0FBRXhIOzs7O0lBSUk7QUFDSixNQUFhLFdBQVc7SUFJcEIsWUFDWSxXQUF3QjtRQUdoQyxtQkFBbUI7UUFIWCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUg3QixVQUFLLEdBQWlCLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLENBQUM7UUFRaEgsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQ0FBYSxDQUFDLE9BQU8sRUFBRTtZQUNyQyxVQUFVLEVBQUU7Z0JBQ1IsRUFBRSxFQUFFLElBQUkseUJBQUssQ0FBQztvQkFDVixVQUFVLEVBQUUsK0JBQVcsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ2hELFVBQVUsRUFBRTt3QkFDUixxQkFBUSxDQUFDLElBQUksQ0FBQztxQkFDakI7aUJBQ0osQ0FBQztnQkFDRixTQUFTLEVBQUUsSUFBSSx5QkFBSyxDQUFDO29CQUNqQixVQUFVLEVBQUUsK0JBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUM7b0JBQ3pELFVBQVUsRUFBRTt3QkFDUixxQkFBUSxDQUFDLElBQUksQ0FBQztxQkFDakI7aUJBQ0osQ0FBQztnQkFDRixTQUFTLEVBQUUsSUFBSSx5QkFBSyxDQUFDO29CQUNqQixVQUFVLEVBQUUsK0JBQVcsQ0FBQyxXQUFXLENBQUMsRUFBRSxV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QTZCO1FBRTdCLDBDQUEwQztRQUMxQywrQkFBK0I7UUFDL0Isb0JBQW9CO1FBQ3BCLHVEQUF1RDtRQUN2RCwyQ0FBMkM7UUFDM0MsMENBQTBDO1FBQzFDLDBDQUEwQztRQUMxQyxpRUFBaUU7UUFDakUsbURBQW1EO1FBQ25ELGNBQWM7UUFDZCx1Q0FBdUM7UUFDdkMsOERBQThEO1FBQzlELG1EQUFtRDtRQUNuRCxjQUFjO1FBQ2QsNElBQTRJO1FBQzVJLFNBQVM7UUFDVCxvQkFBb0I7UUFDcEIsMERBQTBEO1FBQzFELGtEQUFrRDtRQUNsRCx5RUFBeUU7UUFDekUsUUFBUTtRQUNSLE1BQU07UUFDTiw2QkFBNkI7UUFFN0IsaURBQWlEO1FBQ2pELHFDQUFxQztRQUNyQyw0Q0FBNEM7UUFDNUMsMkVBQTJFO1FBQzNFLHlGQUF5RjtRQUN6RiwrSEFBK0g7UUFDL0gseUdBQXlHO1FBQ3pHLE9BQU87UUFFUCw0REFBNEQ7UUFDNUQsaURBQWlEO1FBQ2pELDRIQUE0SDtRQUM1SCw0Q0FBNEM7UUFDNUMsc0VBQXNFO1FBQ3RFLE9BQU87UUFFUCwrQkFBK0I7UUFDL0Isa0VBQWtFO1FBQ2xFLDRCQUE0QjtRQUM1QixrQ0FBa0M7UUFDbEMsTUFBTTtJQUNWLENBQUM7Q0FDSjtBQTlPRCxrQ0E4T0M7QUFFRCxtTkFBbU47QUFDbk4sbU9BQW1PO0FBRW5PLHlHQUF5RztBQUN6RyxxQkFBcUI7QUFDckIscUJBQXFCO0FBQ3JCLHVCQUF1QjtBQUN2QixLQUFLO0FBRUwsdUNBQXVDO0FBQ3ZDLGtCQUFrQjtBQUNsQixzQkFBc0I7QUFDdEIsUUFBUTtBQUNSLHdCQUF3QjtBQUN4QixzQkFBc0I7QUFDdEIsUUFBUTtBQUNSLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgKiBhcyBhcHBzeW5jIGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuLy8gaW1wb3J0IHsgRGlyZWN0aXZlLCBGaWVsZCwgR3JhcGhxbFR5cGUsIElucHV0VHlwZSwgSW50ZXJmYWNlVHlwZSwgT2JqZWN0VHlwZSwgUmVzb2x2YWJsZUZpZWxkIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5pbXBvcnQgeyBGaWVsZCwgR3JhcGhxbFR5cGUsIEludGVyZmFjZVR5cGUsIE9iamVjdFR5cGUsIFJlc29sdmFibGVGaWVsZCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuLy8gaW1wb3J0IHsgR3JhcGhxbFR5cGVPcHRpb25zLCBJSW50ZXJtZWRpYXRlVHlwZSwgSW50ZXJtZWRpYXRlVHlwZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuLy8gaW1wb3J0IHsgSm9tcHhHcmFwaHFsVHlwZSB9IGZyb20gJy4uLy4uLy4uL3NyYy9jbGFzc2VzL2FwcC1zeW5jL2dyYXBocWwtdHlwZSc7XHJcbi8vIGltcG9ydCB7IEpvbXB4UmVzb2x2YWJsZUZpZWxkIH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NsYXNzZXMvYXBwLXN5bmMvZ3JhcGhxbC10eXBlJztcclxuaW1wb3J0IHsgSVNjaGVtYVR5cGVzLCBJRGF0YVNvdXJjZSB9IGZyb20gJy4uL2FwcC1zeW5jLnR5cGVzJztcclxuaW1wb3J0IHsgYXV0aCwgZGF0YXNvdXJjZSwgbG9va3VwLCBvcGVyYXRpb25zLCByZWFkb25seSwgc291cmNlIH0gZnJvbSAnLi4vZGlyZWN0aXZlcyc7XHJcbmltcG9ydCB7IEpvbXB4R3JhcGhxbFR5cGUgfSBmcm9tICcuLi9ncmFwaHFsLXR5cGUnO1xyXG5pbXBvcnQgeyBBcHBTeW5jRGF0YXNvdXJjZSB9IGZyb20gJy4vYXBwLXN5bmMudGVzdCc7IC8vIFRPRE86IFRoaXMgbG9va3MgbGlrZSBhIGJ1ZyEgV2h5IGltcG9ydCBzb21ldGhpbmcgZnJvbSBvdXIgdGVzdD9cclxuXHJcbi8qKlxyXG4gKiBVc2UgR3JhcGhxbFR5cGUgZm9yIHNpbXBsZSBmaWVsZHMuXHJcbiAqIFVzZSBGaWVsZCBpZiBhZGRpdGlvbmFsIGF0dHJpYnV0ZXMgYXJlIHJlcXVpcmVkIGUuZy4gZGlyZWN0aXZlcy5cclxuICogVXNlIFJlc29sdmFibGVGaWVsZCBpZiB0aGUgZmllbGQgZXhpc3RzIGluIGFub3RoZXIgdHlwZSBvciBkYXRhc291cmNlLlxyXG4gICovXHJcbmV4cG9ydCBjbGFzcyBNeVNxbFNjaGVtYSB7XHJcblxyXG4gICAgcHVibGljIHR5cGVzOiBJU2NoZW1hVHlwZXMgPSB7IGVudW1UeXBlczoge30sIGlucHV0VHlwZXM6IHt9LCBpbnRlcmZhY2VUeXBlczoge30sIG9iamVjdFR5cGVzOiB7fSwgdW5pb25UeXBlczoge30gfTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlIGRhdGFzb3VyY2VzOiBJRGF0YVNvdXJjZVxyXG4gICAgKSB7XHJcblxyXG4gICAgICAgIC8vIEludGVyZmFjZSB0eXBlcy5cclxuXHJcbiAgICAgICAgY29uc3QgTU5vZGUgPSBuZXcgSW50ZXJmYWNlVHlwZSgnTU5vZGUnLCB7XHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIGlkOiBuZXcgRmllbGQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblR5cGU6IEdyYXBocWxUeXBlLmlkKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRvbmx5KHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBjcmVhdGVkQXQ6IG5ldyBGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogR3JhcGhxbFR5cGUuYXdzRGF0ZVRpbWUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZG9ubHkodHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIGNyZWF0ZWRCeTogbmV3IEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBHcmFwaHFsVHlwZS5hd3NEYXRlVGltZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkb25seSh0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgdXBkYXRlZEF0OiBuZXcgRmllbGQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblR5cGU6IEdyYXBocWxUeXBlLmF3c0RhdGVUaW1lKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRvbmx5KHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkQnk6IG5ldyBGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogR3JhcGhxbFR5cGUuYXdzRGF0ZVRpbWUoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZG9ubHkodHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBhdXRoKFtcclxuICAgICAgICAgICAgICAgICAgICB7IGFsbG93OiAncHJpdmF0ZScsIHByb3ZpZGVyOiAnaWFtJyB9XHJcbiAgICAgICAgICAgICAgICBdKVxyXG4gICAgICAgICAgICAgICAgLy8gRGlyZWN0aXZlLmNvZ25pdG8oKSxcclxuICAgICAgICAgICAgICAgIC8vIERpcmVjdGl2ZS5pYW0oKVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50eXBlcy5pbnRlcmZhY2VUeXBlcy5NTm9kZSA9IE1Ob2RlO1xyXG5cclxuICAgICAgICBjb25zdCBNTW92aWUgPSBuZXcgT2JqZWN0VHlwZSgnTU1vdmllJywge1xyXG4gICAgICAgICAgICBpbnRlcmZhY2VUeXBlczogW01Ob2RlXSxcclxuICAgICAgICAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogR3JhcGhxbFR5cGUuc3RyaW5nKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGV4YW1wbGVCb29sZWFuOiBHcmFwaHFsVHlwZS5ib29sZWFuKCksXHJcbiAgICAgICAgICAgICAgICBleGFtcGxlRmxvYXQ6IEdyYXBocWxUeXBlLmZsb2F0KCksXHJcbiAgICAgICAgICAgICAgICBleGFtcGxlSW50OiBHcmFwaHFsVHlwZS5pbnQoKSxcclxuICAgICAgICAgICAgICAgIGV4YW1wbGVEYXRlOiBHcmFwaHFsVHlwZS5hd3NEYXRlKCksXHJcbiAgICAgICAgICAgICAgICBleGFtcGxlRGF0ZVRpbWU6IEdyYXBocWxUeXBlLmF3c0RhdGVUaW1lKCksXHJcbiAgICAgICAgICAgICAgICBleGFtcGxlRW1haWw6IEdyYXBocWxUeXBlLmF3c0VtYWlsKCksXHJcbiAgICAgICAgICAgICAgICBleGFtcGxlSXBBZGRyZXNzOiBHcmFwaHFsVHlwZS5hd3NJcEFkZHJlc3MoKSxcclxuICAgICAgICAgICAgICAgIGV4YW1wbGVKc29uOiBHcmFwaHFsVHlwZS5hd3NKc29uKCksXHJcbiAgICAgICAgICAgICAgICBleGFtcGxlUGhvbmU6IEdyYXBocWxUeXBlLmF3c1Bob25lKCksXHJcbiAgICAgICAgICAgICAgICBleGFtcGxlVGltZTogR3JhcGhxbFR5cGUuYXdzVGltZSgpLFxyXG4gICAgICAgICAgICAgICAgZXhhbXBsZVRpbWVzdGFtcDogR3JhcGhxbFR5cGUuYXdzVGltZXN0YW1wKCksXHJcbiAgICAgICAgICAgICAgICBleGFtcGxlVXJsOiBHcmFwaHFsVHlwZS5hd3NVcmwoKSxcclxuICAgICAgICAgICAgICAgIGV4YW1wbGVTb3VyY2VGaWVsZDogbmV3IEZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5UeXBlOiBHcmFwaHFsVHlwZS5zdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZSgnc291cmNlRmllbGQnKVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgbU1vdmllQWN0b3JzOiBuZXcgUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBBIG1vdmllIG11c3QgaGF2ZSBhY3RvcnMuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogSm9tcHhHcmFwaHFsVHlwZS5vYmplY3RUeXBlKHsgdHlwZU5hbWU6ICdNTW92aWVBY3RvcicsIGlzTGlzdDogdHJ1ZSwgaXNSZXF1aXJlZExpc3Q6IHRydWUgfSksIC8vIFN0cmluZyByZXR1cm4gdHlwZS5cclxuICAgICAgICAgICAgICAgICAgICBkYXRhU291cmNlOiB0aGlzLmRhdGFzb3VyY2VzW0FwcFN5bmNEYXRhc291cmNlLm15U3FsXSxcclxuICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvb2t1cCh7IGZyb206ICdNTW92aWVBY3RvcicsIGxvY2FsRmllbGQ6ICdpZCcsIGZvcmVpZ25GaWVsZDogJ21vdmllSWQnIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgYXV0aChbXHJcbiAgICAgICAgICAgICAgICAgICAgeyBhbGxvdzogJ3ByaXZhdGUnLCBwcm92aWRlcjogJ2lhbScgfVxyXG4gICAgICAgICAgICAgICAgXSksXHJcbiAgICAgICAgICAgICAgICBkYXRhc291cmNlKEFwcFN5bmNEYXRhc291cmNlLm15U3FsKSxcclxuICAgICAgICAgICAgICAgIHNvdXJjZSgncGlsb3QnKSxcclxuICAgICAgICAgICAgICAgIG9wZXJhdGlvbnMoWydmaW5kJywgJ2ZpbmRPbmUnLCAnaW5zZXJ0T25lJywgJ2luc2VydE1hbnknLCAndXBkYXRlT25lJywgJ3VwZGF0ZU1hbnknLCAndXBzZXJ0T25lJywgJ3Vwc2VydE1hbnknLCAnZGVsZXRlT25lJywgJ2RlbGV0ZU1hbnknXSlcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudHlwZXMub2JqZWN0VHlwZXMuTU1vdmllID0gTU1vdmllO1xyXG5cclxuICAgICAgICBjb25zdCBNTW92aWVBY3RvciA9IG5ldyBPYmplY3RUeXBlKCdNTW92aWVBY3RvcicsIHtcclxuICAgICAgICAgICAgaW50ZXJmYWNlVHlwZXM6IFtNTm9kZV0sXHJcbiAgICAgICAgICAgIGRlZmluaXRpb246IHtcclxuICAgICAgICAgICAgICAgIG1vdmllSWQ6IEdyYXBocWxUeXBlLmlkKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIGFjdG9ySWQ6IEdyYXBocWxUeXBlLmlkKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAgICAgICAgIG1Nb3ZpZTogbmV3IFJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogTU1vdmllLmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVNvdXJjZTogdGhpcy5kYXRhc291cmNlc1tBcHBTeW5jRGF0YXNvdXJjZS5teVNxbF0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb29rdXAoeyBmcm9tOiAnTU1vdmllJywgbG9jYWxGaWVsZDogJ21vdmllSWQnLCBmb3JlaWduRmllbGQ6ICdpZCcgfSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIG1BY3RvcjogbmV3IFJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogTU1vdmllLmF0dHJpYnV0ZSh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVNvdXJjZTogdGhpcy5kYXRhc291cmNlc1tBcHBTeW5jRGF0YXNvdXJjZS5teVNxbF0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb29rdXAoeyBmcm9tOiAnTUFjdG9yJywgbG9jYWxGaWVsZDogJ2FjdG9ySWQnLCBmb3JlaWduRmllbGQ6ICdpZCcgfSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBhdXRoKFtcclxuICAgICAgICAgICAgICAgICAgICB7IGFsbG93OiAncHJpdmF0ZScsIHByb3ZpZGVyOiAnaWFtJyB9XHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgIGRhdGFzb3VyY2UoQXBwU3luY0RhdGFzb3VyY2UubXlTcWwpLFxyXG4gICAgICAgICAgICAgICAgc291cmNlKCdtb3ZpZUFjdG9yJyksXHJcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25zKFsnZmluZCcsICdmaW5kT25lJywgJ2luc2VydE9uZScsICdpbnNlcnRNYW55JywgJ3VwZGF0ZU9uZScsICd1cGRhdGVNYW55JywgJ3Vwc2VydE9uZScsICd1cHNlcnRNYW55JywgJ2RlbGV0ZU9uZScsICdkZWxldGVNYW55J10pXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnR5cGVzLm9iamVjdFR5cGVzLk1Nb3ZpZUFjdG9yID0gTU1vdmllQWN0b3I7XHJcblxyXG4gICAgICAgIGNvbnN0IE1BY3RvciA9IG5ldyBPYmplY3RUeXBlKCdNQWN0b3InLCB7XHJcbiAgICAgICAgICAgIGludGVyZmFjZVR5cGVzOiBbTU5vZGVdLFxyXG4gICAgICAgICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiBHcmFwaHFsVHlwZS5zdHJpbmcoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgLy8gQW4gYWN0b3IgY2FuIGhhdmUgMCBvciBtb3JlIG1vdmllcy5cclxuICAgICAgICAgICAgICAgIG1Nb3ZpZUFjdG9yczogbmV3IFJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVHlwZTogTU1vdmllQWN0b3IuYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFTb3VyY2U6IHRoaXMuZGF0YXNvdXJjZXNbQXBwU3luY0RhdGFzb3VyY2UubXlTcWxdLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9va3VwKHsgZnJvbTogJ01Nb3ZpZUFjdG9yJywgbG9jYWxGaWVsZDogJ2lkJywgZm9yZWlnbkZpZWxkOiAnYWN0b3JJZCcgfSlcclxuICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgICAgICAgICBhdXRoKFtcclxuICAgICAgICAgICAgICAgICAgICB7IGFsbG93OiAncHJpdmF0ZScsIHByb3ZpZGVyOiAnaWFtJyB9XHJcbiAgICAgICAgICAgICAgICBdKSxcclxuICAgICAgICAgICAgICAgIGRhdGFzb3VyY2UoQXBwU3luY0RhdGFzb3VyY2UubXlTcWwpLFxyXG4gICAgICAgICAgICAgICAgc291cmNlKCdjb21tZW50JyksXHJcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25zKFsnZmluZCcsICdmaW5kT25lJywgJ2luc2VydE9uZScsICdpbnNlcnRNYW55JywgJ3VwZGF0ZU9uZScsICd1cGRhdGVNYW55JywgJ3Vwc2VydE9uZScsICd1cHNlcnRNYW55JywgJ2RlbGV0ZU9uZScsICdkZWxldGVNYW55J10pXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnR5cGVzLm9iamVjdFR5cGVzLk1BY3RvciA9IE1BY3RvcjtcclxuXHJcbiAgICAgICAgLy8gSW50ZXJtZWRpYXRlIFR5cGVzXHJcblxyXG4gICAgICAgIC8vIGNvbnN0IGludGVybWVkaWF0ZVR5cGUgPSBuZXcgSW50ZXJtZWRpYXRlVHlwZSgnTU1vdmllJywge1xyXG4gICAgICAgIC8vICAgICBpbnRlcmZhY2VUeXBlczogW01Ob2RlXSxcclxuICAgICAgICAvLyAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgIC8vICAgICAgICAgbWF0dGhldzogR3JhcGhxbFR5cGUuc3RyaW5nKCksXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAvLyAgICAgICAgIEN1c3RvbURpcmVjdGl2ZS5kYXRhc291cmNlKEFwcFN5bmNEYXRhc291cmNlLm15U3FsKSxcclxuICAgICAgICAvLyAgICAgICAgIEN1c3RvbURpcmVjdGl2ZS5vcGVyYXRpb25zKFsnZmluZCcsICdmaW5kT25lJywgJ2luc2VydE9uZScsICdpbnNlcnRNYW55JywgJ3VwZGF0ZU9uZScsICd1cGRhdGVNYW55JywgJ2RlbGV0ZU9uZScsICdkZWxldGVNYW55JywgJ2Rlc3Ryb3lPbmUnLCAnZGVzdG9yeU1hbnknXSlcclxuICAgICAgICAvLyAgICAgICAgIC8vIEN1c3RvbURpcmVjdGl2ZS5wZXJtaXNzaW9ucyhbJ3JlYWQnLCAnY3JlYXRlJywgJ3VwZGF0ZScsICdkZWxldGUnXSlcclxuICAgICAgICAvLyAgICAgXVxyXG4gICAgICAgIC8vIH0pO1xyXG5cclxuICAgICAgICAvLyBPYmplY3QgdHlwZXMuXHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHggPSBuZXcgRmllbGQoeyByZXR1cm5UeXBlOiBHcmFwaHFsVHlwZS5hd3NEYXRlVGltZSgpLCBkaXJlY3RpdmVzOiBbRGlyZWN0aXZlLmN1c3RvbSgnQHJlbGF0aW9uKGxvY2FsOiBcImNsaWVudElkXCIsZm9yZWlnbjogXCJfaWRcIiknKV0gfSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IFNBY2NvdW50ID0gbmV3IE9iamVjdFR5cGUoJ1NBY2NvdW50Jywge1xyXG4gICAgICAgIC8vICAgICBkZWZpbml0aW9uOiB7XHJcbiAgICAgICAgLy8gICAgICAgICBhY2NvdW50SWQ6IEdyYXBocWxUeXBlLmlkKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAvLyAgICAgICAgIGFjY291bnROYW1lOiBHcmFwaHFsVHlwZS5zdHJpbmcoKVxyXG4gICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgIC8vICAgICBkaXJlY3RpdmVzOiBbXHJcbiAgICAgICAgLy8gICAgICAgICBEaXJlY3RpdmUuY3VzdG9tKCdAZGF0YXNvdXJjZShuYW1lOiBcIm15c3FsXCIpJyksXHJcbiAgICAgICAgLy8gICAgICAgICBEaXJlY3RpdmUuY3VzdG9tKCdAa2V5KGZpZWxkczogXCJpZFwiKScpXHJcbiAgICAgICAgLy8gICAgIF1cclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICAvLyB0eXBlcy5zZXQoJ1NBY2NvdW50JywgU0FjY291bnQpO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBDVXNlciA9IG5ldyBPYmplY3RUeXBlKCdDVXNlcicsIHtcclxuICAgICAgICAvLyAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgIC8vICAgICAgICAgZW1haWw6IEdyYXBocWxUeXBlLnN0cmluZyh7IGlzUmVxdWlyZWQ6IHRydWUgfSksXHJcbiAgICAgICAgLy8gICAgICAgICBwaG9uZTogR3JhcGhxbFR5cGUuc3RyaW5nKCksXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIGRpcmVjdGl2ZXM6IFtcclxuICAgICAgICAvLyAgICAgICAgIERpcmVjdGl2ZS5jdXN0b20oJ0BkYXRhc291cmNlKG5hbWU6IFwibXlzcWxcIiknKSxcclxuICAgICAgICAvLyAgICAgICAgIERpcmVjdGl2ZS5jdXN0b20oJ0BrZXkoZmllbGRzOiBcImlkXCIpJylcclxuICAgICAgICAvLyAgICAgXVxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIC8vIHR5cGVzLnNldCgnQ1VzZXInLCBDVXNlcik7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IE1Vc2VyID0gbmV3IE9iamVjdFR5cGUoJ01Vc2VyJywge1xyXG4gICAgICAgIC8vICAgICBpbnRlcmZhY2VUeXBlczogW01Ob2RlXSxcclxuICAgICAgICAvLyAgICAgZGVmaW5pdGlvbjoge1xyXG4gICAgICAgIC8vICAgICAgICAgZW1haWw6IEdyYXBocWxUeXBlLmlkKHsgaXNSZXF1aXJlZDogdHJ1ZSB9KSxcclxuICAgICAgICAvLyAgICAgICAgIGZpcnN0TmFtZTogR3JhcGhxbFR5cGUuc3RyaW5nKCksXHJcbiAgICAgICAgLy8gICAgICAgICBsYXN0TmFtZTogR3JhcGhxbFR5cGUuc3RyaW5nKCksXHJcbiAgICAgICAgLy8gICAgICAgICBzQWNjb3VudDogbmV3IFJlc29sdmFibGVGaWVsZCh7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuVHlwZTogU0FjY291bnQuYXR0cmlidXRlKHsgaXNMaXN0OiBmYWxzZSB9KSxcclxuICAgICAgICAvLyAgICAgICAgICAgICBkYXRhU291cmNlOiBkYXRhc291cmNlcy5nZXQoJ215c3FsJylcclxuICAgICAgICAvLyAgICAgICAgIH0pLFxyXG4gICAgICAgIC8vICAgICAgICAgQ1VzZXI6IG5ldyBSZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgIC8vICAgICAgICAgICAgIHJldHVyblR5cGU6IENVc2VyLmF0dHJpYnV0ZSh7IGlzTGlzdDogZmFsc2UgfSksXHJcbiAgICAgICAgLy8gICAgICAgICAgICAgZGF0YVNvdXJjZTogZGF0YXNvdXJjZXMuZ2V0KCdteXNxbCcpXHJcbiAgICAgICAgLy8gICAgICAgICB9KSxcclxuICAgICAgICAvLyAgICAgICAgIHVzZXI6IG5ldyBGaWVsZCh7IHJldHVyblR5cGU6IENVc2VyLmF0dHJpYnV0ZSgpLCBkaXJlY3RpdmVzOiBbRGlyZWN0aXZlLmN1c3RvbSgnQHJlbGF0aW9uKGxvY2FsOiBcInVzZXJJZFwiLCBmb3JlaWduOiBcIl9pZFwiKScpXSB9KSxcclxuICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAvLyAgICAgZGlyZWN0aXZlczogW1xyXG4gICAgICAgIC8vICAgICAgICAgRGlyZWN0aXZlLmN1c3RvbSgnQGRhdGFzb3VyY2UobmFtZTogXCJteXNxbFwiKScpLFxyXG4gICAgICAgIC8vICAgICAgICAgRGlyZWN0aXZlLmN1c3RvbSgnQGtleShmaWVsZHM6IFwiaWRcIiknKSxcclxuICAgICAgICAvLyAgICAgICAgIERpcmVjdGl2ZS5jdXN0b20oJ0BtZXRob2QobmFtZXM6IFwiZ2V0LGNyZWF0ZSx1cGRhdGUsZGVsZXRlXCIpJylcclxuICAgICAgICAvLyAgICAgXVxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIC8vIHR5cGVzLnNldCgnTVVzZXInLCBNVXNlcik7XHJcblxyXG4gICAgICAgIC8vIGFwaS5hZGRRdWVyeSgnZ2V0TVVzZXInLCBuZXcgUmVzb2x2YWJsZUZpZWxkKHtcclxuICAgICAgICAvLyAgICAgcmV0dXJuVHlwZTogTVVzZXIuYXR0cmlidXRlKCksXHJcbiAgICAgICAgLy8gICAgIGRhdGFTb3VyY2U6IGRhdGFzb3VyY2VzLmdldCgnbXlzcWwnKSxcclxuICAgICAgICAvLyAgICAgcGlwZWxpbmVDb25maWc6IFtdLCAvLyBUT0RPOiBBZGQgYXV0aG9yaXphdGlvbiBMYW1iZGEgZnVuY3Rpb24gaGVyZS5cclxuICAgICAgICAvLyAgICAgLy8gVXNlIHRoZSByZXF1ZXN0IG1hcHBpbmcgdG8gaW5qZWN0IHN0YXNoIHZhcmlhYmxlcyAoZm9yIHVzZSBpbiBMYW1iZGEgZnVuY3Rpb24pLlxyXG4gICAgICAgIC8vICAgICAvLyBJbiB0aGVvcnksIHdlIGNvdWxkIHVzZSBhIExhbWJkYSBmdW5jdGlvbiBpbnN0ZWFkIG9mIFZUTCBidXQgdGhpcyBzaG91bGQgYmUgbXVjaCBmYXN0ZXIgdGhhbiBpbnZva2luZyBhbm90aGVyIExhbWJkYS5cclxuICAgICAgICAvLyAgICAgLy8gQ2F1dGlvbjogcGF5bG9hZCBzaG91bGQgbWltaWMgTGFtYmRhIHJlc29sdmVyIChubyBWVEwpLiBUaGlzIHN5bnRheCBjb3VsZCBjaGFuZ2UgaW4gdGhlIGZ1dHVyZS5cclxuICAgICAgICAvLyB9KSk7XHJcblxyXG4gICAgICAgIC8vIGFwaS5hZGRNdXRhdGlvbignbXlDdXN0b21NdXRhdGlvbicsIG5ldyBSZXNvbHZhYmxlRmllbGQoe1xyXG4gICAgICAgIC8vICAgICByZXR1cm5UeXBlOiBhcHBzeW5jLkdyYXBocWxUeXBlLmF3c0pzb24oKSxcclxuICAgICAgICAvLyAgICAgYXJnczogeyBteVZhcjE6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaWQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pLCBteVZhcjI6IGFwcHN5bmMuR3JhcGhxbFR5cGUuaWQoeyBpc1JlcXVpcmVkOiB0cnVlIH0pIH0sXHJcbiAgICAgICAgLy8gICAgIGRhdGFTb3VyY2U6IGRhdGFzb3VyY2VzLmdldCgnbXlzcWwnKSxcclxuICAgICAgICAvLyAgICAgcGlwZWxpbmVDb25maWc6IFtdLCAvLyBBZGQgYXV0aGVudGljYXRpb24gTGFtYmRhIGZ1bmN0aW9uIGhlcmUuXHJcbiAgICAgICAgLy8gfSkpO1xyXG5cclxuICAgICAgICAvLyBBdXRvIGdlbmVyYXRlIG1ldGhvZCBzY2hlbWEuXHJcbiAgICAgICAgLy8gY29uc3Qgc2NoZW1hSGVscGVyID0gbmV3IFNjaGVtYUhlbHBlcihhcGksIGRhdGFzb3VyY2VzLCB0eXBlcyk7XHJcbiAgICAgICAgLy8gdHlwZXMuZm9yRWFjaCgodHlwZSkgPT4ge1xyXG4gICAgICAgIC8vICAgICBzY2hlbWFIZWxwZXIuYWRkVHlwZSh0eXBlKTtcclxuICAgICAgICAvLyB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gVXNlci5hZGRGaWVsZCh7IGZpZWxkTmFtZTogJ3VzZXJTZWN1cml0eVJvbGVzJywgZmllbGQ6IG5ldyBGaWVsZCh7IHJldHVyblR5cGU6IFVzZXJTZWN1cml0eVJvbGUuYXR0cmlidXRlKHsgaXNMaXN0OiB0cnVlIH0pLCBkaXJlY3RpdmVzOiBbRGlyZWN0aXZlLmN1c3RvbSgnQHJlbGF0aW9uKGxvY2FsOiBcIl9pZFwiLCBmb3JlaWduOiBcInVzZXJJZFwiKScpXSB9KSB9KTtcclxuLy8gU2VjdXJpdHlSb2xlLmFkZEZpZWxkKHsgZmllbGROYW1lOiAndXNlclNlY3VyaXR5Um9sZXMnLCBmaWVsZDogbmV3IEZpZWxkKHsgcmV0dXJuVHlwZTogVXNlclNlY3VyaXR5Um9sZS5hdHRyaWJ1dGUoeyBpc0xpc3Q6IHRydWUgfSksIGRpcmVjdGl2ZXM6IFtEaXJlY3RpdmUuY3VzdG9tKCdAcmVsYXRpb24obG9jYWw6IFwiX2lkXCIsIGZvcmVpZ246IFwic2VjdXJpdHlSb2xlSWRcIiknKV0gfSkgfSk7XHJcblxyXG4vLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80MTUxNTY3OS9jYW4teW91LW1ha2UtYS1ncmFwaHFsLXR5cGUtYm90aC1hbi1pbnB1dC1hbmQtb3V0cHV0LXR5cGVcclxuLy8gY29uc3QgVXNlclR5cGUgPSBgXHJcbi8vICAgICBuYW1lOiBTdHJpbmchLFxyXG4vLyAgICAgc3VybmFtZTogU3RyaW5nIVxyXG4vLyBgO1xyXG5cclxuLy8gY29uc3Qgc2NoZW1hID0gZ3JhcGhxbC5idWlsZFNjaGVtYShgXHJcbi8vICAgICB0eXBlIFVzZXIge1xyXG4vLyAgICAgICAgICR7VXNlclR5cGV9XHJcbi8vICAgICB9XHJcbi8vICAgICBpbnB1dCBJbnB1dFVzZXIge1xyXG4vLyAgICAgICAgICR7VXNlclR5cGV9XHJcbi8vICAgICB9XHJcbi8vIGApIl19