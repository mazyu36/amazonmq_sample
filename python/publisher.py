from datetime import datetime as dt
from time import sleep
from mqtt_helper import MQTTHelper


def on_publish(client, userdata, mid):
    print(f'publish: {mid}')


def on_connect(client, userdata, flag, rc):
    print("Connected with result code " + str(rc))


def main():
    mqtt_helper = MQTTHelper('publisher')
    mqtt_helper.set_on_publish_callback(on_publish)
    mqtt_helper.set_on_connect_callback(on_connect)

    mqtt_helper.set_will_message("messages/will", "publisher is dead", qos=0, retain=False)

    mqtt_helper.connect()

    while True:
        now_datetime = dt.now()
        mqtt_helper.publish("messages/now", f"hello {now_datetime.strftime('%Y/%m/%d %H:%M:%S')}")
        sleep(2)


if __name__ == '__main__':
    main()
