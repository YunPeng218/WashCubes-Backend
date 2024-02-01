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
  return keywords.some(keyword => message.toLowerCase() === keyword.toLowerCase());
}

const handleKeyword = (keyword) => {
  // Implement logic to handle predefined scripts
  switch (keyword.toLowerCase()) {
    case 'reserve locker':
      return 'Unfortunately, this service is currently unavailable. Please stay tuned for future updates.';
    case 'create order':
      return 'To create an order, simply navigate to the order page of the app and press the "Create" button.';
    case 'user guide':
      return 'How-to Guide and Video on how to use the app are able to be found on our website.';
    case 'size guide':
      return 'Size guide are available on our website.';
    case 'price':
      return 'Pricing details are available on our website.';
  }
}