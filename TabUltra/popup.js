//Function that takes a group of tabs as input and saves them
//into chrome.storage
function saveGroup(saved_tabs){

    //Save group under arbitrary key "key1"...
    //Will edit to store with specified keys once multi-group
    //functionality is implemented
    chrome.storage.local.set({ "key1": saved_tabs }, function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            //Confirmation alert for testing purposes
            alert("GROUP SAVED")
          }
    });
};

//Function that displays the group of tabs currently saved
function displayGroups(){

    //Retrieves saved group under key "key1"...
    //Will edit in the future to retrieve all groups, no matter the key
    chrome.storage.local.get("key1", function (result) {
        group = result.key1;

        //Iterate through group
        group.forEach((tab, index) => {
            //List items will be placed in "grouped_tabs" unordered list
            const tabs = this.document.querySelector("#grouped_tabs");

            //Create list item/paragraph objects to place into list
            const tabElement = document.createElement("li");
            const p = document.createElement("p");

            //Make the text equal to the tab's title
            p.innerText = tab.title;

            //Append list item into unordered list
            tabElement.appendChild(p);
            tabs.appendChild(tabElement);
        });
    });
}

//This code is ran every time the extension popup is opened/loaded
window.addEventListener("DOMContentLoaded", function(){

    //Message sent to all pages, background.js picks it up and
    //sends back all open tabs
    chrome.runtime.sendMessage({ type: "getTabs"}, function (response){
        
        //Iterate for each tab
        response.forEach((tab, index) => {

            //Retrieve label for popup's tab ordered list
            const tabs = this.document.querySelector("#ext_tabs");
           
            //Create list item/paragraph objects to place into list
            const tabElement = document.createElement("li");
            const p = document.createElement("p");

            //Make the text equal to the tab's title
            p.innerText = tab.title;

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
            tabElement.appendChild(p);
            tabElement.appendChild(button);
            tabs.appendChild(tabElement);
        });

       


    });

    //This is to display all saved/grouped tabs upon startup/load
    displayGroups();


});

//This button retrieves current active tabs and saves them using
//saveGroup(). Also reloads the popup to update the saved group
const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function() {
    chrome.runtime.sendMessage({ type: "getTabs"}, function (response){
        saveGroup(response);
    });

    location.reload();
})