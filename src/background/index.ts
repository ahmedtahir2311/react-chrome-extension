chrome.runtime.onInstalled.addListener(() => {
  console.log("CrossCheck-Installed ", chrome, navigator);
});

//Reading Out Consoles
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  const senderTab = sender.tab.id.toString();
  const existingData = await chrome.storage.sync.get([senderTab]);
  // Assuming message.type is 'CONSOLE_LOG'
  if (message.type === "CONSOLE_LOG") {
    // Storage of Console Log will be happen here
    await chrome.storage.sync.set({
      ...existingData,
      [senderTab]: {
        ...(existingData[senderTab] || {}),
        consoles: {
          ...(existingData[senderTab]?.consoles || {}),
          logs: [
            ...(existingData[senderTab]?.consoles?.logs || []),
            ...message.args,
          ],
        },
      },
    });
  } else if (message.type === "CONSOLE_ERROR") {
    // Storage of Console Log will be happen here
    await chrome.storage.sync.set({
      ...existingData,
      [senderTab]: {
        ...(existingData[senderTab] || {}),
        consoles: {
          ...(existingData[senderTab]?.consoles || {}),
          errors: [
            ...(existingData[senderTab]?.consoles?.errors || []),
            ...message.args,
          ],
        },
      },
    });
  } else if (message.type === "CONSOLE_WARN") {
    // Storage of Console Log will be happen here
    await chrome.storage.sync.set({
      ...existingData,
      [senderTab]: {
        ...(existingData[senderTab] || {}),
        consoles: {
          ...(existingData[senderTab]?.consoles || {}),
          warns: [
            ...(existingData[senderTab]?.consoles?.warns || []),
            ...message.args,
          ],
        },
      },
    });
  }

  sendResponse(existingData);
});

console.log(chrome.webRequest);
