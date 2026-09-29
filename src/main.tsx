import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MainframePage from "./MainframePage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MainframePage />
  </StrictMode>,
);
