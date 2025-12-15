import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Moon,
  Sun,
  LogOut,
  Trash2,
  Download,
  Lock,
  CreditCard,
  HelpCircle,
  ChevronRight,
  Check,
  Globe,
  Volume2,
  Calendar,
  Settings as SettingsIcon,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Key,
  Users,
  Heart,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import { useSubscription } from "../context/useSubscriptionHook";
import { 
  updateProfilePicture,
  updateUsername,
  updateEmail, 
  changePassword,
  updateUserSettings, 
  deleteAccount 
} from "../services/userService";
import { Upload, X } from "lucide-react";


// Color scheme matching your app
const COLORS = {
  beige: "#ffd68e",
  darkBrown: "#55423c",
  coffeeBrown: "#c18742",
  grayBrown: "#795225",
  white: "#ffffff",
  lightGray: "#f5f5f5",
  red: "#ef4444",
  green: "#10b981",
};

const Settings = () => {
  const { user, setUser, logout } = useContext(AuthenticationContext);
  const { currentPlan } = useSubscription();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showUsernameForm, setShowUsernameForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const fileInputRef = useRef(null);

  // Settings states - initialized from user context
  const [settings, setSettings] = useState(user?.settings || {});

  // Update local settings state if user object changes
  React.useEffect(() => {
    setSettings(user?.settings || {});
  }, [user]);

  // User data from context
  const userData = user ? {
    username: user.username || "User",
    email: user.email || "user@example.com",
    plan: currentPlan || "Free Mode",
    joinedDate: user.createdAt || new Date().toISOString().split('T')[0],
  } : {
    username: "petlover123",
    email: "user@example.com",
    plan: "Free Mode",
    joinedDate: "2024-01-15",
  };

  // Navigation animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  // Handlers
  const handleLogout = () => {
    logout();
    navigate("/"); // Assuming root is login or public page
  };

  // Password validation function (same as Register.jsx)
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

  // Handle profile picture upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
        try {
          const response = await updateProfilePicture(user._id, base64String);
          setUser(response.user);
          alert("Profile picture updated successfully!");
        } catch (error) {
          console.error("Failed to update profile picture:", error);
          alert(error.response?.data?.message || "Failed to update profile picture.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle username change
  const handleChangeUsername = async () => {
    if (!newUsername || newUsername.trim().length === 0) {
      alert("Please enter a valid username!");
      return;
    }

    if (newUsername.trim() === user.username) {
      alert("New username is the same as current username!");
      return;
    }

    try {
      const response = await updateUsername(user._id, newUsername.trim());
      setUser(response.user);
      setShowUsernameForm(false);
      setNewUsername("");
      alert("Username updated successfully!");
    } catch (error) {
      console.error("Failed to update username:", error);
      alert(error.response?.data?.message || "Failed to update username.");
    }
  };

  // Handle email change
  const handleChangeEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      alert("Please enter a valid email address!");
      return;
    }

    if (newEmail.trim() === user.email) {
      alert("New email is the same as current email!");
      return;
    }

    try {
      const response = await updateEmail(user._id, newEmail.trim());
      setUser(response.user);
      setShowEmailForm(false);
      setNewEmail("");
      alert("Email updated successfully!");
    } catch (error) {
      console.error("Failed to update email:", error);
      alert(error.response?.data?.message || "Failed to update email.");
    }
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (!currentPassword || !newPassword) {
      alert("Please fill in all password fields!");
      return;
    }

    if (!isPasswordValid(newPassword)) {
      alert("Password does not meet the requirements!");
      return;
    }

    try {
      await changePassword(user._id, currentPassword, newPassword);
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Password change failed:", error);
      alert(error.response?.data?.message || "Failed to change password.");
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete") {
      alert('Please type "delete" to confirm account deletion.');
      return;
    }

    try {
      await deleteAccount(user._id);
      alert("Account deleted successfully.");
      logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert(error.response?.data?.message || "Failed to delete account.");
    }
  };

  // Generic handler to update a setting and persist it
  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings };

    // Handle nested notification settings
    if (key.startsWith("notifications.")) {
      const notificationKey = key.split(".")[1];
      newSettings.notifications = {
        ...newSettings.notifications,
        [notificationKey]: value,
      };
    } else {
      newSettings[key] = value;
    }

    setSettings(newSettings); // Optimistic UI update

    try {
      const response = await updateUserSettings(user._id, newSettings);
      setUser(response.user); // Update context with the latest user object from backend
    } catch (error) {
      console.error(`Failed to update setting ${key}:`, error);
      alert(error.response?.data?.message || `Failed to save setting: ${key}.`);
      setSettings(user.settings); // Revert on failure
    }
  };

  const exportData = () => {
    const data = {
      user: userData,
      pets: [], // Assuming pets are not in settings context
      settings: {
        ...settings
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `furfur-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Settings sections
  const settingsSections = [
    {
      title: "Account",
      icon: <User size={20} />,
      items: [
        {
          icon: <User size={18} />,
          label: "Username",
          value: userData.username,
          color: COLORS.coffeeBrown,
          onClick: () => setShowUsernameForm(true),
        },
        {
          icon: <Mail size={18} />,
          label: "Email",
          value: userData.email,
          color: COLORS.coffeeBrown,
          onClick: () => setShowEmailForm(true),
        },
        {
          icon: <CreditCard size={18} />,
          label: "Subscription Plan",
          value: currentPlan || "Free Mode",
          badgeColor:
            currentPlan && currentPlan !== "Free Mode" ? COLORS.green : COLORS.grayBrown,
          onClick: () => navigate("/plans"),
        },
      ],
    },
    {
      title: "Notifications",
      icon: <Bell size={20} />,
      items: [
        {
          icon: <Clock size={18} />,
          label: "Reminder Notifications",
          type: "toggle",
          toggleValue: settings.notifications?.reminders ?? true,
          color: COLORS.coffeeBrown,
          onToggle: () => handleSettingChange("notifications.reminders", !settings.notifications?.reminders),
        },
      ],
    },
    {
      title: "Security",
      icon: <Shield size={20} />,
      items: [
        {
          icon: <Lock size={18} />,
          label: "Change Password",
          type: "action",
          onClick: () => setShowPasswordForm(true),
          color: COLORS.coffeeBrown,
        },
      ],
    },
    {
      title: "About",
      icon: <HelpCircle size={20} />,
      items: [
        {
          icon: <Calendar size={18} />,
          label: "Member Since",
          value: new Date(userData.joinedDate).toLocaleDateString(), // Reverted to mock
          color: COLORS.coffeeBrown,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: COLORS.coffeeBrown }}
            >
              <SettingsIcon size={24} color={COLORS.white} />
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: COLORS.darkBrown }}
              >
                Settings
              </h1>
              <p className="text-sm" style={{ color: COLORS.grayBrown }}>
                Manage your FurFur account and preferences
              </p>
            </div>
          </div>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          variants={itemVariants}
          className="mb-8 p-6 rounded-2xl shadow-lg"
          style={{ backgroundColor: COLORS.white }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={userData.username}
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  />
                ) : (
                  <div 
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffd68e] to-[#c18742] flex items-center justify-center border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="text-2xl font-bold text-white">
                      {userData.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#c18742] flex items-center justify-center border-2 border-white shadow-lg hover:bg-[#a87338] transition-colors"
                  title="Change profile picture"
                >
                  <Upload size={12} className="text-white" />
                </button>
              </div>
              <div>
                <h2
                  className="text-xl font-bold"
                  style={{ color: COLORS.darkBrown }}
                >
                  {userData.username}
                </h2>
                <p className="text-sm" style={{ color: COLORS.grayBrown }}>
                  {userData.email}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="px-2 py-1 text-xs rounded-full font-medium"
                    style={{
                      backgroundColor:
                        userData.plan === "Premium" ? "#d1fae5" : "#f3f4f6",
                      color:
                        userData.plan === "Premium"
                          ? COLORS.green
                          : COLORS.grayBrown,
                    }}
                  >
                    {userData.plan}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: COLORS.lightGray,
                color: COLORS.darkBrown,
              }}
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              variants={itemVariants}
              className="rounded-2xl overflow-hidden shadow-lg"
              style={{ backgroundColor: COLORS.white }}
            >
              {/* Section Header */}
              <div
                className="p-4 border-b"
                style={{ borderColor: COLORS.lightGray }}
              >
                <div className="flex items-center gap-3">
                  <div style={{ color: COLORS.coffeeBrown }}>
                    {section.icon}
                  </div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: COLORS.darkBrown }}
                  >
                    {section.title}
                  </h3>
                </div>
              </div>

              {/* Section Items */}
              <div
                className="divide-y"
                style={{ borderColor: COLORS.lightGray }}
              >
                {section.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={
                      item.onClick ||
                      (item.type === "toggle" ? item.onToggle : undefined)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          style={{ color: item.color || COLORS.coffeeBrown }}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <div
                            className="font-medium"
                            style={{ color: COLORS.darkBrown }}
                          >
                            {item.label}
                          </div>
                          {item.value && (
                            <div
                              className="text-sm mt-0.5"
                              style={{ color: COLORS.grayBrown }}
                            >
                              {item.value}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Toggle Switch */}
                        {item.type === "toggle" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              item.onToggle();
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              item.toggleValue ? "bg-green-500" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                item.toggleValue
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        )}

                        {/* Select Options */}
                        {item.type === "select" && (
                          <select
                            value={item.currentValue}
                            onChange={(e) => item.onChange(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2"
                            style={{
                              borderColor: COLORS.coffeeBrown,
                              color: COLORS.darkBrown,
                            }}
                          >
                            {item.options.map((option) => (
                              <option key={option} value={option.toLowerCase()}>
                                {option}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Badge */}
                        {item.badgeColor && (
                          <span
                            className="px-2 py-1 text-xs rounded-full font-medium"
                            style={{
                              backgroundColor: `${item.badgeColor}20`,
                              color: item.badgeColor,
                            }}
                          >
                            {item.value}
                          </span>
                        )}

                        {/* Chevron for clickable items */}
                        {(item.onClick || item.type === "action") && (
                          <ChevronRight
                            size={18}
                            style={{ color: COLORS.grayBrown }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Danger Zone */}
        <motion.div
          variants={itemVariants}
          className="mt-8 p-6 rounded-2xl shadow-lg border-2"
          style={{
            backgroundColor: COLORS.white,
            borderColor: COLORS.red,
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle size={24} color={COLORS.red} />
            <h3
              className="text-lg font-bold"
              style={{ color: COLORS.darkBrown }}
            >
              Danger Zone
            </h3>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 w-full rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                backgroundColor: COLORS.red,
                color: COLORS.white,
              }}
            >
              <Trash2 size={18} />
              Delete Account
            </button>

            <p
              className="text-sm text-center"
              style={{ color: COLORS.grayBrown }}
            >
              Warning: This action cannot be undone. All your data will be
              permanently deleted.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: COLORS.darkBrown }}
              >
                Change Password
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: COLORS.darkBrown }}
                  >
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                      style={{
                        borderColor: COLORS.coffeeBrown,
                        color: COLORS.darkBrown,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: COLORS.grayBrown }}
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: COLORS.darkBrown }}
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onFocus={() => setShowPasswordRequirements(true)}
                      onBlur={() => setShowPasswordRequirements(false)}
                      className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                      style={{
                        borderColor: COLORS.coffeeBrown,
                        color: COLORS.darkBrown,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      style={{ color: COLORS.grayBrown }}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {/* Password Requirements */}
                  {(showPasswordRequirements || newPassword.length > 0) && (
                    <div
                      className="mt-2 p-3 rounded-lg border-l-4 text-xs"
                      style={{
                        backgroundColor: "#f9f9f9",
                        borderLeftColor: COLORS.coffeeBrown,
                      }}
                    >
                      {(() => {
                        const validation = validatePassword(newPassword);
                        return (
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs mr-2 ${
                                validation.hasMinLength ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                              }`}>
                                {validation.hasMinLength ? "✓" : "○"}
                              </span>
                              <span className={validation.hasMinLength ? "text-green-600" : "text-gray-600"}>
                                At least 12 characters
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs mr-2 ${
                                validation.hasNumber ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                              }`}>
                                {validation.hasNumber ? "✓" : "○"}
                              </span>
                              <span className={validation.hasNumber ? "text-green-600" : "text-gray-600"}>
                                1 number
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs mr-2 ${
                                validation.hasLowercase ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                              }`}>
                                {validation.hasLowercase ? "✓" : "○"}
                              </span>
                              <span className={validation.hasLowercase ? "text-green-600" : "text-gray-600"}>
                                1 lowercase letter
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs mr-2 ${
                                validation.hasUppercase ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                              }`}>
                                {validation.hasUppercase ? "✓" : "○"}
                              </span>
                              <span className={validation.hasUppercase ? "text-green-600" : "text-gray-600"}>
                                1 uppercase letter
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs mr-2 ${
                                validation.noLeadingTrailingSpaces ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"
                              }`}>
                                {validation.noLeadingTrailingSpaces ? "✓" : "○"}
                              </span>
                              <span className={validation.noLeadingTrailingSpaces ? "text-green-600" : "text-gray-600"}>
                                No leading or trailing spaces
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: COLORS.darkBrown }}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                    style={{
                      borderColor: COLORS.coffeeBrown,
                      color: COLORS.darkBrown,
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 px-4 py-2 rounded-lg font-medium"
                    style={{
                      backgroundColor: COLORS.lightGray,
                      color: COLORS.darkBrown,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 px-4 py-2 rounded-lg font-medium"
                    style={{
                      backgroundColor: COLORS.coffeeBrown,
                      color: COLORS.white,
                    }}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="text-center mb-6">
                <AlertCircle
                  size={48}
                  className="mx-auto mb-4"
                  color={COLORS.red}
                />
                <h3
                  className="text-xl font-bold mb-2"
                  style={{ color: COLORS.darkBrown }}
                >
                  Delete Account?
                </h3>
                <p className="text-sm mb-4" style={{ color: COLORS.grayBrown }}>
                  Are you sure you want to delete your account? This action is
                  permanent and cannot be undone. All your pets' data will be
                  lost.
                </p>
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: COLORS.darkBrown }}
                  >
                    Type "delete" to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type 'delete' here"
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                    style={{
                      borderColor: COLORS.coffeeBrown,
                      color: COLORS.darkBrown,
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                  }}
                  className="flex-1 px-4 py-3 rounded-lg font-medium"
                  style={{
                    backgroundColor: COLORS.lightGray,
                    color: COLORS.darkBrown,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText.toLowerCase() !== "delete"}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                    deleteConfirmText.toLowerCase() !== "delete" ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{
                    backgroundColor: COLORS.red,
                    color: COLORS.white,
                  }}
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Username Change Modal */}
      <AnimatePresence>
        {showUsernameForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-xl font-bold"
                  style={{ color: COLORS.darkBrown }}
                >
                  Change Username
                </h3>
                <button
                  onClick={() => {
                    setShowUsernameForm(false);
                    setNewUsername("");
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={20} className={COLORS.grayBrown} />
                </button>
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.darkBrown }}
                >
                  Current Username
                </label>
                <input
                  type="text"
                  value={userData.username}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-gray-100"
                  style={{
                    borderColor: COLORS.lightGray,
                    color: COLORS.grayBrown,
                  }}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.darkBrown }}
                >
                  New Username
                </label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter new username"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  style={{
                    borderColor: COLORS.coffeeBrown,
                    color: COLORS.darkBrown,
                  }}
                />
                <p className="text-xs mt-1" style={{ color: COLORS.grayBrown }}>
                  Username must be unique and not already in use
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUsernameForm(false);
                    setNewUsername("");
                  }}
                  className="flex-1 px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: COLORS.lightGray,
                    color: COLORS.darkBrown,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangeUsername}
                  disabled={!newUsername || newUsername.trim().length === 0 || newUsername.trim() === userData.username}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    !newUsername || newUsername.trim().length === 0 || newUsername.trim() === userData.username
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  style={{
                    backgroundColor: COLORS.coffeeBrown,
                    color: COLORS.white,
                  }}
                >
                  Update Username
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Change Modal */}
      <AnimatePresence>
        {showEmailForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-xl font-bold"
                  style={{ color: COLORS.darkBrown }}
                >
                  Change Email
                </h3>
                <button
                  onClick={() => {
                    setShowEmailForm(false);
                    setNewEmail("");
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={20} className={COLORS.grayBrown} />
                </button>
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.darkBrown }}
                >
                  Current Email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border bg-gray-100"
                  style={{
                    borderColor: COLORS.lightGray,
                    color: COLORS.grayBrown,
                  }}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: COLORS.darkBrown }}
                >
                  New Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                  style={{
                    borderColor: COLORS.coffeeBrown,
                    color: COLORS.darkBrown,
                  }}
                />
                <p className="text-xs mt-1" style={{ color: COLORS.grayBrown }}>
                  Email must be unique and not already in use
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEmailForm(false);
                    setNewEmail("");
                  }}
                  className="flex-1 px-4 py-2 rounded-lg font-medium"
                  style={{
                    backgroundColor: COLORS.lightGray,
                    color: COLORS.darkBrown,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangeEmail}
                  disabled={!newEmail || !newEmail.includes("@") || newEmail.trim() === userData.email}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    !newEmail || !newEmail.includes("@") || newEmail.trim() === userData.email
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  style={{
                    backgroundColor: COLORS.coffeeBrown,
                    color: COLORS.white,
                  }}
                >
                  Update Email
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
