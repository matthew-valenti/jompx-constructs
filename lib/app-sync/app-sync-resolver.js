"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncResolver = void 0;
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
        var _a, _b, _c, _d, _e, _f, _g;
        const eventArguments = get(event.arguments, path) ? Object.values(get(event.arguments, path)) : [];
        const cognito = {
            sub: (_b = (_a = event === null || event === void 0 ? void 0 : event.identity) === null || _a === void 0 ? void 0 : _a.claims) === null || _b === void 0 ? void 0 : _b.sub,
            email: (_d = (_c = event === null || event === void 0 ? void 0 : event.identity) === null || _c === void 0 ? void 0 : _c.claims) === null || _d === void 0 ? void 0 : _d.email,
            groups: (_e = event === null || event === void 0 ? void 0 : event.identity) === null || _e === void 0 ? void 0 : _e.groups,
            authorization: (_g = (_f = event === null || event === void 0 ? void 0 : event.request) === null || _f === void 0 ? void 0 : _f.headers) === null || _g === void 0 ? void 0 : _g.authorization
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMtcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvYXBwLXN5bmMtcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUVBQWlFO0FBQ2pFLGlDQUFrQztBQUdsQyxNQUFhLGVBQWU7SUFDeEI7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFJLGFBQWtCLEVBQUUsS0FBVSxFQUFFLE9BQWUsT0FBTzs7UUFFdkYsTUFBTSxjQUFjLEdBQVUsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRTFHLE1BQU0sT0FBTyxHQUFHO1lBQ1osR0FBRyxjQUFFLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxRQUFRLDBDQUFFLE1BQU0sMENBQUUsR0FBRztZQUNqQyxLQUFLLGNBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFFBQVEsMENBQUUsTUFBTSwwQ0FBRSxLQUFLO1lBQ3JDLE1BQU0sUUFBRSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsUUFBUSwwQ0FBRSxNQUFNO1lBQy9CLGFBQWEsY0FBRSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsT0FBTywwQ0FBRSxPQUFPLDBDQUFFLGFBQWE7U0FDeEQsQ0FBQztRQUVGLHFGQUFxRjtRQUNyRix1RUFBdUU7UUFDdkUsb0hBQW9IO1FBQ3BILE1BQU0sS0FBSyxHQUF3QjtZQUMvQixHQUFHLENBQUMsQ0FBQSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsR0FBRyxLQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFDaEMsS0FBSztTQUNSLENBQUM7UUFFRixjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNCLE9BQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFvQixDQUFDLEVBQUUsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7Q0FDSjtBQTlCRCwwQ0E4QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG5pbXBvcnQgZ2V0ID0gcmVxdWlyZSgnZ2V0LXZhbHVlJyk7XHJcbmltcG9ydCB7IElBcHBTeW5jTWV0aG9kUHJvcHMgfSBmcm9tICcuL2FwcC1zeW5jLnR5cGVzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jUmVzb2x2ZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsIGEgbWV0aG9kIG9uIGEgY2xhc3MgZnJvbSB2YWx1ZXMgaW4gYSBBcHBTeW5jIExhbWJkYSBldmVudC5cclxuICAgICAqIEBwYXJhbSBjbGFzc0luc3RhbmNlIC0gQSBjbGFzcyBpbnN0YW5jZS5cclxuICAgICAqIEBwYXJhbSBldmVudCAtIEFwcFN5bmMgTGFtYmRhIGV2ZW50LlxyXG4gICAgICogQHBhcmFtIHBhdGggLSBKU09OIHBhdGggdG8gbWV0aG9kIGFyZ3VtZW50cyBpbiBldmVudC5hcmd1bWVudHMuXHJcbiAgICAgKiBAcmV0dXJucyAtIFJldHVybnMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbWV0aG9kLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbGxNZXRob2RGcm9tRXZlbnQ8VD4oY2xhc3NJbnN0YW5jZTogYW55LCBldmVudDogYW55LCBwYXRoOiBzdHJpbmcgPSAnaW5wdXQnKTogYW55IHtcclxuXHJcbiAgICAgICAgY29uc3QgZXZlbnRBcmd1bWVudHM6IGFueVtdID0gZ2V0KGV2ZW50LmFyZ3VtZW50cywgcGF0aCkgPyBPYmplY3QudmFsdWVzKGdldChldmVudC5hcmd1bWVudHMsIHBhdGgpKSA6IFtdO1xyXG5cclxuICAgICAgICBjb25zdCBjb2duaXRvID0ge1xyXG4gICAgICAgICAgICBzdWI6IGV2ZW50Py5pZGVudGl0eT8uY2xhaW1zPy5zdWIsXHJcbiAgICAgICAgICAgIGVtYWlsOiBldmVudD8uaWRlbnRpdHk/LmNsYWltcz8uZW1haWwsXHJcbiAgICAgICAgICAgIGdyb3VwczogZXZlbnQ/LmlkZW50aXR5Py5ncm91cHMsXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb246IGV2ZW50Py5yZXF1ZXN0Py5oZWFkZXJzPy5hdXRob3JpemF0aW9uXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gV2UgbXVzdCBhdCBsZWFzdCBwYXNzIHRoZSBldmVudC4gTWV0aG9kcyBtaWdodCBuZWVkIGFueSB0eXBlIG9mIGV2ZW50IGluZm9ybWF0aW9uLlxyXG4gICAgICAgIC8vIEJyZWFrIG91dCBDb2duaXRvIHByb3BlcnRpZXMgKGlmIENvZ25pdG8gYXV0aCkgZm9yIGNvbnZlbmllbmNlIG9ubHkuXHJcbiAgICAgICAgLy8gV2UgbXVzdCBDb2duaXRvIGF1dGhvcml6YXRpb24gdG8gYW55IG1ldGhvZHMgdGhhdCB3YW50IHRvIGNhbGwgR3JhcGhRTCB3aXRoIHRoZSBjYWxsaW5nIHVzZXIgQ29nbml0byBwZXJtaXNzaW9ucy5cclxuICAgICAgICBjb25zdCBwcm9wczogSUFwcFN5bmNNZXRob2RQcm9wcyA9IHtcclxuICAgICAgICAgICAgLi4uKGNvZ25pdG8/LnN1YiAmJiB7IGNvZ25pdG8gfSksXHJcbiAgICAgICAgICAgIGV2ZW50XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZXZlbnRBcmd1bWVudHMucHVzaChwcm9wcyk7XHJcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuYXBwbHkoY2xhc3NJbnN0YW5jZVtldmVudC5zdGFzaC5vcGVyYXRpb24gYXMga2V5b2YgVF0sIHVuZGVmaW5lZCwgZXZlbnRBcmd1bWVudHMpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==