/*
// Add timezone offset to WordPress date (to be compatible with AppSync DateTime). Example WordPress date: 2021-07-01T17:11:05
if (row.date) {
    set(row, 'date', DateTime.fromISO(row.date).toString());
}
*/

import { IAppSyncConnection } from '../../app-sync.types';
import { AppSyncDatasource } from '../datasource';

export class AppSyncMySqlDatasource extends AppSyncDatasource {

    public find(): IAppSyncConnection {

        console.log('this.props.stash', this.props.stash);

        return {
            edges: [{
                node: {
                    id: 'abc123',
                    mcomments: [
                        { id: 'def456' },
                        { id: 'hij789' }
                    ]
                }
            }],
            pageInfo: {
                skip: 0,
                limit: 0
            }
        };
    }
}