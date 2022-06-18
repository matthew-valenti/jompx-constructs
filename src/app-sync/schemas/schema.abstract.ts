import { AuthorizationType } from '@aws-cdk/aws-appsync-alpha';
import { ISchemaTypes } from '../app-sync.types';

/**
 * Abstract custom schema class. Implement global schemas for use across all datasources.
 * Documentation: https://www.apollographql.com/docs/apollo-server/schema/creating-directives/
 */
export abstract class CustomSchema {

    /**
     * Schema (to be to added to GraphQL schema).
     * @param schemaTypes - Global list of types.
     */
    schema(_schemaType: ISchemaTypes, _activeAuthorizationTypes?: AuthorizationType[]): void {
    }
}