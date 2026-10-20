import React from 'react';
import { Order, User, ScreenId } from '../types';
import { ArrowLeft, Truck, CheckCircle, Clock, XCircle, Phone, MapPin, Package } from 'lucide-react';

interface OrdersScreenProps {
  orders: Order[];
  currentUser: User;
  onUpdateOrderStatus?: (orderId: string, status: Order['status']) => void;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  language?: string;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  orders,
  currentUser,
  onUpdateOrderStatus,
  onNavigate,
  onBack,
}) => {
  return (
    <div className="pb-20 bg-slate-50 min-h-[85vh]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack || (() => onNavigate('home'))}
          className="p-1 rounded-full hover:bg-slate-100 text-slate-700 flex items-center space-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Back</span>
        </button>
        <h2 className="font-extrabold text-base text-slate-900">
          My Orders & Live Logistics Tracking
        </h2>
        <Truck className="w-5 h-5 text-emerald-700" />
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-3 my-8">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Orders Found</h3>
            <p className="text-xs text-slate-500">
              You haven't placed or received any orders yet.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3"
            >
              <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs font-black text-slate-900 block">{order.id}</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Date: {order.orderDate} • Track: {order.trackingCode}
                  </span>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : order.status === 'In Transit'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'Accepted'
                      ? 'bg-amber-100 text-amber-800'
                      : order.status === 'Rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {order.status === 'Delivered' && <CheckCircle className="w-3.5 h-3.5" />}
                  {order.status === 'In Transit' && <Truck className="w-3.5 h-3.5" />}
                  {order.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                  <span>{order.status}</span>
                </span>
              </div>

              {/* Items in order */}
              <div className="space-y-2">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-xs">
                    <img
                      src={it.image}
                      alt={it.productTitle}
                      className="w-12 h-12 rounded-lg object-cover bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{it.productTitle}</h4>
                      <p className="text-slate-500">
                        {it.quantity} {it.unit}s @ {it.unitPrice.toLocaleString()} ETB
                      </p>
                    </div>
                    <span className="font-bold text-slate-900">
                      {(it.quantity * it.unitPrice).toLocaleString()} ETB
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Meta */}
              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-200">
                <div className="flex justify-between">
                  <span>Buyer:</span>
                  <span className="font-bold text-slate-900">{order.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-bold text-emerald-700">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Address:</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[200px]">{order.deliveryAddress}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div>
                  <span className="text-xs text-slate-500">Total: </span>
                  <span className="text-base font-black text-slate-900">
                    {order.totalAmount.toLocaleString()} ETB
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <a
                    href={`tel:${order.buyerPhone}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Call</span>
                  </a>

                  {currentUser.role === 'farmer' && order.status === 'Pending' && (
                    <>
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Accepted')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow"
                      >
                        Accept Order
                      </button>
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {order.status === 'Accepted' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'In Transit')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow"
                    >
                      Mark In Transit
                    </button>
                  )}

                  {order.status === 'In Transit' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
