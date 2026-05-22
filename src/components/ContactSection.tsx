import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Compass, Send, Check } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, pushNotification } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [isSent, setIsSent] = useState(false);

  // Map route simulation point state
  const [simulatedRoute, setSimulatedRoute] = useState<'chatelet' | 'triumph' | 'none'>('none');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !msg) return;
    
    pushNotification('success', `Inquiry transmitted: "${name}" requested custom private catering details.`);
    setIsSent(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMsg('');
      setIsSent(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 bg-[#050505] relative border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Column 1: Contact Details & Form */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-[#F27D26] uppercase block mb-3">GRAND COMMISSARY</span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white mb-4">
                Establish Direct <span className="font-serif italic text-[#C5A059]">Inquiry</span>
              </h2>
              <p className="text-xs text-white/45 font-light leading-relaxed">Have custom banquet queries or private aviation inquiries? Connect with our personal butler or premium catering captains instantly.</p>
            </div>

            {/* Icons */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-colors">
                <MapPin className="h-5 w-5 text-[#F27D26] flex-shrink-0" />
                <div>
                  <span className="block text-[8px] font-bold text-white/35 tracking-widest uppercase">CONCIÈRGE ADDRESS</span>
                  <p className="text-xs text-white/80">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-colors">
                <Phone className="h-5 w-5 text-[#F27D26] flex-shrink-0" />
                <div>
                  <span className="block text-[8px] font-bold text-white/35 tracking-widest uppercase">DIRECT LAND DIAL</span>
                  <p className="text-xs text-white/80">{settings.contactPhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 transition-colors">
                <Mail className="h-5 w-5 text-[#F27D26] flex-shrink-0" />
                <div>
                  <span className="block text-[8px] font-bold text-white/35 tracking-widest uppercase">DIGITAL REGISTRY</span>
                  <p className="text-xs text-white/80">{settings.contactEmail}</p>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4">
              <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-2">Concierge Message Dispatch</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text"
                  placeholder="Your Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4.5 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#F27D26] transition-colors"
                />
                <input 
                  type="email"
                  placeholder="Your Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4.5 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#F27D26] transition-colors"
                />
              </div>

              <textarea 
                placeholder="What special banquet or luxury table preferences may we assist you with?"
                required
                rows={4}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="w-full px-4.5 py-3 rounded-xl border border-white/10 bg-white/5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#F27D26] transition-colors"
              />

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#F27D26] hover:brightness-110 text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                {isSent ? (
                  <>
                    <Check className="h-4 w-4" />
                    Transmitted Securely
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Dispatch Concierge Request
                  </>
                )}
              </button>
            </form>

          </div>

          {/* Column 2: Immersive Interactive Vector Map (Awwwards-Style) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-center bg-[#0c0c0c] p-4 border border-white/10 rounded-xl">
              <div>
                <span className="block text-[8px] font-bold text-[#F27D26] tracking-widest uppercase mb-1">interactive visual telemetry</span>
                <span className="block text-sm font-light text-white font-sans">Paris GIS Vector Compass Node</span>
              </div>
              <Compass className="h-5 w-5 text-[#F27D26] animate-spin" />
            </div>

            {/* Immersive SVG City Layout Map representation */}
            <div className="relative aspect-video rounded-2xl border border-white/10 bg-[#0c0c0c] p-4 overflow-hidden shadow-2xl flex flex-col justify-between">
              
              <svg className="absolute inset-0 h-full w-full opacity-60 pointer-events-none" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Seine River is custom styled as glowing brand line */}
                <path d="M 0,140 Q 180,110 400,160" stroke="#F27D26" strokeWidth="6" strokeOpacity="0.25" fill="none" />
                
                {/* Roads */}
                <line x1="50" y1="0" x2="150" y2="200" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.5" />
                <line x1="280" y1="0" x2="180" y2="200" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="3,3" strokeOpacity="0.5" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#C5A059" strokeWidth="0.8" strokeOpacity="0.6" />
                
                {/* Place de la Concorde Ring Gilded Area */}
                <circle cx="200" cy="80" r="22" stroke="#C5A059" strokeWidth="1" strokeDasharray="4,2" fill="#C5A059" fillOpacity="0.05" />
                
                {/* Target Marker: L'Olympe Paris */}
                <circle cx="200" cy="80" r="4.5" fill="white" />
                <circle cx="200" cy="80" r="10" stroke="#F27D26" strokeWidth="1" className="animate-pulse" />

                {/* Simulated Traveling Point */}
                {simulatedRoute === 'chatelet' && (
                  <circle cx="350" cy="140" r="5" fill="#F27D26">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 355,140 C 290,120 230,100 200,80" />
                  </circle>
                )}

                {simulatedRoute === 'triumph' && (
                  <circle cx="50" cy="40" r="5" fill="#F27D26">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 50,40 C 100,60 150,70 200,80" />
                  </circle>
                )}
              </svg>

              {/* Legend overlay */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                
                <div className="flex justify-between items-start">
                  <span className="bg-[#F27D26]/10 border border-[#F27D26]/30 text-[9px] font-bold text-[#F27D26] px-2.5 py-1 rounded uppercase tracking-wider">
                    Concorde Paris Node
                  </span>
                  
                  {/* Map Coordinate indicators */}
                  <div className="text-right text-[8px] font-mono text-white/40">
                    <div>GPS: 48.8656° N, 2.3212° E</div>
                    <div>Elev: 35m • Seine Offset: 180m</div>
                  </div>
                </div>

                <div className="bg-[#050505]/95 backdrop-blur-md p-3 rounded-xl border border-white/10 max-w-[240px] shadow-lg">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="h-2 w-2 rounded-full bg-[#F27D26] animate-pulse" />
                    <span className="text-[9px] font-bold text-[#F27D26] uppercase tracking-widest">L’Olympe Paris HQ</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-snug">Located precisely inside the historic east wing facing Place de la Concorde.</p>
                </div>

                {/* Interact simulator choices */}
                <div className="p-2 border-t border-white/5 bg-[#050505]/80 rounded-b-xl flex gap-2">
                  <button 
                    onClick={() => setSimulatedRoute(simulatedRoute === 'chatelet' ? 'none' : 'chatelet')}
                    className={`flex-1 text-[8px] font-bold uppercase tracking-widest py-1.5 rounded transition-all cursor-pointer ${
                      simulatedRoute === 'chatelet' ? 'bg-[#F27D26] text-white' : 'bg-white/5 text-[#C5A059] border border-white/10'
                    }`}
                  >
                    {simulatedRoute === 'chatelet' ? 'Stop Transit Sim' : 'Sim: Route Châtelet'}
                  </button>
                  <button 
                    onClick={() => setSimulatedRoute(simulatedRoute === 'triumph' ? 'none' : 'triumph')}
                    className={`flex-1 text-[8px] font-bold uppercase tracking-widest py-1.5 rounded transition-all cursor-pointer ${
                      simulatedRoute === 'triumph' ? 'bg-[#F27D26] text-white' : 'bg-white/5 text-[#C5A059] border border-white/10'
                    }`}
                  >
                    {simulatedRoute === 'triumph' ? 'Stop Transit Sim' : 'Sim: Arc de Triomphe'}
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
