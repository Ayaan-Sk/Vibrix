const mongoose = require('mongoose');

const readLaterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  noticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice', required: true },
  savedAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date }
}, {
  collection: 'read_later'
});

readLaterSchema.index({ userId: 1, noticeId: 1 }, { unique: true });

module.exports = mongoose.model('ReadLater', readLaterSchema);
