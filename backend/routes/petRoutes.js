import express from "express";
import {
  createPet,
  getPetsByUser,
  updatePet,
  deletePet,
} from "../controller/petController.js";

const petRouter = express.Router();

// Create a new pet
petRouter.post("/", createPet);

// Get all pets for a specific user
petRouter.get("/", getPetsByUser);

// Update a pet by its ID
petRouter.patch("/:petId", updatePet);

// Delete a pet by its ID
petRouter.delete("/:petId", deletePet);

export default petRouter;