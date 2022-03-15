import { ILocalConfig } from '../src/types/local-config.interface';

export const Local: ILocalConfig = {
    '@jompx-local': {
        stage: 'sandbox1'
        // stages: {
        //     sandbox1: {
        //         environments: [
        //             {
        //                 type: 'cicd',
        //                 name: 'cicd-test'
        //             },
        //             {
        //                 type: 'common',
        //                 name: 'common-test'
        //             },
        //             {
        //                 type: 'main',
        //                 name: 'sandbox1'
        //             }
        //         ]
        //     }
        // }
    }
};
