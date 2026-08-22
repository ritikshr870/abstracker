import { motion } from 'motion/react';

const vehicles = [
  {
    name: 'Private Cars',
    image: 'https://ik.imagekit.io/xgxpgvop9/car.jpeg?tr=w-1200,f-auto,q-75',
    desc: 'Remote engine lock, live speed tracking, ignition alerts, and theft protection.',
    badge: 'POPULAR'
  },
  {
    name: 'School & College Buses',
    image: 'https://ik.imagekit.io/xgxpgvop9/bus.jpeg',
    desc: 'AIS-140 Govt Approved trackers with child safety route alerts, parent mobile apps, and driver monitoring.',
    badge: 'AIS-140 COMPLIANT'
  },
  {
    name: 'Ambulances & Emergency',
    image: 'https://ik.imagekit.io/xgxpgvop9/ambulance.jpeg?tr=w-1200,f-auto,q-75',
    desc: 'Critical emergency response tracking with real-time routing, siren alerts, and zero-delay tracking.',
    badge: 'EMERGENCY'
  },
  {
    name: 'JCB & Construction Machinery',
    image: 'https://ik.imagekit.io/xgxpgvop9/jcb.jpeg?tr=w-1200,f-auto,q-75',
    desc: 'Engine runtime hours, work site geofencing, and battery disconnection alerts.',
    badge: 'HEAVY DUTY'
  },
  {
    name: 'Rental Cars & Cargo Containers',
    image: 'https://ik.imagekit.io/xgxpgvop9/truck.jpeg?tr=w-1200,f-auto,q-75',
    desc: 'Zero-wiring magnetic trackers with long standby battery life.',
    badge: 'MAGNETIC'
  },
  {
    name: 'Tractors & Farm Equipment',
    image: 'https://ik.imagekit.io/xgxpgvop9/tractor.jpeg?tr=w-1200,f-auto,q-75',
    desc: 'Field runtime tracking, acreage movement alerts, and anti-theft immobilization.',
    badge: 'RUGGED'
  }
];

export default function VehicleFleet() {
  return (
    <section className="py-[clamp(5rem,10vw,7rem)] bg-white relative overflow-hidden border-b border-slate-200 w-full">
      <div className="max-w-7xl mx-auto px-[clamp(1rem,5vw,2rem)] relative z-10 w-full">
        <div className="text-center max-w-3xl mx-auto mb-[clamp(3rem,6vw,4rem)]">
          <h2 className="text-red-600 font-black tracking-widest uppercase text-[clamp(0.75rem,2vw,0.875rem)] mb-3">Vehicle Compatibility</h2>
          <h3 className="text-[clamp(1.875rem,5vw,3rem)] font-black text-slate-950 tracking-tight leading-tight mb-4">One Simple App for All Vehicles</h3>
          <p className="text-[clamp(1rem,2vw,1.125rem)] text-slate-600 font-medium leading-relaxed">
            From municipal ambulances to 16-wheel long-haul freight trucks, AbsTracker supports every vehicle class in India.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[clamp(1.5rem,3vw,2rem)] w-full">
          {vehicles.map((vehicle, index) => (
            <motion.div 
              key={vehicle.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group relative h-[clamp(16rem,25vw,18rem)] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl border-2 border-slate-100 hover:border-red-500 transition-all duration-300 w-full select-none"
            >
              <div className="absolute inset-0">
                <img width="800" height="600"  loading="lazy" 
                  src={vehicle.image} 
                  alt={vehicle.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
              
              <div className="absolute bottom-0 inset-x-0 p-[clamp(1rem,3vw,1.5rem)]">
                <div className="w-10 h-1 mb-3 rounded-full bg-red-600 group-hover:w-16 transition-all duration-300"></div>
                <h4 className="text-[clamp(1.125rem,2vw,1.25rem)] font-black text-white mb-1.5 leading-tight">{vehicle.name}</h4>
                <p className="text-slate-300 text-[clamp(0.75rem,1.5vw,0.875rem)] font-medium leading-relaxed line-clamp-2">
                  {vehicle.desc}
                </p>
              </div>
              
              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-wider border border-slate-700 whitespace-nowrap">{vehicle.badge || 'ABS-140 READY'}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
