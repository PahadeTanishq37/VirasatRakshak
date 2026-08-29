// Heritage Site Service - Data Layer for Heritage Sites

const HERITAGE_DATASET = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    slug: 'taj-mahal',
    state: 'Uttar Pradesh',
    region: 'north',
    category: 'monument',
    icon: '🕌',
    description: 'An ivory-white marble mausoleum on the right bank of the river Yamuna in Agra, commissioned by Shah Jahan.',
    latitude: 27.1751,
    longitude: 78.0421,
    rating: 4.9,
    historicalPeriod: 'Mughal Architecture (1632–1653 AD)',
    highlights: ['UNESCO World Heritage', 'Seven Wonders of the World', 'Marble Inlay Art']
  },
  {
    id: 'hampi',
    name: 'Hampi',
    slug: 'hampi',
    state: 'Karnataka',
    region: 'south',
    category: 'monument',
    icon: '🏛️',
    description: 'Capital of the Vijayanagara Empire located in Karnataka, famous for its stone chariot and Virupaksha Temple.',
    latitude: 15.3350,
    longitude: 76.4600,
    rating: 4.8,
    historicalPeriod: 'Vijayanagara Empire (14th–16th Century)',
    highlights: ['Stone Chariot', 'Musical Pillars', 'Dravidian Architecture']
  },
  {
    id: 'varanasi-ghats',
    name: 'Varanasi Ghats',
    slug: 'varanasi-ghats',
    state: 'Uttar Pradesh',
    region: 'north',
    category: 'heritage',
    icon: '🪔',
    description: 'Riverfront steps leading to the banks of the sacred Ganges River, ancient spiritual capital of India.',
    latitude: 25.3176,
    longitude: 82.9739,
    rating: 4.9,
    historicalPeriod: 'Ancient Era (Vedic Times to Present)',
    highlights: ['Ganga Aarti', 'Ancient Ghats', 'Spiritual Heritage']
  },
  {
    id: 'ajanta-ellora',
    name: 'Ajanta & Ellora Caves',
    slug: 'ajanta-ellora',
    state: 'Maharashtra',
    region: 'west',
    category: 'monument',
    icon: '🗿',
    description: 'Ancient rock-cut cave monuments featuring Buddhist, Hindu, and Jain cave temples and sculptures.',
    latitude: 20.5519,
    longitude: 75.7033,
    rating: 4.8,
    historicalPeriod: '2nd Century BCE to 10th Century CE',
    highlights: ['Kailasha Temple monolith', 'Ancient Fresco Paintings', 'Rock-Cut Architecture']
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    slug: 'konark-sun-temple',
    state: 'Odisha',
    region: 'east',
    category: 'monument',
    icon: '☀️',
    description: '13th-century CE Sun Temple shaped as a colossal stone chariot with 24 elaborately carved wheels.',
    latitude: 19.8876,
    longitude: 86.0945,
    rating: 4.8,
    historicalPeriod: 'Eastern Ganga Dynasty (1250 AD)',
    highlights: ['Chariot Wheels Sundial', 'Kalinga Architecture', 'Erotic Sculptures']
  },
  {
    id: 'khajuraho-temples',
    name: 'Khajuraho Temples',
    slug: 'khajuraho-temples',
    state: 'Madhya Pradesh',
    region: 'north',
    category: 'monument',
    icon: '🛕',
    description: 'Group of Hindu and Jain temples famous for Nagara-style architectural symbolism and intricate sculptures.',
    latitude: 24.8318,
    longitude: 79.9199,
    rating: 4.7,
    historicalPeriod: 'Chandela Dynasty (950–1050 AD)',
    highlights: ['Nagara Temple Architecture', 'Kandariya Mahadeva', 'UNESCO Site']
  },
  {
    id: 'mahabalipuram',
    name: 'Mahabalipuram',
    slug: 'mahabalipuram',
    state: 'Tamil Nadu',
    region: 'south',
    category: 'monument',
    icon: '🏛️',
    description: 'Historic coastal town known for its 7th and 8th-century Pallava dynasty monuments and Shore Temple.',
    latitude: 12.6269,
    longitude: 80.1927,
    rating: 4.7,
    historicalPeriod: 'Pallava Kingdom (7th Century AD)',
    highlights: ['Shore Temple', 'Pancha Rathas', 'Arjunas Penance']
  },
  {
    id: 'qutub-minar',
    name: 'Qutub Minar',
    slug: 'qutub-minar',
    state: 'Delhi',
    region: 'north',
    category: 'monument',
    icon: '🗼',
    description: '73-metre tall minaret of red sandstone, built by Qutb-ud-din Aibak and Iltutmish.',
    latitude: 28.5245,
    longitude: 77.1855,
    rating: 4.6,
    historicalPeriod: 'Delhi Sultanate (1192 AD)',
    highlights: ['Iron Pillar of Delhi', 'Indo-Islamic Architecture', 'Minaret Tower']
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans',
    slug: 'sundarbans',
    state: 'West Bengal',
    region: 'east',
    category: 'nature',
    icon: '🌿',
    description: 'Mangrove area in the delta formed by the confluence of Ganges, Brahmaputra and Meghna Rivers.',
    latitude: 21.9497,
    longitude: 89.1833,
    rating: 4.7,
    historicalPeriod: 'Natural Biosphere Reserve',
    highlights: ['Royal Bengal Tiger', 'Mangrove Forest', 'UNESCO Natural World Heritage']
  },
  {
    id: 'amritsar-golden-temple',
    name: 'Amritsar Golden Temple',
    slug: 'amritsar-golden-temple',
    state: 'Punjab',
    region: 'north',
    category: 'heritage',
    icon: '✨',
    description: 'Sri Harmandir Sahib, the holiest Gurdwara of Sikhism surrounded by the Amrit Sarovar holy pool.',
    latitude: 31.6200,
    longitude: 74.8765,
    rating: 4.9,
    historicalPeriod: 'Founded by Guru Ram Das (1577 AD)',
    highlights: ['Golden Dome', 'Langar World Kitchen', 'Holy Amrit Sarovar']
  }
];

export const HeritageService = {
  getAll: (query = {}) => {
    let result = [...HERITAGE_DATASET];

    if (query.region && query.region !== 'all') {
      result = result.filter(site => site.region.toLowerCase() === query.region.toLowerCase());
    }

    if (query.category && query.category !== 'all') {
      result = result.filter(site => site.category.toLowerCase() === query.category.toLowerCase());
    }

    if (query.state) {
      result = result.filter(site => site.state.toLowerCase() === query.state.toLowerCase());
    }

    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter(site => 
        site.name.toLowerCase().includes(q) ||
        site.state.toLowerCase().includes(q) ||
        site.description.toLowerCase().includes(q)
      );
    }

    return result;
  },

  getById: (idOrSlug) => {
    return HERITAGE_DATASET.find(
      site => site.id === idOrSlug || site.slug === idOrSlug
    ) || null;
  }
};
