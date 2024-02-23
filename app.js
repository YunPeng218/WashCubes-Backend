const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const body_parser = require('body-parser');
const Order = require('./models/order');

// IMPORT ENVIRONMENT VARIABLES
require('dotenv').config();

// IMPORT API ROUTES
const orderRoutes = require('./routes/orderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const userRoutes = require('./routes/userRoutes');
const lockerRoutes = require('./routes/lockerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const riderRoutes = require('./routes/riderRoutes');
const jobRoutes = require('./routes/jobRoutes');

// EXPRESS APP SETUP
const PORT = 3000;
const app = express();

// DATABASE CONNECTION
mongoose.connect('mongodb+srv://ivantan:ivantan123@cluster0.isivwp4.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Atlas connection error:'));
db.on('open', () => {
    console.log('Connected to MongoDB Atlas.');
});

// SET VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.json());

// API ROUTES
app.get('/', (req, res) => {
    res.send('WashCubes :P');
});
app.use('/', orderRoutes);
app.use('/', serviceRoutes);
app.use('/', userRoutes);
app.use('/', lockerRoutes);
app.use('/', notificationRoutes);
app.use('/', feedbackRoutes);
app.use('/', riderRoutes);
app.use('/', jobRoutes);

// SERVER LISTENING 
app.listen(PORT, () => {
    console.log(`Server is runnning on Port http://localhost:${PORT}`);
})

module.exports = app;