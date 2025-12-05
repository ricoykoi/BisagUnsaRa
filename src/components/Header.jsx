
import React from 'react';
import { LogOut } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });
  };

  return (
    <header className="bg-[#55423c] text-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">fur fur</h1>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-[#ffd68e] text-[#55423c] px-3 py-2 rounded-lg font-medium hover:bg-[#e6c27d] transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
