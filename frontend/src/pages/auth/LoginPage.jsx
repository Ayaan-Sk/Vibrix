import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, GraduationCap, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import api from '../../api/axiosInstance';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleTab, setRoleTab] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, data.token);
      
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/student/feed');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] font-['Outfit']">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden bg-[#150e28]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
        <div className="z-10 text-center">
          <div className="inline-flex justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-accent-pink" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-medium text-white mb-4">SmartCampus Connect</h1>
          <p className="text-gray-400 text-lg max-w-sm mx-auto">
            Your intelligent digital notice board platform
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-sm">
          
          <div className="mb-10 text-left">
            <h2 className="text-2xl font-medium text-white mb-2">Welcome back</h2>
            <p className="text-gray-500 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-lg border border-white/5 mb-6">
              {['student', 'faculty', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleTab(r)}
                  className={`flex-1 py-2 text-xs font-semibold capitalize rounded-md transition-all ${
                    roleTab === r 
                      ? 'bg-transparent text-[#b583ff] border border-primary/30 shadow-[0_0_10px_rgba(124,58,237,0.1)]' 
                      : 'text-gray-500 hover:text-gray-300 transparent border border-transparent'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary/50 transition-all text-white text-sm placeholder:text-gray-700"
                  placeholder="you@university.edu"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-primary/50 transition-all text-white text-sm placeholder:text-gray-700"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-xs text-center p-2 bg-red-500/10 rounded border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowRight size={16} />
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 text-xs">
            Don't have an account? <Link to="/register" className="text-[#a855f7] hover:underline font-medium">Sign up</Link>
          </p>

          <div className="mt-12 text-center text-xs text-gray-600">
            <Link to="/" className="hover:text-gray-400 flex items-center justify-center gap-1">
              <ArrowLeft size={12} /> Back to home
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
