import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Package, Users, Star, LogOut, CheckCircle, Clock, Download, Trash2, Home, Menu, X, LayoutDashboard, MessageSquare, MapPin, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdminAIChatbot from '../components/AdminAIChatbot';
import AdminProductManager from '../components/AdminProductManager';
import AdminDealerManager from '../components/AdminDealerManager';
import AdminOrderManager from '../components/AdminOrderManager';
import AdminLeadManager from '../components/AdminLeadManager';
import AdminReviewManager from '../components/AdminReviewManager';
import AdminUserManager from '../components/AdminUserManager';
import AdminDealerEnquiryManager from '../components/AdminDealerEnquiryManager';
import AdminWebmail from '../components/AdminWebmail';
import { Mail } from 'lucide-react';
import { isSuperAdminEmail } from '../utils/adminAuth';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  productName?: string;
  price?: number;
  items?: any[];
  totalPrice?: number;
  status: string;
  createdAt: string;
}

interface Lead {
  id: string;
  dealerId?: string;
  dealerDocId?: string;
  dealerSlug?: string;
  dealerName?: string;
  dealerCity?: string;
  source?: string;
  name: string;
  phone: string;
  vehicle: string;
  message: string;
  status?: string;
  createdAt: string;
}

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  comment?: string;
  status?: string;
  createdAt?: string;
  date?: string;
}

