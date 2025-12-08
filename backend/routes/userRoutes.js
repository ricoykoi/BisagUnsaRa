import express from "express";
import { register, login } from "../controller/userController.js";

const userRouter = express.Router();

// Register route
userRouter.post("/register", register);

// Login route
userRouter.post("/login", login);

export default userRouter;
