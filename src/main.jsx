import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthenticationProvider } from "./context/AuthenticationContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthenticationProvider>
    <App />
  </AuthenticationProvider>
);
