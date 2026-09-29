import React, { useState, useEffect, useCallback } from 'react';
import { GameConfiguration, QuizQuestion } from '../../types';
import { soundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Volume2, VolumeX, CheckCircle2, XCircle, Trophy, Timer, Sparkles } from 'lucide-react';
import { DEFAULT_QUIZ_QUESTIONS } from '../../data/demoData';

interface Props {
  config: GameConfiguration;
  onScoreUpdate?: (score: number) => void;
  onGameEnd?: (finalScore: number, won: boolean) => void;
  interactive?: boolean;
}

export const QuizGameCanvas: React.FC<Props> = ({
  config,
  onScoreUpdate,
  onGameEnd,
}) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'question_review' | 'won' | 'gameover'>('ready');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [muted, setMuted] = useState<boolean>(!config.gameplay.soundEnabled);

  const questions: QuizQuestion[] =
    config.content.questions && config.content.questions.length > 0
      ? config.content.questions
      : DEFAULT_QUIZ_QUESTIONS;

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    soundEngine.setEnabled(!muted);
  }, [muted]);

  // Question Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      // Time expired on question
      handleOptionSelect(-1);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleStart = () => {
    setGameState('playing');
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(15);
    setSelectedOption(null);
  };

  const handleRestart = () => {
    handleStart();
  };

  const handleOptionSelect = useCallback((optIndex: number) => {
    if (gameState !== 'playing') return;
    setSelectedOption(optIndex);
    setGameState('question_review');

    const isCorrect = optIndex === currentQ.correctIndex;
    let newScore = score;

    if (isCorrect) {
      soundEngine.playSuccess();
      const points = (100 + timeLeft * 10) * config.gameplay.scoreMultiplier;
      newScore = score + points;
      setScore(newScore);
      if (onScoreUpdate) onScoreUpdate(newScore);
    } else {
      soundEngine.playHit();
    }

    // Advance after 2 seconds
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setTimeLeft(15);
        setGameState('playing');
      } else {
        // Quiz finished
        const target = config.gameplay.targetScore || 250;
        const won = newScore >= target;
        setGameState(won ? 'won' : 'gameover');
        if (won) {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        }
        if (onGameEnd) onGameEnd(newScore, won);
      }
    }, 2200);
  }, [gameState, currentQ, score, timeLeft, config.gameplay.scoreMultiplier, config.gameplay.targetScore, onScoreUpdate, currentIndex, questions.length, onGameEnd]);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto select-none">
      {/* Game HUD */}
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
              {config.branding.customTitle || 'Brand Trivia Master'}
            </h4>
            <span className="text-[11px] text-slate-400">
              Q {currentIndex + 1} of {questions.length} • Target: {config.gameplay.targetScore} pts
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <Timer className="w-3.5 h-3.5 text-slate-400" />
            <span className={`text-sm font-mono font-bold ${timeLeft <= 4 ? 'text-rose-400 animate-ping' : 'text-slate-200'}`}>
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

      {/* Main Interactive Stage */}
      <div className="relative w-full aspect-[800/420] bg-slate-950 overflow-hidden flex flex-col justify-between p-6">
        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              backgroundColor: config.branding.primaryColour,
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>

        {/* Ready Overlay */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
              style={{ backgroundColor: config.branding.primaryColour }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{config.branding.customTitle}</h3>
            <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
              {config.content.welcomeMessage || 'Test your knowledge! Answer correctly to win exclusive brand promo rewards.'}
            </p>
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-xl hover:scale-105 active:scale-95 transition"
              style={{ backgroundColor: config.branding.primaryColour }}
            >
              <Play className="w-4 h-4 fill-white" /> Start Trivia
            </button>
          </div>
        )}

        {/* Playing & Review Stage */}
        {(gameState === 'playing' || gameState === 'question_review') && (
          <div className="flex-1 flex flex-col justify-center my-auto max-w-2xl mx-auto w-full">
            <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
              Question {currentIndex + 1}
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-6 leading-snug">
              {currentQ.question}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQ.options.map((opt, i) => {
                let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-850';

                if (gameState === 'question_review') {
                  if (i === currentQ.correctIndex) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30';
                  } else if (i === selectedOption) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                  } else {
                    btnStyle = 'bg-slate-900/50 border-slate-800/40 text-slate-500';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={gameState === 'question_review'}
                    onClick={() => handleOptionSelect(i)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold text-left transition-all ${btnStyle}`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-mono">
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </span>
                    {gameState === 'question_review' && i === currentQ.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {gameState === 'question_review' && i === selectedOption && i !== currentQ.correctIndex && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box during review */}
            {gameState === 'question_review' && currentQ.explanation && (
              <div className="mt-4 p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2 animate-fadeIn">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentQ.explanation}</span>
              </div>
            )}
          </div>
        )}

        {/* Won Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-3 text-amber-400">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-1">Trivia Champion!</h3>
            <p className="text-sm text-slate-300 max-w-sm mb-4">
              {config.content.winMessage || 'You passed the trivia challenge! Enjoy your discount reward.'}
            </p>

            <div className="w-full max-w-xs bg-slate-900 border border-dashed border-amber-500/60 rounded-xl p-3 mb-4">
              <span className="text-[10px] font-bold text-amber-400 tracking-wider">YOUR EXCLUSIVE VOUCHER</span>
              <div className="text-xl font-black text-white font-mono tracking-widest my-1">
                {config.branding.promoCode || 'QUIZWIN'}
              </div>
              <span className="text-[11px] text-slate-400">
                {config.branding.discountPercent}% Off with this code
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
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <h3 className="text-xl font-black text-white mb-1">Quiz Finished</h3>
            <p className="text-sm text-slate-400 max-w-xs mb-3">
              {config.content.gameOverMessage || 'You were just short of the prize threshold. Try again!'}
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
          <button
            onClick={handleRestart}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restart Quiz
          </button>
        </div>
        <div className="text-[11px] text-slate-500">
          Fast answers earn bonus time points!
        </div>
      </div>
    </div>
  );
};
