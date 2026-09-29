import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GameTemplate, TemplateId } from '../../types';
import {
  Gamepad2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Play,
  RotateCcw,
  Sliders,
  Layers,
  X,
} from 'lucide-react';
import { GameRenderer } from '../game-engines/GameRenderer';

export const TemplateLibrary: React.FC = () => {
  const { templates, navigateTo } = useApp();
  const [previewTemplate, setPreviewTemplate] = useState<GameTemplate | null>(null);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold mb-2 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HTML5 Canvas Mini-Game Engines</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Game Template Library</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Choose a battle-tested game template designed for non-technical users. Every template is fully customizable with your brand assets and responsive across desktop and mobile browsers.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition shadow-xl group"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-500/20">
                  {tmpl.genre}
                </span>
                <span className="text-xs text-slate-400 font-mono">{tmpl.estimatedPlaytime}</span>
              </div>

              <h3 className="text-xl font-black text-white mb-2 group-hover:text-blue-300 transition">
                {tmpl.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {tmpl.description}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2 border-t border-slate-800/80 pt-4 mb-6">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                  Included Features
                </span>
                {tmpl.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <button
                onClick={() => navigateTo('create-game', { templateId: tmpl.id })}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/30 transition transform hover:-translate-y-0.5"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setPreviewTemplate(tmpl)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white transition"
              >
                <Play className="w-3.5 h-3.5 fill-slate-300" />
                <span>Test Live Canvas Demo</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setPreviewTemplate(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-lg font-bold text-white">
                Live Interactive Preview: {previewTemplate.name}
              </h3>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 mb-5">
              <GameRenderer
                templateId={previewTemplate.id}
                config={previewTemplate.defaultConfiguration}
                interactive={true}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                You can fully customize colors, logo, obstacle hazards, and speed in the studio.
              </p>
              <button
                onClick={() => {
                  const id = previewTemplate.id;
                  setPreviewTemplate(null);
                  navigateTo('create-game', { templateId: id });
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
              >
                Customize Template Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
