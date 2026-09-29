import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameConfiguration } from '../../types';
import { soundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Trophy } from 'lucide-react';

interface Props {
  config: GameConfiguration;
  onScoreUpdate?: (score: number) => void;
  onGameEnd?: (finalScore: number, won: boolean) => void;
  interactive?: boolean;
}

interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Collectible {
  x: number;
  y: number;
  r: number;
  collected: boolean;
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

export const EndlessRunnerCanvas: React.FC<Props> = ({
  config,
  onScoreUpdate,
  onGameEnd,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameover' | 'won'>('ready');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(config.gameplay.lives || 3);
  const [muted, setMuted] = useState<boolean>(!config.gameplay.soundEnabled);

  // Mutable game simulation state
  const stateRef = useRef({
    gameState: 'ready' as 'ready' | 'playing' | 'paused' | 'gameover' | 'won',
    player: {
      x: 80,
      y: 280,
      vy: 0,
      w: 44,
      h: 52,
      groundY: 280,
      isGrounded: true,
      jumpForce: -13.5,
      gravity: 0.72,
    },
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    speed: config.gameplay.speed * 1.1 + 3,
    distance: 0,
    score: 0,
    lives: config.gameplay.lives || 3,
    lastObstacleSpawn: 0,
    lastCollectibleSpawn: 0,
    animFrameId: 0,
  });

  // Sync mute setting
  useEffect(() => {
    soundEngine.setEnabled(!muted);
  }, [muted]);

  // Keep stateRef speed & lives updated when config changes
  useEffect(() => {
    stateRef.current.speed = config.gameplay.speed * 1.1 + 3;
  }, [config.gameplay.speed]);

  const initGame = useCallback(() => {
    const s = stateRef.current;
    s.player.y = s.player.groundY;
    s.player.vy = 0;
    s.player.isGrounded = true;
    s.obstacles = [];
    s.collectibles = [];
    s.particles = [];
    s.distance = 0;
    s.score = 0;
    s.lives = config.gameplay.lives || 3;
    s.speed = config.gameplay.speed * 1.1 + 3;
    setScore(0);
    setLives(s.lives);
  }, [config.gameplay.lives, config.gameplay.speed]);

  const triggerJump = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === 'ready') {
      handlePlay();
      return;
    }
    if (s.gameState === 'playing' && s.player.isGrounded) {
      s.player.vy = s.player.jumpForce;
      s.player.isGrounded = false;
      soundEngine.playJump();

      // Jump dust particles
      for (let i = 0; i < 5; i++) {
        s.particles.push({
          x: s.player.x + 10 + Math.random() * 20,
          y: s.player.groundY + s.player.h - 4,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2,
          color: '#cbd5e1',
          size: 3 + Math.random() * 3,
          life: 0.4,
        });
      }
    }
  }, []);

  const handlePlay = useCallback(() => {
    if (stateRef.current.gameState === 'gameover' || stateRef.current.gameState === 'won') {
      initGame();
    }
    stateRef.current.gameState = 'playing';
    setGameState('playing');
  }, [initGame]);

  const handlePause = useCallback(() => {
    if (stateRef.current.gameState === 'playing') {
      stateRef.current.gameState = 'paused';
      setGameState('paused');
    } else if (stateRef.current.gameState === 'paused') {
      stateRef.current.gameState = 'playing';
      setGameState('playing');
    }
  }, []);

  const handleRestart = useCallback(() => {
    initGame();
    stateRef.current.gameState = 'playing';
    setGameState('playing');
  }, [initGame]);

  // Keyboard controls
  useEffect(() => {
    if (!interactive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interactive, triggerJump]);

  // Main Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      const s = stateRef.current;
      const p = s.player;
      const primary = config.branding.primaryColour || '#6366f1';
      const secondary = config.branding.secondaryColour || '#0f172a';
      const accent = config.branding.accentColour || '#ec4899';
      const targetScore = config.gameplay.targetScore || 250;

      // Update simulation if playing
      if (s.gameState === 'playing') {
        // Player physics
        p.vy += p.gravity;
        p.y += p.vy;

        if (p.y >= p.groundY) {
          p.y = p.groundY;
          p.vy = 0;
          p.isGrounded = true;
        }

        s.distance += s.speed;
        const currentDistanceScore = Math.floor((s.distance / 12) * config.gameplay.scoreMultiplier);
        const totalScore = s.score + currentDistanceScore;
        setScore(totalScore);
        if (onScoreUpdate) onScoreUpdate(totalScore);

        // Check Target Score Win Condition
        if (totalScore >= targetScore && s.gameState === 'playing') {
          s.gameState = 'won';
          setGameState('won');
          soundEngine.playSuccess();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          if (onGameEnd) onGameEnd(totalScore, true);
        }

        // Spawn obstacles
        if (s.distance - s.lastObstacleSpawn > 220 + Math.random() * 180) {
          s.lastObstacleSpawn = s.distance;
          const obHeight = config.visuals.obstacleType === 'spikes' ? 28 : 38;
          s.obstacles.push({
            x: 760,
            y: p.groundY + p.h - obHeight,
            w: 28,
            h: obHeight,
          });
        }

        // Spawn collectibles
        if (s.distance - s.lastCollectibleSpawn > 160 + Math.random() * 140) {
          s.lastCollectibleSpawn = s.distance;
          s.collectibles.push({
            x: 770,
            y: p.groundY - 30 - Math.random() * 45,
            r: 13,
            collected: false,
          });
        }

        // Move & check obstacles collision
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const ob = s.obstacles[i];
          ob.x -= s.speed;

          // AABB Collision with a slightly forgiving hitbox
          const pad = 6;
          if (
            p.x + pad < ob.x + ob.w &&
            p.x + p.w - pad > ob.x &&
            p.y + pad < ob.y + ob.h &&
            p.y + p.h > ob.y
          ) {
            s.obstacles.splice(i, 1);
            s.lives--;
            setLives(s.lives);
            soundEngine.playHit();

            // Hit spark particles
            for (let k = 0; k < 10; k++) {
              s.particles.push({
                x: ob.x + ob.w / 2,
                y: ob.y + ob.h / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: '#ef4444',
                size: 4 + Math.random() * 3,
                life: 0.5,
              });
            }

            if (s.lives <= 0) {
              s.gameState = 'gameover';
              setGameState('gameover');
              if (onGameEnd) onGameEnd(totalScore, false);
            }
          } else if (ob.x < -40) {
            s.obstacles.splice(i, 1);
          }
        }

        // Move & check collectibles
        for (let i = s.collectibles.length - 1; i >= 0; i--) {
          const c = s.collectibles[i];
          c.x -= s.speed;

          const dx = p.x + p.w / 2 - c.x;
          const dy = p.y + p.h / 2 - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < c.r + p.w / 2) {
            s.collectibles.splice(i, 1);
            s.score += 40 * config.gameplay.scoreMultiplier;
            soundEngine.playCollect();

            // Burst particles
            for (let k = 0; k < 8; k++) {
              s.particles.push({
                x: c.x,
                y: c.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: accent,
                size: 4 + Math.random() * 2,
                life: 0.6,
              });
            }
          } else if (c.x < -30) {
            s.collectibles.splice(i, 1);
          }
        }

        // Update particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const pt = s.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 0.02;
          if (pt.life <= 0) {
            s.particles.splice(i, 1);
          }
        }
      }

      // ================= DRAWING =================
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Background Sky & Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (config.visuals.backgroundTheme === 'sunset_gradient') {
        grad.addColorStop(0, '#1e112a');
        grad.addColorStop(0.5, '#431407');
        grad.addColorStop(1, '#090d16');
      } else if (config.visuals.backgroundTheme === 'neon_city') {
        grad.addColorStop(0, '#0f051d');
        grad.addColorStop(0.6, '#180b33');
        grad.addColorStop(1, '#090d16');
      } else {
        grad.addColorStop(0, '#090d16');
        grad.addColorStop(1, '#1e293b');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Parallax Silhouette & Brand Billboards
      const bgOffset = (s.distance * 0.3) % 400;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let i = -1; i < 3; i++) {
        const bx = i * 400 - bgOffset;
        ctx.fillRect(bx + 40, 160, 60, 180);
        ctx.fillRect(bx + 130, 120, 80, 220);
        ctx.fillRect(bx + 240, 180, 70, 160);
      }

      // Billboard with Brand Title & Accent Glow
      const billboardX = 600 - ((s.distance * 0.6) % 800);
      ctx.fillStyle = secondary;
      ctx.strokeStyle = primary;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(billboardX, 80, 180, 60, 8);
      ctx.fill();
      ctx.stroke();

      // Billboard poles
      ctx.fillStyle = '#334155';
      ctx.fillRect(billboardX + 30, 140, 6, 190);
      ctx.fillRect(billboardX + 144, 140, 6, 190);

      // Billboard Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(config.branding.customTitle || 'BRANDPLAY', billboardX + 90, 106);
      ctx.fillStyle = accent;
      ctx.font = '9px sans-serif';
      ctx.fillText(config.branding.tagline ? config.branding.tagline.slice(0, 28) : 'OFFICIAL GAME', billboardX + 90, 124);

      // 3. Ground Track
      const groundTop = p.groundY + p.h;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, groundTop, canvas.width, canvas.height - groundTop);

      // Primary brand track border line
      ctx.fillStyle = primary;
      ctx.fillRect(0, groundTop, canvas.width, 5);

      // Track moving stripes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      const stripeOffset = (s.distance * 1.0) % 40;
      for (let x = -stripeOffset; x < canvas.width; x += 40) {
        ctx.fillRect(x, groundTop + 14, 20, 3);
      }

      // 4. Draw Collectibles
      s.collectibles.forEach((c) => {
        ctx.save();
        ctx.fillStyle = accent;
        ctx.shadowColor = accent;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();

        // Inner coin shine
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(c.x - 3, c.y - 3, c.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Draw Obstacles
      ctx.fillStyle = '#ef4444';
      s.obstacles.forEach((ob) => {
        if (config.visuals.obstacleType === 'spikes') {
          ctx.beginPath();
          ctx.moveTo(ob.x, ob.y + ob.h);
          ctx.lineTo(ob.x + ob.w / 2, ob.y);
          ctx.lineTo(ob.x + ob.w, ob.y + ob.h);
          ctx.closePath();
          ctx.fill();
        } else {
          // Hurdle / barrier
          ctx.beginPath();
          ctx.roundRect(ob.x, ob.y, ob.w, ob.h, 4);
          ctx.fill();
          // Warning stripe
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ob.x + 4, ob.y + 10, ob.w - 8, 4);
          ctx.fillStyle = '#ef4444';
        }
      });

      // 6. Draw Player
      ctx.save();
      const charType = config.visuals.character;

      if (charType === 'coffee_cup') {
        // Draw Coffee Cup character
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y + 10, p.w, p.h - 10, 8);
        ctx.fill();
        // Handle
        ctx.strokeStyle = primary;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(p.x + p.w + 2, p.y + 24, 8, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
        // Steam if running
        ctx.strokeStyle = accent;
        ctx.lineWidth = 2;
        const steamPhase = (s.distance * 0.1) % 10;
        ctx.beginPath();
        ctx.moveTo(p.x + 16, p.y + 6 - steamPhase);
        ctx.lineTo(p.x + 18, p.y - 2 - steamPhase);
        ctx.moveTo(p.x + 28, p.y + 6 - steamPhase);
        ctx.lineTo(p.x + 30, p.y - 2 - steamPhase);
        ctx.stroke();
      } else if (charType === 'delivery_van') {
        // Van
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y + 16, p.w + 10, p.h - 16, 6);
        ctx.fill();
        // Wheels
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(p.x + 8, p.groundY + p.h - 2, 7, 0, Math.PI * 2);
        ctx.arc(p.x + p.w, p.groundY + p.h - 2, 7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Standard sleek runner avatar
        ctx.fillStyle = primary;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.w, p.h, 10);
        ctx.fill();

        // Visor / eyes
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.roundRect(p.x + p.w - 18, p.y + 12, 14, 8, 3);
        ctx.fill();

        // Runner belt / emblem
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x + 6, p.y + 28, p.w - 12, 4);
      }
      ctx.restore();

      // 7. Draw Particles
      s.particles.forEach((pt) => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      s.animFrameId = requestAnimationFrame(render);
    };

    render();

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
              {config.branding.customTitle || 'Brand Runner'}
            </h4>
            <span className="text-[11px] text-slate-400">Target: {config.gameplay.targetScore} pts</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <span className="text-[10px] font-bold text-slate-400">LIVES</span>
            <div className="flex text-rose-400 text-xs font-bold gap-0.5">
              {Array.from({ length: lives }).map((_, i) => (
                <span key={i}>❤️</span>
              ))}
            </div>
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

      {/* Main Canvas Viewport with Overlays */}
      <div
        className="relative w-full aspect-[800/420] bg-slate-950 overflow-hidden cursor-pointer"
        onClick={triggerJump}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={420}
          className="w-full h-full object-contain block"
        />

        {/* Start / Ready Overlay */}
        {gameState === 'ready' && (
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
              style={{ backgroundColor: config.branding.primaryColour }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{config.branding.customTitle}</h3>
            <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              {config.content.welcomeMessage || 'Press Space or Click to Jump! Dodge hurdles and collect brand tokens.'}
            </p>
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl hover:scale-105 active:scale-95 transition"
              style={{ backgroundColor: config.branding.primaryColour }}
            >
              <Play className="w-4 h-4 fill-white" /> Start Game
            </button>
            <span className="text-xs text-slate-500 mt-4">Tip: Press SPACEBAR or TAP screen to jump</span>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'paused' && (
          <div
            className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-black text-white mb-4">Game Paused</h3>
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition"
            >
              <Play className="w-4 h-4 fill-white" /> Resume
            </button>
          </div>
        )}

        {/* Won Overlay with Promo Voucher */}
        {gameState === 'won' && (
          <div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3 text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">Spectacular Run!</h3>
            <p className="text-sm text-slate-300 max-w-sm mb-4">
              {config.content.winMessage || 'You hit the target score! Here is your exclusive reward voucher.'}
            </p>

            <div className="w-full max-w-xs bg-slate-900 border border-dashed border-amber-500/60 rounded-xl p-3 mb-4">
              <span className="text-[10px] font-bold text-amber-400 tracking-wider">YOUR EXCLUSIVE VOUCHER</span>
              <div className="text-xl font-black text-white font-mono tracking-widest my-1">
                {config.branding.promoCode || 'SAVE20'}
              </div>
              <span className="text-[11px] text-slate-400">
                {config.branding.discountPercent}% Off at checkout
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
                  {config.branding.ctaButtonText || 'Claim Offer'}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-3 text-rose-400 font-black text-xl">
              ✕
            </div>
            <h3 className="text-xl font-black text-white mb-1">Game Over</h3>
            <p className="text-sm text-slate-400 max-w-xs mb-3">
              {config.content.gameOverMessage || 'Almost there! Try once more to unlock your discount.'}
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

      {/* Game Controls Footer */}
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
          Click or press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">SPACE</kbd> to jump
        </div>
      </div>
    </div>
  );
};
