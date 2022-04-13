"use strict";
/*
// Add timezone offset to WordPress date (to be compatible with AppSync DateTime). Example WordPress date: 2021-07-01T17:11:05
if (row.date) {
    set(row, 'date', DateTime.fromISO(row.date).toString());
}
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSyncMySqlDatasource = void 0;
class AppSyncMySqlDatasource {
    find(objectType) {
        console.log('find', objectType);
        return {
            edges: [{
                    node: {
                        id: 'abc123',
                        mcomments: [
                            { id: 'def456' },
                            { id: 'hij789' }
                        ]
                    }
                }]
        };
    }
}
exports.AppSyncMySqlDatasource = AppSyncMySqlDatasource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuZGF0YXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jbGFzc2VzL2FwcC1zeW5jL2RhdGFzb3VyY2VzL215c3FsLmRhdGFzb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztFQUtFOzs7QUFFRixNQUFhLHNCQUFzQjtJQUN4QixJQUFJLENBQUMsVUFBa0I7UUFDMUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFaEMsT0FBTztZQUNILEtBQUssRUFBRSxDQUFDO29CQUNKLElBQUksRUFBRTt3QkFDRixFQUFFLEVBQUUsUUFBUTt3QkFDWixTQUFTLEVBQUU7NEJBQ1AsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFOzRCQUNoQixFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUU7eUJBQ25CO3FCQUNKO2lCQUNKLENBQUM7U0FDTCxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBaEJELHdEQWdCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbi8vIEFkZCB0aW1lem9uZSBvZmZzZXQgdG8gV29yZFByZXNzIGRhdGUgKHRvIGJlIGNvbXBhdGlibGUgd2l0aCBBcHBTeW5jIERhdGVUaW1lKS4gRXhhbXBsZSBXb3JkUHJlc3MgZGF0ZTogMjAyMS0wNy0wMVQxNzoxMTowNVxyXG5pZiAocm93LmRhdGUpIHtcclxuICAgIHNldChyb3csICdkYXRlJywgRGF0ZVRpbWUuZnJvbUlTTyhyb3cuZGF0ZSkudG9TdHJpbmcoKSk7XHJcbn1cclxuKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBBcHBTeW5jTXlTcWxEYXRhc291cmNlIHtcclxuICAgIHB1YmxpYyBmaW5kKG9iamVjdFR5cGU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdmaW5kJywgb2JqZWN0VHlwZSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGVkZ2VzOiBbe1xyXG4gICAgICAgICAgICAgICAgbm9kZToge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAnYWJjMTIzJyxcclxuICAgICAgICAgICAgICAgICAgICBtY29tbWVudHM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpZDogJ2RlZjQ1NicgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpZDogJ2hpajc4OScgfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfV1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59Il19