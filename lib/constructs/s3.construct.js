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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMuY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnN0cnVjdHMvczMuY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0NBQTRDO0FBQzVDLDJDQUF1QztBQU12Qzs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLHNCQUFTO0lBRWxDLFlBQVksS0FBZ0IsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7O0FBTkwsMEJBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCdWNrZXQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNka1BpcGVsaW5lUHJvcHMge1xyXG4gICAgdGVzdDogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICpcclxuICovXHJcbmV4cG9ydCBjbGFzcyBKb21weFMzIGV4dGVuZHMgQ29uc3RydWN0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcclxuXHJcbiAgICAgICAgbmV3IEJ1Y2tldCh0aGlzLCAnTXlGaXJzdEJ1Y2tldCcpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==