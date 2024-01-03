const express = require('express');
const mongoose = require('mongoose');

// REQUIRE ENVIRONMENT VARIABLES
require('dotenv').config();

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

// API ROUTES
app.get('/', (req, res) => {
    res.send('Hello :)');
});

// SERVER LISTENING 
app.listen(PORT, () => {
    console.log(`Server is runnning on Port ${PORT}`);
})

