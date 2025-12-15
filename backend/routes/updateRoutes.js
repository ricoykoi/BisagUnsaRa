import express from "express";
import {
  getUpdatesByUser,
  createUpdate,
  markUpdateAsRead,
  markAllUpdatesAsRead,
  dismissUpdate,
  checkAndCreateNotifications,
} from "../controller/updateController.js";

const updateRouter = express.Router();

// Get all updates for a user
updateRouter.get("/", getUpdatesByUser);

// Create an update
updateRouter.post("/", createUpdate);

// Mark update as read
updateRouter.patch("/read", markUpdateAsRead);

// Mark all updates as read
updateRouter.patch("/read-all", markAllUpdatesAsRead);

// Dismiss update
updateRouter.patch("/dismiss", dismissUpdate);

// Check and create notifications
updateRouter.post("/check", checkAndCreateNotifications);

export default updateRouter;

