/**
 * ============================================================================
 * ABSTRACKER - ADVANCED CLOUDFLARE WORKER & SSR SEO ENGINE
 * ============================================================================
 * - Single Canonical Sitemap Generator (/sitemap.xml at https://abstracker.in/sitemap.xml)
 * - Subdomain Routing (admin.abstracker.in, portal.abstracker.in, [dealer].abstracker.in)
 * - Server-Side Meta Tag & Social Open Graph / Twitter Card Injection (Firestore Synced)
 * - Bot & Social Media Crawler Instant Preview Generator (WhatsApp, Facebook, Telegram, Googlebot)
 * - Resend API Mail Dispatcher (/api/send)
 * - Groq AI Content Engine (/api/ai-write)
 * - Gemini AI Assistants (/api/generate-seo, /api/ai-chat)
 * - D1 Database Webmail Inbox & MIME Parser (/api/emails)
 * - Pexels Stock Media Proxy (/api/pexels)
 */

const BASE_DOMAIN = 'abstracker.in';
const BASE_URL = `https://${BASE_DOMAIN}`;
const CANONICAL_DOMAIN = BASE_DOMAIN;
const FIREBASE_PROJECT_ID = 'abs-tracker-india';
const FIREBASE_API_KEY = 'AIzaSyANymVM5EmKLq_FcPI6RaB2iqpESrTyTic';

const VALID_CITIES = [
  "andhra-pradesh", "arunachal-pradesh", "assam", "bihar", "chhattisgarh",
  "goa", "gujarat", "haryana", "himachal-pradesh", "jharkhand",
  "karnataka", "kerala", "madhya-pradesh", "maharashtra", "manipur",
  "meghalaya", "mizoram", "nagaland", "odisha", "punjab",
  "rajasthan", "sikkim", "tamil-nadu", "telangana", "tripura",
  "uttar-pradesh", "uttarakhand", "west-bengal", "andaman-and-nicobar-islands",
  "chandigarh", "dadra-and-nagar-haveli-and-daman-and-diu", "delhi",
  "jammu-and-kashmir", "ladakh", "lakshadweep", "puducherry",
  // Bihar Districts & Cities
  "araria", "arwal", "aurangabad", "banka", "begusarai", "bhagalpur",
  "bhojpur", "buxar", "darbhanga", "east-champaran", "gaya", "gopalganj",
  "jamui", "jehanabad", "kaimur", "katihar", "khagaria", "kishanganj",
  "lakhisarai", "madhepura", "madhubani", "munger", "muzaffarpur",
  "nalanda", "nawada", "patna", "purnia", "rohtas", "saharsa",
  "samastipur", "saran", "sheikhpura", "sheohar", "sitamarhi", "siwan",
  "supaul", "vaishali", "west-champaran", "arrah", "hajipur", "sasaram",
  "motihari", "chhapra", "danapur", "bihar-sharif", "bettiah",
  // Delhi NCR
  "new-delhi", "noida", "greater-noida", "gurugram", "faridabad", "ghaziabad", "sonipat", "bahadurgarh",
  // Maharashtra
  "mumbai", "pune", "nagpur", "thane", "nashik", "kalyan-dombivli", "vasai-virar",
  "chhatrapati-sambhaji-nagar", "navi-mumbai", "solapur", "mira-bhayandar", "bhiwandi",
  "amravati", "nanded", "kolhapur", "akola", "ulhasnagar", "sangli", "malegaon", "jalgaon", "latur",
  // Karnataka
  "bengaluru", "mysuru", "hubballi-dharwad", "mangaluru", "belagavi", "kalaburagi",
  "davanagere", "ballari", "vijayapura", "shivamogga", "tumakuru", "raichur", "bidar", "hassan", "udupi",
  // Uttar Pradesh
  "lucknow", "kanpur", "varanasi", "agra", "prayagraj", "meerut", "aligarh", "bareilly",
  "moradabad", "gorakhpur", "saharanpur", "jhansi", "muzaffarnagar", "mathura", "ayodhya",
  "firozabad", "rampur", "shahjahanpur", "farrukhabad", "hapur", "etawah", "mirzapur", "bulandshahr",
  // West Bengal
  "kolkata", "howrah", "darjeeling", "siliguri", "durgapur", "asansol", "bardhaman", "malda",
  "baharampur", "kharagpur", "haldia", "jalpaiguri", "bankura", "purulia",
  // Rajasthan
  "jaipur", "jodhpur", "udaipur", "kota", "bikaner", "ajmer", "bhilwara", "alwar",
  "bharatpur", "sikar", "pali", "sri-ganganagar", "hanumangarh", "beawar",
  // Gujarat
  "ahmedabad", "surat", "vadodara", "rajkot", "bhavnagar", "jamnagar", "junagadh",
  "gandhinagar", "anand", "navsari", "morbi", "nadiad", "surendranagar", "bharuch", "vapi",
  // Tamil Nadu
  "chennai", "coimbatore", "madurai", "tiruchirappalli", "salem", "tiruppur", "erode",
  "tirunelveli", "vellore", "thoothukudi", "dindigul", "thanjavur", "hosur", "nagercoil", "kanchipuram",
  // Telangana & Andhra Pradesh
  "hyderabad", "warangal", "nizamabad", "khammam", "karimnagar", "visakhapatnam", "vijayawada",
  "guntur", "nellore", "kurnool", "kakinada", "rajamahendravaram", "kadapa", "tirupati", "anantapur",
  // Madhya Pradesh & Chhattisgarh
  "bhopal", "indore", "jabalpur", "gwalior", "ujjain", "sagar", "dewas", "satna", "ratlam", "rewa",
  "raipur", "bhilai", "bilaspur", "korba", "durg", "rajnandgaon",
  // Punjab & Haryana
  "ludhiana", "amritsar", "jalandhar", "patiala", "bathinda", "mohali", "panipat", "ambala", "rohtak", "hisar", "karnal",
  // Jharkhand & Odisha
  "ranchi", "jamshedpur", "dhanbad", "bokaro-steel-city", "deoghar", "hazaribagh",
  "bhubaneswar", "cuttack", "rourkela", "berhampur", "sambalpur", "puri", "balasore",
  // Kerala
  "thiruvananthapuram", "kochi", "kozhikode", "kollam", "thrissur", "kannur", "alappuzha", "kottayam", "palakkad",
  // North East & Uttarakhand & HP & J&K
  "guwahati", "silchar", "dibrugarh", "jorhat", "agartala", "shillong", "imphal", "aizawl", "kohima", "dimapur", "itanagar", "gangtok",
  "dehradun", "haridwar", "roorkee", "haldwani", "rishikesh", "nainital",
  "shimla", "dharamshala", "solan", "mandi", "baddi", "kullu", "manali",
  "srinagar", "jammu", "anantnag", "leh", "panaji", "margao", "vasco-da-gama"
];

