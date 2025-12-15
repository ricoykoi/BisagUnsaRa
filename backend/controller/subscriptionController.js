import Subscription from "../model/subscriptionModel.js";
import User from "../model/userModel.js";
import Plan from "../model/plansModel.js";

// CREATE or UPDATE a subscription for a user
export const createSubscription = async (req, res) => {
  try {
    const { userId, planName } = req.body;

    // Basic validation
    if (!userId || !planName) {
      return res
        .status(400)
        .json({ message: "User ID and Plan Name are required." });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find plan by name
    let plan = await Plan.findOne({ name: planName });
    
    // If plan doesn't exist, try to create it automatically
    if (!plan) {
      console.warn(`Plan "${planName}" not found. Attempting to create it...`);
      
      // Define default plans
      const defaultPlans = {
        "Free Mode": {
          name: "Free Mode",
          price: 0,
          features: {
            maxPets: 2,
            hasHealthRecords: false,
            enableDataExport: false,
          },
        },
        "Premium Tier 1": {
          name: "Premium Tier 1",
          price: 49.99,
          features: {
            maxPets: 5,
            hasHealthRecords: true,
            enableDataExport: false,
          },
        },
        "Premium Tier 2": {
          name: "Premium Tier 2",
          price: 99.99,
          features: {
            maxPets: 10,
            hasHealthRecords: true,
            enableDataExport: true,
          },
        },
      };
      
      const planData = defaultPlans[planName];
      if (planData) {
        try {
          plan = new Plan(planData);
          await plan.save();
          console.log(`✓ Auto-created plan: ${planName}`);
        } catch (createError) {
          console.error(`Error auto-creating plan ${planName}:`, createError);
          // List all existing plans for better error message
          const existingPlans = await Plan.find({}, { name: 1 });
          const planNames = existingPlans.map(p => p.name).join(", ") || "None";
          return res.status(404).json({ 
            message: `Plan "${planName}" not found and could not be created. Existing plans in database: ${planNames}. Please run: npm run seed:plans` 
          });
        }
      } else {
        // List all existing plans for better error message
        const existingPlans = await Plan.find({}, { name: 1 });
        const planNames = existingPlans.map(p => p.name).join(", ") || "None";
        return res.status(404).json({ 
          message: `Plan "${planName}" not found. Existing plans in database: ${planNames}. Please run: npm run seed:plans` 
        });
      }
    }

    // Check if the user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      userId,
      status: "active",
    });

    if (existingSubscription) {
      // Update subscription - either switching plans or renewing current plan
      if (existingSubscription.planId.toString() !== plan._id.toString()) {
        // Switching to a different plan
        existingSubscription.planId = plan._id;
        existingSubscription.startDate = new Date();
        existingSubscription.endDate = null;
        existingSubscription.status = "active";
        await existingSubscription.save();
        
        console.log(`Subscription updated for user ${userId}: Changed to ${planName}`);
      } else {
        // Same plan - renew/refresh the subscription (update startDate)
        existingSubscription.startDate = new Date();
        existingSubscription.endDate = null;
        existingSubscription.status = "active";
        await existingSubscription.save();
        
        console.log(`Subscription renewed for user ${userId}: ${planName}`);
      }
      
      const updatedSubscription = await Subscription.findById(existingSubscription._id)
        .populate("planId");
      
      return res.status(200).json({
        message: "Subscription updated successfully!",
        subscription: updatedSubscription,
        planName: updatedSubscription.planId?.name || planName
      });
    }

    // Create new subscription (user doesn't have one yet)
    const newSubscription = new Subscription({
      userId,
      planId: plan._id,
      status: "active",
      startDate: new Date(),
    });

    await newSubscription.save();
    console.log(`New subscription created for user ${userId}: ${planName}`);

    const subscription = await Subscription.findById(newSubscription._id)
      .populate("planId");

    res.status(201).json({
      message: "Subscription created successfully!",
      subscription: subscription,
      planName: subscription.planId?.name || planName
    });
  } catch (error) {
    console.error("Create Subscription Error:", error);
    res
      .status(500)
      .json({ message: "Server error while creating the subscription." });
  }
};

// READ the subscription for a specific user
export const getSubscriptionByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await Subscription.findOne({
      userId,
      status: "active",
    }).populate("planId");

    // If no subscription found, return default "Free Mode" plan
    if (!subscription) {
      const freePlan = await Plan.findOne({ name: "Free Mode" });
      if (!freePlan) {
        return res.status(404).json({ 
          message: "No subscription found and Free Mode plan not available." 
        });
      }
      return res.status(200).json({
        planId: freePlan,
        planName: "Free Mode",
        status: "active",
        isDefault: true
      });
    }

    res.status(200).json({
      ...subscription.toObject(),
      planName: subscription.planId?.name || "Free Mode"
    });
  } catch (error) {
    console.error("Get Subscription Error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching subscription." });
  }
};

// CANCEL a subscription (sets status to 'canceled')
export const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      subscriptionId,
      { status: "cancelled", endDate: new Date() },
      { new: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    res.status(200).json({ message: "Subscription canceled successfully." });
  } catch (error) {
    console.error("Cancel Subscription Error:", error);
    res
      .status(500)
      .json({ message: "Server error while canceling the subscription." });
  }
};
