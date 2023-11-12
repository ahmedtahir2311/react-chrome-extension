const originalConsoleLog = console.log;
console.log = function (...args) {
  originalConsoleLog(...args);
  window.postMessage({ type: "CONSOLE_LOG", args }, "*");
};

const OriginalConsoleError = console.error;
console.error = function (...args) {
  OriginalConsoleError(...args);
  window.postMessage({ type: "CONSOLE_ERROR", args }, "*");
};
const OriginalConsoleWarn = console.warn;
console.warn = function (...args) {
  OriginalConsoleWarn(...args);
  window.postMessage({ type: "CONSOLE_WARN", args }, "*");
};
