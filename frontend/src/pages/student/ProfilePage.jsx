import { useState, useEffect } from 'react';
import { useAuth } from '../../store/AuthContext';
import { User, Bookmark, Trash2, ExternalLink, Settings, LogOut, Loader2, ChevronRight } from 'lucide-react';
import api from '../../api/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Read Later');
  const [savedNotices, setSavedNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'Read Later') {
      fetchSavedNotices();
    }
  }, [activeTab]);

  const fetchSavedNotices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/read-later');
      setSavedNotices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/read-later/${id}`);
      setSavedNotices(prev => prev.filter(item => item.noticeId?._id !== id && item.noticeId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.post('/read-later/clear');
      setSavedNotices([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 fade-in">
      {/* Header */}
      <div className="px-6 pt-16 pb-10 bg-surface border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-purple p-0.5 shadow-purple-lg mb-6">
            <div className="w-full h-full bg-background rounded-[22px] flex items-center justify-center text-3xl font-bold text-white uppercase italic">
              {user?.name?.[0]}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{user?.name}</h1>
          <p className="text-gray-500 font-medium tracking-widest text-[10px] uppercase">{user?.role} • {user?.department}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-10">
        <div className="flex bg-white/5 rounded-2xl p-1.5 mb-8">
          {['My Details', 'Read Later'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-surface text-white shadow-lg' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'My Details' ? (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div className="premium-card bg-white/[0.02]">
                 <div className="space-y-6">
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500 uppercase tracking-widest">Email</span>
                     <span className="text-sm text-white">{user?.email}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500 uppercase tracking-widest">UID</span>
                     <span className="text-sm text-white font-mono">{user?.id?.slice(-8).toUpperCase()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs text-gray-500 uppercase tracking-widest">Security</span>
                     <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-500 font-bold">Verified</span>
                   </div>
                 </div>
              </div>

              <button className="w-full premium-card flex items-center justify-between text-gray-400 hover:text-white group">
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span className="text-sm font-medium">Notification Settings</span>
                </div>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={logout}
                className="w-full premium-card border-red-500/20 flex items-center gap-3 text-red-500 hover:bg-red-500/5"
              >
                <LogOut size={18} />
                <span className="text-sm font-bold">Sign Out</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="bookmarks"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Saved Notices ({savedNotices.length})</h3>
                 {savedNotices.length > 0 && (
                   <button onClick={handleClearAll} className="text-[10px] text-gray-600 hover:text-red-500 transition-colors uppercase font-black">Clear All</button>
                 )}
              </div>

              <div className="space-y-4">
                {loading ? (
                   <div className="flex justify-center py-10">
                     <Loader2 className="animate-spin text-primary" />
                   </div>
                ) : savedNotices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                     <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-4">
                        <Bookmark size={24} />
                     </div>
                     <p className="text-gray-500 text-sm italic">"Swipe left on notices to see them here"</p>
                  </div>
                ) : (
                  savedNotices.map((item) => (
                    <div key={item._id} className="premium-card bg-surface/50 flex flex-col gap-4">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-bold text-white line-clamp-1 flex-grow pr-4">
                          {item.noticeId?.heading || 'Untitled Notice'}
                        </h4>
                        <button onClick={() => handleRemove(item.noticeId?._id || item.noticeId)} className="text-gray-600 hover:text-red-500">
                           <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                        {item.noticeId?.summary}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] text-gray-700 font-bold uppercase">{new Date(item.savedAt).toLocaleDateString()}</span>
                        <button 
                          onClick={() => navigate(`/student/notice/${item.noticeId?._id || item.noticeId}`)}
                          className="flex items-center gap-1 text-[10px] font-black text-primary-light uppercase tracking-widest"
                        >
                          Open <ExternalLink size={10} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;
