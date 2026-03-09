import { useState, useEffect } from 'react';
import { AlertCircle, Filter, WifiOff } from 'lucide-react';
import api from '../../api/axiosInstance';
import NoticeCard from '../../components/feed/NoticeCard';
import StartupNotificationStack from '../../components/feed/StartupNotificationStack';

const StudentFeed = () => {
  const [notices, setNotices] = useState([]);
  const [startupNotices, setStartupNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStartup, setShowStartup] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Exam', 'Event', 'Holiday', 'Critical'];

  useEffect(() => {
    fetchNotices();
    fetchStartupNotices();
    
    window.addEventListener('online', () => setIsOffline(false));
    window.addEventListener('offline', () => setIsOffline(true));
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await api.get('/notices');
      setNotices(data.notices);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStartupNotices = async () => {
    try {
      const { data } = await api.get('/notices/startup');
      if (data.length > 0) {
        setStartupNotices(data);
        setShowStartup(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (id) => {
    try {
      await api.post('/read-later', { notice_id: id });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.post('/dismiss', { notice_id: id });
    } catch (err) {
      console.error(err);
    }
  };

  const urgentNotices = notices.filter(n => n.urgency === 'critical');

  return (
    <div className="min-h-screen bg-background pb-20">
      {isOffline && (
        <div className="bg-yellow-500/20 border-b border-yellow-500/50 text-yellow-500 px-4 py-2 text-center text-xs font-bold flex items-center justify-center gap-2">
          <WifiOff size={14} /> NO INTERNET CONNECTION
        </div>
      )}

      {showStartup && (
        <StartupNotificationStack
          notices={startupNotices}
          onSave={handleSave}
          onDismiss={handleDismiss}
          onComplete={() => setShowStartup(false)}
        />
      )}

      {/* Hero Header */}
      <div className="px-6 pt-12 pb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Hello, Student</h1>
        <p className="text-gray-500 text-sm">Stay updated with your latest college news.</p>
      </div>

      {/* Urgent Banner */}
      {urgentNotices.length > 0 && (
        <div className="mx-6 mb-8 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-4 animate-pulse-slow">
          <div className="p-2 bg-red-500 rounded-xl text-white shadow-lg shadow-red-500/20">
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Action Required</h4>
            <p className="text-red-400 text-[11px] font-medium uppercase tracking-widest">{urgentNotices.length} Critical updates pending</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="px-6 mb-8 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filter === cat 
                ? 'bg-gradient-purple text-white shadow-purple' 
                : 'bg-white/5 text-gray-400 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed Grid */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-[280px] rounded-2xl bg-white/5 animate-pulse" />
          ))
        ) : (
          notices.filter(n => filter === 'All' || n.tags.includes(filter) || (filter === 'Critical' && n.urgency === 'critical')).map(notice => (
            <NoticeCard 
              key={notice._id} 
              notice={notice} 
              onSave={handleSave}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StudentFeed;
