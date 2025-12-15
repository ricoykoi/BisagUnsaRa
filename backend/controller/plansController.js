import Plan from "../model/plansModel.js";

// CREATE a new plan (typically an admin action)
export const createPlan = async (req, res) => {
  try {
    const { name, price, features } = req.body;

    // Basic validation
    if (!name || price === undefined || !features) {
      return res
        .status(400)
        .json({ message: "Name, price, and features are required." });
    }

    // Check if a plan with the same name already exists
    const existingPlan = await Plan.findOne({ name });
    if (existingPlan) {
      return res.status(400).json({ message: "A plan with this name already exists." });
    }

    const newPlan = new Plan({
      name,
      price,
      features,
    });

    await newPlan.save();

    res
      .status(201)
      .json({ message: "Plan created successfully!", plan: newPlan });
  } catch (error) {
    console.error("Create Plan Error:", error);
    res.status(500).json({ message: "Server error while creating the plan." });
  }
};

// READ all available plans
export const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.status(200).json(plans);
  } catch (error) {
    console.error("Get All Plans Error:", error);
    res.status(500).json({ message: "Server error while fetching plans." });
  }
};

// UPDATE a plan (typically an admin action)
export const updatePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const updates = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(planId, updates, {
      new: true, // Return the updated document
    });

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res
      .status(200)
      .json({ message: "Plan updated successfully!", plan: updatedPlan });
  } catch (error) {
    console.error("Update Plan Error:", error);
    res.status(500).json({ message: "Server error while updating the plan." });
  }
};

// DELETE a plan (typically an admin action)
export const deletePlan = async (req, res) => {
  try {
    const { planId } = req.params;
    const deletedPlan = await Plan.findByIdAndDelete(planId);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    res.status(200).json({ message: "Plan deleted successfully." });
  } catch (error) {
    console.error("Delete Plan Error:", error);
    res.status(500).json({ message: "Server error while deleting the plan." });
  }
};