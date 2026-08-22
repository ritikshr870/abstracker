import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import { Link, useNavigate } from 'react-router-dom';

export default function ProductsPage() {

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

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
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <SEO title="Products | AbsTracker" description="Browse our GPS tracking devices and fleet management products." />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black text-slate-900">Our Products</h1>
          <Link aria-label="Navigation Link"  to="/cart" className="relative p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow">
            <ShoppingCart className="w-6 h-6 text-slate-700" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col group"
            >
              <Link aria-label="Navigation Link"  to={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-100 block">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img fetchPriority="high" width="800" height="600"  loading="lazy" 
                      src={product.images[0]} 
                      alt={product.title} 
                      className={`w-full h-full object-cover transition-opacity duration-300 ${product.images.length > 1 ? 'group-hover:opacity-0' : ''}`}
                    />
                    {product.images.length > 1 && (
                      <img width="800" height="600"  loading="lazy" 
                        src={product.images[1]} 
                        alt={`${product.title} alternate`} 
                        className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                )}
                {product.originalPrice > product.price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Sale
                  </div>
                )}
              </Link>
              
              <div className="p-6 flex-grow flex flex-col">
                <Link aria-label="Navigation Link"  to={`/products/${product.id}`} className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  {product.title}
                </Link>
                <p className="text-sm text-slate-500 mb-4 line-clamp-3">{product.description}</p>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-black text-blue-600">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  
                  {product.stock > 0 ? (
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-3 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </button>
                  ) : (
                    <button disabled className="w-full py-3 bg-slate-200 text-slate-500 font-bold rounded-xl cursor-not-allowed">
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500">
              No products available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
