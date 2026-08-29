import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, MapPin, BookOpen, Gamepad2, Camera, ShoppingBag, Home, Globe, Landmark, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const location = useLocation()
  const { t, i18n } = useTranslation()

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
  ]

  const navItems = [
    { name: t('navbar.home'), path: '/', icon: Home },
    { name: t('navbar.map'), path: '/map', icon: MapPin },
    { name: t('navbar.stories'), path: '/story', icon: BookOpen },
    { name: t('navbar.games'), path: '/games', icon: Gamepad2 },
    { name: t('navbar.ar'), path: '/ar', icon: Camera },
    { name: t('navbar.marketplace'), path: '/marketplace', icon: ShoppingBag },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Packaged Tours', path: '/packages', icon: Landmark },
  ]

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode)
    setIsLangOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-saffron-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-peacock-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">भ</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold text-gradient leading-tight">
                {t('brand').split(' ')[0]}
              </span>
              <span className="text-lg font-display font-bold text-saffron-600 leading-tight">
                {t('brand').split(' ')[1] || ''}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                    isActive(item.path)
                      ? 'active-nav-link bg-saffron-50'
                      : 'nav-link'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="whitespace-nowrap">{item.name}</span>
                  {item.isNew && (
                    <span className="absolute -top-2 -right-2 text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500 text-white">
                      NEW
                    </span>
                  )}
                </Link>
              )
            })}
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-saffron-50"
              >
                <Globe className="w-4 h-4" />
                <span>{languages.find(lang => lang.code === i18n.language)?.flag || '🌐'}</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2 hover:bg-saffron-50 flex items-center space-x-2 ${
                        i18n.language === lang.code ? 'bg-saffron-50 text-saffron-700' : ''
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-saffron-600 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                      isActive(item.path)
                        ? 'active-nav-link bg-saffron-50'
                        : 'nav-link'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="whitespace-nowrap">{item.name}</span>
                    {item.isNew && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-500 text-white">
                        NEW
                      </span>
                    )}
                  </Link>
                )
              })}
              
              {/* Mobile Language Selector */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="px-3 py-2 text-sm font-medium text-gray-500">Language</div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${
                      i18n.language === lang.code ? 'bg-saffron-50 text-saffron-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
