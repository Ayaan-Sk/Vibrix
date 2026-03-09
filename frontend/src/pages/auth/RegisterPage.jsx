import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2, GraduationCap, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    academicYear: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Note: The Vibrix backend typically restricts open registration to admins, 
    // but this UI serves the requested frontend layout mockups.
    setTimeout(() => {
      setError('Registration is currently handled directly by campus administration.');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a] font-['Outfit'] overflow-hidden">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden bg-[#150e28]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
        <div className="z-10 text-center">
          <div className="inline-flex justify-center mb-6">
            <GraduationCap className="w-16 h-16 text-accent-pink" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-medium text-white mb-4">SmartCampus Connect</h1>
          <p className="text-gray-400 text-lg max-w-sm mx-auto">
            Join your campus digital notice board
          </p>
        </div>
      </div>

      {/* Right Panel - Form (Scrollable) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-sm my-auto py-8">
          
          <div className="mb-8 text-left">
            <h2 className="text-2xl font-medium text-white mb-1">Create Account</h2>
            <p className="text-gray-500 text-sm">Register to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 transition-all text-white text-sm placeholder:text-gray-700"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 transition-all text-white text-sm placeholder:text-gray-700"
                placeholder="you@university.edu"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-primary/50 transition-all text-white text-sm placeholder:text-gray-700"
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

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Role</label>
                  <select
                     value={formData.role}
                     onChange={(e) => setFormData({...formData, role: e.target.value})}
                     className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2.5 outline-none focus:border-primary/50 transition-all text-white text-sm appearance-none"
                  >
                     <option value="student" className="bg-[#150e28]">Student</option>
                     <option value="faculty" className="bg-[#150e28]">Faculty</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Department</label>
                  <select
                     value={formData.department}
                     onChange={(e) => setFormData({...formData, department: e.target.value})}
                     className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2.5 outline-none focus:border-primary/50 transition-all text-white text-sm appearance-none"
                  >
                     <option value="" className="bg-[#150e28]">Select</option>
                     <option value="CS" className="bg-[#150e28]">Computer Science</option>
                     <option value="ME" className="bg-[#150e28]">Mechanical</option>
                     <option value="EE" className="bg-[#150e28]">Electrical</option>
                  </select>
               </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">Academic Year</label>
              <select
                  value={formData.academicYear}
                  onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                  className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2.5 outline-none focus:border-primary/50 transition-all text-white text-sm appearance-none"
              >
                  <option value="" className="bg-[#150e28]">Select year</option>
                  <option value="1" className="bg-[#150e28]">First Year</option>
                  <option value="2" className="bg-[#150e28]">Second Year</option>
                  <option value="3" className="bg-[#150e28]">Third Year</option>
                  <option value="4" className="bg-[#150e28]">Fourth Year</option>
              </select>
            </div>

            {error && (
              <div className="text-red-500 text-xs text-center p-2 bg-red-500/10 rounded border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-4 bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus size={16} />
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500 text-xs">
            Already have an account? <Link to="/login" className="text-[#a855f7] hover:underline font-medium">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
