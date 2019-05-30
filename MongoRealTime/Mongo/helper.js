const { ReplSet } = require('mongodb-topology-manager');
const mongoose = require('mongoose');

async function run() {
    // await replicaSetCreation();

    const uri = 'mongodb://localhost:27017,localhost:27018,localhost:27109/streamdb?replicaSet=rs0';

    await mongoose.connect(uri, { useNewUrlParser: true });

    // await mongoose.connection.createCollection('Car');

    const carSchema = new mongoose.Schema({
        make: String
    });

    const Car = mongoose.model('Car', carSchema, 'Car');

    let c = await Car.countDocuments();
    console.log('Started with ', c);

    await Car.deleteMany({});

    c = await Car.countDocuments();
    console.log('Ended with', c);

    await mongoose.disconnect();

    return;
}


run();