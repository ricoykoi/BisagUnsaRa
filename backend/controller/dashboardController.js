import Dashboard from "../model/dashboardModel.js";

// GET or CREATE dashboard settings for a user
export const getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    let dashboard = await Dashboard.findOne({ userId });

    // If no dashboard settings exist for the user, create a default configuration
    if (!dashboard) {
      dashboard = new Dashboard({
        userId,
        widgets: [
          { type: "petSummary", position: 1, enabled: true },
          { type: "upcomingSchedules", position: 2, enabled: true },
          { type: "healthAlerts", position: 3, enabled: true },
        ],
      });
      await dashboard.save();
    }

    res.status(200).json(dashboard);
  } catch (error) {
    console.error("Get Dashboard Error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching dashboard settings." });
  }
};

// UPDATE (or create) dashboard settings for a user
export const updateDashboard = async (req, res) => {
  try {
    const { userId } = req.params;
    const { widgets } = req.body;

    if (!userId || !widgets) {
      return res
        .status(400)
        .json({ message: "User ID and widgets are required." });
    }

    const updatedDashboard = await Dashboard.findOneAndUpdate(
      { userId },
      { widgets },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(updatedDashboard);
  } catch (error) {
    console.error("Update Dashboard Error:", error);
    res.status(500).json({ message: "Server error while updating dashboard." });
  }
};