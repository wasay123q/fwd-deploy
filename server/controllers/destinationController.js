const Destination = require("../models/Destination");

// Hardcoded data for seeding (if DB is empty)
const initialDestinations = [
  {
    id: 1,
    name: "Multan",
    description: "City of Saints",
    price: 1500,
    image: "mulimg.jpg",
  },
  {
    id: 2,
    name: "Islamabad",
    description: "Capital",
    price: 1800,
    image: "isbimg.jpg",
  },
  {
    id: 3,
    name: "Karachi",
    description: "City by the sea",
    price: 2000,
    image: "karimg.jpg",
  },
  {
    id: 4,
    name: "Lahore",
    description: "Heart of Pakistan",
    price: 1700,
    image: "lahimg.jpg",
  },
  {
    id: 5,
    name: "Peshawar",
    description: "Historic city",
    price: 1600,
    image: "peimg.jpg",
  },
  {
    id: 6,
    name: "Quetta",
    description: "Mountain city",
    price: 1800,
    image: "queimg.jpg",
  },
];

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
exports.getDestinations = async (req, res) => {
  try {
    let destinations = await Destination.find();

    // Seed if empty
    if (destinations.length === 0) {
      await Destination.insertMany(initialDestinations);
      destinations = await Destination.find();
    }

    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get destination by name
// @route   GET /api/destination/:name
// @access  Public
exports.getDestinationByName = async (req, res) => {
  try {
    const destinationName = req.params.name.toLowerCase();
    // Case-insensitive search
    const destination = await Destination.findOne({
      name: { $regex: new RegExp(`^${destinationName}$`, "i") },
    });

    if (destination) {
      res.json(destination);
    } else {
      res.status(404).json({ message: "Destination not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private/Admin
exports.createDestination = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Destination name is required" });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!price || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }
    if (!image || !image.trim()) {
      return res.status(400).json({ message: "Image filename is required" });
    }

    // Check for duplicate destination (case-insensitive)
    const existingDestination = await Destination.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
    });

    if (existingDestination) {
      return res.status(400).json({ 
        message: `Destination '${name.trim()}' already exists` 
      });
    }

    const destination = await Destination.create({
      id: Date.now(), // Simple ID generation
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      image: image.trim(),
    });
    res.status(201).json(destination);
  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).json({ message: "Failed to create destination. Please try again." });
  }
};

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    const { name, description, price, image } = req.body;

    // Validate required fields
    if (name !== undefined && (!name || !name.trim())) {
      return res.status(400).json({ message: "Destination name cannot be empty" });
    }
    if (description !== undefined && (!description || !description.trim())) {
      return res.status(400).json({ message: "Description cannot be empty" });
    }
    if (price !== undefined && (price <= 0)) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }
    if (image !== undefined && (!image || !image.trim())) {
      return res.status(400).json({ message: "Image filename cannot be empty" });
    }

    // Check for duplicate destination name (excluding current destination)
    if (name && name.trim()) {
      const existingDestination = await Destination.findOne({
        name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
        _id: { $ne: req.params.id },
      });

      if (existingDestination) {
        return res.status(400).json({ 
          message: `Destination '${name.trim()}' already exists` 
        });
      }
    }

    // Update fields
    destination.name = name ? name.trim() : destination.name;
    destination.description = description ? description.trim() : destination.description;
    destination.price = price ? Number(price) : destination.price;
    destination.image = image ? image.trim() : destination.image;

    const updatedDestination = await destination.save();
    res.json(updatedDestination);
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({ message: "Failed to update destination. Please try again." });
  }
};

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ message: "Destination not found" });
    }

    await destination.deleteOne();
    res.json({ 
      message: "Destination removed successfully",
      deletedDestination: destination.name 
    });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ message: "Failed to delete destination. Please try again." });
  }
};
