import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
const PORT = 3000;

app.use("/api/auth", userRouter);

app.listen(PORT, () => {
  console.log("Running port: ", PORT);
});
