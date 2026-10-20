import React from 'react';
import {
  ShoppingBag,
  Bell,
  Search,
  User as UserIcon,
  Bot,
  Menu,
  Sparkles,
  CloudSun,
  ShieldAlert,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ScreenId, User, Language } from '../types';
import { getTranslation } from '../i18n';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenDrawer: () => void;
  currentUser: User;
  cartCount: number;
  unreadNotifsCount: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRoleSwitch: (role: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  onOpenDrawer,
  currentUser,
  cartCount,
  unreadNotifsCount,
  language,
  onLanguageChange,
  searchQuery,
  onSearchChange,
  onRoleSwitch,
}) => {
  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-40 border-b border-emerald-900/50">
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Left: Drawer Toggle & Brand */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenDrawer}
            className="p-1.5 rounded-lg hover:bg-emerald-800 transition-colors focus:outline-none"
            title="Open Screen Directory"
          >
            <Menu className="w-5 h-5 text-emerald-100" />
          </button>

          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer flex items-center space-x-1.5 group"
          >
            <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center font-black text-lg shadow">
              🌱
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-lg leading-none tracking-tight text-amber-300 group-hover:text-amber-200 transition-colors">
                {getTranslation(language, 'appTitle')}
              </h1>
              <p className="text-[10px] sm:text-xs text-emerald-100 font-medium leading-none mt-0.5 hidden xs:block">
                {getTranslation(language, 'appSubtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={getTranslation(language, 'searchPlaceholder')}
              className="w-full bg-emerald-50 text-slate-900 placeholder-emerald-700/60 pl-9 pr-4 py-1.5 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all"
            />
          </div>
        </div>

        {/* Right Actions: AI Expert shortcut, Cart, Notifs, Role & Profile */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* AI Assistant Quick Pill */}
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="flex items-center space-x-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-full text-xs shadow transition-transform active:scale-95"
            title="AI Agricultural Expert"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-900 animate-pulse" />
            <span className="hidden sm:inline">AI Expert</span>
          </button>

          {/* Disease AI Shortcut */}
          <button
            onClick={() => onNavigate('disease-detection')}
            className="hidden lg:flex items-center space-x-1 bg-emerald-800 hover:bg-emerald-900 text-emerald-100 border border-emerald-600 px-2.5 py-1 rounded-full text-xs font-semibold shadow"
            title="Disease Detection AI"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
            <span>Disease AI</span>
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => onNavigate('cart')}
            className="relative p-1.5 rounded-lg hover:bg-emerald-800 transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-emerald-100" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Notifications Icon */}
          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-1.5 rounded-lg hover:bg-emerald-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-emerald-100" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* User Role Badge & Profile */}
          <div className="flex items-center space-x-1 bg-emerald-800/80 p-1 rounded-full border border-emerald-600/50">
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full hover:bg-emerald-700 transition-colors"
            >
              <img
                src={currentUser.profilePic || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-400"
              />
              <span className="text-xs font-bold text-white max-w-[80px] truncate hidden sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
            </button>

            {/* Role Switcher Pill */}
            <select
              value={currentUser.role}
              onChange={(e) => onRoleSwitch(e.target.value)}
              className="bg-emerald-950 text-amber-300 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full outline-none border border-emerald-700 cursor-pointer"
              title="Switch Role"
            >
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
              <option value="supplier">Supplier</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sub Header Search for Mobile */}
      <div className="px-3 pb-2.5 block md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={getTranslation(language, 'searchPlaceholder')}
            className="w-full bg-emerald-50 text-slate-900 placeholder-emerald-700/60 pl-9 pr-4 py-1 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
          />
        </div>
      </div>
    </header>
  );
};
