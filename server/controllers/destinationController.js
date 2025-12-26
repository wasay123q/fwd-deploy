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
    const destination = await Destination.create({
      id: Date.now(), // Simple ID generation
      name,
      description,
      price,
      image,
    });
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (destination) {
      destination.name = req.body.name || destination.name;
      destination.description = req.body.description || destination.description;
      destination.price = req.body.price || destination.price;
      destination.image = req.body.image || destination.image;

      const updatedDestination = await destination.save();
      res.json(updatedDestination);
    } else {
      res.status(404).json({ message: "Destination not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (destination) {
      await destination.remove();
      res.json({ message: "Destination removed" });
    } else {
      res.status(404).json({ message: "Destination not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
