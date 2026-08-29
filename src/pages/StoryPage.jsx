import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MessageCircle,
  Send,
  Bot,
  Globe,
  Clock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Compass,
  Feather,
  Layers,
  MapPin,
  Tag
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const StoryPage = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // Selected Heritage Site Context (from query params or default)
  const searchParams = new URLSearchParams(location.search);
  const initialSiteFromUrl = searchParams.get('site') || searchParams.get('monument') || 'Konark Sun Temple';

  const [selectedHeritageSite, setSelectedHeritageSite] = useState(initialSiteFromUrl);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState(null);

  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'mr' | 'ta'
  const [chatError, setChatError] = useState(null);

  // AI Story Generator States
  const [storytellingMode, setStorytellingMode] = useState('historical'); // 'historical' | 'children' | 'cultural' | 'short'
  const [customStoryPrompt, setCustomStoryPrompt] = useState('');
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(null);
  const [storyError, setStoryError] = useState(null);

  const chatScrollRef = useRef(null);

  // Languages list
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
  ];

  // Pre-configured Heritage Sites for Context Dropdown
  const HERITAGE_SITES = [
    { id: 'konark-sun-temple', name: 'Konark Sun Temple', location: 'Odisha', category: 'Temple Architecture' },
    { id: 'taj-mahal', name: 'Taj Mahal', location: 'Agra, Uttar Pradesh', category: 'Royal Monument' },
    { id: 'hampi', name: 'Hampi Vijayanagara Ruins', location: 'Karnataka', category: 'Ancient Capital' },
    { id: 'ashoka-pillar', name: 'Lion Capital of Ashoka', location: 'Sarnath, UP', category: 'Mauryan Emblem' },
    { id: 'sanchi-stupa', name: 'Great Stupa of Sanchi', location: 'Madhya Pradesh', category: 'Buddhist Heritage' },
    { id: 'ajanta-caves', name: 'Ajanta & Ellora Caves', location: 'Maharashtra', category: 'Cave Paintings' },
    { id: 'nataraja-temple', name: 'Chola Bronzes & Nataraja', location: 'Tamil Nadu', category: 'Sculpture' }
  ];

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
          content: 'In the bustling city of Agra, Emperor Shah Jahan fell deeply in love with Mumtaz Mahal...',
          duration: '3 min'
        },
        {
          title: 'The Promise',
          content: 'On her deathbed, Mumtaz Mahal made Shah Jahan promise to build a monument representing eternal love...',
          duration: '4 min'
        },
        {
          title: 'The Masterpiece',
          content: 'For 22 years, 20,000 artisans worked tirelessly to create this architectural marvel...',
          duration: '5 min'
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
      description: 'Uncover the secrets of the ancient Vijayanagara Empire and its stone chariot monuments.',
      chapters: [
        { title: 'The Golden City', content: 'Hampi was once the capital of the mighty Vijayanagara Empire...', duration: '4 min' },
        { title: 'The Fall', content: 'Despite its grandeur, the empire left behind magnificent stone ruins...', duration: '5 min' }
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
        { title: 'The Discovery', content: 'In 1819, officers discovered hidden caves carved deep inside hills...', duration: '10 min' }
      ]
    }
  ];

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  // Handle Real Generative AI Chatbot Request
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMsgText = inputMessage.trim();
    const userMessageObj = {
      id: Date.now(),
      text: userMsgText,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages((prev) => [...prev, userMessageObj]);
    setInputMessage('');
    setIsTyping(true);
    setChatError(null);

    try {
      // Build conversation history payload
      const historyPayload = chatMessages.slice(-6).map((msg) => ({
        isUser: msg.isUser,
        text: msg.text
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userMsgText,
          heritageSite: selectedHeritageSite,
          language: language,
          conversationHistory: historyPayload
        })
      });

      const data = await res.json();

      if (data.success) {
        const botMessageObj = {
          id: Date.now() + 1,
          text: data.text,
          isUser: false,
          timestamp: new Date(),
          language: data.language
        };
        setChatMessages((prev) => [...prev, botMessageObj]);
      } else {
        setChatError(data.error || 'Failed to connect to Heritage AI Server.');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatError('Network error. Please check server connection.');
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Real AI Story Generation Request
  const handleGenerateStory = async () => {
    setIsGeneratingStory(true);
    setStoryError(null);

    try {
      const res = await fetch('/api/ai/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heritageSite: selectedHeritageSite,
          storytellingMode: storytellingMode,
          language: language,
          userPrompt: customStoryPrompt
        })
      });

      const data = await res.json();

      if (data.success) {
        setGeneratedStory(data);
      } else {
        setStoryError(data.error || 'Failed to generate story.');
      }
    } catch (err) {
      console.error('Story Generation error:', err);
      setStoryError('Network error connecting to AI backend.');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Text-To-Speech Narration for Generated Story
  const toggleSpeechNarration = (text) => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text.replace(/[#*]/g, ''));
        utterance.rate = 0.95;

        // Pick voice for language
        const langMap = { en: 'en-US', hi: 'hi-IN', mr: 'mr-IN', ta: 'ta-IN' };
        utterance.lang = langMap[language] || 'en-US';

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        setSpeechUtterance(utterance);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-peacock-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center space-x-2 bg-saffron-500/15 border border-saffron-400/30 text-saffron-800 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-saffron-600 animate-pulse" />
            <span>Generative AI Cultural HeritageVerse</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-display font-bold text-gray-900 leading-tight">
            Heritage <span className="text-gradient">AI Storyteller & Guide</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience Indian history brought to life through real Generative AI. Select a monument, choose a story style, and explore in your native language.
          </p>
        </motion.div>

        {/* Global Heritage Site Context Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-saffron-200/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-peacock-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              🏛️
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-saffron-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Active Heritage Site Context
              </span>
              <h3 className="text-lg sm:text-xl font-display font-bold text-gray-900">
                {selectedHeritageSite}
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Heritage Context Dropdown */}
            <div className="flex items-center space-x-2 bg-saffron-50 px-3 py-2 rounded-xl border border-saffron-200 text-sm">
              <Compass className="w-4 h-4 text-saffron-600" />
              <select
                value={selectedHeritageSite}
                onChange={(e) => setSelectedHeritageSite(e.target.value)}
                className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer"
              >
                {HERITAGE_SITES.map((site) => (
                  <option key={site.id} value={site.name}>
                    {site.name} ({site.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-white border border-saffron-200 rounded-xl p-1 shadow-sm">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center space-x-1 ${
                    language === lang.code
                      ? 'bg-saffron-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-saffron-50'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Section 1: Custom AI Heritage Story Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-saffron-200/80 shadow-xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-saffron-100 pb-4">
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
                <Feather className="w-6 h-6 text-saffron-600" /> Generative AI Story Studio
              </h2>
              <p className="text-sm text-gray-600">Generate context-rich heritage stories tailored to your preferred narrative style</p>
            </div>

            <button
              onClick={handleGenerateStory}
              disabled={isGeneratingStory}
              className="btn-primary text-sm px-6 py-2.5 shadow-lg flex items-center space-x-2"
            >
              {isGeneratingStory ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating AI Story...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Story</span>
                </>
              )}
            </button>
          </div>

          {/* Mode Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'historical', title: 'Historical Facts', icon: '📜', desc: 'Chronicles & Architecture' },
              { id: 'children', title: "Children's Tale", icon: '🧒', desc: 'Engaging & Inspiring' },
              { id: 'cultural', title: 'Legend & Folklore', icon: '🛕', desc: 'Myths & Traditional Beliefs' },
              { id: 'short', title: '2-Min Short Story', icon: '⏱️', desc: 'Concise & Dramatic' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setStorytellingMode(mode.id)}
                className={`p-4 rounded-2xl text-left border transition-all duration-300 ${
                  storytellingMode === mode.id
                    ? 'bg-gradient-to-br from-saffron-50 to-marigold-50 border-saffron-500 shadow-md ring-2 ring-saffron-400/40'
                    : 'bg-white hover:bg-saffron-50/50 border-gray-200'
                }`}
              >
                <div className="text-2xl mb-1">{mode.icon}</div>
                <div className="font-bold text-gray-900 text-sm">{mode.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{mode.desc}</div>
              </button>
            ))}
          </div>

          {/* Optional Prompt Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Optional: Add custom focus (e.g. 'Focus on the secret chambers' or 'Highlight the artisans')..."
              value={customStoryPrompt}
              onChange={(e) => setCustomStoryPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-saffron-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white transition-all shadow-inner"
            />
          </div>

          {/* Error Banner if Server API missing */}
          {storyError && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{storyError}</span>
            </div>
          )}

          {/* Generated AI Story Output Display Card */}
          {generatedStory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-700 relative overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-slate-700/80 pb-4">
                <div>
                  <span className="text-xs font-semibold text-saffron-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-saffron-400" /> AI Generated Heritage Narrative
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white mt-1">
                    {generatedStory.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSpeechNarration(generatedStory.story)}
                    className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-bold rounded-full transition-colors flex items-center space-x-1.5 shadow-md"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause Audio' : 'Listen Narration'}</span>
                  </button>

                  <button
                    onClick={handleGenerateStory}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-full transition-colors"
                    title="Regenerate Story"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-gray-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                {generatedStory.story}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-gray-400">
                <span>Site: {selectedHeritageSite}</span>
                <span>Language: {generatedStory.language}</span>
                <span>Style: {generatedStory.mode}</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Section 2: Interactive Real AI Chatbot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-saffron-200 max-w-5xl mx-auto"
        >
          <div className="flex flex-col md:flex-row h-[620px]">
            {/* Chat Messages Interface */}
            <div className="flex-1 flex flex-col h-full bg-slate-50/50">
              {/* Header */}
              <div className="bg-gradient-to-r from-saffron-500 via-marigold-500 to-peacock-500 p-4 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white leading-tight">Digital Bharat Heritage AI Guide</h3>
                    <p className="text-white/80 text-xs">Context: {selectedHeritageSite}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
                    {languages.find((l) => l.code === language)?.name}
                  </span>
                </div>
              </div>

              {/* Chat Message Window */}
              <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-saffron-100 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                      <Bot className="w-8 h-8 text-saffron-600 animate-bounce" />
                    </div>
                    <h4 className="text-xl font-display font-bold text-gray-900">
                      Namaste! Ask me anything about {selectedHeritageSite}
                    </h4>
                    <p className="text-gray-600 text-sm max-w-md mx-auto">
                      I am your context-aware Heritage AI Guide. Ask about architectural secrets, history, legends, or festivals in your native language.
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      {[
                        `Why was ${selectedHeritageSite} built?`,
                        `What are the major architectural features?`,
                        `Is there a popular folklore associated with it?`,
                        `Which dynasty constructed this site?`
                      ].map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => setInputMessage(prompt)}
                          className="px-3.5 py-1.5 bg-white text-saffron-700 border border-saffron-200 rounded-full text-xs font-medium hover:bg-saffron-50 shadow-sm transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[82%] ${msg.isUser ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                            msg.isUser
                              ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-br-none'
                              : 'bg-white text-gray-900 border border-gray-200/80 rounded-bl-none prose'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <div
                          className={`text-[10px] text-gray-400 mt-1 ${
                            msg.isUser ? 'text-right' : 'text-left'
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          msg.isUser
                            ? 'bg-saffron-600 order-1 ml-2'
                            : 'bg-gradient-to-br from-peacock-500 to-peacock-600 order-2 mr-2'
                        }`}
                      >
                        {msg.isUser ? (
                          <span className="text-white text-xs font-bold">U</span>
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </motion.div>
                  ))
                )}

                {/* Real Generative AI Thinking State */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl border border-saffron-200 shadow-sm flex items-center space-x-3 text-saffron-700 text-xs font-medium">
                      <Sparkles className="w-4 h-4 animate-spin text-saffron-500" />
                      <span>The Heritage Guide is exploring the story...</span>
                    </div>
                  </motion.div>
                )}

                {/* Chat Error Notice */}
                {chatError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{chatError}</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={`Ask AI about ${selectedHeritageSite}...`}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-saffron-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:bg-white shadow-inner"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Avatar Panel */}
            <div className="hidden md:flex w-80 bg-gradient-to-b from-peacock-50 via-white to-saffron-50 border-l border-saffron-100 p-6 flex-col items-center justify-between text-center relative overflow-hidden">
              <div className="space-y-4 my-auto">
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-28 h-28 bg-gradient-to-br from-saffron-400 to-peacock-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl border-4 border-white"
                >
                  <Bot className="w-14 h-14 text-white" />
                </motion.div>
                <div>
                  <h4 className="font-display font-bold text-gray-900 text-lg">AI Heritage Guide</h4>
                  <p className="text-gray-500 text-xs mt-1">Generative AI powered by Google Gemini</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-saffron-100 text-xs text-gray-600 space-y-2 text-left shadow-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500" />
                    <span>Historical Accuracy Grounding</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500" />
                    <span>Multilingual Output Support</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500" />
                    <span>Context-Aware Heritage QA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
