/*
 * @Description: This example demonstrate How to use text query to chatgpt3 using text. In the response , interface will recieve a text as an answer or voice which can be heard (Prototype)
 * @author Farhan Hameed Khan  
 * @date 20-Mar-2023
 * @version 1.0.0
 * @link https://github.com/farhanx/chatgpt3bot
 * @link https://www.linkedin.com/in/farhanhk/
*/

$(".medium").change(function(){
    var val = $(".medium:checked").val();
    alert(val);
});

$(document).ready(function () {

    $("form").on("submit", function (event) {
      event.preventDefault(); 
      let value = $("#textstuff").val();
      console.log("input word:"+value)

      const medium = $('input[name="medium"]:checked').val();

      if(medium=="voice") {

        $.ajax({
            type: "POST",
            url:"/jarvisTextQuery",
            contentType:"Application/JSON",
            data: JSON.stringify({quote:value,channel:medium}),
            xhrFields: {
                responseType: 'blob'
            },
            success: function (data) {
              
                const url = URL.createObjectURL(data);
                const audio = new Audio(url);
                audio.play();

            },
            error: function (response) {
                console.log("error response: Error"+response.error)
              },
            
        });

      }
      else
      {
        $.ajax({
          type: "POST",
          url:"/jarvisTextQuery",
          contentType:"Application/JSON",
          data: JSON.stringify({quote:value,channel:medium}),
          success: function (data) {
              console.log(data);
              $("#answer").val($.trim(data));
          },
          error: function (response) {
              console.log("error response: Error"+response.error)
            },
          
      });

      }
    });
});

/*


 $.ajax({
            type: "POST",
            url:"/ajax",
            contentType:"Application/JSON",
            data: JSON.stringify({quote:value}),
            success: function (response) {
                console.log("recieve response: Success"+response.res)
                //alert(res.response)
                $("#output").html(`QUOTE: ${response.res}`)

                const url = URL.createObjectURL(response.res.audiofile);
                const audio = new Audio(url);
                audio.play();

            },
            error: function (response) {
                console.log("error response: Error"+response.error)
              },
            */