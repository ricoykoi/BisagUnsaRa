import axios from "axios";

const API_URL = `${import.meta.env.VITE_API}/export`;

// CREATE a new export request
export const requestExport = async (exportData) => {
  try {
    const response = await axios.post(API_URL, exportData);
    return response.data;
  } catch (error) {
    console.error("Request Export service error:", error);
    throw error;
  }
};

// GET export history for a user
export const getExportHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get Export History service error:", error);
    throw error;
  }
};

// GET details for a single export job
export const getExportDetails = async (exportId) => {
  try {
    const response = await axios.get(`${API_URL}/${exportId}`);
    return response.data;
  } catch (error) {
    console.error("Get Export Details service error:", error);
    throw error;
  }
};

// DELETE an export record
export const deleteExport = async (exportId) => {
  try {
    const response = await axios.delete(`${API_URL}/${exportId}`);
    return response.data;
  } catch (error) {
    console.error("Delete Export service error:", error);
    throw error;
  }
};
