import ssl
import paho.mqtt.client as mqtt
import random
import time


class MQTTHelper:
    """
    MQTT client helper class
    """
    def __init__(self, client_name):
        self.username = 'admin'
        self.password = 'admintest1234'
        # Set broker host list
        self.broker_host_list = [
            'b-xxxxx.mq.ap-northeast-1.amazonaws.com',
            'b-xxxxx.mq.ap-northeast-1.amazonaws.com']

        # Create an MQTT client instance
        self.client = mqtt.Client(protocol=mqtt.MQTTv311, client_id=client_name, clean_session=None)

        # Set SSL/TLS context
        context = ssl.create_default_context()
        self.client.tls_set_context(context=context)

        self.client.on_disconnect = self.on_disconnect
        self.client.username_pw_set(self.username, self.password)

    def connect(self):
        """
        Attempt to connect by randomly selecting a broker from the broker_host_list.
        """
        attempt = 1
        while True:
            broker = random.choice(self.broker_host_list)
            print(f'Connecting to {broker}')
            try:
                self.client.connect(broker, 8883, 60)
                print(f'Successfully connected to "{broker}"')
                self.client.loop_start()

                # if connected, reset attempt counter
                attempt = 1

                break
            except Exception as e:
                print(f'Failed to connect to {broker}')
                print(e)
                print('Trying to connect to another broker...')

                # calculate wait time before retrying (exponential backoff)
                wait_time = min(2 ** attempt, 30)
                print(f'Waiting for {wait_time} seconds before retrying...\n')
                time.sleep(wait_time)
                attempt += 1
                continue

    def on_disconnect(self, client, userdata, rc):
        if rc != 0:
            print(f'Unexpected disconnection. rc={rc}')
            self.connect()

    def set_on_publish_callback(self, callback):
        self.client.on_publish = callback

    def set_on_message_callback(self, callback):
        self.client.on_message = callback

    def set_on_connect_callback(self, callback):
        self.client.on_connect = callback

    def set_will_message(self, topic, payload, qos=0, retain=False):
        self.client.will_set(topic, payload, qos, retain)

    def publish(self, topic, payload=None, qos=0, retain=False):
        self.client.publish(topic, payload, qos, retain)

    def subscribe(self, topic, qos=0):
        self.subscribed_topic = topic
        self.client.subscribe(topic, qos)

    def disconnect(self):
        self.client.loop_stop()

        self.client.disconnect()

    def loop_forever(self):
        self.client.loop_forever()
