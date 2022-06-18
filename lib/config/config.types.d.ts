export interface IConfig {
    [key: string]: {
        organizationName: string;
        environments: IEnvironment[];
        apps: IApp[];
        stages: IStage;
    };
}
export interface IEnvironment {
    accountId: string;
    region: string;
    name: string;
}
export interface IApp {
    name: string;
    rootDomainName: string;
}
export interface IStage {
    [key: string]: {
        branch: string;
        deployments: IStageDeployment[];
    };
}
export interface IStageDeployment {
    type: string;
    environmentName: string;
}
export interface IEnv {
    account: string;
    region: string;
}
export interface ILocalConfig {
    [key: string]: {
        stage?: string;
    };
}
