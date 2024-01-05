
const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('../models/order');

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
        await Order.deleteMany({});
        console.log('Deletion complete.');
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
}

// RUN THE SCRIPT
eraseAllOrders();