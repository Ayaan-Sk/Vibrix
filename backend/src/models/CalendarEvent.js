const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  type: { 
    type: String, 
    enum: ['exam', 'event', 'holiday', 'deadline', 'placement', 'other'], 
    default: 'other' 
  },
  department: { type: String, default: 'ALL' },
  linkedNoticeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notice' },
  createdById: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: { createdAt: true, updatedAt: false },
  collection: 'calendar_events'
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
