//Function that takes a group of tabs and a name as input and saves them
//into chrome.storage.local
function saveGroup(saved_tabs, gName){

    //Save group under given key
    chrome.storage.local.set({ [gName]: saved_tabs }, function() {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            //Confirmation alert for testing purposes
            alert("GROUP " + gName + " was saved!")
          }
    });
};

/* NO LONGER NECESSARY, KEEPING IT JUST IN CASE, I GUESS
//Function that displays the group of tabs currently saved
function displayGroups(){

    //Retrieves saved group under key "key1"...
    //Will edit in the future to retrieve all groups, no matter the key
    chrome.storage.local.get("Adam's Group", function (result) {
        group = result["Adam's Group"];

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
*/
/*This function retrieves all the saved groups, displays them as <p>
elements, creates buttons for each that can delete the group or open
all tabs in the group, and allows you to click on a single tab to open it
*/
function displayAll(){

    //Retrieve all groups from storage
    chrome.storage.local.get(null, function(items) {
        //This is where we are outputting the groups on our popup
        const container = this.document.querySelector("#group_container");

        //Iterate through each key-value group pair (groupName-group pair)
        for (let key in items) {
            console.log("                 " + key);

            //Create title for group
            var title = document.createElement("h3");
            var titleText = document.createTextNode(key);
            title.appendChild(titleText);

            //Create button to open all tabs in group
            var openButton = document.createElement("button");
            openButton.textContent = "Open all tabs in Group";

            //Store all tabs for specific group
            const groupUrls = [];
            items[key].forEach((tab) => {
                groupUrls.push(tab.url);
            });

            //Use stored tabs to open all when button is clicked
            openButton.addEventListener("click", function(){
                groupUrls.forEach((url) => {
                    chrome.tabs.create({url: url});
                });
            });

            //Create button to delete group
            var delButton = document.createElement("button");
            delButton.textContent = "Delete Group";

            //Use storage remove function to delete group when clicked
            delButton.addEventListener("click", function(){
                chrome.storage.local.remove(key);
                alert("GROUP '" + key + "' HAS BEEN DELETED");
                location.reload();
            });

            //Create list for tabs in group
            var groupList = document.createElement("ul");

            //Iterate through each tab in said group
            items[key].forEach((tab) => {
                console.log(tab.title);

                //Create list item and text for current tab
                const tabElement = document.createElement("li");
                const p = document.createElement("p");
                p.title = tab.url;
                p.innerText = tab.title;

                //Functionality for opening a tab when clicked
                p.addEventListener("click", () => {
                    chrome.tabs.create({url: tab.url});
                })
                //Add paragraph text to list item
                tabElement.appendChild(p);

                //Add list item to list of tabs
                groupList.appendChild(tabElement);
            });

            //In order, add title of group, open button, close button,
            //and list of tabs to the container
            container.appendChild(title);
            container.appendChild(openButton);
            container.appendChild(delButton);
            container.appendChild(groupList);

            //This process is repeated for each group of tabs
        }
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
            tabElement.appendChild(p);
            tabElement.appendChild(button);
            tabs.appendChild(tabElement);
        });

       


    });

    //This is to display all saved/grouped tabs upon startup/load
    displayAll();


});

//This button retrieves current active tabs and saves them using
//saveGroup(). Also reloads the popup to update the saved group
const saveButton = document.getElementById("save");
saveButton.addEventListener("click", function() {
    
    //Retrieve user input for group name
    var groupName = document.getElementById("name").value;

    //Check to make sure user has inputted group name
    if(groupName === ""){
        alert("ERROR: MUST GIVE GROUP A NAME");
        return;
    }

    //Capitalize first letter of group name in order for it to output
    //in alphabetical order
    groupName = groupName.charAt(0).toUpperCase() + groupName.slice(1);

    console.log(groupName);

    //Reset user input textbox
    document.getElementById("name").value = "";

    //Retrieve tabs and store them using saveGroup()
    chrome.runtime.sendMessage({ type: "getTabs"}, function (response){
        saveGroup(response, groupName);
    });

    location.reload();
})