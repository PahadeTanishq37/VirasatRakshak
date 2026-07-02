import { Heart, Github, Twitter, Instagram, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-saffron-600 via-peacock-600 to-marigold-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">भ</span>
              </div>
              <span className="text-xl font-display font-bold">
                Digital Bharat HeritageVerse
              </span>
            </div>
            <p className="text-white/90 mb-6 max-w-md">
              Preserving and celebrating India's rich cultural heritage through immersive digital experiences. 
              Explore, learn, and connect with the timeless traditions of our incredible nation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/map" className="text-white/80 hover:text-white transition-colors duration-200">Interactive Map</Link></li>
              <li><Link to="/story" className="text-white/80 hover:text-white transition-colors duration-200">AI Stories</Link></li>
              <li><Link to="/games" className="text-white/80 hover:text-white transition-colors duration-200">Heritage Games</Link></li>
              <li><Link to="/ar" className="text-white/80 hover:text-white transition-colors duration-200">AR Experience</Link></li>
              <li><Link to="/marketplace" className="text-white/80 hover:text-white transition-colors duration-200">Artisan Market</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-white/80">
              <p>New Delhi, India</p>
              <p>+91 98765 43210</p>
              <p>info@digitalbharat.in</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">
              © 2024 Digital Bharat HeritageVerse. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-white/80 text-sm mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-current" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
