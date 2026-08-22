import { motion } from 'motion/react';
import { Scale, Activity, ShieldAlert, FileText, AlertTriangle } from 'lucide-react';

export default function Terms() {
  const sections = [
    {
      id: "acceptance",
      icon: <Scale className="w-6 h-6 text-red-500" />,
      title: "1. Acceptance of Terms",
      content: (
        <>
          <p className="mb-4">By installing AbsTracker hardware or accessing our software platforms, you enter into a legally binding agreement to comply with these Terms of Service. This agreement governs your use of all AbsTracker services, including the web dashboard, mobile applications, and IoT devices.</p>
          <p>If you do not agree with any part of these terms, you must immediately discontinue the use of our services and surrender any leased hardware.</p>
        </>
      )
    },
    {
      id: "availability",
      icon: <Activity className="w-6 h-6 text-red-500" />,
      title: "2. Service Availability & Limitations",
      content: (
        <>
          <p className="mb-4">While AbsTracker guarantees an enterprise-grade 99.9% server uptime, actual device connectivity is subject to the following external dependencies:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><span className="font-bold text-slate-800">Cellular Networks:</span> Live tracking relies entirely on local telecom network coverage (e.g., Airtel, BSNL, Jio). Areas with weak or no cellular reception will delay real-time updates until the vehicle re-enters a coverage zone.</li>
            <li><span className="font-bold text-slate-800">Satellite Visibility:</span> The GPS antenna requires a clear line-of-sight to the sky. Underground parking, dense tunnels, or heavy metallic enclosures may temporarily obscure GPS coordinates.</li>
          </ul>
        </>
      )
    },
    {
      id: "warranty",
      icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
      title: "3. Hardware Warranty & Tampering",
      content: (
        <>
          <p className="mb-4">Our AIS-140 certified GPS devices are backed by a standard 1-year replacement warranty covering manufacturing defects. However, this warranty is strictly voided under the following conditions:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><span className="font-bold text-slate-800">Physical Damage:</span> Intentional breakage, water damage beyond the device's IP rating, or fire damage.</li>
            <li><span className="font-bold text-slate-800">Tampering:</span> Opening the device casing, cutting the sealed wire harness, or removing the government compliance seals.</li>
            <li><span className="font-bold text-slate-800">Unauthorized Repair:</span> Any repairs or modifications attempted by non-certified mechanics or third-party workshops.</li>
          </ul>
        </>
      )
    },
    {
      id: "compliance",
      icon: <FileText className="w-6 h-6 text-red-500" />,
      title: "4. Government & RTO Compliance",
      content: (
        <>
          <p className="mb-4">As a commercial fleet owner, it is your responsibility to ensure the continuous operation of the AIS-140 device to remain compliant with state regulations:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><span className="font-bold text-slate-800">SIM Recharges:</span> You must ensure the M2M SIM card remains active by completing timely annual subscription renewals. Failure to recharge will halt data transmission to the Vahan portal, resulting in non-compliance.</li>
            <li><span className="font-bold text-slate-800">Device Faults:</span> If the device stops transmitting due to electrical issues in your vehicle, you must notify an authorized AbsTracker dealer immediately to rectify the issue before facing RTO penalties.</li>
          </ul>
        </>
      )
    },
    {
      id: "liability",
      icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
      title: "5. Limitation of Liability",
      content: (
        <p>
          AbsTracker provides tracking services strictly for fleet management and safety monitoring. We shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from vehicle theft, accidents, loss of cargo, or failure of emergency services to respond to panic button alerts. Our maximum liability in any dispute shall not exceed the total amount paid by the user for the hardware and the current year's subscription fee.
        </p>
      )
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 pt-32 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-slate-300 text-sm font-bold mb-6 border border-slate-700 uppercase tracking-widest"
          >
            <Scale className="h-4 w-4 text-red-500" />
            <span>Legal Agreement</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            Please read these terms carefully before utilizing our hardware and software services.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-6 mb-10">
            Last Updated: August 15, 2026
          </p>

          <div className="space-y-12">
            {sections.map((section, idx) => (
              <div key={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="text-slate-600 font-medium leading-relaxed text-lg">
                  {section.content}
                </div>
                {idx !== sections.length - 1 && <div className="h-px bg-slate-100 mt-12 w-full"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
