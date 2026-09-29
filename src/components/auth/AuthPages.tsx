import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Gamepad2, Sparkles, ArrowRight, Lock, Mail, User as UserIcon, Check } from 'lucide-react';
import { DEMO_USERS } from '../../data/demoData';
import { BrandPlayLogo } from '../common/BrandPlayLogo';

interface AuthProps {
  mode: 'login' | 'register';
}

export const AuthPages: React.FC<AuthProps> = ({ mode }) => {
  const { login, register, navigateTo, showToast } = useApp();

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('brand_owner');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (!email) {
        showToast('Please enter an email address.', 'error');
        return;
      }
      const success = login(email, password);
      if (success) {
        navigateTo('dashboard');
      }
    } else {
      if (!name || !email || !password) {
        showToast('Please fill out all required fields.', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }
      const success = register(name, email, password, role);
      if (success) {
        navigateTo('dashboard');
      }
    }
  };

  const handleDemoLogin = (demoUser: typeof DEMO_USERS[0]) => {
    login(demoUser.email);
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-950">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8 flex flex-col items-center">
          <BrandPlayLogo
            size="lg"
            showTagline={false}
            onClick={() => navigateTo('home')}
            className="mb-3"
          />

          <h2 className="text-2xl font-black text-white">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Enter your credentials to manage your branded games'
              : 'Join BrandPlay to start creating branded interactive games'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Quick Demo Logins for Research Evaluation */}
          <div className="mb-6 p-3.5 bg-slate-950/80 border border-blue-500/30 rounded-xl">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-2">
              ⚡ Instant Evaluation Logins (Gayan & Ravindu)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleDemoLogin(u)}
                  className="px-2 py-2 rounded-lg bg-slate-900 hover:bg-blue-950/60 border border-slate-800 hover:border-blue-500/50 text-[11px] text-slate-300 font-medium text-center transition flex flex-col items-center gap-0.5"
                >
                  <span className="font-bold text-white truncate w-full">{u.name.split(' ')[0]}</span>
                  <span className="text-[9px] text-blue-400 capitalize">
                    {u.role === 'brand_owner' ? 'Gayan (SME)' : u.role === 'marketing_pro' ? 'Ravindu (Pro)' : 'Admin'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Or with credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gayan Lakmal"
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="gayan.lakmal@brandplay.io"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    User Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('brand_owner')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                        role === 'brand_owner'
                          ? 'bg-blue-950/60 border-blue-500 text-blue-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white">Brand / SME Owner</div>
                        <div className="text-[10px] text-slate-400">e.g. Gayan Lakmal</div>
                      </div>
                      {role === 'brand_owner' && <Check className="w-4 h-4 text-blue-400" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('marketing_pro')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between ${
                        role === 'marketing_pro'
                          ? 'bg-blue-950/60 border-blue-500 text-blue-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white">Marketing Pro</div>
                        <div className="text-[10px] text-slate-400">e.g. Ravindu Sandaruwan</div>
                      </div>
                      {role === 'marketing_pro' && <Check className="w-4 h-4 text-blue-400" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                />
                <label htmlFor="remember" className="ml-2 text-xs text-slate-400 cursor-pointer">
                  Remember me for 30 days
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {mode === 'login' ? 'Login to Dashboard' : 'Create Account'}
            </button>
          </form>

          {/* Toggle link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {mode === 'login' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => navigateTo('register')}
                  className="text-blue-400 font-bold hover:underline"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  onClick={() => navigateTo('login')}
                  className="text-blue-400 font-bold hover:underline"
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold text-white mb-2">Reset Password</h3>
              <p className="text-xs text-slate-400 mb-4">
                Enter your registered email address and we will generate a password reset link.
              </p>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white mb-4"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    showToast('Password reset link sent to ' + (forgotEmail || 'your email'));
                    setShowForgotModal(false);
                  }}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold text-white"
                >
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
