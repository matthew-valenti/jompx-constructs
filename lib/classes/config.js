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
            throw Error('Jompx stage not found! Stage is missing from command line or jompx.local.ts.');
        return stage;
    }
    environments() {
        return this.appNode.tryGetContext('@jompx').environments;
    }
    environment(environmentName) {
        return this.appNode.tryGetContext('@jompx').environments.find((o) => o.name === environmentName);
    }
    environmentByAccountId(accountId) {
        return this.appNode.tryGetContext('@jompx').environments.find((o) => o.accountId === accountId);
    }
    stageEnvironments(stageName) {
        var _b;
        // Get stages from config and local config. Local config overrides config.
        const configStages = this.appNode.tryGetContext('@jompx').stages;
        const localStages = this.appNode.tryGetContext('@jompx-local').stages;
        const stages = { ...configStages, ...localStages };
        const map = new Map(Object.entries(stages));
        return (_b = map.get(stageName)) === null || _b === void 0 ? void 0 : _b.environments;
    }
    env(environmentType, stageName) {
        var _b;
        let rv = undefined;
        const stageEnvironments = this.stageEnvironments(stageName !== null && stageName !== void 0 ? stageName : this.stage());
        const environmentName = (_b = stageEnvironments === null || stageEnvironments === void 0 ? void 0 : stageEnvironments.find(o => o.environmentType === environmentType)) === null || _b === void 0 ? void 0 : _b.environmentName;
        if (environmentName) {
            const environment = this.environment(environmentName);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNkRBQTZEO0FBQzdELDBDQUEwQztBQUkxQyxNQUFhLE1BQU07SUFFZixZQUNXLE9BQWE7UUFBYixZQUFPLEdBQVAsT0FBTyxDQUFNO0lBQ3BCLENBQUM7SUFFRSxLQUFLOztRQUNSLE1BQU0sS0FBSyxTQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdEcsSUFBSSxDQUFDLEtBQUs7WUFBRSxNQUFNLEtBQUssQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO1FBQ3hHLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxZQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDN0QsQ0FBQztJQUVNLFdBQVcsQ0FBQyxlQUF1QjtRQUN0QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLENBQUM7SUFDbkgsQ0FBQztJQUVNLHNCQUFzQixDQUFDLFNBQWlCO1FBQzNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQztJQUNsSCxDQUFDO0lBRU0saUJBQWlCLENBQUMsU0FBaUI7O1FBQ3RDLDBFQUEwRTtRQUMxRSxNQUFNLFlBQVksR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDekUsTUFBTSxXQUFXLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzlFLE1BQU0sTUFBTSxHQUFHLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVuRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUMsYUFBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwQ0FBRSxZQUFZLENBQUM7SUFDNUMsQ0FBQztJQUVNLEdBQUcsQ0FBQyxlQUF1QixFQUFFLFNBQWtCOztRQUNsRCxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFFbkIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxhQUFULFNBQVMsY0FBVCxTQUFTLEdBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDNUUsTUFBTSxlQUFlLFNBQUcsaUJBQWlCLGFBQWpCLGlCQUFpQix1QkFBakIsaUJBQWlCLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsS0FBSyxlQUFlLDJDQUFHLGVBQWUsQ0FBQztRQUU3RyxJQUFJLGVBQWUsRUFBRTtZQUNqQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3RELEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsTUFBTSxFQUFFLENBQUM7U0FDekU7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxnQkFBZ0I7UUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqRSxDQUFDO0lBRU0sMEJBQTBCO1FBQzdCLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7O0FBdERMLHdCQXVEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgSUVudmlyb25tZW50LCBJU3RhZ2UsIElTdGFnZUVudmlyb25tZW50IH0gZnJvbSAnLi4vdHlwZXMvY29uZmlnLmludGVyZmFjZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgYXBwTm9kZTogTm9kZVxyXG4gICAgKSB7IH1cclxuXHJcbiAgICBwdWJsaWMgc3RhZ2UoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdzdGFnZScpID8/IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgtbG9jYWwnKS5zdGFnZTtcclxuICAgICAgICBpZiAoIXN0YWdlKSB0aHJvdyBFcnJvcignSm9tcHggc3RhZ2Ugbm90IGZvdW5kISBTdGFnZSBpcyBtaXNzaW5nIGZyb20gY29tbWFuZCBsaW5lIG9yIGpvbXB4LmxvY2FsLnRzLicpO1xyXG4gICAgICAgIHJldHVybiBzdGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRzKCk6IElFbnZpcm9ubWVudFtdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnQoZW52aXJvbm1lbnROYW1lOiBzdHJpbmcpOiBJRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzLmZpbmQoKG86IElFbnZpcm9ubWVudCkgPT4gby5uYW1lID09PSBlbnZpcm9ubWVudE5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudEJ5QWNjb3VudElkKGFjY291bnRJZDogc3RyaW5nKTogSUVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cy5maW5kKChvOiBJRW52aXJvbm1lbnQpID0+IG8uYWNjb3VudElkID09PSBhY2NvdW50SWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFnZUVudmlyb25tZW50cyhzdGFnZU5hbWU6IHN0cmluZyk6IElTdGFnZUVudmlyb25tZW50W10gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIC8vIEdldCBzdGFnZXMgZnJvbSBjb25maWcgYW5kIGxvY2FsIGNvbmZpZy4gTG9jYWwgY29uZmlnIG92ZXJyaWRlcyBjb25maWcuXHJcbiAgICAgICAgY29uc3QgY29uZmlnU3RhZ2VzOiBJU3RhZ2UgPSB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4Jykuc3RhZ2VzO1xyXG4gICAgICAgIGNvbnN0IGxvY2FsU3RhZ2VzOiBJU3RhZ2UgPSB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4LWxvY2FsJykuc3RhZ2VzO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlcyA9IHsgLi4uY29uZmlnU3RhZ2VzLCAuLi5sb2NhbFN0YWdlcyB9O1xyXG5cclxuICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHN0YWdlcykpO1xyXG4gICAgICAgIHJldHVybiBtYXAuZ2V0KHN0YWdlTmFtZSk/LmVudmlyb25tZW50cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW52KGVudmlyb25tZW50VHlwZTogc3RyaW5nLCBzdGFnZU5hbWU/OiBzdHJpbmcpOiBjZGsuRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhZ2VFbnZpcm9ubWVudHMgPSB0aGlzLnN0YWdlRW52aXJvbm1lbnRzKHN0YWdlTmFtZSA/PyB0aGlzLnN0YWdlKCkpO1xyXG4gICAgICAgIGNvbnN0IGVudmlyb25tZW50TmFtZSA9IHN0YWdlRW52aXJvbm1lbnRzPy5maW5kKG8gPT4gby5lbnZpcm9ubWVudFR5cGUgPT09IGVudmlyb25tZW50VHlwZSk/LmVudmlyb25tZW50TmFtZTtcclxuXHJcbiAgICAgICAgaWYgKGVudmlyb25tZW50TmFtZSkge1xyXG4gICAgICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMuZW52aXJvbm1lbnQoZW52aXJvbm1lbnROYW1lKTtcclxuICAgICAgICAgICAgcnYgPSB7IGFjY291bnQ6IGVudmlyb25tZW50Py5hY2NvdW50SWQsIHJlZ2lvbjogZW52aXJvbm1lbnQ/LnJlZ2lvbiB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5vcmdhbml6YXRpb25OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VDYXNlLnBhc2NhbENhc2UodGhpcy5vcmdhbml6YXRpb25OYW1lKCkpO1xyXG4gICAgfVxyXG59Il19