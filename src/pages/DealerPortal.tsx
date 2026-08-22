import { useState, useEffect, useMemo } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { ShieldCheck, Settings, LogOut, Package, MapPin, Users, Calendar, Clock, Download, Home, MessageSquare, PhoneCall, MessageCircle, Search, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import AdminDealerManager from "../components/AdminDealerManager";
import AdminProductManager from "../components/AdminProductManager";

interface Lead {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  message: string;
  createdAt: string;
  dealerId?: string;
  dealerDocId?: string;
  dealerSlug?: string;
  dealerName?: string;
  dealerCity?: string;
  status?: string;
  source?: string;
}

export default function DealerPortal() {
  const [activeTab, setActiveTab] = useState<"leads" | "settings" | "products">("leads");
  const [currentDealerId, setCurrentDealerId] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [dealerInfo, setDealerInfo] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dealer Portal | AbsTracker";
    const dealerId = localStorage.getItem('dealerAuth');
    if (dealerId) setCurrentDealerId(dealerId);
    
    if (!dealerId) {
      navigate('/login', { replace: true });
      return;
    }

    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 800);

    fetchDealerData(dealerId);
    return () => clearTimeout(safetyTimer);
  }, [navigate]);

  const fetchDealerData = async (dealerId: string) => {
    try {
      const docRef = doc(db, 'dealers', dealerId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setDealerInfo({ id: snap.id, ...snap.data() });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentDealerId) return;

    // Real-time listener on leads collection with multi-identifier filtering
    const unsubscribe = onSnapshot(collection(db, 'leads'), (querySnapshot) => {
      const targetDocId = currentDealerId.toLowerCase().trim();
      const targetSlug = dealerInfo?.websiteSlug?.toLowerCase()?.trim();
      const targetCity = dealerInfo?.city?.toLowerCase()?.replace(/[\s&]+/g, '-')?.trim();
      const targetBrand = dealerInfo?.brandName?.toLowerCase()?.trim();

      const allLeads = querySnapshot.docs.map(d => ({
        id: d.id,
        ...d.data()
      })) as Lead[];

      // Filter leads that belong to this dealer
      const filtered = allLeads.filter(lead => {
        const leadDealerId = String(lead.dealerId || '').toLowerCase().trim();
        const leadDealerDocId = String(lead.dealerDocId || '').toLowerCase().trim();
        const leadDealerSlug = String(lead.dealerSlug || '').toLowerCase().trim();
        const leadDealerCity = String(lead.dealerCity || '').toLowerCase().replace(/[\s&]+/g, '-').trim();
        const leadDealerName = String(lead.dealerName || '').toLowerCase().trim();

        // 1. Direct docId match
        if (leadDealerDocId === targetDocId || leadDealerId === targetDocId) return true;
        // 2. Slug match
        if (targetSlug && (leadDealerSlug === targetSlug || leadDealerId === targetSlug)) return true;
        // 3. City match
        if (targetCity && (leadDealerCity === targetCity || leadDealerId === targetCity)) return true;
        // 4. Brand match
        if (targetBrand && (leadDealerName.includes(targetBrand) || targetBrand.includes(leadDealerName))) return true;

        return false;
      });

      // Sort newest first
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      setLeads(filtered);
      setLoading(false);
      setErrorMsg("");
    }, (err) => {
      console.error("Error fetching leads:", err);
      if (err.message && err.message.includes("permission")) {
        setErrorMsg("Permission issue: Please check Firestore Rules.");
      } else {
        setErrorMsg("Failed to load leads.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentDealerId, dealerInfo]);

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        status: newStatus
      });
    } catch (err) {
      console.error("Error updating lead status:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dealerAuth');
    window.location.href = '/login';
  };

  const displayedLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesSearch = 
        !searchTerm || 
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        l.phone?.includes(searchTerm) || 
        l.vehicle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.message?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || (l.status || 'new') === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

  const downloadCSV = () => {
    if (leads.length === 0) return;
    const headers = ['Date', 'Customer Name', 'Phone', 'Vehicle', 'Message', 'Status'];
    const rows = leads.map(l => [
      new Date(l.createdAt).toLocaleDateString() + ' ' + new Date(l.createdAt).toLocaleTimeString(),
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.vehicle || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      l.status || 'new'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dealer_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex w-full overflow-x-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed inset-y-0 z-10 hidden lg:flex">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-red-500" /> 
            Portal
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 truncate">
            {dealerInfo?.brandName || dealerInfo?.city || 'Franchise Partner'}
          </p>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          {dealerInfo?.websiteSlug && (
            <a 
              href={`https://${dealerInfo.websiteSlug}.abstracker.in`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Home className="w-5 h-5" /> View My Website
            </a>
          )}
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'leads' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-5 h-5" /> Customer Bookings
            {leads.length > 0 && (
              <span className="ml-auto bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-black">
                {leads.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'products' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-5 h-5" /> My Products
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'settings' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-5 h-5" /> Page &amp; SEO Settings
          </button>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-bold transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 w-full max-w-full lg:ml-64 p-4 lg:p-8 pb-24 lg:pb-8">
        {/* Mobile Header (Sticky Top) */}
        <div className="lg:hidden sticky top-4 z-40 flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl mb-6 shadow-lg">
          <div className="font-black flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-red-500" /> {dealerInfo?.brandName || 'Dealer Portal'}
          </div>
          <button onClick={handleLogout} className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Bottom Navigation Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
          <div className="flex justify-around items-center p-2">
             <button 
              onClick={() => setActiveTab('leads')}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-xl transition-all ${activeTab === 'leads' ? 'text-red-600 bg-red-50' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               <Users className={`w-6 h-6 mb-1 ${activeTab === 'leads' ? 'scale-110' : ''} transition-transform`} />
               <span className="text-[10px] font-black uppercase tracking-wider">Bookings ({leads.length})</span>
             </button>
             <button 
              onClick={() => setActiveTab('products')}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-xl transition-all ${activeTab === 'products' ? 'text-red-600 bg-red-50' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               <Package className={`w-6 h-6 mb-1 ${activeTab === 'products' ? 'scale-110' : ''} transition-transform`} />
               <span className="text-[10px] font-black uppercase tracking-wider">Products</span>
             </button>
             <button 
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-xl transition-all ${activeTab === 'settings' ? 'text-red-600 bg-red-50' : 'text-slate-500 hover:bg-slate-50'}`}
             >
               <Settings className={`w-6 h-6 mb-1 ${activeTab === 'settings' ? 'scale-110' : ''} transition-transform`} />
               <span className="text-[10px] font-black uppercase tracking-wider">Settings</span>
             </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === 'leads' && (
            <>
              <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-1">Customer Inquiries &amp; Bookings</h1>
                  <p className="text-slate-500 font-medium">Manage leads received directly through your franchise landing page.</p>
                </div>
                {leads.length > 0 && (
                  <button 
                    onClick={downloadCSV}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md text-sm self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                )}
              </header>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Inquiries</span>
                    <p className="text-3xl font-black text-slate-900">{leads.length}</p>
                 </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block mb-1">New</span>
                    <p className="text-3xl font-black text-amber-600">{leads.filter(l => (l.status || 'new') === 'new').length}</p>
                 </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block mb-1">In Discussion</span>
                    <p className="text-3xl font-black text-blue-600">{leads.filter(l => l.status === 'in_progress').length}</p>
                 </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block mb-1">Converted</span>
                    <p className="text-3xl font-black text-emerald-600">{leads.filter(l => l.status === 'installed').length}</p>
                 </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search by customer name, phone, or vehicle..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in_progress">In Discussion</option>
                  <option value="installed">Installed / Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h2 className="text-xl font-black text-slate-900">Inquiry List ({displayedLeads.length})</h2>
                </div>
                {errorMsg && <div className="bg-red-100 text-red-600 p-4 m-6 rounded-xl font-bold">{errorMsg}</div>}
                
                {displayedLeads.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p className="font-bold text-lg text-slate-700 mb-1">No customer inquiries found</p>
                    <p className="text-sm max-w-md mx-auto text-slate-500">
                      When visitors fill out the booking form on your landing page ({dealerInfo?.websiteSlug ? `${dealerInfo.websiteSlug}.abstracker.in` : 'franchise page'}), their inquiries will appear here in real time.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                          <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Date &amp; Time</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Vehicle &amp; Details</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-wider">Quick Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedLeads.map(lead => {
                          const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '');
                          const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                          const waMessage = encodeURIComponent(`Hello ${lead.name || 'Sir/Madam'}, thank you for contacting AbsTracker ${dealerInfo?.brandName || ''} regarding GPS installation for your ${lead.vehicle || 'vehicle'}. How can we assist you today?`);

                          return (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                  <Calendar className="w-4 h-4 text-slate-400" />
                                  {new Date(lead.createdAt).toLocaleDateString()}
                                </div>
                                <div className="text-xs text-slate-500 font-medium ml-6 mt-0.5">
                                  {new Date(lead.createdAt).toLocaleTimeString()}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-900 text-base">{lead.name}</div>
                                <a href={`tel:${lead.phone}`} className="text-sm text-red-600 font-bold hover:underline flex items-center gap-1 mt-0.5">
                                  <PhoneCall className="w-3.5 h-3.5" /> {lead.phone}
                                </a>
                              </td>
                              <td className="px-6 py-4">
                                <div className="inline-block px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold uppercase tracking-wider mb-1">
                                  {lead.vehicle || 'Standard Vehicle'}
                                </div>
                                {lead.message && (
                                  <p className="text-xs text-slate-600 line-clamp-2 max-w-xs mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    "{lead.message}"
                                  </p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <select 
                                  value={lead.status || 'new'}
                                  onChange={e => handleUpdateStatus(lead.id, e.target.value)}
                                  className={`text-xs font-black px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                                    lead.status === 'installed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                    lead.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    lead.status === 'closed' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                                    'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}
                                >
                                  <option value="new">New Lead</option>
                                  <option value="in_progress">In Discussion</option>
                                  <option value="installed">Installed / Converted</option>
                                  <option value="closed">Closed / Cancelled</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={`https://wa.me/${waPhone}?text=${waMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs shadow-sm"
                                    title="Chat on WhatsApp"
                                  >
                                    <MessageCircle className="w-4 h-4" /> WhatsApp
                                  </a>
                                  <a 
                                    href={`tel:${lead.phone}`}
                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs shadow-sm"
                                    title="Call Customer"
                                  >
                                    <PhoneCall className="w-4 h-4" /> Call
                                  </a>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <header className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">My Page Settings &amp; SEO</h1>
                <p className="text-slate-500 font-bold">Manage your public franchise landing page information, Meta Title, Description, and Images.</p>
              </header>
              <AdminDealerManager fixedDealerId={currentDealerId} />
            </>
          )}

          {activeTab === 'products' && (
            <>
              <header className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-2">My Products</h1>
                <p className="text-slate-500 font-bold">Manage the products displayed on your specific franchise page.</p>
              </header>
              <AdminProductManager dealerId={currentDealerId} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

