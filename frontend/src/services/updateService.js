import axios from "axios";

const API_URL = "http://localhost:3000/api/updates";

// GET all updates for a user
export const getUpdatesByUser = async (userId) => {
  try {
    const response = await axios.get(API_URL, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Get updates service error:", error);
    throw error;
  }
};

// CREATE an update
export const createUpdate = async (updateData) => {
  try {
    const response = await axios.post(API_URL, updateData);
    return response.data;
  } catch (error) {
    console.error("Create update service error:", error);
    throw error;
  }
};

// MARK update as read
export const markUpdateAsRead = async (updateId) => {
  try {
    const response = await axios.patch(`${API_URL}/read`, { updateId });
    return response.data;
  } catch (error) {
    console.error("Mark update as read service error:", error);
    throw error;
  }
};

// MARK all updates as read
export const markAllUpdatesAsRead = async (userId) => {
  try {
    const response = await axios.patch(`${API_URL}/read-all`, { userId });
    return response.data;
  } catch (error) {
    console.error("Mark all updates as read service error:", error);
    throw error;
  }
};

// DISMISS update
export const dismissUpdate = async (updateId) => {
  try {
    const response = await axios.patch(`${API_URL}/dismiss`, { updateId });
    return response.data;
  } catch (error) {
    console.error("Dismiss update service error:", error);
    throw error;
  }
};

// CHECK and create notifications
export const checkAndCreateNotifications = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/check`, { userId });
    return response.data;
  } catch (error) {
    console.error("Check notifications service error:", error);
    throw error;
  }
};


