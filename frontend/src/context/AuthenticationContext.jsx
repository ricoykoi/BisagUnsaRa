import { createContext, useState, useEffect } from "react";

export const AuthenticationContext = createContext();

export const AuthenticationProvider = ({ children }) => {
  const storedUser = sessionStorage.getItem("user");
  const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : false);

  useEffect(() => {
    // Sync 'user' state with sessionStorage
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  // Function to handle the login process (API communication)
  const login = async (email, password) => {
    try {
      // 1. **API CALL**: Replace this with your actual fetch or axios call
      const response = await fetch("YOUR_API_ENDPOINT/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Invalid credentials.");
      }

      const userData = await response.json();

      // Assume userData contains the token and user details
      const userObject = {
        id: userData.userId,
        email: userData.email,
        token: userData.authToken,
      };

      // 2. **SET STATE**: Update the global state (triggers useEffect to save to sessionStorage)
      setUser(userObject);

      // 3. **RETURN**: Signal success to the calling component
      return true;
    } catch (error) {
      console.error("Authentication Error:", error);
      // Re-throw the error so the component can display it
      throw error;
    }
  };

  const logout = () => {
    setUser(false);
    // Explicitly remove here for completeness, though useEffect also handles it
    sessionStorage.removeItem("user");
  };

  return (
    <AuthenticationContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
