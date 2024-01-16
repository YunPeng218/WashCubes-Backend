
const mongoose = require('mongoose');

// DEFINE SCHEMA FOR EACH ORDER ITEM
const orderItemSchema = new mongoose.Schema({
    name: String,
    unit: String,
    price: Number,
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    cumPrice: {
        type: Number,
    }
});

// DEFINE ENUMS FOR ORDER STATUS
const statusEnum = ['Pending Pick Up',
    'Picked Up',
    'Arrived at Laundry Site',
    'Pending Verification',
    'Processing',
    'Departed from Laundry Site',
    'Ready for Collection',
    'Completed',
    'Order Error'];

// DEFINE SCHEMA FOR ORDER
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    user: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
        }
    },
    locker: {
        lockerSiteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Locker',
        },
        compartmentId: {
            type: String,
        },
        compartmentNumber: {
            type: String,
        }
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    orderItems: [orderItemSchema],
    estimatedPrice: {
        type: Number,
        default: function () {
            return this.orderItems.reduce((total, item) => total + item.quantity * item.price, 0);
        },
        min: 0,
    },
    orderStatus: {
        type: String,
        enum: statusEnum,
        default: 'Pending Pick Up'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// EXPORT ORDER MODEL
const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
