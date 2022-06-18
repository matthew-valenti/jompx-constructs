import * as cdirective from './directives';

// AppSync VTL snippet to pass event params to Lambda resolver: https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-programming-guide.html
// With no VTL, the Lambda event contains all properties below. However, selectionSetList is a child property of info.
// Thru trial and error there doesn't appear to be a way to add selectionSetList as a child property.
// We need VTL because this is the only known way to pass variables directly into the Lambda.
// However, when we specify any VTL we must specify all VTL. Adding data to the stash property results in an empty Lambda event.
// Stash variables can be added by appending additional VTL above this payload statement. i.e. $util.qr($ctx.stash.put("key", "value"))
// This VTL invokes a payload property which simply returns an object with properties (taken from the AppSync $context variable).
// Caution: payload should mimic a standard Lambda resolver (with no VTL). This object might change in the future.
// In theory, we could use a Lambda function instead of VTL but this should be much faster than invoking another Lambda.
export const DefaultRequestMappingTemplate = `{
    "version" : "2018-05-29",
    "operation": "Invoke",
    "payload": {
        "arguments": $utils.toJson($context.arguments),
        "identity": $utils.toJson($context.identity),
        "source": $utils.toJson($context.source),
        "request": $utils.toJson($context.request),
        "prev": $utils.toJson($context.prev),
        "info": $utils.toJson($context.info),
        "stash": $utils.toJson($context.stash),
        "selectionSetList": $utils.toJson($context.info.selectionSetList)
    }
}`;

export const AwsScalars = [
    'scalar AWSDate',
    'scalar AWSTime',
    'scalar AWSDateTime',
    'scalar AWSTimestamp',
    'scalar AWSEmail',
    'scalar AWSJSON',
    'scalar AWSURL',
    'scalar AWSPhone',
    'scalar AWSIPAddress'
].join('\n');

// Return directive defintions (AWS + global custom).
export function DirectiveDefinitions(): string {

    let defintions = `
        directive @aws_iam on FIELD_DEFINITION | OBJECT
        directive @aws_cognito_user_pools(cognito_groups: String) on FIELD_DEFINITION | OBJECT
    `;

    // Custom directives.
    const directiveClasses = [
        cdirective.AuthDirective,
        cdirective.CognitoDirective,
        cdirective.DatasourceDirective,
        cdirective.LookupDirective,
        cdirective.OperationsDirective,
        cdirective.PaginationDirective,
        cdirective.ReadonlyDirective,
        cdirective.SourceDirective
    ];

    defintions += directiveClasses.map((directiveClass) => {
        const directive = new directiveClass();
        return directive.definition();
    }).join('\n');

    return defintions;
}
