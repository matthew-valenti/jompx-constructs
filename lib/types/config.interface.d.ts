export declare type Stage = 'prod' | 'test' | 'sandbox' | any;
export interface IEnvironment {
    accountId: string;
    region: string;
    name: string;
    stage: Stage;
}
export interface IStageEnvironment {
    environmentType: string;
    environmentName: string;
}
export interface IStage {
    [key: string]: {
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
