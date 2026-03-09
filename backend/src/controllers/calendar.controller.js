const CalendarEvent = require('../models/CalendarEvent');
const { generateICS } = require('../utils/icsGenerator');

exports.getEvents = async (req, res) => {
  try {
    const { month, year, dept } = req.query;
    if (!month || !year) return res.status(400).json({ error: 'Month and year required' });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const query = {
      startDate: { $gte: startDate, $lte: endDate }
    };

    if (req.user.role === 'student') {
      query.department = { $in: ['ALL', req.user.department] };
    } else if (req.user.role === 'faculty') {
      query.$or = [
        { department: { $in: ['ALL', req.user.department] } },
        { createdById: req.user.id }
      ];
    }

    if (dept) query.department = dept;

    const events = await CalendarEvent.find(query)
      .populate('linkedNoticeId', 'title')
      .sort({ startDate: 1 });
      
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const query = { startDate: { $gte: now } };
    
    if (req.user.role === 'student') {
      query.department = { $in: ['ALL', req.user.department] };
    } else if (req.user.role === 'faculty') {
      query.$or = [
        { department: { $in: ['ALL', req.user.department] } },
        { createdById: req.user.id }
      ];
    }

    const events = await CalendarEvent.find(query)
      .sort({ startDate: 1 })
      .limit(10);
      
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const data = { ...req.body, createdById: req.user.id };
    const event = new CalendarEvent(data);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await CalendarEvent.findById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (req.user.role === 'faculty' && event.createdById.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await CalendarEvent.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await CalendarEvent.findById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (req.user.role === 'faculty' && event.createdById.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await CalendarEvent.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.exportICS = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'student') {
      query.department = { $in: ['ALL', req.user.department] };
    }
    
    const events = await CalendarEvent.find(query);
    const icsContent = generateICS(events);
    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename=college-calendar.ics');
    res.send(icsContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFromNotice = async (req, res) => {
  try {
    const { noticeId, dates } = req.body;
    const createdEvents = [];
    for (const entry of dates) {
      const [datePart, titlePart] = entry.split(' - ');
      if (datePart && titlePart) {
        const event = new CalendarEvent({
          title: titlePart,
          startDate: new Date(datePart),
          department: 'ALL',
          linkedNoticeId: noticeId,
          createdById: req.user.id
        });
        await event.save();
        createdEvents.push(event);
      }
    }
    res.status(201).json(createdEvents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
