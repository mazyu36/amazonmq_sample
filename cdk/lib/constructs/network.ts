import { Construct } from 'constructs';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

export interface NetworkProps {

}

export class Network extends Construct {
  public readonly vpc: ec2.Vpc
  public readonly mqttsSecurityGroup: ec2.SecurityGroup

  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id);

    this.vpc = new ec2.Vpc(scope, 'VPC', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 0,
      maxAzs: 2,
      subnetConfiguration: [
        {
          name: 'public-subnet',
          subnetType: ec2.SubnetType.PUBLIC
        }
      ]
    })


    this.mqttsSecurityGroup = new ec2.SecurityGroup(scope, 'SecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: true,
      description: 'Allow MQTTS access to ec2 instances from anywhere',
      securityGroupName: 'allow-mqtts-from-anywhere',
    });

    this.mqttsSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8883), 'allow mqtts access from the world');

    this.mqttsSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8162), 'allow ActiveMQ console access from the world');


  }
}