
const FeedbackServices = require('../services/feedbackServices');
const Feedback = require('../models/feedback')

// Generate Feedback ID
const generateFeedbackID = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const FeedbackID = `${timestamp}${random}`;
    return FeedbackID;
};

exports.createFeedback = async (req, res, next) => {
    try {
        const feedbackData = req.body;
        const feedbackID = generateFeedbackID();
        const feedback = await FeedbackServices.saveFeedback(feedbackData, feedbackID);
        res.status(200).json({ feedback });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports.displayFeedbacksForAdmin = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({});
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error('Error retrieving feedbacks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}