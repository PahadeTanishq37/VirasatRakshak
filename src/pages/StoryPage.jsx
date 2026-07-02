import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Play, Pause, Volume2, VolumeX, RotateCcw, Download, Share2, Heart, Star, MessageCircle, Send, Bot, Globe, Clock, Youtube } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const StoryPage = () => {
  const { t } = useTranslation()
  const [selectedStory, setSelectedStory] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentChapter, setCurrentChapter] = useState(0)
  
  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [language, setLanguage] = useState('english') // 'english' or 'hindi'

  const stories = [
    {
      id: 1,
      title: 'The Legend of Taj Mahal',
      category: 'Mughal Era',
      duration: '12 min',
      rating: 4.9,
      likes: 1250,
      image: '🏛️',
      description: 'Discover the timeless love story behind the creation of the Taj Mahal, one of the Seven Wonders of the World.',
      chapters: [
        {
          title: 'The Royal Romance',
          content: 'In the bustling city of Agra, Emperor Shah Jahan fell deeply in love with Mumtaz Mahal, a Persian princess known for her beauty and wisdom...',
          duration: '3 min',
          videoUrl: 'https://drive.google.com/file/d/1fmzlfiMevanWHjNh-__oFDYOpPVYTBKH/preview'
        },
        {
          title: 'The Promise',
          content: 'On her deathbed, Mumtaz Mahal made Shah Jahan promise to build a monument that would represent their eternal love...',
          duration: '4 min',
          videoUrl: 'https://drive.google.com/file/d/1rYINiFoN7BgzXifUn4CWC3m7s3CdhfTN/preview'
        },
        {
          title: 'The Masterpiece',
          content: 'For 22 years, 20,000 artisans worked tirelessly to create this architectural marvel using white marble from Rajasthan...',
          duration: '5 min',
          videoUrl: 'https://drive.google.com/file/d/1f15wDVzHOqTx_FYSkark9yI9pfwWY1wD/preview'
        }
      ]
    },
    {
      id: 2,
      title: 'The Mysteries of Hampi',
      category: 'Vijayanagara Empire',
      duration: '15 min',
      rating: 4.8,
      likes: 980,
      image: '🏛️',
      description: 'Uncover the secrets of the ancient Vijayanagara Empire and its magnificent capital city.',
      chapters: [
        {
          title: 'The Golden City',
          content: 'Hampi was once the capital of the mighty Vijayanagara Empire, known as the "City of Victory" and one of the richest cities in the world...',
          duration: '4 min',
          videoUrl: 'https://drive.google.com/file/d/16IhbT-addXGb_h0_u55xaxC2nnMa-vbc/preview'
        },
        {
          title: 'The Fall',
          content: 'Despite its grandeur, the empire fell to the Deccan Sultanates in 1565, leaving behind magnificent ruins...',
          duration: '5 min',
          videoUrl: 'https://drive.google.com/file/d/1RPthwxbSR_AS7Lmm9svV8SrVSLq8rE6D/preview'
        },
        {
          title: 'The Legacy',
          content: 'Today, Hampi stands as a UNESCO World Heritage Site, preserving the architectural brilliance of ancient India...',
          duration: '6 min',
          videoUrl: 'https://drive.google.com/file/d/1M1z9LbhsOydK4fmm7_kUrDJgsvAMcc5m/preview'
        }
      ]
    },
    {
      id: 3,
      title: 'The Sacred Caves of Ajanta',
      category: 'Buddhist Heritage',
      duration: '18 min',
      rating: 4.7,
      likes: 750,
      image: '🕳️',
      description: 'Journey through the ancient Buddhist cave monasteries and their stunning frescoes.',
      chapters: [
        {
          title: 'The Discovery',
          content: 'In 1819, a British officer accidentally discovered these hidden caves while hunting tigers in the Sahyadri hills...',
          duration: '10 min',
          videoUrl: 'https://drive.google.com/file/d/14eJCSuNV3cZiAiGknx_7LxCK5sAo3DAt/preview'
        },
        {
          title: 'The Artists',
          content: 'Monks and artists spent centuries creating intricate paintings and sculptures that tell the story of Buddha\'s life...',
          duration: '10 min',
          videoUrl: 'https://drive.google.com/file/d/1YXghBZsgtqB5ThZSH3YHxe-aSY0UlVoF/preview'
        },
        {
          title: 'The Preservation',
          content: 'These masterpieces have survived for over 2000 years, offering a glimpse into ancient Indian art and culture...',
          duration: '13 min',
          videoUrl: 'https://drive.google.com/file/d/1Sx10R3s3zyA4mndRoimWOySj7RqPBp25/preview'
        }
      ]
    },
    {
      id: 4,
      title: 'The Sun Temple of Konark',
      category: 'Temple Architecture',
      duration: '10 min',
      rating: 4.6,
      likes: 650,
      image: '☀️',
      description: 'Explore the architectural marvel dedicated to the Sun God and its intricate stone carvings.',
      chapters: [
        {
          title: 'The Solar Chariot',
          content: 'The temple is designed as a massive chariot with 12 pairs of wheels, representing the 12 months of the year...',
          duration: '3 min',
          videoUrl: 'https://drive.google.com/file/d/1yMyOSvVcuwztUv2kWgM5PwzvN0mfkxiC/preview'
        },
        {
          title: 'The Stone Art',
          content: 'Every inch of the temple is covered with intricate carvings depicting daily life, mythology, and celestial beings...',
          duration: '4 min',
          videoUrl: 'https://drive.google.com/file/d/14mCOzz_PJ3BLZDd0iMq5ahnrtyp4weQD/preview'
        },
        {
          title: 'The Magnetic Mystery',
          content: 'Legend says the temple had a magnetic lodestone that could attract ships, making it a navigational landmark...',
          duration: '3 min',
          videoUrl: 'https://drive.google.com/file/d/1ZUxcgJuZ4e--zBOD_rrrevvQnHmQTHqp/preview'
        }
      ]
    }
  ]

  const categoriesRaw = t('stories.categories', { returnObjects: true })
  const categories = Array.isArray(categoriesRaw) ? categoriesRaw : ["All", "Mughal Era", "Vijayanagara Empire", "Buddhist Heritage", "Temple Architecture"]


  // Preloaded chatbot responses
  const chatbotResponses = {
    english: {
      'durga puja': {
        text: "Durga Puja is one of the most significant festivals in India, especially in West Bengal. It celebrates the victory of Goddess Durga over the demon Mahishasura. The festival spans 10 days, with the last 5 days being the most important. During this time, elaborate pandals (temporary structures) are built, and beautiful idols of Goddess Durga are worshipped. The festival symbolizes the triumph of good over evil and is celebrated with great enthusiasm, music, dance, and delicious food.",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual Durga Puja video
        duration: "8 min"
      },
      'taj mahal': {
        text: "The Taj Mahal is a magnificent white marble mausoleum built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal. It took 22 years and 20,000 artisans to complete this architectural masterpiece. The Taj Mahal is considered one of the Seven Wonders of the World and is a UNESCO World Heritage Site. It represents the pinnacle of Mughal architecture and is a symbol of eternal love.",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual Taj Mahal video
        duration: "12 min"
      },
      'diwali': {
        text: "Diwali, also known as the Festival of Lights, is one of the most important Hindu festivals celebrated across India. It marks the return of Lord Rama to Ayodhya after 14 years of exile. The festival is celebrated by lighting oil lamps (diyas), decorating homes, exchanging gifts, and enjoying fireworks. It symbolizes the victory of light over darkness and good over evil.",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual Diwali video
        duration: "6 min"
      },
      'holi': {
        text: "Holi is the vibrant Festival of Colors celebrated across India. It marks the arrival of spring and the victory of good over evil. The festival is famous for people throwing colored powders and water at each other. It's based on the legend of Prahlada and Holika, symbolizing the triumph of devotion over evil. Holi brings people together regardless of social barriers.",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual Holi video
        duration: "5 min"
      },
      'default': {
        text: "I'd be happy to help you learn about Indian heritage and culture! You can ask me about festivals like Durga Puja, Diwali, Holi, or monuments like Taj Mahal, or any other aspect of Indian history and culture. What would you like to know?",
        youtube: null,
        duration: null
      }
    },
    hindi: {
      'दुर्गा पूजा': {
        text: "दुर्गा पूजा भारत में सबसे महत्वपूर्ण त्योहारों में से एक है, विशेष रूप से पश्चिम बंगाल में। यह देवी दुर्गा की राक्षस महिषासुर पर विजय का जश्न मनाता है। यह त्योहार 10 दिनों तक चलता है, जिसमें अंतिम 5 दिन सबसे महत्वपूर्ण होते हैं। इस दौरान विस्तृत पंडाल बनाए जाते हैं और देवी दुर्गा की सुंदर मूर्तियों की पूजा की जाती है।",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "8 मिनट"
      },
      'ताज महल': {
        text: "ताज महल मुगल सम्राट शाहजहाँ द्वारा अपनी प्रिय पत्नी मुमताज महल की याद में बनाया गया एक शानदार सफेद संगमरमर का मकबरा है। इस वास्तुशिल्प कृति को पूरा करने में 22 साल और 20,000 कारीगर लगे। ताज महल को दुनिया के सात अजूबों में से एक माना जाता है।",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "12 मिनट"
      },
      'दिवाली': {
        text: "दिवाली, जिसे रोशनी का त्योहार भी कहा जाता है, भारत भर में मनाया जाने वाला सबसे महत्वपूर्ण हिंदू त्योहार है। यह 14 साल के वनवास के बाद भगवान राम की अयोध्या वापसी का प्रतीक है। यह त्योहार तेल के दीये जलाकर, घरों को सजाकर, उपहारों का आदान-प्रदान करके और आतिशबाजी का आनंद लेकर मनाया जाता है।",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "6 मिनट"
      },
      'होली': {
        text: "होली भारत भर में मनाया जाने वाला रंगों का जीवंत त्योहार है। यह वसंत के आगमन और बुराई पर अच्छाई की जीत का प्रतीक है। यह त्योहार लोगों द्वारा एक-दूसरे पर रंगीन पाउडर और पानी फेंकने के लिए प्रसिद्ध है। यह प्रह्लाद और होलिका की कथा पर आधारित है।",
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: "5 मिनट"
      },
      'default': {
        text: "मैं आपको भारतीय विरासत और संस्कृति के बारे में जानने में मदद करने के लिए खुश हूँ! आप मुझसे दुर्गा पूजा, दिवाली, होली जैसे त्योहारों या ताज महल जैसे स्मारकों के बारे में पूछ सकते हैं। आप क्या जानना चाहते हैं?",
        youtube: null,
        duration: null
      }
    }
  }

  // Chatbot functions
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response after delay
    setTimeout(() => {
      const response = getChatbotResponse(inputMessage.toLowerCase())
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        youtube: response.youtube,
        duration: response.duration,
        isUser: false,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getChatbotResponse = (message) => {
    const responses = chatbotResponses[language]
    const lowerMessage = message.toLowerCase()
    
    // Check for specific keywords
    for (const key in responses) {
      if (lowerMessage.includes(key)) {
        return responses[key]
      }
    }
    
    return responses.default
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'hindi' : 'english')
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
            {t('stories.title').split(' ')[0]} <span className="text-gradient">{t('stories.subtitle')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('stories.description')}
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              className="px-6 py-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-gray-700 hover:text-saffron-600 font-medium"
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card p-6 hover:scale-105 group cursor-pointer h-full flex flex-col"
              onClick={() => setSelectedStory(story)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-4xl">{story.image}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-saffron-600 transition-colors duration-200">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-600">{story.category}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-3">{story.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {story.duration}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    {story.rating}
                  </div>
                </div>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 text-red-400 mr-1" />
                  {story.likes}
                </div>
              </div>
              
              <button className="w-full btn-primary flex items-center justify-center mt-auto">
                <Play className="w-4 h-4 mr-2" />
                {t('stories.startStory')}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Story Player Modal */}
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Player Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedStory.image}</div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900">{selectedStory.title}</h2>
                    <p className="text-gray-600">{selectedStory.category} • {selectedStory.duration}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: selectedStory.title,
                          text: `Check out this story: ${selectedStory.title}`,
                          url: window.location.href
                        })
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href)
                        alert('Link copied to clipboard!')
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      const currentChapter = selectedStory.chapters[currentChapter]
                      if (currentChapter?.videoUrl) {
                        // Open download link in new tab
                        window.open(currentChapter.videoUrl.replace('/preview', ''), '_blank')
                      } else {
                        alert('No video available for download')
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Audio Player */}
              <div className="bg-gradient-to-r from-saffron-100 to-peacock-100 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying)
                      const current = selectedStory.chapters[currentChapter]
                      if (current?.videoUrl) {
                        window.open(current.videoUrl, '_blank', 'noopener,noreferrer')
                      }
                    }}
                    className="w-12 h-12 bg-saffron-500 hover:bg-saffron-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {selectedStory.chapters[currentChapter]?.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Chapter {currentChapter + 1} of {selectedStory.chapters.length}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-saffron-500 to-peacock-500 h-2 rounded-full w-1/3"></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>2:30</span>
                  <span>{selectedStory.chapters[currentChapter]?.duration}</span>
                </div>

                {/* Video Link (opens Google Drive preview) */}
                {selectedStory.chapters[currentChapter]?.videoUrl && (
                  <div className="mt-4">
                    <a
                      href={selectedStory.chapters[currentChapter].videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-white text-saffron-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Chapter Video
                    </a>
                  </div>
                )}
              </div>

              {/* Chapter Navigation */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Chapters</h4>
                <div className="space-y-2">
                  {selectedStory.chapters.map((chapter, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentChapter(index)}
                      className={`w-full text-left p-4 rounded-lg transition-colors duration-200 ${
                        currentChapter === index
                          ? 'bg-saffron-100 border-2 border-saffron-300'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">{chapter.title}</h5>
                          <p className="text-sm text-gray-600 mt-1">{chapter.content.substring(0, 100)}...</p>
                        </div>
                        <div className="text-sm text-gray-500">{chapter.duration}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                <button className="btn-secondary flex items-center">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </button>
                <button
                  className="btn-primary flex items-center"
                  onClick={() => {
                    const current = selectedStory.chapters[currentChapter]
                    if (current?.videoUrl) {
                      window.open(current.videoUrl, '_blank', 'noopener,noreferrer')
                    } else {
                      setIsPlaying(!isPlaying)
                    }
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-saffron-500 to-peacock-500 rounded-2xl p-8 text-white"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold mb-4">Enhanced Storytelling Features</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Our AI-powered platform brings history to life with immersive audio, interactive elements, and personalized experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Narration</h3>
              <p className="text-white/90">Natural voice synthesis with regional accents and emotional expression</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Immersive Audio</h3>
              <p className="text-white/90">3D spatial audio with ambient sounds and music from the era</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Elements</h3>
              <p className="text-white/90">Click to explore artifacts, view historical images, and access additional context</p>
            </div>
          </div>
        </motion.div>

        {/* AI Chatbot Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Ask Our <span className="text-gradient">AI Heritage Guide</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant answers about Indian culture, festivals, monuments, and history. 
              Our AI guide speaks both English and Hindi!
            </p>
          </div>

          {/* Chatbot Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="flex h-[600px]">
              {/* Chat Interface */}
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-saffron-500 to-peacock-500 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Heritage AI Guide</h3>
                      <p className="text-white/80 text-sm">Always here to help</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleLanguage}
                      className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{language === 'english' ? 'हिंदी' : 'English'}</span>
                    </button>
                    <button
                      onClick={() => setIsChatOpen(!isChatOpen)}
                      className="p-2 text-white hover:bg-white/20 rounded-full transition-colors duration-200"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-saffron-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bot className="w-8 h-8 text-saffron-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {language === 'english' ? 'Welcome to Heritage AI!' : 'हेरिटेज AI में आपका स्वागत है!'}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {language === 'english' 
                          ? 'Ask me about Indian festivals, monuments, or any cultural topic!'
                          : 'मुझसे भारतीय त्योहारों, स्मारकों या किसी भी सांस्कृतिक विषय के बारे में पूछें!'
                        }
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {language === 'english' ? (
                          <>
                            <button
                              onClick={() => setInputMessage('Tell me about Durga Puja')}
                              className="px-3 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm hover:bg-saffron-200 transition-colors"
                            >
                              Durga Puja
                            </button>
                            <button
                              onClick={() => setInputMessage('Tell me about Taj Mahal')}
                              className="px-3 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm hover:bg-saffron-200 transition-colors"
                            >
                              Taj Mahal
                            </button>
                            <button
                              onClick={() => setInputMessage('Tell me about Diwali')}
                              className="px-3 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm hover:bg-saffron-200 transition-colors"
                            >
                              Diwali
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setInputMessage('दुर्गा पूजा के बारे में बताएं')}
                              className="px-3 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm hover:bg-saffron-200 transition-colors"
                            >
                              दुर्गा पूजा
                            </button>
                            <button
                              onClick={() => setInputMessage('ताज महल के बारे में बताएं')}
                              className="px-3 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm hover:bg-saffron-200 transition-colors"
                            >
                              ताज महल
                            </button>
                            <button
                              onClick={() => setInputMessage('दिवाली के बारे में बताएं')}
                              className="px-3 py-1 bg-saffron-100 text-saffron-700 rounded-full text-sm hover:bg-saffron-200 transition-colors"
                            >
                              दिवाली
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                          <div className={`p-3 rounded-lg ${
                            message.isUser 
                              ? 'bg-saffron-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            {message.youtube && (
                              <div className="mt-3 pt-3 border-t border-white/20">
                                <a
                                  href={message.youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
                                >
                                  <Youtube className="w-4 h-4" />
                                  <span className="text-sm">
                                    {language === 'english' ? 'Watch Video' : 'वीडियो देखें'}
                                  </span>
                                  {message.duration && (
                                    <span className="text-xs opacity-75">({message.duration})</span>
                                  )}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.isUser ? 'bg-saffron-500 order-1 ml-2' : 'bg-peacock-500 order-2 mr-2'
                        }`}>
                          {message.isUser ? (
                            <span className="text-white text-sm font-semibold">U</span>
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={language === 'english' ? 'Ask about Indian heritage...' : 'भारतीय विरासत के बारे में पूछें...'}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="px-4 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-1"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Animated Avatar */}
              <div className="w-80 bg-gradient-to-b from-peacock-100 to-saffron-100 flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-32 h-32 bg-gradient-to-br from-saffron-400 to-peacock-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <Bot className="w-16 h-16 text-white" />
                  </motion.div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'english' ? 'AI Heritage Guide' : 'AI हेरिटेज गाइड'}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4">
                    {language === 'english' 
                      ? 'Your virtual companion for exploring Indian culture'
                      : 'भारतीय संस्कृति की खोज के लिए आपका आभासी साथी'
                    }
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{language === 'english' ? '24/7 Available' : '24/7 उपलब्ध'}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{language === 'english' ? 'Bilingual Support' : 'द्विभाषी समर्थन'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.7, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-10 right-10 text-2xl"
                >
                  🏛️
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="absolute bottom-20 left-10 text-xl"
                >
                  🎭
                </motion.div>
                <motion.div
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0.2, 0.6, 0.2]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute top-1/2 left-5 text-lg"
                >
                  🕉️
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
