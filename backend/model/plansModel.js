import mongoose from "mongoose";

const featuresSchema = new mongoose.Schema(
  {
    maxPets: {
      type: Number,
      required: true,
    },
    hasHealthRecords: {
      type: Boolean,
      required: true,
      default: false,
    },
    enableDataExport: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: featuresSchema,
});

const Plan = mongoose.model("Plan", planSchema);

export default Plan;