import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gamepad2, Trophy, Star, Clock, Users, Target, Zap, BookOpen, MapPin, Camera, CheckCircle, RotateCcw, Award, Puzzle, Shirt, Brain, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const GamesPage = () => {
  const { t } = useTranslation()
  // Game states
  const [activeGame, setActiveGame] = useState(null)
  const [gameProgress, setGameProgress] = useState({
    attireMatch: { completed: 0, total: 6, score: 0 },
    tajPuzzle: { completed: 0, total: 1, score: 0 },
    quizTrivia: { completed: 0, total: 10, score: 0 }
  })
  const [userBadges, setUserBadges] = useState([])
  const [showBadge, setShowBadge] = useState(null)
  
  // User stats
  const [userLevel, setUserLevel] = useState(1)
  const [userXP, setUserXP] = useState(0)
  const [userCoins, setUserCoins] = useState(0)
  
  // Game-specific states
  const [attireMatches, setAttireMatches] = useState([])
  const [puzzlePieces, setPuzzlePieces] = useState([])
  const [quizQuestions, setQuizQuestions] = useState([])
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showQuizResult, setShowQuizResult] = useState(false)
  
  // Puzzle game states
  const [puzzleTiles, setPuzzleTiles] = useState([])
  const [selectedTile, setSelectedTile] = useState(null)
  const [puzzleMoves, setPuzzleMoves] = useState(0)
  const [puzzleTime, setPuzzleTime] = useState(0)
  const [puzzleTimer, setPuzzleTimer] = useState(null)
  const [puzzleSolved, setPuzzleSolved] = useState(false)
  const [showPuzzleSuccess, setShowPuzzleSuccess] = useState(false)
  const [bestTime, setBestTime] = useState(null)
  const [bestMoves, setBestMoves] = useState(null)

  // Game data
  const games = [
    {
      id: 1,
      title: 'Attire Match Challenge',
      category: 'Cultural Learning',
      difficulty: 'Easy',
      duration: '5 min',
      xpReward: 50,
      coinReward: 25,
      image: '👗',
      description: 'Match traditional Indian attire with their respective states. Drag and drop to learn about regional clothing!',
      icon: Shirt,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 2,
      title: 'Taj Mahal Puzzle',
      category: 'Puzzle',
      difficulty: 'Medium',
      duration: '8 min',
      xpReward: 75,
      coinReward: 40,
      image: '🏛️',
      description: 'Piece together the magnificent Taj Mahal! Drag the puzzle pieces to complete this architectural wonder.',
      icon: Puzzle,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: 'Festival Quiz Trivia',
      category: 'Knowledge',
      difficulty: 'Medium',
      duration: '10 min',
      xpReward: 100,
      coinReward: 50,
      image: '🧠',
      description: 'Test your knowledge of Indian festivals and cultural traditions with multiple choice questions.',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500'
    }
  ]

  // Attire matching data
  const attireData = [
    { id: 1, name: 'Saree', state: 'West Bengal', image: '👗', description: 'Traditional Bengali saree with red border' },
    { id: 2, name: 'Lehenga Choli', state: 'Rajasthan', image: '👘', description: 'Colorful Rajasthani traditional dress' },
    { id: 3, name: 'Mundu', state: 'Kerala', image: '🩳', description: 'White dhoti worn in Kerala' },
    { id: 4, name: 'Phiran', state: 'Kashmir', image: '🧥', description: 'Warm woolen garment from Kashmir' },
    { id: 5, name: 'Mekhela Chador', state: 'Assam', image: '👘', description: 'Traditional Assamese two-piece garment' },
    { id: 6, name: 'Pheran', state: 'Punjab', image: '👕', description: 'Traditional Punjabi long shirt' }
  ]

  // Quiz questions data
  const quizData = [
    {
      question: 'Which festival is known as the "Festival of Lights"?',
      options: ['Holi', 'Diwali', 'Dussehra', 'Navratri'],
      correct: 1,
      explanation: 'Diwali is celebrated as the Festival of Lights, symbolizing the victory of light over darkness.'
    },
    {
      question: 'Durga Puja is primarily celebrated in which state?',
      options: ['Maharashtra', 'West Bengal', 'Tamil Nadu', 'Gujarat'],
      correct: 1,
      explanation: 'Durga Puja is most prominently celebrated in West Bengal, especially in Kolkata.'
    },
    {
      question: 'What is the main sweet prepared during Holi?',
      options: ['Gulab Jamun', 'Gujiya', 'Rasgulla', 'Barfi'],
      correct: 1,
      explanation: 'Gujiya is the traditional sweet made during Holi celebrations.'
    },
    {
      question: 'Which festival marks the beginning of the harvest season?',
      options: ['Makar Sankranti', 'Karva Chauth', 'Teej', 'Karva Chauth'],
      correct: 0,
      explanation: 'Makar Sankranti marks the beginning of the harvest season and the sun\'s northward journey.'
    },
    {
      question: 'Onam is the state festival of which Indian state?',
      options: ['Karnataka', 'Kerala', 'Tamil Nadu', 'Andhra Pradesh'],
      correct: 1,
      explanation: 'Onam is the state festival of Kerala, celebrating the return of King Mahabali.'
    },
    {
      question: 'Which festival involves flying kites?',
      options: ['Makar Sankranti', 'Holi', 'Diwali', 'Dussehra'],
      correct: 0,
      explanation: 'Makar Sankranti is famous for kite flying, especially in Gujarat and Rajasthan.'
    },
    {
      question: 'Ganesh Chaturthi is celebrated for how many days?',
      options: ['5 days', '7 days', '10 days', '15 days'],
      correct: 2,
      explanation: 'Ganesh Chaturthi is typically celebrated for 10 days, ending with Ganesh Visarjan.'
    },
    {
      question: 'Which festival is associated with the worship of Goddess Saraswati?',
      options: ['Vasant Panchami', 'Navratri', 'Durga Puja', 'Karva Chauth'],
      correct: 0,
      explanation: 'Vasant Panchami is dedicated to Goddess Saraswati, the deity of knowledge and learning.'
    },
    {
      question: 'Pongal is celebrated in which state?',
      options: ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh'],
      correct: 1,
      explanation: 'Pongal is the harvest festival of Tamil Nadu, celebrated in January.'
    },
    {
      question: 'Which festival involves the burning of effigies?',
      options: ['Diwali', 'Dussehra', 'Holi', 'Navratri'],
      correct: 1,
      explanation: 'Dussehra involves burning effigies of Ravana, symbolizing the victory of good over evil.'
    }
  ]

  // Badge system
  const badges = [
    { id: 1, name: 'Fashion Expert', description: 'Complete Attire Match Challenge', icon: '👗', color: 'pink', requirement: 'attireMatch' },
    { id: 2, name: 'Monument Explorer', description: 'Complete Taj Mahal Image Puzzle', icon: '🏛️', color: 'blue', requirement: 'tajPuzzle' },
    { id: 3, name: 'Quiz Champion', description: 'Score 80%+ in Festival Quiz', icon: '🏆', color: 'purple', requirement: 'quizTrivia' },
    { id: 4, name: 'Cultural Scholar', description: 'Complete all three games', icon: '🎓', color: 'gold', requirement: 'allGames' },
    { id: 5, name: 'Perfect Score', description: 'Get 100% in any game', icon: '⭐', color: 'yellow', requirement: 'perfectScore' }
  ]

  // Initialize games
  useEffect(() => {
    initializeAttireMatch()
    initializePuzzle()
    setQuizQuestions(quizData)
    loadBestScores()
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (puzzleTimer) {
        clearInterval(puzzleTimer)
      }
    }
  }, [puzzleTimer])

  // Load best scores from localStorage
  const loadBestScores = () => {
    const savedBestTime = localStorage.getItem('tajPuzzleBestTime')
    const savedBestMoves = localStorage.getItem('tajPuzzleBestMoves')
    setBestTime(savedBestTime ? parseInt(savedBestTime) : null)
    setBestMoves(savedBestMoves ? parseInt(savedBestMoves) : null)
  }

  const initializeAttireMatch = () => {
    const shuffled = [...attireData].sort(() => Math.random() - 0.5)
    setAttireMatches(shuffled.map((item, index) => ({
      ...item,
      position: index,
      matched: false,
      targetState: null
    })))
  }

  const initializePuzzle = () => {
    // Create 9 tiles with actual image pieces (8 puzzle pieces + 1 empty)
    const tiles = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      position: i,
      correctPosition: i,
      isEmpty: i === 8, // Last tile is empty
      imageUrl: i === 8 ? null : `/assets/monuments/tajmahal.png`,
      imagePosition: i === 8 ? null : {
        x: (i % 3) * 33.33, // Percentage position for background-position
        y: Math.floor(i / 3) * 33.33
      },
      isPlaced: false
    }))
    
    // Shuffle tiles using a solvable algorithm
    const shuffled = [...tiles]
    // Move empty tile to random position first
    const emptyPosition = Math.floor(Math.random() * 9)
    const emptyTile = shuffled[8]
    const targetTile = shuffled[emptyPosition]
    
    // Swap empty tile with target position
    shuffled[8] = targetTile
    shuffled[emptyPosition] = emptyTile
    
    // Update positions
    shuffled.forEach((tile, index) => {
      tile.position = index
    })
    
    setPuzzleTiles(shuffled)
    setPuzzleMoves(0)
    setPuzzleTime(0)
    setPuzzleSolved(false)
    setSelectedTile(null)
  }

  // Game functions
  const startGame = (gameId) => {
    setActiveGame(gameId)
    if (gameId === 1) initializeAttireMatch()
    if (gameId === 2) {
      initializePuzzle()
      startPuzzleTimer()
    }
    if (gameId === 3) {
      setCurrentQuiz(0)
      setQuizScore(0)
      setSelectedAnswer(null)
      setShowQuizResult(false)
    }
  }

  // Puzzle timer functions
  const startPuzzleTimer = () => {
    if (puzzleTimer) clearInterval(puzzleTimer)
    const timer = setInterval(() => {
      setPuzzleTime(prev => prev + 1)
    }, 1000)
    setPuzzleTimer(timer)
  }

  const stopPuzzleTimer = () => {
    if (puzzleTimer) {
      clearInterval(puzzleTimer)
      setPuzzleTimer(null)
    }
  }

  // Puzzle game functions
  const handleTileClick = (tileId) => {
    if (puzzleSolved) return

    const tile = puzzleTiles.find(t => t.id === tileId)
    if (!tile || tile.isEmpty) return

    // Find empty tile
    const emptyTile = puzzleTiles.find(t => t.isEmpty)
    if (!emptyTile) return

    // Check if clicked tile is adjacent to empty tile
    const tilePos = tile.position
    const emptyPos = emptyTile.position
    const tileRow = Math.floor(tilePos / 3)
    const tileCol = tilePos % 3
    const emptyRow = Math.floor(emptyPos / 3)
    const emptyCol = emptyPos % 3

    const isAdjacent = (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
                      (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow)

    if (isAdjacent) {
      // Move tile to empty position
      setPuzzleTiles(prev => prev.map(t => {
        if (t.id === tileId) return { ...t, position: emptyPos }
        if (t.id === emptyTile.id) return { ...t, position: tilePos }
        return t
      }))
      
      setPuzzleMoves(prev => prev + 1)
      checkPuzzleSolved()
    }
  }

  const checkPuzzleSolved = () => {
    const isSolved = puzzleTiles.every(tile => 
      tile.isEmpty || tile.position === tile.correctPosition
    )
    
    if (isSolved) {
      setPuzzleSolved(true)
      stopPuzzleTimer()
      updateProgress('tajPuzzle', 1)
      addXP(25)
      addCoins(15)
      
      // Save best scores
      if (!bestTime || puzzleTime < bestTime) {
        setBestTime(puzzleTime)
        localStorage.setItem('tajPuzzleBestTime', puzzleTime.toString())
      }
      if (!bestMoves || puzzleMoves < bestMoves) {
        setBestMoves(puzzleMoves)
        localStorage.setItem('tajPuzzleBestMoves', puzzleMoves.toString())
      }
      
      // Award Monument Explorer badge
      if (!userBadges.includes('Monument Explorer')) {
        setUserBadges(prev => [...prev, 'Monument Explorer'])
        setShowBadge('Monument Explorer')
        setTimeout(() => setShowBadge(null), 3000)
      }
      
      setShowPuzzleSuccess(true)
      setTimeout(() => setShowPuzzleSuccess(false), 5000)
    }
  }

  const resetPuzzle = () => {
    stopPuzzleTimer()
    initializePuzzle()
    startPuzzleTimer()
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAttireMatch = (attireId, stateName) => {
    setAttireMatches(prev => prev.map(item => {
      if (item.id === attireId) {
        const isCorrect = item.state === stateName
        if (isCorrect) {
          updateProgress('attireMatch', 1)
          addXP(10)
          addCoins(5)
        }
        return { ...item, matched: isCorrect, targetState: stateName }
      }
      return item
    }))
  }

  const handlePuzzleMove = (pieceId, newPosition) => {
    setPuzzlePieces(prev => prev.map(piece => {
      if (piece.id === pieceId) {
        const isCorrect = newPosition === piece.correctPosition
        if (isCorrect) {
          updateProgress('tajPuzzle', 1)
          addXP(15)
          addCoins(8)
        }
        return { ...piece, position: newPosition, isPlaced: isCorrect }
      }
      return piece
    }))
  }

  const handleQuizAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex)
    const isCorrect = answerIndex === quizData[currentQuiz].correct
    if (isCorrect) {
      setQuizScore(prev => prev + 1)
      addXP(10)
      addCoins(5)
    }
    setShowQuizResult(true)
  }

  const nextQuiz = () => {
    if (currentQuiz < quizData.length - 1) {
      setCurrentQuiz(prev => prev + 1)
      setSelectedAnswer(null)
      setShowQuizResult(false)
    } else {
      const percentage = (quizScore / quizData.length) * 100
      updateProgress('quizTrivia', percentage >= 80 ? 1 : 0)
      if (percentage >= 80) {
        addXP(20)
        addCoins(10)
      }
      setActiveGame(null)
    }
  }

  const updateProgress = (gameType, increment) => {
    setGameProgress(prev => ({
      ...prev,
      [gameType]: {
        ...prev[gameType],
        completed: prev[gameType].completed + increment
      }
    }))
    checkBadges()
  }

  const addXP = (amount) => {
    setUserXP(prev => {
      const newXP = prev + amount
      const newLevel = Math.floor(newXP / 100) + 1
      setUserLevel(newLevel)
      return newXP
    })
  }

  const addCoins = (amount) => {
    setUserCoins(prev => prev + amount)
  }

  const checkBadges = () => {
    const newBadges = []
    
    if (gameProgress.attireMatch.completed >= gameProgress.attireMatch.total && !userBadges.includes('Fashion Expert')) {
      newBadges.push('Fashion Expert')
    }
    if (gameProgress.tajPuzzle.completed >= gameProgress.tajPuzzle.total && !userBadges.includes('Puzzle Master')) {
      newBadges.push('Puzzle Master')
    }
    if (gameProgress.quizTrivia.completed >= gameProgress.quizTrivia.total && !userBadges.includes('Quiz Champion')) {
      newBadges.push('Quiz Champion')
    }
    
    if (newBadges.length > 0) {
      setUserBadges(prev => [...prev, ...newBadges])
      setShowBadge(newBadges[0])
      setTimeout(() => setShowBadge(null), 3000)
    }
  }

  const getTotalProgress = () => {
    const totalCompleted = Object.values(gameProgress).reduce((sum, game) => sum + game.completed, 0)
    const totalGames = Object.values(gameProgress).reduce((sum, game) => sum + game.total, 0)
    return Math.round((totalCompleted / totalGames) * 100)
  }

  const getPuzzleProgress = () => {
    if (puzzleTiles.length === 0) return 0
    const correctTiles = puzzleTiles.filter(tile => 
      tile.isEmpty || tile.position === tile.correctPosition
    ).length
    return Math.round((correctTiles / puzzleTiles.length) * 100)
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
            {t('games.title').split(' ')[0]} <span className="text-gradient">{t('games.subtitle')}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('games.description')}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t('games.overallProgress')}</h3>
            <span className="text-sm text-gray-600">{getTotalProgress()}% {t('games.complete')}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-saffron-500 to-peacock-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getTotalProgress()}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Attire Match: {gameProgress.attireMatch.completed}/{gameProgress.attireMatch.total}</span>
            <span>Puzzle: {gameProgress.tajPuzzle.completed}/{gameProgress.tajPuzzle.total}</span>
            <span>Quiz: {gameProgress.quizTrivia.completed}/{gameProgress.quizTrivia.total}</span>
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-saffron-500 to-saffron-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">Level {userLevel}</div>
            <div className="text-sm text-gray-600">{t('games.heritageExplorer')}</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-peacock-500 to-peacock-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userXP}</div>
            <div className="text-sm text-gray-600">{t('games.experiencePoints')}</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userCoins}</div>
            <div className="text-sm text-gray-600">{t('games.heritageCoins')}</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{userBadges.length}</div>
            <div className="text-sm text-gray-600">{t('games.badgesEarned')}</div>
          </div>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card p-6 hover:scale-105 group cursor-pointer"
              onClick={() => startGame(game.id)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-full flex items-center justify-center`}>
                  <game.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-saffron-600 transition-colors duration-200">
                    {game.title}
                  </h3>
                  <p className="text-sm text-gray-600">{game.category} • {game.difficulty}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{game.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {game.duration}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-saffron-100 text-saffron-700 text-xs rounded-full">
                    +{game.xpReward} XP
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    +{game.coinReward} Coins
                  </span>
                </div>
              </div>
              
              <button className="w-full btn-primary flex items-center justify-center">
                <Gamepad2 className="w-4 h-4 mr-2" />
                {t('games.playNow')}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Game Modals */}
        <AnimatePresence>
          {/* Attire Match Game */}
          {activeGame === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setActiveGame(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Attire Match Challenge</h2>
                <button
                    onClick={() => setActiveGame(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Traditional Attire</h3>
                    <div className="space-y-3">
                      {attireMatches.map((attire) => (
                        <div
                          key={attire.id}
                          className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                            attire.matched 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-saffron-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{attire.image}</span>
                  <div>
                              <div className="font-medium">{attire.name}</div>
                              <div className="text-sm text-gray-600">{attire.description}</div>
                            </div>
                          </div>
                  </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Match with States</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['West Bengal', 'Rajasthan', 'Kerala', 'Kashmir', 'Assam', 'Punjab'].map((state) => (
                        <button
                          key={state}
                          className="p-3 border-2 border-gray-200 rounded-lg hover:border-saffron-300 transition-colors"
                          onClick={() => {
                            // Simple matching logic - in real app, you'd have drag & drop
                            const attire = attireMatches.find(a => a.state === state && !a.matched)
                            if (attire) {
                              handleAttireMatch(attire.id, state)
                            }
                          }}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Taj Mahal Puzzle Game */}
          {activeGame === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setActiveGame(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Taj Mahal Puzzle</h2>
                  <button
                    onClick={() => setActiveGame(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Game Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">{formatTime(puzzleTime)}</div>
                    <div className="text-sm text-blue-600">Time</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-600">{puzzleMoves}</div>
                    <div className="text-sm text-green-600">Moves</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-lg font-bold text-purple-600">
                      {bestTime ? formatTime(bestTime) : '--:--'}
                    </div>
                    <div className="text-sm text-purple-600">Best Time</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-lg font-bold text-yellow-600">
                      {bestMoves || '--'}
                    </div>
                    <div className="text-sm text-yellow-600">Best Moves</div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Puzzle Progress</span>
                    <span className="text-sm text-gray-600">{getPuzzleProgress()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-saffron-500 to-peacock-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getPuzzleProgress()}%` }}
                    ></div>
                  </div>
                </div>

                {/* Puzzle Board with Reference Image */}
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-6">
                  {/* Reference Image */}
                  <div className="flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Reference</h3>
                    <div className="w-32 h-32 md:w-40 md:h-40 border-2 border-saffron-300 rounded-lg overflow-hidden shadow-lg bg-white">
                      <img 
                        src="/assets/monuments/tajmahal.png" 
                        alt="Taj Mahal Reference"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-saffron-400 to-peacock-500 flex items-center justify-center text-white font-bold text-sm" style={{display: 'none'}}>
                        Taj Mahal
                      </div>
                        </div>
                      </div>

                  {/* Puzzle Grid */}
                  <div className="flex-shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Puzzle</h3>
                    <div className="grid grid-cols-3 gap-1 bg-gradient-to-br from-saffron-100 to-peacock-100 p-3 rounded-xl shadow-lg border-2 border-saffron-200">
                      {Array.from({ length: 9 }, (_, index) => {
                        const tile = puzzleTiles.find(t => t.position === index)
                        const isEmpty = tile?.isEmpty
                        const isAdjacentToEmpty = tile && !isEmpty && (() => {
                          const emptyTile = puzzleTiles.find(t => t.isEmpty)
                          if (!emptyTile) return false
                          const tilePos = tile.position
                          const emptyPos = emptyTile.position
                          const tileRow = Math.floor(tilePos / 3)
                          const tileCol = tilePos % 3
                          const emptyRow = Math.floor(emptyPos / 3)
                          const emptyCol = emptyPos % 3
                          return (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
                                 (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow)
                        })()
                        
                        return (
                          <motion.div
                            key={index}
                            className={`w-24 h-24 md:w-28 md:h-28 border-2 rounded-lg cursor-pointer transition-all duration-300 overflow-hidden ${
                              isEmpty
                                ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-400'
                                : puzzleSolved
                                ? 'border-green-500 shadow-lg bg-green-50'
                                : isAdjacentToEmpty
                                ? 'border-saffron-500 bg-saffron-50 shadow-md hover:border-saffron-600 hover:shadow-lg'
                                : 'border-gray-300 bg-white hover:border-peacock-400 hover:shadow-md'
                            }`}
                            onClick={() => tile && !isEmpty && handleTileClick(tile.id)}
                            whileHover={!isEmpty ? { scale: 1.05 } : {}}
                            whileTap={!isEmpty ? { scale: 0.95 } : {}}
                          >
                            {!isEmpty ? (
                              <div 
                                className="w-full h-full bg-cover bg-no-repeat"
                                style={{
                                  backgroundImage: `url(${tile.imageUrl})`,
                                  backgroundPosition: `${tile.imagePosition.x}% ${tile.imagePosition.y}%`,
                                  backgroundSize: '300% 300%'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                  e.target.nextSibling.style.display = 'flex'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <div className="text-gray-500 text-xs font-medium">Empty</div>
                              </div>
                            )}
                            {/* Fallback for missing image */}
                            {!isEmpty && (
                              <div 
                                className="w-full h-full bg-gradient-to-br from-saffron-400 to-peacock-500 flex items-center justify-center text-white font-bold text-sm"
                                style={{display: 'none'}}
                              >
                                {tile.id + 1}
                      </div>
                            )}
                          </motion.div>
                        )
                      })}
                      </div>
                    </div>
                  </div>

                {/* Instructions */}
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2">
                    {puzzleSolved 
                      ? '🎉 Congratulations! You completed the Taj Mahal Puzzle!' 
                      : 'Click on tiles adjacent to the empty space to slide them. Use the reference image to reconstruct the Taj Mahal.'
                    }
                  </p>
                  {!puzzleSolved && (
                    <p className="text-sm text-gray-500">
                      Movable tiles are highlighted in saffron • Match the reference image
                    </p>
                  )}
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={resetPuzzle}
                    className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center space-x-2 shadow-md"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                  <button
                    onClick={() => setActiveGame(null)}
                    className="px-6 py-2 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-lg hover:from-saffron-600 hover:to-saffron-700 transition-all duration-200 shadow-md"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Quiz Trivia Game */}
          {activeGame === 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setActiveGame(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Festival Quiz Trivia</h2>
                  <button
                    onClick={() => setActiveGame(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                      </div>
                
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">
                      Question {currentQuiz + 1} of {quizData.length}
                      </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuiz + 1) / quizData.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {quizData[currentQuiz]?.question}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {quizData[currentQuiz]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuizAnswer(index)}
                        disabled={showQuizResult}
                        className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                          showQuizResult
                            ? index === quizData[currentQuiz].correct
                              ? 'border-green-500 bg-green-50 text-green-700'
                              : selectedAnswer === index
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-gray-200 bg-gray-50'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        {option}
                    </button>
                    ))}
                  </div>
                  
                  {showQuizResult && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        {quizData[currentQuiz]?.explanation}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <div className="text-sm text-gray-600">
                      Score: {quizScore}/{currentQuiz + 1}
                    </div>
                    <button
                      onClick={nextQuiz}
                      className="btn-primary"
                    >
                      {currentQuiz < quizData.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge Notification */}
        <AnimatePresence>
          {showBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-xl shadow-xl z-50"
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">🏆</div>
                <div>
                  <h4 className="font-bold text-lg">Badge Earned!</h4>
                  <p className="text-sm">{showBadge}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Puzzle Success Popup with Confetti */}
        <AnimatePresence>
          {showPuzzleSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center relative overflow-hidden"
              >
                {/* Confetti Animation */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                      initial={{ 
                        x: Math.random() * 400, 
                        y: -10, 
                        rotate: 0,
                        scale: 1
                      }}
                      animate={{ 
                        y: 400, 
                        rotate: 360,
                        scale: 0,
                        x: Math.random() * 400
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: Math.random() * 0.5,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-6xl mb-4"
                  >
                    🎉
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Congratulations!
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    You completed the Taj Mahal Puzzle! 🏛️
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-700 font-medium">
                      🏆 Monument Explorer Badge Earned!
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      You've mastered the art of reconstructing architectural wonders!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{formatTime(puzzleTime)}</div>
                      <div className="text-sm text-blue-600">Time</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{puzzleMoves}</div>
                      <div className="text-sm text-green-600">Moves</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setShowPuzzleSuccess(false)
                        resetPuzzle()
                      }}
                      className="flex-1 px-4 py-2 bg-saffron-500 text-white rounded-lg hover:bg-saffron-600 transition-colors"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => {
                        setShowPuzzleSuccess(false)
                        setActiveGame(null)
                      }}
                      className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-saffron-500 to-peacock-500 rounded-2xl p-8 text-white"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold mb-4">Cultural Badges</h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Earn special badges by completing games and mastering Indian heritage knowledge.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-6 rounded-xl transition-all duration-300 ${
                  userBadges.includes(badge.name)
                    ? 'bg-white/20 border-2 border-white/30'
                    : 'bg-white/10 border-2 border-white/20 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{badge.name}</h3>
                    <p className="text-white/80 text-sm">{badge.description}</p>
                    {userBadges.includes(badge.name) && (
                      <span className="text-xs text-yellow-300 font-medium">✓ Earned</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
