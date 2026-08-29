import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Download, Share2, RotateCcw, ZoomIn, ZoomOut, Maximize, Heart, Star, Info, X, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { AROverlay } from '../components/AROverlay'
import { useTranslation } from 'react-i18next'

export const ARPage = () => {
  const { t } = useTranslation()
  const [selectedItem, setSelectedItem] = useState(null)
  const [isARActive, setIsARActive] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('all')
  const [showAROverlay, setShowAROverlay] = useState(false)
  const [capturedPhotos, setCapturedPhotos] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')

  const arItems = [
    {
      id: 1,
      name: 'Traditional Turban',
      category: 'clothing',
      type: 'turban',
      period: 'Sikh & Rajput Heritage',
      description: 'Try on the majestic turban, a symbol of honor and dignity in Indian culture. Experience different regional styles.',
      image: '🧕',
      arModel: 'turban_3d_model',
      features: ['Multiple Styles', 'Regional Variations', 'Color Options', 'Cultural Significance'],
      rating: 4.8,
      likes: 1250,
      price: 'Free'
    },
    {
      id: 2,
      name: 'Elegant Saree',
      category: 'clothing',
      type: 'saree',
      period: 'Ancient to Modern',
      description: 'Experience the grace of traditional Indian sarees in augmented reality. Try on different draping styles.',
      image: '👗',
      arModel: 'saree_3d_model',
      features: ['Draping Styles', 'Pattern Variations', 'Fabric Textures', 'Regional Designs'],
      rating: 4.9,
      likes: 2100,
      price: 'Free'
    },
    {
      id: 3,
      name: 'Kathakali Face Paint',
      category: 'makeup',
      type: 'kathakali',
      period: 'Kerala Classical',
      description: 'Transform into a Kathakali performer with traditional face paint and dramatic makeup from Kerala.',
      image: '🎭',
      arModel: 'kathakali_face_3d',
      features: ['Face Paint', 'Eye Makeup', 'Character Styles', 'Cultural Context'],
      rating: 4.7,
      likes: 1800,
      price: 'Free'
    },
    {
      id: 4,
      name: 'Royal Jewelry Set',
      category: 'jewelry',
      type: 'jewelry',
      period: 'Mughal & Rajput Era',
      description: 'Adorn yourself with magnificent royal jewelry including necklaces, earrings, and crowns.',
      image: '👑',
      arModel: 'royal_jewelry_3d',
      features: ['Necklaces', 'Earrings', 'Crowns', 'Gem Details'],
      rating: 4.6,
      likes: 1650,
      price: 'Free'
    },
    {
      id: 5,
      name: 'Temple Architecture',
      category: 'architecture',
      type: 'architecture',
      period: 'Various Eras',
      description: 'Place miniature versions of famous Indian temples in your space and explore their intricate details.',
      image: '🏛️',
      arModel: 'temple_architecture_3d',
      features: ['Scale Models', 'Detailed Carvings', 'Interactive Elements', 'Historical Context'],
      rating: 4.5,
      likes: 1200,
      price: 'Free'
    },
    {
      id: 6,
      name: 'Classical Dance Costume',
      category: 'clothing',
      type: 'dance',
      period: 'Classical Era',
      description: 'Dress up in traditional Bharatanatyam or Kathak costumes and learn about classical dance forms.',
      image: '💃',
      arModel: 'dance_costume_3d',
      features: ['Dance Styles', 'Accessories', 'Makeup Options', 'Pose Guidance'],
      rating: 4.4,
      likes: 980,
      price: 'Free'
    }
  ]

  const categories = [
    { value: 'all', label: t('ar.allItems'), count: arItems.length },
    { value: 'clothing', label: t('ar.clothing'), count: arItems.filter(item => item.category === 'clothing').length },
    { value: 'jewelry', label: t('ar.jewelry'), count: arItems.filter(item => item.category === 'jewelry').length },
    { value: 'makeup', label: t('ar.makeup'), count: arItems.filter(item => item.category === 'makeup').length },
    { value: 'architecture', label: t('ar.architecture'), count: arItems.filter(item => item.category === 'architecture').length }
  ]

  // Set default turban on page load
  useEffect(() => {
    const turbanItem = arItems.find(item => item.type === 'turban')
    if (turbanItem) {
      setSelectedItem(turbanItem)
    }
  }, [])

  const filteredItems = arItems.filter(item => {
    // Category filter
    const categoryMatch = currentFilter === 'all' || item.category === currentFilter
    
    // Search filter
    const searchMatch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.period.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Price filter (all items are free, but keeping for future)
    const priceMatch = priceFilter === 'all' || item.price === 'Free'
    
    return categoryMatch && searchMatch && priceMatch
  })

  const handleTryOn = (item) => {
    const fallbackTurban = arItems.find(ar => ar.type === 'turban')
    const itemToUse = item || fallbackTurban
    console.log('Filter selected:', itemToUse ? itemToUse.name : 'None (fallback turban not found)')
    if (itemToUse) {
      setSelectedItem(itemToUse)
    }
    setShowAROverlay(true)
    setIsARActive(true)
  }

  const handleCloseAR = () => {
    setShowAROverlay(false)
    setIsARActive(false)
  }

  const handleCapturePhoto = () => {
    const newPhoto = {
      id: Date.now(),
      item: selectedItem,
      timestamp: new Date(),
      url: null // Will be set by the AROverlay component
    }
    setCapturedPhotos(prev => [newPhoto, ...prev])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-peacock-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-4">
            {t('ar.title').split(' ')[0]} {t('ar.title').split(' ')[1]} <span className="text-gradient">{t('ar.subtitle')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('ar.description')}
          </p>
        </motion.div>

        {/* AR Camera Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card p-8 mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">{t('ar.arCamera')}</h2>
            <p className="text-gray-600">{t('ar.arCameraDesc')}</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Camera View */}
            <div className="flex-1 relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-96 flex items-center justify-center overflow-hidden">
              {selectedItem ? (
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-saffron-200 to-peacock-200 rounded-full flex items-center justify-center mx-auto animate-float">
                    <span className="text-4xl">{selectedItem.image}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedItem.name}</h3>
                  <p className="text-gray-600">{t('ar.readyToTry')}</p>
                  <button
                    onClick={() => handleTryOn(selectedItem)}
                    className="btn-primary flex items-center justify-center mx-auto"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {t('ar.startAR')}
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{t('ar.selectItem')}</h3>
                  <p className="text-gray-600">{t('ar.chooseSidebar')}</p>
                </div>
              )}
            </div>

            {/* Sidebar for Filter Selection */}
            <div className="w-full lg:w-80">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{t('ar.arFilters')}</h3>
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {/* None Option */}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      !selectedItem
                        ? 'bg-saffron-100 border-2 border-saffron-500'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📷</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{t('ar.noFilter')}</h4>
                        <p className="text-sm text-gray-600">{t('ar.plainCamera')}</p>
                      </div>
                    </div>
                  </button>

                  {/* Filter Options */}
                  {arItems.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                        selectedItem?.id === item.id
                          ? 'bg-saffron-100 border-2 border-saffron-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{item.image}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{item.period}</p>
                        </div>
                        {selectedItem?.id === item.id && (
                          <div className="w-2 h-2 bg-saffron-500 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 <strong>{t('ar.tip')}</strong> {t('ar.tipText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setCurrentFilter(category.value)}
              className={`px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 font-medium ${
                currentFilter === category.value
                  ? 'bg-saffron-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </motion.div>

        {/* Additional Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto px-4 mb-12"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Items</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description, or period..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                />
              </div>
              
              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                >
                  <option value="all">All Items</option>
                  <option value="free">Free Only</option>
                  <option value="premium">Premium Items</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AR Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card p-6 hover:scale-105 group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{item.image}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-saffron-600 transition-colors duration-200">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.category} • {item.period}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-3">{item.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {item.rating}
                  </div>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-400 mr-1" />
                    {item.likes.toLocaleString()}
                  </div>
                </div>
                <div className="text-saffron-600 font-semibold">{item.price}</div>
              </div>
              
              <button 
                className="w-full btn-primary flex items-center justify-center"
                onClick={() => handleTryOn(item)}
              >
                <Camera className="w-4 h-4 mr-2" />
                {t('ar.tryInAR')}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Item Details Modal */}
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Item Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedItem.image}</div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">{selectedItem.name}</h2>
                    <p className="text-gray-600">{selectedItem.category} • {selectedItem.period}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* AR Preview */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-saffron-200 to-peacock-200 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-3xl">{selectedItem.image}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">3D Model Preview</h3>
                      <p className="text-sm text-gray-600">Tap to place in AR</p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      className="flex-1 btn-primary flex items-center justify-center"
                      onClick={() => {
                        const fallbackTurban = arItems.find(ar => ar.type === 'turban')
                        setSelectedItem(selectedItem || fallbackTurban)
                        handleTryOn(selectedItem || fallbackTurban)
                        setSelectedItem(null) // Close modal
                      }}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Try in AR
                    </button>
                    <button className="btn-secondary flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    <button className="btn-accent flex items-center">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Item Info */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('ar.descriptionLabel')}</h3>
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedItem.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-saffron-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">AR Experience Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{selectedItem.rating}/5.0</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Likes</span>
                        <span className="font-medium">{selectedItem.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price</span>
                        <span className="font-medium text-saffron-600">{selectedItem.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* AR Features Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-peacock-500 to-saffron-500 rounded-2xl p-8 text-white"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold mb-4">Advanced AR Technology</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Experience heritage like never before with our cutting-edge augmented reality features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-white/90">Advanced computer vision for precise object placement and tracking</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Maximize className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3D Interaction</h3>
              <p className="text-white/90">Touch, rotate, and scale 3D objects with intuitive gestures</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Educational Content</h3>
              <p className="text-white/90">Learn about historical context and cultural significance</p>
            </div>
          </div>
        </motion.div>

        {/* Captured Photos Gallery */}
        {capturedPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                Your <span className="text-gradient">AR Memories</span>
              </h2>
              <p className="text-xl text-gray-600">
                Capture and save your cultural try-on experiences
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capturedPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card p-4"
                >
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-48 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{photo.item?.image}</div>
                      <p className="text-sm text-gray-600">{photo.item?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        {photo.timestamp.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {photo.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* AR Overlay Component */}
      <AnimatePresence>
        {showAROverlay && (
          <AROverlay
            selectedItem={selectedItem}
            isActive={isARActive}
            onCapture={handleCapturePhoto}
            onClose={handleCloseAR}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