const VEHICLE_TYPES = [
  'commercial-vehicles', 'school-buses', 'trucks', 'mining-vehicles', 'cars', 'taxis', 'ambulances', 'tractors'
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

// Pure JS MIME Parser for Inbound Emails
function decodeQuotedPrintable(str) {
  return str
    .replace(/=[\r\n]+/g, '')
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function decodeBase64Safe(str) {
  try {
    return atob(str.replace(/\s+/g, ''));
  } catch {
    return str;
  }
}

function parseMimeEmail(raw) {
  let plainText = '';
  let htmlContent = '';

  const boundaryMatch = raw.match(/Content-Type:\s*multipart\/[a-z]+;[^\r\n]*boundary="?([^";\r\n]+)"?/i);

  if (boundaryMatch) {
    const boundary = boundaryMatch[1];
    const rawParts = raw.split(new RegExp(`--${boundary}(?:--)?`));

    for (const part of rawParts) {
      if (!part.trim()) continue;

      const headerEndIndex = part.indexOf('\r\n\r\n') !== -1 ? part.indexOf('\r\n\r\n') : part.indexOf('\n\n');
      if (headerEndIndex === -1) continue;

      const headers = part.substring(0, headerEndIndex);
      let body = part.substring(headerEndIndex).trim();

      const isBase64 = /Content-Transfer-Encoding:\s*base64/i.test(headers);
      const isQP = /Content-Transfer-Encoding:\s*quoted-printable/i.test(headers);

      if (isBase64) {
        body = decodeBase64Safe(body);
      } else if (isQP) {
        body = decodeQuotedPrintable(body);
      }

      if (/Content-Type:\s*text\/plain/i.test(headers) && !plainText) {
        plainText = body;
      } else if (/Content-Type:\s*text\/html/i.test(headers) && !htmlContent) {
        htmlContent = body;
      }
    }
  } else {
    const splitIndex = raw.indexOf('\r\n\r\n') !== -1 ? raw.indexOf('\r\n\r\n') : raw.indexOf('\n\n');
    let body = splitIndex !== -1 ? raw.substring(splitIndex).trim() : raw;

    if (/Content-Transfer-Encoding:\s*base64/i.test(raw)) {
      body = decodeBase64Safe(body);
    } else if (/Content-Transfer-Encoding:\s*quoted-printable/i.test(raw)) {
      body = decodeQuotedPrintable(body);
    }

    if (/Content-Type:\s*text\/html/i.test(raw)) {
      htmlContent = body;
    } else {
      plainText = body;
    }
  }

  if (!plainText && htmlContent) {
    plainText = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  return {
    text_body: plainText || '(No readable message body)',
    html_body: htmlContent || ''
  };
}

function formatLocationTitle(slug) {
  if (!slug) return 'India';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function handleRobotsRequest() {
  const robots = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dealer-portal\n\nSitemap: https://${BASE_DOMAIN}/sitemap.xml\n`;
  return new Response(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

// ============================================================================
// FIRESTORE DEALER DATA INGESTION & IN-MEMORY CACHE
// ============================================================================
let dealersGlobalCache = new Map();
let lastGlobalCacheFetch = 0;
const GLOBAL_CACHE_TTL = 60 * 1000; // 60 seconds memory cache

function getFirestoreString(field) {
  if (!field) return '';
  if (typeof field === 'string') return field.trim();
  if (field.stringValue !== undefined && field.stringValue !== null) return String(field.stringValue).trim();
  if (field.integerValue !== undefined && field.integerValue !== null) return String(field.integerValue);
  if (field.doubleValue !== undefined && field.doubleValue !== null) return String(field.doubleValue);
  return '';
}

function normalizeSlug(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\.abstracker\.in.*$/, '')
    .replace(/[\s_&]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseDealerDoc(doc) {
  if (!doc || !doc.fields) return null;
  const f = doc.fields;
  const docId = (doc.name || '').split('/').pop() || '';
  const websiteSlug = normalizeSlug(getFirestoreString(f.websiteSlug));
  const city = getFirestoreString(f.city);
  const state = getFirestoreString(f.state);
  const brandName = getFirestoreString(f.brandName) || getFirestoreString(f.contactName);
  const seoTitle = getFirestoreString(f.seoTitle);
  const seoDescription = getFirestoreString(f.seoDescription);
  const ogImage = getFirestoreString(f.ogImage);
  const imageUrl = getFirestoreString(f.imageUrl);
  const dealerLogoUrl = getFirestoreString(f.dealerLogoUrl);
  const heroTitle = getFirestoreString(f.heroTitle);
  const aboutText = getFirestoreString(f.aboutText);
  const cityStateName = getFirestoreString(f.cityStateName);

  // Determine best image priority: ogImage > imageUrl > dealerLogoUrl > fallback
  let chosenImage = ogImage || imageUrl || dealerLogoUrl || 'https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg';
  if (!chosenImage.startsWith('http')) {
    chosenImage = 'https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg';
  }

  const cleanDocId = normalizeSlug(docId);
  const cleanCity = normalizeSlug(city);
  const cleanState = normalizeSlug(state);
  const prettyLocation = city || state || cityStateName || cleanDocId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const finalTitle = seoTitle || (heroTitle ? `${heroTitle} | AbsTracker` : `${brandName || prettyLocation} AIS-140 GPS Tracker & VLTD Dealer | AbsTracker`);
  const finalDesc = seoDescription || (aboutText ? (aboutText.length > 160 ? aboutText.slice(0, 157) + '...' : aboutText) : `Authorized AIS-140 GPS and VLTD device partner in ${prettyLocation}. Government approved AIS 140 tracking solutions, SOS panic button, and RTO vehicle compliance.`);

  return {
    docId: cleanDocId,
    websiteSlug,
    city: cleanCity,
    state: cleanState,
    cityName: city,
    stateName: state,
    brandName: brandName || prettyLocation,
    seoTitle: finalTitle,
    seoDescription: finalDesc,
    ogImage: chosenImage,
    hasCustomSeo: !!(seoTitle || seoDescription || ogImage),
    raw: {
      seoTitle,
      seoDescription,
      ogImage,
      imageUrl,
      dealerLogoUrl,
      brandName,
      city,
      state,
      websiteSlug
    }
  };
}

async function fetchAllDealersFromFirestore() {
  const endpoints = [
    `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/dealers?pageSize=500`,
    `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/dealers?pageSize=500&key=${FIREBASE_API_KEY}`
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        headers: {
          'Accept': 'application/json',
          'Referer': `https://${BASE_DOMAIN}/`,
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.documents)) {
          const newCache = new Map();
          for (const doc of data.documents) {
            const parsed = parseDealerDoc(doc);
            if (parsed) {
              if (parsed.docId) newCache.set(parsed.docId, parsed);
              if (parsed.websiteSlug) newCache.set(parsed.websiteSlug, parsed);
              if (parsed.city) newCache.set(parsed.city, parsed);
              if (parsed.state) newCache.set(parsed.state, parsed);
            }
          }
          dealersGlobalCache = newCache;
          lastGlobalCacheFetch = Date.now();
          return newCache;
        }
      }
    } catch (err) {
      console.warn('Firestore bulk dealer fetch error:', err);
    }
  }
  return dealersGlobalCache;
}

async function fetchDealerSEO(slug) {
  if (!slug) return null;
  const cleanSlug = normalizeSlug(slug);
  if (!cleanSlug) return null;

  const now = Date.now();
  // Check memory cache first
  if (dealersGlobalCache.has(cleanSlug) && (now - lastGlobalCacheFetch < GLOBAL_CACHE_TTL)) {
    return dealersGlobalCache.get(cleanSlug);
  }

  // Refresh cache if stale or empty
  if (dealersGlobalCache.size === 0 || (now - lastGlobalCacheFetch >= GLOBAL_CACHE_TTL)) {
    await fetchAllDealersFromFirestore();
    if (dealersGlobalCache.has(cleanSlug)) {
      return dealersGlobalCache.get(cleanSlug);
    }
  }

  // Fallback: Direct single doc fetch by exact ID
  const directEndpoints = [
    `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/dealers/${encodeURIComponent(cleanSlug)}`,
    `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/dealers/${encodeURIComponent(cleanSlug)}?key=${FIREBASE_API_KEY}`
  ];

  for (const ep of directEndpoints) {
    try {
      const res = await fetch(ep, {
        headers: {
          'Accept': 'application/json',
          'Referer': `https://${BASE_DOMAIN}/`,
          'Cache-Control': 'no-cache'
        }
      });
      if (res.ok) {
        const doc = await res.json();
        const parsed = parseDealerDoc(doc);
        if (parsed) {
          dealersGlobalCache.set(cleanSlug, parsed);
          if (parsed.docId) dealersGlobalCache.set(parsed.docId, parsed);
          if (parsed.websiteSlug) dealersGlobalCache.set(parsed.websiteSlug, parsed);
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Single doc fetch error:', err);
    }
  }

  // Dynamic fallback for unconfigured city or district
  const prettyName = cleanSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    docId: cleanSlug,
    websiteSlug: cleanSlug,
    cityName: prettyName,
    stateName: prettyName,
    brandName: `AbsTracker ${prettyName}`,
    seoTitle: `${prettyName} AIS-140 GPS Tracker & VLTD Dealer | AbsTracker`,
    seoDescription: `Authorized AIS-140 GPS and VLTD device partner in ${prettyName}. Government approved AIS 140 tracking solutions, SOS panic button, and RTO vehicle compliance.`,
    ogImage: 'https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg',
    hasCustomSeo: false
  };
}

// 1. Dynamic Auto-Generated Sitemap (Live Firestore Sync - NO www. prefix)
async function handleSitemapRequest() {
  const today = new Date().toISOString().split('T')[0];
  const urlSet = new Set();
  let urls = '';

  const addUrl = (loc, priority = '0.8', freq = 'weekly') => {
    const cleanLoc = (loc || '').trim().replace(/^https?:\/\/www\./, 'https://');
    if (!cleanLoc || urlSet.has(cleanLoc)) return;
    urlSet.add(cleanLoc);
    urls += `  <url>\n    <loc>${cleanLoc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  };

  // Core Static Pages (All under canonical https://abstracker.in)
  addUrl(`${BASE_URL}/`, '1.0', 'daily');
  addUrl(`${BASE_URL}/products`, '0.9', 'daily');
  addUrl(`${BASE_URL}/services`, '0.9', 'weekly');
  addUrl(`${BASE_URL}/services/ais-140-gps-solutions-in-india`, '0.9', 'weekly');
  addUrl(`${BASE_URL}/services/mining-gps`, '0.8', 'weekly');
  addUrl(`${BASE_URL}/services/private-gps`, '0.8', 'weekly');
  addUrl(`${BASE_URL}/dealer-network`, '0.9', 'daily');
  addUrl(`${BASE_URL}/become-dealer`, '0.8', 'weekly');
  addUrl(`${BASE_URL}/about-us`, '0.8', 'monthly');
  addUrl(`${BASE_URL}/contact`, '0.8', 'monthly');
  addUrl(`${BASE_URL}/careers`, '0.7', 'monthly');
  addUrl(`${BASE_URL}/tracking-demo`, '0.7', 'monthly');
  addUrl(`${BASE_URL}/privacy-policy`, '0.5', 'monthly');
  addUrl(`${BASE_URL}/terms-and-conditions`, '0.5', 'monthly');

  // Static Cities & Districts
  VALID_CITIES.forEach(city => {
    addUrl(`${BASE_URL}/dealer-network/${city}`, '0.8', 'weekly');
    addUrl(`${BASE_URL}/d/${city}`, '0.8', 'weekly');
    addUrl(`https://${city}.${BASE_DOMAIN}/`, '0.9', 'daily');
  });

  // Programmatic Vehicle SEO Routes
  VALID_CITIES.slice(0, 50).forEach(city => {
    VEHICLE_TYPES.forEach(vehicle => {
      addUrl(`${BASE_URL}/${city}/${vehicle}`, '0.7', 'weekly');
    });
  });

  // Dynamic Live Firestore Fetch: Dealers
  try {
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/dealers?pageSize=1000&key=${FIREBASE_API_KEY}`;
    const firestoreResponse = await fetch(firestoreUrl, {
      headers: {
        'Referer': `https://${BASE_DOMAIN}/`,
        'Cache-Control': 'no-cache'
      }
    });

    if (firestoreResponse.ok) {
      const data = await firestoreResponse.json();
      if (data && Array.isArray(data.documents)) {
        data.documents.forEach(doc => {
          const id = normalizeSlug(doc.name?.split('/').pop());
          const websiteSlug = normalizeSlug(getFirestoreString(doc.fields?.websiteSlug));
          
          if (websiteSlug) {
            addUrl(`https://${websiteSlug}.${BASE_DOMAIN}/`, '0.95', 'daily');
            addUrl(`${BASE_URL}/d/${websiteSlug}`, '0.9', 'daily');
            addUrl(`${BASE_URL}/dealer-network/${websiteSlug}`, '0.85', 'daily');
          }
          if (id) {
            addUrl(`https://${id}.${BASE_DOMAIN}/`, '0.9', 'daily');
            addUrl(`${BASE_URL}/d/${id}`, '0.85', 'daily');
            addUrl(`${BASE_URL}/dealer-network/${id}`, '0.8', 'daily');
            addUrl(`${BASE_URL}/p/${id}`, '0.7', 'weekly');
          }
        });
      }
    }
  } catch (e) {
    console.warn("Dynamic dealer sitemap fetch error:", e);
  }

  // Dynamic Live Firestore Fetch: Products
  try {
    const productsUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/products?pageSize=200&key=${FIREBASE_API_KEY}`;
    const productsResponse = await fetch(productsUrl, {
      headers: {
        'Referer': `https://${BASE_DOMAIN}/`,
        'Cache-Control': 'no-cache'
      }
    });
    if (productsResponse.ok) {
      const pData = await productsResponse.json();
      if (pData && Array.isArray(pData.documents)) {
        pData.documents.forEach(pDoc => {
          const pId = pDoc.name?.split('/').pop();
          if (pId) {
            addUrl(`${BASE_URL}/products/${pId}`, '0.8', 'weekly');
          }
        });
      }
    }
  } catch (e) {
    console.warn("Dynamic product sitemap fetch error:", e);
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}</urlset>`;
  
  return new Response(sitemapXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'X-Robots-Tag': 'all',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// 2. Gemini for SEO Generation
async function handleGenerateSEO(request, env) {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const data = await request.json();
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY in worker environment variables" }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const prompt = `You are an expert GPS tracking business copywriter.
Generate professional SEO content for a GPS tracking dealer.
Dealer Name: ${data.brandName || 'Authorized Dealer'}
Location: ${data.city || 'India'}
Business Type: ${data.dealerType || 'GPS Tracking Dealership'}

