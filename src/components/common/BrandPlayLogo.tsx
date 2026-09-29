import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload, RotateCcw, Check, Sparkles, Image as ImageIcon, X } from 'lucide-react';

interface BrandPlayLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  taglineText?: string;
  className?: string;
  onClick?: () => void;
  allowCustomUpload?: boolean;
}

const STORAGE_CUSTOM_LOGO_KEY = 'brandplay_custom_site_logo';

/**
 * BrandPlay Official Vector Emblem Mark
 * Combines the stylized 'B' monogram with dynamic forward 'Play' triangle & gamification sparks.
 */
export const BrandPlayEmblem: React.FC<{
  className?: string;
  sizePx?: number;
}> = ({ className = 'w-10 h-10', sizePx = 40 }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} flex-shrink-0 transition-transform duration-300`}
      width={sizePx}
      height={sizePx}
      aria-label="BrandPlay Emblem"
    >
      <defs>
        {/* Core Blue Gradient */}
        <linearGradient id="bp-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="35%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Play Triangle Vivid Gradient */}
        <linearGradient id="bp-grad-play" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="bp-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Soft shadow for depth */}
        <filter id="bp-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1e3a8a" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Rounded Squircle Container Badge */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="24"
        fill="url(#bp-grad-primary)"
        filter="url(#bp-drop-shadow)"
      />

      {/* Glossy Top Glass Accent */}
      <path
        d="M 6 30 C 6 16.7 16.7 6 30 6 L 70 6 C 83.3 6 94 16.7 94 30 C 94 36 60 52 6 36 Z"
        fill="white"
        fillOpacity="0.16"
      />

      {/* Inner Stylized 'B' Structure */}
      {/* Left Vertical Spine */}
      <rect
        x="24"
        y="25"
        width="11"
        height="50"
        rx="5.5"
        fill="white"
      />

      {/* Top Semi-Loop of 'B' */}
      <path
        d="M 32 25 L 52 25 C 60 25 66 30 66 37 C 66 44 60 48.5 52 48.5 L 32 48.5 Z"
        stroke="white"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bottom Semi-Loop of 'B' */}
      <path
        d="M 32 51.5 L 56 51.5 C 65 51.5 71 57.5 71 65 C 71 72.5 64 75 55 75 L 32 75 Z"
        stroke="white"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />

      {/* Dynamic Embedded Forward 'Play' Arrow inside the counter */}
      <path
        d="M 43 38.5 L 61 50 L 43 61.5 Z"
        fill="url(#bp-grad-play)"
        filter="url(#bp-glow)"
      />

      {/* Gamification Spark / Controller Button Accents */}
      <circle cx="78" cy="27" r="3.5" fill="#38bdf8" />
      <circle cx="85" cy="36" r="2.5" fill="#a5f3fc" />
    </svg>
  );
};

export const BrandPlayLogo: React.FC<BrandPlayLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  taglineText = 'Smarter Games, Stronger Engagement.',
  className = '',
  onClick,
  allowCustomUpload = false,
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_CUSTOM_LOGO_KEY);
    } catch {
      return null;
    }
  });

  const [modalOpen, setModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync custom logo across tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_CUSTOM_LOGO_KEY) {
        setCustomLogo(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, SVG, JPG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomLogo(dataUrl);
      try {
        localStorage.setItem(STORAGE_CUSTOM_LOGO_KEY, dataUrl);
      } catch (err) {
        console.warn('Could not save logo to localStorage', err);
      }
      setModalOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleResetDefault = () => {
    setCustomLogo(null);
    try {
      localStorage.removeItem(STORAGE_CUSTOM_LOGO_KEY);
    } catch (err) {
      console.warn('Could not remove logo from localStorage', err);
    }
    setModalOpen(false);
  };

  // Dimensions configuration
  const dimensions = {
    xs: { icon: 'w-6 h-6', px: 24, text: 'text-sm', sub: 'text-[9px]' },
    sm: { icon: 'w-8 h-8', px: 32, text: 'text-base', sub: 'text-[10px]' },
    md: { icon: 'w-10 h-10', px: 40, text: 'text-lg', sub: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', px: 48, text: 'text-xl', sub: 'text-xs' },
    xl: { icon: 'w-16 h-16', px: 64, text: 'text-2xl', sub: 'text-sm' },
  }[size];

  return (
    <>
      <div
        onClick={onClick}
        className={`flex items-center gap-2.5 group select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
        role={onClick ? 'button' : undefined}
      >
        {/* Emblem or Custom Logo */}
        <div className="relative flex-shrink-0">
          {customLogo ? (
            <div className={`${dimensions.icon} rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 bg-slate-900 border border-blue-500/30 flex items-center justify-center p-1 group-hover:scale-105 transition-transform`}>
              <img
                src={customLogo}
                alt="BrandPlay Logo"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="group-hover:scale-105 transition-transform duration-200">
              <BrandPlayEmblem className={dimensions.icon} sizePx={dimensions.px} />
            </div>
          )}

          {/* Optional small upload indicator badge when allowCustomUpload is active */}
          {allowCustomUpload && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
              }}
              title="Change BrandPlay Logo"
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] hover:bg-blue-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              +
            </button>
          )}
        </div>

        {/* Wordmark Typography */}
        {showText && (
          <div className="flex flex-col leading-tight">
            <div className="flex items-center tracking-tight">
              <span className={`${dimensions.text} font-black text-slate-900 dark:text-white transition-colors`}>
                Brand
              </span>
              <span className={`${dimensions.text} font-black bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent`}>
                Play
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 ml-0.5 animate-pulse" />
            </div>

            {showTagline && (
              <p className={`${dimensions.sub} font-medium text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5 tracking-normal`}>
                {taglineText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Custom Logo Upload Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  BrandPlay Website Logo
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Active Preview */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {customLogo ? (
                  <img
                    src={customLogo}
                    alt="Active Logo"
                    className="w-12 h-12 rounded-xl object-contain bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <BrandPlayEmblem className="w-12 h-12" sizePx={48} />
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {customLogo ? 'Custom Uploaded Logo' : 'Official BrandPlay Vector Emblem'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {customLogo ? 'Custom image active' : 'Default high-res SVG mark'}
                  </p>
                </div>
              </div>

              {customLogo && (
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Upload Area */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 px-4 border-2 border-dashed border-blue-400/40 hover:border-blue-500 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-center transition flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Click to upload custom logo file
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Supports SVG, PNG, JPG, or WEBP (transparent background recommended)
                  </p>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
