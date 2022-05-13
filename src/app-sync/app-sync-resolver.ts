// eslint-disable-next-line @typescript-eslint/no-require-imports
import get = require('get-value');
import { IAppSyncResolverEvent } from './app-sync.types';

export class AppSyncResolver {
    /**
     * Call a method on a class from values in a AppSync Lambda event.
     * @param classInstance - A class instance.
     * @param event - AppSync Lambda event.
     * @param path - JSON path to method arguments in event.arguments.
     * @returns - Returns the return value of the method.
     */
    public static callMethodFromEvent<T>(classInstance: any, event: IAppSyncResolverEvent, path: string = 'input'): any {
        const eventArguments = get(event.arguments, path, { default: [] });
        return Reflect.apply(classInstance[event.stash.operation as keyof T], undefined, [...Object.values(eventArguments), ...[event]]);
    }
}
