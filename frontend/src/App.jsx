import React from "react";
import MainRoutes from "./routes/MainRoutes";
import Role from "./routes/Role";
import InstallPrompt from "./components/InstallPrompt";

const App = () => {
  return (
    <>
      <Role />
      <InstallPrompt />
    </>
  );
};

export default App;
