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
export declare class JompxGraphqlType extends appsync.GraphqlType {
    static objectType(options?: JompxGraphqlTypeOptions): appsync.GraphqlType;
    readonly typeName: string;
    protected constructor(type: appsync.Type, options?: JompxGraphqlTypeOptions);
    /**
     * Resolve a JompxGraphqlType with string type to a GraphqlType with actual type.
     */
    resolve(schemaTypes: ISchemaTypes): appsync.GraphqlType;
}
