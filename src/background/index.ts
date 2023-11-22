// import { getUserLocation } from './helper';

let db = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log('CrossCheck-Installed ');

  const dbName = 'crosscheck-testDB';
  const dbVersion = 1;

  const dbOpenRequest = indexedDB.open(dbName, dbVersion);
  dbOpenRequest.onupgradeneeded = (e) => {
    //Making a Table
    db = dbOpenRequest.result;
    db.createObjectStore('tabs_records', {
      keyPath: 'tabId',
      // autoIncrement: true,
    });
  };
  dbOpenRequest.onsuccess = () => {
    db = dbOpenRequest.result;

    //Opening a Tranction
    const transaction = db.transaction(['tabs_records'], 'readwrite');
    const tabs_records = transaction.objectStore('tabs_records');
    db.tabs_records = tabs_records;

    //making a Generic Add Function
    db.add = (
      payload,
      tableName = 'tabs_records',
      permission = 'readwrite'
    ) => {
      const transaction = db.transaction([tableName], permission);
      const tx = transaction.objectStore(tableName);

      //Adding Results
      const addRequest = tx.add({ ...payload });
      //onSucess
      addRequest.onsuccess = (event) => {
        // console.log("Record Added Success : ", event);
        return event.target.result;
      };
      //onFailed
      addRequest.onerror = (event) => {
        // console.error("Record Addition Failed : ", event.target.error);
        return event.target.error;
      };
    };

    //making a Generic Put Function
    db.put = (
      payload,
      tableName = 'tabs_records',
      permission = 'readwrite'
    ) => {
      const transaction = db.transaction([tableName], permission);
      const tx = transaction.objectStore(tableName);
      //Adding Results
      const putRequest = tx.put({ ...payload });
      //onSucess
      putRequest.onsuccess = (event) => {
        // console.log("Record Updating Success : ", event);
        return event.target.result;
      };
      //onFailed
      putRequest.onerror = (event) => {
        // console.error("Record Updating Failed : ", event.target.error);
        return event.target.error;
      };
    };

    //making a Generic for getById #tabId passed
    db.getById = (
      tabId,
      tableName = 'tabs_records',
      permission = 'readwrite'
    ) => {
      try {
        //Opening a Tranction
        const transaction = db.transaction([tableName], permission);
        const tx = transaction.objectStore(tableName);
        //onSuccess
        return new Promise((resolve, reject) => {
          const getByIdRequest = tx.get(tabId);

          // onSuccess
          getByIdRequest.onsuccess = (event) => {
            const result = event.target.result || {};
            resolve(result);
          };

          // onError
          getByIdRequest.onerror = (event) => {
            reject(event.target.error);
          };
        });
      } catch (error) {
        console.error(error);
      }
    };

    //making a Generic for GetAll Function  #tabId not passed
    db.getAll = (tableName = 'tabs_records', permission = 'readwrite') => {
      try {
        const transaction = db.transaction([tableName], permission);
        const tx = transaction.objectStore(tableName);

        return new Promise((resolve, reject) => {
          const getAllRequest = tx.getAll();
          //onSuccess
          getAllRequest.onsuccess = (event) => {
            const result = event.target.result || {};
            resolve(result);
          };
          //onFailed
          getAllRequest.onerror = (event) => {
            console.error('Record Fetching Failed : ', event.target.error);
            reject(event.target.error);
          };
        });
      } catch (error) {
        console.error(error);
      }
    };
  };

  dbOpenRequest.onerror = (e) => {
    db = null;
    console.error('Error Creating Index Db ', dbOpenRequest);
  };
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
    { urls: ['<all_urls>'] },
    ['requestBody']
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
    { urls: ['<all_urls>'] },
    ['requestHeaders']
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
    { urls: ['<all_urls>'] },
    ['responseHeaders']
  );
};

// Call the function to start capturing network data
captureNetworkData();

//Reading Out Consoles
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('Received response:', message);

  const existingTabData = await db.getById(sender.tab.id);
  const timestamp = new Date().toISOString();

  // Assuming message.type is 'CONSOLE_LOG'
  if (message.type === 'CONSOLE_LOG') {
    // Storage of Console Log will be happen here
    db.put({
      tabId: sender.tab.id,
      ...sender,
      consoles: {
        ...(existingTabData?.consoles || {}),
        logs: [
          ...(existingTabData?.consoles?.logs || []),
          { createdAt: timestamp, message: message.args },
        ],
      },
    });
  } else if (message.type === 'CONSOLE_ERROR') {
    // Storage of Console Log will be happen here
    db.put({
      tabId: sender.tab.id,
      ...sender,
      consoles: {
        ...(existingTabData?.consoles || {}),
        errors: [
          ...(existingTabData?.consoles?.errors || []),
          { createdAt: timestamp, message: message.args },
        ],
      },
    });
  } else if (message.type === 'CONSOLE_WARN') {
    // Storage of Console Log will be happen here
    db.put({
      tabId: sender.tab.id,
      ...sender,
      consoles: {
        ...(existingTabData?.consoles || {}),
        warns: [
          ...(existingTabData?.consoles?.warns || []),
          { createdAt: timestamp, message: message.args },
        ],
      },
    });
  } else if (message.type === 'USER_ACTION') {
    console.log('User action detected:', message);
  }
  // deleteOldRecords(timestamp, existingTabData);
});
