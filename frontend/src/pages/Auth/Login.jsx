import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PawPrint, Lock, User, Eye, EyeOff } from "lucide-react";
import { loginUser } from "../../services/userService";
import { AuthenticationContext } from "../../context/AuthenticationContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      const response = await loginUser({
        username: username,
        password: password,
      });

      // set user in context
      setUser(response.user);

      alert("Login successful!");
    } catch (err) {
      console.log("Login error:", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f6f4] via-[#ffd68e] to-[#f2c97d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Simplified Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <img
                src="/src/assets/furfurlogo.png"
                alt="FurFur Logo"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#55423c]">FurFur</h1>
              <p className="text-[#795225] text-sm">Pet Care Tracker</p>
            </div>
          </div>
          <p className="text-[#795225]">
            Sign in to manage your pet's care schedule
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#e8d7ca]">
          <h2 className="text-2xl font-bold text-[#55423c] mb-6 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-[#795225] mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <User size={20} className="text-[#c18742]" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-[#55423c]"
                  style={{
                    backgroundColor: "#f8f6f4",
                    borderColor: "#e8d7ca",
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-[#795225] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock size={20} className="text-[#c18742]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all text-[#55423c]"
                  style={{
                    backgroundColor: "#f8f6f4",
                    borderColor: "#e8d7ca",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#795225] hover:text-[#55423c]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg bg-gradient-to-r from-[#c18742] to-[#a87338] hover:from-[#a87338] hover:to-[#8b5e2f] transform hover:scale-[1.02] text-white"
            >
              Sign In
            </button>
          </form>

          {/* Create Account Link */}
          <div className="text-center mt-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 font-medium text-[#c18742] hover:text-[#55423c] transition-colors"
            >
              <PawPrint size={18} />
              <span>Create New Account</span>
            </Link>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-[#795225]">
            © 2024 FurFur. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