export default function AdminDashboard() {
  const { currentUser, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'leads' | 'reviews' | 'products' | 'dealers' | 'users' | 'dealerEnquiries' | 'webmail'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dealerEnquiries, setDealerEnquiries] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [dealersCount, setDealersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDealerFilter, setSelectedDealerFilter] = useState('main');

  const isSuperAdmin = isSuperAdminEmail(currentUser?.email);

  useEffect(() => {
    if (!authLoading && (!currentUser || !isSuperAdmin)) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, authLoading, isSuperAdmin, navigate]);

  useEffect(() => {
    if (!currentUser || !isSuperAdmin) return;

    setLoading(true);
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 600);

    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => setUsersCount(snap.size), (err) => console.log("Users error:", err));
    const unsubDealers = onSnapshot(collection(db, 'dealers'), (snap) => setDealersCount(snap.size), (err) => console.log("Dealers error:", err));

    // Real-time listener for orders
    const ordersQ = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(ordersQ, (snap) => {
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Order[]);
    }, (err) => console.log("Orders error:", err));

    // Real-time listener for dealer enquiries
    const enquiriesQ = query(collection(db, 'dealerEnquiries'), orderBy('createdAt', 'desc'));
    const unsubEnquiries = onSnapshot(enquiriesQ, (snap) => {
      setDealerEnquiries(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.log("Enquiries error:", err));

    // Real-time listener for leads
    const leadsQ = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubLeads = onSnapshot(leadsQ, (snap) => {
      setLeads(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Lead[]);
    }, (err) => console.log("Leads error:", err));
    
    // Real-time listener for reviews
    const reviewsQ = query(collection(db, 'reviews'));
    const unsubReviews = onSnapshot(reviewsQ, (snap) => {
      const fetchedReviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
      fetchedReviews.sort((a, b) => new Date(b.date || b.createdAt || 0).getTime() - new Date(a.date || a.createdAt || 0).getTime());
      setReviews(fetchedReviews);
      setLoading(false);
    }, (error) => {
      console.log("No reviews collection yet", error);
      setLoading(false);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubOrders();
      unsubEnquiries();
      unsubLeads();
      unsubReviews();
      unsubUsers();
      unsubDealers();
    };
  }, [currentUser, isSuperAdmin]);

   // Kept for backwards compatibility if called elsewhere


  const mainLeads = leads.filter(l => !l.dealerId && !l.dealerDocId && l.source !== 'dealer_page');
  const dealerLeads = leads.filter(l => Boolean(l.dealerId || l.dealerDocId || l.dealerSlug || l.source === 'dealer_page'));

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update status");
    }
  };
  
  const updateReviewStatus = async (reviewId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'reviews', reviewId), { status: newStatus });
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteDoc(doc(db, "orders", orderId));
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await deleteDoc(doc(db, "leads", leadId));
      setLeads(prev => prev.filter(l => l.id !== leadId));
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };
  
  const deleteReview = async (reviewId: string) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const downloadCSV = (type: 'leads' | 'orders' | 'dealerEnquiries') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
        if (type === 'dealerEnquiries') {
      csvContent += "Date,Name,Business Name,Phone,Email,City,State,Volume,Message,Status\n" + dealerEnquiries.map((enq: any) => {
        return [
          `"${enq.createdAt ? new Date(enq.createdAt.toDate ? enq.createdAt.toDate() : enq.createdAt).toLocaleDateString() : ''}"`,
          `"${enq.name?.replace(/"/g, '""')}"`,
          `"${enq.businessName?.replace(/"/g, '""')}"`,
          `"${enq.phone}"`,
          `"${enq.email}"`,
          `"${enq.city}"`,
          `"${enq.state}"`,
          `"${enq.volume}"`,
          `"${enq.message?.replace(/"/g, '""') || ''}"`,
          `"${enq.status}"`
        ].join(',');
      }).join("\n");
    } else if (type === 'leads') {
      csvContent += "Date,Name,Phone,Vehicle,Message\n" + leads.map(lead => {
        return [
          `"${new Date(lead.createdAt).toLocaleDateString()}"`,
          `"${lead.name.replace(/"/g, '""')}"`,
          `"${lead.phone}"`,
          `"${lead.vehicle}"`,
          
          `"${(lead.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
        ].join(',');
      }).join('\n');
    } else {
       csvContent += "Date,Order ID,Customer,Phone,City,Product,Price,Status\n" + orders.map(order => {
        return [
          `"${new Date(order.createdAt).toLocaleDateString()}"`,
          `"${order.id}"`,
          `"${order.customerName.replace(/"/g, '""')}"`,
          `"${order.phone}"`,
          `"${order.city}"`,
          `"${order.items ? order.items.map((i:any) => i.title).join(', ') : order.productName}"`,
          `"${order.totalPrice || order.price}"`,
          `"${order.status}"`
        ].join(',');
      }).join('\n');
    }

    const blob = new Blob([csvContent.replace('data:text/csv;charset=utf-8,', '')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!currentUser || !isSuperAdmin) return null;

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveTab(id as any); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-red-600 text-white font-bold shadow-md' 
          : 'text-slate-600 hover:bg-slate-100 font-medium'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-[100dvh] bg-slate-100 flex overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <Link aria-label="Navigation Link"  to="/" className="flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-red-600" />
            <span className="text-xl font-black text-slate-900 tracking-tight">Admin<span className="text-red-600">Pro</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-50 text-slate-500 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 flex-grow flex flex-col gap-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Menu</p>
          <NavItem id="dashboard" icon={LayoutDashboard} label="Home Dashboard" />
          <NavItem id="webmail" icon={Mail} label="Server Webmail" />
          <NavItem id="products" icon={Package} label="Manage Products" />
          <NavItem id="orders" icon={Package} label="Customer Orders" />
          <NavItem id="leads" icon={Users} label="Contact Messages" />
          <NavItem id="dealerEnquiries" icon={Building2} label="Dealer Enquiries" />
          <NavItem id="reviews" icon={Star} label="Customer Reviews" />
          <NavItem id="dealers" icon={MapPin} label="Manage Dealers" />
          <NavItem id="users" icon={Users} label="App Users" />
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl mb-4 border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-100 flex flex-shrink-0 items-center justify-center text-red-600 font-bold">
              {currentUser.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser.displayName || 'Admin User'}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await logout();
              window.location.href = '/login';
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 -ml-1.5 text-slate-500 hover:text-slate-900 bg-slate-50 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 capitalize tracking-tight truncate">
              {activeTab === 'dashboard' ? 'Overview' : activeTab}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <a aria-label="Navigation Link" href="https://abstracker.in" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 bg-slate-100 px-3 sm:px-4 py-2 rounded-lg transition-colors">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Website</span>
            </a>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Business Overview</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">Real-time stats and metrics for AbsTracker</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems Online
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Metric 1 */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                        <Package className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-lg">Orders</span>
                    </div>
                    <p className="relative z-10 text-3xl font-black text-slate-900 mb-1">{orders.length}</p>
                    <p className="relative z-10 text-xs font-bold text-slate-500 uppercase tracking-widest">Total Orders</p>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Network</span>
                    </div>
                    <p className="relative z-10 text-3xl font-black text-slate-900 mb-1">{dealersCount}</p>
                    <p className="relative z-10 text-xs font-bold text-slate-500 uppercase tracking-widest">Active Dealers</p>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Accounts</span>
                    </div>
                    <p className="relative z-10 text-3xl font-black text-slate-900 mb-1">{usersCount}</p>
                    <p className="relative z-10 text-xs font-bold text-slate-500 uppercase tracking-widest">Total Users</p>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
                    <div className="relative z-10 flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Website Leads</span>
                    </div>
                    <p className="relative z-10 text-3xl font-black text-slate-900 mb-1">{mainLeads.length}</p>
                    <p className="relative z-10 text-xs font-bold text-slate-500 uppercase tracking-widest">Direct Inquiries</p>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                     {/* Combine recent orders and direct website leads */}
                     {[
                       ...orders.map(o => ({ type: 'order', date: o.createdAt, name: o.customerName, desc: `Placed order for ${o.items ? o.items.map((i:any) => i.title).join(', ') : o.productName}` })),
                       ...mainLeads.map(l => ({ type: 'lead', date: l.createdAt, name: l.name, desc: `Submitted direct website inquiry` }))
                     ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((item, i) => (
                       <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.type === 'order' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {item.type === 'order' ? <Package className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.name} <span className="font-normal text-slate-600">{item.desc}</span></p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(item.date).toLocaleString()}</p>
                          </div>
                       </div>
                     ))}
                     {orders.length === 0 && mainLeads.length === 0 && (
                       <p className="text-slate-500 italic">No recent activity.</p>
                     )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <AdminProductManager />
            )}

            {activeTab === 'dealers' && (
              <AdminDealerManager />
            )}

            {activeTab === 'orders' && (
              <AdminOrderManager orders={orders} setOrders={setOrders} downloadCSV={downloadCSV} />
            )}

            {activeTab === 'dealerEnquiries' && (
              <AdminDealerEnquiryManager enquiries={dealerEnquiries} setEnquiries={setDealerEnquiries} downloadCSV={downloadCSV} />
            )}
            {activeTab === 'leads' && (
              <AdminLeadManager leads={leads} setLeads={setLeads} downloadCSV={downloadCSV} />
            )}

            {activeTab === 'reviews' && (
              <AdminReviewManager reviews={reviews} setReviews={setReviews} />
            )}

            {activeTab === 'users' && (
              <AdminUserManager />
            )}
            {activeTab === 'webmail' && (
              <AdminWebmail />
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}
