import { useState, useEffect } from 'react';
import { 
  Search, Filter, MoreHorizontal, 
  Trash2, Edit, Pin, Bell, Eye,
  Plus, ChevronLeft, ChevronRight,
  TrendingDown, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import Navbar from '../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';

const ManageNotices = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    dept: '',
    urgency: ''
  });

  useEffect(() => {
    fetchNotices();
  }, [page, filters, search]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/notices', { 
        params: { ...filters, search, page, limit: 10 } 
      });
      setNotices(data.notices);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePin = async (id) => {
    try {
      await api.post(`/notices/${id}/toggle-pin`);
      fetchNotices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32 md:pt-16">
      <Navbar title="Manage Board" />
      
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">Broadcast History</h1>
              <p className="text-gray-500 font-medium tracking-[0.2em] text-[10px] uppercase">Review and archive posted notices</p>
           </div>
           <button onClick={() => navigate('/admin/notice/new')} className="btn-primary flex items-center gap-2">
              <Plus size={18} /> New Broadcast
           </button>
        </div>

        {/* Filters & Search */}
        <div className="premium-card p-4 flex flex-col md:flex-row gap-4 mb-8 bg-white/[0.02]">
           <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or content..."
                className="w-full bg-background border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-primary/50 transition-all"
              />
           </div>
           <select 
             className="bg-background border border-white/5 rounded-xl px-4 py-3 text-sm outline-none text-gray-400"
             onChange={e => setFilters({...filters, dept: e.target.value})}
           >
             <option value="">All Departments</option>
             <option value="CS">Computer Science</option>
             <option value="ME">Mechanical</option>
           </select>
           <select 
             className="bg-background border border-white/5 rounded-xl px-4 py-3 text-sm outline-none text-gray-400"
             onChange={e => setFilters({...filters, urgency: e.target.value})}
           >
             <option value="">Any Urgency</option>
             <option value="critical">Critical</option>
             <option value="normal">Normal</option>
             <option value="low">Low</option>
           </select>
        </div>

        {/* Desktop Table View */}
        <div className="premium-card p-0 overflow-hidden bg-white/[0.01]">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Notice Info</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Target</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                         <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-white/5 rounded w-1/2" /></td>
                      </tr>
                    ))
                 ) : notices.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="px-6 py-20 text-center text-gray-600 italic">No notices matching criteria</td>
                   </tr>
                 ) : (
                   notices.map(notice => (
                     <tr key={notice._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-lg ${notice.urgency === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary-light'}`}>
                                 <FileIcon size={18} />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-gray-100 group-hover:text-primary-light transition-colors line-clamp-1">{notice.title || notice.heading}</p>
                                 <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Posted by {notice.postedBy?.name}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <span className="text-[10px] font-black tracking-widest uppercase py-1 px-2 rounded bg-white/5 border border-white/10 text-gray-500">
                             {notice.department}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                           <p className="text-xs text-gray-400 font-bold">{new Date(notice.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-2">
                              {notice.isPinned && <Pin size={12} className="text-accent-pink" />}
                              {notice.isStartupNotification && <Bell size={12} className="text-primary-light" />}
                              <span className={`text-[9px] font-black uppercase tracking-widest ${notice.isDraft ? 'text-yellow-500' : 'text-green-500'}`}>
                                 {notice.isDraft ? 'Draft' : 'Live'}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => navigate(`/student/notice/${notice._id}`)}
                                className="p-2 text-gray-600 hover:text-white transition-colors"
                              >
                                 <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => togglePin(notice._id)}
                                className={`p-2 transition-colors ${notice.isPinned ? 'text-accent-pink' : 'text-gray-600 hover:text-pink-400'}`}
                              >
                                 <Pin size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(notice._id)}
                                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                              >
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))
                 )}
              </tbody>
           </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-between">
           <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Showing {notices.length} of {total} broadcast entries</p>
           <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white disabled:opacity-20"
              >
                 <ChevronLeft size={20} />
              </button>
              <button 
                disabled={page * 10 >= total}
                onClick={() => setPage(page + 1)}
                className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white disabled:opacity-20"
              >
                 <ChevronRight size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const FileIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;

export default ManageNotices;
