import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar as CalendarIcon, User, Search, Map, LayoutGrid, LogOut } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';

const Navbar = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-white/5 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Desktop Logo */}
        <div 
          onClick={() => navigate('/')} 
          className="hidden md:flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center shadow-purple rotate-3 group-hover:rotate-6 transition-transform">
             <span className="text-white font-black italic">V</span>
          </div>
          <span className="font-bold tracking-tighter text-lg group-hover:text-primary-light transition-colors">VIBRIX</span>
        </div>

        {/* Page Title (Mobile) */}
        <div className="md:hidden font-bold tracking-widest text-xs uppercase text-gray-400">
           {title || 'Vibrix'}
        </div>

        {/* Navigation Links */}
        <div className="flex flex-grow justify-around md:flex-grow-0 md:gap-8 items-center">
          <NavItem 
            icon={<Home size={20} />} 
            label="Feed" 
            active={location.pathname.includes('/student/feed')} 
            onClick={() => navigate('/student/feed')}
          />
          <NavItem 
            icon={<CalendarIcon size={20} />} 
            label="Calendar" 
            active={location.pathname === '/calendar'} 
            onClick={() => navigate('/calendar')}
          />
          <NavItem 
            icon={<User size={20} />} 
            label="Profile" 
            active={location.pathname === '/student/profile'} 
            onClick={() => navigate('/student/profile')}
          />
          {user?.role !== 'student' && (
            <NavItem 
              icon={<LayoutGrid size={20} />} 
              label="Dash" 
              active={location.pathname.includes('dashboard')} 
              onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : '/faculty/dashboard')}
            />
          )}
        </div>

        {/* Desktop User Menu */}
        <div className="hidden md:flex items-center gap-4">
           <button className="p-2 text-gray-500 hover:text-white transition-colors">
             <Search size={20} />
           </button>
           <div className="h-8 w-px bg-white/10" />
           <div className="flex items-center gap-3 pl-2">
             <div className="text-right">
                <p className="text-xs font-bold text-white leading-none mb-1">{user?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{user?.role}</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-purple p-px">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-xs font-bold">
                   {user?.name?.[0]}
                </div>
             </div>
           </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1 rounded-xl transition-all ${
      active ? 'text-primary-light' : 'text-gray-500 hover:text-gray-300'
    }`}
  >
    {icon}
    <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest md:normal-case md:tracking-normal">{label}</span>
  </button>
);

export default Navbar;
