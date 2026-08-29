import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Wifi, WifiOff, HardDrive, Trash2, RefreshCw, CheckCircle2, 
  BookOpen, Landmark, Calendar, MapPin, Info, X, Sparkles, Compass, Eye 
} from 'lucide-react';
import { offlinePackService } from '../services/offlinePackService';
import { pdfService } from '../services/pdfService';

const AVAILABLE_HERITAGE_SITES = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    slug: 'taj-mahal',
    state: 'Uttar Pradesh',
    region: 'north',
    category: 'monument',
    icon: '🕌',
    description: 'An ivory-white marble mausoleum on the Yamuna riverbank in Agra.',
    historicalPeriod: 'Mughal Architecture (1632–1653 AD)'
  },
  {
    id: 'hampi',
    name: 'Hampi',
    slug: 'hampi',
    state: 'Karnataka',
    region: 'south',
    category: 'monument',
    icon: '🏛️',
    description: 'Capital of the Vijayanagara Empire, famous for its stone chariot and temples.',
    historicalPeriod: 'Vijayanagara Empire (14th–16th Century)'
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    slug: 'konark-sun-temple',
    state: 'Odisha',
    region: 'east',
    category: 'monument',
    icon: '☀️',
    description: '13th-century CE Sun Temple shaped as a colossal stone chariot with 24 wheels.',
    historicalPeriod: 'Eastern Ganga Dynasty (1250 AD)'
  },
  {
    id: 'ajanta-ellora',
    name: 'Ajanta & Ellora Caves',
    slug: 'ajanta-ellora',
    state: 'Maharashtra',
    region: 'west',
    category: 'monument',
    icon: '🗿',
    description: 'Ancient rock-cut cave monuments featuring Buddhist, Hindu, and Jain temples.',
    historicalPeriod: '2nd Century BCE to 10th Century CE'
  },
  {
    id: 'varanasi-ghats',
    name: 'Varanasi Ghats',
    slug: 'varanasi-ghats',
    state: 'Uttar Pradesh',
    region: 'north',
    category: 'heritage',
    icon: '🪔',
    description: 'Riverfront steps leading to the banks of the sacred Ganges River.',
    historicalPeriod: 'Ancient Era (Vedic Times to Present)'
  }
];

