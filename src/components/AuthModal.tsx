import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, Phone, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login'
}) => {
  const { login, registerCustomer } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  
  // Sync tab state when opening or when defaultTab changes
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, isOpen]);
  
  // Form Values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (activeTab === 'login') {
      if (!email) {
        setErrorMsg('Please enter your authorized email address.');
        return;
      }
      
      const isMehwish = email.trim().toLowerCase() === 'mehwishsheikh451sheikh@gmail.com';
      if (isMehwish) {
        if (password !== 'Mehwish.-15') {
          setErrorMsg('Incorrect administrator credential password.');
          return;
        }
        
        const ok = login(email, 'admin', password);
        if (ok) {
          setSuccessMsg('Concièrge Administrator Panel Authenticated!');
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } else {
        // Customer login
        login(email, 'customer');
        setSuccessMsg('VIP Customer Access Granted!');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } else {
      // Register Customer
      if (!name || !email || !phone) {
        setErrorMsg('Name, email, and telephone fields are mandatory.');
        return;
      }
      if (email.trim().toLowerCase() === 'mehwishsheikh451sheikh@gmail.com') {
        setErrorMsg('Admin email cannot be registered as public customer.');
        return;
      }
      registerCustomer(name, email, phone, address);
      setSuccessMsg('Elite Gastronomic Profile Activated!');
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/40">
      {/* Dark overlay backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-md" 
        onClick={onClose}
      />

      {/* Auth Card Dialog */}
      <div className="relative w-full max-w-md my-auto max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl border border-gold-500/30 bg-[#0c0c0c] p-5 sm:p-6 text-white shadow-[0_10px_50px_rgba(197,160,89,0.15)] md:p-8 no-scrollbar scrollbar-none flex flex-col justify-between">
        
        {/* Subtle decorative background light */}
        <div className="absolute top-[-100px] right-[-100px] w-60 h-60 bg-[#F27D26]/10 blur-[60px] rounded-full pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 p-1.5 text-zinc-400 hover:border-gold-500 hover:text-white transition-all cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-10 h-10 bg-[#F27D26] rounded-lg flex items-center justify-center mb-3 shadow-[0_4px_15px_rgba(242,125,38,0.25)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-serif text-xl font-bold tracking-wider text-white">L’Olympe Credentials</h3>
          <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase mt-1">SaaS & VIP Guest Portal</p>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-2 gap-2 border-b border-white/10 pb-4 mb-6 text-xs uppercase tracking-widest">
          <button 
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`pb-2 font-bold cursor-pointer transition-all border-b-2 text-center ${
              activeTab === 'login' ? 'text-[#F27D26] border-[#F27D26]' : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`pb-2 font-bold cursor-pointer transition-all border-b-2 text-center ${
              activeTab === 'register' ? 'text-[#F27D26] border-[#F27D26]' : 'text-zinc-500 border-transparent hover:text-zinc-300'
            }`}
          >
            Create Profile
          </button>
        </div>

        {/* Alert Logs */}
        {errorMsg && (
          <div className="mb-4 flex gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 items-start">
            <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-400 items-start animate-pulse">
            <Sparkles className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Full Name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <User className="h-4 w-4" />
                </span>
                <input 
                  type="text"
                  placeholder="e.g. Baroness DuPont"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs tracking-wider placeholder-zinc-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <Mail className="h-4 w-4" />
              </span>
              <input 
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs tracking-wider placeholder-zinc-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                required
              />
            </div>
          </div>

          {activeTab === 'login' && email.trim().toLowerCase() === 'mehwishsheikh451sheikh@gmail.com' && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Administrator Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input 
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-red-500/30 bg-red-500/5 py-2.5 pl-10 pr-4 text-xs tracking-wider placeholder-zinc-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                  required
                />
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Contact Telephone</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Phone className="h-4 w-4" />
                  </span>
                  <input 
                    type="tel"
                    placeholder="+33 600 000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs tracking-wider placeholder-zinc-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">Delivery Address (Optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <input 
                    type="text"
                    placeholder="Château Vendôme, Paris"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs tracking-wider placeholder-zinc-600 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500/20"
                  />
                </div>
              </div>
            </>
          )}



          <button 
            type="submit"
            className="w-full rounded-lg bg-[#F27D26] py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg hover:brightness-110 transition-all cursor-pointer mt-4"
          >
            {activeTab === 'login' ? 'Authenticate Session' : 'Provision Elite Profile'}
          </button>

        </form>

      </div>
    </div>
  );
};
