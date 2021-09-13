console.log("Background is running");


function sendMessagetToGetInfo(url, id, xcsrf){

  chrome.tabs.query({url: "https://www.codechef.com/*/submit/*",active:true,currentWindow:true}, function(tabs) {

    console.log(tabs);
    var problem_details = {};
    var problem_url = url;
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {

      console.log('preoblem details', response);

      problem_details = response;
      //  console.log("problem_details ", problem_details);
      checkResult(url, id, xcsrf, problem_details, problem_url);

    });

    });

}

function checkResult(url, id, xcsrf, problem_details, problem_url){
  $.ajax({
 
    url: url,

    dataType: "json",

    headers: {
      "x-csrf-token" : xcsrf
    },

    success: function(data, status, XHR){
        console.log(status, data.result_code);

        if(data.result_code == "wait"){
          checkResult(url, id, xcsrf, problem_details, problem_url);
        }
        else{
           var notify_details  = {
            type: "list",
            title: "Problem Name: "+problem_details.name+".",
            message: "Verdict: "+data.result_code+".",
            iconUrl: "logo.jpg",
            items: [{title: "Verdict: ", message: ""+data.result_code+""},
                    { title: "Id: ", message: ""+problem_details.id+""},
                    { title: "Time: ", message: ""+data.time+""}]
           }

           chrome.notifications.create("Hello , you have a notification here", notify_details,
              function(details){ console.log(details); }
            )

        }

    },
    error: function(XHR, status, error){
      console.log(error, status, XHR);
    }
});
}



chrome.webRequest.onBeforeSendHeaders.addListener((details) =>{

    const url = new URL(details.url);
    // console.log(url);
   

    if(url.search.length > 0){
    
    
      let id = url.searchParams.get('solution_id');
      let xcsrf =  details.requestHeaders[2].value;

      var store={};
      store[id]=id;
    
            
      chrome.storage.sync.get(id,function(key_values){
     
        if(Object.keys(key_values).length==0)
        {
          chrome.storage.sync.set(store, function() {

            console.log('Value is now set to ' + id);
            
          });
          sendMessagetToGetInfo(url, id, xcsrf);
        }
      })
    }
},
{
    urls : ["https://www.codechef.com/api/ide/submit*"],
    types : ["xmlhttprequest"]
},
["requestHeaders"]);