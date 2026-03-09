import { useNavigate } from 'react-router-dom';
import { Sparkles, Bell, Shield, Search, Users, Globe, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0a14] text-white font-['Outfit'] overflow-hidden selection:bg-accent-pink/30">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none opacity-50"></div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-300 mb-8 animate-fade-in">
          <Sparkles className="text-secondary-light" size={14} />
          <span>AI-Powered Campus Communication</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-medium tracking-tight mb-6">
          Smart Notice <br />
          <span className="text-accent-pink font-light tracking-normal">Hub</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Replace outdated physical notice boards with an intelligent digital platform.
          AI-powered summaries, real-time delivery, and personalized feeds for every student.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto px-8 py-3.5 bg-accent-pink hover:bg-pink-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Get Started <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 hover:bg-white/5 text-white font-semibold rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Small Feature Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <FeatureCard 
          icon={<Bell size={24} className="text-primary-light" />}
          title="Real-Time Notices"
          desc="Instant delivery to relevant students"
        />
        <FeatureCard 
          icon={<Sparkles size={24} className="text-accent-pink" />}
          title="AI Summaries"
          desc="Auto-extract dates & key info"
        />
        <FeatureCard 
          icon={<Shield size={24} className="text-primary-light" />}
          title="Role-Based Access"
          desc="Secure, targeted distribution"
        />
      </div>

      {/* Expanded Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
         <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 bg-accent-pink/10 rounded-xl flex items-center justify-center mb-6">
               <Search className="text-accent-pink" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-3">Smart Search</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
               Powerful search and filtering by category, department, date range, and keywords across all notices.
            </p>
         </div>
         <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 bg-accent-pink/10 rounded-xl flex items-center justify-center mb-6">
               <Users className="text-accent-pink" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-3">Role-Based Access</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
               Secure access for admins, faculty, and students with granular permissions and personalized feeds.
            </p>
         </div>
         <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors">
            <div className="w-12 h-12 bg-accent-pink/10 rounded-xl flex items-center justify-center mb-6">
               <Globe className="text-accent-pink" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-3">Unified Web Platform</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
               Access the smart notice board from any modern web browser with our fully responsive, accessible web application.
            </p>
         </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 relative z-10 mt-10 border-t border-white/5 bg-gradient-to-b from-transparent to-[#0a0710]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-medium mb-6">Ready to Modernize Your Campus?</h2>
          <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
            Join institutions already using Smart Notice Hub to streamline campus communication.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 bg-accent-pink hover:bg-pink-600 text-white font-semibold rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            Start Free <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-[#0a0710] relative z-10 text-sm text-gray-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-bold text-gray-300">Smart Notice Hub</div>
          <div>© 2026 Smart Notice Hub. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center hover:bg-white/[0.04] transition-colors">
    <div className="mb-4">{icon}</div>
    <h3 className="text-sm font-bold text-gray-200 mb-2">{title}</h3>
    <p className="text-xs text-gray-500">{desc}</p>
  </div>
);

export default LandingPage;
