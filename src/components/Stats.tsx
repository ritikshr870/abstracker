import { Users, Cpu, Map, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function Stats() {
  const stats = [
    { id: 1, name: 'ACTIVE GPS TRACKERS', value: '18,500+', icon: Cpu },
    { id: 2, name: 'REGISTERED DEALER PARTNERS', value: '350+', icon: Users },
    { id: 3, name: 'PAN-INDIA NETWORK COVERAGE', value: '28 States & UTs', icon: Map },
    { id: 4, name: 'SERVER UPTIME & LIVE DATA', value: '99.9%', icon: Activity },
  ];

  return (
    <section className="bg-slate-950 py-[clamp(4rem,8vw,6rem)] relative z-20 border-b border-slate-900 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-[clamp(1rem,5vw,2rem)] relative z-10 w-full">
        <div className="text-center mb-[clamp(3rem,6vw,4rem)]">
          <h2 className="text-red-500 font-black tracking-widest uppercase text-[clamp(0.75rem,2vw,0.875rem)] mb-3">Our National Footprint</h2>
          <h3 className="text-[clamp(2rem,5vw,3rem)] font-black text-white tracking-tight leading-tight mb-4">India's Trusted B2B GPS & IoT Infrastructure</h3>
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">Powering dealers, fleets, and businesses with ultra-reliable tracking technology.</p>
        </div>

        <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-[clamp(1.5rem,3vw,2.5rem)] text-center w-full">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center group bg-slate-900/60 p-[clamp(1.5rem,3vw,2rem)] rounded-2xl border border-slate-800 hover:border-red-500/40 hover:bg-slate-900 transition-all duration-300 shadow-lg w-full"
            >
              <div className="p-4 bg-slate-950 rounded-2xl mb-5 border border-slate-800 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.25)] transition-all duration-300 transform group-hover:-translate-y-1 shrink-0">
                <stat.icon className="h-[clamp(1.5rem,3vw,1.75rem)] w-[clamp(1.5rem,3vw,1.75rem)] text-red-500" />
              </div>
              <dd className="text-[clamp(1.875rem,4vw,3rem)] font-black text-white mb-2 tracking-tight group-hover:text-red-400 transition-colors leading-none">
                {stat.value}
              </dd>
              <dt className="text-[clamp(0.75rem,1.5vw,0.875rem)] font-bold text-slate-400 uppercase tracking-wide">
                {stat.name}
              </dt>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
