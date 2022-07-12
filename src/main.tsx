import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import zapfFontPath from "./ZapfChanceItalic.otf";

const zapfFont = new FontFace("Zapf Chance", `url("${zapfFontPath}")`);
document.fonts.add(zapfFont);

zapfFont.load().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
