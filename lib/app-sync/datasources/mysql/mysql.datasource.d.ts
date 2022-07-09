import { IAppSyncConnection, IAppSyncResolverEvent } from '../../app-sync.types';
import { AppSyncDatasource } from '../datasource';
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
export declare class AppSyncMySqlDatasource extends AppSyncDatasource {
    constructor(event: IAppSyncResolverEvent);
    find(): IAppSyncConnection;
    findSql(): string;
}
