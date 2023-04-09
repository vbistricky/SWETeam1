window.addEventListener("DOMContentLoaded", function(){
    

    let allTabs = [];

    chrome.runtime.sendMessage({ type: "getTabs"}, function (response){

        allTabs = response;
        response.forEach((tab, index) => {
            const tabs = this.document.querySelector("#ext_tabs");
           
            const tabElement = document.createElement("li");
            const p = document.createElement("p");
            p.innerText = tab.title;
            const button = document.createElement("button");
            if(tab.active){

                tabElement.classList.add("active");

            }
            button.addEventListener("click", function(){
                chrome.tabs.remove(tab.id,);
                tabElement.remove();
            });
            p.addEventListener("click", function (){
                chrome.tabs.update(tab.id, {active: true});

            });
            button.innerText = "Close Tab";
            tabElement.appendChild(p);
            tabElement.appendChild(button);
            tabs.appendChild(tabElement);
        });

       


    });





});