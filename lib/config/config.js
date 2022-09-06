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
    organizationName() {
        return this.appNode.tryGetContext('@jompx').organizationName;
    }
    organizationNamePascalCase() {
        return changeCase.pascalCase(this.organizationName());
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
     * Get list of apps. An app is typically deployed across all stages and is acceccable on each stage.
     * @returns
     */
    apps() {
        return this.appNode.tryGetContext('@jompx').apps;
    }
    /**
     * Get a distinct/unique list of root domain names across all apps.
     * @returns
     */
    appRootDomainNames() {
        const apps = this.appNode.tryGetContext('@jompx').apps;
        return [...new Set(apps.map(o => o.rootDomainName))];
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
}
exports.Config = Config;
_a = JSII_RTTI_SYMBOL_1;
Config[_a] = { fqn: "@jompx/constructs.Config", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSw2REFBNkQ7QUFDN0QsMENBQTBDO0FBSTFDLE1BQWEsTUFBTTtJQUVmLFlBQ1csT0FBYTtRQUFiLFlBQU8sR0FBUCxPQUFPLENBQU07SUFDcEIsQ0FBQztJQUVFLGdCQUFnQjtRQUNuQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO0lBQ2pFLENBQUM7SUFFTSwwQkFBMEI7UUFDN0IsT0FBTyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7T0FHRztJQUNJLEtBQUs7O1FBQ1IsTUFBTSxLQUFLLFNBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN0RyxJQUFJLENBQUMsS0FBSztZQUFFLE1BQU0sS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7UUFDekcsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVEOzs7T0FHRztJQUNJLFlBQVk7UUFDZixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQztJQUM3RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLGlCQUFpQixDQUFDLElBQVk7UUFDakMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO0lBQ3hHLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksc0JBQXNCLENBQUMsU0FBaUI7UUFDM0MsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBZSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDO0lBQ2xILENBQUM7SUFFRDs7O09BR0c7SUFDSSxJQUFJO1FBQ1AsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7T0FHRztJQUNJLGtCQUFrQjtRQUNyQixNQUFNLElBQUksR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDL0QsT0FBTyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxNQUFNO1FBQ1QsTUFBTSxZQUFZLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ3pFLE1BQU0sV0FBVyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUU5RSwwRUFBMEU7UUFDMUUsTUFBTSxNQUFNLEdBQUcsRUFBRSxHQUFHLFlBQVksRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRW5ELDRFQUE0RTtRQUM1RSwrRUFBK0U7UUFDL0UsK0NBQStDO1FBQy9DLHNDQUFzQztRQUN0QyxrREFBa0Q7UUFDbEQsMEVBQTBFO1FBQzFFLFVBQVU7UUFDVixJQUFJO1FBRUosT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELG9CQUFvQjtJQUNiLGdCQUFnQixDQUFDLFNBQWlCOztRQUNyQyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDbkIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRTdCLElBQUksTUFBTSxFQUFFO1lBQ1IsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEVBQUUsU0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwQ0FBRSxXQUFXLENBQUM7U0FDeEM7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSSxHQUFHLENBQUMsY0FBc0IsRUFBRSxLQUFjOztRQUM3QyxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFFbkIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxhQUFMLEtBQUssY0FBTCxLQUFLLEdBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDdEUsTUFBTSxlQUFlLFNBQUcsZ0JBQWdCLGFBQWhCLGdCQUFnQix1QkFBaEIsZ0JBQWdCLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxjQUFjLDJDQUFHLGVBQWUsQ0FBQztRQUVoRyxJQUFJLGVBQWUsRUFBRTtZQUNqQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDNUQsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFdBQVcsYUFBWCxXQUFXLHVCQUFYLFdBQVcsQ0FBRSxNQUFNLEVBQUUsQ0FBQztTQUN6RTtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7QUEzSEwsd0JBNEhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xyXG5pbXBvcnQgKiBhcyBjaGFuZ2VDYXNlIGZyb20gJ2NoYW5nZS1jYXNlJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJ2NvbnN0cnVjdHMnO1xyXG5pbXBvcnQgeyBJRW52aXJvbm1lbnQsIElBcHAsIElTdGFnZSwgSVN0YWdlRGVwbG95bWVudCB9IGZyb20gJy4vY29uZmlnLnR5cGVzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBDb25maWcge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHB1YmxpYyBhcHBOb2RlOiBOb2RlXHJcbiAgICApIHsgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5vcmdhbml6YXRpb25OYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvcmdhbml6YXRpb25OYW1lUGFzY2FsQ2FzZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiBjaGFuZ2VDYXNlLnBhc2NhbENhc2UodGhpcy5vcmdhbml6YXRpb25OYW1lKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHN0YWdlIGZyb20gY29tbWFuZCBsaW5lIG9yIGNvbmZpZy4gZS5nLiBzYW5kYm94MSwgdGVzdCwgcHJvZC5cclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGFnZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ3N0YWdlJykgPz8gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weC1sb2NhbCcpLnN0YWdlO1xyXG4gICAgICAgIGlmICghc3RhZ2UpIHRocm93IEVycm9yKCdKb21weDogc3RhZ2Ugbm90IGZvdW5kISBTdGFnZSBpcyBtaXNzaW5nIGZyb20gY29tbWFuZCBsaW5lIG9yIGpvbXB4LmxvY2FsLnRzLicpO1xyXG4gICAgICAgIHJldHVybiBzdGFnZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBsaXN0IG9mIEFXUyBlbnZpcm9uZW1udHMuIEFuIEFXUyBlbnZpcm9ubWVudCBpcyBwcmltYXJpbHkgYSBhY2NvdW50SWQvcmVnaW9uIHBhaXIuXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRzKCk6IElFbnZpcm9ubWVudFtdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbiBBV1MgZW52aXJvbm1lbnQgYnkgZnJpZW5kbHkgbmFtZS5cclxuICAgICAqIEBwYXJhbSBuYW1lXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRCeU5hbWUobmFtZTogc3RyaW5nKTogSUVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cy5maW5kKChvOiBJRW52aXJvbm1lbnQpID0+IG8ubmFtZSA9PT0gbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYW4gQVdTIGVudmlyb25tZW50IGJ5IEFXUyBhY2NvdW50IGlkLlxyXG4gICAgICogQHBhcmFtIGFjY291bnRJZFxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVudmlyb25tZW50QnlBY2NvdW50SWQoYWNjb3VudElkOiBzdHJpbmcpOiBJRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzLmZpbmQoKG86IElFbnZpcm9ubWVudCkgPT4gby5hY2NvdW50SWQgPT09IGFjY291bnRJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbGlzdCBvZiBhcHBzLiBBbiBhcHAgaXMgdHlwaWNhbGx5IGRlcGxveWVkIGFjcm9zcyBhbGwgc3RhZ2VzIGFuZCBpcyBhY2NlY2NhYmxlIG9uIGVhY2ggc3RhZ2UuXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwcygpOiBJQXBwW10gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuYXBwcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhIGRpc3RpbmN0L3VuaXF1ZSBsaXN0IG9mIHJvb3QgZG9tYWluIG5hbWVzIGFjcm9zcyBhbGwgYXBwcy5cclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBSb290RG9tYWluTmFtZXMoKTogc3RyaW5nW10gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGNvbnN0IGFwcHM6IElBcHBbXSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5hcHBzO1xyXG4gICAgICAgIHJldHVybiBbLi4ubmV3IFNldChhcHBzLm1hcChvID0+IG8ucm9vdERvbWFpbk5hbWUpKV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY29uZmlnIHN0YWdlcy4gVXNlIGRvdCBub3RhdGlvbiB0byBnZXQgYSBzdGFnZSBlLmcuIHN0YWdlcy5wcm9kXHJcbiAgICAgKiBKU0lJIGNvbnN0cnVjdHMgZG9uJ3Qgc3VwcG9ydCBtYXAgb2JqZWN0LiBUbyBjb252ZXJ0IHRvIG1hcCB1c2U6IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoY29uZmlnLnN0YWdlcygpKSk7XHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhZ2VzKCk6IElTdGFnZSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnU3RhZ2VzOiBJU3RhZ2UgPSB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4Jykuc3RhZ2VzO1xyXG4gICAgICAgIGNvbnN0IGxvY2FsU3RhZ2VzOiBJU3RhZ2UgPSB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4LWxvY2FsJykuc3RhZ2VzO1xyXG5cclxuICAgICAgICAvLyBHZXQgc3RhZ2VzIGZyb20gY29uZmlnIGFuZCBsb2NhbCBjb25maWcuIExvY2FsIGNvbmZpZyBvdmVycmlkZXMgY29uZmlnLlxyXG4gICAgICAgIGNvbnN0IHN0YWdlcyA9IHsgLi4uY29uZmlnU3RhZ2VzLCAuLi5sb2NhbFN0YWdlcyB9O1xyXG5cclxuICAgICAgICAvLyBUT0RPOiBSZW1vdmUuIEkgZG9uJ3QgdGhpbmsgd2Ugd2FudCB0byB0cnkgdG8gam9pbiBhbiBhY2NvdW50IHRvIGEgc3RhZ2UuXHJcbiAgICAgICAgLy8gLy8gRm9yIGVhY2ggc3RhZ2UgZW52aXJvbm1lbnQgam9pbiB0byBhY2NvdW50IGVudmlyb25tZW50IChhbmQgc2V0IGFjY291bnQpLlxyXG4gICAgICAgIC8vIGNvbnN0IG1hcCA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoc3RhZ2VzKSk7XHJcbiAgICAgICAgLy8gZm9yIChjb25zdCB2YWx1ZSBvZiBtYXAudmFsdWVzKCkpIHtcclxuICAgICAgICAvLyAgICAgdmFsdWUuZW52aXJvbm1lbnRzLmZvckVhY2goZW52aXJvbm1lbnQgPT4ge1xyXG4gICAgICAgIC8vICAgICAgICAgZW52aXJvbm1lbnQuYWNjb3VudCA9IHRoaXMuZW52aXJvbm1lbnRCeU5hbWUoZW52aXJvbm1lbnQubmFtZSk7XHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHN0YWdlcztcclxuICAgIH1cclxuXHJcbiAgICAvLyBzdGFnZUVudmlyb25tZW50c1xyXG4gICAgcHVibGljIHN0YWdlRGVwbG95bWVudHMoc3RhZ2VOYW1lOiBzdHJpbmcpOiBJU3RhZ2VEZXBsb3ltZW50W10gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCBydiA9IHVuZGVmaW5lZDtcclxuICAgICAgICBjb25zdCBzdGFnZXMgPSB0aGlzLnN0YWdlcygpO1xyXG5cclxuICAgICAgICBpZiAoc3RhZ2VzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoc3RhZ2VzKSk7XHJcbiAgICAgICAgICAgIHJ2ID0gbWFwLmdldChzdGFnZU5hbWUpPy5kZXBsb3ltZW50cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBlbnYgKEFXUyBhY2NvdW50SWQgKyByZWdpb24pIGZyb20gY29uZmlnICh0eXBlICsgc3RhZ2UpIGUuZy4gY2ljZCArIHRlc3QgPSB4eHh4eHh4eHh4eHggKyB1cy13ZXN0LTIuXHJcbiAgICAgKiBJZiBubyBzdGFnZSBwcm92aWRlZCB0aGVuIHdpbGwgdXNlIGN1cnJlbnQgc3RhZ2UuXHJcbiAgICAgKiBAcGFyYW0gZGVwbG95bWVudFR5cGVcclxuICAgICAqIEBwYXJhbSBzdGFnZVxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGVudihkZXBsb3ltZW50VHlwZTogc3RyaW5nLCBzdGFnZT86IHN0cmluZyk6IGNkay5FbnZpcm9ubWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBjb25zdCBzdGFnZURlcGxveW1lbnRzID0gdGhpcy5zdGFnZURlcGxveW1lbnRzKHN0YWdlID8/IHRoaXMuc3RhZ2UoKSk7XHJcbiAgICAgICAgY29uc3QgZW52aXJvbm1lbnROYW1lID0gc3RhZ2VEZXBsb3ltZW50cz8uZmluZChvID0+IG8udHlwZSA9PT0gZGVwbG95bWVudFR5cGUpPy5lbnZpcm9ubWVudE5hbWU7XHJcblxyXG4gICAgICAgIGlmIChlbnZpcm9ubWVudE5hbWUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW52aXJvbm1lbnQgPSB0aGlzLmVudmlyb25tZW50QnlOYW1lKGVudmlyb25tZW50TmFtZSk7XHJcbiAgICAgICAgICAgIHJ2ID0geyBhY2NvdW50OiBlbnZpcm9ubWVudD8uYWNjb3VudElkLCByZWdpb246IGVudmlyb25tZW50Py5yZWdpb24gfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxufSJdfQ==