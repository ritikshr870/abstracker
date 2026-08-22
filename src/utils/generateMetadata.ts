import { districts } from '../data/districts';

interface Metadata {
  title: string;
  description: string;
  keywords?: string;
}

export function generateMetadata(pathname: string): Metadata {
  const defaultMeta = {
    title: 'AbsTracker - GPS Tracker for Car, Bike & Commercial Vehicles | AIS 140 Govt Approved',
    description: 'India\'s most trusted GPS tracking company. Get Govt & RTO approved AIS-140 GPS with panic button, personal vehicle anti-theft trackers, and smart fleet management software.',
    keywords: 'AbsTracker, AIS 140 GPS India, RTO Approved GPS, Vehicle Tracking System, Fleet Management Software, Commercial Vehicle GPS, Personal Car Tracker, Best GPS Tracker India, VLTD'
  };

  if (!pathname || pathname === '/') {
    return defaultMeta;
  }

  // 1. Dynamic District & Dealer Pages (/dealer-network/:slug, /d/:slug, /p/:id)
  if (pathname.startsWith('/dealer-network/ais-140-gps-solution-in-')) {
    const slug = pathname.replace('/dealer-network/ais-140-gps-solution-in-', '');
    const district = districts.find(d => d.toLowerCase().replace(/\s+/g, '-') === slug) || slug.replace(/-/g, ' ');
    const formattedDistrict = district.charAt(0).toUpperCase() + district.slice(1);
    
    return {
      title: `AIS 140 GPS in ${formattedDistrict} | Govt & RTO Approved VLTD | AbsTracker`,
      description: `Need an RTO approved AIS 140 GPS tracker in ${formattedDistrict}? Buy Govt certified GPS for commercial vehicles, trucks, and school buses with BSNL Vahan certificate. Free doorstep installation!`,
      keywords: `AIS 140 GPS ${formattedDistrict}, GPS Tracker ${formattedDistrict}, RTO Approved GPS ${formattedDistrict}, Vahan Certificate ${formattedDistrict}, Commercial Vehicle Tracker ${formattedDistrict}, AbsTracker Dealer ${formattedDistrict}`
    };
  }

  if (pathname.startsWith('/dealer-network/') && pathname !== '/dealer-network') {
    const slug = pathname.replace('/dealer-network/', '');
    const cleanName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      title: `AbsTracker Authorized GPS Dealer in ${cleanName} | AIS 140 & Vehicle Tracking`,
      description: `Find certified AbsTracker GPS dealers and fitting centers in ${cleanName}. Buy RTO approved AIS-140 VLTD devices, panic buttons, and vehicle anti-theft tracking solutions.`,
      keywords: `GPS Dealer ${cleanName}, AIS 140 ${cleanName}, Vehicle Tracker ${cleanName}, GPS Installation ${cleanName}, AbsTracker ${cleanName}`
    };
  }

  if (pathname.startsWith('/d/')) {
    const slug = pathname.replace('/d/', '');
    const cleanName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      title: `${cleanName} GPS Tracking & AIS 140 VLTD Center | AbsTracker Franchise`,
      description: `Official AbsTracker franchise page for ${cleanName}. Get instant quotation, expert device installation, 24/7 telemetry monitoring, and BSNL VAHAN compliance support.`,
      keywords: `AbsTracker ${cleanName}, AIS 140 GPS ${cleanName}, GPS Shop ${cleanName}, Fleet Tracking ${cleanName}`
    };
  }

  if (pathname.startsWith('/p/')) {
    const dealerId = pathname.replace('/p/', '');
    return {
      title: `Authorized Dealer (${dealerId}) | AbsTracker GPS Network`,
      description: `Connecting you with official AbsTracker authorized franchise partner (${dealerId}) for certified AIS-140 GPS and vehicle telemetry solutions.`,
      keywords: `AbsTracker Partner ${dealerId}, GPS Dealer, AIS 140 Dealer`
    };
  }

  // 2. Dynamic Product Detail Page (/products/:id)
  if (pathname.startsWith('/products/') && pathname !== '/products') {
    const productId = pathname.replace('/products/', '');
    const formattedName = productId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      title: `${formattedName} - Buy GPS Tracker Online | Best Price & Warranty | AbsTracker`,
      description: `Buy ${formattedName} online at lowest price with 1-year warranty and free SIM + App access. Fast doorstep delivery, real-time live GPS tracking, and instant alerts.`,
      keywords: `${formattedName}, Buy GPS, GPS Price India, AIS 140 Device, Vehicle Anti-Theft GPS, AbsTracker Store`
    };
  }

  // 3. Dynamic Order Tracking (/track/:id)
  if (pathname.startsWith('/track/')) {
    const orderId = pathname.replace('/track/', '');
    return {
      title: `Track GPS Order #${orderId} | Live Dispatch Status | AbsTracker`,
      description: `Track the shipping and dispatch status of your AbsTracker GPS device order #${orderId}. Real-time courier updates and technician assignment status.`,
      keywords: `Track Order ${orderId}, AbsTracker Delivery Status, GPS Shipping Status`
    };
  }

  // 4. Programmatic Vehicle + City SEO Pages (/:city/:vehicle)
  if (pathname !== '/' && pathname.split('/').length === 3) {
    const [_, city, vehicle] = pathname.split('/');
    const excludedFirstSegments = ['track', 'dealer-network', 'services', 'products', 'd', 'p', 'admin', 'portal', 'api', 'assets'];
    if (city && vehicle && !excludedFirstSegments.includes(city)) {
      const formattedCity = city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ');
      const formattedVehicle = vehicle.replace(/-/g, ' ');
      
      return {
        title: `AIS-140 GPS Tracker for ${formattedVehicle} in ${formattedCity} | 100% RTO Approved`,
        description: `Install Govt certified AIS 140 GPS tracker for your ${formattedVehicle} in ${formattedCity}. Get instant BSNL Vahan certificate, real-time live tracking app, and anti-theft engine cut-off alerts.`,
        keywords: `AIS 140 GPS ${formattedVehicle} ${formattedCity}, ${formattedVehicle} GPS Tracker ${formattedCity}, RTO Approved GPS for ${formattedVehicle}, Vahan Certified GPS, Fleet Tracking ${formattedCity}`
      };
    }
  }

  // 5. Static Pages Map
  const routes: Record<string, Metadata> = {
    '/services': {
      title: 'GPS Tracking Services & Solutions | AIS 140 & Mining GPS | AbsTracker',
      description: 'Discover AbsTracker\'s comprehensive GPS solutions. We provide AIS-140 certified GPS, highly durable mining vehicle GPS, and anti-theft private car trackers.',
      keywords: 'GPS Services, AIS 140 GPS Solutions, Mining GPS India, Private Car Anti-Theft Tracker, Fleet Tracking Services, Vehicle Telemetry'
    },
    '/services/ais-140-gps-solutions-in-india': {
      title: 'AIS 140 GPS Tracker | RTO & VAHAN Approved | AbsTracker',
      description: 'Get MoRTH compliant AIS-140 GPS tracker for commercial vehicles. VAHAN approved with SOS panic button. 100% RTO passing guaranteed across India.',
      keywords: 'AIS 140 GPS, RTO Approved GPS, VAHAN Approved Tracker, Commercial Vehicle GPS, AIS 140 Certification, VLTD Device'
    },
    '/services/mining-gps': {
      title: 'Mining Equipment & Heavy Machinery GPS | AbsTracker',
      description: 'Rugged, dust-proof GPS trackers designed for mining trucks, JCBs, and heavy machinery. Monitor fuel, engine hours, and exact location in harsh environments.',
      keywords: 'Mining GPS Tracker, JCB GPS, Heavy Machinery Tracker, Fuel Monitoring GPS, Excavator Tracker'
    },
    '/services/private-gps': {
      title: 'Private Car & Bike Hidden Anti-Theft GPS Tracker | AbsTracker',
      description: 'Secure your personal car or bike with our hidden GPS tracker. Features remote engine lock, real-time tracking, and instant anti-theft alerts.',
      keywords: 'Private Car GPS, Bike Tracker, Anti Theft GPS, Hidden GPS Tracker, Remote Engine Lock'
    },
    '/products': {
      title: 'Buy GPS Trackers Online | AIS 140, Private Car & Bike GPS | AbsTracker Store',
      description: 'Shop India\'s top-rated GPS trackers. Buy AIS 140 Vahan approved GPS for commercial vehicles or hidden anti-theft trackers for private cars and bikes. Free App!',
      keywords: 'Buy GPS Tracker, Online GPS Store, AIS 140 Device Price, Car Tracker Price, Bike GPS, Hidden GPS Tracker'
    },
    '/dealer-network': {
      title: 'Find GPS Installers & Dealers Near You | Pan-India AbsTracker Network',
      description: 'Locate authorized AbsTracker dealers and certified installers across 700+ districts in India. Get fast, reliable, and professional GPS installation with full RTO compliance support.',
      keywords: 'GPS Dealer Near Me, GPS Installer India, AbsTracker Dealer, AIS 140 Fitting Center, RTO Approved GPS Dealer'
    },
    '/become-dealer': {
      title: 'Become a GPS Dealer | High-Margin Dealership Franchise | AbsTracker',
      description: 'Start your own GPS tracking business with AbsTracker. High profit margins, zero royalty, free software branding, dedicated subdomains, and complete marketing support.',
      keywords: 'Become GPS Dealer, GPS Franchise Opportunity, GPS Business India, Start GPS Business, AbsTracker Dealership'
    },
    '/about-us': {
      title: 'About AbsTracker | India\'s Leading Vehicle Telemetry & IoT Company',
      description: 'Learn why 50,000+ vehicle owners trust AbsTracker. We are India\'s fastest-growing GPS provider committed to road safety, fleet optimization, and AIS-140 compliance.',
      keywords: 'About AbsTracker, Best GPS Company in India, Fleet Management Experts, GPS Manufacturing, Top GPS Brand'
    },
    '/contact': {
      title: 'Contact AbsTracker | 24/7 Customer Support & Sales Hotline',
      description: 'Get in touch with the AbsTracker team. Call us for sales inquiries, technical support, dealership opportunities, and bulk fleet tracking installations.',
      keywords: 'Contact AbsTracker, GPS Customer Care, GPS Tracker Support, Dealership Inquiry, Fleet Tracking Sales'
    },
    '/careers': {
      title: 'Careers at AbsTracker | Join India\'s Leading IoT & Telematics Team',
      description: 'Explore exciting career opportunities at AbsTracker. We are hiring talented engineers, sales managers, and customer support specialists across India.',
      keywords: 'AbsTracker Careers, IoT Jobs India, GPS Company Hiring, Telematics Jobs'
    },
    '/tracking-demo': {
      title: 'Live GPS Tracking Demo | Test-Drive AbsTracker Software Online',
      description: 'Experience the power of AbsTracker\'s live GPS tracking platform. View real-time vehicle movement, speed alerts, playback history, geofence, and engine status.',
      keywords: 'GPS Tracking Demo, Live GPS Demo, Test Vehicle Tracking, Fleet Software Online Demo'
    },
    '/cart': {
      title: 'Your Shopping Cart | AbsTracker Official Store',
      description: 'Review your selected GPS tracking devices, accessories, and subscriptions before secure checkout.',
      keywords: 'AbsTracker Cart, GPS Cart'
    },
    '/checkout': {
      title: 'Secure Checkout | Buy GPS Device Online | AbsTracker',
      description: 'Complete your GPS device purchase with 100% secure payment methods and free pan-India express shipping.',
      keywords: 'GPS Checkout, Buy Tracker Online'
    },
    '/orders': {
      title: 'Your Orders | AbsTracker Customer Portal',
      description: 'View your order history, shipment tracking numbers, and invoice downloads.',
      keywords: 'AbsTracker Orders, Order History'
    },
    '/profile': {
      title: 'User Profile & Settings | AbsTracker',
      description: 'Manage your AbsTracker account details, notifications, and vehicle subscriptions.',
      keywords: 'AbsTracker Profile, Account Settings'
    },
    '/login': {
      title: 'Login to Web Portal | Fleet Tracking Dashboard | AbsTracker',
      description: 'Log in to your AbsTracker dashboard to monitor your fleet, check live location, view driving history, and manage AIS-140 compliance alerts.',
      keywords: 'AbsTracker Login, GPS Tracking Portal, Fleet Dashboard Login, Vahan GPS Login'
    },
    '/dealer-portal': {
      title: 'Dealer Portal Login | Manage Leads & Products | AbsTracker',
      description: 'Exclusive portal for AbsTracker Franchise partners. Login to manage customer leads, add local products, and track your GPS dealership sales.',
      keywords: 'Dealer Login, GPS Dealership Portal, AbsTracker Partner Dashboard'
    },
    '/privacy-policy': {
      title: 'Privacy Policy | Data Protection & GPS Security | AbsTracker',
      description: 'Read AbsTracker\'s privacy policy. Learn how we securely collect, encrypt, and manage your vehicle telemetry and personal data in compliance with Indian laws.',
      keywords: 'GPS Privacy Policy, Data Protection, Telemetry Security, AbsTracker Policies'
    },
    '/terms-and-conditions': {
      title: 'Terms and Conditions | Service Agreement | AbsTracker',
      description: 'Review the terms of service and usage conditions for AbsTracker hardware and software platforms. Understand our warranty, compliance, and subscription terms.',
      keywords: 'GPS Terms of Service, Hardware Warranty Terms, AIS 140 Compliance Agreement, AbsTracker Terms'
    }
  };

  return routes[pathname] || defaultMeta;
}
