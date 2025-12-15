import Export from "../model/exportModel.js";
import Pet from "../model/petModel.js"; // Needed to fetch data for export

// CREATE a new export request
export const requestExport = async (req, res) => {
  try {
    const { userId, format, dataType, petIds } = req.body;

    if (!userId || !format || !dataType) {
      return res
        .status(400)
        .json({ message: "User ID, format, and data type are required." });
    }

    // In a real application, you would trigger a background job here
    // to process the export and generate the file.
    // For now, we'll just create the record.

    const newExport = new Export({
      userId,
      format,
      dataType,
      petIds: dataType === "specificPets" ? petIds : [],
      status: "pending",
    });

    await newExport.save();

    res.status(202).json({
      message: "Export request received and is being processed.",
      exportJob: newExport,
    });
  } catch (error) {
    console.error("Request Export Error:", error);
    res
      .status(500)
      .json({ message: "Server error while requesting export." });
  }
};

// READ export history for a user
export const getExportHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Export.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    console.error("Get Export History Error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching export history." });
  }
};

// GET a single export's details
export const getExportDetails = async (req, res) => {
  try {
    const { exportId } = req.params;
    const exportJob = await Export.findById(exportId);

    if (!exportJob) {
      return res.status(404).json({ message: "Export job not found." });
    }

    res.status(200).json(exportJob);
  } catch (error) {
    console.error("Get Export Details Error:", error);
    res.status(500).json({ message: "Server error while fetching export." });
  }
};

// DELETE an export record
export const deleteExport = async (req, res) => {
  try {
    const { exportId } = req.params;
    const deletedExport = await Export.findByIdAndDelete(exportId);
    if (!deletedExport) {
      return res.status(404).json({ message: "Export record not found." });
    }
    res.status(200).json({ message: "Export record deleted successfully." });
  } catch (error) {
    console.error("Delete Export Error:", error);
    res.status(500).json({ message: "Server error while deleting export." });
  }
};