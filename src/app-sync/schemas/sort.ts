// import { EnumType, GraphqlType, InputType } from '@aws-cdk/aws-appsync-alpha';
// import { ISchemaTypes } from '../app-sync.types';
// import { CustomSchema } from './schema.abstract';

// export const sortDirection = ['asc', 'desc'];
// export type ISortDirection = typeof sortDirection[number];

// export class SortSchema extends CustomSchema {

//     public schema(schemaTypes: ISchemaTypes): void {

//         const sortDirectionEnum = new EnumType('SortDirection', {
//             definition: sortDirection
//         });
//         schemaTypes.enumTypes.SortDirection = sortDirectionEnum;

//         const sortInput = new InputType('SortInput', {
//             definition: {
//                 fieldName: GraphqlType.string({ isRequired: true }),
//                 direction: GraphqlType.int({ isRequired: true })
//             }
//         });
//         schemaTypes.inputTypes.SortInput = sortInput;
//     }
// }
