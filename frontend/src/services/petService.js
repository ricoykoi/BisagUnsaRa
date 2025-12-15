import axios from "axios";

const API_URL = "http://localhost:3000/api/pets";

// CREATE a new pet
export const createPet = async (petData, userId) => {
  try {
    const response = await axios.post(API_URL, {
      ...petData,
      userId: userId,
    });
    return response.data;
  } catch (error) {
    console.error("Create Pet service error:", error);
    throw error;
  }
};

// GET all pets for a user
export const getPets = async (userId) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        userId: userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get Pets service error:", error);
    throw error;
  }
};

// UPDATE a pet
export const updatePet = async (petId, petData, userId) => {
  try {
    const response = await axios.patch(`${API_URL}/${petId}`, {
      ...petData,
      userId: userId,
    });
    return response.data;
  } catch (error) {
    console.error("Update Pet service error:", error);
    throw error;
  }
};

// DELETE a pet
export const deletePet = async (petId, userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${petId}`, {
      params: {
        userId: userId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Delete Pet service error:", error);
    throw error;
  }
};