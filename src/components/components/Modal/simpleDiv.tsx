import React from "react";
import { createRoot } from "react-dom/client";

const SimpleDiv = () => {
  return <div>simpleDiv</div>;
};

export default SimpleDiv;

export const someFunction = (container) => {
  console.log("im in some function");
  const root = createRoot(container);
  root.render(<SimpleDiv />);
};
