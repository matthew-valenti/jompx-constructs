import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '../../custom-directive';
declare type IDirectiveOperation = 'find' | 'findOne' | 'insertOne' | 'insertMany' | 'updateOne' | 'updateMany' | 'deleteOne' | 'deleteMany' | 'destroyOne' | 'destoryMany';
export declare type IDirectiveOperations = IDirectiveOperation[];
export declare class AppSyncMySqlCustomDirective extends CustomDirective {
    static operations(operations: IDirectiveOperations): Directive;
}
export {};
