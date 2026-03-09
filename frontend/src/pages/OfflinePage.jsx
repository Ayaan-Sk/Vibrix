import { WifiOff, ShieldCheck, RefreshCw, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const OfflinePage = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    navigate('/student/feed');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 fade-in">
       {/* Aesthetic Gradient Ring */}
       <div className="relative mb-12">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse-slow" />
          <div className="relative w-32 h-32 rounded-full border-2 border-white/10 flex items-center justify-center">
             <WifiOff size={48} className="text-gray-600" />
          </div>
       </div>

       <h1 className="text-4xl font-black italic tracking-tighter text-white mb-4 uppercase">Disconnect Initiated</h1>
       <p className="text-gray-500 text-center max-w-xs mb-10 text-sm leading-relaxed">
         You are currently offline. Vibrix has localized your critical notices for emergency access.
       </p>

       <div className="w-full max-w-sm space-y-4">
          <div className="premium-card bg-primary/5 border-primary/20 flex items-center gap-4">
             <div className="p-2 bg-primary/10 rounded-xl text-primary-light">
                <ShieldCheck size={20} />
             </div>
             <div>
                <p className="text-xs font-bold text-white">Local Cache Active</p>
                <p className="text-[10px] text-gray-500 uppercase font-black">Showing saved data from 2h ago</p>
             </div>
          </div>

          <button 
            onClick={() => navigate('/student/feed')}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-sm"
          >
             <ChevronLeft size={18} /> Enter Offline Hub
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
             <RefreshCw size={14} /> Force Sync Attempt
          </button>
       </div>

       <div className="fixed bottom-10 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">Protocol: Local-Only</span>
       </div>
    </div>
  );
};

export default OfflinePage;
