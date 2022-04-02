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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNkRBQTZEO0FBQzdELDBDQUEwQztBQUkxQyxNQUFhLE1BQU07SUFFZixZQUNXLE9BQWE7UUFBYixZQUFPLEdBQVAsT0FBTyxDQUFNO0lBQ3BCLENBQUM7SUFFRSxLQUFLOztRQUNSLE1BQU0sS0FBSyxTQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdEcsSUFBSSxDQUFDLEtBQUs7WUFBRSxNQUFNLEtBQUssQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO1FBQ3hHLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxZQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDN0QsQ0FBQztJQUVNLGlCQUFpQixDQUFDLElBQVk7UUFDakMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQ3hHLENBQUM7SUFFTSxzQkFBc0IsQ0FBQyxTQUFpQjtRQUMzQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUM7SUFDbEgsQ0FBQztJQUVNLE1BQU07UUFDVCxNQUFNLFlBQVksR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDekUsTUFBTSxXQUFXLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRTlFLDBFQUEwRTtRQUMxRSxNQUFNLE1BQU0sR0FBRyxFQUFFLEdBQUcsWUFBWSxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFFbkQsNEVBQTRFO1FBQzVFLCtFQUErRTtRQUMvRSwrQ0FBK0M7UUFDL0Msc0NBQXNDO1FBQ3RDLGtEQUFrRDtRQUNsRCwwRUFBMEU7UUFDMUUsVUFBVTtRQUNWLElBQUk7UUFFSixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0saUJBQWlCLENBQUMsU0FBaUI7O1FBQ3RDLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUNuQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFN0IsSUFBSSxNQUFNLEVBQUU7WUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDNUMsRUFBRSxTQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBDQUFFLFlBQVksQ0FBQztTQUN6QztRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVNLEdBQUcsQ0FBQyxJQUFZLEVBQUUsU0FBa0I7O1FBQ3ZDLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUVuQixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLGFBQVQsU0FBUyxjQUFULFNBQVMsR0FBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM1RSxNQUFNLGVBQWUsU0FBRyxpQkFBaUIsYUFBakIsaUJBQWlCLHVCQUFqQixpQkFBaUIsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksMkNBQUcsSUFBSSxDQUFDO1FBRTVFLElBQUksZUFBZSxFQUFFO1lBQ2pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM1RCxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLE1BQU0sRUFBRSxDQUFDO1NBQ3pFO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRU0sZ0JBQWdCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsZ0JBQWdCLENBQUM7SUFDakUsQ0FBQztJQUVNLDBCQUEwQjtRQUM3QixPQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDOztBQTNFTCx3QkE0RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IElFbnZpcm9ubWVudCwgSVN0YWdlLCBJU3RhZ2VFbnZpcm9ubWVudCB9IGZyb20gJy4uL3R5cGVzL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgYXBwTm9kZTogTm9kZVxyXG4gICAgKSB7IH1cclxuXHJcbiAgICBwdWJsaWMgc3RhZ2UoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdzdGFnZScpID8/IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgtbG9jYWwnKS5zdGFnZTtcclxuICAgICAgICBpZiAoIXN0YWdlKSB0aHJvdyBFcnJvcignSm9tcHggc3RhZ2Ugbm90IGZvdW5kISBTdGFnZSBpcyBtaXNzaW5nIGZyb20gY29tbWFuZCBsaW5lIG9yIGpvbXB4LmxvY2FsLnRzLicpO1xyXG4gICAgICAgIHJldHVybiBzdGFnZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRzKCk6IElFbnZpcm9ubWVudFtdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRCeU5hbWUobmFtZTogc3RyaW5nKTogSUVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cy5maW5kKChvOiBJRW52aXJvbm1lbnQpID0+IG8ubmFtZSA9PT0gbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudmlyb25tZW50QnlBY2NvdW50SWQoYWNjb3VudElkOiBzdHJpbmcpOiBJRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzLmZpbmQoKG86IElFbnZpcm9ubWVudCkgPT4gby5hY2NvdW50SWQgPT09IGFjY291bnRJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YWdlcygpOiBJU3RhZ2UgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZ1N0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLnN0YWdlcztcclxuICAgICAgICBjb25zdCBsb2NhbFN0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weC1sb2NhbCcpLnN0YWdlcztcclxuXHJcbiAgICAgICAgLy8gR2V0IHN0YWdlcyBmcm9tIGNvbmZpZyBhbmQgbG9jYWwgY29uZmlnLiBMb2NhbCBjb25maWcgb3ZlcnJpZGVzIGNvbmZpZy5cclxuICAgICAgICBjb25zdCBzdGFnZXMgPSB7IC4uLmNvbmZpZ1N0YWdlcywgLi4ubG9jYWxTdGFnZXMgfTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlLiBJIGRvbid0IHRoaW5rIHdlIHdhbnQgdG8gdHJ5IHRvIGpvaW4gYW4gYWNjb3VudCB0byBhIHN0YWdlLlxyXG4gICAgICAgIC8vIC8vIEZvciBlYWNoIHN0YWdlIGVudmlyb25tZW50IGpvaW4gdG8gYWNjb3VudCBlbnZpcm9ubWVudCAoYW5kIHNldCBhY2NvdW50KS5cclxuICAgICAgICAvLyBjb25zdCBtYXAgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHN0YWdlcykpO1xyXG4gICAgICAgIC8vIGZvciAoY29uc3QgdmFsdWUgb2YgbWFwLnZhbHVlcygpKSB7XHJcbiAgICAgICAgLy8gICAgIHZhbHVlLmVudmlyb25tZW50cy5mb3JFYWNoKGVudmlyb25tZW50ID0+IHtcclxuICAgICAgICAvLyAgICAgICAgIGVudmlyb25tZW50LmFjY291bnQgPSB0aGlzLmVudmlyb25tZW50QnlOYW1lKGVudmlyb25tZW50Lm5hbWUpO1xyXG4gICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGFnZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YWdlRW52aXJvbm1lbnRzKHN0YWdlTmFtZTogc3RyaW5nKTogSVN0YWdlRW52aXJvbm1lbnRbXSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlcyA9IHRoaXMuc3RhZ2VzKCk7XHJcblxyXG4gICAgICAgIGlmIChzdGFnZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhzdGFnZXMpKTtcclxuICAgICAgICAgICAgcnYgPSBtYXAuZ2V0KHN0YWdlTmFtZSk/LmVudmlyb25tZW50cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW52KHR5cGU6IHN0cmluZywgc3RhZ2VOYW1lPzogc3RyaW5nKTogY2RrLkVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YWdlRW52aXJvbm1lbnRzID0gdGhpcy5zdGFnZUVudmlyb25tZW50cyhzdGFnZU5hbWUgPz8gdGhpcy5zdGFnZSgpKTtcclxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudE5hbWUgPSBzdGFnZUVudmlyb25tZW50cz8uZmluZChvID0+IG8udHlwZSA9PT0gdHlwZSk/Lm5hbWU7XHJcblxyXG4gICAgICAgIGlmIChlbnZpcm9ubWVudE5hbWUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW52aXJvbm1lbnQgPSB0aGlzLmVudmlyb25tZW50QnlOYW1lKGVudmlyb25tZW50TmFtZSk7XHJcbiAgICAgICAgICAgIHJ2ID0geyBhY2NvdW50OiBlbnZpcm9ubWVudD8uYWNjb3VudElkLCByZWdpb246IGVudmlyb25tZW50Py5yZWdpb24gfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3JnYW5pemF0aW9uTmFtZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4Jykub3JnYW5pemF0aW9uTmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb3JnYW5pemF0aW9uTmFtZVBhc2NhbENhc2UoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gY2hhbmdlQ2FzZS5wYXNjYWxDYXNlKHRoaXMub3JnYW5pemF0aW9uTmFtZSgpKTtcclxuICAgIH1cclxufSJdfQ==