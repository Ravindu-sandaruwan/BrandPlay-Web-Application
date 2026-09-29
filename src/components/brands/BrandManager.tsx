import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Brand } from '../../types';
import { PRESET_LOGOS } from '../../data/demoData';
import {
  Building2,
  PlusCircle,
  Edit2,
  Trash2,
  Globe,
  Upload,
  Check,
  X,
  Sparkles,
  Gamepad2,
} from 'lucide-react';

export const BrandManager: React.FC = () => {
  const { brands, games, addBrand, updateBrand, deleteBrand, navigateTo } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form State
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColour, setPrimaryColour] = useState('#2563eb');
  const [secondaryColour, setSecondaryColour] = useState('#0f172a');
  const [accentColour, setAccentColour] = useState('#ffffff');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [industry, setIndustry] = useState('Retail & E-commerce');
  const [selectedLogo, setSelectedLogo] = useState<string>(PRESET_LOGOS[0].svg);
  const [logoType, setLogoType] = useState<'preset' | 'custom' | 'svg'>('svg');

  const openCreateModal = () => {
    setEditingBrand(null);
    setBrandName('');
    setDescription('');
    setPrimaryColour('#2563eb');
    setSecondaryColour('#0f172a');
    setAccentColour('#ffffff');
    setWebsiteUrl('');
    setIndustry('Retail & E-commerce');
    setSelectedLogo(PRESET_LOGOS[0].svg);
    setLogoType('svg');
    setModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandName(brand.brandName);
    setDescription(brand.description);
    setPrimaryColour(brand.primaryColour);
    setSecondaryColour(brand.secondaryColour);
    setAccentColour(brand.accentColour);
    setWebsiteUrl(brand.websiteUrl || '');
    setIndustry(brand.industry || 'Retail & E-commerce');
    setSelectedLogo(brand.logo);
    setLogoType(brand.logoType || 'svg');
    setModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedLogo(event.target.result as string);
          setLogoType('custom');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName) return;

    if (editingBrand) {
      updateBrand(editingBrand.id, {
        brandName,
        description,
        primaryColour,
        secondaryColour,
        accentColour,
        websiteUrl,
        industry,
        logo: selectedLogo,
        logoType,
      });
    } else {
      addBrand({
        userId: 'current_user',
        brandName,
        description,
        primaryColour,
        secondaryColour,
        accentColour,
        websiteUrl,
        industry,
        logo: selectedLogo,
        logoType,
      });
    }
    setModalOpen(false);
  };

  // Color Palette Presets for Quick Selection in Blue & White Theme
  const COLOR_PALETTES = [
    { name: 'Royal Blue & White', p: '#2563eb', s: '#0f172a', a: '#ffffff' },
    { name: 'Sapphire & Sky', p: '#1d4ed8', s: '#0f172a', a: '#93c5fd' },
    { name: 'Electric Blue', p: '#3b82f6', s: '#1e293b', a: '#ffffff' },
    { name: 'Deep Ocean', p: '#1e40af', s: '#030712', a: '#e0f2fe' },
    { name: 'Midnight White', p: '#0284c7', s: '#082f49', a: '#ffffff' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">My Brands</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create and manage brand profiles with custom colors, logos, and visual assets
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" /> Create Brand Profile
        </button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => {
          const brandGames = games.filter((g) => g.brandId === brand.id);

          return (
            <div
              key={brand.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition relative overflow-hidden group"
            >
              {/* Brand Color Header Stripe */}
              <div
                className="absolute top-0 left-0 right-0 h-2 transition-all group-hover:h-2.5"
                style={{ backgroundColor: brand.primaryColour }}
              />

              <div>
                {/* Brand Logo & Name */}
                <div className="flex items-start justify-between gap-3 mb-4 mt-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center p-2 text-white shadow overflow-hidden"
                      style={{ backgroundColor: brand.primaryColour }}
                    >
                      {brand.logo?.startsWith('<svg') ? (
                        <div
                          className="w-full h-full"
                          dangerouslySetInnerHTML={{ __html: brand.logo }}
                        />
                      ) : brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.brandName}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {brand.brandName}
                      </h3>
                      <span className="text-[11px] text-slate-400">{brand.industry || 'Brand'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEditModal(brand)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Edit Brand"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBrand(brand.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      title="Delete Brand"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                  {brand.description}
                </p>

                {/* Color Swatches */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-1.5">
                    Brand Palette
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                      <div
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: brand.primaryColour }}
                      />
                      <span className="text-slate-300">{brand.primaryColour}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                      <div
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: brand.secondaryColour }}
                      />
                      <span className="text-slate-300">{brand.secondaryColour}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                      <div
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: brand.accentColour }}
                      />
                      <span className="text-slate-300">{brand.accentColour}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Gamepad2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>
                    <strong className="text-white">{brandGames.length}</strong> active games
                  </span>
                </div>

                <button
                  onClick={() => navigateTo('create-game', { brandId: brand.id })}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-600 transition"
                >
                  + New Game
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Brand Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-scaleUp">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">
              {editingBrand ? 'Edit Brand Profile' : 'Create Brand Profile'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Configure brand identity elements used automatically across all games
            </p>

            <form onSubmit={handleSaveBrand} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Lakmal Tech & Retail"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Brand Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Consumer tech brand offering smart lifestyle accessories."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Consumer Electronics, Sports"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://lakmalretail.example.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Brand Logo Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  Brand Logo (Preset or Upload Custom)
                </label>
                <div className="grid grid-cols-6 gap-2 mb-3">
                  {PRESET_LOGOS.map((preset) => {
                    const isSelected = selectedLogo === preset.svg;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedLogo(preset.svg);
                          setLogoType('svg');
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center transition aspect-square ${
                          isSelected
                            ? 'bg-blue-600/30 border-blue-500 text-blue-300 ring-2 ring-blue-500/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                        title={preset.name}
                      >
                        <div
                          className="w-6 h-6"
                          dangerouslySetInnerHTML={{ __html: preset.svg }}
                        />
                      </button>
                    );
                  })}

                  <label className="p-2 rounded-xl border border-dashed border-slate-700 hover:border-blue-500 bg-slate-950 flex flex-col items-center justify-center cursor-pointer transition aspect-square text-slate-400 hover:text-blue-400">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-bold">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Quick Palette Presets */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                  Quick Color Palettes
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {COLOR_PALETTES.map((pal) => (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColour(pal.p);
                        setSecondaryColour(pal.s);
                        setAccentColour(pal.a);
                      }}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 transition text-center"
                    >
                      <div className="flex h-3 rounded overflow-hidden mb-1">
                        <div className="flex-1" style={{ backgroundColor: pal.p }} />
                        <div className="flex-1" style={{ backgroundColor: pal.s }} />
                        <div className="flex-1" style={{ backgroundColor: pal.a }} />
                      </div>
                      <span className="text-[9px] text-slate-400 truncate block">{pal.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hex Color Pickers */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Primary Colour
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                    <input
                      type="color"
                      value={primaryColour}
                      onChange={(e) => setPrimaryColour(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={primaryColour}
                      onChange={(e) => setPrimaryColour(e.target.value)}
                      className="w-full text-xs font-mono bg-transparent text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Secondary Colour
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                    <input
                      type="color"
                      value={secondaryColour}
                      onChange={(e) => setSecondaryColour(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={secondaryColour}
                      onChange={(e) => setSecondaryColour(e.target.value)}
                      className="w-full text-xs font-mono bg-transparent text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Accent Colour
                  </label>
                  <div className="flex items-center gap-2 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                    <input
                      type="color"
                      value={accentColour}
                      onChange={(e) => setAccentColour(e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={accentColour}
                      onChange={(e) => setAccentColour(e.target.value)}
                      className="w-full text-xs font-mono bg-transparent text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition"
                >
                  {editingBrand ? 'Save Changes' : 'Create Brand Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
