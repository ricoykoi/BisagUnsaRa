import React, { useContext } from "react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import MainRoutes from "./MainRoutes";
import AuthRoutes from "./AuthRoutes";

const Role = () => {
  const { user } = useContext(AuthenticationContext);

  if (user) return <MainRoutes />;
  if (!user) return <AuthRoutes />;
  return null;
};

export default Role;
