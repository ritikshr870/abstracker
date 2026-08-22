import { Menu, X, PhoneCall, User as UserIcon, LogOut, Package, ShieldAlert, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const phoneToUse = '+919123200739';
  const displayPhone = '+91 91232 00739';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Products', href: '/products' },
    { name: 'Dealer Network', href: '/dealer-network' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleAdminRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    const isLocalOrPreview = window.location.hostname.includes('localhost') || window.location.hostname.includes('run.app');
    if (isLocalOrPreview) {
      window.location.href = '/admin.html';
    } else {
      const baseDomain = window.location.hostname.replace('www.', '');
      window.location.href = `https://admin.${baseDomain}`;
    }
  };

  const navigate = useNavigate();

  const handleDealerRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    navigate('/dealer-network');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group h-full py-2">
              <img loading="lazy" width="128" height="128"  
                src="https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80" 
                alt="AbsTracker" 
                className="h-full max-h-[4rem] md:max-h-[5rem] w-auto object-contain transition-transform duration-300 group-hover:scale-105 scale-[1.15] origin-left" 
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-bold transition-colors ${
                    isActive 
                      ? 'text-red-600 border-b-2 border-red-600 pb-0.5' 
                      : 'text-slate-700 hover:text-red-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/cart" 
              className="relative p-2 text-slate-700 hover:text-red-600 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            <a
              href={`tel:${phoneToUse}`}
              className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 bg-slate-50"
            >
              <PhoneCall className="h-4 w-4 text-red-600" />
              <span>{displayPhone}</span>
            </a>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link to="/orders" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-red-600 transition-colors bg-slate-100 px-2.5 py-1.5 rounded-lg">
                  <Package className="h-3.5 w-3.5 text-slate-600" />
                  <span>Orders</span>
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-red-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-700 font-bold text-xs">
                    {currentUser.photoURL ? (
                      <img loading="lazy" width="800" height="600"  src={currentUser.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => logout()}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold text-slate-800 hover:text-red-600 transition-colors"
              >
                Log In
              </Link>
            )}

            <button
              onClick={handleDealerRedirect}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-md shadow-red-600/20 active:scale-95 flex items-center gap-1.5"
            >
              Join Dealer Network
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2 text-slate-700 hover:text-red-600 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button aria-label="Toggle menu" onClick={() => setIsOpen(!isOpen)} className="text-slate-800 hover:text-red-600 p-2 rounded-lg"
              
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-2xl absolute w-full left-0">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 text-base font-bold text-slate-800 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-150 active:scale-[0.98] active:bg-red-100 select-none min-h-[44px] flex items-center"
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-base font-bold text-slate-800 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-150 active:scale-[0.98] select-none min-h-[44px]"
                >
                  <Package className="w-5 h-5 text-red-600" />
                  My Orders
                </Link>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 active:scale-[0.98] transition-all duration-150 select-none">
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 flex-1 min-h-[44px]">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700">
                      {currentUser.photoURL ? (
                        <img loading="lazy" width="800" height="600"  src={currentUser.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex flex-col truncate pr-2">
                      <span className="font-bold text-slate-900 text-sm truncate">{currentUser.displayName || 'User'}</span>
                      <span className="text-xs text-slate-500 truncate">{currentUser.email}</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="p-3 text-slate-400 hover:text-red-600 hover:bg-slate-200 rounded-lg transition-all duration-150 active:scale-90 min-h-[44px] flex items-center justify-center"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full py-3 bg-slate-950 text-white font-bold rounded-xl shadow-sm hover:bg-slate-900 transition-all duration-150 active:scale-95 select-none min-h-[44px]"
              >
                <UserIcon className="w-5 h-5 mr-2 text-red-500" /> Log In
              </Link>
            )}

            <a
              href={`tel:${phoneToUse}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 text-white font-bold bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md border border-slate-700 transition-all duration-150 active:scale-95 select-none min-h-[44px]"
            >
              <PhoneCall className="h-5 w-5 text-red-500" />
              Call: {displayPhone}
            </a>

            <button
              onClick={handleDealerRedirect}
              className="flex items-center justify-center w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 transition-all duration-150 active:scale-95 select-none min-h-[44px]"
            >
              Join Dealer Network
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
