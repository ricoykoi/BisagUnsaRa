import React, { useState, useMemo, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Users,
  Activity,
  TrendingUp,
  Shield,
  ChevronRight,
  AlertCircle,
  Sparkles,
  PieChart,
  Bell,
  X,
  Home,
  PawPrint,
  Crown,
} from "lucide-react";
import { useSubscription } from "../context/useSubscriptionHook";
import { getPets } from "../services/petService";
import { AuthenticationContext } from "../context/AuthenticationContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatDate = (date) => {
  const options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const parseTimeToMinutes = (timeString) => {
  if (!timeString) return 0;
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

const generateRecurringSchedules = (baseSchedules, daysAhead = 30) => {
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
        isCompleted: schedule.isCompleted || false,
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

const Export = () => {
  const navigate = useNavigate();
  const { currentPlan, getPlanFeatures } = useSubscription();
  const features = getPlanFeatures(currentPlan);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const { user } = useContext(AuthenticationContext);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      if (user?._id) {
        try {
          const userPets = await getPets(user._id);
          setPets(userPets);
        } catch (error) {
          console.error("Failed to fetch pets for export:", error);
        }
      }
    };
    fetchPets();
  }, [user]);

  // Generate all schedules from pets
  const allSchedules = useMemo(
    () =>
      pets.flatMap((pet) =>
        (pet.schedules || []).map((schedule) => ({
          ...schedule,
          originalScheduleId: schedule._id,
          petName: pet.name,
          petId: pet._id,
        }))
      ),
    [pets]
  );

  // Use useMemo to cache generated schedules
  const { todayDate, upcomingSchedules, todaySchedules } = useMemo(() => {
    const generated = generateRecurringSchedules(allSchedules, 30);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = generated.filter((s) => s.date >= today);
    const todayScheds = upcoming
      .filter((s) => {
        const scheduleDate = new Date(s.date);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate.getTime() === today.getTime();
      })
      .sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

    return {
      todayDate: today,
      upcomingSchedules: upcoming,
      todaySchedules: todayScheds,
    };
  }, [allSchedules]);

  const navigateTo = (route) => {
    navigate(route);
  };

  // Calculate statistics
  const activeSchedules = pets.reduce((total, pet) => {
    return total + (pet.schedules ? pet.schedules.length : 0);
  }, 0);

  const completedTasks = todaySchedules.filter(
    (schedule) => schedule.isCompleted
  ).length;
  const completionPercentage =
    todaySchedules.length > 0
      ? Math.round((completedTasks / todaySchedules.length) * 100)
      : 0;

  const handleExport = async () => {
    if (pets.length === 0) {
      alert("No pets to export. Add a pet first.");
      return;
    }

    setIsExporting(true);

    try {
      if (exportFormat === "pdf") {
        await generatePDF();
      } else {
        await generateCSV();
      }
      alert("Success", "Data exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Error", "Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDF = () => {
    return new Promise((resolve) => {
      const doc = new jsPDF();

      // Add title and header
      doc.setFontSize(20);
      doc.setTextColor(85, 66, 60);
      doc.text("Pet Care Export Summary", 14, 15);

      doc.setFontSize(10);
      doc.setTextColor(121, 82, 37);
      doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 25);
      doc.text(`Current Plan: ${currentPlan}`, 14, 32);

      let yPosition = 45;

      // Add summary statistics
      doc.setFontSize(14);
      doc.setTextColor(85, 66, 60);
      doc.text("Summary Statistics", 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Pets: ${pets.length}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Active Schedules: ${activeSchedules}`, 20, yPosition);
      yPosition += 6;
      doc.text(
        `Today's Tasks: ${todaySchedules.length} (${completedTasks} completed)`,
        20,
        yPosition
      );
      yPosition += 6;
      doc.text(
        `Upcoming Tasks (30 days): ${upcomingSchedules.length}`,
        20,
        yPosition
      );
      yPosition += 15;

      // Add pets table
      doc.setFontSize(14);
      doc.setTextColor(85, 66, 60);
      doc.text("Pet Profiles", 14, yPosition);
      yPosition += 10;

      autoTable(doc, {
        startY: yPosition,
        head: [["Name", "Type", "Breed", "Age", "Schedules"]],
        body: pets.map((pet) => [
          pet.name,
          pet.type,
          pet.breed,
          pet.age,
          (pet.schedules || []).length,
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [193, 135, 66] },
      });

      yPosition = doc.lastAutoTable.finalY + 10;

      // Add today's schedules
      doc.setFontSize(14);
      doc.setTextColor(85, 66, 60);
      doc.text("Today's Schedules", 14, yPosition);
      yPosition += 10;

      if (todaySchedules.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [["Time", "Type", "Pet", "Status", "Notes"]],
          body: todaySchedules.map((schedule) => [
            schedule.time,
            schedule.type,
            schedule.petName,
            schedule.isCompleted ? "Completed" : "Pending",
            schedule.notes || "",
          ]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [193, 135, 66] },
        });
        yPosition = doc.lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(10);
        doc.text("No schedules for today", 20, yPosition);
        yPosition += 10;
      }

      // Add upcoming schedules
      doc.setFontSize(14);
      doc.setTextColor(85, 66, 60);
      doc.text("Upcoming Schedules (Next 30 Days)", 14, yPosition);
      yPosition += 10;

      if (upcomingSchedules.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [["Date", "Time", "Type", "Pet", "Frequency", "Notes"]],
          body: upcomingSchedules.map((schedule) => [
            formatDate(schedule.date),
            schedule.time,
            schedule.type,
            schedule.petName,
            schedule.frequency,
            schedule.notes || "",
          ]),
          styles: { fontSize: 7 },
          headStyles: { fillColor: [193, 135, 66] },
        });
      } else {
        doc.setFontSize(10);
        doc.text("No upcoming schedules", 20, yPosition);
      }

      // Save the PDF
      doc.save(`pet-care-export-${new Date().toISOString().split("T")[0]}.pdf`);
      resolve();
    });
  };

  const generateCSV = () => {
    return new Promise((resolve) => {
      let csvContent = "Pet Care Export Summary\n\n";

      // Summary section
      csvContent += "SUMMARY STATISTICS\n";
      csvContent += `Total Pets,${pets.length}\n`;
      csvContent += `Active Schedules,${activeSchedules}\n`;
      csvContent += `Today's Tasks,${todaySchedules.length}\n`;
      csvContent += `Completed Tasks,${completedTasks}\n`;
      csvContent += `Upcoming Tasks,${upcomingSchedules.length}\n`;
      csvContent += `Export Date,${new Date().toLocaleDateString()}\n`;
      csvContent += `Current Plan,${currentPlan}\n\n`;

      // Pets section
      csvContent += "PET PROFILES\n";
      csvContent += "Name,Type,Breed,Age,Number of Schedules\n";
      pets.forEach((pet) => {
        csvContent += `${pet.name},${pet.type},${pet.breed},${pet.age},${
          (pet.schedules || []).length
        }\n`;
      });
      csvContent += "\n";

      // Today's schedules
      csvContent += "TODAY'S SCHEDULES\n";
      csvContent += "Time,Type,Pet,Status,Notes\n";
      todaySchedules.forEach((schedule) => {
        csvContent += `${schedule.time},${schedule.type},${schedule.petName},${
          schedule.isCompleted ? "Completed" : "Pending"
        },"${schedule.notes || ""}"\n`;
      });
      csvContent += "\n";

      // Upcoming schedules
      csvContent += "UPCOMING SCHEDULES\n";
      csvContent += "Date,Time,Type,Pet,Frequency,Notes\n";
      upcomingSchedules.forEach((schedule) => {
        csvContent += `${formatDate(schedule.date)},${schedule.time},${
          schedule.type
        },${schedule.petName},${schedule.frequency},"${
          schedule.notes || ""
        }"\n`;
      });

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pet-care-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      resolve();
    });
  };

  // Filter upcoming schedules (excluding today)
  const futureSchedules = useMemo(
    () =>
      upcomingSchedules
        .filter((s) => {
          const scheduleDate = new Date(s.date);
          scheduleDate.setHours(0, 0, 0, 0);
          return scheduleDate.getTime() > todayDate.getTime();
        })
        .slice(0, 20),
    [upcomingSchedules, todayDate]
  );

  return (
    <div className="min-h-screen bg-[#f8f6f4]">
      {/* Header Section */}
      <div className="bg-white p-6">
        <div className="">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-3 text-[#55423c]">
              Export Your Pet Care Data 🗂️
            </h1>
            <p className="text-[#795225] text-lg">
              Generate reports and export your pet care schedules
            </p>
          </div>

          {/* Current Plan Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#ffd68e] to-[#f2c97d] rounded-full px-6 py-3 border border-[#c18742] shadow-sm">
              <Download size={20} className="text-[#55423c]" />
              <span className="font-semibold text-[#55423c]">
                Export Feature:{" "}
                <span className="text-[#795225]">
                  {features.hasExport ? "Available" : "Premium Only"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto p-4 md:p-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8d7ca]">
            <div className="flex items-center gap-3">
              <div className="bg-[#ffd68e] p-2 rounded-lg">
                <Users size={20} className="text-[#795225]" />
              </div>
              <div>
                <div className="text-lg font-bold text-[#55423c]">
                  {pets.length}
                </div>
                <div className="text-sm text-[#795225]">Total Pets</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-[#e8d7ca]">
            <div className="flex items-center gap-3">
              <div className="bg-[#ffd68e] p-2 rounded-lg">
                <Activity size={20} className="text-[#795225]" />
              </div>
              <div>
                <div className="text-lg font-bold text-[#55423c]">
                  {activeSchedules}
                </div>
                <div className="text-sm text-[#795225]">Active Schedules</div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Format Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d7ca]">
          <h3 className="text-lg font-bold text-[#55423c] mb-4 flex items-center gap-2">
            <FileText size={20} />
            Export Format
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`flex items-center justify-center gap-3 p-4 rounded-xl transition-all ${
                exportFormat === "pdf"
                  ? "bg-gradient-to-r from-[#c18742] to-[#a87338] text-white shadow-lg transform scale-105"
                  : "bg-[#f8f6f4] text-[#795225] hover:bg-[#e8d7ca] border border-[#e8d7ca]"
              }`}
              onClick={() => setExportFormat("pdf")}
            >
              <FileText size={24} />
              <div className="text-left">
                <div className="font-bold">PDF Document</div>
                <div className="text-xs opacity-80">For printing & sharing</div>
              </div>
              {exportFormat === "pdf" && <CheckCircle size={20} />}
            </button>
            <button
              className={`flex items-center justify-center gap-3 p-4 rounded-xl transition-all ${
                exportFormat === "csv"
                  ? "bg-gradient-to-r from-[#55423c] to-[#6a524a] text-white shadow-lg transform scale-105"
                  : "bg-[#f8f6f4] text-[#795225] hover:bg-[#e8d7ca] border border-[#e8d7ca]"
              }`}
              onClick={() => setExportFormat("csv")}
            >
              <FileSpreadsheet size={24} />
              <div className="text-left">
                <div className="font-bold">CSV Spreadsheet</div>
                <div className="text-xs opacity-80">For data analysis</div>
              </div>
              {exportFormat === "csv" && <CheckCircle size={20} />}
            </button>
          </div>
        </div>

        {/* Data Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d7ca]">
          <h3 className="text-lg font-bold text-[#55423c] mb-6">
            Data Preview
          </h3>

          {/* Today's Schedule Preview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-[#c18742] flex items-center gap-2">
                <Calendar size={18} />
                Today's Schedules
              </h4>
              <span className="text-sm text-[#795225] bg-[#f8f6f4] px-3 py-1 rounded-full">
                {completedTasks}/{todaySchedules.length} completed
              </span>
            </div>

            {todaySchedules.length > 0 ? (
              <div className="space-y-3">
                {todaySchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-[#e8d7ca] hover:bg-[#f8f6f4] transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <button className="p-2">
                        {schedule.isCompleted ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <Circle className="text-[#c18742]" size={20} />
                        )}
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#55423c] text-sm">
                            {schedule.time}
                          </div>
                          <div className="text-xs text-[#795225]">
                            <span className="font-medium">{schedule.type}</span>{" "}
                            • {schedule.petName}
                          </div>
                        </div>
                        <div className="bg-[#ffd68e] text-[#795225] text-xs px-2 py-1 rounded-full font-medium">
                          Today
                        </div>
                      </div>
                      {schedule.notes && (
                        <div className="mt-2 text-xs text-[#795225] italic bg-[#f8f6f4] p-2 rounded">
                          📝 {schedule.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-[#795225] bg-[#f8f6f4] rounded-lg">
                <Calendar size={32} className="mx-auto mb-3 text-[#e8d7ca]" />
                <p className="font-medium">No schedules for today</p>
              </div>
            )}
          </div>

          {/* Upcoming Schedules Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-[#c18742] flex items-center gap-2">
                <Clock size={18} />
                Upcoming Schedules
              </h4>
              <span className="text-sm text-[#795225] bg-[#f8f6f4] px-3 py-1 rounded-full">
                Next 30 days
              </span>
            </div>

            {futureSchedules.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {futureSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-4 rounded-lg border border-[#e8d7ca] hover:bg-[#f8f6f4] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-[#ffd68e] text-[#795225] text-xs px-2 py-1 rounded-full font-medium">
                        {formatDate(schedule.date)}
                      </div>
                      <div className="text-sm font-medium text-[#795225]">
                        {schedule.time}
                      </div>
                    </div>
                    <div className="font-semibold text-[#55423c] text-sm">
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
                  </div>
                ))}
                {upcomingSchedules.length > 20 && (
                  <div className="text-center py-3 text-sm text-[#795225] italic">
                    ... and {upcomingSchedules.length - 20} more schedules
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-[#795225] bg-[#f8f6f4] rounded-lg">
                <Clock size={32} className="mx-auto mb-3 text-[#e8d7ca]" />
                <p className="font-medium">No upcoming schedules</p>
              </div>
            )}
          </div>
        </div>

        {/* Export Action Section */}
        {features.hasExport ? (
          <div className="bg-gradient-to-r from-[#55423c] to-[#6a524a] rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg">
                  <Download size={24} className="text-[#c18742]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Ready to Export
                  </h3>
                  <p className="text-[#e8d7ca]">
                    Generate your {exportFormat.toUpperCase()} report
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[#e8d7ca]">Current Plan</div>
                <div className="font-bold text-[#ffd68e]">{currentPlan}</div>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting || pets.length === 0}
              className={`w-full ${
                isExporting || pets.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#ffd68e] to-[#f2c97d] hover:from-[#f2c97d] hover:to-[#e6c27d] transform hover:scale-[1.02]"
              } text-[#55423c] py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3`}
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#55423c]"></div>
                  Exporting...
                </>
              ) : pets.length === 0 ? (
                <>
                  <AlertCircle size={20} />
                  Add Pets First
                </>
              ) : (
                <>
                  <Download size={24} />
                  Export to {exportFormat.toUpperCase()}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-[#ffd68e] to-[#f2c97d] rounded-xl p-6 shadow-sm border border-[#c18742]">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg">
                <Shield size={24} className="text-[#c18742]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#55423c]">
                  Premium Tier 2 Feature
                </h3>
                <p className="text-[#795225]">
                  Unlock PDF/CSV export capability
                </p>
              </div>
            </div>

            <div className="bg-white/50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-[#795225] mb-3">
                <AlertCircle size={16} />
                <span className="font-medium">What you're missing:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#c18742]" />
                  <span>PDF document export</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#c18742]" />
                  <span>CSV spreadsheet export</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#c18742]" />
                  <span>Professional reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#c18742]" />
                  <span>Data backup</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigateTo("/plans")}
              className="w-full bg-gradient-to-r from-[#c18742] to-[#a87338] text-white py-3 rounded-lg font-bold hover:from-[#a87338] hover:to-[#8b5e2f] transition-all"
            >
              Upgrade to Premium Tier 2
            </button>
          </div>
        )}

        {/* Export Summary */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e8d7ca]">
          <h3 className="text-lg font-bold text-[#55423c] mb-4 flex items-center gap-2">
            <PieChart size={20} />
            Export Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f8f6f4] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#c18742] mb-1">
                {pets.length}
              </div>
              <div className="text-sm text-[#795225]">Pets Included</div>
            </div>
            <div className="bg-[#f8f6f4] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#c18742] mb-1">
                {todaySchedules.length}
              </div>
              <div className="text-sm text-[#795225]">Today's Tasks</div>
            </div>
            <div className="bg-[#f8f6f4] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#c18742] mb-1">
                {upcomingSchedules.length}
              </div>
              <div className="text-sm text-[#795225]">Upcoming Tasks</div>
            </div>
            <div className="bg-[#f8f6f4] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#c18742] mb-1">
                {completionPercentage}%
              </div>
              <div className="text-sm text-[#795225]">Completion Rate</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-[#f8f6f4] rounded-lg">
            <h4 className="font-semibold text-[#55423c] mb-2 flex items-center gap-2">
              <TrendingUp size={16} />
              What's included in your export:
            </h4>
            <ul className="text-sm text-[#795225] space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                All pet profiles with detailed information
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Complete schedule history and upcoming tasks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Task completion status and notes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Summary statistics and analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                Export metadata and timestamps
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Export;
