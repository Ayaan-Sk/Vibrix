import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Users, Bell, Zap, Plus, 
  Settings, Calendar as CalendarIcon, ArrowRight,
  BarChart3, TrendingUp, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import Navbar from '../../components/layout/Navbar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNotices: 0,
    activeNotices: 0,
    totalUsers: 0,
    activeStartup: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // In a real app, these would come from a tailored stats endpoint
      const [noticesRes, usersRes] = await Promise.all([
        api.get('/notices'),
        api.get('/users')
      ]);
      
      setStats({
        totalNotices: noticesRes.data.total,
        activeNotices: noticesRes.data.notices.length,
        totalUsers: usersRes.data.length,
        activeStartup: noticesRes.data.notices.filter(n => n.isStartupNotification).length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    { title: 'Post Notice', icon: <Plus size={20} />, color: 'bg-primary', link: '/admin/notice/new' },
    { title: 'Manage Users', icon: <Users size={20} />, color: 'bg-accent-blue', link: '/admin/users' },
    { title: 'Calendar', icon: <CalendarIcon size={20} />, color: 'bg-secondary', link: '/calendar' },
  ];

  return (
    <div className="min-h-screen bg-background text-white pb-32 md:pt-16">
      <Navbar title="Admin Panel" />
      
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-bold italic tracking-tighter mb-2">DASHBOARD</h1>
              <p className="text-gray-500 font-medium tracking-[0.2em] text-[10px] uppercase">College Administrative Control</p>
           </div>
           <div className="flex gap-3">
              <button onClick={() => navigate('/admin/notice/new')} className="btn-primary flex items-center gap-2">
                 <Plus size={18} /> New Notice
              </button>
           </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <StatCard label="Total Notices" value={stats.totalNotices} icon={<FileText />} trend="+12% this week" />
           <StatCard label="Live Notices" value={stats.activeNotices} icon={<Zap />} color="border-green-500/20" />
           <StatCard label="Registered Users" value={stats.totalUsers} icon={<Users />} color="border-accent-blue/20" />
           <StatCard label="Active Alerts" value={stats.activeStartup} icon={<Bell />} color="border-primary/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Quick Actions */}
           <div className="lg:col-span-1 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Quick Access</h3>
              <div className="grid grid-cols-1 gap-4">
                 {actions.map(action => (
                   <button 
                     key={action.title}
                     onClick={() => navigate(action.link)}
                     className="premium-card p-5 group flex items-center justify-between hover:scale-[1.02]"
                   >
                     <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-2xl ${action.color} shadow-lg shadow-black/20`}>
                         {action.icon}
                       </div>
                       <span className="font-bold text-lg">{action.title}</span>
                     </div>
                     <ArrowRight size={20} className="text-gray-600 group-hover:text-primary-light transition-colors" />
                   </button>
                 ))}
              </div>
           </div>

           {/* Activity Log (Placeholder) */}
           <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Recent Activity</h3>
                <button 
                  onClick={() => navigate('/admin/notices')}
                  className="text-[10px] font-black text-primary-light uppercase tracking-widest hover:underline"
                >
                  View All History
                </button>
              </div>

              <div className="premium-card bg-white/[0.01] divide-y divide-white/5 p-0 overflow-hidden">
                 {[1, 2, 3, 4].map(i => (
                   <div key={i} className="p-5 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                         <Clock size={16} />
                      </div>
                      <div className="flex-grow">
                         <p className="text-sm font-semibold text-gray-200">System generated a new notice summary for #ID-{3420 + i}</p>
                         <p className="text-[10px] text-gray-600 uppercase font-black mt-1">2 hours ago • AI Pipeline</p>
                      </div>
                      <div className="flex gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color = "border-white/5", trend }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`premium-card p-6 border ${color} hover:bg-white/[0.03] transition-all`}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white/10 rounded-xl text-gray-400">
        {icon}
      </div>
      {trend && <span className="text-[10px] text-green-500 font-bold uppercase">{trend}</span>}
    </div>
    <p className="text-3xl font-black italic tracking-tighter mb-1">{value || '0'}</p>
    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{label}</p>
  </motion.div>
);

export default AdminDashboard;
