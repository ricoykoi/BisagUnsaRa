import React from "react";
import { User, Bell, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
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
            <span className="text-[#55423c] font-bold text-lg">ff</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">fur fur</h1>
            <p className="text-xs text-[#e8d7ca] opacity-80">
              Pet Care Companion
            </p>
          </div>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button
            onClick={handleNotificationsClick}
            className="relative p-2 rounded-full hover:bg-[#6a524a] transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ffd68e] rounded-full"></span>
          </button>

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
            onClick={handleProfileClick}
            className="flex items-center gap-3 p-2 pl-3 rounded-lg hover:bg-[#6a524a] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-[#ffd68e] flex items-center justify-center">
              <User size={18} className="text-[#55423c]" />
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">Rex</p>
              <p className="text-xs text-[#e8d7ca] opacity-80">Premium</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
