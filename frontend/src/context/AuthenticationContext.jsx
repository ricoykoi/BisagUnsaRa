import { createContext, useState } from "react";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  // Keep user only in memory; persistence lives in MongoDB via API
  const [user, setUser] = useState(null);

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthenticationContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
