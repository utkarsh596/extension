console.log("connection is live");

let problem_name = document.getElementsByClassName("breadcrumb")[0].children[2].innerHTML;
let problem_id = document.getElementsByClassName("run-details-info")[0].children[1].children[1].children[0].innerHTML;

console.log(problem_id);

const problem = {
name : problem_name,

id : problem_id};

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab,
                  "from the extension");
      if (request.greeting === "hello")
        sendResponse(problem);
    }
  );

  

 