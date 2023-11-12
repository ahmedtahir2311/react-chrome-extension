// content.js
function injectScript(file, node) {
  const th = document.getElementsByTagName(node)[0];
  const s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  s.setAttribute("src", file);
  th.appendChild(s);
}

injectScript(chrome.runtime.getURL("inject.js"), "body");

// Listen for messages from the inject.js script
window.addEventListener("message", (event) => {
  // Only accept messages from the same frame
  if (event.source === window && event.data.type) {
    // Ensure that the message sending is wrapped in a try-catch block
    try {
      // Relay the message to the background script
      chrome.runtime.sendMessage(event.data, (response) => {
        if (chrome.runtime.lastError) {
          // Handle error
          console.error(chrome.runtime.lastError.message);
        } else {
          // Handle response
        }
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
});