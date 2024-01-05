const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');

// IMPORT ENVIRONMENT VARIABLES
require('dotenv').config();

// IMPORT API ROUTES
const orderRoutes = require('./routes/orderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

// EXPRESS APP SETUP
const PORT = 3000;
const app = express();

// DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Atlas connection error:'));
db.once('open', () => {
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

// API ROUTES
app.get('/', (req, res) => {
    res.send('WashCubes :P');
});
app.use('/', orderRoutes);
app.use('/', serviceRoutes);

// SERVER LISTENING 
app.listen(PORT, () => {
    console.log(`Server is runnning on Port ${PORT}`);
})

