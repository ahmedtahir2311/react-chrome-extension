chrome.runtime.onInstalled.addListener(() => {
  console.log("I am installed ", chrome, navigator);
});
// chrome.browserAction.onClicked.addListener(() => {
//   console.log("Extension Clicked");
// });

//Reading Out Consoles
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Assuming message.type is 'CONSOLE_LOG'
  if (message.type === "CONSOLE_LOG") {
    console.log("Log from the content script:", message.args);
    // Storage of Console Log will be happen here
    // chrome.runtime.sendMessage(message);
  } else if (message.type === "CONSOLE_ERROR") {
    console.log("ERROR from the content script:", message.args);
    // Storage of Console Log will be happen here
    // chrome.runtime.sendMessage(message);
  } else if (message.type === "CONSOLE_WARN") {
    console.log("WARN from the content script:", message.args);
    // Storage of Console Log will be happen here
    // chrome.runtime.sendMessage(message);
  }
});
