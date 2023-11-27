import { record } from "rrweb";

// content.js
function injectScript(file, node) {
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", file);
  th.appendChild(s);
  console.log("injection Running");
}

// const injectModal = async (path, node) => {
//   try {
//     const app = document.createElement("div");
//     app.id = "react-modal";
//     document.body.append(app);

//     // const src = chrome?.runtime?.getURL("modal.js");
//     // await import(src);
//   } catch (error) {
//     console.log("Error loading modal", error);
//   }
// };

injectScript(chrome.runtime.getURL("inject.js"), "body");
// injectScript(chrome.runtime.getURL("rrweb-inject.js"), "body");
// injectModal(chrome.runtime.getURL("modal.js"), "body");
// record({
//   emit(event) {
//     // Send each recorded event to the background script
//     console.log("event in content.js", event);
//     chrome.runtime.sendMessage({ type: "RECORD_EVENT", event: event });
//   },
// });
// Listen for messages from the inject.js script
window.addEventListener("message", async (event) => {
  // Only accept messages from the same frame
  if (event.source === window && event.data.type) {
    // Ensure that the message sending is wrapped in a try-catch block
    try {
      // Relay the message to the background script
      await chrome.runtime.sendMessage(event.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
});
