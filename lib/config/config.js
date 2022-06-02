"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
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
        var _a;
        const stage = (_a = this.appNode.tryGetContext('stage')) !== null && _a !== void 0 ? _a : this.appNode.tryGetContext('@jompx-local').stage;
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
     * Constructs don't support map object. To convert to map use: new Map(Object.entries(config.stages()));
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
    /**
     * Get env (AWS accountId + region) from config (type + stageName) e.g. cicd + test = xxxxxxxxxxxx + us-west-2.
     * If no stage provided then will use current stage.
     * @param type
     * @param stage
     * @returns
     */
    env(type, stage) {
        var _a;
        let rv = undefined;
        const stageEnvironments = this.stageEnvironments(stage !== null && stage !== void 0 ? stage : this.stage());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkRBQTZEO0FBQzdELDBDQUEwQztBQUkxQyxNQUFhLE1BQU07SUFFZixZQUNXLE9BQWE7UUFBYixZQUFPLEdBQVAsT0FBTyxDQUFNO0lBQ3BCLENBQUM7SUFFTDs7O09BR0c7SUFDSSxLQUFLOztRQUNSLE1BQU0sS0FBSyxTQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdEcsSUFBSSxDQUFDLEtBQUs7WUFBRSxNQUFNLEtBQUssQ0FBQywrRUFBK0UsQ0FBQyxDQUFDO1FBQ3pHLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxZQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxpQkFBaUIsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztJQUN4RyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLHNCQUFzQixDQUFDLFNBQWlCO1FBQzNDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQztJQUNsSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU07UUFDVCxNQUFNLFlBQVksR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDekUsTUFBTSxXQUFXLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBRTlFLDBFQUEwRTtRQUMxRSxNQUFNLE1BQU0sR0FBRyxFQUFFLEdBQUcsWUFBWSxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFFbkQsNEVBQTRFO1FBQzVFLCtFQUErRTtRQUMvRSwrQ0FBK0M7UUFDL0Msc0NBQXNDO1FBQ3RDLGtEQUFrRDtRQUNsRCwwRUFBMEU7UUFDMUUsVUFBVTtRQUNWLElBQUk7UUFFSixPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRU0saUJBQWlCLENBQUMsU0FBaUI7O1FBQ3RDLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUNuQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFN0IsSUFBSSxNQUFNLEVBQUU7WUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDNUMsRUFBRSxTQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLDBDQUFFLFlBQVksQ0FBQztTQUN6QztRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNJLEdBQUcsQ0FBQyxJQUFZLEVBQUUsS0FBYzs7UUFDbkMsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBRW5CLE1BQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssYUFBTCxLQUFLLGNBQUwsS0FBSyxHQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3hFLE1BQU0sZUFBZSxTQUFHLGlCQUFpQixhQUFqQixpQkFBaUIsdUJBQWpCLGlCQUFpQixDQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSwyQ0FBRyxJQUFJLENBQUM7UUFFNUUsSUFBSSxlQUFlLEVBQUU7WUFDakIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVELEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsTUFBTSxFQUFFLENBQUM7U0FDekU7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFTSxnQkFBZ0I7UUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqRSxDQUFDO0lBRU0sMEJBQTBCO1FBQzdCLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7Q0FDSjtBQTFHRCx3QkEwR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IElFbnZpcm9ubWVudCwgSVN0YWdlLCBJU3RhZ2VFbnZpcm9ubWVudCB9IGZyb20gJy4vY29uZmlnLnR5cGVzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25maWcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBhcHBOb2RlOiBOb2RlXHJcbiAgICApIHsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHN0YWdlIGZyb20gY29tbWFuZCBsaW5lIG9yIGNvbmZpZy4gZS5nLiBzYW5kYm94MSwgdGVzdCwgcHJvZC5cclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGFnZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ3N0YWdlJykgPz8gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weC1sb2NhbCcpLnN0YWdlO1xyXG4gICAgICAgIGlmICghc3RhZ2UpIHRocm93IEVycm9yKCdKb21weDogc3RhZ2Ugbm90IGZvdW5kISBTdGFnZSBpcyBtaXNzaW5nIGZyb20gY29tbWFuZCBsaW5lIG9yIGpvbXB4LmxvY2FsLnRzLicpO1xyXG4gICAgICAgIHJldHVybiBzdGFnZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBsaXN0IG9mIEFXUyBlbnZpcm9uZW1udHMuIEFuIEFXUyBlbnZpcm9ubWVudCBpcyBwcmltYXJpbHkgYSBhY2NvdW50SWQvcmVnaW9uIHBhaXIuXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRzKCk6IElFbnZpcm9ubWVudFtdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbiBBV1MgZW52aXJvbm1lbnQgYnkgZnJpZW5kbHkgbmFtZS5cclxuICAgICAqIEBwYXJhbSBuYW1lXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRCeU5hbWUobmFtZTogc3RyaW5nKTogSUVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cy5maW5kKChvOiBJRW52aXJvbm1lbnQpID0+IG8ubmFtZSA9PT0gbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYW4gQVdTIGVudmlyb25tZW50IGJ5IEFXUyBhY2NvdW50IGlkLlxyXG4gICAgICogQHBhcmFtIGFjY291bnRJZFxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVudmlyb25tZW50QnlBY2NvdW50SWQoYWNjb3VudElkOiBzdHJpbmcpOiBJRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzLmZpbmQoKG86IElFbnZpcm9ubWVudCkgPT4gby5hY2NvdW50SWQgPT09IGFjY291bnRJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY29uZmlnIHN0YWdlcy4gVXNlIGRvdCBub3RhdGlvbiB0byBnZXQgYSBzdGFnZSBlLmcuIHN0YWdlcy5wcm9kXHJcbiAgICAgKiBDb25zdHJ1Y3RzIGRvbid0IHN1cHBvcnQgbWFwIG9iamVjdC4gVG8gY29udmVydCB0byBtYXAgdXNlOiBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKGNvbmZpZy5zdGFnZXMoKSkpO1xyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YWdlcygpOiBJU3RhZ2UgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZ1N0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLnN0YWdlcztcclxuICAgICAgICBjb25zdCBsb2NhbFN0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weC1sb2NhbCcpLnN0YWdlcztcclxuXHJcbiAgICAgICAgLy8gR2V0IHN0YWdlcyBmcm9tIGNvbmZpZyBhbmQgbG9jYWwgY29uZmlnLiBMb2NhbCBjb25maWcgb3ZlcnJpZGVzIGNvbmZpZy5cclxuICAgICAgICBjb25zdCBzdGFnZXMgPSB7IC4uLmNvbmZpZ1N0YWdlcywgLi4ubG9jYWxTdGFnZXMgfTtcclxuXHJcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlLiBJIGRvbid0IHRoaW5rIHdlIHdhbnQgdG8gdHJ5IHRvIGpvaW4gYW4gYWNjb3VudCB0byBhIHN0YWdlLlxyXG4gICAgICAgIC8vIC8vIEZvciBlYWNoIHN0YWdlIGVudmlyb25tZW50IGpvaW4gdG8gYWNjb3VudCBlbnZpcm9ubWVudCAoYW5kIHNldCBhY2NvdW50KS5cclxuICAgICAgICAvLyBjb25zdCBtYXAgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHN0YWdlcykpO1xyXG4gICAgICAgIC8vIGZvciAoY29uc3QgdmFsdWUgb2YgbWFwLnZhbHVlcygpKSB7XHJcbiAgICAgICAgLy8gICAgIHZhbHVlLmVudmlyb25tZW50cy5mb3JFYWNoKGVudmlyb25tZW50ID0+IHtcclxuICAgICAgICAvLyAgICAgICAgIGVudmlyb25tZW50LmFjY291bnQgPSB0aGlzLmVudmlyb25tZW50QnlOYW1lKGVudmlyb25tZW50Lm5hbWUpO1xyXG4gICAgICAgIC8vICAgICB9KTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdGFnZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YWdlRW52aXJvbm1lbnRzKHN0YWdlTmFtZTogc3RyaW5nKTogSVN0YWdlRW52aXJvbm1lbnRbXSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlcyA9IHRoaXMuc3RhZ2VzKCk7XHJcblxyXG4gICAgICAgIGlmIChzdGFnZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhzdGFnZXMpKTtcclxuICAgICAgICAgICAgcnYgPSBtYXAuZ2V0KHN0YWdlTmFtZSk/LmVudmlyb25tZW50cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBlbnYgKEFXUyBhY2NvdW50SWQgKyByZWdpb24pIGZyb20gY29uZmlnICh0eXBlICsgc3RhZ2VOYW1lKSBlLmcuIGNpY2QgKyB0ZXN0ID0geHh4eHh4eHh4eHh4ICsgdXMtd2VzdC0yLlxyXG4gICAgICogSWYgbm8gc3RhZ2UgcHJvdmlkZWQgdGhlbiB3aWxsIHVzZSBjdXJyZW50IHN0YWdlLlxyXG4gICAgICogQHBhcmFtIHR5cGVcclxuICAgICAqIEBwYXJhbSBzdGFnZVxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVudih0eXBlOiBzdHJpbmcsIHN0YWdlPzogc3RyaW5nKTogY2RrLkVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YWdlRW52aXJvbm1lbnRzID0gdGhpcy5zdGFnZUVudmlyb25tZW50cyhzdGFnZSA/PyB0aGlzLnN0YWdlKCkpO1xyXG4gICAgICAgIGNvbnN0IGVudmlyb25tZW50TmFtZSA9IHN0YWdlRW52aXJvbm1lbnRzPy5maW5kKG8gPT4gby50eXBlID09PSB0eXBlKT8ubmFtZTtcclxuXHJcbiAgICAgICAgaWYgKGVudmlyb25tZW50TmFtZSkge1xyXG4gICAgICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMuZW52aXJvbm1lbnRCeU5hbWUoZW52aXJvbm1lbnROYW1lKTtcclxuICAgICAgICAgICAgcnYgPSB7IGFjY291bnQ6IGVudmlyb25tZW50Py5hY2NvdW50SWQsIHJlZ2lvbjogZW52aXJvbm1lbnQ/LnJlZ2lvbiB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5vcmdhbml6YXRpb25OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VDYXNlLnBhc2NhbENhc2UodGhpcy5vcmdhbml6YXRpb25OYW1lKCkpO1xyXG4gICAgfVxyXG59Il19