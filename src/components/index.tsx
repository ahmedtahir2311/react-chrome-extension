import React from "react";
import "../assets/tailwind.css";

import { createRoot } from "react-dom/client";

import App from "./App";

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(<App />);
