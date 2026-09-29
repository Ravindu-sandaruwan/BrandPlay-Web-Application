import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameConfiguration, SpinWheelSegment } from '../../types';
import { DEFAULT_SPIN_WHEEL_SEGMENTS } from '../../data/demoData';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Volume2,
  VolumeX,
  Gift,
  ArrowRight,
} from 'lucide-react';

interface Props {
  config: GameConfiguration;
  onScoreUpdate?: (score: number) => void;
  onGameEnd?: (finalScore: number, won: boolean) => void;
  interactive?: boolean;
}

export const SpinWheelCanvas: React.FC<Props> = ({
  config,
  onScoreUpdate,
  onGameEnd,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<SpinWheelSegment | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(config.gameplay.soundEnabled ?? true);
  const [mascotMood, setMascotMood] = useState<'idle' | 'spinning' | 'won' | 'lost'>('idle');

  const audioContextRef = useRef<AudioContext | null>(null);

  // Sound generator using Web Audio API
  const playTickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      if (audioContextRef.current) {
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580 + Math.random() * 80, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch {
      // Audio not permitted or supported
    }
  }, [soundEnabled]);

  const playFanfareSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current) {
        const ctx = audioContextRef.current;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.4);
        });
      }
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  // Extract Segments from config
  const segments: SpinWheelSegment[] =
    config.spinWheel?.segments && config.spinWheel.segments.length >= 2
      ? config.spinWheel.segments
      : DEFAULT_SPIN_WHEEL_SEGMENTS;

  const segmentCount = segments.length;
  const sliceAngle = (2 * Math.PI) / segmentCount;

  // Background styling
  const bgTheme = config.visuals.backgroundTheme;
  const customBgUrl = config.visuals.customBackgroundUrl;
  const bgColor = config.branding.backgroundColour || '#090d16';

  // Mascot info
  const mascotId = config.visuals.character;
  const customMascot = config.visuals.customMascotUrl;
  const mascotName = config.visuals.mascotName || 'Brand Buddy';
  const mascotPos = config.visuals.mascotPosition || 'right';

  // Helper to render Mascot visual
  const renderMascotVisual = () => {
    if (customMascot) {
      return (
        <img
          src={customMascot}
          alt={mascotName}
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-xl"
          referrerPolicy="no-referrer"
        />
      );
    }
    const mascotEmojis: Record<string, string> = {
      runner_sneaker: '👟',
      coffee_cup: '☕',
      delivery_van: '🚐',
      robot: '🤖',
      gem_orb: '💎',
      star_hero: '⭐',
      mascot_custom: '🦄',
    };
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 dark:bg-slate-800/80 border border-white/20 flex items-center justify-center text-3xl sm:text-4xl shadow-lg backdrop-blur-md">
        {mascotEmojis[mascotId] || '⭐'}
      </div>
    );
  };

  // Draw the wheel onto HTML5 Canvas
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 26;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    // 1. Draw Segments
    for (let i = 0; i < segmentCount; i++) {
      const seg = segments[i];
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      // Slice Path
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Segment Color (supports custom segment color or brand primary/secondary alternate)
      let fillColor = seg.color;
      if (!fillColor) {
        fillColor =
          i % 2 === 0
            ? config.branding.primaryColour || '#2563eb'
            : config.branding.secondaryColour || '#0f172a';
      }
      ctx.fillStyle = fillColor;
      ctx.fill();

      // Segment separator border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 2. Draw Text on segment
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Contrast color
      ctx.fillStyle = seg.textColor || '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Primary segment text
      const fontSize = segmentCount > 8 ? 12 : segmentCount > 6 ? 13 : 15;
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillText(seg.text, radius - 24, 0);

      // Subtext if available
      if (seg.subtext && segmentCount <= 8) {
        ctx.font = `600 10px sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillText(seg.subtext, radius - 24, 14);
      }

      ctx.restore();
    }

    // 3. Outer Rim Ring with Glowing Pegs
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = config.branding.secondaryColour || '#0f172a';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius + 5, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = config.branding.accentColour || '#38bdf8';
    ctx.stroke();

    // Pegs on rim
    for (let i = 0; i < segmentCount; i++) {
      const angle = i * sliceAngle;
      const pegX = (radius + 2) * Math.cos(angle);
      const pegY = (radius + 2) * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(pegX, pegY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = config.branding.accentColour || '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    ctx.restore();

    // 4. Center Hub (Static or with brand logo)
    const hubRadius = 40;
    ctx.save();
    ctx.translate(centerX, centerY);

    // Hub Outer Shadow & Border
    ctx.beginPath();
    ctx.arc(0, 0, hubRadius, 0, 2 * Math.PI);
    ctx.fillStyle = config.branding.secondaryColour || '#0f172a';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 12;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, hubRadius - 4, 0, 2 * Math.PI);
    ctx.fillStyle = config.branding.primaryColour || '#2563eb';
    ctx.fill();

    // Inner ring
    ctx.beginPath();
    ctx.arc(0, 0, hubRadius - 6, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center Label / SPIN text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText('SPIN', 0, 0);

    ctx.restore();

    // 5. Top Pointer Indicator
    ctx.save();
    ctx.translate(centerX, centerY - radius - 6);

    ctx.beginPath();
    ctx.moveTo(-12, -8);
    ctx.lineTo(12, -8);
    ctx.lineTo(0, 18);
    ctx.closePath();

    ctx.fillStyle = config.branding.accentColour || '#38bdf8';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }, [rotationAngle, segments, segmentCount, sliceAngle, config]);

  // Initial and reactive redraw
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // Perform Spin Action with Weighted Probability
  const handleSpin = () => {
    if (isSpinning || !interactive) return;

    setIsSpinning(true);
    setResultModalOpen(false);
    setSelectedSegment(null);
    setMascotMood('spinning');

    // 1. Pick target segment based on weights/probabilities
    const totalWeight = segments.reduce((sum, s) => sum + (s.probability || 10), 0);
    let randomWeight = Math.random() * totalWeight;
    let targetIndex = 0;

    for (let i = 0; i < segments.length; i++) {
      const weight = segments[i].probability || 10;
      if (randomWeight <= weight) {
        targetIndex = i;
        break;
      }
      randomWeight -= weight;
    }

    const winningSeg = segments[targetIndex];

    // Pointer is located at top: angle = -Math.PI / 2 (or 3 * Math.PI / 2)
    // To land targetIndex at top, final wheel rotation R must satisfy:
    // (targetIndex * sliceAngle + sliceAngle / 2 + R) % (2 * Math.PI) = 3 * Math.PI / 2
    const targetSegmentCenter = targetIndex * sliceAngle + sliceAngle / 2;
    const topPointerAngle = (3 * Math.PI) / 2;
    let targetAngleOffset = topPointerAngle - targetSegmentCenter;
    while (targetAngleOffset < 0) {
      targetAngleOffset += 2 * Math.PI;
    }

    // Add 5 to 8 full revolutions for realistic spin sensation
    const fullSpins = (5 + Math.floor(Math.random() * 3)) * (2 * Math.PI);
    const finalAngle = fullSpins + targetAngleOffset;

    const spinDurationMs = (config.spinWheel?.spinDuration || 4.5) * 1000;
    const startTime = performance.now();
    const startAngle = rotationAngle % (2 * Math.PI);

    let lastTickTime = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / spinDurationMs, 1);

      // Smooth cubic-bezier deceleration easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentAngle = startAngle + finalAngle * easeProgress;

      setRotationAngle(currentAngle);

      // Play tick sound when peg passes top
      if (currentTime - lastTickTime > 60 + progress * 240) {
        playTickSound();
        lastTickTime = currentTime;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Spin Finished!
        setIsSpinning(false);
        setSpinCount((prev) => prev + 1);
        setSelectedSegment(winningSeg);

        const won = winningSeg.isWinning;
        setMascotMood(won ? 'won' : 'lost');

        if (won) {
          playFanfareSound();
          if (config.spinWheel?.showConfetti ?? true) {
            confetti({
              particleCount: 90,
              spread: 70,
              origin: { y: 0.6 },
              colors: [
                config.branding.primaryColour,
                config.branding.accentColour,
                '#ffffff',
                '#f59e0b',
              ],
            });
          }
        }

        if (onScoreUpdate) {
          onScoreUpdate(won ? 100 : 0);
        }
        if (onGameEnd) {
          onGameEnd(won ? 100 : 0, won);
        }

        // Open Winner/Offer Modal
        setTimeout(() => {
          setResultModalOpen(true);
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  };

  const copyPromoCode = () => {
    const code = selectedSegment?.promoCode || config.branding.promoCode || 'SAVE20';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden select-none p-4 sm:p-6 flex flex-col items-center justify-between min-h-[480px] sm:min-h-[520px] transition-colors duration-300"
      style={{
        backgroundColor: bgColor,
        backgroundImage: customBgUrl
          ? `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)), url(${customBgUrl})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dynamic Background Mesh if preset gradient */}
      {!customBgUrl && (
        <div
          className={`absolute inset-0 opacity-40 bg-gradient-to-b ${
            bgTheme === 'vibrant_carnival'
              ? 'from-blue-900/60 via-indigo-950/80 to-slate-950'
              : bgTheme === 'sunset_gradient'
              ? 'from-amber-600/30 via-purple-900/50 to-slate-950'
              : bgTheme === 'luxury_gold'
              ? 'from-amber-500/20 via-slate-950 to-black'
              : 'from-blue-600/20 via-slate-950 to-slate-950'
          } pointer-events-none`}
        />
      )}

      {/* Top Header: Brand Logo, Game Title, Instructions */}
      <div className="relative z-10 w-full flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          {config.branding.logo && (
            <div className="w-9 h-9 rounded-xl bg-white/10 dark:bg-slate-900/80 p-1 border border-white/20 flex items-center justify-center overflow-hidden shadow">
              {config.branding.logo.startsWith('<svg') ? (
                <div
                  className="w-full h-full flex items-center justify-center text-white"
                  dangerouslySetInnerHTML={{ __html: config.branding.logo }}
                />
              ) : (
                <img
                  src={config.branding.logo}
                  alt="Brand Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          )}
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-tight">
              {config.branding.customTitle || 'Lucky Brand Spin Wheel'}
            </h2>
            <p className="text-[11px] text-slate-300 line-clamp-1">
              {config.branding.tagline || 'Spin to win exclusive discounts & prizes!'}
            </p>
          </div>
        </div>

        {/* Audio Mute & Spin Counter */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition"
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white font-mono">
            <span>SPINS:</span>
            <span className="font-bold text-amber-300">{spinCount}</span>
          </div>
        </div>
      </div>

      {/* Center Layout: Mascot (optional left) + Wheel Canvas + Mascot (optional right) */}
      <div className="relative z-10 w-full flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 my-3">
        {/* Left Mascot placement */}
        {mascotPos === 'left' && (
          <div className="flex flex-col items-center gap-1.5 animate-bounce-slow">
            <div className="relative">
              {renderMascotVisual()}
              {mascotMood === 'won' && (
                <span className="absolute -top-2 -right-2 text-xl animate-bounce">🎉</span>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
              {mascotName}
            </span>
          </div>
        )}

        {/* The Spin Wheel Canvas Element */}
        <div className="relative flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={380}
            height={380}
            className="w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] max-w-full drop-shadow-2xl cursor-pointer"
            onClick={handleSpin}
          />

          {/* Central Spin Button Overlay for easy mobile tap */}
          <button
            type="button"
            disabled={isSpinning || !interactive}
            onClick={handleSpin}
            className={`absolute w-20 h-20 rounded-full flex flex-col items-center justify-center transition transform active:scale-95 shadow-2xl focus:outline-none ${
              isSpinning
                ? 'opacity-80 scale-95'
                : 'hover:scale-105 ring-4 ring-white/20'
            }`}
            style={{
              background: `radial-gradient(circle, ${config.branding.primaryColour || '#2563eb'} 0%, ${
                config.branding.secondaryColour || '#0f172a'
              } 100%)`,
            }}
          >
            <span className="text-xs font-black tracking-wider text-white drop-shadow">
              {isSpinning ? '...' : 'SPIN'}
            </span>
            <span className="text-[9px] font-bold text-cyan-300 uppercase">
              {isSpinning ? 'LUCK' : 'NOW'}
            </span>
          </button>
        </div>

        {/* Right Mascot placement */}
        {mascotPos === 'right' && (
          <div className="flex flex-col items-center gap-1.5 transition-transform duration-300">
            <div className={`relative ${mascotMood === 'spinning' ? 'animate-pulse' : 'animate-bounce-slow'}`}>
              {renderMascotVisual()}
              {mascotMood === 'won' && (
                <span className="absolute -top-2 -right-2 text-xl animate-bounce">🏆</span>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
              {mascotName}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 w-full flex items-center justify-between gap-3 pt-2">
        <p className="text-xs text-slate-300 text-center sm:text-left">
          {config.content.instructions || 'Click SPIN to rotate the wheel and win your reward!'}
        </p>

        <button
          type="button"
          disabled={isSpinning || !interactive}
          onClick={handleSpin}
          className="px-5 py-2.5 rounded-xl font-black text-xs text-white shadow-lg transition transform active:scale-95 flex items-center gap-1.5 shrink-0"
          style={{
            backgroundColor: config.branding.buttonColour || config.branding.primaryColour || '#2563eb',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}</span>
        </button>
      </div>

      {/* Result Reward Modal Dialog */}
      {resultModalOpen && selectedSegment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setResultModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-2xl border transition-all transform animate-in zoom-in-95 duration-200"
            style={{
              backgroundColor: config.branding.cardBackground || '#0f172a',
              borderColor: selectedSegment.isWinning
                ? config.branding.accentColour || '#38bdf8'
                : 'rgba(255,255,255,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Icon / Badge */}
            <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20 text-white shadow-lg">
              {selectedSegment.isWinning ? (
                <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
              ) : (
                <RotateCcw className="w-8 h-8 text-slate-400" />
              )}
            </div>

            {/* Title & Message */}
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">
                {selectedSegment.isWinning
                  ? config.content.winMessage || 'Congratulations!'
                  : config.content.loseMessage || 'Better Luck Next Time!'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {selectedSegment.isWinning
                  ? `You landed on "${selectedSegment.text}"!`
                  : `You landed on "${selectedSegment.text}". Don't worry, you can try again!`}
              </p>
            </div>

            {/* Voucher Card for Winner */}
            {selectedSegment.isWinning && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" /> {selectedSegment.rewardValue}
                  </span>
                  <span>Active Now</span>
                </div>

                {/* Promo Code Box */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/50 border border-dashed border-white/25">
                  <span className="font-mono font-black text-sm tracking-widest text-cyan-300">
                    {selectedSegment.promoCode || config.branding.promoCode || 'SPINWIN'}
                  </span>
                  <button
                    type="button"
                    onClick={copyPromoCode}
                    className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition"
                  >
                    {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  {config.branding.rewardDescription || 'Apply this promo code at checkout to claim your reward.'}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              {selectedSegment.isWinning ? (
                <a
                  href={config.branding.ctaUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-lg transition flex items-center justify-center gap-1.5"
                  style={{
                    backgroundColor: config.branding.buttonColour || config.branding.primaryColour || '#2563eb',
                  }}
                >
                  <span>{config.branding.ctaButtonText || 'Claim Your Offer'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setResultModalOpen(false);
                    setTimeout(() => handleSpin(), 200);
                  }}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Spin Again</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setResultModalOpen(false)}
                className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
