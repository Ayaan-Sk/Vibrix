const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  summary: { type: String },
  importantDates: { type: mongoose.Schema.Types.Mixed }, // JSONB equivalent
  originalImageUrl: { type: String },
  extractedText: { type: String },
  detectedLanguage: { type: String },
  department: { type: String, default: 'ALL' },
  urgency: { type: String, enum: ['critical', 'normal', 'low'], default: 'normal' },
  tags: [String],
  isPinned: { type: Boolean, default: false },
  isDraft: { type: Boolean, default: false },
  isStartupNotification: { type: Boolean, default: false },
  expiryDate: { type: Date },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  collection: 'notices'
});

module.exports = mongoose.model('Notice', noticeSchema);
