import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { MapPin, Building2, Car, Landmark, ShoppingBag, Clock, X, Plus, Search, Calendar, Users } from 'lucide-react'

const DESTINATIONS = [
  { value: 'shirdi', label: 'Shirdi', image: 'https://drive.google.com/uc?export=view&id=1yMyOSvVcuwztUv2kWgM5PwzvN0mfkxiC' }
]

const ALL_PACKAGES = [
  {
    id: 'shirdi-1',
    destination: 'shirdi',
    title: 'Spiritual Shirdi Getaway',
    stay: '3★ Hotel near Sai Baba Temple',
    travel: 'AC cab for local sightseeing',
    duration: '1N/2D',
    price: 5999,
    images: [
      'https://images.unsplash.com/photo-1602609991879-50fb5a8e90d2?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1593697820691-75bf0f9f1f3b?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop'
    ],
    spots: ['Sai Baba Temple', 'Dixit Wada Museum', 'Shani Shingnapur'],
    marketplace: 'Prasadalaya, local handicrafts',
    itinerary: [
      { day: 'Day 1', items: [
        'Visit to Shirdi Sai Baba Temple, Khandoba Mandir, Baba\'s Chavadi',
        'Visit to Shani Shingnapur'
      ] },
      { day: 'Day 2', items: [
        'Priority Darshan at Shirdi with Dedicated Panditji',
        'Visit to Khandoba Mandir, Shirdi Sai Baba Temple'
      ] }
    ],
    notes: 'Experience the serenity of Shirdi with guided temple visits.'
  },
  {
    id: 'shirdi-2',
    destination: 'shirdi',
    title: 'Shirdi + Shani Shingnapur Darshan',
    stay: 'Comfort hotel near temple precinct',
    travel: 'Cab for Shirdi and Shani Shingnapur day trip',
    duration: '2N/3D',
    price: 8999,
    images: [
      'https://images.unsplash.com/photo-1602609991879-50fb5a8e90d2?q=80&w=1600&auto=format&fit=crop'
    ],
    spots: ['Sai Baba Temple', 'Dwarkamai', 'Shani Shingnapur'],
    marketplace: 'Prasadalaya, local handicrafts',
    itinerary: [
      { day: 'Day 1', items: [
        'Visit to Shirdi Sai Baba Temple, Khandoba Mandir, Baba\'s Chavadi',
        'Visit to Shani Shingnapur'
      ] },
      { day: 'Day 2', items: [
        'Priority Darshan at Shirdi with Dedicated Panditji',
        'Visit to Khandoba Mandir, Shirdi Sai Baba Temple'
      ] },
      { day: 'Day 3', items: ['Leisure time and departure'] }
    ],
    notes: 'Balanced darshan and leisure for families.'
  },
]

