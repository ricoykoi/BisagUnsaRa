import mongoose from "mongoose";

const exportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  format: {
    type: String,
    required: true,
    enum: ["PDF", "CSV", "JSON"],
  },
  dataType: {
    type: String,
    required: true,
    enum: ["allPetData", "schedules", "healthRecords", "specificPets"],
  },
  petIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
    },
  ],
  status: {
    type: String,
    required: true,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  fileUrl: {
    type: String, // URL to the generated file, e.g., in cloud storage
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Export = mongoose.model("Export", exportSchema);

export default Export;