import { motion } from 'motion/react';
import { Briefcase, Code, Network, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CareersPage() {
  const jobs = [
    { title: 'Senior GPS Hardware Engineer', department: 'Engineering', location: 'Delhi NCR', icon: Code },
    { title: 'Enterprise Sales Director', department: 'Sales', location: 'Mumbai', icon: Briefcase },
    { title: 'Field Service Technician', department: 'Operations', location: 'Pan-India', icon: Wrench },
    { title: 'Data Scientist (Spatial)', department: 'Analytics', location: 'Bengaluru', icon: Network },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6"
          >
            Build the Future of Logistics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 font-medium max-w-2xl mx-auto"
          >
            Join India's largest GPS tracking network. We process millions of data points every second and secure billions of dollars in commercial assets.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {jobs.map((job, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <job.icon className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs rounded-full uppercase tracking-wider">
                  {job.department}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h3>
              <p className="text-slate-500 font-medium mb-8">{job.location} • Full-Time</p>
              
              <button className="text-blue-600 font-bold group-hover:text-blue-700 flex items-center gap-2">
                Apply Now <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl">
          <h2 className="text-3xl font-black mb-4">Don't see a fit?</h2>
          <p className="text-blue-200 mb-8 font-medium text-lg">We are always looking for exceptional talent.</p>
          <Link aria-label="Navigation Link"  to="/contact" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-colors">
            Send us your Resume
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
