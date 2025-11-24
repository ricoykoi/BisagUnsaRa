import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { 
  LogOut, 
  Home, 
  PawPrint, 
  Crown, 
  Download,
  Check,
  Star
} from 'lucide-react';
import { useSubscription } from '../context/useSubscriptionHook';

const Plans = () => {
  const navigate = useNavigate();
  const { currentPlan, upgradePlan } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);

  const navigateTo = (route) => {
    navigate(route);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = () => {
    if (selectedPlan !== currentPlan) {
      alert(`✓ Subscription Updated\nYou are now subscribed to ${selectedPlan}!`);
      upgradePlan(selectedPlan);
      navigate('/dashboard');
    } else {
      alert('You are already subscribed to this plan.');
    }
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      navigate('/');
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free Mode',
      displayName: 'Free Plan',
      price: '₱0',
      features: [
        'Basic pet profile',
        'Limited care reminders',
        'Up to 2 pet profiles'
      ],
      current: currentPlan === 'Free Mode'
    },
    {
      id: 'premium1',
      name: 'Premium Tier 1',
      displayName: 'Premium Tier 1',
      price: '₱49.99',
      features: [
        'Everything in Free Plan',
        'Up to 5 pet profiles',
        'Unlock Health Records'
      ],
      current: currentPlan === 'Premium Tier 1'
    },
    {
      id: 'premium2',
      name: 'Premium Tier 2',
      displayName: 'Premium Tier 2',
      price: '₱99.99',
      features: [
        'Everything in Premium Tier 1',
        'Up to 10 pet profiles',
        'Unlock Pet Care Tip Feeds',
        'Unlock export schedule'
      ],
      current: currentPlan === 'Premium Tier 2'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#55423c] text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Subscription Plans</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-[#ffd68e] text-[#55423c] px-3 py-2 rounded-lg font-medium hover:bg-[#e6c27d] transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="p-6">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#55423c] mb-2">Choose Your Plan</h1>
            <p className="text-[#795225] text-lg">Select the best plan for your pet care needs</p>
          </div>

          {/* Current Plan Display */}
          <div className="bg-[#ffd68e] rounded-xl p-4 mb-8 text-center">
            <p className="font-bold text-[#55423c] text-lg">
              Current Plan: {currentPlan}
            </p>
          </div>

          {/* Plans Grid */}
          <div className="space-y-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-200 cursor-pointer ${
                  selectedPlan === plan.name
                    ? 'border-[#c18742] shadow-xl'
                    : 'border-transparent hover:shadow-xl'
                }`}
                onClick={() => handleSelectPlan(plan.name)}
              >
                {/* Plan Header */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <Crown className={`${
                      plan.name === 'Free Mode' ? 'text-gray-400' : 'text-[#c18742]'
                    }`} size={24} />
                    <h3 className="text-xl font-bold text-[#55423c]">{plan.displayName}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#c18742]">{plan.price}</div>
                    {plan.name !== 'Free Mode' && (
                      <div className="text-sm text-gray-500">per month</div>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-[#ffd68e] rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-[#55423c]" />
                      </div>
                      <span className="text-[#795225]">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Current Plan Badge */}
                {plan.current && (
                  <div className="bg-[#ffd68e] rounded-full px-4 py-2 inline-block">
                    <span className="text-[#55423c] font-medium text-sm">Current Plan</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Subscribe Button */}
          <button
            onClick={handleSubscribe}
            disabled={selectedPlan === currentPlan}
            className={`w-full py-4 rounded-xl font-bold text-lg mt-8 transition-all duration-200 ${
              selectedPlan === currentPlan
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#c18742] hover:bg-[#a87338] transform hover:scale-105'
            }`}
          >
            <span className="text-white">
              {selectedPlan === currentPlan ? 'Current Plan' : 'Subscribe Now'}
            </span>
          </button>

          {/* Feature Comparison */}
          <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-[#55423c] mb-6 text-center">
              Plan Comparison
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="md:col-span-1 font-medium text-[#55423c]">
                <div className="p-3 border-b">Features</div>
                <div className="p-3 border-b">Pet Profiles</div>
                <div className="p-3 border-b">Health Records</div>
                <div className="p-3 border-b">Care Tips</div>
                <div className="p-3 border-b">Export Feature</div>
                <div className="p-3">Price</div>
              </div>
              
              {plans.map((plan) => (
                <div key={plan.id} className="text-center">
                  <div className="p-3 border-b font-medium text-[#55423c] bg-gray-50">
                    {plan.displayName}
                  </div>
                  <div className="p-3 border-b text-[#795225]">
                    {plan.name === 'Free Mode' ? '2' : plan.name === 'Premium Tier 1' ? '5' : '10'}
                  </div>
                  <div className="p-3 border-b">
                    {plan.name === 'Free Mode' ? (
                      <span className="text-red-500">✗</span>
                    ) : (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                  <div className="p-3 border-b">
                    {plan.name === 'Premium Tier 2' ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </div>
                  <div className="p-3 border-b">
                    {plan.name === 'Premium Tier 2' ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✗</span>
                    )}
                  </div>
                  <div className="p-3 font-bold text-[#c18742]">
                    {plan.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-gray-600">
            <p>All plans include basic pet care features. Upgrade to unlock more capabilities!</p>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16">
        <div className="flex h-full">
          <button
            onClick={() => navigateTo('/dashboard')}
            className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => navigateTo('/mypets')}
            className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
          >
            <PawPrint size={20} />
            <span className="text-xs mt-1">Pets</span>
          </button>
          <button className="flex-1 flex flex-col items-center justify-center border-t-2 border-[#c18742] text-[#c18742] font-bold">
            <Crown size={20} />
            <span className="text-xs mt-1">Plans</span>
          </button>
          <button
            onClick={() => navigateTo('/export')}
            className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
          >
            <Download size={20} />
            <span className="text-xs mt-1">Export</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Plans;