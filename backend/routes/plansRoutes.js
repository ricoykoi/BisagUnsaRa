import express from "express";
import {
  createPlan,
  getAllPlans,
  updatePlan,
  deletePlan,
} from "../controller/plansController.js";

const plansRouter = express.Router();

// Get all available plans
plansRouter.get("/", getAllPlans);

// Create a new plan (typically an admin action)
plansRouter.post("/", createPlan);

// Update a plan by its ID (typically an admin action)
plansRouter.put("/:planId", updatePlan);

// Delete a plan by its ID (typically an admin action)
plansRouter.delete("/:planId", deletePlan);

export default plansRouter;