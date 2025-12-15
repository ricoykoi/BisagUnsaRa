import Update from "../model/updateModel.js";
import Pet from "../model/petModel.js";

// GET all updates for a user
export const getUpdatesByUser = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updates = await Update.find({ userId, isActive: true })
      .sort({ scheduledTime: -1, createdAt: -1 })
      .limit(50);

    const unreadCount = updates.filter(u => !u.isRead).length;

    res.status(200).json({
      updates,
      unreadCount,
    });
  } catch (error) {
    console.error("Get updates error:", error);
    res.status(500).json({ message: "Server error while fetching updates" });
  }
};

// CREATE update/notification
export const createUpdate = async (req, res) => {
  try {
    const { userId, type, title, message, petId, petName, scheduleId, scheduledTime } = req.body;

    if (!userId || !type || !title || !message || !scheduledTime) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if update already exists for this schedule at this time
    const existingUpdate = await Update.findOne({
      userId,
      scheduleId,
      scheduledTime: new Date(scheduledTime),
      isActive: true,
    });

    if (existingUpdate) {
      return res.status(200).json({
        message: "Update already exists",
        update: existingUpdate,
      });
    }

    const newUpdate = new Update({
      userId,
      type,
      title,
      message,
      petId,
      petName,
      scheduleId,
      scheduledTime: new Date(scheduledTime),
    });

    await newUpdate.save();

    res.status(201).json({
      message: "Update created successfully",
      update: newUpdate,
    });
  } catch (error) {
    console.error("Create update error:", error);
    res.status(500).json({ message: "Server error while creating update" });
  }
};

// MARK update as read
export const markUpdateAsRead = async (req, res) => {
  try {
    const { updateId } = req.body;

    if (!updateId) {
      return res.status(400).json({ message: "Update ID is required" });
    }

    const update = await Update.findById(updateId);
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }

    update.isRead = true;
    await update.save();

    res.status(200).json({
      message: "Update marked as read",
      update,
    });
  } catch (error) {
    console.error("Mark update as read error:", error);
    res.status(500).json({ message: "Server error while marking update as read" });
  }
};

// MARK all updates as read
export const markAllUpdatesAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    await Update.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      message: "All updates marked as read",
    });
  } catch (error) {
    console.error("Mark all updates as read error:", error);
    res.status(500).json({ message: "Server error while marking updates as read" });
  }
};

// DELETE/DISMISS update
export const dismissUpdate = async (req, res) => {
  try {
    const { updateId } = req.body;

    if (!updateId) {
      return res.status(400).json({ message: "Update ID is required" });
    }

    const update = await Update.findById(updateId);
    if (!update) {
      return res.status(404).json({ message: "Update not found" });
    }

    update.isActive = false;
    await update.save();

    res.status(200).json({
      message: "Update dismissed",
      update,
    });
  } catch (error) {
    console.error("Dismiss update error:", error);
    res.status(500).json({ message: "Server error while dismissing update" });
  }
};

