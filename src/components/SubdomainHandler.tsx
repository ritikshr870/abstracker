import { useEffect } from 'react';
import { useDealer } from '../context/DealerContext';

export default function SubdomainHandler() {
  const { setDealerId } = useDealer();

  useEffect(() => {
    const hostname = window.location.hostname;
    // Extract subdomain
    // E.g. dealer.abstracker.in -> dealer
    const parts = hostname.split('.');
    
    // Check if it's a subdomain (at least 3 parts: subdomain.domain.tld)
    // Ignore www, localhost, firebaseapp, run.app
    if (
      hostname.includes('abstracker') &&
      parts.length >= 3 && 
      parts[0] !== 'www' &&
      parts[0] !== 'admin' &&
      parts[0] !== 'portal'
    ) {
      const subdomain = parts[0];
      console.log("SubdomainHandler: Detected subdomain", subdomain);
      setDealerId(subdomain);
    }
  }, [setDealerId]);

  return null;
}
