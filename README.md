# VirasatRakshak - Digital Bharat HeritageVerse 🇮🇳

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**VirasatRakshak (Digital Bharat HeritageVerse)** is an immersive, feature-rich web platform designed to preserve, celebrate, and explore India's rich cultural heritage through state-of-the-art interactive digital experiences, AI storytelling, 3D/political map visualizers, AR try-ons, artisan marketplaces, gamified quests, and curated cultural travel packages.

---

## ✨ Features

### 🏠 1. Interactive Home Hub (`HomePage.jsx`)
- **Cultural Hero Banner:** Animated cultural motifs, mandalas, and glowing gradient effects.
- **Feature Showcase:** Quick access cards with smooth hover micro-animations leading to core modules.
- **Multilingual Support:** Instant language switching across English, Hindi, Marathi, and Tamil.

### 🗺️ 2. Heritage Map & Search (`MapPage.jsx`)
- **Global & Regional Search:** Instant search bar covering Indian states, monuments, and heritage landmarks.
- **Interactive Political Map:** Visual representation of Indian states with regional categorization (North, West, East, South).
- **Regional Deep-Dive:** Direct navigation to region-specific heritage hubs (`/region/:region`).

### 🏞️ 3. Regional States Exploration (`RegionalStatesPage.jsx`)
- **State Cards & SVG Shapes:** Comprehensive guide to all Indian states, capital cities, population, and land area.
- **Cultural Identity:** Details on local festivals, traditional art forms, famous monuments, and historical heritage tags.
- **Interactive State Modals:** High-resolution photography, state vector shapes, and comprehensive cultural breakdowns.

### 🧳 4. Packaged Cultural Tours (`PackagesPage.jsx` & `PackageDestinationPage.jsx`)
- **Curated Travel Packages:** End-to-end spiritual and heritage tour itineraries (e.g., *Spiritual Shirdi Getaway*, *Shirdi + Shani Shingnapur Darshan*).
- **Dynamic Search & Filters:** Search packages by starting city, destination, travel dates, price tier, and stay preferences.
- **Customizable Itineraries:** Customize stay types (Standard, Deluxe, Luxury), vehicle preferences (Sedan, SUV), and cultural add-ons.
- **Interactive Day Timelines:** Hour-by-hour itinerary breakdowns with detailed timeline modals.
- **Offline Pack & PDF Download:** Offline caching integration via Web Cache API and print-friendly PDF itinerary export.

### 📚 5. AI-Powered Storytelling (`StoryPage.jsx`)
- **Generative Heritage Narratives:** AI storytelling powered by Google Generative AI (`@google/generative-ai`).
- **Interactive Audio Narration:** Voice playback controls, chapter navigation, and thematic illustrations.

### 🎮 6. Gamified Heritage Quests (`GamesPage.jsx`)
- **Cultural Trivia & Quests:** Interactive mini-games testing knowledge of Indian history, monuments, and art.
- **Gamification Engine:** Real-time XP points, coin rewards, level progression, and badge achievements.

### 📱 7. Augmented Reality Experience (`ARPage.jsx`, `AROverlay.jsx`, `FaceFilter.jsx`)
- **Face Filter Try-On:** Real-time face detection using `face-api.js` for traditional headwear, jewelry, and attire.
- **3D Artifact Placement:** 3D monument and artifact rendering powered by `Three.js`.

### 🛍️ 8. Artisan Marketplace (`MarketplacePage.jsx`)
- **Authentic Handicrafts:** Direct showcase for traditional Indian craftspeople, textiles, pottery, and sculptures.
- **Interactive Shopping:** Product filters, detailed view modals, artisan profiles, and shopping cart management.

### 👥 9. Community Hub (`CommunityPage.jsx`)
- **Cultural Discussion:** Community posts, user story submissions, and engagement platform for heritage enthusiasts.

---

## 🎨 Design System & Aesthetics

