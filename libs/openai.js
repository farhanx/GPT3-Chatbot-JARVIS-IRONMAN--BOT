/*
 * @Description: These functions are used for generating answers from chat gpt3 using its APIs
 * @author Farhan Khan  
 * @date 20-Mar-2023
 * @version 1.0.0
 * @link https://github.com/farhanx
 * @link https://www.linkedin.com/in/farhanhk/
*/

//const openai = require('openai');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config(); // load the .env file


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

//const openaiApiKey = process.env.OPENAI_API_KEY;

//openai.apiKey = openaiApiKey;

async function generateAiText(prompt,callbackFunction) {

    try{

        const openai = new OpenAIApi(configuration);

        console.log("inside AI function");

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
        });
        
        console.log("outside AI function");

        const text = completion.data.choices[0].message;

        console.log(completion.data.choices[0].message);

        callbackFunction(completion.data.choices[0].message);
    }
    catch(error) {
        console.error(error);
        callbackFunction(null, error);
    }

}

module.exports = { generateAiText };