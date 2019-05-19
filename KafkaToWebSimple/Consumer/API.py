from flask import Flask, Response
import time
from json import loads, dumps
from kafka import KafkaConsumer

app = Flask(__name__)

@app.route('/cpu')
def get_cpu_use():
    return "test"

@app.route('/stream')
def stream():
    kafka_server = ['localhost:9092']
    topic = 'os_use'

    def eventStream():
        while True:
            consumer = KafkaConsumer(
                topic,
                bootstrap_servers=kafka_server,
                group_id='real-time-cpu-group',
                value_deserializer=lambda x: loads(x.decode('utf-8'))
            )
            for message in consumer:
                print (message.value);
                yield f'event: message\ndata: {dumps(message.value)}\n\n'

            # time.sleep(2)
            # yield "test: test\n"
    res = Response(eventStream(), mimetype="text/event-stream")
    res.headers['Access-Control-Allow-Origin'] = '*'
    return res

if __name__ == "__main__":
    app.run()