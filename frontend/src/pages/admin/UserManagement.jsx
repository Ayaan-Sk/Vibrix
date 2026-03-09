import { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Search, 
  Trash2, Mail, Shield, 
  MapPin, Loader2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axiosInstance';
import Navbar from '../../components/layout/Navbar';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'CS'
  });

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users', { params: { search } });
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      setShowModal(false);
      fetchUsers();
      setNewUser({ name: '', email: '', password: '', role: 'student', department: 'CS' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create user');
    }
  };

  const updateRole = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id, currentIsActive) => {
    try {
      await api.put(`/users/${id}`, { isActive: !currentIsActive });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pb-32 md:pt-16">
      <Navbar title="Core Personnel" />
      
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">Personnel Registry</h1>
              <p className="text-gray-500 font-medium tracking-[0.2em] text-[10px] uppercase">Control access and roles across the ecosystem</p>
           </div>
           <button 
             onClick={() => setShowModal(true)}
             className="btn-primary flex items-center gap-2"
           >
              <UserPlus size={18} /> Add User
           </button>
        </div>

        {/* Action Bar */}
        <div className="premium-card p-4 flex gap-4 mb-8 bg-white/[0.02]">
           <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Find users by name or email..."
                className="w-full bg-background border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-primary/50 transition-all"
              />
           </div>
        </div>

        {/* User List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {loading ? (
             Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
             ))
           ) : (
             users.map(u => (
               <motion.div 
                 key={u._id}
                 layout
                 className="premium-card bg-white/[0.01] hover:bg-white/[0.03] transition-all group"
               >
                 <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-gradient-purple p-0.5">
                          <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center font-bold text-white uppercase italic">
                             {u.name[0]}
                          </div>
                       </div>
                       <div>
                          <h4 className="font-bold text-white group-hover:text-primary-light transition-colors">{u.name}</h4>
                          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] uppercase font-bold tracking-tighter mt-0.5">
                             <Mail size={10} /> {u.email}
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => toggleStatus(u._id, u.isActive)}
                      className={`w-2 h-2 rounded-full ${u.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} 
                    />
                 </div>

                 <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="flex-grow">
                       <select 
                         value={u.role}
                         onChange={(e) => updateRole(u._id, e.target.value)}
                         className="bg-transparent text-[10px] font-black uppercase tracking-widest text-primary-light outline-none cursor-pointer"
                       >
                         <option value="student" className="bg-surface text-white">Student Account</option>
                         <option value="faculty" className="bg-surface text-white">Faculty Access</option>
                         <option value="admin" className="bg-surface text-white">Full Admin</option>
                       </select>
                       <p className="text-[10px] text-gray-600 uppercase font-black mt-1">Role Permission</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{u.department}</p>
                       <p className="text-[10px] text-gray-600 uppercase font-black mt-1">Department</p>
                    </div>
                 </div>
               </motion.div>
             ))
           )}
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
         {showModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-surface w-full max-w-lg rounded-3xl p-8 border border-white/10 shadow-purple-lg"
              >
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">Invite New User</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
                       <X size={20} />
                    </button>
                 </div>

                 <form onSubmit={handleCreate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="col-span-2">
                          <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block">Full Name</label>
                          <input 
                            required
                            value={newUser.name}
                            onChange={e => setNewUser({...newUser, name: e.target.value})}
                            className="w-full bg-background border border-white/5 rounded-xl p-3 outline-none focus:border-primary/50 text-sm"
                            placeholder="John Doe"
                          />
                       </div>
                       <div className="col-span-2">
                          <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block">Email Address</label>
                          <input 
                            required
                            value={newUser.email}
                            onChange={e => setNewUser({...newUser, email: e.target.value})}
                            className="w-full bg-background border border-white/5 rounded-xl p-3 outline-none focus:border-primary/50 text-sm"
                            placeholder="john@college.edu"
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block">Initial Role</label>
                          <select 
                            value={newUser.role}
                            onChange={e => setNewUser({...newUser, role: e.target.value})}
                            className="w-full bg-background border border-white/5 rounded-xl p-3 outline-none text-sm"
                          >
                             <option value="student">Student</option>
                             <option value="faculty">Faculty</option>
                             <option value="admin">Admin</option>
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block">Department</label>
                          <select 
                            value={newUser.department}
                            onChange={e => setNewUser({...newUser, department: e.target.value})}
                            className="w-full bg-background border border-white/5 rounded-xl p-3 outline-none text-sm"
                          >
                             <option value="ALL">ALL</option>
                             <option value="CS">CS</option>
                             <option value="ME">ME</option>
                          </select>
                       </div>
                       <div className="col-span-2">
                          <label className="text-[10px] font-black uppercase text-gray-500 mb-2 block">Temporary Password</label>
                          <input 
                            required
                            value={newUser.password}
                            onChange={e => setNewUser({...newUser, password: e.target.value})}
                            type="password"
                            className="w-full bg-background border border-white/5 rounded-xl p-3 outline-none focus:border-primary/50 text-sm"
                            placeholder="••••••••"
                          />
                       </div>
                    </div>

                    <button className="w-full btn-primary py-4 font-black uppercase tracking-widest text-sm shadow-purple-lg mt-4">
                       Grant System Access
                    </button>
                 </form>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement;
