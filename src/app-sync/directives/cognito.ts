import { Directive } from '@aws-cdk/aws-appsync-alpha';
import { CustomDirective } from '../directive.abstract';

// Function (to use when defining GraphQL schema).
export function cognito(): Directive {
    return Directive.custom('@aws_cognito_user_pools');
}

export class CognitoDirective extends CustomDirective {

    public definition(): string {
        return '';
    }

    public value(directives?: Directive[]): boolean | undefined {
        return !!CognitoDirective.getIdentifierArgument('cognito', 'value', directives);
    }
}