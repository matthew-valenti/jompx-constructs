import { Directive } from '@aws-cdk/aws-appsync-alpha';
export declare type PaginationType = 'cursor' | 'offset';
/**
 * Directives.
 * Why? AppSync custom directives are string only and brittle. Type safe directives.
 */
export declare type IDirectiveAuthOperation = 'read' | 'create' | 'update' | 'delete';
export declare class CustomDirective {
    static datasource(name: string): Directive;
    static getArgumentByIdentifier(directives: any[] | undefined, identifier: string, argument: string): string | undefined;
}
