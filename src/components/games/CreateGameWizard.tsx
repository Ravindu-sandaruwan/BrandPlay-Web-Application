import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TemplateId } from '../../types';
import { GameEditor } from './GameEditor';
import {
  Building2,
  Gamepad2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react';

interface Props {
  initialBrandId?: string;
  initialTemplateId?: TemplateId;
}

export const CreateGameWizard: React.FC<Props> = ({
  initialBrandId,
  initialTemplateId,
}) => {
  const { brands, templates, navigateTo } = useApp();

  const [step, setStep] = useState<number>(initialBrandId && initialTemplateId ? 3 : initialBrandId ? 2 : 1);
  const [selectedBrandId, setSelectedBrandId] = useState<string>(
    initialBrandId || (brands.length > 0 ? brands[0].id : '')
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(
    initialTemplateId || 'spin-wheel'
  );

  // If already at step 3, render GameEditor directly
  if (step === 3) {
    return (
      <GameEditor
        brandId={selectedBrandId}
        templateId={selectedTemplateId}
      />
    );
  }

  const selectedBrand = brands.find((b) => b.id === selectedBrandId) || brands[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Wizard Progress Steps Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {/* Step 1 */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                step >= 1
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div>
              <p className="text-xs font-bold text-white">Select Brand</p>
              <p className="text-[10px] text-slate-400">Choose identity</p>
            </div>
          </div>

          <div className="w-12 h-0.5 bg-slate-800" />

          {/* Step 2 */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                step >= 2
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div>
              <p className="text-xs font-bold text-white">Game Template</p>
              <p className="text-[10px] text-slate-400">Choose mechanics</p>
            </div>
          </div>

          <div className="w-12 h-0.5 bg-slate-800" />

          {/* Step 3 */}
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                step >= 3
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              3
            </div>
            <div>
              <p className="text-xs font-bold text-white">Customize & Play</p>
              <p className="text-[10px] text-slate-400">Live Canvas Studio</p>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: SELECT BRAND */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Step 1: Select Brand Profile</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                The game will automatically adopt your brand logo, colors, and reward settings
              </p>
            </div>

            <button
              onClick={() => navigateTo('brands')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" /> + New Brand
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {brands.map((b) => {
              const isSelected = selectedBrandId === b.id;

              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBrandId(b.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white p-1.5 shadow"
                        style={{ backgroundColor: b.primaryColour }}
                      >
                        {b.logo?.startsWith('<svg') ? (
                          <div
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: b.logo }}
                          />
                        ) : (
                          <Building2 className="w-5 h-5" />
                        )}
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white mb-1">{b.brandName}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{b.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.primaryColour }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.secondaryColour }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.accentColour }} />
                    <span className="text-[10px] text-slate-500 ml-1 font-mono">{b.primaryColour}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedBrandId}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              <span>Continue to Template Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SELECT GAME TEMPLATE */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Step 2: Select Game Template</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Selected Brand: <strong className="text-white">{selectedBrand?.brandName}</strong>
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Change Brand
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {templates.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`rounded-2xl border p-6 cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 shadow-xl'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                        {tmpl.genre}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-white mb-2">{tmpl.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{tmpl.description}</p>

                    <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                      {tmpl.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <button
                      type="button"
                      className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow shadow-blue-600/30'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select Template'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Back
            </button>

            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Customization Studio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
