import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useSubscription } from '../context/useSubscriptionHook';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const formatDate = (date) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

const parseTimeToMinutes = (timeString) => {
  if (!timeString) return 0;
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

const generateRecurringSchedules = (baseSchedules, daysAhead = 30) => {
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
      for (let i = 0; i < 30; i++) {
        const scheduleDate = new Date(today);
        scheduleDate.setDate(today.getDate() + i);
        addInstance(scheduleDate);
      }
    } else if (schedule.frequency === 'Weekly') {
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
    } else if (schedule.frequency === 'Monthly') {
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
  const [exportFormat, setExportFormat] = useState('pdf');

  // Load pets from localStorage (same as dashboard)
  const pets = useMemo(() => {
    const saved = localStorage.getItem('pets');
    return saved ? JSON.parse(saved) : [];
  }, []);

  // Generate all schedules from pets (same as dashboard)
  const allSchedules = useMemo(() => 
    pets.flatMap(pet =>
      (pet.schedules || []).map(schedule => ({
        ...schedule,
        originalScheduleId: schedule.id,
        petName: pet.name,
        petId: pet.id
      }))
    ),
    [pets]
  );

  // Use useMemo to cache generated schedules (same logic as dashboard)
  const { todayDate, upcomingSchedules, todaySchedules } = useMemo(() => {
    const generated = generateRecurringSchedules(allSchedules, 30);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcoming = generated.filter(s => s.date >= today);
    const todayScheds = upcoming.filter(s => {
      const scheduleDate = new Date(s.date);
      scheduleDate.setHours(0, 0, 0, 0);
      return scheduleDate.getTime() === today.getTime();
    }).sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

    return { 
      todayDate: today,
      upcomingSchedules: upcoming,
      todaySchedules: todayScheds
    };
  }, [allSchedules]);

  const navigateTo = (route) => {
    navigate(route);
  };

  const handleSignOut = () => {
    if (confirm("Are you sure you want to sign out?")) {
      navigate('/');
    }
  };

  // Calculate statistics (same as dashboard)
  const activeSchedules = pets.reduce((total, pet) => {
    return total + (pet.schedules ? pet.schedules.length : 0);
  }, 0);

  const completedTasks = todaySchedules.filter(schedule => schedule.isCompleted).length;

  const handleExport = async () => {
    if (pets.length === 0) {
      alert('No pets to export. Add a pet first.');
      return;
    }

    setIsExporting(true);

    try {
      if (exportFormat === 'pdf') {
        await generatePDF();
      } else {
        await generateCSV();
      }
      alert('Success', 'Data exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Error', 'Failed to export data. Please try again.');
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
      doc.text('Pet Care Export Summary', 14, 15);
      
      doc.setFontSize(10);
      doc.setTextColor(121, 82, 37);
      doc.text(`Exported on: ${new Date().toLocaleDateString()}`, 14, 25);
      doc.text(`Current Plan: ${currentPlan}`, 14, 32);
      
      let yPosition = 45;

      // Add summary statistics
      doc.setFontSize(14);
      doc.setTextColor(85, 66, 60);
      doc.text('Summary Statistics', 14, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Pets: ${pets.length}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Active Schedules: ${activeSchedules}`, 20, yPosition);
      yPosition += 6;
      doc.text(`Today's Tasks: ${todaySchedules.length} (${completedTasks} completed)`, 20, yPosition);
      yPosition += 6;
      doc.text(`Upcoming Tasks (30 days): ${upcomingSchedules.length}`, 20, yPosition);
      yPosition += 15;

      // Add pets table
      doc.setFontSize(14);
      doc.setTextColor(85, 66, 60);
      doc.text('Pet Profiles', 14, yPosition);
      yPosition += 10;

      autoTable(doc, {
        startY: yPosition,
        head: [['Name', 'Type', 'Breed', 'Age', 'Schedules']],
        body: pets.map(pet => [
          pet.name,
          pet.type,
          pet.breed,
          pet.age,
          (pet.schedules || []).length
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [193, 135, 66] }
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
          head: [['Time', 'Type', 'Pet', 'Status', 'Notes']],
          body: todaySchedules.map(schedule => [
            schedule.time,
            schedule.type,
            schedule.petName,
            schedule.isCompleted ? 'Completed' : 'Pending',
            schedule.notes || ''
          ]),
          styles: { fontSize: 8 },
          headStyles: { fillColor: [193, 135, 66] }
        });
        yPosition = doc.lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(10);
        doc.text('No schedules for today', 20, yPosition);
        yPosition += 10;
      }

      // Add upcoming schedules
      doc.setFontSize(14);
      doc.setTextColor(85, 66, 60);
      doc.text('Upcoming Schedules (Next 30 Days)', 14, yPosition);
      yPosition += 10;

      if (upcomingSchedules.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [['Date', 'Time', 'Type', 'Pet', 'Frequency', 'Notes']],
          body: upcomingSchedules.map(schedule => [
            formatDate(schedule.date),
            schedule.time,
            schedule.type,
            schedule.petName,
            schedule.frequency,
            schedule.notes || ''
          ]),
          styles: { fontSize: 7 },
          headStyles: { fillColor: [193, 135, 66] }
        });
      } else {
        doc.setFontSize(10);
        doc.text('No upcoming schedules', 20, yPosition);
      }

      // Save the PDF
      doc.save(`pet-care-export-${new Date().toISOString().split('T')[0]}.pdf`);
      resolve();
    });
  };

  const generateCSV = () => {
    return new Promise((resolve) => {
      let csvContent = 'Pet Care Export Summary\n\n';
      
      // Summary section
      csvContent += 'SUMMARY STATISTICS\n';
      csvContent += `Total Pets,${pets.length}\n`;
      csvContent += `Active Schedules,${activeSchedules}\n`;
      csvContent += `Today's Tasks,${todaySchedules.length}\n`;
      csvContent += `Completed Tasks,${completedTasks}\n`;
      csvContent += `Upcoming Tasks,${upcomingSchedules.length}\n`;
      csvContent += `Export Date,${new Date().toLocaleDateString()}\n`;
      csvContent += `Current Plan,${currentPlan}\n\n`;
      
      // Pets section
      csvContent += 'PET PROFILES\n';
      csvContent += 'Name,Type,Breed,Age,Number of Schedules\n';
      pets.forEach(pet => {
        csvContent += `${pet.name},${pet.type},${pet.breed},${pet.age},${(pet.schedules || []).length}\n`;
      });
      csvContent += '\n';
      
      // Today's schedules
      csvContent += "TODAY'S SCHEDULES\n";
      csvContent += 'Time,Type,Pet,Status,Notes\n';
      todaySchedules.forEach(schedule => {
        csvContent += `${schedule.time},${schedule.type},${schedule.petName},${schedule.isCompleted ? 'Completed' : 'Pending'},"${schedule.notes || ''}"\n`;
      });
      csvContent += '\n';
      
      // Upcoming schedules
      csvContent += 'UPCOMING SCHEDULES\n';
      csvContent += 'Date,Time,Type,Pet,Frequency,Notes\n';
      upcomingSchedules.forEach(schedule => {
        csvContent += `${formatDate(schedule.date)},${schedule.time},${schedule.type},${schedule.petName},${schedule.frequency},"${schedule.notes || ''}"\n`;
      });
      
      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pet-care-export-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      resolve();
    });
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
              <div className="text-2xl font-bold text-[#c18742]">{pets.length}</div>
              <div className="text-sm text-[#795225]">Pets</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">{activeSchedules}</div>
              <div className="text-sm text-[#795225]">Active Schedules</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm">
              <div className="text-2xl font-bold text-[#c18742]">
                {completedTasks}/{todaySchedules.length}
              </div>
              <div className="text-sm text-[#795225]">Today's Tasks</div>
            </div>
          </div>
        </div>

        {/* Export Format Selection */}
        <div className="bg-white rounded-xl mx-4 p-4 mb-4 shadow-sm">
          <h3 className="text-lg font-bold text-[#55423c] mb-3">Export Format</h3>
          <div className="flex gap-2">
            <button 
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                exportFormat === 'pdf' 
                  ? 'bg-[#c18742] text-white' 
                  : 'bg-gray-100 text-[#795225] hover:bg-gray-200'
              }`}
              onClick={() => setExportFormat('pdf')}
            >
              PDF Document
            </button>
            <button 
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                exportFormat === 'csv' 
                  ? 'bg-[#c18742] text-white' 
                  : 'bg-gray-100 text-[#795225] hover:bg-gray-200'
              }`}
              onClick={() => setExportFormat('csv')}
            >
              CSV Spreadsheet
            </button>
          </div>
        </div>

        {/* Schedule Preview Section */}
        <div className="bg-white rounded-xl mx-4 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#55423c] mb-6">Schedule Preview</h2>

          {/* Today's Schedules */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#c18742] mb-4 flex items-center gap-2">
              <Calendar size={18} />
              Today's Schedule Record
            </h3>
            
            {todaySchedules.length > 0 ? (
              <div className="space-y-3">
                {todaySchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0">
                      {schedule.isCompleted ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <Circle className="text-gray-400" size={20} />
                      )}
                    </div>
                    
                    <div className="bg-[#ffd68e] px-3 py-1 rounded-full text-xs font-medium text-[#55423c] min-w-[80px] text-center">
                      Today
                    </div>
                    
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-[#55423c] text-sm">
                          {schedule.time}
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className="font-medium">{schedule.type}</span> • {schedule.petName}
                        </div>
                        {schedule.notes && (
                          <div className="text-xs text-gray-500 italic mt-1">
                            {schedule.notes}
                          </div>
                        )}
                      </div>
                      {schedule.notificationsEnabled && (
                        <Bell className="text-[#c18742] fill-[#c18742]" size={16} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 italic bg-gray-50 rounded-lg">
                No schedules for today
              </div>
            )}
          </div>

          {/* Upcoming Schedules */}
          <div>
            <h3 className="text-lg font-semibold text-[#c18742] mb-4 flex items-center gap-2">
              <Clock size={18} />
              Upcoming Schedule Record (Next 30 Days)
            </h3>
            
            {upcomingSchedules.filter(s => {
              const scheduleDate = new Date(s.date);
              scheduleDate.setHours(0, 0, 0, 0);
              return scheduleDate.getTime() > todayDate.getTime();
            }).length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {upcomingSchedules
                  .filter(s => {
                    const scheduleDate = new Date(s.date);
                    scheduleDate.setHours(0, 0, 0, 0);
                    return scheduleDate.getTime() > todayDate.getTime();
                  })
                  .slice(0, 20)
                  .map((schedule) => (
                  <div key={schedule.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="bg-[#ffd68e] px-3 py-1 rounded-full text-xs font-medium text-[#55423c] min-w-[80px] text-center">
                      {formatDate(schedule.date)}
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
                      {schedule.notificationsEnabled && (
                        <Bell className="text-[#c18742] fill-[#c18742]" size={16} />
                      )}
                    </div>
                  </div>
                ))}
                {upcomingSchedules.filter(s => {
                  const scheduleDate = new Date(s.date);
                  scheduleDate.setHours(0, 0, 0, 0);
                  return scheduleDate.getTime() > todayDate.getTime();
                }).length > 20 && (
                  <div className="text-center py-2 text-sm text-gray-500 italic">
                    ... and {upcomingSchedules.filter(s => {
                      const scheduleDate = new Date(s.date);
                      scheduleDate.setHours(0, 0, 0, 0);
                      return scheduleDate.getTime() > todayDate.getTime();
                    }).length - 20} more schedules
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 italic bg-gray-50 rounded-lg">
                No upcoming schedules
              </div>
            )}
          </div>

          {/* Export Button Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            {features.hasExport ? (
              <button
                onClick={handleExport}
                disabled={isExporting || pets.length === 0}
                className={`w-full ${
                  isExporting || pets.length === 0 ? 'bg-gray-400' : 'bg-[#c18742] hover:bg-[#a87338]'
                } text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-3`}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download size={24} />
                    Export to {exportFormat.toUpperCase()}
                  </>
                )}
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
                  Unlock PDF/CSV export by upgrading to Premium Tier 2
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
              <li>• Today's schedule record with completion status</li>
              <li>• Upcoming schedule record (30 days)</li>
              <li>• Schedule frequency and notes</li>
              <li>• Summary statistics and export metadata</li>
            </ul>
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-xl mx-4 mt-4 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#55423c] mb-4">Data Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-[#55423c] font-medium">Total Pets</span>
              <span className="font-bold text-[#c18742]">{pets.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-[#55423c] font-medium">Active Schedules</span>
              <span className="font-bold text-[#c18742]">{activeSchedules}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-[#55423c] font-medium">Today's Tasks</span>
              <span className="font-bold text-[#c18742]">{completedTasks}/{todaySchedules.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-[#55423c] font-medium">Upcoming Tasks (30 days)</span>
              <span className="font-bold text-[#c18742]">{upcomingSchedules.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#55423c] font-medium">Current Plan</span>
              <span className="font-bold text-[#c18742]">{currentPlan}</span>
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