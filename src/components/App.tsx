import React, { useEffect, useState } from 'react';
import CaptureScreenshot from './components/capture-screenshot';
import ScreenRecording from './components/screen-recording';
import Logo from './assets/icons/logo';
import InstantReplay from './components/instant-replay';
import SettingIcon from './assets/icons/setting-icon';
import Modal from './components/Modal';

const App = () => {
  const [modal, setModal] = useState<{ open: boolean; type?: string }>({
    open: false,
  });
  function getUserLocation() {
    console.log('in here', navigator);
    if ('geolocation' in navigator) {
      // Check if geolocation is supported
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log('Latitude: ' + position.coords.latitude);
          console.log('Longitude: ' + position.coords.longitude);
          // Handle position data here
        },
        function (error) {
          console.error('Error occurred: ' + error.message);
          // Handle error here
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
      // Handle case where geolocation is not supported
    }
  }
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <>
      <div className="data-body p-5">
        <div className="mb-5">
          <Logo />
        </div>
        <div className="flex flex-col gap-5 justify-center mb-4">
          <CaptureScreenshot
            setModal={() => {
              setModal({ open: true, type: 'screenshot' });
            }}
          />
          <ScreenRecording
            setModal={() => {
              setModal({ open: true, type: 'recording' });
            }}
          />
          <InstantReplay
            setModal={() => {
              setModal({ open: true, type: 'instantReplay' });
            }}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2.5 cursor-pointer">
            <SettingIcon />
            <p className="text-base font-semibold	text-neutral-700"> Settings</p>
          </div>
          <p className="text-base font-semibold	text-neutral-700 cursor-pointer	">
            Go to App
          </p>
        </div>
      </div>
      {modal?.open && (
        <Modal
          open={modal?.open}
          handleClose={() => {
            setModal({ open: false });
          }}
        >
          <p>This is Modal Body</p>
        </Modal>
      )}
    </>
  );
};

export default App;
