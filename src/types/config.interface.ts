import { IEnvironment } from '../classes/environment';

export interface IConfig
{
    [key: string]: {
        organizationName: string;
        gitHub: {
            repo: string;
        };
        environments: IEnvironment[];
    };
}