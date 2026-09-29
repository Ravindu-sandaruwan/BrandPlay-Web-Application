import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TemplateId } from '../../types';
import {
  Gamepad2,
  Sparkles,
  ArrowRight,
  Play,
  Layers,
  Palette,
  Download,
  Code2,
  BarChart3,
  CheckCircle2,
  Trophy,
  Users,
  Target,
  Zap,
} from 'lucide-react';
import { GAME_TEMPLATES } from '../../data/demoData';
import { EndlessRunnerCanvas } from '../game-engines/EndlessRunnerCanvas';
import { BrandPlayLogo } from '../common/BrandPlayLogo';

export const LandingPage: React.FC = () => {
  const { navigateTo, currentUser } = useApp();
  const [selectedDemoTemplate, setSelectedDemoTemplate] = useState<TemplateId>('spin-wheel');

  // Interactive mini preview config
  const previewTemplate = GAME_TEMPLATES.find((t) => t.id === selectedDemoTemplate) || GAME_TEMPLATES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        {/* Ambient Gradient Glows in Royal Blue & Cyan */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-600/25 via-blue-500/20 to-sky-400/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Turn Your Brand Into a Game.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6">
              Create engaging branded mini-games{' '}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-white bg-clip-text text-transparent">
                without coding.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed font-normal">
              BrandPlay helps businesses and marketing professionals create, customize, preview, and export
              interactive branded games in minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigateTo(currentUser ? 'dashboard' : 'register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('templates-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-white bg-slate-900 border border-slate-700/80 hover:border-blue-400 hover:bg-slate-850 transition"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Explore Game Templates</span>
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> No Coding Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> HTML5 Standalone Export
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> 1-Click Iframe Embed
              </span>
            </div>
          </div>

          {/* Hero Interactive Mini-Game Display */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-slate-900/90 border border-blue-500/30 shadow-2xl overflow-hidden p-3 backdrop-blur-xl">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 mb-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">Live HTML5 Canvas Preview</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-blue-400">
                <Sparkles className="w-3 h-3" /> Click Canvas to Jump!
              </div>
            </div>

            <EndlessRunnerCanvas
              config={previewTemplate.defaultConfiguration}
              interactive={true}
            />
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section id="how-it-works" className="py-20 border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-400 mb-2">
              Simple 3-Step Process
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              From Brand Identity to Playable Game in Minutes
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              No programming, game design degree, or complex game engines required. Everything runs in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition">
                01
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Upload Brand & Pick Template</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Add your logo and brand color palette. Select from proven high-retention templates: Endless Runner, Drop Catcher, or Interactive Trivia.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition">
                02
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Live Visual Customization</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tweak speed, difficulty, obstacles, characters, and reward vouchers. Watch the HTML5 Canvas update in real time with immediate feedback.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition">
                03
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Publish, Embed or Download</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Launch via instant public URL, copy responsive iframe embed codes for Shopify & WordPress, or download a 100% self-contained HTML5 ZIP package.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GAME TEMPLATES */}
      <section id="templates-section" className="py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-400 mb-2">
                Template Library
              </h2>
              <h3 className="text-3xl sm:text-4xl font-black text-white">
                Battle-Tested Game Mechanics
              </h3>
            </div>
            <button
              onClick={() => navigateTo('templates')}
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300"
            >
              Browse all templates <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {GAME_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-blue-500/50 transition flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                      {tmpl.genre}
                    </span>
                    <span className="text-xs text-slate-400">{tmpl.estimatedPlaytime}</span>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-2">{tmpl.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{tmpl.description}</p>

                  <div className="space-y-2 border-t border-slate-800/80 pt-4">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                      Key Highlights
                    </span>
                    {tmpl.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedDemoTemplate(tmpl.id);
                      navigateTo('create-game', { templateId: tmpl.id });
                    }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 transition shadow shadow-blue-600/30"
                  >
                    Customize This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PLATFORM FEATURES */}
      <section id="features" className="py-20 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-400 mb-2">
              Built for Marketing ROI
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Everything You Need to Gamify Your Brand
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">No-Code Brand Customizer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Control primary, secondary, and accent colors, upload logos, customize obstacle graphics, and tailor speed & difficulty without writing a line of code.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Standalone HTML5 Export</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download a clean, production-ready ZIP containing index.html, game engines, CSS, and assets that run offline anywhere.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-300 flex items-center justify-center mb-4">
                <Code2 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Instant Iframe Embeds</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate embed codes ready to paste directly into Shopify landing pages, WordPress blogs, Webflow, or custom marketing funnels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Incentive Voucher Unlocks</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Motivate players to reach target scores to unlock exclusive discount promo codes, boosting e-commerce conversion rates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Real-Time Game Analytics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track total game plays, completion rates, downloads, average scores, and top player leaderboards to measure campaign impact.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Multi-Brand Management</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ideal for marketing agencies and multi-brand conglomerates. Switch between client brand profiles and launch targeted campaigns effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TARGET USERS */}
      <section className="py-20 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-extrabold tracking-widest text-blue-400 mb-2">
              Who BrandPlay Is For
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              Designed for Non-Technical Creators
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Brand & SME Owners</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Cafes, apparel boutiques, fitness studios, and local businesses can launch high-converting branded mini-games in an afternoon without hiring expensive game studios.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Create single or multiple brand profiles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Distribute coupon codes to drive store visits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Zero maintenance or server hosting costs
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Marketing Professionals & Agencies</h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Digital marketers and agency leaders can manage multiple client brands, customize game mechanics, export HTML5 packages, and pitch interactive campaigns that convert.
                </p>
              </div>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Rapid prototyping for client pitches
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Deep mechanics & score multiplier controls
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" /> Standalone export for any client CMS
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-20 border-t border-slate-800/80 bg-gradient-to-b from-slate-950 to-blue-950/40 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-400 mx-auto flex items-center justify-center shadow-xl shadow-blue-500/30 mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
            Turn Your Brand Into a Game Today.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8">
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

      {/* 7. FOOTER */}
      <footer className="py-12 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandPlayLogo
            size="sm"
            showTagline={true}
            taglineText="Smarter Games, Stronger Engagement."
            onClick={() => navigateTo('home')}
          />

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => navigateTo('templates')} className="hover:text-white transition">Templates</button>
            <button onClick={() => navigateTo('dashboard')} className="hover:text-white transition">Dashboard</button>
            <button onClick={() => navigateTo('login')} className="hover:text-white transition">Sign In</button>
          </div>

          <p>© 2026 BrandPlay Research Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
