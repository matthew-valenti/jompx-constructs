"use strict";
// import { Directive } from '@aws-cdk/aws-appsync-alpha';
// import { CustomDirective } from '../../custom-directive';
// type IDirectiveOperation = 'all' | 'find' | 'findOne' | 'insertOne' | 'insertMany' | 'updateOne' | 'updateMany' | 'upsertOne' | 'upsertMany' | 'deleteOne' | 'deleteMany'; // TODO: Add search.
// export type IDirectiveOperations = IDirectiveOperation[];
// export class AppSyncMySqlCustomDirective extends CustomDirective {
//     public static schema(): string { // TODO: Return graphql.DocumentNode when graphql npm module compile error fixed.
//         return `
//             directive @operations(names: [String]) on OBJECT
//         `;
//     }
//     public static operations(operations: IDirectiveOperations): Directive {
//         return Directive.custom(`@operations(names: "${operations.join()}")`);
//     }
//     // TODO: Support cusor pagination.
//     // public static pagination(type: PaginationType): Directive {
//     //     return Directive.custom(`@pagination(type: "${type}")`);
//     // }
// }
// // Keep this in mind:
// // export declare class ObjectType extends InterfaceType implements IIntermediateType {
// // extends is for extending a class, implements is for implementing an interface
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXlzcWwuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2FwcC1zeW5jL2RhdGFzb3VyY2VzL215c3FsL215c3FsLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMERBQTBEO0FBQzFELDREQUE0RDtBQUU1RCxrTUFBa007QUFDbE0sNERBQTREO0FBRTVELHFFQUFxRTtBQUVyRSx5SEFBeUg7QUFDekgsbUJBQW1CO0FBQ25CLCtEQUErRDtBQUMvRCxhQUFhO0FBQ2IsUUFBUTtBQUVSLDhFQUE4RTtBQUM5RSxpRkFBaUY7QUFDakYsUUFBUTtBQUVSLHlDQUF5QztBQUN6QyxxRUFBcUU7QUFDckUsc0VBQXNFO0FBQ3RFLFdBQVc7QUFDWCxJQUFJO0FBRUosd0JBQXdCO0FBQ3hCLDBGQUEwRjtBQUMxRixtRkFBbUYiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyBEaXJlY3RpdmUgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcbi8vIGltcG9ydCB7IEN1c3RvbURpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2N1c3RvbS1kaXJlY3RpdmUnO1xyXG5cclxuLy8gdHlwZSBJRGlyZWN0aXZlT3BlcmF0aW9uID0gJ2FsbCcgfCAnZmluZCcgfCAnZmluZE9uZScgfCAnaW5zZXJ0T25lJyB8ICdpbnNlcnRNYW55JyB8ICd1cGRhdGVPbmUnIHwgJ3VwZGF0ZU1hbnknIHwgJ3Vwc2VydE9uZScgfCAndXBzZXJ0TWFueScgfCAnZGVsZXRlT25lJyB8ICdkZWxldGVNYW55JzsgLy8gVE9ETzogQWRkIHNlYXJjaC5cclxuLy8gZXhwb3J0IHR5cGUgSURpcmVjdGl2ZU9wZXJhdGlvbnMgPSBJRGlyZWN0aXZlT3BlcmF0aW9uW107XHJcblxyXG4vLyBleHBvcnQgY2xhc3MgQXBwU3luY015U3FsQ3VzdG9tRGlyZWN0aXZlIGV4dGVuZHMgQ3VzdG9tRGlyZWN0aXZlIHtcclxuXHJcbi8vICAgICBwdWJsaWMgc3RhdGljIHNjaGVtYSgpOiBzdHJpbmcgeyAvLyBUT0RPOiBSZXR1cm4gZ3JhcGhxbC5Eb2N1bWVudE5vZGUgd2hlbiBncmFwaHFsIG5wbSBtb2R1bGUgY29tcGlsZSBlcnJvciBmaXhlZC5cclxuLy8gICAgICAgICByZXR1cm4gYFxyXG4vLyAgICAgICAgICAgICBkaXJlY3RpdmUgQG9wZXJhdGlvbnMobmFtZXM6IFtTdHJpbmddKSBvbiBPQkpFQ1RcclxuLy8gICAgICAgICBgO1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIHB1YmxpYyBzdGF0aWMgb3BlcmF0aW9ucyhvcGVyYXRpb25zOiBJRGlyZWN0aXZlT3BlcmF0aW9ucyk6IERpcmVjdGl2ZSB7XHJcbi8vICAgICAgICAgcmV0dXJuIERpcmVjdGl2ZS5jdXN0b20oYEBvcGVyYXRpb25zKG5hbWVzOiBcIiR7b3BlcmF0aW9ucy5qb2luKCl9XCIpYCk7XHJcbi8vICAgICB9XHJcblxyXG4vLyAgICAgLy8gVE9ETzogU3VwcG9ydCBjdXNvciBwYWdpbmF0aW9uLlxyXG4vLyAgICAgLy8gcHVibGljIHN0YXRpYyBwYWdpbmF0aW9uKHR5cGU6IFBhZ2luYXRpb25UeXBlKTogRGlyZWN0aXZlIHtcclxuLy8gICAgIC8vICAgICByZXR1cm4gRGlyZWN0aXZlLmN1c3RvbShgQHBhZ2luYXRpb24odHlwZTogXCIke3R5cGV9XCIpYCk7XHJcbi8vICAgICAvLyB9XHJcbi8vIH1cclxuXHJcbi8vIC8vIEtlZXAgdGhpcyBpbiBtaW5kOlxyXG4vLyAvLyBleHBvcnQgZGVjbGFyZSBjbGFzcyBPYmplY3RUeXBlIGV4dGVuZHMgSW50ZXJmYWNlVHlwZSBpbXBsZW1lbnRzIElJbnRlcm1lZGlhdGVUeXBlIHtcclxuLy8gLy8gZXh0ZW5kcyBpcyBmb3IgZXh0ZW5kaW5nIGEgY2xhc3MsIGltcGxlbWVudHMgaXMgZm9yIGltcGxlbWVudGluZyBhbiBpbnRlcmZhY2UiXX0=