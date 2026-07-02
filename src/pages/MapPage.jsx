import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export const MapPage = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleRegionClick = (region) => {
    navigate(`/region/${region}`)
  }
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
                className="btn-primary w-full mt-auto"
                onClick={() => handleRegionClick('north')}
              >
                {t('map.exploreNorth')}
                <ArrowRight className="w-4 h-4 ml-2" />
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
                className="btn-primary w-full mt-auto"
                onClick={() => handleRegionClick('west')}
              >
                {t('map.exploreWest')}
                <ArrowRight className="w-4 h-4 ml-2" />
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
                className="btn-primary w-full mt-auto"
                onClick={() => handleRegionClick('east')}
              >
                {t('map.exploreEast')}
                <ArrowRight className="w-4 h-4 ml-2" />
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
                className="btn-primary w-full mt-auto"
                onClick={() => handleRegionClick('south')}
              >
                {t('map.exploreSouth')}
                <ArrowRight className="w-4 h-4 ml-2" />
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
