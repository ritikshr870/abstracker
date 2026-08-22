import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDealer } from '../context/DealerContext';
import { Loader2 } from 'lucide-react';

export default function PartnerRedirect() {
  const { dealerId } = useParams();
  const { setDealerId } = useDealer();
  const navigate = useNavigate();

  useEffect(() => {
    if (dealerId) {
      setDealerId(dealerId);
      // Small timeout to let context save
      setTimeout(() => {
        navigate(`/dealer-network/${dealerId}`, { replace: true });
      }, 500);
    } else {
      navigate('/', { replace: true });
    }
  }, [dealerId, setDealerId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-20">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Loading Partner Site...</h2>
        <p className="text-slate-500 mt-2">Personalizing your experience</p>
      </div>
    </div>
  );
}
