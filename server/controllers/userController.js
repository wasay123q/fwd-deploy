const User = require("../models/User");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update user status (suspend/activate) - For now just a placeholder or simple role toggle if needed,
//          but user asked for suspend. We might need to add a 'status' field to User model later if not present.
//          For now, let's just implement delete as requested and maybe a role update?
//          Wait, user asked to "suspend them for a limited time".
//          I will add a status field to the user model in the next step to support this.
//          For now, I'll write the controller assuming a 'isSuspended' field exists.
exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.isSuspended = !user.isSuspended;
      const updatedUser = await user.save();
      res.json({
        message: `User ${updatedUser.isSuspended ? "suspended" : "activated"}`,
        user: updatedUser,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