Return ONLY a valid JSON object with exactly these three keys:
- "about_us": A professional 3-paragraph about us section highlighting 100% Govt compliance, AIS-140 devices, and 24/7 support.
- "meta_title": A short (max 60 chars) SEO title.
- "meta_description": A 150-char SEO meta description including keywords like AIS-140, RTO Approved.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });
    
    const resData = await response.json();
    if (resData.error) throw new Error(resData.error.message);
    
    const jsonStr = resData.candidates?.[0]?.content?.parts?.[0]?.text;
    return new Response(jsonStr, { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
}

// 3. Gemini for Admin AI Chatbot
async function handleAIChat(request, env) {
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const data = await request.json();
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY in worker environment variables" }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    const prompt = `You are an expert GPS Tracking software and hardware assistant for AbsTracker administrators. 
Answer the following query concisely and professionally: ${data.message || 'Hello'}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    
    const resData = await response.json();
    if (resData.error) throw new Error(resData.error.message);
    
    const reply = resData.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    return new Response(JSON.stringify({ reply }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
}

// Helper to test if a request is from a crawler or social bot
function isSocialBot(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return (
    ua.includes('whatsapp') ||
    ua.includes('facebookexternalhit') ||
    ua.includes('facebot') ||
    ua.includes('twitterbot') ||
    ua.includes('telegrambot') ||
    ua.includes('linkedinbot') ||
    ua.includes('slackbot') ||
    ua.includes('discordbot') ||
    ua.includes('skypeuripreview') ||
    ua.includes('googlebot') ||
    ua.includes('bingbot') ||
    ua.includes('duckduckbot') ||
    ua.includes('baiduspider') ||
    ua.includes('yandexbot') ||
    ua.includes('applebot') ||
    ua.includes('crawler') ||
    ua.includes('spider') ||
    ua.includes('bot')
  );
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildMetaTagsHtml({ title, description, image, url, keywords }) {
  const escTitle = escapeHtml(title);
  const escDesc = escapeHtml(description);
  const escImage = escapeHtml(image);
  const escUrl = escapeHtml(url);
  const escKeywords = escapeHtml(keywords || 'AIS 140 GPS, GPS Tracker, VLTD, Fleet Management, AbsTracker, India, RTO Approved GPS');

  return `
    <title>${escTitle}</title>
    <meta name="description" content="${escDesc}" />
    <meta name="keywords" content="${escKeywords}" />
    <link rel="canonical" href="${escUrl}" />
    
    <!-- Open Graph / WhatsApp / Facebook Preview -->
    <meta property="og:site_name" content="AbsTracker" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escUrl}" />
    <meta property="og:title" content="${escTitle}" />
    <meta property="og:description" content="${escDesc}" />
    <meta property="og:image" content="${escImage}" />
    <meta property="og:image:secure_url" content="${escImage}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escTitle}" />

    <!-- Twitter Card Preview -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@abstracker" />
    <meta name="twitter:url" content="${escUrl}" />
    <meta name="twitter:title" content="${escTitle}" />
    <meta name="twitter:description" content="${escDesc}" />
    <meta name="twitter:image" content="${escImage}" />
`;
}

function cleanAndInjectMeta(html, metaSnippet) {
  // Strip any old static/placeholder SEO meta tags
  let cleaned = html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+[^>]*(?:name|property)\s*=\s*["'](?:description|keywords|og:[^"']+|twitter:[^"']+)["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+[^>]*content\s*=\s*["'][^"']*["'][^>]*(?:name|property)\s*=\s*["'](?:description|keywords|og:[^"']+|twitter:[^"']+)["'][^>]*\/?>/gi, '')
    .replace(/<link\s+[^>]*rel\s*=\s*["']canonical["'][^>]*\/?>/gi, '');

  if (cleaned.includes('<head>')) {
    return cleaned.replace('<head>', '<head>' + metaSnippet);
  } else if (cleaned.includes('<head ')) {
    return cleaned.replace(/<head[^>]*>/i, match => match + metaSnippet);
  } else {
    return metaSnippet + cleaned;
  }
}

export default {
  // =========================================================================
  // 1. INCOMING MAIL EVENT HANDLER (Cloudflare Email Routing to D1)
  // =========================================================================
  async email(message, env, ctx) {
    try {
      const sender = message.from || 'Unknown Sender';
      const recipient = message.to || 'Unknown Recipient';
      const subject = message.headers.get('subject') || '(No Subject)';

      let rawStream = '';
      try {
        rawStream = await new Response(message.raw).text();
      } catch (readErr) {
        rawStream = 'Error reading raw stream: ' + readErr.message;
      }

      const { text_body, html_body } = parseMimeEmail(rawStream);

      if (env.DB) {
        await env.DB.prepare(
          `INSERT INTO emails (sender, recipient, subject, text_body, html_body) VALUES (?, ?, ?, ?, ?)`
        )
        .bind(sender, recipient, subject, text_body, html_body)
        .run();
      }
    } catch (err) {
      console.error('Email routing error:', err);
    }
  },

  // =========================================================================
  // 2. HTTP FETCH HANDLER
  // =========================================================================
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const hostname = url.hostname.toLowerCase();
      const userAgent = request.headers.get('user-agent') || '';

      // Top-level CORS Preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      // SITEMAP.XML (Canonical at https://abstracker.in/sitemap.xml)
      if (url.pathname === '/sitemap.xml') {
        return await handleSitemapRequest();
      }

      // ROBOTS.TXT
      if (url.pathname === '/robots.txt') {
        return handleRobotsRequest();
      }

      // SEND EMAIL VIA RESEND API
      if (url.pathname === '/api/send' && request.method === 'POST') {
        try {
          const { to, subject, htmlBody, from } = await request.json();
          const resendKey = env.RESEND_API_KEY; 
          
          if (!resendKey) {
            return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY in environment" }), { 
              status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
          }

          const allowedSenders = ['help@abstracker.in', 'info@abstracker.in', 'no-reply@abstracker.in'];
          let sender = "AbsTracker <help@abstracker.in>";
          if (from) {
             const emailMatch = from.match(/<([^>]+)>/);
             const rawEmail = emailMatch ? emailMatch[1] : from;
             if (allowedSenders.includes(rawEmail)) {
                 sender = from;
             }
          }

          const resendRequest = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: sender,
              to: to,
              subject: subject,
              html: htmlBody || "<p></p>"
            })
          });

          const data = await resendRequest.json();
          
          if (!resendRequest.ok) {
             return new Response(JSON.stringify({ error: data }), { 
               status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
             });
          }

          return new Response(JSON.stringify({ success: true, data: data }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });

        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), { 
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }
      }

      // WEBMAIL API: /api/emails
      if (url.pathname === '/api/emails') {
        if (!env.DB) {
          return new Response(JSON.stringify({ 
            error: "D1 Database binding 'DB' not configured in worker settings." 
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        if (request.method === 'GET') {
          try {
            const limit = parseInt(url.searchParams.get('limit') || '50');
            const search = url.searchParams.get('q');

            let query = 'SELECT * FROM emails ORDER BY received_at DESC LIMIT ?';
            let params = [limit];

            if (search) {
              query = `SELECT * FROM emails WHERE sender LIKE ? OR recipient LIKE ? OR subject LIKE ? OR text_body LIKE ? ORDER BY received_at DESC LIMIT ?`;
              const term = `%${search}%`;
              params = [term, term, term, term, limit];
            }

            const { results } = await env.DB.prepare(query).bind(...params).all();

            return new Response(JSON.stringify(results || []), {
              status: 200,
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, no-cache, must-revalidate'
              }
            });
          } catch (dbErr) {
            return new Response(JSON.stringify({ error: "Database query failed: " + dbErr.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }

        if (request.method === 'DELETE') {
          try {
            const id = url.searchParams.get('id');
            if (!id) throw new Error("Missing 'id' parameter in URL");

            await env.DB.prepare('DELETE FROM emails WHERE id = ?').bind(id).run();
            return new Response(JSON.stringify({ success: true, message: `Email ${id} deleted` }), {
              status: 200,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          } catch (delErr) {
            return new Response(JSON.stringify({ error: delErr.message }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          }
        }
      }

      // API: Generate SEO Content
      if (url.pathname === '/api/generate-seo') {
        return await handleGenerateSEO(request, env);
      }

      // API: AI Chatbot
      if (url.pathname === '/api/ai-chat') {
        return await handleAIChat(request, env);
      }

      // API: Groq AI Write
      if (url.pathname === '/api/ai-write' && request.method === 'POST') {
        try {
          const { prompt, systemContext } = await request.json();
          const groqKey = env?.GROQ_API_KEY; 
          if (!groqKey) {
            return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY in worker environment variables" }), { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
          }
          
          const messages = [];
          if (systemContext) messages.push({ role: "system", content: systemContext });
          messages.push({ role: "user", content: prompt });

          const aiRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${groqKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: "openai/gpt-oss-20b",
              messages: messages,
              temperature: 0.7,
              max_tokens: 1500
            })
          });

          const data = await aiRes.json();
          if (data.error) throw new Error(data.error.message);

          return new Response(JSON.stringify({ result: data.choices[0].message.content }), { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }
      }

      // API: Stock Media Search (Pexels)
      if (url.pathname === '/api/pexels' && request.method === 'GET') {
        try {
          const query = url.searchParams.get('q');
          const type = url.searchParams.get('type') || 'images';
          const pexelsKey = env?.PEXELS_API_KEY;

          if (!pexelsKey) {
            return new Response(JSON.stringify({ error: "Missing PEXELS_API_KEY in worker environment variables" }), { 
              status: 500, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            });
          }

          const endpoint = type === 'videos' 
            ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15`
            : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15`;

          const response = await fetch(endpoint, { headers: { 'Authorization': pexelsKey } });
          const data = await response.json();
          return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          });
        }
      }

      // =====================================================================
      // 3. SUBDOMAIN & DEALER URL DETECTION
      // =====================================================================
      const domainParts = hostname.split('.');
      const isSubdomain = 
        domainParts.length >= 3 && 
        domainParts[0] !== 'www' && 
        !hostname.includes('localhost') &&
        !hostname.includes('web.app') &&
        !hostname.includes('firebaseapp.com') &&
        !hostname.includes('run.app') &&
        !hostname.includes('workers.dev');

      const subdomain = isSubdomain ? domainParts[0] : null;

      // Direct bypass for webmail, qr, and console
      if (subdomain === 'webmail' || subdomain === 'qr' || subdomain === 'console') {
        return fetch(request);
      }

      const isAsset = url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|json|map|webp|avif)$/i) || url.pathname.startsWith('/assets/');
      const isAdminPortalSubdomain = subdomain === 'admin' || subdomain === 'portal';

      let dealerSlug = null;
      let dealerSeo = null;
      
      if (!url.pathname.startsWith('/api/')) {
        if (url.pathname.startsWith('/d/')) {
          dealerSlug = url.pathname.split('/d/')[1]?.split('/')[0];
        } else if (url.pathname.startsWith('/dealer-network/ais-140-gps-solution-in-')) {
          dealerSlug = url.pathname.split('/dealer-network/ais-140-gps-solution-in-')[1]?.split('/')[0];
        } else if (url.pathname.startsWith('/dealer-network/')) {
          dealerSlug = url.pathname.split('/dealer-network/')[1]?.split('/')[0];
        } else if (url.pathname.startsWith('/dealer/')) {
          dealerSlug = url.pathname.split('/dealer/')[1]?.split('/')[0];
        } else if (url.pathname.startsWith('/p/')) {
          dealerSlug = url.pathname.split('/p/')[1]?.split('/')[0];
        } else if (isSubdomain && !isAdminPortalSubdomain) {
          dealerSlug = subdomain;
        }
      }

      // Load Firestore Dealer SEO data
      if (isSubdomain && !isAdminPortalSubdomain) {
        dealerSeo = await fetchDealerSEO(subdomain);
      } else if (dealerSlug) {
        dealerSeo = await fetchDealerSEO(dealerSlug);
      }

      // Programmatic Vehicle SEO Detection
      let progCity = null;
      let progVehicle = null;
      if (!isSubdomain && !isAsset && url.pathname.match(/^\/[^/]+\/[^/]+$/)) {
        const parts = url.pathname.split('/').filter(Boolean);
        if (!['services', 'dealer-network', 'products', 'track', 'api', 'assets', 'admin', 'portal', 'p', 'd', 'login', 'orders', 'cart'].includes(parts[0])) {
          progCity = parts[0];
          progVehicle = parts[1];
        }
      }

      // =====================================================================
      // 4. PREPARE SEO METADATA
      // =====================================================================
      let pageTitle = null;
      let pageDesc = null;
      let pageImage = 'https://ik.imagekit.io/xgxpgvop9/images%20(15).jpeg';
      let pageUrl = isSubdomain ? `https://${subdomain}.${BASE_DOMAIN}${url.pathname}` : `https://${BASE_DOMAIN}${url.pathname}`;

      if (dealerSeo) {
        pageTitle = dealerSeo.seoTitle;
        pageDesc = dealerSeo.seoDescription;
        pageImage = dealerSeo.ogImage || pageImage;
      } else if (progCity && progVehicle) {
        const formattedCity = progCity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const formattedVehicle = progVehicle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        pageTitle = `AIS-140 GPS Tracker for ${formattedVehicle} in ${formattedCity} | RTO Approved`;
        pageDesc = `Get RTO approved AIS-140 GPS tracker for your ${formattedVehicle} in ${formattedCity}. Certified VLTD devices with panic button, same-day installation.`;
      } else if (isAdminPortalSubdomain) {
        pageTitle = `AbsTracker Portal - Admin & Dealer Management`;
        pageDesc = `Secure central administration portal for AbsTracker GPS fleet tracking network and authorized dealers.`;
      }

      // =====================================================================
      // 5. SOCIAL MEDIA BOT / CRAWLER INSTANT SSR RESPONSE
      // =====================================================================
      const isBot = isSocialBot(userAgent);
      if (isBot && !isAsset && request.method === 'GET' && pageTitle && pageDesc) {
        const metaSnippet = buildMetaTagsHtml({
          title: pageTitle,
          description: pageDesc,
          image: pageImage,
          url: pageUrl
        });

        const botHtml = `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
${metaSnippet}
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px 20px; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
    <img src="${escapeHtml(pageImage)}" alt="${escapeHtml(pageTitle)}" style="max-width: 100%; border-radius: 12px; margin-bottom: 20px; max-height: 280px; object-fit: cover;" />
    <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; line-height: 1.3;">${escapeHtml(pageTitle)}</h1>
    <p style="font-size: 15px; color: #475569; line-height: 1.6; margin-bottom: 24px;">${escapeHtml(pageDesc)}</p>
    <a href="${escapeHtml(pageUrl)}" style="display: inline-block; background: #dc2626; color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: 700; text-decoration: none;">View Official Dealer Page</a>
  </div>
</body>
</html>`;

        return new Response(botHtml, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=UTF-8',
            'Cache-Control': 'public, max-age=300',
            'X-Robots-Tag': 'all'
          }
        });
      }

      // =====================================================================
      // 6. FETCH ASSETS / PROXY TO STATIC SPA
      // =====================================================================
      let response;
      if (env && env.ASSETS) {
        let targetUrl = new URL(request.url);
        
        // For admin subdomain or portal, route to admin.html
        if (isAdminPortalSubdomain && !isAsset && !url.pathname.startsWith('/api/')) {
          targetUrl.pathname = '/admin.html';
        }
        
        response = await env.ASSETS.fetch(new Request(targetUrl.toString(), request));
        
        // Fallback to index.html if asset or admin.html not directly returned
        if (!response.ok && isAdminPortalSubdomain && !isAsset) {
          targetUrl.pathname = '/index.html';
          response = await env.ASSETS.fetch(new Request(targetUrl.toString(), request));
        }
      } else {
        const proxyUrl = new URL(request.url);
        proxyUrl.hostname = BASE_DOMAIN;
        
        if (isAdminPortalSubdomain && !isAsset && !url.pathname.startsWith('/api/')) {
          proxyUrl.pathname = '/admin.html';
        }
        
        const proxyHeaders = new Headers(request.headers);
        proxyHeaders.set('Host', BASE_DOMAIN);
        const proxyRequest = new Request(proxyUrl.toString(), {
          method: request.method,
          headers: proxyHeaders,
          body: request.body,
          redirect: 'follow'
        });
        
        response = await fetch(proxyRequest);
        
        if (!response.ok && isAdminPortalSubdomain && !isAsset) {
          proxyUrl.pathname = '/index.html';
          const fallbackReq = new Request(proxyUrl.toString(), {
            method: request.method,
            headers: proxyHeaders,
            body: request.body,
            redirect: 'follow'
          });
          response = await fetch(fallbackReq);
        }
      }

      // =====================================================================
      // 7. SSR META TAG INJECTION FOR STANDARD HTML RESPONSES
      // =====================================================================
      if (request.method === 'GET' && response && response.ok) {
        const contentType = response.headers.get('content-type') || '';
        
        if (contentType.includes('text/html')) {
          const newHeaders = new Headers(response.headers);
          newHeaders.set('Cache-Control', 'no-cache, no-store, must-revalidate');
          newHeaders.set('Pragma', 'no-cache');
          newHeaders.set('Expires', '0');

          if (pageTitle && pageDesc) {
            let html = await response.text();
            const metaSnippet = buildMetaTagsHtml({
              title: pageTitle,
              description: pageDesc,
              image: pageImage,
              url: pageUrl
            });

            html = cleanAndInjectMeta(html, metaSnippet);
            
            return new Response(html, {
              status: response.status,
              statusText: response.statusText,
              headers: {
                ...Object.fromEntries(newHeaders),
                'Content-Type': 'text/html; charset=UTF-8'
              }
            });
          }

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders
          });
        }
      }

      return response;
    } catch (err) {
      console.error('Worker runtime error:', err);
      return new Response("Internal Server Error: " + err.message, { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
