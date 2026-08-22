import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ShieldCheck, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import Contact from '../components/Contact';
import { useEffect } from 'react';
import { useDealer } from '../context/DealerContext';
import { indiaStates } from '../data/indiaStates';

export default function ProgrammaticSEOPage() {
  const { city, vehicle } = useParams<{ city: string; vehicle: string }>();
  const { dealerData, setDealerId } = useDealer();

  const formattedCity = city?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
  const formattedVehicle = vehicle?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';

  useEffect(() => {
    if (city) {
      // Find matching state if possible
      const stateMatch = indiaStates.find(
        s => s.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-') === city.toLowerCase()
      );
      
      if (stateMatch) {
        const docId = stateMatch.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-');
        setDealerId(docId);
      } else {
        setDealerId(city.toLowerCase());
      }
    }
  }, [city, setDealerId]);

  const pageTitle = `AIS 140 GPS Tracker for ${formattedVehicle} in ${formattedCity} | 100% RTO Approved & Vahan Compliant`;
  const keywords = `best AIS 140 GPS in ${formattedCity}, best GPS tracking in ${formattedCity}, best GPS tracking in India, ${formattedVehicle} GPS tracker, RTO approved VLTD ${formattedCity}, Vahan compliant GPS for ${formattedVehicle}, panic button for ${formattedVehicle}, fleet management ${formattedCity}, AbsTracker ${formattedCity}, commercial vehicle tracker`;
  const metaDescription = `Get RTO approved AIS-140 GPS tracker for your ${formattedVehicle} in ${formattedCity}. Certified VLTD devices with panic button, same-day installation, and Vahan compliance.`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content="https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-slate-950 pt-32 pb-24 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-bold tracking-wide uppercase border border-blue-500/30 mb-8 backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4" />
            100% RTO Approved in {formattedCity}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight"
          >
            AIS-140 GPS For <span className="text-blue-500">{formattedVehicle}</span> in {formattedCity}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Mandatory VLTD and Panic Button installation for commercial {formattedVehicle.toLowerCase()}s. Get certified compliance with same-day local service.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex justify-center"
          >
             <a aria-label="Link"  href="#contact" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95">
               Get Quote Now
             </a>
          </motion.div>
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">Why {formattedVehicle} Owners in {formattedCity} Choose Us</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                We understand the specific RTO requirements in {formattedCity}. Our local experts ensure your {formattedVehicle} gets the exact certified device needed for immediate fitness clearance.
              </p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Guaranteed Passing</h3>
                    <p className="text-slate-600 font-medium">100% compliance with local RTO standards for {formattedVehicle}s.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Local Support in {formattedCity}</h3>
                    <p className="text-slate-600 font-medium">Fast service and replacements directly in your area.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Fleet Management</h3>
                    <p className="text-slate-600 font-medium">Track your {formattedVehicle} via web or mobile app in real-time.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-xl">
              <img width="800" height="600"  loading="lazy" 
                src="https://ik.imagekit.io/yuvpxpoz6/truck-map-bg.jpg" 
                alt={`${formattedVehicle} Tracking in ${formattedCity}`}
                className="w-full h-64 object-cover rounded-2xl mb-8 shadow-md"
              />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Complete VLTD Kit</h3>
              <ul className="space-y-3 font-medium text-slate-700">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> AIS-140 GPS Tracker Unit
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Required SOS/Panic Buttons
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> E-SIM with 1 Year Validity
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> RTO Certificate (Vahan Portal)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div id="contact">
        <Contact 
          dealerId={dealerData?.websiteSlug || dealerData?.id}
          dealerDocId={dealerData?.docId || dealerData?.id}
          dealerSlug={dealerData?.websiteSlug}
          hideDefaults 
          customContact={dealerData ? { name: dealerData.contactName, phone: dealerData.phone, email: dealerData.email, address: dealerData.address } : undefined} 
        />
      </div>
    </motion.div>
  );
}
