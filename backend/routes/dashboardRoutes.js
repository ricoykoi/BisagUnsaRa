import express from "express";
import {
  getDashboard,
  updateDashboard,
} from "../controller/dashboardController.js";

const dashboardRouter = express.Router();

// Get or create dashboard settings for a user
dashboardRouter.get("/:userId", getDashboard);

// Update dashboard settings for a user
dashboardRouter.put("/:userId", updateDashboard);

export default dashboardRouter;
