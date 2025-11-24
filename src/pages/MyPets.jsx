import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { 
  LogOut, 
  Home, 
  PawPrint, 
  Crown, 
  Download,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Stethoscope,
  X
} from 'lucide-react';
import { useSubscription } from '../context/useSubscriptionHook';

// Date Input Component
const DateInput = ({ dateValue, onDateChange, label }) => {
  const days = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1).padStart(2, '0'), value: String(i + 1).padStart(2, '0') }));
  const months = Array.from({ length: 12 }, (_, i) => ({ label: String(i + 1).padStart(2, '0'), value: String(i + 1).padStart(2, '0') }));
  
  const [month, day, year] = dateValue ? dateValue.split('/') : ['', '', ''];
  
  const handleMonthChange = (e) => {
    const value = e.target.value;
    const newDate = `${value}/${day || '01'}/${year || ''}`;
    onDateChange(newDate);
  };
  
  const handleDayChange = (e) => {
    const value = e.target.value;
    const newDate = `${month || '01'}/${value}/${year || ''}`;
    onDateChange(newDate);
  };
  
  const handleYearChange = (e) => {
    const numericText = e.target.value.replace(/[^0-9]/g, '');
    const newDate = `${month || '01'}/${day || '01'}/${numericText}`;
    onDateChange(newDate);
  };
  
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="flex items-center space-x-2">
        <select
          value={month}
          onChange={handleMonthChange}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
        >
          <option value="">MM</option>
          {months.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        
        <span className="text-gray-500">/</span>
        
        <select
          value={day}
          onChange={handleDayChange}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
        >
          <option value="">DD</option>
          {days.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
        
        <span className="text-gray-500">/</span>
        
        <input
          type="text"
          placeholder="YYYY"
          value={year}
          onChange={handleYearChange}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
          maxLength={4}
        />
      </div>
    </div>
  );
};

