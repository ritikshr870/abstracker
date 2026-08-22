import UnifiedMediaInput from './UnifiedMediaInput';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Save, Loader2, Sparkles, MapPin, Building2, Phone, Mail, Link as LinkIcon, Image as ImageIcon, MessageCircle, Info, Clock, CheckCircle2, ShieldAlert, Users, Award, Facebook, Instagram, Twitter, Layout, ShieldCheck, ExternalLink } from 'lucide-react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import AbsTrackerDealerAI from './AbsTrackerDealerAI';
import AdminAIChatbot from './AdminAIChatbot';
import { statesAndUTs, biharCities, indiaStates, allIndiaStateDetails } from '../data/indiaStates';

export default function AdminDealerManager({ fixedDealerId }: { fixedDealerId?: string }) {
  const [selectedState, setSelectedState] = useState(fixedDealerId || indiaStates[0]);
  const [activeStateFilter, setActiveStateFilter] = useState('All');
  const [docId, setDocId] = useState('');
  
  const [dealerData, setDealerData] = useState({
    address: '',
    contactName: '',
    email: '',
    googleMapsLink: '',
    imageUrl: '',
    phone: '',
    seoDescription: '',
    seoTitle: '',
    services: '',
    whatsappMessage: '',
    businessHours: '',
    dealerType: 'Authorized Partner',
    websiteSlug: '',
    experienceYears: '5',
    teamSize: '10+',
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    dealerLogoUrl: '',
    brandName: '',
    ctaText: '',
    bgType: 'image',
    heroTitle: '',
    heroSubtitle: '',
    heroVideoUrl: '',
    cityStateName: '',
    aboutText: '',
    footerText: '',
    features: 'Doorstep Installation, RTO Approved, Free AMC, 24/7 Support',
    pricingStartingAt: '₹4,500',
    ogImage: '',
    ownerName: '',
    state: '',
    city: '',
    themeColor: '#3b82f6',
    loginEmail: '',
    loginPassword: '',
    templateId: 'template1',
    showProducts: true
  });

  const [loading, setLoading] = useState(false);
  const [allDealers, setAllDealers] = useState<any[]>([]);
  const [loadingAllDealers, setLoadingAllDealers] = useState(false);

  const fetchAllDealers = async () => {
    setLoadingAllDealers(true);
    try {
      const snap = await getDocs(collection(db, "dealers"));
      const dlrs = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })).filter((d: any) => d.loginEmail);
      setAllDealers(dlrs);
    } catch(e) { console.error(e); }
    setLoadingAllDealers(false);
  };

  useEffect(() => {
    fetchAllDealers();
  }, []);
  
  const [autofilling, setAutofilling] = useState<string | null>(null);
    const handleAutoFill = async (field: string, promptOverride?: string) => {
    setAutofilling(field);
    try {
      const systemContext = "You are AbsTracker AI Brain, an elite enterprise copywriter and SEO expert specialized in the GPS tracking industry. Your task is to generate HIGHLY OPTIMIZED, PROFESSIONAL content for a specific dealer's website. You must NEVER mention 'AbsTracker' in the dealer's content unless it is their brand. You MUST generate ONLY the final text, with NO markdown formatting, NO quotes, NO conversational filler. Write exactly what should go into the text field.";
      
      let fieldInstruction = "";
      if (field === 'seoTitle') {
         fieldInstruction = "Write a catchy, keyword-rich SEO Meta Title (max 60 characters). Focus on 'AIS-140 GPS Tracker', the dealer's state/city, and RTO Approval.";
      } else if (field === 'seoDescription') {
         fieldInstruction = "Write a persuasive SEO Meta Description (max 160 characters). Highlight VAHAN compliance, exact location, and fast installation.";
      } else if (field === 'aboutText') {
         fieldInstruction = "Write a highly professional, trustworthy 3-paragraph 'About Us' section. Introduce the dealership, emphasize their expertise in commercial GPS tracking (AIS-140) and private car tracking, and highlight their commitment to 24/7 support and RTO compliance. Make them sound like the absolute best provider in their state.";
      } else if (field === 'heroTitle') {
         fieldInstruction = "Write a punchy, high-converting Hero Section Headline (max 8-10 words).";
      } else if (field === 'heroSubtitle') {
         fieldInstruction = "Write an engaging Hero Subtitle (max 2 sentences). Reassure the customer about Govt compliance and security.";
      } else if (field === 'footerText') {
         fieldInstruction = "Write a short, professional copyright and footer disclaimer line.";
      } else {
         fieldInstruction = "Write professional text appropriate for this field.";
      }
      
      const contextStr = `Dealer Brand Name: ${dealerData.brandName || dealerData.contactName || 'Authorized GPS Dealer'}. 
Location: ${dealerData.city ? dealerData.city + ', ' : ''}${dealerData.state || selectedState}. 
Services Offered: ${dealerData.services || 'AIS-140 GPS, Fleet Management, VLTD'}. 
Target Field: ${field}`;
      
      const prompt = promptOverride || `${fieldInstruction} \n\n--- CONTEXT ---\n${contextStr}`;

      const res = await fetch('https://abstracker.abstracker0.workers.dev/api/ai-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemContext })
      });
      const data = await res.json();
      if (data.result) {
        setDealerData(prev => ({ ...prev, [field]: data.result.replace(/^["']|["']$/g, '').trim() }));
      } else {
        alert(data.error || 'AI Auto Fill Failed');
      }
    } catch (e) {
      alert('AI generation failed.');
    } finally {
      setAutofilling(null);
    }
  };

  const [saving, setSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    if (fixedDealerId) {
      setSelectedState(fixedDealerId);
      setDocId(fixedDealerId);
      fetchDealerData(fixedDealerId);
    } else if (selectedState) {
      const id = selectedState.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-');
      setDocId(id);
      fetchDealerData(id);
    }
  }, [selectedState, fixedDealerId]);

  const fetchDealerData = async (id: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'dealers', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setIsExisting(true);
        const data = docSnap.data() as any;
        setDealerData({
          address: data.address || '',
          contactName: data.contactName || '',
          email: data.email || '',
          googleMapsLink: data.googleMapsLink || '',
          imageUrl: data.imageUrl || '',
          phone: data.phone || '',
          seoDescription: data.seoDescription || '',
          seoTitle: data.seoTitle || '',
          services: Array.isArray(data.services) ? data.services.join(', ') : (data.services || ''),
          whatsappMessage: data.whatsappMessage || '',
          businessHours: data.businessHours || '',
          dealerType: data.dealerType || 'Authorized Partner',
          websiteSlug: data.websiteSlug || '',
          experienceYears: data.experienceYears || '5',
          teamSize: data.teamSize || '10+',
          facebookUrl: data.facebookUrl || '',
          instagramUrl: data.instagramUrl || '',
          twitterUrl: data.twitterUrl || '',
          dealerLogoUrl: data.dealerLogoUrl || '',
          brandName: data.brandName || '',
          heroTitle: data.heroTitle || '',
          heroSubtitle: data.heroSubtitle || '',
          heroVideoUrl: data.heroVideoUrl || '',
          cityStateName: data.cityStateName || '',
          aboutText: data.aboutText || '',
          footerText: data.footerText || '',
          features: data.features || 'Doorstep Installation, RTO Approved, Free AMC, 24/7 Support',
          pricingStartingAt: data.pricingStartingAt || '₹4,500',
          ogImage: data.ogImage || '',
          ownerName: data.ownerName || '',
          state: data.state || id,
          city: data.city || id,
          themeColor: data.themeColor || '#3b82f6',
          loginEmail: data.loginEmail || '',
          loginPassword: data.loginPassword || '',
          templateId: data.templateId || 'template1',
          showProducts: data.showProducts !== undefined ? data.showProducts : true,
          ctaText: data.ctaText || '',
          bgType: data.bgType || 'image'
        });
      } else {
        setIsExisting(false);
        setDealerData({
          address: `Serving all major districts in ${selectedState}`,
          contactName: `AbsTracker ${selectedState}`,
          email: `support@abstracker.in`,
          googleMapsLink: '',
          imageUrl: 'https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg?updatedAt=1786901494465',
          phone: '+91 91232 00739',
          seoDescription: `Get your commercial vehicles RTO-compliant with certified AIS-140 GPS and VLTD devices in ${selectedState}. Fast installation, Vahan integration, and premium support.`,
          seoTitle: `AIS-140 GPS Tracker Dealer in ${selectedState} | RTO Approved`,
          services: 'AIS 140 GPS, VLTD, Speed Governor, Fleet Management, School Bus Tracker',
          whatsappMessage: `Hello, I need an AIS-140 GPS tracker installed in ${selectedState}. Please share details.`,
          businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
          dealerType: 'Authorized Partner',
          websiteSlug: '',
          experienceYears: '5',
          teamSize: '10+',
          facebookUrl: '',
          instagramUrl: '',
          twitterUrl: '',
          dealerLogoUrl: '',
          brandName: '',
    ctaText: '',
    bgType: 'image',
          heroTitle: '',
          heroSubtitle: '',
          heroVideoUrl: '',
          cityStateName: '',
          aboutText: '',
          footerText: '',
          features: 'Doorstep Installation, RTO Approved, Free AMC, 24/7 Support',
          pricingStartingAt: '₹4,500',
          ogImage: '',
          ownerName: '',
          state: id,
          city: id,
          themeColor: '#3b82f6',
          loginEmail: '',
          loginPassword: '',
          templateId: 'template1',
          showProducts: true
        });
      }
    } catch (err) {
      console.error("Error fetching dealer data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
  };

  
  const handleAiWrite = async (field, promptContext) => {
    try {
      setSaving(true);
      
      const systemContext = "You are an expert GPS tracking business copywriter. The business name is " + (dealerData.brandName || "AIS-140 GPS Dealer") + " located in " + (dealerData.city || "India") + ". They sell RTO-approved, Govt compliant AIS-140 GPS trackers for commercial vehicles and private cars. Write compelling, professional, SEO-friendly marketing copy. Do not include quotes, just the text. Tone: Professional, authoritative, secure, trustworthy.";

      const res = await fetch('https://abstracker.abstracker0.workers.dev/api/ai-write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptContext, systemContext })
      });
      const data = await res.json();
      if (data.result) {
        if (field === 'aboutText') setDealerData({...dealerData, aboutText: data.result.trim()});
        if (field === 'heroSubtitle') setDealerData({...dealerData, heroSubtitle: data.result.trim()});
        if (field === 'heroTitle') setDealerData({...dealerData, heroTitle: data.result.trim()});
        if (field === 'seoDescription') setDealerData({...dealerData, seoDescription: data.result.trim()});
        if (field === 'seoTitle') setDealerData({...dealerData, seoTitle: data.result.trim()});
      } else {
        alert(data.error || 'AI Failed');
      }
    } catch (e) {
      alert('AI generation failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const cleanWebsiteSlug = (dealerData.websiteSlug || '')
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\.abstracker\.in.*$/, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

      const docRef = doc(db, 'dealers', docId);
      await setDoc(docRef, {
        ...dealerData,
        state: dealerData.state || selectedState,
        city: dealerData.city || selectedState,
        websiteSlug: cleanWebsiteSlug, 
        services: Array.isArray(dealerData.services) ? dealerData.services : (typeof dealerData.services === 'string' ? dealerData.services.split(',').map(s => s.trim()).filter(s => s) : []),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setIsExisting(true);
      setDealerData(prev => ({ ...prev, websiteSlug: cleanWebsiteSlug }));
      setSaveSuccessMessage(`Successfully saved configuration for ${selectedState}! Subdomain & live sitemap synced instantly.`);
      setTimeout(() => setSaveSuccessMessage(""), 6000);
    } catch (err) {
      console.error("Error saving dealer data:", err);
      alert("Error saving dealer data. Please check your permissions.");
    } finally {
      setSaving(false);
    }
  };


  const handleReset = () => {
    if (confirm("Are you sure you want to reset this dealer's page to the default template? All unsaved changes will be lost.")) {
      setDealerData({
        address: `Serving all major districts in ${selectedState}`,
        contactName: `AbsTracker ${selectedState}`,
        email: `support@abstracker.in`,
        googleMapsLink: '',
        imageUrl: '',
        phone: '+91 9123200739',
        seoTitle: `AIS-140 GPS Tracker Dealer in ${selectedState} | RTO Approved`,
        seoDescription: `Get your commercial vehicles RTO-compliant with certified AIS-140 GPS and VLTD devices in ${selectedState}. Fast installation, Vahan integration, and premium support.`,
        services: 'AIS 140 GPS, VLTD, Speed Governor, Fleet Management, School Bus Tracker',
        whatsappMessage: `Hello, I need an AIS-140 GPS tracker installed in ${selectedState}. Please share details.`,
        businessHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
        dealerType: 'Authorized Partner',
        websiteSlug: '',
        experienceYears: '5',
        teamSize: '10+',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        dealerLogoUrl: '',
        brandName: '',
        ctaText: '',
        bgType: 'image',
        heroTitle: '',
        heroSubtitle: '',
        heroVideoUrl: '',
        cityStateName: '',
        aboutText: '',
        footerText: '',
        features: 'Doorstep Installation, RTO Approved, Free AMC, 24/7 Support',
        pricingStartingAt: '₹4,500',
        ogImage: '',
        ownerName: '',
        state: docId,
        city: docId,
        themeColor: '#3b82f6',
        loginEmail: '',
        loginPassword: '',
        templateId: 'template1',
        showProducts: true
      });
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-sm border border-slate-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold tracking-wide uppercase mb-3">
            <Layout className="w-4 h-4" /> Dealer Network Control Panel
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
            State & Franchise Configuration
          </h2>
          <p className="text-slate-500 font-medium text-base max-w-2xl">Create and manage customized, SEO-optimized landing pages for authorized dealers across India. Changes instantly sync to the live website.</p>
        </div>
      </div>

      
      <AbsTrackerDealerAI 
        dealerData={dealerData}
        onSEOUpdate={(aiData) => setDealerData({ ...dealerData, ...aiData })}
        
      />
      <form onSubmit={handleSave} className="space-y-10">
        {/* Selection Area */}
        {!fixedDealerId && (
          <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-10 border border-slate-800 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="grid lg:grid-cols-12 gap-8 relative z-10 items-center">
              <div className="lg:col-span-7">
                <label className="text-sm font-bold text-red-300 block mb-3 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-400" />
                  Select Dealer Territory (State/City)
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative group flex-1">
                    <select 
                      value={activeStateFilter} 
                      onChange={(e) => setActiveStateFilter(e.target.value)}
                      className="w-full p-5 pl-6 pr-14 bg-slate-800/80 border-2 border-slate-700 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 font-bold text-lg text-white outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800"
                    >
                      <option value="All">All India (Default)</option>
                      {statesAndUTs.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400 group-hover:text-red-400 transition-colors">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                  
                  <div className="relative group flex-1">
                    <select 
                      value={selectedState} 
                      onChange={handleStateChange}
                      className="w-full p-5 pl-6 pr-14 bg-slate-800/80 border-2 border-slate-700 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 font-bold text-lg text-white outline-none transition-all appearance-none cursor-pointer hover:bg-slate-800"
                    >
                      {activeStateFilter === 'All' ? (
                        <>
                          <optgroup label="States & Union Territories">
                            {statesAndUTs.map(state => (
                              <option key={state} value={state}>{state}</option>
                            ))}
                          </optgroup>
                          <optgroup label="Cities">
                            {indiaStates.filter(x => !statesAndUTs.includes(x)).map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </optgroup>
                        </>
                      ) : (
                        <>
                          <option value={activeStateFilter}>{activeStateFilter} (State HQ)</option>
                          {allIndiaStateDetails.find(s => s.state === activeStateFilter)?.cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400 group-hover:text-red-400 transition-colors">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-5 flex lg:justify-end">
                <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-md w-full lg:w-auto">
                  {isExisting ? (
                    <>
                      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-black text-base">Published Page</h4>
                        <p className="text-emerald-400 font-bold text-sm mt-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live on Site</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-black text-base">Unpublished Setup</h4>
                        <p className="text-amber-400 font-bold text-sm mt-0.5">Defaults Loaded</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 text-slate-500 bg-slate-50 rounded-[2rem] border border-slate-200">
            <Loader2 className="w-12 h-12 animate-spin mb-6 text-red-600" />
            <p className="font-bold text-lg text-slate-900">Retrieving {selectedState} details...</p>
          </div>
        ) : (
          <div className="space-y-10">
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Primary Identity */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">

                <div className="bg-slate-100/50 p-6 rounded-2xl border border-slate-200 space-y-6 mb-8">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-4">
                    <LinkIcon className="w-5 h-5 text-red-500" /> Custom URL & Subdomain
                  </h4>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Dealer Custom Subdomain (Slug / Brand)</label>
                    <div className="flex rounded-xl shadow-sm">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 font-bold sm:text-sm">
                        https://
                      </span>
                      <input 
                        type="text" 
                        value={dealerData.websiteSlug} 
                        onChange={e => setDealerData({...dealerData, websiteSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                        onBlur={e => {
                          const cleaned = e.target.value
                            .toLowerCase()
                            .replace(/^https?:\/\//, '')
                            .replace(/\.abstracker\.in.*$/, '')
                            .replace(/[^a-z0-9-]/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-+|-+$/g, '');
                          setDealerData({...dealerData, websiteSlug: cleaned});
                        }}
                        className="flex-1 block w-full min-w-0 rounded-none p-3 border border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none font-bold text-slate-900 text-center bg-white" 
                        placeholder="e.g. traqpro-patna" 
                      />
                      <span className="inline-flex items-center px-4 rounded-r-xl border border-l-0 border-slate-200 bg-slate-50 text-slate-500 font-bold sm:text-sm">
                        .abstracker.in
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 font-medium">Leave empty to use the default district location subdomain. Live Firestore sync automatically updates your sitemap.</p>
                    {dealerData.websiteSlug && (
                      <div className="mt-3 text-sm text-emerald-700 font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Live URL:</span>
                          <a aria-label="Link" href={`https://${dealerData.websiteSlug}.abstracker.in`} target="_blank" rel="noreferrer" className="underline text-emerald-800 hover:text-emerald-950 font-mono">
                            https://{dealerData.websiteSlug}.abstracker.in
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <a aria-label="Link" href={`https://${dealerData.websiteSlug}.abstracker.in`} target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-xs hover:bg-emerald-700 transition">
                            Test Subdomain
                          </a>
                          <a aria-label="Link" href={`/d/${dealerData.websiteSlug}`} target="_blank" rel="noreferrer" className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs hover:bg-emerald-100 transition">
                            Path View
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-2">
                    <Building2 className="w-6 h-6 text-red-600" /> Dealership Identity
                  </h3>
                  <p className="text-slate-500 text-sm font-bold">Public-facing brand details and contact info.</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>Business/Franchise Name</span> <button type="button" onClick={() => handleAutoFill('contactName')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'contactName' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" value={dealerData.contactName} onChange={e => setDealerData({...dealerData, contactName: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="E.g. XYZ GPS Solutions" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>Owner / Director Name</span></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" value={dealerData.ownerName || ''} onChange={e => setDealerData({...dealerData, ownerName: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="E.g. John Doe" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Phone Line</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" value={dealerData.phone} onChange={e => setDealerData({...dealerData, phone: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="+91 98765 43210" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Email Desk</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="email" value={dealerData.email} onChange={e => setDealerData({...dealerData, email: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="contact@..." />
                      </div>
                    </div>
                  </div>

                  
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Display State</label>
                        <input type="text" value={dealerData.state} onChange={e => setDealerData({...dealerData, state: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Bihar" />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Display City</label>
                        <input type="text" value={dealerData.city} onChange={e => setDealerData({...dealerData, city: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Patna" />
                      </div>
                    </div>

                    <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>Full Address & Coverage</span> <button type="button" onClick={() => handleAutoFill('address')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'address' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                    <div className="relative">
                      <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <textarea value={dealerData.address} onChange={e => setDealerData({...dealerData, address: e.target.value})} rows={3} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-900 leading-relaxed shadow-sm" placeholder="Office 123, Tech Park..."></textarea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations & Profile */}
              <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
                <div className="grid lg:grid-cols-2 gap-8 mb-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Business Hours</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" value={dealerData.businessHours || ''} onChange={e => setDealerData({...dealerData, businessHours: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Mon - Sat: 9:00 AM - 7:00 PM" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Google Maps Embed URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" value={dealerData.googleMapsLink || ''} onChange={e => setDealerData({...dealerData, googleMapsLink: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="https://www.google.com/maps/embed?..." />
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-2">
                    <Award className="w-6 h-6 text-emerald-600" /> Operations Profile
                  </h3>
                  <p className="text-slate-500 text-sm font-bold">Metrics to establish authority and trust.</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Dealer Tier / Status</label>
                    <div className="relative">
                      <select value={dealerData.dealerType} onChange={e => setDealerData({...dealerData, dealerType: e.target.value})} className="w-full p-4 pl-5 pr-12 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-900 outline-none transition-all appearance-none cursor-pointer shadow-sm">
                        <option value="Authorized Partner">Authorized Partner</option>
                        <option value="Master Distributor">Master Distributor</option>
                        <option value="Certified Installer">Certified Installer</option>
                        <option value="State Headquarters">State Headquarters</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>



                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Years Active</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" value={dealerData.experienceYears} onChange={e => setDealerData({...dealerData, experienceYears: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="e.g. 5" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Team Size</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" value={dealerData.teamSize} onChange={e => setDealerData({...dealerData, teamSize: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="e.g. 15+" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>Operating Hours</span> <button type="button" onClick={() => handleAutoFill('businessHours')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'businessHours' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" value={dealerData.businessHours} onChange={e => setDealerData({...dealerData, businessHours: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Mon - Sat: 9:00 AM - 7:00 PM" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Offerings & Value Adds */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
               <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-6 h-6 text-purple-600" /> Portfolio & Offerings
                  </h3>
                  <p className="text-slate-500 text-sm font-bold">Manage services, features, and pricing details.</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Authorized Services (Comma Separated)</label>
                      <input type="text" value={dealerData.services} onChange={e => setDealerData({...dealerData, services: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="AIS 140 GPS, Speed Governor..." />
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {['AIS 140 GPS', 'VLTD', 'Speed Governor', 'Fleet Management', 'School Bus Tracker', 'Mining GPS', 'Fuel Monitoring'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              const current = dealerData.services.split(',').map(s => s.trim()).filter(Boolean);
                              if (!current.includes(preset)) {
                                setDealerData({...dealerData, services: [...current, preset].join(', ')});
                              }
                            }}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 text-slate-600 rounded-lg text-xs font-bold transition-colors shadow-sm"
                          >
                            + {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>Key Features / Guarantees</span> <button type="button" onClick={() => handleAutoFill('features')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'features' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                      <input type="text" value={dealerData.features} onChange={e => setDealerData({...dealerData, features: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Doorstep Installation, RTO Approved..." />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="relative">
                        <UnifiedMediaInput 
                          value={dealerData.imageUrl}
                          onChange={(url) => setDealerData({...dealerData, imageUrl: url})}
                          label="Hero Image URL"
                          type="images"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>WhatsApp Pitch</span> <button type="button" onClick={() => handleAutoFill('whatsappMessage')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'whatsappMessage' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MessageCircle className="h-5 w-5 text-slate-400" />
                          </div>
                          <input type="text" value={dealerData.whatsappMessage} onChange={e => setDealerData({...dealerData, whatsappMessage: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Hello..." />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>Starting Price Label</span> <button type="button" onClick={() => handleAutoFill('pricingStartingAt')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'pricingStartingAt' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                        <input type="text" value={dealerData.pricingStartingAt} onChange={e => setDealerData({...dealerData, pricingStartingAt: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="₹4,500" />
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            {/* Dealer Portal Credentials */}
            <div className="bg-red-50 rounded-[2rem] p-8 border border-red-100">
               <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-6 h-6 text-red-500" /> Dealer Portal Login Credentials
                  </h3>
                  <p className="text-slate-500 text-sm font-bold">These credentials allow the dealer to log in and manage bookings for their specific page.</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Login Email</label>
                    <input type="email" value={dealerData.loginEmail} onChange={e => setDealerData({...dealerData, loginEmail: e.target.value})} className="w-full p-4 bg-white border border-red-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="dealer@abstracker.in" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Login Password</label>
                    <input type="text" value={dealerData.loginPassword} onChange={e => setDealerData({...dealerData, loginPassword: e.target.value})} className="w-full p-4 bg-white border border-red-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Secure Password" />
                  </div>
                </div>
            </div>

            {/* Custom Brand Design */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200">
               <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-2">
                    <Layout className="w-6 h-6 text-amber-500" /> White-Label / Branding
                  </h3>
                  <p className="text-slate-500 text-sm font-bold">Customize the visual identity of the dealership page.</p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Primary Theme Color</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={dealerData.themeColor || '#dc2626'} onChange={e => setDealerData({...dealerData, themeColor: e.target.value})} className="w-14 h-14 p-1 bg-white border border-slate-200 rounded-xl cursor-pointer" />
                        <input type="text" value={dealerData.themeColor || '#dc2626'} onChange={e => setDealerData({...dealerData, themeColor: e.target.value})} className="flex-1 p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="#dc2626" />
                      </div>
                    </div><div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>Custom Brand Name</span> <button type="button" onClick={() => handleAutoFill('brandName')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'brandName' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                      <input type="text" value={dealerData.brandName} onChange={e => setDealerData({...dealerData, brandName: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="E.g. XYZ Trackers" />
                    </div>
                    <div>
                      <UnifiedMediaInput label="Dealer Logo URL (Transparent PNG)" value={dealerData.dealerLogoUrl} onChange={(val) => setDealerData({...dealerData, dealerLogoUrl: val})} type="images" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>Primary CTA Text</span> <button type="button" onClick={() => handleAutoFill('ctaText')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'ctaText' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                      <input type="text" value={dealerData.ctaText || ''} onChange={e => setDealerData({...dealerData, ctaText: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm mb-6" placeholder="e.g. Request Installation" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">City/State Name (For Hero Section)</label>
                      <input type="text" value={dealerData.cityStateName || ''} onChange={e => setDealerData({...dealerData, cityStateName: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="e.g. Patna, Bihar" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Hero Section Title (Override)</label>
                      <input type="text" value={dealerData.heroTitle || ''} onChange={e => setDealerData({...dealerData, heroTitle: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Custom hero title..." />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Hero Background Type</label>
                      <select value={dealerData.bgType || 'image'} onChange={e => setDealerData({...dealerData, bgType: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm mb-6">
                        <option value="image">Image Background</option>
                        <option value="video">Video Background</option>
                      </select>
                    </div>
                    <div>
                      <UnifiedMediaInput label="Hero Video URL" value={dealerData.heroVideoUrl || ''} onChange={(val) => setDealerData({...dealerData, heroVideoUrl: val})} type="videos" />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Hero Section Subtitle (Override)</label>
                      <textarea value={dealerData.heroSubtitle || ''} onChange={e => setDealerData({...dealerData, heroSubtitle: e.target.value})} rows={2} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-900 leading-relaxed shadow-sm" placeholder="Custom hero subtitle..."></textarea>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
  <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between"><span>About Section Text</span> <button type="button" onClick={() => handleAutoFill('aboutText')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'aboutText' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
  <button type="button" onClick={() => handleAiWrite('aboutText', 'Write a highly professional, trustworthy 3-paragraph "About Us" section for a GPS Tracking Dealership. Focus on 100% Govt compliance, AIS-140 devices, and 24/7 support.')} className="text-[10px] sm:text-xs bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full flex items-center gap-1 hover:bg-purple-200 transition-colors shadow-sm"><span className="text-purple-600">✨</span> AI Auto-Write</button>
</div>
                      <textarea value={dealerData.aboutText} onChange={e => setDealerData({...dealerData, aboutText: e.target.value})} rows={3} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-900 leading-relaxed shadow-sm" placeholder="Tell customers about your dealership..."></textarea>
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center justify-between mb-2"><span>Footer Copyright Override</span> <button type="button" onClick={() => handleAutoFill('footerText')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'footerText' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                      <input type="text" value={dealerData.footerText} onChange={e => setDealerData({...dealerData, footerText: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="Custom text for footer..." />
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-200 pt-8 grid lg:grid-cols-2 gap-8">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Page Template</label>
                    <select value={dealerData.templateId} onChange={e => setDealerData({...dealerData, templateId: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 font-bold text-slate-900 outline-none transition-all cursor-pointer shadow-sm">
                      <option value="template1">Template 1: Modern Tech (Dark/Light)</option>
                      <option value="template2">Template 2: Trust & Corporate (Light)</option>
                      <option value="template3">Template 3: Gradient Glassmorphism (Premium)</option>
                      <option value="template4">Template 4: Private & Personal Safety (Video Hero)</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <input 
                      type="checkbox" 
                      id="showProducts"
                      checked={dealerData.showProducts}
                      onChange={e => setDealerData({...dealerData, showProducts: e.target.checked})}
                      className="w-6 h-6 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="showProducts" className="font-bold text-slate-700 cursor-pointer">
                      Show Products Section on Dealer Page
                      <p className="text-sm font-medium text-slate-500">Products will show a "Book Now" lead form instead of direct purchase.</p>
                    </label>
                  </div>
                </div>
            </div>

            
            {/* Social Media & Web Presence */}
            <div className="bg-blue-50/50 rounded-[2rem] p-8 border border-blue-100">
               <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 mb-2">
                    <Facebook className="w-6 h-6 text-blue-600" /> Social Media & Connectivity
                  </h3>
                  <p className="text-slate-500 text-sm font-bold">Enhance the dealer's digital footprint.</p>
                </div>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Facebook URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Facebook className="h-5 w-5 text-blue-500" />
                      </div>
                      <input type="text" value={dealerData.facebookUrl || ''} onChange={e => setDealerData({...dealerData, facebookUrl: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="https://facebook.com/..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Instagram URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Instagram className="h-5 w-5 text-pink-500" />
                      </div>
                      <input type="text" value={dealerData.instagramUrl || ''} onChange={e => setDealerData({...dealerData, instagramUrl: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="https://instagram.com/..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">Twitter/X URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Twitter className="h-5 w-5 text-sky-500" />
                      </div>
                      <input type="text" value={dealerData.twitterUrl || ''} onChange={e => setDealerData({...dealerData, twitterUrl: e.target.value})} className="w-full pl-12 p-4 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 outline-none transition-all font-bold text-slate-900 shadow-sm" placeholder="https://x.com/..." />
                    </div>
                  </div>
                </div>
            </div>
{/* SEO Options */}
            <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
              
              <div className="mb-10 relative z-10">
                <h3 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
                  <Info className="w-7 h-7 text-red-400" /> Search Engine Optimization
                </h3>
                <p className="text-slate-400 text-sm font-bold">Control how this landing page ranks and appears in Google.</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2"><span>Meta Title</span> <button type="button" onClick={() => handleAutoFill('seoTitle')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'seoTitle' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                    <input type="text" value={dealerData.seoTitle} onChange={e => setDealerData({...dealerData, seoTitle: e.target.value})} className="w-full p-4 bg-slate-800/80 border border-slate-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all font-bold text-white placeholder-slate-500 shadow-inner" placeholder={`AIS-140 GPS Tracker Dealer in ${selectedState}`} />
                    <div className="text-right mt-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{dealerData.seoTitle.length} / 60 CHARS</div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center justify-between mb-2"><span>Meta Description</span> <button type="button" onClick={() => handleAutoFill('seoDescription')} className="ml-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold hover:bg-indigo-100 flex items-center gap-1">{autofilling === 'seoDescription' ? <Loader2 className="w-3 h-3 animate-spin"/> : <Sparkles className="w-3 h-3"/>} Auto Fill</button></label>
                    <textarea value={dealerData.seoDescription} onChange={e => setDealerData({...dealerData, seoDescription: e.target.value})} rows={3} className="w-full p-4 bg-slate-800/80 border border-slate-700 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all font-bold text-white placeholder-slate-500 leading-relaxed shadow-inner" placeholder={`Get certified AIS-140 trackers in ${selectedState}...`}></textarea>
                    <div className="text-right mt-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">{dealerData.seoDescription.length} / 160 CHARS</div>
                  </div>
                  <div>
                    <UnifiedMediaInput label="Social Sharing Image (OG Image) URL" value={dealerData.ogImage} onChange={(val) => setDealerData({...dealerData, ogImage: val})} type="images" />
                  </div>
                </div>
                
                {/* Google Search Preview */}
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2">Live Google Preview</label>
                  <div className="bg-white p-5 rounded-2xl max-w-lg shadow-xl border border-slate-200 mt-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                        <img width="800" height="600"  loading="lazy" src="https://www.google.com/favicon.ico" alt="Google" className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-slate-900 text-xs font-bold leading-tight">AbsTracker</div>
                        <div className="text-slate-500 text-[10px] truncate leading-tight">https://${dealerData.websiteSlug || docId}.abstracker.in</div>
                      </div>
                    </div>
                    <div className="text-[#1a0dab] text-lg font-medium truncate hover:underline cursor-pointer tracking-tight">{dealerData.seoTitle || `AIS-140 GPS Tracker Dealer in ${selectedState}`}</div>
                    <div className="text-[#4d5156] text-xs mt-1 line-clamp-2 leading-relaxed">{dealerData.seoDescription || 'Page description will appear here...'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              {saveSuccessMessage && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {saveSuccessMessage}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-5 rounded-2xl font-black hover:bg-red-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_15px_30px_-10px_rgba(220,38,38,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(220,38,38,0.5)] text-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  {saving ? <Loader2 className="w-6 h-6 animate-spin relative z-10" /> : <Save className="w-6 h-6 relative z-10" />}
                  <span className="relative z-10">{saving ? 'Publishing Updates...' : `Publish ${selectedState} Page`}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="sm:w-auto flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-5 rounded-2xl font-bold hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95 text-base border border-slate-200"
                >
                  Reset Defaults
                </button>
                <a
                  href={`https://${dealerData?.websiteSlug || docId}.abstracker.in`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95 text-lg"
                >
                  <ExternalLink className="w-5 h-5" />
                  Preview
                </a>
              </div>

            </div>
          </div>
        )}
      </form>
      <AdminAIChatbot />
      
      {/* Configured Dealer Logins */}
      {!fixedDealerId && (
        <div className="mt-12 pt-12 border-t border-slate-200">
          <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-red-600" />
            Configured Dealer Logins
          </h3>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-bold">
                  <tr>
                    <th className="px-6 py-4">Territory ID</th>
                    <th className="px-6 py-4">Brand / Franchise</th>
                    <th className="px-6 py-4">Login Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingAllDealers ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-red-600 mx-auto" />
                      </td>
                    </tr>
                  ) : allDealers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                        No dealers with login credentials found.
                      </td>
                    </tr>
                  ) : (
                    allDealers.map(dealer => (
                      <tr key={dealer.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                          {dealer.id}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          {dealer.brandName || dealer.contactName || 'N/A'}
                        </td>
                        <td className="px-6 py-4 font-medium text-red-600">
                          {dealer.loginEmail}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <a 
                              href={`https://${dealer.websiteSlug || dealer.id}.abstracker.in`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 flex items-center gap-1.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Preview
                            </a>
                            <button 
                              onClick={() => {
                                setSelectedState(dealer.state || dealer.id); // Try state, fallback to ID
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors px-2 py-1.5"
                            >
                              Edit Config
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
