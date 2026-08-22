import { useState } from 'react';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function AbsTrackerDealerAI({ 
  dealerData, 
  onSEOUpdate 
}: { 
  dealerData: any;
  onSEOUpdate: (data: { aboutText: string; seoTitle: string; seoDescription: string }) => void;
}) {
  const [loadingSEO, setLoadingSEO] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    setCooldown(10);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGenerateSEO = async () => {
    setLoadingSEO(true);
    try {
      const res = await fetch('https://abstracker.abstracker0.workers.dev/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: dealerData.brandName,
          city: dealerData.city,
          dealerType: dealerData.dealerType
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      onSEOUpdate({
        aboutText: data.about_us,
        seoTitle: data.meta_title,
        seoDescription: data.meta_description
      });
      startCooldown();
    } catch (err: any) {
      alert("SEO Generation failed: " + err.message);
    } finally {
      setLoadingSEO(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="font-bold text-indigo-900 text-lg">Smart AI Assistant</h3>
          <p className="text-sm text-indigo-700">
            Automatically generate professional SEO content using AbsTracker AI Brain.
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleGenerateSEO}
          disabled={loadingSEO || cooldown > 0}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
        >
          {loadingSEO ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
          {cooldown > 0 ? `Wait ${cooldown}s` : '✨ Generate SEO & About Us'}
        </button>
      </div>
    </div>
  );
}
