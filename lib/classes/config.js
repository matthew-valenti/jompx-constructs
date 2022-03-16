"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const changeCase = require("change-case");
class Config {
    constructor(appNode) {
        this.appNode = appNode;
    }
    stage() {
        var _a;
        const stage = (_a = this.appNode.tryGetContext('stage')) !== null && _a !== void 0 ? _a : this.appNode.tryGetContext('@jompx-local').stage;
        if (!stage)
            throw Error('Jompx stage not found! Stage is missing from command line or jompx.local.ts.');
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
        // For each stage environment join to account environment (and set account).
        const map = new Map(Object.entries(stages));
        for (const value of map.values()) {
            value.environments.forEach(environment => {
                environment.account = this.environmentByName(environment.name);
            });
        }
        return stages;
    }
    stageEnvironments(stageName) {
        var _a;
        let rv = undefined;
        const stages = this.stages();
        if (stages) {
            const map = new Map(Object.entries(stages));
            rv = (_a = map.get(stageName)) === null || _a === void 0 ? void 0 : _a.environments;
        }
        return rv;
    }
    env(type, stageName) {
        var _a;
        let rv = undefined;
        const stageEnvironments = this.stageEnvironments(stageName !== null && stageName !== void 0 ? stageName : this.stage());
        const environmentName = (_a = stageEnvironments === null || stageEnvironments === void 0 ? void 0 : stageEnvironments.find(o => o.type === type)) === null || _a === void 0 ? void 0 : _a.name;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDZEQUE2RDtBQUM3RCwwQ0FBMEM7QUFJMUMsTUFBYSxNQUFNO0lBRWYsWUFDVyxPQUFhO1FBQWIsWUFBTyxHQUFQLE9BQU8sQ0FBTTtJQUNwQixDQUFDO0lBRUUsS0FBSzs7UUFDUixNQUFNLEtBQUssU0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsbUNBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ3RHLElBQUksQ0FBQyxLQUFLO1lBQUUsTUFBTSxLQUFLLENBQUMsOEVBQThFLENBQUMsQ0FBQztRQUN4RyxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU0sWUFBWTtRQUNmLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDO0lBQzdELENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztJQUN4RyxDQUFDO0lBRU0sc0JBQXNCLENBQUMsU0FBaUI7UUFDM0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBQ2xILENBQUM7SUFFTSxNQUFNO1FBQ1QsTUFBTSxZQUFZLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3pFLE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUU5RSwwRUFBMEU7UUFDMUUsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRW5ELDRFQUE0RTtRQUM1RSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUMsS0FBSyxNQUFNLEtBQUssSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDOUIsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQ3JDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRSxDQUFDLENBQUMsQ0FBQztTQUNOO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVNLGlCQUFpQixDQUFDLFNBQWlCOztRQUN0QyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDbkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTdCLElBQUksTUFBTSxFQUFFO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEVBQUUsU0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwQ0FBRSxZQUFZLENBQUM7U0FDekM7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxHQUFHLENBQUMsSUFBWSxFQUFFLFNBQWtCOztRQUN2QyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFFbkIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxhQUFULFNBQVMsY0FBVCxTQUFTLEdBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDNUUsTUFBTSxlQUFlLFNBQUcsaUJBQWlCLGFBQWpCLGlCQUFpQix1QkFBakIsaUJBQWlCLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLDJDQUFHLElBQUksQ0FBQztRQUU1RSxJQUFJLGVBQWUsRUFBRTtZQUNqQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDNUQsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxNQUFNLEVBQUUsQ0FBQztTQUN6RTtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVNLGdCQUFnQjtRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO0lBQ2pFLENBQUM7SUFFTSwwQkFBMEI7UUFDN0IsT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQztDQUNKO0FBM0VELHdCQTJFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgSUVudmlyb25tZW50LCBJU3RhZ2UsIElTdGFnZUVudmlyb25tZW50IH0gZnJvbSAnLi4vdHlwZXMvY29uZmlnLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgYXBwTm9kZTogTm9kZVxyXG4gICAgKSB7IH1cclxuXHJcbiAgICBwdWJsaWMgc3RhZ2UoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdzdGFnZScpID8/IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgtbG9jYWwnKS5zdGFnZTtcclxuICAgICAgICBpZiAoIXN0YWdlKSB0aHJvdyBFcnJvcignSm9tcHggc3RhZ2Ugbm90IGZvdW5kISBTdGFnZSBpcyBtaXNzaW5nIGZyb20gY29tbWFuZCBsaW5lIG9yIGpvbXB4LmxvY2FsLnRzLicpO1xyXG4gICAgICAgIHJldHVybiBzdGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRzKCk6IElFbnZpcm9ubWVudFtdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRCeU5hbWUobmFtZTogc3RyaW5nKTogSUVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cy5maW5kKChvOiBJRW52aXJvbm1lbnQpID0+IG8ubmFtZSA9PT0gbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudmlyb25tZW50QnlBY2NvdW50SWQoYWNjb3VudElkOiBzdHJpbmcpOiBJRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzLmZpbmQoKG86IElFbnZpcm9ubWVudCkgPT4gby5hY2NvdW50SWQgPT09IGFjY291bnRJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YWdlcygpOiBJU3RhZ2UgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZ1N0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLnN0YWdlcztcclxuICAgICAgICBjb25zdCBsb2NhbFN0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weC1sb2NhbCcpLnN0YWdlcztcclxuXHJcbiAgICAgICAgLy8gR2V0IHN0YWdlcyBmcm9tIGNvbmZpZyBhbmQgbG9jYWwgY29uZmlnLiBMb2NhbCBjb25maWcgb3ZlcnJpZGVzIGNvbmZpZy5cclxuICAgICAgICBjb25zdCBzdGFnZXMgPSB7IC4uLmNvbmZpZ1N0YWdlcywgLi4ubG9jYWxTdGFnZXMgfTtcclxuXHJcbiAgICAgICAgLy8gRm9yIGVhY2ggc3RhZ2UgZW52aXJvbm1lbnQgam9pbiB0byBhY2NvdW50IGVudmlyb25tZW50IChhbmQgc2V0IGFjY291bnQpLlxyXG4gICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoc3RhZ2VzKSk7XHJcbiAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiBtYXAudmFsdWVzKCkpIHtcclxuICAgICAgICAgICAgdmFsdWUuZW52aXJvbm1lbnRzLmZvckVhY2goZW52aXJvbm1lbnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnQuYWNjb3VudCA9IHRoaXMuZW52aXJvbm1lbnRCeU5hbWUoZW52aXJvbm1lbnQubmFtZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YWdlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhZ2VFbnZpcm9ubWVudHMoc3RhZ2VOYW1lOiBzdHJpbmcpOiBJU3RhZ2VFbnZpcm9ubWVudFtdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0gdGhpcy5zdGFnZXMoKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YWdlcykge1xyXG4gICAgICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHN0YWdlcykpO1xyXG4gICAgICAgICAgICBydiA9IG1hcC5nZXQoc3RhZ2VOYW1lKT8uZW52aXJvbm1lbnRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnYodHlwZTogc3RyaW5nLCBzdGFnZU5hbWU/OiBzdHJpbmcpOiBjZGsuRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhZ2VFbnZpcm9ubWVudHMgPSB0aGlzLnN0YWdlRW52aXJvbm1lbnRzKHN0YWdlTmFtZSA/PyB0aGlzLnN0YWdlKCkpO1xyXG4gICAgICAgIGNvbnN0IGVudmlyb25tZW50TmFtZSA9IHN0YWdlRW52aXJvbm1lbnRzPy5maW5kKG8gPT4gby50eXBlID09PSB0eXBlKT8ubmFtZTtcclxuXHJcbiAgICAgICAgaWYgKGVudmlyb25tZW50TmFtZSkge1xyXG4gICAgICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMuZW52aXJvbm1lbnRCeU5hbWUoZW52aXJvbm1lbnROYW1lKTtcclxuICAgICAgICAgICAgcnYgPSB7IGFjY291bnQ6IGVudmlyb25tZW50Py5hY2NvdW50SWQsIHJlZ2lvbjogZW52aXJvbm1lbnQ/LnJlZ2lvbiB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5vcmdhbml6YXRpb25OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VDYXNlLnBhc2NhbENhc2UodGhpcy5vcmdhbml6YXRpb25OYW1lKCkpO1xyXG4gICAgfVxyXG59Il19