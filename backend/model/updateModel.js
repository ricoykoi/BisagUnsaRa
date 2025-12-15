import mongoose from "mongoose";

const updateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["schedule", "vaccination", "vetVisit"],
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pet",
  },
  petName: {
    type: String,
  },
  scheduleId: {
    type: String, // Can be schedule _id or vaccination _id or vetVisit _id
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true, // Active notifications that haven't been dismissed
  },
}, {
  timestamps: true,
});

const Update = mongoose.model("update", updateSchema);

export default Update;

