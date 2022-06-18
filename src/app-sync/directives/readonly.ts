import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '../directive.abstract';

// Function (to use when defining GraphQL schema).
export function readonly(value?: boolean): Directive {
    return Directive.custom(`@readonly(value: "${value ?? true}")`);
}

export class ReadonlyDirective extends CustomDirective {

    public definition(): string {
        return 'directive @readonly(value: String) on FIELD_DEFINITION';
    }

    public value(directives?: Directive[]): boolean | undefined {
        return !!ReadonlyDirective.getIdentifierArgument('readonly', 'value', directives);
    }
}