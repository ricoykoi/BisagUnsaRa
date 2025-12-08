import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  PawPrint,
  Crown,
  Download,
  Bell,
  CheckCircle,
  Circle,
  Calendar,
  Clock,
  Heart,
  Stethoscope,
  RefreshCw,
  Plus,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Users,
  FileText,
  Shield,
  Activity,
} from "lucide-react";
import { useSubscription } from "../context/useSubscriptionHook";
import petCareTips from "../api/petCareTips.js";
import { AuthenticationContext } from "../context/AuthenticationContext.jsx";

const formatDate = (date) => {
  const options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const parseTimeToMinutes = (timeString) => {
  const [time, period] = timeString.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes;

  if (period === "PM" && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === "AM" && hours === 12) {
    totalMinutes -= 12 * 60;
  }

  return totalMinutes;
};

const generateRecurringSchedules = (baseSchedules) => {
  const generatedSchedules = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const msInDay = 24 * 60 * 60 * 1000;

  baseSchedules.forEach((schedule) => {
    const templateDate = schedule.date
      ? new Date(schedule.date)
      : new Date(today);

    const addInstance = (date) => {
      const idDate = date.toISOString().split("T")[0];
      generatedSchedules.push({
        ...schedule,
        id: `${schedule.originalScheduleId}-${idDate}`,
        date: new Date(date),
        isToday: date.toDateString() === today.toDateString(),
        isCompleted: false,
      });
    };

    if (schedule.frequency === "Daily") {
      for (let i = 0; i < 30; i++) {
        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + i);
        addInstance(scheduleDate);
      }
    } else if (schedule.frequency === "Weekly") {
      const thirtyDaysMs = 30 * msInDay;
      addInstance(today);

      const baseDay = templateDate.getDay();
      let next = new Date(today);
      const offset = (baseDay - today.getDay() + 7) % 7;
      next.setDate(today.getDate() + (offset === 0 ? 7 : offset));

      while (next.getTime() - today.getTime() < thirtyDaysMs) {
        addInstance(new Date(next));
        next.setDate(next.getDate() + 7);
      }
    } else if (schedule.frequency === "Monthly") {
      const thirtyOneDaysMs = 31 * msInDay;
      addInstance(today);

      let m = 1;
      while (true) {
        const year = today.getFullYear();
        const month = today.getMonth() + m;
        const lastOfMonth = new Date(year, month + 1, 0).getDate();
        const day = Math.min(templateDate.getDate(), lastOfMonth);
        const scheduleDate = new Date(year, month, day);

        if (scheduleDate.getTime() - today.getTime() >= thirtyOneDaysMs) break;
        addInstance(scheduleDate);
        m++;
        if (m > 12) break;
      }
    }
  });

  return generatedSchedules.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();
    if (dateCompare !== 0) return dateCompare;
    return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentPlan, getPlanFeatures } = useSubscription();
  const features = getPlanFeatures(currentPlan);
  const user = useContext(AuthenticationContext);

  // Function to get 3 random tips
  const getRandomTips = (tips, count = 3) => {
    const shuffled = [...tips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState("general");

  // Refresh state for tips
  const [refreshKey, setRefreshKey] = useState(0);

  // Get 3 random tips filtered by category
  const randomTips = useMemo(() => {
    const filteredTips =
      selectedCategory === "all"
        ? petCareTips
        : petCareTips.filter((tip) => tip.category === selectedCategory);
    return getRandomTips(filteredTips);
  }, [selectedCategory, refreshKey]);

  // Handle refresh tips
  const handleRefreshTips = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Load pets from localStorage or use empty array
  const [pets, setPets] = useState(() => {
    const saved = localStorage.getItem("pets");
    return saved ? JSON.parse(saved) : [];
  });

  // Generate all schedules from pets and sync
  const allPets = pets;
  const allSchedules = allPets.flatMap((pet) =>
    (pet.schedules || []).map((schedule) => ({
      ...schedule,
      originalScheduleId: schedule.id,
      petName: pet.name,
      petId: pet.id,
    }))
  );

  // Use useMemo to cache generated schedules and prevent recalculation
  const { allGeneratedSchedules, todayDate } = useMemo(() => {
    const generated = generateRecurringSchedules(allSchedules, 90);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return { allGeneratedSchedules: generated, todayDate: today };
  }, [allSchedules]);

  const [upcomingSchedules, setUpcomingSchedules] = useState(() => {
    return allGeneratedSchedules.filter((s) => s.date >= todayDate);
  });

  const [pastSchedules] = useState(() => {
    return allGeneratedSchedules.filter((s) => s.date < todayDate);
  });

  const [scheduleView, setScheduleView] = useState("today");
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    type: "",
    hour: "",
    minute: "",
    ampm: "",
    frequency: "",
    notes: "",
  });

  const navigateTo = (route) => {
    navigate(route);
  };

  const openEditScheduleModal = (schedule) => {
    const timeParts = schedule.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeParts) {
      setEditFormData({
        type: schedule.type,
        hour: timeParts[1],
        minute: timeParts[2],
        ampm: timeParts[3],
        frequency: schedule.frequency,
        notes: schedule.notes || "",
      });
      setEditingSchedule(schedule);
      setEditModalVisible(true);
    }
  };

  const handleUpdateSchedule = () => {
    if (!editFormData.hour || !editFormData.minute || !editFormData.ampm)
      return;

    const time = `${editFormData.hour}:${editFormData.minute} ${editFormData.ampm}`;
    const updatedPets = pets.map((pet) => {
      if (pet.id === editingSchedule.petId) {
        return {
          ...pet,
          schedules: pet.schedules.map((sched) =>
            sched.id === editingSchedule.originalScheduleId
              ? { ...sched, ...editFormData, time }
              : sched
          ),
        };
      }
      return pet;
    });

    setPets(updatedPets);
    localStorage.setItem("pets", JSON.stringify(updatedPets));
    setEditModalVisible(false);
    setEditingSchedule(null);

    // Refresh upcoming schedules
    const newAllSchedules = updatedPets.flatMap((pet) =>
      (pet.schedules || []).map((schedule) => ({
        ...schedule,
        petName: pet.name,
        petId: pet.id,
      }))
    );
    const generated = generateRecurringSchedules(newAllSchedules, 90);
    setUpcomingSchedules(
      generated.filter(
        (s) => s.date >= new Date(new Date().setHours(0, 0, 0, 0))
      )
    );
  };

  const handleDeleteSchedule = (schedule) => {
    if (!confirm("Delete this schedule?")) return;

    const updatedPets = pets.map((pet) => {
      if (pet.id === schedule.petId) {
        return {
          ...pet,
          schedules: pet.schedules.filter(
            (s) => s.id !== schedule.originalScheduleId
          ),
        };
      }
      return pet;
    });

    setPets(updatedPets);
    localStorage.setItem("pets", JSON.stringify(updatedPets));

    // Refresh upcoming schedules
    const newAllSchedules = updatedPets.flatMap((pet) =>
      (pet.schedules || []).map((s) => ({
        ...s,
        petName: pet.name,
        petId: pet.id,
      }))
    );
    const generated = generateRecurringSchedules(newAllSchedules, 90);
    setUpcomingSchedules(
      generated.filter(
        (s) => s.date >= new Date(new Date().setHours(0, 0, 0, 0))
      )
    );
  };

  const handleToggleComplete = (scheduleId, isToday) => {
    if (!isToday) {
      alert("You can only complete schedules for the current day.");
      return;
    }

    const updatedSchedules = upcomingSchedules.map((schedule) =>
      schedule.id === scheduleId
        ? { ...schedule, isCompleted: !schedule.isCompleted }
        : schedule
    );
    setUpcomingSchedules(updatedSchedules);
    alert("Schedule status updated!");
  };

  const handleToggleNotification = (schedule) => {
    const updatedPets = pets.map((pet) => {
      if (pet.id === schedule.petId) {
        return {
          ...pet,
          schedules: pet.schedules.map((sched) =>
            sched.id === schedule.originalScheduleId
              ? { ...sched, notificationsEnabled: !sched.notificationsEnabled }
              : sched
          ),
        };
      }
      return pet;
    });

    setPets(updatedPets);
    localStorage.setItem("pets", JSON.stringify(updatedPets));

    // Refresh schedules
    const newAllSchedules = updatedPets.flatMap((pet) =>
      (pet.schedules || []).map((s) => ({
        ...s,
        originalScheduleId: s.id,
        petName: pet.name,
        petId: pet.id,
      }))
    );
    const generated = generateRecurringSchedules(newAllSchedules);
    setUpcomingSchedules(generated.filter((s) => s.date >= todayDate));
  };

  const handleToggleHealthNotification = (petId, recordType, recordId) => {
    const updatedPets = pets.map((pet) => {
      if (pet.id === petId) {
        if (recordType === "vaccination") {
          return {
            ...pet,
            vaccinations: pet.vaccinations.map((vacc) =>
              vacc.id === recordId
                ? { ...vacc, notificationsEnabled: !vacc.notificationsEnabled }
                : vacc
            ),
          };
        } else if (recordType === "vetVisit") {
          return {
            ...pet,
            vetVisits: pet.vetVisits.map((visit) =>
              visit.id === recordId
                ? {
                    ...visit,
                    notificationsEnabled: !visit.notificationsEnabled,
                  }
                : visit
            ),
          };
        }
      }
      return pet;
    });

    setPets(updatedPets);
    localStorage.setItem("pets", JSON.stringify(updatedPets));
  };

  // Static calculations
  const activeSchedules = pets.reduce((total, pet) => {
    return total + (pet.schedules ? pet.schedules.length : 0);
  }, 0);

  // Calculate today's tasks
  const todayTasks = upcomingSchedules.filter((s) => {
    const scheduleDate = new Date(s.date);
    scheduleDate.setHours(0, 0, 0, 0);
    return scheduleDate.getTime() === todayDate.getTime();
  }).length;

  const completedTasks = upcomingSchedules.filter(
    (schedule) => schedule.isCompleted
  ).length;

  // Calculate tasks completion percentage
  const completionPercentage =
    todayTasks > 0 ? Math.round((completedTasks / todayTasks) * 100) : 0;

  // Get current time for greeting
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-[#f8f6f4]">
      {/* Welcome Header */}
      <div className="text-brown p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {getGreeting()}, {user?.user.username}! 🐾
            </h1>
            <p className="text-gray-500 opacity-90">
              Track and manage your pet's care
            </p>
          </div>
          <button
            onClick={() => navigate("/mypets")}
            className="bg-[#ffd68e] text-[#55423c] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#e6c27d] transition-colors"
          >
            <Plus size={18} />
            Add Pet
          </button>
        </div>
      </div>

      <main className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8d7ca]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#795225]">Total Pets</div>
                <div className="text-2xl font-bold text-[#55423c]">
                  {pets.length}
                </div>
              </div>
              <div className="bg-[#ffd68e] p-2 rounded-lg">
                <Users size={24} className="text-[#795225]" />
              </div>
            </div>
            <div className="mt-2 text-xs text-[#795225]">
              {pets.length > 0
                ? `${pets.length} companion${pets.length > 1 ? "s" : ""}`
                : "No pets added"}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8d7ca]">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#795225]">Today's Tasks</div>
                <div className="text-2xl font-bold text-[#55423c]">
                  {completedTasks}/{todayTasks}
                </div>
              </div>
              <div className="bg-[#ffd68e] p-2 rounded-lg">
                <Activity size={24} className="text-[#795225]" />
              </div>
            </div>
            <div className="mt-2 text-xs text-[#795225]">
              {completionPercentage}% completed
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8d7ca]">
          <h2 className="text-lg font-bold text-[#55423c] mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate("/mypets")}
              className="flex items-center justify-between p-3 rounded-lg border border-[#e8d7ca] hover:bg-[#f8f6f4] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#ffd68e] p-2 rounded-lg">
                  <PawPrint size={18} className="text-[#795225]" />
                </div>
                <span className="font-medium text-[#55423c]">My Pets</span>
              </div>
              <ChevronRight size={16} className="text-[#795225]" />
            </button>
            <button
              onClick={() => navigate("/plans")}
              className="flex items-center justify-between p-3 rounded-lg border border-[#e8d7ca] hover:bg-[#f8f6f4] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#ffd68e] p-2 rounded-lg">
                  <Crown size={18} className="text-[#795225]" />
                </div>
                <span className="font-medium text-[#55423c]">Plans</span>
              </div>
              <ChevronRight size={16} className="text-[#795225]" />
            </button>
          </div>
        </div>

        {/* Current Plan Section */}
        <div className="bg-gradient-to-r from-[#ffd68e] to-[#f2c97d] rounded-xl p-4 shadow-sm border border-[#c18742]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Crown size={24} className="text-[#c18742]" />
              </div>
              <div>
                <div className="text-sm text-[#795225] font-medium">
                  Current Plan
                </div>
                <div className="font-bold text-[#55423c] text-lg">
                  {currentPlan}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigateTo("/plans")}
              className="bg-white text-[#c18742] px-4 py-2 rounded-lg font-semibold hover:bg-[#f8f6f4] transition-colors border border-[#c18742]"
            >
              {currentPlan === "Free Mode" ? "Upgrade" : "Change"}
            </button>
          </div>
          {currentPlan === "Free Mode" && (
            <div className="mt-3 text-sm text-[#795225] flex items-center gap-2">
              <AlertCircle size={16} />
              Upgrade to unlock premium features
            </div>
          )}
        </div>

        {/* Pet Care Tips Section */}
        {features.hasCareTips && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8d7ca]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#55423c]">
                Pet Care Tips
              </h2>
              <button
                onClick={handleRefreshTips}
                className="flex items-center gap-2 text-sm text-[#795225] hover:text-[#55423c] transition-colors"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { key: "general", label: "General" },
                { key: "dogs", label: "Dogs" },
                { key: "cats", label: "Cats" },
                { key: "birds", label: "Birds" },
                { key: "fish", label: "Fish" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === key
                      ? "bg-[#c18742] text-white"
                      : "bg-[#f8f6f4] text-[#795225] hover:bg-[#e8d7ca]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {randomTips.map((tip) => (
                <div
                  key={tip.id}
                  className="bg-[#f8f6f4] rounded-lg p-3 hover:shadow-sm transition-shadow border border-[#e8d7ca]"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg">
                      <Shield size={16} className="text-[#795225]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#55423c] text-sm mb-1">
                        {tip.title}
                      </h3>
                      <p className="text-xs text-[#795225] leading-relaxed">
                        {tip.tip}
                      </p>
                      <div className="mt-2 text-xs text-[#c18742] font-medium">
                        {tip.category.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedules Section */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8d7ca]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#55423c]">Schedules</h2>
            <div className="flex bg-[#f8f6f4] rounded-lg p-1">
              <button
                onClick={() => setScheduleView("today")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  scheduleView === "today"
                    ? "bg-[#c18742] text-white"
                    : "text-[#795225] hover:text-[#55423c]"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setScheduleView("upcoming")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  scheduleView === "upcoming"
                    ? "bg-[#c18742] text-white"
                    : "text-[#795225] hover:text-[#55423c]"
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setScheduleView("past")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  scheduleView === "past"
                    ? "bg-[#c18742] text-white"
                    : "text-[#795225] hover:text-[#55423c]"
                }`}
              >
                Past
              </button>
            </div>
          </div>

          {scheduleView === "today" ? (
            (() => {
              const todaySchedules = upcomingSchedules
                .filter((s) => {
                  const scheduleDate = new Date(s.date);
                  scheduleDate.setHours(0, 0, 0, 0);
                  return scheduleDate.getTime() === todayDate.getTime();
                })
                .sort(
                  (a, b) =>
                    parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
                );

              return todaySchedules.length > 0 ? (
                <div className="space-y-3">
                  {todaySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-[#e8d7ca] hover:bg-[#f8f6f4] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleToggleComplete(schedule.id, true)
                          }
                          className="flex-shrink-0"
                        >
                          {schedule.isCompleted ? (
                            <CheckCircle className="text-green-500" size={24} />
                          ) : (
                            <Circle className="text-[#c18742]" size={24} />
                          )}
                        </button>
                        <div>
                          <div className="font-bold text-[#55423c]">
                            {schedule.time}
                          </div>
                          <div className="text-sm text-[#795225]">
                            {schedule.type} • {schedule.petName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleNotification(schedule)}
                          className="p-1.5 hover:bg-[#e8d7ca] rounded transition-colors"
                          title={
                            schedule.notificationsEnabled
                              ? "Notifications on"
                              : "Notifications off"
                          }
                        >
                          <Bell
                            size={18}
                            className={
                              schedule.notificationsEnabled
                                ? "text-[#c18742] fill-[#c18742]"
                                : "text-[#795225]"
                            }
                          />
                        </button>
                        <div className="bg-[#ffd68e] text-[#795225] text-xs px-2 py-1 rounded-full font-medium">
                          Today
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#795225]">
                  <Clock size={48} className="mx-auto mb-3 text-[#e8d7ca]" />
                  <p className="font-medium">No schedules for today</p>
                  <p className="text-sm mt-1">Enjoy your day with your pets!</p>
                </div>
              );
            })()
          ) : scheduleView === "upcoming" ? (
            (() => {
              const futureSchedules = upcomingSchedules
                .filter((s) => {
                  const scheduleDate = new Date(s.date);
                  scheduleDate.setHours(0, 0, 0, 0);
                  return scheduleDate.getTime() > todayDate.getTime();
                })
                .sort((a, b) => {
                  const dateCompare = a.date.getTime() - b.date.getTime();
                  if (dateCompare !== 0) return dateCompare;
                  return (
                    parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
                  );
                });

              return futureSchedules.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {futureSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-3 rounded-lg border border-[#e8d7ca] hover:bg-[#f8f6f4] transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#ffd68e] text-[#795225] text-xs px-2 py-1 rounded-full font-medium">
                            {formatDate(schedule.date)}
                          </div>
                          <div className="text-sm font-medium text-[#795225]">
                            {schedule.time}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditScheduleModal(schedule)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-[#55423c]">
                        {schedule.type}
                      </div>
                      <div className="text-xs text-[#795225] mb-2">
                        For {schedule.petName}
                      </div>
                      {schedule.notes && (
                        <div className="text-xs text-[#795225] italic bg-[#f8f6f4] p-2 rounded">
                          📝 {schedule.notes}
                        </div>
                      )}
                      <div className="mt-2 flex justify-between items-center">
                        <div className="text-xs text-[#c18742] font-medium">
                          {schedule.frequency}
                        </div>
                        {schedule.notifications && (
                          <Bell size={14} className="text-[#c18742]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#795225]">
                  <Calendar size={48} className="mx-auto mb-3 text-[#e8d7ca]" />
                  <p className="font-medium">No upcoming schedules</p>
                  <p className="text-sm mt-1">
                    Add schedules to keep track of pet care
                  </p>
                </div>
              );
            })()
          ) : pastSchedules.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {pastSchedules.slice(0, 10).map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-3 rounded-lg border border-[#e8d7ca] bg-[#f8f6f4] opacity-70"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="text-green-500" size={16} />
                    <div className="bg-[#ffd68e] text-[#795225] text-xs px-2 py-1 rounded-full font-medium">
                      {formatDate(schedule.date)}
                    </div>
                    <div className="text-sm font-medium text-[#795225]">
                      {schedule.time}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-[#55423c]">
                    {schedule.type}
                  </div>
                  <div className="text-xs text-[#795225]">
                    For {schedule.petName}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#795225]">
              <FileText size={48} className="mx-auto mb-3 text-[#e8d7ca]" />
              <p className="font-medium">No past schedules</p>
              <p className="text-sm mt-1">
                Your schedule history will appear here
              </p>
            </div>
          )}
        </div>

        {/* Health Records Section */}
        {features.hasHealthRecords && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8d7ca]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-[#55423c]">
                Health Records
              </h2>
              <button
                onClick={() => navigateTo("/mypets")}
                className="text-sm text-[#c18742] font-medium hover:text-[#55423c] transition-colors"
              >
                View All
              </button>
            </div>

            {pets.some(
              (pet) =>
                (pet.vaccinations && pet.vaccinations.length > 0) ||
                (pet.vetVisits && pet.vetVisits.length > 0)
            ) ? (
              <div className="space-y-4">
                {pets
                  .filter(
                    (pet) =>
                      (pet.vaccinations && pet.vaccinations.length > 0) ||
                      (pet.vetVisits && pet.vetVisits.length > 0)
                  )
                  .map((pet) => (
                    <div
                      key={pet.id}
                      className="border-t border-[#e8d7ca] pt-4 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#ffd68e] flex items-center justify-center">
                          <PawPrint size={16} className="text-[#795225]" />
                        </div>
                        <h3 className="font-bold text-[#55423c]">{pet.name}</h3>
                      </div>

                      {pet.vaccinations && pet.vaccinations.length > 0 && (
                        <div className="ml-2 mb-3">
                          <h4 className="text-sm font-medium text-[#c18742] mb-2">
                            Vaccinations
                          </h4>
                          <div className="space-y-2">
                            {pet.vaccinations.slice(0, 2).map((vaccination) => (
                              <div
                                key={vaccination.id}
                                className="bg-[#f8f6f4] p-3 rounded-lg"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-[#55423c] text-sm">
                                      {vaccination.name}
                                    </div>
                                    <div className="text-xs text-[#795225]">
                                      Given: {vaccination.dateGiven}
                                    </div>
                                    {vaccination.nextDueDate && (
                                      <div className="text-xs text-[#c18742] font-medium mt-1">
                                        Next Due: {vaccination.nextDueDate}
                                      </div>
                                    )}
                                  </div>
                                  {vaccination.nextDueDate && (
                                    <button
                                      onClick={() =>
                                        handleToggleHealthNotification(
                                          pet.id,
                                          "vaccination",
                                          vaccination.id
                                        )
                                      }
                                      className="p-1 hover:bg-white rounded transition-colors"
                                      title={
                                        vaccination.notificationsEnabled
                                          ? "Notifications on"
                                          : "Notifications off"
                                      }
                                    >
                                      <Bell
                                        size={16}
                                        className={
                                          vaccination.notificationsEnabled
                                            ? "text-[#c18742] fill-[#c18742]"
                                            : "text-[#795225]"
                                        }
                                      />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#795225]">
                <Heart size={48} className="mx-auto mb-3 text-[#e8d7ca]" />
                <p className="font-medium">No health records</p>
                <p className="text-sm mt-1">
                  Add health records to track your pet's wellness
                </p>
              </div>
            )}
          </div>
        )}

        {/* Upgrade Prompt */}
        {!features.hasExport && (
          <div className="bg-gradient-to-r from-[#55423c] to-[#6a524a] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#ffd68e] p-2 rounded-lg">
                <Crown size={24} className="text-[#55423c]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Upgrade to Premium
                </h3>
                <p className="text-[#e8d7ca] text-sm">
                  Get advanced features and unlimited access
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo("/plans")}
              className="w-full bg-[#ffd68e] text-[#55423c] py-3 rounded-lg font-semibold hover:bg-[#e6c27d] transition-colors"
            >
              View Premium Plans
            </button>
          </div>
        )}
      </main>

      {/* Edit Schedule Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#55423c] mb-4">
                Edit Schedule
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#795225] mb-1">
                    Schedule Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Feeding, Medication"
                    value={editFormData.type}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, type: e.target.value })
                    }
                    className="w-full border border-[#e8d7ca] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#795225] mb-1">
                    Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={editFormData.hour}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          hour: e.target.value,
                        })
                      }
                      className="border border-[#e8d7ca] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editFormData.minute}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          minute: e.target.value,
                        })
                      }
                      className="border border-[#e8d7ca] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    >
                      {["00", "15", "30", "45"].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      value={editFormData.ampm}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          ampm: e.target.value,
                        })
                      }
                      className="border border-[#e8d7ca] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#795225] mb-1">
                    Frequency
                  </label>
                  <select
                    value={editFormData.frequency}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        frequency: e.target.value,
                      })
                    }
                    className="w-full border border-[#e8d7ca] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#795225] mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Add any additional notes..."
                    value={editFormData.notes}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        notes: e.target.value,
                      })
                    }
                    rows={2}
                    className="w-full border border-[#e8d7ca] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setEditModalVisible(false)}
                  className="flex-1 bg-[#f8f6f4] text-[#795225] py-3 rounded-lg font-medium hover:bg-[#e8d7ca] transition-colors border border-[#e8d7ca]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSchedule}
                  className="flex-1 bg-[#c18742] text-white py-3 rounded-lg font-medium hover:bg-[#a87338] transition-colors"
                >
                  Update Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
