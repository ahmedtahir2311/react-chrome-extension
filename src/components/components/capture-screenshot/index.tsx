import React from "react";
import CaptureScreenshotIcon from "../../assets/icons/capture-screenshot-icon";

const Index = ({ setModal }) => {
  //screen capture function
  const screenshotHandler = () => {
    chrome.tabs.captureVisibleTab({ format: "png" }, function (dataUrl) {
      let newTab = window.open();
      newTab.document.body.innerHTML = '<img src="' + dataUrl + '">';
    });
  };

  return (
    <div
      className="p-2.5 flex gap-2.5 border border-black rounded-xl cursor-pointer	"
      onClick={screenshotHandler}
    >
      <CaptureScreenshotIcon />
      <p className="text-base font-semibold	text-neutral-700">
        Capture Screenshot
      </p>
    </div>
  );
};

export default Index;
