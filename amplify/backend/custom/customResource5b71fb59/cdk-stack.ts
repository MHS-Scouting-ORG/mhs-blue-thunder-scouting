import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as AmplifyHelpers from '@aws-amplify/cli-extensibility-helper';

import { AmplifyDependentResourcesAttributes } from '../../types/amplify-dependent-resources-ref';
import { Construct } from 'constructs';
//import * as iam from 'aws-cdk-lib/aws-iam';
//import * as sns from 'aws-cdk-lib/aws-sns';
//import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
//import * as sqs from 'aws-cdk-lib/aws-sqs';

export class cdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps, amplifyResourceProps?: AmplifyHelpers.AmplifyResourceProps) {
    super(scope, id, props);
    /* Do not remove - Amplify CLI automatically injects the current deployment environment in this input parameter */
    new cdk.CfnParameter(this, 'env', {
      type: 'String',
      description: 'Current Amplify CLI env name',
    });
    const env = AmplifyHelpers.getProjectInfo().envName
    let authRole : iam.IRole
    if(env === 'prod') {
      authRole = iam.Role.fromRoleArn(this, "role-prod", "arn:aws:iam::187619627858:role/amplify-frcscoutingapp-main-144956-authRole")

    }
    else {
      authRole = iam.Role.fromRoleArn(this, "role-dev", "arn:aws:iam::187619627858:role/amplify-frcscoutingapp-dev-143540-authRole")
    }
    const secret = new secretsmanager.Secret(this, 'blueallianceapi', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      secretName: `bluealliance-apikey-${cdk.Fn.ref('env')}`
      
    }) 
    secret.grantRead(authRole)

  }
}