"use strict";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAtc3luYy9jdXN0b20tZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwwREFBMEQ7QUFFMUQsbUZBQW1GO0FBQ25GLDBFQUEwRTtBQUUxRSxrRkFBa0Y7QUFDbEYsMEVBQTBFO0FBRTFFLDRKQUE0SjtBQUM1SixvRUFBb0U7QUFFcEUsa0ZBQWtGO0FBQ2xGLDhDQUE4QztBQUM5QywyQ0FBMkM7QUFDM0MsOENBQThDO0FBQzlDLDJCQUEyQjtBQUMzQiw4QkFBOEI7QUFDOUIsNEJBQTRCO0FBQzVCLDJCQUEyQjtBQUMzQix5QkFBeUI7QUFDekIsZ0RBQWdEO0FBQ2hELElBQUk7QUFFSixzREFBc0Q7QUFDdEQsb0VBQW9FO0FBRXBFLDRDQUE0QztBQUM1QyxvQkFBb0I7QUFDcEIsMEJBQTBCO0FBQzFCLDRCQUE0QjtBQUM1QixJQUFJO0FBRUosTUFBTTtBQUNOLGlCQUFpQjtBQUNqQix1RkFBdUY7QUFDdkYsd0ZBQXdGO0FBQ3hGLDRFQUE0RTtBQUM1RSxNQUFNO0FBQ04saUNBQWlDO0FBRWpDLHFGQUFxRjtBQUNyRiw4SEFBOEg7QUFDOUgsbUJBQW1CO0FBQ25CLDRGQUE0RjtBQUM1Riw0REFBNEQ7QUFDNUQsNEdBQTRHO0FBQzVHLDJFQUEyRTtBQUMzRSxxRUFBcUU7QUFDckUsYUFBYTtBQUNiLFFBQVE7QUFFUix5RUFBeUU7QUFDekUsb0ZBQW9GO0FBQ3BGLFFBQVE7QUFFUixxR0FBcUc7QUFDckcsaUZBQWlGO0FBQ2pGLG1FQUFtRTtBQUNuRSxRQUFRO0FBRVIsdUhBQXVIO0FBQ3ZILGlDQUFpQztBQUNqQyxvREFBb0Q7QUFDcEQsOERBQThEO0FBQzlELFFBQVE7QUFFUixxREFBcUQ7QUFDckQsMERBQTBEO0FBQzFELG1FQUFtRTtBQUNuRSxRQUFRO0FBRVIsNERBQTREO0FBQzVELCtJQUErSTtBQUMvSSxRQUFRO0FBRVIsbUdBQW1HO0FBQ25HLGlGQUFpRjtBQUNqRiw2RkFBNkY7QUFDN0YsaUdBQWlHO0FBQ2pHLHdHQUF3RztBQUN4RyxRQUFRO0FBRVIsc0RBQXNEO0FBQ3RELCtEQUErRDtBQUMvRCxRQUFRO0FBRVIsMERBQTBEO0FBQzFELG1FQUFtRTtBQUNuRSxRQUFRO0FBRVIsMkNBQTJDO0FBQzNDLHFJQUFxSTtBQUNySSxrQkFBa0I7QUFFbEIsa0ZBQWtGO0FBQ2xGLHVHQUF1RztBQUN2RywrQkFBK0I7QUFDL0IsK0ZBQStGO0FBQy9GLGtFQUFrRTtBQUNsRSw2Q0FBNkM7QUFDN0MscUNBQXFDO0FBQ3JDLG9CQUFvQjtBQUNwQixnQkFBZ0I7QUFDaEIsWUFBWTtBQUVaLHFCQUFxQjtBQUNyQixRQUFRO0FBRVIsZ0RBQWdEO0FBQ2hELDREQUE0RDtBQUM1RCxRQUFRO0FBRVIsMERBQTBEO0FBQzFELCtEQUErRDtBQUMvRCxRQUFRO0FBQ1IsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB7IERpcmVjdGl2ZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuXHJcbi8vIGV4cG9ydCBjb25zdCBhdXRoU3RyYXRlZ3kgPSBbJ3ByaXZhdGUnLCAncHVibGljJywgJ293bmVycycsICdncm91cHMnLCAnY3VzdG9tJ107XHJcbi8vIGV4cG9ydCB0eXBlIElDdXN0b21EaXJlY3RpdmVBdXRoU3RyYXRlZ3kgPSB0eXBlb2YgYXV0aFN0cmF0ZWd5W251bWJlcl07XHJcblxyXG4vLyBleHBvcnQgY29uc3QgYXV0aFByb3ZpZGVyID0gWydhcGlLZXknLCAnaWFtJywgJ29pZGMnLCAndXNlclBvb2xzJywgJ2Z1bmN0aW9uJ107XHJcbi8vIGV4cG9ydCB0eXBlIElDdXN0b21EaXJlY3RpdmVBdXRoUHJvdmlkZXIgPSB0eXBlb2YgYXV0aFByb3ZpZGVyW251bWJlcl07XHJcblxyXG4vLyBleHBvcnQgY29uc3Qgb3BlcmF0aW9uID0gWydmaW5kJywgJ2ZpbmRPbmUnLCAnaW5zZXJ0T25lJywgJ2luc2VydE1hbnknLCAndXBkYXRlT25lJywgJ3VwZGF0ZU1hbnknLCAndXBzZXJ0T25lJywgJ3Vwc2VydE1hbnknLCAnZGVsZXRlT25lJywgJ2RlbGV0ZU1hbnknXTtcclxuLy8gZXhwb3J0IHR5cGUgSUN1c3RvbURpcmVjdGl2ZU9wZXJhdGlvbiA9IHR5cGVvZiBvcGVyYXRpb25bbnVtYmVyXTtcclxuXHJcbi8vIC8vIGh0dHBzOi8vZG9jcy5hbXBsaWZ5LmF3cy9jbGkvZ3JhcGhxbC9hdXRob3JpemF0aW9uLXJ1bGVzLyNwdWJsaWMtZGF0YS1hY2Nlc3NcclxuLy8gZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tRGlyZWN0aXZlQXV0aFJ1bGUge1xyXG4vLyAgICAgYWxsb3c6IElDdXN0b21EaXJlY3RpdmVBdXRoU3RyYXRlZ3k7XHJcbi8vICAgICBwcm92aWRlcjogSUN1c3RvbURpcmVjdGl2ZUF1dGhQcm92aWRlcjtcclxuLy8gICAgIG93bmVyRmllbGQ/OiBzdHJpbmc7XHJcbi8vICAgICBpZGVudGl0eUNsYWltPzogc3RyaW5nO1xyXG4vLyAgICAgZ3JvdXBzRmllbGQ/OiBzdHJpbmc7XHJcbi8vICAgICBncm91cENsYWltPzogc3RyaW5nO1xyXG4vLyAgICAgZ3JvdXBzPzogc3RyaW5nW107XHJcbi8vICAgICBvcGVyYXRpb25zPzogSUN1c3RvbURpcmVjdGl2ZU9wZXJhdGlvbltdO1xyXG4vLyB9XHJcblxyXG4vLyBleHBvcnQgY29uc3QgcGFnaW5hdGlvblR5cGUgPSBbJ2N1cnNvcicsICdvZmZzZXQnXTtcclxuLy8gZXhwb3J0IHR5cGUgSUN1c3RvbURpcmVjdGl2ZVBhZ2luYXRpb25UeXBlID0gJ2N1cnNvcicgfCAnb2Zmc2V0JztcclxuXHJcbi8vIGV4cG9ydCBpbnRlcmZhY2UgSUN1c3RvbURpcmVjdGl2ZUxvb2t1cCB7XHJcbi8vICAgICBmcm9tOiBzdHJpbmc7XHJcbi8vICAgICBsb2NhbEZpZWxkOiBzdHJpbmc7XHJcbi8vICAgICBmb3JlaWduRmllbGQ6IHN0cmluZztcclxuLy8gfVxyXG5cclxuLy8gLyoqXHJcbi8vICAqIERpcmVjdGl2ZXMuXHJcbi8vICAqIFdoeT8gQXBwU3luYyBjdXN0b20gZGlyZWN0aXZlcyBhcmUgc3RyaW5nIG9ubHkgYW5kIGJyaXR0bGUuIFR5cGUgc2FmZSBkaXJlY3RpdmVzLlxyXG4vLyAgKiBEb2NzOiBodHRwczovL3d3dy5hcG9sbG9ncmFwaHFsLmNvbS9kb2NzL2Fwb2xsby1zZXJ2ZXIvc2NoZW1hL2NyZWF0aW5nLWRpcmVjdGl2ZXMvXHJcbi8vICAqIC8vIERpcmVjdGl2ZSBoYXM6IGRlZmluaXRpb24sIGluY2x1ZGUgbWV0aG9kLCB0b09iamVjdCBtZXRob2QsIHNjaGVtYS5cclxuLy8gICovXHJcbi8vIGV4cG9ydCBjbGFzcyBDdXN0b21EaXJlY3RpdmUge1xyXG5cclxuLy8gICAgIC8vIEFwcFN5bmMgaGFzIHBvb3Igc3VwcG9ydCBmb3IgZGlyZWN0aXZlcy4gVXNlIEdyYXBoUUwgc2NoZW1hIHN5bnRheCBpbnN0ZWFkLlxyXG4vLyAgICAgcHVibGljIHN0YXRpYyBkZWZpbml0aW9ucygpOiBzdHJpbmcgeyAvLyBUT0RPOiBSZXR1cm4gZ3JhcGhxbC5Eb2N1bWVudE5vZGUgd2hlbiBncmFwaHFsIG5wbSBtb2R1bGUgY29tcGlsZSBlcnJvciBmaXhlZC5cclxuLy8gICAgICAgICByZXR1cm4gYFxyXG4vLyAgICAgICAgICAgICBkaXJlY3RpdmUgQGF1dGgocnVsZXM6IFtBdXRoUnVsZSFdISkgb24gT0JKRUNUIHwgSU5URVJGQUNFIHwgRklFTERfREVGSU5JVElPTlxyXG4vLyAgICAgICAgICAgICBkaXJlY3RpdmUgQGRhdGFzb3VyY2UobmFtZTogU3RyaW5nKSBvbiBPQkpFQ1RcclxuLy8gICAgICAgICAgICAgZGlyZWN0aXZlIEBsb29rdXAoZnJvbTogU3RyaW5nLCBsb2NhbEZpZWxkOiBTdHJpbmcsIGZvcmVpZ25GaWVsZDogU3RyaW5nKSBvbiBGSUVMRF9ERUZJTklUSU9OXHJcbi8vICAgICAgICAgICAgIGRpcmVjdGl2ZSBAc291cmNlKG5hbWU6IFN0cmluZykgb24gRklFTERfREVGSU5JVElPTiB8IE9CSkVDVFxyXG4vLyAgICAgICAgICAgICBkaXJlY3RpdmUgQHJlYWRvbmx5KHZhbHVlOiBTdHJpbmcpIG9uIEZJRUxEX0RFRklOSVRJT05cclxuLy8gICAgICAgICBgO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgYXV0aChydWxlczogSUN1c3RvbURpcmVjdGl2ZUF1dGhSdWxlW10pOiBEaXJlY3RpdmUge1xyXG4vLyAgICAgICAgIHJldHVybiBEaXJlY3RpdmUuY3VzdG9tKGBAYXV0aChydWxlczogXCIke3RoaXMuZW5jb2RlQXJndW1lbnQocnVsZXMpfVwiKWApO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgYXV0aFRvT2JqZWN0KGRpcmVjdGl2ZXM/OiBEaXJlY3RpdmVbXSk6IElDdXN0b21EaXJlY3RpdmVBdXRoUnVsZVtdIHwgdW5kZWZpbmVkIHtcclxuLy8gICAgICAgICBjb25zdCBydWxlcyA9IHRoaXMuZ2V0SWRlbnRpZmllckFyZ3VtZW50KCdhdXRoJywgJ3J1bGVzJywgZGlyZWN0aXZlcyk7XHJcbi8vICAgICAgICAgcmV0dXJuIChydWxlcykgPyB0aGlzLmRlY29kZUFyZ3VtZW50KHJ1bGVzKSA6IHVuZGVmaW5lZDtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICAvLyBEaXJlY3RpdmUgYWxsb3dzIGFsbCBDb2duaXRvIGF1dGhvcml6ZWQgdXNlcnMgYWNjZXNzIHRvIHR5cGUgKGkuZS4gZG9lcyBub3QgcmVxdWlyZSBhIENvZ25pdG8gdXNlciBvciBncm91cCkuXHJcbi8vICAgICAvLyBAYXdzX2NvZ25pdG9fdXNlcl9wb29sc1xyXG4vLyAgICAgcHVibGljIHN0YXRpYyBjb2duaXRvQWxsR3JvdXBzKCk6IERpcmVjdGl2ZSB7XHJcbi8vICAgICAgICAgcmV0dXJuIERpcmVjdGl2ZS5jdXN0b20oJ0Bhd3NfY29nbml0b191c2VyX3Bvb2xzJyk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLy8gRGF0YXNvdXJjZSB0byBwZXJmb3JtIEdyYXBoUUwgb3BlcmF0aW9uIG9uLlxyXG4vLyAgICAgcHVibGljIHN0YXRpYyBkYXRhc291cmNlKG5hbWU6IHN0cmluZyk6IERpcmVjdGl2ZSB7XHJcbi8vICAgICAgICAgcmV0dXJuIERpcmVjdGl2ZS5jdXN0b20oYEBkYXRhc291cmNlKG5hbWU6IFwiJHtuYW1lfVwiKWApO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgbG9va3VwKHZhbHVlOiBJQ3VzdG9tRGlyZWN0aXZlTG9va3VwKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIERpcmVjdGl2ZS5jdXN0b20oYEBsb29rdXAoZnJvbTogXCIke3ZhbHVlLmZyb219XCIsIGxvY2FsRmllbGQ6IFwiJHt2YWx1ZS5sb2NhbEZpZWxkfVwiLCBmb3JlaWduRmllbGQ6IFwiJHt2YWx1ZS5mb3JlaWduRmllbGR9XCIpYCk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHVibGljIHN0YXRpYyBsb29rdXBUb09iamVjdChkaXJlY3RpdmVzPzogRGlyZWN0aXZlW10pOiBJQ3VzdG9tRGlyZWN0aXZlTG9va3VwIHwgdW5kZWZpbmVkIHtcclxuLy8gICAgICAgICBjb25zdCBmcm9tID0gdGhpcy5nZXRJZGVudGlmaWVyQXJndW1lbnQoJ2xvb2t1cCcsICdmcm9tJywgZGlyZWN0aXZlcyk7XHJcbi8vICAgICAgICAgY29uc3QgbG9jYWxGaWVsZCA9IHRoaXMuZ2V0SWRlbnRpZmllckFyZ3VtZW50KCdsb29rdXAnLCAnbG9jYWxGaWVsZCcsIGRpcmVjdGl2ZXMpO1xyXG4vLyAgICAgICAgIGNvbnN0IGZvcmVpZ25GaWVsZCA9IHRoaXMuZ2V0SWRlbnRpZmllckFyZ3VtZW50KCdsb29rdXAnLCAnZm9yZWlnbkZpZWxkJywgZGlyZWN0aXZlcyk7XHJcbi8vICAgICAgICAgcmV0dXJuIChmcm9tICYmIGxvY2FsRmllbGQgJiYgZm9yZWlnbkZpZWxkKSA/IHsgZnJvbSwgbG9jYWxGaWVsZCwgZm9yZWlnbkZpZWxkIH0gOiB1bmRlZmluZWQ7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgcHVibGljIHN0YXRpYyBzb3VyY2UobmFtZTogc3RyaW5nKTogRGlyZWN0aXZlIHtcclxuLy8gICAgICAgICByZXR1cm4gRGlyZWN0aXZlLmN1c3RvbShgQHNvdXJjZShuYW1lOiBcIiR7bmFtZX1cIilgKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5KHZhbHVlOiBib29sZWFuKTogRGlyZWN0aXZlIHtcclxuLy8gICAgICAgICByZXR1cm4gRGlyZWN0aXZlLmN1c3RvbShgQHJlYWRvbmx5KHZhbHVlOiBcIiR7dmFsdWV9XCIpYCk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLy8gR2V0IGRpcmVjdGl2ZSBhcmd1bWVudCBhcyBzdHJpbmcuXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIGdldElkZW50aWZpZXJBcmd1bWVudChpZGVudGlmaWVyOiBzdHJpbmcsIGFyZ3VtZW50OiBzdHJpbmcsIGRpcmVjdGl2ZXM6IGFueVtdIHwgdW5kZWZpbmVkKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcclxuLy8gICAgICAgICBsZXQgcnY7XHJcblxyXG4vLyAgICAgICAgIGlmICh0eXBlb2YgKGRpcmVjdGl2ZXMpICE9PSAndW5kZWZpbmVkJyAmJiBBcnJheS5pc0FycmF5KGRpcmVjdGl2ZXMpKSB7XHJcbi8vICAgICAgICAgICAgIGNvbnN0IGRpcmVjdGl2ZSA9IGRpcmVjdGl2ZXMuZmluZCgobzogYW55KSA9PiBvLnN0YXRlbWVudC5zdGFydHNXaXRoKGBAJHtpZGVudGlmaWVyfWApKTtcclxuLy8gICAgICAgICAgICAgaWYgKGRpcmVjdGl2ZSkge1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc3QgcmVnRXhwID0gbmV3IFJlZ0V4cChgXkAke2lkZW50aWZpZXJ9XFxcXCgke2FyZ3VtZW50fTogXCIoLiopXCJcXFxcKSRgLCAnZycpO1xyXG4vLyAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSByZWdFeHAuZXhlYyhkaXJlY3RpdmUuc3RhdGVtZW50KTtcclxuLy8gICAgICAgICAgICAgICAgIGlmIChtYXRjaD8ubGVuZ3RoID09PSAyKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgcnYgPSBtYXRjaFsxXTtcclxuLy8gICAgICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgcmV0dXJuIHJ2O1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgZW5jb2RlQXJndW1lbnQoanNvbjogYW55KSB7XHJcbi8vICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGpzb24pLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKTtcclxuLy8gICAgIH1cclxuXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIGRlY29kZUFyZ3VtZW50KGVuY29kZWRKc29uOiBzdHJpbmcpIHtcclxuLy8gICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShlbmNvZGVkSnNvbi5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykpO1xyXG4vLyAgICAgfVxyXG4vLyB9XHJcbiJdfQ==