import { Construct } from 'constructs';
import { aws_amazonmq as amazonmq } from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

import * as cdk from 'aws-cdk-lib';

export interface MqttBrokerProps {
  vpc: ec2.Vpc
  securityGroup: ec2.SecurityGroup
}

export class MqttBroker extends Construct {
  constructor(scope: Construct, id: string, props: MqttBrokerProps) {
    super(scope, id);


    const broker = new amazonmq.CfnBroker(scope, 'MQTTBroker', {
      brokerName: 'mqtt-broker',
      engineType: 'ACTIVEMQ',
      engineVersion: '5.15.14',
      autoMinorVersionUpgrade: true,
      deploymentMode: 'ACTIVE_STANDBY_MULTI_AZ',
      hostInstanceType: 'mq.t3.micro',
      publiclyAccessible: true,
      securityGroups: [props.securityGroup.securityGroupId],
      subnetIds: props.vpc.publicSubnets.map(subnet => subnet.subnetId),
      logs: {
        general: true,
        audit: true
      },
      // Users Settings
      users: [
        {
          groups: ['admin'],
          username: 'admin',
          password: 'admintest1234',
          consoleAccess: true,
        },
        {
          groups: ['publisher'],
          username: 'publisher',
          password: 'publisher1234',
          consoleAccess: false,
        },
        {
          groups: ['subscriber'],
          username: 'subscriber',
          password: 'subscriber1234',
          consoleAccess: false,
        }
      ],
    });

    // Create a configuration for the broker
    const config = new amazonmq.CfnConfiguration(scope, 'MQTTBrokerConfig', {
      engineType: 'ACTIVEMQ',
      engineVersion: '5.15.14',
      /*
      authorizationEntry:
      * admin: full access
      * publisher: only creating topics and publishing messages allowed
      * subscriber: only subscribing to topics allowed
      */
      data: cdk.Fn.base64(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <broker xmlns="http://activemq.apache.org/schema/core" schedulePeriodForDestinationPurge="10000">
        <destinationPolicy>
          <policyMap>
            <policyEntries>
              <policyEntry topic=">" gcInactiveDestinations="true" inactiveTimoutBeforeGC="600000">
                <pendingMessageLimitStrategy>
                  <constantPendingMessageLimitStrategy limit="1000"/>
                </pendingMessageLimitStrategy>
              </policyEntry>
              <policyEntry queue=">" gcInactiveDestinations="true" inactiveTimoutBeforeGC="600000" />
            </policyEntries>
          </policyMap>
        </destinationPolicy>
        <plugins>
          <authorizationPlugin>
            <map>
              <authorizationMap>
                <authorizationEntries>
                  <authorizationEntry topic=">" write="admin, publisher, activemq-webconsole" read="admin, subscriber, activemq-webconsole" admin="admin,publisher, activemq-webconsole"/>
                </authorizationEntries>
              </authorizationMap>
            </map>
          </authorizationPlugin>
        </plugins>
      </broker>
      `),
      description: 'MQTT Broker Config',
      name: 'mqtt-broker-config',
    });


    new amazonmq.CfnConfigurationAssociation(scope, 'MQTTBrokerConfigAssociation', {
      broker: broker.ref,
      configuration: {
        id: config.ref,
        revision: config.attrRevision
      }
    });



  }
}