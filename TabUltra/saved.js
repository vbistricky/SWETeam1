function displayAll(){
    
    //Retrieve all groups from storage
    chrome.storage.local.get(null, function(items) {
        //This is where we are outputting the groups on our popup
        const container = this.document.querySelector("#group_containernew");
       
        //Iterate through each key-value group pair (groupName-group pair)
        for (let key in items) {
            console.log("                 " + key);

            //Styling for linebreak
            const linebreak = document.createElement("br"); 

            //Creating title for each Group
            var field = document.createElement("h4"); 
            field.textContent += "Group Name:"; 
                //styling for field group
                field.style.color = 'rgb(109, 122, 221)';
                field.style.display = 'inline'; 

            //Create title for group
            var title = document.createElement("h3");
            var titleText = document.createTextNode(key);
            title.appendChild(titleText);
                //Styling for Title
                title.style.display = 'inline'; 
                title.style.position = 'relative'; 
                title.style.left = '5px'; 
            

            //Create button to open all tabs in group
            var openButton = document.createElement("button");
            openButton.textContent = "Open all tabs ";
                //styling for open all
                openButton.style.position = 'relative'; 
                openButton.style.left = '55px';

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
                //styling for delete button
                delButton.style.position = 'relative'; 
                delButton.style.left = '65px';
                delButton.style.backgroundColor = 'red';

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
                const check = document.createElement("input");

                check.setAttribute("type", "checkbox");

                p.title = tab.url;
                p.innerText = tab.title;

                //Functionality for opening a tab when clicked
                p.addEventListener("click", () => {
                    chrome.tabs.create({url: tab.url});
                })

                //Add checkbox to list item
                tabElement.appendChild(check);

                //Add paragraph text to list item
                tabElement.appendChild(p);

                //Add list item to list of tabs
                groupList.appendChild(tabElement);
            });

            //In order, add title of group, open button, close button,
            //and list of tabs to the container
            container.appendChild(field); 
            container.appendChild(title);
            container.appendChild(groupList);
            container.appendChild(openButton);
            container.appendChild(delButton);
            container.appendChild(linebreak);
           

            

            
            

            //This process is repeated for each group of tabs
        }
    });
}

//This code is ran every time the secondary popup is opened/loaded
document.addEventListener("DOMContentLoaded", function(){

    //This is to display all saved/grouped tabs upon startup/load
    displayAll();


});

//New Button that navigates to first page
const pageButton = document.getElementById('tabsPage');
pageButton.addEventListener('click', function() {
    chrome.extension.getViews({type: 'popup'}).forEach(function(view) {
        view.location.href = 'popup.html';
      });

});

