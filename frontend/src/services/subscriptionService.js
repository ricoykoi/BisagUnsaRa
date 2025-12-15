import axios from "axios";

const API_URL = `${import.meta.env.VITE_API}/subscriptions`;

// CREATE or UPDATE a subscription for a user (using planName)
export const createSubscription = async (userId, planName) => {
  try {
    const response = await axios.post(API_URL, { userId, planName });
    return response.data;
  } catch (error) {
    console.error("Create Subscription service error:", error);
    throw error;
  }
};

// GET the active subscription for a specific user (returns planName)
export const getSubscriptionByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    // If 404 or any error, return default Free Mode
    // The backend should always return a plan, but just in case
    if (error.response?.status === 404 || error.response?.status === 500) {
      console.warn("Subscription not found, returning default Free Mode");
      return {
        planName: "Free Mode",
        status: "active",
        isDefault: true
      };
    }
    console.error("Get Subscription by User service error:", error);
    // Still return default on any error
    return {
      planName: "Free Mode",
      status: "active",
      isDefault: true
    };
  }
};

// CANCEL a subscription by its ID
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await axios.patch(`${API_URL}/${subscriptionId}/cancel`);
    return response.data;
  } catch (error) {
    console.error("Cancel Subscription service error:", error);
    throw error;
  }
};