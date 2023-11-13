import React from "react";
import CloseIcon from "../../assets/icons/close-icon";

const Modal = ({ children, open, handleClose }) => {
  return (
    <div
      id="popup-modal"
      className={`${
        !open ? "hidden" : "block"
      } fixed top-0 right-0 bottom-0 left-0 flex items-center justify-center `}
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-hide="popup-modal"
            onClick={handleClose}
          >
            <CloseIcon />
            <span className="sr-only">Close modal</span>
          </button>
          <div className="p-4 md:p-5 text-center">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
