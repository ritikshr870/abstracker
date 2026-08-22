import { Phone, Wrench, Smartphone } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Consult or Order Online',
      description: 'Choose your GPS device or call our technical team at +91 91232 00739 for same-day fitment scheduling.',
      icon: Phone,
    },
    {
      num: '02',
      title: 'Certified Installation',
      description: 'Our certified engineers install the VLTD tracker & emergency panic buttons at your doorstep or garage.',
      icon: Wrench,
    },
    {
      num: '03',
      title: 'Instant Vahan Sync & Live App',
      description: 'Receive your official RTO fitment certificate and monitor real-time location on the AbsTracker mobile app.',
      icon: Smartphone,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-950 text-white relative overflow-hidden border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-red-500 font-black tracking-widest uppercase text-xs sm:text-sm mb-3">Seamless Setup</h2>
          <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-white">Simple 3-Step Process</h3>
          <p className="text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
            Get your vehicle fitted and RTO-certified without tedious paperwork or long downtime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-14 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 -z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <step.icon className="w-24 h-24 p-7 rounded-3xl bg-slate-900 border-2 border-slate-800 text-red-500 shadow-xl group-hover:border-red-500 group-hover:scale-110 transition-all" />
                <div className="absolute -top-3 -right-3 w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-xs font-black text-white shadow-lg">
                  {step.num}
                </div>
              </div>
              <h4 className="text-xl font-black mb-3 text-white">{step.title}</h4>
              <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
