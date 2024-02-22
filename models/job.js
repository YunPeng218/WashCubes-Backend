
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
        riderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'rider',
            required: true,
        }
    },
    jobType: {
        type: String,
        enum: jobTypeEnum,
        required: true,
    },
    locker: {
        lockerSiteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'locker',
            required: true,
        },
    },
    orders: [Order.schema],
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;