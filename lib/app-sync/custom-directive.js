"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDirective = void 0;
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
class CustomDirective {
    // AppSync has poor support for directives. Use GraphQL schema syntax instead.
    static schema() {
        return `
            directive @datasource(name: String) on OBJECT
            directive @source(name: String) on FIELD_DEFINITION | OBJECT
            directive @lookup(from: String, localField: String, foreignField: String) on FIELD_DEFINITION
            directive @readonly(value: String) on FIELD_DEFINITION
        `;
    }
    static datasource(name) {
        return aws_appsync_alpha_1.Directive.custom(`@datasource(name: "${name}")`);
    }
    static source(name) {
        return aws_appsync_alpha_1.Directive.custom(`@source(name: "${name}")`);
    }
    static lookup(value) {
        return aws_appsync_alpha_1.Directive.custom(`@lookup(from: "${value.from}", localField: "${value.localField}", foreignField: "${value.foreignField}")`);
    }
    static readonly(value) {
        return aws_appsync_alpha_1.Directive.custom(`@readonly(value: "${value}")`);
    }
    static getArgumentByIdentifier(identifier, argument, directives) {
        let rv;
        if (typeof (directives) !== 'undefined' && Array.isArray(directives)) {
            const directive = directives.find((o) => o.statement.startsWith(`@${identifier}`));
            if (directive) {
                const regExp = new RegExp(`^@${identifier}\\(${argument}: "(.*)"\\)$`, 'g');
                const match = regExp.exec(directive.statement);
                if ((match === null || match === void 0 ? void 0 : match.length) === 2) {
                    rv = match[1];
                }
            }
        }
        return rv;
    }
}
exports.CustomDirective = CustomDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAtc3luYy9jdXN0b20tZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtFQUF1RDtBQWlCdkQsTUFBYSxlQUFlO0lBRXhCLDhFQUE4RTtJQUN2RSxNQUFNLENBQUMsTUFBTTtRQUNoQixPQUFPOzs7OztTQUtOLENBQUM7SUFDTixDQUFDO0lBRU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sNkJBQVMsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLElBQUksSUFBSSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBWTtRQUM3QixPQUFPLDZCQUFTLENBQUMsTUFBTSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQTZCO1FBQzlDLE9BQU8sNkJBQVMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEtBQUssQ0FBQyxJQUFJLG1CQUFtQixLQUFLLENBQUMsVUFBVSxxQkFBcUIsS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7SUFDeEksQ0FBQztJQUVNLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBYztRQUNqQyxPQUFPLDZCQUFTLENBQUMsTUFBTSxDQUFDLHFCQUFxQixLQUFLLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBa0IsRUFBRSxRQUFnQixFQUFFLFVBQTZCO1FBQ3JHLElBQUksRUFBRSxDQUFDO1FBRVAsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssV0FBVyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDbEUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEYsSUFBSSxTQUFTLEVBQUU7Z0JBQ1gsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxVQUFVLE1BQU0sUUFBUSxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzVFLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE1BQU0sTUFBSyxDQUFDLEVBQUU7b0JBQ3JCLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2pCO2FBQ0o7U0FDSjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQztDQUNKO0FBNUNELDBDQTRDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcHBzeW5jLWFscGhhJztcclxuXHJcbmV4cG9ydCB0eXBlIFBhZ2luYXRpb25UeXBlID0gJ2N1cnNvcicgfCAnb2Zmc2V0JztcclxuXHJcbi8qKlxyXG4gKiBEaXJlY3RpdmVzLlxyXG4gKiBXaHk/IEFwcFN5bmMgY3VzdG9tIGRpcmVjdGl2ZXMgYXJlIHN0cmluZyBvbmx5IGFuZCBicml0dGxlLiBUeXBlIHNhZmUgZGlyZWN0aXZlcy5cclxuICovXHJcblxyXG5leHBvcnQgdHlwZSBJRGlyZWN0aXZlQXV0aE9wZXJhdGlvbiA9ICdyZWFkJyB8ICdjcmVhdGUnIHwgJ3VwZGF0ZScgfCAnZGVsZXRlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUN1c3RvbURpcmVjdGl2ZUxvb2t1cCB7XHJcbiAgICBmcm9tOiBzdHJpbmc7XHJcbiAgICBsb2NhbEZpZWxkOiBzdHJpbmc7XHJcbiAgICBmb3JlaWduRmllbGQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEN1c3RvbURpcmVjdGl2ZSB7XHJcblxyXG4gICAgLy8gQXBwU3luYyBoYXMgcG9vciBzdXBwb3J0IGZvciBkaXJlY3RpdmVzLiBVc2UgR3JhcGhRTCBzY2hlbWEgc3ludGF4IGluc3RlYWQuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNjaGVtYSgpOiBzdHJpbmcgeyAvLyBUT0RPOiBSZXR1cm4gZ3JhcGhxbC5Eb2N1bWVudE5vZGUgd2hlbiBncmFwaHFsIG5wbSBtb2R1bGUgY29tcGlsZSBlcnJvciBmaXhlZC5cclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICBkaXJlY3RpdmUgQGRhdGFzb3VyY2UobmFtZTogU3RyaW5nKSBvbiBPQkpFQ1RcclxuICAgICAgICAgICAgZGlyZWN0aXZlIEBzb3VyY2UobmFtZTogU3RyaW5nKSBvbiBGSUVMRF9ERUZJTklUSU9OIHwgT0JKRUNUXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZSBAbG9va3VwKGZyb206IFN0cmluZywgbG9jYWxGaWVsZDogU3RyaW5nLCBmb3JlaWduRmllbGQ6IFN0cmluZykgb24gRklFTERfREVGSU5JVElPTlxyXG4gICAgICAgICAgICBkaXJlY3RpdmUgQHJlYWRvbmx5KHZhbHVlOiBTdHJpbmcpIG9uIEZJRUxEX0RFRklOSVRJT05cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZGF0YXNvdXJjZShuYW1lOiBzdHJpbmcpOiBEaXJlY3RpdmUge1xyXG4gICAgICAgIHJldHVybiBEaXJlY3RpdmUuY3VzdG9tKGBAZGF0YXNvdXJjZShuYW1lOiBcIiR7bmFtZX1cIilgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIHNvdXJjZShuYW1lOiBzdHJpbmcpOiBEaXJlY3RpdmUge1xyXG4gICAgICAgIHJldHVybiBEaXJlY3RpdmUuY3VzdG9tKGBAc291cmNlKG5hbWU6IFwiJHtuYW1lfVwiKWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgbG9va3VwKHZhbHVlOiBJQ3VzdG9tRGlyZWN0aXZlTG9va3VwKSB7XHJcbiAgICAgICAgcmV0dXJuIERpcmVjdGl2ZS5jdXN0b20oYEBsb29rdXAoZnJvbTogXCIke3ZhbHVlLmZyb219XCIsIGxvY2FsRmllbGQ6IFwiJHt2YWx1ZS5sb2NhbEZpZWxkfVwiLCBmb3JlaWduRmllbGQ6IFwiJHt2YWx1ZS5mb3JlaWduRmllbGR9XCIpYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSh2YWx1ZTogYm9vbGVhbik6IERpcmVjdGl2ZSB7XHJcbiAgICAgICAgcmV0dXJuIERpcmVjdGl2ZS5jdXN0b20oYEByZWFkb25seSh2YWx1ZTogXCIke3ZhbHVlfVwiKWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIoaWRlbnRpZmllcjogc3RyaW5nLCBhcmd1bWVudDogc3RyaW5nLCBkaXJlY3RpdmVzOiBhbnlbXSB8IHVuZGVmaW5lZCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgbGV0IHJ2O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIChkaXJlY3RpdmVzKSAhPT0gJ3VuZGVmaW5lZCcgJiYgQXJyYXkuaXNBcnJheShkaXJlY3RpdmVzKSkge1xyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3RpdmUgPSBkaXJlY3RpdmVzLmZpbmQoKG86IGFueSkgPT4gby5zdGF0ZW1lbnQuc3RhcnRzV2l0aChgQCR7aWRlbnRpZmllcn1gKSk7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ0V4cCA9IG5ldyBSZWdFeHAoYF5AJHtpZGVudGlmaWVyfVxcXFwoJHthcmd1bWVudH06IFwiKC4qKVwiXFxcXCkkYCwgJ2cnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcmVnRXhwLmV4ZWMoZGlyZWN0aXZlLnN0YXRlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2g/Lmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gbWF0Y2hbMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxufVxyXG4iXX0=