import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import logo from "../assets/logo.jpg";
import { Button } from '../components/ui/button';
import { 
  TrendingDown, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Mail, 
  Lock 
} from 'lucide-react';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let err = {};
    if (!form.email) err.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Invalid email';
    if (!form.password) err.password = 'Password required';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch {
      setErrors({ general: 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FCFBF7] px-4 py-8 text-slate-800 selection:bg-yellow-200 sm:px-6">
      
      {/* Dynamic Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-yellow-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Branding */}
        <div className="flex justify-center items-center gap-3 mb-10">
           <img
                src={logo}
                alt="logo"
                className="h-12 w-auto object-contain mix-blend-multiply" 
              />
          <h1 className="text-3xl font-extrabold tracking-tight text-black">BargainIt</h1>
        </div>

        <div className="rounded-[2rem] border border-yellow-100/50 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(234,179,8,0.12)] sm:rounded-[2.5rem] sm:p-10">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Welcome Back</h2>
            <p className="text-slate-500 mt-2 font-medium">Continue your smart shopping journey.</p>
          </div>

          {/* General Error Alert */}
          {errors.general && (
            <div className="flex items-center gap-2 bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-semibold border border-red-100">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs font-semibold ml-2">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs font-semibold ml-2">{errors.password}</p>}
              <div className="text-right px-1">
                <Link to="/forgot" className="text-xs font-bold text-slate-400 hover:text-yellow-600">Forgot Password?</Link>
              </div>
            </div>

            {/* Login Button */}
            <Button
              disabled={loading}
              className="w-full h-14 bg-[#FFD700] hover:bg-[#F2CC00] text-black font-bold text-lg rounded-2xl shadow-lg shadow-yellow-500/20 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 group"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? 'Logging in...' : 'Sign In'}
                {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
              </div>
            </Button>
          </form>

          <p className="text-center mt-8 text-slate-500 font-medium">
            New here?{' '}
            <Link to="/register" className="text-yellow-600 hover:text-yellow-700 transition-colors font-bold underline underline-offset-4 decoration-yellow-300">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
