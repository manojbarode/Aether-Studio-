import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/refinements.css";
import "./styles/services-carousel.css";
import "./styles/hero-video.css";
import "./styles/about-scroll.css";
import "./styles/process.css";
import "./styles/project-planner.css";
import "./styles/animations.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
