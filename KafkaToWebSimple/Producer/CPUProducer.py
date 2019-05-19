#%%
import time
import random
from json import dumps

from kafka import KafkaProducer
import psutil

#%%
kafka_server = ['localhost:9092']
topic = 'os_use'

#%%
producer = KafkaProducer(bootstrap_servers=kafka_server, acks=1, value_serializer=lambda x: dumps(x).encode('utf-8'))

for i in range(100):
    cpu_use = f'{psutil.cpu_percent()}%'
    val = {
        "cpu_percent_use": cpu_use,
        "sent": time.time(),
        "source": "MacDesktop"
    }
    producer.send(topic, val)
    print (f'New message sent {val}')
    time.sleep(random.randint(2, 5))

# TODO Porper Callback