const originalConsoleLog = console.log;
console.log = function (...args) {
  originalConsoleLog(...args);
  postMessage({ type: "CONSOLE_LOG", args }, "*");
};

const OriginalConsoleError = console.error;
console.error = function (...args) {
  OriginalConsoleError(...args);
  postMessage({ type: "CONSOLE_ERROR", args }, "*");
};
const OriginalConsoleWarn = console.warn;
console.warn = function (...args) {
  OriginalConsoleWarn(...args);
  postMessage({ type: "CONSOLE_WARN", args }, "*");
};
