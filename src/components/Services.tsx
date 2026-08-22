import { Navigation, Bus, Truck, Smartphone, ArrowUpRight, BatteryCharging, Shield, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const services = [
    {
      title: 'AIS-140 Govt. Approved GPS',
      description: 'MoRTH compliant and RTO certified AIS-140 GPS trackers with emergency panic buttons for commercial vehicles, trucks, and school buses.',
      icon: Truck,
      tag: 'RTO APPROVED',
      link: '/services/ais-140-gps-solutions-in-india',
      ctaText: 'Explore AIS-140 GPS'
    },
    {
      title: 'Private Car & Bike Trackers',
      description: 'Compact hidden tracking devices equipped with remote engine cut-off relay, anti-theft geofencing, and live ignition alerts.',
      icon: Shield,
      tag: 'ANTI-THEFT',
      link: '/services/private-gps',
      ctaText: 'Explore Private Trackers'
    },
    {
      title: 'School Bus Tracking System',
      description: 'End-to-end transport solution for schools featuring live parent tracking apps, driver speed alerts, and route management panels.',
      icon: Bus,
      tag: 'STUDENT SAFETY',
      link: '/services',
      ctaText: 'Explore School Solutions'
    },
    {
      title: 'White-Label Dealer Software',
      description: 'Get custom-branded mobile apps and web portals under your own brand name to sell and manage GPS subscriptions directly.',
      icon: TrendingUp,
      tag: 'B2B GROWTH',
      link: '/dealer-network',
      ctaText: 'Partner With Us'
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-red-600 font-black tracking-widest uppercase text-xs sm:text-sm mb-3">Our Core GPS Services</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight">Complete GPS Tracking Solutions for Dealers & Fleets</h3>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            High-performance IoT hardware and software tailored for vehicle security, asset protection, and fleet management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <Link aria-label="Navigation Link"  
              key={index}
              to={service.link}
              className="group p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-red-500 hover:bg-white hover:shadow-xl hover:shadow-red-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <service.icon className="h-14 w-14 p-3.5 rounded-2xl bg-white border-2 border-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all duration-300 shadow-sm" />
                  <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 group-hover:bg-red-100 group-hover:text-red-700 transition-colors">
                    {service.tag}
                  </span>
                </div>

                <h4 className="text-xl font-black text-slate-900 mb-3 group-hover:text-red-600 transition-colors">
                  {service.title}
                </h4>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-sm font-bold text-red-600 group-hover:translate-x-1 transition-transform">
                <span>{service.ctaText || 'View Details'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
