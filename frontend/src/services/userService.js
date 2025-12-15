import axios from "axios";

const API_URL = `${import.meta.env.VITE_PWA}/auth`;

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

// UPDATE PROFILE PICTURE
export const updateProfilePicture = async (userId, profilePicture) => {
  try {
    const response = await axios.patch(`${API_URL}/profile-picture`, {
      userId,
      profilePicture,
    });
    return response.data;
  } catch (error) {
    console.error("Update profile picture service error:", error);
    throw error;
  }
};

// UPDATE USERNAME
export const updateUsername = async (userId, newUsername) => {
  try {
    const response = await axios.patch(`${API_URL}/username`, {
      userId,
      newUsername,
    });
    return response.data;
  } catch (error) {
    console.error("Update username service error:", error);
    throw error;
  }
};

// UPDATE EMAIL
export const updateEmail = async (userId, newEmail) => {
  try {
    const response = await axios.patch(`${API_URL}/email`, {
      userId,
      newEmail,
    });
    return response.data;
  } catch (error) {
    console.error("Update email service error:", error);
    throw error;
  }
};

// CHANGE PASSWORD
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.patch(`${API_URL}/password`, {
      userId,
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Change password service error:", error);
    throw error;
  }
};

// DELETE ACCOUNT
export const deleteAccount = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/account`, {
      data: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Delete account service error:", error);
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
  updateProfilePicture,
  updateUsername,
  updateEmail,
  changePassword,
  deleteAccount,
};