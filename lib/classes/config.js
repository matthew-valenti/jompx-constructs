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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNkRBQTZEO0FBQzdELDBDQUEwQztBQUkxQyxNQUFhLE1BQU07SUFFZixZQUNXLE9BQWE7UUFBYixZQUFPLEdBQVAsT0FBTyxDQUFNO0lBQ3BCLENBQUM7SUFFRSxLQUFLOztRQUNSLE1BQU0sS0FBSyxTQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdEcsSUFBSSxDQUFDLEtBQUs7WUFBRSxNQUFNLEtBQUssQ0FBQywrRUFBK0UsQ0FBQyxDQUFDO1FBQ3pHLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTSxZQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDN0QsQ0FBQztJQUVNLGlCQUFpQixDQUFDLElBQVk7UUFDakMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQ3hHLENBQUM7SUFFTSxzQkFBc0IsQ0FBQyxTQUFpQjtRQUMzQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUM7SUFDbEgsQ0FBQztJQUVNLE1BQU07UUFDVCxNQUFNLFlBQVksR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDekUsTUFBTSxXQUFXLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRTlFLDBFQUEwRTtRQUMxRSxNQUFNLE1BQU0sR0FBRyxFQUFFLEdBQUcsWUFBWSxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFFbkQsNEVBQTRFO1FBQzVFLCtFQUErRTtRQUMvRSwrQ0FBK0M7UUFDL0Msc0NBQXNDO1FBQ3RDLGtEQUFrRDtRQUNsRCwwRUFBMEU7UUFDMUUsVUFBVTtRQUNWLElBQUk7UUFFSixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0saUJBQWlCLENBQUMsU0FBaUI7O1FBQ3RDLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUNuQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFN0IsSUFBSSxNQUFNLEVBQUU7WUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDNUMsRUFBRSxTQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBDQUFFLFlBQVksQ0FBQztTQUN6QztRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVNLEdBQUcsQ0FBQyxJQUFZLEVBQUUsU0FBa0I7O1FBQ3ZDLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUVuQixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLGFBQVQsU0FBUyxjQUFULFNBQVMsR0FBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM1RSxNQUFNLGVBQWUsU0FBRyxpQkFBaUIsYUFBakIsaUJBQWlCLHVCQUFqQixpQkFBaUIsQ0FBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksMkNBQUcsSUFBSSxDQUFDO1FBRTVFLElBQUksZUFBZSxFQUFFO1lBQ2pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM1RCxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsV0FBVyxhQUFYLFdBQVcsdUJBQVgsV0FBVyxDQUFFLE1BQU0sRUFBRSxDQUFDO1NBQ3pFO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRU0sZ0JBQWdCO1FBQ25CLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsZ0JBQWdCLENBQUM7SUFDakUsQ0FBQztJQUVNLDBCQUEwQjtRQUM3QixPQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztJQUMxRCxDQUFDOztBQTNFTCx3QkE0RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IElFbnZpcm9ubWVudCwgSVN0YWdlLCBJU3RhZ2VFbnZpcm9ubWVudCB9IGZyb20gJy4uL3R5cGVzL2NvbmZpZyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgYXBwTm9kZTogTm9kZVxyXG4gICAgKSB7IH1cclxuXHJcbiAgICBwdWJsaWMgc3RhZ2UoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdzdGFnZScpID8/IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgtbG9jYWwnKS5zdGFnZTtcclxuICAgICAgICBpZiAoIXN0YWdlKSB0aHJvdyBFcnJvcignSm9tcHg6IHN0YWdlIG5vdCBmb3VuZCEgU3RhZ2UgaXMgbWlzc2luZyBmcm9tIGNvbW1hbmQgbGluZSBvciBqb21weC5sb2NhbC50cy4nKTtcclxuICAgICAgICByZXR1cm4gc3RhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudmlyb25tZW50cygpOiBJRW52aXJvbm1lbnRbXSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5lbnZpcm9ubWVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudmlyb25tZW50QnlOYW1lKG5hbWU6IHN0cmluZyk6IElFbnZpcm9ubWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5lbnZpcm9ubWVudHMuZmluZCgobzogSUVudmlyb25tZW50KSA9PiBvLm5hbWUgPT09IG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudEJ5QWNjb3VudElkKGFjY291bnRJZDogc3RyaW5nKTogSUVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cy5maW5kKChvOiBJRW52aXJvbm1lbnQpID0+IG8uYWNjb3VudElkID09PSBhY2NvdW50SWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFnZXMoKTogSVN0YWdlIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCBjb25maWdTdGFnZXM6IElTdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5zdGFnZXM7XHJcbiAgICAgICAgY29uc3QgbG9jYWxTdGFnZXM6IElTdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgtbG9jYWwnKS5zdGFnZXM7XHJcblxyXG4gICAgICAgIC8vIEdldCBzdGFnZXMgZnJvbSBjb25maWcgYW5kIGxvY2FsIGNvbmZpZy4gTG9jYWwgY29uZmlnIG92ZXJyaWRlcyBjb25maWcuXHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0geyAuLi5jb25maWdTdGFnZXMsIC4uLmxvY2FsU3RhZ2VzIH07XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZS4gSSBkb24ndCB0aGluayB3ZSB3YW50IHRvIHRyeSB0byBqb2luIGFuIGFjY291bnQgdG8gYSBzdGFnZS5cclxuICAgICAgICAvLyAvLyBGb3IgZWFjaCBzdGFnZSBlbnZpcm9ubWVudCBqb2luIHRvIGFjY291bnQgZW52aXJvbm1lbnQgKGFuZCBzZXQgYWNjb3VudCkuXHJcbiAgICAgICAgLy8gY29uc3QgbWFwID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhzdGFnZXMpKTtcclxuICAgICAgICAvLyBmb3IgKGNvbnN0IHZhbHVlIG9mIG1hcC52YWx1ZXMoKSkge1xyXG4gICAgICAgIC8vICAgICB2YWx1ZS5lbnZpcm9ubWVudHMuZm9yRWFjaChlbnZpcm9ubWVudCA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICBlbnZpcm9ubWVudC5hY2NvdW50ID0gdGhpcy5lbnZpcm9ubWVudEJ5TmFtZShlbnZpcm9ubWVudC5uYW1lKTtcclxuICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RhZ2VzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGFnZUVudmlyb25tZW50cyhzdGFnZU5hbWU6IHN0cmluZyk6IElTdGFnZUVudmlyb25tZW50W10gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCBzdGFnZXMgPSB0aGlzLnN0YWdlcygpO1xyXG5cclxuICAgICAgICBpZiAoc3RhZ2VzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoc3RhZ2VzKSk7XHJcbiAgICAgICAgICAgIHJ2ID0gbWFwLmdldChzdGFnZU5hbWUpPy5lbnZpcm9ubWVudHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudih0eXBlOiBzdHJpbmcsIHN0YWdlTmFtZT86IHN0cmluZyk6IGNkay5FbnZpcm9ubWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBjb25zdCBzdGFnZUVudmlyb25tZW50cyA9IHRoaXMuc3RhZ2VFbnZpcm9ubWVudHMoc3RhZ2VOYW1lID8/IHRoaXMuc3RhZ2UoKSk7XHJcbiAgICAgICAgY29uc3QgZW52aXJvbm1lbnROYW1lID0gc3RhZ2VFbnZpcm9ubWVudHM/LmZpbmQobyA9PiBvLnR5cGUgPT09IHR5cGUpPy5uYW1lO1xyXG5cclxuICAgICAgICBpZiAoZW52aXJvbm1lbnROYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudmlyb25tZW50ID0gdGhpcy5lbnZpcm9ubWVudEJ5TmFtZShlbnZpcm9ubWVudE5hbWUpO1xyXG4gICAgICAgICAgICBydiA9IHsgYWNjb3VudDogZW52aXJvbm1lbnQ/LmFjY291bnRJZCwgcmVnaW9uOiBlbnZpcm9ubWVudD8ucmVnaW9uIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9yZ2FuaXphdGlvbk5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLm9yZ2FuaXphdGlvbk5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9yZ2FuaXphdGlvbk5hbWVQYXNjYWxDYXNlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUNhc2UucGFzY2FsQ2FzZSh0aGlzLm9yZ2FuaXphdGlvbk5hbWUoKSk7XHJcbiAgICB9XHJcbn0iXX0=