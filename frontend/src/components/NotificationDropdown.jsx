import React, { useState, useEffect, useContext, useRef } from "react";
import { Bell, X, Check, CheckCheck, Trash2, Clock } from "lucide-react";
import { AuthenticationContext } from "../context/AuthenticationContext";
import {
  getUpdatesByUser,
  markUpdateAsRead,
  markAllUpdatesAsRead,
  dismissUpdate,
  checkAndCreateNotifications,
} from "../services/updateService";

const NotificationDropdown = () => {
  const { user } = useContext(AuthenticationContext);
  const [isOpen, setIsOpen] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dropdownRef = useRef(null);
  const touchStartY = useRef(0);
  const drawerRef = useRef(null);

  // Fetch updates
  const fetchUpdates = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      const response = await getUpdatesByUser(user._id);
      setUpdates(response.updates || []);
      setUnreadCount(response.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch updates:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check and create notifications
  const checkNotifications = async () => {
    if (!user?._id) return;

    try {
      await checkAndCreateNotifications(user._id);
      await fetchUpdates();
    } catch (error) {
      console.error("Failed to check notifications:", error);
    }
  };

  // Initial fetch and periodic checks
  useEffect(() => {
    if (user?._id) {
      fetchUpdates();
      checkNotifications();

      const interval = setInterval(() => {
        checkNotifications();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Touch gestures for mobile drawer
  useEffect(() => {
    if (!isOpen || window.innerWidth >= 768) return;

    const handleTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!drawerRef.current) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchY - touchStartY.current;

      // Only allow downward swipe to close
      if (deltaY > 50) {
        drawerRef.current.style.transform = `translateY(${Math.min(
          deltaY,
          100
        )}px)`;
      }
    };

    const handleTouchEnd = (e) => {
      if (!drawerRef.current) return;

      const touchY = e.changedTouches[0].clientY;
      const deltaY = touchY - touchStartY.current;

      if (deltaY > 100) {
        closeDropdown();
      } else {
        drawerRef.current.style.transform = "translateY(0)";
      }
    };

    const drawer = drawerRef.current;
    if (drawer) {
      drawer.addEventListener("touchstart", handleTouchStart);
      drawer.addEventListener("touchmove", handleTouchMove);
      drawer.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (drawer) {
        drawer.removeEventListener("touchstart", handleTouchStart);
        drawer.removeEventListener("touchmove", handleTouchMove);
        drawer.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isOpen]);

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle mark as read
  const handleMarkAsRead = async (updateId) => {
    try {
      await markUpdateAsRead(updateId);
      setUpdates(
        updates.map((u) => (u._id === updateId ? { ...u, isRead: true } : u))
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (!user?._id) return;

    try {
      await markAllUpdatesAsRead(user._id);
      setUpdates(updates.map((u) => ({ ...u, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  // Handle dismiss
  const handleDismiss = async (updateId) => {
    try {
      await dismissUpdate(updateId);
      setUpdates(updates.filter((u) => u._id !== updateId));
      const dismissed = updates.find((u) => u._id === updateId);
      if (dismissed && !dismissed.isRead) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error("Failed to dismiss update:", error);
    }
  };

  // Close dropdown with animation
  const closeDropdown = () => {
    if (window.innerWidth < 768) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsOpen(false);
    }
  };

  // Open dropdown
  const openDropdown = () => {
    setIsOpen(true);
    fetchUpdates();
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={openDropdown}
        className="relative p-2 rounded-full transition-colors text-white hover:bg-[#6a524a]"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Mobile Backdrop */}
      {isOpen && window.innerWidth < 768 && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
          onClick={closeDropdown}
        />
      )}

      {isOpen && (
        <div
          ref={drawerRef}
          className={`
            fixed md:absolute z-50
            md:right-0 md:top-full md:mt-2
            inset-x-0 bottom-0 md:inset-x-auto md:bottom-auto
            transition-transform duration-300 ease-out md:w-100
            ${isClosing ? "translate-y-full md:translate-y-0" : "translate-y-0"}
          `}
        >
          {/* Mobile Drawer Handle */}
          {window.innerWidth < 768 && (
            <div className="flex items-center justify-center pt-3 pb-1">
              <div className="w-30 h-1.5 bg-gray-300 rounded-full"></div>
            </div>
          )}

          <div className="bg-white rounded-t-2xl md:rounded-lg shadow-2xl md:shadow-lg border-t md:border border-gray-200 max-h-[80vh] md:max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-[#55423c]">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-[#795225] hover:text-[#55423c] flex items-center gap-1"
                    title="Mark all as read"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={closeDropdown}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={16} className="text-[#795225]" />
                </button>
              </div>
            </div>

            {/* Updates List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-4 text-center text-[#795225]">Loading...</div>
              ) : updates.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {updates.map((update) => (
                    <div
                      key={update._id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !update.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p
                                className={`font-semibold text-sm ${
                                  !update.isRead
                                    ? "text-[#55423c]"
                                    : "text-gray-700"
                                }`}
                              >
                                {update.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {update.message}
                              </p>
                              {update.petName && (
                                <p className="text-xs text-[#795225] mt-1">
                                  🐾 {update.petName}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2">
                                <Clock size={12} className="text-gray-400" />
                                <span className="text-xs text-gray-400">
                                  {formatTime(update.scheduledTime)}
                                </span>
                              </div>
                            </div>
                            {!update.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        {!update.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(update._id)}
                            className="text-xs text-[#795225] hover:text-[#55423c] flex items-center gap-1"
                            title="Mark as read"
                          >
                            <Check size={12} />
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => handleDismiss(update._id)}
                          className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 ml-auto"
                          title="Dismiss"
                        >
                          <Trash2 size={12} />
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
