import React from "react";
import ScreenRecordingIcon from "../../assets/icons/screen-recording-icon";

const Index = ({ setModal }) => {
  return (
    <div
      className="p-2.5 flex gap-2.5 border border-black rounded-xl cursor-pointer"
      onClick={setModal}
    >
      <ScreenRecordingIcon />
      <p className="text-base font-semibold	text-neutral-700">
        Screen Recording
      </p>
    </div>
  );
};

export default Index;
