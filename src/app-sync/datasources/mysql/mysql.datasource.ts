import { IAppSyncConnection, IAppSyncResolverEvent } from '../../app-sync.types';
import { AppSyncDatasource } from '../datasource';

/*
// Add timezone offset to WordPress date (to be compatible with AppSync DateTime). Example WordPress date: 2021-07-01T17:11:05
if (row.date) {
    set(row, 'date', DateTime.fromISO(row.date).toString());
}
Remember to handle nulls.
*/

/**
 * Props/Options
 * Auth
 * Query
 * Data Auth
 * Data
 * Emit Events
 *
 * connect
 * disconnect (if needed)
 * run or operation or runOperation
 * custom directives (for use with schema)
 * ??? HOW CAN WE GET THESE CUSTOM DIRECTIVES INTO THE EXECUTOR TO GEN THE GRAPHQL SCHEMA. MAYBE WE HAVE A GLOBAL LSIT AND THAT'S IT? BUT WHAT ABOUT CUSTOM OPERATIONS. ???
 * publish to event bridge
 * Phase 2: annotated emit/listeners to create a queue of lambda function calls.
 */
export class AppSyncMySqlDatasource extends AppSyncDatasource {

    constructor(event: IAppSyncResolverEvent) {
        super(event);
    }

    public find(): IAppSyncConnection {

        console.log('this.props.stash', this.event.stash);

        return {
            edges: [{
                node: {
                    id: 'abc123'
                }
            }],
            pageInfo: {
                skip: 0,
                limit: 0
            }
        };
    }

    public findSql(): string {
        let sql = '';
        sql = 'select * from';
        return sql;
    }
}
