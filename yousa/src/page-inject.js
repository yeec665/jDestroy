if (document.getElementById("extensionURL") == null) {
    var documentBody = document.getElementsByTagName("body")[0];
    var item = document.createElement("div");
    item.id = "extensionURL";
    item.setAttribute("title", browser.extension.getURL(""));
    documentBody.appendChild(item);
    item = document.createElement("script");
    item.setAttribute("type", "text/javascript");
    item.setAttribute("src", browser.extension.getURL("src/main-play.js"));
    documentBody.appendChild(item);
    item = document.createElement("link");
    item.setAttribute("rel", "stylesheet");
    item.setAttribute("type", "text/css");
    item.setAttribute("href", browser.extension.getURL("src/game.css"));
    documentBody.appendChild(item);
    console.log("page injected");
}