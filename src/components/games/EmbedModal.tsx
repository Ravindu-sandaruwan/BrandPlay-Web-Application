import React, { useState } from 'react';
import { Game } from '../../types';
import { useApp } from '../../context/AppContext';
import { Code2, Copy, Check, X, ExternalLink, Globe } from 'lucide-react';

interface Props {
  game: Game;
  onClose: () => void;
}

export const EmbedModal: React.FC<Props> = ({ game, onClose }) => {
  const { showToast, navigateTo } = useApp();
  const [embedSize, setEmbedSize] = useState<'responsive' | 'desktop' | 'mobile'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate public play link based on current origin
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://brandplay.io';
  const playUrl = `${baseUrl}/?play=${game.publicSlug || game.id}`;

  const width = embedSize === 'responsive' ? '100%' : embedSize === 'desktop' ? '800' : '420';
  const height = embedSize === 'responsive' ? '540' : embedSize === 'desktop' ? '540' : '680';

  const embedCode = `<iframe
  src="${playUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allow="autoplay"
  style="border-radius: 16px; border: 1px solid #1f2937; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
</iframe>`;

  const copyToClipboard = (text: string, isCode: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCode) {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
      showToast('Iframe embed code copied to clipboard!');
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      showToast('Public play link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Embed & Share Game</h3>
            <p className="text-xs text-slate-400">Add to your website or share with players</p>
          </div>
        </div>

        {/* Public Link Share */}
        <div className="mb-6 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" /> Direct Play Link
            </span>
            <button
              onClick={() => {
                onClose();
                navigateTo('play', { gameId: game.id });
              }}
              className="text-[11px] font-bold text-blue-400 hover:underline flex items-center gap-1"
            >
              Test Public Page <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={playUrl}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono focus:outline-none"
            />
            <button
              onClick={() => copyToClipboard(playUrl, false)}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shrink-0 transition flex items-center gap-1 shadow shadow-blue-600/30"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Embed Frame Size Selector */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-300 block mb-2">
            Viewport Dimensions
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['desktop', 'responsive', 'mobile'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setEmbedSize(s)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition ${
                  embedSize === s
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {s === 'desktop' ? 'Standard (800x540)' : s === 'responsive' ? 'Full Width (100%)' : 'Mobile (420x680)'}
              </button>
            ))}
          </div>
        </div>

        {/* Iframe Code Box */}
        <div className="mb-6">
          <label className="text-xs font-bold text-slate-300 block mb-2">
            HTML Iframe Snippet
          </label>
          <div className="relative">
            <textarea
              readOnly
              rows={4}
              value={embedCode}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 focus:outline-none resize-none"
            />
            <button
              onClick={() => copyToClipboard(embedCode, true)}
              className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow shadow-blue-600/30 transition"
            >
              {copiedCode ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Code
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
