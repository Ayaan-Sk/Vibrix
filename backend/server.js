require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

connectDB();

const authRoutes = require('./src/routes/auth.routes');
const noticeRoutes = require('./src/routes/notice.routes');
const readLaterRoutes = require('./src/routes/readLater.routes');
const dismissalRoutes = require('./src/routes/dismissal.routes');
const aiRoutes = require('./src/routes/ai.routes');
const calendarRoutes = require('./src/routes/calendar.routes');
const userRoutes = require('./src/routes/user.routes');

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/read-later', readLaterRoutes);
app.use('/api/dismissals', dismissalRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
