import React from 'react';
import { Product, Order, User, ScreenId, FarmTaskLog, Language } from '../types';
import {
  TrendingUp,
  Package,
  PlusCircle,
  Clock,
  CheckCircle,
  Edit,
  Trash2,
  Tractor,
  DollarSign,
  ArrowLeft,
  MapPin,
  ClipboardList,
  Droplets,
  CalendarDays
} from 'lucide-react';
import { IrrigationAlertCard } from '../components/IrrigationAlertCard';
import { CropRotationPlannerCard } from '../components/CropRotationPlannerCard';

interface FarmerDashboardScreenProps {
  currentUser: User;
  products: Product[];
  orders: Order[];
  farmTaskLogs?: FarmTaskLog[];
  onNavigate: (screen: ScreenId) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onAddFarmTaskLog?: (log: Omit<FarmTaskLog, 'id'>) => void;
  onAddNotification?: (notif: {
    title: string;
    body: string;
    type: 'order' | 'weather' | 'market' | 'alert' | 'general';
  }) => void;
  onBack?: () => void;
  language?: Language;
}

export const FarmerDashboardScreen: React.FC<FarmerDashboardScreenProps> = ({
  currentUser,
  products,
  orders,
  farmTaskLogs = [],
  onNavigate,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddFarmTaskLog,
  onAddNotification,
  onBack,
  language
}) => {
  const myProducts = products.filter((p) => p.farmerId === currentUser.id || true);
  const totalSales = currentUser.earningsTotal || 184500;
  const pendingOrders = orders.filter((o) => o.status === 'Pending');

  return (
    <div className="pb-20 bg-slate-50 min-h-[85vh]">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 sm:p-6 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onBack || (() => onNavigate('home'))}
                className="p-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Farmer Management Hub
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-amber-300 mt-1">
              {currentUser.farmInfo?.farmName || 'My Organic Farm'}
            </h1>
            <p className="text-xs text-emerald-100 flex items-center space-x-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentUser.location} • {currentUser.farmInfo?.sizeHectares || 4.5} Hectares</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onNavigate('farm-task-logs')}
              className="bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-700 font-bold px-3.5 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center space-x-1.5 transition-transform active:scale-95"
            >
              <ClipboardList className="w-4 h-4 text-amber-400" />
              <span>Farm Task Logs</span>
            </button>

            <button
              onClick={() => onNavigate('add-product')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow flex items-center space-x-2 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Crop Produce</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Automated Smart Irrigation & Soil Sensor Alert Feature */}
        <IrrigationAlertCard
          onNavigate={onNavigate}
          onAddFarmTaskLog={onAddFarmTaskLog}
          onAddNotification={onAddNotification}
          farmerName={currentUser.name}
          farmLocation={currentUser.location}
        />

        {/* Automated Crop Rotation & Planting Planner (Analyzes Soil Data & Harvest History) */}
        <CropRotationPlannerCard
          farmTaskLogs={farmTaskLogs}
          onNavigate={onNavigate}
          onAddFarmTaskLog={onAddFarmTaskLog}
          onAddNotification={onAddNotification}
          farmerName={currentUser.name}
          farmLocation={currentUser.location}
        />

        {/* Farm Task Logs Highlight Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-4 rounded-2xl shadow-sm border border-emerald-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 font-black shadow">
              <CalendarDays className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase bg-emerald-800 text-amber-300 px-2 py-0.5 rounded-full">
                  Daily Activities
                </span>
                <span className="text-xs font-bold text-emerald-200">Track Farm Progress Over Time</span>
              </div>
              <p className="text-xs text-white mt-1 leading-relaxed">
                Log daily farm activities like <strong>planting</strong>, <strong>irrigation</strong>,{' '}
                <strong>harvest yields</strong>, and <strong>fertilizer applications</strong> with labor and cost metrics.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('farm-task-logs')}
            className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-4 py-2 rounded-xl shadow transition-transform active:scale-95 flex items-center space-x-1.5"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Open Task Logs</span>
          </button>
        </div>
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">Total Revenue</span>
            <span className="text-lg sm:text-xl font-black text-emerald-700 block mt-1">
              {totalSales.toLocaleString()} ETB
            </span>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">▲ +18.4% this month</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">Active Listings</span>
            <span className="text-lg sm:text-xl font-black text-slate-900 block mt-1">
              {myProducts.length} Items
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">In local marketplace</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">Pending Orders</span>
            <span className="text-lg sm:text-xl font-black text-amber-600 block mt-1">
              {pendingOrders.length} Orders
            </span>
            <span className="text-[10px] text-amber-700 font-semibold block mt-1">Needs confirmation</span>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 block">Main Crops</span>
            <span className="text-xs font-extrabold text-slate-800 block mt-1 truncate">
              {currentUser.farmInfo?.mainCrops.join(', ') || 'Coffee, Teff, Maize'}
            </span>
            <span className="text-[10px] text-emerald-600 block mt-1">100% Organic certified</span>
          </div>
        </div>

        {/* Pending Orders Section */}
        {pendingOrders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-3">
            <h3 className="font-black text-sm text-amber-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Incoming Orders Requiring Your Action ({pendingOrders.length})</span>
            </h3>

            <div className="space-y-2">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-3 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{ord.buyerName}</span>
                    <p className="text-slate-500">{ord.items.map((i) => `${i.productTitle} (${i.quantity})`).join(', ')}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-emerald-700">{ord.totalAmount.toLocaleString()} ETB</span>
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Accepted')}
                      className="bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs shadow"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Rejected')}
                      className="bg-red-600 text-white font-bold px-3 py-1 rounded-lg text-xs"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Listed Crop Produce */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-slate-900 text-base">My Product Inventory</h3>
            <button
              onClick={() => onNavigate('add-product')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Produce</span>
            </button>
          </div>

          <div className="space-y-3">
            {myProducts.map((p) => (
              <div
                key={p.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">{p.category}</span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{p.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      {p.price.toLocaleString()} ETB / {p.unit} • Qty: {p.availableQuantity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEditProduct(p)}
                    className="p-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center space-x-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDeleteProduct(p.id)}
                    className="p-2 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
