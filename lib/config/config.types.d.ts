export interface IEnvironment {
    accountId: string;
    region: string;
    name: string;
}
export interface IStageEnvironment {
    type: string;
    name: string;
    account?: IEnvironment;
}
export interface IStage {
    [key: string]: {
        branch: string;
        environments: IStageEnvironment[];
    };
}
export interface IEnv {
    account: string;
    region: string;
}
export interface IConfig {
    [key: string]: {
        organizationName: string;
        environments: IEnvironment[];
        stages: IStage;
    };
}
export interface ILocalConfig {
    [key: string]: {
        stage?: string;
        stages?: IStage;
    };
}
