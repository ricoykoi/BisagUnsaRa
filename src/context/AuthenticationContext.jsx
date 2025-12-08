import { createContext, useState, useEffect } from "react";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const storedUser = sessionStorage.getItem("user");

  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : false);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => {
    setUser(false);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthenticationContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
