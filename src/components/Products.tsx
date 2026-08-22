import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function Products() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {



      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const allProds = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        let globalProds = allProds.filter((p: any) => !p.dealerId);
        
        setProducts(globalProds);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-red-600 font-black tracking-widest uppercase text-xs sm:text-sm mb-3">
            Flagship Hardware
          </h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight">
            Best Selling GPS Tracking Devices
          </h3>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Engineered for durability and accurate telemetry. Every device comes with 1-Year Comprehensive Warranty and Certified Installation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {products.map((product) => {
            const displayTag = product.tag || (!(product.title?.toLowerCase()?.includes('private')) && !(product.title?.toLowerCase()?.includes('bike')) ? 'Govt. Approved' : 'Anti-Theft Active');
            const isGovt = displayTag === 'Govt. Approved';
            
            return (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white rounded-3xl border-2 border-slate-200 shadow-lg hover:shadow-2xl hover:border-red-500 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer select-none"
              >
                <div className={`absolute top-0 right-0 ${isGovt ? 'bg-red-600' : 'bg-slate-950'} text-white text-xs font-black px-4 py-1.5 rounded-bl-2xl z-10 uppercase tracking-wider`}>
                  {displayTag}
                </div>
                
                <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-0">
                  <div className="shrink-0 relative">
                    <div className="absolute -inset-3 bg-red-500/10 group-hover:bg-red-500/20 rounded-full blur-xl transition-colors"></div>
                    <img width="800" height="600"  loading="lazy" 
                      src={product.images?.[0] || "https://ik.imagekit.io/xgxpgvop9/1786724453710.jpeg"} 
                      alt={product.title}
                      className="w-44 h-44 sm:w-36 sm:h-36 object-cover rounded-2xl relative z-10 group-hover:scale-105 transition-transform duration-500 shadow-md border border-slate-200"
                    />
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left flex flex-col">
                    <h4 className="text-xl sm:text-2xl font-black text-slate-950 mb-2 group-hover:text-red-600 transition-colors">
                      {product.title}
                    </h4>
                    <div className="text-2xl font-black text-red-600 mb-3 flex items-baseline justify-center sm:justify-start gap-2">
                      ₹{(product.price || 0).toLocaleString('en-IN')} 
                      <span className="text-sm font-bold text-slate-400 line-through">
                        ₹{product.originalPrice?.toLocaleString('en-IN') || ((product.price || 0) * 1.4).toFixed(0)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-4 font-medium leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                    <div className="space-y-1.5 mb-6 text-xs sm:text-sm text-slate-700 font-bold text-left">
                      {typeof product.detailedFeatures === 'string' ? product.detailedFeatures.split(/\n|,/).slice(0, 3).map((feature: string, idx: number) => feature.trim() ? (
                        <div key={idx} className="flex items-start gap-2">
                           <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                           <span>{feature.trim()}</span>
                        </div>
                      ) : null) : (
                        <div className="flex items-start gap-2">
                           <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                           <span>Standard GPS telemetry features</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:px-8 pt-0 border-t border-slate-100 flex flex-col sm:flex-row gap-3 mt-auto relative z-20">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                      navigate('/cart');
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/25 text-white px-6 py-3 rounded-xl font-bold transition-all duration-150 active:scale-95 active:opacity-90 select-none w-full sm:w-auto min-h-[44px]"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                  </button>
                  <Link aria-label="Navigation Link"  
                    to={`/products/${product.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-3 rounded-xl font-bold transition-all duration-150 active:scale-95 active:opacity-90 select-none w-full sm:w-auto text-sm min-h-[44px]"
                  >
                    View Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link aria-label="Navigation Link" 
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-950 text-white font-black hover:bg-slate-900 hover:text-red-400 border border-slate-800 transition-all duration-150 shadow-lg active:scale-95 active:opacity-90 select-none min-h-[44px]"
          >
            Browse All GPS Catalog <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
