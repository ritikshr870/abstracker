import { motion } from 'motion/react';
import Services from '../components/Services';
import Products from '../components/Products';
import VehicleFleet from '../components/VehicleFleet';
import Contact from '../components/Contact';

export default function ServicesPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white pt-32 pb-12 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-tight"
          >
            Complete GPS Tracking Solutions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Comprehensive GPS, VLTD & Fleet Management Solutions powering India's largest logistics operations and supply chains.
          </motion.p>
        </div>
      </div>
      <div className="w-full">
        <img fetchPriority="high" width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/truck.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="Technology background" className="w-full h-auto max-h-[70vh] object-cover" />
      </div>
      
      <Products />
      <Services />
      <VehicleFleet />
      <Contact />
    </motion.div>
  );
}
