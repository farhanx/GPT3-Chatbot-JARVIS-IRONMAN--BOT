/** 
 * @description: This example demonstrate how user can use his webpage to send a question using microphone and recieve answer in sound from the chatgpt3 
 * @author Farhan Hameed Khan  
 * @date 20-Mar-2023
 * @version 1.0.0
 * @link https://github.com/farhanx/chatgpt3bot
 * @link https://www.linkedin.com/in/farhanhk/
**/

let recorder;
let chunks = [];
let audioBlob;
let audioUrl;
var constraints = { audio: true };
var audioDevicesSelectFromControl = $('#audio-input-devices');


const enumerateDevices = () => {


    //enum all devices and display in the select box for the user in case he has more than one devices
    navigator.mediaDevices.enumerateDevices().then(devices => 
    {
        console.log("Enum devices");

            const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
          //  const select = $('#audio-input-devices');
            audioDevicesSelectFromControl.empty();
            
            for (const device of audioInputDevices) {
                audioDevicesSelectFromControl.append($('<option>', { value: device.deviceId }).text(device.label));
            }

            if (audioInputDevices.length === 0) {
                audioDevicesSelectFromControl.append($('<option>').text('No Audio Input Devices Found').prop('disabled', true));
                 $('#start-recording').prop('disabled', true);
      } 
      else {
              $('#start-recording').prop('disabled', false);
      }
    }).catch(error => {
      console.error(error);
    });
};

const startRecording = () => {

  // make sure your user selects the right audio driver before recording the voice.
  console.log("Recorded Device Id:"+audioDevicesSelectFromControl.val());
  console.log(" Recorded Device Label:"+ audioDevicesSelectFromControl.find(":selected").text());

  constraints.audio = { deviceId: { exact: audioDevicesSelectFromControl.val() } };


  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      recorder = new MediaRecorder(stream);
      recorder.addEventListener('dataavailable', (event) => {
        chunks.push(event.data);
      });

      recorder.addEventListener('stop', () => {
        audioBlob = new Blob(chunks, { type: 'audio/webm' });
        audioUrl = URL.createObjectURL(audioBlob);
        $('#audio-player').html(`<audio src="${audioUrl}" controls></audio>`);
        $('#start-recording').prop('disabled', false);
        $('#stop-recording').prop('disabled', true);
        $('#loadingmessage').show();

        chunks = [];
        $.ajax({
          url: '/jarvisSoundQuery',
          method: 'POST',
          data: audioBlob,
          processData: false,
          contentType: false,
          xhrFields: {
            responseType: 'blob'
          },
          success: (response) => {

            const transcript = response;

            const url = URL.createObjectURL(transcript);
            const audio = new Audio(url);
            audio.play();
            $('#loadingmessage').hide();


            // console.log("converted Speech to Text Recieve: "+transcript);
          },
          error: (xhr, status, error) => {
            console.error(error);
          },
        });
      });
      recorder.start();
      $('#start-recording').prop('disabled', true);
      $('#stop-recording').prop('disabled', false);
    })
    .catch((error) => {
      console.error(error);
    });
};

const stopRecording = () => {
  recorder.stop();
};


 // Get sound and Audio permission from the browser
 navigator.mediaDevices.getUserMedia({ audio: true, sound:true })
 .then(function(stream) {
   console.log('Mic permission are available 100%')
   enumerateDevices();

 })
 .catch(function(err) {
   console.log('No mic permission to record, check your settings.')
});


// Check if mic permission is available then enum all audio devices
navigator.permissions.query({name: 'microphone'}).then(function (result) {
    if (result.state == 'granted') {
        console.log("granted microphone");
    } else if (result.state == 'prompt') {
        console.log("prompted microphone");

    } else if (result.state == 'denied') {
        console.log("denied microphone");

    }
    result.onchange = function () {

        console.log("change in permission");

    };
  });


//$('#audio-input-devices').on('change', enumerateDevices);

$('#start-recording').on('click', startRecording);
$('#stop-recording').on('click', stopRecording);