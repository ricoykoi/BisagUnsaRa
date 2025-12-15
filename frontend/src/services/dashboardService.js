import axios from "axios";

const API_URL = `${import.meta.env.VITE_API}/dashboard`;

// GET dashboard settings for a user
export const getDashboard = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get Dashboard service error:", error);
    throw error;
  }
};

// UPDATE dashboard settings for a user
export const updateDashboard = async (userId, dashboardData) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}`, dashboardData);
    return response.data;
  } catch (error) {
    console.error("Update Dashboard service error:", error);
    throw error;
  }
};