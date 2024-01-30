const router = require('express').Router();
const ChatbotController = require('../controllers/chatbotController');

router.route('/chatbot').post(ChatbotController.handleUserInput);

module.exports = router;