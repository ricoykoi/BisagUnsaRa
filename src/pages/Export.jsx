import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { 
  LogOut, 
  Home, 
  PawPrint, 
  Crown, 
  Download,
  Check,
  X,
  Bell,
  Calendar,
  Clock
} from 'lucide-react';

// Static data
const staticPets = [
  {
    id: "1",
    name: "Buddy",
    type: "Dog",
    breed: "Golden Retriever",
    age: "3",
    schedules: [
      {
        id: "1",
        type: "Feeding",
        time: "08:00 AM",
        frequency: "Daily",
        notes: "1 cup of dry food",
        completedDates: ['2024-01-15']
      },
      {
        id: "2",
        type: "Walk",
        time: "06:00 PM",
        frequency: "Daily",
        notes: "Evening walk in park"
      }
    ]
  },
  {
    id: "2",
    name: "Whiskers",
    type: "Cat",
    breed: "Siamese",
    age: "2",
    schedules: [
      {
        id: "3",
        type: "Feeding",
        time: "07:00 AM",
        frequency: "Daily",
        notes: "Wet food breakfast"
      }
    ]
  }
];

const staticSubscriptionPlan = "Free Mode";
const staticIsPremiumTier2 = false;

// Schedule utility functions
const generateUpcomingSchedules = (pets, daysAhead = 7) => {
  const upcoming = [];
  const today = new Date();
  
  pets.forEach(pet => {
    if (pet.schedules) {
      pet.schedules.forEach(schedule => {
        const scheduleTime = parseTimeString(schedule.time);
        if (!scheduleTime) return;
        
        for (let i = 0; i < daysAhead; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() + i);
          
          if (shouldScheduleOccur(schedule.frequency, checkDate, schedule)) {
            const scheduleDateTime = new Date(checkDate);
            scheduleDateTime.setHours(scheduleTime.hours, scheduleTime.minutes, 0, 0);
            
            upcoming.push({
              id: `${schedule.id}-${checkDate.toISOString().split('T')[0]}`,
              originalScheduleId: schedule.id,
              type: schedule.type,
              time: schedule.time,
              date: checkDate,
              dateTime: scheduleDateTime,
              frequency: schedule.frequency,
              notes: schedule.notes,
              petName: pet.name,
              petId: pet.id,
              isCompleted: false,
              isToday: i === 0
            });
          }
        }
      });
    }
  });
  
  return upcoming.sort((a, b) => a.dateTime - b.dateTime);
};

const parseTimeString = (timeStr) => {
  if (!timeStr) return null;
  const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!timeParts) return null;
  
  let hours = parseInt(timeParts[1]);
  const minutes = parseInt(timeParts[2]);
  const ampm = timeParts[3].toUpperCase();
  
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  
  return { hours, minutes };
};

const shouldScheduleOccur = (frequency, date, schedule = {}) => {
  const dayOfWeek = date.getDay();
  const dayOfMonth = date.getDate();

  const getAnchorDate = (s) => {
    if (!s) return null;
    const possible = ['startDate', 'date', 'start_on', 'start'];
    for (const key of possible) {
      if (s[key]) {
        const d = new Date(s[key]);
        if (!isNaN(d)) return d;
      }
    }
    return null;
  };

  if (frequency === 'Daily') return true;

  if (frequency === 'Weekly') {
    if (typeof schedule.dayOfWeek === 'number') return dayOfWeek === schedule.dayOfWeek;
    if (schedule.weekday) {
      const parsed = parseInt(schedule.weekday, 10);
      if (!isNaN(parsed)) return dayOfWeek === parsed;
    }

    const anchor = getAnchorDate(schedule);
    if (anchor) return dayOfWeek === anchor.getDay();

    return dayOfWeek === new Date().getDay();
  }

  if (frequency === 'Monthly') {
    if (typeof schedule.dayOfMonth === 'number') return dayOfMonth === schedule.dayOfMonth;

    const anchor = getAnchorDate(schedule);
    if (anchor) return dayOfMonth === anchor.getDate();

    if (schedule.date && typeof schedule.date === 'string') {
      const num = parseInt(schedule.date.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) return dayOfMonth === num;
    }

    return dayOfMonth === new Date().getDate();
  }

  return true;
};

