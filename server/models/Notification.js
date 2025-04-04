// server/models/Notification.js
const mongoose = require('mongoose');
const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, index: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['budget', 'system', 'info'], default: 'info' },
    isRead: { type: Boolean, default: false, index: true },
    link: { type: String }, // Optional link (e.g., to budget page)
}, { timestamps: true });
module.exports = mongoose.model('Notification', NotificationSchema);