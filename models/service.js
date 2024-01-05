
const mongoose = require('mongoose');

// DEFINE UNITS ENUM
const unitsEnum = ['kg', 'pcs', 'set'];

// DEFINE SERVICE MODEL
const serviceSchema = new mongoose.Schema({
    name: String,
    items: [
        {
            name: String,
            unit: { type: String, enum: unitsEnum },
            price: Number,
        },
    ],
});

// EXPORT SERVICE MODEL
const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;