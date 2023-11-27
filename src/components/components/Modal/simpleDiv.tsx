import React from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("react-modal");
const root = createRoot(container);
root.render(<div className="insertedDiv"></div>);
