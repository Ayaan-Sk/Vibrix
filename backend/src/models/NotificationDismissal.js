const mongoose = require('mongoose');

const dismissalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
  dismissedAt: { type: Date, default: Date.now }
}, {
  collection: 'notification_dismissals'
});

dismissalSchema.index({ userId: 1, noticeId: 1 }, { unique: true });

module.exports = mongoose.model('NotificationDismissal', dismissalSchema);
