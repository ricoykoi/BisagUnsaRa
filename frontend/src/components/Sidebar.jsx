import React, { useContext } from "react";
import { Home, PawPrint, Crown, Download, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../context/AuthenticationContext";
import { useSubscription } from "../context/useSubscriptionHook";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthenticationContext);
  const { currentPlan } = useSubscription();
  
  // Format plan name for display
  const getPlanDisplayName = (plan) => {
    if (!plan) return "Free Plan User";
    if (plan === "Free Mode") return "Free Plan User";
    if (plan === "Premium Tier 1") return "Premium Tier 1 User";
    if (plan === "Premium Tier 2") return "Premium Tier 2 User";
    return `${plan} User`;
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 flex flex-col">
      {/* Top navigation section */}
      <div className="flex-1 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#795225] mb-4">Menu</h2>
          <div className="space-y-2">
            <button
              onClick={() => navigateTo("/dashboard")}
              className="flex items-center gap-3 p-3 rounded-lg text-[#795225] hover:bg-gray-100 transition-colors w-full text-left"
            >
              <Home size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button
              onClick={() => navigateTo("/mypets")}
              className="flex items-center gap-3 p-3 rounded-lg text-[#795225] hover:bg-gray-100 transition-colors w-full text-left"
            >
              <PawPrint size={20} />
              <span className="font-medium">Pets</span>
            </button>
            <button
              onClick={() => navigateTo("/plans")}
              className="flex items-center gap-3 p-3 rounded-lg text-[#795225] hover:bg-gray-100 transition-colors w-full text-left"
            >
              <Crown size={20} />
              <span className="font-medium">Plans</span>
            </button>
            <button
              onClick={() => navigateTo("/export")}
              className="flex items-center gap-3 p-3 rounded-lg text-[#795225] hover:bg-gray-100 transition-colors w-full text-left"
            >
              <Download size={20} />
              <span className="font-medium">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom user and logout section */}
      <div className="border-t border-gray-200 p-4">
        {/* User info */}
        <button
          onClick={() => navigateTo("/settings")}
          className="flex items-center gap-3 p-3 mb-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors w-full text-left"
        >
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-8 h-8 rounded-full object-cover border-2 border-[#ffd68e]"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#ffd68e] flex items-center justify-center">
              <User size={18} className="text-[#795225]" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800">{user.username}</p>
            <p className="text-xs text-gray-500">{getPlanDisplayName(currentPlan)}</p>
          </div>
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full text-left border border-gray-200 hover:border-gray-300"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
