import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, BookOpen, Camera, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const HomePage = () => {
  const { t } = useTranslation()
  
  const features = [
    {
      icon: MapPin,
      title: t('homepage.features.map.title'),
      description: t('homepage.features.map.description'),
      color: 'from-saffron-500 to-saffron-600',
      link: '/map'
    },
    {
      icon: BookOpen,
      title: t('homepage.features.story.title'),
      description: t('homepage.features.story.description'),
      color: 'from-peacock-500 to-peacock-600',
      link: '/story'
    },
    {
      icon: Camera,
      title: t('homepage.features.ar.title'),
      description: t('homepage.features.ar.description'),
      color: 'from-heritage-emerald to-heritage-royal',
      link: '/ar'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
        {/* Animated Cultural Motifs Background */}
        <div className="absolute inset-0 opacity-20">
          {/* Floating geometric patterns */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-saffron-300 rounded-full animate-cultural-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-peacock-300 rounded-full animate-cultural-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-marigold-300 rounded-full animate-cultural-float" style={{ animationDelay: '4s' }}></div>
          
          {/* Cultural pattern elements */}
          <div className="absolute top-1/4 right-1/4 w-16 h-16 border-4 border-saffron-400 animate-mandala-spin"></div>
          <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-gradient-to-r from-peacock-400 to-marigold-400 rounded-full animate-pulse-glow"></div>
          
          {/* Mandala-inspired patterns */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-heritage-gold rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border border-heritage-royal rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          
          {/* Additional cultural motifs */}
          <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-heritage-emerald rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-heritage-crimson rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h1 className="text-6xl lg:text-8xl font-display font-bold text-gray-900 leading-tight">
                  {t('homepage.title')}
                  <span className="text-gradient block">{t('homepage.subtitle')}</span>
                </h1>
                <p className="text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  {t('homepage.description')}
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link 
                  to="/map" 
                  className="btn-primary text-xl px-12 py-6 inline-flex items-center justify-center transform hover:scale-110 transition-all duration-300"
                >
                  {t('homepage.exploreButton')}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
              {t('homepage.keyFeatures')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('homepage.keyFeaturesDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-8 hover:scale-105 group text-center"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Link
                    to={feature.link}
                    className="inline-flex items-center text-saffron-600 hover:text-saffron-700 font-medium group-hover:translate-x-1 transition-transform duration-300"
                  >
                    {t('homepage.learnMore')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
