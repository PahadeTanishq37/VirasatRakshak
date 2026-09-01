import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MessageSquare, Star, Medal, Calendar, MapPin, Upload, HeartHandshake, BookOpen, PlusCircle, Music2, Palette, Theater, Landmark, SunMedium, Building2, ImageOff } from 'lucide-react'

const DATA_VERSION = 'v2' // increment when default image paths change

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

// One-time migration: clear stale story data when DATA_VERSION changes
if (typeof localStorage !== 'undefined') {
  const storedVersion = localStorage.getItem('community:dataVersion')
  if (storedVersion !== DATA_VERSION) {
    localStorage.removeItem('community:stories') // clear stale image paths
    localStorage.setItem('community:dataVersion', DATA_VERSION)
  }
}


const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 }
}

const cardHover = {
  hover: { y: -4, boxShadow: '0 12px 30px rgba(0,0,0,0.12)' }
}

// ─── Reusable Heritage Image Component ───────────────────────────────────────
// Handles loading shimmer, successful display, broken-image fallback, lazy load.
const HeritageImage = ({ src, alt, fallbackIcon = '🏛️', fallbackLabel = 'Heritage Image', className = '', credit }) => {
  const [status, setStatus] = useState('loading') // 'loading' | 'loaded' | 'error'

  const handleLoad = () => setStatus('loaded')
  const handleError = () => setStatus('error')

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 ${className}`}>
      {/* Shimmer placeholder while loading */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
          <div className="relative z-10 flex flex-col items-center gap-2 text-gray-400">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-amber-400 rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Actual image */}
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}

      {/* Polished fallback when image fails */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
          <span className="text-4xl mb-2">{fallbackIcon}</span>
          <span className="text-xs text-gray-500 font-medium px-3 text-center">{fallbackLabel}</span>
        </div>
      )}

      {/* Subtle credit badge */}
      {credit && status === 'loaded' && (
        <div className="absolute bottom-1 right-1 bg-black/40 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded opacity-70">
          {credit}
        </div>
      )}
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

const GradientButton = ({ children, onClick, className = '', type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg px-4 py-2 font-medium text-white bg-gradient-to-r from-teal-500 to-blue-600 shadow hover:from-teal-400 hover:to-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />
    </button>
  )
}

const DEFAULT_STORIES = [
  {
    id: 's1',
    title: "Grandmother's Monsoon Songs",
    description: 'Folksongs we sing in Konkan during first rains.',
    image: '/assets/stories/monsoon_songs.jpg',
    imageCredit: 'Illustrated by VirasatRakshak'
  },
  {
    id: 's2',
    title: 'Pattachitra Revival',
    description: 'How my village kept the art alive.',
    image: '/assets/stories/pattachitra.jpg',
    imageCredit: 'Illustrated by VirasatRakshak'
  },
  {
    id: 's3',
    title: 'Ramleela Memories',
    description: 'Backstage stories from Varanasi.',
    image: '/assets/stories/ramleela.jpg',
    imageCredit: 'Illustrated by VirasatRakshak'
  }
]

const sanitizeStories = (stored) => {
  if (!Array.isArray(stored) || stored.length === 0) return DEFAULT_STORIES
  return stored.map(story => {
    if (story.id === 's1' || story.title?.includes('Monsoon')) {
      return { ...story, image: '/assets/stories/monsoon_songs.jpg', imageCredit: 'Illustrated by VirasatRakshak' }
    }
    if (story.id === 's2' || story.title?.includes('Pattachitra')) {
      return { ...story, image: '/assets/stories/pattachitra.jpg', imageCredit: 'Illustrated by VirasatRakshak' }
    }
    if (story.id === 's3' || story.title?.includes('Ramleela')) {
      return { ...story, image: '/assets/stories/ramleela.jpg', imageCredit: 'Illustrated by VirasatRakshak' }
    }
    return story
  })
}

export const CommunityPage = () => {
  const [stories, setStories] = useState(() => sanitizeStories(loadFromStorage('community:stories', DEFAULT_STORIES)))

  const [adoptedSites, setAdoptedSites] = useState(() => loadFromStorage('community:adopted', []))
  const [points, setPoints] = useState(() => loadFromStorage('community:points', 0))
  const [badges, setBadges] = useState(() => loadFromStorage('community:badges', []))

  const [events, setEvents] = useState(() => loadFromStorage('community:events', [
    { id: 'e1', name: 'Handloom Workshop', date: '2025-10-21', location: 'Varanasi', description: 'Learn weaving basics with artisans.' },
    { id: 'e2', name: 'Kite Festival', date: '2025-01-14', location: 'Ahmedabad', description: 'Uttarayan celebration and kite show.' }
  ]))
  const [eventFilter, setEventFilter] = useState('upcoming')

  const [threads, setThreads] = useState(() => loadFromStorage('community:threads', [
    { id: 't1', title: 'Best monsoon snacks by region?', body: 'Share your picks!', comments: ['Bhutta + chai in Mumbai!', 'Pakoras in Delhi rains.'] },
    { id: 't2', title: 'Must-visit heritage during winter', body: 'Planning a trip.', comments: ['Hampi is magical in Dec.'] }
  ]))

  const artisans = useMemo(() => ([
    {
      id: 'a1',
      name: 'Savita Devi',
      craft: 'Madhubani Painting',
      story: 'Third-generation artist bringing new palettes to tradition.',
      photo: '/assets/stories/artisan_madhubani.jpg',
      photoCredit: 'Illustrated by VirasatRakshak'
    },
    {
      id: 'a2',
      name: 'Rafiq Khan',
      craft: 'Blue Pottery',
      story: 'Combines eco-glazes with classic motifs in Jaipur.',
      photo: '/assets/stories/artisan_madhubani.jpg',
      photoCredit: 'Illustrated by VirasatRakshak'
    },
    {
      id: 'a3',
      name: 'Lalitha',
      craft: 'Kalamkari',
      story: 'Hand-drawn narratives of epics on organic fabrics.',
      photo: '/assets/stories/artisan_madhubani.jpg',
      photoCredit: 'Illustrated by VirasatRakshak'
    }
  ]), [])

  const weekIndex = useMemo(() => {
    const onejan = new Date(new Date().getFullYear(), 0, 1)
    const today = new Date()
    const week = Math.ceil((((today - onejan) / 86400000) + onejan.getDay() + 1) / 7)
    return week
  }, [])
  const spotlight = artisans[weekIndex % artisans.length]

  // Heritage Adoption sites with real local images and credit
  const heritageSites = [
    {
      id: 'hampi',
      name: 'Hampi',
      description: 'A UNESCO site with ruins of Vijayanagara Empire.',
      image: '/assets/monuments/hampi.jpg',
      imageCredit: 'Illustrated by VirasatRakshak',
      fallbackIcon: '🏛️',
      fallbackLabel: 'Hampi Ruins'
    },
    {
      id: 'konark',
      name: 'Konark Sun Temple',
      description: '13th-century temple dedicated to Surya.',
      image: '/assets/monuments/konark_sun_temple.jpg',
      imageCredit: 'Illustrated by VirasatRakshak',
      fallbackIcon: '☀️',
      fallbackLabel: 'Konark Sun Temple'
    },
    {
      id: 'sanchi',
      name: 'Sanchi Stupa',
      description: 'Ancient Buddhist complex in Madhya Pradesh.',
      image: '/assets/monuments/sanchi_stupa.jpg',
      imageCredit: 'Illustrated by VirasatRakshak',
      fallbackIcon: '🕌',
      fallbackLabel: 'Sanchi Stupa'
    }
  ]

  useEffect(() => { saveToStorage('community:stories', stories) }, [stories])
  useEffect(() => { saveToStorage('community:adopted', adoptedSites) }, [adoptedSites])
  useEffect(() => { saveToStorage('community:points', points) }, [points])
  useEffect(() => { saveToStorage('community:badges', badges) }, [badges])
  useEffect(() => { saveToStorage('community:events', events) }, [events])
  useEffect(() => { saveToStorage('community:threads', threads) }, [threads])

  const addPoints = (value, badge) => {
    setPoints(p => p + value)
    if (badge && !badges.includes(badge)) setBadges(b => [...b, badge])
  }

  // Story modal
  const [isStoryOpen, setIsStoryOpen] = useState(false)
  const [storyForm, setStoryForm] = useState({ title: '', description: '', image: '' })
  const [selectedStory, setSelectedStory] = useState(null)

  const handleStoryImage = (file) => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setStoryForm(s => ({ ...s, image: url }))
  }

  const submitStory = (e) => {
    e.preventDefault()
    if (!storyForm.title || !storyForm.description) return
    const newStory = { id: `s-${Date.now()}`, ...storyForm }
    setStories([newStory, ...stories])
    addPoints(10, 'Storyteller')
    setIsStoryOpen(false)
    setStoryForm({ title: '', description: '', image: '' })
  }

  const toggleAdopt = (siteId, siteName) => {
    setAdoptedSites(prev => {
      const exists = prev.includes(siteId)
      const next = exists ? prev.filter(id => id !== siteId) : [...prev, siteId]
      if (!exists) addPoints(20, 'Heritage Guardian')
      return next
    })
  }

  const [eventForm, setEventForm] = useState({ name: '', date: '', location: '', description: '' })
  const submitEvent = (e) => {
    e.preventDefault()
    if (!eventForm.name || !eventForm.date) return
    setEvents(ev => [{ id: `e-${Date.now()}`, ...eventForm }, ...ev])
    addPoints(10, 'Community Organizer')
    setEventForm({ name: '', date: '', location: '', description: '' })
  }

  const filteredEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    const upcoming = events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
    const past = events.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date))
    return eventFilter === 'upcoming' ? upcoming : past
  }, [events, eventFilter])

  const [threadForm, setThreadForm] = useState({ title: '', body: '' })
  const addThread = (e) => {
    e.preventDefault()
    if (!threadForm.title) return
    setThreads(ts => [{ id: `t-${Date.now()}`, title: threadForm.title, body: threadForm.body, comments: [] }, ...ts])
    addPoints(5, 'Discussion Starter')
    setThreadForm({ title: '', body: '' })
  }

  const addComment = (threadId, text) => {
    if (!text) return
    setThreads(ts => ts.map(t => t.id === threadId ? { ...t, comments: [...t.comments, text] } : t))
    addPoints(2)
  }

  const [volForm, setVolForm] = useState({ name: '', email: '', interests: '' })
  const [volunteers, setVolunteers] = useState(() => loadFromStorage('community:volunteers', []))
  useEffect(() => { saveToStorage('community:volunteers', volunteers) }, [volunteers])
  const submitVolunteer = (e) => {
    e.preventDefault()
    if (!volForm.name || !volForm.email) return
    setVolunteers(v => [{ id: `v-${Date.now()}`, ...volForm }, ...v])
    addPoints(5, 'Volunteer')
    setVolForm({ name: '', email: '', interests: '' })
  }

  return (
    <div className="min-h-screen">
      <style>{`
        .animated-gradient {
          background: radial-gradient(1000px 600px at 10% 10%, rgba(20,184,166,0.25), transparent 40%),
                      radial-gradient(1200px 800px at 90% 20%, rgba(59,130,246,0.25), transparent 45%),
                      linear-gradient(120deg, #ecfeff 0%, #eef2ff 100%);
          animation: floatBg 12s ease-in-out infinite alternate;
        }
        @keyframes floatBg {
          0% { background-position: 0% 0%, 100% 0%, 0% 0%; }
          100% { background-position: 10% 10%, 90% 10%, 0% 0%; }
        }
      `}</style>

      {/* Hero */}
      <section className="animated-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-saffron-700 shadow">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Community</span>
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-700">
              Cultural Community Hub
            </h1>
            <p className="mt-3 text-lg text-gray-700">Share stories • Adopt heritage • Join events.</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <GradientButton onClick={() => setIsStoryOpen(true)}>
                <Upload className="inline w-4 h-4 mr-2" /> Share Your Story
              </GradientButton>
              <GradientButton onClick={() => document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                <Calendar className="inline w-4 h-4 mr-2" /> Explore Events
              </GradientButton>
            </div>
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-white/80 shadow">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">Points:</span> {points}
              {badges.length > 0 && <span className="text-sm text-gray-600">• Badges: {badges.join(', ')}</span>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Storytelling Hub */}
      <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Storytelling Hub</h2>
            <GradientButton onClick={() => setIsStoryOpen(true)}>
              <Upload className="inline w-4 h-4 mr-2" /> Share Your Story
            </GradientButton>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map(story => (
              <motion.div key={story.id} whileHover="hover" variants={cardHover} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden relative">
                {/* Image area — always shown, never a blank white space */}
                <div className="relative">
                  <HeritageImage
                    src={story.image}
                    alt={story.title}
                    fallbackIcon={
                      story.title.toLowerCase().includes('monsoon') ? '🎵' :
                      story.title.toLowerCase().includes('pattachitra') ? '🎨' :
                      story.title.toLowerCase().includes('ramleela') ? '🎭' : '📖'
                    }
                    fallbackLabel={story.title}
                    className="w-full h-44"
                    credit={story.imageCredit}
                  />
                  <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center shadow">
                    {story.title.toLowerCase().includes('monsoon') ? (
                      <Music2 className="w-5 h-5 text-blue-600" />
                    ) : story.title.toLowerCase().includes('pattachitra') ? (
                      <Palette className="w-5 h-5 text-rose-600" />
                    ) : story.title.toLowerCase().includes('ramleela') ? (
                      <Theater className="w-5 h-5 text-amber-600" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-slate-700" />
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{story.title}</h3>
                  <p className="text-gray-600 mt-1 line-clamp-2">{story.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <GradientButton className="px-3 py-1 text-sm" onClick={() => setSelectedStory(story)}>Read More</GradientButton>
                    <span className="text-xs text-gray-500">By community</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Heritage Adoption */}
      <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Heritage Adoption</h2>
            <div className="flex items-center gap-2 text-yellow-600"><Medal className="w-5 h-5" /><span className="font-medium">Badges:</span> {badges.length ? badges.join(', ') : '—'}</div>
          </div>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {heritageSites.map(site => {
              const adopted = adoptedSites.includes(site.id)
              return (
                <motion.div key={site.id} whileHover="hover" variants={cardHover} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden relative">
                  <div className="relative">
                    <HeritageImage
                      src={site.image}
                      alt={`${site.name} heritage site`}
                      fallbackIcon={site.fallbackIcon}
                      fallbackLabel={site.fallbackLabel}
                      className="w-full h-44"
                      credit={site.imageCredit}
                    />
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center shadow">
                      {site.id === 'hampi' ? (
                        <Landmark className="w-5 h-5 text-amber-700" />
                      ) : site.id === 'konark' ? (
                        <SunMedium className="w-5 h-5 text-orange-600" />
                      ) : (
                        <Building2 className="w-5 h-5 text-emerald-700" />
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{site.name}</h3>
                    <p className="text-gray-600 mt-1 line-clamp-2">{site.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <GradientButton onClick={() => toggleAdopt(site.id, site.name)} className={adopted ? 'from-emerald-500 to-green-600' : ''}>
                        <HeartHandshake className="inline w-4 h-4 mr-2" /> {adopted ? 'Adopted' : 'Adopt'}
                      </GradientButton>
                      {adopted && <span className="text-sm text-emerald-600 font-medium">+ Guardian</span>}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Events */}
      <motion.section id="events" variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold">Cultural Events</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setEventFilter('upcoming')} className={`px-3 py-1 rounded-lg border ${eventFilter==='upcoming' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200'}`}>Upcoming</button>
              <button onClick={() => setEventFilter('past')} className={`px-3 py-1 rounded-lg border ${eventFilter==='past' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200'}`}>Past</button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {filteredEvents.length === 0 && (
                <div className="text-gray-500">No events.</div>
              )}
              {filteredEvents.map(ev => (
                <motion.div key={ev.id} whileHover="hover" variants={cardHover} className="bg-white rounded-xl shadow border border-gray-200 p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{ev.name}</h3>
                      <span className="text-sm text-gray-500">{ev.date}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-600 flex items-center gap-2"><MapPin className="w-4 h-4" /> {ev.location || '—'}</div>
                    <p className="mt-2 text-gray-700">{ev.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                <h3 className="font-semibold flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Add Event</h3>
                <form className="mt-3 space-y-3" onSubmit={submitEvent}>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Event name" value={eventForm.name} onChange={e => setEventForm(s => ({ ...s, name: e.target.value }))} />
                  <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2" value={eventForm.date} onChange={e => setEventForm(s => ({ ...s, date: e.target.value }))} />
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Location" value={eventForm.location} onChange={e => setEventForm(s => ({ ...s, location: e.target.value }))} />
                  <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Description" value={eventForm.description} onChange={e => setEventForm(s => ({ ...s, description: e.target.value }))} />
                  <GradientButton type="submit" className="w-full">Submit</GradientButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Discussion Forums */}
      <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Discussion Forums</h2>
          </div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {threads.map(thread => (
                <div key={thread.id} className="bg-white rounded-xl shadow border border-gray-200 p-4">
                  <h3 className="font-semibold">{thread.title}</h3>
                  {thread.body && <p className="text-gray-700 mt-1">{thread.body}</p>}
                  <div className="mt-3 space-y-2">
                    {thread.comments.map((c, idx) => (
                      <div key={idx} className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">{c}</div>
                    ))}
                  </div>
                  <ThreadCommentBox onSubmit={(text) => addComment(thread.id, text)} />
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                <h3 className="font-semibold">Start a Thread</h3>
                <form className="mt-3 space-y-3" onSubmit={addThread}>
                  <input className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Title" value={threadForm.title} onChange={e => setThreadForm(s => ({ ...s, title: e.target.value }))} />
                  <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Body (optional)" value={threadForm.body} onChange={e => setThreadForm(s => ({ ...s, body: e.target.value }))} />
                  <GradientButton type="submit" className="w-full">Post</GradientButton>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Artisan Spotlight */}
      <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="w-5 h-5" /> Artisan Spotlight</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover="hover" variants={cardHover} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden md:col-span-2">
              <HeritageImage
                src={spotlight.photo}
                alt={`${spotlight.name} - ${spotlight.craft} artisan`}
                fallbackIcon="🎨"
                fallbackLabel={spotlight.name}
                className="w-full h-56"
                credit={spotlight.photoCredit}
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{spotlight.name}</h3>
                  <span className="text-sm text-gray-600">{spotlight.craft}</span>
                </div>
                <p className="mt-2 text-gray-700">{spotlight.story}</p>
              </div>
            </motion.div>
            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <h3 className="font-semibold flex items-center gap-2"><Medal className="w-4 h-4" /> Your Progress</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside">
                <li>{points} total points</li>
                <li>{adoptedSites.length} site(s) adopted</li>
                <li>{stories.length} story(ies) shared</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Volunteer Connect */}
      <motion.section variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold flex items-center gap-2"><HeartHandshake className="w-5 h-5" /> Volunteer Connect</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              {volunteers.length === 0 && <div className="text-gray-600">No volunteers yet. Be the first to join!</div>}
              {volunteers.map(v => (
                <div key={v.id} className="bg-white rounded-xl shadow border border-gray-200 p-4">
                  <div className="font-medium">{v.name} <span className="text-gray-500">• {v.email}</span></div>
                  <div className="mt-1 text-sm text-gray-700">Interests: {v.interests || '—'}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
              <h3 className="font-semibold">Register as Volunteer</h3>
              <form className="mt-3 space-y-3" onSubmit={submitVolunteer}>
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Name" value={volForm.name} onChange={e => setVolForm(s => ({ ...s, name: e.target.value }))} />
                <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Email" value={volForm.email} onChange={e => setVolForm(s => ({ ...s, email: e.target.value }))} />
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Interests (e.g., events, tours)" value={volForm.interests} onChange={e => setVolForm(s => ({ ...s, interests: e.target.value }))} />
                <GradientButton type="submit" className="w-full">Register</GradientButton>
              </form>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Story Modal */}
      {isStoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsStoryOpen(false)} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg mx-4 p-6">
            <h3 className="text-lg font-semibold">Share Your Story</h3>
            <form className="mt-4 space-y-3" onSubmit={submitStory}>
              <input className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Title" value={storyForm.title} onChange={e => setStoryForm(s => ({ ...s, title: e.target.value }))} />
              <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2" placeholder="Your story" rows="4" value={storyForm.description} onChange={e => setStoryForm(s => ({ ...s, description: e.target.value }))} />
              <div>
                <label className="block text-sm text-gray-600 mb-1">Upload image</label>
                <input type="file" accept="image/*" onChange={e => handleStoryImage(e.target.files?.[0])} />
                {storyForm.image && <img src={storyForm.image} alt="preview" className="mt-2 w-full h-40 object-cover rounded-lg border" />}
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsStoryOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200">Cancel</button>
                <GradientButton type="submit">Submit</GradientButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Story Detail Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedStory(null)} />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-2xl mx-4 p-0 overflow-hidden">
            {selectedStory.image && (
              <HeritageImage
                src={selectedStory.image}
                alt={selectedStory.title}
                fallbackIcon="📖"
                fallbackLabel={selectedStory.title}
                className="w-full h-64"
                credit={selectedStory.imageCredit}
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold">{selectedStory.title}</h3>
                <button onClick={() => setSelectedStory(null)} className="px-3 py-1 rounded-lg border border-gray-200 text-sm">Close</button>
              </div>
              <p className="mt-3 text-gray-700 whitespace-pre-wrap">{selectedStory.fullText || selectedStory.description}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

const ThreadCommentBox = ({ onSubmit }) => {
  const [text, setText] = useState('')
  return (
    <form className="mt-3 flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); onSubmit(text); setText('') }}>
      <input className="flex-1 border border-gray-200 rounded-lg px-3 py-2" placeholder="Write a comment" value={text} onChange={e => setText(e.target.value)} />
      <GradientButton type="submit" className="px-3 py-2 text-sm">Reply</GradientButton>
    </form>
  )
}

export default CommunityPage


