import React from 'react';
import { Home, Grid, Sparkles, ShoppingBag, User, Tractor, LayoutDashboard } from 'lucide-react';
import { ScreenId, UserRole, Language } from '../types';
import { getTranslation } from '../i18n';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  role: UserRole;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  role,
  language,
}) => {
  const tabs = [
    { id: 'home' as ScreenId, label: getTranslation(language, 'home'), icon: Home },
    { id: 'categories' as ScreenId, label: getTranslation(language, 'categories'), icon: Grid },
    { id: 'ai-assistant' as ScreenId, label: getTranslation(language, 'aiAssistant'), icon: Sparkles, highlight: true },
    {
      id: (role === 'farmer' ? 'farmer-dashboard' : 'orders') as ScreenId,
      label: role === 'farmer' ? getTranslation(language, 'farmerDashboard') : getTranslation(language, 'orders'),
      icon: role === 'farmer' ? LayoutDashboard : ShoppingBag,
    },
    { id: 'profile' as ScreenId, label: getTranslation(language, 'profile'), icon: User },
  ];

  return (
    <nav className="bg-white border-t border-slate-200 sticky bottom-0 z-40 shadow-lg">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg ring-4 ring-white active:scale-95 transition-transform">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[10px] font-extrabold text-amber-600 mt-0.5">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[68px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
