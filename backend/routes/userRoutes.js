import express from "express";
import { 
  register, 
  login, 
  updateProfilePicture,
  updateUsername,
  updateEmail, 
  changePassword, 
  deleteAccount 
} from "../controller/userController.js";

const userRouter = express.Router();

// Register route
userRouter.post("/register", register);

// Login route
userRouter.post("/login", login);

// Update profile picture
userRouter.patch("/profile-picture", updateProfilePicture);

// Update username
userRouter.patch("/username", updateUsername);

// Update email
userRouter.patch("/email", updateEmail);

// Change password
userRouter.patch("/password", changePassword);

// Delete account
userRouter.delete("/account", deleteAccount);

export default userRouter;
