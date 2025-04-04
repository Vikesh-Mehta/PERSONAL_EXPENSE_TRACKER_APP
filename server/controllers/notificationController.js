// server/controllers/notificationController.js
const Notification = require('../models/Notification');

// @desc    Get unread notifications for user
// @route   GET /api/notifications/unread
// @access  Private
exports.getUnreadNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id, isRead: false })
                                         .sort({ createdAt: -1 }) // Newest first
                                         .limit(10); // Limit results
        const unreadCount = await Notification.countDocuments({ user: req.user.id, isRead: false });

        res.status(200).json({ success: true, count: notifications.length, totalUnread: unreadCount, data: notifications });
    } catch (error) {
        console.error("Get Unread Notifications Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, // Ensure user owns notification
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found or not authorized' });
        }
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error("Mark Notification Read Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

 // @desc    Mark ALL notifications as read
// @route   PUT /api/notifications/readall
// @access  Private
exports.markAllAsRead = async (req, res) => {
    try {
       const result = await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { isRead: true }
        );

         // Check result.modifiedCount or similar if needed
         console.log(`Marked ${result.modifiedCount} notifications as read for user ${req.user.id}`);

        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error("Mark All Notifications Read Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};