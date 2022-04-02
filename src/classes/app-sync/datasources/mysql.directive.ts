import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '../directive';

type IDirectiveOperation = 'find' | 'findOne' | 'insertOne' | 'insertMany' | 'updateOne' | 'updateMany' | 'deleteOne' | 'deleteMany' | 'destroyOne' | 'destoryMany'; // search? upsert?
export type IDirectiveOperations = IDirectiveOperation[];

export class AppSyncMySqlCustomDirective extends CustomDirective {

    public static operations(operations: IDirectiveOperations): Directive {
        return Directive.custom(`@operation(names: "${operations.join()}")`);
    }

    // TODO: Support cusor pagination.
    // public static pagination(type: PaginationType): Directive {
    //     return Directive.custom(`@pagination(type: "${type}")`);
    // }
}