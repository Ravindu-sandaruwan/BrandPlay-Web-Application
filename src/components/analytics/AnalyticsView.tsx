import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Trophy,
  Gamepad2,
  Users,
  Calendar,
  FileDown,
  Sparkles,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { games, brands, getAnalyticsSummary, showToast } = useApp();
  const summary = getAnalyticsSummary();

  const handleExportCSV = () => {
    const headers = ['Game Name', 'Brand', 'Template', 'Status', 'Plays', 'Downloads', 'Average Score', 'High Score'];
    const rows = games.map((g) => {
      const brand = brands.find((b) => b.id === g.brandId)?.brandName || 'N/A';
      return [
        `"${g.gameName}"`,
        `"${brand}"`,
        `"${g.templateId}"`,
        `"${g.status}"`,
        g.plays,
        g.downloads,
        g.averageScore,
        g.highScore,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brandplay-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Analytics CSV report exported successfully!');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Performance Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time player engagement metrics, completions, and campaign ROI
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
        >
          <FileDown className="w-4 h-4 text-blue-400" /> Export CSV Report
        </button>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Game Plays</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{summary.totalPlays.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +24%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Customer sessions launched</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total HTML5 Downloads</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{summary.totalDownloads}</span>
            <span className="text-xs font-bold text-sky-400 flex items-center gap-0.5">
              <Download className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Standalone packages exported</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Average Player Score</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{summary.averageScore}</span>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
              <Trophy className="w-3.5 h-3.5" /> pts
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Across all template types</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Active Branded Games</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{summary.publishedGames} / {summary.totalGames}</span>
            <span className="text-xs font-bold text-blue-400">
              {Math.round((summary.publishedGames / Math.max(1, summary.totalGames)) * 100)}% live
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">Published publicly</span>
        </div>
      </div>

      {/* Visual Activity & Template Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plays Over Time Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Gameplay Sessions & Conversions
              </h3>
              <p className="text-xs text-slate-400">Daily trend over the past 7 days</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>Plays</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Vouchers Unlocked</span>
              </div>
            </div>
          </div>

          <div className="h-52 w-full flex items-end gap-3 pt-6 pb-2 px-2">
            {summary.playsHistory.map((item, idx) => {
              const maxVal = Math.max(...summary.playsHistory.map((p) => p.plays), 100);
              const playHeight = Math.max(12, (item.plays / maxVal) * 100);
              const compHeight = Math.max(8, (item.completions / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1">
                    <div
                      className="w-1/2 bg-blue-600 rounded-t-md transition-all duration-300 group-hover:brightness-125"
                      style={{ height: `${playHeight}%` }}
                      title={`Plays: ${item.plays}`}
                    />
                    <div
                      className="w-1/2 bg-amber-400 rounded-t-md transition-all duration-300 group-hover:brightness-125"
                      style={{ height: `${compHeight}%` }}
                      title={`Vouchers: ${item.completions}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popular Game Templates */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              Template Popularity
            </h3>
            <p className="text-xs text-slate-400 mb-6">Plays by game engine type</p>

            <div className="space-y-4">
              {summary.templateStats.map((tmpl, idx) => {
                const totalPlays = Math.max(1, summary.totalPlays);
                const percent = Math.round((tmpl.plays / totalPlays) * 100);

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{tmpl.templateName}</span>
                      <span className="text-slate-400 font-mono">
                        {tmpl.plays.toLocaleString()} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(5, percent)}%`,
                          backgroundColor: idx === 0 ? '#2563eb' : idx === 1 ? '#0ea5e9' : '#38bdf8',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400">
            <span className="font-bold text-white">Insight:</span> Arcade Endless Runner formats show the highest repeat replay rate across consumer audiences.
          </div>
        </div>
      </div>

      {/* Detailed Game Performance Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Game Performance Breakdown
          </h3>
          <span className="text-xs text-slate-400">{games.length} total entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">Game</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Template</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Plays</th>
                <th className="py-3 px-4 text-right">Downloads</th>
                <th className="py-3 px-4 text-right">Avg Score</th>
                <th className="py-3 px-4 text-right">High Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {games.map((g) => {
                const brand = brands.find((b) => b.id === g.brandId);
                return (
                  <tr key={g.id} className="hover:bg-slate-850/40 transition">
                    <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: g.configuration.branding.primaryColour }}
                      />
                      {g.gameName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{brand?.brandName || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-slate-400 capitalize">{g.templateId.replace('-', ' ')}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          g.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-blue-400">
                      {g.plays.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300">{g.downloads}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-400">{g.averageScore}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">{g.highScore}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
