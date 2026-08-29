import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, Car, Building2, ShoppingBag, X, Star } from 'lucide-react'

import { pdfService } from '../services/pdfService'

const DEST_META = {
  shirdi: { title: "Shirdi Heritage Tour", media: 'https://drive.google.com/uc?export=view&id=1yMyOSvVcuwztUv2kWgM5PwzvN0mfkxiC' }
}

export const PackageDestinationPage = () => {
  const { destination } = useParams()
  const meta = DEST_META[destination] || { title: 'Heritage Tour', media: '/tajmahal.jpg' }

  const [addons, setAddons] = useState({ meals: false, guide: false, festival: false, premiumCar: false })
  const [hotel, setHotel] = useState('standard')
  const [cab, setCab] = useState('sedan')
  const [cultural, setCultural] = useState({ bazaar: false, folk: false, streetfood: false })
  const [showSuccess, setShowSuccess] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const basePrice = 8999
  const addonsPrice = (addons.meals ? 999 : 0) + (addons.guide ? 1199 : 0) + (addons.festival ? 1999 : 0) + (addons.premiumCar ? 1499 : 0)
  const hotelPrice = hotel === 'standard' ? 0 : hotel === 'deluxe' ? 1800 : 3800
  const cabPrice = cab === 'sedan' ? 0 : cab === 'suv' ? 1200 : 3500
  const culturalPrice = (cultural.bazaar ? 299 : 0) + (cultural.folk ? 799 : 0) + (cultural.streetfood ? 499 : 0)
  const total = basePrice + addonsPrice + hotelPrice + cabPrice + culturalPrice

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) return
    setIsGeneratingPDF(true)
    try {
      await pdfService.generateTourPDF({
        title: meta.title,
        destination: destination ? destination.toUpperCase() : 'Shirdi',
        duration: '2N / 3D',
        stay: `${hotel.charAt(0).toUpperCase() + hotel.slice(1)} Hotel`,
        cab: `${cab.toUpperCase()} Vehicle`,
        basePrice,
        hotelPrice,
        cabPrice,
        addonsPrice,
        culturalPrice,
        totalAmount: total,
        itinerary: [
          { day: 'Day 1', title: 'Pickup & Shirdi Arrival', items: ['Pickup from city center', 'Visit to Shirdi Sai Baba Temple, Khandoba Mandir, Baba Chavadi', 'Evening Aarti'] },
          { day: 'Day 2', title: 'Guided Temple & Shrine Excursion', items: ['Priority Darshan at Shirdi with Dedicated Panditji', 'Visit to Shani Shingnapur', 'Spiritual Discourse'] },
          { day: 'Day 3', title: 'Local Cultural Bazaar Walk', items: ['Prasadalaya visit & local handicrafts market', 'Drop-off at city station/airport'] }
        ]
      })
    } catch (e) {
      alert('Unable to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const timeline = useMemo(() => ([
    { day: 'Day 1', title: 'Pickup, Check-in & Evening Temple Visit', note: 'Soak in the spiritual aura with evening aarti.', image: '/tajmahal.jpg' },
    { day: 'Day 2', title: 'City Heritage & Nearby Excursion', note: 'Guided darshan and exploration of key shrines.', image: '/tajmahal.jpg' },
    { day: 'Day 3', title: 'Bazaar Walk, Local Cuisine & Drop-off', note: 'Handicrafts and flavors before your journey home.', image: '/tajmahal.jpg' }
  ]), [destination])

  const toggle = (objSetter, key) => objSetter(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundImage: `url(${meta.media})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-white/10" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-4xl md:text-6xl font-display font-bold text-white drop-shadow">
            {meta.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.7 }} className="mt-4 text-white/90 text-lg md:text-2xl">
            Seamless journey from pickup to drop — curated just for you.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Overview */}
        <div className="card p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start"><Car className="w-5 h-5 mr-2 text-sky-600" /><div><div className="font-semibold">Pickup & Drop</div><div className="text-gray-600 text-sm">City pickup • Flexible timing</div></div></div>
            <div className="flex items-start"><Building2 className="w-5 h-5 mr-2 text-sky-600" /><div><div className="font-semibold">Stay</div><div className="text-gray-600 text-sm">Hotel/Homestay options</div></div></div>
            <div className="flex items-start"><ShoppingBag className="w-5 h-5 mr-2 text-sky-600" /><div><div className="font-semibold">Experiences</div><div className="text-gray-600 text-sm">Markets & local culture</div></div></div>
            <div className="flex items-start justify-between md:justify-end"><div className="text-right"><div className="text-gray-500 text-xs">Starting from</div><div className="text-2xl font-bold text-gray-900">₹{total.toLocaleString()}</div><div className="text-xs text-gray-500">2N/3D</div></div></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/packages" className="btn-secondary">Back</Link>
            <a href="#customize" className="bg-gradient-to-r from-teal-500 to-sky-600 text-white rounded-lg px-4 py-2 hover:opacity-90 active:scale-[0.99] transition">Customize Package</a>
          </div>
        </div>

        {/* Itinerary */}
        <div className="mb-10">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Itinerary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {timeline.map((t, i) => (
              <motion.div key={t.day} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card overflow-hidden">
                <div className="h-36 bg-gray-100" style={{ backgroundImage: `url(${t.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="p-4">
                  <div className="text-sky-700 text-sm font-medium">{t.day}</div>
                  <div className="font-semibold text-gray-900">{t.title}</div>
                  <div className="text-gray-600 text-sm mt-1">{t.note}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Customization */}
        <div id="customize" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Add-ons</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className={`card p-4 text-left hover:shadow ${addons.meals ? 'ring-2 ring-sky-500' : ''}`} onClick={() => toggle(setAddons, 'meals')}>🍲 Meals included <div className="text-gray-500 text-sm">+₹999</div></button>
                <button className={`card p-4 text-left hover:shadow ${addons.guide ? 'ring-2 ring-sky-500' : ''}`} onClick={() => toggle(setAddons, 'guide')}>👨‍🏫 Local cultural guide <div className="text-gray-500 text-sm">+₹1199</div></button>
                <button className={`card p-4 text-left hover:shadow ${addons.festival ? 'ring-2 ring-sky-500' : ''}`} onClick={() => toggle(setAddons, 'festival')}>🎉 Festival package <div className="text-gray-500 text-sm">+₹1999</div></button>
                <button className={`card p-4 text-left hover:shadow ${addons.premiumCar ? 'ring-2 ring-sky-500' : ''}`} onClick={() => toggle(setAddons, 'premiumCar')}>🚖 Premium car upgrade <div className="text-gray-500 text-sm">+₹1499</div></button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Hotels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['standard','deluxe','luxury'].map(h => (
                  <button key={h} className={`card p-4 text-left hover:shadow ${hotel===h?'ring-2 ring-sky-500':''}`} onClick={() => setHotel(h)}>
                    <div className="h-24 bg-gray-100 rounded mb-2" />
                    <div className="font-medium capitalize">{h}</div>
                    <div className="text-sm text-gray-500">{h==='standard'?'Included':h==='deluxe'?'+₹1800':'+₹3800'}</div>
                    <div className="flex items-center text-yellow-500 mt-1"><Star className="w-4 h-4 mr-1" />4.{h==='luxury'?9:3}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Cabs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['sedan','suv','luxury'].map(c => (
                  <button key={c} className={`card p-4 text-left hover:shadow ${cab===c?'ring-2 ring-sky-500':''}`} onClick={() => setCab(c)}>
                    <div className="h-16 bg-gray-100 rounded mb-2" />
                    <div className="font-medium uppercase">{c}</div>
                    <div className="text-sm text-gray-500">{c==='sedan'?'Included':c==='suv'?'+₹1200':'+₹3500'}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Cultural Experiences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button className={`card p-4 text-left hover:shadow ${cultural.bazaar?'ring-2 ring-sky-500':''}`} onClick={() => toggle(setCultural, 'bazaar')}>🛍️ Local bazaar visit <div className="text-gray-500 text-sm">+₹299</div></button>
                <button className={`card p-4 text-left hover:shadow ${cultural.folk?'ring-2 ring-sky-500':''}`} onClick={() => toggle(setCultural, 'folk')}>🎭 Folk performance <div className="text-gray-500 text-sm">+₹799</div></button>
                <button className={`card p-4 text-left hover:shadow ${cultural.streetfood?'ring-2 ring-sky-500':''}`} onClick={() => toggle(setCultural, 'streetfood')}>🍛 Street food trail <div className="text-gray-500 text-sm">+₹499</div></button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="card p-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-600">Base</div>
                <div className="font-medium">₹{basePrice.toLocaleString()}</div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600"><span>Add-ons</span><span>₹{addonsPrice.toLocaleString()}</span></div>
              <div className="flex items-center justify-between text-sm text-gray-600"><span>Hotel</span><span>₹{hotelPrice.toLocaleString()}</span></div>
              <div className="flex items-center justify-between text-sm text-gray-600"><span>Cab</span><span>₹{cabPrice.toLocaleString()}</span></div>
              <div className="flex items-center justify-between text-sm text-gray-600"><span>Cultural</span><span>₹{culturalPrice.toLocaleString()}</span></div>
              <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">₹{total.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-1 gap-3 mt-4">
                <button className="bg-gradient-to-r from-teal-500 to-sky-600 text-white rounded-lg px-4 py-2 hover:opacity-90 active:scale-[0.99] transition" onClick={() => setShowSuccess(true)}>Book Now</button>
                <button
                  className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-60"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal with simple confetti */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowSuccess(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-xl p-6 w-full max-w-md text-center" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <div className="text-5xl mb-2">🎉</div>
                <div className="text-xl font-semibold text-gray-900">Booking Successful!</div>
                <div className="text-gray-600 mt-1">We’ve sent your itinerary to your email.</div>
                <button className="btn-primary mt-4" onClick={() => setShowSuccess(false)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PackageDestinationPage


