chrome.runtime.onInstalled.addListener(() => {
  console.log("I am installed ", chrome, navigator);
  // navigator.geolocation.getCurrentPosition(function (position) {
  //   console.log(position.coords.latitude);
  //   console.log(position.coords.longitude);
  // });
});

// //Reading Out Consoles
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   // Assuming message.type is 'CONSOLE_LOG'
//   if (message.type === "CONSOLE_LOG") {
//     console.log("Log from the content script:", message.args);

//     // Now, we send this message to the popup
//     chrome.runtime.sendMessage(message);
//   }
// });
