/*
 * @Description: These functions are used for converting sounds to text using google cloud Speech-to-Text APIS
 * @author Farhan Khan  
 * @date 20-Mar-2023
 * @version 1.0.0
 * @link https://github.com/farhanx
 * @link https://www.linkedin.com/in/farhanhk/
*/

const { SpeechClient } = require('@google-cloud/speech');
const fs = require('fs');

// Creates a client
const speechClient = new SpeechClient();

async function transcribeAudio(filePath) {
  // Read the audio file
  const audioContent = fs.readFileSync(filePath).toString('base64');

  // Configure the request
  const request = {
    audio: {
      content: audioContent,
    },
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'en-US',
    },
  };

  // Detects speech in the audio file
  const [response] = await speechClient.recognize(request);

  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');

  console.log(`Transcription: ${transcription}`);

  return transcription;
}

module.exports = { transcribeAudio };