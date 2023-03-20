/*
 * @Description: These functions are used for converting text to mp3 sound using google cloud Text-to-Speech APIS
 * @author Farhan Khan  
 * @date 20-Mar-2023
 * @version 1.0.0
 * @link https://github.com/farhanx
 * @link https://www.linkedin.com/in/farhanhk/
*/

const path = require('path');
const textToSpeech = require('@google-cloud/text-to-speech');

const client = new textToSpeech.TextToSpeechClient() 

async function convertTextToMp3(mytext,callbackFunction) {

   try{
    
        const request = {
            input:{text:mytext},
            voice:{languageCode:'en-US',ssmlGender:"NEUTRAL"},
            audioConfig:{audioEncoding:"MP3"},
        }

        const [response] = await client.synthesizeSpeech(request);


        // Pass the MP3 file back to the callback function
        callbackFunction(response.audioContent);
      }
      catch(error) {
        console.error(error);
        callbackFunction(null, error);
      }
}


function getTimestampInSeconds () {
    return Math.floor(Date.now() / 1000)
}

module.exports = {
    convertTextToMp3, getTimestampInSeconds
}