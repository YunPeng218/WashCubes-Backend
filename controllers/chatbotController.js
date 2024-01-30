const ChatbotServices = require('../services/chatbotServices');

exports.handleUserInput = async (req, res, next) => {
  try {
    const userInput = req.body.message;

    // Check if userInput contains any predefined keyword
    const hasKeyword = checkForKeywords(userInput);

    if (hasKeyword) {
      // Handle the predefined scripts based on the presence of a keyword
      const response = await handleKeyword(userInput);
      res.json({ response });
    } else {
      // If no keyword is found, use ChatGPT to generate a response
      const chatGPTResponse = await ChatbotServices.query(userInput);
      res.json({ response: chatGPTResponse });
    }
  } catch (error) {
    console.error('Error handling user input:', error.message);
    res.status(500).json({ response: 'Internal Server Error' });
  }
}

const checkForKeywords = (message) => {
  // Implement logic to check if the message contains any predefined keywords
  const keywords = ['reserve locker', 'create order', 'user guide', 'size guide', 'price'];
  return keywords.some(keyword => message.toLowerCase().includes(keyword));
}

const handleKeyword = (keyword) => {
  // Implement logic to handle predefined scripts
  switch (keyword.toLowerCase()) {
    case 'reserve locker':
      return 'This is the answer for reserve locker.';
    case 'create order':
      return 'This is the answer for create order.';
    case 'user guide':
      return 'This is the answer for user guide.';
    case 'size guide':
      return 'This is the answer for size guide.';
    case 'price':
      return 'This is the answer for price.';
  }
}