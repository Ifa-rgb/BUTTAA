import React, { useState } from 'react';
import {
  ScreenId,
  User,
  Product,
  CartItem,
  Order,
  EquipmentItem,
  SeedItem,
  MarketPrice,
  Language,
  UserRole,
  FarmTaskLog
} from './types';
import {
  initialCurrentUser,
  initialProducts,
  initialEquipment,
  initialSeeds,
  initialMarketPrices,
  regionalWeather,
  learningArticles,
  nearbyPlaces,
  initialOrders,
  initialNotifications,
  initialFarmTaskLogs
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SidebarDrawer } from './components/SidebarDrawer';
import { AndroidFrame } from './components/AndroidFrame';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { ProductDetailsScreen } from './screens/ProductDetailsScreen';
import { CategoriesScreen } from './screens/CategoriesScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { FarmerDashboardScreen } from './screens/FarmerDashboardScreen';
import { FarmTaskLogsScreen } from './screens/FarmTaskLogsScreen';
import { AddEditProductScreen } from './screens/AddEditProductScreen';
import { EquipmentScreen } from './screens/EquipmentScreen';
import { SeedMarketplaceScreen } from './screens/SeedMarketplaceScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { DiseaseDetectionScreen } from './screens/DiseaseDetectionScreen';
import { MarketPricesScreen } from './screens/MarketPricesScreen';
import { WeatherScreen } from './screens/WeatherScreen';
import { AuthScreens } from './screens/AuthScreens';
import { ProfileScreen } from './screens/ProfileScreen';

