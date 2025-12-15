import React, { useState, useEffect, useContext } from 'react';
import { SubscriptionContext } from './SubscriptionContextDef';
import { AuthenticationContext } from './AuthenticationContext';
import { getSubscriptionByUser, createSubscription } from '../services/subscriptionService';

// Provider component
export const SubscriptionProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const [currentPlan, setCurrentPlan] = useState('Free Mode');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const getPlanFeatures = (plan) => {
    const plans = {
      'Free Mode': {
        displayName: 'Free Mode',
        price: '₱0',
        maxPets: 2,
        hasHealthRecords: false,
        hasCareTips: false,
        hasExport: false
      },
      'Premium Tier 1': {
        displayName: 'Premium Tier 1',
        price: '₱49.99',
        maxPets: 5,
        hasHealthRecords: true,
        hasCareTips: false,
        hasExport: false
      },
      'Premium Tier 2': {
        displayName: 'Premium Tier 2',
        price: '₱99.99',
        maxPets: 10,
        hasHealthRecords: true,
        hasCareTips: true,
        hasExport: true
      }
    };
    return plans[plan] || plans['Free Mode'];
  };

  const canAddPet = (currentPetCount) => {
    const features = getPlanFeatures(currentPlan);
    return currentPetCount < features.maxPets;
  };

  // Fetch subscription from API when user changes
  useEffect(() => {
    const fetchSubscription = async () => {
      if (user?._id) {
        try {
          setLoading(true);
          const subscription = await getSubscriptionByUser(user._id);
          // Handle different response formats
          let planName = 'Free Mode';
          if (subscription.planName) {
            planName = subscription.planName;
          } else if (subscription.planId?.name) {
            planName = subscription.planId.name;
          } else if (subscription.subscription?.planId?.name) {
            planName = subscription.subscription.planId.name;
          }
          setCurrentPlan(planName);
        } catch (error) {
          console.error('Error fetching subscription:', error);
          setCurrentPlan('Free Mode');
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentPlan('Free Mode');
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user, refreshKey]);

  const upgradePlan = async (newPlan) => {
    if (!user?._id) {
      const error = new Error("User not logged in. Please log in to change your plan.");
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
      const updatedPlanName = response.planName || response.subscription?.planId?.name || newPlan;
      console.log("Setting current plan to:", updatedPlanName);
      setCurrentPlan(updatedPlanName);
      
      // Trigger refresh to ensure we have the latest subscription data
      setRefreshKey(prev => prev + 1);
      return response;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upgrade plan. Please try again.';
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
    loading
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
