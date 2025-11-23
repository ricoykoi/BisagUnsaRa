import React, { useState } from 'react';
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
  Stethoscope
} from 'lucide-react';

// Static data
const staticPets = [
  {
    id: 1,
    name: "Buddy",
    type: "Dog",
    schedules: [
      {
        id: 1,
        type: "Feeding",
        time: "08:00 AM",
        frequency: "Daily",
        notes: "1 cup of dry food",
        completedDates: ['2024-01-15']
      },
      {
        id: 2,
        type: "Walk",
        time: "06:00 PM",
        frequency: "Daily",
        notes: "Evening walk in park"
      }
    ],
    vaccinations: [
      {
        id: 1,
        name: "Rabies",
        dateGiven: "2024-01-10",
        nextDueDate: "2025-01-10"
      }
    ],
    vetVisits: [
      {
        id: 1,
        reason: "Annual Checkup",
        visitDate: "2024-01-10",
        diagnosis: "Healthy",
        nextVisitDate: "2025-01-10"
      }
    ]
  },
  {
    id: 2,
    name: "Whiskers",
    type: "Cat",
    schedules: [
      {
        id: 3,
        type: "Feeding",
        time: "07:00 AM",
        frequency: "Daily",
        notes: "Wet food breakfast"
      }
    ]
  }
];

const staticSubscriptionPlan = "Free Mode";
const staticIsPremiumTier1 = false;
const staticIsPremiumTier2 = false;

const petCareTips = [
  {
    title: "Proper Hydration for Dogs",
    content: "Make sure your dog has access to fresh water at all times, especially during hot weather."
  },
  {
    title: "Cat Grooming Tips",
    content: "Regular brushing helps reduce hairballs and keeps your cat's coat healthy."
  },
  {
    title: "Exercise for Small Pets",
    content: "Even small pets need daily exercise. Consider toys that encourage movement."
  }
];

// Static schedule data
const staticUpcomingSchedules = [
  {
    id: "1-2024-01-20",
    originalScheduleId: 1,
    type: "Feeding",
    time: "08:00 AM",
    date: new Date(2024, 0, 20),
    frequency: "Daily",
    notes: "1 cup of dry food",
    petName: "Buddy",
    petId: 1,
    isCompleted: false,
    isToday: true,
    notifications: true
  },
  {
    id: "2-2024-01-20",
    originalScheduleId: 2,
    type: "Walk",
    time: "06:00 PM",
    date: new Date(2024, 0, 20),
    frequency: "Daily",
    notes: "Evening walk in park",
    petName: "Buddy",
    petId: 1,
    isCompleted: false,
    isToday: true
  },
  {
    id: "3-2024-01-20",
    originalScheduleId: 3,
    type: "Feeding",
    time: "07:00 AM",
    date: new Date(2024, 0, 20),
    frequency: "Daily",
    notes: "Wet food breakfast",
    petName: "Whiskers",
    petId: 2,
    isCompleted: false,
    isToday: true
  }
];

const staticPastSchedules = [
  {
    id: "1-2024-01-15",
    originalScheduleId: 1,
    type: "Feeding",
    time: "08:00 AM",
    date: new Date(2024, 0, 15),
    frequency: "Daily",
    notes: "1 cup of dry food",
    petName: "Buddy",
    petId: 1,
    isCompleted: true,
    isToday: false
  }
];