// CHECK and create notifications for upcoming schedules
export const checkAndCreateNotifications = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get all pets for the user
    const pets = await Pet.find({ userId });

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const createdNotifications = [];

    for (const pet of pets) {
      // Check schedules
      if (pet.schedules && pet.schedules.length > 0) {
        for (const schedule of pet.schedules) {
          if (!schedule.notificationsEnabled) continue;

          // Parse time
          const timeMatch = schedule.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
          if (!timeMatch) continue;

          let hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const period = timeMatch[3].toUpperCase();

          if (period === "PM" && hours !== 12) hours += 12;
          if (period === "AM" && hours === 12) hours = 0;

          const scheduleTime = hours * 60 + minutes;

          // Check if schedule matches current time (within 1 minute tolerance)
          if (Math.abs(scheduleTime - currentTime) <= 1) {
            // Check frequency
            let shouldNotify = false;

            if (schedule.frequency === "Daily") {
              shouldNotify = true;
            } else if (schedule.frequency === "Weekly") {
              // For weekly, we'd need to check the day of week
              // For now, notify if it's the scheduled day
              shouldNotify = true; // Simplified - you can enhance this
            } else if (schedule.frequency === "Monthly") {
              // For monthly, check if it's the right day of month
              shouldNotify = true; // Simplified - you can enhance this
            }

            if (shouldNotify) {
              const scheduledDateTime = new Date(currentDate);
              scheduledDateTime.setHours(hours, minutes, 0, 0);

              // Check if notification already exists
              const existingUpdate = await Update.findOne({
                userId,
                scheduleId: schedule._id.toString(),
                scheduledTime: scheduledDateTime,
                isActive: true,
              });

              if (!existingUpdate) {
                const newUpdate = new Update({
                  userId,
                  type: "schedule",
                  title: `${schedule.type} Reminder`,
                  message: `Time for ${schedule.type.toLowerCase()} for ${pet.name}${schedule.notes ? `: ${schedule.notes}` : ""}`,
                  petId: pet._id,
                  petName: pet.name,
                  scheduleId: schedule._id.toString(),
                  scheduledTime: scheduledDateTime,
                });

                await newUpdate.save();
                createdNotifications.push(newUpdate);
              }
            }
          }
        }
      }

      // Check vaccinations (nextDueDate)
      if (pet.vaccinations && pet.vaccinations.length > 0) {
        for (const vaccination of pet.vaccinations) {
          if (!vaccination.notificationsEnabled || !vaccination.nextDueDate) continue;

          const nextDueDate = new Date(vaccination.nextDueDate);
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const dueDate = new Date(nextDueDate.getFullYear(), nextDueDate.getMonth(), nextDueDate.getDate());

          // Notify if due date is today or in the past
          if (dueDate <= today) {
            const scheduledDateTime = new Date(today);
            scheduledDateTime.setHours(9, 0, 0, 0); // Default to 9 AM

            const existingUpdate = await Update.findOne({
              userId,
              scheduleId: vaccination._id.toString(),
              scheduledTime: scheduledDateTime,
              isActive: true,
            });

            if (!existingUpdate) {
              const newUpdate = new Update({
                userId,
                type: "vaccination",
                title: "Vaccination Due",
                message: `${pet.name}'s ${vaccination.name} vaccination is due${vaccination.nextDueDate ? ` on ${vaccination.nextDueDate}` : ""}`,
                petId: pet._id,
                petName: pet.name,
                scheduleId: vaccination._id.toString(),
                scheduledTime: scheduledDateTime,
              });

              await newUpdate.save();
              createdNotifications.push(newUpdate);
            }
          }
        }
      }

      // Check vet visits (nextVisitDate)
      if (pet.vetVisits && pet.vetVisits.length > 0) {
        for (const vetVisit of pet.vetVisits) {
          if (!vetVisit.notificationsEnabled || !vetVisit.nextVisitDate) continue;

          const nextVisitDate = new Date(vetVisit.nextVisitDate);
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const visitDate = new Date(nextVisitDate.getFullYear(), nextVisitDate.getMonth(), nextVisitDate.getDate());

          // Notify if visit date is today or in the past
          if (visitDate <= today) {
            const scheduledDateTime = new Date(today);
            scheduledDateTime.setHours(9, 0, 0, 0); // Default to 9 AM

            const existingUpdate = await Update.findOne({
              userId,
              scheduleId: vetVisit._id.toString(),
              scheduledTime: scheduledDateTime,
              isActive: true,
            });

            if (!existingUpdate) {
              const newUpdate = new Update({
                userId,
                type: "vetVisit",
                title: "Vet Visit Reminder",
                message: `${pet.name} has a vet visit scheduled${vetVisit.nextVisitDate ? ` on ${vetVisit.nextVisitDate}` : ""}${vetVisit.reason ? ` - ${vetVisit.reason}` : ""}`,
                petId: pet._id,
                petName: pet.name,
                scheduleId: vetVisit._id.toString(),
                scheduledTime: scheduledDateTime,
              });

              await newUpdate.save();
              createdNotifications.push(newUpdate);
            }
          }
        }
      }
    }

    res.status(200).json({
      message: "Notifications checked and created",
      createdCount: createdNotifications.length,
      notifications: createdNotifications,
    });
  } catch (error) {
    console.error("Check and create notifications error:", error);
    res.status(500).json({ message: "Server error while checking notifications" });
  }
};


