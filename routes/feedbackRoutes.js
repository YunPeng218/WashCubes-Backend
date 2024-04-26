const router = require('express').Router();
const FeedbackController = require('../controllers/feedbackController');

router.post('/createFeedback', FeedbackController.createFeedback);
router.get('/admin/fetchFeedback', FeedbackController.displayFeedbacksForAdmin);

module.exports = router;