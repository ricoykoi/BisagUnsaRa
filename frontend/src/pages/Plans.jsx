import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  PawPrint,
  Crown,
  Download,
  Check,
  Star,
  Shield,
  Zap,
  Users,
  FileText,
  Bell,
  ChevronRight,
  Award,
  TrendingUp,
  Heart,
  Sparkles,
} from "lucide-react";
import { useSubscription } from "../context/useSubscriptionHook";

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
      alert(
        `✓ Subscription Updated\nYou are now subscribed to ${selectedPlan}!`
      );
      upgradePlan(selectedPlan);
      navigate("/dashboard");
    } else {
      alert("You are already subscribed to this plan.");
    }
  };

  const plans = [
    {
      id: "free",
      name: "Free Mode",
      displayName: "Free Plan",
      price: "₱0",
      priceLabel: "Forever Free",
      color: "from-gray-400 to-gray-500",
      textColor: "text-gray-700",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
      icon: <PawPrint className="text-gray-500" size={24} />,
      features: [
        "Basic pet profile",
        "Limited care reminders",
        "Up to 2 pet profiles",
      ],
      current: currentPlan === "Free Mode",
    },
    {
      id: "premium1",
      name: "Premium Tier 1",
      displayName: "Premium Tier 1",
      price: "₱49.99",
      priceLabel: "per month",
      color: "from-[#c18742] to-[#a87338]",
      textColor: "text-[#c18742]",
      bgColor: "bg-[#ffd68e]",
      borderColor: "border-[#c18742]",
      icon: <Crown className="text-[#c18742]" size={24} />,
      features: [
        "Everything in Free Plan",
        "Up to 5 pet profiles",
        "Unlock Health Records",
      ],
      current: currentPlan === "Premium Tier 1",
      recommended: true,
    },
    {
      id: "premium2",
      name: "Premium Tier 2",
      displayName: "Premium Tier 2",
      price: "₱99.99",
      priceLabel: "per month",
      color: "from-[#55423c] to-[#6a524a]",
      textColor: "text-[#55423c]",
      bgColor: "bg-[#e8d7ca]",
      borderColor: "border-[#55423c]",
      icon: <Award className="text-[#55423c]" size={24} />,
      features: [
        "Everything in Premium Tier 1",
        "Up to 10 pet profiles",
        "Unlock Pet Care Tip Feeds",
        "Unlock export schedule",
      ],
      current: currentPlan === "Premium Tier 2",
    },
  ];

  const featureComparison = [
    { name: "Pet Profiles", free: "2", premium1: "5", premium2: "10" },
    { name: "Health Records", free: "✗", premium1: "✓", premium2: "✓" },
    { name: "Care Tips Feed", free: "✗", premium1: "✗", premium2: "✓" },
    { name: "Export Feature", free: "✗", premium1: "✗", premium2: "✓" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f6f4]">
      {/* Header Section */}
      <div className="bg-white p-6">
        <div className="auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-3 text-[#55423c]">
              Choose Your Perfect Plan 🐾
            </h1>
            <p className="text-[#795225] text-lg">
              Select the best plan for your pet care needs
            </p>
          </div>

          {/* Current Plan Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffd68e] to-[#f2c97d] rounded-full px-6 py-3 border border-[#c18742] shadow-sm">
              <Crown size={20} className="text-[#55423c]" />
              <span className="font-semibold text-[#55423c]">
                Current Plan:{" "}
                <span className="text-[#795225]">{currentPlan}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto p-4 md:p-6">
        {/* Plans Row */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`flex-1 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                selectedPlan === plan.name
                  ? `ring-2 ring-offset-2 ${plan.borderColor}`
                  : ""
              } ${plan.current ? "ring-2 ring-offset-2 ring-green-500" : ""}`}
              onClick={() => handleSelectPlan(plan.name)}
            >
              {/* Plan Header */}
              <div className={`h-3 bg-gradient-to-r ${plan.color}`}></div>

              <div className="p-6 bg-white">
                {plan.recommended && (
                  <div className="flex justify-center mb-4">
                    <div className="bg-gradient-to-r from-[#c18742] to-[#a87338] text-white text-sm font-bold px-4 py-1.5 rounded-full inline-flex items-center gap-2">
                      <Star size={14} />
                      <span>MOST POPULAR</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${plan.bgColor}`}>
                      {plan.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#55423c]">
                        {plan.displayName}
                      </h3>
                      <p className={`text-sm font-semibold ${plan.textColor}`}>
                        {plan.priceLabel}
                      </p>
                    </div>
                  </div>

                  {plan.current && (
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                      ACTIVE
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-[#55423c]">
                    {plan.price}
                  </div>
                  {plan.name !== "Free Mode" && (
                    <div className="text-sm text-gray-500 mt-1">per month</div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`mt-1 p-1 rounded-full ${plan.bgColor}`}>
                        <Check size={14} className={plan.textColor} />
                      </div>
                      <span className="text-[#795225] text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Select Button */}
                <button
                  className={`w-full py-3 rounded-lg font-bold transition-all duration-200 ${
                    selectedPlan === plan.name
                      ? `bg-gradient-to-r ${plan.color} text-white transform scale-105`
                      : plan.current
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : `border-2 ${plan.borderColor} text-[#55423c] hover:bg-gradient-to-r hover:from-white/50 hover:to-transparent`
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPlan(plan.name);
                  }}
                >
                  {plan.current
                    ? "Current Plan"
                    : selectedPlan === plan.name
                    ? "Selected ✓"
                    : "Select Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe Button */}
        <div className="mb-10">
          <button
            onClick={handleSubscribe}
            disabled={selectedPlan === currentPlan}
            className={`w-full max-w-md mx-auto block py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
              selectedPlan === currentPlan
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#c18742] to-[#a87338] text-white hover:from-[#a87338] hover:to-[#8b5e2f] hover:shadow-xl transform hover:scale-[1.02]"
            }`}
          >
            <span className="flex items-center justify-center gap-3">
              {selectedPlan === currentPlan
                ? "Current Plan Active"
                : "Subscribe Now"}
              {selectedPlan !== currentPlan && <ChevronRight size={20} />}
            </span>
          </button>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#55423c] mb-2">
              Plan Comparison
            </h3>
            <p className="text-[#795225]">
              See how our plans stack up against each other
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f8f6f4]">
                  <th className="text-left p-4 font-semibold text-[#55423c] rounded-tl-lg">
                    Features
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className="text-center p-4 font-bold text-[#55423c]"
                    >
                      {plan.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-[#f8f6f4]"}
                  >
                    <td className="p-4 font-medium text-[#795225] border-r border-[#e8d7ca]">
                      {row.name}
                    </td>
                    <td className="text-center p-4">
                      <span
                        className={
                          row.free === "✓"
                            ? "text-green-600 font-bold"
                            : row.free === "✗"
                            ? "text-red-500"
                            : "text-gray-600"
                        }
                      >
                        {row.free}
                      </span>
                    </td>
                    <td className="text-center p-4">
                      <span
                        className={
                          row.premium1 === "✓"
                            ? "text-green-600 font-bold"
                            : row.premium1 === "✗"
                            ? "text-red-500"
                            : "text-gray-600"
                        }
                      >
                        {row.premium1}
                      </span>
                    </td>
                    <td className="text-center p-4 rounded-tr-lg">
                      <span
                        className={
                          row.premium2 === "✓"
                            ? "text-green-600 font-bold"
                            : row.premium2 === "✗"
                            ? "text-red-500"
                            : "text-gray-600"
                        }
                      >
                        {row.premium2}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gradient-to-r from-[#f8f6f4] to-[#e8d7ca] font-bold">
                  <td className="p-4 text-[#55423c] border-r border-[#e8d7ca] rounded-bl-lg">
                    Monthly Price
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="text-center p-4">
                      <div className={`text-xl font-bold ${plan.textColor}`}>
                        {plan.price}
                      </div>
                      {plan.name !== "Free Mode" && (
                        <div className="text-xs text-gray-600">
                          {plan.priceLabel}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-[#ffd68e] to-[#f2c97d] rounded-2xl p-6 border border-[#c18742] text-center">
          <p className="text-[#795225] font-medium">
            All plans include basic pet care features. Upgrade to unlock more
            capabilities!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Plans;
