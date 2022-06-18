import { AuthorizationType, Directive, GraphqlType, ObjectType } from '@aws-cdk/aws-appsync-alpha';
import { ISchemaTypes } from '../app-sync.types';
import { cognito } from '../directives/cognito';
import { CustomSchema } from './schema.abstract';

export class PaginationOffsetSchema extends CustomSchema {

    public schema(schemaTypes: ISchemaTypes, activeAuthorizationTypes: AuthorizationType[]): void {

        const pageInfoOffset = new ObjectType('PageInfoOffset', {
            definition: {
                skip: GraphqlType.int({ isRequired: true }),
                limit: GraphqlType.int({ isRequired: true })
            },
            directives: [
                ... activeAuthorizationTypes.includes(AuthorizationType.IAM) ? [Directive.iam()] : [],
                ... activeAuthorizationTypes.includes(AuthorizationType.USER_POOL) ? [cognito()] : [] // Allow all Cognito authenticated users.
            ]
        });
        schemaTypes.objectTypes.PageInfoOffset = pageInfoOffset;
    }
}

/*
TODO: Would we consider this pagination. Where is this from? MongoDB?

type PaginationInfo {
  # Total number of pages
  totalPages: Int!

  # Total number of items
  totalItems: Int!

  # Current page number
  page: Int!

  # Number of items per page
  perPage: Int!

  # When paginating forwards, are there more items?
  hasNextPage: Boolean!

  # When paginating backwards, are there more items?
  hasPreviousPage: Boolean!
}
*/