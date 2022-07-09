import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '../directive.abstract';

// Define string literal types.

export const paginationType = ['cursor', 'offset'];
export type ICustomDirectivePaginationType = 'cursor' | 'offset';


// Function (to use when defining GraphQL schema).
// TODO: Can we delete this since now we'll have find and findCursor operations?
export function pagination(type: ICustomDirectivePaginationType): Directive {
    return Directive.custom(`@pagination(type: "${type}")`);
}

export class PaginationDirective extends CustomDirective {

    public definition(): string {
        return 'directive @pagination(type: String) on OBJECT';
    }

    public value(directives?: Directive[]): ICustomDirectivePaginationType | undefined {
        return PaginationDirective.getIdentifierArgument('pagination', 'type', directives) as ICustomDirectivePaginationType;
    }
}