"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDirective = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
class CustomDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLWRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAtc3luYy9jdXN0b20tZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0VBQXVEO0FBaUJ2RCxNQUFhLGVBQWU7SUFFakIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sNkJBQVMsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLElBQUksSUFBSSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVNLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBWTtRQUM3QixPQUFPLDZCQUFTLENBQUMsTUFBTSxDQUFDLGtCQUFrQixJQUFJLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFTSxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQTZCO1FBQzlDLE9BQU8sNkJBQVMsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEtBQUssQ0FBQyxJQUFJLG1CQUFtQixLQUFLLENBQUMsVUFBVSxxQkFBcUIsS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7SUFDeEksQ0FBQztJQUVNLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBYztRQUNqQyxPQUFPLDZCQUFTLENBQUMsTUFBTSxDQUFDLHFCQUFxQixLQUFLLElBQUksQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSxNQUFNLENBQUMsdUJBQXVCLENBQUMsVUFBa0IsRUFBRSxRQUFnQixFQUFFLFVBQTZCO1FBQ3JHLElBQUksRUFBRSxDQUFDO1FBRVAsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssV0FBVyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDbEUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEYsSUFBSSxTQUFTLEVBQUU7Z0JBQ1gsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxVQUFVLE1BQU0sUUFBUSxjQUFjLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQzVFLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUMvQyxJQUFJLENBQUEsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLE1BQU0sTUFBSyxDQUFDLEVBQUU7b0JBQ3JCLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2pCO2FBQ0o7U0FDSjtRQUVELE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQzs7QUFqQ0wsMENBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5cclxuZXhwb3J0IHR5cGUgUGFnaW5hdGlvblR5cGUgPSAnY3Vyc29yJyB8ICdvZmZzZXQnO1xyXG5cclxuLyoqXHJcbiAqIERpcmVjdGl2ZXMuXHJcbiAqIFdoeT8gQXBwU3luYyBjdXN0b20gZGlyZWN0aXZlcyBhcmUgc3RyaW5nIG9ubHkgYW5kIGJyaXR0bGUuIFR5cGUgc2FmZSBkaXJlY3RpdmVzLlxyXG4gKi9cclxuXHJcbmV4cG9ydCB0eXBlIElEaXJlY3RpdmVBdXRoT3BlcmF0aW9uID0gJ3JlYWQnIHwgJ2NyZWF0ZScgfCAndXBkYXRlJyB8ICdkZWxldGUnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ3VzdG9tRGlyZWN0aXZlTG9va3VwIHtcclxuICAgIGZyb206IHN0cmluZztcclxuICAgIGxvY2FsRmllbGQ6IHN0cmluZztcclxuICAgIGZvcmVpZ25GaWVsZDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ3VzdG9tRGlyZWN0aXZlIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRhdGFzb3VyY2UobmFtZTogc3RyaW5nKTogRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4gRGlyZWN0aXZlLmN1c3RvbShgQGRhdGFzb3VyY2UobmFtZTogXCIke25hbWV9XCIpYCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBzb3VyY2UobmFtZTogc3RyaW5nKTogRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4gRGlyZWN0aXZlLmN1c3RvbShgQHNvdXJjZShuYW1lOiBcIiR7bmFtZX1cIilgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGxvb2t1cCh2YWx1ZTogSUN1c3RvbURpcmVjdGl2ZUxvb2t1cCkge1xyXG4gICAgICAgIHJldHVybiBEaXJlY3RpdmUuY3VzdG9tKGBAbG9va3VwKGZyb206IFwiJHt2YWx1ZS5mcm9tfVwiLCBsb2NhbEZpZWxkOiBcIiR7dmFsdWUubG9jYWxGaWVsZH1cIiwgZm9yZWlnbkZpZWxkOiBcIiR7dmFsdWUuZm9yZWlnbkZpZWxkfVwiKWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkodmFsdWU6IGJvb2xlYW4pOiBEaXJlY3RpdmUge1xyXG4gICAgICAgIHJldHVybiBEaXJlY3RpdmUuY3VzdG9tKGBAcmVhZG9ubHkodmFsdWU6IFwiJHt2YWx1ZX1cIilgKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEFyZ3VtZW50QnlJZGVudGlmaWVyKGlkZW50aWZpZXI6IHN0cmluZywgYXJndW1lbnQ6IHN0cmluZywgZGlyZWN0aXZlczogYW55W10gfCB1bmRlZmluZWQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xyXG4gICAgICAgIGxldCBydjtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiAoZGlyZWN0aXZlcykgIT09ICd1bmRlZmluZWQnICYmIEFycmF5LmlzQXJyYXkoZGlyZWN0aXZlcykpIHtcclxuICAgICAgICAgICAgY29uc3QgZGlyZWN0aXZlID0gZGlyZWN0aXZlcy5maW5kKChvOiBhbnkpID0+IG8uc3RhdGVtZW50LnN0YXJ0c1dpdGgoYEAke2lkZW50aWZpZXJ9YCkpO1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWdFeHAgPSBuZXcgUmVnRXhwKGBeQCR7aWRlbnRpZmllcn1cXFxcKCR7YXJndW1lbnR9OiBcIiguKilcIlxcXFwpJGAsICdnJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IHJlZ0V4cC5leGVjKGRpcmVjdGl2ZS5zdGF0ZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoPy5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICBydiA9IG1hdGNoWzFdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcnY7XHJcbiAgICB9XHJcbn1cclxuIl19