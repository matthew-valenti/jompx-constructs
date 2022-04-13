import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { ISchemaType } from '../../types/app-sync';

// export class JompxResolvableField extends appsync.ResolvableField implements appsync.IField {
//     readonly fieldOptions?: appsync.ResolvableFieldOptions;
//     constructor(options: appsync.ResolvableFieldOptions) {
//         super(options);
//         const resolvableField = new appsync.ResolvableField(options);
//         resolvableField.
//     }
// }

// export class JompxResolvableField extends appsync.ResolvableField {
//     public objectTypeName = '';
//     declare fieldOptions?: appsync.ResolvableFieldOptions;
//     constructor(objectTypeName: string, options: appsync.ResolvableFieldOptions) {
//         super(options);
//         this.objectTypeName = objectTypeName;
//     }
// }

// export interface MNoteAppProperty {
//     objectTypeName: string;
// }

// export class JompxGraphqlType extends appsync.GraphqlType {
//     static jompxType(typeName: string, options?: appsync.BaseTypeOptions): appsync.GraphqlType & MNoteAppProperty {
//         console.log(typeName, options);
//         // return (undefined as unknown as appsync.ObjectType).attribute(options);
//         // const objectType = new appsync.ObjectType(typeName, { definition: { dummy: appsync.GraphqlType.string() } });
//         // return objectType.attribute();
//         // return appsync.GraphqlType.intermediate('', options);
//         // return { ...appsync.GraphqlType.intermediate('', options), { objectTypeName: typeName } };
//     }
// }

// export class JompxGraphqlType extends appsync.GraphqlType {
//     public objectTypeName = '';
//     declare fieldOptions?: appsync.ResolvableFieldOptions;
//     constructor(objectTypeName: string, type: appsync.Type, options?: appsync.GraphqlTypeOptions) {
//         super(type, options);
//         this.objectTypeName = objectTypeName;
//     }
// }

// export class JompxGraphqlType extends appsync.GraphqlType {
//     static objectTypeName = '';
//     static jompxType(objectTypeName: string, options?: appsync.BaseTypeOptions): appsync.GraphqlType {
//         console.log(objectTypeName, options);
//         this.objectTypeName = objectTypeName;
//         // return (undefined as unknown as appsync.ObjectType).attribute(options);
//         // const objectType = new appsync.ObjectType(typeName, { definition: { dummy: appsync.GraphqlType.string() } });
//         // return objectType.attribute();
//         // return appsync.GraphqlType.intermediate('', options);
//         // return { ...appsync.GraphqlType.intermediate('', options), { objectTypeName: typeName } };
//         return appsync.GraphqlType.string();
//     }
// }

/**
 * GoaL: Allow schema to include ResolvableField defintiion with string type instead of actual type to work around the type chicken or egg problem.
 * Create an implemention as close to native AppSync as possible. Do NOT force a developer to learn new custom syntax.
 * See setResolvableFieldType method for more information.
 */

/**
 * Extend GraphqlTypeOptions to include a new typeName parameter.
 */
export interface JompxGraphqlTypeOptions extends appsync.GraphqlTypeOptions {
    readonly typeName: string;
}

/**
 * Extend GraphqlType to create a new datatype to include a new typeName property.
 */
export class JompxGraphqlType extends appsync.GraphqlType {

    public static objectType(options?: JompxGraphqlTypeOptions): appsync.GraphqlType {
        return new JompxGraphqlType(appsync.Type.INTERMEDIATE, options);
    }

    public readonly typeName: string = '';

    protected constructor(type: appsync.Type, options?: JompxGraphqlTypeOptions) {
        super(type, options);
        this.typeName = options?.typeName ?? '';
    }

    /**
     * Resolve a JompxGraphqlType with string type to a GraphqlType with actual type.
     */
    public resolve(schemaTypes: ISchemaType): appsync.GraphqlType {

        const objectType = schemaTypes.objectTypes[this.typeName];
        if (!objectType) throw Error(`Jompx: Type '${this.typeName}' not found for JompxGraphqlType! Add type to schema types`);

        const newGraphqlType = schemaTypes.objectTypes[this.typeName].attribute(this);
        return newGraphqlType;
    }
}