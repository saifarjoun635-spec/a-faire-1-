import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Suppress benign ResizeObserver loop warning (commonly triggered by Radix UI)
// which is caught by CRA's react-error-overlay and blocks clicks in dev.
const RO_MSG = "ResizeObserver loop";
window.addEventListener("error", (e) => {
  if (e.message && e.message.includes(RO_MSG)) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});
window.addEventListener("unhandledrejection", (e) => {
  if (e.reason && String(e.reason.message || e.reason).includes(RO_MSG)) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
