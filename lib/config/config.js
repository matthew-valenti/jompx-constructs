"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
class Config {
    constructor(appNode) {
        this.appNode = appNode;
    }
    stage() {
        var _b;
        const stage = (_b = this.appNode.tryGetContext('stage')) !== null && _b !== void 0 ? _b : this.appNode.tryGetContext('@jompx-local').stage;
        if (!stage)
            throw Error('Jompx: stage not found! Stage is missing from command line or jompx.local.ts.');
        return stage;
    }
    environments() {
        return this.appNode.tryGetContext('@jompx').environments;
    }
    environmentByName(name) {
        return this.appNode.tryGetContext('@jompx').environments.find((o) => o.name === name);
    }
    environmentByAccountId(accountId) {
        return this.appNode.tryGetContext('@jompx').environments.find((o) => o.accountId === accountId);
    }
    stages() {
        const configStages = this.appNode.tryGetContext('@jompx').stages;
        const localStages = this.appNode.tryGetContext('@jompx-local').stages;
        // Get stages from config and local config. Local config overrides config.
        const stages = { ...configStages, ...localStages };
        // TODO: Remove. I don't think we want to try to join an account to a stage.
        // // For each stage environment join to account environment (and set account).
        // const map = new Map(Object.entries(stages));
        // for (const value of map.values()) {
        //     value.environments.forEach(environment => {
        //         environment.account = this.environmentByName(environment.name);
        //     });
        // }
        return stages;
    }
    stageEnvironments(stageName) {
        var _b;
        let rv = undefined;
        const stages = this.stages();
        if (stages) {
            const map = new Map(Object.entries(stages));
            rv = (_b = map.get(stageName)) === null || _b === void 0 ? void 0 : _b.environments;
        }
        return rv;
    }
    env(type, stageName) {
        var _b;
        let rv = undefined;
        const stageEnvironments = this.stageEnvironments(stageName !== null && stageName !== void 0 ? stageName : this.stage());
        const environmentName = (_b = stageEnvironments === null || stageEnvironments === void 0 ? void 0 : stageEnvironments.find(o => o.type === type)) === null || _b === void 0 ? void 0 : _b.name;
        if (environmentName) {
            const environment = this.environmentByName(environmentName);
            rv = { account: environment === null || environment === void 0 ? void 0 : environment.accountId, region: environment === null || environment === void 0 ? void 0 : environment.region };
        }
        return rv;
    }
    organizationName() {
        return this.appNode.tryGetContext('@jompx').organizationName;
    }
    organizationNamePascalCase() {
        return changeCase.pascalCase(this.organizationName());
    }
}
exports.Config = Config;
_a = JSII_RTTI_SYMBOL_1;
Config[_a] = { fqn: "@jompx/constructs.Config", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw2REFBNkQ7QUFDN0QsMENBQTBDO0FBSTFDLE1BQWEsTUFBTTtJQUVmLFlBQ1csT0FBYTtRQUFiLFlBQU8sR0FBUCxPQUFPLENBQU07SUFDcEIsQ0FBQztJQUVFLEtBQUs7O1FBQ1IsTUFBTSxLQUFLLFNBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN0RyxJQUFJLENBQUMsS0FBSztZQUFFLE1BQU0sS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7UUFDekcsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVNLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQztJQUM3RCxDQUFDO0lBRU0saUJBQWlCLENBQUMsSUFBWTtRQUNqQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDeEcsQ0FBQztJQUVNLHNCQUFzQixDQUFDLFNBQWlCO1FBQzNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQztJQUNsSCxDQUFDO0lBRU0sTUFBTTtRQUNULE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN6RSxNQUFNLFdBQVcsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFOUUsMEVBQTBFO1FBQzFFLE1BQU0sTUFBTSxHQUFHLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVuRCw0RUFBNEU7UUFDNUUsK0VBQStFO1FBQy9FLCtDQUErQztRQUMvQyxzQ0FBc0M7UUFDdEMsa0RBQWtEO1FBQ2xELDBFQUEwRTtRQUMxRSxVQUFVO1FBQ1YsSUFBSTtRQUVKLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxTQUFpQjs7UUFDdEMsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQ25CLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU3QixJQUFJLE1BQU0sRUFBRTtZQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM1QyxFQUFFLFNBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMENBQUUsWUFBWSxDQUFDO1NBQ3pDO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRU0sR0FBRyxDQUFDLElBQVksRUFBRSxTQUFrQjs7UUFDdkMsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBRW5CLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsYUFBVCxTQUFTLGNBQVQsU0FBUyxHQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sZUFBZSxTQUFHLGlCQUFpQixhQUFqQixpQkFBaUIsdUJBQWpCLGlCQUFpQixDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSwyQ0FBRyxJQUFJLENBQUM7UUFFNUUsSUFBSSxlQUFlLEVBQUU7WUFDakIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVELEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsTUFBTSxFQUFFLENBQUM7U0FDekU7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxnQkFBZ0I7UUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqRSxDQUFDO0lBRU0sMEJBQTBCO1FBQzdCLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7O0FBM0VMLHdCQTRFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgSUVudmlyb25tZW50LCBJU3RhZ2UsIElTdGFnZUVudmlyb25tZW50IH0gZnJvbSAnLi9jb25maWcudHlwZXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIGFwcE5vZGU6IE5vZGVcclxuICAgICkgeyB9XHJcblxyXG4gICAgcHVibGljIHN0YWdlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnc3RhZ2UnKSA/PyB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4LWxvY2FsJykuc3RhZ2U7XHJcbiAgICAgICAgaWYgKCFzdGFnZSkgdGhyb3cgRXJyb3IoJ0pvbXB4OiBzdGFnZSBub3QgZm91bmQhIFN0YWdlIGlzIG1pc3NpbmcgZnJvbSBjb21tYW5kIGxpbmUgb3Igam9tcHgubG9jYWwudHMuJyk7XHJcbiAgICAgICAgcmV0dXJuIHN0YWdlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudHMoKTogSUVudmlyb25tZW50W10gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudEJ5TmFtZShuYW1lOiBzdHJpbmcpOiBJRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzLmZpbmQoKG86IElFbnZpcm9ubWVudCkgPT4gby5uYW1lID09PSBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRCeUFjY291bnRJZChhY2NvdW50SWQ6IHN0cmluZyk6IElFbnZpcm9ubWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5lbnZpcm9ubWVudHMuZmluZCgobzogSUVudmlyb25tZW50KSA9PiBvLmFjY291bnRJZCA9PT0gYWNjb3VudElkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhZ2VzKCk6IElTdGFnZSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnU3RhZ2VzOiBJU3RhZ2UgPSB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4Jykuc3RhZ2VzO1xyXG4gICAgICAgIGNvbnN0IGxvY2FsU3RhZ2VzOiBJU3RhZ2UgPSB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4LWxvY2FsJykuc3RhZ2VzO1xyXG5cclxuICAgICAgICAvLyBHZXQgc3RhZ2VzIGZyb20gY29uZmlnIGFuZCBsb2NhbCBjb25maWcuIExvY2FsIGNvbmZpZyBvdmVycmlkZXMgY29uZmlnLlxyXG4gICAgICAgIGNvbnN0IHN0YWdlcyA9IHsgLi4uY29uZmlnU3RhZ2VzLCAuLi5sb2NhbFN0YWdlcyB9O1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUuIEkgZG9uJ3QgdGhpbmsgd2Ugd2FudCB0byB0cnkgdG8gam9pbiBhbiBhY2NvdW50IHRvIGEgc3RhZ2UuXHJcbiAgICAgICAgLy8gLy8gRm9yIGVhY2ggc3RhZ2UgZW52aXJvbm1lbnQgam9pbiB0byBhY2NvdW50IGVudmlyb25tZW50IChhbmQgc2V0IGFjY291bnQpLlxyXG4gICAgICAgIC8vIGNvbnN0IG1hcCA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoc3RhZ2VzKSk7XHJcbiAgICAgICAgLy8gZm9yIChjb25zdCB2YWx1ZSBvZiBtYXAudmFsdWVzKCkpIHtcclxuICAgICAgICAvLyAgICAgdmFsdWUuZW52aXJvbm1lbnRzLmZvckVhY2goZW52aXJvbm1lbnQgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgZW52aXJvbm1lbnQuYWNjb3VudCA9IHRoaXMuZW52aXJvbm1lbnRCeU5hbWUoZW52aXJvbm1lbnQubmFtZSk7XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YWdlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhZ2VFbnZpcm9ubWVudHMoc3RhZ2VOYW1lOiBzdHJpbmcpOiBJU3RhZ2VFbnZpcm9ubWVudFtdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0gdGhpcy5zdGFnZXMoKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YWdlcykge1xyXG4gICAgICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHN0YWdlcykpO1xyXG4gICAgICAgICAgICBydiA9IG1hcC5nZXQoc3RhZ2VOYW1lKT8uZW52aXJvbm1lbnRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnYodHlwZTogc3RyaW5nLCBzdGFnZU5hbWU/OiBzdHJpbmcpOiBjZGsuRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhZ2VFbnZpcm9ubWVudHMgPSB0aGlzLnN0YWdlRW52aXJvbm1lbnRzKHN0YWdlTmFtZSA/PyB0aGlzLnN0YWdlKCkpO1xyXG4gICAgICAgIGNvbnN0IGVudmlyb25tZW50TmFtZSA9IHN0YWdlRW52aXJvbm1lbnRzPy5maW5kKG8gPT4gby50eXBlID09PSB0eXBlKT8ubmFtZTtcclxuXHJcbiAgICAgICAgaWYgKGVudmlyb25tZW50TmFtZSkge1xyXG4gICAgICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMuZW52aXJvbm1lbnRCeU5hbWUoZW52aXJvbm1lbnROYW1lKTtcclxuICAgICAgICAgICAgcnYgPSB7IGFjY291bnQ6IGVudmlyb25tZW50Py5hY2NvdW50SWQsIHJlZ2lvbjogZW52aXJvbm1lbnQ/LnJlZ2lvbiB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5vcmdhbml6YXRpb25OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VDYXNlLnBhc2NhbENhc2UodGhpcy5vcmdhbml6YXRpb25OYW1lKCkpO1xyXG4gICAgfVxyXG59Il19