export interface IEnvironment {
    accountId: string;
    region: string;
    name: string;
    stage: string;
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
        gitHub: {
            repo: string;
        };
        environments: IEnvironment[];
        stages: IStage;
    };
}
