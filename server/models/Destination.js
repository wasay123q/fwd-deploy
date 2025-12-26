const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  image: String,
});

module.exports = mongoose.model("Destination", destinationSchema);
