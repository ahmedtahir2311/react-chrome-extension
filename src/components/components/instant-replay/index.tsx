import React from "react";
import InstantReplayIcon from "../../assets/icons/instant-replay-icon";

const InstantReplay = ({ setModal }) => {
  return (
    <div
      className="p-2.5 flex gap-2.5 border border-black rounded-xl cursor-pointer"
      onClick={setModal}
    >
      <InstantReplayIcon />
      <p className="text-base font-semibold	text-neutral-700">Instant Replay</p>
    </div>
  );
};

export default InstantReplay;
