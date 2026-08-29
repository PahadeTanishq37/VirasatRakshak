import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ArrowRight, Search, X, Navigation2, Landmark, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState, useRef, useEffect } from 'react'

const HERITAGE_PLACES = [
  { name: 'Taj Mahal', state: 'Uttar Pradesh', region: 'north', type: 'monument', icon: '🕌' },
  { name: 'Hampi', state: 'Karnataka', region: 'south', type: 'monument', icon: '🏛️' },
  { name: 'Varanasi Ghats', state: 'Uttar Pradesh', region: 'north', type: 'heritage', icon: '🪔' },
  { name: 'Ajanta & Ellora Caves', state: 'Maharashtra', region: 'west', type: 'monument', icon: '🗿' },
  { name: 'Khajuraho Temples', state: 'Madhya Pradesh', region: 'north', type: 'monument', icon: '🛕' },
  { name: 'Mahabalipuram', state: 'Tamil Nadu', region: 'south', type: 'monument', icon: '🏛️' },
  { name: 'Qutub Minar', state: 'Delhi', region: 'north', type: 'monument', icon: '🗼' },
  { name: 'Konark Sun Temple', state: 'Odisha', region: 'east', type: 'monument', icon: '☀️' },
  { name: 'Sundarbans', state: 'West Bengal', region: 'east', type: 'nature', icon: '🌿' },
  { name: 'Rajasthan Forts', state: 'Rajasthan', region: 'west', type: 'monument', icon: '🏰' },
  { name: 'Mysore Palace', state: 'Karnataka', region: 'south', type: 'monument', icon: '🏯' },
  { name: 'Amritsar Golden Temple', state: 'Punjab', region: 'north', type: 'heritage', icon: '✨' },
  { name: 'Rann of Kutch', state: 'Gujarat', region: 'west', type: 'nature', icon: '🌅' },
  { name: 'Kaziranga National Park', state: 'Assam', region: 'east', type: 'nature', icon: '🦏' },
  { name: 'Kerala Backwaters', state: 'Kerala', region: 'south', type: 'nature', icon: '🌴' },
  { name: 'Ladakh Monasteries', state: 'Ladakh', region: 'north', type: 'heritage', icon: '⛰️' },
  { name: 'Puri Jagannath Temple', state: 'Odisha', region: 'east', type: 'heritage', icon: '🛕' },
  { name: 'Meenakshi Temple', state: 'Tamil Nadu', region: 'south', type: 'heritage', icon: '🛕' },
  { name: 'Chola Temples', state: 'Tamil Nadu', region: 'south', type: 'monument', icon: '🏛️' },
  { name: 'Jim Corbett National Park', state: 'Uttarakhand', region: 'north', type: 'nature', icon: '🐅' },
]

