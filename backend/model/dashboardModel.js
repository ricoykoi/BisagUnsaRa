import mongoose from "mongoose";

const widgetSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["petSummary", "upcomingSchedules", "healthAlerts"],
    },
    position: {
      type: Number,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const dashboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  widgets: [widgetSchema],
  // You could add other dashboard-specific settings here
  // e.g., theme: { type: String, default: 'light' }
});

const Dashboard = mongoose.model("Dashboard", dashboardSchema);

export default Dashboard;