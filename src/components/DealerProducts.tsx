import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { IndianRupee, ShieldCheck, Cpu, Battery, Map, Send, CheckCircle2, Loader2, X } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: string | number;
  originalPrice?: number;
  description: string;
  detailedFeatures?: string;
  images?: string[];
  isRtoApproved?: boolean;
}

export default function DealerProducts({ dealerId, themeColor }: { dealerId: string, themeColor: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Booking form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      if (!dealerId) return;
      try {
        const snap = await getDocs(collection(db, 'products'));
        const prods = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        
        const dealerProds = prods.filter(p => p.dealerId === dealerId);
        // Only show products specifically added by this dealer
        setProducts(dealerProds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [dealerId]);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        vehicle: formData.vehicle.trim() || 'Standard Vehicle',
        message: formData.message.trim() || `Product Booking: ${selectedProduct?.title || 'GPS Tracker'}`,
        productOfInterest: selectedProduct?.title || 'GPS Device',
        dealerId: dealerId || null,
        dealerDocId: dealerId || null,
        dealerSlug: dealerId || null,
        source: dealerId ? 'dealer_page' : 'main_website',
        status: 'new',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedProduct(null);
        setFormData({ name: '', phone: '', vehicle: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return null;
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Our Solutions</h2>
          <p className="text-lg font-bold text-slate-500">Explore our range of certified GPS trackers and speed governors. Book a doorstep installation today.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-[2rem] border border-slate-200 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-300"
            >
              <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                <img width="800" height="600"  loading="lazy" src={product.images?.[0] || "https://ik.imagekit.io/xgxpgvop9/1786724510786.jpeg"} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {product.isRtoApproved && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 shadow-lg border border-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    RTO Approved
                  </div>
                )}
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-slate-900 mb-2">{product.title}</h3>
                <div className="text-3xl font-black text-slate-900 mb-4 flex items-center">
                  <IndianRupee className="w-7 h-7 text-slate-400" />
                  {product.price}
                </div>
                <p className="text-slate-600 font-medium mb-6 line-clamp-3 leading-relaxed">{product.description}</p>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {((typeof product.detailedFeatures === 'string' ? product.detailedFeatures : '').split(/\n|,/) || []).slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <CheckCircle2 className="w-5 h-5" style={{ color: themeColor }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button aria-label="Button action"  
                  onClick={() => setSelectedProduct(product)}
                  className="w-full py-4 rounded-xl font-black text-white shadow-lg transition-all active:scale-95 group-hover:shadow-xl"
                  style={{ backgroundColor: themeColor, boxShadow: `0 10px 25px -5px \${themeColor}60` }}
                >
                  Book Installation
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !success && setSelectedProduct(null)} />
            
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-full"
            >
              {success ? (
                <div className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">Booking Received!</h3>
                  <p className="text-slate-500 font-bold max-w-md mx-auto">
                    We have received your request for {selectedProduct.title}. Our local dealer will contact you shortly to confirm the installation.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Book Installation</h3>
                      <p className="text-slate-500 font-bold mt-1">For {selectedProduct.title}</p>
                    </div>
                    <button aria-label="Button action"  
                      onClick={() => setSelectedProduct(null)}
                      className="p-2 bg-white hover:bg-slate-200 text-slate-500 rounded-full transition-colors shadow-sm border border-slate-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="p-6 sm:p-8 overflow-y-auto">
                    <form onSubmit={handleBookSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Your Name</label>
                          <input 
                            required
                            type="text" 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-900 outline-none transition-all" 
                            placeholder="John Doe" 
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Phone Number</label>
                          <input 
                            required
                            type="tel" 
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-900 outline-none transition-all" 
                            placeholder="+91 9876543210" 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Vehicle Details (Optional)</label>
                        <input 
                          type="text" 
                          value={formData.vehicle}
                          onChange={e => setFormData({...formData, vehicle: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-900 outline-none transition-all" 
                          placeholder="E.g. Tata Ace, Ashok Leyland Truck" 
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Message or Requirement</label>
                        <textarea 
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          rows={3} 
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-900 outline-none transition-all resize-none" 
                          placeholder="I need this installed by tomorrow..." 
                        />
                      </div>
                      
                      <div className="pt-4">
                        <button aria-label="Button action"  
                          type="submit" 
                          disabled={submitting}
                          className="w-full py-5 rounded-2xl font-black text-white text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)]"
                          style={{ backgroundColor: themeColor }}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-6 h-6 animate-spin" /> Processing...
                            </>
                          ) : (
                            <>
                              <Send className="w-6 h-6" /> Send Booking Request
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
