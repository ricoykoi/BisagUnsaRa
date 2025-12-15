import express from "express";
import {
  requestExport,
  getExportHistory,
  getExportDetails,
  deleteExport,
} from "../controller/exportController.js";

const exportRouter = express.Router();

// Create a new export request
exportRouter.post("/", requestExport);

// Get export history for a user
exportRouter.get("/user/:userId", getExportHistory);

// Get details for a single export job
exportRouter.get("/:exportId", getExportDetails);

// Delete an export record
exportRouter.delete("/:exportId", deleteExport);

export default exportRouter;