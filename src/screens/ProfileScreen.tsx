import React, { useState, useRef } from 'react';
import { User, UserRole, Language, ScreenId } from '../types';
import {
  ArrowLeft,
  Camera,
  Upload,
  User as UserIcon,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle,
  Edit3,
  Save,
  Tractor,
  ShoppingBag,
  Store,
  Shield,
  Sparkles,
  RefreshCw,
  Building,
  Sprout
} from 'lucide-react';
import { getTranslation } from '../i18n';

interface ProfileScreenProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onBack: () => void;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
}

const AVATAR_PRESETS = [
  {
    label: 'Farmer',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    desc: 'Oromia Coffee & Teff Grower'
  },
  {
    label: 'Buyer',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    desc: 'Addis Commodity Exporter'
  },
  {
    label: 'Supplier',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    desc: 'Agro-Inputs & Machinery Dealer'
  },
  {
    label: 'Admin',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    desc: 'Ministry & ECX Platform Manager'
  }
];

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  currentUser,
  onUpdateUser,
  onBack,
  onNavigate,
  language,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [location, setLocation] = useState(currentUser.location);
  const [role, setRole] = useState<UserRole>(currentUser.role);
  const [profilePic, setProfilePic] = useState<string>(
    currentUser.profilePic || AVATAR_PRESETS[0].url
  );
  const [bio, setBio] = useState(
    currentUser.bio ||
      'Dedicated agricultural stakeholder committed to food security, quality crop production, and transparent fair trade in Ethiopia.'
  );

  // Farmer-specific state
  const [farmName, setFarmName] = useState(currentUser.farmInfo?.farmName || 'Gadaa Valley Agro-Farm');
  const [sizeHectares, setSizeHectares] = useState<number>(currentUser.farmInfo?.sizeHectares || 12.5);
  const [mainCrops, setMainCrops] = useState<string>(
    currentUser.farmInfo?.mainCrops?.join(', ') || 'Coffee (Arabica), White Teff (Magna), Red Creole Onions, Barley'
  );

  // Buyer-specific state
  const [buyerCompany, setBuyerCompany] = useState(
    currentUser.buyerInfo?.companyName || 'Addis Premium Agro-Exports PLC'
  );
  const [buyerType, setBuyerType] = useState(
    currentUser.buyerInfo?.businessType || 'Wholesale Commodity Exporter'
  );
  const [buyerCategories, setBuyerCategories] = useState(
    currentUser.buyerInfo?.purchaseCategories?.join(', ') || 'Specialty Coffee, Magna Teff, Pulses, Oilseeds'
  );

  // Supplier-specific state
  const [supplierStore, setSupplierStore] = useState(
    currentUser.supplierInfo?.companyName || 'Oromia Certified Seed & Agri-Tool Depot'
  );
  const [supplierCategories, setSupplierCategories] = useState(
    currentUser.supplierInfo?.supplyCategories?.join(', ') || 'Certified Hybrid Seeds, Bio-Fertilizers, Solar Pumps, Sprayers'
  );
  const [tinNumber, setTinNumber] = useState(
    currentUser.supplierInfo?.tinNumber || 'ET-0098452174'
  );

  // Admin-specific state
  const [department, setDepartment] = useState(
    currentUser.adminInfo?.department || 'Ministry of Agriculture & ECX Digital Operations'
  );
  const [accessLevel, setAccessLevel] = useState(
    currentUser.adminInfo?.accessLevel || 'Super Admin (Full Verification & Tariff Authority)'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload from file or camera
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Please choose an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfilePic(reader.result);
          setShowPresets(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser: User = {
      ...currentUser,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      role,
      profilePic,
      bio: bio.trim(),
      farmInfo: {
        farmName: farmName.trim(),
        sizeHectares: Number(sizeHectares) || 1,
        mainCrops: mainCrops.split(',').map((c) => c.trim()).filter(Boolean),
        locationCoords: currentUser.farmInfo?.locationCoords,
      },
      buyerInfo: {
        companyName: buyerCompany.trim(),
        purchaseCategories: buyerCategories.split(',').map((c) => c.trim()).filter(Boolean),
        businessType: buyerType.trim(),
      },
      supplierInfo: {
        companyName: supplierStore.trim(),
        supplyCategories: supplierCategories.split(',').map((c) => c.trim()).filter(Boolean),
        tinNumber: tinNumber.trim(),
      },
      adminInfo: {
        department: department.trim(),
        accessLevel: accessLevel.trim(),
      },
    };

    onUpdateUser(updatedUser);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const roleBadgeColors: Record<UserRole, { bg: string; text: string; icon: any; label: string }> = {
    farmer: { bg: 'bg-emerald-500', text: 'text-slate-950', icon: Tractor, label: 'Farmer / Producer' },
    buyer: { bg: 'bg-blue-500', text: 'text-white', icon: ShoppingBag, label: 'Buyer / Wholesaler' },
    supplier: { bg: 'bg-amber-400', text: 'text-slate-950', icon: Store, label: 'Input Supplier' },
    expert: { bg: 'bg-teal-400', text: 'text-slate-950', icon: Sprout, label: 'Agri Expert' },
    admin: { bg: 'bg-rose-500', text: 'text-white', icon: Shield, label: 'Platform Admin' },
  };

  const currentRoleConfig = roleBadgeColors[role] || roleBadgeColors.farmer;
  const RoleIcon = currentRoleConfig.icon;

  return (
    <div className="pb-24 bg-slate-50 min-h-[88vh]">
      {/* Top Header with Back Arrow */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3.5 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors flex items-center space-x-1.5 font-bold text-xs"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5 text-slate-800" />
          <span>{getTranslation(language, 'back') || 'Back'}</span>
        </button>

        <h1 className="font-extrabold text-base text-slate-900 flex items-center space-x-2">
          <UserIcon className="w-5 h-5 text-emerald-700" />
          <span>{getTranslation(language, 'profile')} &amp; Account</span>
        </h1>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            isEditing
              ? 'bg-slate-800 text-white hover:bg-slate-700'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white'
          }`}
        >
          {isEditing ? (
            <>
              <span>Cancel</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="bg-emerald-500 text-white p-4 rounded-2xl shadow-md flex items-center space-x-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-white shrink-0" />
            <div className="text-xs font-bold">
              Profile updated successfully! All farm and account details saved.
            </div>
          </div>
        )}

        {/* Profile Hero Header Card */}
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
            {/* Avatar with Camera / Upload Trigger */}
            <div className="relative group shrink-0">
              <img
                src={profilePic}
                alt={name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-amber-400 shadow-xl bg-slate-800"
              />

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-950/50 hover:bg-slate-950/70 rounded-full flex flex-col items-center justify-center text-white opacity-90 transition-opacity cursor-pointer group-hover:opacity-100"
                title="Click to upload profile photo from your device"
              >
                <Camera className="w-6 h-6 text-amber-300 drop-shadow" />
                <span className="text-[10px] font-bold mt-1 text-amber-200">Upload Photo</span>
              </button>

              {/* Verified Badge */}
              <div
                className="absolute bottom-0 right-1 bg-emerald-500 text-white p-1 rounded-full ring-2 ring-slate-900 shadow"
                title="Verified BUTTAA User"
              >
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            {/* User Meta Information */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-amber-300 tracking-tight">{name}</h2>
                <span className={`inline-flex items-center space-x-1 ${currentRoleConfig.bg} ${currentRoleConfig.text} text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase shadow-xs`}>
                  <RoleIcon className="w-3 h-3" />
                  <span>{currentRoleConfig.label}</span>
                </span>
              </div>

              <p className="text-xs text-emerald-100 flex items-center justify-center sm:justify-start space-x-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{location}</span>
              </p>

              <div className="text-xs text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
                <span className="flex items-center space-x-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>{phone}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-emerald-400" />
                  <span>{email}</span>
                </span>
              </div>

              <p className="text-xs text-emerald-200/90 italic pt-1 max-w-md">
                "{bio}"
              </p>
            </div>
          </div>

          {/* Quick Photo Upload & Presets Actions */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/15 hover:bg-white/25 text-white font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all text-xs"
              >
                <Upload className="w-3.5 h-3.5 text-amber-300" />
                <span>Choose Photo from Device</span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="bg-white/15 hover:bg-white/25 text-white font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1.5 transition-all text-xs"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-300" />
                <span>Take Photo</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="text-amber-300 hover:text-amber-200 font-bold text-xs flex items-center space-x-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{showPresets ? 'Hide Avatar Presets' : 'Choose Avatar Preset'}</span>
            </button>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleImageFileChange}
          />

          {/* Avatar Presets Selector Tray */}
          {showPresets && (
            <div className="mt-4 p-3 bg-slate-950/80 rounded-2xl border border-emerald-500/30 animate-fadeIn">
              <div className="text-[11px] font-bold text-amber-300 mb-2">Select a Role Avatar Preset:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setProfilePic(preset.url);
                      setShowPresets(false);
                    }}
                    className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                      profilePic === preset.url
                        ? 'border-amber-400 bg-amber-400/20'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-white/30"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-white text-xs">{preset.label}</div>
                      <div className="text-[10px] text-slate-300 truncate">{preset.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Selector Tabs */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Switch Account Role</h3>
              <p className="text-xs text-slate-500">Test and manage profiles as a Farmer, Buyer, Supplier, or Admin</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
              4 Roles Supported
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'farmer' as UserRole, label: 'Farmer', icon: Tractor, desc: 'Sell Harvest & Manage Farm' },
                { id: 'buyer' as UserRole, label: 'Buyer', icon: ShoppingBag, desc: 'Wholesale & Orders' },
                { id: 'supplier' as UserRole, label: 'Supplier', icon: Store, desc: 'Seeds & Farm Tools' },
                { id: 'admin' as UserRole, label: 'Admin', icon: Shield, desc: 'System & Verification' },
              ] as const
            ).map((r) => {
              const Icon = r.icon;
              const isSelected = role === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRole(r.id);
                  }}
                  className={`p-3 rounded-2xl border text-left flex flex-col space-y-1.5 transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                    {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />}
                  </div>
                  <span className="text-xs font-black">{r.label}</span>
                  <span className="text-[10px] text-slate-500 leading-tight">{r.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Edit Profile Form / Profile Information View */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-emerald-700" />
                <span>{isEditing ? 'Edit Profile Details' : 'Account Details'}</span>
              </h3>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  Edit Information
                </button>
              )}
            </div>

            {/* Basic Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                  />
                ) : (
                  <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                  />
                ) : (
                  <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                  />
                ) : (
                  <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Location / Region</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                  />
                ) : (
                  <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {location}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Statement</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                />
              ) : (
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {bio}
                </div>
              )}
            </div>
          </div>

          {/* Role-Specific Information Section */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center space-x-2">
                <RoleIcon className="w-4 h-4 text-emerald-700" />
                <span>
                  {role === 'farmer' && 'Farmer & Land Details'}
                  {role === 'buyer' && 'Buyer & Procurement Business Details'}
                  {role === 'supplier' && 'Agro-Dealer & Supply Inventory Details'}
                  {role === 'admin' && 'Admin Governance & Compliance Details'}
                </span>
              </h3>
              <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                {role}
              </span>
            </div>

            {/* Farmer Fields */}
            {role === 'farmer' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Farm / Cooperative Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {farmName}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Land Size (Hectares)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.5"
                        value={sizeHectares}
                        onChange={(e) => setSizeHectares(Number(e.target.value))}
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {sizeHectares} Hectares
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Crops Cultivated (comma-separated)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={mainCrops}
                      onChange={(e) => setMainCrops(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {mainCrops.split(',').map((c) => (
                        <span key={c} className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                          🌱 {c.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Buyer Fields */}
            {role === 'buyer' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company / Trade Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={buyerCompany}
                        onChange={(e) => setBuyerCompany(e.target.value)}
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {buyerCompany}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Procurement Business Type</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={buyerType}
                        onChange={(e) => setBuyerType(e.target.value)}
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {buyerType}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Commodities Purchased</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={buyerCategories}
                      onChange={(e) => setBuyerCategories(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {buyerCategories.split(',').map((c) => (
                        <span key={c} className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                          🛒 {c.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Supplier Fields */}
            {role === 'supplier' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Agro-Dealership Store Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={supplierStore}
                        onChange={(e) => setSupplierStore(e.target.value)}
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {supplierStore}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tax Identification Number (TIN)</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tinNumber}
                        onChange={(e) => setTinNumber(e.target.value)}
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {tinNumber}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Supplied Inventory Catalog</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={supplierCategories}
                      onChange={(e) => setSupplierCategories(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {supplierCategories.split(',').map((c) => (
                        <span key={c} className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
                          📦 {c.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Admin Fields */}
            {role === 'admin' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Government / Authority Dept.</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {department}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Administrative Privileges</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={accessLevel}
                        onChange={(e) => setAccessLevel(e.target.value)}
                        className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-slate-300 focus:outline-emerald-600 bg-slate-50 focus:bg-white"
                      />
                    ) : (
                      <div className="text-xs font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {accessLevel}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save / Update Button */}
          {isEditing && (
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile &amp; Role Changes</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-5 rounded-2xl transition-all"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        {/* Quick Hub Navigation Shortcuts */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="font-extrabold text-slate-900 text-sm">Quick Hub Shortcuts</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
            <button
              onClick={() => onNavigate('farmer-dashboard')}
              className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-2xl border border-slate-200 text-left transition-all"
            >
              📊 Farmer Dashboard
            </button>
            <button
              onClick={() => onNavigate('orders')}
              className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-2xl border border-slate-200 text-left transition-all"
            >
              📦 My Orders
            </button>
            <button
              onClick={() => onNavigate('market-prices')}
              className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-2xl border border-slate-200 text-left transition-all"
            >
              📈 Market Prices
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="p-3 bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 rounded-2xl border border-slate-200 text-left transition-all"
            >
              🌱 Marketplace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
