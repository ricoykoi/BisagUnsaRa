import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import ensurePlans from "./scripts/ensurePlans.js";
import userRouter from "./routes/userRoutes.js";
import petRouter from "./routes/petRoutes.js";
import plansRouter from "./routes/plansRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import subscriptionRouter from "./routes/subscriptionRoutes.js";
import exportRouter from "./routes/exportRoutes.js";
import updateRouter from "./routes/updateRoutes.js";

dotenv.config();

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

const allowedOrigins = [
  // Local development
  "http://localhost:3000",
  "http://localhost:5173",

  // Production frontend (Vercel) - use full https URL
  "https://bisag-unsa-ra.vercel.app",

  // Optional: Vercel preview deployments (replace with your actual preview domain if different)
  "https://bisag-unsa-ra-git-main-yourname.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Explicitly handle all OPTIONS preflight requests
app.options("*", cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 3000;

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
