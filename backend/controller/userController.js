import User from "../model/userModel.js";

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

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
