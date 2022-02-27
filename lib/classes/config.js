"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
class Config {
    constructor(appNode) {
        this.appNode = appNode;
    }
    getStage() {
        var _b;
        const stage = (_b = this.appNode.tryGetContext('stage')) !== null && _b !== void 0 ? _b : this.appNode.tryGetContext('@jompx-local').stage;
        if (!stage)
            throw Error('Jompx stage not found! Stage is missing from command line or jompx.local.ts.');
        return stage;
    }
    getEnvironment(environmentName) {
        return this.appNode.tryGetContext('@jompx').environments.find((o) => o.name === environmentName);
    }
    getEnvironmentByAccountId(accountId) {
        return this.appNode.tryGetContext('@jompx').environments.find((o) => o.accountId === accountId);
    }
    getStageEnvironments(stageName) {
        var _b;
        // Get stages from config and local config. Local config overrides config.
        const configStages = this.appNode.tryGetContext('@jompx').stages;
        const localStages = this.appNode.tryGetContext('@jompx-local').stages;
        const stages = { ...configStages, ...localStages };
        const map = new Map(Object.entries(stages));
        return (_b = map.get(stageName)) === null || _b === void 0 ? void 0 : _b.environments;
    }
    getEnv(environmentType, stageName) {
        var _b;
        let rv = undefined;
        const stageEnvironments = this.getStageEnvironments(stageName !== null && stageName !== void 0 ? stageName : this.getStage());
        const environmentName = (_b = stageEnvironments === null || stageEnvironments === void 0 ? void 0 : stageEnvironments.find(o => o.environmentType === environmentType)) === null || _b === void 0 ? void 0 : _b.environmentName;
        if (environmentName) {
            const environment = this.getEnvironment(environmentName);
            rv = { account: environment === null || environment === void 0 ? void 0 : environment.accountId, region: environment === null || environment === void 0 ? void 0 : environment.region };
        }
        return rv;
    }
}
exports.Config = Config;
_a = JSII_RTTI_SYMBOL_1;
Config[_a] = { fqn: "@jompx/constructs.Config", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBSUEsTUFBYSxNQUFNO0lBRWYsWUFDVyxPQUFhO1FBQWIsWUFBTyxHQUFQLE9BQU8sQ0FBTTtJQUNwQixDQUFDO0lBRUUsUUFBUTs7UUFDWCxNQUFNLEtBQUssU0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsbUNBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3RHLElBQUksQ0FBQyxLQUFLO1lBQUUsTUFBTSxLQUFLLENBQUMsOEVBQThFLENBQUMsQ0FBQztRQUN4RyxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU0sY0FBYyxDQUFDLGVBQXVCO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxlQUFlLENBQUMsQ0FBQztJQUNuSCxDQUFDO0lBRU0seUJBQXlCLENBQUMsU0FBaUI7UUFDOUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBQ2xILENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxTQUFpQjs7UUFDekMsMEVBQTBFO1FBQzFFLE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN6RSxNQUFNLFdBQVcsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDOUUsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRW5ELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUM1QyxhQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBDQUFFLFlBQVksQ0FBQztJQUM1QyxDQUFDO0lBRU0sTUFBTSxDQUFDLGVBQXVCLEVBQUUsU0FBa0I7O1FBQ3JELElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUVuQixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLGFBQVQsU0FBUyxjQUFULFNBQVMsR0FBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUNsRixNQUFNLGVBQWUsU0FBRyxpQkFBaUIsYUFBakIsaUJBQWlCLHVCQUFqQixpQkFBaUIsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxLQUFLLGVBQWUsMkNBQUcsZUFBZSxDQUFDO1FBRTdHLElBQUksZUFBZSxFQUFFO1lBQ2pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDekQsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxNQUFNLEVBQUUsQ0FBQztTQUN6RTtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7QUExQ0wsd0JBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBJRW52aXJvbm1lbnQsIElTdGFnZSwgSVN0YWdlRW52aXJvbm1lbnQgfSBmcm9tICcuLi90eXBlcy9jb25maWcuaW50ZXJmYWNlJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25maWcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBhcHBOb2RlOiBOb2RlXHJcbiAgICApIHsgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTdGFnZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ3N0YWdlJykgPz8gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weC1sb2NhbCcpLnN0YWdlO1xyXG4gICAgICAgIGlmICghc3RhZ2UpIHRocm93IEVycm9yKCdKb21weCBzdGFnZSBub3QgZm91bmQhIFN0YWdlIGlzIG1pc3NpbmcgZnJvbSBjb21tYW5kIGxpbmUgb3Igam9tcHgubG9jYWwudHMuJyk7XHJcbiAgICAgICAgcmV0dXJuIHN0YWdlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRFbnZpcm9ubWVudChlbnZpcm9ubWVudE5hbWU6IHN0cmluZyk6IElFbnZpcm9ubWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5lbnZpcm9ubWVudHMuZmluZCgobzogSUVudmlyb25tZW50KSA9PiBvLm5hbWUgPT09IGVudmlyb25tZW50TmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEVudmlyb25tZW50QnlBY2NvdW50SWQoYWNjb3VudElkOiBzdHJpbmcpOiBJRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzLmZpbmQoKG86IElFbnZpcm9ubWVudCkgPT4gby5hY2NvdW50SWQgPT09IGFjY291bnRJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFN0YWdlRW52aXJvbm1lbnRzKHN0YWdlTmFtZTogc3RyaW5nKTogSVN0YWdlRW52aXJvbm1lbnRbXSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgLy8gR2V0IHN0YWdlcyBmcm9tIGNvbmZpZyBhbmQgbG9jYWwgY29uZmlnLiBMb2NhbCBjb25maWcgb3ZlcnJpZGVzIGNvbmZpZy5cclxuICAgICAgICBjb25zdCBjb25maWdTdGFnZXM6IElTdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5zdGFnZXM7XHJcbiAgICAgICAgY29uc3QgbG9jYWxTdGFnZXM6IElTdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgtbG9jYWwnKS5zdGFnZXM7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0geyAuLi5jb25maWdTdGFnZXMsIC4uLmxvY2FsU3RhZ2VzIH07XHJcblxyXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoc3RhZ2VzKSk7XHJcbiAgICAgICAgcmV0dXJuIG1hcC5nZXQoc3RhZ2VOYW1lKT8uZW52aXJvbm1lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRFbnYoZW52aXJvbm1lbnRUeXBlOiBzdHJpbmcsIHN0YWdlTmFtZT86IHN0cmluZyk6IGNkay5FbnZpcm9ubWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBjb25zdCBzdGFnZUVudmlyb25tZW50cyA9IHRoaXMuZ2V0U3RhZ2VFbnZpcm9ubWVudHMoc3RhZ2VOYW1lID8/IHRoaXMuZ2V0U3RhZ2UoKSk7XHJcbiAgICAgICAgY29uc3QgZW52aXJvbm1lbnROYW1lID0gc3RhZ2VFbnZpcm9ubWVudHM/LmZpbmQobyA9PiBvLmVudmlyb25tZW50VHlwZSA9PT0gZW52aXJvbm1lbnRUeXBlKT8uZW52aXJvbm1lbnROYW1lO1xyXG5cclxuICAgICAgICBpZiAoZW52aXJvbm1lbnROYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudmlyb25tZW50ID0gdGhpcy5nZXRFbnZpcm9ubWVudChlbnZpcm9ubWVudE5hbWUpO1xyXG4gICAgICAgICAgICBydiA9IHsgYWNjb3VudDogZW52aXJvbm1lbnQ/LmFjY291bnRJZCwgcmVnaW9uOiBlbnZpcm9ubWVudD8ucmVnaW9uIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcbn0iXX0=