import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Search, Filter, Heart, Star, ShoppingCart, Eye, MapPin, Clock, User, Award, BadgeCheck, Gift, PackagePlus, Play, Link as LinkIcon, BookOpen, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cartService } from '../services/cartService'
import CartCheckoutModal from '../components/CartCheckoutModal'
import MyOrdersModal from '../components/MyOrdersModal'

export const MarketplacePage = () => {
  const { t } = useTranslation()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showHeritage, setShowHeritage] = useState(null)
  const [showGift, setShowGift] = useState(null)
  const [arProduct, setArProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterState, setFilterState] = useState('all')
  const [filterPrice, setFilterPrice] = useState('all')
  const [cartItems, setCartItems] = useState(() => cartService.getItems())
  const [sortBy, setSortBy] = useState('featured')
  const [showCartModal, setShowCartModal] = useState(false)
  const [showOrdersModal, setShowOrdersModal] = useState(false)
  const [impact, setImpact] = useState(() => {
    try {
      const raw = localStorage.getItem('impact:summary')
      return raw ? JSON.parse(raw) : { artisans: 0, states: 0 }
    } catch {
      return { artisans: 0, states: 0 }
    }
  })

  const cartCount = cartService.getTotalQuantity(cartItems)

  const addToCart = (product) => {
    const newItems = cartService.addItem(product)
    setCartItems(newItems)
    setImpact(prev => {
      const next = { artisans: prev.artisans + 1, states: Math.max(prev.states, 1) }
      try { localStorage.setItem('impact:summary', JSON.stringify(next)) } catch {}
      return next
    })
  }

  const handleCartChange = (newItems) => {
    setCartItems(newItems)
  }

  const products = [
    {
      id: 1,
      name: 'Handwoven Banarasi Saree',
      artisan: 'Priya Sharma',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Varanasi, Uttar Pradesh',
      state: 'Uttar Pradesh',
      category: 'textiles',
      artForm: 'Weaving',
      price: 8500,
      originalPrice: 12000,
      rating: 4.9,
      reviews: 156,
      image: '👗',
      description: 'Exquisite handwoven Banarasi silk saree with intricate zari work and traditional motifs.',
      heritageInfo: 'Banarasi weaving dates back to the Mughal era, renowned for its rich brocades and gold zari.',
      features: ['Pure Silk', 'Handwoven', 'Zari Work', 'Traditional Motifs'],
      inStock: true,
      deliveryTime: '5-7 days',
      artisanRating: 4.8,
      artisanProducts: 45
    },
    {
      id: 2,
      name: 'Blue Pottery Set',
      artisan: 'Rajesh Kumar',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Jaipur, Rajasthan',
      state: 'Rajasthan',
      category: 'pottery',
      artForm: 'Pottery',
      price: 2500,
      originalPrice: 3500,
      rating: 4.7,
      reviews: 89,
      image: '🏺',
      description: 'Traditional blue pottery set with intricate hand-painted designs from Jaipur.',
      heritageInfo: 'Jaipur blue pottery traces Persian influences and is famed for its vivid cobalt blue glaze.',
      features: ['Hand-painted', 'Traditional Design', 'Food Safe', 'Unique Patterns'],
      inStock: true,
      deliveryTime: '3-5 days',
      artisanRating: 4.6,
      artisanProducts: 32
    },
    {
      id: 3,
      name: 'Kashmiri Pashmina Shawl',
      artisan: 'Amina Begum',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Srinagar, Jammu & Kashmir',
      state: 'Jammu & Kashmir',
      category: 'textiles',
      artForm: 'Embroidery',
      price: 15000,
      originalPrice: 20000,
      rating: 4.8,
      reviews: 203,
      image: '🧣',
      description: 'Luxurious 100% pure pashmina shawl with intricate embroidery and soft texture.',
      heritageInfo: 'Pashmina from Kashmir uses the finest changthangi goat wool, treasured for centuries.',
      features: ['100% Pashmina', 'Hand Embroidered', 'Luxury Quality', 'Warm & Soft'],
      inStock: true,
      deliveryTime: '7-10 days',
      artisanRating: 4.9,
      artisanProducts: 67
    },
    {
      id: 4,
      name: 'Madhubani Painting',
      artisan: 'Sita Devi',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Madhubani, Bihar',
      state: 'Bihar',
      category: 'art',
      artForm: 'Painting',
      price: 3500,
      originalPrice: 4500,
      rating: 4.6,
      reviews: 78,
      image: '🎨',
      description: 'Traditional Madhubani painting depicting Hindu mythology with natural colors.',
      heritageInfo: 'Madhubani art is a folk tradition by women of Mithila, painted on walls for auspicious rites.',
      features: ['Natural Colors', 'Traditional Style', 'Mythological Theme', 'Handmade'],
      inStock: true,
      deliveryTime: '4-6 days',
      artisanRating: 4.7,
      artisanProducts: 28
    },
    {
      id: 5,
      name: 'Kerala Spice Box',
      artisan: 'Krishnan Nair',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Kochi, Kerala',
      state: 'Kerala',
      category: 'home',
      artForm: 'Wood Carving',
      price: 1200,
      originalPrice: 1800,
      rating: 4.5,
      reviews: 134,
      image: '🌶️',
      description: 'Traditional wooden spice box with authentic Kerala spices and hand-carved design.',
      heritageInfo: 'Kerala spice trade connected India to the world, shaping culinary heritage for millennia.',
      features: ['Hand-carved Wood', 'Authentic Spices', 'Traditional Design', 'Airtight'],
      inStock: true,
      deliveryTime: '2-4 days',
      artisanRating: 4.4,
      artisanProducts: 56
    },
    {
      id: 6,
      name: 'Gujarati Silver Jewelry',
      artisan: 'Harshad Patel',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Ahmedabad, Gujarat',
      state: 'Gujarat',
      category: 'jewelry',
      artForm: 'Metalwork',
      price: 4500,
      originalPrice: 6000,
      rating: 4.7,
      reviews: 167,
      image: '💍',
      description: 'Traditional Gujarati silver jewelry set with intricate filigree work.',
      heritageInfo: 'Gujarat has a storied legacy of silver filigree and meenakari work across communities.',
      features: ['Pure Silver', 'Filigree Work', 'Traditional Design', 'Handcrafted'],
      inStock: false,
      deliveryTime: '10-12 days',
      artisanRating: 4.8,
      artisanProducts: 41
    },
    {
      id: 7,
      name: 'Tamil Nadu Bronze Idol',
      artisan: 'Murugan Swamy',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Thanjavur, Tamil Nadu',
      state: 'Tamil Nadu',
      category: 'art',
      artForm: 'Metal Casting',
      price: 6800,
      originalPrice: 8500,
      rating: 4.8,
      reviews: 92,
      image: '🕉️',
      description: 'Traditional bronze idol crafted using ancient lost-wax casting technique.',
      heritageInfo: 'Thanjavur Chola bronze casting follows the thousand-year-old lost-wax (cire-perdue) method.',
      features: ['Bronze Casting', 'Traditional Technique', 'Religious Art', 'Handcrafted'],
      inStock: true,
      deliveryTime: '6-8 days',
      artisanRating: 4.7,
      artisanProducts: 38
    },
    {
      id: 8,
      name: 'Bengali Terracotta Pot',
      artisan: 'Gopal Das',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Kolkata, West Bengal',
      state: 'West Bengal',
      category: 'pottery',
      artForm: 'Terracotta',
      price: 1800,
      originalPrice: 2500,
      rating: 4.4,
      reviews: 67,
      image: '🏺',
      description: 'Traditional Bengali terracotta pot with intricate hand-carved patterns.',
      heritageInfo: 'Terracotta craft flourishes in Bishnupur, famed for temples and red clay artistry.',
      features: ['Terracotta', 'Hand-carved', 'Traditional Patterns', 'Eco-friendly'],
      inStock: true,
      deliveryTime: '4-6 days',
      artisanRating: 4.5,
      artisanProducts: 23
    },
    {
      id: 9,
      name: 'Punjabi Phulkari Dupatta',
      artisan: 'Kiran Kaur',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Amritsar, Punjab',
      state: 'Punjab',
      category: 'textiles',
      artForm: 'Embroidery',
      price: 3200,
      originalPrice: 4200,
      rating: 4.6,
      reviews: 145,
      image: '🧵',
      description: 'Traditional Punjabi Phulkari dupatta with vibrant floral embroidery.',
      heritageInfo: 'Phulkari means “flower work”, an heirloom embroidery cherished in Punjabi households.',
      features: ['Hand Embroidered', 'Vibrant Colors', 'Traditional Motifs', 'Cotton Base'],
      inStock: true,
      deliveryTime: '5-7 days',
      artisanRating: 4.6,
      artisanProducts: 52
    },
    {
      id: 10,
      name: 'Maharashtrian Warli Art',
      artisan: 'Sunita Pawar',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Mumbai, Maharashtra',
      state: 'Maharashtra',
      category: 'art',
      artForm: 'Folk Painting',
      price: 2200,
      originalPrice: 3000,
      rating: 4.5,
      reviews: 89,
      image: '🎨',
      description: 'Traditional Warli tribal art painting on canvas with natural colors.',
      heritageInfo: 'Warli art by the Warli tribe uses simple forms to depict life and rituals.',
      features: ['Natural Colors', 'Tribal Art', 'Traditional Motifs', 'Hand-painted'],
      inStock: true,
      deliveryTime: '3-5 days',
      artisanRating: 4.4,
      artisanProducts: 31
    },
    {
      id: 11,
      name: 'Karnataka Sandalwood Carving',
      artisan: 'Ravi Shastri',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Mysore, Karnataka',
      state: 'Karnataka',
      category: 'home',
      artForm: 'Wood Carving',
      price: 5500,
      originalPrice: 7000,
      rating: 4.7,
      reviews: 78,
      image: '🌳',
      description: 'Intricate sandalwood carving with traditional Mysore motifs and natural fragrance.',
      heritageInfo: 'Mysuru sandalwood carving is prized for fragrance and fine hand-carved detailing.',
      features: ['Pure Sandalwood', 'Hand-carved', 'Natural Fragrance', 'Traditional Motifs'],
      inStock: true,
      deliveryTime: '7-10 days',
      artisanRating: 4.8,
      artisanProducts: 29
    },
    {
      id: 12,
      name: 'Odisha Pattachitra',
      artisan: 'Bijay Kumar',
      artisanPhoto: '/assets/monuments/tajmahal.jpg',
      location: 'Puri, Odisha',
      state: 'Odisha',
      category: 'art',
      artForm: 'Scroll Painting',
      price: 2800,
      originalPrice: 3800,
      rating: 4.6,
      reviews: 112,
      image: '📜',
      description: 'Traditional Pattachitra scroll painting depicting mythological stories.',
      heritageInfo: 'Pattachitra narrates temple stories on cloth with mineral pigments since medieval times.',
      features: ['Natural Colors', 'Mythological Themes', 'Traditional Style', 'Hand-painted'],
      inStock: true,
      deliveryTime: '5-7 days',
      artisanRating: 4.7,
      artisanProducts: 34
    }
  ]

  const categories = [
    { value: 'all', label: 'All Products', count: products.length },
    { value: 'textiles', label: 'Textiles', count: products.filter(p => p.category === 'textiles').length },
    { value: 'pottery', label: 'Pottery', count: products.filter(p => p.category === 'pottery').length },
    { value: 'art', label: 'Art', count: products.filter(p => p.category === 'art').length },
    { value: 'jewelry', label: 'Jewelry', count: products.filter(p => p.category === 'jewelry').length },
    { value: 'home', label: 'Home Decor', count: products.filter(p => p.category === 'home').length }
  ]

  const states = [
    { value: 'all', label: 'All States', count: products.length },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh', count: products.filter(p => p.state === 'Uttar Pradesh').length },
    { value: 'Rajasthan', label: 'Rajasthan', count: products.filter(p => p.state === 'Rajasthan').length },
    { value: 'Jammu & Kashmir', label: 'Jammu & Kashmir', count: products.filter(p => p.state === 'Jammu & Kashmir').length },
    { value: 'Bihar', label: 'Bihar', count: products.filter(p => p.state === 'Bihar').length },
    { value: 'Kerala', label: 'Kerala', count: products.filter(p => p.state === 'Kerala').length },
    { value: 'Gujarat', label: 'Gujarat', count: products.filter(p => p.state === 'Gujarat').length },
    { value: 'Tamil Nadu', label: 'Tamil Nadu', count: products.filter(p => p.state === 'Tamil Nadu').length },
    { value: 'West Bengal', label: 'West Bengal', count: products.filter(p => p.state === 'West Bengal').length },
    { value: 'Punjab', label: 'Punjab', count: products.filter(p => p.state === 'Punjab').length },
    { value: 'Maharashtra', label: 'Maharashtra', count: products.filter(p => p.state === 'Maharashtra').length },
    { value: 'Karnataka', label: 'Karnataka', count: products.filter(p => p.state === 'Karnataka').length },
    { value: 'Odisha', label: 'Odisha', count: products.filter(p => p.state === 'Odisha').length }
  ]

  const artForms = [
    { value: 'all', label: 'All Art Forms', count: products.length },
    { value: 'Weaving', label: 'Weaving', count: products.filter(p => p.artForm === 'Weaving').length },
    { value: 'Pottery', label: 'Pottery', count: products.filter(p => p.artForm === 'Pottery').length },
    { value: 'Embroidery', label: 'Embroidery', count: products.filter(p => p.artForm === 'Embroidery').length },
    { value: 'Painting', label: 'Painting', count: products.filter(p => p.artForm === 'Painting').length },
    { value: 'Wood Carving', label: 'Wood Carving', count: products.filter(p => p.artForm === 'Wood Carving').length },
    { value: 'Metalwork', label: 'Metalwork', count: products.filter(p => p.artForm === 'Metalwork').length },
    { value: 'Metal Casting', label: 'Metal Casting', count: products.filter(p => p.artForm === 'Metal Casting').length },
    { value: 'Terracotta', label: 'Terracotta', count: products.filter(p => p.artForm === 'Terracotta').length },
    { value: 'Folk Painting', label: 'Folk Painting', count: products.filter(p => p.artForm === 'Folk Painting').length },
    { value: 'Scroll Painting', label: 'Scroll Painting', count: products.filter(p => p.artForm === 'Scroll Painting').length }
  ]

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-2000', label: 'Under ₹2,000' },
    { value: '2000-5000', label: '₹2,000 - ₹5,000' },
    { value: '5000-10000', label: '₹5,000 - ₹10,000' },
    { value: '10000+', label: 'Above ₹10,000' }
  ]

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artisan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artForm.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesState = filterState === 'all' || product.state === filterState
    const matchesPrice = filterPrice === 'all' || 
      (filterPrice === '0-2000' && product.price < 2000) ||
      (filterPrice === '2000-5000' && product.price >= 2000 && product.price < 5000) ||
      (filterPrice === '5000-10000' && product.price >= 5000 && product.price < 10000) ||
      (filterPrice === '10000+' && product.price >= 10000)
    
    return matchesSearch && matchesCategory && matchesState && matchesPrice
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id - a.id
      default:
        return 0
    }
  })

  // Helper: whether AR try-on available
  const supportsAR = (p) => ['jewelry', 'textiles'].includes(p.category) || /shawl/i.test(p.name)

  const gradientBtn = 'px-4 py-2 rounded-lg text-white bg-gradient-to-r from-saffron-500 to-rose-500 hover:from-saffron-600 hover:to-rose-600 transition-all active:scale-[0.98] shadow'

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
            {t('marketplace.title').split(' ')[0]} <span className="text-gradient">{t('marketplace.subtitle')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('marketplace.description')}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, artisans, locations, or art forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
              />
            </div>

            {/* Filter Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('marketplace.categories')}</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('marketplace.state')}</label>
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                >
                  {states.map(state => (
                    <option key={state.value} value={state.value}>
                      {state.label} ({state.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('marketplace.priceRange')}</label>
                <select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('marketplace.sortBy')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-200">
              <span>
                Showing {filteredProducts.length} of {products.length} products
              </span>
              <div className="flex items-center space-x-4">
                {(filterCategory !== 'all' || filterState !== 'all' || filterPrice !== 'all' || searchTerm) && (
                  <button
                    onClick={() => {
                      setFilterCategory('all')
                      setFilterState('all')
                      setFilterPrice('all')
                      setSearchTerm('')
                      setSortBy('featured')
                    }}
                    className="text-saffron-600 hover:text-saffron-700 font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Impact Tracker & Cart Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-4 mb-8 bg-gradient-to-r from-saffron-100 to-peacock-100"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-saffron-600" />
                <span className="font-medium text-gray-900">
                  {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''} in cart` : 'Cart is empty'}
                </span>
              </div>
              {impact.artisans > 0 && (
                <div className="text-sm text-gray-700">
                  Supporting <span className="font-semibold">{impact.artisans}</span> artisans.
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="btn-secondary text-xs flex items-center space-x-1"
                onClick={() => setShowOrdersModal(true)}
              >
                <Package className="w-3.5 h-3.5" />
                <span>My Orders</span>
              </button>
              <button
                className="btn-primary text-xs flex items-center space-x-1"
                onClick={() => setShowCartModal(true)}
                disabled={cartCount === 0}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>View Cart{cartCount > 0 ? ` (${cartCount})` : ''}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Products area */}
            <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative card p-6 group cursor-pointer hover:shadow-2xl hover:shadow-saffron-200/60 transition-transform hover:scale-[1.02]"
            >
              {/* Badge */}
              <div className="absolute top-3 right-3 text-xs bg-saffron-100 text-saffron-700 px-2 py-1 rounded-full shadow">Supports {product.state} Heritage</div>

              {/* Product Image and Basic Info */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{product.image}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-saffron-600 transition-colors duration-200">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <img src={product.artisanPhoto} alt={product.artisan} className="w-6 h-6 rounded-full object-cover border" />
                    <span>Crafted by {product.artisan}, {product.artForm} artisan</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-600" title="Authentic Artisan" />
                  </div>
                </div>
              </div>
              
              {/* State Origin and Art Form */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm text-saffron-600 font-medium">
                  <MapPin className="w-4 h-4 mr-1" />
                  {product.state}
                </div>
                <div className="px-2 py-1 bg-saffron-100 text-saffron-700 rounded-full text-xs font-medium">
                  {product.artForm}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-2">{product.description}</p>
              
              {/* Rating and Reviews */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {product.rating}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 text-gray-400 mr-1" />
                    {product.reviews} reviews
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {product.deliveryTime}
                </div>
              </div>

              {/* Price and Stock Status */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.inStock 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
              
              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className={`${gradientBtn} flex items-center justify-center`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedProduct(product)
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" /> Quick View
                </button>
                <button 
                  className="btn-secondary flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowHeritage(product)
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Know the Heritage
                </button>
                <button 
                  className="col-span-2 btn-primary flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (product.inStock) addToCart(product)
                    else alert('Pre-order placed! We will notify when available.')
                  }}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" /> {product.inStock ? 'Buy Now' : 'Pre-order'}
                </button>
                {supportsAR(product) && (
                  <button 
                    className="col-span-2 flex items-center justify-center px-4 py-2 rounded-lg border border-saffron-300 text-saffron-700 hover:bg-saffron-50"
                    onClick={(e) => { e.stopPropagation(); setArProduct(product) }}
                  >
                    <Play className="w-4 h-4 mr-2" /> Try in AR
                  </button>
                )}
              </div>
            </motion.div>
          ))}
            </div>

            {/* Sidebar: Workshops */}
            <div className="lg:col-span-3 card p-4 h-max">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Artisan Workshops</h3>
              <div className="space-y-3 text-sm">
                {[
                  { name: 'Warli Basics with Sunita', date: 'Oct 21', place: 'Mumbai' },
                  { name: 'Blue Pottery Glazing', date: 'Nov 3', place: 'Jaipur' },
                  { name: 'Pattachitra Narratives', date: 'Nov 18', place: 'Puri' }
                ].map((e, i) => (
                  <div key={i} className="p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{e.name}</div>
                      <div className="text-gray-600">{e.date} • {e.place}</div>
                    </div>
                    <a href="/community" className="text-saffron-600 hover:underline flex items-center"><LinkIcon className="w-4 h-4 mr-1"/>Join</a>
                  </div>
                ))}
              </div>
              <a href="/community" className="mt-4 inline-block text-sm text-saffron-700 hover:underline">Explore more in Community →</a>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setFilterCategory('all')
                setFilterState('all')
                setFilterPrice('all')
                setSearchTerm('')
                setSortBy('featured')
              }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Product Details (Quick View) Modal */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Product Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedProduct.image}</div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">{selectedProduct.name}</h2>
                    <p className="text-gray-600">by {selectedProduct.artisan}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image & Info */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-64 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="text-6xl">{selectedProduct.image}</div>
                      <h3 className="text-lg font-semibold text-gray-900">Product Image</h3>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button 
                      className={`flex-1 ${gradientBtn} flex items-center justify-center`}
                      onClick={() => addToCart(selectedProduct)}
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </button>
                    <button className="btn-secondary flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </button>
                  </div>
                  {supportsAR(selectedProduct) && (
                    <button className="w-full mt-2 border border-saffron-300 text-saffron-700 rounded-lg px-4 py-2 hover:bg-saffron-50 flex items-center justify-center" onClick={() => setArProduct(selectedProduct)}>
                      <Play className="w-4 h-4 mr-2"/> Try in AR
                    </button>
                  )}
                  <button className="w-full mt-2 px-4 py-2 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 flex items-center justify-center" onClick={() => setShowGift(selectedProduct)}>
                    <Gift className="w-4 h-4 mr-2"/> Gift this Product
                  </button>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedProduct.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedProduct.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-saffron-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Artisan Info with verification & reviews */}
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Artisan Information</h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <img src={selectedProduct.artisanPhoto} alt={selectedProduct.artisan} className="w-12 h-12 rounded-full object-cover border" />
                      <div>
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">{selectedProduct.artisan} <BadgeCheck className="w-4 h-4 text-emerald-600" title="Authentic Artisan"/></h4>
                        <p className="text-sm text-gray-600">{selectedProduct.location}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rating</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{selectedProduct.artisanRating}/5.0</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Products</span>
                        <span className="font-medium">{selectedProduct.artisanProducts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery</span>
                        <span className="font-medium">{selectedProduct.deliveryTime}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Buyer Reviews</h4>
                      <div className="space-y-2">
                        {[{name:'Ananya',rating:5, text:'Beautiful craftsmanship!'}, {name:'Rahul',rating:4, text:'Great quality and fast delivery.'}].map((r,i)=>(
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">{r.name[0]}</div>
                            <div>
                              <div className="flex items-center gap-2 text-sm font-medium text-gray-900">{r.name} <span className="flex">{Array.from({length:r.rating}).map((_,j)=>(<Star key={j} className="w-3 h-3 text-yellow-400 fill-current"/>))}</span></div>
                              <div className="text-sm text-gray-700">{r.text}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price</span>
                        <span className="text-2xl font-bold text-gray-900">₹{selectedProduct.price.toLocaleString()}</span>
                      </div>
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Original Price</span>
                          <span className="text-lg text-gray-500 line-through">₹{selectedProduct.originalPrice.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">You Save</span>
                        <span className="text-green-600 font-medium">
                          ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Heritage Modal */}
        {showHeritage && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowHeritage(null)}>
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-xl p-6 max-w-4xl w-full" onClick={(e)=>e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-gray-900">Know the Heritage: {showHeritage.name}</h3>
                <button onClick={()=>setShowHeritage(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visual */}
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-56 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl mb-2">{showHeritage.image}</div>
                    <div className="text-sm text-gray-600">Showcase Image</div>
                  </div>
                </div>

                {/* Heritage Content */}
                <div>
                  <p className="text-gray-700 mb-3">{showHeritage.heritageInfo}</p>
                  <div className="flex items-center text-sm text-gray-600 mb-3"><MapPin className="w-4 h-4 mr-1"/>Origin: {showHeritage.state} • Art Form: {showHeritage.artForm}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-900 mb-1">Techniques</div>
                      <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                        {showHeritage.features.slice(0,3).map((f,i)=>(<li key={i}>{f}</li>))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-900 mb-1">Cultural Significance</div>
                      <p className="text-sm text-gray-700">A living tradition of {showHeritage.state}, passed down through generations and celebrated in local festivals and rituals.</p>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-900 mb-1">Care Tips</div>
                      <p className="text-sm text-gray-700">Keep away from direct sunlight and moisture. Clean gently with a soft dry cloth.</p>
                    </div>
                    <div className="p-3 rounded-lg border border-gray-200">
                      <div className="font-medium text-gray-900 mb-1">Meet the Artisan</div>
                      <div className="flex items-center gap-2">
                        <img src={showHeritage.artisanPhoto} alt={showHeritage.artisan} className="w-8 h-8 rounded-full object-cover border"/>
                        <span className="text-sm text-gray-700">Crafted by {showHeritage.artisan}, a dedicated {showHeritage.artForm} artisan.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <a href="/community" className="text-saffron-700 hover:underline text-sm">Learn, discuss and share in Community →</a>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-saffron-500 to-rose-500 text-white hover:from-saffron-600 hover:to-rose-600" onClick={()=>{setSelectedProduct(showHeritage); setShowHeritage(null)}}>View Product</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Gift Modal */}
        {showGift && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowGift(null)}>
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e)=>e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">Gift this Product</h3>
                <button onClick={()=>setShowGift(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <div className="space-y-3">
                <input className="w-full px-3 py-2 border rounded-lg" placeholder="Recipient email" />
                <textarea className="w-full px-3 py-2 border rounded-lg" placeholder="Add a personal note" rows="3"></textarea>
                <button className={`${gradientBtn} w-full flex items-center justify-center`} onClick={()=>{alert('Gift sent!'); setShowGift(null)}}><Gift className="w-4 h-4 mr-2"/>Send Gift</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* AR Try-on Modal (demo) */}
        {arProduct && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={()=>setArProduct(null)}>
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} className="bg-white rounded-xl p-6 max-w-2xl w-full" onClick={(e)=>e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-900">Try in AR (Demo)</h3>
                <button onClick={()=>setArProduct(null)} className="text-gray-400 hover:text-gray-600">✕</button>
              </div>
              <p className="text-gray-700 mb-4">This demo overlays a sample PNG filter. For full experience, visit the AR Try-On page.</p>
              <a href="/ar" className="inline-flex items-center px-4 py-2 rounded-lg border border-saffron-300 text-saffron-700 hover:bg-saffron-50"><Play className="w-4 h-4 mr-2"/> Open AR Try-On</a>
            </motion.div>
          </motion.div>
        )}

        {/* Artisan Support Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-marigold-500 to-saffron-500 rounded-2xl p-8 text-white"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold mb-4">Our Collective Impact</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">🌍 1,200+ artisans supported | 🎨 10,000+ heritage products sold | 🏛 50+ crafts revived.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Craftsmanship</h3>
              <p className="text-white/90">Every product is verified for authenticity and traditional techniques</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Support</h3>
              <p className="text-white/90">Artisans receive fair compensation for their skilled work</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Heritage Preservation</h3>
              <p className="text-white/90">Help keep traditional arts and crafts alive for future generations</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cart & Checkout Modal */}
      <CartCheckoutModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onCartChange={handleCartChange}
      />

      {/* My Orders Modal */}
      <MyOrdersModal
        isOpen={showOrdersModal}
        onClose={() => setShowOrdersModal(false)}
      />
    </div>
  )
}
