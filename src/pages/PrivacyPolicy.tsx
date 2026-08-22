import { motion } from 'motion/react';
import { ShieldCheck, Lock, EyeOff, Server, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "collection",
      icon: <EyeOff className="w-6 h-6 text-red-500" />,
      title: "1. Information We Collect",
      content: (
        <>
          <p className="mb-4">At AbsTracker, we are committed to safeguarding your privacy. We collect information that is strictly necessary to provide our advanced GPS tracking and fleet management services:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><span className="font-bold text-slate-800">Personal Identification Information:</span> Name, email address, phone number, and billing details required for account creation and service maintenance.</li>
            <li><span className="font-bold text-slate-800">Vehicle Data:</span> Vehicle registration numbers, chassis numbers, engine numbers, and vehicle type required for regulatory compliance and AIS-140 certification.</li>
            <li><span className="font-bold text-slate-800">Telemetry & Location Data:</span> Real-time GPS coordinates, vehicle speed, engine status, and historical route data collected directly from our installed hardware devices.</li>
          </ul>
        </>
      )
    },
    {
      id: "usage",
      icon: <Server className="w-6 h-6 text-red-500" />,
      title: "2. How We Use Your Data",
      content: (
        <>
          <p className="mb-4">The data collected is utilized exclusively to enhance your fleet operations and ensure strict adherence to governmental guidelines:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><span className="font-bold text-slate-800">Service Delivery:</span> To provide real-time tracking, generate historical playback reports, and trigger automated alerts (e.g., overspeeding, geo-fence breaches).</li>
            <li><span className="font-bold text-slate-800">Government Compliance:</span> To transmit mandatory telemetry data to state Vahan portals and MoRTH servers as legally required for commercial vehicles under the AIS-140 mandate.</li>
            <li><span className="font-bold text-slate-800">System Improvement:</span> To analyze aggregate data for optimizing server load, improving mapping accuracy, and resolving technical support tickets efficiently.</li>
          </ul>
        </>
      )
    },
    {
      id: "security",
      icon: <Lock className="w-6 h-6 text-red-500" />,
      title: "3. Data Security & Retention",
      content: (
        <>
          <p className="mb-4">We deploy enterprise-grade security protocols to ensure your sensitive location and personal data remain impenetrable:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><span className="font-bold text-slate-800">Encryption:</span> All data transmitted between our IoT devices, your mobile application, and our servers is secured using 256-bit AES encryption and TLS protocols.</li>
            <li><span className="font-bold text-slate-800">Infrastructure:</span> Our databases are hosted on secure, auto-scaling cloud infrastructure with redundant backups and strict access control limitations.</li>
            <li><span className="font-bold text-slate-800">Retention:</span> Historical tracking data is securely retained for up to 90 days (or as mandated by local state regulations) before being permanently purged from our active databases.</li>
          </ul>
        </>
      )
    },
    {
      id: "sharing",
      icon: <ShieldCheck className="w-6 h-6 text-red-500" />,
      title: "4. Third-Party Data Sharing",
      content: (
        <>
          <p className="mb-4">We adhere to a strict non-disclosure policy regarding your data:</p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li><span className="font-bold text-slate-800">No Commercial Selling:</span> We never sell, rent, or trade your personal or location data to advertising agencies or third-party brokers.</li>
            <li><span className="font-bold text-slate-800">Legal Obligations:</span> Data is only shared with authorized government entities (RTO, Police) when legally mandated or required for vehicle compliance certification.</li>
          </ul>
        </>
      )
    },
    {
      id: "contact",
      icon: <Mail className="w-6 h-6 text-red-500" />,
      title: "5. Contacting the Privacy Team",
      content: (
        <p>
          If you have concerns regarding data privacy, wish to request a data export, or need to delete your account, please contact our Data Protection Officer at: <br/><br/>
          <a aria-label="Link"  href="mailto:privacy@abstracker.in" className="font-bold text-red-600 hover:text-red-700 underline">privacy@abstracker.in</a>
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
            <ShieldCheck className="h-4 w-4 text-red-500" />
            <span>Legal & Privacy</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            Transparency and security are at the core of our operations. Learn exactly how we protect your fleet's data.
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
