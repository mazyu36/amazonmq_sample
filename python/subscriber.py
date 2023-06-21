from mqtt_helper import MQTTHelper


topic = 'messages/#'
qos = 0


def on_message(client, userdata, msg):
    print('##### Message receieved!!! #####')
    print(f'topic: {msg.topic}')
    print(f'Received message: {msg.payload.decode("utf-8")}')
    print(f'QoS: {msg.qos}')
    print(f'retain: {msg.retain}\n')


def on_connect(client, userdata, flag, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(topic, qos)


def main():
    mqtt_helper = MQTTHelper('subscriber')

    mqtt_helper.set_on_message_callback(on_message)
    mqtt_helper.set_on_connect_callback(on_connect)

    mqtt_helper.connect()

    try:
        while True:
            pass
    except KeyboardInterrupt:
        mqtt_helper.disconnect()


if __name__ == '__main__':
    main()
