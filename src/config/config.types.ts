export interface IConfig {
    [key: string]: {
        organizationName: string;
        environments: IEnvironment[];
        stages: IStage;
    };
}

export interface IEnvironment {
    accountId: string;
    region: string;
    name: string;
    // stage: string; // e.g. prod, test, sandbox.
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
        // stages?: IStage; // TODO: Do we need the ability to override stages on local? What about putting the stage in the CLI deploy instead?
    };
}

/*
appSync: {
    graphqlUrlSsmParameterName: string; // Problem. How do we make calling AppSync efficient from business classes.
};
*/