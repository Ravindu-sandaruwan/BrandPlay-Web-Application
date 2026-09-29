import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Gamepad2, Sparkles, UserCircle, LogOut, ChevronDown, PlusCircle, Sun, Moon } from 'lucide-react';
import { UserRole } from '../../types';
import { BrandPlayLogo } from './BrandPlayLogo';

export const Navbar: React.FC = () => {
  const { currentUser, navigateTo, logout, switchUserRole, theme, toggleTheme } = useApp();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <BrandPlayLogo
          size="md"
          showTagline={true}
          taglineText="Customizable Brand Games"
          allowCustomUpload={true}
          onClick={() => navigateTo('home')}
        />

        {/* Center Links (when on landing or logged in) */}
        {!currentUser ? (
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-blue-600 dark:hover:text-white transition"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('template-library-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-blue-600 dark:hover:text-white transition"
            >
              Game Templates
            </button>
            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-blue-600 dark:hover:text-white transition"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                navigateTo('home');
                setTimeout(() => {
                  document.getElementById('roi-calculator-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="hover:text-blue-600 dark:hover:text-white transition"
            >
              ROI Calculator
            </button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-5">
            <button
              onClick={() => navigateTo('home')}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigateTo('my-games')}
              className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition"
            >
              My Games
            </button>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Profile:</span>
              <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5">
                {(['brand_owner', 'marketing_pro', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchUserRole(r)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                      currentUser.role === r
                        ? 'bg-blue-600 text-white shadow shadow-blue-600/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {r === 'brand_owner' ? 'Gayan (SME)' : r === 'marketing_pro' ? 'Ravindu (Marketer)' : 'Admin'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Action buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-slate-700 transition"
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {!currentUser ? (
            <>
              <button
                onClick={() => navigateTo('login')}
                className="px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigateTo('register')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-md shadow-blue-600/25 transition active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-white" /> Get Started
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('create-game')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow shadow-blue-600/30"
              >
                <PlusCircle className="w-4 h-4 text-white" /> Create Game
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition"
                >
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{currentUser.name}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium capitalize">
                      {currentUser.role.replace('_', ' ')}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-fadeIn text-slate-800 dark:text-slate-200">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800/80">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300">
                        {currentUser.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          navigateTo('dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white flex items-center gap-2"
                      >
                        <UserCircle className="w-4 h-4 text-blue-500" /> Dashboard Overview
                      </button>
                    </div>

                    <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase">Switch Role</span>
                      {(['brand_owner', 'marketing_pro', 'admin'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchUserRole(r);
                            setProfileDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 text-xs rounded transition flex items-center justify-between ${
                            currentUser.role === r
                              ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          <span className="capitalize">{r === 'brand_owner' ? 'Gayan Lakmal (SME)' : r === 'marketing_pro' ? 'Ravindu Sandaruwan (Pro)' : 'Administrator'}</span>
                          {currentUser.role === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-1 border-t border-slate-200 dark:border-slate-800/80">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
