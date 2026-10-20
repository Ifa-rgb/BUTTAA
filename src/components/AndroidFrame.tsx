import React from 'react';
import { ScreenId, Language } from '../types';

interface AndroidFrameProps {
  children: React.ReactNode;
  currentScreen?: ScreenId;
  onNavigate?: (screen: ScreenId) => void;
  onOpenDrawer?: () => void;
  unreadNotifsCount?: number;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  onGoBack?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F4F6F2] text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {children}
    </div>
  );
};
