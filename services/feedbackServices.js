const FeedbackModel = require('../models/feedback')

class FeedbackServices {
    static async saveFeedback(feedbackData, feedbackID) {
        try {
            const newFeedback = new FeedbackModel({ ...feedbackData, feedbackID});
            return await newFeedback.save();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FeedbackServices;