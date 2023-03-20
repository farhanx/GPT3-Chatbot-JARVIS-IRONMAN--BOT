const express = require('express')
const mylibrary = require('./libs/textspeechUtility');

const bodyParser = require('body-parser')
const axios = require('axios');
const path = require('path');
const { generateAiText } = require('./libs/openai');
//const ConvertStream = require('./libs/speechtextsUtility');
const { transcribeAudio } = require('./libs/speechtextsUtility');
const multer = require('multer');


require("dotenv").config()

const fs = require('fs')
const util = require('util')
const filePathMp3 = path.join(__dirname, '\\output\\'); 

const app = express()
app.set("view engine","ejs")
console.log("Just started")

app.use('/output',express.static('output'))
app.use('/js',express.static('js'))
app.use('/img',express.static('img'))
app.use('/',express.static('favicon.ico'))
app.use('/img/3d',express.static('3d'))




app.use(bodyParser.json())

app.get("/",(req,res)=>{
console.log("Inside");
res.render("jarvis_speak_query_3dbot_view")
});


app.get("/3dtest",(req,res)=>{
  console.log("Inside 3d");
  res.render("3dface",{myvar:"this is a test"})
});
  
// PAGE VIEW: SEND A SOUND QUERY AND GET RESPONSE IN SOUND PAGE WITH WEBGL 3D PERSON *************************************************

app.get("/jarvisBotQuery",(req,res)=>{
  console.log("Inside 3d");
  res.render("jarvis_speak_query_3dbot_view",{myvar:"this is a test"})
});

// PAGE VIEW: OPEN A TEXT QUERY AND GET RESPONSE IN SOUND PAGE *************************************************
app.route("/jarvisTextQuery").get(function(req,res){
    res.render("jarvis_text_query_view",{quote:"It is amazing"})
});

// POST RESPONSE: RECEIVE TEXT QUERY AND RESPOND IN SOUND *************************************************
app.route("/jarvisTextQuery").post(function(req,res){

  try{
  
    // get textual input from the user
    const inpTextdata = req.body.quote;
    const channel = req.body.channel;
    console.log("serverside input:"+inpTextdata+" channel"+channel);

    //generate the answer from the chatgpt3 AI 
    generateAiText(inpTextdata,(textAiOutput,error)=>{

      //if any issue happened in calling chatgpt3 ai just show the error
      if (error) {
        res.status(500).send('Internal server error came in calling chatgpt3 apis');
      } 
      else 
      {
        console.log("AI="+textAiOutput.content);

        //recieve the output text from the chatgpt3 ai and convert that into an mp3 file
        mylibrary.convertTextToMp3(textAiOutput.content,(mp3File, error) => {
    
          //if any problem arrives show this error
          if (error) {
            res.status(500).send('Internal server error in text to speech conversion');
          } 
          else 
          {
            // save the generated mp3 file as an answer 
            const outputPath = filePathMp3+ mylibrary.getTimestampInSeconds()+'_audio.mp3';
            fs.writeFile(outputPath, mp3File, (error) => {
              if (error) {
                console.error(error);
                res.status(500).send('Internal server error in saving mp3 file to the server');
              } 
              else {
                // Set the Content-Disposition header to force a download
                res.set('Content-Disposition', 'attachment; filename="audio.mp3"');
    
                // Send the audio file back to the client
                if(channel=="voice")
                    res.status(200).send(mp3File);
                else
                    res.status(200).send(textAiOutput.content);

              }
            });        
          }  
        });
      }
    });
  }
  catch (error) 
  {
    console.error(error);
    res.status(500).send('Internal server error');
  }
  
});



//File upload multer

const upload = multer({ 
  dest: 'uploads/',
  fileFilter: function (req, file, cb) {
    
    console.log(file.originalname);
    if (path.extname(file.originalname) !== '.webm') {
      return cb(new Error('Only webm files are allowed'))
    }
    cb(null, true)
  }
});

// PAGE VIEW: SEND SOUND QUERY TO GET CHATGPT ANSWER IN SOUND  *************************************************

app.route("/jarvisSoundQuery").get(function(req,res){

  res.render("jarvis_speak_query_view",{quote:"It is amazing"})

});

app.use(bodyParser.json());

// POST RESPONSE:  SEND SOUND QUERY TO GET CHATGPT ANSWER IN SOUND  *************************************************

app.post('/jarvisSoundQuery', async (req, res) => {
  console.log("recieved data");

  const file = fs.createWriteStream('uploads/audio.webm');
  req.pipe(file);

  file.on('finish', function() {
    console.log("File uploaded successfully!");
      
      transcribeAudio('uploads/audio.webm').then(transcription => {

            console.log("Converted Recieved Transcript:"+transcription)

            if(transcription.length > 0)
            {

                //generate the answer from the chatgpt3 AI 
                generateAiText(transcription,(textAiOutput,error)=>{

                  //if any issue happened in calling chatgpt3 ai just show the error
                  if (error) {
                    res.status(500).send('Internal server error came in calling chatgpt3 apis');
                  } 
                  else 
                  {
                    console.log("AI="+textAiOutput.content);

                    //recieve the output text from the chatgpt3 ai and convert that into an mp3 file
                    mylibrary.convertTextToMp3(textAiOutput.content,(mp3File, error) => {
                
                      //if any problem arrives show this error
                      if (error) {
                        res.status(500).send('Internal server error in text to speech conversion');
                      } 
                      else 
                      {
                        // save the generated mp3 file as an answer 
                        const outputPath = filePathMp3+ mylibrary.getTimestampInSeconds()+'_audio.mp3';
                        fs.writeFile(outputPath, mp3File, (error) => {
                          if (error) {
                            console.error(error);
                            res.status(500).send('Internal server error in saving mp3 file to the server');
                          } 
                          else {
                            // Set the Content-Disposition header to force a download
                            res.set('Content-Disposition', 'attachment; filename="audio.mp3"');
                
                            // Send the audio file back to the client
                            res.status(200).send(mp3File);
                          }
                        });        
                      }  
                    });
                  }
                });
            }
            else
            {

            }
     //   res.send(transcription);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error transcribing audio file');
      });
  });

});


app.listen("40001")
