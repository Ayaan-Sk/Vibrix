import { useState, useEffect } from 'react';
import { 
  Plus, FileText, Bell, Zap, 
  ArrowRight, Clock, User as UserIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Navbar from '../../components/layout/Navbar';
import StartupNotificationStack from '../../components/feed/StartupNotificationStack';
import NoticeCard from '../../components/feed/NoticeCard';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [startupNotices, setStartupNotices] = useState([]);
  const [showStartup, setShowStartup] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allRes, startupRes] = await Promise.all([
        api.get('/notices'),
        api.get('/notices/startup')
      ]);
      setNotices(allRes.data.notices);
      if (startupRes.data.length > 0) {
        setStartupNotices(startupRes.data);
        setShowStartup(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const myNotices = notices.filter(n => n.postedBy?._id === n.postedBy?._id); // Simple filter for demo

  return (
    <div className="min-h-screen bg-background text-white pb-32 md:pt-16">
      <Navbar title="Faculty Hub" />

      {showStartup && (
        <StartupNotificationStack
          notices={startupNotices}
          onSave={(id) => api.post('/read-later', { notice_id: id })}
          onDismiss={(id) => api.post('/dismiss', { notice_id: id })}
          onComplete={() => setShowStartup(false)}
        />
      )}
      
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">Faculty Central</h1>
              <p className="text-gray-500 font-medium tracking-[0.2em] text-[10px] uppercase">Departmental Intelligence & Broadcast</p>
           </div>
           <button onClick={() => navigate('/admin/notice/new')} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> Compose Notice
           </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
           <div className="premium-card bg-surface/40 hover:bg-surface/60 transition-all border-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-light">
                    <FileText size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black italic">{myNotices.length}</h3>
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Your Broadcasts</p>
                 </div>
              </div>
           </div>
           <div className="premium-card bg-surface/40 hover:bg-surface/60 transition-all border-white/5">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400">
                    <Zap size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black italic">420</h3>
                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Total Student Views</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Feed */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Live Department Feed</h3>
                 <button onClick={() => navigate('/student/feed')} className="text-[10px] font-black text-primary-light uppercase">User View</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {loading ? (
                    Array(4).fill(0).map((_, i) => <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />)
                 ) : (
                    notices.slice(0, 4).map(notice => (
                      <NoticeCard key={notice._id} notice={notice} onSave={() => {}} />
                    ))
                 )}
              </div>
           </div>

           {/* Sidebar Actions */}
           <div className="space-y-8">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-6 font-bold">Quick Workflow</h3>
                <div className="space-y-4">
                   <SidebarAction 
                     title="Post with AI" 
                     icon={<Zap size={18} />} 
                     link="/admin/notice/new" 
                     color="bg-primary/20 text-primary-light" 
                   />
                   <SidebarAction 
                     title="Manage History" 
                     icon={<FileText size={18} />} 
                     link="/admin/notices" 
                     color="bg-white/5 text-gray-400" 
                   />
                </div>
              </div>

              <div className="premium-card border-primary/20 bg-primary/5">
                 <h4 className="text-xs font-black uppercase text-primary-light mb-4">Critical Pending</h4>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-red-500" />
                       <span className="text-xs font-bold text-gray-300">End Semester Labs</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-red-500" />
                       <span className="text-xs font-bold text-gray-300">Internal Review Postponed</span>
                    </div>
                 </div>
                 <button className="w-full mt-6 py-2 text-[10px] font-black uppercase text-primary-light border border-primary/20 rounded-lg hover:bg-primary/10">Manage Alerts</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const SidebarAction = ({ title, icon, link, color }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(link)}
      className="w-full premium-card p-4 flex items-center justify-between group hover:border-primary/50"
    >
       <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
             {icon}
          </div>
          <span className="text-sm font-bold text-gray-200">{title}</span>
       </div>
       <ChevronRight size={16} className="text-gray-600 group-hover:text-primary-light transition-transform" />
    </button>
  );
};

export default FacultyDashboard;
