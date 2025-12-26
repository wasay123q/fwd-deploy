const express = require("express");
const router = express.Router();
const {
  getDestinations,
  getDestinationByName,
  createDestination,
  updateDestination,
  deleteDestination,
} = require("../controllers/destinationController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/destinations", getDestinations);
router.get("/destination/:name", getDestinationByName);
router.post("/destinations", protect, admin, createDestination);
router.put("/destinations/:id", protect, admin, updateDestination);
router.delete("/destinations/:id", protect, admin, deleteDestination);

module.exports = router;
