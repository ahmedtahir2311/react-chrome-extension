const originalConsoleLog = console.log;
console.log = function (...args) {
  originalConsoleLog(...args);
  postMessage({ type: 'CONSOLE_LOG', args }, '*');
};

const OriginalConsoleError = console.error;
console.error = function (...args) {
  OriginalConsoleError(...args);
  postMessage({ type: 'CONSOLE_ERROR', args }, '*');
};
const OriginalConsoleWarn = console.warn;
console.warn = function (...args) {
  OriginalConsoleWarn(...args);
  postMessage({ type: 'CONSOLE_WARN', args }, '*');
};

const originalXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function (method, url) {
  this.addEventListener('load', function () {
    window.postMessage(
      {
        type: 'RESPONSE_TEXT',
        url: url,
        responseText: JSON.parse(this.responseText),
        method: 'XMLHttpRequest',
      },
      '*'
    );
  });
  return originalXHROpen.apply(this, arguments);
};

document.addEventListener(
  'click',
  (event) => {
    const targetElement = event.target;
    let elementDetails = {
      // @ts-ignore
      tagName: targetElement.tagName,
      // @ts-ignore
      id: targetElement.id,
      // @ts-ignore
      classNames: targetElement.className,
      timeStamp: event.timeStamp,
    };

    window.postMessage(
      { type: 'USER_ACTION', action: 'click', details: elementDetails },
      '*'
    );
  },
  false
);
