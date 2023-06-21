# Amazon MQ (MQTT) Sample (AWS CDK and Python Paho MQTT)
The code sample demonstrates the creation of an Amazon MQ broker using AWS CDK and provides a client sample for MQTT communication in Python.

## Architecture
![architecture](architecture.drawio.svg)


### AWS CDK
Create a multi-AZ configuration for VPC and an Active/Standby configuration for Amazon MQ Broker.

* `cdk/lib/constrcuts/network.ts`: VPC, Subnet, Security Group
* `cdk/lib/constrcuts/mqttBroker.ts`: Amazon MQ Broker

### Python
Paho MQTT clients for publishing and subscribing.
* `python/mqtt_helper.py`: MQTT client helper class.
* `python/publisher.py`: MQTT publisher.
* `python/subscriber.py`: MQTT subscriber.


