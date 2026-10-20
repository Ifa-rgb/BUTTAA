import React, { useState } from 'react';
import { WeatherData, Language } from '../types';
import { CloudSun, Droplets, Wind, Sun, ArrowLeft, ShieldAlert, MapPin, Calendar } from 'lucide-react';

interface WeatherScreenProps {
  weather: WeatherData;
  onBack: () => void;
  language: Language;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({
  weather: initialWeather,
  onBack,
  language,
}) => {
  const [selectedCity, setSelectedCity] = useState(initialWeather.city);

  const cityDataMap: Record<string, WeatherData> = {
    Jimma: initialWeather,
    'Addis Ababa': {
      city: 'Addis Ababa',
      region: 'Central Ethiopia',
      tempC: 22,
      condition: 'Partly Cloudy',
      humidity: 62,
      rainProbability: 35,
      windKmH: 10,
      forecast7Days: [
        { day: 'Today', highC: 22, lowC: 14, condition: 'Partly Cloudy', rainProb: 35, icon: 'cloud-sun' },
        { day: 'Tue', highC: 21, lowC: 13, condition: 'Light Rain', rainProb: 60, icon: 'cloud-rain' },
        { day: 'Wed', highC: 23, lowC: 15, condition: 'Sunny', rainProb: 15, icon: 'sun' },
        { day: 'Thu', highC: 24, lowC: 14, condition: 'Sunny', rainProb: 10, icon: 'sun' },
        { day: 'Fri', highC: 22, lowC: 13, condition: 'Cloudy', rainProb: 40, icon: 'cloud' },
      ],
      farmingTips: ['Mild rainfall expected on Tuesday afternoon. Suitable for fertilizer application on wheat fields.'],
    },
    Hawassa: {
      city: 'Hawassa',
      region: 'Sidama Region',
      tempC: 26,
      condition: 'Sunny',
      humidity: 52,
      rainProbability: 10,
      windKmH: 14,
      forecast7Days: [
        { day: 'Today', highC: 26, lowC: 16, condition: 'Sunny', rainProb: 10, icon: 'sun' },
        { day: 'Tue', highC: 27, lowC: 17, condition: 'Sunny', rainProb: 10, icon: 'sun' },
        { day: 'Wed', highC: 26, lowC: 16, condition: 'Partly Cloudy', rainProb: 20, icon: 'cloud-sun' },
        { day: 'Thu', highC: 25, lowC: 15, condition: 'Light Rain', rainProb: 45, icon: 'cloud-rain' },
        { day: 'Fri', highC: 26, lowC: 16, condition: 'Sunny', rainProb: 15, icon: 'sun' },
      ],
      farmingTips: ['Good weather conditions for drying maize and coffee harvest.'],
    },
    'Bahir Dar': {
      city: 'Bahir Dar',
      region: 'Amhara Region',
      tempC: 25,
      condition: 'Scattered Showers',
      humidity: 78,
      rainProbability: 70,
      windKmH: 16,
      forecast7Days: [
        { day: 'Today', highC: 25, lowC: 16, condition: 'Showers', rainProb: 70, icon: 'cloud-rain' },
        { day: 'Tue', highC: 24, lowC: 15, condition: 'Heavy Rain', rainProb: 85, icon: 'cloud-lightning' },
        { day: 'Wed', highC: 23, lowC: 15, condition: 'Cloudy', rainProb: 50, icon: 'cloud' },
        { day: 'Thu', highC: 25, lowC: 16, condition: 'Sunny', rainProb: 20, icon: 'sun' },
        { day: 'Fri', highC: 26, lowC: 16, condition: 'Sunny', rainProb: 15, icon: 'sun' },
      ],
      farmingTips: ['Heavy rainfall warning on Tuesday. Clear drainage channels to avoid root waterlogging.'],
    },
  };

  const currentData = cityDataMap[selectedCity] || initialWeather;

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
          <CloudSun className="w-5 h-5 text-amber-500" />
          <span>Agricultural Weather & Soil Advice</span>
        </h2>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
          5-Day Forecast
        </span>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {/* City Selector */}
        <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {Object.keys(cityDataMap).map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCity === city
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              📍 {city}
            </button>
          ))}
        </div>

        {/* Current Weather Card */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-blue-200 font-bold uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentData.city}, Ethiopia</span>
              </span>
              <h1 className="text-4xl font-black text-amber-300 mt-2">{currentData.tempC}°C</h1>
              <p className="text-sm font-semibold text-blue-100">{currentData.condition}</p>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
              <CloudSun className="w-12 h-12 text-amber-300" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-300" />
              <div>
                <span className="text-slate-300 block text-[10px]">Humidity</span>
                <span className="font-black text-white">{currentData.humidity}%</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-amber-300" />
              <div>
                <span className="text-slate-300 block text-[10px]">Rain Chance</span>
                <span className="font-black text-white">{currentData.rainProbability}%</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-emerald-300" />
              <div>
                <span className="text-slate-300 block text-[10px]">Wind Speed</span>
                <span className="font-black text-white">{currentData.windKmH} km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advisory Alert */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start space-x-3 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-black text-amber-900">Agronomic Weather Advisory:</h4>
            <p className="text-amber-800 leading-relaxed font-medium mt-0.5">
              {currentData.farmingTips && currentData.farmingTips[0] ? currentData.farmingTips[0] : 'Favorable agricultural conditions.'}
            </p>
          </div>
        </div>

        {/* Forecast Outlook */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>Weather Outlook Forecast</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(currentData.forecast7Days || []).slice(0, 5).map((fc, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center space-y-1"
              >
                <span className="font-black text-xs text-slate-900 block">{fc.day}</span>
                <span className="text-sm font-bold text-amber-600 block">{fc.highC}°C / {fc.lowC}°C</span>
                <span className="text-[10px] text-slate-500 font-medium block truncate">{fc.condition}</span>
                <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-1 py-0.5 rounded block">
                  💧 {fc.rainProb}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
