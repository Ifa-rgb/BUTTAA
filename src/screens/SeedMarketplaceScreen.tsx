import React, { useState } from 'react';
import { SeedItem, ScreenId, Language } from '../types';
import { Sprout, Phone, BookOpen, ArrowLeft, CheckCircle, Search, Sparkles } from 'lucide-react';

interface SeedMarketplaceScreenProps {
  seeds: SeedItem[];
  onBack: () => void;
  language: Language;
}

export const SeedMarketplaceScreen: React.FC<SeedMarketplaceScreenProps> = ({
  seeds,
  onBack,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<SeedItem | null>(null);

  const filtered = seeds.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cropType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 bg-slate-50 min-h-[85vh]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-slate-100 text-slate-700 flex items-center space-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Back</span>
        </button>
        <h2 className="font-extrabold text-base text-slate-900 flex items-center space-x-1.5">
          <Sprout className="w-5 h-5 text-emerald-700" />
          <span>Certified Seed & Seedling Marketplace</span>
        </h2>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          High Yield
        </span>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hybrid maize, bread wheat, coffee seedlings, disease-free potatoes..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Seeds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((seed) => (
            <div
              key={seed.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 flex flex-col justify-between transition-all"
            >
              <div className="relative aspect-video bg-slate-100">
                <img
                  src={seed.image}
                  alt={seed.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-emerald-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                  {seed.cropType}
                </span>
                <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                  Germination Rate: {seed.germinationRate}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-emerald-700 mb-1">
                    <span>{seed.availabilityStatus}</span>
                    <span>Supplier: {seed.supplier.split(' ')[0]}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug mb-1">
                    {seed.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {seed.description}
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Price Rate:</span>
                    <span className="text-base font-black text-emerald-800">
                      {seed.pricePerKg.toLocaleString()} ETB <span className="text-xs text-slate-600 font-medium">/ unit</span>
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedGuide(seed)}
                    className="flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-200/80 hover:bg-emerald-300 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Growing Guide</span>
                  </button>
                </div>

                <a
                  href={`tel:${seed.supplierPhone}`}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs shadow flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact Seed Supplier ({seed.supplierPhone})</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growing Guide Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <Sprout className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-slate-900 text-sm">
                  Agronomic Growing Guide: {selectedGuide.cropType}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">{selectedGuide.title}</h4>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-medium text-slate-800">
                {selectedGuide.growingGuide}
              </p>

              <div className="space-y-1">
                <span className="font-bold text-slate-900 block">Supplier Details:</span>
                <p>{selectedGuide.supplier} • Tel: {selectedGuide.supplierPhone}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedGuide(null)}
              className="w-full bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow text-xs"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
