import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, User, Phone, Mail, MapPin, Map, Package, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function BecomeDealer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    volume: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'dealerEnquiries'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new'
      });
      setIsSuccess(true);
      setFormData({
        name: '',
        businessName: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        volume: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-slate-50 pt-24 pb-20">
      <Helmet>
        <title>Become a Dealer | AbsTracker B2B Partnerships</title>
        <meta name="description" content="Join India's fastest-growing GPS tracking network. Become an authorized AbsTracker dealer and grow your business with premium IoT products." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-slate-950 pt-20 pb-20 text-center px-4 relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-full text-sm font-black tracking-widest uppercase border border-red-500/30 mb-6"
          >
            <Building2 className="w-4 h-4" /> B2B Partnership
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight"
          >
            Partner With India's <span className="text-red-500">Leading</span> GPS Brand
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto"
          >
            Expand your business with premium AIS-140 GPS trackers, advanced VLTD solutions, and dedicated support.
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-20 -mt-16">
        <div className="bg-white rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12">
          
          <div className="mb-10 text-center">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Dealer Enquiry Form</h2>
            <p className="text-slate-500 font-medium">Fill out the form below and our B2B partnership team will contact you shortly.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider ml-1">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-slate-900 font-medium" placeholder="John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider ml-1">Business Name *</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-slate-900 font-medium" placeholder="Your Company Ltd" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider ml-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-slate-900 font-medium" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider ml-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-slate-900 font-medium" placeholder="sales@yourcompany.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider ml-1">City *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-slate-900 font-medium" placeholder="Mumbai" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-900 uppercase tracking-wider ml-1">State *</label>
                <div className="relative">
                  <Map className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-slate-900 font-medium" placeholder="Maharashtra" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider ml-1">Expected Monthly Volume</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select name="volume" value={formData.volume} onChange={handleChange} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-slate-900 font-medium appearance-none">
                  <option value="" disabled>Select expected volume</option>
                  <option value="1-50 devices">1-50 devices</option>
                  <option value="51-200 devices">51-200 devices</option>
                  <option value="201-500 devices">201-500 devices</option>
                  <option value="500+ devices">500+ devices</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-900 uppercase tracking-wider ml-1">Message / Additional Details</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-6 w-5 h-5 text-slate-400" />
                <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-slate-900 font-medium resize-none" placeholder="Tell us about your current business and requirements..."></textarea>
              </div>
            </div>

            <button aria-label="Button action"  type="submit" disabled={isSubmitting} className="w-full h-14 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-red-500/50 flex items-center justify-center gap-2 disabled:opacity-70">
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>Submit Partnership Request <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setIsSuccess(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl relative z-10 max-w-md w-full text-center border border-slate-100"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Request Submitted!</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Thank you for your interest in partnering with AbsTracker. Our support team will reach out to you shortly to discuss the details.
              </p>
              <button aria-label="Button action"  
                onClick={() => setIsSuccess(false)}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-colors"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
