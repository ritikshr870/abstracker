import { Link, useLocation } from 'react-router-dom';
import { PhoneCall, Menu, X } from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { useState } from 'react';

export default function DealerNavbar() {
  const { dealerData } = useDealer();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  if (!dealerData) return null;
  
  const brandName = dealerData?.brandName || dealerData?.contactName || 'Authorized Partner';
  const logoUrl = dealerData?.dealerLogoUrl || 'https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80';
  const isCustomLogo = !!dealerData?.dealerLogoUrl;
  const primaryColor = dealerData?.themeColor || "#3b82f6";

  const navLinks = [
    { name: 'Home', path: '#top' },
    { name: 'About', path: '#about' },
    { name: 'Services', path: '#services' },
    { name: 'Contact', path: '#contact' }
  ];

  return (
    <nav className="fixed w-full z-[100] top-0 bg-white shadow-sm border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          <a aria-label="Link"  href="#top" className="flex items-center gap-3 group">
            {logoUrl ? (
              <img loading="lazy" width="800" height="600"  
                src={logoUrl} 
                alt={brandName} 
                className={`object-contain object-left ${isCustomLogo ? 'h-20 md:h-24 w-auto max-w-[280px] sm:max-w-[350px] object-contain' : 'h-16 md:h-24 w-auto max-w-[300px]'}`} 
              />
            ) : (
              <span className="text-2xl font-black theme-text">{brandName}</span>
            )}
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <a aria-label="Link"  
                  key={link.name} 
                  href={link.path} 
                  className="text-slate-600 font-bold hover:text-blue-600 theme-text transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            
            {true && (
              <a aria-label="Link"  href={`tel:${(dealerData?.phone || '+919123200739').replace(/[^0-9+]/g, '')}`} className="flex items-center gap-2 bg-blue-600 theme-bg text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg theme-shadow">
                <PhoneCall className="w-5 h-5" />
                <span>Call Us</span>
              </a>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 absolute w-full left-0 top-20 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {navLinks.map((link) => (
              <a aria-label="Link"  
                key={link.name} 
                href={link.path} 
                onClick={() => setIsOpen(false)}
                className="block text-slate-700 font-bold text-lg py-2 border-b border-slate-50"
              >
                {link.name}
              </a>
            ))}
            {true && (
              <a aria-label="Link"  
                href={`tel:${(dealerData?.phone || '+919123200739').replace(/[^0-9+]/g, '')}`} 
                className="flex items-center justify-center gap-2 bg-blue-600 theme-bg text-white px-4 py-3 rounded-xl font-bold w-full mt-4 shadow-lg theme-shadow"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Call Us Now</span>
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
