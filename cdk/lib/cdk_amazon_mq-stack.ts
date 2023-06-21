import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Network } from './constructs/network';
import { MqttBroker } from './constructs/mqttBroker';

export class CdkAmazonMqStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const network = new Network(this, 'NetworkConstruct', {});

    new MqttBroker(this, 'MQTTBrokerConstruct', {
      vpc: network.vpc,
      securityGroup: network.mqttsSecurityGroup,
    });


  }
}
