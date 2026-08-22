import { ShieldCheck, Settings, Smartphone, Clock, CheckCircle2 } from 'lucide-react';

export default function Features() {
  const features = [
    {
      title: 'AIS-140 & CDAC Certified',
      description: 'Fully compliant with MoRTH standards for commercial, passenger & hazardous transport.',
      icon: ShieldCheck,
    },
    {
      title: 'Quick Pan-India Fitment',
      description: 'Certified technician installation within 2-4 hours across 28 Indian States & UTs.',
      icon: Settings,
    },
    {
      title: 'Direct Vahan & NIC Sync',
      description: 'Instant fitness test certificate generation on Vahan portal without middleman delays.',
      icon: Smartphone,
    },
    {
      title: '24x7 Live App Telemetry',
      description: 'Second-by-second live location, ignition status, speed alerts, and 90-day playback history.',
      icon: Clock,
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-red-600 font-black tracking-widest uppercase text-xs sm:text-sm mb-3">Why Fleet Owners Trust AbsTracker</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 mb-6 leading-tight tracking-tight">
              The Gold Standard in Fleet Safety & Compliance
            </h3>
            <p className="text-base sm:text-lg text-slate-600 mb-10 leading-relaxed font-medium">
              We engineer reliable GPS tracking devices and apps designed to keep your vehicles compliant, prevent theft, reduce fuel waste, and secure official RTO fitness certificates seamlessly.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-200 hover:border-red-300 transition-colors shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    <feature.icon className="h-12 w-12 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 shadow-sm" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 mb-1">{feature.title}</h4>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative mt-8 lg:mt-0 lg:pl-6">
            <div className="absolute inset-0 bg-red-600/10 rounded-[2.5rem] transform rotate-2 scale-105 blur-xl pointer-events-none"></div>
            
            <div className="relative rounded-[2.5rem] shadow-2xl border-4 border-slate-900 overflow-hidden w-full h-[460px] lg:h-[620px] bg-slate-950">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="none"
                className="w-full h-full object-cover opacity-90"
              >
                <source src="https://ik.imagekit.io/xgxpgvop9/Untitled%20design.mp4" type="video/mp4" />
                <track kind="captions" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                  <div>
                    <p className="text-xs font-bold text-slate-400">Live Satellite Uplink</p>
                    <p className="text-sm font-black text-white">ABS-140 VLTD ACTIVE</p>
                  </div>
                </div>
                <span className="text-xs font-black px-3 py-1 bg-red-600 text-white rounded-full">
                  100% RTO PASS
                </span>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white p-5 rounded-2xl shadow-2xl max-w-xs border-2 border-red-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center border border-red-200">
                  <CheckCircle2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Approval Status</p>
                  <p className="text-lg font-black text-slate-900 tracking-tight">100% Govt Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
