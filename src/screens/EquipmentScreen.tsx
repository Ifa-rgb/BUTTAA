import React, { useState } from 'react';
import { EquipmentItem, ScreenId, Language } from '../types';
import { Tractor, Phone, Calendar, ArrowLeft, CheckCircle, Search, ShieldCheck } from 'lucide-react';

interface EquipmentScreenProps {
  equipment: EquipmentItem[];
  onBack: () => void;
  language: Language;
}

export const EquipmentScreen: React.FC<EquipmentScreenProps> = ({
  equipment,
  onBack,
  language,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rentModalItem, setRentModalItem] = useState<EquipmentItem | null>(null);
  const [rentalDays, setRentalDays] = useState<number>(3);
  const [rentalConfirmed, setRentalConfirmed] = useState<boolean>(false);

  const categories = ['All', 'Tractor', 'Water Pump', 'Harvester', 'Sprayer', 'Irrigation System'];

  const filtered = equipment.filter((eq) => {
    const matchesCat = selectedCategory === 'All' || eq.category === selectedCategory;
    const matchesSearch =
      eq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleConfirmRental = (e: React.FormEvent) => {
    e.preventDefault();
    setRentalConfirmed(true);
    setTimeout(() => {
      setRentalConfirmed(false);
      setRentModalItem(null);
    }, 2500);
  };

  return (
    <div className="pb-20 bg-slate-50 min-h-[85vh]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 rounded-full hover:bg-slate-100 text-slate-700 flex items-center space-x-1"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-xs font-bold hidden sm:inline">Back</span>
        </button>
        <h2 className="font-extrabold text-base text-slate-900 flex items-center space-x-1.5">
          <Tractor className="w-5 h-5 text-amber-600" />
          <span>Agricultural Machinery & Equipment</span>
        </h2>
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
          Rent / Buy
        </span>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Search & Categories Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tractors, water pumps, harvesters, suppliers..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === c
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Equipment Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 flex flex-col justify-between transition-all"
            >
              <div className="relative aspect-video bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.specifications}
                  </p>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 border border-slate-200">
                  {item.availableForRent && (
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-600">Daily Rent Rate:</span>
                      <span className="text-emerald-700">{item.rentPricePerDay.toLocaleString()} ETB / Day</span>
                    </div>
                  )}
                  {item.availableForBuy && (
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-600">Purchase Price:</span>
                      <span className="text-slate-900">{item.buyPrice.toLocaleString()} ETB</span>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                    Supplier: <span className="font-bold text-slate-700">{item.supplierName}</span> ({item.location})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRentModalItem(item)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs shadow flex items-center justify-center space-x-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Rent Machinery</span>
                  </button>
                  <a
                    href={`tel:${item.supplierPhone}`}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Supplier</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rent Machinery Modal */}
      {rentModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            {rentalConfirmed ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-black text-slate-900">Rental Booking Submitted!</h3>
                <p className="text-xs text-slate-600">
                  {rentModalItem.supplierName} has been notified and will contact you regarding delivery to your farm location.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="font-black text-slate-900 text-sm">Rent {rentModalItem.title}</h3>
                  <button
                    onClick={() => setRentModalItem(null)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleConfirmRental} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rental Duration (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={rentalDays}
                      onChange={(e) => setRentalDays(Number(e.target.value))}
                      className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 font-bold text-sm"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 font-medium">
                    <div className="flex justify-between">
                      <span>Rate Per Day:</span>
                      <span className="font-bold">{rentModalItem.rentPricePerDay.toLocaleString()} ETB</span>
                    </div>
                    <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-200">
                      <span>Total Rental Cost ({rentalDays} Days):</span>
                      <span className="text-emerald-700">
                        {(rentModalItem.rentPricePerDay * rentalDays).toLocaleString()} ETB
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl shadow"
                  >
                    Confirm Machinery Rental
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
