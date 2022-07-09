"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncMySqlDatasource = void 0;
const datasource_1 = require("../datasource");
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
class AppSyncMySqlDatasource extends datasource_1.AppSyncDatasource {
    constructor(event) {
        super(event);
    }
    find() {
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
    findSql() {
        let sql = '';
        sql = 'select * from';
        return sql;
    }
}
exports.AppSyncMySqlDatasource = AppSyncMySqlDatasource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuZGF0YXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAtc3luYy9kYXRhc291cmNlcy9teXNxbC9teXNxbC5kYXRhc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDhDQUFrRDtBQUVsRDs7Ozs7O0VBTUU7QUFFRjs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFhLHNCQUF1QixTQUFRLDhCQUFpQjtJQUV6RCxZQUFZLEtBQTRCO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRU0sSUFBSTtRQUVQLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVsRCxPQUFPO1lBQ0gsS0FBSyxFQUFFLENBQUM7b0JBQ0osSUFBSSxFQUFFO3dCQUNGLEVBQUUsRUFBRSxRQUFRO3FCQUNmO2lCQUNKLENBQUM7WUFDRixRQUFRLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLENBQUM7Z0JBQ1AsS0FBSyxFQUFFLENBQUM7YUFDWDtTQUNKLENBQUM7SUFDTixDQUFDO0lBRU0sT0FBTztRQUNWLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLEdBQUcsR0FBRyxlQUFlLENBQUM7UUFDdEIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0NBQ0o7QUE1QkQsd0RBNEJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUFwcFN5bmNDb25uZWN0aW9uLCBJQXBwU3luY1Jlc29sdmVyRXZlbnQgfSBmcm9tICcuLi8uLi9hcHAtc3luYy50eXBlcyc7XHJcbmltcG9ydCB7IEFwcFN5bmNEYXRhc291cmNlIH0gZnJvbSAnLi4vZGF0YXNvdXJjZSc7XHJcblxyXG4vKlxyXG4vLyBBZGQgdGltZXpvbmUgb2Zmc2V0IHRvIFdvcmRQcmVzcyBkYXRlICh0byBiZSBjb21wYXRpYmxlIHdpdGggQXBwU3luYyBEYXRlVGltZSkuIEV4YW1wbGUgV29yZFByZXNzIGRhdGU6IDIwMjEtMDctMDFUMTc6MTE6MDVcclxuaWYgKHJvdy5kYXRlKSB7XHJcbiAgICBzZXQocm93LCAnZGF0ZScsIERhdGVUaW1lLmZyb21JU08ocm93LmRhdGUpLnRvU3RyaW5nKCkpO1xyXG59XHJcblJlbWVtYmVyIHRvIGhhbmRsZSBudWxscy5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBQcm9wcy9PcHRpb25zXHJcbiAqIEF1dGhcclxuICogUXVlcnlcclxuICogRGF0YSBBdXRoXHJcbiAqIERhdGFcclxuICogRW1pdCBFdmVudHNcclxuICpcclxuICogY29ubmVjdFxyXG4gKiBkaXNjb25uZWN0IChpZiBuZWVkZWQpXHJcbiAqIHJ1biBvciBvcGVyYXRpb24gb3IgcnVuT3BlcmF0aW9uXHJcbiAqIGN1c3RvbSBkaXJlY3RpdmVzIChmb3IgdXNlIHdpdGggc2NoZW1hKVxyXG4gKiA/Pz8gSE9XIENBTiBXRSBHRVQgVEhFU0UgQ1VTVE9NIERJUkVDVElWRVMgSU5UTyBUSEUgRVhFQ1VUT1IgVE8gR0VOIFRIRSBHUkFQSFFMIFNDSEVNQS4gTUFZQkUgV0UgSEFWRSBBIEdMT0JBTCBMU0lUIEFORCBUSEFUJ1MgSVQ/IEJVVCBXSEFUIEFCT1VUIENVU1RPTSBPUEVSQVRJT05TLiA/Pz9cclxuICogcHVibGlzaCB0byBldmVudCBicmlkZ2VcclxuICogUGhhc2UgMjogYW5ub3RhdGVkIGVtaXQvbGlzdGVuZXJzIHRvIGNyZWF0ZSBhIHF1ZXVlIG9mIGxhbWJkYSBmdW5jdGlvbiBjYWxscy5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jTXlTcWxEYXRhc291cmNlIGV4dGVuZHMgQXBwU3luY0RhdGFzb3VyY2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGV2ZW50OiBJQXBwU3luY1Jlc29sdmVyRXZlbnQpIHtcclxuICAgICAgICBzdXBlcihldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZpbmQoKTogSUFwcFN5bmNDb25uZWN0aW9uIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3RoaXMucHJvcHMuc3Rhc2gnLCB0aGlzLmV2ZW50LnN0YXNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZWRnZXM6IFt7XHJcbiAgICAgICAgICAgICAgICBub2RlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdhYmMxMjMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICBwYWdlSW5mbzoge1xyXG4gICAgICAgICAgICAgICAgc2tpcDogMCxcclxuICAgICAgICAgICAgICAgIGxpbWl0OiAwXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmaW5kU3FsKCk6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHNxbCA9ICcnO1xyXG4gICAgICAgIHNxbCA9ICdzZWxlY3QgKiBmcm9tJztcclxuICAgICAgICByZXR1cm4gc3FsO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==