import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Sparkles, Filter, Search, MapPin, ArrowRight } from 'lucide-react';
import { HERITAGE_ARTIFACTS, ARTIFACT_CATEGORIES } from '../data/artifactsData';
import { Artifact3DViewer } from '../components/heritage/Artifact3DViewer';

export const ArtifactsPage = () => {
  const { artifactId } = useParams();
  const navigate = useNavigate();

  const [selectedArtifactId, setSelectedArtifactId] = useState(
    artifactId || HERITAGE_ARTIFACTS[0].id
  );
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state if URL changes
  useEffect(() => {
    if (artifactId) {
      const exists = HERITAGE_ARTIFACTS.some((item) => item.id === artifactId);
      if (exists) {
        setSelectedArtifactId(artifactId);
      }
    }
  }, [artifactId]);

  const activeArtifact =
    HERITAGE_ARTIFACTS.find((item) => item.id === selectedArtifactId) ||
    HERITAGE_ARTIFACTS[0];

  const filteredArtifacts = HERITAGE_ARTIFACTS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSelectArtifact = (id) => {
    setSelectedArtifactId(id);
    navigate(`/artifacts/${id}`, { replace: true });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4 relative overflow-hidden rounded-3xl bg-gradient-to-r from-saffron-500/10 via-marigold-500/10 to-peacock-500/10 p-8 border border-saffron-200/50 backdrop-blur-md shadow-lg"
      >
        <div className="inline-flex items-center space-x-2 bg-saffron-500/15 border border-saffron-400/30 text-saffron-800 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm">
          <Sparkles className="w-4 h-4 text-saffron-600 animate-pulse" />
          <span>Interactive 3D Heritage Experience</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 leading-tight">
          Digital Bharat <span className="text-gradient">3D Artifact Verse</span>
        </h1>

        <p className="text-gray-700 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Explore iconic Indian cultural heritage monuments and sculptures rendered in real-time 3D.
          Rotate, zoom, and inspect intricate historical details directly in your browser.
        </p>
      </motion.div>

      {/* Primary 3D Viewer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Artifact3DViewer artifact={activeArtifact} />
      </motion.div>

      {/* Artifact Gallery Catalog Section */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-saffron-200/60 pb-4">
          <div>
            <h3 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
              <Box className="w-6 h-6 text-saffron-600" /> Heritage Artifact Gallery
            </h3>
            <p className="text-sm text-gray-600">Select an artifact below to inspect in 3D</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search artifacts, states..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/90 border border-saffron-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <Filter className="w-4 h-4 text-saffron-600 shrink-0 mr-1" />
          {ARTIFACT_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 shadow-sm ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                  : 'bg-white/80 text-gray-700 hover:bg-saffron-50 border border-saffron-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Artifact Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtifacts.map((item) => {
            const isSelected = item.id === activeArtifact.id;
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                onClick={() => handleSelectArtifact(item.id)}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-300 relative border ${
                  isSelected
                    ? 'bg-gradient-to-br from-saffron-50/90 to-marigold-50/90 border-saffron-500 shadow-xl ring-2 ring-saffron-400/40'
                    : 'bg-white/80 hover:bg-white border-white/60 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-4 right-4 bg-saffron-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
                    Active 3D
                  </span>
                )}

                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md"
                    style={{ backgroundColor: item.colorPalette.primary }}
                  >
                    🏛️
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-gray-900 text-lg leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-saffron-600" /> {item.location}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {item.shortDescription}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-saffron-100/60 text-xs">
                  <span className="text-saffron-700 font-medium bg-saffron-100/60 px-2.5 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span className="text-saffron-600 font-semibold flex items-center group">
                    Inspect 3D <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
