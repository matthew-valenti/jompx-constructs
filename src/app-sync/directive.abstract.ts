import { ISchemaTypes } from './app-sync.types';

/**
 * Abstract custom directive class. Custom directives to extend this class and implement abstract methods.
 * AppSync supports string value directives only.
 * Documentation: https://www.apollographql.com/docs/apollo-server/schema/creating-directives/
 */
export abstract class CustomDirective {

    // e.g. @auth(rules: "[{\"allow\":\"private\",\"provider\":\"iam\"}]")
    // e.g. @lookup(from: "${lookup.from}", localField: "${lookup.localField}", foreignField: "${lookup.foreignField}
    public static encodeArguments(json: any): string {
        return JSON.stringify(json).replace(/"/g, '\\"');
    }

    public static decodeArgument(encodedJson: string) {
        return JSON.parse(encodedJson.replace(/\\"/g, '"'));
    }

    // Get directive argument as string.
    public static getIdentifierArgument(identifier: string, argument: string, directives: any[] | undefined): string | undefined {
        let rv;

        if (typeof (directives) !== 'undefined' && Array.isArray(directives)) {
            const directive = directives.find((o: any) => o.statement.startsWith(`@${identifier}`));
            if (directive) {
                const regExp = new RegExp(`^@${identifier}\\(${argument}: "(.*)"\\)$`, 'g');
                const match = regExp.exec(directive.statement);
                if (match?.length === 2) {
                    rv = match[1];
                }
            }
        }

        return rv;
    }

    /**
     * Directive definition (to be added to GraphQL schema).
     * Return string e.g. directive @auth(rules: [AuthRule!]!) on OBJECT | INTERFACE | FIELD_DEFINITION
     */
    abstract definition(): string;

    /**
     * Directive schema (to be to added to GraphQL schema).
     * e.g. Auth directives adds enums and input types (required to support the definition).
     * @param _schemaTypes - Global list of types.
     */
    schema(_schemaTypes: ISchemaTypes): void {
    }

    /**
     * Get value of Auth directive from array of directs on a type.
     * Used primarly for implementation of the directive in datasources.
     * Return one primitive or object type.
     * AppSync only supports string values for directives. Encode/decode values using the base methods as needed (e.g. encodeArgument, decodeArgument).
     * @param directives - Array of directives (on a type).
     */
    // abstract value(directives?: Directive[]): void;
    // JSII doesn't support a void return type! https://github.com/aws/jsii/issues/3410
    // error JSII5003: "@jompx/constructs.AuthDirective#value" changes the return type to "array<@jompx/constructs.ICustomDirectiveAuthRule>" when overriding @jompx/constructs.CustomDirective. Change it to "void"
}