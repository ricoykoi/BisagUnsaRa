import axios from "axios";

const API_URL = `${import.meta.env.VITE_API}/auth`;

// REGISTER
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.log("Register service error:", error);
    throw error;
  }
};

// LOGIN
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.log("Login service error:", error);
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
};
