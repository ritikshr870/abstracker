import { MapPin, Building2, Handshake, Globe2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Coverage() {
  const activeStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 
    'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
    'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli',
    'Daman & Diu', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 
    'Lakshadweep', 'Puducherry'
  ];

  return (
    <section id="network" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <h2 className="text-red-600 font-black tracking-widest uppercase text-xs sm:text-sm mb-3 flex items-center gap-2">
              <Globe2 className="w-4 h-4" /> Nationwide Presence
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-950 mb-6 tracking-tight leading-tight">
              Powering Fleets Across Every State of India
            </h3>
            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed font-medium">
              With authorized installation franchises and doorstep technician support, we provide AIS-140 VLTD fitment, renewal certificates, and warranty repairs across all 28 States and 8 Union Territories.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-10 max-h-[260px] overflow-y-auto pr-2 pb-2">
              {activeStates.map((state, idx) => (
                <Link aria-label="Navigation Link"  
                  to="/dealer-network"
                  key={idx} 
                  className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  
                  {state}
                </Link>
              ))}
            </div>

            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/15 rounded-full blur-[80px]"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/30 flex flex-shrink-0 items-center justify-center text-red-400">
                  <Handshake className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-xl font-black mb-1">Become an Authorized Dealer</h4>
                  <p className="text-slate-400 text-sm mb-4 font-medium leading-relaxed">
                    Start your GPS business with India's most trusted AIS-140 brand. Get dedicated portal access and wholesale margins.
                  </p>
                  <Link aria-label="Navigation Link"  to="/dealer-network" className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95">
                    Explore Dealer Program <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
               <div className="absolute inset-0 bg-red-600/10 rounded-[2.5rem] blur-3xl transform rotate-6 scale-105"></div>
               <div className="relative aspect-square bg-slate-950 border-2 border-slate-800 rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center justify-center overflow-hidden group">
                 <Building2 className="h-64 w-64 text-slate-900 absolute -bottom-10 -right-10 transform group-hover:scale-110 transition-transform duration-700" />
                 
                 <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-20 h-20 bg-red-600/20 border border-red-500/40 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <MapPin className="h-10 w-10 text-red-500 animate-bounce" style={{animationDuration: '2.5s'}} />
                   </div>
                   <h4 className="text-4xl font-black text-white tracking-tight leading-tight">
                     100%<br/><span className="text-red-500">Pan-India</span><br/>Coverage
                   </h4>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-3">
                     28 States • 750+ Districts
                   </p>
                 </div>
                 
                 {/* Glowing red map indicators */}
                 <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                 <div className="absolute top-1/3 right-1/4 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
                 <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-ping" style={{animationDelay: '1.2s'}}></div>
               </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
