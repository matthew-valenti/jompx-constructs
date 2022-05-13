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
        const eventArguments = get(event.arguments, path, { default: [] });
        return Reflect.apply(classInstance[event.stash.operation], undefined, [...Object.values(eventArguments), ...[event]]);
    }
}
exports.AppSyncResolver = AppSyncResolver;
_a = JSII_RTTI_SYMBOL_1;
AppSyncResolver[_a] = { fqn: "@jompx/constructs.AppSyncResolver", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLXN5bmMtcmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYXBwLXN5bmMvYXBwLXN5bmMtcmVzb2x2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpRUFBaUU7QUFDakUsaUNBQWtDO0FBR2xDLE1BQWEsZUFBZTtJQUN4Qjs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsbUJBQW1CLENBQUksYUFBa0IsRUFBRSxLQUE0QixFQUFFLE9BQWUsT0FBTztRQUN6RyxNQUFNLGNBQWMsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNuRSxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBb0IsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JJLENBQUM7O0FBWEwsMENBWUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXJlcXVpcmUtaW1wb3J0c1xyXG5pbXBvcnQgZ2V0ID0gcmVxdWlyZSgnZ2V0LXZhbHVlJyk7XHJcbmltcG9ydCB7IElBcHBTeW5jUmVzb2x2ZXJFdmVudCB9IGZyb20gJy4vYXBwLXN5bmMudHlwZXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmNSZXNvbHZlciB7XHJcbiAgICAvKipcclxuICAgICAqIENhbGwgYSBtZXRob2Qgb24gYSBjbGFzcyBmcm9tIHZhbHVlcyBpbiBhIEFwcFN5bmMgTGFtYmRhIGV2ZW50LlxyXG4gICAgICogQHBhcmFtIGNsYXNzSW5zdGFuY2UgLSBBIGNsYXNzIGluc3RhbmNlLlxyXG4gICAgICogQHBhcmFtIGV2ZW50IC0gQXBwU3luYyBMYW1iZGEgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0gcGF0aCAtIEpTT04gcGF0aCB0byBtZXRob2QgYXJndW1lbnRzIGluIGV2ZW50LmFyZ3VtZW50cy5cclxuICAgICAqIEByZXR1cm5zIC0gUmV0dXJucyB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBtZXRob2QuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY2FsbE1ldGhvZEZyb21FdmVudDxUPihjbGFzc0luc3RhbmNlOiBhbnksIGV2ZW50OiBJQXBwU3luY1Jlc29sdmVyRXZlbnQsIHBhdGg6IHN0cmluZyA9ICdpbnB1dCcpOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50QXJndW1lbnRzID0gZ2V0KGV2ZW50LmFyZ3VtZW50cywgcGF0aCwgeyBkZWZhdWx0OiBbXSB9KTtcclxuICAgICAgICByZXR1cm4gUmVmbGVjdC5hcHBseShjbGFzc0luc3RhbmNlW2V2ZW50LnN0YXNoLm9wZXJhdGlvbiBhcyBrZXlvZiBUXSwgdW5kZWZpbmVkLCBbLi4uT2JqZWN0LnZhbHVlcyhldmVudEFyZ3VtZW50cyksIC4uLltldmVudF1dKTtcclxuICAgIH1cclxufVxyXG4iXX0=