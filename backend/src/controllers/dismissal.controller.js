const NotificationDismissal = require('../models/NotificationDismissal');

exports.dismissNotice = async (req, res) => {
  try {
    const { notice_id } = req.body;
    await NotificationDismissal.findOneAndUpdate(
      { userId: req.user.id, noticeId: notice_id },
      { $setOnInsert: { userId: req.user.id, noticeId: notice_id } },
      { upsert: true }
    );
    res.json({ message: 'Dismissed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
