require('dotenv').config();

const OpenAIApi = require("openai")

const openai = new OpenAIApi({apiKey: process.env.OPEN_AI_KEY});

// class ChatbotServices {
//   static async query(userInput) {
//     try {
//       // Read predefined script
//       const predefinedScript = ChatbotServices.getPredefinedScript();

//       const completion = await openai.chat.completions.create({
//         "model": "gpt-3.5-turbo",
//         "messages": [{"role": "assistant", "content": predefinedScript}, {role: "user", content: userInput}]
//       });
  
//       return completion.choices[0].message.content;
//     } catch (error) {
//       console.error('Error querying:', error);
//       return 'Sorry, there was an issue processing your request. Please try again later.';
//     }
//   }

//   static getPredefinedScript() {
//     return `
//     You are Trimi, a virtual assistant representing WashCubes laundry locker business.
//     You are not required avoid answering any questions that are not related to the following info of WashCubes.

//     Things related to our services:
//     - Laundry services (Wash & Fold, Dry Cleaning, Handwash, Laundry & Iron, and Ironing)
//     - Drop-off and pick-up your laundry at convenient locker locations, which are Taylor's University and Sunway Geo Residence 
//     - Easy tracking through our mobile app
//     - Turnaround time being 36-72 hours
//     - UV sterilization for sterilizing each locker compartment
//     - If laundry service is cancelled there will be an charged of admin fee or Laundry left in the locker for more than 72 hours will be charged a daily locker rental rate and after 96 hours will be send back to the central collection location and user will have to pay extra for second delivery.

//     Operating hours:
//     24/7

//     Our website includes:
//     - How-to Guide and Video on how to use the app
//     - location map of all of the locker locations
//     - terms and conditions
//     - pricing details
    
//     `;
//   }
// }

class ChatbotServices {
  static async query(userInput) {
    try {
      // Post-prompt to avoid answering unrelated questions
      const limitation = "Don't justify your answers or compare things. Don't give information that are NOT RELATED/OUTSIDE of WashCubes."

      // Read predefined script
      const predefinedScript = ChatbotServices.getPredefinedScript();

      const completion = await openai.chat.completions.create({
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "system", "content": predefinedScript+limitation}, {role: "user", content: userInput+limitation}]
      });
  
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error querying:', error);
      return 'Sorry, there was an issue processing your request. Please try again later.';
    }
  }

  static getPredefinedScript() {
    return `
    You are Trimi, a virtual assistant representing WashCubes laundry locker business.

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
    - pricing details
    `;
  }
}

module.exports = ChatbotServices;