export const MapPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const searchRef = useRef(null)

  const filteredPlaces = searchQuery.length > 1
    ? HERITAGE_PLACES.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const handleSelectPlace = (place) => {
    setSelectedPlace(place)
    setSearchQuery(place.name)
    setShowSuggestions(false)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSelectedPlace(null)
    setShowSuggestions(false)
    searchRef.current?.focus()
  }

  const handleRegionClick = (region) => {
    navigate(`/region/${region}`)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-peacock-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            {t('map.title')}
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t('map.description')}
          </p>
        </motion.div>

        {/* Search on Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div
            ref={searchRef}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,248,235,0.95) 100%)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(231,111,42,0.13), 0 2px 8px rgba(0,0,0,0.07)',
              border: '1.5px solid rgba(231,111,42,0.18)',
              padding: '20px 24px',
              position: 'relative',
            }}
          >
            {/* Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #E76F2A, #F4A623)',
                borderRadius: '8px',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Navigation2 style={{ width: '16px', height: '16px', color: '#fff' }} />
              </div>
              <span style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e', letterSpacing: '0.02em' }}>
                Search on Map
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: '12px',
                color: '#E76F2A',
                background: 'rgba(231,111,42,0.08)',
                borderRadius: '99px',
                padding: '3px 10px',
                fontWeight: '600',
              }}>🇮🇳 {HERITAGE_PLACES.length} Heritage Sites</span>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                pointerEvents: 'none',
              }}>
                <Search style={{ width: '18px', height: '18px', color: '#E76F2A' }} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); setSelectedPlace(null) }}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                placeholder="Search states, monuments, heritage sites…"
                style={{
                  width: '100%',
                  paddingLeft: '44px',
                  paddingRight: searchQuery ? '44px' : '16px',
                  paddingTop: '13px',
                  paddingBottom: '13px',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(231,111,42,0.25)',
                  background: '#fff',
                  fontSize: '15px',
                  color: '#1a1a2e',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(231,111,42,0.07)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocusCapture={e => {
                  e.target.style.borderColor = '#E76F2A'
                  e.target.style.boxShadow = '0 0 0 3px rgba(231,111,42,0.12)'
                }}
                onBlurCapture={e => {
                  e.target.style.borderColor = 'rgba(231,111,42,0.25)'
                  e.target.style.boxShadow = '0 2px 8px rgba(231,111,42,0.07)'
                }}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(231,111,42,0.1)', border: 'none', borderRadius: '50%',
                    width: '26px', height: '26px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s',
                  }}
                >
                  <X style={{ width: '14px', height: '14px', color: '#E76F2A' }} />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && filteredPlaces.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: '24px',
                    right: '24px',
                    background: '#fff',
                    borderRadius: '14px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.13)',
                    border: '1px solid rgba(231,111,42,0.15)',
                    zIndex: 50,
                    overflow: 'hidden',
                    maxHeight: '280px',
                    overflowY: 'auto',
                  }}
                >
                  {filteredPlaces.map((place, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPlace(place)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '11px 16px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderBottom: idx < filteredPlaces.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(231,111,42,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: '20px' }}>{place.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a2e' }}>{place.name}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{place.state} · {place.type}</div>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '99px',
                        background: place.region === 'north' ? '#fef3c7' : place.region === 'south' ? '#d1fae5' : place.region === 'east' ? '#dbeafe' : '#fce7f3',
                        color: place.region === 'north' ? '#92400e' : place.region === 'south' ? '#065f46' : place.region === 'east' ? '#1e40af' : '#9d174d',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}>{place.region}</span>
                    </button>
                  ))}
                </motion.div>
              )}
              {showSuggestions && searchQuery.length > 1 && filteredPlaces.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: '24px',
                    right: '24px',
                    background: '#fff',
                    borderRadius: '14px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(231,111,42,0.12)',
                    zIndex: 50,
                    padding: '20px',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '14px',
                  }}
                >
                  No heritage sites found for "{searchQuery}"
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selected place result */}
            <AnimatePresence>
              {selectedPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  style={{
                    marginTop: '14px',
                    background: 'linear-gradient(135deg, rgba(231,111,42,0.08), rgba(244,166,35,0.06))',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    border: '1px solid rgba(231,111,42,0.2)',
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{selectedPlace.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#1a1a2e' }}>{selectedPlace.name}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                      📍 {selectedPlace.state} &nbsp;·&nbsp; 
                      <span style={{ textTransform: 'capitalize' }}>{selectedPlace.type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRegionClick(selectedPlace.region)}
                    style={{
                      background: 'linear-gradient(135deg, #E76F2A, #F4A623)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Landmark style={{ width: '14px', height: '14px' }} />
                    Explore Region
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Filter Tags */}
            {!selectedPlace && !searchQuery && (
              <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#9ca3af', alignSelf: 'center', marginRight: '4px' }}>Popular:</span>
                {['Taj Mahal', 'Kerala Backwaters', 'Golden Temple', 'Hampi', 'Rann of Kutch'].map(name => (
                  <button
                    key={name}
                    onClick={() => { setSearchQuery(name); setShowSuggestions(true) }}
                    style={{
                      background: 'rgba(231,111,42,0.07)',
                      border: '1px solid rgba(231,111,42,0.2)',
                      borderRadius: '99px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#E76F2A',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(231,111,42,0.15)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(231,111,42,0.07)' }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* India Political Map */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
            {/* Map Image */}
            <div className="w-full h-auto">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/India_states_and_union_territories_map.svg/1200px-India_states_and_union_territories_map.svg.png"
                alt="India States and Union Territories Map"
                className="w-full h-auto object-contain"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x600?text=India+Map+Loading...'
                }}
              />
            </div>

            {/* Map Overlay Info */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              <h3 className="font-semibold text-gray-900">{t('map.mapInfo')}</h3>
              <p className="text-sm text-gray-600">{t('map.mapSubtitle')}</p>
            </div>

            {/* Interactive Features Info */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg max-w-xs">
              <h4 className="font-semibold text-gray-900 mb-2">{t('map.exploreHeritage')}</h4>
              <p className="text-sm text-gray-600 mb-3">
                {t('map.heritageDesc')}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-saffron-100 text-saffron-700 rounded-full text-xs font-medium">
                  {t('map.festivals')}
                </span>
                <span className="px-2 py-1 bg-peacock-100 text-peacock-700 rounded-full text-xs font-medium">
                  {t('map.artForms')}
                </span>
                <span className="px-2 py-1 bg-marigold-100 text-marigold-700 rounded-full text-xs font-medium">
                  {t('map.monuments')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* State Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('map.exploreByRegion')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Northern India */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card p-6 text-center hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏔️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('map.northernIndia')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('map.northernStates')}
              </p>
              <button 
                className="btn-primary w-full mt-auto flex items-center justify-center gap-2"
                onClick={() => handleRegionClick('north')}
              >
                <span>{t('map.exploreNorth')}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </motion.div>

            {/* Western India */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card p-6 text-center hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="w-16 h-16 bg-peacock-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏜️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('map.westernIndia')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('map.westernStates')}
              </p>
              <button 
                className="btn-primary w-full mt-auto flex items-center justify-center gap-2"
                onClick={() => handleRegionClick('west')}
              >
                <span>{t('map.exploreWest')}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </motion.div>

            {/* Eastern India */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card p-6 text-center hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="w-16 h-16 bg-marigold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('map.easternIndia')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('map.easternStates')}
              </p>
              <button 
                className="btn-primary w-full mt-auto flex items-center justify-center gap-2"
                onClick={() => handleRegionClick('east')}
              >
                <span>{t('map.exploreEast')}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </motion.div>

            {/* Southern India */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="card p-6 text-center hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌴</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('map.southernIndia')}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {t('map.southernStates')}
              </p>
              <button 
                className="btn-primary w-full mt-auto flex items-center justify-center gap-2"
                onClick={() => handleRegionClick('south')}
              >
                <span>{t('map.exploreSouth')}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-saffron-500 to-peacock-500 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">{t('map.discoverHeritage')}</h2>
            <p className="text-xl text-white/90 mb-6 max-w-2xl mx-auto">
              {t('map.discoverDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-saffron-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {t('map.exploreStories')}
              </button>
              <button className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
                {t('map.playGames')}
              </button>
              <button className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors">
                {t('map.browseMarketplace')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
