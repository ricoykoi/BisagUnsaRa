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

// Connect to MongoDB
connectDB();

// Ensure plans exist in database on startup
ensurePlans().then((success) => {
  if (success) {
    console.log("✓ Plans verified in database");
  } else {
    console.warn(
      "⚠ Warning: Could not verify plans. Run 'npm run seed:plans' manually."
    );
  }
});

// CORS setup
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://bisag-unsa-ra.vercel.app",
  "bisag-unsa-ra-53zc.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow Postman or server-to-server requests
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS globally
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", userRouter);
app.use("/api/pets", petRouter);
app.use("/api/plans", plansRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/subscriptions", subscriptionRouter);
app.use("/api/export", exportRouter);
app.use("/api/updates", updateRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
