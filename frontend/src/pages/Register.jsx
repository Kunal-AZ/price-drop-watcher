import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Eye, EyeOff, CheckCircle, XCircle, Mail, Lock, User, ArrowRight } from 'lucide-react';
import logo from "../assets/logo.jpg"; // ✅ FIXED

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  // ✅ Password strength logic
  const getStrengthScore = (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthScore = getStrengthScore(form.password);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // ✅ Validation function
  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setErrors({});
      await googleLogin();
    } catch (err) {
      setErrors({ general: err.message || 'Google sign-in is unavailable' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FCFBF7] px-4 py-8 text-slate-800 sm:px-6">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[30%] h-[30%] bg-yellow-200/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] bg-orange-100/50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="rounded-[2rem] border border-yellow-100 bg-white p-6 shadow-[0_20px_50px_rgba(234,179,8,0.1)] sm:p-8 md:rounded-[2.5rem] md:p-12">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center items-center gap-2 mb-4">
              <img src={logo} alt="logo" className="h-12 w-auto object-contain" />
            </div>
            <span className="text-2xl font-bold text-black">BargainIt</span>
            <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Create your account</h1>
            <p className="text-slate-500 mt-2">Smart shopping starts with a click</p>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/30 py-3.5 rounded-2xl font-semibold mb-8"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center mb-8">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="px-4 text-xs text-slate-400 uppercase">or email</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <InputField name="name" placeholder="Full Name" value={form.name} onChange={handleChange} error={errors.name} icon={<User size={18} />} />

            <InputField name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} error={errors.email} icon={<Mail size={18} />} />

            {/* Password */}
            <div>
              <InputField
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock size={18} />}
                suffix={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              {/* Strength bar */}
              {form.password && (
                <div className="flex gap-1 mt-2 h-1.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${
                        i < strengthScore
                          ? strengthScore <= 1
                            ? 'bg-red-400'
                            : strengthScore <= 3
                            ? 'bg-yellow-400'
                            : 'bg-green-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            <InputField
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock size={18} />}
              suffix={
                form.confirmPassword &&
                (form.password === form.confirmPassword ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <XCircle size={18} className="text-red-400" />
                ))
              }
            />

            {/* General Error */}
            {errors.general && (
              <p className="text-red-500 text-sm text-center">{errors.general}</p>
            )}

            <button
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold bg-[#FFD700] hover:bg-[#F2CC00] text-black"
            >
              {loading ? 'Setting up...' : 'Start Saving Now'}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500">
            Already a user?{' '}
            <Link to="/login" className="text-yellow-600 font-bold underline">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

const InputField = ({ name, type = "text", placeholder, value, onChange, error, icon, suffix }) => (
  <div>
    <div className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${icon ? 'pl-12' : 'px-4'} ${suffix ? 'pr-12' : 'pr-4'} py-3.5 rounded-2xl bg-slate-50 border ${
          error ? 'border-red-300' : 'border-transparent'
        } focus:bg-white focus:border-yellow-400 outline-none`}
      />
      {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</span>}
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>}
  </div>
);

export default RegisterPage;
