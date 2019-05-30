const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const port = process.PORT || 3000;

const app = express();
app.use(cors());

async function connect() {
    const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27109/streamdb?replicaSet=rs0';

    await mongoose.connect(uri, { useNewUrlParser: true });

    await mongoose.connection.createCollection('Car');
}
connect();

const carSchema = new mongoose.Schema({
    make: String
});

const Car = mongoose.model('Car', carSchema, 'Car');

app.get('/', (req, res) => {
    res.send('hello');
})

app.get('/data', async (req, res) => {
    let cars = await Car.find({}, (err, cars) => {
        return cars;
    });
    console.log(typeof (cars));
    console.log(cars);
    res.send(cars);
});

app.get('/data/stream', async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    res.write('\n');

    Car.watch().on('change', (data) => {
        res.write(`event: insert\ndata: ${data.fullDocument.make}\n\n`);
    });
})

app.listen(port, () => {
    console.log('App started');
})