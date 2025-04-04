// server/routes/notificationRoutes.js
const express = require('express');
const { getUnreadNotifications, markAsRead, markAllAsRead } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect); // Protect all routes

router.get('/unread', getUnreadNotifications);
router.put('/:id/read', markAsRead);
router.put('/readall', markAllAsRead); // Route to mark all as read

module.exports = router;