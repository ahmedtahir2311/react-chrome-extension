import React from "react";
import "../assets/tailwind.css";

import { createRoot } from "react-dom/client";

const App = (
  <div>
    <img src="banner.png"></img>
    {/* <h1 className="text-4xl text-green-500">Hello World</h1> */}
    <p>Hello World</p>
  </div>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(App);
