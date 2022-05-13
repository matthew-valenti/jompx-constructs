import { IAppSyncResolverEvent } from './app-sync.types';
export declare class AppSyncResolver {
    /**
     * Call a method on a class from values in a AppSync Lambda event.
     * @param classInstance - A class instance.
     * @param event - AppSync Lambda event.
     * @param path - JSON path to method arguments in event.arguments.
     * @returns - Returns the return value of the method.
     */
    static callMethodFromEvent<T>(classInstance: any, event: IAppSyncResolverEvent, path?: string): any;
}
