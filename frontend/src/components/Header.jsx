import React, { useContext } from "react";
import { User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationContext";
import { useSubscription } from "../context/useSubscriptionHook";
import NotificationDropdown from "./NotificationDropdown";

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

  const handleProfileClick = () => {
    navigate("/settings");
  };


  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <header className="bg-[#55423c] text-white p-4 shadow-lg">
      <div className="flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#ffd68e] flex items-center justify-center">
            <img
              src="/src/assets/furfurlogo.png"
              alt="FurFur Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div className="md:block hidden">
            <h1 className="text-xl font-bold">fur fur</h1>
            <p className="text-xs text-[#e8d7ca] opacity-80">
              Pet Care Companion
            </p>
          </div>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationDropdown />

          {/* Settings */}
          <button
            onClick={handleSettingsClick}
            className="p-2 rounded-full hover:bg-[#6a524a] transition-colors"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          {/* User Profile */}
          <button
            onClick={handleSettingsClick}
            className="flex items-center gap-3 p-2 pl-3 rounded-lg hover:bg-[#6a524a] transition-colors"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#ffd68e]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#ffd68e] flex items-center justify-center">
                <User size={18} className="text-[#55423c]" />
              </div>
            )}
            <div className="text-left">
              <p className="font-medium text-sm">{user?.username}</p>
              <p className="text-xs text-[#e8d7ca] opacity-80">{getPlanDisplayName(currentPlan)}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
