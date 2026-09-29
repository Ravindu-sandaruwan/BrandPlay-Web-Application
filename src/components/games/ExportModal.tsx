import React, { useState } from 'react';
import { Brand, Game } from '../../types';
import { generateGameZip, triggerDownload } from '../../utils/exportZip';
import { useApp } from '../../context/AppContext';
import { Download, FileCode, CheckCircle2, X, Archive, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  game: Game;
  brand?: Brand;
  onClose: () => void;
}

export const ExportModal: React.FC<Props> = ({ game, brand, onClose }) => {
  const { recordDownload, showToast } = useApp();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const zipBlob = await generateGameZip(game, brand);
      const filename = `brandplay-${game.publicSlug || 'game'}.zip`;
      triggerDownload(zipBlob, filename);
      recordDownload(game.id);
      setDownloaded(true);
      showToast(`Exported "${filename}" successfully!`);
    } catch {
      showToast('Failed to generate export package.', 'error');
    } finally {
      setDownloading(false);
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
            <Archive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Export HTML5 Game</h3>
            <p className="text-xs text-slate-400">Download self-contained offline & online package</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Your game <strong className="text-white">&ldquo;{game.gameName}&rdquo;</strong> will be bundled as a standalone HTML5 application. It requires zero server setup and runs in any web browser immediately.
        </p>

        {/* Package Contents Breakdown */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 mb-6 space-y-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Package Contents (.ZIP)
          </span>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 font-mono">
              <FileCode className="w-4 h-4 text-amber-400" /> index.html
            </span>
            <span className="text-slate-500 text-[11px]">Responsive Game Viewport</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 font-mono">
              <FileCode className="w-4 h-4 text-sky-400" /> game-engine.js
            </span>
            <span className="text-slate-500 text-[11px]">Canvas 2D Physics & Logic</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 font-mono">
              <FileCode className="w-4 h-4 text-blue-400" /> style.css
            </span>
            <span className="text-slate-500 text-[11px]">Brand Color System</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 font-mono">
              <FileCode className="w-4 h-4 text-emerald-400" /> brand-config.json
            </span>
            <span className="text-slate-500 text-[11px]">Brand Assets & Reward Codes</span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2 font-mono">
              <FileCode className="w-4 h-4 text-slate-400" /> README.md
            </span>
            <span className="text-slate-500 text-[11px]">Shopify/WordPress Guide</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Close
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Packaging ZIP...
              </>
            ) : downloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Download Again
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download HTML5 Package
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