import {
  BookOpen,
  MessageSquare,
  Bell,
  User as UserIcon,
  Settings as SettingsIcon,
  HelpCircle,
  Shield,
  CheckCircle,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Send,
  Sparkles,
  Lock,
  Search,
  Star,
  Award,
  Globe,
  Trash2
} from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenId[]>(['home']);
  const [currentUser, setCurrentUser] = useState<User>(initialCurrentUser);
  const [language, setLanguage] = useState<Language>('EN');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // App Data State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProducts[0]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([
    { product: initialProducts[0], quantity: 1 }
  ]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [equipment] = useState<EquipmentItem[]>(initialEquipment);
  const [seeds] = useState<SeedItem[]>(initialSeeds);
  const [marketPrices] = useState<MarketPrice[]>(initialMarketPrices);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [farmTaskLogs, setFarmTaskLogs] = useState<FarmTaskLog[]>(initialFarmTaskLogs);

  // Chat message state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', sender: 'buyer', name: 'Mulugeta (Buyer)', text: 'Hello! Is the Grade 1 Coffee available for immediate dispatch to Addis?', time: '10:15 AM' },
    { id: '2', sender: 'user', name: 'You (Gadaa)', text: 'Yes! We have 25 quintals ready in dry storage in Jimma.', time: '10:18 AM' }
  ]);

  // Handlers
  const handleNavigate = (screen: ScreenId) => {
    setScreenHistory((prev) => {
      if (prev[prev.length - 1] === screen) return prev;
      return [...prev, screen];
    });
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    setScreenHistory((prev) => {
      if (prev.length <= 1) {
        setCurrentScreen('home');
        return ['home'];
      }
      const newHistory = prev.slice(0, -1);
      const target = newHistory[newHistory.length - 1] || 'home';
      setCurrentScreen(target);
      return newHistory;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate('product-details');
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setCurrentScreen('orders');
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } as Product : p))
      );
    } else {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        title: productData.title || 'New Harvest Product',
        category: productData.category || 'Cereals',
        price: productData.price || 1000,
        unit: productData.unit || 'Kg',
        availableQuantity: productData.availableQuantity || 10,
        location: productData.location || currentUser.location,
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        farmerPhone: currentUser.phone,
        rating: 5.0,
        reviewsCount: 0,
        image: productData.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
        description: productData.description || 'Fresh agricultural produce.',
        isOrganic: productData.isOrganic || false,
      };
      setProducts((prev) => [newProd, ...prev]);
    }
    setEditingProduct(null);
    setCurrentScreen('farmer-dashboard');
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddFarmTaskLog = (logData: Omit<FarmTaskLog, 'id'>) => {
    const newLog: FarmTaskLog = {
      ...logData,
      id: `log-${Date.now()}`
    };
    setFarmTaskLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateFarmTaskLog = (updatedLog: FarmTaskLog) => {
    setFarmTaskLogs((prev) =>
      prev.map((log) => (log.id === updatedLog.id ? updatedLog : log))
    );
  };

  const handleDeleteFarmTaskLog = (id: string) => {
    setFarmTaskLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const handleToggleFarmTaskLogStatus = (id: string) => {
    setFarmTaskLogs((prev) =>
      prev.map((log) => {
        if (log.id === id) {
          const nextStatus =
            log.status === 'Completed'
              ? 'In Progress'
              : log.status === 'In Progress'
              ? 'Scheduled'
              : 'Completed';
          return { ...log, status: nextStatus };
        }
        return log;
      })
    );
  };

  const handleAddAppNotification = (notifData: {
    title: string;
    body: string;
    type: 'order' | 'weather' | 'market' | 'alert' | 'general';
  }) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: notifData.title,
      body: notifData.body,
      timestamp: 'Just now',
      read: false,
      type: notifData.type
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role: newRole }));
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Render Screen Helper
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
      case 'onboarding':
      case 'login':
      case 'register':
      case 'forgot-password':
      case 'admin-login':
        return (
          <AuthScreens
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onLoginSuccess={(user) => setCurrentUser(user)}
          />
        );

      case 'home':
        return (
          <HomeScreen
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            language={language}
            weather={regionalWeather}
            marketPrices={marketPrices}
            searchQuery={searchQuery}
          />
        );

      case 'categories':
        return (
          <CategoriesScreen
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onBack={handleGoBack}
            language={language}
            searchQuery={searchQuery}
          />
        );

      case 'product-details':
        return selectedProduct ? (
          <ProductDetailsScreen
            product={selectedProduct}
            onBack={handleGoBack}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            language={language}
            onSelectProduct={handleSelectProduct}
            allProducts={products}
          />
        ) : (
          <div className="p-8 text-center text-slate-500">
            Product not found.
            <button onClick={() => handleNavigate('home')} className="mt-4 bg-emerald-700 text-white px-4 py-2 rounded-xl">
              Go Home
            </button>
          </div>
        );

      case 'cart':
        return (
          <CartScreen
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onNavigate={handleNavigate}
            onBack={handleGoBack}
            language={language}
          />
        );

      case 'checkout':
        return (
          <CheckoutScreen
            cart={cart}
            currentUser={currentUser}
            onPlaceOrder={handlePlaceOrder}
            onNavigate={handleNavigate}
            onBack={handleGoBack}
            language={language}
          />
        );

      case 'orders':
        return (
          <OrdersScreen
            orders={orders}
            onNavigate={handleNavigate}
            onBack={handleGoBack}
            language={language}
            currentUser={currentUser}
          />
        );

      case 'farmer-dashboard':
        return (
          <FarmerDashboardScreen
            currentUser={currentUser}
            products={products}
            orders={orders}
            farmTaskLogs={farmTaskLogs}
            onNavigate={handleNavigate}
            onEditProduct={(product) => {
              setEditingProduct(product);
              handleNavigate('edit-product');
            }}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddFarmTaskLog={handleAddFarmTaskLog}
            onAddNotification={handleAddAppNotification}
            onBack={handleGoBack}
            language={language}
          />
        );

      case 'farm-task-logs':
        return (
          <FarmTaskLogsScreen
            logs={farmTaskLogs}
            currentUser={currentUser}
            onAddLog={handleAddFarmTaskLog}
            onUpdateLog={handleUpdateFarmTaskLog}
            onDeleteLog={handleDeleteFarmTaskLog}
            onToggleStatus={handleToggleFarmTaskLogStatus}
            onAddNotification={handleAddAppNotification}
            onNavigate={handleNavigate}
            onBack={handleGoBack}
            language={language}
          />
        );

      case 'add-product':
        return (
          <AddEditProductScreen
            productToEdit={null}
            currentUser={currentUser}
            onSaveProduct={handleSaveProduct}
            onBack={handleGoBack}
          />
        );

      case 'edit-product':
        return (
          <AddEditProductScreen
            productToEdit={editingProduct}
            currentUser={currentUser}
            onSaveProduct={handleSaveProduct}
            onBack={handleGoBack}
          />
        );

      case 'equipment':
        return <EquipmentScreen equipment={equipment} onBack={handleGoBack} language={language} />;

      case 'seeds':
        return <SeedMarketplaceScreen seeds={seeds} onBack={handleGoBack} language={language} />;

      case 'ai-assistant':
        return <AIAssistantScreen onBack={handleGoBack} language={language} />;

      case 'disease-detection':
        return <DiseaseDetectionScreen onBack={handleGoBack} language={language} />;

      case 'market-prices':
        return <MarketPricesScreen marketPrices={marketPrices} onBack={handleGoBack} language={language} />;

      case 'weather':
        return <WeatherScreen weather={regionalWeather} onBack={handleGoBack} language={language} />;

      case 'learning-center':
        return (
          <div className="p-4 sm:p-6 pb-20 max-w-4xl mx-auto space-y-6">
            <div className="bg-emerald-800 text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
              <div>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Agri Academy
                </span>
                <h1 className="text-xl font-black text-amber-300 mt-1">Learning Center & Farmer Guides</h1>
                <p className="text-xs text-emerald-100">Modern farming techniques, soil health & livestock guides.</p>
              </div>
              <BookOpen className="w-10 h-10 text-amber-300 shrink-0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningArticles.map((article) => (
                <div key={article.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover rounded-xl mb-3" />
                    <div className="flex justify-between items-center mb-1">
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-md">
                        {article.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">{article.durationOrReadTime}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mb-1">{article.title}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-3">{article.excerpt}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-500 italic">By {article.author}</span>
                    <button onClick={() => alert(article.content)} className="text-emerald-700 font-extrabold hover:underline flex items-center space-x-1">
                      <span>Read Guide</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chat':
        return (
          <div className="p-4 max-w-2xl mx-auto pb-20">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 overflow-hidden flex flex-col h-[75vh]">
              <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center">
                    MA
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-white">Mulugeta Assefa (Buyer)</h2>
                    <p className="text-[10px] text-emerald-200">Green Grocery Addis • Verified Buyer</p>
                  </div>
                </div>
                <button onClick={() => handleNavigate('home')} className="text-xs bg-emerald-700 px-3 py-1 rounded-lg">Back</button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm font-medium shadow-sm ${
                      msg.sender === 'user' ? 'bg-emerald-700 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}>
                      <p className="font-bold text-[10px] opacity-80 mb-0.5">{msg.name}</p>
                      <p>{msg.text}</p>
                      <span className="text-[9px] opacity-70 block text-right mt-1">{msg.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type message to buyer..."
                  className="flex-1 bg-slate-100 text-xs sm:text-sm px-4 py-2.5 rounded-full border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-600"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && chatInput.trim()) {
                      setChatMessages((prev) => [
                        ...prev,
                        { id: `${Date.now()}`, sender: 'user', name: 'You (Gadaa)', text: chatInput, time: 'Just now' }
                      ]);
                      setChatInput('');
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (chatInput.trim()) {
                      setChatMessages((prev) => [
                        ...prev,
                        { id: `${Date.now()}`, sender: 'user', name: 'You (Gadaa)', text: chatInput, time: 'Just now' }
                      ]);
                      setChatInput('');
                    }
                  }}
                  className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="p-4 sm:p-6 pb-20 max-w-2xl mx-auto space-y-4">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <div>
                <h1 className="text-lg font-black text-slate-900">App Notifications</h1>
                <p className="text-xs text-slate-500">Orders, weather alerts, and market price changes</p>
              </div>
              <button
                onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  n.read ? 'bg-white border-slate-200/80' : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                }`}>
                  <div className="p-2 rounded-full bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                      <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <ProfileScreen
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onBack={handleGoBack}
            onNavigate={handleNavigate}
            language={language}
          />
        );

      case 'settings':
        return (
          <div className="p-4 sm:p-6 pb-20 max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h1 className="text-xl font-black text-slate-900 border-b pb-3">App Settings & Preferences</h1>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Language Selection</label>
                  <div className="flex gap-2">
                    {(['EN', 'OM', 'AM'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`flex-1 py-2 rounded-xl font-extrabold border transition-all ${
                          language === lang ? 'bg-emerald-700 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {lang === 'EN' ? 'English' : lang === 'OM' ? 'Afaan Oromoo' : 'Amharic (አማርኛ)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-800">Push Notifications</span>
                    <input type="checkbox" defaultChecked className="toggle accent-emerald-700" />
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-800">SMS Daily Market Price Alerts</span>
                    <input type="checkbox" defaultChecked className="toggle accent-emerald-700" />
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-semibold text-slate-800">Severe Weather Alerts</span>
                    <input type="checkbox" defaultChecked className="toggle accent-emerald-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help-center':
        return (
          <div className="p-4 sm:p-6 pb-20 max-w-2xl mx-auto space-y-6">
            <div className="bg-emerald-800 text-white p-6 rounded-2xl shadow-md">
              <h1 className="text-xl font-black text-amber-300 mb-1">BUTTAA Support & Help Center</h1>
              <p className="text-xs text-emerald-100">Need assistance with orders, payments, or farming advice?</p>
            </div>

            <div className="space-y-3">
              {[
                { q: 'How do I sell my agricultural produce on BUTTAA?', a: 'Click on List New Product from the menu or Farmer Dashboard. Fill in commodity details, photos, and price, then publish!' },
                { q: 'How does payment work?', a: 'We support Telebirr, CBE Birr, M-Pesa, Bank Transfer, and Cash on Delivery with escrow protection.' },
                { q: 'How do I use the AI Agronomist?', a: 'Tap the AI Expert button in the header or bottom navigation to ask questions or upload plant photos for disease identification.' }
              ].map((faq, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">{faq.q}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'admin-dashboard':
        return (
          <div className="p-4 sm:p-6 pb-20 max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
              <div>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  System Admin Mode
                </span>
                <h1 className="text-2xl font-black text-amber-300 mt-1">BUTTAA Admin Control Console</h1>
                <p className="text-xs text-slate-400">System metrics, pending farmer approvals, and platform transactions.</p>
              </div>
              <Shield className="w-10 h-10 text-amber-400 shrink-0" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                <span className="text-slate-500 text-[11px] font-bold block">Total Products</span>
                <span className="text-2xl font-black text-slate-900">{products.length}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                <span className="text-slate-500 text-[11px] font-bold block">Total Orders</span>
                <span className="text-2xl font-black text-emerald-700">{orders.length}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                <span className="text-slate-500 text-[11px] font-bold block">Active Farmers</span>
                <span className="text-2xl font-black text-amber-600">1,240</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
                <span className="text-slate-500 text-[11px] font-bold block">Platform Volume</span>
                <span className="text-xl font-black text-slate-900">4.2M ETB</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <HomeScreen
            products={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onNavigate={handleNavigate}
            language={language}
            weather={regionalWeather}
            marketPrices={marketPrices}
            searchQuery={searchQuery}
          />
        );
    }
  };

  const showHeaderAndNav = ![
    'splash',
    'onboarding',
    'login',
    'register',
    'forgot-password',
    'admin-login'
  ].includes(currentScreen);

  return (
    <AndroidFrame
      currentScreen={currentScreen}
      onNavigate={handleNavigate}
      onOpenDrawer={() => setIsDrawerOpen(true)}
      unreadNotifsCount={unreadNotifsCount}
      language={language}
      onLanguageChange={(lang) => setLanguage(lang)}
      onGoBack={handleGoBack}
    >
      <div className="min-h-full flex flex-col bg-[#F4F6F2]">
        {showHeaderAndNav && (
          <Header
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            currentUser={currentUser}
            cartCount={cartCount}
            unreadNotifsCount={unreadNotifsCount}
            language={language}
            onLanguageChange={setLanguage}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onRoleSwitch={handleRoleSwitch}
          />
        )}

        <main className="flex-1">
          {renderCurrentScreen()}
        </main>

        {showHeaderAndNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            role={currentUser.role}
            language={language}
          />
        )}

        <SidebarDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          role={currentUser.role}
          onRoleSwitch={handleRoleSwitch}
        />
      </div>
    </AndroidFrame>
  );
}
