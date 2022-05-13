import { Directive } from '@aws-cdk/aws-appsync-alpha';

export type PaginationType = 'cursor' | 'offset';

/**
 * Directives.
 * Why? AppSync custom directives are string only and brittle. Type safe directives.
 */

export type IDirectiveAuthOperation = 'read' | 'create' | 'update' | 'delete';

export interface ICustomDirectiveLookup {
    from: string;
    localField: string;
    foreignField: string;
}

export class CustomDirective {

    // AppSync has poor support for directives. Use GraphQL schema syntax instead.
    public static schema(): string { // TODO: Return graphql.DocumentNode when graphql npm module compile error fixed.
        return `
            directive @datasource(name: String) on OBJECT
            directive @source(name: String) on FIELD_DEFINITION | OBJECT
            directive @lookup(from: String, localField: String, foreignField: String) on FIELD_DEFINITION
            directive @readonly(value: String) on FIELD_DEFINITION
        `;
    }

    public static datasource(name: string): Directive {
        return Directive.custom(`@datasource(name: "${name}")`);
    }

    public static source(name: string): Directive {
        return Directive.custom(`@source(name: "${name}")`);
    }

    public static lookup(value: ICustomDirectiveLookup) {
        return Directive.custom(`@lookup(from: "${value.from}", localField: "${value.localField}", foreignField: "${value.foreignField}")`);
    }

    public static readonly(value: boolean): Directive {
        return Directive.custom(`@readonly(value: "${value}")`);
    }

    public static getArgumentByIdentifier(identifier: string, argument: string, directives: any[] | undefined): string | undefined {
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
}
