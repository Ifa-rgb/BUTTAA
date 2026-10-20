import React, { useState } from 'react';
import { Product, ProductCategory, Language } from '../types';
import { Filter, Search, CheckCircle, MapPin, Star, ShoppingBag, ArrowLeft } from 'lucide-react';

interface CategoriesScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  language: Language;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onBack,
  language,
}) => {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating'>('rating');

  const categories: string[] = [
    'All',
    'Coffee',
    'Cereals',
    'Fruits',
    'Vegetables',
    'Honey',
    'Livestock',
    'Dairy Products',
    'Flowers',
    'Fish',
    'Poultry',
    'Spices',
  ];

  const filtered = products
    .filter((p) => {
      const matchesCat = selectedCat === 'All' || p.category === selectedCat;
      const matchesOrganic = !organicOnly || p.isOrganic;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesOrganic && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return b.rating - a.rating;
    });

  return (
    <div className="pb-16 bg-slate-50 min-h-[85vh]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-slate-100 text-slate-700 flex items-center space-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Back</span>
        </button>
        <h2 className="font-extrabold text-base text-slate-900">Crop & Produce Categories</h2>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
          {filtered.length} Results
        </span>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Filters Panel */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search category, location..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Organic Only</span>
              </label>

              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="text-xs border border-slate-300 p-1.5 rounded-xl font-bold text-slate-700 outline-none"
              >
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCat === c
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 flex flex-col justify-between transition-all group"
            >
              <div
                onClick={() => onSelectProduct(p)}
                className="cursor-pointer relative aspect-square bg-slate-100 overflow-hidden"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.isOrganic && (
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                    Organic
                  </span>
                )}
                <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{p.location.split(',')[0]}</span>
                </span>
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 mb-1">
                    <span>{p.category}</span>
                    <div className="flex items-center space-x-0.5 text-amber-500">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-slate-700">{p.rating}</span>
                    </div>
                  </div>
                  <h4
                    onClick={() => onSelectProduct(p)}
                    className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-emerald-700 cursor-pointer leading-snug mb-2"
                  >
                    {p.title}
                  </h4>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-slate-900">
                      {p.price.toLocaleString()} ETB
                    </span>
                    <span className="text-[10px] text-slate-500 ml-0.5">/ {p.unit}</span>
                  </div>
                  <button
                    onClick={() => onAddToCart(p)}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-xl shadow"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
