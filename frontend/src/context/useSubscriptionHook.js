import { useContext } from 'react';
import { SubscriptionContext } from './SubscriptionContextDef';

const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export { useSubscription };
