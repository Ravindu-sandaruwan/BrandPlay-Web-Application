import React from 'react';
import { GameConfiguration, TemplateId } from '../../types';
import { EndlessRunnerCanvas } from './EndlessRunnerCanvas';
import { CoinCollectorCanvas } from './CoinCollectorCanvas';
import { QuizGameCanvas } from './QuizGameCanvas';
import { SpinWheelCanvas } from './SpinWheelCanvas';

interface Props {
  templateId: TemplateId;
  config: GameConfiguration;
  onScoreUpdate?: (score: number) => void;
  onGameEnd?: (finalScore: number, won: boolean) => void;
  interactive?: boolean;
}

export const GameRenderer: React.FC<Props> = ({
  templateId,
  config,
  onScoreUpdate,
  onGameEnd,
  interactive = true,
}) => {
  switch (templateId) {
    case 'spin-wheel':
      return (
        <SpinWheelCanvas
          config={config}
          onScoreUpdate={onScoreUpdate}
          onGameEnd={onGameEnd}
          interactive={interactive}
        />
      );
    case 'endless-runner':
      return (
        <EndlessRunnerCanvas
          config={config}
          onScoreUpdate={onScoreUpdate}
          onGameEnd={onGameEnd}
          interactive={interactive}
        />
      );
    case 'coin-collector':
      return (
        <CoinCollectorCanvas
          config={config}
          onScoreUpdate={onScoreUpdate}
          onGameEnd={onGameEnd}
          interactive={interactive}
        />
      );
    case 'quiz-game':
      return (
        <QuizGameCanvas
          config={config}
          onScoreUpdate={onScoreUpdate}
          onGameEnd={onGameEnd}
          interactive={interactive}
        />
      );
    default:
      return (
        <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-xl">
          Unknown Game Template
        </div>
      );
  }
};
