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

//get Country
//No-solution

//get Connection Speed and Type
function getInternetSpeedCategory() {
  if ("connection" in navigator && navigator["connection"]) {
    const connection = navigator["connection"] as any; // Explicitly specify the type as 'any'
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
