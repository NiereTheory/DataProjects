#%%
from json import loads
from kafka import KafkaConsumer

#%%
kafka_server = ['localhost:9092']
topic = 'os_use'

#%%
consumer = KafkaConsumer(
    topic,
    bootstrap_servers=kafka_server,
    group_id='real-time-cpu-group',
    value_deserializer=lambda x: loads(x.decode('utf-8'))
)

#%%
for message in consumer:
    print(message.value)