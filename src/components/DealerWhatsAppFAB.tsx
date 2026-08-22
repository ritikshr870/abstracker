import { MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useDealer } from '../context/DealerContext';

export default function DealerWhatsAppFAB() {
  const { dealerData } = useDealer();
  
  if (!dealerData) return null;

  const phone = dealerData?.phone ? dealerData.phone.replace(/[^0-9+]/g, '') : '919123200739';
  const messageStr = dealerData?.whatsappMessage || `Hi, I am interested in GPS Tracker for my vehicle.`;
  const message = `?text=${encodeURIComponent(messageStr)}`;
  const whatsappUrl = `https://wa.me/${phone}${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 md:bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl hover:bg-green-600 hover:scale-110 transition-all duration-300"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}
