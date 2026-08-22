import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Package, Truck, CheckCircle2, Clock, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders: any[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort client side since we might not have a composite index
        fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Installed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Processing': return <Truck className="w-4 h-4" />;
      case 'Installed': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">My Orders</h1>
          <p className="text-slate-600 font-medium">Track your recent purchases and installations</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm animate-pulse">
                <div className="border-b border-slate-100 p-6 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div>
                      <div className="h-5 w-32 bg-slate-200 rounded-md mb-2"></div>
                      <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
                    </div>
                  </div>
                  <div className="h-8 w-28 bg-slate-200 rounded-full"></div>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="h-4 w-20 bg-slate-200 rounded-md mb-2"></div>
                      <div className="h-6 w-40 bg-slate-200 rounded-md"></div>
                    </div>
                    <div>
                      <div className="h-4 w-20 bg-slate-200 rounded-md mb-2"></div>
                      <div className="h-6 w-40 bg-slate-200 rounded-md"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders found</h3>
            <p className="text-slate-500 mb-8 font-medium">You haven't placed any orders for GPS devices yet.</p>
            <button aria-label="Button action"  
              onClick={() => navigate('/services/ais-140-gps-solutions-in-india')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Explore Products <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6 border-b border-slate-100 pb-6">
                  <div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Order ID</div>
                    <div className="font-mono text-slate-900 font-bold">{order.id}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-slate-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-bold ${getStatusColor(order.status || 'Pending')}`}>
                      {getStatusIcon(order.status || 'Pending')}
                      {order.status || 'Pending'}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      {order.items && order.items.length > 0 ? (
                        <div className="mb-2">
                           {order.items.map((item: any, i: number) => (
                              <h4 key={i} className="font-bold text-lg text-slate-900 mb-1">{item.title} <span className="text-slate-500 text-sm">x{item.quantity}</span></h4>
                           ))}
                        </div>
                      ) : (
                        <h4 className="font-bold text-lg text-slate-900 mb-1">{order.productName || 'GPS Tracker'}</h4>
                      )}
                      
                      {order.vehicleReg && <div className="text-slate-600 font-medium mb-2">Vehicle: <span className="text-slate-900 uppercase">{order.vehicleReg}</span></div>}
                      <div className="text-lg font-black text-slate-900">₹{(order.totalPrice || order.price || 0).toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm mb-1">Installation Details</div>
                        <div className="text-sm text-slate-600 font-medium mb-1">{order.customerName} • {order.phone}</div>
                        <div className="text-sm text-slate-600 mb-3">{order.address}, {order.city}</div>
                        <button aria-label="Button action"  
                          onClick={() => navigate(`/track/${order.id}`)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-sm transition-colors"
                        >
                          Track Order <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
