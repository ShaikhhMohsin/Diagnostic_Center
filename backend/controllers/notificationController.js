const Notification = require("../models/Notification");

// @desc    Get all user notifications
// @route   GET /api/notifications
// @access  Private
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort("-createdAt");
    res.status(200).json({ status: "success", count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ status: "fail", message: "Notification not found" });
    }

    // Security check: Only the owner can read
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ status: "fail", message: "Not authorized to update this notification" });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({ status: "success", data: notification });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};