export const OfflineTourPage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [downloadedPacks, setDownloadedPacks] = useState([]);
  const [storageInfo, setStorageInfo] = useState({ usageMB: '0.0', quotaMB: 'N/A', packCount: 0 });
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStepText, setDownloadStepText] = useState('');
  
  const [activePackModal, setActivePackModal] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [offlineNotice, setOfflineNotice] = useState(null);

  // Monitor network online/offline state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load IndexedDB packs & storage estimates
  const loadOfflineData = async () => {
    try {
      const packs = await offlinePackService.getDownloadedPacks();
      setDownloadedPacks(packs);

      const storage = await offlinePackService.getStorageUsage();
      setStorageInfo(storage);
    } catch (err) {
      console.error('Error loading IndexedDB data:', err);
    }
  };

  // Download a heritage pack with real progress tracking
  const handleDownload = async (site) => {
    if (!isOnline) {
      setOfflineNotice('An active internet connection is required to download new Heritage Packs.');
      return;
    }

    setDownloadingId(site.id);
    setDownloadProgress(5);
    setDownloadStepText('Initializing download...');

    try {
      await offlinePackService.downloadPack(site, (progress, step) => {
        setDownloadProgress(progress);
        setDownloadStepText(step);
      });

      await loadOfflineData();
    } catch (err) {
      console.error('Download pack failed:', err);
      alert('Failed to prepare heritage pack. Please try again.');
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
        setDownloadProgress(0);
        setDownloadStepText('');
      }, 600);
    }
  };

  // Delete a downloaded pack
  const handleDeletePack = async (packId, e) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this offline heritage pack?')) {
      try {
        await offlinePackService.deletePack(packId);
        if (activePackModal?.id === packId) {
          setActivePackModal(null);
        }
        await loadOfflineData();
      } catch (err) {
        console.error('Delete pack error:', err);
      }
    }
  };

  // Open Offline Pack Modal
  const handleOpenPack = async (siteId) => {
    try {
      const pack = await offlinePackService.getPack(siteId);
      if (pack) {
        setActivePackModal(pack);
        setActiveTab('overview');
      } else {
        if (!isOnline) {
          setOfflineNotice('This heritage site is not available offline. Download the Heritage Pack while you are online.');
        } else {
          // If online and pack not downloaded, prompt download
          const site = AVAILABLE_HERITAGE_SITES.find(s => s.id === siteId);
          if (site && confirm(`Download offline pack for ${site.name}?`)) {
            handleDownload(site);
          }
        }
      }
    } catch (err) {
      console.error('Error opening pack:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 via-white to-peacock-50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 leading-tight">
              Offline Heritage <span className="text-gradient">Packs</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Download curated heritage guides to explore monuments, facts, and guides without internet.
            </p>
          </motion.div>

          {/* Network Status Badge */}
          <div className="flex items-center space-x-3 self-start sm:self-auto">
            {isOnline ? (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs px-3.5 py-1.5 rounded-full flex items-center space-x-2 font-semibold shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="w-3.5 h-3.5" />
                <span>🟢 Online Mode</span>
              </div>
            ) : (
              <div className="bg-amber-100 border border-amber-300 text-amber-900 text-xs px-3.5 py-1.5 rounded-full flex items-center space-x-2 font-semibold shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce" />
                <WifiOff className="w-3.5 h-3.5" />
                <span>🟠 Offline Mode</span>
              </div>
            )}
          </div>
        </div>

        {/* Storage Dashboard Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-10 bg-white/80 backdrop-blur-md border border-saffron-200 shadow-md flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-peacock-500 text-white rounded-2xl flex items-center justify-center shadow-md">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900 text-base sm:text-lg">IndexedDB Offline Storage</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {storageInfo.packCount} Pack{storageInfo.packCount === 1 ? '' : 's'} Stored • {storageInfo.usageMB} MB Used
              </p>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-saffron-50 px-4 py-2 rounded-xl border border-saffron-100">
            Storage Engine: <span className="font-semibold text-saffron-700">IndexedDB & ServiceWorker Cache</span>
          </div>
        </motion.div>

        {/* Downloaded Packs Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="w-5 h-5 text-saffron-600" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900">
              My Offline Heritage Packs ({downloadedPacks.length})
            </h2>
          </div>

          {downloadedPacks.length === 0 ? (
            <div className="card p-8 text-center bg-white/60 border border-dashed border-gray-300">
              <div className="text-5xl mb-3">🏛️</div>
              <h3 className="text-lg font-semibold text-gray-800">No Offline Packs Downloaded Yet</h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto mt-1 mb-4">
                Select a heritage site from the gallery below and download its pack while online to explore it anytime without internet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {downloadedPacks.map((pack) => (
                <motion.div
                  key={pack.id}
                  whileHover={{ y: -4 }}
                  className="card p-6 bg-white border border-saffron-200 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{pack.icon}</span>
                        <div>
                          <h3 className="font-display font-bold text-gray-900 text-lg">{pack.name}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-saffron-500" /> {pack.state}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                        Downloaded
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-4">{pack.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-100 pt-3 mb-4">
                      <span>Size: {pack.estimatedSize}</span>
                      <span>Saved: {new Date(pack.downloadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenPack(pack.id)}
                      className="btn-primary flex-1 text-xs py-2 flex items-center justify-center space-x-1 shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Offline</span>
                    </button>

                    {isOnline && (
                      <button
                        onClick={() => handleDownload(pack)}
                        className="p-2 bg-saffron-50 text-saffron-700 hover:bg-saffron-100 rounded-lg text-xs transition-colors"
                        title="Update Pack"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDeletePack(pack.id, e)}
                      className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs transition-colors"
                      title="Delete Offline Pack"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Available Heritage Packs Gallery */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <Compass className="w-5 h-5 text-peacock-600" />
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900">
              Available Heritage Packs Gallery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AVAILABLE_HERITAGE_SITES.map((site) => {
              const isDownloaded = downloadedPacks.some(p => p.id === site.id);
              const isDownloading = downloadingId === site.id;

              return (
                <div key={site.id} className="card p-6 bg-white border border-gray-200 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-3xl">{site.icon}</span>
                      <div>
                        <h3 className="font-display font-bold text-gray-900 text-lg">{site.name}</h3>
                        <p className="text-xs text-gray-500">{site.state} • {site.historicalPeriod}</p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{site.description}</p>
                  </div>

                  <div>
                    {isDownloading ? (
                      <div className="space-y-2 py-1">
                        <div className="flex justify-between text-xs text-saffron-700 font-semibold">
                          <span>{downloadStepText}</span>
                          <span>{downloadProgress}%</span>
                        </div>
                        <div className="w-full bg-saffron-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-saffron-500 h-full transition-all duration-300 rounded-full"
                            style={{ width: `${downloadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : isDownloaded ? (
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Available Offline
                        </span>
                        <button
                          onClick={() => handleOpenPack(site.id)}
                          className="btn-outline text-xs px-3 py-1.5"
                        >
                          View Pack
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDownload(site)}
                        disabled={!isOnline}
                        className="btn-primary w-full text-xs py-2.5 flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Offline Pack</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Offline Heritage Viewer Modal */}
      <AnimatePresence>
        {activePackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-saffron-200 flex flex-col">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-saffron-500 to-peacock-600 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{activePackModal.icon}</span>
                  <div>
                    <h3 className="font-display font-bold text-xl sm:text-2xl leading-tight">
                      {activePackModal.name}
                    </h3>
                    <p className="text-xs text-saffron-100 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {activePackModal.state} • Offline Heritage Guide
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActivePackModal(null)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto text-xs font-semibold scrollbar-none">
                {['overview', 'facts', 'architecture', 'travel', 'story'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 border-b-2 whitespace-nowrap capitalize transition-colors ${
                      activeTab === tab
                        ? 'border-saffron-600 text-saffron-700 bg-white font-bold'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'story' ? 'Cached AI Story' : tab === 'facts' ? 'Important Facts' : tab}
                  </button>
                ))}
              </div>

              {/* Offline Notice Banner */}
              <div className="bg-saffron-50 px-6 py-2 border-b border-saffron-100 text-[11px] text-saffron-800 flex items-center space-x-2">
                <Info className="w-4 h-4 text-saffron-600 shrink-0" />
                <span>
                  Running offline from browser IndexedDB. Cached overviews, facts, and stories do not require network.
                </span>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-6 text-gray-800 text-sm leading-relaxed">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-display font-bold text-gray-900 text-base mb-1">Historical Overview</h4>
                      <p>{activePackModal.historicalOverview}</p>
                    </div>

                    <div>
                      <h4 className="font-display font-bold text-gray-900 text-base mb-1">Cultural Significance</h4>
                      <p>{activePackModal.culturalSignificance}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'facts' && (
                  <div>
                    <h4 className="font-display font-bold text-gray-900 text-base mb-3">Key Historical Facts</h4>
                    <ul className="space-y-2">
                      {activePackModal.importantFacts?.map((fact, i) => (
                        <li key={i} className="flex items-start space-x-2 bg-saffron-50/60 p-3 rounded-xl border border-saffron-100">
                          <span className="text-saffron-600 font-bold">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === 'architecture' && (
                  <div>
                    <h4 className="font-display font-bold text-gray-900 text-base mb-2">Architectural Highlights</h4>
                    <p>{activePackModal.architectureInfo}</p>
                  </div>
                )}

                {activeTab === 'travel' && activePackModal.travelGuide && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-1">Best Time to Visit</h5>
                      <p className="text-xs text-gray-700">{activePackModal.travelGuide.bestTime}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-1">Opening Hours</h5>
                      <p className="text-xs text-gray-700">{activePackModal.travelGuide.openingHours}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 sm:col-span-2">
                      <h5 className="font-semibold text-gray-900 mb-1">Entry Fee</h5>
                      <p className="text-xs text-gray-700">{activePackModal.travelGuide.entryFee}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'story' && (
                  <div>
                    {activePackModal.cachedStory ? (
                      <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-3">
                        <div className="flex items-center space-x-2 text-amber-900 font-display font-bold text-base">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <span>{activePackModal.cachedStory.title}</span>
                        </div>
                        <p className="text-xs text-amber-950 leading-relaxed whitespace-pre-line">
                          {activePackModal.cachedStory.story}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p>No cached story saved in this offline pack.</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Live AI story generation requires an active internet connection.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
                <span>Version {activePackModal.version} • Size: {activePackModal.estimatedSize}</span>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={async () => {
                      try {
                        await pdfService.generateHeritagePDF(activePackModal);
                      } catch (e) {
                        alert('Unable to generate Heritage PDF.');
                      }
                    }}
                    className="btn-secondary text-xs px-4 py-2 flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export PDF Guide</span>
                  </button>

                  <button onClick={() => setActivePackModal(null)} className="btn-primary text-xs px-5 py-2">
                    Close Guide
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Notice Guidance Modal */}
      <AnimatePresence>
        {offlineNotice && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl border border-amber-200">
              <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <WifiOff className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-display font-bold text-gray-900">Offline Access Notice</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{offlineNotice}</p>
              <button
                onClick={() => setOfflineNotice(null)}
                className="btn-primary w-full text-xs py-2.5"
              >
                Understand & Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OfflineTourPage;
