import { IStage } from './config.interface';
export interface ILocalConfig {
    [key: string]: {
        stage?: string;
        stages?: IStage;
    };
}
