import { Directive } from '@aws-cdk/aws-appsync-alpha';
export declare type PaginationType = 'cursor' | 'offset';
/**
 * Directives.
 * Why? AppSync custom directives are string only and brittle. Type safe directives.
 */
export declare type IDirectiveAuthOperation = 'read' | 'create' | 'update' | 'delete';
export interface ICustomDirectiveLookup {
    from: string;
    localField: string;
    foreignField: string;
}
export declare class CustomDirective {
    static datasource(name: string): Directive;
    static source(name: string): Directive;
    static lookup(value: ICustomDirectiveLookup): Directive;
    static readonly(value: boolean): Directive;
    static getArgumentByIdentifier(identifier: string, argument: string, directives: any[] | undefined): string | undefined;
}
