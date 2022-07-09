import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '../directive.abstract';

// Function (to use when defining GraphQL schema).
export function datasource(name: string): Directive {
    return Directive.custom(`@datasource(name: "${name}")`);
}

// TODO: Or use this syntax?
// export const datasource = (name: string): Directive => {
//     return Directive.custom(`@datasource(name: "${name}")`);
// };

export class DatasourceDirective extends CustomDirective {

    public definition(): string {
        return 'directive @datasource(name: String) on FIELD_DEFINITION | OBJECT';
    }

    public value(directives?: Directive[]): string | undefined {
        return DatasourceDirective.getIdentifierArgument('datasource', 'name', directives);
    }
}