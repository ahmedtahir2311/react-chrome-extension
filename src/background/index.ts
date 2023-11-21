chrome.runtime.onInstalled.addListener(() => {
  // console.log(
  //   "CrossCheck-Installed ",
  //   chrome,
  //   chrome.declarativeNetRequest,
  //   navigator
  // );
  //if devools is available
  if (!chrome.devtools || !chrome.devtools.panels) {
    console.log("Developer Tools API not available");
  } else {
    // Open the Developer Tools
    console.log(chrome.devtools.panels);
  }
});

const captureNetworkData = () => {
  const tabRequests = {};

  chrome.webRequest.onBeforeRequest.addListener(
    (requestDetails) => {
      const { tabId } = requestDetails;

      if (tabId !== -1) {
        if (!tabRequests[tabId]) {
          tabRequests[tabId] = [];
        }

        if (requestDetails.requestBody && requestDetails.requestBody.raw) {
          const rawBytes = requestDetails.requestBody.raw[0].bytes;
          const requestBody = JSON.parse(new TextDecoder().decode(rawBytes));

          const indexToUpdate = tabRequests[tabId].findIndex(
            (x) => x.requestId === requestDetails.requestId
          );

          if (indexToUpdate !== -1) {
            // If the object with the requestId is found, update it
            tabRequests[tabId][indexToUpdate] = {
              ...requestDetails,
              requestBody,
            };
            // console.log(
            //   `Updated existing object with Request ID for tabID ${tabId}`,
            //   tabRequests
            // );
          } else {
            // If the object with the requestId is not found, add a new one
            tabRequests[tabId].push({ ...requestDetails, requestBody });
            // console.log(
            //   `Added new object with Request ID for tabID ${tabId}`,
            //   tabRequests
            // );
          }
        } else {
          tabRequests[tabId].push({ ...requestDetails });
          // console.log(
          //   `Added new object with Request ID for tabID ${tabId}`,
          //   tabRequests
          // );
        }
      }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
  );
  chrome.webRequest.onBeforeSendHeaders.addListener(
    (requestDetails) => {
      const { tabId } = requestDetails;

      if (tabId !== -1) {
        const indexToUpdate = tabRequests[tabId].findIndex(
          (x) => x.requestId === requestDetails.requestId
        );

        if (indexToUpdate !== -1) {
          // If the object with the requestId is found, update its headers
          tabRequests[tabId][indexToUpdate].requestHeaders =
            requestDetails.requestHeaders;
          // console.log(
          //   `Updated headers for existing object with Request ID for tabID ${tabId}`,
          //   tabRequests
          // );
        }
      }
    },
    { urls: ["<all_urls>"] },
    ["requestHeaders"]
  );
  chrome.webRequest.onCompleted.addListener(
    async (responseDetails) => {
      const { tabId } = responseDetails;

      if (tabId !== -1) {
        const existingData = await chrome.storage.sync.get([tabId.toString()]);

        const indexToUpdate = tabRequests[tabId].findIndex(
          (x) => x.requestId === responseDetails.requestId
        );

        if (indexToUpdate !== -1) {
          // If the object with the requestId is found, update its response details
          // const rawBytes = responseDetails.responseBody.raw[0].bytes;
          // const responseBody = JSON.parse(new TextDecoder().decode(rawBytes));

          tabRequests[tabId][indexToUpdate] = {
            ...tabRequests[tabId][indexToUpdate],
            responseHeaders: responseDetails.responseHeaders,
            // responseBody,
          };
          console.log(tabRequests[tabId]);

          //  #todo storage the data in chrome.storage.sync.get()
          // chrome.storage.sync
          //   .set({
          //     [tabId]: {
          //       ...existingData[tabId],
          //       network: tabRequests[tabId],
          //     },
          //   })
          //   .then((res) => {
          //     console.log(res);
          //   });
        }
      }
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"]
  );
};

// Call the function to start capturing network data
captureNetworkData();

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
  } else if (message.type === "GET_NETWORK_REQUESTS") {
    console.log({ message });
    // sendResponse(networkRequests);
  }

  sendResponse(existingData);
});
