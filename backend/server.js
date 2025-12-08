import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
const PORT = 3000;

app.get("/", (req, res) => {
  res.json({ message: "Hello fur fur" });
});

app.listen(PORT, () => {
  console.log("Running port: ", PORT);
});
