import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  X,
  Bell,
  CheckCircle,
  AlertCircle,
  Heart,
  Activity,
  ChevronRight,
  Upload,
  Info,
} from "lucide-react";
import { useSubscription } from "../context/useSubscriptionHook";
import {
  createPet,
  getPets,
  updatePet,
  deletePet,
} from "../services/petService";
import { AuthenticationContext } from "../context/AuthenticationContext";

// Enhanced Date Input Component
const DateInput = ({ dateValue, onDateChange, label, required = false }) => {
  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [year, month, day] = value.split("-");
      const formatted = `${month}/${day}/${year}`;
      onDateChange(formatted);
    } else {
      onDateChange("");
    }
  };

  const getInputValue = () => {
    if (!dateValue) return "";
    const [month, day, year] = dateValue.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#795225] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <Calendar
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#795225]"
          size={18}
        />
        <input
          type="date"
          value={getInputValue()}
          onChange={handleDateChange}
          className="w-full border border-[#e8d7ca] rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent bg-white"
        />
      </div>
    </div>
  );
};

const MyPets = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getPlanFeatures, currentPlan } = useSubscription();
  const features = getPlanFeatures(currentPlan);
  const [pets, setPets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [healthRecordsModalVisible, setHealthRecordsModalVisible] =
    useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const [activeTab, setActiveTab] = useState("vaccinations");
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthenticationContext);

  const maxPets = features.maxPets;
  const petsRemaining = Math.max(0, maxPets - pets.length);
  const [selectedPet, setSelectedPet] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    photo: null,
    fatherBreed: "",
    motherBreed: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPet({ ...newPet, photo: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const [newSchedule, setNewSchedule] = useState({
    type: "Feeding",
    hour: "8",
    minute: "00",
    ampm: "AM",
    frequency: "Daily",
    notes: "",
  });
  const [editScheduleMode, setEditScheduleMode] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [newVaccination, setNewVaccination] = useState({
    name: "",
    dateGiven: "",
    nextDueDate: "",
    veterinarian: "",
    notes: "",
  });
  const [newVetVisit, setNewVetVisit] = useState({
    visitDate: "",
    reason: "",
    veterinarian: "",
    nextVisitDate: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });
  const [editHealthRecordMode, setEditHealthRecordMode] = useState(false);
  const [selectedHealthRecord, setSelectedHealthRecord] = useState(null);

  useEffect(() => {
    const { state } = location;
    if (state?.action === "editHealthRecord" && state.petId && state.recordId) {
      const petToEdit = pets.find((p) => p._id === state.petId);
      if (petToEdit) {
        const recordType =
          state.recordType === "vaccination" ? "vaccinations" : "vetVisits";
        const recordToEdit = petToEdit[recordType]?.find(
          (r) => r._id === state.recordId
        );

        if (recordToEdit) {
          openHealthRecordsModal(petToEdit);
          setActiveTab(recordType);
          if (state.recordType === "vaccination") {
            handleEditVaccination(recordToEdit);
          } else {
            handleEditVetVisit(recordToEdit);
          }
        }
      }
    }
  }, [location, pets]);

  useEffect(() => {
    const fetchPets = async () => {
      if (user?._id) {
        try {
          const userPets = await getPets(user._id);
          setPets(userPets);
        } catch (error) {
          console.error("Failed to fetch pets:", error);
        }
      }
    };
    fetchPets();
  }, [user]);

  const navigateTo = (route) => {
    navigate(route);
  };

  const canAccessHealthRecords = () => {
    if (!features.hasHealthRecords) {
      alert(
        "Health Records are available for Premium Tier 1 and above subscribers."
      );
      return false;
    }
    return true;
  };

  const openHealthRecordsModal = (pet) => {
    if (canAccessHealthRecords()) {
      setSelectedPet(pet);
      setHealthRecordsModalVisible(true);
      setActiveTab("vaccinations");
      setEditHealthRecordMode(false);
      setSelectedHealthRecord(null);
      setNewVaccination({
        name: "",
        dateGiven: "",
        nextDueDate: "",
        veterinarian: "",
        notes: "",
      });
      setNewVetVisit({
        visitDate: "",
        reason: "",
        veterinarian: "",
        nextVisitDate: "",
        diagnosis: "",
        treatment: "",
        notes: "",
      });
    }
  };

  const openProfileModal = (pet) => {
    setSelectedPet(pet);
    setProfileModalVisible(true);
  };

  // Calculate schedule statistics
  const getScheduleStats = (pet) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyCount = pet.schedules.filter(
      (s) => s.frequency === "Daily"
    ).length;
    const weeklyCount = pet.schedules.filter(
      (s) => s.frequency === "Weekly"
    ).length;
    const monthlyCount = pet.schedules.filter(
      (s) => s.frequency === "Monthly"
    ).length;

    return {
      dailyCount,
      weeklyCount,
      monthlyCount,
      total: pet.schedules.length,
    };
  };

  const handleAddPet = async () => {
    if (newPet.name && newPet.type && newPet.age) {
      if (!editMode && pets.length >= maxPets) {
        alert(
          `Your ${currentPlan} allows a maximum of ${maxPets} pets. Please upgrade your plan to add more pets.`
        );
        return;
      }
      try {
        if (editMode && selectedPet) {
          const updatedPet = await updatePet(
            selectedPet._id,
            newPet,
            user._id
          );
          setPets(
            pets.map((p) => (p._id === selectedPet._id ? updatedPet.pet : p))
          );
        } else {
          const response = await createPet(newPet, user._id);
          setPets([...pets, response.pet]);
        }

        setNewPet({
          name: "",
          type: "",
          breed: "",
          age: "",
          photo: null,
          fatherBreed: "",
          motherBreed: "",
        });
        setModalVisible(false);
        setEditMode(false);
      } catch (error) {
        console.error("Failed to save pet:", error);
        alert("Could not save pet. Please try again.");
      }
    } else {
      alert("Please fill in all required fields: Pet Name, Pet Type, and Age.");
    }
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setNewPet({
      name: pet.name,
      type: pet.type,
      breed: pet.breed || "",
      age: pet.age,
      photo: pet.photo,
      fatherBreed: pet.fatherBreed || "",
      motherBreed: pet.motherBreed || "",
    });
    setEditMode(true);
    setModalVisible(true);
  };

  const handleDeletePet = async (petId) => {
    if (confirm("Are you sure you want to delete this pet?")) {
      try {
        await deletePet(petId, user._id);
        setPets(pets.filter((pet) => pet._id !== petId));
        setModalVisible(false);
        setEditMode(false);
        setSelectedPet(null);
      } catch (error) {
        console.error("Failed to delete pet:", error);
        alert("Could not delete pet.");
      }
    }
  };

  const openScheduleModal = (pet) => {
    setSelectedPet(pet);
    setEditScheduleMode(false);
    setNewSchedule({
      type: "Feeding",
      hour: "8",
      minute: "00",
      ampm: "AM",
      frequency: "Daily",
      notes: "",
    });
    setSelectedSchedule(null);
    setScheduleModalVisible(true);
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

  const handleAddSchedule = async () => {
    if (
      selectedPet &&
      newSchedule.hour &&
      newSchedule.minute &&
      newSchedule.ampm
    ) {
      const time = `${newSchedule.hour}:${newSchedule.minute} ${newSchedule.ampm}`;
      const scheduleData = { ...newSchedule, time };

      let updatedSchedules;
      if (editScheduleMode) {
        updatedSchedules = selectedPet.schedules.map((s) =>
          s._id === selectedSchedule._id ? { ...s, ...scheduleData } : s
        );
      } else {
        updatedSchedules = [...(selectedPet.schedules || []), scheduleData];
      }

      try {
        const response = await updatePet(
          selectedPet._id,
          { schedules: updatedSchedules },
          user._id
        );
        const updatedPetFromServer = response.pet;
        setPets(
          pets.map((p) =>
            p._id === selectedPet._id ? updatedPetFromServer : p
          )
        );
        setSelectedPet(updatedPetFromServer);
        setScheduleModalVisible(false);
      } catch (error) {
        console.error("Failed to save schedule:", error);
        alert("Could not save schedule.");
      }
      setNewSchedule({
        type: "Feeding",
        hour: "8",
        minute: "00",
        ampm: "AM",
        frequency: "Daily",
        notes: "",
      });
      setEditScheduleMode(false);
      setSelectedSchedule(null);
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
        notes: schedule.notes || "",
      });
    }

    setEditScheduleMode(true);
    setScheduleModalVisible(true);
  };

  const handleDeleteSchedule = async (pet, scheduleId) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      const updatedSchedules = pet.schedules.filter(
        (s) => s._id !== scheduleId
      );
      try {
        const response = await updatePet(
          pet._id,
          { schedules: updatedSchedules },
          user._id
        );
        const updatedPetFromServer = response.pet;
        setPets(
          pets.map((p) => (p._id === pet._id ? updatedPetFromServer : p))
        );
        setSelectedPet(updatedPetFromServer);
      } catch (error) {
        console.error("Failed to delete schedule:", error);
        alert("Could not delete schedule.");
      }
    }
  };

  const isDateBefore = (date1, date2) => {
    if (!date1 || !date2) return false;
    const [month1, day1, year1] = date1.split("/").map(Number);
    const [month2, day2, year2] = date2.split("/").map(Number);
    const d1 = new Date(year1, month1 - 1, day1);
    const d2 = new Date(year2, month2 - 1, day2);
    return d1 < d2;
  };

  const handleAddVaccination = async () => {
    if (!newVaccination.name || !newVaccination.dateGiven) {
      alert("Please fill in all required fields (*)");
      return;
    }

    if (
      newVaccination.nextDueDate &&
      isDateBefore(newVaccination.nextDueDate, newVaccination.dateGiven)
    ) {
      alert("Next due date cannot be before the date given.");
      return;
    }

    let updatedVaccinations;
    if (editHealthRecordMode) {
      updatedVaccinations = selectedPet.vaccinations.map((v) =>
        v._id === selectedHealthRecord._id ? { ...v, ...newVaccination } : v
      );
    } else {
      updatedVaccinations = [
        ...(selectedPet.vaccinations || []),
        newVaccination,
      ];
    }

    try {
      const response = await updatePet(
        selectedPet._id,
        { vaccinations: updatedVaccinations },
        user._id
      );
      const updatedPetFromServer = response.pet;
      setPets(
        pets.map((p) => (p._id === selectedPet._id ? updatedPetFromServer : p))
      );
      setSelectedPet(updatedPetFromServer);
    } catch (error) {
      console.error("Failed to save vaccination:", error);
      alert("Could not save vaccination record.");
    }

    setNewVaccination({ name: "", dateGiven: "", nextDueDate: "", veterinarian: "", notes: "" });
    setEditHealthRecordMode(false);
    setSelectedHealthRecord(null);
  };

  const handleEditVaccination = (vaccination) => {
    setNewVaccination({
      name: vaccination.name,
      dateGiven: vaccination.dateGiven,
      nextDueDate: vaccination.nextDueDate || "",
      veterinarian: vaccination.veterinarian || "",
      notes: vaccination.notes || "",
    });
    setEditHealthRecordMode(true);
    setSelectedHealthRecord(vaccination);
  };

  const handleDeleteVaccination = async (vaccinationId) => {
    if (confirm("Are you sure you want to delete this vaccination record?")) {
      const updatedVaccinations = selectedPet.vaccinations.filter(
        (v) => v._id !== vaccinationId
      );
      try {
        const response = await updatePet(
          selectedPet._id,
          { vaccinations: updatedVaccinations },
          user._id
        );
        const updatedPetFromServer = response.pet;
        setPets(
          pets.map((p) => (p._id === selectedPet._id ? updatedPetFromServer : p))
        );
        setSelectedPet(updatedPetFromServer);
      } catch (error) {
        console.error("Failed to delete vaccination:", error);
        alert("Could not delete vaccination record.");
      }
    }
  };

  const handleAddVetVisit = async () => {
    if (!newVetVisit.visitDate || !newVetVisit.reason) {
      alert("Please fill in all required fields (*)");
      return;
    }

    let updatedVetVisits;
    if (editHealthRecordMode) {
      updatedVetVisits = selectedPet.vetVisits.map((v) =>
        v._id === selectedHealthRecord._id ? { ...v, ...newVetVisit } : v
      );
    } else {
      updatedVetVisits = [...(selectedPet.vetVisits || []), newVetVisit];
    }

    try {
      const response = await updatePet(
        selectedPet._id,
        { vetVisits: updatedVetVisits },
        user._id
      );
      const updatedPetFromServer = response.pet;
      setPets(
        pets.map((p) =>
          p._id === selectedPet._id ? updatedPetFromServer : p
        )
      );
      setSelectedPet(updatedPetFromServer);
    } catch (error) {
      console.error("Failed to save vet visit:", error);
      alert("Could not save vet visit record.");
    }

    setNewVetVisit({ visitDate: "", reason: "", veterinarian: "", nextVisitDate: "", diagnosis: "", treatment: "", notes: "" });
    setEditHealthRecordMode(false);
    setSelectedHealthRecord(null);
  };

  const handleEditVetVisit = (visit) => {
    setNewVetVisit({
      visitDate: visit.visitDate,
      reason: visit.reason,
      veterinarian: visit.veterinarian || "",
      nextVisitDate: visit.nextVisitDate || "",
      diagnosis: visit.diagnosis || "",
      treatment: visit.treatment || "",
      notes: visit.notes || "",
    });
    setEditHealthRecordMode(true);
    setSelectedHealthRecord(visit);
  };

  const handleDeleteVetVisit = async (vetVisitId) => {
    if (confirm("Are you sure you want to delete this vet visit record?")) {
      const updatedVetVisits = selectedPet.vetVisits.filter(
        (v) => v._id !== vetVisitId
      );
      try {
        const response = await updatePet(
          selectedPet._id,
          { vetVisits: updatedVetVisits },
          user._id
        );
        const updatedPetFromServer = response.pet;
        setPets(
          pets.map((p) =>
            p._id === selectedPet._id ? updatedPetFromServer : p
          )
        );
        setSelectedPet(updatedPetFromServer);
      } catch (error) {
        console.error("Failed to delete vet visit:", error);
        alert("Could not delete vet visit record.");
      }
    }
  };
  return (
    <div className="min-h-screen bg-[#f8f6f4]">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#55423c] to-[#6a524a] text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-1">My Pets 🐾</h1>
            <p className="text-[#e8d7ca] opacity-90">
              Manage your pet's care and schedules
            </p>
          </div>
        </div>
      </div>

      <main className="p-4 space-y-4">
        {/* Pet Slots Info Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8d7ca]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-[#ffd68e] p-2 rounded-lg">
                <PawPrint size={24} className="text-[#795225]" />
              </div>
              <div>
                <div className="text-lg font-bold text-[#55423c]">
                  {pets.length} / {maxPets} Pets
                </div>
                <div className="text-sm text-[#795225]">
                  {petsRemaining} slots remaining
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#795225] font-medium">
                Current Plan
              </div>
              <div className="font-bold text-[#c18742]">{currentPlan}</div>
            </div>
          </div>

          {petsRemaining === 0 && (
            <div className="mt-3 p-3 bg-gradient-to-r from-[#ffd68e] to-[#f2c97d] rounded-lg border border-[#c18742]">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={18} className="text-[#795225]" />
                <span className="font-medium text-[#55423c]">
                  Pet limit reached!
                </span>
              </div>
              <p className="text-sm text-[#795225] mb-3">
                Upgrade your plan to add more pets and access premium features.
              </p>
              <button
                onClick={() => navigateTo("/plans")}
                className="w-full bg-[#c18742] text-white py-2 rounded-lg font-semibold hover:bg-[#a87338] transition-colors"
              >
                Upgrade Plan
              </button>
            </div>
          )}
        </div>

        {/* Pet List */}
        {pets.length > 0 ? (
          <div className="space-y-4">
            {pets.map((pet) => {
              const stats = getScheduleStats(pet);
              return (
                <div
                  key={pet._id}
                  onClick={() => openProfileModal(pet)}
                  className="bg-white rounded-xl shadow-sm border border-[#e8d7ca] overflow-hidden"
                >
                  {/* Pet Header */}
                  <div className="p-4 border-b border-[#e8d7ca]">
                    <div className="flex items-center">
                      <div className="mr-4">
                        {pet.photo ? (
                          <img
                            onClick={() => openProfileModal(pet)}
                            src={pet.photo}
                            alt={pet.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-[#ffd68e]"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffd68e] to-[#c18742] flex items-center justify-center border-2 border-white shadow-sm">
                            <span className="text-2xl font-bold text-white">
                              {pet.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#55423c] mb-1">
                          {pet.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-[#f8f6f4] text-[#795225] text-xs px-2 py-1 rounded-full font-medium">
                            {pet.type}
                          </span>
                          <span className="bg-[#f8f6f4] text-[#795225] text-xs px-2 py-1 rounded-full font-medium">
                            Age: {pet.age} {pet.age === "1" ? "year" : "years"}
                          </span>
                          {pet.breed && (
                            <span className="bg-[#f8f6f4] text-[#795225] text-xs px-2 py-1 rounded-full font-medium">
                              {pet.breed}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Stats */}
                  {stats.total > 0 && (
                    <div className="p-4 border-b border-[#e8d7ca] bg-[#f8f6f4]">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#55423c]">
                            {stats.total}
                          </div>
                          <div className="text-xs text-[#795225]">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#c18742]">
                            {stats.dailyCount}
                          </div>
                          <div className="text-xs text-[#795225]">Daily</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#795225]">
                            {stats.weeklyCount}
                          </div>
                          <div className="text-xs text-[#795225]">Weekly</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-[#55423c]">
                            {stats.monthlyCount}
                          </div>
                          <div className="text-xs text-[#795225]">Monthly</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pet Actions */}
                  <div className="grid grid-cols-3 gap-1 p-3 border-b border-[#e8d7ca] bg-[#f8f6f4]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPet(pet);
                      }}
                      className="flex items-center justify-center gap-1 bg-white text-[#795225] py-2 rounded-lg font-medium hover:bg-[#f8f6f4] transition-colors border border-[#e8d7ca]"
                    >
                      <Edit size={16} />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openScheduleModal(pet);
                      }}
                      className="flex items-center justify-center gap-1 bg-white text-[#795225] py-2 rounded-lg font-medium hover:bg-[#f8f6f4] transition-colors border border-[#e8d7ca]"
                    >
                      <Clock size={16} />
                      <span className="text-sm">Schedules</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openHealthRecordsModal(pet);
                      }}
                      className={`flex items-center justify-center gap-1 py-2 rounded-lg font-medium transition-colors ${
                        features.hasHealthRecords
                          ? "bg-[#ffd68e] text-[#55423c] hover:bg-[#e6c27d]"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!features.hasHealthRecords}
                    >
                      <Stethoscope size={16} />
                      <span className="text-sm">Health</span>
                    </button>
                  </div>

                  {/* Quick Schedules Preview */}
                  {pet.schedules.length > 0 && (
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-bold text-[#55423c] flex items-center gap-2">
                          <Clock size={18} />
                          Upcoming Schedules
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openScheduleModal(pet);
                          }}
                          className="text-sm text-[#c18742] font-medium hover:text-[#55423c] transition-colors"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-2">
                        {pet.schedules.slice(0, 3).map((schedule) => (
                          <div
                            key={schedule._id}
                            className="flex items-center justify-between p-3 rounded-lg border border-[#e8d7ca] hover:bg-[#f8f6f4] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-8 bg-[#c18742] rounded-full"></div>
                              <div>
                                <div className="font-semibold text-[#55423c]">
                                  {schedule.type}
                                </div>
                                <div className="text-sm text-[#795225]">
                                  <Clock size={12} className="inline mr-1" />
                                  {schedule.time} • {schedule.frequency}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditSchedule(pet, schedule);
                                }}
                                className="p-1 hover:bg-[#e8d7ca] rounded transition-colors"
                              >
                                <Edit size={16} className="text-[#795225]" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSchedule(
                                    pet,
                                    schedule._id
                                  );
                                }}
                                className="p-1 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-[#e8d7ca]">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#ffd68e] to-[#c18742] flex items-center justify-center">
              <PawPrint size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#55423c] mb-2">
              No Pets Added Yet
            </h3>
            <p className="text-[#795225] mb-6">
              Add your first pet to start tracking their care
            </p>
            <button
              onClick={() => {
                setEditMode(false);
                setNewPet({
                  name: "",
                  type: "",
                  breed: "",
                  age: "",
                  photo: null,
                  fatherBreed: "",
                  motherBreed: "",
                });
                setModalVisible(true);
              }}
              className="bg-gradient-to-r from-[#c18742] to-[#a87338] text-white px-6 py-3 rounded-xl font-bold text-lg hover:from-[#a87338] hover:to-[#8b5e2f] transition-all shadow-sm"
            >
              <Plus size={20} className="inline mr-2" />
              Add Your First Pet
            </button>
          </div>
        )}

        {/* Add Pet Button */}
        {pets.length > 0 && petsRemaining > 0 && (
          <div className="sticky bottom-20 pb-4">
            <button
              onClick={() => {
                setEditMode(false);
                setNewPet({
                  name: "",
                  type: "",
                  breed: "",
                  age: "",
                  photo: null,
                  fatherBreed: "",
                  motherBreed: "",
                });
                setModalVisible(true);
              }}
              className="w-full bg-gradient-to-r from-[#c18742] to-[#a87338] text-white py-4 rounded-xl font-bold text-lg hover:from-[#a87338] hover:to-[#8b5e2f] transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Another Pet
            </button>
          </div>
        )}
      </main>

      {/* Add/Edit Pet Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#55423c]">
                  {editMode ? "Edit Pet" : "Add New Pet"}
                </h2>
                <button
                  onClick={() => {
                    setModalVisible(false);
                    setEditMode(false);
                  }}
                  className="p-1 hover:bg-[#f8f6f4] rounded transition-colors"
                >
                  <X size={24} className="text-[#795225]" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Photo Upload */}
                <div className="text-center">
                  <div
                    className="relative w-24 h-24 mx-auto mb-4 rounded-full border-2 border-dashed border-[#e8d7ca] hover:border-[#c18742] transition-colors cursor-pointer overflow-hidden bg-[#f8f6f4]"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {newPet.photo ? (
                      <img
                        src={newPet.photo}
                        alt="Pet"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Upload size={24} className="text-[#795225] mb-2" />
                        <span className="text-xs text-[#795225]">
                          Add Photo
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
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Pet Name*"
                  value={newPet.name}
                  onChange={(e) =>
                    setNewPet({ ...newPet, name: e.target.value })
                  }
                  className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                />

                <input
                  type="text"
                  placeholder="Pet Type (Dog, Cat, etc.)*"
                  value={newPet.type}
                  onChange={(e) =>
                    setNewPet({ ...newPet, type: e.target.value })
                  }
                  className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                />

                <input
                  type="text"
                  placeholder="Breed (optional)"
                  value={newPet.breed}
                  onChange={(e) =>
                    setNewPet({ ...newPet, breed: e.target.value })
                  }
                  className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                />

                <input
                  type="text"
                  placeholder="Father's Breed (optional)"
                  value={newPet.fatherBreed}
                  onChange={(e) =>
                    setNewPet({ ...newPet, fatherBreed: e.target.value })
                  }
                  className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                />

                <input
                  type="text"
                  placeholder="Mother's Breed (optional)"
                  value={newPet.motherBreed}
                  onChange={(e) =>
                    setNewPet({ ...newPet, motherBreed: e.target.value })
                  }
                  className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                />

                <input
                  type="text"
                  placeholder="Age*"
                  value={newPet.age}
                  onChange={(e) =>
                    setNewPet({ ...newPet, age: e.target.value })
                  }
                  className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                />

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      setModalVisible(false);
                      setEditMode(false);
                    }}
                    className="flex-1 bg-[#f8f6f4] text-[#795225] py-3 rounded-lg font-medium hover:bg-[#e8d7ca] transition-colors border border-[#e8d7ca]"
                  >
                    Cancel
                  </button>

                  {editMode && (
                    <button
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this pet?")
                        ) {
                          handleDeletePet(selectedPet._id);
                        }
                      }}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}

                  <button
                    onClick={handleAddPet}
                    className="flex-1 bg-gradient-to-r from-[#c18742] to-[#a87338] text-white py-3 rounded-lg font-medium hover:from-[#a87338] hover:to-[#8b5e2f] transition-all"
                  >
                    {editMode ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Schedule Modal */}
      {scheduleModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#55423c]">
                  {editScheduleMode ? "Edit Schedule" : "Add New Schedule"}
                </h2>
                <button
                  onClick={() => {
                    setScheduleModalVisible(false);
                    setEditScheduleMode(false);
                    setSelectedSchedule(null);
                  }}
                  className="p-1 hover:bg-[#f8f6f4] rounded transition-colors"
                >
                  <X size={24} className="text-[#795225]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#795225] mb-2">
                    Schedule Type
                  </label>
                  <select
                    value={newSchedule.type}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, type: e.target.value })
                    }
                    className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                  >
                    <option value="Feeding">Feeding</option>
                    <option value="Medication">Medication</option>
                    <option value="Exercise">Exercise</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Training">Training</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#795225] mb-2">
                    Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={newSchedule.hour}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, hour: e.target.value })
                      }
                      className="w-full border border-[#e8d7ca] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        )
                      )}
                    </select>
                    <select
                      value={newSchedule.minute}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          minute: e.target.value,
                        })
                      }
                      className="w-full border border-[#e8d7ca] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    >
                      {["00", "15", "30", "45"].map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newSchedule.ampm}
                      onChange={(e) =>
                        setNewSchedule({ ...newSchedule, ampm: e.target.value })
                      }
                      className="w-full border border-[#e8d7ca] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#795225] mb-2">
                    Frequency
                  </label>
                  <select
                    value={newSchedule.frequency}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        frequency: e.target.value,
                      })
                    }
                    className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#795225] mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    placeholder="Add any additional notes..."
                    value={newSchedule.notes}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => {
                      setScheduleModalVisible(false);
                      setEditScheduleMode(false);
                      setSelectedSchedule(null);
                    }}
                    className="flex-1 bg-[#f8f6f4] text-[#795225] py-3 rounded-lg font-medium hover:bg-[#e8d7ca] transition-colors border border-[#e8d7ca]"
                  >
                    Cancel
                  </button>

                  {editScheduleMode && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "Are you sure you want to delete this schedule?"
                          )
                        ) {
                          handleDeleteSchedule(selectedPet, selectedSchedule._id);
                        }
                      }}
                      className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  )}

                  <button
                    onClick={handleAddSchedule}
                    className="flex-1 bg-gradient-to-r from-[#c18742] to-[#a87338] text-white py-3 rounded-lg font-medium hover:from-[#a87338] hover:to-[#8b5e2f] transition-all"
                  >
                    {editScheduleMode ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Records Modal */}
      {healthRecordsModalVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-lg">
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#ffd68e] p-2 rounded-lg">
                    <Stethoscope size={24} className="text-[#795225]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#55423c]">
                      Health Records
                    </h2>
                    <p className="text-sm text-[#795225]">
                      {selectedPet?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setHealthRecordsModalVisible(false);
                    setEditHealthRecordMode(false);
                    setSelectedHealthRecord(null);
                  }}
                  className="p-1 hover:bg-[#f8f6f4] rounded transition-colors"
                >
                  <X size={24} className="text-[#795225]" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex bg-[#f8f6f4] rounded-lg p-1 mb-6">
                <button
                  onClick={() => setActiveTab("vaccinations")}
                  className={`flex-1 py-2.5 text-center font-medium transition-all ${
                    activeTab === "vaccinations"
                      ? "bg-white text-[#c18742] rounded shadow-sm"
                      : "text-[#795225] hover:text-[#55423c]"
                  }`}
                >
                  Vaccinations
                </button>
                <button
                  onClick={() => setActiveTab("vetVisits")}
                  className={`flex-1 py-2.5 text-center font-medium transition-all ${
                    activeTab === "vetVisits"
                      ? "bg-white text-[#c18742] rounded shadow-sm"
                      : "text-[#795225] hover:text-[#55423c]"
                  }`}
                >
                  Vet Visits
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-4">
                {activeTab === "vaccinations" && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#55423c] mb-4">
                      {editHealthRecordMode
                        ? "Edit Vaccination"
                        : "Add New Vaccination"}
                    </h3>

                    <input
                      type="text"
                      placeholder="Vaccination Name*"
                      value={newVaccination.name}
                      onChange={(e) =>
                        setNewVaccination({
                          ...newVaccination,
                          name: e.target.value,
                        })
                      }
                      className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    />

                    <DateInput
                      label="Date Given"
                      dateValue={newVaccination.dateGiven}
                      onDateChange={(value) =>
                        setNewVaccination({
                          ...newVaccination,
                          dateGiven: value,
                        })
                      }
                      required
                    />

                    <DateInput
                      label="Next Due Date"
                      dateValue={newVaccination.nextDueDate}
                      onDateChange={(value) =>
                        setNewVaccination({
                          ...newVaccination,
                          nextDueDate: value,
                        })
                      }
                    />

                    <input
                      type="text"
                      placeholder="Veterinarian"
                      value={newVaccination.veterinarian}
                      onChange={(e) =>
                        setNewVaccination({
                          ...newVaccination,
                          veterinarian: e.target.value,
                        })
                      }
                      className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    />

                    <textarea
                      placeholder="Notes"
                      value={newVaccination.notes}
                      onChange={(e) =>
                        setNewVaccination({
                          ...newVaccination,
                          notes: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent resize-none"
                    />
                  </div>
                )}

                {activeTab === "vetVisits" && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#55423c] mb-4">
                      {editHealthRecordMode
                        ? "Edit Vet Visit"
                        : "Add New Vet Visit"}
                    </h3>

                    <DateInput
                      label="Visit Date"
                      dateValue={newVetVisit.visitDate}
                      onDateChange={(value) =>
                        setNewVetVisit({ ...newVetVisit, visitDate: value })
                      }
                      required
                    />

                    <input
                      type="text"
                      placeholder="Reason for Visit*"
                      value={newVetVisit.reason}
                      onChange={(e) =>
                        setNewVetVisit({
                          ...newVetVisit,
                          reason: e.target.value,
                        })
                      }
                      className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    />

                    <input
                      type="text"
                      placeholder="Veterinarian"
                      value={newVetVisit.veterinarian}
                      onChange={(e) =>
                        setNewVetVisit({
                          ...newVetVisit,
                          veterinarian: e.target.value,
                        })
                      }
                      className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    />

                    <DateInput
                      label="Next Visit Date"
                      dateValue={newVetVisit.nextVisitDate}
                      onDateChange={(value) =>
                        setNewVetVisit({ ...newVetVisit, nextVisitDate: value })
                      }
                    />

                    <input
                      type="text"
                      placeholder="Diagnosis"
                      value={newVetVisit.diagnosis}
                      onChange={(e) =>
                        setNewVetVisit({
                          ...newVetVisit,
                          diagnosis: e.target.value,
                        })
                      }
                      className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    />

                    <input
                      type="text"
                      placeholder="Treatment"
                      value={newVetVisit.treatment}
                      onChange={(e) =>
                        setNewVetVisit({
                          ...newVetVisit,
                          treatment: e.target.value,
                        })
                      }
                      className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent"
                    />

                    <textarea
                      placeholder="Notes"
                      value={newVetVisit.notes}
                      onChange={(e) =>
                        setNewVetVisit({
                          ...newVetVisit,
                          notes: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full border border-[#e8d7ca] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#c18742] focus:border-transparent resize-none"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-[#e8d7ca] bg-white">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setHealthRecordsModalVisible(false);
                    setEditHealthRecordMode(false);
                    setSelectedHealthRecord(null);
                  }}
                  className="flex-1 bg-[#f8f6f4] text-[#795225] py-3 rounded-lg font-medium hover:bg-[#e8d7ca] transition-colors border border-[#e8d7ca]"
                >
                  Close
                </button>

                <button
                  onClick={
                    activeTab === "vaccinations"
                      ? handleAddVaccination
                      : handleAddVetVisit
                  }
                  className="flex-1 bg-gradient-to-r from-[#c18742] to-[#a87338] text-white py-3 rounded-lg font-medium hover:from-[#a87338] hover:to-[#8b5e2f] transition-all"
                >
                  {editHealthRecordMode ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pet Profile Modal */}
      {profileModalVisible && selectedPet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#55423c]">
                  Pet Profile
                </h2>
                <button
                  onClick={() => setProfileModalVisible(false)}
                  className="p-1 hover:bg-[#f8f6f4] rounded transition-colors"
                >
                  <X size={24} className="text-[#795225]" />
                </button>
              </div>

              <div className="text-center">
                {selectedPet.photo ? (
                  <img
                    src={selectedPet.photo}
                    alt={selectedPet.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-[#ffd68e] shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#ffd68e] to-[#c18742] flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-5xl font-bold text-white">
                      {selectedPet.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[#55423c] mt-4">
                  {selectedPet.name}
                </h3>
                <p className="text-md text-[#795225]">
                  {selectedPet.breed || selectedPet.type}
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between p-3 bg-[#f8f6f4] rounded-lg">
                  <span className="font-medium text-[#795225]">Age</span>
                  <span className="font-bold text-[#55423c]">
                    {selectedPet.age} {selectedPet.age === "1" ? "year" : "years"}
                  </span>
                </div>
                {selectedPet.fatherBreed && (
                  <div className="flex justify-between p-3 bg-[#f8f6f4] rounded-lg">
                    <span className="font-medium text-[#795225]">
                      Father's Breed
                    </span>
                    <span className="font-bold text-[#55423c]">
                      {selectedPet.fatherBreed}
                    </span>
                  </div>
                )}
                {selectedPet.motherBreed && (
                  <div className="flex justify-between p-3 bg-[#f8f6f4] rounded-lg">
                    <span className="font-medium text-[#795225]">
                      Mother's Breed
                    </span>
                    <span className="font-bold text-[#55423c]">
                      {selectedPet.motherBreed}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPets;
