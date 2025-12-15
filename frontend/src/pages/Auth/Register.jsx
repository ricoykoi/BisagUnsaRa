import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import { registerUser } from "../../services/userService";
import logo from "/src/assets/furfurlogo.png";

// Color scheme constants
const COLORS = {
  beige: "#ffd68e",
  darkBrown: "#55423c",
  coffeeBrown: "#c18742",
  grayBrown: "#795225",
  white: "#ffffff",
  lightGray: "#f5f5f5",
};

// Password validation function
const validatePassword = (password) => {
  return {
    hasMinLength: password.length >= 12,
    hasNumber: /\d/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    noLeadingTrailingSpaces:
      password === password.trim() && password.length > 0,
  };
};

const isPasswordValid = (password) => {
  const validation = validatePassword(password);
  return Object.values(validation).every((v) => v === true);
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthenticationContext);

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isFormValid =
    username && email && isPasswordValid(password) && passwordsMatch;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (!isPasswordValid(password)) {
      alert("Password does not meet the requirements");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // send data to backend
      const response = await registerUser({
        username,
        email,
        password,
      });

      // backend success
      const createdUser = response.user;

      // save user to session storage
      setUser(createdUser);

      alert("Account created successfully!");

      // Redirect to the login page
      navigate("/dashboard");
    } catch (err) {
      console.log("Register error:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: COLORS.beige }}
    >
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="FurFur Logo"
            className="w-48 h-48 mx-auto mb-4 rounded-full shadow-lg object-cover"
          />
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: COLORS.darkBrown }}
          >
            Create Account
          </h1>
          <p className="text-lg" style={{ color: COLORS.grayBrown }}>
            Join FurFur Pet Care & Feeding Tracker
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.coffeeBrown,
                color: COLORS.darkBrown,
              }}
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
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
              onFocus={() => setShowPasswordRequirements(true)}
              onBlur={() => setShowPasswordRequirements(false)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.coffeeBrown,
                color: COLORS.darkBrown,
              }}
            />
          </div>

          {/* Password Requirements */}
          {(showPasswordRequirements || password.length > 0) && (
            <div
              className="p-4 rounded-lg border-l-4"
              style={{
                backgroundColor: "#f9f9f9",
                borderLeftColor: COLORS.coffeeBrown,
              }}
            >
              <h4
                className="text-sm font-bold mb-3"
                style={{ color: COLORS.darkBrown }}
              >
                Password must contain:
              </h4>

              <div className="space-y-2">
                <div className="flex items-center">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      passwordValidation.hasMinLength
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {passwordValidation.hasMinLength ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-sm ${
                      passwordValidation.hasMinLength
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    At least 12 characters
                  </span>
                </div>

                <div className="flex items-center">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      passwordValidation.hasNumber
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {passwordValidation.hasNumber ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-sm ${
                      passwordValidation.hasNumber
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    1 number
                  </span>
                </div>

                <div className="flex items-center">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      passwordValidation.hasLowercase
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {passwordValidation.hasLowercase ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-sm ${
                      passwordValidation.hasLowercase
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    1 lowercase letter
                  </span>
                </div>

                <div className="flex items-center">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      passwordValidation.hasUppercase
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {passwordValidation.hasUppercase ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-sm ${
                      passwordValidation.hasUppercase
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    1 uppercase letter
                  </span>
                </div>

                <div className="flex items-center">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${
                      passwordValidation.noLeadingTrailingSpaces
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {passwordValidation.noLeadingTrailingSpaces ? "✓" : "○"}
                  </span>
                  <span
                    className={`text-sm ${
                      passwordValidation.noLeadingTrailingSpaces
                        ? "text-green-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    No leading or trailing spaces
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Password Match Indicator */}
          {password.length > 0 && (
            <div
              className={`p-3 rounded-lg border-l-4 ${
                passwordsMatch
                  ? "bg-green-50 border-green-500"
                  : "bg-yellow-50 border-yellow-500"
              }`}
            >
              <span
                className={`text-sm font-medium ${
                  passwordsMatch ? "text-green-700" : "text-yellow-700"
                }`}
              >
                {passwordsMatch
                  ? "✓ Passwords match"
                  : "✗ Passwords do not match"}
              </span>
            </div>
          )}

          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all"
              style={{
                backgroundColor: COLORS.white,
                borderColor: COLORS.coffeeBrown,
                color: COLORS.darkBrown,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
              isFormValid
                ? "hover:scale-105 shadow-lg cursor-pointer"
                : "opacity-60 cursor-not-allowed"
            }`}
            style={{
              backgroundColor: isFormValid ? COLORS.coffeeBrown : "#cccccc",
              color: COLORS.white,
            }}
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="font-medium underline transition-all hover:opacity-80"
            style={{ color: COLORS.darkBrown }}
          >
            Already have an account? Login
          </Link>
        </div>

        {/* Demo Info */}
        <div className="mt-8 p-4 rounded-lg bg-white bg-opacity-50 border border-white border-opacity-30">
          <h4
            className="font-bold text-center mb-2 text-sm"
            style={{ color: COLORS.darkBrown }}
          >
            Demo Information
          </h4>
          <p
            className="text-xs text-center"
            style={{ color: COLORS.grayBrown }}
          >
            All accounts start with Free Plan. You can upgrade later in the app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
