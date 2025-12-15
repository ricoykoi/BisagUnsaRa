import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  notifications: {
    reminders: { type: Boolean, default: true },
    feeding: { type: Boolean, default: true },
    health: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false },
  },
  darkMode: { type: Boolean, default: false },
  language: { type: String, default: 'english' },
  soundEnabled: { type: Boolean, default: true },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    plan: {
      type: String,
      required: true,
      default: "Free Mode",
      enum: ["Free Mode", "Premium Tier 1", "Premium Tier 2"],
    },
    settings: {
      type: settingsSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
