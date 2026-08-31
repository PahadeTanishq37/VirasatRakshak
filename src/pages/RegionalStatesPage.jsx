import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Star, Users, Calendar, Camera } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

export const RegionalStatesPage = () => {
  const navigate = useNavigate()
  const { region } = useParams()
  const [selectedState, setSelectedState] = useState(null)

  const regionData = {
    'north': {
      name: 'Northern India',
      icon: '🏔️',
      color: 'saffron',
      states: [
        {
          name: 'Jammu & Kashmir',
          capital: 'Srinagar',
          population: '12.5M',
          area: '42,241 km²',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format',
          shape: 'M200 200 L300 190 L320 210 L300 280 L250 270 L200 260 Z',
          heritage: ['Kashmiri Shawls', 'Mughal Gardens', 'Dal Lake', 'Gulmarg'],
          festivals: ['Shivratri', 'Baisakhi', 'Eid'],
          monuments: ['Shalimar Bagh', 'Nishat Bagh', 'Hazratbal Shrine']
        },
        {
          name: 'Himachal Pradesh',
          capital: 'Shimla',
          population: '7.3M',
          area: '55,673 km²',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
          shape: 'M250 250 L300 240 L320 260 L300 320 L270 310 L250 300 Z',
          heritage: ['Kullu Shawls', 'Chamba Rumal', 'Kangra Paintings', 'Apple Orchards'],
          festivals: ['Kullu Dussehra', 'Shimla Summer Festival', 'Minjar Fair'],
          monuments: ['Viceregal Lodge', 'Jakhu Temple', 'Christ Church']
        },
        {
          name: 'Punjab',
          capital: 'Chandigarh',
          population: '27.7M',
          area: '50,362 km²',
          image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop&auto=format',
          shape: 'M200 300 L250 290 L270 310 L250 350 L220 340 L200 330 Z',
          heritage: ['Phulkari Embroidery', 'Punjabi Folk Music', 'Bhangra Dance', 'Golden Temple'],
          festivals: ['Baisakhi', 'Lohri', 'Gurpurab', 'Hola Mohalla'],
          monuments: ['Golden Temple', 'Jallianwala Bagh', 'Wagah Border']
        },
        {
          name: 'Haryana',
          capital: 'Chandigarh',
          population: '25.4M',
          area: '44,212 km²',
          image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop&auto=format',
          shape: 'M200 350 L250 340 L270 360 L250 400 L220 390 L200 380 Z',
          heritage: ['Haryanvi Folk Dance', 'Phulkari Work', 'Mud Pottery', 'Cattle Fairs'],
          festivals: ['Teej', 'Gugga Naumi', 'Baisakhi'],
          monuments: ['Kurukshetra', 'Panipat Battlefield', 'Sultanpur Bird Sanctuary']
        },
        {
          name: 'Uttarakhand',
          capital: 'Dehradun',
          population: '10.1M',
          area: '53,483 km²',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
          shape: 'M250 300 L300 290 L320 310 L300 350 L270 340 L250 330 Z',
          heritage: ['Garhwali Music', 'Kumaoni Art', 'Wood Carving', 'Aipan Art'],
          festivals: ['Kumbh Mela', 'Nanda Devi Raj Jat', 'Uttarayani'],
          monuments: ['Kedarnath Temple', 'Badrinath Temple', 'Valley of Flowers']
        },
        {
          name: 'Uttar Pradesh',
          capital: 'Lucknow',
          population: '199.8M',
          area: '240,928 km²',
          image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&auto=format',
          shape: 'M200 400 L300 390 L320 410 L300 500 L250 490 L200 480 Z',
          heritage: ['Chikankari Embroidery', 'Zardozi Work', 'Banarasi Sarees', 'Lucknowi Cuisine'],
          festivals: ['Kumbh Mela', 'Diwali', 'Holi', 'Eid'],
          monuments: ['Taj Mahal', 'Fatehpur Sikri', 'Varanasi Ghats']
        },
        {
          name: 'Delhi',
          capital: 'New Delhi',
          population: '16.8M',
          area: '1,484 km²',
          image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&auto=format',
          shape: 'M220 380 L230 375 L235 385 L230 395 L220 390 Z',
          heritage: ['Mughal Architecture', 'Street Food', 'Qawwali Music', 'Handicrafts'],
          festivals: ['Republic Day', 'Independence Day', 'Qutub Festival'],
          monuments: ['Red Fort', 'Qutub Minar', 'India Gate', 'Lotus Temple']
        }
      ]
    },
    'west': {
      name: 'Western India',
      icon: '🏜️',
      color: 'peacock',
      states: [
        {
          name: 'Rajasthan',
          capital: 'Jaipur',
          population: '68.5M',
          area: '342,239 km²',
          image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&auto=format',
          shape: 'M100 300 L200 290 L220 310 L200 500 L150 490 L100 480 Z',
          heritage: ['Blue Pottery', 'Miniature Paintings', 'Rajasthani Folk Music', 'Camel Safaris'],
          festivals: ['Pushkar Fair', 'Desert Festival', 'Gangaur', 'Teej'],
          monuments: ['Hawa Mahal', 'Mehrangarh Fort', 'Jaisalmer Fort', 'City Palace']
        },
        {
          name: 'Gujarat',
          capital: 'Gandhinagar',
          population: '60.4M',
          area: '196,024 km²',
          image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop&auto=format',
          shape: 'M50 400 L100 390 L120 410 L100 550 L80 540 L60 520 Z',
          heritage: ['Gujarati Cuisine', 'Garba Dance', 'Patola Sarees', 'Wood Carving'],
          festivals: ['Navratri', 'Uttarayan', 'Rann Utsav', 'Modhera Dance Festival'],
          monuments: ['Rani ki Vav', 'Sun Temple', 'Sabarmati Ashram', 'Dwarkadhish Temple']
        },
        {
          name: 'Maharashtra',
          capital: 'Mumbai',
          population: '112.4M',
          area: '307,713 km²',
          image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&auto=format',
          shape: 'M100 500 L200 490 L220 510 L200 700 L150 690 L100 680 Z',
          heritage: ['Marathi Literature', 'Lavani Dance', 'Warli Art', 'Kolhapuri Chappals'],
          festivals: ['Ganesh Chaturthi', 'Gudi Padwa', 'Pola', 'Narali Purnima'],
          monuments: ['Gateway of India', 'Ajanta Caves', 'Ellora Caves', 'Shaniwar Wada']
        },
        {
          name: 'Goa',
          capital: 'Panaji',
          population: '1.5M',
          area: '3,702 km²',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format',
          shape: 'M130 650 L150 640 L160 660 L150 680 L140 670 L130 660 Z',
          heritage: ['Goan Cuisine', 'Fado Music', 'Carnival', 'Beach Culture'],
          festivals: ['Carnival', 'Feast of St. Francis Xavier', 'Shigmo', 'Ganesh Chaturthi'],
          monuments: ['Basilica of Bom Jesus', 'Fort Aguada', 'Se Cathedral', 'Chapora Fort']
        }
      ]
    },
    'east': {
      name: 'Eastern India',
      icon: '🌅',
      color: 'marigold',
      states: [
        {
          name: 'West Bengal',
          capital: 'Kolkata',
          population: '91.3M',
          area: '88,752 km²',
          image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&auto=format',
          shape: 'M350 500 L400 490 L420 510 L400 580 L370 570 L350 560 Z',
          heritage: ['Bengali Literature', 'Rabindra Sangeet', 'Durga Puja', 'Terracotta Temples'],
          festivals: ['Durga Puja', 'Kali Puja', 'Poila Boishakh', 'Jagaddhatri Puja'],
          monuments: ['Victoria Memorial', 'Howrah Bridge', 'Dakshineswar Temple', 'Sundarbans']
        },
        {
          name: 'Odisha',
          capital: 'Bhubaneswar',
          population: '41.9M',
          area: '155,707 km²',
          image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&auto=format',
          shape: 'M300 650 L350 640 L370 660 L350 750 L320 740 L300 730 Z',
          heritage: ['Odissi Dance', 'Pattachitra Art', 'Applique Work', 'Stone Carving'],
          festivals: ['Rath Yatra', 'Durga Puja', 'Konark Dance Festival', 'Makar Sankranti'],
          monuments: ['Konark Sun Temple', 'Jagannath Temple', 'Lingaraja Temple', 'Udayagiri Caves']
        },
        {
          name: 'Jharkhand',
          capital: 'Ranchi',
          population: '32.9M',
          area: '79,714 km²',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
          shape: 'M300 580 L350 570 L370 590 L350 650 L320 640 L300 630 Z',
          heritage: ['Tribal Art', 'Chhau Dance', 'Sohrai Art', 'Bamboo Craft'],
          festivals: ['Sarhul', 'Karma', 'Tusu Parab', 'Holi'],
          monuments: ['Jagannath Temple', 'Betla National Park', 'Hazaribagh Wildlife Sanctuary']
        },
        {
          name: 'Bihar',
          capital: 'Patna',
          population: '104.1M',
          area: '94,163 km²',
          image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&auto=format',
          shape: 'M300 500 L350 490 L370 510 L350 580 L320 570 L300 560 Z',
          heritage: ['Madhubani Painting', 'Bhojpuri Folk Music', 'Buddhist Heritage', 'Ancient Universities'],
          festivals: ['Chhath Puja', 'Buddha Purnima', 'Sonepur Mela', 'Makar Sankranti'],
          monuments: ['Bodh Gaya', 'Nalanda University', 'Vikramshila University', 'Patna Museum']
        },
        {
          name: 'Sikkim',
          capital: 'Gangtok',
          population: '0.6M',
          area: '7,096 km²',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format',
          shape: 'M350 280 L370 270 L380 290 L370 310 L360 300 L350 290 Z',
          heritage: ['Tibetan Culture', 'Buddhist Monasteries', 'Handicrafts', 'Organic Farming'],
          festivals: ['Losar', 'Saga Dawa', 'Dasain', 'Tihar'],
          monuments: ['Rumtek Monastery', 'Pemayangtse Monastery', 'Tsomgo Lake', 'Nathula Pass']
        }
      ]
    },
    'south': {
      name: 'Southern India',
      icon: '🌴',
      color: 'green',
      states: [
        {
          name: 'Karnataka',
          capital: 'Bangalore',
          population: '61.1M',
          area: '191,791 km²',
          image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&auto=format',
          shape: 'M150 700 L250 690 L270 710 L250 850 L200 840 L150 830 Z',
          heritage: ['Carnatic Music', 'Mysore Paintings', 'Sandalwood Carving', 'Silk Sarees'],
          festivals: ['Dasara', 'Karva Chauth', 'Ugadi', 'Makar Sankranti'],
          monuments: ['Mysore Palace', 'Hampi', 'Gol Gumbaz', 'Belur Temple']
        },
        {
          name: 'Kerala',
          capital: 'Thiruvananthapuram',
          population: '33.4M',
          area: '38,863 km²',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format',
          shape: 'M150 850 L250 840 L270 860 L250 900 L200 890 L150 880 Z',
          heritage: ['Kathakali Dance', 'Mohiniyattam', 'Ayurveda', 'Backwater Tourism'],
          festivals: ['Onam', 'Vishu', 'Thrissur Pooram', 'Theyyam'],
          monuments: ['Padmanabhaswamy Temple', 'Kovalam Beach', 'Munnar Hills', 'Kochi Fort']
        },
        {
          name: 'Tamil Nadu',
          capital: 'Chennai',
          population: '72.1M',
          area: '130,058 km²',
          image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop&auto=format',
          shape: 'M250 850 L350 840 L370 860 L350 900 L300 890 L250 880 Z',
          heritage: ['Bharatanatyam', 'Tamil Literature', 'Temple Architecture', 'Carnatic Music'],
          festivals: ['Pongal', 'Karthigai Deepam', 'Tamil New Year', 'Maha Shivratri'],
          monuments: ['Meenakshi Temple', 'Brihadeshwara Temple', 'Mahabalipuram', 'Rameshwaram']
        },
        {
          name: 'Andhra Pradesh',
          capital: 'Amaravati',
          population: '49.4M',
          area: '160,205 km²',
          image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&auto=format',
          shape: 'M250 700 L350 690 L370 710 L350 850 L300 840 L250 830 Z',
          heritage: ['Kuchipudi Dance', 'Tirupati Temple', 'Kalamkari Art', 'Telugu Literature'],
          festivals: ['Ugadi', 'Sankranti', 'Vinayaka Chaturthi', 'Dasara'],
          monuments: ['Tirupati Temple', 'Charminar', 'Golconda Fort', 'Araku Valley']
        },
        {
          name: 'Telangana',
          capital: 'Hyderabad',
          population: '35.0M',
          area: '112,077 km²',
          image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&h=300&fit=crop&auto=format',
          shape: 'M200 750 L250 740 L270 760 L250 850 L220 840 L200 830 Z',
          heritage: ['Hyderabadi Cuisine', 'Deccani Culture', 'Bidri Work', 'Perini Dance'],
          festivals: ['Bathukamma', 'Bonalu', 'Ugadi', 'Dasara'],
          monuments: ['Charminar', 'Golconda Fort', 'Falaknuma Palace', 'Hussain Sagar']
        }
      ]
    }
  }

  const currentRegion = regionData[region] || regionData.north

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-peacock-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-gray-900">
                {currentRegion.name}
              </h1>
              <p className="text-lg text-gray-700">
                Explore the states and their unique cultural heritage
              </p>
            </div>
          </div>
          <div className="text-6xl">{currentRegion.icon}</div>
        </motion.div>

        {/* States Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentRegion.states.map((state, index) => (
            <motion.div
              key={state.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:scale-105 transition-transform duration-200 cursor-pointer relative"
              onClick={() => setSelectedState(state)}
            >
              {/* State Image */}
              <div className="w-full h-32 mb-4 rounded-lg overflow-hidden bg-gray-200 relative">
                <img
                  src={state.image}
                  alt={state.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    console.log('Image failed to load for:', state.name)
                    e.target.src = `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(state.name)}`
                  }}
                  onLoad={(e) => {
                    console.log('Image loaded successfully for:', state.name)
                    // Hide loading indicator
                    const loadingDiv = e.target.nextElementSibling
                    if (loadingDiv) {
                      loadingDiv.style.display = 'none'
                    }
                  }}
                />
                {/* Loading indicator */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-gray-500 text-sm">Loading...</div>
                </div>
              </div>

              {/* State Shape Overlay */}
              <div className="absolute top-2 right-2 w-16 h-12 opacity-60">
                <svg
                  width="64"
                  height="48"
                  viewBox="0 0 300 200"
                  className="opacity-80"
                >
                  <path
                    d={state.shape}
                    fill={`var(--${currentRegion.color}-200)`}
                    stroke={`var(--${currentRegion.color}-600)`}
                    strokeWidth="1"
                    className="hover:fill-current"
                  />
                </svg>
              </div>

              {/* State Info */}
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {state.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Capital: {state.capital}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                  <div className="flex items-center justify-center">
                    <Users className="w-3 h-3 mr-1" />
                    {state.population}
                  </div>
                  <div className="flex items-center justify-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {state.area}
                  </div>
                </div>

                {/* Heritage Tags */}
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {state.heritage.slice(0, 2).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <button className="btn-primary w-full">
                  Explore {state.name}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* State Details Modal */}
        {selectedState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedState(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-r from-${currentRegion.color}-500 to-${currentRegion.color}-600 text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">{selectedState.name}</h2>
                    <p className="text-white/90">Capital: {selectedState.capital}</p>
                  </div>
                  <button
                    onClick={() => setSelectedState(null)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* State Image and Shape */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <h3 className="text-lg font-semibold mb-4">State Image</h3>
                      <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-gray-200 relative">
                        <img
                          src={selectedState.image}
                          alt={selectedState.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            console.log('Modal image failed to load for:', selectedState.name)
                            e.target.src = `https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=${encodeURIComponent(selectedState.name)}`
                          }}
                          onLoad={(e) => {
                            console.log('Modal image loaded successfully for:', selectedState.name)
                            // Hide loading indicator
                            const loadingDiv = e.target.nextElementSibling
                            if (loadingDiv) {
                              loadingDiv.style.display = 'none'
                            }
                          }}
                        />
                        {/* Loading indicator */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <div className="text-gray-500 text-sm">Loading...</div>
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold mb-2">State Shape</h4>
                      <svg
                        width="200"
                        height="150"
                        viewBox="0 0 300 200"
                        className="mx-auto"
                      >
                        <path
                          d={selectedState.shape}
                          fill={`var(--${currentRegion.color}-200)`}
                          stroke={`var(--${currentRegion.color}-600)`}
                          strokeWidth="3"
                        />
                      </svg>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Population:</span>
                        <span className="font-semibold">{selectedState.population}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area:</span>
                        <span className="font-semibold">{selectedState.area}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cultural Heritage */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Star className="w-5 h-5 mr-2 text-yellow-500" />
                        Cultural Heritage
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedState.heritage.map((item, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        Major Festivals
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedState.festivals.map((festival, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm"
                          >
                            {festival}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Camera className="w-5 h-5 mr-2 text-green-500" />
                        Famous Monuments
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {selectedState.monuments.map((monument, index) => (
                          <span
                            key={index}
                            className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm"
                          >
                            {monument}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
