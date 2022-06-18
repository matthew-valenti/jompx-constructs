// import { Directive } from '@aws-cdk/aws-appsync-alpha';
// import { CustomDirective } from '../../custom-directive';

// type IDirectiveOperation = 'all' | 'find' | 'findOne' | 'insertOne' | 'insertMany' | 'updateOne' | 'updateMany' | 'upsertOne' | 'upsertMany' | 'deleteOne' | 'deleteMany'; // TODO: Add search.
// export type IDirectiveOperations = IDirectiveOperation[];

// export class AppSyncMySqlCustomDirective extends CustomDirective {

//     public static schema(): string { // TODO: Return graphql.DocumentNode when graphql npm module compile error fixed.
//         return `
//             directive @operations(names: [String]) on OBJECT
//         `;
//     }

//     public static operations(operations: IDirectiveOperations): Directive {
//         return Directive.custom(`@operations(names: "${operations.join()}")`);
//     }

//     // TODO: Support cusor pagination.
//     // public static pagination(type: PaginationType): Directive {
//     //     return Directive.custom(`@pagination(type: "${type}")`);
//     // }
// }

// // Keep this in mind:
// // export declare class ObjectType extends InterfaceType implements IIntermediateType {
// // extends is for extending a class, implements is for implementing an interface