- **Vibrant Indian Color Palette:**
  - 🟠 **Saffron**: `#f97316` / `#E76F2A` (Sacred festival & flag color)
  - 🔵 **Peacock Blue**: `#0ea5e9` (Inspired by India's national bird)
  - 🟡 **Marigold Yellow**: `#facc15` (Traditional festival flower color)
  - 👑 **Heritage Gold**: `#FFD700` (Royal luxury and monuments)
  - 🟣 **Royal Purple**: `#4B0082` (Regal elegance)
- **Typography:** Playfair Display (Headings), Inter (Body UI), and Noto Sans Devanagari (Hindi/Regional Text).
- **UI Architecture:** Glassmorphism, smooth Framer Motion transitions, responsive grid systems, and flex layouts.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology / Library |
| :--- | :--- |
| **Core Framework** | React 18, Vite 4 |
| **Routing** | React Router DOM v6 |
| **Styling & Motion** | Tailwind CSS v3, Framer Motion v10 |
| **Icons** | Lucide React |
| **Mapping & 3D** | MapLibre GL, React Map GL, React Simple Maps, Three.js |
| **AI & Computer Vision** | `@google/generative-ai`, `face-api.js` |
| **Localization** | `i18next`, `react-i18next`, `i18next-browser-languagedetector` |
| **Payments** | Razorpay SDK |

---

## 📁 Project Structure

```
VirasatRakshak/
├── public/                     # Static assets and images
├── server/                     # Backend server configuration & API dependencies
│   ├── package.json
│   └── package-lock.json
├── src/
│   ├── assets/                 # Brand icons and local images
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Top navigation header with language switcher
│   │   ├── Footer.jsx          # Site footer
│   │   ├── AROverlay.jsx       # AR camera & 3D control overlay
│   │   └── FaceFilter.jsx      # Face tracking & filter canvas component
│   ├── data/                   # State & regional GeoJSON/JSON data
│   │   ├── india-states.json
│   │   └── stateData.json
│   ├── pages/                  # Main application views
│   │   ├── HomePage.jsx        # Landing page & hero section
│   │   ├── MapPage.jsx         # Interactive map & site search
│   │   ├── RegionalStatesPage.jsx # State-by-state regional guide
│   │   ├── StoryPage.jsx       # AI storytelling & audio narrations
│   │   ├── GamesPage.jsx       # Gamified heritage quests & XP engine
│   │   ├── ARPage.jsx          # AR virtual try-on studio
│   │   ├── MarketplacePage.jsx # Artisan ecommerce platform
│   │   ├── CommunityPage.jsx   # Community stories & user engagement
│   │   ├── PackagesPage.jsx    # Packaged tours listing & travel search
│   │   ├── PackageDestinationPage.jsx # Tour package customization & booking
│   │   └── OfflineTourPage.jsx # Offline itinerary fallback page
│   ├── App.jsx                 # Main application routes & page transitions
│   ├── main.jsx                # Application entry point
│   ├── i18n.js                 # Multi-language translation setup
│   └── index.css               # Global CSS & Tailwind design tokens
├── index.html                  # HTML entry template
├── package.json                # Project dependencies & scripts
├── tailwind.config.js          # Tailwind theme configuration
├── postcss.config.js           # PostCSS configuration
└── vite.config.js              # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v16.0.0` or higher
- **npm**: `v8.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/VirasatRakshak.git
   cd VirasatRakshak/VirasatRakshak-main
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Launch the Development Server:**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:5173/`.

4. **Build for Production:**
   ```bash
   npm run build
   ```

5. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 🔧 Recent Updates & Bug Fixes

- **Packaged Tours Fix:** Resolved uncaught icon ReferenceError (`LocationIcon` to `MapPin`) in `PackagesPage.jsx`, fixing blank screen issues on `/packages`.
- **Default State Handling:** Initialized `selectedDestination` state to `'shirdi'` to populate tours immediately on page load.
- **Button Alignment Fix:** Updated global button utilities (`.btn-primary`, `.btn-secondary`, `.btn-accent` in `index.css`) with `inline-flex items-center justify-center gap-2 whitespace-nowrap` to prevent awkward text/icon wrapping across all viewports.
- **Production Build Verification:** Validated module transformation and bundle compilation via Vite production build.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for preserving India's Cultural Heritage 🇮🇳
