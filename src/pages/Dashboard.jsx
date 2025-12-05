import React, { useState, useMemo } from 'react';
import { useNavigate} from 'react-router-dom';
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
  RefreshCw
} from 'lucide-react';
import { useSubscription } from '../context/useSubscriptionHook';
import petCareTips from '../api/petCareTips.js';

const formatDate = (date) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const parseTimeToMinutes = (timeString) => {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes;
  
  if (period === 'PM' && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === 'AM' && hours === 12) {
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
    const templateDate = schedule.date ? new Date(schedule.date) : new Date(today);

    const addInstance = (date) => {
      const idDate = date.toISOString().split('T')[0];
      generatedSchedules.push({
        ...schedule,
        id: `${schedule.originalScheduleId}-${idDate}`,
        date: new Date(date),
        isToday: date.toDateString() === today.toDateString(),
        isCompleted: false
      });
    };

    if (schedule.frequency === 'Daily') {
      // Generate daily for exactly 30 days (1 month)
      for (let i = 0; i < 30; i++) {
        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + i);
        addInstance(scheduleDate);
      }

    } else if (schedule.frequency === 'Weekly') {
      // Generate weekly for exactly 30 days (1 month)
      const thirtyDaysMs = 30 * msInDay;
      
      // Always include today's instance
      addInstance(today);

      // Then generate weekly occurrences on the template weekday for the next 30 days
      const baseDay = templateDate.getDay();
      let next = new Date(today);
      const offset = (baseDay - today.getDay() + 7) % 7;
      // if template weekday is today, start from next week
      next.setDate(today.getDate() + (offset === 0 ? 7 : offset));

      while (next.getTime() - today.getTime() < thirtyDaysMs) {
        addInstance(new Date(next));
        next.setDate(next.getDate() + 7);
      }

    } else if (schedule.frequency === 'Monthly') {
      // Generate monthly for 31 days so second monthly occurrence appears
      const thirtyOneDaysMs = 31 * msInDay;
      
      // Always include today's instance
      addInstance(today);

      // Generate monthly occurrences for the next 31 days
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
        if (m > 12) break; // safety
      }
    }
  });

  return generatedSchedules.sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime();
    if (dateCompare !== 0) return dateCompare;
    return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
  });
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentPlan, getPlanFeatures } = useSubscription();
  const features = getPlanFeatures(currentPlan);

  // Function to get 3 random tips
  const getRandomTips = (tips, count = 3) => {
    const shuffled = [...tips].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('general');

  // Refresh state for tips
  const [refreshKey, setRefreshKey] = useState(0);

  // Get 3 random tips filtered by category
  const randomTips = useMemo(() => {
    const filteredTips = selectedCategory === 'all' ? petCareTips : petCareTips.filter(tip => tip.category === selectedCategory);
    return getRandomTips(filteredTips);
  }, [selectedCategory, refreshKey]);

  // Handle refresh tips
  const handleRefreshTips = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  // Load pets from localStorage or use empty array
  const [pets, setPets] = useState(() => {
    const saved = localStorage.getItem('pets');
    return saved ? JSON.parse(saved) : [];
  });

  // Generate all schedules from pets and sync
  const allPets = pets;
  const allSchedules = allPets.flatMap(pet =>
    (pet.schedules || []).map(schedule => ({
      ...schedule,
      originalScheduleId: schedule.id,
      petName: pet.name,
      petId: pet.id
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
    return allGeneratedSchedules.filter(s => s.date >= todayDate);
  });

  const [pastSchedules] = useState(() => {
    return allGeneratedSchedules.filter(s => s.date < todayDate);
  });

  const [scheduleView, setScheduleView] = useState('today');
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editFormData, setEditFormData] = useState({
    type: '',
    hour: '',
    minute: '',
    ampm: '',
    frequency: '',
    notes: ''
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
        notes: schedule.notes || ''
      });
      setEditingSchedule(schedule);
      setEditModalVisible(true);
    }
  };

  const handleUpdateSchedule = () => {
    if (!editFormData.hour || !editFormData.minute || !editFormData.ampm) return;

    const time = `${editFormData.hour}:${editFormData.minute} ${editFormData.ampm}`;
    const updatedPets = pets.map(pet => {
      if (pet.id === editingSchedule.petId) {
        return {
          ...pet,
          schedules: pet.schedules.map(sched =>
            sched.id === editingSchedule.originalScheduleId
              ? { ...sched, ...editFormData, time }
              : sched
          )
        };
      }
      return pet;
    });
    
    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));
    setEditModalVisible(false);
    setEditingSchedule(null);
    
    // Refresh upcoming schedules
    const newAllSchedules = updatedPets.flatMap(pet =>
      (pet.schedules || []).map(schedule => ({
        ...schedule,
        petName: pet.name,
        petId: pet.id
      }))
    );
    const generated = generateRecurringSchedules(newAllSchedules, 90);
    setUpcomingSchedules(generated.filter(s => s.date >= new Date(new Date().setHours(0, 0, 0, 0))));
  };

  const handleDeleteSchedule = (schedule) => {
    if (!confirm("Delete this schedule?")) return;

    const updatedPets = pets.map(pet => {
      if (pet.id === schedule.petId) {
        return {
          ...pet,
          schedules: pet.schedules.filter(s => s.id !== schedule.originalScheduleId)
        };
      }
      return pet;
    });

    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));

    // Refresh upcoming schedules
    const newAllSchedules = updatedPets.flatMap(pet =>
      (pet.schedules || []).map(s => ({
        ...s,
        petName: pet.name,
        petId: pet.id
      }))
    );
    const generated = generateRecurringSchedules(newAllSchedules, 90);
    setUpcomingSchedules(generated.filter(s => s.date >= new Date(new Date().setHours(0, 0, 0, 0))));
  };

  // Static handler functions
  const handleToggleComplete = (scheduleId, isToday) => {
    if (!isToday) {
      alert('You can only complete schedules for the current day.');
      return;
    }

    // Toggle completion status
    const updatedSchedules = upcomingSchedules.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, isCompleted: !schedule.isCompleted }
        : schedule
    );
    setUpcomingSchedules(updatedSchedules);
    alert('Schedule status updated!');
  };

  const handleToggleNotification = (schedule) => {
    const updatedPets = pets.map(pet => {
      if (pet.id === schedule.petId) {
        return {
          ...pet,
          schedules: pet.schedules.map(sched =>
            sched.id === schedule.originalScheduleId
              ? { ...sched, notificationsEnabled: !sched.notificationsEnabled }
              : sched
          )
        };
      }
      return pet;
    });

    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));

    // Refresh schedules
    const newAllSchedules = updatedPets.flatMap(pet =>
      (pet.schedules || []).map(s => ({
        ...s,
        originalScheduleId: s.id,
        petName: pet.name,
        petId: pet.id
      }))
    );
    const generated = generateRecurringSchedules(newAllSchedules);
    setUpcomingSchedules(generated.filter(s => s.date >= todayDate));
  };

  const handleToggleHealthNotification = (petId, recordType, recordId) => {
    const updatedPets = pets.map(pet => {
      if (pet.id === petId) {
        if (recordType === 'vaccination') {
          return {
            ...pet,
            vaccinations: pet.vaccinations.map(vacc =>
              vacc.id === recordId
                ? { ...vacc, notificationsEnabled: !vacc.notificationsEnabled }
                : vacc
            )
          };
        } else if (recordType === 'vetVisit') {
          return {
            ...pet,
            vetVisits: pet.vetVisits.map(visit =>
              visit.id === recordId
                ? { ...visit, notificationsEnabled: !visit.notificationsEnabled }
                : visit
            )
          };
        }
      }
      return pet;
    });

    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      navigate('/');
    }
  };

  // Static calculations
  const activeSchedules = pets.reduce((total, pet) => {
    return total + (pet.schedules ? pet.schedules.length : 0);
  }, 0);

  // Calculate today's tasks
  const todayTasks = upcomingSchedules.filter(s => {
    const scheduleDate = new Date(s.date);
    scheduleDate.setHours(0, 0, 0, 0);
    return scheduleDate.getTime() === todayDate.getTime();
  }).length;

  const completedTasks = upcomingSchedules.filter(schedule => schedule.isCompleted).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#55423c] text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 bg-[#ffd68e] text-[#55423c] px-3 py-2 rounded-lg font-medium hover:bg-[#e6c27d] transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {/* Summary Section */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">{pets.length}</div>
              <div className="text-sm text-[#795225]">Pets</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">{activeSchedules}</div>
              <div className="text-sm text-[#795225]">Active Schedules</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">{completedTasks}/{todayTasks}</div>
              <div className="text-sm text-[#795225]">Completed Tasks</div>
            </div>
          </div>
        </div>

        {/* Current Plan Section */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#ffd68e] p-2 rounded-lg">
                  <Crown className="text-[#55423c]" size={24} />
                </div>
                <div>
                  <div className="text-sm text-[#795225]">Current Plan</div>
                  <div className="font-bold text-[#c18742]">{currentPlan}</div>
                </div>
              </div>
              <button
                onClick={() => navigateTo('/plans')}
                className="bg-[#ffd68e] text-[#55423c] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#e6c27d] transition-colors"
              >
                Change
              </button>
            </div>
            {currentPlan === 'Free Mode' && (
              <div className="text-sm text-[#795225] italic text-center mt-2">
                Upgrade to unlock more features
              </div>
            )}
          </div>
        </div>

        {/* Pet Care Tips Section - Only visible for Premium Tier 2 subscribers */}
        {features.hasCareTips && (
          <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#55423c] mb-4">Pet Care Tips</h2>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { key: 'general', label: 'General' },
                { key: 'dogs', label: 'Dogs' },
                { key: 'cats', label: 'Cats' },
                { key: 'birds', label: 'Birds' },
                { key: 'fish', label: 'Fish' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-[#c18742] text-white'
                      : 'bg-gray-100 text-[#795225] hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {randomTips.map((tip) => (
                <div key={tip.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-[#55423c] mb-2 text-sm">{tip.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.tip}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleRefreshTips}
              className="flex items-center gap-2 bg-[#ffd68e] text-[#55423c] px-4 py-2 rounded-lg font-medium hover:bg-[#e6c27d] transition-colors mt-4"
            >
              <RefreshCw size={16} />
              Refresh Tips
            </button>
          </div>
        )}

        {/* Enhanced Schedules Section */}
        <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#55423c]">Schedule Records</h2>
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setScheduleView('today')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  scheduleView === 'today'
                    ? 'bg-[#c18742] text-white'
                    : 'text-[#795225] hover:text-[#55423c]'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setScheduleView('upcoming')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  scheduleView === 'upcoming'
                    ? 'bg-[#c18742] text-white'
                    : 'text-[#795225] hover:text-[#55423c]'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setScheduleView('past')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  scheduleView === 'past'
                    ? 'bg-[#c18742] text-white'
                    : 'text-[#795225] hover:text-[#55423c]'
                }`}
              >
                Past
              </button>
            </div>
          </div>

          {scheduleView === 'today' ? (
            (() => {
              // Only show schedules for today's date
              const todaySchedules = upcomingSchedules.filter(s => {
                const scheduleDate = new Date(s.date);
                scheduleDate.setHours(0, 0, 0, 0);
                return scheduleDate.getTime() === todayDate.getTime();
              }).sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
              return todaySchedules.length > 0 ? (
                <div className="space-y-3">
                  {todaySchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
                      <button onClick={() => handleToggleComplete(schedule.id, true)} className="flex-shrink-0">
                        {schedule.isCompleted ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <Circle className="text-gray-400" size={20} />
                        )}
                      </button>
                      <div className="bg-[#ffd68e] px-2 py-1 rounded-full text-xs font-medium text-[#55423c]">Today</div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#55423c] text-sm">{schedule.time}</div>
                        <div className="text-xs text-gray-600"><span className="font-medium">{schedule.type}</span> • {schedule.petName}</div>
                      </div>
                      <button 
                        onClick={() => handleToggleNotification(schedule)} 
                        className="flex-shrink-0"
                        title={schedule.notificationsEnabled ? "Notifications on" : "Notifications off"}
                      >
                        <Bell 
                          size={20} 
                          className={schedule.notificationsEnabled ? "text-[#c18742] fill-[#c18742]" : "text-gray-400"}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 italic">No schedules for today</div>
              );
            })()
          ) : scheduleView === 'upcoming' ? (
            (() => {
              // Exclude today's schedules - only show schedules from tomorrow onwards
              const futureSchedules = upcomingSchedules.filter(s => {
                const scheduleDate = new Date(s.date);
                scheduleDate.setHours(0, 0, 0, 0);
                return scheduleDate.getTime() > todayDate.getTime();
              }).sort((a, b) => {
                const dateCompare = a.date.getTime() - b.date.getTime();
                if (dateCompare !== 0) return dateCompare;
                return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
              });
              return futureSchedules.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {futureSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
                      <div className="bg-[#ffd68e] px-2 py-1 rounded-full text-xs font-medium text-[#55423c] min-w-[60px] text-center">{formatDate(schedule.date)}</div>
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-[#55423c] text-sm">{schedule.time}</div>
                          <div className="text-xs text-gray-600"><span className="font-medium">{schedule.type}</span> • {schedule.petName}</div>
                          <div className="text-xs text-[#c18742] italic">{schedule.frequency}</div>
                          {schedule.notes && (<div className="text-xs text-gray-500 italic mt-1">{schedule.notes}</div>)}
                        </div>
                        {schedule.notifications && (<Bell className="text-[#c18742]" size={16} />)}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEditScheduleModal(schedule)} className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-200">Edit</button>
                        <button onClick={() => handleDeleteSchedule(schedule)} className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 italic">No upcoming schedules</div>
              );
            })()
          ) : (
            pastSchedules.length > 0 ? (
              <div className="space-y-3 opacity-70 max-h-96 overflow-y-auto pr-2">
                {pastSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0">
                      <CheckCircle className="text-green-500" size={20} />
                    </div>
                    <div className="bg-[#ffd68e] px-2 py-1 rounded-full text-xs font-medium text-[#55423c] min-w-[60px] text-center">{formatDate(schedule.date)}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-[#55423c] text-sm">{schedule.time}</div>
                      <div className="text-xs text-gray-600"><span className="font-medium">{schedule.type}</span> • {schedule.petName}</div>
                      <div className="text-xs text-[#c18742] italic">{schedule.frequency}</div>
                      {schedule.notes && (<div className="text-xs text-gray-500 italic mt-1">{schedule.notes}</div>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 italic">No past schedules</div>
            )
          )}
        </div>

        {/* Health Records Section - Only visible for Premium Tier 1 and above */}
        {features.hasHealthRecords && (
          <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#55423c] mb-4">Health Records</h2>
            {pets.some(pet => (pet.vaccinations && pet.vaccinations.length > 0) || (pet.vetVisits && pet.vetVisits.length > 0)) ? (
              <div className="space-y-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-bold text-[#55423c] mb-2">{pet.name}</h3>
                    
                    {/* Vaccinations */}
                    {pet.vaccinations && pet.vaccinations.length > 0 && (
                      <div className="ml-2 mb-3">
                        <h4 className="text-sm font-medium text-[#c18742] mb-2">Vaccinations</h4>
                        <div className="space-y-2">
                          {pet.vaccinations.map((vaccination) => (
                            <div key={vaccination.id} className="bg-gray-50 p-3 rounded-lg flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-[#55423c] text-sm">
                                  {vaccination.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Given: {vaccination.dateGiven}
                                </div>
                                {vaccination.nextDueDate && (
                                  <div className="text-xs text-[#c18742]">
                                    Next Due: {vaccination.nextDueDate}
                                  </div>
                                )}
                              </div>
                              {vaccination.nextDueDate && (
                                <button
                                  onClick={() => handleToggleHealthNotification(pet.id, 'vaccination', vaccination.id)}
                                  className="flex-shrink-0"
                                  title={vaccination.notificationsEnabled ? "Notifications on" : "Notifications off"}
                                >
                                  <Bell
                                    size={20}
                                    className={vaccination.notificationsEnabled ? "text-[#c18742] fill-[#c18742]" : "text-gray-400"}
                                  />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Vet Visits */}
                    {pet.vetVisits && pet.vetVisits.length > 0 && (
                      <div className="ml-2">
                        <h4 className="text-sm font-medium text-[#c18742] mb-2">Vet Visits</h4>
                        <div className="space-y-2">
                          {pet.vetVisits.map((visit) => (
                            <div key={visit.id} className="bg-gray-50 p-3 rounded-lg flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-[#55423c] text-sm">
                                  {visit.reason}
                                </div>
                                <div className="text-xs text-gray-600">
                                  Visit Date: {visit.visitDate}
                                </div>
                                {visit.diagnosis && (
                                  <div className="text-xs text-gray-600 italic">
                                    Diagnosis: {visit.diagnosis}
                                  </div>
                                )}
                                {visit.nextVisitDate && (
                                  <div className="text-xs text-[#c18742]">
                                    Next Visit: {visit.nextVisitDate}
                                  </div>
                                )}
                              </div>
                              {visit.nextVisitDate && (
                                <button
                                  onClick={() => handleToggleHealthNotification(pet.id, 'vetVisit', visit.id)}
                                  className="flex-shrink-0"
                                  title={visit.notificationsEnabled ? "Notifications on" : "Notifications off"}
                                >
                                  <Bell
                                    size={20}
                                    className={visit.notificationsEnabled ? "text-[#c18742] fill-[#c18742]" : "text-gray-400"}
                                  />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 italic">
                No health records available
              </div>
            )}
            <button
              onClick={() => navigateTo('/mypets')}
              className="w-full bg-[#ffd68e] text-[#55423c] py-2 rounded-lg font-medium mt-4 hover:bg-[#e6c27d] transition-colors"
            >
              Manage Health Records
            </button>
          </div>
        )}

        {/* Premium Features Section */}
        {!features.hasExport && (
          <div className="bg-[#ffd68e] border border-[#c18742] rounded-xl mx-4 mb-4 p-4 text-center">
            <h3 className="text-lg font-bold text-[#c18742] mb-2">Upgrade to Premium</h3>
            <p className="text-[#55423c] text-sm mb-4">
              Get access to advanced features like health tracking, reminders, and more!
            </p>
            <button
              onClick={() => navigateTo('/plans')}
              className="bg-[#c18742] text-white px-6 py-2 rounded-full font-medium hover:bg-[#a87338] transition-colors"
            >
              View Plans
            </button>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16">
        <div className="flex h-full">
          <button className="flex-1 flex flex-col items-center justify-center border-t-2 border-[#c18742] text-[#c18742] font-bold">
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => navigateTo('/mypets')}
            className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
          >
            <PawPrint size={20} />
            <span className="text-xs mt-1">Pets</span>
          </button>
          <button
            onClick={() => navigateTo('/plans')}
            className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
          >
            <Crown size={20} />
            <span className="text-xs mt-1">Plans</span>
          </button>
          <button
            onClick={() => navigateTo('/export')}
            className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
          >
            <Download size={20} />
            <span className="text-xs mt-1">Export</span>
          </button>
        </div>
      </nav>

      {/* Edit Schedule Modal */}
      {editModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#55423c] mb-4">Edit Schedule</h2>
              
              <input
                type="text"
                placeholder="Schedule Type"
                value={editFormData.type}
                onChange={(e) => setEditFormData({...editFormData, type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
              />
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <select
                  value={editFormData.hour}
                  onChange={(e) => setEditFormData({...editFormData, hour: e.target.value})}
                  className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                >
                  {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
                <select
                  value={editFormData.minute}
                  onChange={(e) => setEditFormData({...editFormData, minute: e.target.value})}
                  className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                >
                  {['00', '15', '30', '45'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={editFormData.ampm}
                  onChange={(e) => setEditFormData({...editFormData, ampm: e.target.value})}
                  className="border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>

              <select
                value={editFormData.frequency}
                onChange={(e) => setEditFormData({...editFormData, frequency: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>

              <textarea
                placeholder="Notes"
                value={editFormData.notes}
                onChange={(e) => setEditFormData({...editFormData, notes: e.target.value})}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#c18742] resize-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => setEditModalVisible(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSchedule}
                  className="flex-1 bg-[#c18742] text-white py-2 rounded-lg font-medium hover:bg-[#a87338]"
                >
                  Update
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