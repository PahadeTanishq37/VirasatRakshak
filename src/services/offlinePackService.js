/**
 * VirasatRakshak Offline Heritage Pack Service
 * Powered by IndexedDB for structured, persistent offline storage.
 */

const DB_NAME = 'VirasatRakshakOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'offlinePacks';

function openDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
        store.createIndex('state', 'state', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Sample enriched heritage dataset for complete offline packs
const HERITAGE_PACK_DETAILS = {
  'taj-mahal': {
    historicalOverview: 'The Taj Mahal was commissioned by Shah Jahan in 1631 to honor his favorite wife, Mumtaz Mahal. Built over 22 years using white Makrana marble, over 20,000 artisans contributed to its construction.',
    culturalSignificance: 'Emblematic of eternal Mughal architecture and romantic symbolism. Recognized worldwide as a universal UNESCO World Heritage Site.',
    architectureInfo: 'Combines Persian, Islamic, and Indian architectural styles. Features symmetrical octagonal layout, four 40-metre minarets tilted slightly outward, and intricate Pietra Dura stone inlay.',
    importantFacts: [
      'Changes color throughout the day (pinkish at dawn, milky white in evening, golden under moonlight).',
      'The minarets are designed with a 2-degree outward tilt so they fall away from the main dome in an earthquake.',
      'Contains delicate calligraphy of Quranic verses inlaid with black marble.'
    ],
    travelGuide: {
      bestTime: 'October to March (Early morning sunrise view)',
      openingHours: 'Sunrise to Sunset (Closed on Fridays)',
      entryFee: '₹50 (Indian citizens), ₹1100 (Foreign tourists)',
      nearbyAttractions: ['Agra Fort', 'Mehtab Bagh', 'Itimad-ud-Daulah']
    },
    itinerary: [
      { day: 'Morning', title: 'Sunrise Darshan & Main Dome Exploration', description: 'Arrive at East Gate for early morning entry. View white marble glowing at dawn.' },
      { day: 'Afternoon', title: 'Pietra Dura Artisan Workshops & Agra Fort', description: 'Explore local marble craft workshops in Taj Ganj and visit Agra Fort nearby.' },
      { day: 'Evening', title: 'Sunset View from Mehtab Bagh', description: 'Experience the iconic view of the Taj Mahal reflected across the Yamuna River.' }
    ],
    cachedStory: {
      title: 'The Mirror of Eternity: Shah Jahan\'s Monument to Love',
      story: 'Legend speaks of Shah Jahan sitting at the octagonal tower of Agra Fort in his final years, gazing across the Yamuna River at the white marble dome built for his beloved Mumtaz Mahal...'
    }
  },
  'hampi': {
    historicalOverview: 'Hampi was the majestic capital of the Vijayanagara Empire from the 14th to 16th century. It was one of the richest and second-largest cities in the world during its golden era.',
    culturalSignificance: 'Celebrated for its monumental Dravidian temples, boulder-strewn landscape, and living Virupaksha Temple traditions.',
    architectureInfo: 'Features Dravidian temple architecture, carved monoliths, musical stone pillars, and water aqueducts.',
    importantFacts: [
      'Features the world-famous Stone Chariot inside the Vittala Temple complex.',
      'The pillars of Vittala Temple produce musical notes when tapped lightly.',
      'Spans over 4,100 hectares with over 1,600 surviving monuments.'
    ],
    travelGuide: {
      bestTime: 'November to February',
      openingHours: '6:00 AM – 6:00 PM',
      entryFee: '₹40 (Vittala Temple & Zenana Enclosure)',
      nearbyAttractions: ['Virupaksha Temple', 'Anegundi Village', 'Matanga Hill']
    },
    itinerary: [
      { day: 'Day 1', title: 'Sacred Centre & Virupaksha Temple', description: 'Explore the ancient bazaars and riverfront temples.' },
      { day: 'Day 2', title: 'Royal Centre & Vittala Stone Chariot', description: 'Visit the Stone Chariot, Elephant Stables, and Lotus Mahal.' }
    ],
    cachedStory: {
      title: 'Echoes of the Vijayanagara Realm',
      story: 'Among the granite boulders of Hampi, King Krishnadevaraya governed a realm where gems were sold on open street bazaars...'
    }
  },
  'konark-sun-temple': {
    historicalOverview: 'Built in 1250 AD by King Narasimhadeva I of the Eastern Ganga Dynasty, Konark Sun Temple is designed as a giant solar chariot.',
    culturalSignificance: 'Dedicated to Surya, the Sun God. A masterwork of Kalinga temple architecture.',
    architectureInfo: 'Carved with 24 intricate sundial wheels pulled by 7 galloping horses. The wheels function as accurate sun-dials.',
    importantFacts: [
      'The 24 wheels represent the 12 months of the Hindu calendar.',
      'Each wheel contains 8 major spokes representing the 8 prahars (3-hour periods) of the day.',
      'Historically used as a navigational landmark by sailors, known as the "Black Pagoda".'
    ],
    travelGuide: {
      bestTime: 'September to March',
      openingHours: '6:00 AM – 8:00 PM',
      entryFee: '₹40 (Indian citizens), ₹600 (Foreign tourists)',
      nearbyAttractions: ['Chandrabhaga Beach', 'Puri Jagannath Temple']
    },
    itinerary: [
      { day: 'Day 1', title: 'Sun Temple Architecture & Light Show', description: 'Explore the main Natya Mandap, Sun Dial wheels, and evening sound & light show.' }
    ],
    cachedStory: {
      title: 'The Stone Chariot of Surya',
      story: 'As dawn breaks over the Bay of Bengal, the first sunrays strike the sanctum of Konark, illuminating the magnificent 12-pair stone chariot wheels...'
    }
  }
};

export const offlinePackService = {
  // 1. Get all downloaded offline packs from IndexedDB
  getDownloadedPacks: async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = (err) => reject(err);
    });
  },

  // 2. Get a single pack by ID
  getPack: async (id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = (err) => reject(err);
    });
  },

  // 3. Check if a pack is downloaded
  isPackDownloaded: async (id) => {
    try {
      const pack = await offlinePackService.getPack(id);
      return Boolean(pack);
    } catch (e) {
      return false;
    }
  },

  // 4. Download and store an offline heritage pack
  downloadPack: async (siteData, onProgress = () => {}) => {
    const db = await openDB();
    const siteId = siteData.id || siteData.slug || siteData.name.toLowerCase().replace(/\s+/g, '-');

    onProgress(15, 'Gathering heritage site data...');
    await new Promise((r) => setTimeout(r, 200));

    onProgress(40, 'Compiling historical facts & travel guide...');
    await new Promise((r) => setTimeout(r, 250));

    const extraDetails = HERITAGE_PACK_DETAILS[siteId] || {
      historicalOverview: siteData.description || 'A monumental cultural landmark preserving ancient Indian heritage.',
      culturalSignificance: 'Holds deep historical and artistic value in Indian regional heritage.',
      architectureInfo: siteData.historicalPeriod || 'Traditional regional architecture.',
      importantFacts: [
        'Protected cultural heritage landmark.',
        'Recognized for historic architectural craftsmanship.'
      ],
      travelGuide: {
        bestTime: 'October to March',
        openingHours: '8:00 AM – 6:00 PM',
        entryFee: 'Standard entry rates apply'
      },
      itinerary: [
        { day: 'Day 1', title: 'Main Monument Exploration', description: 'Explore main heritage complex and surrounding historical highlights.' }
      ],
      cachedStory: null
    };

    onProgress(70, 'Storing offline maps & assets...');
    await new Promise((r) => setTimeout(r, 250));

    const completePack = {
      id: siteId,
      name: siteData.name,
      slug: siteData.slug || siteId,
      state: siteData.state || 'India',
      region: siteData.region || 'national',
      category: siteData.category || 'monument',
      icon: siteData.icon || '🏛️',
      description: siteData.description || extraDetails.historicalOverview,
      latitude: siteData.latitude || 20.5937,
      longitude: siteData.longitude || 78.9629,
      historicalOverview: extraDetails.historicalOverview,
      culturalSignificance: extraDetails.culturalSignificance,
      architectureInfo: extraDetails.architectureInfo,
      importantFacts: extraDetails.importantFacts,
      travelGuide: extraDetails.travelGuide,
      itinerary: extraDetails.itinerary,
      cachedStory: extraDetails.cachedStory,
      downloadedAt: new Date().toISOString(),
      version: 1,
      estimatedSize: '2.4 MB'
    };

    onProgress(90, 'Writing to IndexedDB...');

    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(completePack);

      request.onsuccess = () => resolve(true);
      request.onerror = (err) => reject(err);
    });

    onProgress(100, 'Available Offline');
    return completePack;
  },

  // 5. Update an existing pack
  updatePack: async (siteData, onProgress) => {
    return offlinePackService.downloadPack(siteData, onProgress);
  },

  // 6. Delete a downloaded pack
  deletePack: async (id) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = (err) => reject(err);
    });
  },

  // 7. Get storage estimate (usage & quota)
  getStorageUsage: async () => {
    try {
      const packs = await offlinePackService.getDownloadedPacks();
      let estimate = { usageMB: '0.0', quotaMB: '1000', packCount: packs.length };

      if (navigator.storage && navigator.storage.estimate) {
        const est = await navigator.storage.estimate();
        const usageMB = (est.usage / (1024 * 1024)).toFixed(1);
        const quotaMB = (est.quota / (1024 * 1024 * 1024)).toFixed(1);
        estimate = {
          usageMB,
          quotaMB: `${quotaMB} GB`,
          packCount: packs.length
        };
      } else {
        estimate.usageMB = (packs.length * 2.4).toFixed(1);
      }

      return estimate;
    } catch (e) {
      return { usageMB: '0.0', quotaMB: 'N/A', packCount: 0 };
    }
  }
};
