import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Feeding", "Medication", "Exercise", "Grooming", "Training", "Other"],
  },
  time: {
    type: String,
    required: true,
  },
  frequency: {
    type: String,
    required: true,
    enum: ["Daily", "Weekly", "Monthly"],
  },
  notes: {
    type: String,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const vaccinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateGiven: {
    type: String, // Storing as string "MM/DD/YYYY" as per frontend
    required: true,
  },
  nextDueDate: {
    type: String, // Storing as string "MM/DD/YYYY"
  },
  veterinarian: {
    type: String,
  },
  notes: {
    type: String,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const vetVisitSchema = new mongoose.Schema({
  visitDate: {
    type: String, // Storing as string "MM/DD/YYYY"
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  veterinarian: {
    type: String,
  },
  nextVisitDate: {
    type: String, // Storing as string "MM/DD/YYYY"
  },
  diagnosis: {
    type: String,
  },
  treatment: {
    type: String,
  },
  notes: {
    type: String,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
});

const petSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
  },
  age: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // For Base64 string
  },
  fatherBreed: {
    type: String,
  },
  motherBreed: {
    type: String,
  },
  schedules: [scheduleSchema],
  vaccinations: [vaccinationSchema],
  vetVisits: [vetVisitSchema],
});

const Pet = mongoose.model("pet", petSchema);

export default Pet;