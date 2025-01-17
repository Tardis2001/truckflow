import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "./assets/HankenGrotesk-VariableFont_wght.ttf";
import "./assets/DMSerifText-Regular.ttf";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
