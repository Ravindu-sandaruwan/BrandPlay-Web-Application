import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Gamepad2,
  Trophy,
  Download,
  Play,
  Edit3,
  ExternalLink,
  PlusCircle,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Game } from '../../types';
import { ExportModal } from '../games/ExportModal';
import { EmbedModal } from '../games/EmbedModal';

export const DashboardOverview: React.FC = () => {
  const { brands, games, templates, currentUser, navigateTo, getAnalyticsSummary } = useApp();
  const summary = getAnalyticsSummary();

  const [exportModalGame, setExportModalGame] = useState<Game | null>(null);
  const [embedModalGame, setEmbedModalGame] = useState<Game | null>(null);

  const recentGames = [...games].sort(
    (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  ).slice(0, 5);

  const getBrand = (brandId: string) => brands.find((b) => b.id === brandId);
  const getTemplate = (tmplId: string) => templates.find((t) => t.id === tmplId);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border border-blue-500/30 p-6 sm:p-8">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-blue-500/10 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Workspace Active: {currentUser?.company || 'BrandPlay Studio'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good day, {currentUser?.name || 'Creator'} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Turn your brand assets into playable interactive experiences in minutes without writing a single line of code.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigateTo('brands')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition"
            >
              Manage Brands
            </button>
            <button
              onClick={() => navigateTo('create-game')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Create New Game</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Brands */}
        <div
          onClick={() => navigateTo('brands')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Brands</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{brands.length}</span>
            <span className="text-[11px] text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Brand profiles configured</p>
        </div>

        {/* Total Games */}
        <div
          onClick={() => navigateTo('my-games')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Games</span>
            <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{games.length}</span>
            <span className="text-[11px] text-blue-400 font-semibold">
              {templates.length} templates available
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Custom mini-games created</p>
        </div>

        {/* Published Games */}
        <div
          onClick={() => navigateTo('my-games')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Published Games</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{summary.publishedGames}</span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              {Math.round((summary.publishedGames / Math.max(1, games.length)) * 100)}% live
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Publicly accessible campaigns</p>
        </div>

        {/* Downloads & Plays */}
        <div
          onClick={() => navigateTo('analytics')}
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Downloads & Plays</span>
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center group-hover:scale-105 transition">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{summary.totalPlays.toLocaleString()}</span>
            <span className="text-[11px] text-sky-400 font-semibold">
              {summary.totalDownloads} exports
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Customer gameplay sessions</p>
        </div>
      </div>

      {/* Analytics Snapshot & Activity Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Gameplay Activity Over Time
              </h3>
              <p className="text-xs text-slate-400">Daily game plays across all published campaigns</p>
            </div>
            <button
              onClick={() => navigateTo('analytics')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              View Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Simple Visual SVG Area Chart in Blue & White */}
          <div className="h-44 w-full flex items-end gap-2 pt-6 pb-2 px-1">
            {summary.playsHistory.map((pt, idx) => {
              const maxPlays = Math.max(...summary.playsHistory.map((p) => p.plays), 100);
              const heightPercent = Math.max(15, (pt.plays / maxPlays) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] text-blue-300 font-bold opacity-0 group-hover:opacity-100 transition -mb-1">
                    {pt.plays}
                  </div>
                  <div className="w-full relative flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-blue-900/40 via-blue-600/70 to-blue-400 rounded-t-lg transition-all duration-300 group-hover:brightness-125"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{pt.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Played Game Highlight */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Performer</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                ★ Leader
              </span>
            </div>

            {summary.mostPlayedGame ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow overflow-hidden p-1.5 shrink-0"
                    style={{
                      backgroundColor:
                        summary.mostPlayedGame.configuration.branding.primaryColour || '#2563eb',
                    }}
                  >
                    {summary.mostPlayedGame.configuration.branding.logo?.startsWith('<svg') ? (
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{
                          __html: summary.mostPlayedGame.configuration.branding.logo,
                        }}
                      />
                    ) : (
                      <Gamepad2 className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {summary.mostPlayedGame.gameName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {getBrand(summary.mostPlayedGame.brandId)?.brandName || 'Brand'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-semibold">TOTAL PLAYS</span>
                    <span className="text-base font-black text-white">
                      {summary.mostPlayedGame.plays.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-semibold">AVG SCORE</span>
                    <span className="text-base font-black text-blue-400">
                      {summary.mostPlayedGame.averageScore} pts
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No games published yet.</p>
            )}
          </div>

          {summary.mostPlayedGame && (
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2">
              <button
                onClick={() => navigateTo('play', { gameId: summary.mostPlayedGame?.id })}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow shadow-blue-600/30"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Play Game
              </button>
              <button
                onClick={() => navigateTo('editor', { gameId: summary.mostPlayedGame?.id })}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                title="Edit Configuration"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Games List */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Games</h3>
            <p className="text-xs text-slate-400">Quickly edit, preview or export your latest configurations</p>
          </div>
          <button
            onClick={() => navigateTo('my-games')}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            All Games ({games.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {recentGames.map((game) => {
            const brand = getBrand(game.brandId);
            const template = getTemplate(game.templateId);

            return (
              <div
                key={game.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/50 transition"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow overflow-hidden p-1.5 shrink-0"
                    style={{
                      backgroundColor: game.configuration.branding.primaryColour || '#2563eb',
                    }}
                  >
                    {game.configuration.branding.logo?.startsWith('<svg') ? (
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{
                          __html: game.configuration.branding.logo,
                        }}
                      />
                    ) : (
                      <Gamepad2 className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{game.gameName}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          game.status === 'published'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : game.status === 'ready'
                            ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {game.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                      <span>Brand: <strong className="text-slate-300">{brand?.brandName || 'Default'}</strong></span>
                      <span>•</span>
                      <span>{template?.name || game.templateId}</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">{game.plays} plays</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => navigateTo('editor', { gameId: game.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>

                  <button
                    onClick={() => navigateTo('play', { gameId: game.id })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-blue-400" /> Play
                  </button>

                  <button
                    onClick={() => setExportModalGame(game)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Export HTML5 Package"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setEmbedModalGame(game)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Get Embed Code"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export & Embed Modals */}
      {exportModalGame && (
        <ExportModal
          game={exportModalGame}
          brand={getBrand(exportModalGame.brandId)}
          onClose={() => setExportModalGame(null)}
        />
      )}

      {embedModalGame && (
        <EmbedModal
          game={embedModalGame}
          onClose={() => setEmbedModalGame(null)}
        />
      )}
    </div>
  );
};
