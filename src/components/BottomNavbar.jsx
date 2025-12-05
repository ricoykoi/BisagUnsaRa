import React from "react";
import { Home, PawPrint, Crown, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BottomNavbar = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16">
      <div className="flex h-full">
        <button
          onClick={() => navigateTo("/dashboard")}
          className="flex-1 flex flex-col items-center justify-center border-t-2 border-[#c18742] text-[#c18742] font-bold"
        >
          <Home size={20} />
          <span className="text-xs mt-1">Dashboard</span>
        </button>
        <button
          onClick={() => navigateTo("/mypets")}
          className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
        >
          <PawPrint size={20} />
          <span className="text-xs mt-1">Pets</span>
        </button>
        <button
          onClick={() => navigateTo("/plans")}
          className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
        >
          <Crown size={20} />
          <span className="text-xs mt-1">Plans</span>
        </button>
        <button
          onClick={() => navigateTo("/export")}
          className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
        >
          <Download size={20} />
          <span className="text-xs mt-1">Export</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavbar;
