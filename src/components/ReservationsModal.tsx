import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reservation } from '../types';
import { X, Calendar, ClipboardList, Map, Clock, Check, RefreshCw } from 'lucide-react';

interface ReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'book' | 'my-bookings' | 'my-orders';
}

export const ReservationsModal: React.FC<ReservationsModalProps> = ({ isOpen, onClose, initialTab = 'book' }) => {
  const { 
    reservations, bookTable, orders, currentUser, updateReservationStatus, updateOrderStatus 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings' | 'my-orders'>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Booking inputs
  const [date, setDate] = useState('2026-05-24');
  const [time, setTime] = useState('19:30');
  const [partySize, setPartySize] = useState(4);
  const [area, setArea] = useState<Reservation['area']>('Main Salon');
  const [notes, setNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState<Reservation | null>(null);

  if (!isOpen) return null;

  // Filter current user specific records for personalization
  const userReservations = currentUser 
    ? reservations.filter(r => r.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const userOrders = currentUser
    ? orders.filter(o => o.userEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    
    const details = {
      userName: currentUser?.name || 'Grand Guest',
      userEmail: currentUser?.email || 'guest@chamber.com',
      phone: currentUser?.phone || '+33 605 929 111',
      date,
      time,
      partySize,
      area,
      notes
    };

    const newRes = bookTable(details);
    setBookingSuccess(newRes);
    
    // reset inputs
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main card box */}
      <div className="relative w-full max-w-2xl bg-[#0c0c0c] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col justify-between animate-scale-up">
        
        {/* Head */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <span className="text-[9px] font-bold text-[#F27D26] tracking-widest uppercase mb-1 block">VIP Private Hub</span>
            <h3 className="text-xl font-light text-white tracking-widest uppercase">Elite Booking & Orders</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Navigation inside modal context */}
        <div className="flex gap-2.5 mb-6 border-b border-white/10 pb-3 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('book'); setBookingSuccess(null); }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'book'
                ? 'bg-[#F27D26]/10 border border-[#F27D26]/40 text-[#F27D26]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            Book Private Salon
          </button>
          
          <button
            onClick={() => { setActiveTab('my-bookings'); setBookingSuccess(null); }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'my-bookings'
                ? 'bg-[#F27D26]/10 border border-[#F27D26]/40 text-[#F27D26]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <ClipboardList className="h-3.5 w-3.5" />
            My Table Reservations ({userReservations.length})
          </button>

          <button
            onClick={() => { setActiveTab('my-orders'); setBookingSuccess(null); }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'my-orders'
                ? 'bg-[#F27D26]/10 border border-[#F27D26]/40 text-[#F27D26]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            My Culinary Deliveries ({userOrders.length})
          </button>
        </div>

        {/* Content body switcher */}
        <div className="flex-1 overflow-y-auto pr-1">
          
          {/* TAB 1: FORM TO BOOK */}
          {activeTab === 'book' && (
            <div>
              {bookingSuccess ? (
                <div className="text-center p-6 space-y-5">
                  <div className="h-14 w-14 rounded-full bg-[#F27D26]/10 border border-[#F27D26]/40 flex items-center justify-center text-[#F27D26] mx-auto mb-2">
                    <Check className="h-7 w-7" />
                  </div>
                  
                  <div>
                    <h4 className="text-lg text-white font-light">Catering Chamber Transmitted!</h4>
                    <p className="text-white/40 text-xs font-light leading-relaxed mt-1.5 max-w-sm mx-auto">
                      Your requested reservation ({bookingSuccess.id}) was routed successfully. An executive butler will verify availability shortly.
                    </p>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 max-w-sm mx-auto text-left text-xs space-y-1">
                    <div className="flex justify-between"><span className="text-white/40">Salon Area:</span><span className="font-bold text-[#C5A059]">{bookingSuccess.area}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Date/Time:</span><span className="font-bold text-white">{bookingSuccess.date} • {bookingSuccess.time}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Party Count:</span><span className="font-bold text-white">{bookingSuccess.partySize} VIP Guests</span></div>
                  </div>

                  <button
                    onClick={() => { setBookingSuccess(null); setActiveTab('my-bookings'); }}
                    className="px-6 py-2 border border-[#F27D26]/40 text-[#F27D26] hover:bg-[#F27D26] hover:text-white text-xs uppercase font-bold tracking-widest rounded-lg transition-all cursor-pointer"
                  >
                    View Status Log
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookTable} className="space-y-4 text-xs">
                  <h4 className="text-sm font-semibold text-white uppercase tracking-widest font-sans mb-2">Configure Gilded Chamber Setting</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-white/40 font-bold uppercase mb-1.5">Reservation date</label>
                      <input 
                        type="date" 
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#F27D26] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 font-bold uppercase mb-1.5">Dining hour</label>
                      <input 
                        type="time" 
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#F27D26] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-white/40 font-bold uppercase mb-1.5">Party Count</label>
                      <select 
                        value={partySize}
                        onChange={(e) => setPartySize(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#F27D26] cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 8, 12, 24].map(n => (
                          <option key={n} value={n}>{n} Imperial Guest{n > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-white/40 font-bold uppercase mb-1.5">Selective Dining Zone</label>
                      <select 
                        value={area}
                        onChange={(e: any) => setArea(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#F27D26] cursor-pointer"
                      >
                        <option value="Main Salon">Gold Gilded Main Salon (Atmospheric Piano)</option>
                        <option value="Chef's Table">Chef Alain's Table (Front Culinary Stage)</option>
                        <option value="Veranda">Glassmorphic Veranda (Skyline View)</option>
                        <option value="Wine Cellar">Medieval Stone Wine Crypt (Private Vault)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 font-bold uppercase mb-1.5">Special Gastronomic Dietary Needs</label>
                    <textarea 
                      placeholder="Nut allergies, high-end champagne bucket request, VIP concealment preference..."
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#F27D26] transition-colors"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-[#F27D26] to-[#F27D26]/85 text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:brightness-110 transition-all cursor-pointer"
                  >
                    Verify Table Availability
                  </button>

                </form>
              )}
            </div>
          )}

          {/* TAB 2: MY BOOKINGS LIST */}
          {activeTab === 'my-bookings' && (
            <div className="space-y-4">
              {userReservations.length === 0 ? (
                <div className="text-center py-10">
                  <Calendar className="h-8 w-8 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-[#C5A059]">No private salon bookings established.</p>
                </div>
              ) : (
                userReservations.map(res => (
                  <div key={res.id} className="p-4 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="font-mono text-[9px] font-bold text-[#F27D26]">{res.id}</span>
                        <span className="text-white/20">•</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">{res.area}</span>
                      </div>
                      <p className="text-xs font-semibold text-white">{res.date} • {res.time}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{res.partySize} Imperial Guests {res.notes ? `• "${res.notes}"` : ''}</p>
                    </div>

                    <div className="text-right flex flex-col items-end gap-2">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                        res.status === 'confirmed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/15' : 
                        res.status === 'cancelled' ? 'bg-rose-950 text-rose-300 border border-rose-500/15' : 'bg-amber-950 text-amber-400 border border-amber-500/15'
                      }`}>
                        {res.status}
                      </span>
                      {res.status !== 'cancelled' && (
                        <button 
                          onClick={() => updateReservationStatus(res.id, 'cancelled')}
                          className="text-[9px] text-red-400 hover:text-red-300 underline tracking-wider uppercase cursor-pointer"
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: MY ORDERS LIST */}
          {activeTab === 'my-orders' && (
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="text-center py-10">
                  <ClipboardList className="h-8 w-8 text-white/10 mx-auto mb-2" />
                  <p className="text-xs text-[#C5A059]">No gourmet deliveries dispatched.</p>
                </div>
              ) : (
                userOrders.map(ord => (
                  <div key={ord.id} className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-[#F27D26]">{ord.id}</span>
                          <span className="text-white/40 text-[10px]">• Track No: <span className="font-mono text-[#C5A059]">{ord.trackingNumber}</span></span>
                        </div>
                        <p className="text-[10px] text-white/30 mt-0.5">Dispatched to: {ord.address}</p>
                      </div>

                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                          ord.status === 'delivered' ? 'bg-emerald-950 text-emerald-400' :
                          ord.status === 'cancelled' ? 'bg-rose-950 text-rose-300' : 'bg-white/10 text-white/80 border border-white/5'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items rows */}
                    <div className="space-y-1.5 mb-3.5">
                      {ord.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-xs font-light text-white/60">
                          <span>{it.quantity}x {it.productName}</span>
                          <span>${it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Simulating Order progress dynamic timeline */}
                    <div className="bg-[#050505]/90 p-3 rounded-lg border border-white/5 mb-2">
                      <span className="block text-[8px] font-bold text-[#F27D26] tracking-widest uppercase mb-1.5">Live Delivery dispatch states</span>
                      <div className="grid grid-cols-4 gap-1 text-center text-[8px] font-bold tracking-wider uppercase text-white/30">
                        <span className={`${ord.status !== 'cancelled' ? 'text-[#F27D26]' : ''}`}>Pending</span>
                        <span className={`${['preparing', 'dispatched', 'delivered'].includes(ord.status) ? 'text-[#F27D26]' : ''}`}>Kitchen</span>
                        <span className={`${['dispatched', 'delivered'].includes(ord.status) ? 'text-[#F27D26] animate-pulse' : ''}`}>Dispatched</span>
                        <span className={`${ord.status === 'delivered' ? 'text-emerald-400' : ''}`}>Delivered</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/40">Total charge amount paid:</span>
                      <span className="font-bold text-[#C5A059]">${ord.total}</span>
                    </div>

                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
