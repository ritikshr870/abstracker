import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { User, Mail, Phone, MapPin, Save, Loader2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login?redirect=profile');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            name: data.name || currentUser.displayName || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || ''
          });
        } else {
           setFormData(prev => ({
             ...prev,
             name: currentUser.displayName || ''
           }));
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setSaving(true);
    setSuccessMsg('');
    try {
      await setDoc(doc(db, 'users', currentUser.uid), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <SEO title="My Profile" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">My Profile</h1>
          <button aria-label="Button action"  
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-slate-500 hover:text-red-600 font-bold transition-colors"
          >
            Log Out
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 text-center border border-slate-200 shadow-sm">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                {formData.name ? formData.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{formData.name || 'User'}</h2>
              <p className="text-sm text-slate-500 mb-6 truncate">{currentUser.email}</p>
              
              <div className="flex flex-col gap-3">
                <button aria-label="Button action"  
                  onClick={() => navigate('/orders')}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold rounded-xl transition-colors"
                >
                  My Orders <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Personal Details</h3>
              
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" /> Full Name
                      </label>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400" /> Email Address
                      </label>
                      <input 
                        type="email" 
                        value={currentUser.email || ''} 
                        disabled 
                        className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" /> Phone Number
                    </label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      placeholder="Enter 10-digit number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" /> Default Delivery Address
                    </label>
                    <textarea 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      rows={3} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium resize-none"
                      placeholder="Complete address"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">City/District</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                      placeholder="e.g. Patna"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between">
                    {successMsg ? (
                      <p className="text-emerald-600 font-bold text-sm">{successMsg}</p>
                    ) : <div></div>}
                    <button aria-label="Button action"  
                      type="submit" 
                      disabled={saving}
                      className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-70"
                    >
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
