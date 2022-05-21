"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncResolver = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const get = require("get-value");
class AppSyncResolver {
    /**
     * Call a method on a class from values in a AppSync Lambda event.
     * @param classInstance - A class instance.
     * @param event - AppSync Lambda event.
     * @param path - JSON path to method arguments in event.arguments.
     * @returns - Returns the return value of the method.
     */
    static callMethodFromEvent(classInstance, event, path = 'input') {
        var _b, _c, _d, _e, _f, _g, _h;
        const eventArguments = get(event.arguments, path) ? Object.values(get(event.arguments, path)) : [];
        const cognito = {
            sub: (_c = (_b = event === null || event === void 0 ? void 0 : event.identity) === null || _b === void 0 ? void 0 : _b.claims) === null || _c === void 0 ? void 0 : _c.sub,
            email: (_e = (_d = event === null || event === void 0 ? void 0 : event.identity) === null || _d === void 0 ? void 0 : _d.claims) === null || _e === void 0 ? void 0 : _e.email,
            groups: (_f = event === null || event === void 0 ? void 0 : event.identity) === null || _f === void 0 ? void 0 : _f.groups,
            authorization: (_h = (_g = event === null || event === void 0 ? void 0 : event.request) === null || _g === void 0 ? void 0 : _g.headers) === null || _h === void 0 ? void 0 : _h.authorization
        };
        // We must at least pass the event. Methods might need any type of event information.
        // Break out Cognito properties (if Cognito auth) for convenience only.
        // We must Cognito authorization to any methods that want to call GraphQL with the calling user Cognito permissions.
        const props = {
            ...((cognito === null || cognito === void 0 ? void 0 : cognito.sub) && { cognito }),
            event
        };
        eventArguments.push(props);
        return Reflect.apply(classInstance[event.stash.operation], undefined, eventArguments);
    }
}
exports.AppSyncResolver = AppSyncResolver;
_a = JSII_RTTI_SYMBOL_1;
AppSyncResolver[_a] = { fqn: "@jompx/constructs.AppSyncResolver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMtcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvYXBwLXN5bmMtcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpRUFBaUU7QUFDakUsaUNBQWtDO0FBR2xDLE1BQWEsZUFBZTtJQUN4Qjs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUksYUFBa0IsRUFBRSxLQUFVLEVBQUUsT0FBZSxPQUFPOztRQUV2RixNQUFNLGNBQWMsR0FBVSxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFMUcsTUFBTSxPQUFPLEdBQUc7WUFDWixHQUFHLGNBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFFBQVEsMENBQUUsTUFBTSwwQ0FBRSxHQUFHO1lBQ2pDLEtBQUssY0FBRSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsUUFBUSwwQ0FBRSxNQUFNLDBDQUFFLEtBQUs7WUFDckMsTUFBTSxRQUFFLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxRQUFRLDBDQUFFLE1BQU07WUFDL0IsYUFBYSxjQUFFLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxPQUFPLDBDQUFFLE9BQU8sMENBQUUsYUFBYTtTQUN4RCxDQUFDO1FBRUYscUZBQXFGO1FBQ3JGLHVFQUF1RTtRQUN2RSxvSEFBb0g7UUFDcEgsTUFBTSxLQUFLLEdBQXdCO1lBQy9CLEdBQUcsQ0FBQyxDQUFBLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxHQUFHLEtBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztZQUNoQyxLQUFLO1NBQ1IsQ0FBQztRQUVGLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0IsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQW9CLENBQUMsRUFBRSxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDckcsQ0FBQzs7QUE3QkwsMENBOEJDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuaW1wb3J0IGdldCA9IHJlcXVpcmUoJ2dldC12YWx1ZScpO1xyXG5pbXBvcnQgeyBJQXBwU3luY01ldGhvZFByb3BzIH0gZnJvbSAnLi9hcHAtc3luYy50eXBlcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQXBwU3luY1Jlc29sdmVyIHtcclxuICAgIC8qKlxyXG4gICAgICogQ2FsbCBhIG1ldGhvZCBvbiBhIGNsYXNzIGZyb20gdmFsdWVzIGluIGEgQXBwU3luYyBMYW1iZGEgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gY2xhc3NJbnN0YW5jZSAtIEEgY2xhc3MgaW5zdGFuY2UuXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgLSBBcHBTeW5jIExhbWJkYSBldmVudC5cclxuICAgICAqIEBwYXJhbSBwYXRoIC0gSlNPTiBwYXRoIHRvIG1ldGhvZCBhcmd1bWVudHMgaW4gZXZlbnQuYXJndW1lbnRzLlxyXG4gICAgICogQHJldHVybnMgLSBSZXR1cm5zIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIG1ldGhvZC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjYWxsTWV0aG9kRnJvbUV2ZW50PFQ+KGNsYXNzSW5zdGFuY2U6IGFueSwgZXZlbnQ6IGFueSwgcGF0aDogc3RyaW5nID0gJ2lucHV0Jyk6IGFueSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGV2ZW50QXJndW1lbnRzOiBhbnlbXSA9IGdldChldmVudC5hcmd1bWVudHMsIHBhdGgpID8gT2JqZWN0LnZhbHVlcyhnZXQoZXZlbnQuYXJndW1lbnRzLCBwYXRoKSkgOiBbXTtcclxuXHJcbiAgICAgICAgY29uc3QgY29nbml0byA9IHtcclxuICAgICAgICAgICAgc3ViOiBldmVudD8uaWRlbnRpdHk/LmNsYWltcz8uc3ViLFxyXG4gICAgICAgICAgICBlbWFpbDogZXZlbnQ/LmlkZW50aXR5Py5jbGFpbXM/LmVtYWlsLFxyXG4gICAgICAgICAgICBncm91cHM6IGV2ZW50Py5pZGVudGl0eT8uZ3JvdXBzLFxyXG4gICAgICAgICAgICBhdXRob3JpemF0aW9uOiBldmVudD8ucmVxdWVzdD8uaGVhZGVycz8uYXV0aG9yaXphdGlvblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIFdlIG11c3QgYXQgbGVhc3QgcGFzcyB0aGUgZXZlbnQuIE1ldGhvZHMgbWlnaHQgbmVlZCBhbnkgdHlwZSBvZiBldmVudCBpbmZvcm1hdGlvbi5cclxuICAgICAgICAvLyBCcmVhayBvdXQgQ29nbml0byBwcm9wZXJ0aWVzIChpZiBDb2duaXRvIGF1dGgpIGZvciBjb252ZW5pZW5jZSBvbmx5LlxyXG4gICAgICAgIC8vIFdlIG11c3QgQ29nbml0byBhdXRob3JpemF0aW9uIHRvIGFueSBtZXRob2RzIHRoYXQgd2FudCB0byBjYWxsIEdyYXBoUUwgd2l0aCB0aGUgY2FsbGluZyB1c2VyIENvZ25pdG8gcGVybWlzc2lvbnMuXHJcbiAgICAgICAgY29uc3QgcHJvcHM6IElBcHBTeW5jTWV0aG9kUHJvcHMgPSB7XHJcbiAgICAgICAgICAgIC4uLihjb2duaXRvPy5zdWIgJiYgeyBjb2duaXRvIH0pLFxyXG4gICAgICAgICAgICBldmVudFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGV2ZW50QXJndW1lbnRzLnB1c2gocHJvcHMpO1xyXG4gICAgICAgIHJldHVybiBSZWZsZWN0LmFwcGx5KGNsYXNzSW5zdGFuY2VbZXZlbnQuc3Rhc2gub3BlcmF0aW9uIGFzIGtleW9mIFRdLCB1bmRlZmluZWQsIGV2ZW50QXJndW1lbnRzKTtcclxuICAgIH1cclxufVxyXG4iXX0=