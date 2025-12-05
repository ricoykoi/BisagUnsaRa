
import React from 'react';
import { Home, PawPrint, Crown, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64">
      <div className="flex flex-col p-4">
        <button
          onClick={() => navigateTo('/dashboard')}
          className="flex items-center gap-4 p-4 rounded-lg text-[#795225] hover:bg-gray-100 transition-colors"
        >
          <Home size={20} />
          <span className="font-medium">Home</span>
        </button>
        <button
          onClick={() => navigateTo('/mypets')}
          className="flex items-center gap-4 p-4 rounded-lg text-[#795225] hover:bg-gray-100 transition-colors"
        >
          <PawPrint size={20} />
          <span className="font-medium">Pets</span>
        </button>
        <button
          onClick={() => navigateTo('/plans')}
          className="flex items-center gap-4 p-4 rounded-lg text-[#795225] hover:bg-gray-100 transition-colors"
        >
          <Crown size={20} />
          <span className="font-medium">Plans</span>
        </button>
        <button
          onClick={() => navigateTo('/export')}
          className="flex items-center gap-4 p-4 rounded-lg text-[#795225] hover:bg-gray-100 transition-colors"
        >
          <Download size={20} />
          <span className="font-medium">Export</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
