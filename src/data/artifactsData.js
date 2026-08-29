export const HERITAGE_ARTIFACTS = [
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple Wheel',
    location: 'Konark, Odisha',
    state: 'Odisha',
    era: '13th Century CE (Eastern Ganga Dynasty)',
    category: 'Temple Architecture',
    shortDescription: 'Monolithic carved stone wheel from the legendary Sun Chariot Temple of Konark.',
    description: 'The Konark Sun Temple is designed in the shape of a colossal chariot dedicated to the Sun God Surya. It features 24 intricately carved stone wheels drawn by seven horses. Each wheel acts as a sundial that can calculate time precisely down to the minute.',
    history: 'Built by King Narasimhadeva I of the Eastern Ganga Dynasty around 1250 CE, this UNESCO World Heritage site represents the pinnacle of Kalinga architectural grandeur.',
    modelPath: '/models/heritage/konark-wheel.glb',
    proceduralType: 'temple-wheel',
    cameraConfig: { position: [0, 1.5, 4.5], fov: 45 },
    colorPalette: { primary: '#d97706', secondary: '#92400e', accent: '#fbbf24', ground: '#451a03' },
    highlights: [
      'Functioned as an accurate sundial using shadow alignment',
      'Intricate carvings of dancers, musicians, and floral motifs',
      'Constructed from khondalite stone without mortar',
      'Symbolizes the 24 hours of the day and 12 months'
    ]
  },
  {
    id: 'ashoka-pillar',
    name: 'Lion Capital of Ashoka',
    location: 'Sarnath, Uttar Pradesh',
    state: 'Uttar Pradesh',
    era: '3rd Century BCE (Mauryan Empire)',
    category: 'Sculpture & Emblem',
    shortDescription: 'The iconic polished sandstone pillar capital featuring four Asiatic lions, the official Emblem of India.',
    description: 'Carved from a single block of polished Chunar sandstone, the capital depicts four lions standing back to back on an abacus decorated with a wheel (Dharmachakra), a bull, a horse, an elephant, and a lion, all resting on a bell-shaped inverted lotus.',
    history: 'Commissioned by Emperor Ashoka the Great around 250 BCE to mark the location where Lord Buddha gave his first sermon at Sarnath.',
    modelPath: '/models/heritage/ashoka-pillar.glb',
    proceduralType: 'lion-capital',
    cameraConfig: { position: [0, 2.2, 4.8], fov: 45 },
    colorPalette: { primary: '#ca8a04', secondary: '#854d0e', accent: '#fef08a', ground: '#292524' },
    highlights: [
      'Official National Emblem of India',
      'Features 24-spoked Ashoka Chakra depicted on the Indian flag',
      'Exquisite Mauryan high polish technique surviving over 2,200 years',
      'Symbolizes courage, power, peace, and truth'
    ]
  },
  {
    id: 'taj-mahal-dome',
    name: 'Taj Mahal Central Dome',
    location: 'Agra, Uttar Pradesh',
    state: 'Uttar Pradesh',
    era: '17th Century CE (Mughal Empire)',
    category: 'Royal Monument',
    shortDescription: 'The legendary onion-shaped white marble double dome of the Taj Mahal.',
    description: 'The central white marble dome of the Taj Mahal is often called an "onion dome" or guava dome due to its distinctive shape. It reaches a height of nearly 35 meters and is surmounted by a lotus motif and a brass finial combining Islamic and Hindu decorative elements.',
    history: 'Built between 1631 and 1648 CE by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal.',
    modelPath: '/models/heritage/taj-mahal-dome.glb',
    proceduralType: 'taj-dome',
    cameraConfig: { position: [0, 2.0, 5.5], fov: 45 },
    colorPalette: { primary: '#f8fafc', secondary: '#cbd5e1', accent: '#0284c7', ground: '#1e293b' },
    highlights: [
      'Double-dome architecture for impressive internal and external acoustic proportions',
      'Makrana white marble inlaid with semi-precious stones (Pietra Dura)',
      'Changes visual hue according to daylight (pinkish at dawn, milky white at noon, golden at night)',
      'Flanked by four symmetrical octagonal chhatris'
    ]
  },
  {
    id: 'hampi-chariot',
    name: 'Hampi Stone Chariot',
    location: 'Hampi, Karnataka',
    state: 'Karnataka',
    era: '16th Century CE (Vijayanagara Empire)',
    category: 'Temple Shrine',
    shortDescription: 'Monolithic carved granite chariot shrine inside the Vittala Temple complex.',
    description: 'One of the three famous stone chariots of India, this ornate shrine is dedicated to Garuda, the vahana of Lord Vishnu. The chariot features stone wheels decorated with floral spokes that were originally capable of being rotated.',
    history: 'Built during the reign of King Krishnadevaraya of the Vijayanagara Empire in the early 16th century.',
    modelPath: '/models/heritage/hampi-chariot.glb',
    proceduralType: 'stone-chariot',
    cameraConfig: { position: [0, 1.8, 5.0], fov: 45 },
    colorPalette: { primary: '#ea580c', secondary: '#9a3412', accent: '#fde047', ground: '#3f2c20' },
    highlights: [
      'Carved from giant granite slabs with seamless joints',
      'Flanked by two stone elephants guarding the entrance',
      'Depicted on the ₹50 currency note of India',
      'Masterpiece of Dravidian Vijayanagara architecture'
    ]
  },
  {
    id: 'sanchi-stupa',
    name: 'Great Stupa of Sanchi',
    location: 'Sanchi, Madhya Pradesh',
    state: 'Madhya Pradesh',
    era: '3rd Century BCE to 1st Century CE',
    category: 'Buddhist Architecture',
    shortDescription: 'Hemispherical brick and stone dome with ornate carved ceremonial gateways (Toranas).',
    description: 'The Great Stupa at Sanchi is the oldest stone structure in India. It consists of a large hemispherical dome housing relics of the Buddha, crowned by a Harmika and Chhatra umbrella structure, surrounded by a stone circumambulatory path and four carved Toranas.',
    history: 'Originally commissioned by Emperor Ashoka in the 3rd century BCE and expanded during the Shunga and Satavahana dynasties.',
    modelPath: '/models/heritage/sanchi-stupa.glb',
    proceduralType: 'stupa',
    cameraConfig: { position: [0, 1.8, 5.2], fov: 45 },
    colorPalette: { primary: '#16a34a', secondary: '#15803d', accent: '#facc15', ground: '#14532d' },
    highlights: [
      'UNESCO World Heritage Site and oldest stone Buddhist monument in India',
      'Four Torana gateways carved with Jataka stories and life events of Buddha',
      'Triple-tiered Chhatra umbrella symbolizing the Three Jewels of Buddhism (Buddha, Dharma, Sangha)',
      'Includes ancient Brahmi inscriptions'
    ]
  },
  {
    id: 'nataraja-sculpture',
    name: 'Nataraja Cosmic Dancer',
    location: 'Chidambaram, Tamil Nadu',
    state: 'Tamil Nadu',
    era: '10th Century CE (Chola Dynasty)',
    category: 'Bronze Sculpture',
    shortDescription: 'Lost-wax cast bronze sculpture of Lord Shiva performing the Ananda Tandava dance of creation and destruction.',
    description: 'The Chola bronze Nataraja represents Shiva dancing within a flaming halo of cosmos (Prabhamandala). He holds the damaru drum of creation in his upper right hand and Agni fire of destruction in his upper left, trampling Apasmara the demon of ignorance.',
    history: 'Mastered by Chola artisans in Tamil Nadu during the 10th-11th centuries CE using the ancient cire-perdue (lost-wax) casting process.',
    modelPath: '/models/heritage/nataraja-sculpture.glb',
    proceduralType: 'bronze-sculpture',
    cameraConfig: { position: [0, 1.6, 4.2], fov: 45 },
    colorPalette: { primary: '#b45309', secondary: '#78350f', accent: '#f59e0b', ground: '#1c1917' },
    highlights: [
      'World-famous iconography praised by astrophysicists for portraying cosmic cycles of creation and dissolution',
      'Panchaloha alloy composition (gold, silver, copper, zinc, iron)',
      'Dynamic balance of stillness and rhythmic movement',
      'Exquisite Chola lost-wax casting technique'
    ]
  }
];

export const ARTIFACT_CATEGORIES = [
  'All Categories',
  'Temple Architecture',
  'Sculpture & Emblem',
  'Royal Monument',
  'Temple Shrine',
  'Buddhist Architecture',
  'Bronze Sculpture'
];
