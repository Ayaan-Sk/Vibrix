import { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, List, ChevronLeft, 
  ChevronRight, Download, Filter, 
  Clock, MapPin, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axiosInstance';
import Navbar from '../components/layout/Navbar';

const CalendarPage = () => {
  const [view, setView] = useState('Month'); // Month or List
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/calendar', {
        params: {
          month: currentDate.getMonth() + 1,
          year: currentDate.getFullYear()
        }
      });
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/calendar/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'college-events.ics');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32 md:pt-16">
      <Navbar title="Academic Schedule" />
      
      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">Global Calendar</h1>
              <p className="text-gray-500 font-medium tracking-[0.2em] text-[10px] uppercase">Departmental & Collegiate Events</p>
           </div>
           <div className="flex gap-3">
              <div className="bg-white/5 rounded-2xl p-1 flex border border-white/5">
                 <button 
                   onClick={() => setView('Month')}
                   className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'Month' ? 'bg-primary text-white shadow-purple' : 'text-gray-500 hover:text-white'}`}
                 >
                   <CalendarIcon size={16} className="md:hidden" />
                   <span className="hidden md:inline">Month view</span>
                 </button>
                 <button 
                   onClick={() => setView('List')}
                   className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'List' ? 'bg-primary text-white shadow-purple' : 'text-gray-500 hover:text-white'}`}
                 >
                   <List size={16} className="md:hidden" />
                   <span className="hidden md:inline">List view</span>
                 </button>
              </div>
              <button 
                onClick={handleExport}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all shadow-xl hover:bg-white/10"
              >
                 <Download size={20} />
              </button>
           </div>
        </div>

        {/* Calendar Grid / List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Info */}
           <div className="lg:col-span-1 space-y-6">
              <div className="premium-card p-0 overflow-hidden bg-primary/5 border-primary/20">
                 <div className="p-6 bg-primary/10 border-b border-primary/10">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary-light">Current Date</h3>
                    <p className="text-3xl font-black italic mt-2">{currentDate.toLocaleString('default', { month: 'long' })}</p>
                    <p className="text-gray-500 font-bold text-sm tracking-widest">{currentDate.getFullYear()}</p>
                 </div>
                 <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-gray-500 font-bold uppercase">Total Events</span>
                       <span className="text-primary-light font-black">{events.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                       <span className="text-gray-500 font-bold uppercase">Work Days</span>
                       <span className="text-white font-black">22</span>
                    </div>
                 </div>
              </div>

              <div className="premium-card bg-surface/40">
                 <h4 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">Reminders</h4>
                 <div className="space-y-4">
                    <div className="flex gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-accent-pink mt-1" />
                       <p className="text-xs text-gray-300">Synchronize with Google Calendar for push alerts.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Content Area */}
           <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                 {view === 'Month' ? (
                   <motion.div 
                     key="month"
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.98 }}
                     className="premium-card p-0 overflow-hidden border-white/5 bg-white/[0.01]"
                   >
                     {/* Calendar Placeholder Grid */}
                     <div className="grid grid-cols-7 border-b border-white/10">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                           <div key={d} className="p-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-600 border-r border-white/5 last:border-0">{d}</div>
                        ))}
                     </div>
                     <div className="grid grid-cols-7 divide-x divide-y divide-white/5">
                        {Array(35).fill(0).map((_, i) => (
                           <div key={i} className="min-h-[100px] p-2 hover:bg-white/[0.02] transition-colors group">
                              <span className="text-[10px] font-bold text-gray-600 group-hover:text-gray-400">{i + 1}</span>
                              {i === 12 && (
                                <div className="mt-2 p-1 bg-primary/20 border border-primary/30 rounded text-[8px] font-bold text-primary-light uppercase tracking-tighter line-clamp-1">
                                   Cyber Security Con
                                </div>
                              )}
                              {i === 15 && (
                                <div className="mt-2 p-1 bg-accent-pink/20 border border-pink-500/30 rounded text-[8px] font-bold text-pink-400 uppercase tracking-tighter line-clamp-1">
                                   Internal Review
                                </div>
                              )}
                           </div>
                        ))}
                     </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="list"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-4"
                   >
                     {events.length === 0 ? (
                        <div className="premium-card text-center py-20 bg-white/[0.01]">
                           <CalendarIcon size={40} className="mx-auto text-gray-700 mb-4 opacity-20" />
                           <p className="text-gray-600 italic">No events scheduled for this period.</p>
                        </div>
                     ) : (
                       events.map(event => (
                         <div key={event._id} className="premium-card flex items-center gap-6 group hover:bg-white/[0.03]">
                            <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 min-w-[80px]">
                               <span className="text-[10px] font-black uppercase text-gray-500">{new Date(event.startDate).toLocaleString('default', { month: 'short' })}</span>
                               <span className="text-2xl font-black italic">{new Date(event.startDate).getDate()}</span>
                            </div>
                            <div className="flex-grow">
                               <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${event.urgency === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary-light'}`}>
                                    {event.urgency}
                                  </span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">{event.department}</span>
                               </div>
                               <h3 className="text-xl font-bold group-hover:text-primary-light transition-colors">{event.title}</h3>
                               <div className="flex items-center gap-4 mt-3 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                  <div className="flex items-center gap-1.5"><Clock size={12} /> {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                  <div className="flex items-center gap-1.5"><MapPin size={12} /> Hall {event.location || 'Main Auditorium'}</div>
                               </div>
                            </div>
                            <button className="p-3 text-gray-700 hover:text-white transition-colors">
                               <Bell size={20} />
                            </button>
                         </div>
                       ))
                     )}
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
