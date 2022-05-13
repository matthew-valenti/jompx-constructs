"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDirective = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
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
_a = JSII_RTTI_SYMBOL_1;
CustomDirective[_a] = { fqn: "@jompx/constructs.CustomDirective", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAtc3luYy9jdXN0b20tZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQXVEO0FBaUJ2RCxNQUFhLGVBQWU7SUFFeEIsOEVBQThFO0lBQ3ZFLE1BQU0sQ0FBQyxNQUFNO1FBQ2hCLE9BQU87Ozs7O1NBS04sQ0FBQztJQUNOLENBQUM7SUFFTSxNQUFNLENBQUMsVUFBVSxDQUFDLElBQVk7UUFDakMsT0FBTyw2QkFBUyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFZO1FBQzdCLE9BQU8sNkJBQVMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLElBQUksSUFBSSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBNkI7UUFDOUMsT0FBTyw2QkFBUyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsS0FBSyxDQUFDLElBQUksbUJBQW1CLEtBQUssQ0FBQyxVQUFVLHFCQUFxQixLQUFLLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQztJQUN4SSxDQUFDO0lBRU0sTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFjO1FBQ2pDLE9BQU8sNkJBQVMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLEtBQUssSUFBSSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVNLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFrQixFQUFFLFFBQWdCLEVBQUUsVUFBNkI7UUFDckcsSUFBSSxFQUFFLENBQUM7UUFFUCxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxXQUFXLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNsRSxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4RixJQUFJLFNBQVMsRUFBRTtnQkFDWCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLFVBQVUsTUFBTSxRQUFRLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDNUUsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQy9DLElBQUksQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsTUFBTSxNQUFLLENBQUMsRUFBRTtvQkFDckIsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakI7YUFDSjtTQUNKO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDOztBQTNDTCwwQ0E0Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUgfSBmcm9tICdAYXdzLWNkay9hd3MtYXBwc3luYy1hbHBoYSc7XHJcblxyXG5leHBvcnQgdHlwZSBQYWdpbmF0aW9uVHlwZSA9ICdjdXJzb3InIHwgJ29mZnNldCc7XHJcblxyXG4vKipcclxuICogRGlyZWN0aXZlcy5cclxuICogV2h5PyBBcHBTeW5jIGN1c3RvbSBkaXJlY3RpdmVzIGFyZSBzdHJpbmcgb25seSBhbmQgYnJpdHRsZS4gVHlwZSBzYWZlIGRpcmVjdGl2ZXMuXHJcbiAqL1xyXG5cclxuZXhwb3J0IHR5cGUgSURpcmVjdGl2ZUF1dGhPcGVyYXRpb24gPSAncmVhZCcgfCAnY3JlYXRlJyB8ICd1cGRhdGUnIHwgJ2RlbGV0ZSc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDdXN0b21EaXJlY3RpdmVMb29rdXAge1xyXG4gICAgZnJvbTogc3RyaW5nO1xyXG4gICAgbG9jYWxGaWVsZDogc3RyaW5nO1xyXG4gICAgZm9yZWlnbkZpZWxkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDdXN0b21EaXJlY3RpdmUge1xyXG5cclxuICAgIC8vIEFwcFN5bmMgaGFzIHBvb3Igc3VwcG9ydCBmb3IgZGlyZWN0aXZlcy4gVXNlIEdyYXBoUUwgc2NoZW1hIHN5bnRheCBpbnN0ZWFkLlxyXG4gICAgcHVibGljIHN0YXRpYyBzY2hlbWEoKTogc3RyaW5nIHsgLy8gVE9ETzogUmV0dXJuIGdyYXBocWwuRG9jdW1lbnROb2RlIHdoZW4gZ3JhcGhxbCBucG0gbW9kdWxlIGNvbXBpbGUgZXJyb3IgZml4ZWQuXHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgZGlyZWN0aXZlIEBkYXRhc291cmNlKG5hbWU6IFN0cmluZykgb24gT0JKRUNUXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZSBAc291cmNlKG5hbWU6IFN0cmluZykgb24gRklFTERfREVGSU5JVElPTiB8IE9CSkVDVFxyXG4gICAgICAgICAgICBkaXJlY3RpdmUgQGxvb2t1cChmcm9tOiBTdHJpbmcsIGxvY2FsRmllbGQ6IFN0cmluZywgZm9yZWlnbkZpZWxkOiBTdHJpbmcpIG9uIEZJRUxEX0RFRklOSVRJT05cclxuICAgICAgICAgICAgZGlyZWN0aXZlIEByZWFkb25seSh2YWx1ZTogU3RyaW5nKSBvbiBGSUVMRF9ERUZJTklUSU9OXHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRhdGFzb3VyY2UobmFtZTogc3RyaW5nKTogRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4gRGlyZWN0aXZlLmN1c3RvbShgQGRhdGFzb3VyY2UobmFtZTogXCIke25hbWV9XCIpYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzb3VyY2UobmFtZTogc3RyaW5nKTogRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4gRGlyZWN0aXZlLmN1c3RvbShgQHNvdXJjZShuYW1lOiBcIiR7bmFtZX1cIilgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvb2t1cCh2YWx1ZTogSUN1c3RvbURpcmVjdGl2ZUxvb2t1cCkge1xyXG4gICAgICAgIHJldHVybiBEaXJlY3RpdmUuY3VzdG9tKGBAbG9va3VwKGZyb206IFwiJHt2YWx1ZS5mcm9tfVwiLCBsb2NhbEZpZWxkOiBcIiR7dmFsdWUubG9jYWxGaWVsZH1cIiwgZm9yZWlnbkZpZWxkOiBcIiR7dmFsdWUuZm9yZWlnbkZpZWxkfVwiKWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkodmFsdWU6IGJvb2xlYW4pOiBEaXJlY3RpdmUge1xyXG4gICAgICAgIHJldHVybiBEaXJlY3RpdmUuY3VzdG9tKGBAcmVhZG9ubHkodmFsdWU6IFwiJHt2YWx1ZX1cIilgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEFyZ3VtZW50QnlJZGVudGlmaWVyKGlkZW50aWZpZXI6IHN0cmluZywgYXJndW1lbnQ6IHN0cmluZywgZGlyZWN0aXZlczogYW55W10gfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCBydjtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiAoZGlyZWN0aXZlcykgIT09ICd1bmRlZmluZWQnICYmIEFycmF5LmlzQXJyYXkoZGlyZWN0aXZlcykpIHtcclxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aXZlID0gZGlyZWN0aXZlcy5maW5kKChvOiBhbnkpID0+IG8uc3RhdGVtZW50LnN0YXJ0c1dpdGgoYEAke2lkZW50aWZpZXJ9YCkpO1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdFeHAgPSBuZXcgUmVnRXhwKGBeQCR7aWRlbnRpZmllcn1cXFxcKCR7YXJndW1lbnR9OiBcIiguKilcIlxcXFwpJGAsICdnJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IHJlZ0V4cC5leGVjKGRpcmVjdGl2ZS5zdGF0ZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoPy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBydiA9IG1hdGNoWzFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcbn1cclxuIl19