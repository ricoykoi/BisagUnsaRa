import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Plan from "../model/plansModel.js";

const seedPlans = async () => {
  try {
    await connectDB();

    const plans = [
      {
        name: "Free Mode",
        price: 0,
        features: {
          maxPets: 2,
          hasHealthRecords: false,
          enableDataExport: false,
        },
      },
      {
        name: "Premium Tier 1",
        price: 49.99,
        features: {
          maxPets: 5,
          hasHealthRecords: true,
          enableDataExport: false,
        },
      },
      {
        name: "Premium Tier 2",
        price: 99.99,
        features: {
          maxPets: 10,
          hasHealthRecords: true,
          enableDataExport: true,
        },
      },
    ];

    for (const planData of plans) {
      const existingPlan = await Plan.findOne({ name: planData.name });
      if (existingPlan) {
        console.log(`Plan "${planData.name}" already exists, skipping...`);
      } else {
        const plan = new Plan(planData);
        await plan.save();
        console.log(`✓ Created plan: ${planData.name}`);
      }
    }

    console.log("Plans seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding plans:", error);
    process.exit(1);
  }
};

seedPlans();

