import { motion } from 'motion/react';
import Contact from '../components/Contact';
import { Target, Shield, Users, Globe2, Building2, Award } from 'lucide-react';

export default function AboutUs() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      {/* Animated Hero Section */}
      <div className="relative bg-slate-900 pt-32 pb-24 text-center px-4 overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-slate-900/90 z-0"></div>
<div className="relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold mb-6 border border-emerald-200 uppercase tracking-widest"
          >
            <Globe2 className="h-4 w-4" />
            <span>India's Largest GPS Network</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight mb-6 leading-tight"
          >
            Pioneering Safe Fleet <br className="hidden md:block" /> Operations across India
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed mb-12"
          >
            AbsTracker is the absolute market leader in GPS tracking, dedicated to improving road safety and fleet management with the best AIS-140 certified GPS trackers all across India.
          </motion.p>
        </div>
      </div>
      </div>
      <div className="w-full">
        <img fetchPriority="high" width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/ambulance.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="Team working" className="w-full h-auto max-h-[70vh] object-cover" />
      </div>

      {/* Metrics Section */}
      <section className="py-12 bg-blue-600 border-y border-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-blue-500/50">
            {[
              { label: 'Vehicles Secured', value: '1M+' },
              { label: 'Active Dealers', value: '25,000+' },
              { label: 'States Covered', value: '28' },
              { label: 'Data Points/Sec', value: '50M+' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-blue-200 font-bold uppercase tracking-wider text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-100 group"
            >
              <img width="800" height="600"  loading="lazy" src="https://ik.imagekit.io/xgxpgvop9/truck.jpeg?tr=w-1200,f-auto,q-75?tr=w-1200,f-auto,q-75" alt="India's Largest GPS Operations Center" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl">
                  <h4 className="font-bold text-slate-900 text-xl mb-1 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" /> Massive Global Scale.
                  </h4>
                  <p className="text-slate-600 font-medium text-sm">Headquartered in Patna, Bihar, managing a network covering every district of India.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-blue-600 font-black tracking-widest uppercase text-sm mb-4">Our Mission</h2>
              <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                To engineer the safest, most efficient transport network in India.
              </h3>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                We know that good vehicle tracking is the backbone of modern transport. As India's largest GPS tracking provider, we've built a system that easily handles millions of vehicles, delivering exact live locations instantly to fleets of all sizes.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100 shadow-sm">
                    <Target className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Unmatched Nationwide Presence</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">A massive network of over 25,000 certified installation partners spanning from Kashmir to Kanyakumari.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0 border border-indigo-100 shadow-sm">
                    <Shield className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">100% Government Compliant (AIS-140)</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">Direct VAHAN portal integration and MoRTH compliance across all 28 states and Union Territories.</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 border border-emerald-100 shadow-sm">
                    <Award className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Award-Winning Enterprise Support</h4>
                    <p className="text-slate-600 font-medium leading-relaxed">Dedicated 24/7 command centers resolving technical queries in under 5 minutes for enterprise clients.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      <Contact />
    </motion.div>
  );
}
