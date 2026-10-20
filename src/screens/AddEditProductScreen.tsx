import React, { useState, useEffect } from 'react';
import { Product, ProductCategory, User, ScreenId } from '../types';
import { ArrowLeft, Save, PlusCircle, CheckCircle } from 'lucide-react';

interface AddEditProductScreenProps {
  productToEdit: Product | null;
  currentUser: User;
  onSaveProduct: (product: Product) => void;
  onBack: () => void;
}

export const AddEditProductScreen: React.FC<AddEditProductScreenProps> = ({
  productToEdit,
  currentUser,
  onSaveProduct,
  onBack,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Coffee');
  const [price, setPrice] = useState<number>(1000);
  const [unit, setUnit] = useState<string>('Quintal (100kg)');
  const [quantity, setQuantity] = useState<number>(10);
  const [location, setLocation] = useState(currentUser.location || 'Jimma, Oromia');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80');
  const [isOrganic, setIsOrganic] = useState<boolean>(true);

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setUnit(productToEdit.unit);
      setQuantity(productToEdit.availableQuantity);
      setLocation(productToEdit.location);
      setDescription(productToEdit.description);
      setImage(productToEdit.image);
      setIsOrganic(!!productToEdit.isOrganic);
    }
  }, [productToEdit]);

  const categoriesList: ProductCategory[] = [
    'Coffee',
    'Cereals',
    'Fruits',
    'Vegetables',
    'Honey',
    'Livestock',
    'Dairy Products',
    'Poultry',
    'Flowers',
    'Fish',
    'Spices',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrUpdatedProduct: Product = {
      id: productToEdit ? productToEdit.id : `prod-${Date.now()}`,
      title,
      category,
      price: Number(price),
      unit,
      availableQuantity: Number(quantity),
      location,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      rating: productToEdit ? productToEdit.rating : 4.9,
      reviewsCount: productToEdit ? productToEdit.reviewsCount : 1,
      image,
      description,
      isOrganic,
    };

    onSaveProduct(newOrUpdatedProduct);
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
        <h2 className="font-extrabold text-base text-slate-900">
          {productToEdit ? 'Edit Product Listing' : 'List New Produce for Sale'}
        </h2>
        <Save className="w-5 h-5 text-emerald-700" />
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product / Crop Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grade 1 Sun-Dried Arabica Coffee Beans"
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price (ETB)</label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Unit of Measurement</label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. Quintal (100kg), Kg, Liter, Head"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Available Quantity</label>
              <input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm / Store Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Image URL</label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe crop variety, harvest condition, moisture content, organic practices..."
              className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="org"
              checked={isOrganic}
              onChange={(e) => setIsOrganic(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="org" className="text-xs font-bold text-slate-800 cursor-pointer">
              100% Certified Organic / Naturally Grown
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl text-xs sm:text-sm shadow flex items-center justify-center space-x-2 transition-colors mt-2"
          >
            <Save className="w-4 h-4" />
            <span>{productToEdit ? 'Save Changes' : 'Publish Produce Listing'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
