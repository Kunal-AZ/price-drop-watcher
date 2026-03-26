import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.jpg";
import { Button } from '../components/ui/button';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Add your Firebase/Auth logic here
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FCFBF7] px-4 py-8 text-slate-800 sm:px-6">
      
      {/* Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-yellow-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[2rem] border border-yellow-100/50 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(234,179,8,0.12)] sm:rounded-[2.5rem] sm:p-10">
          
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              <img src={logo} alt="logo" className="h-12 w-auto object-contain mix-blend-multiply" />
            </div>
            <h1 className="mb-1 text-3xl font-black tracking-tight text-black sm:text-4xl">BargainIt</h1>
          </div>

          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Forgot Password?</h2>
                <p className="text-slate-500 mt-2 font-medium">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/10 outline-none transition-all text-slate-800"
                    />
                  </div>
                </div>

                <Button
                  disabled={loading}
                  className="w-full h-14 bg-[#FFD700] hover:bg-[#F2CC00] text-black font-bold text-lg rounded-2xl shadow-lg shadow-yellow-500/10 transition-all active:scale-[0.98] group"
                >
                  <div className="flex items-center justify-center gap-2">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                    {!loading && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </div>
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={40} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Check your email</h2>
              <p className="text-slate-500 mt-3 font-medium">
                We've sent a password reset link to <br />
                <span className="text-slate-900 font-semibold">{email}</span>
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 text-yellow-600 font-bold hover:underline underline-offset-4"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-10 pt-6 border-t border-slate-50 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 hover:text-black font-semibold transition-colors">
              <ArrowLeft size={18} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