const MyPets = () => {
  const navigate = useNavigate();
  const { getPlanFeatures, currentPlan } = useSubscription();
  const features = getPlanFeatures(currentPlan);
  const [pets, setPets] = useState(() => {
    const saved = localStorage.getItem('pets');
    return saved ? JSON.parse(saved) : [];
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [healthRecordsModalVisible, setHealthRecordsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('vaccinations');
  
  const maxPets = features.maxPets;
  const petsRemaining = Math.max(0, maxPets - pets.length);
  const [selectedPet, setSelectedPet] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '',
    type: '',
    breed: '',
    age: '',
    photo: null
  });
  const [newSchedule, setNewSchedule] = useState({ 
    type: 'Feeding', 
    hour: '8', 
    minute: '00', 
    ampm: 'AM', 
    frequency: 'Daily', 
    notes: '' 
  });
  const [editScheduleMode, setEditScheduleMode] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [newVaccination, setNewVaccination] = useState({
    name: '',
    dateGiven: '',
    nextDueDate: '',
    veterinarian: '',
    notes: ''
  });
  const [newVetVisit, setNewVetVisit] = useState({
    visitDate: '',
    reason: '',
    veterinarian: '',
    nextVisitDate: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  });
  const [editHealthRecordMode, setEditHealthRecordMode] = useState(false);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);

  const navigateTo = (route) => {
    navigate(route);
  };

  const savePets = (updatedPets) => {
    setPets(updatedPets);
    localStorage.setItem('pets', JSON.stringify(updatedPets));
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      navigate('/');
    }
  };

  const canAccessHealthRecords = () => {
    if (!features.hasHealthRecords) {
      alert("Health Records are available for Premium Tier 1 and above subscribers.");
      return false;
    }
    return true;
  };

  const openHealthRecordsModal = (pet) => {
    if (canAccessHealthRecords()) {
      setSelectedPet(pet);
      setHealthRecordsModalVisible(true);
      setActiveTab('vaccinations');
      setEditHealthRecordMode(false);
      setSelectedHealthRecord(null);
      setNewVaccination({
        name: '',
        dateGiven: '',
        nextDueDate: '',
        veterinarian: '',
        notes: ''
      });
      setNewVetVisit({
        visitDate: '',
        reason: '',
        veterinarian: '',
        nextVisitDate: '',
        diagnosis: '',
        treatment: '',
        notes: ''
      });
    }
  };

  // Pet Management
  const handleAddPet = () => {
    if (newPet.name && newPet.type && newPet.age) {
      if (!editMode && pets.length >= maxPets) {
        alert(`Your ${currentPlan} allows a maximum of ${maxPets} pets. Please upgrade your plan to add more pets.`);
        return;
      }
      
      if (editMode && selectedPet) {
        const updatedPets = pets.map(pet => 
          pet.id === selectedPet.id 
            ? { ...pet, ...newPet }
            : pet
        );
        savePets(updatedPets);
      } else {
        const newPetObj = {
          ...newPet,
          id: Date.now().toString(),
          schedules: [],
          vaccinations: [],
          vetVisits: []
        };
        savePets([...pets, newPetObj]);
      }
      
      setNewPet({ name: '', type: '', breed: '', age: '', photo: null });
      setModalVisible(false);
      setEditMode(false);
    }
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setNewPet({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || '',
      age: pet.age,
      photo: pet.photo
    });
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDeletePet = (petId) => {
    if (confirm("Are you sure you want to delete this pet?")) {
      savePets(pets.filter(pet => pet.id !== petId));
      setModalVisible(false);
      setEditMode(false);
      setSelectedPet(null);
    }
  };

  // Schedule Management
  const openScheduleModal = (pet) => {
    setSelectedPet(pet);
    setEditScheduleMode(false);
    setSelectedSchedule(null);
    setNewSchedule({ 
      type: 'Feeding', 
      hour: '8', 
      minute: '00', 
      ampm: 'AM', 
      frequency: 'Daily', 
      notes: '' 
    });
    setScheduleModalVisible(true);
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

  const handleAddSchedule = () => {
    if (selectedPet && newSchedule.hour && newSchedule.minute && newSchedule.ampm) {
      const time = `${newSchedule.hour}:${newSchedule.minute} ${newSchedule.ampm}`;
      const scheduleData = {
        ...newSchedule,
        time: time,
        id: editScheduleMode ? selectedSchedule.id : Date.now().toString()
      };

      const updatedPets = pets.map(pet => {
        if (pet.id === selectedPet.id) {
          let updatedSchedules;
          if (editScheduleMode) {
            updatedSchedules = pet.schedules.map(schedule =>
              schedule.id === selectedSchedule.id ? scheduleData : schedule
            );
          } else {
            updatedSchedules = [...pet.schedules, scheduleData];
          }
          updatedSchedules.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
          return { ...pet, schedules: updatedSchedules };
        }
        return pet;
      });

      savePets(updatedPets);
      setSelectedPet(updatedPets.find(p => p.id === selectedPet.id));
      setNewSchedule({ type: 'Feeding', hour: '8', minute: '00', ampm: 'AM', frequency: 'Daily', notes: '' });
      setEditScheduleMode(false);
      setSelectedSchedule(null);
      setScheduleModalVisible(false);
      
      // Show info message about schedule display
      alert('Schedule ' + (editScheduleMode ? 'updated' : 'added') + ' successfully!\n\nNote: Today\'s scheduled items will only appear in the Dashboard');
    }
  };

  const handleEditSchedule = (pet, schedule) => {
    setSelectedPet(pet);
    setSelectedSchedule(schedule);
    
    const timeParts = schedule.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeParts) {
      setNewSchedule({
        type: schedule.type,
        hour: timeParts[1],
        minute: timeParts[2],
        ampm: timeParts[3],
        frequency: schedule.frequency,
        notes: schedule.notes || ''
      });
    }
    
    setEditScheduleMode(true);
    setScheduleModalVisible(true);
  };

  const handleDeleteSchedule = (pet, scheduleId) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      const updatedPets = pets.map(p => 
        p.id === pet.id 
          ? { ...p, schedules: p.schedules.filter(s => s.id !== scheduleId) }
          : p
      );
      savePets(updatedPets);
      setSelectedPet(updatedPets.find(p => p.id === pet.id));
    }
  };

  // Health Records Management
  const handleAddVaccination = () => {
    if (!newVaccination.name || !newVaccination.dateGiven) {
      alert('Please fill in all required fields (*)');
      return;
    }

    const updatedPets = pets.map(pet => {
      if (pet.id === selectedPet.id) {
        if (editHealthRecordMode) {
          const updatedVaccinations = pet.vaccinations.map(vaccination =>
            vaccination.id === selectedHealthRecord.id 
              ? { ...newVaccination, id: selectedHealthRecord.id }
              : vaccination
          );
          return { ...pet, vaccinations: updatedVaccinations };
        } else {
          return {
            ...pet,
            vaccinations: [...pet.vaccinations, { ...newVaccination, id: Date.now().toString() }]
          };
        }
      }
      return pet;
    });

    savePets(updatedPets);
    setSelectedPet(updatedPets.find(p => p.id === selectedPet.id));
    setNewVaccination({
      name: '',
      dateGiven: '',
      nextDueDate: '',
      veterinarian: '',
      notes: ''
    });
    setEditHealthRecordMode(false);
    setSelectedHealthRecord(null);
  };

  const handleEditVaccination = (vaccination) => {
    setNewVaccination({
      name: vaccination.name,
      dateGiven: vaccination.dateGiven,
      nextDueDate: vaccination.nextDueDate || '',
      veterinarian: vaccination.veterinarian || '',
      notes: vaccination.notes || ''
    });
    setEditHealthRecordMode(true);
    setSelectedHealthRecord(vaccination);
  };

  const handleDeleteVaccination = (vaccinationId) => {
    if (confirm("Are you sure you want to delete this vaccination record?")) {
      const updatedPets = pets.map(pet => {
        if (pet.id === selectedPet.id) {
          return {
            ...pet,
            vaccinations: pet.vaccinations.filter(v => v.id !== vaccinationId)
          };
        }
        return pet;
      });
      savePets(updatedPets);
      setSelectedPet(updatedPets.find(p => p.id === selectedPet.id));
    }
  };

  const handleAddVetVisit = () => {
    if (!newVetVisit.visitDate || !newVetVisit.reason) {
      alert('Please fill in all required fields (*)');
      return;
    }

    const updatedPets = pets.map(pet => {
      if (pet.id === selectedPet.id) {
        if (editHealthRecordMode) {
          const updatedVetVisits = pet.vetVisits.map(visit =>
            visit.id === selectedHealthRecord.id 
              ? { ...newVetVisit, id: selectedHealthRecord.id }
              : visit
          );
          return { ...pet, vetVisits: updatedVetVisits };
        } else {
          return {
            ...pet,
            vetVisits: [...pet.vetVisits, { ...newVetVisit, id: Date.now().toString() }]
          };
        }
      }
      return pet;
    });

    savePets(updatedPets);
    setSelectedPet(updatedPets.find(p => p.id === selectedPet.id));
    setNewVetVisit({
      visitDate: '',
      reason: '',
      veterinarian: '',
      nextVisitDate: '',
      diagnosis: '',
      treatment: '',
      notes: ''
    });
    setEditHealthRecordMode(false);
    setSelectedHealthRecord(null);
  };

  const handleEditVetVisit = (visit) => {
    setNewVetVisit({
      visitDate: visit.visitDate,
      reason: visit.reason,
      veterinarian: visit.veterinarian || '',
      nextVisitDate: visit.nextVisitDate || '',
      diagnosis: visit.diagnosis || '',
      treatment: visit.treatment || '',
      notes: visit.notes || ''
    });
    setEditHealthRecordMode(true);
    setSelectedHealthRecord(visit);
  };

  const handleDeleteVetVisit = (vetVisitId) => {
    if (confirm("Are you sure you want to delete this vet visit record?")) {
      const updatedPets = pets.map(pet => {
        if (pet.id === selectedPet.id) {
          return {
            ...pet,
            vetVisits: pet.vetVisits.filter(v => v.id !== vetVisitId)
          };
        }
        return pet;
      });
      savePets(updatedPets);
      setSelectedPet(updatedPets.find(p => p.id === selectedPet.id));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-[#55423c] text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">My Pets</h1>
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
        {/* Pet Slots Information */}
        <div className="bg-white p-4 m-4 rounded-xl shadow-sm border border-gray-100">
          <div className="text-lg font-bold text-[#55423c] mb-2">
            {pets.length} / {maxPets} Pet Slots Used ({petsRemaining} remaining)
          </div>
          <div className="text-sm text-[#795225] mb-3">
            Current Plan: {currentPlan}
          </div>
          {petsRemaining === 0 && (
            <button
              onClick={() => navigateTo('/plans')}
              className="w-full bg-[#c18742] text-white py-2 rounded-lg font-bold hover:bg-[#a87338] transition-colors"
            >
              Upgrade Plan for More Slots
            </button>
          )}
        </div>

        {/* Pet List */}
        <div className="p-4">
          {pets.length > 0 ? (
            <div className="space-y-4">
              {pets.map(pet => (
                <div key={pet.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Pet Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center">
                    <div className="mr-4">
                      {pet.photo ? (
                        <img src={pet.photo} alt={pet.name} className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[#ffd68e] flex items-center justify-center">
                          <span className="text-2xl font-bold text-[#55423c]">
                            {pet.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#55423c]">{pet.name}</h3>
                      <p className="text-sm text-[#795225]">{pet.type} • {pet.age} years old</p>
                      {pet.breed && <p className="text-sm text-[#795225]">Breed: {pet.breed}</p>}
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEditPet(pet)}
                        className="bg-[#ffd68e] text-[#55423c] px-3 py-1 rounded text-sm font-medium hover:bg-[#e6c27d] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-red-200 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Pet Actions */}
                  <div className="p-4 border-b border-gray-100 flex justify-between">
                    <button
                      onClick={() => openScheduleModal(pet)}
                      className="flex-1 bg-[#ffd68e] text-[#55423c] py-2 rounded-lg font-medium mx-1 hover:bg-[#e6c27d] transition-colors"
                    >
                      Manage Schedules
                    </button>
                    <button
                      onClick={() => openHealthRecordsModal(pet)}
                      className="flex-1 bg-[#ffd68e] text-[#55423c] py-2 rounded-lg font-medium mx-1 hover:bg-[#e6c27d] transition-colors"
                    >
                      Health Records
                    </button>
                  </div>

                  {/* Pet Schedules */}
                  {pet.schedules.length > 0 && (
                    <div className="p-4">
                      <h4 className="text-md font-bold text-[#55423c] mb-3">Schedules</h4>
                      <div className="space-y-3">
                        {[...pet.schedules].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)).map(schedule => (
                          <div key={schedule.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                            <div className="flex items-center flex-1">
                              <div className="w-1 h-12 bg-[#c18742] rounded-full mr-3"></div>
                              <div className="flex-1">
                                <div className="font-semibold text-[#55423c]">{schedule.type}</div>
                                <div className="text-sm text-[#795225]">
                                  {schedule.time} • {schedule.frequency}
                                </div>
                                {schedule.notes && (
                                  <div className="text-sm text-gray-500 italic mt-1">{schedule.notes}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditSchedule(pet, schedule)}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSchedule(pet, schedule.id)}
                                className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                              >
                                Delete
                              </button>
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
            <div className="text-center py-12">
              <h3 className="text-xl font-bold text-[#55423c] mb-2">No Pets Added Yet</h3>
              <p className="text-[#795225]">Add your first pet to start tracking schedules</p>
            </div>
          )}
        </div>

        {/* Add Pet Button */}
        <div className="p-4">
          <button
            onClick={() => {
              setEditMode(false);
              setNewPet({ name: '', type: '', breed: '', age: '', photo: null });
              setModalVisible(true);
            }}
            className="w-full bg-[#c18742] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a87338] transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Pet
          </button>
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
          <button className="flex-1 flex flex-col items-center justify-center border-t-2 border-[#c18742] text-[#c18742] font-bold">
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

      {/* Add/Edit Pet Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <h2 className="text-xl font-bold text-[#55423c] mb-4 text-center">
                {editMode ? 'Edit Pet' : 'Add New Pet'}
              </h2>
              
              <input
                type="text"
                placeholder="Pet Name*"
                value={newPet.name}
                onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
              />
              
              <input
                type="text"
                placeholder="Pet Type (e.g., Dog, Cat)*"
                value={newPet.type}
                onChange={(e) => setNewPet({...newPet, type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
              />
              
              <input
                type="text"
                placeholder="Breed (optional)"
                value={newPet.breed}
                onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
              />
              
              <input
                type="text"
                placeholder="Age*"
                value={newPet.age}
                onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setModalVisible(false);
                    setEditMode(false);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                
                {editMode && (
                  <button
                    onClick={() => {
                      setModalVisible(false);
                      handleDeletePet(selectedPet.id);
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                )}
                
                <button
                  onClick={handleAddPet}
                  className="flex-1 bg-[#c18742] text-white py-2 rounded-lg font-medium hover:bg-[#a87338] transition-colors"
                >
                  {editMode ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {scheduleModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <h2 className="text-xl font-bold text-[#55423c] mb-4 text-center">
                {editScheduleMode ? 'Edit Schedule' : 'Add New Schedule'}
              </h2>
              
              <input
                type="text"
                placeholder="Schedule Type (e.g., Feeding, Medication)*"
                value={newSchedule.type}
                onChange={(e) => setNewSchedule({...newSchedule, type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
              />
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hour</label>
                  <select
                    value={newSchedule.hour}
                    onChange={(e) => setNewSchedule({...newSchedule, hour: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                  >
                    {Array.from({length: 12}, (_, i) => i + 1).map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Minute</label>
                  <select
                    value={newSchedule.minute}
                    onChange={(e) => setNewSchedule({...newSchedule, minute: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                  >
                    {['00', '15', '30', '45'].map(minute => (
                      <option key={minute} value={minute}>{minute}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">AM/PM</label>
                  <select
                    value={newSchedule.ampm}
                    onChange={(e) => setNewSchedule({...newSchedule, ampm: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm text-gray-600 mb-1">Frequency</label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule({...newSchedule, frequency: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              
              <textarea
                placeholder="Notes (optional)"
                value={newSchedule.notes}
                onChange={(e) => setNewSchedule({...newSchedule, notes: e.target.value})}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#c18742] resize-none"
              />
              
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setScheduleModalVisible(false);
                    setEditScheduleMode(false);
                    setSelectedSchedule(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                
                {editScheduleMode && (
                  <button
                    onClick={() => {
                      setScheduleModalVisible(false);
                      handleDeleteSchedule(selectedPet, selectedSchedule.id);
                    }}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                )}
                
                <button
                  onClick={handleAddSchedule}
                  className="flex-1 bg-[#c18742] text-white py-2 rounded-lg font-medium hover:bg-[#a87338] transition-colors"
                >
                  {editScheduleMode ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Records Modal */}
      {healthRecordsModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#55423c] mb-4 text-center">Health Records</h2>
              
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-4">
                <button
                  onClick={() => setActiveTab('vaccinations')}
                  className={`flex-1 py-3 text-center font-medium ${
                    activeTab === 'vaccinations'
                      ? 'border-b-2 border-[#c18742] text-[#c18742]'
                      : 'text-gray-500'
                  }`}
                >
                  Vaccinations
                </button>
                <button
                  onClick={() => setActiveTab('vetVisits')}
                  className={`flex-1 py-3 text-center font-medium ${
                    activeTab === 'vetVisits'
                      ? 'border-b-2 border-[#c18742] text-[#c18742]'
                      : 'text-gray-500'
                  }`}
                >
                  Vet Visits
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto">
                {/* Vaccinations Tab */}
                {activeTab === 'vaccinations' && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#55423c] mb-4">
                      {editHealthRecordMode ? 'Edit Vaccination' : 'Add New Vaccination'}
                    </h3>
                    
                    <input
                      type="text"
                      placeholder="Vaccination Name*"
                      value={newVaccination.name}
                      onChange={(e) => setNewVaccination({...newVaccination, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                    />
                    
                    <DateInput
                      label="Date Given*"
                      dateValue={newVaccination.dateGiven}
                      onDateChange={(value) => setNewVaccination({...newVaccination, dateGiven: value})}
                    />
                    
                    <DateInput
                      label="Next Due Date"
                      dateValue={newVaccination.nextDueDate}
                      onDateChange={(value) => setNewVaccination({...newVaccination, nextDueDate: value})}
                    />
                    
                    <input
                      type="text"
                      placeholder="Veterinarian"
                      value={newVaccination.veterinarian}
                      onChange={(e) => setNewVaccination({...newVaccination, veterinarian: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                    />
                    
                    <textarea
                      placeholder="Notes"
                      value={newVaccination.notes}
                      onChange={(e) => setNewVaccination({...newVaccination, notes: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#c18742] resize-none"
                    />
                    
                    {/* Vaccination History */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-[#55423c] mb-3">Vaccination History:</h4>
                      {selectedPet?.vaccinations?.length > 0 ? (
                        <div className="space-y-3">
                          {selectedPet.vaccinations.map((vaccination) => (
                            <div key={vaccination.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium text-[#55423c]">{vaccination.name}</div>
                                <div className="text-sm text-gray-600">Given: {vaccination.dateGiven}</div>
                                {vaccination.nextDueDate && (
                                  <div className="text-sm text-[#c18742]">Next Due: {vaccination.nextDueDate}</div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditVaccination(vaccination)}
                                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteVaccination(vaccination.id)}
                                  className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No vaccination records yet.</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Vet Visits Tab */}
                {activeTab === 'vetVisits' && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#55423c] mb-4">
                      {editHealthRecordMode ? 'Edit Vet Visit' : 'Add New Vet Visit'}
                    </h3>
                    
                    <DateInput
                      label="Visit Date*"
                      dateValue={newVetVisit.visitDate}
                      onDateChange={(value) => setNewVetVisit({...newVetVisit, visitDate: value})}
                    />
                    
                    <input
                      type="text"
                      placeholder="Reason for Visit*"
                      value={newVetVisit.reason}
                      onChange={(e) => setNewVetVisit({...newVetVisit, reason: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                    />
                    
                    <input
                      type="text"
                      placeholder="Veterinarian"
                      value={newVetVisit.veterinarian}
                      onChange={(e) => setNewVetVisit({...newVetVisit, veterinarian: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                    />
                    
                    <DateInput
                      label="Next Visit Date"
                      dateValue={newVetVisit.nextVisitDate}
                      onDateChange={(value) => setNewVetVisit({...newVetVisit, nextVisitDate: value})}
                    />
                    
                    <input
                      type="text"
                      placeholder="Diagnosis"
                      value={newVetVisit.diagnosis}
                      onChange={(e) => setNewVetVisit({...newVetVisit, diagnosis: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                    />
                    
                    <input
                      type="text"
                      placeholder="Treatment"
                      value={newVetVisit.treatment}
                      onChange={(e) => setNewVetVisit({...newVetVisit, treatment: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742]"
                    />
                    
                    <textarea
                      placeholder="Notes"
                      value={newVetVisit.notes}
                      onChange={(e) => setNewVetVisit({...newVetVisit, notes: e.target.value})}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#c18742] resize-none"
                    />
                    
                    {/* Vet Visit History */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-[#55423c] mb-3">Vet Visit History:</h4>
                      {selectedPet?.vetVisits?.length > 0 ? (
                        <div className="space-y-3">
                          {selectedPet.vetVisits.map((visit) => (
                            <div key={visit.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                              <div className="flex-1">
                                <div className="font-medium text-[#55423c]">{visit.reason}</div>
                                <div className="text-sm text-gray-600">Date: {visit.visitDate}</div>
                                {visit.diagnosis && (
                                  <div className="text-sm text-gray-600">Diagnosis: {visit.diagnosis}</div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditVetVisit(visit)}
                                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteVetVisit(visit.id)}
                                  className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs hover:bg-red-200 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">No vet visit records yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setHealthRecordsModalVisible(false);
                    setEditHealthRecordMode(false);
                    setSelectedHealthRecord(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                
                <button
                  onClick={activeTab === 'vaccinations' ? handleAddVaccination : handleAddVetVisit}
                  className="flex-1 bg-[#c18742] text-white py-2 rounded-lg font-medium hover:bg-[#a87338] transition-colors"
                >
                  {editHealthRecordMode ? 'Update' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPets;