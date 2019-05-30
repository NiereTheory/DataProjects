const { ReplSet } = require('mongodb-topology-manager');
const mongoose = require('mongoose');

async function run() {
    await replicaSetCreation();

    const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27109/streamdb?replicaSet=rs0';

    await mongoose.connect(uri, { useNewUrlParser: true });

    await mongoose.connection.createCollection('Car');

    const carSchema = new mongoose.Schema({
        make: String
    });

    const Car = mongoose.model('Car', carSchema, 'Car');

    car_makes = ['Toyota', 'Mercedes', 'BMW', 'Tesla', 'Audi']
    while (true) {
        // await sleep(Math.floor(Math.random() * 2 + 1));
        await sleep(2);
        rand_make_int = Math.floor(Math.random() * car_makes.length);

        car = {
            "make": car_makes[rand_make_int]
        }

        Car.create(car);
        console.log(car, 'produced');
    }
}

async function replicaSetCreation() {
    const host = 'localhost';

    const replSet = new ReplSet('mongod', [
        { options: { port: 27017, dbpath: `./data/db/27017`, bind_ip: host } },
        { options: { port: 27018, dbpath: `./data/db/27018`, bind_ip: host } },
        { options: { port: 27019, dbpath: `./data/db/27019`, bind_ip: host } }
    ], { replSet: 'rs0' });

    let result = await replSet.discover();
    console.log(result);
    await replSet.purge();
    await replSet.start();
    console.log('replica set created');
}

function sleep(sec) {
    return new Promise((resolve) => setTimeout(resolve, sec * 1000));
}

run();