import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Gamepad2,
  ArrowRight,
  CheckCircle2,
  Users,
  Target,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { GAME_TEMPLATES } from '../../data/demoData';
import { BrandPlayLogo } from '../common/BrandPlayLogo';

export const HomePage: React.FC = () => {
  const { navigateTo, currentUser } = useApp();

  // ROI Calculator Interactive State
  const [monthlyVisitors, setMonthlyVisitors] = useState<number>(15000);
  const [conversionRate, setConversionRate] = useState<number>(3.5);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(45);

  const projectedPlays = Math.round(monthlyVisitors * 0.38); // 38% gameplay participation
  const projectedVouchers = Math.round(projectedPlays * (conversionRate / 100));
  const estimatedRevenue = Math.round(projectedVouchers * avgOrderValue);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 sm:pt-28 pb-20 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[400px] bg-gradient-to-tr from-blue-400/20 via-blue-300/15 to-sky-300/10 dark:from-blue-600/25 dark:via-blue-500/15 dark:to-sky-400/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Requested Main Title with comma */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6">
              Smarter Games,{' '}
              <span className="text-black dark:text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:via-sky-300 dark:to-white dark:bg-clip-text">
                Stronger Engagement.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              BrandPlay helps businesses, SME owners, and marketing teams create interactive branded mini-games in minutes without writing code. Turn customer attention into measurable loyalty and sales.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
              <button
                onClick={() => navigateTo(currentUser ? 'dashboard' : 'register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Start Building Free</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('template-library-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-sm font-semibold text-slate-800 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-sm transition"
              >
                <Gamepad2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Explore Game Templates</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('roi-calculator-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-4 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
              >
                <span>ROI Calculator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Clean unboxed metadata indicators */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Zero Coding Needed
              </span>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> HTML5 Standalone ZIP Export
              </span>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> 1-Click Iframe Embed
              </span>
              <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Instant Coupon Vouchers
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & KEY METRICS (Zero-Pill discipline) */}
      <section className="py-14 border-y border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">5.2x</p>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">Average Dwell Time</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Compared to static display & social ads</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">42%</p>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">Voucher Claim Rate</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">High-intent coupon redemption at checkout</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">&lt; 5 min</p>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">Build Time</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">From brand palette to playable launch</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">100%</p>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">Standalone HTML5</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Runs offline or embedded in Shopify/WordPress</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works" className="py-20 border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Simple 3-Step Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              From Brand Identity to Playable Game in Minutes
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 leading-relaxed">
              No game development expertise, no complex installation, no coding. Create high-performing interactive experiences straight in your web browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition group flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition">
                  01
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upload Brand & Select Template</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Add your brand logo and custom colors. Choose from Customizable Spin Wheel, Endless Runner, Drop Catcher, or Interactive Brand Trivia.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                Supports SVG, PNG, and vector presets
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition group flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition">
                  02
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Visual Customization & Physics</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Adjust run speed, difficulty levels, score multipliers, obstacle types, and unlockable coupon codes. The live canvas updates instantly.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                Instant real-time HTML5 2D preview
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition group flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition">
                  03
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Publish, Embed or Download</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Generate instant public game URLs, copy responsive iframe embed codes, or download a 100% self-contained HTML5 ZIP package.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
                Works on Shopify, WordPress, Webflow & offline
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. GAME TEMPLATE LIBRARY SHOWCASE */}
      <section id="template-library-section" className="py-20 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/40 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                Template Library
              </h2>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                Battle-Tested Game Mechanics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
                Built specifically for maximum retention, instant dopamine hits, and marketing conversion.
              </p>
            </div>
            <button
              onClick={() => navigateTo('templates')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition"
            >
              <span>View Full Library</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GAME_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500/50 transition flex flex-col justify-between shadow-md dark:shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {tmpl.genre}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{tmpl.estimatedPlaytime}</span>
                  </div>

                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tmpl.name}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{tmpl.description}</p>

                  <div className="space-y-2 border-t border-slate-200 dark:border-slate-800/80 pt-4">
                    <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
                      Core Features
                    </span>
                    {tmpl.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => navigateTo('templates')}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => navigateTo('create-game', { templateId: tmpl.id })}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition shadow shadow-blue-600/30"
                  >
                    Customize
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ENGAGEMENT & ROI CALCULATOR */}
      <section id="roi-calculator-section" className="py-20 border-b border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              ROI & Engagement Estimator
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              See What BrandPlay Can Deliver For Your Brand
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
              Interactive mini-games turn passive visitors into engaged players who claim reward vouchers and purchase.
            </p>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <span>Monthly Website / Campaign Visitors</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{monthlyVisitors.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={monthlyVisitors}
                    onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1,000</span>
                    <span>50,000</span>
                    <span>100,000+</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <span>Expected Voucher Claim Rate</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{conversionRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Conservative (1%)</span>
                    <span>Average (3.5%)</span>
                    <span>High (10%)</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <span>Average Order Value ($)</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">${avgOrderValue}</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={200}
                    step={5}
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>$15</span>
                    <span>$100</span>
                    <span>$200</span>
                  </div>
                </div>
              </div>

              {/* Outcome Display (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider block mb-1">
                    Projected Monthly Impact
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono mb-6">
                    ${estimatedRevenue.toLocaleString()}
                  </div>

                  <div className="space-y-3 border-t border-slate-200 dark:border-slate-800/80 pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Total Game Plays</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{projectedPlays.toLocaleString()}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Voucher Promo Unlocks</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{projectedVouchers.toLocaleString()}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Brand Dwell Time Lift</span>
                      <strong className="text-blue-600 dark:text-blue-400 font-mono">+{Math.round(projectedPlays * 1.8)} mins</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('create-game')}
                  className="mt-6 w-full py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <span>Build Your First Campaign</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHO IT IS FOR */}
      <section className="py-20 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-600 dark:text-blue-400 mb-2">
              Target Creators
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Built for Non-Technical Business Builders
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Brand & SME Owners</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Cafes, apparel boutiques, fitness studios, and direct-to-consumer businesses can launch high-converting branded mini-games in an afternoon without hiring expensive game studios.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Create single or multiple brand profiles (e.g. Gayan Lakmal)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Distribute coupon codes to drive store visits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Zero hosting, maintenance, or server fees
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Marketing Professionals & Agencies</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  Digital marketers and agency leaders can manage multiple client brands, customize game mechanics, export HTML5 packages, and pitch interactive campaigns that convert.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800/80 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Multi-brand client management (e.g. Ravindu Sandaruwan)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Deep mechanics & score multiplier controls
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Standalone export for any client CMS or app
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-20 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-slate-100 to-blue-50 dark:from-slate-950 dark:to-blue-950/40 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center shadow-xl shadow-blue-500/30 mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Smarter Games, Stronger Engagement.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
            Experience the no-code revolution in brand engagement. Create your first branded game in less than 5 minutes.
          </p>

          <button
            onClick={() => navigateTo(currentUser ? 'dashboard' : 'register')}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Launch BrandPlay Studio</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="py-12 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandPlayLogo
            size="sm"
            showTagline={true}
            taglineText="Smarter Games, Stronger Engagement."
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400">
            <button onClick={() => navigateTo('home')} className="hover:text-blue-600 dark:hover:text-white transition">Home</button>
            <button onClick={() => navigateTo('templates')} className="hover:text-blue-600 dark:hover:text-white transition">Templates</button>
            <button onClick={() => navigateTo('dashboard')} className="hover:text-blue-600 dark:hover:text-white transition">Dashboard</button>
            <button onClick={() => navigateTo('login')} className="hover:text-blue-600 dark:hover:text-white transition">Sign In</button>
          </div>

          <p>© 2026 BrandPlay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
