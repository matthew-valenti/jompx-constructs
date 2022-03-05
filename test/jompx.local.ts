import { ILocalConfig } from '../src/types/local-config.interface';

export const Local: ILocalConfig = {
    '@jompx-local': {
        stage: 'local',
        stages: {
            local: {
                environments: [
                    {
                        environmentType: 'cicd',
                        environmentName: 'cicd-test'
                    },
                    {
                        environmentType: 'common',
                        environmentName: 'common-test'
                    },
                    {
                        environmentType: 'cdk',
                        environmentName: 'sandbox1'
                    }
                ]
            }
        }
    }
};
