//Function that takes a group of tabs and a name as input and saves them
//into chrome.storage.local
function saveGroup(saved_tabs, gName){
    //Save group under given key
    chrome.storage.local.set({ [gName]: saved_tabs }, function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            alert("RUNTIME ERROR: GROUP NOT SAVED")
        } else {
            //Confirmation alert for testing purposes
            alert("GROUP '" + gName + "' was saved!")
        }
    });
};

//This code is ran every time the default popup is opened/loaded
window.addEventListener("DOMContentLoaded", function(){

    //Message sent to all pages, background.js picks it up and
    //sends back all open tabs
    chrome.runtime.sendMessage({ type: "getTabs"}, function (response){
        
        //Iterate for each tab
        response.forEach((tab) => {

            //Retrieve label for popup's tab ordered list
            const tabs = this.document.querySelector("#ext_tabs");
           
            //Create list item/paragraph objects to place into list
            const tabElement = document.createElement("li");
            const p = document.createElement("p");
            const check = document.createElement("input");

            check.setAttribute("type", "checkbox");

            //Make the text equal to the tab's title
            p.innerText = tab.title;
            p.title = tab.url;

            //Create button for closing tab
            const button = document.createElement("button");

            //Highlight's the current active tab
            if(tab.active){

                tabElement.classList.add("active");

            }

            //Remove tab from the current open tabs if close button is
            //clicked
            button.addEventListener("click", function(){
                chrome.tabs.remove(tab.id,);
                tabElement.remove();
            });

            //Make the clicked tab the current active tab
            p.addEventListener("click", function (){
                chrome.tabs.update(tab.id, {active: true});

            });
            button.innerText = "Close Tab";

            //Add text and button to tab element, add tab element to list
            tabElement.appendChild(check);
            tabElement.appendChild(p);
            tabElement.appendChild(button);
            tabs.appendChild(tabElement);
        });

       


    })


});

//This button retrieves current active tabs and saves them using
//saveGroup(). Also reloads the popup to update the saved group
const saveButton = document.getElementById("save");
saveButton.addEventListener("click", async function() {
    //Retrieve user input for group name
    var groupName = document.getElementById("name").value;

    //Check to make sure user has inputted group name
    if(groupName === ""){
        alert("ERROR: MUST GIVE GROUP A NAME");
        return;
    }

    //Check to make sure group name is not already used
    let dup = await new Promise((resolve) => {
        chrome.storage.local.get(null, function(items) {
          if(groupName in items){
              resolve(1);
          } else {
              resolve(0);
          }
        });
      });
    
    if(dup === 1){
        alert("ERROR: GROUP NAME ALREADY USED. PICK NEW NAME");
        return;
    }

    //Capitalize first letter of group name in order for it to output
    //in alphabetical order
    groupName = groupName.charAt(0).toUpperCase() + groupName.slice(1);

    //Reset user input textbox
    document.getElementById("name").value = "";

    //Retrieve tabs and store them using saveGroup()
    chrome.runtime.sendMessage({ type: "getTabs"}, function (response){
        saveGroup(response, groupName);
    });

    //location.reload();
})

//New Button that navigates to second page
const pageButton = document.getElementById('page2');
pageButton.addEventListener('click', function() {
    chrome.extension.getViews({type: 'popup'}).forEach(function(view) {
        view.location.href = 'saved.html';
      });
});