// Helper function to get current user
const getCurrentUser = () => {
  const userStr = localStorage.getItem("currentUser");
  return userStr ? JSON.parse(userStr) : null;
};

// Helper function to get user-specific subscription key
const getUserSubscriptionKey = (userId) => `subscription_${userId}`;

import React, { useState, useEffect } from "react";
import { SubscriptionContext } from "./SubscriptionContextDef";
import { createSubscription } from "../services/subscriptionService";

// Provider component
export const SubscriptionProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState(() => {
    const user = getCurrentUser();
    if (user) {
      const saved = localStorage.getItem(getUserSubscriptionKey(user.id));
      return saved || "Free Mode";
    }
    return "Free Mode";
  });

  const getPlanFeatures = (plan) => {
    const plans = {
      "Free Mode": {
        displayName: "Free Mode",
        price: "₱0",
        maxPets: 2,
        hasHealthRecords: false,
        hasCareTips: false,
        hasExport: false,
      },
      "Premium Tier 1": {
        displayName: "Premium Tier 1",
        price: "₱49.99",
        maxPets: 5,
        hasHealthRecords: true,
        hasCareTips: false,
        hasExport: false,
      },
      "Premium Tier 2": {
        displayName: "Premium Tier 2",
        price: "₱99.99",
        maxPets: 10,
        hasHealthRecords: true,
        hasCareTips: true,
        hasExport: true,
      },
    };
    return plans[plan] || plans["Free Mode"];
  };

  const canAddPet = (currentPetCount) => {
    const features = getPlanFeatures(currentPlan);
    return currentPetCount < features.maxPets;
  };

  // Fetch subscription from API when user changes
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const saved = localStorage.getItem(getUserSubscriptionKey(user.id));
      setCurrentPlan(saved || "Free Mode");
    }
  }, []);

  const upgradePlan = async (newPlan) => {
    const user = getCurrentUser();
    if (!user?._id) {
      const error = new Error(
        "User not logged in. Please log in to change your plan."
      );
      alert(error.message);
      throw error;
    }

    if (!newPlan) {
      const error = new Error("No plan selected.");
      alert(error.message);
      throw error;
    }

    try {
      console.log(`Upgrading plan for user ${user._id} to ${newPlan}`);
      const response = await createSubscription(user._id, newPlan);
      console.log("Subscription API response:", response);

      // Update the plan from the response
      const updatedPlanName =
        response.planName || response.subscription?.planId?.name || newPlan;
      console.log("Setting current plan to:", updatedPlanName);
      setCurrentPlan(updatedPlanName);

      return response;
    } catch (error) {
      console.error("Error upgrading plan:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upgrade plan. Please try again.";
      alert(errorMessage);
      throw error;
    }
  };

  const value = {
    currentPlan,
    setCurrentPlan,
    getPlanFeatures,
    canAddPet,
    upgradePlan,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
