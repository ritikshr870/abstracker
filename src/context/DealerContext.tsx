import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

export interface DealerData {
  id?: string;
  docId?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsappMessage?: string;
  seoTitle?: string;
  seoDescription?: string;
  businessHours?: string;
  services?: string;
  googleMapsLink?: string;
  imageUrl?: string;
  state?: string;
  city?: string;
  dealerType?: string;
  experienceYears?: string;
  teamSize?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  updatedAt?: string;
  
  // New customized branding fields
  dealerLogoUrl?: string;
  brandName?: string;
  aboutText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroVideoUrl?: string;
  bgType?: 'image' | 'video';
  ctaText?: string;
  heroBadgeText?: string;
  heroFeature1?: string;
  heroFeature2?: string;
  heroFeature3?: string;
  heroFeature4?: string;
  contactBadge?: string;
  contactTitle?: string;
  contactDescription?: string;
  contactFeatureTitle?: string;
  contactFeatureDesc?: string;
  contactSuccessMsg?: string;
  cityStateName?: string;
  footerText?: string;
  features?: string;
  pricingStartingAt?: string;
  ogImage?: string;
  ownerName?: string;
  themeColor?: string;
  loginEmail?: string;
  loginPassword?: string;
  templateId?: 'template1' | 'template2' | 'template3' | 'template4';
  showProducts?: boolean;
  websiteSlug?: string;
}

interface DealerContextType {
  dealerData: DealerData | null;
  setDealerId: (id: string | null) => void;
  isLoadingDealer: boolean;
  clearDealer: () => void;
}

const DealerContext = createContext<DealerContextType>({
  dealerData: null,
  setDealerId: () => {},
  isLoadingDealer: false,
  clearDealer: () => {},
});

export const useDealer = () => useContext(DealerContext);

export function DealerProvider({ children }: { children: React.ReactNode }) {
  const [dealerData, setDealerData] = useState<DealerData | null>(null);
  const [isLoadingDealer, setIsLoadingDealer] = useState(false);
  const [currentDealerId, setCurrentDealerId] = useState<string | null>(null);

const defaultFallbackData: DealerData = {
  contactName: 'AbsTracker',
  phone: '+919123200739',
  email: 'info@abstracker.in',
  address: 'India',
  whatsappMessage: 'Hi, I need GPS Tracker.',
  services: 'AIS 140 GPS, Personal Car Tracker, School Bus Tracker',
  features: 'Live Tracking, Engine Lock, 1 Year Warranty',
  brandName: 'AbsTracker',
  themeColor: '#3b82f6',
  dealerLogoUrl: 'https://ik.imagekit.io/xgxpgvop9/1000562214-removebg-preview.png?tr=w-256,f-auto,q-80',
  templateId: 'template1',
  showProducts: true,
  aboutText: 'AbsTracker is India\'s premier provider of Govt. approved AIS-140 GPS tracking devices and fleet management solutions. We are dedicated to vehicle safety and RTO compliance.'
};


  // Initialize from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem('referredDealerId');
    if (savedId) {
      setCurrentDealerId(savedId.toLowerCase());
    }
  }, []);

  useEffect(() => {
    if (!currentDealerId) {
      setDealerData(null);
      return;
    }
    
    const normalizedId = currentDealerId.toLowerCase().trim();
    const prettyName = normalizedId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const dynamicFallback: DealerData = {
      ...defaultFallbackData,
      contactName: `AbsTracker ${prettyName}`,
      brandName: prettyName,
      city: prettyName,
      address: `Serving all major locations in ${prettyName}`,
      whatsappMessage: `Hi, I need an AIS-140 GPS tracker in ${prettyName}. Please share details.`,
      seoTitle: `AIS-140 GPS Tracker & VLTD in ${prettyName} | AbsTracker`,
      seoDescription: `Get Government approved AIS 140 GPS tracking devices and emergency panic buttons in ${prettyName}. Fast installation and RTO certification.`
    };
    
    // Check instant session storage cache first
    try {
      const cached = sessionStorage.getItem(`abstracker_dealer_${normalizedId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setDealerData(parsed);
        setIsLoadingDealer(false);
      } else {
        setDealerData(dynamicFallback);
        setIsLoadingDealer(true);
      }
    } catch {
      setDealerData(dynamicFallback);
      setIsLoadingDealer(true);
    }

    const saveAndSetDealer = (data: any, docId?: string) => {
      let servicesStr = '';
      if (Array.isArray(data.services)) {
        servicesStr = data.services.join(', ');
      } else if (typeof data.services === 'string') {
        servicesStr = data.services;
      }
      let featuresStr = '';
      if (Array.isArray(data.features)) {
        featuresStr = data.features.join(', ');
      } else if (typeof data.features === 'string') {
        featuresStr = data.features;
      }

      const formatted: DealerData = {
        ...dynamicFallback,
        ...data,
        id: docId || data.id || normalizedId,
        docId: docId || data.docId || data.id || normalizedId,
        services: servicesStr || dynamicFallback.services,
        features: featuresStr || dynamicFallback.features,
      };

      setDealerData(formatted);
      try {
        sessionStorage.setItem(`abstracker_dealer_${normalizedId}`, JSON.stringify(formatted));
      } catch {}
      setIsLoadingDealer(false);
    };
    
    const fetchDealer = async () => {
      try {
        const q = query(collection(db, 'dealers'), where('websiteSlug', '==', normalizedId), limit(1));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const docSnap = snapshot.docs[0];
          saveAndSetDealer(docSnap.data(), docSnap.id);
        } else {
          // 2. Fallback to doc ID
          try {
            const docRef = doc(db, 'dealers', normalizedId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              saveAndSetDealer(docSnap.data(), docSnap.id);
              return;
            }

            // 3. Fallback scan all dealers in collection
            const allDocsSnap = await getDocs(collection(db, 'dealers'));
            const matchedDoc = allDocsSnap.docs.find(d => {
              const data = d.data();
              const wSlug = data.websiteSlug?.toLowerCase()?.trim();
              const docId = d.id.toLowerCase().trim();
              const dCity = data.city?.toLowerCase()?.replace(/[\s&]+/g, '-');
              const dState = data.state?.toLowerCase()?.replace(/[\s&]+/g, '-');
              return wSlug === normalizedId || docId === normalizedId || dCity === normalizedId || dState === normalizedId;
            });

            if (matchedDoc) {
              saveAndSetDealer(matchedDoc.data(), matchedDoc.id);
            } else {
              setDealerData(dynamicFallback);
              setIsLoadingDealer(false);
            }
          } catch (err) {
            console.error("Dealer fetch error:", err);
            setDealerData(dynamicFallback);
            setIsLoadingDealer(false);
          }
        }
      } catch (err) {
        console.error("Dealer query error:", err);
        setDealerData(dynamicFallback);
        setIsLoadingDealer(false);
      }
    };
    
    fetchDealer();

    return () => {};
  }, [currentDealerId]);

  const setDealerId = useCallback((id: string | null) => {
    if (id) {
      const lowerId = id.toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-');
      setCurrentDealerId(lowerId);
      localStorage.setItem('referredDealerId', lowerId);
    }
  }, []);

  const clearDealer = useCallback(() => {
    setCurrentDealerId(null);
    localStorage.removeItem('referredDealerId');
  }, []);

  return (
    <DealerContext.Provider value={{ dealerData, setDealerId, isLoadingDealer, clearDealer }}>
      {children}
    </DealerContext.Provider>
  );
}
