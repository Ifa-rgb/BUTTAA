import React, { useState } from 'react';
import { Product, ScreenId, Language } from '../types';
import {
  ArrowLeft,
  MapPin,
  Star,
  CheckCircle,
  Phone,
  MessageSquare,
  ShoppingBag,
  ShieldCheck,
  Truck,
  User,
  Plus,
  Minus
} from 'lucide-react';
import { getTranslation } from '../i18n';

interface ProductDetailsScreenProps {
  product: Product | null;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  onNavigate,
  language,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);

  if (!product) {
    return (
      <div className="p-8 text-center bg-slate-50 min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-slate-600 mb-4">No product selected.</p>
        <button
          onClick={onBack}
          className="bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    if (!product.reviews) product.reviews = [];
    product.reviews.unshift({
      id: `rev-${Date.now()}`,
      userName: 'Abebe T. (Buyer)',
      rating: reviewRating,
      comment: newReviewComment,
      date: 'Just now',
    });
    setNewReviewComment('');
  };

  return (
    <div className="pb-20 bg-slate-50 min-h-[85vh]">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors flex items-center space-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Back</span>
        </button>
        <span className="font-extrabold text-sm text-slate-900 truncate max-w-[200px]">
          {product.title}
        </span>
        <button
          onClick={() => onNavigate('cart')}
          className="p-1.5 text-slate-700 hover:text-emerald-700"
        >
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Main Product Card */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
          <div className="relative aspect-video sm:aspect-[21/9] bg-slate-100">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.isOrganic && (
              <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full shadow flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Certified Organic</span>
              </span>
            )}
            <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-lg flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{product.location}</span>
            </span>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {product.category}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {product.title}
                </h1>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-emerald-700 block">
                  {product.price.toLocaleString()} ETB
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  per {product.unit}
                </span>
              </div>
            </div>

            {/* Rating & Stock Info */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 border-y border-slate-100 py-3">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-extrabold text-slate-900">{product.rating}</span>
                <span className="text-slate-400">({product.reviewsCount} reviews)</span>
              </div>
              <div>•</div>
              <div className="text-emerald-700 font-bold">
                In Stock: {product.availableQuantity} {product.unit}s
              </div>
              <div>•</div>
              <div className="flex items-center space-x-1 text-slate-500">
                <Truck className="w-3.5 h-3.5" />
                <span>Regional Express Delivery</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Product Description</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Farmer Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-lg shadow">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{product.farmerName}</h4>
                  <p className="text-xs text-slate-500 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{product.location}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={`tel:${product.farmerPhone}`}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Farmer</span>
                </a>
                <button
                  onClick={() => onNavigate('chat')}
                  className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800">Select Quantity ({product.unit}):</span>
                <div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-slate-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-extrabold text-sm px-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.availableQuantity, quantity + 1))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onAddToCart(product, quantity)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={() => onBuyNow(product, quantity)}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow flex items-center justify-center space-x-2"
                >
                  <span>Checkout Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-lg font-black text-slate-900">
            Customer Reviews & Ratings ({product.reviews?.length || 0})
          </h3>

          <form onSubmit={handleAddReview} className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-200">
            <label className="block text-xs font-bold text-slate-700">Leave a Product Review</label>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs text-slate-500 font-medium">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className={`text-base ${star <= reviewRating ? 'text-amber-400' : 'text-slate-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              placeholder="Share your experience with this crop quality or farmer..."
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              rows={2}
            ></textarea>
            <button
              type="submit"
              className="bg-emerald-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs shadow"
            >
              Submit Review
            </button>
          </form>

          <div className="space-y-3">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((rev) => (
                <div key={rev.id} className="border-b border-slate-100 pb-3 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900">{rev.userName}</span>
                    <span className="text-slate-400 text-[10px]">{rev.date}</span>
                  </div>
                  <div className="flex items-center text-amber-400 text-xs mb-1">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className="text-slate-600">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
