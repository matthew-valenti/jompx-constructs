"use strict";
/*
// Add timezone offset to WordPress date (to be compatible with AppSync DateTime). Example WordPress date: 2021-07-01T17:11:05
if (row.date) {
    set(row, 'date', DateTime.fromISO(row.date).toString());
}
Remember to handle nulls.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuZGF0YXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAtc3luYy9kYXRhc291cmNlcy9teXNxbC9teXNxbC5kYXRhc291cmNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0VBTUU7OztBQUdGLDhDQUFrRDtBQUVsRCxNQUFhLHNCQUF1QixTQUFRLDhCQUFpQjtJQUVsRCxJQUFJO1FBRVAsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRWxELE9BQU87WUFDSCxLQUFLLEVBQUUsQ0FBQztvQkFDSixJQUFJLEVBQUU7d0JBQ0YsRUFBRSxFQUFFLFFBQVE7d0JBQ1osU0FBUyxFQUFFOzRCQUNQLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRTs0QkFDaEIsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFO3lCQUNuQjtxQkFDSjtpQkFDSixDQUFDO1lBQ0YsUUFBUSxFQUFFO2dCQUNOLElBQUksRUFBRSxDQUFDO2dCQUNQLEtBQUssRUFBRSxDQUFDO2FBQ1g7U0FDSixDQUFDO0lBQ04sQ0FBQztDQUNKO0FBdEJELHdEQXNCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbi8vIEFkZCB0aW1lem9uZSBvZmZzZXQgdG8gV29yZFByZXNzIGRhdGUgKHRvIGJlIGNvbXBhdGlibGUgd2l0aCBBcHBTeW5jIERhdGVUaW1lKS4gRXhhbXBsZSBXb3JkUHJlc3MgZGF0ZTogMjAyMS0wNy0wMVQxNzoxMTowNVxyXG5pZiAocm93LmRhdGUpIHtcclxuICAgIHNldChyb3csICdkYXRlJywgRGF0ZVRpbWUuZnJvbUlTTyhyb3cuZGF0ZSkudG9TdHJpbmcoKSk7XHJcbn1cclxuUmVtZW1iZXIgdG8gaGFuZGxlIG51bGxzLlxyXG4qL1xyXG5cclxuaW1wb3J0IHsgSUFwcFN5bmNDb25uZWN0aW9uIH0gZnJvbSAnLi4vLi4vYXBwLXN5bmMudHlwZXMnO1xyXG5pbXBvcnQgeyBBcHBTeW5jRGF0YXNvdXJjZSB9IGZyb20gJy4uL2RhdGFzb3VyY2UnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEFwcFN5bmNNeVNxbERhdGFzb3VyY2UgZXh0ZW5kcyBBcHBTeW5jRGF0YXNvdXJjZSB7XHJcblxyXG4gICAgcHVibGljIGZpbmQoKTogSUFwcFN5bmNDb25uZWN0aW9uIHtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ3RoaXMucHJvcHMuc3Rhc2gnLCB0aGlzLnByb3BzLnN0YXNoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZWRnZXM6IFt7XHJcbiAgICAgICAgICAgICAgICBub2RlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6ICdhYmMxMjMnLFxyXG4gICAgICAgICAgICAgICAgICAgIG1jb21tZW50czogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGlkOiAnZGVmNDU2JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IGlkOiAnaGlqNzg5JyB9XHJcbiAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgcGFnZUluZm86IHtcclxuICAgICAgICAgICAgICAgIHNraXA6IDAsXHJcbiAgICAgICAgICAgICAgICBsaW1pdDogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSJdfQ==