
const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('../models/order');
const Locker = require('../models/locker');

// DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Atlas connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas.');
});

// ERASE ALL ORDERS IN DATABASE
const eraseAllOrders = async () => {
    try {
        const ordersToDelete = await Order.find({});
        for (const order of ordersToDelete) {
            const locker = await Locker.findById(order.locker.lockerSiteId);
            if (!locker) throw new Error('Locker site not found.');

            const compartment = locker.compartments.find(compartment => compartment._id.toString() === order.locker.compartmentId);
            if (!compartment) throw new Error('Compartment not found.');

            compartment.isAvailable = true;
            await locker.save();

            await Order.findOneAndDelete({ _id: order._id });
        }
        console.log('Deletion complete.');
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
}

// RUN THE SCRIPT
eraseAllOrders();