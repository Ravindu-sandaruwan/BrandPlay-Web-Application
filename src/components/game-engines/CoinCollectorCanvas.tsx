import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameConfiguration } from '../../types';
import { soundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Trophy, Timer } from 'lucide-react';

interface Props {
  config: GameConfiguration;
  onScoreUpdate?: (score: number) => void;
  onGameEnd?: (finalScore: number, won: boolean) => void;
  interactive?: boolean;
}

interface FallingItem {
  x: number;
  y: number;
  r: number;
  speed: number;
  isHazard: boolean;
  type: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

export const CoinCollectorCanvas: React.FC<Props> = ({
  config,
  onScoreUpdate,
  onGameEnd,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameover' | 'won'>('ready');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(config.gameplay.durationSeconds || 45);
  const [combo, setCombo] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(!config.gameplay.soundEnabled);

  const stateRef = useRef({
    gameState: 'ready' as 'ready' | 'playing' | 'paused' | 'gameover' | 'won',
    player: {
      x: 360,
      y: 350,
      w: 80,
      h: 24,
      targetX: 360,
      speed: 12,
    },
    items: [] as FallingItem[],
    particles: [] as Particle[],
    score: 0,
    combo: 0,
    timeLeft: config.gameplay.durationSeconds || 45,
    lastSpawn: 0,
    animFrameId: 0,
    lastTimestamp: 0,
  });

  useEffect(() => {
    soundEngine.setEnabled(!muted);
  }, [muted]);

  const initGame = useCallback(() => {
    const s = stateRef.current;
    s.player.x = 360;
    s.player.targetX = 360;
    s.items = [];
    s.particles = [];
    s.score = 0;
    s.combo = 0;
    s.timeLeft = config.gameplay.durationSeconds || 45;
    s.lastTimestamp = performance.now();
    setScore(0);
    setCombo(0);
    setTimeLeft(s.timeLeft);
  }, [config.gameplay.durationSeconds]);

  const handlePlay = useCallback(() => {
    if (stateRef.current.gameState === 'gameover' || stateRef.current.gameState === 'won') {
      initGame();
    }
    stateRef.current.gameState = 'playing';
    stateRef.current.lastTimestamp = performance.now();
    setGameState('playing');
  }, [initGame]);

  const handlePause = useCallback(() => {
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.gameState = 'paused';
      setGameState('paused');
    } else if (stateRef.current.gameState === 'paused') {
      stateRef.current.gameState = 'playing';
      stateRef.current.lastTimestamp = performance.now();
      setGameState('playing');
    }
  }, []);

  const handleRestart = useCallback(() => {
    initGame();
    stateRef.current.gameState = 'playing';
    stateRef.current.lastTimestamp = performance.now();
    setGameState('playing');
  }, [initGame]);

  // Mouse & Touch movement tracking
  const handlePointerMove = (clientX: number) => {
    const canvas = canvasRef.current;
    if (!canvas || stateRef.current.gameState !== 'playing') return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const canvasX = (clientX - rect.left) * scaleX;
    stateRef.current.player.targetX = Math.max(
      10,
      Math.min(canvas.width - stateRef.current.player.w - 10, canvasX - stateRef.current.player.w / 2)
    );
  };

  useEffect(() => {
    if (!interactive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const p = stateRef.current.player;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        p.targetX = Math.max(10, p.targetX - 45);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        p.targetX = Math.min(800 - p.w - 10, p.targetX + 45);
      } else if (e.code === 'Space') {
        if (stateRef.current.gameState === 'ready') handlePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interactive, handlePlay]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    stateRef.current.lastTimestamp = performance.now();

    const render = (time: number) => {
      if (!isRunning) return;
      const s = stateRef.current;
      const dt = Math.min((time - s.lastTimestamp) / 1000, 0.1);
      s.lastTimestamp = time;

      const primary = config.branding.primaryColour || '#6366f1';
      const secondary = config.branding.secondaryColour || '#0f172a';
      const accent = config.branding.accentColour || '#ec4899';
      const targetScore = config.gameplay.targetScore || 300;

      if (s.gameState === 'playing') {
        // Player smooth lerp movement
        s.player.x += (s.player.targetX - s.player.x) * 0.22;

        // Timer countdown
        s.timeLeft -= dt;
        setTimeLeft(Math.max(0, Math.ceil(s.timeLeft)));

        if (s.timeLeft <= 0) {
          const won = s.score >= targetScore;
          s.gameState = won ? 'won' : 'gameover';
          setGameState(s.gameState);
          if (won) {
            soundEngine.playSuccess();
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          } else {
            soundEngine.playHit();
          }
          if (onGameEnd) onGameEnd(s.score, won);
        }

        // Spawn items
        const spawnInterval = Math.max(250, 750 - config.gameplay.speed * 40);
        if (time - s.lastSpawn > spawnInterval && s.items.length < 9) {
          s.lastSpawn = time;
          const isHazard = Math.random() < (config.gameplay.difficulty === 'hard' ? 0.35 : 0.2);
          s.items.push({
            x: 40 + Math.random() * 720,
            y: -20,
            r: 15,
            speed: (3 + Math.random() * 2.5) * (config.gameplay.speed * 0.2 + 0.6),
            isHazard,
            type: isHazard ? 'hazard' : config.visuals.collectibleType,
          });
        }

        // Update items & check catches
        for (let i = s.items.length - 1; i >= 0; i--) {
          const item = s.items[i];
          item.y += item.speed * 60 * dt;

          const p = s.player;
          // Catch check
          if (
            item.y + item.r >= p.y &&
            item.y - item.r <= p.y + p.h &&
            item.x >= p.x - 12 &&
            item.x <= p.x + p.w + 12
          ) {
            s.items.splice(i, 1);
            if (item.isHazard) {
              s.score = Math.max(0, s.score - 40);
              s.combo = 0;
              setCombo(0);
              soundEngine.playHit();

              // Red hazard sparks
              for (let k = 0; k < 10; k++) {
                s.particles.push({
                  x: item.x,
                  y: p.y,
                  vx: (Math.random() - 0.5) * 8,
                  vy: (Math.random() - 0.5) * 8,
                  color: '#ef4444',
                  size: 4 + Math.random() * 3,
                  life: 0.5,
                });
              }
            } else {
              s.combo++;
              setCombo(s.combo);
              const comboBonus = Math.min(3, 1 + Math.floor(s.combo / 4));
              const pts = 25 * comboBonus * config.gameplay.scoreMultiplier;
              s.score += pts;
              soundEngine.playCollect();

              // Gold particles
              for (let k = 0; k < 8; k++) {
                s.particles.push({
                  x: item.x,
                  y: p.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: -Math.random() * 6,
                  color: accent,
                  size: 3 + Math.random() * 3,
                  life: 0.6,
                });
              }
            }

            setScore(s.score);
            if (onScoreUpdate) onScoreUpdate(s.score);

            if (s.score >= targetScore && s.timeLeft > 0) {
              s.gameState = 'won';
              setGameState('won');
              soundEngine.playSuccess();
              confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
              if (onGameEnd) onGameEnd(s.score, true);
            }
          } else if (item.y > 440) {
            // Missed item
            if (!item.isHazard) {
              s.combo = 0;
              setCombo(0);
            }
            s.items.splice(i, 1);
          }
        }

        // Particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const pt = s.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 0.025;
          if (pt.life <= 0) s.particles.splice(i, 1);
        }
      }

      // ================= DRAWING =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Background
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(1, '#111827');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Background ambient rings / grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // 2. Timer Bar at Top
      const maxTime = config.gameplay.durationSeconds || 45;
      const progress = Math.max(0, s.timeLeft / maxTime);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, 4);
      ctx.fillStyle = s.timeLeft < 10 ? '#ef4444' : primary;
      ctx.fillRect(0, 0, canvas.width * progress, 4);

      // 3. Falling Items
      s.items.forEach((item) => {
        ctx.save();
        if (item.isHazard) {
          // Hazard spike bomb
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('✕', item.x, item.y + 4);
        } else {
          // Brand item
          ctx.fillStyle = accent;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2);
          ctx.fill();

          // Inner brand sparkle
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(item.x - 3, item.y - 3, item.r * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 4. Player Basket / Catcher
      const p = s.player;
      ctx.save();
      // Glow under catcher
      ctx.shadowColor = primary;
      ctx.shadowBlur = 14;

      // Platform
      ctx.fillStyle = primary;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.w, p.h, 10);
      ctx.fill();

      // Platform top rim
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.roundRect(p.x + 4, p.y, p.w - 8, 4, 2);
      ctx.fill();

      // Platform center brand badge
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(config.branding.customTitle ? config.branding.customTitle.slice(0, 10) : 'BRAND', p.x + p.w / 2, p.y + 16);
      ctx.restore();

      // 5. Particles
      s.particles.forEach((pt) => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      stateRef.current.animFrameId = requestAnimationFrame(render);
    };

    stateRef.current.animFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(stateRef.current.animFrameId);
    };
  }, [config, onScoreUpdate, onGameEnd]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto select-none">
      {/* Game HUD Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold overflow-hidden shadow"
            style={{ backgroundColor: config.branding.primaryColour }}
          >
            {config.branding.logo?.startsWith('<svg') ? (
              <div
                className="w-full h-full p-1"
                dangerouslySetInnerHTML={{ __html: config.branding.logo }}
              />
            ) : config.branding.logo ? (
              <img src={config.branding.logo} alt="Logo" className="w-full h-full object-contain p-1" />
            ) : (
              'BP'
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              {config.branding.customTitle || 'Brand Catcher'}
            </h4>
            <span className="text-[11px] text-slate-400">Target: {config.gameplay.targetScore} pts</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {combo > 2 && (
            <div className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-black animate-pulse">
              🔥 {combo}x STREAK
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <Timer className="w-3.5 h-3.5 text-slate-400" />
            <span className={`text-sm font-mono font-bold ${timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
              {timeLeft}s
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400">SCORE</span>
            <span className="text-sm font-black text-amber-400 font-mono">{score}</span>
          </div>

          <button
            onClick={() => setMuted(!muted)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        className="relative w-full aspect-[800/420] bg-slate-950 overflow-hidden cursor-crosshair"
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) handlePointerMove(e.touches[0].clientX);
        }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={420}
          className="w-full h-full object-contain block"
        />

        {/* Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
              style={{ backgroundColor: config.branding.primaryColour }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{config.branding.customTitle}</h3>
            <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              {config.content.welcomeMessage || 'Move left and right to catch falling branded items! Dodge red hazard crates.'}
            </p>
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl hover:scale-105 active:scale-95 transition"
              style={{ backgroundColor: config.branding.primaryColour }}
            >
              <Play className="w-4 h-4 fill-white" /> Start Game
            </button>
            <span className="text-xs text-slate-500 mt-4">Move your mouse, touch drag, or use ARROW keys</span>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <h3 className="text-2xl font-black text-white mb-4">Game Paused</h3>
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition"
            >
              <Play className="w-4 h-4 fill-white" /> Resume
            </button>
          </div>
        )}

        {/* Won Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3 text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">Awesome Catch!</h3>
            <p className="text-sm text-slate-300 max-w-sm mb-4">
              {config.content.winMessage || 'You caught enough drops to unlock your discount!'}
            </p>

            <div className="w-full max-w-xs bg-slate-900 border border-dashed border-amber-500/60 rounded-xl p-3 mb-4">
              <span className="text-[10px] font-bold text-amber-400 tracking-wider">YOUR EXCLUSIVE VOUCHER</span>
              <div className="text-xl font-black text-white font-mono tracking-widest my-1">
                {config.branding.promoCode || 'WINNER15'}
              </div>
              <span className="text-[11px] text-slate-400">
                {config.branding.discountPercent}% Off with this coupon code
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Play Again
              </button>
              {config.branding.ctaUrl && (
                <a
                  href={config.branding.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 transition hover:brightness-110 shadow-lg"
                  style={{ backgroundColor: config.branding.accentColour }}
                >
                  {config.branding.ctaButtonText || 'Redeem Now'}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <h3 className="text-xl font-black text-white mb-1">Time’s Up!</h3>
            <p className="text-sm text-slate-400 max-w-xs mb-3">
              {config.content.gameOverMessage || 'You missed the target score. Replay to grab your voucher!'}
            </p>
            <div className="text-sm font-semibold text-slate-300 mb-4">
              Final Score: <span className="text-amber-400 font-bold">{score}</span> / {config.gameplay.targetScore}
            </div>
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition"
              style={{ backgroundColor: config.branding.primaryColour }}
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-x border-b border-slate-800 rounded-b-xl text-xs text-slate-400">
        <div className="flex items-center gap-2">
          {gameState === 'playing' ? (
            <button
              onClick={handlePause}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <Play className="w-3.5 h-3.5" /> Play
            </button>
          )}
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
        </div>
        <div className="text-[11px] text-slate-500">
          Slide mouse or touch to move your brand catcher
        </div>
      </div>
    </div>
  );
};
