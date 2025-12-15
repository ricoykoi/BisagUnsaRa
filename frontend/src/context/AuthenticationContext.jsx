import { createContext, useState, useEffect } from "react";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  // Load user from localStorage initially
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  const logout = () => {
    setUser(null); // this also removes from localStorage
  };

  return (
    <AuthenticationContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
