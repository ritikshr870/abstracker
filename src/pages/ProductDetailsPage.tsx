import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col justify-center items-center gap-6">
        <h2 className="text-3xl font-bold text-slate-900">Product Not Found</h2>
        <Link aria-label="Navigation Link"  to="/products" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <SEO title={`${product.title} | AbsTracker`} description={product.description} image={product.images?.[0]} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link aria-label="Navigation Link"  to="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Products
        </Link>
        
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
                {product.images && product.images.length > 0 ? (
                  <img fetchPriority="high" width="800" height="600"  loading="lazy" src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                )}
                {product.originalPrice > product.price && (
                  <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Sale
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {product.images.map((img: string, i: number) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(i)}
                      className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${activeImage === i ? 'border-blue-600' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img width="800" height="600"  loading="lazy" src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-4">{product.title}</h1>
              
              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-black text-blue-600">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-slate-400 line-through mb-1">₹{product.originalPrice}</span>
                )}
              </div>
              
              <div className="prose prose-slate max-w-none mb-10">
                <p className="text-lg text-slate-600 leading-relaxed">{product.description}</p>
                {product.detailedFeatures && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Detailed Features</h3>
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {(typeof product.detailedFeatures === 'string' ? product.detailedFeatures : '').split(/\n|,/).map((feature: string, idx: number) => feature.trim() ? (
                        <li key={idx} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                          <span>{feature.trim()}</span>
                        </li>
                      ) : null)}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-auto space-y-6">
                <div className="flex items-center gap-2 font-bold">
                  {product.stock > 0 ? (
                    <span className="text-emerald-600 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    disabled={product.stock <= 0}
                    onClick={() => {
                      addToCart(product);
                      navigate('/cart');
                    }}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-6 h-6" /> {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                  </button>
                  <button
                    disabled={product.stock <= 0}
                    onClick={() => {
                      addToCart(product);
                    }}
                    className="flex-1 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
