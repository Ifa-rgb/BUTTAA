import React from 'react';
import { CartItem, ScreenId, Language } from '../types';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ArrowRight } from 'lucide-react';
import { getTranslation } from '../i18n';

interface CartScreenProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigate: (screen: ScreenId) => void;
  onBack?: () => void;
  language: Language;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  onBack,
  language,
}) => {
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 350 : 0; // Regional transport estimate
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="pb-20 bg-slate-50 min-h-[85vh]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack || (() => onNavigate('home'))}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 flex items-center space-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Continue Shopping</span>
        </button>
        <h2 className="font-extrabold text-base text-slate-900">
          {getTranslation(language, 'cart')} ({cart.length})
        </h2>
        <ShoppingBag className="w-5 h-5 text-emerald-700" />
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your Shopping Cart is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Browse our fresh agricultural harvest, crops, certified seeds, and modern farming equipment to add items.
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow transition-colors"
            >
              Explore Marketplace
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white p-3.5 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">
                      {item.product.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Farmer: {item.product.farmerName} • {item.product.location}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-sm text-emerald-700">
                        {(item.product.price * item.quantity).toLocaleString()} ETB
                      </span>

                      <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded text-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs px-1.5">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded text-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Order Summary
              </h3>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Produce</span>
                  <span className="font-bold text-slate-900">{subtotal.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Regional Logistics Delivery</span>
                  <span className="font-bold text-slate-900">{deliveryFee.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Grand Total</span>
                  <span className="text-emerald-700">{grandTotal.toLocaleString()} ETB</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow flex items-center justify-center space-x-2 transition-colors mt-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
