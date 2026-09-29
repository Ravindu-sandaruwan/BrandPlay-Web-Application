import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Home,
  LayoutDashboard,
  Building2,
  Gamepad2,
  Trophy,
  PlusCircle,
  BarChart3,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeView, navigateTo, currentUser, brands, games, theme, setTheme } = useApp();

  const navItems: Array<{
    view: AppView;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    adminOnly?: boolean;
    highlight?: boolean;
  }> = [
    {
      view: 'home',
      label: 'Home Page',
      icon: <Home className="w-4 h-4" />,
    },
    {
      view: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      view: 'brands',
      label: 'My Brands',
      icon: <Building2 className="w-4 h-4" />,
      badge: brands.length.toString(),
    },
    {
      view: 'templates',
      label: 'Game Templates',
      icon: <Gamepad2 className="w-4 h-4" />,
      badge: '3 Ready',
    },
    {
      view: 'my-games',
      label: 'My Games',
      icon: <Trophy className="w-4 h-4" />,
      badge: games.length.toString(),
    },
    {
      view: 'create-game',
      label: 'Create Game',
      icon: <PlusCircle className="w-4 h-4" />,
      highlight: true,
    },
    {
      view: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      view: 'admin',
      label: 'Admin Control',
      icon: <ShieldCheck className="w-4 h-4" />,
      adminOnly: true,
    },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between min-h-[calc(100vh-4rem)] p-4 select-none transition-colors duration-200">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Platform Navigation
          </div>
          {navItems.map((item) => {
            if (item.adminOnly && currentUser?.role !== 'admin') return null;

            const isActive = activeView === item.view;

            if (item.highlight) {
              return (
                <button
                  key={item.view}
                  onClick={() => navigateTo(item.view)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition duration-200 mt-2 mb-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-600/25'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                </button>
              );
            }

            return (
              <button
                key={item.view}
                onClick={() => navigateTo(item.view)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-slate-300 dark:border-blue-500/40 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick info / Research note */}
        <div className="p-3 bg-blue-50/60 dark:bg-gradient-to-br dark:from-blue-950/40 dark:to-slate-900/60 border border-blue-200/80 dark:border-blue-900/40 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>No-Code Game Studio</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Create, brand, customize mechanics, and export self-contained HTML5 games in minutes.
          </p>
        </div>
      </div>

      {/* Bottom Area: Appearance Theme Selector & Profile */}
      <div className="space-y-3 pt-3">
        {/* Theme Selector segmented control */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1">
            <span>Appearance</span>
            <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">{theme}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                theme === 'light'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                theme === 'dark'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Profile summary */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/40 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser?.name?.slice(0, 1) || 'U'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 capitalize truncate">
                {currentUser?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('home')}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            title="Public Home Page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
