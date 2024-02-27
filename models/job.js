
const mongoose = require('mongoose');
const Order = require('./order');

const jobTypeEnum = [
    'Locker To Laundry Site',
    'Laundry Site to Locker',
];

const jobSchema = new mongoose.Schema({
    jobNumber: {
        type: String,
        unique: true
    },
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rider',
        required: true,
    },
    jobType: {
        type: String,
        enum: jobTypeEnum,
        required: true,
    },
    lockerSite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'locker',
        required: true,
    },
    orders: [Order.schema],
    isJobActive: {
        type: Boolean,
        default: true,
    },
    pickedUpStatus: {
        type: Boolean,
        default: false,
    },
    dropOffStatus: {
        type: Boolean,
        default: false,
    },
    receiverName: {
        type: String
    },
    receiverIC: {
        type: String
    }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;