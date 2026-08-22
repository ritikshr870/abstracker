import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';

import { Plus, Edit2, Trash2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { motion } from 'motion/react';
import PexelsPicker from './PexelsPicker';
import UnifiedMediaInput from './UnifiedMediaInput';
import AdminAIChatbot from './AdminAIChatbot';

import CryptoJS from 'crypto-js';

// Cloud config
const publicKey = 'public_8Nsb3smOsQ7Mqwdtyhi5Z6ZZwsY=';
const privateKey = 'private_g1I4bEI5myyv4yhWHhaPP7cWHwc=';
const urlEndpoint = 'https://ik.imagekit.io/yuvpxpoz6';

const PREDEFINED_FEATURES = [
  'Dual IP configuration for Govt servers',
  'Built-in eSIM',
  'SOS Panic Buttons (up to 4)',
  'Embedded SIM (eSIM) support',
  '4G LTE Fallback to 2G',
  '4G LTE Connectivity',
  'Location Accuracy < 2.5 meters (IRNSS/NavIC)',
  'Location Accuracy < 5 meters (GPS/GLONASS)',
  'Backup Battery 850mAh (Up to 12 hours)',
  'Backup Battery 150mAh (Up to 2 hours)',
  'Certifications: ARAI & ICAT & State NIC',
  'Compact & hidden installation',
  'Live real-time tracking app',
  'Voice monitoring support',
  'Geo-fencing alerts',
  'Anti-Theft Remote Engine Cut-off'
];


export default function AdminProductManager({ dealerId }: { dealerId?: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Admin dealer selection state
  const [dealers, setDealers] = useState<any[]>([]);
  const [selectedAdminDealerId, setSelectedAdminDealerId] = useState<string>('global'); // 'global' or a specific dealer ID

  // Form state
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isRtoApproved, setIsRtoApproved] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [detailedFeatures, setDetailedFeatures] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Import modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);
  const [importingId, setImportingId] = useState<string | null>(null);

  // Fetch dealers for admin selector
  useEffect(() => {
    if (!dealerId) {
      const fetchDealers = async () => {
        try {
          const snap = await getDocs(collection(db, 'dealers'));
          setDealers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
          console.error(e);
        }
      };
      fetchDealers();
    }
  }, [dealerId]);

  const effectiveDealerId = dealerId || (selectedAdminDealerId === 'global' ? undefined : selectedAdminDealerId);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = effectiveDealerId ? all.filter((p: any) => p.dealerId === effectiveDealerId) : all.filter((p: any) => !p.dealerId);
      setProducts(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = effectiveDealerId ? all.filter((p: any) => p.dealerId === effectiveDealerId) : all.filter((p: any) => !p.dealerId);
      setProducts(filtered);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [effectiveDealerId]);

  
  
  const handleAiWrite = async (field: string, promptContext: string) => {
    try {
      setUploading(true);
      
      const systemContext = "You are AbsTracker AI, an expert GPS tracking eCommerce copywriter. Write highly persuasive, benefit-driven product copy for GPS trackers. CRITICAL: Keep it CONCISE (maximum 3-4 sentences for descriptions) and explicitly focus on the Product Name provided. Do not use quotes around the output.";
      const productContext = `Product Name: ${title || 'GPS Tracker'}. Price: ${price || 'TBD'}. Stock: ${stock || 'Available'}.`;
      
      const prompt = `Write the ${field} for this product. ${productContext} Context: ${promptContext}`;

      const res = await fetch('https://abstracker.abstracker0.workers.dev/api/ai-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemContext })
      });
      const data = await res.json();
      if (data.result) {
        if (field === 'description') setDescription(data.result.trim());
      } else {
        alert(data.error || 'AI Failed');
      }
    } catch (e) {
      alert('AI generation failed.');
    } finally {
      setUploading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      title,
      tag,
      description,
      detailedFeatures,
      price: Number(price),
      originalPrice: Number(originalPrice),
      isRtoApproved,
      stock: Number(stock),
      images,
      updatedAt: new Date().toISOString()
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          dealerId: effectiveDealerId || null,
          createdAt: new Date().toISOString()
        });
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const resetForm = () => {
    setTitle('');
    setTag('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setStock('');
    setIsRtoApproved(false);
    setImages([]);
    setDetailedFeatures('');
    setEditingId(null);
  };

  const openImportModal = async () => {
    setShowImportModal(true);
    try {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const globals = all.filter((p: any) => !p.dealerId);
      setGlobalProducts(globals);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportProduct = async (productToImport: any) => {
    if (!effectiveDealerId) return;
    setImportingId(productToImport.id);
    try {
      const { id, dealerId, ...productData } = productToImport;
      await addDoc(collection(db, 'products'), {
        ...productData,
        dealerId: effectiveDealerId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      alert('Product imported successfully!');
      setShowImportModal(false);
    } catch (err) {
      console.error(err);
      alert('Error importing product');
    } finally {
      setImportingId(null);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setTitle(product.title);
    setTag(product.tag || '');
    setDescription(product.description);
    setPrice(product.price.toString());
    setOriginalPrice(product.originalPrice.toString());
    setStock(product.stock.toString());
    setIsRtoApproved(!!product.isRtoApproved);
    setImages(product.images || []);
    setDetailedFeatures(product.detailedFeatures || '');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    }
  };


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, replaceIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', file.name);
      formData.append('folder', '/products');
      formData.append('useUniqueFileName', 'true');

      const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(privateKey + ':')}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error('Upload failed: ' + errText);
      }

      const data = await response.json();
      setImages(prev => {
        if (replaceIndex !== undefined) {
          const newImages = [...prev];
          newImages[replaceIndex] = data.url;
          return newImages;
        }
        if (prev.length >= 2) return [prev[0], data.url];
        return [...prev, data.url];
      });
    } catch (error) {
      console.error('Upload Error', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-8">
      {!dealerId && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Manage Products For:</label>
          <select 
            value={selectedAdminDealerId} 
            onChange={(e) => setSelectedAdminDealerId(e.target.value)}
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-bold"
          >
            <option value="global">Global Products (Main Website)</option>
            <optgroup label="Dealer Portals">
              {dealers.map(d => (
                <option key={d.id} value={d.id}>{d.contactName || d.id}</option>
              ))}
            </optgroup>
          </select>
        </div>
      )}

      
      {/* Product Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="text-sm font-bold text-slate-700 block mb-2">Product Title</span>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-bold" required />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700 block mb-2">Product Tag/Badge (e.g., Govt. Approved)</span>
              <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. AIS 140, Private GPS, Anti-Theft" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-bold" />
            </label>
            <div className="block col-span-1 md:col-span-2">
              <span className="text-sm font-bold text-slate-700 block mb-2">Select Product Features</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {PREDEFINED_FEATURES.map((feat) => {
                  const currentFeatures = detailedFeatures ? detailedFeatures.split(/\n|,/).map(f => f.trim()) : [];
                  const isSelected = currentFeatures.includes(feat);
                  return (
                    <label key={feat} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${isSelected ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDetailedFeatures([...currentFeatures, feat].join('\n'));
                          } else {
                            setDetailedFeatures(currentFeatures.filter(f => f !== feat).join('\n'));
                          }
                        }}
                      />
                      <span className={`text-sm font-medium ${isSelected ? 'text-red-900' : 'text-slate-700'}`}>{feat}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <label className="block">
              <span className="text-sm font-bold text-slate-700 block mb-2">MRP (Original Price ₹)</span>
              <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-bold line-through text-slate-500" placeholder="e.g. 5999" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700 block mb-2">Sale Price (Selling Price ₹)</span>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-700" placeholder="e.g. 3499" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700 block mb-2">Stock Level</span>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-bold" />
            </label>
          </div>

          <label className="block">
            <span className="text-sm font-bold text-slate-700 block mb-2 flex items-center justify-between">
               <span>Description</span>
               <button type="button" onClick={() => handleAiWrite('description', title || 'GPS Tracker')} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold hover:bg-indigo-100">✨ Smart Write</button>
            </span>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 font-medium h-32" required />
          </label>

          <div>
            <label className="text-sm font-bold text-slate-700 flex items-center justify-between mb-4">
              <span>Images (Max 2)</span>
              <span className="text-xs text-slate-400">{images.length}/2 Images</span>
            </label>
            
            <div className="flex gap-4 items-start">
              {images.map((url, i) => (
                <div key={i} className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 group">
                  <img loading="lazy" width="800" height="600" src={url} alt="Product" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <button type="button" onClick={() => removeImage(i)} title="Delete Image" className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {images.length < 2 && (
                <div className="relative w-32 h-32 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-xs text-slate-500 font-bold">Upload Image</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            {editingId && (
              <button type="button" onClick={resetForm} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
            )}
            <button type="submit" disabled={uploading} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2">
              {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Inventory List</h2>
        
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-red-600 animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-sm">
                  <th className="py-4 font-bold">Product</th>
                  <th className="py-4 font-bold">Date Added</th>
                  <th className="py-4 font-bold">Price</th>
                  <th className="py-4 font-bold">Stock</th>
                  <th className="py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden">
                          {product.images?.[0] ? (
                            <img width="800" height="600"  loading="lazy" src={product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-full h-full p-3 text-slate-300" />
                          )}
                        </div>
                        <span className="font-bold text-slate-900">{product.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600 text-sm">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 font-bold text-slate-900">₹{product.price}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.stock > 10 ? 'bg-emerald-100 text-emerald-700' :
                        product.stock > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex justify-end gap-2">
                        <button aria-label="Button action"  onClick={() => handleEdit(product)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button aria-label="Button action"  onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">No products found. Add one above!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900">Import Global Product</h3>
              <button onClick={() => setShowImportModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {globalProducts.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-bold">No global products found to import.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {globalProducts.map(p => (
                    <div key={p.id} className="border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:border-slate-300 transition-colors">
                      <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                        {p.images?.[0] ? (
                          <img loading="lazy" width="800" height="600" src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-full h-full p-4 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 line-clamp-1">{p.title}</div>
                        <div className="text-sm font-bold text-slate-500">₹{p.price}</div>
                      </div>
                      <button
                        onClick={() => handleImportProduct(p)}
                        disabled={importingId === p.id}
                        className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 text-sm whitespace-nowrap flex items-center gap-2"
                      >
                        {importingId === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Import'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
