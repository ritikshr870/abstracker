import { motion } from 'motion/react';
import Contact from '../components/Contact';
import { ShieldCheck, Navigation, Smartphone, BatteryCharging,  } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceDetailPrivate() {


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Animated Hero Section */}
      <div className="relative bg-slate-900 pt-32 pb-24 text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img fetchPriority="high" width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/car.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="Private Car" className="w-full h-full object-cover object-center filter brightness-75" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40 z-10"></div>
        
        <div className="relative z-20 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm font-bold mb-6 border border-purple-400/30 backdrop-blur-md"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Anti-Theft Protection</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-6"
          >
            Private GPS Tracker
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-purple-100 font-medium max-w-3xl mx-auto leading-relaxed"
          >
            Advanced private GPS tracking solutions for personal cars, bikes, and non-commercial vehicles with live tracking and remote engine cut-off.
          </motion.p>
        </div>
      </div>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6">Secure Your Personal Vehicle</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Our Private GPS trackers are designed for personal vehicle owners who want peace of mind. With features like remote engine lock and anti-theft alarms, your car or bike is always secure.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6 mt-10">
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                  <Smartphone className="w-8 h-8 text-purple-600 mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2">Remote Engine Cut-off</h4>
                  <p className="text-sm text-slate-600 font-medium">Turn off your vehicle's engine remotely using your smartphone in case of theft.</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                  <BatteryCharging className="w-8 h-8 text-purple-600 mb-4" />
                  <h4 className="font-bold text-slate-900 mb-2">Internal Battery Backup</h4>
                  <p className="text-sm text-slate-600 font-medium">Built-in battery ensures tracking continues even if the main vehicle battery is disconnected.</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link 
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/30 w-full sm:w-auto"
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
              className="flex justify-center"
            >
               <img width="800" height="600"  loading="lazy" 
                 src="https://ik.imagekit.io/xgxpgvop9/1786724510786.jpeg" 
                 alt="Private GPS Device Details" 
                 className="rounded-3xl shadow-2xl border-4 border-slate-100 max-w-full h-auto object-contain bg-white rounded-3xl"
               />
            </motion.div>
          </div>
        </div>
      </section>

      <Contact />
    </motion.div>
  );
}
