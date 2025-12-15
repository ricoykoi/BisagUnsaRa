import Pet from "../model/petModel.js";

// CREATE a new pet
export const createPet = async (req, res) => {
  try {
    const { name, type, breed, age, photo, fatherBreed, motherBreed, userId } =
      req.body;

    if (!name || !type || !age) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const newPet = new Pet({
      userId: userId,
      name,
      type,
      breed,
      age,
      photo,
      fatherBreed,
      motherBreed,
    });

    await newPet.save();

    res
      .status(201)
      .json({ message: "Pet added successfully!", pet: newPet });
  } catch (error) {
    console.error("Create Pet Error:", error);
    res.status(500).json({ message: "Server error while creating pet." });
  }
};

// READ all pets for a specific user
export const getPetsByUser = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const pets = await Pet.find({ userId: userId });

    if (!pets || pets.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.status(200).json(pets);
  } catch (error) {
    console.error("Get Pets Error:", error);
    res.status(500).json({ message: "Server error while fetching pets." });
  }
};

// UPDATE a pet
export const updatePet = async (req, res) => {
  try {
    const { petId } = req.params;
    const { userId, ...updates } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const pet = await Pet.findOne({ _id: petId, userId: userId });

    if (!pet) {
      return res
        .status(404)
        .json({ message: "Pet not found or user not authorized." });
    }

    const updatedPet = await Pet.findByIdAndUpdate(petId, updates, { new: true });

    if (!updatedPet) {
      return res.status(404).json({ message: "Pet not found." });
    }

    res
      .status(200)
      .json({ message: "Pet updated successfully!", pet: updatedPet });
  } catch (error) {
    console.error("Update Pet Error:", error);
    res.status(500).json({ message: "Server error while updating pet." });
  }
};

// DELETE a pet
export const deletePet = async (req, res) => {
  try {
    const { petId } = req.params;
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const pet = await Pet.findOne({ _id: petId, userId: userId });

    if (!pet) {
      return res
        .status(404)
        .json({ message: "Pet not found or user not authorized." });
    }

    const deletedPet = await Pet.findByIdAndDelete(petId);

    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found." });
    }

    res.status(200).json({ message: "Pet deleted successfully." });
  } catch (error) {
    console.error("Delete Pet Error:", error);
    res.status(500).json({ message: "Server error while deleting pet." });
  }
};