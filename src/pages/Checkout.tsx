import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ShieldCheck, Truck, ArrowRight, Loader2, CreditCard, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';

export default function Checkout() {
  const { cart, totalPrice, clearCart, updateQuantity } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    // If cart is empty, redirect to products
    if (cart.length === 0 && !success) {
      navigate('/products');
    }

    if (currentUser) {
      const fetchUserProfile = async () => {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData(prev => ({
              ...prev,
              name: data.displayName || currentUser.displayName || '',
              email: data.email || currentUser.email || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              pincode: data.pincode || '',
            }));
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchUserProfile();
    }
  }, [currentUser, cart.length, success, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create the order
      const orderData = {
        userId: currentUser?.uid || 'guest',
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: cart,
        totalPrice: totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
      
      // 2. Reduce stock for each item
      for (const item of cart) {
        if (item.stock > 0) {
          const productRef = doc(db, 'products', item.id);
          const currentProductSnap = await getDoc(productRef);
          if (currentProductSnap.exists()) {
             const currentStock = currentProductSnap.data().stock || 0;
             await updateDoc(productRef, {
               stock: Math.max(0, currentStock - item.quantity)
             });
          }
        }
      }

      setSuccess(true);
      clearCart();
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center bg-slate-50">
        <SEO title="Order Successful | AbsTracker" />
        <div className="bg-white p-12 rounded-3xl text-center max-w-lg shadow-xl border border-slate-100">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Order Confirmed!</h2>
          <p className="text-slate-600 mb-2">Thank you for your purchase.</p>
          <p className="text-sm font-bold text-slate-800 bg-slate-100 p-4 rounded-xl mb-8">
            Order ID: {orderId}
          </p>
          <button aria-label="Button action"  
            onClick={() => navigate(`/track/${orderId}`)}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Track Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <SEO title="Checkout | AbsTracker" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-900 mb-12">Secure Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Truck className="w-6 h-6 text-blue-600" /> Shipping Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Full Address (Installation Location)</label>
                  <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">City</label>
                  <input required name="city" value={formData.city} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">State</label>
                  <input required name="state" value={formData.state} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Pincode</label>
                  <input required name="pincode" value={formData.pincode} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-600" /> Payment
                </h2>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center gap-4">
                  <input type="radio" checked readOnly className="w-5 h-5 text-blue-600 focus:ring-blue-500" />
                  <div>
                    <p className="font-bold text-slate-900">Cash on Delivery / Installation</p>
                    <p className="text-sm text-slate-500">Pay when the device is installed at your location.</p>
                  </div>
                </div>
              </div>

              <button aria-label="Button action"  
                type="submit" 
                disabled={loading}
                className="w-full mt-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>Complete Order <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900 text-white p-8 rounded-3xl sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-blue-400" /> Order Summary</h3>
              
              <div className="space-y-6 mb-8">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex justify-between items-center pb-4 border-b border-slate-800">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0">
                         {item.images?.[0] ? <img width="800" height="600"  loading="lazy" src={item.images[0]} alt="" className="w-full h-full object-cover" /> : null}
                      </div>
                      <div>
                        <p className="font-bold line-clamp-1">{item.title}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4 mb-6 text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Installation</span>
                  <span className="font-bold text-emerald-400">Free</span>
                </div>
              </div>
              
              <div className="border-t border-slate-800 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-3xl font-black text-blue-400">₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
