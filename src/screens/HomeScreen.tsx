import React, { useState } from 'react';
import {
  Product,
  ProductCategory,
  ScreenId,
  Language,
  WeatherData,
  MarketPrice
} from '../types';
import {
  Sparkles,
  ShieldAlert,
  Tractor,
  Sprout,
  TrendingUp,
  CloudSun,
  Search,
  Filter,
  MapPin,
  Star,
  CheckCircle,
  ShoppingBag,
  ChevronRight,
  Phone,
  BookOpen
} from 'lucide-react';
import { getTranslation } from '../i18n';

interface HomeScreenProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  weather: WeatherData;
  marketPrices: MarketPrice[];
  searchQuery: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onNavigate,
  language,
  weather,
  marketPrices,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-16 bg-slate-50 min-h-[85vh]">
      {/* Top Hero Banner - AI & Smart Hub */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-4 sm:p-6 rounded-b-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="bg-amber-400 text-slate-950 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow">
              Smart Agri Engine
            </span>
            <button
              onClick={() => onNavigate('weather')}
              className="flex items-center space-x-1.5 text-xs bg-emerald-800/80 hover:bg-emerald-700/80 border border-emerald-600 px-2.5 py-1 rounded-full text-emerald-100"
            >
              <CloudSun className="w-3.5 h-3.5 text-amber-300" />
              <span>{weather.city}: {weather.tempC}°C</span>
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight leading-tight mb-1">
            {getTranslation(language, 'smartAdvice')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mb-4 max-w-xl">
            Ask our Gemini AI Agronomist for real-time guidance on yellow leaves, fertilizer ratios, or pest management.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>{getTranslation(language, 'askAi')}</span>
            </button>

            <button
              onClick={() => onNavigate('disease-detection')}
              className="flex items-center space-x-2 bg-emerald-800 hover:bg-emerald-700 border border-emerald-600 text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm shadow"
            >
              <ShieldAlert className="w-4 h-4 text-amber-300" />
              <span>{getTranslation(language, 'diseaseAiDiagnosis')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-6 max-w-7xl mx-auto mt-4 space-y-6">
        {/* Quick Market Price Marquee Ticker */}
        <div
          onClick={() => onNavigate('market-prices')}
          className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-emerald-500 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-2 shrink-0">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-900 hidden xs:inline">
              ECX Daily Prices:
            </span>
          </div>

          <div className="flex-1 overflow-x-auto no-scrollbar mx-2 flex space-x-4 text-xs">
            {marketPrices.slice(0, 4).map((mp) => (
              <div key={mp.id} className="flex items-center space-x-1 shrink-0 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <span className="font-semibold text-slate-700">{mp.commodity}:</span>
                <span className="font-bold text-slate-900">{mp.currentPrice.toLocaleString()} ETB</span>
                <span
                  className={`text-[10px] font-bold ${
                    mp.trend === 'up'
                      ? 'text-emerald-600'
                      : mp.trend === 'down'
                      ? 'text-red-600'
                      : 'text-slate-500'
                  }`}
                >
                  {mp.trend === 'up' ? '▲' : mp.trend === 'down' ? '▼' : '▬'}
                </span>
              </div>
            ))}
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>

        {/* Feature Hub Entry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div
            onClick={() => onNavigate('equipment')}
            className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md cursor-pointer transition-all flex items-center space-x-3 group"
          >
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 group-hover:scale-105 transition-transform">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {getTranslation(language, 'equipment')}
              </h4>
              <p className="text-[10px] text-slate-500">Rent & Buy Machinery</p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('seeds')}
            className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md cursor-pointer transition-all flex items-center space-x-3 group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {getTranslation(language, 'seeds')}
              </h4>
              <p className="text-[10px] text-slate-500">Certified Varieties</p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('market-prices')}
            className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md cursor-pointer transition-all flex items-center space-x-3 group"
          >
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {getTranslation(language, 'marketPrices')}
              </h4>
              <p className="text-[10px] text-slate-500">Daily Commodity Rates</p>
            </div>
          </div>

          <div
            onClick={() => onNavigate('learning-center')}
            className="bg-white p-3.5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md cursor-pointer transition-all flex items-center space-x-3 group"
          >
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                {getTranslation(language, 'learningCenter')}
              </h4>
              <p className="text-[10px] text-slate-500">Guides & Tutorials</p>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <h3 className="text-base font-extrabold text-slate-900">
              {getTranslation(language, 'categories')}
            </h3>
            <button
              onClick={() => onNavigate('categories')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center"
            >
              <span>{getTranslation(language, 'viewAll')}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {getTranslation(language, 'featuredProducts')}
            </h3>
            <p className="text-xs text-slate-500">
              Directly from smallholder farmers & agricultural cooperatives
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-200 px-2.5 py-1 rounded-full">
            {filteredProducts.length} Items
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 flex flex-col justify-between transition-all group"
            >
              <div
                onClick={() => onSelectProduct(p)}
                className="cursor-pointer relative overflow-hidden bg-slate-100 aspect-video sm:aspect-square"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {p.isOrganic && (
                  <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Organic</span>
                  </span>
                )}

                <span className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
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
                      <span className="text-slate-700 font-bold">{p.rating}</span>
                      <span className="text-slate-400">({p.reviewsCount})</span>
                    </div>
                  </div>

                  <h4
                    onClick={() => onSelectProduct(p)}
                    className="font-bold text-slate-900 text-sm line-clamp-2 hover:text-emerald-700 cursor-pointer leading-snug mb-2"
                  >
                    {p.title}
                  </h4>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500 mb-2 truncate">
                    Farmer: <span className="font-semibold text-slate-700">{p.farmerName}</span>
                  </p>

                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-base font-black text-slate-900">
                        {p.price.toLocaleString()} ETB
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium ml-0.5">
                        / {p.unit}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(p);
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-xl shadow transition-transform active:scale-90"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
