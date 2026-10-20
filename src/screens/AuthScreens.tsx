import React, { useState } from 'react';
import { ScreenId, User } from '../types';
import { Lock, Mail, Phone, MapPin, User as UserIcon, ArrowRight, CheckCircle, Sparkles, Shield, ChevronRight } from 'lucide-react';

interface AuthScreensProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthScreens: React.FC<AuthScreensProps> = ({
  currentScreen,
  onNavigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('gadaa.farmer@buttaa.org');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Gadaa Tolasaa');
  const [phone, setPhone] = useState('+251 911 234 567');
  const [location, setLocation] = useState('Jimma, Oromia');
  const [role, setRole] = useState<'farmer' | 'buyer' | 'supplier' | 'admin'>('farmer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const loggedUser: User = {
      id: 'u-101',
      name: name || 'Gadaa Tolasaa',
      email: email || 'gadaa.farmer@buttaa.org',
      phone: phone || '+251 911 234 567',
      role: currentScreen === 'admin-login' ? 'admin' : role,
      location: location || 'Jimma, Oromia',
      profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      farmInfo: {
        farmName: 'Bona Organics Farm',
        sizeHectares: 4.5,
        mainCrops: ['Coffee', 'Maize', 'Avocado', 'Honey'],
      },
      earningsTotal: 184500,
    };
    onLoginSuccess(loggedUser);
    onNavigate(loggedUser.role === 'farmer' ? 'farmer-dashboard' : loggedUser.role === 'admin' ? 'admin-dashboard' : 'home');
  };

  if (currentScreen === 'splash') {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-5xl font-black shadow-2xl mb-6 animate-pulse">
          🌱
        </div>
        <h1 className="text-4xl font-black tracking-tight text-amber-300 mb-2">
          BUTTAA
        </h1>
        <p className="text-lg font-semibold text-emerald-100 max-w-sm mb-8">
          Smart Agricultural Marketplace & AI Agronomist Platform
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => onNavigate('onboarding')}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-emerald-800/80 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl border border-emerald-600 transition-colors"
          >
            Enter Marketplace
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'onboarding') {
    return (
      <div className="min-h-[80vh] bg-white p-6 flex flex-col justify-between max-w-md mx-auto">
        <div className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-black text-emerald-800">BUTTAA</span>
            <button
              onClick={() => onNavigate('home')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Skip
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden mb-6 shadow-md border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80"
              alt="Farmers"
              className="w-full h-48 object-cover"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Direct Farm Produce & AI Expert Advice
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Sell crops directly to buyers without middlemen, access daily market prices, rent machinery, buy certified seeds, and diagnose crop diseases with AI.
          </p>

          <div className="space-y-2 mb-6">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Direct buyer-seller messaging & Telebirr/CBE payments</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>AI leaf disease diagnosis & fertilizer guidance</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-700">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Regional weather forecasts & daily commodity prices</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pb-4">
          <button
            onClick={() => onNavigate('register')}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow transition-colors"
          >
            Create New Account
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-xl transition-colors"
          >
            I Already Have an Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-slate-50 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-emerald-100 text-emerald-700 mb-2">
            {currentScreen === 'admin-login' ? <Shield className="w-7 h-7" /> : <UserIcon className="w-7 h-7" />}
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {currentScreen === 'login'
              ? 'Welcome Back to BUTTAA'
              : currentScreen === 'register'
              ? 'Join BUTTAA Community'
              : currentScreen === 'forgot-password'
              ? 'Reset Password'
              : 'Admin Portal Login'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Smart Agricultural Marketplace for Farmers & Buyers
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {currentScreen === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g., Gadaa Tolasaa"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Role</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                >
                  <option value="farmer">Farmer (Sell produce, rent equipment, get AI tips)</option>
                  <option value="buyer">Buyer (Purchase crops, teff, fruits, honey)</option>
                  <option value="supplier">Supplier (Sell seeds, fertilizers, machinery)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="+251 911 ..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Farm / Market Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g., Jimma, Oromia"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {currentScreen !== 'forgot-password' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg shadow transition-colors mt-2"
          >
            {currentScreen === 'login'
              ? 'Sign In'
              : currentScreen === 'register'
              ? 'Complete Registration'
              : currentScreen === 'forgot-password'
              ? 'Send Reset Link'
              : 'Admin Dashboard Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs space-y-2">
          {currentScreen === 'login' && (
            <>
              <button
                onClick={() => onNavigate('forgot-password')}
                className="text-emerald-700 font-semibold hover:underline block mx-auto"
              >
                Forgot your password?
              </button>
              <p className="text-slate-500">
                Don't have an account?{' '}
                <button
                  onClick={() => onNavigate('register')}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Register Here
                </button>
              </p>
            </>
          )}

          {currentScreen === 'register' && (
            <p className="text-slate-500">
              Already registered?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-emerald-700 font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          )}

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => onNavigate(currentScreen === 'admin-login' ? 'login' : 'admin-login')}
              className="text-slate-500 hover:text-slate-800 font-medium"
            >
              {currentScreen === 'admin-login' ? 'Switch to Regular Login' : 'Admin Portal Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
