import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { generateMetadata } from '../utils/generateMetadata';
import { useDealer } from '../context/DealerContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  productData?: {
    name: string;
    price: number;
    description: string;
    image: string;
    sku?: string;
    brand?: string;
    inStock?: boolean;
  };
}

export default function SEO({ title, description, keywords, image, url, productData }: SEOProps) {
  const location = useLocation();
  const { dealerData, isLoadingDealer } = useDealer();
  
  const pathname = location.pathname;
  const isDealerRoute = 
    pathname.startsWith('/d/') ||
    pathname.startsWith('/dealer-network/') ||
    pathname.startsWith('/dealer/') ||
    pathname.startsWith('/p/') ||
    (typeof window !== 'undefined' && window.location.hostname.split('.').length >= 3 && window.location.hostname.split('.')[0] !== 'www');

  const dynamicMeta = generateMetadata(pathname);

  // Check if document already has a custom title
  const existingDocTitle = typeof document !== 'undefined' ? document.title : '';
  const isDocTitleCustom = existingDocTitle && 
    !existingDocTitle.startsWith('AbsTracker - GPS Tracker') && 
    !existingDocTitle.startsWith('AbsTracker | India');

  let metaTitle = title || dealerData?.seoTitle;
  if (!metaTitle) {
    if (isDealerRoute && (isLoadingDealer || isDocTitleCustom)) {
      metaTitle = isDocTitleCustom ? existingDocTitle : dynamicMeta.title;
    } else {
      metaTitle = dynamicMeta.title;
    }
  }

  let metaDescription = description || dealerData?.seoDescription;
  if (!metaDescription) {
    if (isDealerRoute && isLoadingDealer) {
      metaDescription = dynamicMeta.description;
    } else {
      metaDescription = dynamicMeta.description;
    }
  }

  const metaKeywords = keywords || dynamicMeta.keywords || 'AIS 140 GPS, GPS Tracker, Fleet Management, AbsTracker, India, RTO Approved GPS';
  const metaImage = image || dealerData?.ogImage || dealerData?.imageUrl || dealerData?.dealerLogoUrl || 'https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg';
  
  let currentUrl = url;
  if (!currentUrl) {
    if (typeof window !== 'undefined') {
      currentUrl = window.location.href;
    } else {
      currentUrl = `https://abstracker.in${location.pathname}`;
    }
  }

  // Generate Structured Data (JSON-LD)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AbsTracker',
    legalName: 'AbsTracker Telematics India Pvt Ltd',
    url: 'https://abstracker.in',
    logo: 'https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg',
    foundingDate: '2020',
    founders: [
      {
        '@type': 'Person',
        name: 'Ritik Sharma'
      }
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot No. 42, Tech Zone',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201301',
      addressCountry: 'IN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9876543210',
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi']
    },
    sameAs: [
      'https://twitter.com/abstracker',
      'https://facebook.com/abstracker',
      'https://instagram.com/abstracker',
      'https://linkedin.com/company/abstracker'
    ]
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'AbsTracker',
    url: 'https://abstracker.in',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://abstracker.in/products?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  // Local Business Schema for Franchise / Dealer Pages
  let localBusinessSchema: any = null;
  if (dealerData && (dealerData.brandName || dealerData.city)) {
    localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'AutoPartsStore',
      name: dealerData.brandName || `AbsTracker ${dealerData.city || 'Franchise'}`,
      image: metaImage,
      telephone: dealerData.phone || '+91-9876543210',
      email: dealerData.email || 'help@abstracker.in',
      address: {
        '@type': 'PostalAddress',
        streetAddress: dealerData.address || `${dealerData.city || 'Central'}, India`,
        addressLocality: dealerData.city || 'India',
        addressRegion: dealerData.state || 'India',
        addressCountry: 'IN'
      },
      priceRange: '₹₹',
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '20:00'
        }
      ]
    };
  }

  // Product Schema if on a product page
  let productSchema: any = null;
  if (productData) {
    productSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productData.name,
      image: productData.image,
      description: productData.description,
      sku: productData.sku || 'ABS-GPS-01',
      brand: {
        '@type': 'Brand',
        name: productData.brand || 'AbsTracker'
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: productData.price,
        availability: productData.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'AbsTracker'
        }
      }
    };
  }

  // BreadcrumbList Schema
  const pathParts = pathname.split('/').filter(Boolean);
  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://abstracker.in'
    }
  ];

  pathParts.forEach((part, index) => {
    const formatted = part.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const itemUrl = `https://abstracker.in/${pathParts.slice(0, index + 1).join('/')}`;
    breadcrumbItems.push({
      '@type': 'ListItem',
      position: index + 2,
      name: formatted,
      item: itemUrl
    });
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems
  };

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Geolocation Meta Tags for Indian Local Search Boost */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content={dealerData?.city || 'India'} />
      <meta name="geo.position" content="28.6139;77.2090" />
      <meta name="ICBM" content="28.6139, 77.2090" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

      {/* Open Graph / WhatsApp / Facebook Preview */}
      <meta property="og:site_name" content="AbsTracker" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:secure_url" content={metaImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metaTitle} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@abstracker" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Structured Data Scripts (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {localBusinessSchema && (
        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
      )}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}
    </Helmet>
  );
}
