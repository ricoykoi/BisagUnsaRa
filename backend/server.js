import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import ensurePlans from "./scripts/ensurePlans.js";
import userRouter from "./routes/userRoutes.js";
import petRouter from "./routes/petRoutes.js";
import plansRouter from "./routes/plansRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import subscriptionRouter from "./routes/subscriptionRoutes.js";
import exportRouter from "./routes/exportRoutes.js";
import updateRouter from "./routes/updateRoutes.js";

const app = express();
connectDB();

// Ensure plans exist in database on server startup
ensurePlans().then((success) => {
  if (success) {
    console.log("✓ Plans verified in database");
  } else {
    console.warn("⚠ Warning: Could not verify plans. Run 'npm run seed:plans' manually.");
  }
});

app.use(express.json());
app.use(cors());
const PORT = 3000;

app.use("/api/auth", userRouter);
app.use("/api/pets", petRouter);
app.use("/api/plans", plansRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/export", exportRouter);
app.use("/api/updates", updateRouter);

app.listen(PORT, () => {
  console.log("Running port: ", PORT);
});
