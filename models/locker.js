
const mongoose = require('mongoose');

const sizeEnums = ['Small', 'Medium', 'Large', 'Extra Large'];

// LOCKER COMPARTMENT SCHEMA
const lockerCompartmentSchema = new mongoose.Schema({
    compartmentNumber: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        enum: sizeEnums,
        required: true,
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

// LOCKER TERMINAL SCHEMA
const lockerSiteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number], // [Longitude, Latitude]
            required: true,
        },
    },
    compartments: [lockerCompartmentSchema],
});

const Locker = mongoose.model('Locker', lockerSiteSchema);
module.exports = Locker;