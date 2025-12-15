import React, { useContext } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationContext";
import { useSubscription } from "../context/useSubscriptionHook";
import NotificationDropdown from "../components/NotificationDropdown";

const Header = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthenticationContext);
  const { currentPlan } = useSubscription();
  
  // Format plan name for display
  const getPlanDisplayName = (plan) => {
    if (!plan) return "Free Plan User";
    if (plan === "Free Mode") return "Free Plan User";
    if (plan === "Premium Tier 1") return "Premium Tier 1 User";
    if (plan === "Premium Tier 2") return "Premium Tier 2 User";
    return `${plan} User`;
  };

  return (
    <header className="bg-white p-4 flex justify-between items-center border-b border-[#e8d7ca]">
      <div>
        {/* This can be a logo or a page title */}
      </div>
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        {user && (
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#ffd68e]"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffd68e] to-[#c18742] flex items-center justify-center text-white font-bold text-lg">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-bold text-[#55423c]">{user.username}</div>
              <div className="text-xs text-[#795225] font-medium">{getPlanDisplayName(currentPlan)}</div>
            </div>
            <ChevronDown size={20} className="text-[#795225]" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;