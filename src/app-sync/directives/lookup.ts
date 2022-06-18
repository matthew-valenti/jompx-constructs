import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '../directive.abstract';

// Define directive interface.
export interface ICustomDirectiveLookup {
    from: string;
    localField: string;
    foreignField: string;
}

// Function (to use when defining GraphQL schema).
export function lookup(value: ICustomDirectiveLookup): Directive {
    // return Directive.custom(`@lookup(from: "${lookup.from}", localField: "${lookup.localField}", foreignField: "${lookup.foreignField}")`);
    return Directive.custom(`@lookup(from: "${value.from}", localField: "${value.localField}", foreignField: "${value.foreignField}")`);
}

export class LookupDirective extends CustomDirective {

    public definition(): string {
        return 'directive @lookup(from: String!, localField: String!, foreignField: String!) on FIELD_DEFINITION';
    }

    // public schema(schemaTypes: ISchemaTypes): void {

    //     const lookupDirective = new InputType('LookupDirective', {
    //         definition: {
    //             from: GraphqlType.string({ isRequired: true }),
    //             localField: GraphqlType.string({ isRequired: true }),
    //             foreignField: GraphqlType.string({ isRequired: true })
    //         }
    //     });
    //     schemaTypes.inputTypes.LookupDirective = lookupDirective;
    // }

    public value(directives?: Directive[]): ICustomDirectiveLookup | undefined {
        const from = LookupDirective.getIdentifierArgument('lookup', 'from', directives);
        const localField = LookupDirective.getIdentifierArgument('lookup', 'localField', directives);
        const foreignField = LookupDirective.getIdentifierArgument('lookup', 'foreignField', directives);
        return (from && localField && foreignField) ? { from, localField, foreignField } : undefined;
    }
}

// import { Directive, GraphqlType, InputType } from '@aws-cdk/aws-appsync-alpha';
// import { ISchemaTypes } from '../app-sync.types';
// import { CustomDirective } from '../directive.abstract';

// // Define directive interface (to match GraphQL input type).
// export interface ICustomDirectiveLookup {
//     from: string;
//     localField: string;
//     foreignField: string;
// }

// // Function (to use when defining GraphQL schema).
// export function lookup(value: ICustomDirectiveLookup): Directive {
//     // return Directive.custom(`@lookup(from: "${lookup.from}", localField: "${lookup.localField}", foreignField: "${lookup.foreignField}")`);
//     return Directive.custom(`@lookup(lookup: "${CustomDirective.encodeArguments(value)}")`);
// }

// export class LookupDirective extends CustomDirective {

//     public definition(): string {
//         return 'directive @lookup(lookup: LookupDirective) on FIELD_DEFINITION';
//     }

//     public schema(schemaTypes: ISchemaTypes): void {

//         const lookupDirective = new InputType('LookupDirective', {
//             definition: {
//                 from: GraphqlType.string({ isRequired: true }),
//                 localField: GraphqlType.string({ isRequired: true }),
//                 foreignField: GraphqlType.string({ isRequired: true })
//             }
//         });
//         schemaTypes.inputTypes.LookupDirective = lookupDirective;
//     }

//     public value(directives?: Directive[]): ICustomDirectiveLookup[] | undefined {
//         const value = LookupDirective.getIdentifierArgument('lookup', 'lookup', directives);
//         return (value) ? LookupDirective.decodeArgument(value) : undefined;
//     }
// }