const formatDate = (date) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [upcomingSchedules, setUpcomingSchedules] = useState(staticUpcomingSchedules);
  const [pastSchedules, setPastSchedules] = useState(staticPastSchedules);
  const [scheduleView, setScheduleView] = useState('upcoming');


  console.log(setPastSchedules)

  const navigateTo = (route) => {
    navigate(route);
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

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      navigate('/');
    }
  };

  // Static calculations
  const activeSchedules = staticPets.reduce((total, pet) => {
    return total + (pet.schedules ? pet.schedules.length : 0);
  }, 0);

  const completedTasks = staticPets.reduce((total, pet) => {
    if (!pet.schedules) return total;
    return total + pet.schedules.reduce((t, s) => t + (Array.isArray(s.completedDates) ? s.completedDates.length : 0), 0);
  }, 0);

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
              <div className="text-2xl font-bold text-[#c18742]">{staticPets.length}</div>
              <div className="text-sm text-[#795225]">Pets</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">{activeSchedules}</div>
              <div className="text-sm text-[#795225]">Active Schedules</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">{completedTasks}</div>
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
                  <div className="font-bold text-[#c18742]">{staticSubscriptionPlan}</div>
                </div>
              </div>
              <button
                onClick={() => navigateTo('/plans')}
                className="bg-[#ffd68e] text-[#55423c] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#e6c27d] transition-colors"
              >
                Change
              </button>
            </div>
            {staticSubscriptionPlan === 'Free Mode' && (
              <div className="text-sm text-[#795225] italic text-center mt-2">
                Upgrade to unlock more features
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Schedules Section */}
        <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[#55423c]">Schedule Records</h2>
            <div className="flex bg-gray-100 rounded-full p-1">
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

          {scheduleView === 'upcoming' ? (
            upcomingSchedules.length > 0 ? (
              <div className="space-y-3">
                {upcomingSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <button
                      onClick={() => handleToggleComplete(schedule.id, schedule.isToday)}
                      className="flex-shrink-0"
                    >
                      {schedule.isCompleted ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <Circle className="text-gray-400" size={20} />
                      )}
                    </button>
                    <div className="bg-[#ffd68e] px-2 py-1 rounded-full text-xs font-medium text-[#55423c] min-w-[60px] text-center">
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
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 italic">
                No upcoming schedules
              </div>
            )
          ) : (
            pastSchedules.length > 0 ? (
              <div className="space-y-3 opacity-70">
                {pastSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      <CheckCircle className="text-green-500" size={20} />
                    </div>
                    <div className="bg-[#ffd68e] px-2 py-1 rounded-full text-xs font-medium text-[#55423c] min-w-[60px] text-center">
                      {formatDate(schedule.date)}
                    </div>
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 italic">
                No past schedules
              </div>
            )
          )}
        </div>

        {/* Health Records Section - Only visible for Premium Tier 1 and above */}
        {(staticIsPremiumTier1 || staticIsPremiumTier2) && (
          <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#55423c] mb-4">Health Records</h2>
            {staticPets.some(pet => (pet.vaccinations && pet.vaccinations.length > 0) || (pet.vetVisits && pet.vetVisits.length > 0)) ? (
              <div className="space-y-4">
                {staticPets.map((pet) => (
                  <div key={pet.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <h3 className="font-bold text-[#55423c] mb-2">{pet.name}</h3>
                    
                    {/* Vaccinations */}
                    {pet.vaccinations && pet.vaccinations.length > 0 && (
                      <div className="ml-2 mb-3">
                        <h4 className="text-sm font-medium text-[#c18742] mb-2">Vaccinations</h4>
                        <div className="space-y-2">
                          {pet.vaccinations.map((vaccination) => (
                            <div key={vaccination.id} className="bg-gray-50 p-3 rounded-lg">
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
                            <div key={visit.id} className="bg-gray-50 p-3 rounded-lg">
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

        {/* Pet Care Tips Section - Only visible for Premium Tier 2 subscribers */}
        {staticIsPremiumTier2 && (
          <div className="bg-white rounded-xl mx-4 mb-4 p-4 shadow-sm">
            <h2 className="text-lg font-bold text-[#55423c] mb-4">Pet Care Tips</h2>
            <div className="space-y-4">
              {petCareTips.map((tip, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-medium text-[#55423c] mb-2">{tip.title}</h3>
                  <p className="text-sm text-gray-600">{tip.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Features Section */}
        {!staticIsPremiumTier2 && (
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
    </div>
  );
};

export default Dashboard;