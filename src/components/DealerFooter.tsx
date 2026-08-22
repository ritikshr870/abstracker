import { MapPin, PhoneCall, Mail } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { useLocation } from 'react-router-dom';
import { indiaStates } from '../data/indiaStates';

export default function DealerFooter() {
  const { dealerData } = useDealer();
  const location = useLocation();
  
  if (!dealerData) return null;

  const isStatePage = location.pathname.includes('/dealer-network/ais-140-gps-solution-in-');
  let stateName = '';
  if (isStatePage) {
    const slug = location.pathname.split('/dealer-network/ais-140-gps-solution-in-')[1] || '';
    if (slug) {
      const matchedState = indiaStates.find(
        s => s.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-') === slug
      );
      if (matchedState) {
        stateName = matchedState;
      } else {
        stateName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
  }

  const brandName = dealerData?.brandName || dealerData?.contactName || (stateName ? `AbsTracker ${stateName}` : 'Authorized Local Dealer');
  const address = dealerData?.address || (stateName ? `Serving all major districts in ${stateName}` : 'Local Dealer Branch');
  const email = dealerData?.email || 'Contact Dealer';
  const phone = dealerData?.phone || 'Contact Dealer';
  const logoUrl = dealerData?.dealerLogoUrl;
  const primaryColor = dealerData?.themeColor || "#3b82f6";
  const footerText = dealerData?.footerText || (dealerData?.templateId === 'template4' ? 'Your trusted local provider of premium GPS solutions and fleet management systems. Ensuring complete safety for your vehicles.' : 'Your trusted local provider of AIS-140 GPS solutions, VLTD, and fleet management systems. Ensuring complete compliance and safety for your vehicles.');

  return (
    <footer className="bg-slate-950 pt-16 pb-24 md:pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
          
          <div className="lg:col-span-1">
            {logoUrl ? (
              <img width="800" height="600"  loading="lazy" src={logoUrl} alt={brandName} className="h-16 w-auto object-contain mb-6 bg-white rounded-lg p-2" />
            ) : (
              <h3 className="text-white text-2xl font-black mb-4">{brandName}</h3>
            )}
            {dealerData?.ownerName && (
              <p className="text-white font-bold text-lg mb-2">Owner: {dealerData.ownerName}</p>
            )}
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              {footerText}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Contact Us</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-blue-500 mt-1" />
                <span className="text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">{address}</span>
              </li>
              <li className="flex items-start gap-4">
                <PhoneCall className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <a aria-label="Link"  href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-slate-400 hover:text-blue-400 font-medium transition-colors">{phone}</a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-blue-500" />
                <a aria-label="Link"  href={`mailto:${email}`} className="text-slate-400 hover:text-blue-400 font-medium transition-colors">{email}</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              <li><a aria-label="Link"  href={location.pathname} className="text-slate-400 hover:text-blue-400 transition-colors font-medium">Home</a></li>
              <li><a aria-label="Link"  href="#about" className="text-slate-400 hover:text-blue-400 transition-colors font-medium">About Us</a></li>
              <li><a aria-label="Link"  href="#services" className="text-slate-400 hover:text-blue-400 transition-colors font-medium">Services</a></li>
              <li><a aria-label="Link"  href="#contact" className="text-slate-400 hover:text-blue-400 transition-colors font-medium">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm font-medium flex flex-col gap-2 text-center md:text-left">
            <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
            <span>
              Powered by <a aria-label="Link"  href="https://ritik-sharma-developer.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Ritik Sharma</a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
