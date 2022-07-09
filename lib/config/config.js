"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
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
        var _a;
        let rv = undefined;
        const stages = this.stages();
        if (stages) {
            const map = new Map(Object.entries(stages));
            rv = (_a = map.get(stageName)) === null || _a === void 0 ? void 0 : _a.deployments;
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
        var _a;
        let rv = undefined;
        const stageDeployments = this.stageDeployments(stage !== null && stage !== void 0 ? stage : this.stage());
        const environmentName = (_a = stageDeployments === null || stageDeployments === void 0 ? void 0 : stageDeployments.find(o => o.type === deploymentType)) === null || _a === void 0 ? void 0 : _a.environmentName;
        if (environmentName) {
            const environment = this.environmentByName(environmentName);
            rv = { account: environment === null || environment === void 0 ? void 0 : environment.accountId, region: environment === null || environment === void 0 ? void 0 : environment.region };
        }
        return rv;
    }
}
exports.Config = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkRBQTZEO0FBQzdELDBDQUEwQztBQUkxQyxNQUFhLE1BQU07SUFFZixZQUNXLE9BQWE7UUFBYixZQUFPLEdBQVAsT0FBTyxDQUFNO0lBQ3BCLENBQUM7SUFFRSxnQkFBZ0I7UUFDbkIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqRSxDQUFDO0lBRU0sMEJBQTBCO1FBQzdCLE9BQU8sVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7O09BR0c7SUFDSSxLQUFLOztRQUNSLE1BQU0sS0FBSyxTQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxtQ0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDdEcsSUFBSSxDQUFDLEtBQUs7WUFBRSxNQUFNLEtBQUssQ0FBQywrRUFBK0UsQ0FBQyxDQUFDO1FBQ3pHLE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7O09BR0c7SUFDSSxZQUFZO1FBQ2YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7SUFDN0QsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxpQkFBaUIsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsQ0FBQztJQUN4RyxDQUFDO0lB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bSAnYXdzLWNkay1saWInO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXHJcbmltcG9ydCAqIGFzIGNoYW5nZUNhc2UgZnJvbSAnY2hhbmdlLWNhc2UnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IElFbnZpcm9ubWVudCwgSUFwcCwgSVN0YWdlLCBJU3RhZ2VEZXBsb3ltZW50IH0gZnJvbSAnLi9jb25maWcudHlwZXMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIGFwcE5vZGU6IE5vZGVcclxuICAgICkgeyB9XHJcblxyXG4gICAgcHVibGljIG9yZ2FuaXphdGlvbk5hbWUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLm9yZ2FuaXphdGlvbk5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9yZ2FuaXphdGlvbk5hbWVQYXNjYWxDYXNlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIGNoYW5nZUNhc2UucGFzY2FsQ2FzZSh0aGlzLm9yZ2FuaXphdGlvbk5hbWUoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgc3RhZ2UgZnJvbSBjb21tYW5kIGxpbmUgb3IgY29uZmlnLiBlLmcuIHNhbmRib3gxLCB0ZXN0LCBwcm9kLlxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YWdlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnc3RhZ2UnKSA/PyB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4LWxvY2FsJykuc3RhZ2U7XHJcbiAgICAgICAgaWYgKCFzdGFnZSkgdGhyb3cgRXJyb3IoJ0pvbXB4OiBzdGFnZSBub3QgZm91bmQhIFN0YWdlIGlzIG1pc3NpbmcgZnJvbSBjb21tYW5kIGxpbmUgb3Igam9tcHgubG9jYWwudHMuJyk7XHJcbiAgICAgICAgcmV0dXJuIHN0YWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGxpc3Qgb2YgQVdTIGVudmlyb25lbW50cy4gQW4gQVdTIGVudmlyb25tZW50IGlzIHByaW1hcmlseSBhIGFjY291bnRJZC9yZWdpb24gcGFpci5cclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudHMoKTogSUVudmlyb25tZW50W10gfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuIEFXUyBlbnZpcm9ubWVudCBieSBmcmllbmRseSBuYW1lLlxyXG4gICAgICogQHBhcmFtIG5hbWVcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbnZpcm9ubWVudEJ5TmFtZShuYW1lOiBzdHJpbmcpOiBJRW52aXJvbm1lbnQgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4JykuZW52aXJvbm1lbnRzLmZpbmQoKG86IElFbnZpcm9ubWVudCkgPT4gby5uYW1lID09PSBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbiBBV1MgZW52aXJvbm1lbnQgYnkgQVdTIGFjY291bnQgaWQuXHJcbiAgICAgKiBAcGFyYW0gYWNjb3VudElkXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZW52aXJvbm1lbnRCeUFjY291bnRJZChhY2NvdW50SWQ6IHN0cmluZyk6IElFbnZpcm9ubWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5lbnZpcm9ubWVudHMuZmluZCgobzogSUVudmlyb25tZW50KSA9PiBvLmFjY291bnRJZCA9PT0gYWNjb3VudElkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBsaXN0IG9mIGFwcHMuIEFuIGFwcCBpcyB0eXBpY2FsbHkgZGVwbG95ZWQgYWNyb3NzIGFsbCBzdGFnZXMgYW5kIGlzIGFjY2VjY2FibGUgb24gZWFjaCBzdGFnZS5cclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBzKCk6IElBcHBbXSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5hcHBzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGEgZGlzdGluY3QvdW5pcXVlIGxpc3Qgb2Ygcm9vdCBkb21haW4gbmFtZXMgYWNyb3NzIGFsbCBhcHBzLlxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFwcFJvb3REb21haW5OYW1lcygpOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgY29uc3QgYXBwczogSUFwcFtdID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmFwcHM7XHJcbiAgICAgICAgcmV0dXJuIFsuLi5uZXcgU2V0KGFwcHMubWFwKG8gPT4gby5yb290RG9tYWluTmFtZSkpXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBjb25maWcgc3RhZ2VzLiBVc2UgZG90IG5vdGF0aW9uIHRvIGdldCBhIHN0YWdlIGUuZy4gc3RhZ2VzLnByb2RcclxuICAgICAqIEpTSUkgY29uc3RydWN0cyBkb24ndCBzdXBwb3J0IG1hcCBvYmplY3QuIFRvIGNvbnZlcnQgdG8gbWFwIHVzZTogbmV3IE1hcChPYmplY3QuZW50cmllcyhjb25maWcuc3RhZ2VzKCkpKTtcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGFnZXMoKTogSVN0YWdlIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCBjb25maWdTdGFnZXM6IElTdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5zdGFnZXM7XHJcbiAgICAgICAgY29uc3QgbG9jYWxTdGFnZXM6IElTdGFnZSA9IHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgtbG9jYWwnKS5zdGFnZXM7XHJcblxyXG4gICAgICAgIC8vIEdldCBzdGFnZXMgZnJvbSBjb25maWcgYW5kIGxvY2FsIGNvbmZpZy4gTG9jYWwgY29uZmlnIG92ZXJyaWRlcyBjb25maWcuXHJcbiAgICAgICAgY29uc3Qgc3RhZ2VzID0geyAuLi5jb25maWdTdGFnZXMsIC4uLmxvY2FsU3RhZ2VzIH07XHJcblxyXG4gICAgICAgIC8vIFRPRE86IFJlbW92ZS4gSSBkb24ndCB0aGluayB3ZSB3YW50IHRvIHRyeSB0byBqb2luIGFuIGFjY291bnQgdG8gYSBzdGFnZS5cclxuICAgICAgICAvLyAvLyBGb3IgZWFjaCBzdGFnZSBlbnZpcm9ubWVudCBqb2luIHRvIGFjY291bnQgZW52aXJvbm1lbnQgKGFuZCBzZXQgYWNjb3VudCkuXHJcbiAgICAgICAgLy8gY29uc3QgbWFwID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhzdGFnZXMpKTtcclxuICAgICAgICAvLyBmb3IgKGNvbnN0IHZhbHVlIG9mIG1hcC52YWx1ZXMoKSkge1xyXG4gICAgICAgIC8vICAgICB2YWx1ZS5lbnZpcm9ubWVudHMuZm9yRWFjaChlbnZpcm9ubWVudCA9PiB7XHJcbiAgICAgICAgLy8gICAgICAgICBlbnZpcm9ubWVudC5hY2NvdW50ID0gdGhpcy5lbnZpcm9ubWVudEJ5TmFtZShlbnZpcm9ubWVudC5uYW1lKTtcclxuICAgICAgICAvLyAgICAgfSk7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICByZXR1cm4gc3RhZ2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHN0YWdlRW52aXJvbm1lbnRzXHJcbiAgICBwdWJsaWMgc3RhZ2VEZXBsb3ltZW50cyhzdGFnZU5hbWU6IHN0cmluZyk6IElTdGFnZURlcGxveW1lbnRbXSB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgbGV0IHJ2ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGNvbnN0IHN0YWdlcyA9IHRoaXMuc3RhZ2VzKCk7XHJcblxyXG4gICAgICAgIGlmIChzdGFnZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhzdGFnZXMpKTtcclxuICAgICAgICAgICAgcnYgPSBtYXAuZ2V0KHN0YWdlTmFtZSk/LmRlcGxveW1lbnRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGVudiAoQVdTIGFjY291bnRJZCArIHJlZ2lvbikgZnJvbSBjb25maWcgKHR5cGUgKyBzdGFnZSkgZS5nLiBjaWNkICsgdGVzdCA9IHh4eHh4eHh4eHh4eCArIHVzLXdlc3QtMi5cclxuICAgICAqIElmIG5vIHN0YWdlIHByb3ZpZGVkIHRoZW4gd2lsbCB1c2UgY3VycmVudCBzdGFnZS5cclxuICAgICAqIEBwYXJhbSBkZXBsb3ltZW50VHlwZVxyXG4gICAgICogQHBhcmFtIHN0YWdlXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZW52KGRlcGxveW1lbnRUeXBlOiBzdHJpbmcsIHN0YWdlPzogc3RyaW5nKTogY2RrLkVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YWdlRGVwbG95bWVudHMgPSB0aGlzLnN0YWdlRGVwbG95bWVudHMoc3RhZ2UgPz8gdGhpcy5zdGFnZSgpKTtcclxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudE5hbWUgPSBzdGFnZURlcGxveW1lbnRzPy5maW5kKG8gPT4gby50eXBlID09PSBkZXBsb3ltZW50VHlwZSk/LmVudmlyb25tZW50TmFtZTtcclxuXHJcbiAgICAgICAgaWYgKGVudmlyb25tZW50TmFtZSkge1xyXG4gICAgICAgICAgICBjb25zdCBlbnZpcm9ubWVudCA9IHRoaXMuZW52aXJvbm1lbnRCeU5hbWUoZW52aXJvbm1lbnROYW1lKTtcclxuICAgICAgICAgICAgcnYgPSB7IGFjY291bnQ6IGVudmlyb25tZW50Py5hY2NvdW50SWQsIHJlZ2lvbjogZW52aXJvbm1lbnQ/LnJlZ2lvbiB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJ2O1xyXG4gICAgfVxyXG59Il19