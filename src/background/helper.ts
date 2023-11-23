//get current Tab URL
const getCurrentTabURL = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTabURL = tabs[0].url;
  return currentTabURL;
};

//get platformInfo
function getOSVersion() {
  const userAgent = navigator.userAgent;
  let osVersion = "";
  if (userAgent.includes("Windows NT")) {
    osVersion = userAgent.split("Windows NT")[1].split(";")[0];
  } else if (userAgent.includes("Mac OS X")) {
    osVersion = userAgent.split("Mac OS X")[1].split(")")[0];
  } else if (userAgent.includes("Linux")) {
    osVersion = "Linux";
  } else {
    osVersion = "";
  }
  return osVersion.replace(/_/g, ".");
}
const platformInfoHandler = async () => {
  const platformInfo = await chrome.runtime.getPlatformInfo();
  const platformNameMap = {
    mac: "Mac OS",
    win: "Windows",
    android: "Android",
    cros: "Chrome OS",
    linux: "Linux",
    openbsd: "OpenBSD",
  };
  const formattedDeviceInfo = `${
    platformNameMap[platformInfo.os] || platformInfo.os
  } (${platformInfo.arch}) ${getOSVersion()} `;
  return formattedDeviceInfo;
};

//get BrowserInfo
function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserName = navigator.appName;
  let fullVersion = navigator.appVersion;
  let versionOffset;

  if ((versionOffset = userAgent.indexOf("OPR")) !== -1) {
    browserName = "Opera";
    fullVersion = userAgent.substring(versionOffset + 4);
  } else if ((versionOffset = userAgent.indexOf("Edg")) !== -1) {
    browserName = "Microsoft Edge";
    fullVersion = userAgent.substring(versionOffset + 4);
  } else if (
    (versionOffset = userAgent.indexOf("MSIE")) !== -1 ||
    (versionOffset = userAgent.indexOf("Trident")) !== -1
  ) {
    browserName = "Internet Explorer";
    fullVersion = userAgent.substring(
      versionOffset + (userAgent.indexOf("Trident") !== -1 ? 11 : 5)
    );
  } else if ((versionOffset = userAgent.indexOf("Chrome")) !== -1) {
    browserName = "Chrome";
    fullVersion = userAgent.substring(versionOffset + 7);
  } else if ((versionOffset = userAgent.indexOf("Safari")) !== -1) {
    browserName = "Safari";
    fullVersion = userAgent.substring(versionOffset + 7);
  } else if ((versionOffset = userAgent.indexOf("Firefox")) !== -1) {
    browserName = "Firefox";
    fullVersion = userAgent.substring(versionOffset + 8);
  } else if ((versionOffset = userAgent.indexOf("Version")) !== -1) {
    fullVersion = userAgent.substring(versionOffset + 8);
  } else {
    fullVersion = userAgent.substring(userAgent.lastIndexOf("/") + 1);
  }
  return `${browserName} ${fullVersion}`;
}

//ScreenDimensions
function getScreenDimensions() {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;

  return `${screenWidth}x${screenHeight}`;
}

//get GeoLocation Details
const getGeolocationDetails = () => {
  if ("geolocation" in navigator) {
    // Check if geolocation is supported
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log("Latitude: " + position.coords.latitude);
        console.log("Longitude: " + position.coords.longitude);
        // Hitting an Open GeoLocation API to get the Location details
        fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=898e0105618f47279980ce9dde234108`
        )
          .then((res) => res.json())
          .then((res) => {
            // #todo: storage of location
            console.log(res.results.components);
          });
      },
      function (error) {
        console.error(
          "Error occurred while Getting Geolocation: " + error.message
        );
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    // Handle case where geolocation is not supported
  }
};

//get Connection Speed and Type
function getInternetSpeedCategory() {
  if ("connection" in navigator && navigator["connection"]) {
    const connection: any = navigator["connection"];
    const downlink = connection.downlink;
    let connectionSpeed = "";
    if (downlink <= 0 || !downlink) {
      connectionSpeed = "No Internet";
    } else if (downlink <= 10) {
      connectionSpeed = "Slow";
    } else if (downlink >= 10 && downlink <= 100) {
      connectionSpeed = "Medium";
    } else if (downlink >= 100) {
      connectionSpeed = "Fast";
    }
    return `${connectionSpeed} (${connection.effectiveType}) `;
  }
}

const deleteOldRecords = (currentTime, existingTabData) => {
  const threshold = 2 * 60 * 1000; // 2 minutes in milliseconds

  function filterOldRecords(records) {
    return records.filter((record) => {
      const recordTime = new Date(record.timestamp).getTime();
      return currentTime - recordTime <= threshold;
    });
  }

  const updatedTabData = {
    ...existingTabData,
    consoles: {
      logs: filterOldRecords(existingTabData?.consoles?.logs || []),
      errors: filterOldRecords(existingTabData?.consoles?.errors || []),
      warns: filterOldRecords(existingTabData?.consoles?.warns || []),
    },
  };
  console.log({ updatedTabData });

  return updatedTabData;
};
