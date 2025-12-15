import express from "express";
import {
  createSubscription,
  getSubscriptionByUser,
  cancelSubscription,
} from "../controller/subscriptionController.js";

const subscriptionRouter = express.Router();

// Create a new subscription for a user
subscriptionRouter.post("/", createSubscription);

// Get the active subscription for a specific user
subscriptionRouter.get("/user/:userId", getSubscriptionByUser);

// Cancel a subscription by its ID
subscriptionRouter.patch("/:subscriptionId/cancel", cancelSubscription);

export default subscriptionRouter;