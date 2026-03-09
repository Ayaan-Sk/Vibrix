import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import api from '../../api/axiosInstance';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      
      // Redirect based on role
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'faculty') navigate('/faculty/dashboard');
      else navigate('/student/feed');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Premium Background Blurs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-pulse-slow"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-purple shadow-purple-lg mb-6 animate-float">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-2">VIBRIX</h1>
          <p className="text-gray-400 text-lg">Smart Notice Board Ecosystem</p>
        </div>

        <form onSubmit={handleSubmit} className="premium-card space-y-6 bg-white/[0.02] backdrop-blur-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-white placeholder:text-gray-600"
                placeholder="name@college.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 transition-all text-white placeholder:text-gray-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Sign In
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Protected by role-based academic security.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
