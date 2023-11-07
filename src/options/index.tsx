import React from "react";
import "../assets/tailwind.css";

import { createRoot } from "react-dom/client";

const App = (
  <div>
    <h1 className="text-4xl text-green-500">Options</h1>
  </div>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(App);
