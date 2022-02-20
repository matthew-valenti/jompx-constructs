import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface IJompxCdkPipelineProps {
    test: string;
}

/**
 *
 */
export class JompxS3 extends Construct {

    constructor(scope: Construct, id: string) {
        super(scope, id);

        new Bucket(this, 'MyFirstBucket');
    }
}
