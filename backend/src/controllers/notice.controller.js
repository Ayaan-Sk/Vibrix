const Notice = require('../models/Notice');
const User = require('../models/User');
const NotificationDismissal = require('../models/NotificationDismissal');

exports.getNotices = async (req, res) => {
  try {
    const { dept, urgency, tag, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const now = new Date();

    const query = {
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: now } }
      ]
    };

    // Role-based visibility
    if (req.user.role === 'student') {
      query.isDraft = false;
      query.$and = [
        { $or: [{ department: 'ALL' }, { department: req.user.department }] }
      ];
    } else if (req.user.role === 'faculty') {
      query.$or = [
        { isDraft: false, department: { $in: ['ALL', req.user.department] } },
        { postedBy: req.user.id }
      ];
    }

    if (dept) query.department = dept;
    if (urgency) query.urgency = urgency;
    if (tag) query.tags = tag;

    const [notices, total] = await Promise.all([
      Notice.find(query)
        .populate('postedBy', 'name')
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit)),
      Notice.countDocuments(query)
    ]);

    res.json({
      notices,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStartupNotices = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    const dismissed = await NotificationDismissal.find({ userId }).select('noticeId');
    const dismissedIds = dismissed.map(d => d.noticeId);

    const notices = await Notice.find({
      isStartupNotification: true,
      isDraft: false,
      _id: { $nin: dismissedIds },
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: now } }
      ],
      department: { $in: ['ALL', req.user.department] }
    })
    .sort({ createdAt: -1 })
    .limit(5);

    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPinnedNotices = async (req, res) => {
  try {
    const now = new Date();
    const query = {
      isPinned: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: now } }
      ]
    };

    if (req.user.role === 'student') {
      query.isDraft = false;
      query.department = { $in: ['ALL', req.user.department] };
    } else if (req.user.role === 'faculty') {
      query.$or = [
        { isDraft: false, department: { $in: ['ALL', req.user.department] } },
        { postedBy: req.user.id }
      ];
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUrgentCount = async (req, res) => {
  try {
    const now = new Date();
    const query = {
      urgency: 'critical',
      isDraft: false,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: now } }
      ],
      department: { $in: ['ALL', req.user.department] }
    };
    const count = await Notice.countDocuments(query);
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('postedBy', 'name');
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.user.role === 'faculty') {
      data.department = req.user.department;
    }
    data.postedBy = req.user.id;

    const notice = new Notice(data);
    await notice.save();

    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    if (req.user.role === 'faculty' && notice.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await Notice.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    if (req.user.role === 'faculty' && notice.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Notice.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.togglePin = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    notice.isPinned = !notice.isPinned;
    await notice.save();
    res.json({ isPinned: notice.isPinned });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleStartup = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    notice.isStartupNotification = !notice.isStartupNotification;
    await notice.save();
    res.json({ isStartupNotification: notice.isStartupNotification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
