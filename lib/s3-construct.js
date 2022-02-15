"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JompxS3 = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const constructs_1 = require("constructs");
/**
 *
 */
class JompxS3 extends constructs_1.Construct {
    constructor(scope, id) {
        super(scope, id);
        new aws_s3_1.Bucket(this, 'MyFirstBucket');
    }
}
exports.JompxS3 = JompxS3;
_a = JSII_RTTI_SYMBOL_1;
JompxS3[_a] = { fqn: "@jompx/constructs.JompxS3", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3MzLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtDQUE0QztBQUM1QywyQ0FBdUM7QUFNdkM7O0dBRUc7QUFDSCxNQUFhLE9BQVEsU0FBUSxzQkFBUztJQUVsQyxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUNwQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksZUFBTSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN0QyxDQUFDOztBQU5MLDBCQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQnVja2V0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElKb21weENka1BpcGVsaW5lUHJvcHMge1xyXG4gICAgdGVzdDogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICpcclxuICovXHJcbmV4cG9ydCBjbGFzcyBKb21weFMzIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgbmV3IEJ1Y2tldCh0aGlzLCAnTXlGaXJzdEJ1Y2tldCcpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==