export const PackagesPage = () => {
  const navigate = useNavigate()
  const [selectedDestination, setSelectedDestination] = useState('')
  const [durationFilter, setDurationFilter] = useState('all')
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [toast, setToast] = useState('')
  const [offlineSuccess, setOfflineSuccess] = useState(false)
  
  // Travel journey search states
  const [travelSearch, setTravelSearch] = useState({
    startingFrom: 'New Delhi',
    goingTo: '',
    startDate: '',
    roomsGuests: ''
  })
  const [showTravelSearch, setShowTravelSearch] = useState(false)
  const [detailedDay, setDetailedDay] = useState(null) // { day: string, events: [{time, title}] }

  // Lightweight filters (safe: derived from existing fields)
  const [priceFilter, setPriceFilter] = useState('all') // all | under7000 | between7k10k | above10k
  const [stayFilter, setStayFilter] = useState('any') // any | nearTemple | comfort
  const [includeShani, setIncludeShani] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const visiblePackages = useMemo(() => {
    if (!selectedDestination) return []
    return ALL_PACKAGES
      .filter(p => p.destination === selectedDestination)
      .filter(p => durationFilter === 'all' || p.duration === durationFilter)
      .filter(p => {
        if (priceFilter === 'under7000') return p.price < 7000
        if (priceFilter === 'between7k10k') return p.price >= 7000 && p.price <= 10000
        if (priceFilter === 'above10k') return p.price > 10000
        return true
      })
      .filter(p => {
        if (stayFilter === 'nearTemple') return p.stay.toLowerCase().includes('temple')
        if (stayFilter === 'comfort') return p.stay.toLowerCase().includes('comfort')
        return true
      })
      .filter(p => {
        if (!includeShani) return true
        return (p.spots || []).some(s => s.toLowerCase().includes('shani'))
      })
      .filter(p => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.stay.toLowerCase().includes(q) ||
          (p.spots || []).join(' ').toLowerCase().includes(q)
        )
      })
  }, [selectedDestination, durationFilter, priceFilter, stayFilter, includeShani, searchQuery])

  const basePrice = selectedPackage?.price || 0
  const totalPrice = basePrice

  const handleBook = () => {
    setShowConfirmation(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleOfflinePack = async () => {
    try {
      if (!('caches' in window)) {
        setToast('Offline cache not supported in this browser')
        return
      }
      const cache = await caches.open('heritage-pack')
      const itineraryUrl = `/offline-packages/itinerary-${selectedPackage.id}.json`
      const itineraryData = {
        id: selectedPackage.id,
        title: selectedPackage.title,
        destination: selectedPackage.destination,
        itinerary: selectedPackage.itinerary,
        spots: selectedPackage.spots
      }
      await cache.put(itineraryUrl, new Response(JSON.stringify(itineraryData), { headers: { 'Content-Type': 'application/json' } }))
      const assets = ['/tajmahal.jpg']
      await Promise.all(assets.map(a => cache.add(a)))
      setOfflineSuccess(true)
    } catch (e) {
      setToast('Failed to prepare offline pack')
      setTimeout(() => setToast(''), 3000)
    }
  }

  const handleTravelSearch = () => {
    if (!travelSearch.goingTo) {
      setToast('Please select a destination')
      setTimeout(() => setToast(''), 3000)
      return
    }
    setSelectedDestination('shirdi')
    setToast('Searching for packages...')
    setTimeout(() => setToast(''), 2000)
  }

  const handleTravelSearchChange = (field, value) => {
    setTravelSearch(prev => ({ ...prev, [field]: value }))
  }

  // Build a simple timeline with timestamps from a list of items
  const buildTimeline = (dayLabel, items) => {
    // Start at 7:00 AM, add 2 hours per item
    const events = items.map((title, idx) => {
      const base = new Date()
      base.setHours(7 + idx * 2, 0, 0, 0)
      const hours = base.getHours()
      const minutes = base.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const hr12 = ((hours + 11) % 12) + 1
      return { time: `${hr12}:${minutes} ${ampm}`, title }
    })
    setDetailedDay({ day: dayLabel, events })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - premium gradient + floating icons */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-sky-500/20 to-indigo-500/20" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/tajmahal.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        {/* floating monuments */}
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }} className="absolute top-10 left-10 text-5xl">🏛️</motion.div>
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className="absolute bottom-16 right-12 text-4xl">🕌</motion.div>
        <motion.div initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="absolute top-24 right-1/3 text-4xl">🕍</motion.div>
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-display font-bold text-gray-900"
            >
              Discover India’s Heritage Packages
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mt-4 text-xl md:text-2xl text-gray-700"
            >
              Stay • Travel • Culture • Experiences — All in one journey.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Travel Journey Search */}
      <section className="py-8 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6"
          >
            <div className="flex flex-col lg:flex-row items-end gap-4">
              {/* Starting From */}
              <div className="flex-1 w-full">
                <label className="block text-blue-400 text-sm font-medium mb-2">STARTING FROM</label>
                <div className="relative">
                  <LocationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={travelSearch.startingFrom}
                    onChange={(e) => handleTravelSearchChange('startingFrom', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter starting location"
                  />
                </div>
              </div>

              {/* Going To */}
              <div className="flex-1 w-full">
                <label className="block text-blue-400 text-sm font-medium mb-2">GOING TO</label>
                <div className="relative">
                  <LocationIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={travelSearch.goingTo}
                    onChange={(e) => handleTravelSearchChange('goingTo', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="" className="text-gray-500">Select</option>
                    <option value="shirdi" className="text-white">Shirdi</option>
                  </select>
                </div>
              </div>

              {/* Starting Date */}
              <div className="flex-1 w-full">
                <label className="block text-blue-400 text-sm font-medium mb-2">STARTING DATE</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={travelSearch.startDate}
                    onChange={(e) => handleTravelSearchChange('startDate', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Rooms & Guests */}
              <div className="flex-1 w-full">
                <label className="block text-blue-400 text-sm font-medium mb-2">ROOMS & GUESTS</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={travelSearch.roomsGuests}
                    onChange={(e) => handleTravelSearchChange('roomsGuests', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-600/50 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="" className="text-gray-500">Select</option>
                    <option value="1-room-2-guests" className="text-white">1 Room, 2 Guests</option>
                    <option value="1-room-4-guests" className="text-white">1 Room, 4 Guests</option>
                    <option value="2-rooms-4-guests" className="text-white">2 Rooms, 4 Guests</option>
                    <option value="2-rooms-6-guests" className="text-white">2 Rooms, 6 Guests</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleTravelSearch}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  SEARCH
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple Filters (safe) */}
      {selectedDestination && (
        <section className="py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="all">All</option>
                  <option value="under7000">Under ₹7,000</option>
                  <option value="between7k10k">₹7,000 - ₹10,000</option>
                  <option value="above10k">Above ₹10,000</option>
                </select>
              </div>

              {/* Stay type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stay Type</label>
                <select
                  value={stayFilter}
                  onChange={(e) => setStayFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="any">Any</option>
                  <option value="nearTemple">Near Temple</option>
                  <option value="comfort">Comfort Stay</option>
                </select>
              </div>

              {/* Shani toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Include Shani Shingnapur</label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={includeShani}
                    onChange={(e) => setIncludeShani(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  Must include Shani Shingnapur
                </label>
              </div>

              {/* Keyword */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Dwarkamai, museum, comfort"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Destination cards grid */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6"
          >
            Popular Destinations
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {DESTINATIONS.map((d, idx) => (
                <motion.button
                  key={d.value}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedDestination(d.value)
                    navigate(`/packages/${d.value}`)
                  }}
                  className={`relative rounded-xl overflow-hidden h-40 text-left group ${selectedDestination === d.value ? 'ring-2 ring-sky-500' : ''}`}
                >
                  <div className="absolute inset-0" style={{ backgroundImage: `url(${d.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:bg-black/50" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="text-white text-lg font-semibold">{d.label}</div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-500 to-sky-600 text-white text-sm shadow">Explore Packages</span>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Packages Listing */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedDestination && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-6"
            >
              Packages in {DESTINATIONS.find(d => d.value === selectedDestination)?.label}
            </motion.h2>
          )}

          {selectedDestination && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {[{v:'all',l:'All'}, {v:'1N/2D',l:'1N/2D'}, {v:'2N/3D',l:'2N/3D'}, {v:'3N/4D',l:'3N/4D'}].map(chip => (
                <button
                  key={chip.v}
                  onClick={() => setDurationFilter(chip.v)}
                  className={`px-3 py-1 rounded-full text-sm ${durationFilter===chip.v?'bg-sky-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >{chip.l}</button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {visiblePackages.map((pkg, index) => (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  className="card p-0 hover:shadow-xl cursor-pointer overflow-hidden"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {/* simple carousel */}
                  <div className="relative h-44 bg-gray-100">
                    <img src={pkg.images[0]} alt="package" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur rounded-full px-2 py-1 text-xs">1 / {pkg.images.length}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{pkg.title}</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center"><Building2 className="w-4 h-4 mr-2" /> {pkg.stay}</div>
                    <div className="flex items-center"><Car className="w-4 h-4 mr-2" /> {pkg.travel}</div>
                    <div className="flex items-center"><Landmark className="w-4 h-4 mr-2" /> {pkg.spots.slice(0,3).join(', ')}{pkg.spots.length>3 ? '…' : ''}</div>
                    <div className="flex items-center"><ShoppingBag className="w-4 h-4 mr-2" /> {pkg.marketplace}</div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-gray-900 font-bold text-lg">₹{pkg.price.toLocaleString()}</div>
                      <div className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-teal-500/20 to-sky-500/20 text-sky-700 font-medium flex items-center"><Clock className="w-3 h-3 mr-1" /> {pkg.duration}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Package Modal */}
      <AnimatePresence>
        {selectedPackage && !showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedPackage(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-display font-bold text-gray-900">{selectedPackage.title}</h3>
                  <div className="text-gray-600 flex items-center mt-1"><MapPin className="w-4 h-4 mr-1" /> {DESTINATIONS.find(d => d.value === selectedPackage.destination)?.label}</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setSelectedPackage(null)}><X className="w-6 h-6" /></button>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl h-56 bg-gradient-to-br from-sky-100 to-teal-100 flex items-center justify-center">
                  <span className="text-6xl">🏛️</span>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Itinerary</h4>
                  <div className="space-y-4">
                    {selectedPackage.itinerary.map(step => (
                      <button
                        key={step.day}
                        className="w-full text-left card p-4 hover:shadow-lg transition"
                        onClick={() => buildTimeline(step.day, step.items)}
                      >
                        <div className="font-medium text-sky-700 mb-2">{step.day}</div>
                        <ul className="list-disc ml-5 text-gray-700 space-y-1">
                          {step.items.map((it, i) => (<li key={i}>{it}</li>))}
                        </ul>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-6">{selectedPackage.notes}</div>
                
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div>
                    <span className="text-gray-600">Total Price</span>
                    <div className="text-2xl font-bold text-gray-900">₹{totalPrice.toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      className="bg-gradient-to-r from-teal-500 to-sky-600 text-white rounded-lg px-6 py-2 hover:opacity-90 active:scale-[0.99] transition" 
                      onClick={handleBook}
                    >
                      Book Now
                    </button>
                    <button 
                      className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg px-6 py-2 hover:opacity-90 active:scale-[0.99] transition" 
                      onClick={handleOfflinePack}
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Day Timeline Modal */}
      <AnimatePresence>
        {detailedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setDetailedDay(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-display font-bold text-gray-900">{detailedDay.day} - Detailed Itinerary</h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => setDetailedDay(null)}><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-3">
                {detailedDay.events.map((ev, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="text-sm font-medium text-sky-700 w-20 shrink-0">{ev.time}</div>
                    <div className="flex-1 text-gray-800">{ev.title}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation View */}
      <AnimatePresence>
        {selectedPackage && showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-display font-bold text-gray-900">Booking Confirmation</h3>
                <button className="text-gray-400 hover:text-gray-600" onClick={() => { setShowConfirmation(false); setSelectedPackage(null) }}><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-2 text-gray-700">
                <div className="font-medium">{selectedPackage.title}</div>
                <div className="text-sm">Destination: {DESTINATIONS.find(d => d.value === selectedPackage.destination)?.label}</div>
                <div className="text-sm">Duration: {selectedPackage.duration}</div>
                <div className="text-lg font-semibold text-gray-900 mt-2">Total: ₹{totalPrice.toLocaleString()}</div>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button className="btn-primary" onClick={handlePrint}>Download Itinerary PDF</button>
                <button className="btn-secondary" onClick={handleOfflinePack}>Download Offline Pack</button>
                <button className="bg-gradient-to-r from-saffron-500 to-peacock-500 text-white rounded-lg px-4 py-2 hover:opacity-90 active:scale-[0.99] transition" onClick={() => setToast('Payment simulated (Razorpay dummy).')}>Pay Now</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-heritage-royal text-white px-4 py-2 rounded-full shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline success modal */}
      <AnimatePresence>
        {offlineSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setOfflineSuccess(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl p-6 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
              <div className="text-5xl mb-3">✅</div>
              <div className="text-xl font-semibold text-gray-900 mb-1">Your offline itinerary is ready!</div>
              <div className="text-gray-600 mb-4">You can access it anytime, even without internet.</div>
              <button className="btn-primary" onClick={() => setOfflineSuccess(false)}>Great!</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PackagesPage


