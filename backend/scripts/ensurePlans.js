import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Plan from "../model/plansModel.js";

const ensurePlans = async () => {
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

    let createdCount = 0;
    for (const planData of plans) {
      const existingPlan = await Plan.findOne({ name: planData.name });
      if (!existingPlan) {
        const plan = new Plan(planData);
        await plan.save();
        createdCount++;
        console.log(`✓ Created plan: ${planData.name}`);
      }
    }

    if (createdCount > 0) {
      console.log(`Plans ensured: ${createdCount} new plan(s) created.`);
    } else {
      console.log("All plans already exist in database.");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring plans:", error);
    return false;
  }
};

export default ensurePlans;



