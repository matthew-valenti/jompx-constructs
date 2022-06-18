import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '../directive.abstract';

// Function (to use when defining GraphQL schema).
export function source(name: string): Directive {
    return Directive.custom(`@source(name: "${name}")`);
}

export class SourceDirective extends CustomDirective {

    public definition(): string {
        return 'directive @source(name: String) on FIELD_DEFINITION | OBJECT';
    }

    public value(directives?: Directive[]): string | undefined {
        return SourceDirective.getIdentifierArgument('source', 'name', directives);
    }
}
