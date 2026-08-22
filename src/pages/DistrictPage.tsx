import { motion, AnimatePresence } from 'motion/react';
import { useParams } from 'react-router-dom';
import Contact from '../components/Contact';
import DealerProducts from "../components/DealerProducts";
import { MapPin, PhoneCall, ShieldCheck, Loader2, Navigation, MessageCircle, CheckCircle2, Clock, Mail, Building2, Users, Award, Facebook, Instagram, Twitter, IndianRupee, Power, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { indiaStates } from '../data/indiaStates';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useDealer } from '../context/DealerContext';
import { useAuth } from '../context/AuthContext';
import { Edit } from 'lucide-react';

export default function DistrictPage({ isSubdomain }: { isSubdomain?: boolean }) {
  const { slug } = useParams<{ slug: string }>();
  let district = slug?.replace('ais-140-gps-solution-in-', '') || '';
  if (isSubdomain) {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      district = parts[0];
    }
  }
  
  const { setDealerId } = useDealer();
  const { currentUser } = useAuth();
  const normalizedId = district || '';

  let stateName = '';
  if (normalizedId) {
    const matchedState = indiaStates.find(
      s => s.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-') === normalizedId
    );
    if (matchedState) {
      stateName = matchedState;
    } else {
      stateName = normalizedId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
  
  // Instant Cache Initialization for 0ms page load
  const [dealerData, setDealerData] = useState<any>(() => {
    if (!normalizedId) return null;
    try {
      const cached = sessionStorage.getItem(`abstracker_dealer_${normalizedId}`) || localStorage.getItem(`abstracker_dealer_${normalizedId}`);
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  });
  const [actualDealerId, setActualDealerId] = useState<string>(normalizedId);
  const [loading, setLoading] = useState(!dealerData);

  useEffect(() => {
    if (normalizedId) {
      setDealerId(normalizedId);
    }
    
    async function fetchDealer() {
      if (!normalizedId) return;
      
      try {
        let foundData = null;
        let fetchedDealerId = normalizedId;
        
        // 1. Try websiteSlug exact match
        const q = query(collection(db, 'dealers'), where('websiteSlug', '==', normalizedId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
           foundData = querySnapshot.docs[0].data();
           fetchedDealerId = querySnapshot.docs[0].id;
        } else {
           // 2. Fallback to ID
           const docRef = doc(db, 'dealers', normalizedId);
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
              foundData = docSnap.data();
              fetchedDealerId = docSnap.id;
           } else {
              // 3. Robust scan for slug, websiteSlug, or city match
              try {
                const allSnap = await getDocs(collection(db, 'dealers'));
                const matched = allSnap.docs.find(d => {
                  const dData = d.data();
                  const wSlug = dData.websiteSlug?.toLowerCase()?.trim();
                  const docId = d.id.toLowerCase().trim();
                  const dCity = dData.city?.toLowerCase()?.replace(/[\s&]+/g, '-');
                  const dState = dData.state?.toLowerCase()?.replace(/[\s&]+/g, '-');
                  return wSlug === normalizedId || docId === normalizedId || dCity === normalizedId || dState === normalizedId;
                });
                if (matched) {
                  foundData = matched.data();
                  fetchedDealerId = matched.id;
                }
              } catch (scanErr) {
                console.warn("Dealer collection scan error:", scanErr);
              }
           }
        }
        
        if (foundData) {
          setActualDealerId(fetchedDealerId);
          let servicesStr = '';
          if (Array.isArray(foundData.services)) {
            servicesStr = foundData.services.join(', ');
          } else if (typeof foundData.services === 'string') {
            servicesStr = foundData.services;
          }
          
          let featuresStr = '';
          if (Array.isArray(foundData.features)) {
            featuresStr = foundData.features.join(', ');
          } else if (typeof foundData.features === 'string') {
            featuresStr = foundData.features;
          }
          
          const fullFormatted = {
            ...foundData,
            id: fetchedDealerId,
            docId: fetchedDealerId,
            services: servicesStr,
            features: featuresStr
          };
          setDealerData(fullFormatted);
          try {
            sessionStorage.setItem(`abstracker_dealer_${normalizedId}`, JSON.stringify(fullFormatted));
            localStorage.setItem(`abstracker_dealer_${normalizedId}`, JSON.stringify(fullFormatted));
          } catch {}
        }
      } catch (error) {
        console.error("Error fetching dealer:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDealer();
  }, [normalizedId, setDealerId]);



  const finalStateName = dealerData?.city || dealerData?.cityStateName || stateName;
  // Fallback data
  const fallbackData = {
    contactName: `AbsTracker ${finalStateName}`,
    phone: '+91 9123200739',
    email: `info@abstracker.in`,
    address: `Serving all major districts in ${finalStateName}`,
    businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    whatsappMessage: `Hello, I need an AIS-140 GPS tracker installed in ${finalStateName}. Please share details.`,
    services: 'AIS 140 GPS, VLTD, Speed Governor, Fleet Management, School Bus Tracker',
    features: 'Doorstep Installation, RTO Approved, Free AMC, 24/7 Support',
    pricingStartingAt: '₹4,500',
    seoTitle: `AIS-140 GPS Tracker Dealer in ${finalStateName} | RTO Approved`,
    seoDescription: `Get your commercial vehicles RTO-compliant with certified AIS-140 GPS and VLTD devices in ${finalStateName}. Fast installation, Vahan integration, and premium support.`,
    imageUrl: 'https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg?updatedAt=1786901494465',
    dealerType: 'Authorized State Partner',
    experienceYears: '5',
    teamSize: '10+',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    brandName: 'AbsTracker',
    themeColor: '#3b82f6',
    dealerLogoUrl: 'https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80',
    aboutText: '',
    footerText: '',
    googleMapsLink: '',
    templateId: 'template1',
    showProducts: true
  };

  const data = { ...fallbackData, ...(dealerData || {}) };
  const brandName = dealerData?.brandName || (stateName !== finalStateName ? stateName : `AbsTracker ${finalStateName}`);
    const logoUrl = data.dealerLogoUrl || 'https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80';
  const primaryColor = data.themeColor || '#3b82f6';

  const servicesList = typeof data.services === 'string' ? data.services.split(',').map((s: string) => s.trim()).filter(Boolean) : (data.services ? Array.from(data.services) : fallbackData.services.split(',').map((s: string) => s.trim()));
    
  const featuresList = typeof data.features === 'string' ? data.features.split(',').map((s: string) => s.trim()).filter(Boolean) : (data.features ? Array.from(data.features) : fallbackData.features.split(',').map((s: string) => s.trim()));

  return (
    <motion.div id="top" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-slate-50 min-h-screen relative">
      
      {currentUser && (
        <div className="fixed bottom-6 right-6 sm:bottom-6 sm:left-6 sm:right-auto z-[99999]">
          <a
            href={`/admin?editDealer=${normalizedId}`}
            className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black hover:bg-slate-800 transition-all border-2 border-slate-700 hover:scale-105 active:scale-95"
          >
            <Edit className="w-6 h-6 text-amber-500" />
            <span className="hidden sm:inline">Edit Page (Admin)</span>
            <span className="sm:hidden">Edit</span>
          </a>
        </div>
      )}
      <style>{`
        :root {
          --theme-primary: ${primaryColor};
          --theme-primary-dark: ${primaryColor}e6;
          --theme-primary-light: ${primaryColor}1a;
        }
        .theme-bg { background-color: var(--theme-primary) !important; }
        .theme-bg-hover:hover { background-color: var(--theme-primary-dark) !important; }
        .theme-bg-light { background-color: var(--theme-primary-light) !important; }
        .theme-text { color: var(--theme-primary) !important; }
        .theme-border { border-color: var(--theme-primary) !important; }
        .theme-ring { --tw-ring-color: var(--theme-primary) !important; }
        .theme-gradient { background-image: linear-gradient(to right, var(--theme-primary), #10b981) !important; }
        .theme-shadow { box-shadow: 0 0 30px var(--theme-primary-light) !important; }
      `}</style>
      
      <SEO 
        title={dealerData?.seoTitle || (typeof document !== 'undefined' && document.title && !document.title.startsWith('AbsTracker - GPS Tracker') ? document.title : data.seoTitle)} 
        description={dealerData?.seoDescription || data.seoDescription} 
        image={data.ogImage || data.imageUrl || logoUrl || 'https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg'} 
      />

      
      

      {data.templateId === 'template2' && (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-50">
          <div className="absolute top-0 inset-x-0 h-[500px] theme-bg rounded-b-[4rem] z-0"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white rounded-[3rem] shadow-2xl p-6 sm:p-10 lg:p-16 border border-slate-100">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 theme-bg-light theme-text rounded-full text-sm font-bold tracking-wide uppercase mb-6">
                    <MapPin className="w-4 h-4" /> {data.dealerType}
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
                    {data.heroTitle || `Certified AIS-140 GPS in ${finalStateName}`}
                  </h1>
                  <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8">
                    {data.heroSubtitle ? <span dangerouslySetInnerHTML={{__html: String(data.heroSubtitle || '').replace(/\\n|\n/g, '<br/>')}} /> : data.seoDescription}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <a aria-label="Link" href="#contact" className="w-full sm:w-auto px-8 py-4 theme-bg text-white rounded-2xl font-black text-lg transition-all hover:bg-blue-700 text-center shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)]">
                      {data.ctaText || 'Request Installation'}
                    </a>
                    <a aria-label="Link" href={`tel:${String(data.phone || '').replace(/[^0-9+]/g, "")}`} className="w-full sm:w-auto px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-lg transition-all hover:bg-slate-200 text-center flex items-center justify-center gap-3">
                      <PhoneCall className="w-5 h-5 theme-text" /> {data.phone}
                    </a>
                  </div>
                  {data.pricingStartingAt && (
                    <div className="inline-flex items-center gap-2 text-slate-500 font-bold bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                      <IndianRupee className="w-4 h-4 text-slate-400" />
                      <span>Packages starting at <span className="text-slate-900">{data.pricingStartingAt}</span></span>
                    </div>
                  )}
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-[2.5rem] transform group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500"></div>
                  {(data.bgType === 'video' || !!data.heroVideoUrl) ? (
                    <video preload="none" autoPlay loop muted playsInline className="rounded-[2rem] w-full aspect-square sm:aspect-video md:h-[400px] object-cover shadow-2xl relative z-10 border-8 border-white transform group-hover:scale-105 transition-transform duration-700" poster={data.imageUrl}>
                      <source src={data.heroVideoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"} type="video/mp4" />
                    </video>
                  ) : (
                    <img fetchPriority="high" width="800" height="600" loading="lazy" src={data.imageUrl} alt={finalStateName} className="rounded-[2rem] w-full aspect-square sm:aspect-video md:h-[400px] object-cover shadow-2xl relative z-10 border-8 border-white transform group-hover:scale-105 transition-transform duration-700" />
                  )}
                  <div className="absolute -bottom-6 -left-6 bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 z-20 hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 theme-bg-light theme-text rounded-full flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-900 text-sm sm:text-base">RTO Approved</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-500">100% Vahan Compliant</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {(!data.templateId || data.templateId === 'template1') && (
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-950">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] theme-bg/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] theme-bg-light/10 rounded-full blur-[150px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/yuvpxpoz6/map-pattern.png')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 theme-bg/10 border border-theme-bg/20 theme-text rounded-full text-sm font-bold tracking-wide uppercase mb-8 backdrop-blur-md"
              >
                <MapPin className="w-4 h-4" /> {data.dealerType || 'Authorized GPS Dealer'}
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight"
              >
                {data.heroTitle ? <span dangerouslySetInnerHTML={{__html: data.heroTitle}} /> : <><span className="text-white">AIS-140 GPS in</span> <br /><span className="text-transparent bg-clip-text theme-gradient">{finalStateName}</span></>}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-10 max-w-2xl mx-auto lg:mx-0 drop-shadow-md"
              >
                {data.heroSubtitle ? <span dangerouslySetInnerHTML={{__html: String(data.heroSubtitle || '').replace(/\n|\n/g, '<br/>')}} /> : data.seoDescription}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
              >
                <a aria-label="Link" href="#contact" className="w-full sm:w-auto px-8 py-4 theme-bg theme-bg-hover text-white rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg theme-shadow">
                  {data.ctaText || 'Request Installation'}
                </a>
                <a aria-label="Link" href={`tel:${String(data.phone || '').replace(/[^0-9+]/g, '')}`} className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border-2 border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center gap-3 backdrop-blur-xl">
                  <PhoneCall className="w-5 h-5 theme-text" /> {data.phone}
                </a>
              </motion.div>
              
              {data.pricingStartingAt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="inline-flex items-center gap-2 text-slate-300 font-bold bg-white/5 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-md"
                >
                  <IndianRupee className="w-4 h-4 theme-text" />
                  <span>Packages starting at <span className="text-white font-black">{data.pricingStartingAt}</span></span>
                </motion.div>
              )}
            </div>
            
            {/* Right Content - Visual */}
            <div className="lg:col-span-6 relative mt-10 lg:mt-0">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                {/* Decorative border */}
                <div className="absolute -inset-1 theme-bg rounded-[3rem] blur opacity-20"></div>
                <div className="bg-slate-900 border border-slate-700 p-3 sm:p-4 rounded-[3rem] shadow-2xl relative z-10 overflow-hidden group">
                  {(data.bgType === 'video' || !!data.heroVideoUrl) ? (
                    <video preload="none" autoPlay loop muted playsInline className="rounded-[2.5rem] w-full aspect-square sm:aspect-video lg:aspect-square object-cover group-hover:scale-105 transition-transform duration-700" poster={data.imageUrl}>
                      <source src={data.heroVideoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"} type="video/mp4" />
                    </video>
                  ) : (
                    <img width="800" height="600" loading="lazy"
                      src={data.imageUrl}
                      alt={`GPS Installation in ${finalStateName}`}
                      className="rounded-[2.5rem] w-full aspect-square sm:aspect-video lg:aspect-square object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent pointer-events-none rounded-[3rem]"></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-4 sm:p-6 rounded-2xl shadow-xl flex items-center gap-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-12 h-12 theme-bg rounded-xl flex items-center justify-center text-white shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-white font-black text-base sm:text-lg tracking-tight">Govt. Approved</div>
                        <div className="text-slate-400 text-xs sm:text-sm font-medium">100% RTO & Vahan Compliant</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      )}

      {data.templateId === 'template3' && (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-950">
          <div className="absolute inset-0">
             <div className="absolute top-0 right-0 w-[800px] h-[800px] theme-bg/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] theme-bg-light rounded-full blur-[100px] pointer-events-none"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-full text-sm font-bold tracking-wide uppercase mb-6 backdrop-blur-md">
                    <MapPin className="w-4 h-4 theme-text" /> Premium {data.dealerType}
                 </div>
                 <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                    {data.heroTitle ? <span dangerouslySetInnerHTML={{__html: data.heroTitle}} /> : <><span className="text-transparent bg-clip-text theme-gradient">AIS-140 GPS</span> <br/>in {finalStateName}</>}
                 </h1>
                 <p className="text-lg text-slate-300 font-medium leading-relaxed mb-10 max-w-xl">
                    {data.heroSubtitle ? <span dangerouslySetInnerHTML={{__html: String(data.heroSubtitle || '').replace(/\\n|\n/g, '<br/>')}} /> : data.seoDescription}
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <a aria-label="Link" href="#contact" className="w-full sm:w-auto px-8 py-4 theme-bg text-white rounded-2xl font-black text-lg transition-all hover:scale-105 text-center shadow-2xl theme-shadow flex items-center justify-center gap-2">
                      {data.ctaText || 'Request Installation'}
                    </a>
                    <a aria-label="Link" href={`tel:${String(data.phone || '').replace(/[^0-9+]/g, '')}`} className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-lg transition-all hover:bg-white/10 text-center flex items-center justify-center gap-3 backdrop-blur-md">
                      <PhoneCall className="w-5 h-5 theme-text" /> {data.phone}
                    </a>
                 </div>
                 {data.pricingStartingAt && (
                   <div className="inline-flex items-center gap-3 text-slate-300 font-bold bg-white/5 border border-white/10 backdrop-blur-md px-6 py-3 rounded-xl">
                     <IndianRupee className="w-5 h-5 theme-text" />
                     <span>Starting at <span className="text-white text-xl">{data.pricingStartingAt}</span></span>
                   </div>
                 )}
              </div>
              <div className="relative">
                 <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                    <div className="absolute inset-0 bg-slate-900/40 mix-blend-overlay z-10 group-hover:bg-slate-900/20 transition-colors duration-500 pointer-events-none"></div>
                    {(data.bgType === 'video' || !!data.heroVideoUrl) ? (
                      <video preload="none" autoPlay loop muted playsInline className="w-full aspect-square sm:aspect-video md:h-[500px] object-cover scale-105 group-hover:scale-110 transition-transform duration-700" poster={data.imageUrl}>
                        <source src={data.heroVideoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"} type="video/mp4" />
                      </video>
                    ) : (
                      <img width="800" height="600" loading="lazy" src={data.imageUrl} alt={finalStateName} className="w-full aspect-square sm:aspect-video md:h-[500px] object-cover scale-105 group-hover:scale-110 transition-transform duration-700" />
                    )}
                    
                    <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20">
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 theme-bg rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg">
                          <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <div>
                          <div className="text-white font-black text-lg sm:text-xl mb-1">RTO Certified</div>
                          <div className="text-slate-300 text-sm sm:text-base font-medium">100% Vahan Compliant</div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {data.templateId === 'template4' && (
        <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20">
          {/* Deep Luxury Background Layer */}
          <div className="absolute inset-0 w-full h-full z-0">
             {data.bgType === 'image' ? (
                <img loading="lazy" width="800" height="600" 
                  src={data.imageUrl || "https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg?updatedAt=1786901494465"} 
                  alt={finalStateName} 
                  className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                />
             ) : (
                <video preload="none" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
                  poster={data.imageUrl || "https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg?updatedAt=1786901494465"}
                >
                   <source src={data.heroVideoUrl || "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"} type="video/mp4" />
                </video>
             )}
             {/* Premium Dark Gradient Overlays */}
             <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/40 to-slate-950/80"></div>
             <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Geometric Accents */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
             <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[140px] opacity-20" style={{ backgroundColor: primaryColor }}></div>
             <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full blur-[140px] opacity-15" style={{ backgroundColor: primaryColor }}></div>
          </div>
          
          {/* Content Layer */}
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-12 md:py-20 flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
             
             {/* Main Glassmorphism Premium Card */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
               className="w-full max-w-5xl backdrop-blur-md bg-slate-900/40 border border-slate-700/50 p-6 sm:p-12 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl text-center relative overflow-hidden transition-all duration-700 hover:bg-slate-900/50"
             >
                {/* Glowing Top Borders */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-px" style={{ background: `linear-gradient(to right, transparent, ${primaryColor}, transparent)` }}></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/5 h-px" style={{ background: `linear-gradient(to right, transparent, ${primaryColor}80, transparent)` }}></div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-slate-950/80 border border-slate-700 text-white rounded-full text-xs sm:text-sm font-black tracking-widest uppercase mb-8 shadow-2xl backdrop-blur-md"
                >
                   <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }}></span> {data.heroBadgeText || `Expert GPS Tracking Service in ${finalStateName}`}
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tight drop-shadow-2xl"
                >
                   {data.heroTitle ? <span dangerouslySetInnerHTML={{__html: data.heroTitle}} /> : <><span className="text-slate-100 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">Advanced GPS Security For All Vehicles in</span><br/><span className="text-transparent bg-clip-text uppercase tracking-widest" style={{ backgroundImage: `linear-gradient(135deg, #fff 0%, ${primaryColor} 100%)` }}>{brandName}</span></>}
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed mb-10 max-w-3xl mx-auto drop-shadow-lg"
                >
                   {data.heroSubtitle ? (
                     <span dangerouslySetInnerHTML={{__html: String(data.heroSubtitle || '').replace(/\\n|\n/g, '<br/>')}} />
                   ) : (
                     <>Secure your vehicles with advanced, real-time tracking. Discover our mobile app integrated private car GPS and smart fleet management in {finalStateName}.</>
                   )}
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-6"
                >
                  <a href="#contact" className="inline-flex items-center justify-center gap-2 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl transition-all transform hover:-translate-y-1 active:scale-95" style={{ backgroundColor: primaryColor, boxShadow: `0 10px 30px -10px ${primaryColor}` }}>
                    {data.ctaText || 'Get Secured Now'}
                  </a>
                  <a aria-label="Link" href={`tel:${String(data.phone || '').replace(/[^0-9+]/g, '')}`} className="inline-flex items-center justify-center gap-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black text-lg md:text-xl transition-all backdrop-blur-xl transform hover:-translate-y-1 active:scale-95">
                    <PhoneCall className="w-5 h-5" style={{ color: primaryColor }} /> {data.phone}
                  </a>
                </motion.div>
                
                {/* Premium Features Grid Inside Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10 md:mt-14 pt-8 md:pt-10 border-t border-slate-700/50 relative"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px" style={{ background: `linear-gradient(to right, transparent, ${primaryColor}80, transparent)` }}></div>
                  <div className="flex flex-col items-center group cursor-default">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/50 border border-slate-700 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:border-slate-500">
                       <MapPin className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-300 text-center tracking-wide">{data.heroFeature1 || '24/7 Live Tracking'}</span>
                  </div>
                  <div className="flex flex-col items-center group cursor-default">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/50 border border-slate-700 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:border-slate-500">
                       <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-300 text-center tracking-wide">{data.heroFeature2 || 'Anti-Theft Alarm'}</span>
                  </div>
                  <div className="flex flex-col items-center group cursor-default">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/50 border border-slate-700 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:border-slate-500">
                       <Power className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-300 text-center tracking-wide">{data.heroFeature3 || 'Remote Engine Cut'}</span>
                  </div>
                  <div className="flex flex-col items-center group cursor-default">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900/50 border border-slate-700 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:border-slate-500">
                       <Smartphone className="w-5 h-5 md:w-6 md:h-6" style={{ color: primaryColor }} />
                    </div>
                    <span className="text-xs md:text-sm font-bold text-slate-300 text-center tracking-wide">{data.heroFeature4 || 'Mobile App Access'}</span>
                  </div>
                </motion.div>
             </motion.div>
          </div>
          
          {/* Scroll Down Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 animate-bounce"
          >
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Explore</span>
            <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
            </div>
          </motion.div>
        </section>
      )}

      
{data.showProducts && (
        <DealerProducts dealerId={actualDealerId || normalizedId} themeColor={primaryColor} />
      )}

      {/* About the Dealer Section */}
      {data.aboutText && (
        <section id="about" className="py-20 lg:py-24 bg-white border-b border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] theme-bg-light rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
             <div className="max-w-4xl mx-auto text-center">
                {logoUrl && (
                  <img width="800" height="600"  loading="lazy" src={logoUrl} alt={brandName} className="h-28 md:h-36 w-auto mx-auto mb-8 object-contain drop-shadow-md" />
                )}
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">About {brandName}</h2>
                <div className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{__html: String(data.aboutText || '').replace(/\\n|\n/g, '<br/>')}} />
             </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="py-20 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Column - Contact Details */}
            <div className="md:col-span-5 lg:col-span-4 space-y-6 lg:space-y-8">
              <div className="bg-white rounded-[2rem] p-8 lg:p-10 border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 theme-bg-light rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 relative z-10">
                  <Building2 className="w-7 h-7 theme-text" /> Dealership Info
                </h3>
                
                <div className="space-y-8 relative z-10">
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Dealership Name</h4>
                    <p className="text-xl font-bold text-slate-900">{brandName}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Primary Location</h4>
                    <p className="text-lg font-bold text-slate-700 flex items-start gap-2">
                      <MapPin className="w-6 h-6 theme-text shrink-0 -mt-0.5" />
                      <span>
                        {data.googleMapsLink ? (
                          <a aria-label="Link"  href={data.googleMapsLink} target="_blank" rel="noopener noreferrer" className="hover:underline theme-text">
                            {data.address}
                          </a>
                        ) : (
                          data.address
                        )}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Contact Details</h4>
                    <div className="space-y-4">
                      <a aria-label="Link"  href={`tel:${String(data.phone || '').replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 text-lg font-bold text-slate-700 hover:theme-text transition-colors group/link">
                        <div className="w-10 h-10 bg-slate-50 group-hover/link:theme-bg-light rounded-xl flex items-center justify-center transition-colors">
                          <PhoneCall className="w-5 h-5 theme-text" />
                        </div>
                        <span className="truncate">{data.phone}</span>
                      </a>
                      {data.email && (
                        <a aria-label="Link"  href={`mailto:${data.email}`} className="flex items-center gap-3 text-lg font-bold text-slate-700 hover:theme-text transition-colors group/link">
                          <div className="w-10 h-10 bg-slate-50 group-hover/link:theme-bg-light rounded-xl flex items-center justify-center transition-colors">
                            <Mail className="w-5 h-5 theme-text" />
                          </div>
                          <span className="truncate">{data.email}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-10 relative overflow-hidden group">
                <div className="absolute inset-0 theme-bg/10 mix-blend-overlay"></div>
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
                  <Clock className="w-6 h-6 theme-text" /> Business Hours
                </h3>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 relative z-10">
                  <p className="text-white font-black text-lg leading-relaxed">
                    {data.businessHours}
                  </p>
                </div>
              </div>

              <a aria-label="Link"  
                href={`https://wa.me/${String(data.phone || '').replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(data.whatsappMessage)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 lg:py-5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-colors shadow-[0_10px_20px_-10px_rgba(37,211,102,0.5)] active:scale-95"
              >
                <MessageCircle className="w-6 h-6" /> Chat on WhatsApp
              </a>
            </div>

            {/* Right Column - Services & Details */}
            <div className="md:col-span-7 lg:col-span-8 space-y-6 lg:space-y-8">
              
              {/* Features Grid */}
              {featuresList.length > 0 && (
                <div className="bg-white rounded-[2rem] p-8 lg:p-10 border border-slate-200 shadow-sm">
                  <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <Award className="w-7 h-7 theme-text" /> Why Choose Us
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {featuresList.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 theme-text shrink-0" />
                        <span className="text-slate-700 font-bold text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Grid */}
              <div id="services" className="bg-white rounded-[2rem] p-8 lg:p-10 border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                  <ShieldCheck className="w-7 h-7 theme-text" /> Authorized Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {servicesList.map((service: string, i: number) => (
                    <div key={i} className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3 text-slate-800 font-bold hover:theme-bg-light transition-colors shadow-sm">
                      <div className="w-2 h-2 rounded-full theme-bg"></div>
                      {service}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Stats & Socials */}
              <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
                 <div className="bg-white p-8 lg:p-10 rounded-[2rem] border border-slate-200 shadow-sm text-center">
                    <Users className="w-12 h-12 theme-text mx-auto mb-4" />
                    <div className="text-4xl font-black text-slate-900 mb-2">{data.teamSize}</div>
                    <div className="text-slate-500 font-bold">Expert Technicians</div>
                 </div>
                 <div className="bg-white p-8 lg:p-10 rounded-[2rem] border border-slate-200 shadow-sm text-center">
                    <Award className="w-12 h-12 theme-text mx-auto mb-4" />
                    <div className="text-4xl font-black text-slate-900 mb-2">{data.experienceYears}</div>
                    <div className="text-slate-500 font-bold">Years Experience</div>
                 </div>
              </div>

              {/* Social Media Links */}
              {(data.facebookUrl || data.instagramUrl || data.twitterUrl) && (
                <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <h3 className="text-lg font-black text-slate-700 m-0">Connect With Us</h3>
                  <div className="flex gap-4">
                    {data.facebookUrl && (
                      <a aria-label="Link"  href={data.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-50 hover:bg-[#1877F2] hover:text-white text-slate-600 rounded-xl flex items-center justify-center transition-colors">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {data.instagramUrl && (
                      <a aria-label="Link"  href={data.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-50 hover:bg-[#E4405F] hover:text-white text-slate-600 rounded-xl flex items-center justify-center transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {data.twitterUrl && (
                      <a aria-label="Link"  href={data.twitterUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-slate-50 hover:bg-[#1DA1F2] hover:text-white text-slate-600 rounded-xl flex items-center justify-center transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Global CTA - Contact Section */}
      <section className="py-24 bg-slate-900 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/yuvpxpoz6/map-pattern.png')] opacity-10 mix-blend-overlay"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] theme-bg/20 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="max-w-4xl mx-auto relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 md:p-16 text-center shadow-2xl">
           <Navigation className="w-16 h-16 theme-text mx-auto mb-8 drop-shadow-lg" />
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
             {data.heroTitle ? 'Get Started Today' : (data.templateId === 'template4' ? 'Ready to Secure Your Vehicles?' : 'Ready to Secure Your Fleet?')}
           </h2>
           <p className="text-lg md:text-xl text-slate-300 mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
             {data.heroSubtitle ? 'Contact us now to get started.' : `Our ${finalStateName} team is ready to dispatch. ${data.templateId === 'template4' ? 'Contact us now to secure your vehicles with our advanced GPS trackers.' : 'Contact us now to schedule your RTO-approved AIS-140 GPS installation.'}`}
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <a aria-label="Link"  href="#contact" className="w-full sm:w-auto px-8 py-4 text-lg font-black text-slate-900 bg-white rounded-xl hover:bg-slate-100 transition-colors shadow-xl active:scale-95">
               Fill Inquiry Form
             </a>
             <a aria-label="Link"  href={`tel:${String(data.phone || '').replace(/[^0-9+]/g, '')}`} className="w-full sm:w-auto px-8 py-4 text-lg font-black text-white theme-bg theme-bg-hover rounded-xl transition-colors shadow-xl flex items-center justify-center gap-2 active:scale-95">
               <PhoneCall className="w-5 h-5" /> Call {data.phone}
             </a>
           </div>
         </div>
      </section>

      <div id="contact">
        <Contact 
          dealerId={normalizedId} 
          dealerDocId={actualDealerId}
          dealerSlug={dealerData?.websiteSlug || normalizedId}
          customContact={{
            name: data.contactName,
            phone: data.phone,
            email: data.email,
            address: data.address
          }}
          hideDefaults={true}
        />
      </div>
    </motion.div>
  );
}
