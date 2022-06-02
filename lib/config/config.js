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
    /**
     * Get stage from command line or config. e.g. sandbox1, test, prod.
     * @returns
     */
    stage() {
        var _b;
        const stage = (_b = this.appNode.tryGetContext('stage')) !== null && _b !== void 0 ? _b : this.appNode.tryGetContext('@jompx-local').stage;
        if (!stage)
            throw Error('Jompx: stage not found! Stage is missing from command line or jompx.local.ts.');
        return stage;
    }
    /**
     * Get list of AWS environemnts. An AWS environment is primarily a accountId/region pair.
     * @returns
     */
    environments() {
        return this.appNode.tryGetContext('@jompx').environments;
    }
    /**
     * Get an AWS environment by friendly name.
     * @param name
     * @returns
     */
    environmentByName(name) {
        return this.appNode.tryGetContext('@jompx').environments.find((o) => o.name === name);
    }
    /**
     * Get an AWS environment by AWS account id.
     * @param accountId
     * @returns
     */
    environmentByAccountId(accountId) {
        return this.appNode.tryGetContext('@jompx').environments.find((o) => o.accountId === accountId);
    }
    /**
     * Get config stages. Use dot notation to get a stage e.g. stages.prod
     * JSII constructs don't support map object. To convert to map use: new Map(Object.entries(config.stages()));
     * @returns
     */
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
    // stageEnvironments
    stageDeployments(stageName) {
        var _b;
        let rv = undefined;
        const stages = this.stages();
        if (stages) {
            const map = new Map(Object.entries(stages));
            rv = (_b = map.get(stageName)) === null || _b === void 0 ? void 0 : _b.deployments;
        }
        return rv;
    }
    /**
     * Get env (AWS accountId + region) from config (type + stage) e.g. cicd + test = xxxxxxxxxxxx + us-west-2.
     * If no stage provided then will use current stage.
     * @param deploymentType
     * @param stage
     * @returns
     */
    env(deploymentType, stage) {
        var _b;
        let rv = undefined;
        const stageDeployments = this.stageDeployments(stage !== null && stage !== void 0 ? stage : this.stage());
        const environmentName = (_b = stageDeployments === null || stageDeployments === void 0 ? void 0 : stageDeployments.find(o => o.type === deploymentType)) === null || _b === void 0 ? void 0 : _b.environmentName;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw2REFBNkQ7QUFDN0QsMENBQTBDO0FBSTFDLE1BQWEsTUFBTTtJQUVmLFlBQ1csT0FBYTtRQUFiLFlBQU8sR0FBUCxPQUFPLENBQU07SUFDcEIsQ0FBQztJQUVMOzs7T0FHRztJQUNJLEtBQUs7O1FBQ1IsTUFBTSxLQUFLLFNBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN0RyxJQUFJLENBQUMsS0FBSztZQUFFLE1BQU0sS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7UUFDekcsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQztJQUM3RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLGlCQUFpQixDQUFDLElBQVk7UUFDakMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQ3hHLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksc0JBQXNCLENBQUMsU0FBaUI7UUFDM0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBQ2xILENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTTtRQUNULE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN6RSxNQUFNLFdBQVcsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFOUUsMEVBQTBFO1FBQzFFLE1BQU0sTUFBTSxHQUFHLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVuRCw0RUFBNEU7UUFDNUUsK0VBQStFO1FBQy9FLCtDQUErQztRQUMvQyxzQ0FBc0M7UUFDdEMsa0RBQWtEO1FBQ2xELDBFQUEwRTtRQUMxRSxVQUFVO1FBQ1YsSUFBSTtRQUVKLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxvQkFBb0I7SUFDYixnQkFBZ0IsQ0FBQyxTQUFpQjs7UUFDckMsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQ25CLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUU3QixJQUFJLE1BQU0sRUFBRTtZQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM1QyxFQUFFLFNBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsMENBQUUsV0FBVyxDQUFDO1NBQ3hDO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksR0FBRyxDQUFDLGNBQXNCLEVBQUUsS0FBYzs7UUFDN0MsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBRW5CLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssYUFBTCxLQUFLLGNBQUwsS0FBSyxHQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sZUFBZSxTQUFHLGdCQUFnQixhQUFoQixnQkFBZ0IsdUJBQWhCLGdCQUFnQixDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssY0FBYywyQ0FBRyxlQUFlLENBQUM7UUFFaEcsSUFBSSxlQUFlLEVBQUU7WUFDakIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVELEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsTUFBTSxFQUFFLENBQUM7U0FDekU7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxnQkFBZ0I7UUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqRSxDQUFDO0lBRU0sMEJBQTBCO1FBQzdCLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7O0FBMUdMLHdCQTJHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcclxuaW1wb3J0ICogYXMgY2hhbmdlQ2FzZSBmcm9tICdjaGFuZ2UtY2FzZSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuaW1wb3J0IHsgSUVudmlyb25tZW50LCBJU3RhZ2UsIElTdGFnZURlcGxveW1lbnQgfSBmcm9tICcuL2NvbmZpZy50eXBlcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ29uZmlnIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwdWJsaWMgYXBwTm9kZTogTm9kZVxyXG4gICAgKSB7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBzdGFnZSBmcm9tIGNvbW1hbmQgbGluZSBvciBjb25maWcuIGUuZy4gc2FuZGJveDEsIHRlc3QsIHByb2QuXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhZ2UoKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBzdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdzdGFnZScpID8/IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgtbG9jYWwnKS5zdGFnZTtcclxuICAgICAgICBpZiAoIXN0YWdlKSB0aHJvdyBFcnJvcignSm9tcHg6IHN0YWdlIG5vdCBmb3VuZCEgU3RhZ2UgaXMgbWlzc2luZyBmcm9tIGNvbW1hbmQgbGluZSBvciBqb21weC5sb2NhbC50cy4nKTtcclxuICAgICAgICByZXR1cm4gc3RhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbGlzdCBvZiBBV1MgZW52aXJvbmVtbnRzLiBBbiBBV1MgZW52aXJvbm1lbnQgaXMgcHJpbWFyaWx5IGEgYWNjb3VudElkL3JlZ2lvbiBwYWlyLlxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVudmlyb25tZW50cygpOiBJRW52aXJvbm1lbnRbXSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5lbnZpcm9ubWVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYW4gQVdTIGVudmlyb25tZW50IGJ5IGZyaWVuZGx5IG5hbWUuXHJcbiAgICAgKiBAcGFyYW0gbmFtZVxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVudmlyb25tZW50QnlOYW1lKG5hbWU6IHN0cmluZyk6IElFbnZpcm9ubWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5lbnZpcm9ubWVudHMuZmluZCgobzogSUVudmlyb25tZW50KSA9PiBvLm5hbWUgPT09IG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuIEFXUyBlbnZpcm9ubWVudCBieSBBV1MgYWNjb3VudCBpZC5cclxuICAgICAqIEBwYXJhbSBhY2NvdW50SWRcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudEJ5QWNjb3VudElkKGFjY291bnRJZDogc3RyaW5nKTogSUVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cy5maW5kKChvOiBJRW52aXJvbm1lbnQpID0+IG8uYWNjb3VudElkID09PSBhY2NvdW50SWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGNvbmZpZyBzdGFnZXMuIFVzZSBkb3Qgbm90YXRpb24gdG8gZ2V0IGEgc3RhZ2UgZS5nLiBzdGFnZXMucHJvZFxyXG4gICAgICogSlNJSSBjb25zdHJ1Y3RzIGRvbid0IHN1cHBvcnQgbWFwIG9iamVjdC4gVG8gY29udmVydCB0byBtYXAgdXNlOiBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKGNvbmZpZy5zdGFnZXMoKSkpO1xyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YWdlcygpOiBJU3RhZ2UgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZ1N0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLnN0YWdlcztcclxuICAgICAgICBjb25zdCBsb2NhbFN0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weC1sb2NhbCcpLnN0YWdlcztcclxuXHJcbiAgICAgICAgLy8gR2V0IHN0YWdlcyBmcm9tIGNvbmZpZyBhbmQgbG9jYWwgY29uZmlnLiBMb2NhbCBjb25maWcgb3ZlcnJpZGVzIGNvbmZpZy5cclxuICAgICAgICBjb25zdCBzdGFnZXMgPSB7IC4uLmNvbmZpZ1N0YWdlcywgLi4ubG9jYWxTdGFnZXMgfTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlLiBJIGRvbid0IHRoaW5rIHdlIHdhbnQgdG8gdHJ5IHRvIGpvaW4gYW4gYWNjb3VudCB0byBhIHN0YWdlLlxyXG4gICAgICAgIC8vIC8vIEZvciBlYWNoIHN0YWdlIGVudmlyb25tZW50IGpvaW4gdG8gYWNjb3VudCBlbnZpcm9ubWVudCAoYW5kIHNldCBhY2NvdW50KS5cclxuICAgICAgICAvLyBjb25zdCBtYXAgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHN0YWdlcykpO1xyXG4gICAgICAgIC8vIGZvciAoY29uc3QgdmFsdWUgb2YgbWFwLnZhbHVlcygpKSB7XHJcbiAgICAgICAgLy8gICAgIHZhbHVlLmVudmlyb25tZW50cy5mb3JFYWNoKGVudmlyb25tZW50ID0+IHtcclxuICAgICAgICAvLyAgICAgICAgIGVudmlyb25tZW50LmFjY291bnQgPSB0aGlzLmVudmlyb25tZW50QnlOYW1lKGVudmlyb25tZW50Lm5hbWUpO1xyXG4gICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGFnZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gc3RhZ2VFbnZpcm9ubWVudHNcclxuICAgIHB1YmxpYyBzdGFnZURlcGxveW1lbnRzKHN0YWdlTmFtZTogc3RyaW5nKTogSVN0YWdlRGVwbG95bWVudFtdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0gdGhpcy5zdGFnZXMoKTtcclxuXHJcbiAgICAgICAgaWYgKHN0YWdlcykge1xyXG4gICAgICAgICAgICBjb25zdCBtYXAgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHN0YWdlcykpO1xyXG4gICAgICAgICAgICBydiA9IG1hcC5nZXQoc3RhZ2VOYW1lKT8uZGVwbG95bWVudHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgZW52IChBV1MgYWNjb3VudElkICsgcmVnaW9uKSBmcm9tIGNvbmZpZyAodHlwZSArIHN0YWdlKSBlLmcuIGNpY2QgKyB0ZXN0ID0geHh4eHh4eHh4eHh4ICsgdXMtd2VzdC0yLlxyXG4gICAgICogSWYgbm8gc3RhZ2UgcHJvdmlkZWQgdGhlbiB3aWxsIHVzZSBjdXJyZW50IHN0YWdlLlxyXG4gICAgICogQHBhcmFtIGRlcGxveW1lbnRUeXBlXHJcbiAgICAgKiBAcGFyYW0gc3RhZ2VcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbnYoZGVwbG95bWVudFR5cGU6IHN0cmluZywgc3RhZ2U/OiBzdHJpbmcpOiBjZGsuRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RhZ2VEZXBsb3ltZW50cyA9IHRoaXMuc3RhZ2VEZXBsb3ltZW50cyhzdGFnZSA/PyB0aGlzLnN0YWdlKCkpO1xyXG4gICAgICAgIGNvbnN0IGVudmlyb25tZW50TmFtZSA9IHN0YWdlRGVwbG95bWVudHM/LmZpbmQobyA9PiBvLnR5cGUgPT09IGRlcGxveW1lbnRUeXBlKT8uZW52aXJvbm1lbnROYW1lO1xyXG5cclxuICAgICAgICBpZiAoZW52aXJvbm1lbnROYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudmlyb25tZW50ID0gdGhpcy5lbnZpcm9ubWVudEJ5TmFtZShlbnZpcm9ubWVudE5hbWUpO1xyXG4gICAgICAgICAgICBydiA9IHsgYWNjb3VudDogZW52aXJvbm1lbnQ/LmFjY291bnRJZCwgcmVnaW9uOiBlbnZpcm9ubWVudD8ucmVnaW9uIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9yZ2FuaXphdGlvbk5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLm9yZ2FuaXphdGlvbk5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9yZ2FuaXphdGlvbk5hbWVQYXNjYWxDYXNlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUNhc2UucGFzY2FsQ2FzZSh0aGlzLm9yZ2FuaXphdGlvbk5hbWUoKSk7XHJcbiAgICB9XHJcbn0iXX0=