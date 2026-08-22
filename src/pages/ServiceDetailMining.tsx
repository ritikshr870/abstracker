import { motion } from 'motion/react';
import Contact from '../components/Contact';
import { Truck, Map, Battery, ShieldAlert, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceDetailMining() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Animated Hero Section */}
      <div className="relative bg-slate-950 pt-32 pb-24 text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img fetchPriority="high" width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/jcb.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="JCB Excavator Mining Equipment" className="w-full h-full object-cover object-center filter brightness-75" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-900/50 z-10"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-bold mb-6 border border-emerald-400/30 backdrop-blur-md"
          >
            <Truck className="h-4 w-4" />
            <span>Heavy Machinery Ready</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Mining & Heavy <br/>Machinery GPS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-emerald-100/80 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            Rugged, IP67-rated tracking solutions built for extreme conditions, excavators, tippers, and remote mining zones across India.
          </motion.p>
        </div>
      </div>

      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6">Built for Tough Environments</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
                Mining operations require specialized GPS tracking devices that can withstand severe dust, extreme vibration, and harsh weather. Standard trackers fail quickly in these conditions. Our mining GPS solutions are enclosed in rugged IP67/IP68 rated cases, ensuring zero downtime and continuous reporting.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mt-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <Battery className="w-8 h-8 text-emerald-600 mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2">Fuel & Engine Monitoring</h4>
                  <p className="text-sm text-slate-600 font-medium">Prevent fuel theft and track exact engine working vs idling hours.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <Map className="w-8 h-8 text-emerald-600 mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2">Zone Geofencing</h4>
                  <p className="text-sm text-slate-600 font-medium">Get instant alerts if machinery leaves designated mining or construction zones.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-100 h-[600px]"
            >
               <img width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/Mining.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="Heavy Crane Machinery" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
               
               <div className="absolute bottom-8 left-8 right-8">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl">
                    <div className="flex items-center gap-4 text-white mb-4">
                      <ShieldAlert className="w-8 h-8 text-red-400" />
                      <div>
                        <h4 className="font-bold text-lg">Harsh Environment Proof</h4>
                        <p className="text-sm text-slate-300 font-medium">Water, Dust, and Shock Resistant</p>
                      </div>
                    </div>
                 </div>
               </div>
            </motion.div>

          </div>
        </div>
      </section>


      {/* Product Highlight Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -inset-4 bg-emerald-500/10 rounded-[3rem] blur-xl"></div>
                <img loading="lazy" width="800" height="600" src="https://ik.imagekit.io/xgxpgvop9/1786724453710.jpeg" alt="Mining Tracker Device" className="w-full max-w-md mx-auto relative z-10 rounded-3xl shadow-lg border border-slate-100 object-cover" />
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="inline-block bg-slate-900 text-white text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
                Industrial Grade
              </div>
              <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 tracking-tight">Rugged Mining GPS Tracker</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                Engineered specifically for heavy earth-moving equipment, excavators, and dump trucks operating in cellular dead zones.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'IP67 Water & Dust Proof Casing',
                  'High Vibration Tolerance',
                  'Remote Engine Cut-off Support',
                  'Dual Server Connectivity'
                ].map((feature, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3 font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100"
                  >
                    <CheckCircle className="text-emerald-600 w-5 h-5 flex-shrink-0" /> {feature}
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30 w-full sm:w-auto"
                >
                  View Products
                </Link>
                <a 
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors w-full sm:w-auto"
                >
                  Request a Demo
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Contact />
    </motion.div>
  );
}
