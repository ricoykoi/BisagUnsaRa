import User from "../model/userModel.js";
import Subscription from "../model/subscriptionModel.js";
import Plan from "../model/plansModel.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // simple validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if email already exists
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already used" });
    }

    // create user
    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    // Auto-create Free Mode subscription for new user
    try {
      const freePlan = await Plan.findOne({ name: "Free Mode" });
      if (freePlan) {
        const newSubscription = new Subscription({
          userId: newUser._id,
          planId: freePlan._id,
          status: "active",
        });
        await newSubscription.save();
      }
    } catch (subscriptionError) {
      console.error("Error creating default subscription:", subscriptionError);
      // Don't fail registration if subscription creation fails
    }

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ message: "Server error during register" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // simple validation
    if (!username || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    // check user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check password (simple comparison)
    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // Ensure user has a subscription (create Free Mode if they don't)
    const existingSubscription = await Subscription.findOne({
      userId: user._id,
      status: "active",
    });

    if (!existingSubscription) {
      try {
        const freePlan = await Plan.findOne({ name: "Free Mode" });
        if (freePlan) {
          const newSubscription = new Subscription({
            userId: user._id,
            planId: freePlan._id,
            status: "active",
          });
          await newSubscription.save();
        }
      } catch (subscriptionError) {
        console.error("Error creating default subscription on login:", subscriptionError);
        // Don't fail login if subscription creation fails
      }
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// UPDATE PROFILE PICTURE
export const updateProfilePicture = async (req, res) => {
  try {
    const { userId } = req.body;
    const { profilePicture } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = profilePicture || null;
    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile picture error:", error);
    res.status(500).json({ message: "Server error during profile picture update" });
  }
};

// UPDATE USERNAME
export const updateUsername = async (req, res) => {
  try {
    const { userId, newUsername } = req.body;

    if (!userId || !newUsername) {
      return res.status(400).json({ message: "User ID and new username are required" });
    }

    // Check if username is already in use
    const existingUser = await User.findOne({ username: newUsername });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = newUsername;
    await user.save();

    res.status(200).json({
      message: "Username updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update username error:", error);
    res.status(500).json({ message: "Server error during username update" });
  }
};

// UPDATE EMAIL
export const updateEmail = async (req, res) => {
  try {
    const { userId, newEmail } = req.body;

    if (!userId || !newEmail) {
      return res.status(400).json({ message: "User ID and new email are required" });
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({
      message: "Email updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update email error:", error);
    res.status(500).json({ message: "Server error during email update" });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "User ID, current password, and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    if (user.password !== currentPassword) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Password validation
    const passwordValidation = {
      hasMinLength: newPassword.length >= 12,
      hasNumber: /\d/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasUppercase: /[A-Z]/.test(newPassword),
      noLeadingTrailingSpaces: newPassword === newPassword.trim() && newPassword.length > 0,
    };

    const isPasswordValid = Object.values(passwordValidation).every((v) => v === true);

    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: "Password does not meet requirements",
        validation: passwordValidation
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error during password change" });
  }
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    // Also delete associated subscriptions
    try {
      await Subscription.deleteMany({ userId });
    } catch (subscriptionError) {
      console.error("Error deleting subscriptions:", subscriptionError);
    }

    res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error during account deletion" });
  }
};
