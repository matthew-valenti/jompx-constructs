import { AuthorizationType, Directive, GraphqlType, ObjectType } from '@aws-cdk/aws-appsync-alpha';
import { ISchemaTypes } from '../app-sync.types';
import { cognito } from '../directives/cognito';
import { CustomSchema } from './schema.abstract';

export class PaginationCursorSchema extends CustomSchema {

    public schema(schemaTypes: ISchemaTypes, activeAuthorizationTypes: AuthorizationType[]): void {

        const pageInfoCursor = new ObjectType('PageInfoCursor', {
            definition: {
                hasPreviousPage: GraphqlType.boolean({ isRequired: true }),
                hasNextPage: GraphqlType.boolean({ isRequired: true }),
                startCursor: GraphqlType.string({ isRequired: true }),
                endCursor: GraphqlType.string({ isRequired: true })
            },
            directives: [
                ... activeAuthorizationTypes.includes(AuthorizationType.IAM) ? [Directive.iam()] : [],
                ... activeAuthorizationTypes.includes(AuthorizationType.USER_POOL) ? [cognito()] : [] // Allow all Cognito authenticated users.
            ]
        });
        schemaTypes.objectTypes.PageInfoCursor = pageInfoCursor;
    }
}
