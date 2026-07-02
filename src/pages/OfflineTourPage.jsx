import { motion } from 'framer-motion'

export const OfflineTourPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-peacock-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900">
            Offline Tour <span className="text-gradient">(Beta)</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Explore heritage sites with downloadable, offline-ready guides, maps, and stories. Coming soon.
          </p>
        </motion.div>

        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <p className="text-gray-700">
            We are preparing curated offline tours so you can experience culture without internet.
          </p>
        </div>
      </div>
    </div>
  )
}

export default OfflineTourPage


