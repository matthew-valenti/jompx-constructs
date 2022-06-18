// import { Directive } from '@aws-cdk/aws-appsync-alpha';

// export const authStrategy = ['private', 'public', 'owners', 'groups', 'custom'];
// export type ICustomDirectiveAuthStrategy = typeof authStrategy[number];

// export const authProvider = ['apiKey', 'iam', 'oidc', 'userPools', 'function'];
// export type ICustomDirectiveAuthProvider = typeof authProvider[number];

// export const operation = ['find', 'findOne', 'insertOne', 'insertMany', 'updateOne', 'updateMany', 'upsertOne', 'upsertMany', 'deleteOne', 'deleteMany'];
// export type ICustomDirectiveOperation = typeof operation[number];

// // https://docs.amplify.aws/cli/graphql/authorization-rules/#public-data-access
// export interface ICustomDirectiveAuthRule {
//     allow: ICustomDirectiveAuthStrategy;
//     provider: ICustomDirectiveAuthProvider;
//     ownerField?: string;
//     identityClaim?: string;
//     groupsField?: string;
//     groupClaim?: string;
//     groups?: string[];
//     operations?: ICustomDirectiveOperation[];
// }

// export const paginationType = ['cursor', 'offset'];
// export type ICustomDirectivePaginationType = 'cursor' | 'offset';

// export interface ICustomDirectiveLookup {
//     from: string;
//     localField: string;
//     foreignField: string;
// }

// /**
//  * Directives.
//  * Why? AppSync custom directives are string only and brittle. Type safe directives.
//  * Docs: https://www.apollographql.com/docs/apollo-server/schema/creating-directives/
//  * // Directive has: definition, include method, toObject method, schema.
//  */
// export class CustomDirective {

//     // AppSync has poor support for directives. Use GraphQL schema syntax instead.
//     public static definitions(): string { // TODO: Return graphql.DocumentNode when graphql npm module compile error fixed.
//         return `
//             directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION
//             directive @datasource(name: String) on OBJECT
//             directive @lookup(from: String, localField: String, foreignField: String) on FIELD_DEFINITION
//             directive @source(name: String) on FIELD_DEFINITION | OBJECT
//             directive @readonly(value: String) on FIELD_DEFINITION
//         `;
//     }

//     public static auth(rules: ICustomDirectiveAuthRule[]): Directive {
//         return Directive.custom(`@auth(rules: "${this.encodeArgument(rules)}")`);
//     }

//     public static authToObject(directives?: Directive[]): ICustomDirectiveAuthRule[] | undefined {
//         const rules = this.getIdentifierArgument('auth', 'rules', directives);
//         return (rules) ? this.decodeArgument(rules) : undefined;
//     }

//     // Directive allows all Cognito authorized users access to type (i.e. does not require a Cognito user or group).
//     // @aws_cognito_user_pools
//     public static cognitoAllGroups(): Directive {
//         return Directive.custom('@aws_cognito_user_pools');
//     }

//     // Datasource to perform GraphQL operation on.
//     public static datasource(name: string): Directive {
//         return Directive.custom(`@datasource(name: "${name}")`);
//     }

//     public static lookup(value: ICustomDirectiveLookup) {
//         return Directive.custom(`@lookup(from: "${value.from}", localField: "${value.localField}", foreignField: "${value.foreignField}")`);
//     }

//     public static lookupToObject(directives?: Directive[]): ICustomDirectiveLookup | undefined {
//         const from = this.getIdentifierArgument('lookup', 'from', directives);
//         const localField = this.getIdentifierArgument('lookup', 'localField', directives);
//         const foreignField = this.getIdentifierArgument('lookup', 'foreignField', directives);
//         return (from && localField && foreignField) ? { from, localField, foreignField } : undefined;
//     }

//     public static source(name: string): Directive {
//         return Directive.custom(`@source(name: "${name}")`);
//     }

//     public static readonly(value: boolean): Directive {
//         return Directive.custom(`@readonly(value: "${value}")`);
//     }

//     // Get directive argument as string.
//     public static getIdentifierArgument(identifier: string, argument: string, directives: any[] | undefined): string | undefined {
//         let rv;

//         if (typeof (directives) !== 'undefined' && Array.isArray(directives)) {
//             const directive = directives.find((o: any) => o.statement.startsWith(`@${identifier}`));
//             if (directive) {
//                 const regExp = new RegExp(`^@${identifier}\\(${argument}: "(.*)"\\)$`, 'g');
//                 const match = regExp.exec(directive.statement);
//                 if (match?.length === 2) {
//                     rv = match[1];
//                 }
//             }
//         }

//         return rv;
//     }

//     public static encodeArgument(json: any) {
//         return JSON.stringify(json).replace(/"/g, '\\"');
//     }

//     public static decodeArgument(encodedJson: string) {
//         return JSON.parse(encodedJson.replace(/\\"/g, '"'));
//     }
// }
