import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Color scheme constants
const COLORS = {
  beige: '#ffd68e',
  darkBrown: '#55423c',
  coffeeBrown: '#c18742',
  grayBrown: '#795225',
  white: '#ffffff',
  lightGray: '#f5f5f5'
}

// Static user data for demo purposes
const staticUsers = [
  {
    id: "1",
    username: "demo",
    password: "password",
    name: "Demo User",
    subscriptionPlan: "Free Mode"
  },
  {
    id: "2", 
    username: "premium",
    password: "password",
    name: "Premium User",
    subscriptionPlan: "Premium Tier 2"
  }
];

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username || !password) {
      alert('Please enter both username and password')
      return
    }

    // Check against static users
    const user = staticUsers.find(u => u.username === username && u.password === password)
    
    if (user) {
      // Store user in localStorage for demo purposes
      localStorage.setItem('currentUser', JSON.stringify(user))
      navigate('/dashboard')
    } else {
      alert('Invalid username or password')
    }
  }

  const handleDemoLogin = () => {
    // Auto-fill demo credentials
    setUsername('demo')
    setPassword('password')
  }

  const handlePremiumDemo = () => {
    // Auto-fill premium demo credentials
    setUsername('premium')
    setPassword('password')
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: COLORS.beige }}
    >
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-lg">
            <div className="text-center">
              <span className="text-4xl">🐾</span>
              <div className="text-sm font-bold mt-1" style={{ color: COLORS.darkBrown }}>
                FurFur
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: COLORS.darkBrown }}>
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
                color: COLORS.darkBrown
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
                color: COLORS.darkBrown
              }}
            />
          </div>

          {/* Demo Login Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              style={{ 
                backgroundColor: COLORS.coffeeBrown,
                color: COLORS.white
              }}
            >
              Login
            </button>

            <div className="text-center text-sm space-y-2">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="block w-full py-3 rounded-lg border-2 transition-all hover:bg-white hover:bg-opacity-50"
                style={{ 
                  borderColor: COLORS.coffeeBrown,
                  color: COLORS.darkBrown
                }}
              >
                🐕 Demo Login (Free Plan)
              </button>
              
              <button
                type="button"
                onClick={handlePremiumDemo}
                className="block w-full py-3 rounded-lg border-2 transition-all hover:bg-white hover:bg-opacity-50"
                style={{ 
                  borderColor: COLORS.coffeeBrown,
                  color: COLORS.darkBrown
                }}
              >
                🐈 Premium Demo (Tier 2)
              </button>
            </div>
          </div>
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

        {/* Demo Credentials Info */}
        <div className="mt-12 p-4 rounded-lg bg-white bg-opacity-50 border border-white border-opacity-30">
          <h3 className="font-bold text-center mb-2" style={{ color: COLORS.darkBrown }}>
            Demo Credentials
          </h3>
          <div className="text-sm space-y-1" style={{ color: COLORS.grayBrown }}>
            <div><strong>Free Plan:</strong> demo / password</div>
            <div><strong>Premium Tier 2:</strong> premium / password</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login