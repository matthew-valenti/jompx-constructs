// eslint-disable-next-line @typescript-eslint/no-require-imports
import get = require('get-value');
import { IAppSyncMethodProps } from './app-sync.types';

export class AppSyncResolver {
    /**
     * Call a method on a class from values in a AppSync Lambda event.
     * @param classInstance - A class instance.
     * @param event - AppSync Lambda event.
     * @param path - JSON path to method arguments in event.arguments.
     * @returns - Returns the return value of the method.
     */
    public static callMethodFromEvent<T>(classInstance: any, event: any, path: string = 'input'): any {

        const eventArguments: any[] = get(event.arguments, path) ? Object.values(get(event.arguments, path)) : [];

        const cognito = {
            sub: event?.identity?.claims?.sub,
            email: event?.identity?.claims?.email,
            groups: event?.identity?.groups,
            authorization: event?.request?.headers?.authorization
        };

        // We must at least pass the event. Methods might need any type of event information.
        // Break out Cognito properties (if Cognito auth) for convenience only.
        // We must Cognito authorization to any methods that want to call GraphQL with the calling user Cognito permissions.
        const props: IAppSyncMethodProps = {
            ...(cognito?.sub && { cognito }),
            event
        };

        eventArguments.push(props);
        return Reflect.apply(classInstance[event.stash.operation as keyof T], undefined, eventArguments);
    }
}
