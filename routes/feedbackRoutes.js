const router = require('express').Router();
const FeedbackController = require('../controllers/feedbackController');

router.post('/createFeedback', FeedbackController.createFeedback);

module.exports = router;