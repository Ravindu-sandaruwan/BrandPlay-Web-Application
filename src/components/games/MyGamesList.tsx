import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Game, GameStatus } from '../../types';
import { ExportModal } from './ExportModal';
import { EmbedModal } from './EmbedModal';
import {
  Gamepad2,
  PlusCircle,
  Edit3,
  Play,
  Copy,
  Trash2,
  Download,
  Code2,
  Globe,
  Search,
  Trophy,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const MyGamesList: React.FC = () => {
  const { games, brands, templates, navigateTo, duplicateGame, deleteGame, publishGame } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportModalGame, setExportModalGame] = useState<Game | null>(null);
  const [embedModalGame, setEmbedModalGame] = useState<Game | null>(null);

  const getBrand = (id: string) => brands.find((b) => b.id === id);
  const getTemplate = (id: string) => templates.find((t) => t.id === id);

  const filteredGames = games.filter((game) => {
    const matchesStatus = filterStatus === 'all' || game.status === filterStatus;
    const brand = getBrand(game.brandId);
    const matchesSearch =
      game.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (brand?.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Games</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage, publish, embed and export all your interactive brand mini-games
          </p>
        </div>

        <button
          onClick={() => navigateTo('create-game')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" /> Create New Game
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'published', 'ready', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                filterStatus === st
                  ? 'bg-blue-600 text-white shadow shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st} ({st === 'all' ? games.length : games.filter((g) => g.status === st).length})
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by game or brand..."
            className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
          <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No games match this filter</h3>
          <p className="text-xs text-slate-400 mb-6">
            Create a customized branded game in just 3 easy steps.
          </p>
          <button
            onClick={() => navigateTo('create-game')}
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30"
          >
            Create Your First Game
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => {
            const brand = getBrand(game.brandId);
            const template = getTemplate(game.templateId);

            return (
              <div
                key={game.id}
                className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-xl relative overflow-hidden group"
              >
                {/* Brand Color Header Stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{
                    backgroundColor: game.configuration.branding.primaryColour || '#2563eb',
                  }}
                />

                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-3 mb-4 mt-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center p-2 text-white shadow overflow-hidden shrink-0"
                        style={{
                          backgroundColor:
                            game.configuration.branding.primaryColour || '#2563eb',
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
                          <Gamepad2 className="w-6 h-6" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white leading-tight">
                          {game.gameName}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {brand?.brandName || 'Custom Brand'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
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

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                    {game.configuration.branding.tagline || game.description}
                  </p>

                  {/* Stats & Mechanics Bar */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl mb-4 text-center">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Template</span>
                      <span className="text-xs font-bold text-white truncate block">
                        {template?.genre || 'Arcade'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Plays</span>
                      <span className="text-xs font-bold text-blue-400 font-mono">
                        {game.plays.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block">Promo Code</span>
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        {game.configuration.branding.promoCode || 'REWARD'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigateTo('play', { gameId: game.id })}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow shadow-blue-600/30"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Play
                    </button>

                    <button
                      onClick={() => navigateTo('editor', { gameId: game.id })}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-1 pt-1 text-slate-400">
                    <button
                      onClick={() => duplicateGame(game.id)}
                      className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition text-[11px] flex items-center gap-1"
                      title="Duplicate Game"
                    >
                      <Copy className="w-3.5 h-3.5" /> Duplicate
                    </button>

                    <button
                      onClick={() => setExportModalGame(game)}
                      className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition text-[11px] flex items-center gap-1"
                      title="Export Standalone HTML5 ZIP"
                    >
                      <Download className="w-3.5 h-3.5" /> Export
                    </button>

                    <button
                      onClick={() => setEmbedModalGame(game)}
                      className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition text-[11px] flex items-center gap-1"
                      title="Get Embed Code"
                    >
                      <Code2 className="w-3.5 h-3.5" /> Embed
                    </button>

                    {game.status !== 'published' ? (
                      <button
                        onClick={() => publishGame(game.id)}
                        className="p-1.5 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition text-[11px] flex items-center gap-1"
                        title="Publish Game"
                      >
                        <Globe className="w-3.5 h-3.5" /> Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => deleteGame(game.id)}
                        className="p-1.5 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition text-[11px]"
                        title="Delete Game"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
