import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, ArrowLeft } from 'lucide-react';

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(doc(db, 'orders', id), (docSnap) => {
      if (docSnap.exists()) {
        const orderData = docSnap.data();
        if (orderData.userId !== 'guest' && (!currentUser || orderData.userId !== currentUser.uid)) {
           // Allow guests to view their order, or allow logged in users to view their own order
           setError('You do not have permission to view this order.');
        } else {
           setOrder({ id: docSnap.id, ...orderData });
           setError('');
        }
      } else {
        setError('Order not found.');
      }
      setLoading(false);
    }, (err) => {
      console.error("Error listening to order:", err);
      setError('Failed to load order details.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id, currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 space-y-6">
           <div className="h-10 w-40 bg-slate-200 animate-pulse rounded-lg mb-8"></div>
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-pulse h-64"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex justify-center items-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-500">{error}</p>
          <button aria-label="Button action"  onClick={() => navigate('/orders')} className="mt-6 text-blue-600 font-bold hover:underline">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'Pending', label: 'Order Placed', icon: Package },
    { id: 'Processing', label: 'Processing', icon: Package },
    { id: 'Shipped', label: 'Shipped', icon: Truck },
    { id: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin },
    { id: 'Completed', label: 'Completed', icon: CheckCircle },
  ];


  if (order?.status === 'Cancelled') {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 text-center space-y-6">
           <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
           <h1 className="text-3xl font-black text-slate-900">Order Cancelled</h1>
           <p className="text-slate-500">This order has been cancelled.</p>
           <button onClick={() => navigate('/profile')} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(s => s.id === order.status);
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button aria-label="Button action"  
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 md:p-10 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Order ID</p>
                <h1 className="text-2xl font-black text-slate-900">#{order.id.slice(-8).toUpperCase()}</h1>
                <p className="text-slate-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold">
                  {order.status === 'Completed' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5 animate-pulse" />}
                  {order.status}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-slate-100 rounded-full hidden sm:block"></div>
              <motion.div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-blue-600 rounded-full hidden sm:block origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: activeIndex / (steps.length - 1) }}
                transition={{ duration: 1, ease: "easeOut" }}
              ></motion.div>

              <div className="flex flex-col sm:flex-row justify-between gap-8 relative z-10">
                {steps.map((step, index) => {
                  const isCompleted = index <= activeIndex;
                  const isCurrent = index === activeIndex;
                  
                  return (
                    <div key={step.id} className="flex sm:flex-col items-center gap-4 sm:gap-3 group relative">
                       {/* Mobile Vertical Line */}
                       {index !== steps.length - 1 && (
                         <div className={`absolute left-6 top-12 bottom-[-2rem] w-1 sm:hidden ${isCompleted ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                       )}

                      <motion.div 
                        initial={false}
                        animate={{ 
                          backgroundColor: isCompleted ? '#2563eb' : '#f1f5f9',
                          borderColor: isCurrent ? '#bfdbfe' : 'transparent',
                          scale: isCurrent ? 1.1 : 1
                        }}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-4 relative z-10 ${isCompleted ? 'text-white shadow-lg shadow-blue-600/30' : 'text-slate-400'}`}
                      >
                        <step.icon className="w-5 h-5" />
                      </motion.div>
                      <div className="sm:text-center">
                        <p className={`font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                        {isCurrent && (
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mt-1">In Progress</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 md:p-10 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Order Details</h3>
            <div className="grid sm:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">Items</p>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any, idx: number) => (
                     <p key={idx} className="font-bold text-slate-900">{item.title} x {item.quantity}</p>
                  ))
                ) : (
                  <p className="font-bold text-slate-900">{order.productName || 'GPS Device'}</p>
                )}
                <p className="text-slate-600 mt-1">Total: ₹{(order.totalPrice || order.price || 0).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">Shipping Address</p>
                <p className="font-bold text-slate-900">{order.customerName}</p>
                <p className="text-slate-600 mt-1">{order.address}</p>
                <p className="text-slate-600">{order.city}, {order.pincode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
