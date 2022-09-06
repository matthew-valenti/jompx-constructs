"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncResolver = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
class AppSyncResolver {
    /**
     * Call a method on a class from values in a AppSync Lambda event.
     * @param classInstance - A class instance.
     * @param event - AppSync Lambda event.
     * @returns - Returns the return value of the method.
     */
    static callMethodFromEvent(classInstance, event) {
        var _b, _c, _d, _e, _f, _g, _h;
        // Get event arguments from event as an array of values (required for Reflect method below).
        const eventArguments = (event === null || event === void 0 ? void 0 : event.arguments) ? Object.values(event.arguments) : [];
        console.log('eventArguments', eventArguments);
        // Organize cognito specific variables.
        const cognito = {
            sub: (_c = (_b = event === null || event === void 0 ? void 0 : event.identity) === null || _b === void 0 ? void 0 : _b.claims) === null || _c === void 0 ? void 0 : _c.sub,
            email: (_e = (_d = event === null || event === void 0 ? void 0 : event.identity) === null || _d === void 0 ? void 0 : _d.claims) === null || _e === void 0 ? void 0 : _e.email,
            groups: (_f = event === null || event === void 0 ? void 0 : event.identity) === null || _f === void 0 ? void 0 : _f.groups,
            authorization: (_h = (_g = event === null || event === void 0 ? void 0 : event.request) === null || _g === void 0 ? void 0 : _g.headers) === null || _h === void 0 ? void 0 : _h.authorization
        };
        console.log('cognito', cognito);
        // We must at least pass the event. Methods might need any type of event information.
        // Break out Cognito properties (if Cognito auth) for convenience only.
        // We must Cognito authorization to any methods that want to call GraphQL with the calling user Cognito permissions.
        const props = {
            ...((cognito === null || cognito === void 0 ? void 0 : cognito.sub) && { cognito }),
            event
        };
        console.log('props', props);
        eventArguments.push(props);
        return Reflect.apply(classInstance[event.stash.operation], undefined, eventArguments);
    }
}
exports.AppSyncResolver = AppSyncResolver;
_a = JSII_RTTI_SYMBOL_1;
AppSyncResolver[_a] = { fqn: "@jompx/constructs.AppSyncResolver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMtcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvYXBwLXN5bmMtcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxNQUFhLGVBQWU7SUFDeEI7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUksYUFBa0IsRUFBRSxLQUFVOztRQUUvRCw0RkFBNEY7UUFDNUYsTUFBTSxjQUFjLEdBQVUsQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3JGLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFOUMsdUNBQXVDO1FBQ3ZDLE1BQU0sT0FBTyxHQUFHO1lBQ1osR0FBRyxjQUFFLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxRQUFRLDBDQUFFLE1BQU0sMENBQUUsR0FBRztZQUNqQyxLQUFLLGNBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFFBQVEsMENBQUUsTUFBTSwwQ0FBRSxLQUFLO1lBQ3JDLE1BQU0sUUFBRSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsUUFBUSwwQ0FBRSxNQUFNO1lBQy9CLGFBQWEsY0FBRSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsT0FBTywwQ0FBRSxPQUFPLDBDQUFFLGFBQWE7U0FDeEQsQ0FBQztRQUNGLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWhDLHFGQUFxRjtRQUNyRix1RUFBdUU7UUFDdkUsb0hBQW9IO1FBQ3BILE1BQU0sS0FBSyxHQUF3QjtZQUMvQixHQUFHLENBQUMsQ0FBQSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxLQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFDaEMsS0FBSztTQUNSLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU1QixjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFvQixDQUFDLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7O0FBakNMLDBDQWtDQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tcmVxdWlyZS1pbXBvcnRzXHJcbmltcG9ydCB7IElBcHBTeW5jTWV0aG9kUHJvcHMgfSBmcm9tICcuL2FwcC1zeW5jLnR5cGVzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jUmVzb2x2ZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsIGEgbWV0aG9kIG9uIGEgY2xhc3MgZnJvbSB2YWx1ZXMgaW4gYSBBcHBTeW5jIExhbWJkYSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjbGFzc0luc3RhbmNlIC0gQSBjbGFzcyBpbnN0YW5jZS5cclxuICAgICAqIEBwYXJhbSBldmVudCAtIEFwcFN5bmMgTGFtYmRhIGV2ZW50LlxyXG4gICAgICogQHJldHVybnMgLSBSZXR1cm5zIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIG1ldGhvZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjYWxsTWV0aG9kRnJvbUV2ZW50PFQ+KGNsYXNzSW5zdGFuY2U6IGFueSwgZXZlbnQ6IGFueSk6IGFueSB7XHJcblxyXG4gICAgICAgIC8vIEdldCBldmVudCBhcmd1bWVudHMgZnJvbSBldmVudCBhcyBhbiBhcnJheSBvZiB2YWx1ZXMgKHJlcXVpcmVkIGZvciBSZWZsZWN0IG1ldGhvZCBiZWxvdykuXHJcbiAgICAgICAgY29uc3QgZXZlbnRBcmd1bWVudHM6IGFueVtdID0gZXZlbnQ/LmFyZ3VtZW50cyA/IE9iamVjdC52YWx1ZXMoZXZlbnQuYXJndW1lbnRzKSA6IFtdO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdldmVudEFyZ3VtZW50cycsIGV2ZW50QXJndW1lbnRzKTtcclxuXHJcbiAgICAgICAgLy8gT3JnYW5pemUgY29nbml0byBzcGVjaWZpYyB2YXJpYWJsZXMuXHJcbiAgICAgICAgY29uc3QgY29nbml0byA9IHtcclxuICAgICAgICAgICAgc3ViOiBldmVudD8uaWRlbnRpdHk/LmNsYWltcz8uc3ViLFxyXG4gICAgICAgICAgICBlbWFpbDogZXZlbnQ/LmlkZW50aXR5Py5jbGFpbXM/LmVtYWlsLFxyXG4gICAgICAgICAgICBncm91cHM6IGV2ZW50Py5pZGVudGl0eT8uZ3JvdXBzLFxyXG4gICAgICAgICAgICBhdXRob3JpemF0aW9uOiBldmVudD8ucmVxdWVzdD8uaGVhZGVycz8uYXV0aG9yaXphdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NvZ25pdG8nLCBjb2duaXRvKTtcclxuXHJcbiAgICAgICAgLy8gV2UgbXVzdCBhdCBsZWFzdCBwYXNzIHRoZSBldmVudC4gTWV0aG9kcyBtaWdodCBuZWVkIGFueSB0eXBlIG9mIGV2ZW50IGluZm9ybWF0aW9uLlxyXG4gICAgICAgIC8vIEJyZWFrIG91dCBDb2duaXRvIHByb3BlcnRpZXMgKGlmIENvZ25pdG8gYXV0aCkgZm9yIGNvbnZlbmllbmNlIG9ubHkuXHJcbiAgICAgICAgLy8gV2UgbXVzdCBDb2duaXRvIGF1dGhvcml6YXRpb24gdG8gYW55IG1ldGhvZHMgdGhhdCB3YW50IHRvIGNhbGwgR3JhcGhRTCB3aXRoIHRoZSBjYWxsaW5nIHVzZXIgQ29nbml0byBwZXJtaXNzaW9ucy5cclxuICAgICAgICBjb25zdCBwcm9wczogSUFwcFN5bmNNZXRob2RQcm9wcyA9IHtcclxuICAgICAgICAgICAgLi4uKGNvZ25pdG8/LnN1YiAmJiB7IGNvZ25pdG8gfSksXHJcbiAgICAgICAgICAgIGV2ZW50XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zb2xlLmxvZygncHJvcHMnLCBwcm9wcyk7XHJcblxyXG4gICAgICAgIGV2ZW50QXJndW1lbnRzLnB1c2gocHJvcHMpO1xyXG4gICAgICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KGNsYXNzSW5zdGFuY2VbZXZlbnQuc3Rhc2gub3BlcmF0aW9uIGFzIGtleW9mIFRdLCB1bmRlZmluZWQsIGV2ZW50QXJndW1lbnRzKTtcclxuICAgIH1cclxufVxyXG4iXX0=