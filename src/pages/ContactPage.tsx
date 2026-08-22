import { motion } from 'motion/react';
import Contact from '../components/Contact';

export default function ContactPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="relative bg-slate-900 pt-32 pb-24 text-center px-4 overflow-hidden">
<div className="absolute inset-0 z-0 opacity-20"><img loading="lazy" width="800" height="600" src="https://ik.imagekit.io/xgxpgvop9/truck.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" className="w-full h-full object-cover filter brightness-50" /></div>
<div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-xl text-blue-200 font-medium max-w-3xl mx-auto">
          We're here to help you with installations, support, and dealership inquiries.
        </p>
      </div>
      </div>
      <Contact />
    </motion.div>
  );
}
