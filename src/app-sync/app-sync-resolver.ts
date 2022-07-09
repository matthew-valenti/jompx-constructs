// eslint-disable-next-line @typescript-eslint/no-require-imports
import { IAppSyncMethodProps } from './app-sync.types';

export class AppSyncResolver {
    /**
     * Call a method on a class from values in a AppSync Lambda event.
     * @param classInstance - A class instance.
     * @param event - AppSync Lambda event.
     * @returns - Returns the return value of the method.
     */
    public static callMethodFromEvent<T>(classInstance: any, event: any): any {

        // Get event arguments from event as an array of values (required for Reflect method below).
        const eventArguments: any[] = event?.arguments ? Object.values(event.arguments) : [];
        console.log('eventArguments', eventArguments);

        // Organize cognito specific variables.
        const cognito = {
            sub: event?.identity?.claims?.sub,
            email: event?.identity?.claims?.email,
            groups: event?.identity?.groups,
            authorization: event?.request?.headers?.authorization
        };
        console.log('cognito', cognito);

        // We must at least pass the event. Methods might need any type of event information.
        // Break out Cognito properties (if Cognito auth) for convenience only.
        // We must Cognito authorization to any methods that want to call GraphQL with the calling user Cognito permissions.
        const props: IAppSyncMethodProps = {
            ...(cognito?.sub && { cognito }),
            event
        };
        console.log('props', props);

        eventArguments.push(props);
        return Reflect.apply(classInstance[event.stash.operation as keyof T], undefined, eventArguments);
    }
}
