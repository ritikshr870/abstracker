import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { motion } from 'motion/react';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <SEO title="Your Cart | AbsTracker" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-900 mb-12">Your Cart</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Your cart is empty</h2>
            <Link aria-label="Navigation Link"  to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3 space-y-4">
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-6 items-center"
                >
                  <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.images?.[0] ? (
                      <img width="800" height="600"  loading="lazy" src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">No Img</div>
                    )}
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-bold text-lg text-slate-900">{item.title}</h3>
                    <p className="text-blue-600 font-bold mt-1">₹{item.price}</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-white rounded-md transition-all duration-150 active:scale-90 select-none"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-700 select-none">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                        className="p-2 hover:bg-white rounded-md transition-all duration-150 active:scale-90 select-none"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-150 active:scale-90 select-none"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 sticky top-32">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-slate-900">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-600">Free</span>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-3xl font-black text-blue-600">₹{totalPrice}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    if (!currentUser) {
                      navigate('/login?redirect=checkout');
                    } else {
                      navigate('/checkout');
                    }
                  }}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-150 active:scale-95 active:opacity-90 select-none flex justify-center items-center gap-2 text-lg shadow-lg shadow-blue-600/20 min-h-[44px]"
                >
                  {currentUser ? 'Proceed to Checkout' : 'Tap to Login & Checkout'} <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
