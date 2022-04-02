"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDirective = void 0;
const aws_appsync_alpha_1 = require("@aws-cdk/aws-appsync-alpha");
class CustomDirective {
    static datasource(name) {
        return aws_appsync_alpha_1.Directive.custom(`@datasource(name: "${name}")`);
    }
    static getArgumentByIdentifier(directives, identifier, argument) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NsYXNzZXMvYXBwLXN5bmMvZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGtFQUF1RDtBQVd2RCxNQUFhLGVBQWU7SUFFakIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sNkJBQVMsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLElBQUksSUFBSSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVNLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxVQUE2QixFQUFFLFVBQWtCLEVBQUUsUUFBZ0I7UUFDckcsSUFBSSxFQUFFLENBQUM7UUFFUCxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxXQUFXLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNsRSxNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4RixJQUFJLFNBQVMsRUFBRTtnQkFDWCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLFVBQVUsTUFBTSxRQUFRLGNBQWMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDNUUsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQy9DLElBQUksQ0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsTUFBTSxNQUFLLENBQUMsRUFBRTtvQkFDckIsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakI7YUFDSjtTQUNKO1FBRUQsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0NBQ0o7QUF0QkQsMENBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWFwcHN5bmMtYWxwaGEnO1xyXG5cclxuZXhwb3J0IHR5cGUgUGFnaW5hdGlvblR5cGUgPSAnY3Vyc29yJyB8ICdvZmZzZXQnO1xyXG5cclxuLyoqXHJcbiAqIERpcmVjdGl2ZXMuXHJcbiAqIFdoeT8gQXBwU3luYyBjdXN0b20gZGlyZWN0aXZlcyBhcmUgc3RyaW5nIG9ubHkgYW5kIGJyaXR0bGUuIFR5cGUgc2FmZSBkaXJlY3RpdmVzLlxyXG4gKi9cclxuXHJcbmV4cG9ydCB0eXBlIElEaXJlY3RpdmVBdXRoT3BlcmF0aW9uID0gJ3JlYWQnIHwgJ2NyZWF0ZScgfCAndXBkYXRlJyB8ICdkZWxldGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEN1c3RvbURpcmVjdGl2ZSB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBkYXRhc291cmNlKG5hbWU6IHN0cmluZyk6IERpcmVjdGl2ZSB7XHJcbiAgICAgICAgcmV0dXJuIERpcmVjdGl2ZS5jdXN0b20oYEBkYXRhc291cmNlKG5hbWU6IFwiJHtuYW1lfVwiKWApO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0QXJndW1lbnRCeUlkZW50aWZpZXIoZGlyZWN0aXZlczogYW55W10gfCB1bmRlZmluZWQsIGlkZW50aWZpZXI6IHN0cmluZywgYXJndW1lbnQ6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgbGV0IHJ2O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIChkaXJlY3RpdmVzKSAhPT0gJ3VuZGVmaW5lZCcgJiYgQXJyYXkuaXNBcnJheShkaXJlY3RpdmVzKSkge1xyXG4gICAgICAgICAgICBjb25zdCBkaXJlY3RpdmUgPSBkaXJlY3RpdmVzLmZpbmQoKG86IGFueSkgPT4gby5zdGF0ZW1lbnQuc3RhcnRzV2l0aChgQCR7aWRlbnRpZmllcn1gKSk7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3RpdmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlZ0V4cCA9IG5ldyBSZWdFeHAoYF5AJHtpZGVudGlmaWVyfVxcXFwoJHthcmd1bWVudH06IFwiKC4qKVwiXFxcXCkkYCwgJ2cnKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gcmVnRXhwLmV4ZWMoZGlyZWN0aXZlLnN0YXRlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2g/Lmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJ2ID0gbWF0Y2hbMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBydjtcclxuICAgIH1cclxufVxyXG4iXX0=