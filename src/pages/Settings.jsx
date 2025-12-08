import React, { useState, useContext } from "react";
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
  const { user, setUser } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  // Settings states
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    reminders: true,
    feeding: true,
    health: true,
    promotions: false,
  });
  const [language, setLanguage] = useState("english");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Mock user data
  const userData = user || {
    username: "petlover123",
    email: "user@example.com",
    phone: "+1 (555) 123-4567",
    plan: "Free",
    joinedDate: "2024-01-15",
    pets: 2,
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
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    // In a real app, you would make an API call here
    console.log("Account deletion requested");
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChangePassword = () => {
    // Validate and submit password change
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters!");
      return;
    }
    // API call would go here
    console.log("Password change submitted");
    setShowPasswordForm(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password changed successfully!");
  };

  const toggleNotification = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const exportData = () => {
    const data = {
      user: userData,
      pets: [],
      settings: {
        darkMode,
        notifications,
        language,
        soundEnabled,
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
          label: "Profile",
          value: userData.username,
          color: COLORS.coffeeBrown,
          onClick: () => navigate("/profile"),
        },
        {
          icon: <Mail size={18} />,
          label: "Email",
          value: userData.email,
          color: COLORS.coffeeBrown,
        },
        {
          icon: <Smartphone size={18} />,
          label: "Phone",
          value: userData.phone,
          color: COLORS.coffeeBrown,
        },
        {
          icon: <CreditCard size={18} />,
          label: "Subscription Plan",
          value: userData.plan,
          badgeColor:
            userData.plan === "Premium" ? COLORS.green : COLORS.grayBrown,
          onClick: () => navigate("/plans"),
        },
      ],
    },
    {
      title: "Preferences",
      icon: <Palette size={20} />,
      items: [
        {
          icon: darkMode ? <Moon size={18} /> : <Sun size={18} />,
          label: "Theme",
          value: darkMode ? "Dark Mode" : "Light Mode",
          type: "toggle",
          toggleValue: darkMode,
          onToggle: () => setDarkMode(!darkMode),
          color: COLORS.coffeeBrown,
        },
        {
          icon: <Globe size={18} />,
          label: "Language",
          value: language.charAt(0).toUpperCase() + language.slice(1),
          type: "select",
          options: ["English", "Spanish", "French", "German"],
          currentValue: language,
          onChange: (value) => setLanguage(value.toLowerCase()),
          color: COLORS.coffeeBrown,
        },
        {
          icon: <Volume2 size={18} />,
          label: "Sounds",
          value: soundEnabled ? "Enabled" : "Disabled",
          type: "toggle",
          toggleValue: soundEnabled,
          onToggle: () => setSoundEnabled(!soundEnabled),
          color: COLORS.coffeeBrown,
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
          toggleValue: notifications.reminders,
          onToggle: () => toggleNotification("reminders"),
          color: COLORS.coffeeBrown,
        },
        {
          icon: <Heart size={18} />,
          label: "Feeding Alerts",
          type: "toggle",
          toggleValue: notifications.feeding,
          onToggle: () => toggleNotification("feeding"),
          color: COLORS.coffeeBrown,
        },
        {
          icon: <AlertCircle size={18} />,
          label: "Health Updates",
          type: "toggle",
          toggleValue: notifications.health,
          onToggle: () => toggleNotification("health"),
          color: COLORS.coffeeBrown,
        },
        {
          icon: <Info size={18} />,
          label: "Promotions & News",
          type: "toggle",
          toggleValue: notifications.promotions,
          onToggle: () => toggleNotification("promotions"),
          color: COLORS.coffeeBrown,
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
        {
          icon: <Download size={18} />,
          label: "Export Data",
          type: "action",
          onClick: exportData,
          color: COLORS.coffeeBrown,
        },
      ],
    },
    {
      title: "About",
      icon: <HelpCircle size={20} />,
      items: [
        {
          icon: <Info size={18} />,
          label: "App Version",
          value: "2.1.0",
          color: COLORS.coffeeBrown,
        },
        {
          icon: <Calendar size={18} />,
          label: "Member Since",
          value: new Date(userData.joinedDate).toLocaleDateString(),
          color: COLORS.coffeeBrown,
        },
        {
          icon: <Users size={18} />,
          label: "Connected Pets",
          value: `${userData.pets} pets`,
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
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: COLORS.coffeeBrown }}
              >
                <span className="text-2xl font-bold text-white">
                  {userData.username.charAt(0).toUpperCase()}
                </span>
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
                    {userData.plan} Plan
                  </span>
                  <span className="text-xs" style={{ color: COLORS.grayBrown }}>
                    • {userData.pets} pets
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
                <p className="text-sm" style={{ color: COLORS.grayBrown }}>
                  Are you sure you want to delete your account? This action is
                  permanent and cannot be undone. All your pets' data will be
                  lost.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
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
                  className="flex-1 px-4 py-3 rounded-lg font-medium"
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
    </div>
  );
};

export default Settings;
