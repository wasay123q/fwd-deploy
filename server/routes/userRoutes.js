const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserStatus,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, admin, getAllUsers);
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUserStatus);

module.exports = router;
