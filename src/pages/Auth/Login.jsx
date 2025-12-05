import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Color scheme constants
const COLORS = {
  beige: "#ffd68e",
  darkBrown: "#55423c",
  coffeeBrown: "#c18742",
  grayBrown: "#795225",
  white: "#ffffff",
  lightGray: "#f5f5f5",
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: COLORS.beige }}
    >
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <img
            src="/src/assets/furfurlogo.png"
            alt="FurFur Logo"
            className="w-48 h-48 mx-auto mb-6 rounded-full shadow-lg object-cover"
          />
          <h1
            className="text-4xl font-bold mb-3"
            style={{ color: COLORS.darkBrown }}
          >
            FurFur
          </h1>
          <p className="text-lg" style={{ color: COLORS.grayBrown }}>
            Pet Care & Feeding Schedule Tracker
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.coffeeBrown,
                color: COLORS.darkBrown,
              }}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.coffeeBrown,
                color: COLORS.darkBrown,
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            style={{
              backgroundColor: COLORS.coffeeBrown,
              color: COLORS.white,
            }}
          >
            Login
          </button>
        </form>

        {/* Create Account Link */}
        <div className="text-center mt-8">
          <Link
            to="/register"
            className="font-medium underline transition-all hover:opacity-80"
            style={{ color: COLORS.darkBrown }}
          >
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
