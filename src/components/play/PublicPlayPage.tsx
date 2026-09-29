import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { GameRenderer } from '../game-engines/GameRenderer';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  gameIdOrSlug: string;
}

export const PublicPlayPage: React.FC<Props> = ({ gameIdOrSlug }) => {
  const { games, brands, recordPlay, navigateTo, showToast } = useApp();

  const game =
    games.find((g) => g.id === gameIdOrSlug || g.publicSlug === gameIdOrSlug) ||
    games[0];
  const brand = brands.find((b) => b.id === game?.brandId);

  const [hasRecordedPlay, setHasRecordedPlay] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  // Leaderboard state
  const [playerName, setPlayerName] = useState('');
  const [submittedScore, setSubmittedScore] = useState(false);
  const [leaderboard, setLeaderboard] = useState([
    { name: 'Gayan Lakmal', score: 850, date: '10 mins ago' },
    { name: 'Ravindu Sandaruwan', score: 720, date: '1 hour ago' },
    { name: 'Dinithi Perera', score: 610, date: '3 hours ago' },
    { name: 'Kasun Jayawardena', score: 490, date: '1 day ago' },
  ]);

  useEffect(() => {
    // Record initial visit/play session
    if (game && !hasRecordedPlay) {
      recordPlay(game.id, 0);
      setHasRecordedPlay(true);
    }
  }, [game, hasRecordedPlay, recordPlay]);

  if (!game) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-white">
        <h2 className="text-xl font-bold mb-2">Game Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">The requested game might have been removed.</p>
        <button
          onClick={() => navigateTo('dashboard')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const cfg = game.configuration;
  const primaryColor = cfg.branding.primaryColour || '#2563eb';
  const accentColor = cfg.branding.accentColour || '#ffffff';

  const handleGameEnd = (finalScore: number, won: boolean) => {
    recordPlay(game.id, finalScore);
    setCurrentScore(finalScore);
    setGameWon(won);
    if (won) {
      setShowRewardModal(true);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    }
  };

  const handleLeaderboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setLeaderboard((prev) =>
      [...prev, { name: playerName, score: currentScore, date: 'Just now' }].sort(
        (a, b) => b.score - a.score
      )
    );
    setSubmittedScore(true);
    showToast(`Score of ${currentScore} saved to leaderboard!`);
  };

  const copyVoucherCode = () => {
    navigator.clipboard.writeText(cfg.branding.promoCode || 'SAVE20');
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2000);
    showToast('Promo code copied!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Brand Header Bar */}
      <header
        className="w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center p-1.5 text-white shadow overflow-hidden"
              style={{ backgroundColor: primaryColor }}
            >
              {cfg.branding.logo?.startsWith('<svg') ? (
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: cfg.branding.logo }}
                />
              ) : cfg.branding.logo ? (
                <img
                  src={cfg.branding.logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                'BP'
              )}
            </div>

            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                {cfg.branding.customTitle || game.gameName}
              </h1>
              <p className="text-[11px] text-slate-400">
                Official game by <strong className="text-slate-300">{brand?.brandName || 'Brand'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cfg.branding.ctaUrl && (
              <a
                href={cfg.branding.ctaUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow"
                style={{ backgroundColor: primaryColor, color: '#ffffff' }}
              >
                <span>{cfg.branding.ctaButtonText || 'Visit Website'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Game URL copied to clipboard!');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Share Game"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-center">
        <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-3 sm:p-6 shadow-2xl">
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-xl mb-6">
            <GameRenderer
              templateId={game.templateId}
              config={cfg}
              onScoreUpdate={(s) => setCurrentScore(s)}
              onGameEnd={handleGameEnd}
              interactive={true}
            />
          </div>

          {/* Social Proof & Leaderboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Reward Banner */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> Unlockable Brand Reward
                </span>
                <h4 className="text-sm font-bold text-white mb-1">
                  {cfg.branding.discountPercent}% Off Coupon
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hit {cfg.gameplay.targetScore} points to reveal your exclusive promo voucher code for{' '}
                  {brand?.brandName || 'our store'}.
                </p>
              </div>

              {cfg.branding.promoCode && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-slate-300">
                    CODE: {cfg.branding.promoCode}
                  </span>
                  <button
                    onClick={copyVoucherCode}
                    className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                  >
                    {copiedVoucher ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedVoucher ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Community Leaderboard */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> High Scores Leaderboard
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Today</span>
                </div>

                <div className="space-y-1.5">
                  {leaderboard.slice(0, 3).map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50 last:border-0"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-slate-500 font-bold font-mono">#{idx + 1}</span>
                        <span className="text-slate-200 font-medium">{entry.name}</span>
                      </span>
                      <span className="font-bold text-amber-400 font-mono">{entry.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Score Form */}
              {!submittedScore ? (
                <form onSubmit={handleLeaderboardSubmit} className="mt-3 pt-2 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Your nickname"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow"
                  >
                    Save Score
                  </button>
                </form>
              ) : (
                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Score posted to leaderboard!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Promotional Reward Modal upon game win */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative animate-scaleUp">
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 text-white shadow-xl"
              style={{ backgroundColor: primaryColor }}
            >
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white mb-1">Congratulations!</h3>
            <p className="text-xs text-slate-300 mb-6">
              You crushed the high score! Here is your exclusive reward voucher code.
            </p>

            <div className="p-4 bg-slate-950 border border-dashed border-amber-500/60 rounded-2xl mb-6">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                {cfg.branding.discountPercent}% OFF DISCOUNT CODE
              </span>
              <div className="text-2xl font-black text-white font-mono tracking-widest my-1">
                {cfg.branding.promoCode || 'SAVE20'}
              </div>
              <button
                onClick={copyVoucherCode}
                className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 mx-auto"
              >
                {copiedVoucher ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedVoucher ? 'Code Copied!' : 'Click to Copy Code'}</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {cfg.branding.ctaUrl && (
                <a
                  href={cfg.branding.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-xl font-bold text-xs transition shadow-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: accentColor, color: '#090d16' }}
                >
                  <span>{cfg.branding.ctaButtonText || 'Redeem Offer Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={() => setShowRewardModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Back to Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Powered by BrandPlay footer badge */}
      <footer className="w-full py-4 border-t border-slate-800/80 bg-slate-950 text-center text-xs text-slate-500">
        <span>Powered by </span>
        <button
          onClick={() => navigateTo('landing')}
          className="text-blue-400 font-bold hover:underline"
        >
          BrandPlay
        </button>
        <span> – Turn Your Brand Into a Game</span>
      </footer>
    </div>
  );
};
