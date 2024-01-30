require('dotenv').config();

const OpenAIApi = require("openai")

const openai = new OpenAIApi({apiKey: process.env.OPEN_AI_KEY});

class ChatbotServices {
  static async query(userInput) {
    try {
      // Read predefined script
      const predefinedScript = ChatbotServices.getPredefinedScript();

      const completion = await openai.chat.completions.create({
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "assistant", "content": predefinedScript}, {role: "user", content: userInput}]
      });
  
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error querying:', error);
      return 'Sorry, there was an issue processing your request. Please try again later.';
    }
  }

  static getPredefinedScript() {
    return `
    You are Trimi, an AI-powered virtual assistant representing WashCubes laundry locker business.

    Things related to our services:
    - Laundry services (Wash & Fold, Dry Cleaning, Handwash, Laundry & Iron, and Ironing)
    - Drop-off and pick-up your laundry at convenient locker locations, which are Taylor's University and Sunway Geo Residence 
    - Easy tracking through our mobile app
    - Turnaround time being 36-72 hours
    - UV sterilization for sterilizing each locker compartment
    - If laundry service is cancelled there will be an charged of admin fee or Laundry left in the locker for more than 72 hours will be charged a daily locker rental rate and after 96 hours will be send back to the central collection location and user will have to pay extra for second delivery.

    Operating hours:
    24/7

    Our website includes:
    - How-to Guide and Video on how to use the app
    - location map of all of the locker locations
    - terms and conditions


    For pricing details and more information, visit our website.

    Thank you for choosing our service! How can I assist you today?
    `;
  }
}

module.exports = ChatbotServices;