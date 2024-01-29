const mongoose = require('mongoose');

// DEFINE ENUMS FOR IMPROVEMENT CATEGORIES
const improvementEnum = [
    'Unspecified',
    'Overall Service',
    'Pick Up and Delivery Service',
    'Payment Process',
    'Speed and Efficiency',
    'Order Status Updates',
    'Customer Support'
]

// DEFINE FEEDBACK MODEL
const feedbackSchema = new mongoose.Schema({
    feedbackID: {
        type: String,
        required: true,
        unique: true,
    },
    user: {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    starRating: {
        type: Number,
        min: 1,
        max: 5
    },
    improvementCategories: [{
        type: [String],
        enum: improvementEnum,
        default: ['Unspecified']
    }],
    message: {
        type: String,
    },
    receivedAt: {
        type: Date,
        default: Date.now
    }
});

const FeedbackModel = mongoose.model('feedback', feedbackSchema);

// EXPORT SERVICE MODEL
module.exports = FeedbackModel;