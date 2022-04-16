import * as appsync from '@aws-cdk/aws-appsync-alpha';
import { ISchemaTypes } from './app-sync.types';

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
    public resolve(schemaTypes: ISchemaTypes): appsync.GraphqlType {

        const objectType = schemaTypes.objectTypes[this.typeName];
        if (!objectType) throw Error(`Jompx: Type '${this.typeName}' not found for JompxGraphqlType! Add type to schema types`);

        const newGraphqlType = schemaTypes.objectTypes[this.typeName].attribute(this);
        return newGraphqlType;
    }
}