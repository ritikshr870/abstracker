import { ShieldCheck, Mail, PhoneCall, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

export default function Footer() {
  const location = useLocation();
  const isStatePage = location.pathname.startsWith('/state/');
  const stateId = isStatePage ? location.pathname.split('/')[2] : null;

  const [dealerData, setDealerData] = useState<any>(null);

  useEffect(() => {
    if (isStatePage && stateId) {
      const fetchDealerData = async () => {
        try {
          const docRef = doc(db, 'dealers', stateId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setDealerData(docSnap.data());
          } else {
            setDealerData(null);
          }
        } catch (error) {
          console.error("Error fetching dealer data:", error);
        }
      };
      fetchDealerData();
    } else {
      setDealerData(null);
    }
  }, [isStatePage, stateId]);

  const defaultContact = {
    phone: '+91 91232 00739',
    cleanPhone: '+919123200739',
    email: 'sales@abstracker.in',
    address: 'Bypass Road, Patna | Jehanabad, Bihar',
    contactName: 'Central Support Office',
    businessHours: 'Monday - Saturday, 9:00 AM - 7:00 PM'
  };

  const phone = dealerData?.phone || defaultContact.phone;
  const cleanPhone = phone.replace(/\s+/g, '');
  const email = dealerData?.email || defaultContact.email;
  const address = dealerData?.address || defaultContact.address;
  const contactName = dealerData?.contactName ? `${dealerData.contactName} (Authorized Dealer)` : defaultContact.contactName;
  const businessHours = dealerData?.businessHours || defaultContact.businessHours;

  return (
    <footer className="bg-slate-950 pt-20 pb-10 border-t-4 border-red-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-red-900/5"></div>
      
      
      {/* Vehicle Fleet Gallery Banner */}
      <div className="w-full overflow-hidden border-b border-slate-900 bg-slate-950/50 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 opacity-75 grayscale hover:grayscale-0 transition-all duration-700">
            <img width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/truck.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="Truck" className="h-12 sm:h-16 w-auto rounded-lg object-cover hover:scale-110 transition-transform shadow-lg" />
            <img width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/bus.jpeg" alt="Bus" className="h-12 sm:h-16 w-auto rounded-lg object-cover hover:scale-110 transition-transform shadow-lg" />
            <img width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/ambulance.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="Ambulance" className="h-12 sm:h-16 w-auto rounded-lg object-cover hover:scale-110 transition-transform shadow-lg" />
            <img width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/jcb.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="JCB" className="h-12 sm:h-16 w-auto rounded-lg object-cover hover:scale-110 transition-transform shadow-lg" />
            <img width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/tractor.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="Tractor" className="h-12 sm:h-16 w-auto rounded-lg object-cover hover:scale-110 transition-transform shadow-lg" />
            <img width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/car.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="Car" className="h-12 sm:h-16 w-auto rounded-lg object-cover hover:scale-110 transition-transform shadow-lg" />
            <img width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/footer-truck.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="Footer Truck" className="h-12 sm:h-16 w-auto rounded-lg object-cover hover:scale-110 transition-transform shadow-lg" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Central Logo Section */}
        <div className="flex flex-col items-center justify-center text-center mb-16 border-b border-slate-900 pb-12">
          <Link to="/" className="inline-block group mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-600 blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="bg-white p-6 rounded-2xl relative z-10 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform duration-500 group-hover:scale-105 inline-block">
                <img width="128" height="128"  loading="lazy" 
                  src="https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80" 
                  alt="AbsTracker" 
                  className="h-28 md:h-40 w-auto object-contain" 
                />
              </div>
            </div>
          </Link>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
            India's Reliable B2B GPS Hardware & Platform
          </h2>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed text-lg">
            Empowering GPS dealers, distributors, and fleet owners with premium IoT hardware, custom app branding, and pan-India supply.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16 text-center md:text-left">
          <div className="col-span-1 flex flex-col items-center md:items-start">
            <h4 className="text-white font-black text-lg mb-6 tracking-wide uppercase flex items-center justify-center md:justify-start gap-2 w-full">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span> ABOUT US
            </h4>
            <p className="text-slate-400 font-medium leading-relaxed mb-6">
              AbsTracker has been leading the industry since 2016. With 10+ years of domain expertise, we provide high-performance IoT devices, magnetic asset trackers, and white-label branding solutions for B2B dealers across India.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-black text-white bg-red-600/20 w-max px-3 py-1.5 rounded-lg border border-red-500/30">
                <ShieldCheck className="h-4 w-4 text-red-500" />
                Govt. Approved
              </div>
              <div className="text-xs font-black text-slate-400 tracking-wider uppercase">
                Pan-India B2B Supplier
              </div>
            </div>
          </div>
          
          <div className="col-span-1 flex flex-col items-center md:items-start">
            <h4 className="text-white font-black text-lg mb-6 tracking-wide uppercase flex items-center justify-center md:justify-start gap-2 w-full">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span> Quick Links
            </h4>
            <ul className="space-y-3 inline-block text-left">
              <li><Link to="/about-us" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /> About Our Company</Link></li>
              <li><Link to="/products" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /> Tracking Products</Link></li>
              <li><Link to="/dealer-network" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /> Dealership Network</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /> Contact Support</Link></li>
            </ul>
          </div>
          
          <div className="col-span-1 flex flex-col items-center md:items-start">
            <h4 className="text-white font-black text-lg mb-6 tracking-wide uppercase flex items-center justify-center md:justify-start gap-2 w-full">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span> Solutions
            </h4>
            <ul className="space-y-3 inline-block text-left">
              <li><Link to="/services/ais-140-gps-solutions-in-india" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /> AIS-140 Compliance</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /> Commercial Fleet</Link></li>
              <li><Link to="/services/mining-gps" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /> Mining Vehicles</Link></li>
              <li><Link to="/services/private-gps" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /> Private Security</Link></li>
              <li><Link to="/services" className="text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 group"><ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 transition-colors" /> School Bus Tracker</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Info Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-10 mb-16 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="grid md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-5 lg:col-span-4 border-b md:border-b-0 md:border-r border-slate-800 pb-8 md:pb-0 md:pr-8">
              <h5 className="text-red-500 font-black mb-3 uppercase tracking-widest text-xs flex items-center gap-2">
                 Primary Contact
              </h5>
              <div className="text-xl font-black text-white mb-2">{contactName}</div>
              <p className="text-slate-400 font-medium leading-relaxed text-sm flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 mt-1 shrink-0" /> {address}
              </p>
            </div>
            
            <div className="md:col-span-7 lg:col-span-8 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6 w-full">
                <a aria-label="Link"  href={`tel:${cleanPhone}`} className="flex items-center gap-3 sm:gap-4 group/link bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 hover:border-red-500 transition-colors w-full overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover/link:bg-red-600 transition-colors shrink-0">
                    <PhoneCall className="w-4 h-4 text-red-500 group-hover/link:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-0.5">Direct Line</div>
                    <div className="text-slate-200 font-bold text-xs sm:text-sm group-hover/link:text-white transition-colors truncate">{phone}</div>
                  </div>
                </a>
                {!dealerData && (
                  <a aria-label="Link"  href="tel:+917903598658" className="flex items-center gap-3 sm:gap-4 group/link bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 hover:border-red-500 transition-colors w-full overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover/link:bg-red-600 transition-colors shrink-0">
                      <PhoneCall className="w-4 h-4 text-red-500 group-hover/link:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-0.5">Support Line</div>
                      <div className="text-slate-200 font-bold text-xs sm:text-sm group-hover/link:text-white transition-colors truncate">+91 79035 98658</div>
                    </div>
                  </a>
                )}
                
                <a aria-label="Link"  href={`mailto:${email}`} className="flex items-center gap-3 sm:gap-4 group/link bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 hover:border-red-500 transition-colors w-full overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center group-hover/link:bg-red-600 transition-colors shrink-0">
                    <Mail className="w-4 h-4 text-red-500 group-hover/link:text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-0.5">Email Desk</div>
                    <div className="text-slate-200 font-bold text-xs sm:text-sm group-hover/link:text-white transition-colors break-words overflow-hidden" style={{ wordBreak: "break-word" }} title={email}>{email}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 sm:gap-4 bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800 w-full overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-0.5">Business Hours</div>
                    <div className="text-slate-300 font-bold text-xs sm:text-sm truncate">{businessHours}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-slate-900">
          <p className="text-slate-400 text-sm font-medium text-center md:text-left flex flex-col sm:flex-row gap-2 sm:gap-6">
            <span>&copy; {new Date().getFullYear()} AbsTracker India. All rights reserved.</span>
            <span className="flex items-center justify-center md:justify-start gap-1.5">
              Developed by 
              <a aria-label="Link"  href="https://ritik-sharma-developer.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-slate-300 font-bold hover:text-red-500 transition-colors border-b border-transparent hover:border-red-500 pb-0.5">
                Ritik Sharma
              </a>
            </span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            <Link to="/privacy-policy" className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-slate-400 hover:text-slate-300 text-sm font-medium transition-colors">Terms of Service</Link>
            {isStatePage && dealerData?.contactName && (
              <span className="text-red-500 text-xs font-black uppercase bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                Partner: {dealerData.contactName}
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
