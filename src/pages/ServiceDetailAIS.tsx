import { motion } from 'motion/react';
import Contact from '../components/Contact';
import { ShieldCheck, Server, Smartphone, CheckCircle, Cpu, Wifi, Map, Battery, FileText, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ServiceDetailAIS() {


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Animated Hero Section */}
      <div className="relative bg-slate-900 pt-32 pb-24 text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img fetchPriority="high" width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/bus.jpeg" alt="Commercial Fleet" className="w-full h-full object-cover object-center filter brightness-75" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40 z-10"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-bold mb-6 border border-blue-400/30 backdrop-blur-md"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>ARAI & ICAT Certified</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            AIS-140 GPS & VLTD
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-blue-100 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            100% RTO Approved & Vahan Integrated devices for complete compliance, safety, and operational control. Includes official documentation.
          </motion.p>
        </div>
      </div>

      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6">Why is AIS-140 Mandatory?</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                As per the Ministry of Road Transport and Highways (MoRTH), AIS-140 certified GPS devices (VLTD) are mandatory for all commercial and public transport vehicles across India to ensure passenger safety and monitor driver behavior.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Emergency Panic Button (SOS)',
                  'Real-time Vehicle Tracking',
                  'Vahan Portal Integration',
                  'IRNSS & GPS Support',
                  'Embedded eSIM capability',
                ].map((feature, i) => (
                  <motion.li 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-3 font-semibold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100"
                  >
                    <CheckCircle className="text-blue-600 w-5 h-5 flex-shrink-0" /> {feature}
                  </motion.li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 w-full sm:w-auto"
                >
                  View Products
                </Link>
                <a aria-label="Link"  
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors w-full sm:w-auto"
                >
                  Get Installation Quote
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl"
            >
               <div className="grid gap-6">
                 <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transform transition-transform hover:-translate-y-1">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <ShieldCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">RTO Compliant</h4>
                      <p className="text-slate-600 text-sm font-medium">Get your fitness certificate without hassle. 100% legal compliance.</p>
                    </div>
                 </div>
                 
                 <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transform transition-transform hover:-translate-y-1">
                    <div className="p-3 bg-indigo-50 rounded-xl">
                      <FileText className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">Full Documentation</h4>
                      <p className="text-slate-600 text-sm font-medium">We provide complete paperwork, NIC certificates, and VAHAN updates.</p>
                    </div>
                 </div>
                 
                 <div className="flex items-start gap-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transform transition-transform hover:-translate-y-1">
                    <div className="p-3 bg-emerald-50 rounded-xl">
                      <Smartphone className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">Live Mobile App Tracking</h4>
                      <p className="text-slate-600 text-sm font-medium">Track your fleet from anywhere using our iOS and Android applications.</p>
                    </div>
                 </div>
               </div>
            </motion.div>
          </div>
          
          {/* Technical Specifications Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Technical Specifications (VLTD)</h3>
              <p className="text-slate-600 font-medium max-w-2xl mx-auto">Our AIS-140 devices are built to rigorous government standards, ensuring uninterrupted tracking and maximum durability.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Cpu, title: 'Processor & Memory', desc: 'High-performance ARM Cortex with large flash memory for offline data storage.' },
                { icon: Map, title: 'GNSS / IRNSS', desc: 'Dual support for GPS and India\'s NavIC (IRNSS) for extreme precision.' },
                { icon: Wifi, title: 'Embedded eSIM', desc: 'Dual-network fallback M2M SIMs ensuring zero blind spots.' },
                { icon: Battery, title: 'Internal Battery', desc: 'High-capacity backup battery providing up to 8 hours of offline tracking.' },
              ].map((spec, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <spec.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-bold text-slate-900 mb-2">{spec.title}</h4>
                  <p className="text-slate-600 text-sm font-medium">{spec.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-extrabold text-slate-900 mb-12">The Hardware</h3>
            <img width="800" height="600"  loading="lazy" 
               src="https://ik.imagekit.io/xgxpgvop9/1786724453710.jpeg" 
               alt="AIS 140 GPS Device" 
               className="mx-auto rounded-3xl shadow-2xl border-4 border-slate-100 max-w-full md:max-w-xl h-auto object-contain transform transition-transform hover:scale-105 duration-500" 
            />
          </motion.div>
        </div>
      </section>

      <Contact />
    </motion.div>
  );
}
