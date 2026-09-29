import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Game, GameConfiguration, TemplateId, QuizQuestion, SpinWheelSegment } from '../../types';
import { PRESET_LOGOS, PRESET_MASCOTS, PRESET_BACKGROUNDS, DEFAULT_SPIN_WHEEL_SEGMENTS } from '../../data/demoData';
import { GameRenderer } from '../game-engines/GameRenderer';
import { ExportModal } from './ExportModal';
import { EmbedModal } from './EmbedModal';
import {
  Save,
  Globe,
  Download,
  Code2,
  Palette,
  Sliders,
  Sparkles,
  Layers,
  FileText,
  Upload,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Volume2,
  VolumeX,
  Gift,
  Plus,
  Trash2,
  Smartphone,
  Monitor,
  Eye,
  Percent,
  Tag,
  Smile,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface Props {
  gameId?: string;
  templateId?: TemplateId;
  brandId?: string;
}

export const GameEditor: React.FC<Props> = ({ gameId, templateId, brandId }) => {
  const {
    games,
    brands,
    templates,
    updateGame,
    createGame,
    publishGame,
    navigateTo,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'branding' | 'mascot_bg' | 'gameplay' | 'rewards' | 'content'>('branding');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [previewKey, setPreviewKey] = useState(0);

  // Find existing game or create new configuration draft
  const existingGame = games.find((g) => g.id === gameId);
  const selectedBrand =
    brands.find((b) => b.id === (existingGame?.brandId || brandId)) || brands[0];
  const effectiveTemplateId: TemplateId = existingGame?.templateId || templateId || 'spin-wheel';
  const templateDef = templates.find((t) => t.id === effectiveTemplateId) || templates[0];

  const [currentGameId, setCurrentGameId] = useState<string | undefined>(gameId);
  const [gameName, setGameName] = useState(existingGame?.gameName || `${selectedBrand.brandName} ${templateDef.name}`);
  const [gameStatus, setGameStatus] = useState(existingGame?.status || 'draft');

  // Deep Configuration State
  const [config, setConfig] = useState<GameConfiguration>(() => {
    if (existingGame?.configuration) {
      return JSON.parse(JSON.stringify(existingGame.configuration));
    }
    const def = JSON.parse(JSON.stringify(templateDef.defaultConfiguration));
    if (selectedBrand) {
      def.branding.logo = selectedBrand.logo;
      def.branding.primaryColour = selectedBrand.primaryColour;
      def.branding.secondaryColour = selectedBrand.secondaryColour;
      def.branding.accentColour = selectedBrand.accentColour;
      def.branding.customTitle = `${selectedBrand.brandName} Game`;
    }
    return def;
  });

  // Sync if switching games
  useEffect(() => {
    if (existingGame) {
      setGameName(existingGame.gameName);
      setGameStatus(existingGame.status);
      setConfig(JSON.parse(JSON.stringify(existingGame.configuration)));
      setCurrentGameId(existingGame.id);
    }
  }, [existingGame]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setConfig((prev) => ({
            ...prev,
            branding: { ...prev.branding, logo: event.target?.result as string },
          }));
          showToast('Brand logo updated.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Custom Mascot Upload
  const handleMascotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setConfig((prev) => ({
            ...prev,
            visuals: {
              ...prev.visuals,
              character: 'mascot_custom',
              customMascotUrl: event.target?.result as string,
            },
          }));
          showToast('Custom mascot uploaded.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Custom Background Upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setConfig((prev) => ({
            ...prev,
            visuals: {
              ...prev.visuals,
              backgroundTheme: 'custom_bg',
              customBackgroundUrl: event.target?.result as string,
            },
          }));
          showToast('Custom background uploaded.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (currentGameId) {
      updateGame(currentGameId, {
        gameName,
        configuration: config,
        status: gameStatus,
      });
    } else {
      const newGame = createGame({
        userId: 'current_user',
        brandId: selectedBrand.id,
        templateId: effectiveTemplateId,
        gameName,
        description: `Customized ${templateDef.name} for ${selectedBrand.brandName}`,
        configuration: config,
        status: 'draft',
        publicSlug: gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      });
      setCurrentGameId(newGame.id);
    }
    showToast('Game saved successfully.');
  };

  const handlePublish = () => {
    let idToPublish = currentGameId;
    if (!idToPublish) {
      const newGame = createGame({
        userId: 'current_user',
        brandId: selectedBrand.id,
        templateId: effectiveTemplateId,
        gameName,
        description: `Customized ${templateDef.name} for ${selectedBrand.brandName}`,
        configuration: config,
        status: 'published',
        publicSlug: gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      });
      idToPublish = newGame.id;
      setCurrentGameId(newGame.id);
    } else {
      updateGame(idToPublish, { configuration: config });
      publishGame(idToPublish);
    }
    setGameStatus('published');
    showToast('Game is now published live!');
  };

  // Brand Palette Presets
  const BRAND_PALETTES = [
    { p: selectedBrand?.primaryColour || '#2563eb', s: selectedBrand?.secondaryColour || '#0f172a', a: selectedBrand?.accentColour || '#38bdf8', label: 'Brand Official' },
    { p: '#2563eb', s: '#0f172a', a: '#38bdf8', label: 'Royal Blue & Sky' },
    { p: '#7c3aed', s: '#0f172a', a: '#c084fc', label: 'Neon Violet' },
    { p: '#059669', s: '#064e3b', a: '#34d399', label: 'Emerald Mint' },
    { p: '#ea580c', s: '#1c1917', a: '#fbbf24', label: 'Sunset Amber' },
    { p: '#d97706', s: '#090d16', a: '#fef08a', label: 'Midnight Gold' },
  ];

  // Spin Wheel Segment manipulation
  const currentSegments = config.spinWheel?.segments || DEFAULT_SPIN_WHEEL_SEGMENTS;

  const updateSegment = (index: number, updates: Partial<SpinWheelSegment>) => {
    const newSegs = [...currentSegments];
    newSegs[index] = { ...newSegs[index], ...updates };
    setConfig((prev) => ({
      ...prev,
      spinWheel: {
        ...(prev.spinWheel || {
          segmentCount: newSegs.length,
          segments: newSegs,
          spinDuration: 4.5,
          centerLogo: true,
          pointerStyle: 'classic',
          showConfetti: true,
          allowReplay: true,
        }),
        segments: newSegs,
        segmentCount: newSegs.length,
      },
    }));
  };

  const handleSegmentCountChange = (count: number) => {
    let newSegs = [...currentSegments];
    if (count > newSegs.length) {
      // Add extra segments
      const colors = ['#2563eb', '#0284c7', '#3b82f6', '#0ea5e9', '#6366f1', '#475569', '#334155', '#1d4ed8'];
      while (newSegs.length < count) {
        const idx = newSegs.length + 1;
        newSegs.push({
          id: `seg-${idx}`,
          text: `${idx * 5}% OFF`,
          subtext: 'Special Reward',
          color: colors[newSegs.length % colors.length],
          textColor: '#ffffff',
          rewardType: 'discount',
          rewardValue: `${idx * 5}% DISCOUNT`,
          promoCode: `LUCKY${idx * 5}`,
          probability: 15,
          isWinning: true,
        });
      }
    } else if (count < newSegs.length) {
      newSegs = newSegs.slice(0, count);
    }

    setConfig((prev) => ({
      ...prev,
      spinWheel: {
        ...(prev.spinWheel || {
          segmentCount: count,
          segments: newSegs,
          spinDuration: 4.5,
          centerLogo: true,
          pointerStyle: 'classic',
          showConfetti: true,
          allowReplay: true,
        }),
        segmentCount: count,
        segments: newSegs,
      },
    }));
  };

  const applyWheelPreset = (presetName: 'ecommerce' | 'high_reward' | 'simple') => {
    if (presetName === 'ecommerce') {
      const segs: SpinWheelSegment[] = [
        { id: '1', text: '10% Discount', subtext: 'Min $30', color: '#2563eb', textColor: '#fff', rewardType: 'discount', rewardValue: '10% DISCOUNT', promoCode: 'SAVE10', probability: 30, isWinning: true },
        { id: '2', text: 'Free Delivery', subtext: 'Next order', color: '#0284c7', textColor: '#fff', rewardType: 'coupon', rewardValue: 'FREE SHIPPING', promoCode: 'FREESHIP', probability: 25, isWinning: true },
        { id: '3', text: 'Try Again', subtext: 'One more spin', color: '#475569', textColor: '#fff', rewardType: 'try_again', rewardValue: 'TRY AGAIN', promoCode: '', probability: 15, isWinning: false },
        { id: '4', text: '20% Discount', subtext: 'Sitewide', color: '#3b82f6', textColor: '#fff', rewardType: 'discount', rewardValue: '20% DISCOUNT', promoCode: 'VIP20', probability: 15, isWinning: true },
        { id: '5', text: 'Free Gift', subtext: 'Mystery item', color: '#0ea5e9', textColor: '#fff', rewardType: 'free_product', rewardValue: 'FREE GIFT', promoCode: 'GIFTBOX', probability: 5, isWinning: true },
        { id: '6', text: 'Better Luck', subtext: 'Thanks for playing', color: '#334155', textColor: '#cbd5e1', rewardType: 'lose', rewardValue: 'NO PRIZE', promoCode: '', probability: 10, isWinning: false },
      ];
      handleSegmentCountChange(6);
      setConfig((prev) => ({
        ...prev,
        spinWheel: {
          ...(prev.spinWheel || { segmentCount: 6, segments: segs, spinDuration: 4.5, centerLogo: true, pointerStyle: 'classic', showConfetti: true, allowReplay: true }),
          segments: segs,
          segmentCount: 6,
        },
      }));
    } else if (presetName === 'high_reward') {
      const segs: SpinWheelSegment[] = [
        { id: '1', text: '5% OFF', subtext: 'Instant', color: '#1d4ed8', textColor: '#fff', rewardType: 'discount', rewardValue: '5% OFF', promoCode: 'SAVE5', probability: 25, isWinning: true },
        { id: '2', text: '10% OFF', subtext: 'Storewide', color: '#2563eb', textColor: '#fff', rewardType: 'discount', rewardValue: '10% OFF', promoCode: 'SAVE10', probability: 20, isWinning: true },
        { id: '3', text: 'Free Gift', subtext: 'Orders $50+', color: '#0284c7', textColor: '#fff', rewardType: 'free_product', rewardValue: 'FREE GIFT', promoCode: 'BONUS', probability: 10, isWinning: true },
        { id: '4', text: '15% OFF', subtext: 'Weekend deal', color: '#3b82f6', textColor: '#fff', rewardType: 'discount', rewardValue: '15% OFF', promoCode: 'SUPER15', probability: 15, isWinning: true },
        { id: '5', text: 'Free Shipping', subtext: 'All items', color: '#0ea5e9', textColor: '#fff', rewardType: 'coupon', rewardValue: 'FREE SHIPPING', promoCode: 'SHIPFREE', probability: 15, isWinning: true },
        { id: '6', text: 'Spin Again', subtext: 'Bonus round', color: '#475569', textColor: '#fff', rewardType: 'try_again', rewardValue: 'SPIN AGAIN', promoCode: '', probability: 5, isWinning: false },
        { id: '7', text: '50 Points', subtext: 'Loyalty bonus', color: '#6366f1', textColor: '#fff', rewardType: 'points', rewardValue: '50 LOYALTY PTS', promoCode: 'POINTS50', probability: 5, isWinning: true },
        { id: '8', text: '25% Mega OFF', subtext: 'VIP Jackpot', color: '#f59e0b', textColor: '#fff', rewardType: 'discount', rewardValue: '25% MEGA DISCOUNT', promoCode: 'JACKPOT25', probability: 5, isWinning: true },
      ];
      handleSegmentCountChange(8);
      setConfig((prev) => ({
        ...prev,
        spinWheel: {
          ...(prev.spinWheel || { segmentCount: 8, segments: segs, spinDuration: 4.5, centerLogo: true, pointerStyle: 'classic', showConfetti: true, allowReplay: true }),
          segments: segs,
          segmentCount: 8,
        },
      }));
    } else if (presetName === 'simple') {
      const segs: SpinWheelSegment[] = [
        { id: '1', text: '20% OFF', subtext: 'Jackpot', color: '#2563eb', textColor: '#fff', rewardType: 'discount', rewardValue: '20% OFF', promoCode: 'LUCKY20', probability: 25, isWinning: true },
        { id: '2', text: 'Try Again', subtext: 'Spin again', color: '#475569', textColor: '#fff', rewardType: 'try_again', rewardValue: 'TRY AGAIN', promoCode: '', probability: 25, isWinning: false },
        { id: '3', text: '10% OFF', subtext: 'Welcome', color: '#0284c7', textColor: '#fff', rewardType: 'discount', rewardValue: '10% OFF', promoCode: 'HELLO10', probability: 35, isWinning: true },
        { id: '4', text: 'Free Gift', subtext: 'Mystery gift', color: '#0ea5e9', textColor: '#fff', rewardType: 'free_product', rewardValue: 'FREE GIFT', promoCode: 'GIFTME', probability: 15, isWinning: true },
      ];
      handleSegmentCountChange(4);
      setConfig((prev) => ({
        ...prev,
        spinWheel: {
          ...(prev.spinWheel || { segmentCount: 4, segments: segs, spinDuration: 4.5, centerLogo: true, pointerStyle: 'classic', showConfetti: true, allowReplay: true }),
          segments: segs,
          segmentCount: 4,
        },
      }));
    }
    showToast(`Applied ${presetName} wheel configuration.`);
  };

  const currentSavedGame = currentGameId ? games.find((g) => g.id === currentGameId) : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none">
      {/* Top Header & Studio Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('my-games')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Back to My Games"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 text-lg font-bold text-slate-900 dark:text-white focus:outline-none px-1"
              />
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  gameStatus === 'published'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {gameStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 px-1">
              Brand: <strong className="text-slate-800 dark:text-slate-200">{selectedBrand.brandName}</strong> • Engine: <span className="font-semibold text-blue-600 dark:text-blue-400">{templateDef.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition shadow shadow-blue-600/30"
          >
            <Save className="w-3.5 h-3.5" /> Save Game
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow"
          >
            <Globe className="w-3.5 h-3.5" /> Publish Live
          </button>

          {currentGameId && (
            <>
              <button
                onClick={() => setExportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Download HTML5 Package"
              >
                <Download className="w-3.5 h-3.5" /> Export ZIP
              </button>

              <button
                onClick={() => setEmbedModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Get Embed Code"
              >
                <Code2 className="w-3.5 h-3.5" /> Embed
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Studio Grid: Left Customization Controls, Right Real-Time Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-lg transition-colors">
          {/* Studio Navigation Tabs */}
          <div className="grid grid-cols-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-1.5 gap-1 text-[11px]">
            <button
              onClick={() => setActiveTab('branding')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl font-bold transition ${
                activeTab === 'branding'
                  ? 'bg-blue-600 text-white shadow shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Colors</span>
            </button>

            <button
              onClick={() => setActiveTab('mascot_bg')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl font-bold transition ${
                activeTab === 'mascot_bg'
                  ? 'bg-blue-600 text-white shadow shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Mascot</span>
            </button>

            <button
              onClick={() => setActiveTab('gameplay')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl font-bold transition ${
                activeTab === 'gameplay'
                  ? 'bg-blue-600 text-white shadow shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{effectiveTemplateId === 'spin-wheel' ? 'Wheel' : 'Game'}</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl font-bold transition ${
                activeTab === 'rewards'
                  ? 'bg-blue-600 text-white shadow shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Offers</span>
            </button>

            <button
              onClick={() => setActiveTab('content')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-xl font-bold transition ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white shadow shadow-blue-600/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>
          </div>

          {/* Tab Contents Scrollable Panel */}
          <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
            {/* 1. BRANDING TAB: COLORS & LOGO */}
            {activeTab === 'branding' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Brand Colors Customization */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Brand Colors
                    </span>
                    <span className="text-[10px] text-slate-500">Pick any custom hex</span>
                  </div>

                  {/* 1-Click Palette Presets */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {BRAND_PALETTES.map((pal, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            branding: {
                              ...prev.branding,
                              primaryColour: pal.p,
                              secondaryColour: pal.s,
                              accentColour: pal.a,
                              buttonColour: pal.p,
                            },
                          }))
                        }
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition text-left"
                      >
                        <div className="flex h-3 rounded-md overflow-hidden mb-1">
                          <div className="flex-1" style={{ backgroundColor: pal.p }} />
                          <div className="flex-1" style={{ backgroundColor: pal.s }} />
                          <div className="flex-1" style={{ backgroundColor: pal.a }} />
                        </div>
                        <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate block">
                          {pal.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* 5 Distinct Color Controls */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {/* Primary Color */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Primary Color</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.branding.primaryColour}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              branding: { ...prev.branding, primaryColour: e.target.value },
                            }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white uppercase">
                          {config.branding.primaryColour}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Color */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Secondary / Rim</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.branding.secondaryColour}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              branding: { ...prev.branding, secondaryColour: e.target.value },
                            }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white uppercase">
                          {config.branding.secondaryColour}
                        </span>
                      </div>
                    </div>

                    {/* Background Color */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Background</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.branding.backgroundColour || '#090d16'}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              branding: { ...prev.branding, backgroundColour: e.target.value },
                            }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white uppercase">
                          {config.branding.backgroundColour || '#090d16'}
                        </span>
                      </div>
                    </div>

                    {/* Button Color */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Button Color</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.branding.buttonColour || config.branding.primaryColour}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              branding: { ...prev.branding, buttonColour: e.target.value },
                            }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white uppercase">
                          {config.branding.buttonColour || config.branding.primaryColour}
                        </span>
                      </div>
                    </div>

                    {/* Text Color */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Text Color</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.branding.textColour || '#ffffff'}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              branding: { ...prev.branding, textColour: e.target.value },
                            }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white uppercase">
                          {config.branding.textColour || '#ffffff'}
                        </span>
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 font-bold block mb-1">Accent / Glow</span>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="color"
                          value={config.branding.accentColour}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              branding: { ...prev.branding, accentColour: e.target.value },
                            }))
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                        />
                        <span className="text-[11px] font-mono font-bold text-slate-900 dark:text-white uppercase">
                          {config.branding.accentColour}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brand Logo Upload & Presets */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Brand Logo
                    </label>
                    <span className="text-[10px] text-slate-500">Appears on wheel center & banner</span>
                  </div>

                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {PRESET_LOGOS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, logo: preset.svg },
                          }))
                        }
                        className={`p-2 rounded-xl border flex items-center justify-center transition aspect-square ${
                          config.branding.logo === preset.svg
                            ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/40'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-400'
                        }`}
                        title={preset.name}
                      >
                        <div
                          className="w-5 h-5"
                          dangerouslySetInnerHTML={{ __html: preset.svg }}
                        />
                      </button>
                    ))}

                    <label className="p-2 rounded-xl border-2 border-dashed border-blue-400/40 hover:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 flex flex-col items-center justify-center cursor-pointer transition aspect-square text-blue-600 dark:text-blue-400">
                      <Upload className="w-4 h-4 mb-0.5" />
                      <span className="text-[8px] font-bold">Upload</span>
                      <input
                        type="file"
                        accept="image/png,image/svg+xml,image/jpeg,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Logo Placement selector */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Logo Display Position</span>
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                      {(['header', 'center', 'both'] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              branding: { ...prev.branding, logoPlacement: pos },
                            }))
                          }
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold capitalize transition ${
                            (config.branding.logoPlacement || 'both') === pos
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MASCOT & BACKGROUNDS TAB */}
            {activeTab === 'mascot_bg' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Brand Mascot / Character */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Brand Character / Mascot
                    </label>
                    <span className="text-[10px] text-slate-500">Reacts & celebrates spins</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {PRESET_MASCOTS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            visuals: {
                              ...prev.visuals,
                              character: m.id as GameConfiguration['visuals']['character'],
                              mascotName: m.name,
                            },
                          }))
                        }
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition ${
                          config.visuals.character === m.id
                            ? 'bg-blue-500/15 border-blue-500 ring-2 ring-blue-500/30'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-2xl">{m.emoji}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{m.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{m.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Mascot Upload */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-blue-500" /> Upload Custom Mascot
                      </span>
                      {config.visuals.customMascotUrl && (
                        <span className="text-[10px] font-bold text-emerald-500">Custom Active</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex-1 py-2 px-3 border border-dashed border-blue-400 hover:border-blue-500 rounded-xl bg-white dark:bg-slate-900 text-center cursor-pointer transition text-xs font-semibold text-blue-600 dark:text-blue-400">
                        Choose Mascot File (PNG/SVG)
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMascotUpload}
                          className="hidden"
                        />
                      </label>

                      {config.visuals.customMascotUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setConfig((prev) => ({
                              ...prev,
                              visuals: {
                                ...prev.visuals,
                                character: 'runner_sneaker',
                                customMascotUrl: '',
                              },
                            }))
                          }
                          className="p-2 text-slate-400 hover:text-red-500 transition"
                          title="Remove custom mascot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Mascot Position */}
                    <div className="flex items-center justify-between pt-2 text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Mascot Position</span>
                      <div className="flex items-center gap-1">
                        {(['left', 'right', 'hidden'] as const).map((pos) => (
                          <button
                            key={pos}
                            type="button"
                            onClick={() =>
                              setConfig((prev) => ({
                                ...prev,
                                visuals: { ...prev.visuals, mascotPosition: pos },
                              }))
                            }
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold capitalize transition ${
                              (config.visuals.mascotPosition || 'right') === pos
                                ? 'bg-blue-600 text-white'
                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Background Themes & Custom Upload */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Background Theme
                    </label>
                    <span className="text-[10px] text-slate-500">Stage ambiance</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {PRESET_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            visuals: {
                              ...prev.visuals,
                              backgroundTheme: bg.id as GameConfiguration['visuals']['backgroundTheme'],
                              customBackgroundUrl: bg.id === 'custom_bg' ? prev.visuals.customBackgroundUrl : '',
                            },
                          }))
                        }
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition ${
                          config.visuals.backgroundTheme === bg.id
                            ? 'bg-blue-500/15 border-blue-500 ring-2 ring-blue-500/30'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: bg.previewColor }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{bg.name}</p>
                          <p className="text-[10px] text-slate-500 truncate">{bg.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Upload Background Image */}
                  <label className="flex items-center justify-center gap-2 py-2.5 px-3 border border-dashed border-blue-400 hover:border-blue-500 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 text-center cursor-pointer transition text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <Upload className="w-4 h-4" />
                    <span>Upload Branded Background Image (PNG/JPG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBgUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* 3. WHEEL & GAMEPLAY CONFIGURATION TAB */}
            {activeTab === 'gameplay' && (
              <div className="space-y-5 animate-in fade-in">
                {effectiveTemplateId === 'spin-wheel' ? (
                  <>
                    {/* Wheel Presets */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Wheel Quick Presets
                        </span>
                        <span className="text-[10px] text-slate-500">1-click industry setups</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => applyWheelPreset('ecommerce')}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition text-xs font-bold text-slate-900 dark:text-white"
                        >
                          E-Commerce 6
                        </button>
                        <button
                          type="button"
                          onClick={() => applyWheelPreset('high_reward')}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition text-xs font-bold text-slate-900 dark:text-white"
                        >
                          High Reward 8
                        </button>
                        <button
                          type="button"
                          onClick={() => applyWheelPreset('simple')}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition text-xs font-bold text-slate-900 dark:text-white"
                        >
                          Simple 4
                        </button>
                      </div>
                    </div>

                    {/* Segment Count Picker */}
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-2">
                        <span>Number of Wheel Segments</span>
                        <span className="text-blue-600 dark:text-blue-400 font-mono font-black">
                          {currentSegments.length} Segments
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[4, 6, 8, 10, 12].map((cnt) => (
                          <button
                            key={cnt}
                            type="button"
                            onClick={() => handleSegmentCountChange(cnt)}
                            className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                              currentSegments.length === cnt
                                ? 'bg-blue-600 text-white border-blue-600 shadow shadow-blue-600/30'
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                            }`}
                          >
                            {cnt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Segments Detailed Editor List */}
                    <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Customize Wheel Wedges
                        </span>
                        <span className="text-[10px] text-slate-500">Edit text, color & odds</span>
                      </div>

                      <div className="space-y-2.5">
                        {currentSegments.map((seg, idx) => (
                          <div
                            key={seg.id || idx}
                            className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                                  {idx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={seg.text}
                                  onChange={(e) => updateSegment(idx, { text: e.target.value })}
                                  placeholder="e.g. 20% Discount"
                                  className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 w-36 sm:w-44"
                                />
                              </div>

                              <div className="flex items-center gap-1.5">
                                {/* Slice Color */}
                                <input
                                  type="color"
                                  value={seg.color}
                                  onChange={(e) => updateSegment(idx, { color: e.target.value })}
                                  className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
                                  title="Segment slice color"
                                />

                                {/* Winning Toggle */}
                                <button
                                  type="button"
                                  onClick={() => updateSegment(idx, { isWinning: !seg.isWinning })}
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition ${
                                    seg.isWinning
                                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  {seg.isWinning ? 'Win' : 'Lose'}
                                </button>
                              </div>
                            </div>

                            {/* Reward Code & Probability Weight */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                                  Promo Voucher Code
                                </label>
                                <input
                                  type="text"
                                  value={seg.promoCode || ''}
                                  onChange={(e) => updateSegment(idx, { promoCode: e.target.value.toUpperCase() })}
                                  placeholder="e.g. VIP20"
                                  className="w-full px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white uppercase focus:outline-none"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mb-0.5">
                                  <span>Odds Weight</span>
                                  <span className="font-mono text-blue-600 dark:text-blue-400">{seg.probability}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={1}
                                  max={100}
                                  value={seg.probability}
                                  onChange={(e) => updateSegment(idx, { probability: Number(e.target.value) })}
                                  className="w-full accent-blue-600 cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Standard Platformer / Collector / Quiz Mechanics */
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                        <span>Speed & Agility</span>
                        <span className="text-blue-600 dark:text-blue-400 font-mono">{config.gameplay.speed} / 10</span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={config.gameplay.speed}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            gameplay: { ...prev.gameplay, speed: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                          Target Score to Win
                        </label>
                        <input
                          type="number"
                          step={50}
                          value={config.gameplay.targetScore}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              gameplay: { ...prev.gameplay, targetScore: Number(e.target.value) },
                            }))
                          }
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                          Player Lives
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={config.gameplay.lives}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              gameplay: { ...prev.gameplay, lives: Number(e.target.value) },
                            }))
                          }
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. REWARDS & OFFERS TAB */}
            {activeTab === 'rewards' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Primary Reward Category
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { id: 'discount', label: 'Discount %', icon: <Percent className="w-3.5 h-3.5" /> },
                      { id: 'coupon', label: 'Free Delivery', icon: <Tag className="w-3.5 h-3.5" /> },
                      { id: 'free_product', label: 'Free Gift', icon: <Gift className="w-3.5 h-3.5" /> },
                    ].map((rew) => (
                      <button
                        key={rew.id}
                        type="button"
                        onClick={() =>
                          setConfig((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, rewardType: rew.id as any },
                          }))
                        }
                        className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition ${
                          (config.branding.rewardType || 'discount') === rew.id
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {rew.icon}
                        <span>{rew.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">
                      Global Promo Coupon Code
                    </label>
                    <input
                      type="text"
                      value={config.branding.promoCode}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          branding: { ...prev.branding, promoCode: e.target.value.toUpperCase() },
                        }))
                      }
                      placeholder="e.g. WINNER20"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white uppercase focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-500 font-bold block mb-1">
                      Discount Percentage %
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={config.branding.discountPercent}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          branding: { ...prev.branding, discountPercent: Number(e.target.value) },
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">
                    Reward Voucher Description
                  </label>
                  <input
                    type="text"
                    value={config.branding.rewardDescription || ''}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, rewardDescription: e.target.value },
                      }))
                    }
                    placeholder="Apply this coupon code at checkout to claim your reward."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Call To Action Buttons */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                    Post-Game Call to Action
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Button Label</span>
                      <input
                        type="text"
                        value={config.branding.ctaButtonText}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, ctaButtonText: e.target.value },
                          }))
                        }
                        placeholder="Claim Your Reward"
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Destination URL</span>
                      <input
                        type="url"
                        value={config.branding.ctaUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            branding: { ...prev.branding, ctaUrl: e.target.value },
                          }))
                        }
                        placeholder="https://yourbrand.com/store"
                        className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CONTENT & MESSAGES TAB */}
            {activeTab === 'content' && (
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Game Display Title
                  </label>
                  <input
                    type="text"
                    value={config.branding.customTitle}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, customTitle: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Tagline / Promotional Subheading
                  </label>
                  <input
                    type="text"
                    value={config.branding.tagline}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        branding: { ...prev.branding, tagline: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                    Player Instructions & Rules
                  </label>
                  <textarea
                    rows={2}
                    value={config.content.instructions || config.content.welcomeMessage}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        content: {
                          ...prev.content,
                          instructions: e.target.value,
                          welcomeMessage: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                      Winning Victory Message
                    </label>
                    <textarea
                      rows={2}
                      value={config.content.winMessage}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          content: { ...prev.content, winMessage: e.target.value },
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                      Losing / "Try Again" Message
                    </label>
                    <textarea
                      rows={2}
                      value={config.content.loseMessage || config.content.gameOverMessage}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          content: {
                            ...prev.content,
                            loseMessage: e.target.value,
                            gameOverMessage: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Real-Time Interactive Live Preview Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl sticky top-20 transition-colors">
          {/* Preview Header & Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Live Real-Time Preview
              </h3>
            </div>

            {/* Desktop vs Mobile Preview Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  previewMode === 'desktop'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  previewMode === 'mobile'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[10px]">Mobile</span>
              </button>
            </div>
          </div>

          {/* Interactive Game Viewport */}
          <div
            className={`mx-auto transition-all duration-300 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl ${
              previewMode === 'mobile' ? 'max-w-[360px] ring-8 ring-slate-800/60' : 'w-full'
            }`}
          >
            <GameRenderer
              key={previewKey}
              templateId={effectiveTemplateId}
              config={config}
              interactive={true}
            />
          </div>

          {/* Preview Footer Metrics & Quick Reload */}
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
              <span>
                Engine: <strong className="text-slate-900 dark:text-white">{templateDef.name}</strong> • Real-time reactive updates
              </span>
            </div>

            <button
              type="button"
              onClick={() => setPreviewKey((prev) => prev + 1)}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Game Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export & Embed Modals */}
      {exportModalOpen && currentSavedGame && (
        <ExportModal
          game={currentSavedGame}
          brand={selectedBrand}
          onClose={() => setExportModalOpen(false)}
        />
      )}

      {embedModalOpen && currentSavedGame && (
        <EmbedModal
          game={currentSavedGame}
          onClose={() => setEmbedModalOpen(false)}
        />
      )}
    </div>
  );
};
