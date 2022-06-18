import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { ISchemaTypes } from '../app-sync.types';
import { CustomDirective } from '../directive.abstract';
import { ICustomDirectiveOperation } from './auth';

// Function (to use when defining GraphQL schema).
export function operations(names: ICustomDirectiveOperation[]): Directive {
    return Directive.custom(`@operations(names: "${names}")`);
}

export class OperationsDirective extends CustomDirective {

    public definition(): string {
        return 'directive @operations(names: [String!]!) on OBJECT';
    }

    public schema(_schemaTypes: ISchemaTypes): void {
    }

    public value(directives?: Directive[]): ICustomDirectiveOperation[] | undefined {
        const value = OperationsDirective.getIdentifierArgument('operations', 'names', directives);
        return (value) ? value.split(',') : undefined;
    }
}

