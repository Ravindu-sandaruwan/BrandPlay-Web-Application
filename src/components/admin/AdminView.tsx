import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  Gamepad2,
  Server,
  Layers,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Plus,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { users, templates, brands, games, showToast } = useApp();
  const [templateStatus, setTemplateStatus] = useState<Record<string, boolean>>({
    'endless-runner': true,
    'coin-collector': true,
    'quiz-game': true,
  });

  const toggleTemplate = (id: string) => {
    setTemplateStatus((prev) => {
      const next = !prev[id];
      showToast(`Template ${id} ${next ? 'enabled' : 'disabled'} platform-wide.`);
      return { ...prev, [id]: next };
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-2 border border-rose-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Administrator Control Suite</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Platform Administration</h1>
          <p className="text-xs text-slate-400 mt-1">
            System health, template configuration, registered users, and research testbench management
          </p>
        </div>
      </div>

      {/* Platform Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Users</span>
          <span className="text-2xl font-black text-white">{users.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Active accounts</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Brands</span>
          <span className="text-2xl font-black text-white">{brands.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">Profiles registered</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">System Games</span>
          <span className="text-2xl font-black text-white">{games.length}</span>
          <span className="text-[11px] text-slate-500 mt-1 block">In database</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Canvas Engines</span>
          <span className="text-2xl font-black text-emerald-400">{templates.length} Active</span>
          <span className="text-[11px] text-slate-500 mt-1 block">100% Operational</span>
        </div>
      </div>

      {/* Templates Control */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
          System Game Templates
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Toggle availability of HTML5 game mechanics across user studios
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((tmpl) => {
            const isEnabled = templateStatus[tmpl.id] !== false;
            return (
              <div
                key={tmpl.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{tmpl.name}</h4>
                  <span className="text-[10px] text-slate-500 uppercase">{tmpl.genre}</span>
                </div>

                <button
                  onClick={() => toggleTemplate(tmpl.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold"
                >
                  {isEnabled ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ToggleRight className="w-6 h-6" /> Enabled
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <ToggleLeft className="w-6 h-6" /> Disabled
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users Management Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Registered Users ({users.length})
          </h3>
          <span className="text-xs text-slate-400">Role-based access enforcement</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-850/40 transition">
                  <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[10px]">
                      {u.name.slice(0, 1)}
                    </div>
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        u.role === 'admin'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : u.role === 'marketing_pro'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{u.company || 'Brand Owner SME'}</td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
