import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ShoppingBag, CreditCard, Gift, ShieldAlert, Award } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReservations: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenReservations }) => {
  const { 
    cart, updateCartQuantity, removeFromCart, applyPromoCode, activePromoCode, 
    placeOrder, currentUser, settings 
  } = useApp();

  const [couponCode, setCouponCode] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [address, setAddress] = useState(currentUser?.address || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('Black Centurion Card');
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
  
  const discountAmount = activePromoCode && subtotal >= activePromoCode.minOrderValue
    ? Math.round(subtotal * (activePromoCode.discountPercent / 100))
    : 0;

  const tax = Math.round((subtotal - discountAmount) * 0.08 * 10) / 10;
  const deliveryFee = subtotal > 0 ? 15 : 0; // Elite dispatch premium line
  const total = subtotal - discountAmount + tax + deliveryFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    applyPromoCode(couponCode);
    setCouponCode('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !phone) return;

    const newOrder = await placeOrder({ address, phone, paymentMethod });
    if (newOrder) {
      setPlacedOrderInfo(newOrder);
      setShowCheckoutForm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      
      {/* Background close overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slideout Content Body */}
      <div className="relative w-full max-w-md h-full bg-[#020202] border-l border-[#C5A059]/15 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4.5 w-4.5 text-[#F27D26]" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-widest font-sans">Your Dining Basket</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Placing Flow Outcome */}
        {placedOrderInfo ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-6">
            <div className="h-16 w-16 rounded-full border border-[#F27D26]/30 bg-[#F27D26]/5 flex items-center justify-center text-[#F27D26] mb-2 animate-bounce">
              <Award className="h-8 w-8" />
            </div>
            
            <div>
              <span className="text-[10px] font-bold text-[#F27D26] tracking-widest uppercase mb-1.5 block">Payment Confirmed</span>
              <h4 className="text-xl tracking-wide font-light text-white">Consummate Ordering!</h4>
              <p className="text-white/40 text-xs font-light leading-relaxed mt-2.5">
                Your order is currently in L'Olympe master kitchen. An elite dispatch rider will establish secure transport details shortly.
              </p>
            </div>

            <div className="w-full bg-white/5 p-4 border border-white/10 rounded-xl space-y-2 text-left text-xs">
              <div className="flex justify-between">
                <span className="text-white/40">Receipt Code:</span>
                <span className="font-mono text-[#C5A059] font-bold">{placedOrderInfo.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Tracking Code:</span>
                <span className="font-mono text-[#F27D26] font-bold">{placedOrderInfo.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Toll Charge:</span>
                <span className="font-bold text-white">${placedOrderInfo.total}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setPlacedOrderInfo(null);
                onClose();
                onOpenReservations(); 
              }}
              className="w-full py-3.5 bg-[#F27D26] hover:bg-[#F27D26]/90 font-bold text-white text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer"
            >
              Track Order Dispatch Live
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            
            {/* List entries */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="h-11 w-11 text-white/10 mx-auto mb-4 animate-pulse" />
                  <p className="text-xs text-[#C5A059]">No masterpieces on your selection board.</p>
                  <p className="text-[10px] text-white/30 mt-1 font-light">Explore our signature dishes to append luxury flavors.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex gap-4 p-3 rounded-xl border border-white/10 bg-white/5">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="h-14 w-14 rounded-lg object-cover border border-white/5 flex-shrink-0" 
                    />
                    
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <div className="flex justify-between gap-1 items-start">
                          <h4 className="font-sans font-medium text-white tracking-wide">{item.product.name}</h4>
                          <span className="font-medium text-[#C5A059] leading-none">${item.product.price}</span>
                        </div>
                      </div>

                      {/* Quantity modifiers */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-2">
                        <div className="flex items-center gap-2 text-[10px] text-white/40">
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="bg-white/5 h-5 w-5 rounded flex items-center justify-center hover:bg-[#F27D26]/10 text-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-white font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="bg-white/5 h-5 w-5 rounded flex items-center justify-center hover:bg-[#F27D26]/10 text-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Subtotals & coupons */}
            {cart.length > 0 && !showCheckoutForm && (
              <div className="border-t border-white/10 pt-4 space-y-4">
                
                {/* Coupon form */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Enter Promo Code (e.g. ROYAL20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-white/10 bg-white/5 text-[10px] uppercase text-[#C5A059] tracking-wider placeholder:text-white/30 focus:outline-none focus:border-[#F27D26] rounded-lg"
                  />
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#F27D26]/10 text-[#F27D26] border border-[#F27D26]/20 hover:bg-[#F27D26] hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {/* Costs list */}
                <div className="space-y-2 text-xs border-b border-white/10 pb-4">
                  <div className="flex justify-between text-white/40">
                    <span>Selection Subtotal:</span>
                    <span>${subtotal}</span>
                  </div>
                  {activePromoCode && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Coupon ({activePromoCode.code}):</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white/40">
                    <span>Luxury Cargo Dispatch:</span>
                    <span>${deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-white/40">
                    <span>International State Tax (8%):</span>
                    <span>${tax}</span>
                  </div>
                  <div className="flex justify-between text-base font-sans text-white font-medium border-t border-white/10 pt-2.5">
                    <span>Grand Total:</span>
                    <span className="text-[#C5A059]">${total}</span>
                  </div>
                </div>

                {/* Pre-purchase advisory */}
                <div className="flex items-start gap-2 text-[9px] text-[#F27D26] bg-[#F27D26]/5 p-2.5 rounded-lg border border-[#F27D26]/10">
                  <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                  <span>Cancellations after grand chef preps represent structural resource degradation and are barred by conciergerie charter.</span>
                </div>

                <button 
                  onClick={() => setShowCheckoutForm(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#F27D26] hover:brightness-110 font-bold text-white text-xs tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  Establish Checkout Protocol
                </button>

              </div>
            )}

            {/* Seamless inside Checkout Form */}
            {showCheckoutForm && (
              <form onSubmit={handlePlaceOrder} className="border-t border-white/10 pt-4 space-y-4 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-widest font-sans">Checkout Dispatch Details</h4>
                  <button 
                    type="button" 
                    onClick={() => setShowCheckoutForm(false)}
                    className="text-[10px] text-[#F27D26] hover:underline"
                  >
                    Back to items
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-white/45 font-bold uppercase mb-1.5">Concièrge Telephone Contact</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. +33 605 929 111"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/45 font-bold uppercase mb-1.5">Elite Air/Ground Destination</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Hotel or Chateau Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F27D26]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/45 font-bold uppercase mb-1.5">Select Settlement Sovereign Instrument</label>
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white focus:outline-none focus:border-[#F27D26] font-semibold cursor-pointer"
                    >
                      <option value="Black Centurion Card">Sovereign Black Centurion Card</option>
                      <option value="Elite Diners Registry">Elite Diners Club Premium Registry</option>
                      <option value="Apple Pay Platinum">Apple Pay Platinum Vault</option>
                      <option value="Volcanic Gold Ledger Coin">Sim: Volcanic Gold Ledger Token</option>
                    </select>
                  </div>
                </div>

                <div className="text-[10px] text-white/40 leading-snug p-2.5 bg-black/20 rounded-lg border border-white/10">
                  Total Settlement Amount: <span className="font-bold text-[#C5A059]">${total}</span> incorporating dispatch cargo and regional tax adjustments.
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#F27D26] to-[#F27D26]/80 text-white font-bold tracking-widest uppercase rounded-xl hover:brightness-110 transition-all cursor-pointer"
                >
                  Transmit Gold Settlement Order
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
