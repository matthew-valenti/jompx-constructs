import { Directive, EnumType, GraphqlType, InputType } from '@aws-cdk/aws-appsync-alpha';
import { ISchemaTypes } from '../app-sync.types';
import { CustomDirective } from '../directive.abstract';

// Define string literal types.

export const authStrategy = ['private', 'public', 'owners', 'groups', 'custom'];
export type ICustomDirectiveAuthStrategy = typeof authStrategy[number];

export const authProvider = ['apiKey', 'iam', 'oidc', 'userPools', 'function'];
export type ICustomDirectiveAuthProvider = typeof authProvider[number];

export const operation = ['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'];
export type ICustomDirectiveOperation = typeof operation[number];

// Define directive interface (to match GraphQL input type).
// Based on AppSync auth rule: https://docs.amplify.aws/cli/graphql/authorization-rules/#public-data-access
export interface ICustomDirectiveAuthRule {
    allow: ICustomDirectiveAuthStrategy;
    provider: ICustomDirectiveAuthProvider;
    ownerField?: string;
    identityClaim?: string;
    groupsField?: string;
    groupClaim?: string;
    groups?: string[];
    operations?: ICustomDirectiveOperation[];
}

// Function (to use when defining GraphQL schema).
export function auth(rules: ICustomDirectiveAuthRule[]): Directive {
    return Directive.custom(`@auth(rules: "${CustomDirective.encodeArguments(rules)}")`);
}

export class AuthDirective extends CustomDirective {

    public definition(): string {
        return 'directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION';
    }

    public schema(schemaTypes: ISchemaTypes): void {

        const authStrategyEnum = new EnumType('AuthStrategy', {
            definition: authStrategy
        });
        schemaTypes.enumTypes.AuthStrategy = authStrategyEnum;

        const authProviderEnum = new EnumType('AuthProvider', {
            definition: authProvider
        });
        schemaTypes.enumTypes.AuthProvider = authProviderEnum;

        const authOperation = new EnumType('AuthOperation', {
            definition: operation
        });
        schemaTypes.enumTypes.AuthOperation = authOperation;

        const authRule = new InputType('AuthRule', {
            definition: {
                allow: authStrategyEnum.attribute({ isRequired: true }), // public, private, owner, groups.
                provider: authProviderEnum.attribute({ isRequired: true }), // Not required in Amplify. Set as required for schema clarity.
                ownerField: GraphqlType.string(), // Defaults to owner.
                identityClaim: GraphqlType.string(), // Defaults to: sub::username.
                groupsField: GraphqlType.string(), // Defaults to field: groups.
                groupClaim: GraphqlType.string(), // Defaults to: cognito:group.
                groups: GraphqlType.string({ isList: true }), // List of Cognito groups.
                operations: authOperation.attribute({ isList: true })
            }
        });
        schemaTypes.inputTypes.AuthRule = authRule;
    }

    public value(directives?: Directive[]): ICustomDirectiveAuthRule[] | undefined {
        const rules = AuthDirective.getIdentifierArgument('auth', 'rules', directives);
        return (rules) ? AuthDirective.decodeArgument(rules) : undefined;
    }
}

