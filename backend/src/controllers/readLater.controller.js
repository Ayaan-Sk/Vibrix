const ReadLater = require('../models/ReadLater');

exports.getReadLater = async (req, res) => {
  try {
    const { unread_only } = req.query;
    const query = { userId: req.user.id };
    if (unread_only === 'true') query.isRead = false;

    const items = await ReadLater.find(query)
      .populate('noticeId', 'title summary urgency tags department createdAt')
      .sort({ savedAt: -1 });

    // Transform for consistent output format
    const transformed = items.map(item => ({
      ...item.toObject(),
      notice: item.noticeId
    }));

    res.json(transformed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const count = await ReadLater.countDocuments({
      userId: req.user.id,
      isRead: false
    });
    res.json({ unread_count: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.saveReadLater = async (req, res) => {
  try {
    const { notice_id } = req.body;
    const item = await ReadLater.findOneAndUpdate(
      { userId: req.user.id, noticeId: notice_id },
      { $setOnInsert: { userId: req.user.id, noticeId: notice_id } },
      { upsert: true, new: true }
    );
    res.json({ message: 'Saved', item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notice_id } = req.params;
    await ReadLater.findOneAndUpdate(
      { userId: req.user.id, noticeId: notice_id },
      { isRead: true, readAt: new Date() }
    );
    res.json({ message: 'Marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeReadLater = async (req, res) => {
  try {
    const { notice_id } = req.params;
    await ReadLater.findOneAndDelete({ userId: req.user.id, noticeId: notice_id });
    res.json({ message: 'Removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearReadItems = async (req, res) => {
  try {
    const result = await ReadLater.deleteMany({ userId: req.user.id, isRead: true });
    res.json({ deleted: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
