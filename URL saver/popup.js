let sampleUrls = {
    group1: ["https://www.example.com/", "https://www.example.com/page1", "https://www.example.com/page2"],
    group2: ["https://www.example.com/page3", "https://www.example.com/page4", "https://www.example.com/page5"]
  };

function saveUrls() {
  chrome.storage.sync.set({ "urls": sampleUrls }, function() {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    } else {
      console.log("URLs saved successfully");
    }
  });
}

function displayUrls() {
  chrome.storage.sync.get("urls", function (result) {
    var urls = result.urls;
    var outputDiv = document.getElementById("output");
    outputDiv.innerHTML = JSON.stringify(urls);
  });
}


document.getElementById("saveButton").addEventListener("click", saveUrls);
document.getElementById("displayButton").addEventListener("click", displayUrls);
