import React, { useState } from 'react';
import { CartItem, PaymentMethod, Order, ScreenId, User } from '../types';
import { ArrowLeft, CheckCircle, CreditCard, ShieldCheck, MapPin, Phone, User as UserIcon } from 'lucide-react';

interface CheckoutScreenProps {
  cart: CartItem[];
  currentUser: User;
  onPlaceOrder: (order: Order) => void;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  language?: string;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cart,
  currentUser,
  onPlaceOrder,
  onNavigate,
  onBack,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Telebirr');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    currentUser.location || 'Bole Atlas, Addis Ababa, Ethiopia'
  );
  const [buyerName, setBuyerName] = useState<string>(currentUser.name);
  const [buyerPhone, setBuyerPhone] = useState<string>(currentUser.phone);
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 350 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerId: currentUser.id,
      buyerName,
      buyerPhone,
      farmerId: cart[0]?.product.farmerId || 'u-101',
      items: cart.map((c) => ({
        productId: c.product.id,
        productTitle: c.product.title,
        unitPrice: c.product.price,
        unit: c.product.unit,
        quantity: c.quantity,
        image: c.product.image,
      })),
      totalAmount: grandTotal,
      paymentMethod,
      status: 'Pending',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryAddress,
      trackingCode: `BTT-${Math.floor(1000 + Math.random() * 9000)}-ETH`,
    };

    onPlaceOrder(newOrder);
    setOrderPlaced(newOrder);
  };

  if (orderPlaced) {
    return (
      <div className="p-6 max-w-md mx-auto my-8 bg-white rounded-2xl shadow-xl border border-slate-200 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-black text-slate-900">Order Placed Successfully!</h2>
        <p className="text-xs text-slate-500">
          Your order has been transmitted directly to the farmer & logistics team.
        </p>

        <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-200 font-medium">
          <div className="flex justify-between">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-bold text-slate-900">{orderPlaced.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Tracking Code:</span>
            <span className="font-bold text-emerald-700">{orderPlaced.trackingCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Option:</span>
            <span className="font-bold text-slate-900">{orderPlaced.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Amount:</span>
            <span className="font-bold text-slate-900">{orderPlaced.totalAmount.toLocaleString()} ETB</span>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <button
            onClick={() => onNavigate('orders')}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs shadow"
          >
            Track My Orders
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl text-xs"
          >
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-slate-50 min-h-[85vh]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack || (() => onNavigate('cart'))}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 flex items-center space-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Back to Cart</span>
        </button>
        <h2 className="font-extrabold text-base text-slate-900">Checkout & Payment</h2>
        <ShieldCheck className="w-5 h-5 text-emerald-700" />
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <form onSubmit={handleSubmitOrder} className="space-y-4">
          {/* Delivery Info */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              1. Delivery & Contact Details
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address & Destination</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              2. Select Payment Option
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { id: 'Telebirr', name: 'Telebirr Digital Money', desc: 'Instant mobile payment' },
                { id: 'CBE Birr', name: 'CBE Birr (Commercial Bank)', desc: 'Direct bank transfer' },
                { id: 'Cash on Delivery', name: 'Cash on Delivery', desc: 'Pay when produce arrives' },
                { id: 'M-Pesa', name: 'M-Pesa Safaricom', desc: 'Mobile money' },
                { id: 'Bank Transfer', name: 'Direct Bank Transfer', desc: 'Awash / Dashen / Zemen' },
              ].map((pm) => (
                <div
                  key={pm.id}
                  onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start space-x-2.5 ${
                    paymentMethod === pm.id
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="pm"
                    checked={paymentMethod === pm.id}
                    onChange={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className="mt-0.5 text-emerald-600"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{pm.name}</h4>
                    <p className="text-[10px] text-slate-500">{pm.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final Order Review */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              3. Order Review & Total
            </h3>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Total Items ({cart.length})</span>
                <span className="font-bold text-slate-900">{subtotal.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between">
                <span>Transport & Logistics</span>
                <span className="font-bold text-slate-900">{deliveryFee.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black text-slate-900">
                <span>Amount to Pay</span>
                <span className="text-emerald-700">{grandTotal.toLocaleString()} ETB</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl text-sm shadow transition-colors"
            >
              Confirm Order ({grandTotal.toLocaleString()} ETB)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