const formatDate = (date) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const Export = () => {
  const navigate = useNavigate();
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const petsArray = staticPets;

  const navigateTo = (route) => {
    navigate(route);
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      navigate('/');
    }
  };

  // Generate schedules when component mounts
  useEffect(() => {
    const upcoming = generateUpcomingSchedules(petsArray, 14);
    setUpcomingSchedules(upcoming);
  }, []);

  // Calculate active schedules
  const activeSchedules = petsArray.reduce((total, pet) => {
    return total + (pet.schedules ? pet.schedules.length : 0);
  }, 0);

  const handleExport = () => {
    if (petsArray.length === 0) {
      alert('No Data', 'No pets to export. Add a pet first.');
      return;
    }
    alert('Success', 'Data exported successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#55423c] text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Export Data</h1>
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
        {/* Summary Stats */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">{petsArray.length}</div>
              <div className="text-sm text-[#795225]">Pets</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">{activeSchedules}</div>
              <div className="text-sm text-[#795225]">Active Schedules</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">
                {upcomingSchedules.filter(s => s.isToday).length}
              </div>
              <div className="text-sm text-[#795225]">Today's Tasks</div>
            </div>
          </div>
        </div>

        {/* Export Preview Section */}
        <div className="bg-white rounded-xl mx-4 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#55423c] mb-6">Upcoming Schedules (Preview)</h2>

          {upcomingSchedules.length > 0 ? (
            <div className="space-y-4">
              {upcomingSchedules.map((schedule) => {
                const pet = petsArray.find(p => p.id === schedule.petId);
                const original = pet?.schedules?.find(s => s.id === schedule.originalScheduleId);
                const dateKey = schedule.date.toISOString().split('T')[0];
                const alreadyCompleted = Array.isArray(original?.completedDates) && original.completedDates.includes(dateKey);

                return (
                  <div key={schedule.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      {alreadyCompleted ? (
                        <Check className="text-green-500" size={20} />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded"></div>
                      )}
                    </div>
                    
                    <div className="bg-[#ffd68e] px-3 py-1 rounded-full text-xs font-medium text-[#55423c] min-w-[80px] text-center">
                      {schedule.isToday ? 'Today' : formatDate(schedule.date)}
                    </div>
                    
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-[#55423c] text-sm">
                          {schedule.time}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">{schedule.type}</span> • {schedule.petName}
                        </div>
                        <div className="text-xs text-[#c18742] italic">
                          {schedule.frequency}
                        </div>
                        {schedule.notes && (
                          <div className="text-xs text-gray-500 italic mt-1">
                            {schedule.notes}
                          </div>
                        )}
                      </div>
                      {schedule.notifications && (
                        <Bell className="text-[#c18742]" size={16} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 italic">
              No upcoming schedules to preview
            </div>
          )}

          {/* Export Button Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {staticIsPremiumTier2 ? (
              <button
                onClick={handleExport}
                className="w-full bg-[#c18742] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a87338] transition-colors flex items-center justify-center gap-3"
              >
                <Download size={24} />
                Export to PDF
              </button>
            ) : (
              <div className="bg-[#ffd68e] border border-[#c18742] rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-[#c18742] rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#c18742] mb-2">
                  Premium Tier 2 Feature
                </h3>
                <p className="text-[#55423c] mb-4">
                  Unlock PDF export by upgrading to Premium Tier 2
                </p>
                <button
                  onClick={() => navigateTo('/plans')}
                  className="bg-[#c18742] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#a87338] transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            )}
          </div>

          {/* Additional Export Information */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-[#55423c] mb-2">What's included in the export:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• All pet profiles and information</li>
              <li>• Complete schedule history</li>
              <li>• Upcoming schedule preview</li>
              <li>• Health records (if available)</li>
              <li>• Export date and summary statistics</li>
            </ul>
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-xl mx-4 mt-4 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#55423c] mb-4">Data Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-[#55423c] font-medium">Total Pets</span>
              <span className="font-bold text-[#c18742]">{petsArray.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-[#55423c] font-medium">Active Schedules</span>
              <span className="font-bold text-[#c18742]">{activeSchedules}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-[#55423c] font-medium">Upcoming Tasks (14 days)</span>
              <span className="font-bold text-[#c18742]">{upcomingSchedules.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#55423c] font-medium">Current Plan</span>
              <span className="font-bold text-[#c18742]">{staticSubscriptionPlan}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16">
        <div className="flex h-full">
          <button
            onClick={() => navigateTo('/dashboard')}
            className="flex-1 flex flex-col items-center justify-center text-[#795225] hover:text-[#55423c] transition-colors"
          >
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
          <button className="flex-1 flex flex-col items-center justify-center border-t-2 border-[#c18742] text-[#c18742] font-bold">
            <Download size={20} />
            <span className="text-xs mt-1">Export</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Export;