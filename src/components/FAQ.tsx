import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How can I become an Abstracker Authorized Dealer?",
    answer: "You can register by filling out our Dealer Partnership form or contacting our sales support team directly via WhatsApp/Call. Once approved, you get instant access to wholesale pricing slabs, custom marketing collaterals, and panel login setup."
  },
  {
    question: "Do you provide White-Label App & Custom Website branding for dealers?",
    answer: "Yes! We provide custom branding packages for dealers including your own branded tracking mobile app, custom domain website setup, Google Business Profile optimization, and local marketing support."
  },
  {
    question: "What is the Minimum Order Quantity (MOQ) and pricing model?",
    answer: "We offer flexible MOQ slabs starting from 10 units up to bulk orders of 100+ units. High volume orders unlock higher dealer profit margins. Contact us for the updated B2B price list."
  },
  {
    question: "What warranty and RMA support do you offer on GPS devices?",
    answer: "All Abstracker IoT devices come with a 1-Year Comprehensive Replacement Warranty. We offer fast RMA turnarounds to ensure zero disruption for your clients."
  },
  {
    question: "Do devices come pre-configured with SIM cards and application software?",
    answer: "Yes, we provide full flexibility. Devices can be ordered with pre-activated M2M SIM cards and pre-configured app subscriptions, or as standalone hardware if you prefer to manage subscriptions independently."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-red-600 font-black tracking-widest uppercase text-xs sm:text-sm mb-3 flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4" /> HELP CENTER & FAQ
          </h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight">
            Frequently Asked Questions by Dealers
          </h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'border-red-400 shadow-md' : 'border-slate-200 hover:border-red-200'}`}
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className={`font-black pr-8 text-base sm:text-lg transition-colors ${openIndex === index ? 'text-red-600' : 'text-slate-900'}`}>{faq.question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === index ? 'bg-red-50' : 'bg-slate-50'}`}>
                   <ChevronDown 
                     className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-red-600' : 'text-slate-400'}`} 
                   />
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-600 font-medium leading-relaxed border-t border-slate-100 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
