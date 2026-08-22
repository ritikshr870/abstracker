import { MapPin, Phone, Mail, Clock, CheckCircle, Loader2, User, PhoneCall, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useDealer } from '../context/DealerContext';

interface ContactProps {
  dealerId?: string;
  dealerDocId?: string;
  dealerSlug?: string;
  customContact?: any;
  hideDefaults?: boolean;
}

export default function Contact({ dealerId, dealerDocId, dealerSlug, customContact, hideDefaults }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { dealerData } = useDealer() || {};

  const isDealerSubmission = Boolean(
    dealerId || 
    dealerDocId || 
    dealerSlug || 
    (dealerData?.websiteSlug && dealerData.websiteSlug !== 'default') ||
    (dealerData?.id && dealerData.id !== 'default')
  );

  const effectiveDealerDocId = isDealerSubmission ? (dealerDocId || dealerData?.docId || dealerData?.id || null) : null;
  const effectiveDealerSlug = isDealerSubmission ? (dealerSlug || dealerData?.websiteSlug || dealerId || null) : null;
  const effectiveDealerId = isDealerSubmission ? (effectiveDealerDocId || effectiveDealerSlug || dealerId || null) : null;
  const effectiveDealerName = isDealerSubmission ? (dealerData?.brandName || dealerData?.contactName || (effectiveDealerSlug ? `Franchise (${effectiveDealerSlug})` : 'Franchise Partner')) : null;
  const effectiveDealerCity = isDealerSubmission ? (dealerData?.city || dealerData?.cityStateName || null) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'leads'), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        vehicle: formData.vehicle || 'Standard Vehicle',
        message: formData.message.trim(),
        dealerId: effectiveDealerId,
        dealerDocId: effectiveDealerDocId,
        dealerSlug: effectiveDealerSlug,
        dealerName: effectiveDealerName,
        dealerCity: effectiveDealerCity,
        source: isDealerSubmission ? 'dealer_page' : 'main_website',
        status: 'new',
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', vehicle: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit request. Please try calling us directly.');
    } finally {
      setLoading(false);
    }
  };


  
  const effPhone = customContact?.phone || dealerData?.phone;
  const effEmail = customContact?.email || dealerData?.email;
  const effAddress = customContact?.address || dealerData?.address;
  const effBusinessHours = dealerData?.businessHours || 'Monday - Saturday';
  const isDealerPage = !!effPhone || !!dealerData?.websiteSlug;

  const contactInfo = isDealerPage ? [
    {
      icon: Phone,
      title: 'Call Us Now',
      content: effPhone || 'Contact Dealer',
      subtext: 'Available 24x7',
      link: effPhone ? `tel:${effPhone.replace(/[^0-9+]/g, '')}` : null
    },
    {
      icon: Mail,
      title: 'Email Address',
      content: effEmail || 'Contact Dealer',
      subtext: 'Same day response',
      link: effEmail ? `mailto:${effEmail}` : null
    },
    {
      icon: MapPin,
      title: 'Location',
      content: effAddress || 'Contact Dealer',
      subtext: 'Local Dealer Branch',
      link: null
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: effBusinessHours,
      subtext: '9:00 AM - 7:00 PM',
      link: null
    }
  ] : [
    {
      icon: Phone,
      title: 'Call Us Now',
      content: '+91 91232 00739, +91 7903598658',
      subtext: 'Available 24x7',
      link: 'tel:+919123200739'
    },
    {
      icon: Mail,
      title: 'Email Address',
      content: 'sales@abstracker.in',
      subtext: 'Same day response',
      link: 'mailto:sales@abstracker.in'
    },
    {
      icon: MapPin,
      title: 'Head Office',
      content: 'Bypass Road, Patna | Jehanabad, Bihar',
      subtext: 'Branches: Patna & Jehanabad',
      link: 'https://maps.google.com'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Monday - Saturday',
      subtext: '9:00 AM - 7:00 PM',
      link: null
    }
  ];


  return (
    <section id="contact" className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-red-50/30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-red-600 font-black tracking-widest uppercase text-xs sm:text-sm mb-3">{dealerData?.contactBadge || "Priority Support"}</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight mb-4">
            {dealerData?.contactTitle || "Get Your Fleet Connected Today"}
          </h3>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            {dealerData?.contactDescription || (dealerData?.templateId === "template4" ? "Need a premium GPS tracker? Fill the form below or call us directly for same-day fitment in your area." : "Need an AIS-140 certificate urgently? Fill the form below or call us directly for same-day fitment in your area.")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6">
            <h4 className="text-2xl font-black text-slate-950 mb-8 tracking-tight">Direct Contact Info</h4>
            <div className="grid sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-400 transition-all duration-300 group">
                  <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                    <info.icon className="h-6 w-6 text-red-500" />
                  </div>
                  <h5 className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1.5">{info.title}</h5>
                  {info.link ? (
                    <a aria-label="Link"  href={info.link} className="text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors block mb-1">
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-lg font-black text-slate-900 mb-1">{info.content}</p>
                  )}
                  <p className="text-slate-500 font-medium text-sm">{info.subtext}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 rounded-[2rem] p-8 border border-slate-800 text-white shadow-xl flex items-center gap-6 mt-8">
               <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center border border-red-500/30 flex-shrink-0">
                  <ShieldCheck className="w-8 h-8 text-red-500" />
               </div>
               <div>
                 <h5 className="font-black text-lg mb-1">{dealerData?.contactFeatureTitle || (dealerData?.templateId === "template4" ? "100% Secure Devices" : "100% Genuine Devices")}</h5>
                 <p className="text-slate-400 text-sm font-medium">{dealerData?.contactFeatureDesc || (dealerData?.templateId === "template4" ? "Premium GPS tracking devices with mobile app access and live monitoring." : "All trackers are ARAI & iCAT certified with Vahan integration.")}</p>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-2xl shadow-slate-200/50 border border-slate-200">
            <h4 className="text-3xl font-black text-slate-950 mb-8 tracking-tight">Request Installation</h4>
            
            {success ? (
              <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-10 text-center shadow-inner">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h5 className="text-2xl font-black text-slate-950 mb-3 tracking-tight">Request Submitted!</h5>
                <p className="text-slate-600 font-medium leading-relaxed mb-8">Thank you for choosing AbsTracker. Our fleet specialist will contact you within 15 minutes.</p>
                <button 
                  onClick={() => setSuccess(false)}
                  className="px-8 py-3 bg-slate-950 text-white font-bold rounded-xl hover:bg-slate-900 transition-all active:scale-95 shadow-md"
                >
                  Submit Another
                </button>
              </div>
            ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name / Company Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    required
                    type="text" 
                    id="name" 
                    value={formData.name}
                    onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                    className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-red-600/10 focus:border-red-500 transition-all outline-none font-medium text-slate-900"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PhoneCall className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    required
                    type="tel" 
                    id="phone" 
                    value={formData.phone}
                    onChange={e => setFormData(prev => ({...prev, phone: e.target.value}))}
                    className="w-full pl-12 pr-5 py-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-red-600/10 focus:border-red-500 transition-all outline-none font-medium text-slate-900"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="vehicle" className="block text-sm font-bold text-slate-700 mb-2">Vehicle Type <span className="text-red-500">*</span></label>
                <select 
                  id="vehicle" 
                  required
                  value={formData.vehicle}
                  onChange={e => setFormData(prev => ({...prev, vehicle: e.target.value}))}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-red-600/10 focus:border-red-500 transition-all outline-none appearance-none font-medium text-slate-900"
                >
                  <option value="">Select vehicle type...</option>
                  <option value="commercial">Commercial Truck / LCV</option>
                  <option value="schoolbus">School / College Bus</option>
                  <option value="mining">Mining / Heavy Equipment</option>
                  <option value="taxi">Taxi / Corporate Fleet</option>
                  <option value="private">Private Car / Bike</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Additional Details (Optional)</label>
                <textarea 
                  id="message" 
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData(prev => ({...prev, message: e.target.value}))}
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-red-600/10 focus:border-red-500 transition-all outline-none resize-none font-medium text-slate-900"
                  placeholder={isDealerPage || dealerData?.templateId === "template4" ? "How many vehicles? Any specific requirements?" : "How many vehicles? Any specific RTO requirements?"}
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/25 active:scale-[0.98] mt-2 disabled:opacity-70 disabled:scale-100 border border-transparent"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Request"}
              </button>
            </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
