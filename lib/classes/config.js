"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    constructor(appNode) {
        this.appNode = appNode;
    }
    getStage() {
        var _a;
        const stage = (_a = this.appNode.tryGetContext('stage')) !== null && _a !== void 0 ? _a : this.appNode.tryGetContext('@jompx-local').stage;
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
        var _a;
        // Get stages from config and local config. Local config overrides config.
        const configStages = this.appNode.tryGetContext('@jompx').stages;
        const localStages = this.appNode.tryGetContext('@jompx-local').stages;
        const stages = { ...configStages, ...localStages };
        const map = new Map(Object.entries(stages));
        return (_a = map.get(stageName)) === null || _a === void 0 ? void 0 : _a.environments;
    }
    getEnv(environmentType, stageName) {
        var _a;
        let rv = undefined;
        const stageEnvironments = this.getStageEnvironments(stageName !== null && stageName !== void 0 ? stageName : this.getStage());
        const environmentName = (_a = stageEnvironments === null || stageEnvironments === void 0 ? void 0 : stageEnvironments.find(o => o.environmentType === environmentType)) === null || _a === void 0 ? void 0 : _a.environmentName;
        if (environmentName) {
            const environment = this.getEnvironment(environmentName);
            rv = { account: environment === null || environment === void 0 ? void 0 : environment.accountId, region: environment === null || environment === void 0 ? void 0 : environment.region };
        }
        return rv;
    }
}
exports.Config = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzZXMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUlBLE1BQWEsTUFBTTtJQUVmLFlBQ1csT0FBYTtRQUFiLFlBQU8sR0FBUCxPQUFPLENBQU07SUFDcEIsQ0FBQztJQUVFLFFBQVE7O1FBQ1gsTUFBTSxLQUFLLFNBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLG1DQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN0RyxJQUFJLENBQUMsS0FBSztZQUFFLE1BQU0sS0FBSyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7UUFDeEcsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUVNLGNBQWMsQ0FBQyxlQUF1QjtRQUN6QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFlLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssZUFBZSxDQUFDLENBQUM7SUFDbkgsQ0FBQztJQUVNLHlCQUF5QixDQUFDLFNBQWlCO1FBQzlDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQWUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsS0FBSyxTQUFTLENBQUMsQ0FBQztJQUNsSCxDQUFDO0lBRU0sb0JBQW9CLENBQUMsU0FBaUI7O1FBQ3pDLDBFQUEwRTtRQUMxRSxNQUFNLFlBQVksR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDekUsTUFBTSxXQUFXLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzlFLE1BQU0sTUFBTSxHQUFHLEVBQUUsR0FBRyxZQUFZLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVuRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDNUMsYUFBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQywwQ0FBRSxZQUFZLENBQUM7SUFDNUMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxlQUF1QixFQUFFLFNBQWtCOztRQUNyRCxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFFbkIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxhQUFULFNBQVMsY0FBVCxTQUFTLEdBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDbEYsTUFBTSxlQUFlLFNBQUcsaUJBQWlCLGFBQWpCLGlCQUFpQix1QkFBakIsaUJBQWlCLENBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsS0FBSyxlQUFlLDJDQUFHLGVBQWUsQ0FBQztRQUU3RyxJQUFJLGVBQWUsRUFBRTtZQUNqQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3pELEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxXQUFXLGFBQVgsV0FBVyx1QkFBWCxXQUFXLENBQUUsTUFBTSxFQUFFLENBQUM7U0FDekU7UUFFRCxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7Q0FDSjtBQTNDRCx3QkEyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCB7IElFbnZpcm9ubWVudCwgSVN0YWdlLCBJU3RhZ2VFbnZpcm9ubWVudCB9IGZyb20gJy4uL3R5cGVzL2NvbmZpZy5pbnRlcmZhY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbmZpZyB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHVibGljIGFwcE5vZGU6IE5vZGVcclxuICAgICkgeyB9XHJcblxyXG4gICAgcHVibGljIGdldFN0YWdlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgc3RhZ2UgPSB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnc3RhZ2UnKSA/PyB0aGlzLmFwcE5vZGUudHJ5R2V0Q29udGV4dCgnQGpvbXB4LWxvY2FsJykuc3RhZ2U7XHJcbiAgICAgICAgaWYgKCFzdGFnZSkgdGhyb3cgRXJyb3IoJ0pvbXB4IHN0YWdlIG5vdCBmb3VuZCEgU3RhZ2UgaXMgbWlzc2luZyBmcm9tIGNvbW1hbmQgbGluZSBvciBqb21weC5sb2NhbC50cy4nKTtcclxuICAgICAgICByZXR1cm4gc3RhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEVudmlyb25tZW50KGVudmlyb25tZW50TmFtZTogc3RyaW5nKTogSUVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLmVudmlyb25tZW50cy5maW5kKChvOiBJRW52aXJvbm1lbnQpID0+IG8ubmFtZSA9PT0gZW52aXJvbm1lbnROYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RW52aXJvbm1lbnRCeUFjY291bnRJZChhY2NvdW50SWQ6IHN0cmluZyk6IElFbnZpcm9ubWVudCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwTm9kZS50cnlHZXRDb250ZXh0KCdAam9tcHgnKS5lbnZpcm9ubWVudHMuZmluZCgobzogSUVudmlyb25tZW50KSA9PiBvLmFjY291bnRJZCA9PT0gYWNjb3VudElkKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0U3RhZ2VFbnZpcm9ubWVudHMoc3RhZ2VOYW1lOiBzdHJpbmcpOiBJU3RhZ2VFbnZpcm9ubWVudFtdIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICAvLyBHZXQgc3RhZ2VzIGZyb20gY29uZmlnIGFuZCBsb2NhbCBjb25maWcuIExvY2FsIGNvbmZpZyBvdmVycmlkZXMgY29uZmlnLlxyXG4gICAgICAgIGNvbnN0IGNvbmZpZ1N0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weCcpLnN0YWdlcztcclxuICAgICAgICBjb25zdCBsb2NhbFN0YWdlczogSVN0YWdlID0gdGhpcy5hcHBOb2RlLnRyeUdldENvbnRleHQoJ0Bqb21weC1sb2NhbCcpLnN0YWdlcztcclxuICAgICAgICBjb25zdCBzdGFnZXMgPSB7IC4uLmNvbmZpZ1N0YWdlcywgLi4ubG9jYWxTdGFnZXMgfTtcclxuXHJcbiAgICAgICAgY29uc3QgbWFwID0gbmV3IE1hcChPYmplY3QuZW50cmllcyhzdGFnZXMpKTtcclxuICAgICAgICByZXR1cm4gbWFwLmdldChzdGFnZU5hbWUpPy5lbnZpcm9ubWVudHM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEVudihlbnZpcm9ubWVudFR5cGU6IHN0cmluZywgc3RhZ2VOYW1lPzogc3RyaW5nKTogY2RrLkVudmlyb25tZW50IHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBsZXQgcnYgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHN0YWdlRW52aXJvbm1lbnRzID0gdGhpcy5nZXRTdGFnZUVudmlyb25tZW50cyhzdGFnZU5hbWUgPz8gdGhpcy5nZXRTdGFnZSgpKTtcclxuICAgICAgICBjb25zdCBlbnZpcm9ubWVudE5hbWUgPSBzdGFnZUVudmlyb25tZW50cz8uZmluZChvID0+IG8uZW52aXJvbm1lbnRUeXBlID09PSBlbnZpcm9ubWVudFR5cGUpPy5lbnZpcm9ubWVudE5hbWU7XHJcblxyXG4gICAgICAgIGlmIChlbnZpcm9ubWVudE5hbWUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW52aXJvbm1lbnQgPSB0aGlzLmdldEVudmlyb25tZW50KGVudmlyb25tZW50TmFtZSk7XHJcbiAgICAgICAgICAgIHJ2ID0geyBhY2NvdW50OiBlbnZpcm9ubWVudD8uYWNjb3VudElkLCByZWdpb246IGVudmlyb25tZW50Py5yZWdpb24gfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxufSJdfQ==