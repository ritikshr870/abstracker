import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, ArrowRight, ShieldCheck, Truck, Navigation, CheckCircle2, 
  Search, Building2, PhoneCall, Star, Clock, Compass, Layers, 
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedIndiaMap from '../components/AnimatedIndiaMap';
import Contact from '../components/Contact';
import { 
  allIndiaStateDetails, 
  popularMetroCities, 
  biharMajorCities, 
  biharAllDistricts, 
  statesAndUTs 
} from '../data/indiaStates';
import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const DynamicLink = ({ item, className, children }: any) => {
  const props = item();
  if (props.as === 'a') {
    return <a aria-label="Link" href={props.href} target={props.target} rel={props.rel} className={className}>{children}</a>;
  }
  return <Link to={props.to} className={className}>{children}</Link>;
};

export default function DealerNetwork() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});
  const [dealers, setDealers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        const snap = await getDocs(collection(db, 'dealers'));
        let fetched = snap.docs.map(d => ({ id: d.id, ...d.data() } as any)).filter((d: any) => d.status !== 'inactive');
        if (fetched.length === 0) {
          fetched = [
            {
              id: 'default',
              contactName: 'AbsTracker Dealership',
              brandName: 'AbsTracker India',
              city: 'Pan India',
              state: 'India',
              address: 'Available in all major cities across India',
              phone: '+91 9123200739',
              email: 'info@abstracker.in',
              websiteSlug: 'india',
              dealerLogoUrl: 'https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80',
              themeColor: '#3b82f6',
              status: 'active'
            }
          ];
        }
        setDealers(fetched);
      } catch (err) {
        console.error("Error fetching dealers:", err);
      }
    };
    fetchDealers();
  }, []);

  const getDealerLinkProps = (name: string) => {
    const slug = name.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-');
    const matchedDealer = dealers.find(d => 
      (d.id === slug || d.websiteSlug === slug || d.city?.toLowerCase() === name.toLowerCase() || d.state?.toLowerCase() === name.toLowerCase()) && 
      d.status !== 'inactive'
    );
    
    if (matchedDealer && matchedDealer.websiteSlug) {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'abstracker.in';
      const rootDomain = currentHost.includes('abstracker.in') ? 'abstracker.in' : currentHost.replace('www.', '');
      const protocol = typeof window !== 'undefined' ? window.location.protocol : 'https:';
      return { 
        as: 'a', 
        href: `${protocol}//${matchedDealer.websiteSlug}.${rootDomain}/`,
        target: "_blank",
        rel: "noopener noreferrer"
      };
    }
    
    return { 
      as: 'a', 
      href: `https://${slug}.abstracker.in/`,
      target: "_blank",
      rel: "noopener noreferrer"
    };
  };

  const toggleStateExpand = (stateName: string) => {
    setExpandedStates(prev => ({
      ...prev,
      [stateName]: !prev[stateName]
    }));
  };

  // Region tabs list
  const regions = [
    { id: 'All', label: 'All India', count: statesAndUTs.length },
    { id: 'Metros', label: 'Top Metro Hubs', count: popularMetroCities.length },
    { id: 'Bihar', label: 'Bihar (38 Districts)', count: biharAllDistricts.length },
    { id: 'North', label: 'North India', count: 8 },
    { id: 'West', label: 'West India', count: 3 },
    { id: 'South', label: 'South India', count: 5 },
    { id: 'East', label: 'East & Central', count: 6 },
    { id: 'North East', label: 'North East & UTs', count: 12 },
  ];

  // Filter states and cities based on search and region
  const filteredStatesData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return allIndiaStateDetails.filter(group => {
      // 1. Region filter check
      if (selectedRegion === 'Bihar') {
        if (group.state !== 'Bihar') return false;
      } else if (selectedRegion === 'Metros') {
        // Handled in separate section or keep all states having metros
      } else if (selectedRegion === 'East') {
        if (group.category !== 'East' && group.category !== 'Central') return false;
      } else if (selectedRegion === 'North East') {
        if (group.category !== 'North East' && group.category !== 'UT') return false;
      } else if (selectedRegion !== 'All') {
        if (group.category !== selectedRegion) return false;
      }

      // 2. Search query check
      if (!q) return true;
      const stateMatch = group.state.toLowerCase().includes(q);
      const cityMatch = group.cities.some(c => c.toLowerCase().includes(q));
      return stateMatch || cityMatch;
    });
  }, [searchQuery, selectedRegion]);

  // Filtered Metro Cities
  const filteredMetros = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return popularMetroCities;
    return popularMetroCities.filter(c => c.toLowerCase().includes(q));
  }, [searchQuery]);

  // Filtered Bihar Major & Districts
  const filteredBiharMajor = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return biharMajorCities;
    return biharMajorCities.filter(c => c.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredBiharDistricts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return biharAllDistricts;
    return biharAllDistricts.filter(c => c.toLowerCase().includes(q));
  }, [searchQuery]);

  // Total matching counts
  const totalMatchingCities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return 0;
    let count = 0;
    allIndiaStateDetails.forEach(g => {
      g.cities.forEach(c => {
        if (c.toLowerCase().includes(q)) count++;
      });
    });
    return count;
  }, [searchQuery]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>AIS-140 GPS Dealer Network | India-Wide 36 States & Districts</title>
        <meta name="description" content="Find authorized AIS-140 GPS and VLTD dealers across all 36 States & Union Territories of India. 300+ city hubs with instant RTO certification and doorstep fitting." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-slate-950 pt-32 pb-32 text-center px-4 relative overflow-hidden">
        {/* Advanced Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Soft Glowing Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none translate-y-1/2"></div>
        
        <AnimatedIndiaMap />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 text-blue-400 rounded-full text-sm font-black tracking-widest uppercase border border-blue-500/30 mb-8 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.15)]"
          >
            <MapPin className="w-4 h-4" /> 36 States & UTs • 300+ City Installation Centers
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight"
          >
            India's Largest Network of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-400 bg-[length:200%_auto] animate-gradient block mt-2">Certified GPS Dealers</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed mb-10"
          >
            Search any State, Union Territory, District, or City across India to connect instantly with your local certified AbsTracker dealer for rapid AIS-140 GPS fitting, emergency panic buttons, and Vahan compliance.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Link to="/become-dealer" className="inline-flex items-center justify-center h-14 px-8 text-sm font-black text-white bg-red-600 rounded-2xl hover:bg-red-500 transition-colors uppercase tracking-widest gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-red-500/50">
               <Building2 className="w-5 h-5" />
               Become an Authorized Dealer
            </Link>
            <a href="tel:+919123200739" className="inline-flex items-center justify-center h-14 px-8 text-sm font-black text-white bg-slate-800 hover:bg-slate-700 rounded-2xl transition-colors uppercase tracking-widest gap-2 border border-slate-700 shadow-xl">
               <PhoneCall className="w-4 h-4 text-emerald-400" />
               National Support Helpline
            </a>
          </motion.div>

          {/* Real-Time Live Search Bar */}
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.35 }}
             className="max-w-3xl mx-auto relative group"
          >
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-20">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search any City or State... (e.g. Pune, Lucknow, Patna, Jaipur, Bengaluru)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-28 py-6 bg-white/10 border-2 border-white/20 rounded-[2rem] text-white placeholder-slate-400 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/70 focus:bg-slate-900/90 backdrop-blur-2xl transition-all shadow-2xl relative z-10"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 text-xs font-black uppercase tracking-wider px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
            {/* Search Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"></div>
          </motion.div>

          {searchQuery && (
            <div className="mt-4 text-slate-300 text-sm font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Found {filteredStatesData.length} State/UT regions and {totalMatchingCities} matching city hubs for "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Bento Grid Trust Section */}
      <section className="relative z-20 px-4 -mt-16 mb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-100 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">100% RTO Passing Across India</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Certified for all commercial vehicles, school buses, taxis, and heavy trucks on the National VAHAN 4.0 database.</p>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20 shadow-sm relative z-10">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2 relative z-10">Same-Day Doorstep Fitting</h3>
              <p className="text-slate-400 font-medium leading-relaxed relative z-10">Minimize fleet downtime. Our certified local installation engineers will visit your premises or transport yard.</p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 border border-purple-100 shadow-sm">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">ARAI & CDAC Approved</h3>
              <p className="text-slate-500 font-medium leading-relaxed">Authentic AIS-140 GPS and VLTD units equipped with emergency SOS panic buttons, IP67 waterproof casing, and dual SIMs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Region & State Filter Tabs */}
      <section className="sticky top-20 z-30 bg-slate-50/90 backdrop-blur-xl border-y border-slate-200/80 py-4 px-4 shadow-sm mb-12">
        <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1.5 mr-2">
            <Compass className="w-4 h-4 text-blue-600" /> Filter Region:
          </div>
          {regions.map(r => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedRegion(r.id);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-2 ${
                selectedRegion === r.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Directory Container */}
      <section className="pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

          {/* 1. TOP METRO HUBS (Shown if All or Metros selected or query matches) */}
          {(selectedRegion === 'All' || selectedRegion === 'Metros') && filteredMetros.length > 0 && (
            <div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b-2 border-slate-200 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-black tracking-widest uppercase mb-3 border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-600 text-amber-600" /> High-Priority Hubs
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Major Metropolitan GPS Centers
                  </h2>
                  <p className="text-slate-500 font-bold mt-2 text-base sm:text-lg">
                    Direct certified distribution hubs with same-day emergency dispatch and bulk fleet onboarding.
                  </p>
                </div>
                <div className="text-slate-500 font-bold text-sm bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
                  {filteredMetros.length} Metro Cities
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                {filteredMetros.map(metro => (
                  <DynamicLink 
                    key={metro} 
                    item={() => getDealerLinkProps(metro)}
                    className="group bg-white p-5 sm:p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div className="absolute top-3 right-3 bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-md border border-blue-100">
                      HUB
                    </div>
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors mb-4 shadow-sm">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors mb-1 pr-6">{metro}</h3>
                      <p className="text-xs text-slate-400 font-semibold">AIS 140 GPS & VLTD</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-600">
                      <span>View Dealership</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </DynamicLink>
                ))}
              </div>
            </div>
          )}

          {/* 2. BIHAR AUTHORIZED NETWORK (Prioritized & All 38 Districts) */}
          {(selectedRegion === 'All' || selectedRegion === 'Bihar' || selectedRegion === 'East') && (
            <div className="bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 p-6 sm:p-10 rounded-[2.5rem] border-2 border-emerald-200/80 shadow-lg shadow-emerald-950/5">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b-2 border-emerald-100 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black tracking-widest uppercase mb-3 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dedicated State Network
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    Bihar Authorized Network (All 38 Districts)
                  </h2>
                  <p className="text-slate-600 font-semibold mt-2 text-base sm:text-lg">
                    Full RTO coverage across all 38 districts with registered fitment centers, BSNL Vahan testing, and panic button integration.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <DynamicLink 
                    item={() => getDealerLinkProps('Bihar')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                  >
                    Bihar State Hub <ArrowRight className="w-3.5 h-3.5" />
                  </DynamicLink>
                </div>
              </div>

              {/* Major Bihar Hubs */}
              {filteredBiharMajor.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-xl font-black text-slate-800 mb-5 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Key Regional Hubs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredBiharMajor.map(city => (
                      <DynamicLink 
                        key={city} 
                        item={() => getDealerLinkProps(city)}
                        className="group bg-white p-6 rounded-2xl border-2 border-emerald-200/80 hover:border-emerald-500 shadow-sm hover:shadow-xl hover:shadow-emerald-600/10 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                            Fast Dispatch
                          </span>
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-xl group-hover:text-emerald-700 transition-colors mb-1">{city}</h4>
                          <p className="text-xs text-slate-500 font-medium">Govt. AIS-140 & VLTD Center</p>
                        </div>
                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-emerald-700">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500" /> Instant Install</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </DynamicLink>
                    ))}
                  </div>
                </div>
              )}

              {/* All Bihar Districts Grid */}
              {filteredBiharDistricts.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-slate-800 mb-5 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" /> All 38 District Fitment Centers
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {filteredBiharDistricts.map(dist => (
                      <DynamicLink 
                        key={dist} 
                        item={() => getDealerLinkProps(dist)}
                        className="group bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all duration-200 flex items-center justify-between text-left"
                      >
                        <div className="truncate pr-2">
                          <p className="font-black text-slate-800 text-sm group-hover:text-emerald-700 transition-colors truncate">{dist}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bihar District</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-600 shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
                      </DynamicLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. PAN-INDIA STATE-WISE DIRECTORY (ALL 36 STATES & UNION TERRITORIES WITH EXPANDABLE CITY LISTS) */}
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b-2 border-slate-200 pb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-black tracking-widest uppercase mb-3 border border-blue-200">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> Comprehensive State Directory
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  All 36 States & Union Territories
                </h2>
                <p className="text-slate-500 font-bold mt-2 text-base sm:text-lg">
                  Explore local fitment centers and certified partner dealerships across every district in India.
                </p>
              </div>
              <div className="text-slate-500 font-black uppercase tracking-widest text-xs bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200">
                {filteredStatesData.length} Region{filteredStatesData.length !== 1 ? 's' : ''} Listed
              </div>
            </div>

            {filteredStatesData.length > 0 ? (
              <div className="space-y-6">
                {filteredStatesData.map((stateGroup) => {
                  const isExpanded = expandedStates[stateGroup.state] || searchQuery.length > 0;
                  const matchingCitiesInState = searchQuery 
                    ? stateGroup.cities.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
                    : stateGroup.cities;

                  return (
                    <div 
                      key={stateGroup.state}
                      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                      {/* State Header Card */}
                      <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-50/80 via-white to-white">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                            <MapPin className="w-7 h-7" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                {stateGroup.state}
                              </h3>
                              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                                {stateGroup.category} India
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-slate-500">
                              {stateGroup.cities.length} Key Cities & Districts with Certified Installers
                            </p>
                          </div>
                        </div>

                        {/* Actions: View State Dealership or Expand Cities */}
                        <div className="flex flex-wrap items-center gap-3">
                          <DynamicLink
                            item={() => getDealerLinkProps(stateGroup.state)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-md shadow-blue-600/20 flex items-center gap-2"
                          >
                            <span>{stateGroup.state} Portal</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </DynamicLink>

                          <button
                            onClick={() => toggleStateExpand(stateGroup.state)}
                            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
                          >
                            <span>{isExpanded ? 'Hide Cities' : `View ${stateGroup.cities.length} Cities`}</span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Expandable City & District Chips */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-slate-100 bg-slate-50/50 p-6 sm:p-8"
                          >
                            <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-blue-500" />
                              Major Districts & City Dealerships in {stateGroup.state}:
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                              {matchingCitiesInState.map((city) => (
                                <DynamicLink
                                  key={city}
                                  item={() => getDealerLinkProps(city)}
                                  className="group bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex items-center justify-between text-left"
                                >
                                  <div className="truncate pr-2">
                                    <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors truncate">
                                      {city}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-semibold">AIS-140 Center</p>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
                                </DynamicLink>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-sm">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">No Matching State or City Found</h3>
                <p className="text-slate-500 font-medium text-base max-w-md mx-auto">
                  We couldn't find any location matching "{searchQuery}". You can reset your search or contact our national support team.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion('All');
                  }}
                  className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Global Help & Dispatch CTA */}
      <section className="py-24 bg-slate-900 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/yuvpxpoz6/map-pattern.png')] opacity-[0.03] mix-blend-overlay"></div>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
         
         <div className="max-w-5xl mx-auto relative z-10 bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-20 text-center shadow-2xl">
           <Navigation className="w-20 h-20 text-blue-400 mx-auto mb-8 drop-shadow-[0_0_20px_rgba(96,165,250,0.6)]" />
           <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight">
             Can't Find Your District or Town?
           </h2>
           <p className="text-lg sm:text-xl text-slate-300 mb-10 font-medium max-w-3xl mx-auto leading-relaxed">
             AbsTracker operates a nationwide mobile fleet engineer service. Even if your specific town isn't listed, our certified technicians will travel directly to your location with government-approved AIS-140 GPS kits.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
             <a aria-label="Link" href="#contact" className="px-8 py-4 text-base font-black text-slate-900 bg-white rounded-2xl hover:bg-slate-100 transition-all shadow-xl active:scale-95 border border-transparent">
               Request Local Fitment
             </a>
             <a aria-label="Link" href="tel:+919123200739" className="px-8 py-4 text-base font-black text-white bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)] flex items-center justify-center gap-3 active:scale-95">
               <PhoneCall className="w-5 h-5" /> Call +91 91232 00739
             </a>
           </div>
         </div>
      </section>

      <div id="contact">
        <Contact />
      </div>
    </motion.div>
  );
}
