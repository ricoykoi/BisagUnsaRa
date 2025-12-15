import axios from "axios";

const API_URL = "http://localhost:3000/api/plans";

// GET all available plans
export const getAllPlans = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Get All Plans service error:", error);
    throw error;
  }
};

// CREATE a new plan (typically for admin)
export const createPlan = async (planData) => {
  try {
    const response = await axios.post(API_URL, planData);
    return response.data;
  } catch (error) {
    console.error("Create Plan service error:", error);
    throw error;
  }
};

// UPDATE a plan (typically for admin)
export const updatePlan = async (planId, planData) => {
  try {
    const response = await axios.put(`${API_URL}/${planId}`, planData);
    return response.data;
  } catch (error) {
    console.error("Update Plan service error:", error);
    throw error;
  }
};

// DELETE a plan (typically for admin)
export const deletePlan = async (planId) => {
  try {
    const response = await axios.delete(`${API_URL}/${planId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Plan service error:", error);
    throw error;
  }
};