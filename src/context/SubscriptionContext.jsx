import React, { useState } from 'react';
import { SubscriptionContext } from './SubscriptionContextDef';

// Provider component
export const SubscriptionProvider = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState('Free Mode');

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

  const upgradePlan = (newPlan) => {
    setCurrentPlan(newPlan);
  };

  const value = {
    currentPlan,
    setCurrentPlan,
    getPlanFeatures,
    canAddPet,
    upgradePlan
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
