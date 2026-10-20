import React, { useState } from 'react';
import { MarketPrice, Language, ScreenId } from '../types';
import { TrendingUp, Search, Bell, ArrowLeft, RefreshCw, MapPin } from 'lucide-react';

interface MarketPricesScreenProps {
  marketPrices: MarketPrice[];
  onBack: () => void;
  language: Language;
}

export const MarketPricesScreen: React.FC<MarketPricesScreenProps> = ({
  marketPrices,
  onBack,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('All');
  const [alertSubscribed, setAlertSubscribed] = useState(false);

  const markets = ['All', 'Addis Ababa (Jan Meda)', 'Jimma ECX Hub', 'Hawassa Central', 'Bahr Dar Market', 'Mekelle Central'];

  const filtered = marketPrices.filter((mp) => {
    const matchesSearch =
      mp.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mp.unit.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMarket = selectedMarket === 'All' || mp.marketLocation === selectedMarket;
    return matchesSearch && matchesMarket;
  });

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
          <TrendingUp className="w-5 h-5 text-emerald-700" />
          <span>Daily ECX Agricultural Commodity Prices</span>
        </h2>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
          Live Rates
        </span>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Banner Alert Subscription */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-2xl shadow-sm flex flex-wrap justify-between items-center gap-3">
          <div>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              Free SMS Alerts
            </span>
            <h3 className="font-black text-amber-300 text-sm mt-1">
              Subscribe to Daily Price Notifications
            </h3>
            <p className="text-xs text-emerald-100">Get instant SMS updates when coffee or teff prices fluctuate.</p>
          </div>

          <button
            onClick={() => setAlertSubscribed(!alertSubscribed)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow transition-colors ${
              alertSubscribed
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>{alertSubscribed ? 'Alerts Enabled ✓' : 'Enable SMS Alerts'}</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, white teff, maize, sesame..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {markets.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMarket(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedMarket === m
                    ? 'bg-emerald-700 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Commodity Prices Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <span className="text-xs font-black text-slate-900">Commodity Rates List</span>
            <span className="text-[10px] text-slate-400">Updated: Today 08:30 AM</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-black text-emerald-800 text-sm">
                    {item.commodity.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{item.commodity}</h4>
                    <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{item.marketLocation}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end space-x-1.5">
                    <span className="text-base font-black text-slate-900">
                      {item.currentPrice.toLocaleString()} ETB
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">/ {item.unit}</span>
                  </div>

                  <div className="flex items-center justify-end space-x-1 text-xs font-bold mt-0.5">
                    <span className="text-slate-400 text-[10px]">Prev: {item.previousPrice.toLocaleString()} ETB</span>
                    <span
                      className={`ml-1 flex items-center font-bold text-[11px] ${
                        item.trend === 'up'
                          ? 'text-emerald-600'
                          : item.trend === 'down'
                          ? 'text-red-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {item.trend === 'up' && '▲ Up'}
                      {item.trend === 'down' && '▼ Down'}
                      {item.trend === 'stable' && '▬ Stable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
