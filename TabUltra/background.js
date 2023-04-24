chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){

    if(request.type === "getTabs"){

        chrome.tabs.query({}, function (tabs){
            sendResponse(tabs);

        })


    }
    
    return true;

})
if (chrome && chrome.storage) {
    console.log("chrome.storage API is available");
  } else {
    console.log("chrome.storage API is not available");
  }