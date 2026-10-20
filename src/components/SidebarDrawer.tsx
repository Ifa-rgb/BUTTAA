import React from 'react';
import {
  X,
  Home,
  Grid,
  ShoppingBag,
  CreditCard,
  Truck,
  LayoutDashboard,
  PlusCircle,
  Edit,
  ClipboardList,
  Tractor,
  Sprout,
  CloudSun,
  Bot,
  ShieldAlert,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Bell,
  User,
  Settings,
  HelpCircle,
  Shield,
  Layers,
  ChevronRight,
  Sparkles,
  Search,
  Lock,
  LogOut,
  Info
} from 'lucide-react';
import { ScreenId, UserRole } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  role: UserRole;
  onRoleSwitch: (role: UserRole) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  currentScreen,
  onNavigate,
  role,
  onRoleSwitch,
}) => {
  if (!isOpen) return null;

  // 28 Android Screens categorized cleanly
  const screenCategories = [
    {
      title: '1. Onboarding & Auth',
      screens: [
        { id: 'splash' as ScreenId, name: '1. Splash Screen', icon: Sparkles },
        { id: 'onboarding' as ScreenId, name: '2. Onboarding Flow', icon: Info },
        { id: 'login' as ScreenId, name: '3. User Login', icon: Lock },
        { id: 'register' as ScreenId, name: '4. Register Account', icon: User },
        { id: 'forgot-password' as ScreenId, name: '5. Forgot Password', icon: Lock },
      ],
    },
    {
      title: '2. Marketplace & Buyers',
      screens: [
        { id: 'home' as ScreenId, name: '6. Home Marketplace', icon: Home },
        { id: 'categories' as ScreenId, name: '7. Crop Categories & Filters', icon: Grid },
        { id: 'product-details' as ScreenId, name: '8. Product Details', icon: Layers },
        { id: 'cart' as ScreenId, name: '9. Shopping Cart', icon: ShoppingBag },
        { id: 'checkout' as ScreenId, name: '10. Checkout & Payments', icon: CreditCard },
        { id: 'orders' as ScreenId, name: '11. Orders & Live Tracking', icon: Truck },
      ],
    },
    {
      title: '3. Farmer & Supply Hub',
      screens: [
        { id: 'farmer-dashboard' as ScreenId, name: '12. Farmer Dashboard & Sales', icon: LayoutDashboard },
        { id: 'farm-task-logs' as ScreenId, name: '13. Farm Task Logs & Progress', icon: ClipboardList, badge: 'NEW' },
        { id: 'add-product' as ScreenId, name: '14. List New Product', icon: PlusCircle },
        { id: 'edit-product' as ScreenId, name: '15. Edit Product Listing', icon: Edit },
        { id: 'equipment' as ScreenId, name: '16. Agricultural Equipment (Rent/Buy)', icon: Tractor },
        { id: 'seeds' as ScreenId, name: '17. Certified Seed Market', icon: Sprout },
      ],
    },
    {
      title: '4. Smart AI & Agricultural Tools',
      screens: [
        { id: 'ai-assistant' as ScreenId, name: '18. AI Agronomist Chat', icon: Bot, badge: 'AI' },
        { id: 'disease-detection' as ScreenId, name: '19. Crop Disease Photo AI', icon: ShieldAlert, badge: 'AI' },
        { id: 'weather' as ScreenId, name: '17. Weather & Rainfall Tips', icon: CloudSun },
        { id: 'market-prices' as ScreenId, name: '20. Daily Market Prices', icon: TrendingUp },
        { id: 'learning-center' as ScreenId, name: '21. Learning Center & Guides', icon: BookOpen },
        { id: 'chat' as ScreenId, name: '22. Messages & Buyer Chat', icon: MessageSquare },
        { id: 'notifications' as ScreenId, name: '23. Alerts & Notifications', icon: Bell },
      ],
    },
    {
      title: '5. Profile, Settings & Admin',
      screens: [
        { id: 'profile' as ScreenId, name: '24. My Profile & Farm Info', icon: User },
        { id: 'settings' as ScreenId, name: '25. Settings & Language', icon: Settings },
        { id: 'help-center' as ScreenId, name: '26. Help Center & Support', icon: HelpCircle },
        { id: 'admin-login' as ScreenId, name: '27. Admin Login', icon: Lock },
        { id: 'admin-dashboard' as ScreenId, name: '28. Admin Console Dashboard', icon: Shield },
      ],
    },
  ];

  const handleSelectScreen = (id: ScreenId) => {
    onNavigate(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Drawer Panel */}
      <div className="relative w-80 max-w-[85vw] bg-slate-900 text-slate-100 flex flex-col h-full shadow-2xl z-10 border-r border-slate-800">
        {/* Drawer Header */}
        <div className="p-4 bg-emerald-900 border-b border-emerald-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              🌱
            </div>
            <div>
              <h2 className="font-black text-amber-300 text-lg leading-tight">BUTTAA Directory</h2>
              <p className="text-[10px] text-emerald-200">Agricultural Platform Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-200 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Role Switch Box */}
        <div className="p-3 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Active Mode:</span>
          <div className="flex space-x-1">
            {(['farmer', 'buyer', 'supplier', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => onRoleSwitch(r)}
                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                  role === r
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* List of Screens */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {screenCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 mb-1.5 px-2">
                {category.title}
              </h3>
              <div className="space-y-0.5">
                {category.screens.map((screen) => {
                  const Icon = screen.icon;
                  const isActive = currentScreen === screen.id;
                  return (
                    <button
                      key={screen.id}
                      onClick={() => handleSelectScreen(screen.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white font-bold shadow'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                        <span className="truncate">{screen.name}</span>
                      </div>
                      {screen.badge && (
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full ml-1">
                          {screen.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 text-center">
          BUTTAA v2.5 • Powered by Gemini AI
        </div>
      </div>
    </div>
  );
};
