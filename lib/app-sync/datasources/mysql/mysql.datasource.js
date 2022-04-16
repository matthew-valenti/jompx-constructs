"use strict";
/*
// Add timezone offset to WordPress date (to be compatible with AppSync DateTime). Example WordPress date: 2021-07-01T17:11:05
if (row.date) {
    set(row, 'date', DateTime.fromISO(row.date).toString());
}
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncMySqlDatasource = void 0;
const datasource_1 = require("../datasource");
class AppSyncMySqlDatasource extends datasource_1.AppSyncDatasource {
    find() {
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
exports.AppSyncMySqlDatasource = AppSyncMySqlDatasource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuZGF0YXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAtc3luYy9kYXRhc291cmNlcy9teXNxbC9teXNxbC5kYXRhc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7RUFLRTs7O0FBR0YsOENBQWtEO0FBRWxELE1BQWEsc0JBQXVCLFNBQVEsOEJBQWlCO0lBRWxELElBQUk7UUFFUCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbEQsT0FBTztZQUNILEtBQUssRUFBRSxDQUFDO29CQUNKLElBQUksRUFBRTt3QkFDRixFQUFFLEVBQUUsUUFBUTt3QkFDWixTQUFTLEVBQUU7NEJBQ1AsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFOzRCQUNoQixFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUU7eUJBQ25CO3FCQUNKO2lCQUNKLENBQUM7WUFDRixRQUFRLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLENBQUM7Z0JBQ1AsS0FBSyxFQUFFLENBQUM7YUFDWDtTQUNKLENBQUM7SUFDTixDQUFDO0NBQ0o7QUF0QkQsd0RBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuLy8gQWRkIHRpbWV6b25lIG9mZnNldCB0byBXb3JkUHJlc3MgZGF0ZSAodG8gYmUgY29tcGF0aWJsZSB3aXRoIEFwcFN5bmMgRGF0ZVRpbWUpLiBFeGFtcGxlIFdvcmRQcmVzcyBkYXRlOiAyMDIxLTA3LTAxVDE3OjExOjA1XHJcbmlmIChyb3cuZGF0ZSkge1xyXG4gICAgc2V0KHJvdywgJ2RhdGUnLCBEYXRlVGltZS5mcm9tSVNPKHJvdy5kYXRlKS50b1N0cmluZygpKTtcclxufVxyXG4qL1xyXG5cclxuaW1wb3J0IHsgSUFwcFN5bmNDb25uZWN0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLXN5bmMudHlwZXMnO1xyXG5pbXBvcnQgeyBBcHBTeW5jRGF0YXNvdXJjZSB9IGZyb20gJy4uL2RhdGFzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmNNeVNxbERhdGFzb3VyY2UgZXh0ZW5kcyBBcHBTeW5jRGF0YXNvdXJjZSB7XHJcblxyXG4gICAgcHVibGljIGZpbmQoKTogSUFwcFN5bmNDb25uZWN0aW9uIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3RoaXMucHJvcHMuc3Rhc2gnLCB0aGlzLnByb3BzLnN0YXNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZWRnZXM6IFt7XHJcbiAgICAgICAgICAgICAgICBub2RlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdhYmMxMjMnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1jb21tZW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGlkOiAnZGVmNDU2JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGlkOiAnaGlqNzg5JyB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgcGFnZUluZm86IHtcclxuICAgICAgICAgICAgICAgIHNraXA6IDAsXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSJdfQ==