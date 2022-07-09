"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncResolver = void 0;
class AppSyncResolver {
    /**
     * Call a method on a class from values in a AppSync Lambda event.
     * @param classInstance - A class instance.
     * @param event - AppSync Lambda event.
     * @returns - Returns the return value of the method.
     */
    static callMethodFromEvent(classInstance, event) {
        var _a, _b, _c, _d, _e, _f, _g;
        // Get event arguments from event as an array of values (required for Reflect method below).
        const eventArguments = (event === null || event === void 0 ? void 0 : event.arguments) ? Object.values(event.arguments) : [];
        console.log('eventArguments', eventArguments);
        // Organize cognito specific variables.
        const cognito = {
            sub: (_b = (_a = event === null || event === void 0 ? void 0 : event.identity) === null || _a === void 0 ? void 0 : _a.claims) === null || _b === void 0 ? void 0 : _b.sub,
            email: (_d = (_c = event === null || event === void 0 ? void 0 : event.identity) === null || _c === void 0 ? void 0 : _c.claims) === null || _d === void 0 ? void 0 : _d.email,
            groups: (_e = event === null || event === void 0 ? void 0 : event.identity) === null || _e === void 0 ? void 0 : _e.groups,
            authorization: (_g = (_f = event === null || event === void 0 ? void 0 : event.request) === null || _f === void 0 ? void 0 : _f.headers) === null || _g === void 0 ? void 0 : _g.authorization
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMtcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvYXBwLXN5bmMtcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR0EsTUFBYSxlQUFlO0lBQ3hCOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLG1CQUFtQixDQUFJLGFBQWtCLEVBQUUsS0FBVTs7UUFFL0QsNEZBQTRGO1FBQzVGLE1BQU0sY0FBYyxHQUFVLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFNBQVMsRUFBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNyRixPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRTlDLHVDQUF1QztRQUN2QyxNQUFNLE9BQU8sR0FBRztZQUNaLEdBQUcsY0FBRSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsUUFBUSwwQ0FBRSxNQUFNLDBDQUFFLEdBQUc7WUFDakMsS0FBSyxjQUFFLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxRQUFRLDBDQUFFLE1BQU0sMENBQUUsS0FBSztZQUNyQyxNQUFNLFFBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLFFBQVEsMENBQUUsTUFBTTtZQUMvQixhQUFhLGNBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE9BQU8sMENBQUUsT0FBTywwQ0FBRSxhQUFhO1NBQ3hELENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVoQyxxRkFBcUY7UUFDckYsdUVBQXVFO1FBQ3ZFLG9IQUFvSDtRQUNwSCxNQUFNLEtBQUssR0FBd0I7WUFDL0IsR0FBRyxDQUFDLENBQUEsT0FBTyxhQUFQLE9BQU8sdUJBQVAsT0FBTyxDQUFFLEdBQUcsS0FBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO1lBQ2hDLEtBQUs7U0FDUixDQUFDO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFNUIsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBb0IsQ0FBQyxFQUFFLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNyRyxDQUFDO0NBQ0o7QUFsQ0QsMENBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1yZXF1aXJlLWltcG9ydHNcclxuaW1wb3J0IHsgSUFwcFN5bmNNZXRob2RQcm9wcyB9IGZyb20gJy4vYXBwLXN5bmMudHlwZXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmNSZXNvbHZlciB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGwgYSBtZXRob2Qgb24gYSBjbGFzcyBmcm9tIHZhbHVlcyBpbiBhIEFwcFN5bmMgTGFtYmRhIGV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNsYXNzSW5zdGFuY2UgLSBBIGNsYXNzIGluc3RhbmNlLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IC0gQXBwU3luYyBMYW1iZGEgZXZlbnQuXHJcbiAgICAgKiBAcmV0dXJucyAtIFJldHVybnMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgbWV0aG9kLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNhbGxNZXRob2RGcm9tRXZlbnQ8VD4oY2xhc3NJbnN0YW5jZTogYW55LCBldmVudDogYW55KTogYW55IHtcclxuXHJcbiAgICAgICAgLy8gR2V0IGV2ZW50IGFyZ3VtZW50cyBmcm9tIGV2ZW50IGFzIGFuIGFycmF5IG9mIHZhbHVlcyAocmVxdWlyZWQgZm9yIFJlZmxlY3QgbWV0aG9kIGJlbG93KS5cclxuICAgICAgICBjb25zdCBldmVudEFyZ3VtZW50czogYW55W10gPSBldmVudD8uYXJndW1lbnRzID8gT2JqZWN0LnZhbHVlcyhldmVudC5hcmd1bWVudHMpIDogW107XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2V2ZW50QXJndW1lbnRzJywgZXZlbnRBcmd1bWVudHMpO1xyXG5cclxuICAgICAgICAvLyBPcmdhbml6ZSBjb2duaXRvIHNwZWNpZmljIHZhcmlhYmxlcy5cclxuICAgICAgICBjb25zdCBjb2duaXRvID0ge1xyXG4gICAgICAgICAgICBzdWI6IGV2ZW50Py5pZGVudGl0eT8uY2xhaW1zPy5zdWIsXHJcbiAgICAgICAgICAgIGVtYWlsOiBldmVudD8uaWRlbnRpdHk/LmNsYWltcz8uZW1haWwsXHJcbiAgICAgICAgICAgIGdyb3VwczogZXZlbnQ/LmlkZW50aXR5Py5ncm91cHMsXHJcbiAgICAgICAgICAgIGF1dGhvcml6YXRpb246IGV2ZW50Py5yZXF1ZXN0Py5oZWFkZXJzPy5hdXRob3JpemF0aW9uXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zb2xlLmxvZygnY29nbml0bycsIGNvZ25pdG8pO1xyXG5cclxuICAgICAgICAvLyBXZSBtdXN0IGF0IGxlYXN0IHBhc3MgdGhlIGV2ZW50LiBNZXRob2RzIG1pZ2h0IG5lZWQgYW55IHR5cGUgb2YgZXZlbnQgaW5mb3JtYXRpb24uXHJcbiAgICAgICAgLy8gQnJlYWsgb3V0IENvZ25pdG8gcHJvcGVydGllcyAoaWYgQ29nbml0byBhdXRoKSBmb3IgY29udmVuaWVuY2Ugb25seS5cclxuICAgICAgICAvLyBXZSBtdXN0IENvZ25pdG8gYXV0aG9yaXphdGlvbiB0byBhbnkgbWV0aG9kcyB0aGF0IHdhbnQgdG8gY2FsbCBHcmFwaFFMIHdpdGggdGhlIGNhbGxpbmcgdXNlciBDb2duaXRvIHBlcm1pc3Npb25zLlxyXG4gICAgICAgIGNvbnN0IHByb3BzOiBJQXBwU3luY01ldGhvZFByb3BzID0ge1xyXG4gICAgICAgICAgICAuLi4oY29nbml0bz8uc3ViICYmIHsgY29nbml0byB9KSxcclxuICAgICAgICAgICAgZXZlbnRcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdwcm9wcycsIHByb3BzKTtcclxuXHJcbiAgICAgICAgZXZlbnRBcmd1bWVudHMucHVzaChwcm9wcyk7XHJcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuYXBwbHkoY2xhc3NJbnN0YW5jZVtldmVudC5zdGFzaC5vcGVyYXRpb24gYXMga2V5b2YgVF0sIHVuZGVmaW5lZCwgZXZlbnRBcmd1bWVudHMpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==