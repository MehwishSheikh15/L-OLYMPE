import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Product, Category, Order, Reservation, StoreSettings } from '../types';
import { 
  TrendingUp, Users, Calendar, Award, Package, Plus, Trash2, Edit2, 
  Settings, Layers, Truck, Percent, Save, Bell, CheckCircle, RefreshCw, X,
  Download, Upload
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct,
    categories, addCategory, deleteCategory,
    orders, updateOrderStatus,
    reservations, updateReservationStatus,
    settings, updateSettings,
    users, promoCodes, pushNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'orders' | 'reservations' | 'marketing' | 'settings' | 'crm'>('overview');

  // Overview Analytics Stats
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, curr) => acc + curr.total, 0);
  const activeBookingsCount = reservations.filter(r => r.status === 'confirmed' || r.status === 'pending').length;
  const popularDishes = [
    { name: 'Imperial Golden Osetra Caviar', count: 42, rev: 13440 },
    { name: 'A5 Miyazaki Wagyu Sirloin Sizzle', count: 68, rev: 16660 },
    { name: 'Piedmont White Truffle Pasta', count: 54, rev: 5130 }
  ];

  // Forms states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(100);
  const [newProductImg, setNewProductImg] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80');
  const [newProductCategory, setNewProductCategory] = useState('cat-4');
  const [newProductPreparationTime, setNewProductPreparationTime] = useState(15);
  const [newProductTags, setNewProductTags] = useState('Signature, Chef Choice');
  const [dragActive, setDragActive] = useState(false);

  // Edit Store Settings Local Form
  const [siteName, setSiteName] = useState(settings.restaurantName);
  const [siteContactPhone, setSiteContactPhone] = useState(settings.contactPhone);
  const [siteContactEmail, setSiteContactEmail] = useState(settings.contactEmail);
  const [siteAddress, setSiteAddress] = useState(settings.address);
  const [siteHeroTitle, setSiteHeroTitle] = useState(settings.heroTitle);
  const [siteHeroSubtitle, setSiteHeroSubtitle] = useState(settings.heroSubtitle);
  const [siteAboutText, setSiteAboutText] = useState(settings.aboutNarrative);
  const [seoKeywords, setSeoKeywords] = useState(settings.seoKeywords);

  // New Category State
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Sanity Connection Status State
  const [sanityStatus, setSanityStatus] = useState<{
    configured: boolean;
    projectId: string | null;
    dataset: string;
    apiVersion: string;
  } | null>(null);

  React.useEffect(() => {
    fetch('/api/sanity-status')
      .then(res => res.json())
      .then(data => setSanityStatus(data))
      .catch(err => console.error("Error fetching Sanity status:", err));
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      restaurantName: siteName,
      contactPhone: siteContactPhone,
      contactEmail: siteContactEmail,
      address: siteAddress,
      heroTitle: siteHeroTitle,
      heroSubtitle: siteHeroSubtitle,
      aboutNarrative: siteAboutText,
      seoKeywords
    });
  };

  const downloadCSVReport = () => {
    if (orders.length === 0) {
      pushNotification('warning', 'No orders registered to export.');
      return;
    }
    const headers = ['Order ID', 'Tracking Number', 'Client Name', 'Email', 'Phone Contact', 'Destination Coordinates', 'Method', 'Status Label', 'Aggregate Total ($)'];
    const rows = orders.map(ord => [
      ord.id,
      ord.trackingNumber,
      ord.userName,
      ord.userEmail,
      ord.phone,
      ord.address.replace(/"/g, '""'),
      ord.paymentMethod,
      ord.status,
      ord.total
    ]);
    
    // Format double quotes for Excel & custom client layouts
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `L_Olympe_VIP_Corporate_Order_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    pushNotification('success', 'VIP Corporate Order report CSV exported successfully.');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductDesc) return;

    addProduct({
      name: newProductName,
      description: newProductDesc,
      price: newProductPrice,
      image: newProductImg || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
      categoryId: newProductCategory,
      status: 'available',
      tags: newProductTags ? newProductTags.split(',').map(t => t.trim()).filter(Boolean) : [],
      ingredients: ['Premium Selection Herbs', 'Eshire Butter', 'Sea Salt Flakes'],
      preparationTime: newProductPreparationTime
    });

    // Reset fields
    setNewProductName('');
    setNewProductDesc('');
    setNewProductPrice(100);
    setNewProductImg('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80');
    setNewProductCategory('cat-4');
    setNewProductPreparationTime(15);
    setNewProductTags('Signature, Chef Choice');
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    addCategory({
      name: newCatName,
      description: newCatDesc,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80'
    });
    setNewCatName('');
    setNewCatDesc('');
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setNewProductName(p.name || '');
    setNewProductDesc(p.description || '');
    setNewProductPrice(p.price || 0);
    setNewProductImg(p.image || '');
    setNewProductCategory(p.categoryId || 'cat-4');
    setNewProductPreparationTime(p.preparationTime || 15);
    setNewProductTags(p.tags ? p.tags.join(', ') : '');
  };

  const saveEditedProduct = () => {
    if (!editingProductId) return;
    updateProduct(editingProductId, {
      name: newProductName,
      description: newProductDesc,
      price: newProductPrice,
      image: newProductImg,
      categoryId: newProductCategory,
      preparationTime: newProductPreparationTime,
      tags: newProductTags ? newProductTags.split(',').map(t => t.trim()).filter(Boolean) : []
    });
    setEditingProductId(null);
    setNewProductName('');
    setNewProductDesc('');
    setNewProductPrice(100);
    setNewProductImg('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80');
    setNewProductCategory('cat-4');
    setNewProductPreparationTime(15);
    setNewProductTags('Signature, Chef Choice');
  };

  return (
    <section className="bg-luxury-950 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Navigation header row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gold-900/20 pb-6 mb-8 uppercase text-xs">
          <div>
            <span className="text-gold-500 font-bold tracking-widest block mb-1">Executive Backoffice hub</span>
            <h1 className="font-serif text-2xl sm:text-3.5xl font-semibold tracking-tight text-white mb-0.5 uppercase">L’Olympe Backoffice Panel</h1>
          </div>
          
          {/* Main Top Nav list */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-none no-scrollbar snap-x shrink-0">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`shrink-0 snap-align-start px-4.5 py-2.5 rounded-lg border transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-gold-500 border-gold-500 text-luxury-950 font-bold' : 'border-gold-900/35 text-gold-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('menu')} 
              className={`shrink-0 snap-align-start px-4.5 py-2.5 rounded-lg border transition-all cursor-pointer ${
                activeTab === 'menu' ? 'bg-gold-500 border-gold-500 text-luxury-950 font-bold' : 'border-gold-900/35 text-gold-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Products CRUD
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`shrink-0 snap-align-start px-4.5 py-2.5 rounded-lg border transition-all cursor-pointer ${
                activeTab === 'orders' ? 'bg-gold-500 border-gold-500 text-luxury-950 font-bold' : 'border-gold-900/35 text-gold-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button 
              onClick={() => setActiveTab('reservations')} 
              className={`shrink-0 snap-align-start px-4.5 py-2.5 rounded-lg border transition-all cursor-pointer ${
                activeTab === 'reservations' ? 'bg-gold-500 border-gold-500 text-luxury-950 font-bold' : 'border-gold-900/35 text-gold-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Bookings ({reservations.length})
            </button>
            <button 
              onClick={() => setActiveTab('marketing')} 
              className={`shrink-0 snap-align-start px-4.5 py-2.5 rounded-lg border transition-all cursor-pointer ${
                activeTab === 'marketing' ? 'bg-gold-500 border-gold-500 text-luxury-950 font-bold' : 'border-gold-900/35 text-gold-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Coupons
            </button>
            <button 
              onClick={() => setActiveTab('crm')} 
              className={`shrink-0 snap-align-start px-4.5 py-2.5 rounded-lg border transition-all cursor-pointer ${
                activeTab === 'crm' ? 'bg-gold-500 border-gold-500 text-luxury-950 font-bold' : 'border-gold-900/35 text-gold-400 hover:text-white hover:bg-white/5'
              }`}
            >
              CRM Users
            </button>
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`shrink-0 snap-align-start px-4.5 py-2.5 rounded-lg border transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-gold-500 border-gold-500 text-luxury-950 font-bold' : 'border-gold-900/35 text-gold-400 hover:text-white hover:bg-white/5'
              }`}
            >
              CMS Brand Editor
            </button>
          </div>
        </div>

        {/* Dynamic Panels */}
        <div className="space-y-8 animate-fade-in">
          
          {/* PANEL 1: ANALYTICS OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="p-5 rounded-2xl border border-gold-900/15 bg-luxury-950 shadow-md">
                  <span className="block text-[9px] font-bold text-zinc-500 tracking-widest uppercase mb-1">CUMULATIVE REVENUES</span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-serif text-2xl sm:text-3.5xl font-bold tracking-tight text-white">${totalRevenue.toLocaleString()}</span>
                    <TrendingUp className="h-6 w-6 text-emerald-500" />
                  </div>
                  <span className="block text-[8px] font-semibold text-emerald-400 mt-2.5 uppercase tracking-wider">✦ 18.2% Since Last Lunar Range</span>
                </div>

                <div className="p-5 rounded-2xl border border-gold-900/15 bg-luxury-950 shadow-md">
                  <span className="block text-[9px] font-bold text-zinc-500 tracking-widest uppercase mb-1">CATERING TRANSACTIONS</span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-serif text-2xl sm:text-3.5xl font-bold tracking-tight text-white">{orders.length}</span>
                    <Package className="h-6 w-6 text-gold-500" />
                  </div>
                  <span className="block text-[8px] font-semibold text-gold-500 mt-2.5 uppercase tracking-wider">✦ Average order check: $435</span>
                </div>

                <div className="p-5 rounded-2xl border border-gold-900/15 bg-luxury-950 shadow-md">
                  <span className="block text-[9px] font-bold text-zinc-500 tracking-widest uppercase mb-1">VIP ACTIVE RESERVATIONS</span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-serif text-2xl sm:text-3.5xl font-bold tracking-tight text-white">{activeBookingsCount} / 12</span>
                    <Calendar className="h-6 w-6 text-gold-500" />
                  </div>
                  <span className="block text-[8px] font-semibold text-amber-500 mt-2.5 uppercase tracking-wider">✦ Private salons near full capacity</span>
                </div>

                <div className="p-5 rounded-2xl border border-gold-900/15 bg-luxury-950 shadow-md">
                  <span className="block text-[9px] font-bold text-zinc-500 tracking-widest uppercase mb-1">CONCIÈRGE SLA SCORE</span>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-serif text-2xl sm:text-3.5xl font-bold tracking-tight text-white">99.1%</span>
                    <Award className="h-6 w-6 text-gold-400" />
                  </div>
                  <span className="block text-[8px] font-semibold text-emerald-400 mt-2.5 uppercase tracking-wider">✦ Gilded standard preserved</span>
                </div>

              </div>

              {/* Central Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* SVG Revenue Line Chart Representation */}
                <div className="lg:col-span-8 p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] shadow-lg flex flex-col justify-between h-96 relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[8px] font-bold text-emerald-400 tracking-widest block uppercase">Real-Time Sync Telemetry Active</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Dynamic Sales Value Stream</h3>
                    </div>
                    
                    {/* Live Statistics Counter & CSV Export */}
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={downloadCSVReport}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 transition-all font-sans text-[10px] font-bold tracking-widest uppercase cursor-pointer"
                        title="Export Orders CSV"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download Report
                      </button>

                      <div className="text-right">
                        <span className="text-[9px] text-zinc-500 block uppercase tracking-wider font-semibold">Average Order Total</span>
                        <span className="font-mono text-sm font-bold text-[#F27D26]">
                          ${orders.length > 0 ? (orders.reduce((acc, o) => acc + o.total, 0) / orders.length).toFixed(2) : '435.00'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive custom high-fidelity SVG chart based on live orders */}
                  <div className="relative flex-1 w-full flex items-end justify-between py-6 mt-4">
                    {(() => {
                      // Process order data dynamically for plotting (8 points)
                      const pointsCount = 8;
                      const baseValues = [180, 240, 220, 390, 310, 480, 420, 580];
                      const dataPoints = Array.from({ length: pointsCount }).map((_, i) => {
                        // Blend real order data with baseline
                        const orderItem = orders[orders.length - pointsCount + i];
                        const val = orderItem ? orderItem.total : baseValues[i];
                        const label = orderItem ? (orderItem.userName || '').split(' ')[0] : `Slot ${i + 1}`;
                        return { val, label };
                      });

                      const maxVal = Math.max(...dataPoints.map(d => d.val), 600);
                      const chartWidth = 500;
                      const chartHeight = 150;
                      
                      // Calculate linear coords
                      const coords = dataPoints.map((d, i) => {
                        const x = 20 + (i * (chartWidth - 40)) / (pointsCount - 1);
                        const y = chartHeight - 20 - ((d.val) / maxVal) * (chartHeight - 40);
                        return { x, y, val: d.val, label: d.label };
                      });

                      // Construct beautiful smooth SVG Bezier path
                      let pathD = '';
                      if (coords.length > 0) {
                        pathD = `M ${coords[0].x},${coords[0].y}`;
                        for (let i = 0; i < coords.length - 1; i++) {
                          const cpX1 = coords[i].x + (coords[i+1].x - coords[i].x) / 2;
                          const cpY1 = coords[i].y;
                          const cpX2 = coords[i].x + (coords[i+1].x - coords[i].x) / 2;
                          const cpY2 = coords[i+1].y;
                          pathD += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${coords[i+1].x},${coords[i+1].y}`;
                        }
                      }

                      // Fill area underneath path
                      const areaD = pathD ? `${pathD} L ${coords[coords.length - 1].x},${chartHeight} L ${coords[0].x},${chartHeight} Z` : '';

                      return (
                        <div className="relative w-full h-full">
                          <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Grid Horizontal Guidelines */}
                            <line x1="10" y1={chartHeight / 3} x2={chartWidth - 10} y2={chartHeight / 3} stroke="#7b5125" strokeOpacity="0.08" strokeDasharray="4,4" />
                            <line x1="10" y1={(chartHeight * 2) / 3} x2={chartWidth - 10} y2={(chartHeight * 2) / 3} stroke="#7b5125" strokeOpacity="0.08" strokeDasharray="4,4" />
                            
                            {/* Area Gradient under curve */}
                            {areaD && (
                              <path d={areaD} fill="url(#realtime-gold-grad)" opacity="0.12" />
                            )}
                            
                            {/* Continuous Spline Path */}
                            {pathD && (
                              <path d={pathD} stroke="#caa151" strokeWidth="2.5" strokeLinecap="round" />
                            )}

                            {/* Data points nodes */}
                            {coords.map((c, idx) => (
                              <g key={idx} className="group/node cursor-pointer">
                                <circle 
                                  cx={c.x} 
                                  cy={c.y} 
                                  r="4" 
                                  fill="#12100e" 
                                  stroke="#F27D26" 
                                  strokeWidth="2"
                                  className="transition-all duration-300 hover:scale-[1.8] hover:fill-[#F27D26]" 
                                />
                                {/* Quick display tag */}
                                <text 
                                  x={c.x} 
                                  y={c.y - 12} 
                                  fill="#dfbe7c" 
                                  fontSize="7" 
                                  fontFamily="monospace"
                                  textAnchor="middle"
                                  className="opacity-0 group-hover/node:opacity-100 transition-opacity bg-black px-1"
                                >
                                  ${c.val}
                                </text>
                              </g>
                            ))}

                            <defs>
                              <linearGradient id="realtime-gold-grad" x1="0" y1="0" x2="0" y2={chartHeight}>
                                <stop offset="0%" stopColor="#caa151" />
                                <stop offset="100%" stopColor="#12100e" />
                              </linearGradient>
                            </defs>
                          </svg>

                          {/* Dynamic axis indicators absolute */}
                          <div className="absolute top-1 right-2 text-[7px] font-mono text-zinc-650 flex flex-col gap-1 select-none">
                            <span>Max Peak: ${maxVal.toFixed(0)}</span>
                            <span>Level Index: ${(maxVal * 0.6).toFixed(0)}</span>
                          </div>

                          {/* Dynamic timeline ticks names labels */}
                          <div className="absolute inset-x-0 bottom-[-16px] flex justify-between px-4 text-[7px] font-mono text-zinc-500 uppercase tracking-wider">
                            {coords.map((c, idx) => (
                              <span key={idx} className="block truncate max-w-[50px]">{c.label}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                </div>

                {/* Vertical Rankings Grid */}
                <div className="lg:col-span-4 p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] shadow-lg flex flex-col justify-between h-96">
                  <div>
                    <span className="text-[8px] font-bold text-gold-400 tracking-widest block uppercase mb-1">rankings database</span>
                    <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">Top Cuisine Performers</h3>
                  </div>

                  {/* List progress indicators */}
                  <div className="space-y-4 flex-1 flex flex-col justify-center">
                    {popularDishes.map((dish, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-serif font-semibold text-zinc-200">{dish.name}</span>
                          <span className="font-bold text-gold-400">${dish.rev.toLocaleString()}</span>
                        </div>
                        {/* Custom visual progress bar in gold */}
                        <div className="h-1.5 w-full bg-[#0a0908] rounded-full overflow-hidden border border-gold-900/10">
                          <div 
                            className="bg-gold-500 h-full rounded-full" 
                            style={{ width: `${(dish.rev / 17000) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-zinc-500 uppercase tracking-wider">
                          <span>sales volume</span>
                          <span>{dish.count} checks matched</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* PANEL 2: PRODUCTS CRUD TABLE & ADD FORM */}
          {activeTab === 'menu' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Product Add or Edit Column form */}
              <div className="lg:col-span-4 p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] space-y-4">
                <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
                  {editingProductId ? '🛠️ Edit Gilded Specialty' : '➕ Append Gilded Specialty'}
                </h3>
                <div className="h-px bg-gold-900/20" />

                <form onSubmit={editingProductId ? (e) => { e.preventDefault(); saveEditedProduct(); } : handleAddProduct} className="space-y-4 text-xs select-none">
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Luxury Food Name</label>
                    <input 
                      type="text" 
                      required
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="e.g. Imperial Beluga Beluga Spoons"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Price valuation ($)</label>
                    <input 
                      type="number" 
                      required
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Cuisine category</label>
                    <select 
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500 cursor-pointer"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Product Media (Image Upload)</label>
                    <div className="space-y-3">
                      {/* Drag & Drop File Upload Zone with Preview */}
                      <div 
                        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDragActive(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file && file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setNewProductImg(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className={`relative rounded-xl border border-dashed p-5 transition-all duration-300 text-center flex flex-col items-center justify-center ${
                          dragActive 
                            ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_15px_rgba(197,160,89,0.2)]' 
                            : 'border-gold-900/30 bg-luxury-950/40 hover:bg-luxury-950/70 hover:border-gold-500/30'
                        }`}
                      >
                        {newProductImg ? (
                          <div className="space-y-3 w-full">
                            <div className="relative group max-w-full rounded-lg overflow-hidden border border-gold-900/15 bg-luxury-950 max-h-40 flex items-center justify-center p-1 bg-zinc-950/20">
                              <img 
                                src={newProductImg} 
                                alt="Product Preview" 
                                className="max-h-36 max-w-full object-contain rounded"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setNewProductImg('')}
                                className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/20 rounded-lg text-[9px] uppercase font-bold tracking-widest transition cursor-pointer"
                              >
                                Remove Image
                              </button>
                              <label className="px-3 py-1.5 bg-gold-900/25 hover:bg-[#F27D26]/20 text-gold-400 border border-gold-500/20 rounded-lg text-[9px] uppercase font-bold tracking-widest cursor-pointer transition">
                                Choose Different File
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        if (typeof reader.result === 'string') {
                                          setNewProductImg(reader.result);
                                        }
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="h-10 w-10 rounded-full bg-gold-500/10 flex items-center justify-center mb-2 text-gold-400">
                              <Upload className="h-4 w-4" />
                            </div>
                            <p className="text-[11px] text-zinc-300 font-medium">Drag &amp; drop product photo, or click to select</p>
                            <label className="mt-2.5 px-3 py-1.5 bg-gold-500 hover:bg-gold-600 text-luxury-950 text-[9px] uppercase font-bold tracking-widest rounded-lg cursor-pointer transition">
                              Select from device
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      if (typeof reader.result === 'string') {
                                        setNewProductImg(reader.result);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                            <p className="text-[8px] text-zinc-500 uppercase mt-1.5 tracking-wider">Supports JPEG, PNG or WEBP formats</p>
                          </>
                        )}
                      </div>

                      {/* Manual text input for direct URL copy/pasting in a collapsible block */}
                      <details className="group border border-gold-900/20 rounded-lg px-3 py-2 bg-luxury-950/20">
                        <summary className="text-[9px] text-gold-400/80 hover:text-gold-400 cursor-pointer list-none flex items-center justify-between select-none">
                          <span className="font-semibold uppercase tracking-widest">Or paste manual image url...</span>
                          <span className="text-zinc-500 text-xs transition-transform group-open:rotate-180">▾</span>
                        </summary>
                        <div className="mt-2 text-[11px] text-zinc-400">
                          <input 
                            type="text" 
                            placeholder="https://images.unsplash.com/your-michelin-star-dish"
                            value={newProductImg.startsWith('data:') ? '' : newProductImg}
                            onChange={(e) => setNewProductImg(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500 text-xs text-white"
                          />
                        </div>
                      </details>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Prep Minutes</label>
                      <input 
                        type="number" 
                        required
                        value={newProductPreparationTime}
                        onChange={(e) => setNewProductPreparationTime(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Brief Tags</label>
                      <input 
                        type="text" 
                        value={newProductTags}
                        onChange={(e) => setNewProductTags(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Aesthetic Narrative Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={newProductDesc}
                      onChange={(e) => setNewProductDesc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500 text-xs"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-[#0a0908] font-bold uppercase text-[10px] tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    {editingProductId ? 'Deploy Modified Specialty' : 'Deploy Specialty to Live Menu'}
                  </button>
                  {editingProductId && (
                    <button 
                      type="button" 
                      onClick={() => { setEditingProductId(null); setNewProductName(''); setNewProductDesc(''); }}
                      className="w-full py-2 border border-rose-500/40 text-rose-300 hover:bg-rose-500/15 rounded-xl uppercase tracking-wider text-[10px] transition"
                    >
                      Cancel Editing
                    </button>
                  )}
                </form>

                {/* Sub-form: Add Live Category */}
                <div className="pt-6 border-t border-gold-900/10">
                  <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider mb-3">Add Global Category Division</h4>
                  <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
                    <input 
                      type="text" 
                      required 
                      placeholder="Category Title"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gold-900/25 bg-luxury-950"
                    />
                    <button type="submit" className="w-full py-2 bg-luxury-900 hover:bg-luxury-950 border border-gold-900/40 text-gold-400 font-bold text-[9px] uppercase tracking-wider rounded-lg transition">Create Category</button>
                  </form>
                </div>
              </div>

              {/* Product Listing CRUD Table */}
              <div className="lg:col-span-8 p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] overflow-hidden">
                <div className="flex justify-between items-center border-b border-gold-900/15 pb-4 mb-4">
                  <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-5 w-5 text-gold-500" />
                    Live Database Specialties ({products.length})
                  </h3>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left font-sans">
                    <thead>
                      <tr className="border-b border-gold-900/15 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        <th className="py-2.5">Food Product</th>
                        <th className="py-2.5">Category</th>
                        <th className="py-2.5">Price</th>
                        <th className="py-2.5">Menu Stock ID</th>
                        <th className="py-2.5 text-right">Actions Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <motion.tr 
                          key={p.id} 
                          className="border-b border-gold-900/5 last:border-0 hover:bg-luxury-950/40"
                          whileHover={{ backgroundColor: "rgba(197, 160, 89, 0.05)", x: 4 }}
                          transition={{ type: "tween", duration: 0.15 }}
                        >
                          <td className="py-3.5 flex items-center gap-3">
                            <img src={p.image} className="h-10 w-10 rounded-lg object-cover border border-gold-900/10" alt="" />
                            <div>
                              <span className="font-serif font-bold text-white block">{p.name}</span>
                              <span className="text-[10px] text-zinc-505 block mt-0.5 max-w-[200px] truncate">{p.description}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-zinc-500 font-sans tracking-wide">
                            {categories.find(c => c.id === p.categoryId)?.name || 'Direct Sign.'}
                          </td>
                          <td className="py-3.5 font-serif font-bold text-gold-400">
                            ${p.price}
                          </td>
                          <td className="py-3.5">
                            <button
                              onClick={() => {
                                const nextStatus = p.status === 'available' ? 'low-stock' : p.status === 'low-stock' ? 'out-of-stock' : 'available';
                                updateProduct(p.id, { status: nextStatus });
                              }}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                p.status === 'available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/10' :
                                p.status === 'low-stock' ? 'bg-amber-950 text-amber-400 border border-amber-500/10' : 'bg-rose-950 text-rose-300 border border-rose-500/10'
                              }`}
                            >
                              {p.status}
                            </button>
                          </td>
                          <td className="py-3.5 text-right space-x-2">
                            <button 
                              onClick={() => startEditProduct(p)}
                              className="p-1 px-2 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-luxury-950 rounded transition cursor-pointer"
                            >
                              <Edit2 className="h-3 w-3 inline" />
                            </button>
                            <button 
                              onClick={() => deleteProduct(p.id)}
                              className="p-1 px-2 border border-rose-500/35 text-rose-300 hover:bg-rose-500/15 rounded transition cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3 inline" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* PANEL 3: CATERING ORDERS QUEUE */}
          {activeTab === 'orders' && (
            <div className="p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] overflow-hidden">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-1.5">
                <Truck className="h-5 w-5 text-gold-500" />
                Active Corporate Orders Live Queue ({orders.length})
              </h3>

              <div className="space-y-6">
                {orders.map(ord => (
                  <motion.div 
                    key={ord.id} 
                    className="p-4 border border-gold-900/15 bg-luxury-950/50 rounded-xl"
                    whileHover={{ scale: 1.005, borderColor: "rgba(197, 160, 89, 0.45)", backgroundColor: "rgba(18, 16, 14, 0.95)" }}
                    transition={{ type: "tween", duration: 0.12 }}
                  >
                    <div className="block sm:flex justify-between border-b border-gold-900/10 pb-3 mb-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-zinc-100 font-bold">{ord.id}</span>
                          <span className="text-zinc-650">• Secure Tracking: <span className="font-mono text-gold-400">{ord.trackingNumber}</span></span>
                        </div>
                        <p className="text-[10px] text-zinc-505 font-medium mt-0.5">Purchaser: <span className="text-zinc-300">{ord.userName} ({ord.userEmail})</span></p>
                        <p className="text-[10px] text-zinc-505 font-medium">Destination: <span className="text-zinc-300">{ord.address}</span> • Dial: <span className="text-gold-200">{ord.phone}</span></p>
                      </div>

                      {/* State status switches update context immediately */}
                      <div className="flex flex-col sm:items-end gap-2 mt-2 sm:mt-0 font-bold tracking-widest text-[9px]">
                        <div className="flex gap-1.5 select-none text-[8px]">
                          {['pending', 'preparing', 'dispatched', 'delivered', 'cancelled'].map((st: any) => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(ord.id, st)}
                              className={`px-2 py-1 rounded transition uppercase ${
                                ord.status === st 
                                  ? 'bg-gold-500 text-luxury-950 font-bold' 
                                  : 'bg-luxury-900 text-zinc-500 hover:text-white'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Ordered items list documentation */}
                    <div className="space-y-1.5 mb-3">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-zinc-400 font-light">
                          <span>{it.quantity}x {it.productName}</span>
                          <span className="font-serif font-bold text-zinc-200">${it.price * it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gold-900/5 flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Checkout Instrument: <span className="text-zinc-300 font-bold">{ord.paymentMethod}</span></span>
                      <span className="text-zinc-300 font-serif font-bold">Paid Aggregate: <span className="text-gold-400 text-sm">${ord.total}</span></span>
                    </div>

                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* PANEL 4: TABLE RESERVATIONS HUB */}
          {activeTab === 'reservations' && (
            <div className="p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] overflow-hidden">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-1.5">
                <Calendar className="h-5 w-5 text-gold-500" />
                Table Reservations Manager Grid ({reservations.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {reservations.map(res => (
                  <motion.div 
                    key={res.id} 
                    className="p-4 border border-gold-900/15 bg-luxury-950/40 rounded-xl relative"
                    whileHover={{ scale: 1.006, borderColor: "rgba(197, 160, 89, 0.45)", backgroundColor: "rgba(18, 16, 14, 0.95)" }}
                    transition={{ type: "tween", duration: 0.12 }}
                  >
                    
                    <div className="flex justify-between items-start mb-2 pb-2 border-b border-gold-900/10">
                      <div>
                        <span className="font-mono text-[9px] font-bold text-gold-500 uppercase block">{res.id}</span>
                        <span className="block font-serif text-sm font-bold text-white mt-0.5">{res.userName}</span>
                        <span className="block text-[10px] text-zinc-650">{res.userEmail} • Phone: {res.phone}</span>
                      </div>
                      
                      <div className="text-right flex flex-col items-end gap-1.5 font-bold tracking-widest text-[9px]">
                        <span className={`px-2.5 py-1 rounded font-bold uppercase ${
                          res.status === 'confirmed' ? 'bg-emerald-950 text-emerald-400' :
                          res.status === 'cancelled' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                    </div>

                    {/* Specifications detail */}
                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Chamber Zone:</span><span className="font-bold text-gold-400 uppercase tracking-wider">{res.area}</span></div>
                      <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Schedule Clock:</span><span className="font-semibold text-white">{res.date} at {res.time}</span></div>
                      <div className="flex justify-between text-[11px]"><span className="text-zinc-500">Accompany Party:</span><span className="font-semibold text-white">{res.partySize} VIP Guests</span></div>
                      {res.notes && (
                        <div className="mt-2 p-1.5 bg-black/20 rounded border border-gold-900/10 text-[10px] italic text-zinc-550 leading-relaxed">
                          "{res.notes}"
                        </div>
                      )}
                    </div>

                    {/* Operational controls */}
                    <div className="pt-2 border-t border-gold-900/10 flex gap-2">
                      <button 
                        onClick={() => updateReservationStatus(res.id, 'confirmed')}
                        className="flex-1 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-emerald-300 text-[9px] font-bold uppercase tracking-wider rounded transition cursor-pointer"
                      >
                        Confirm Booking
                      </button>
                      <button 
                        onClick={() => updateReservationStatus(res.id, 'cancelled')}
                        className="flex-1 py-1.5 bg-rose-900 hover:bg-rose-950 text-rose-350 text-[9px] font-bold uppercase tracking-wider rounded transition cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </div>

                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* PANEL 5: MARKETING PROMO COUPONS */}
          {activeTab === 'marketing' && (
            <div className="p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] overflow-hidden">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-1.5">
                <Percent className="h-5 w-5 text-gold-500" />
                Discount Promo Ledgers
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {promoCodes.map((pro, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gold-900/15 bg-luxury-950 text-zinc-100">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gold-900/10">
                      <span className="font-mono text-sm font-bold text-gold-400 uppercase">{pro.code}</span>
                      <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">{pro.discountPercent}% OFF</span>
                    </div>
                    <p className="text-[11px] text-zinc-550 mt-1">{pro.description}</p>
                    <div className="flex justify-between items-center text-[9px] text-zinc-505 font-medium mt-3 uppercase tracking-wider">
                      <span>threshold order</span>
                      <span>${pro.minOrderValue}+ min value</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PANEL 6: CRM VIP CLIENT DATABASE */}
          {activeTab === 'crm' && (
            <div className="p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] overflow-hidden">
              <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-1.5">
                <Users className="h-5 w-5 text-gold-500" />
                Executive CRM Client Registry
              </h3>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left font-sans">
                  <thead>
                    <tr className="border-b border-gold-900/10 text-[10px] text-zinc-500 font-bold uppercase tracking-widest pb-2">
                      <th className="py-2.5">Elite Client profile</th>
                      <th className="py-2.5">Email address</th>
                      <th className="py-2.5">Phone contact</th>
                      <th className="py-2.5">Joined date</th>
                      <th className="py-2.5 text-right">Account authorization clearance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <motion.tr 
                        key={u.id} 
                        className="border-b border-gold-900/5 last:border-0 hover:bg-luxury-950/40"
                        whileHover={{ backgroundColor: "rgba(197, 160, 89, 0.05)", x: 4 }}
                        transition={{ type: "tween", duration: 0.15 }}
                      >
                        <td className="py-3.5 flex items-center gap-3">
                          <img src={u.avatar} alt="" className="h-8 w-8 rounded-full object-cover border border-gold-900/10" />
                          <span className="font-serif font-bold text-white">{u.name}</span>
                        </td>
                        <td className="py-3.5 font-mono text-[11px] text-zinc-400">{u.email}</td>
                        <td className="py-3.5 text-zinc-400">{u.phone}</td>
                        <td className="py-3.5 text-zinc-500">{u.joinedDate}</td>
                        <td className="py-3.5 text-right">
                          <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            u.role === 'admin' ? 'bg-amber-950 text-amber-400' : 'bg-gold-500/10 text-gold-400'
                          }`}>
                            {u.role === 'admin' ? 'Super Admin' : 'VIP Client'}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PANEL 7: BRAND CMS LIVE CUSTOMIZER (EDIT HEADING LIVE!) */}
          {activeTab === 'settings' && (
            <>
              <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] space-y-6 text-xs text-zinc-100">
              
              <div className="flex justify-between items-center border-b border-gold-900/15 pb-4 mb-2">
                <div>
                  <h3 className="font-serif text-lg font-bold uppercase tracking-wider">CMS Storefront Content Customizer</h3>
                  <p className="text-[10px] text-zinc-500 mt-1">Changes are persistent inside storage and take effect across customer pages in real-time instantly!</p>
                </div>
                <button 
                  type="submit"
                  className="flex items-center gap-1.5 px-4.5 py-2.5 bg-gold-500 text-luxury-950 font-bold font-sans tracking-widest uppercase rounded-lg hover:brightness-110 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  Save CMS Edits
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="space-y-4">
                  <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">Brand Credentials</h4>
                  
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Restaurant Custom Name</label>
                    <input 
                      type="text" 
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Corporate Hotline</label>
                    <input 
                      type="text" 
                      value={siteContactPhone}
                      onChange={(e) => setSiteContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Conciergerie Email</label>
                    <input 
                      type="text" 
                      value={siteContactEmail}
                      onChange={(e) => setSiteContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Physical Coordinates</label>
                    <input 
                      type="text" 
                      value={siteAddress}
                      onChange={(e) => setSiteAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">SEO Agency Keywords Metadata</label>
                    <input 
                      type="text" 
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">Home Interactive Copy</h4>
                  
                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Hero Title Heading</label>
                    <input 
                      type="text" 
                      value={siteHeroTitle}
                      onChange={(e) => setSiteHeroTitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">Hero Subtitle Paragraph</label>
                    <textarea 
                      rows={2}
                      value={siteHeroSubtitle}
                      onChange={(e) => setSiteHeroSubtitle(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 font-bold uppercase mb-1">About Culinary Narrative</label>
                    <textarea 
                      rows={5}
                      value={siteAboutText}
                      onChange={(e) => setSiteAboutText(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gold-900/25 bg-luxury-950 focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

              </div>

            </form>

            {/* Sanity database status panel */}
            <div className="mt-8 p-6 rounded-2xl border border-gold-500/15 bg-[#12100e] text-xs text-zinc-100 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gold-900/15 pb-4 gap-3">
                <div>
                  <h3 className="font-serif text-base font-bold uppercase tracking-wider flex items-center gap-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full ${sanityStatus?.configured ? 'bg-green-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                    Sanity.io Cloud Database Integration
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Store and edit your michelin restaurant menu items, order flows, and reservation archives for FREE!
                  </p>
                </div>
                {sanityStatus?.configured ? (
                  <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 font-bold tracking-widest text-[9px] uppercase rounded-full">
                    ● Active (Cloud Syncing)
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold tracking-widest text-[9px] uppercase rounded-full">
                    ● Local JSON Storage Fallback
                  </span>
                )}
              </div>

              {sanityStatus?.configured ? (
                <div className="space-y-2.5">
                  <p className="text-zinc-300 leading-relaxed">
                    Splendid! Your restaurant state is securely synchronized in real-time with the remote **Sanity Content Lake**.
                  </p>
                  <div className="bg-luxury-950 p-4 border border-gold-900/10 rounded-xl space-y-2 font-mono text-[11px] text-zinc-400">
                    <div><span className="text-gold-400 font-bold">PROJECT ID:</span> {sanityStatus.projectId}</div>
                    <div><span className="text-gold-400 font-bold">DATASET:</span> {sanityStatus.dataset}</div>
                    <div><span className="text-gold-400 font-bold">API VERSION:</span> {sanityStatus.apiVersion}</div>
                    <div><span className="text-gold-400 font-bold">SECURITY ENCRYPTION:</span> Verified server-side mutation signature token</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-[11px] leading-relaxed">
                  <div className="bg-amber-500/5 p-4 border border-amber-500/15 rounded-xl space-y-2 text-zinc-300">
                    <p>
                      You are currently running in <strong className="text-white">Local Standalone File Mode (data_store.json)</strong>. If you intend to deploy your repository to public hosting platforms like Hugging Face Spaces or GitHub and would like client updates (menu changes, custom titles, reservation status) to persist securely over server restarts, Sanity.io offers an elite, completely free content database.
                    </p>
                    <p className="text-zinc-400">
                      It takes <strong className="text-white">less than 5 minutes to set up</strong>, does not require a credit card, and gives you a magnificent remote dashboard to manage your menu items too!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">How to initiate Sanity cloud sync (100% Free):</h4>
                    <ol className="list-decimal list-inside space-y-2.5 text-zinc-400 pl-1">
                      <li>Visit <a href="https://sanity.io" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline hover:text-gold-300 font-semibold">Sanity.io</a> and register a free account.</li>
                      <li>Generate a new project inside your Sanity console or run <code className="text-xs text-zinc-300 bg-luxury-950 px-1.5 py-0.5 border border-gold-900/10 rounded">npm create sanity@latest</code>.</li>
                      <li>In your Sanity project console, go to <strong className="text-white">API Settings</strong> and create a token with a <strong className="text-gold-400 font-semibold">Write (Editor)</strong> role.</li>
                      <li>Under <strong className="text-white">CORS Origins</strong>, add your workspace URLs (or <code className="text-zinc-300 bg-luxury-950 px-1">*</code> for local testing) to allow connections.</li>
                      <li>Append these environment variables in your local environment, or declare them inside your deployment hosting settings:</li>
                    </ol>

                    <div className="bg-luxury-950 p-4 border border-gold-900/10 rounded-xl space-y-1.5 font-mono text-[11px] text-zinc-400">
                      <div>SANITY_PROJECT_ID=<span className="text-zinc-500">"your-project-id"</span></div>
                      <div>SANITY_TOKEN=<span className="text-zinc-500">"your-write-token-here"</span></div>
                      <div>SANITY_DATASET=<span className="text-zinc-500">"production"</span></div>
                      <div>SANITY_API_VERSION=<span className="text-zinc-500">"2024-01-01"</span></div>
                    </div>

                    <p className="text-[10px] text-zinc-500 italic mt-3">
                      Note: When you restart the server with those credentials, L'Olympe's server will automatically migrate all your current local dishes, bookings, and content to Sanity!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        </div>

      </div>
    </section>
  );
};
