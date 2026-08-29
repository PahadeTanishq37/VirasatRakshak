import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Play,
  Pause,
  Grid,
  Sun,
  Sunset,
  Sparkles,
  Maximize2,
  Minimize2,
  Info,
  MapPin,
  Calendar,
  Tag,
  Compass,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Artifact3DCanvas } from './Artifact3DCanvas';

export const Artifact3DViewer = ({ artifact }) => {
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [lightingMode, setLightingMode] = useState('day'); // 'day' | 'sunset' | 'studio'
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const containerRef = useRef(null);

  if (!artifact) return null;

  const handleReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch((err) => console.error(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch((err) => console.error(err));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-slate-950 p-4 flex flex-col justify-between overflow-hidden'
          : 'relative rounded-2xl bg-white/80 backdrop-blur-md border border-saffron-200/60 shadow-xl p-4 sm:p-6'
      }`}
    >
      {/* Top Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-saffron-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-peacock-500 rounded-xl flex items-center justify-center shadow-md">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 leading-tight">
              {artifact.name}
            </h2>
            <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-600">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-saffron-600" />
                <span>{artifact.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-peacock-600" />
                <span>{artifact.era}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-saffron-100/80 text-saffron-800 text-xs font-semibold rounded-full border border-saffron-200">
            {artifact.category}
          </span>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 3D Canvas Viewport Container */}
        <div
          className={`relative bg-gradient-to-b from-slate-900 via-slate-850 to-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col ${
            isFullscreen ? 'lg:col-span-12 h-[calc(100vh-140px)]' : 'lg:col-span-8 h-[420px] sm:h-[500px]'
          }`}
        >
          {/* Canvas Component */}
          <Artifact3DCanvas
            artifact={artifact}
            isAutoRotating={isAutoRotating}
            isWireframe={isWireframe}
            lightingMode={lightingMode}
            resetTrigger={resetTrigger}
          />

          {/* Interactive Floating Control Bar */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-full px-4 py-2 flex items-center space-x-3 shadow-2xl z-20 text-white">
            {/* Auto Rotate Toggle */}
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title={isAutoRotating ? 'Pause Auto Rotation' : 'Start Auto Rotation'}
              className={`p-2 rounded-full transition-all duration-200 ${
                isAutoRotating ? 'bg-saffron-500 text-white shadow-md' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Reset Camera View */}
            <button
              onClick={handleReset}
              title="Reset View"
              className="p-2 rounded-full hover:bg-slate-800 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-700" />

            {/* Wireframe Mode Toggle */}
            <button
              onClick={() => setIsWireframe(!isWireframe)}
              title={isWireframe ? 'Solid Mode' : 'Wireframe Mode'}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isWireframe ? 'bg-peacock-500 text-white' : 'hover:bg-slate-800 text-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-700" />

            {/* Lighting Modes */}
            <div className="flex items-center space-x-1 bg-slate-800/80 rounded-full p-1 border border-slate-700">
              <button
                onClick={() => setLightingMode('day')}
                title="Daylight Lighting"
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  lightingMode === 'day' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLightingMode('sunset')}
                title="Sunset Warm Glow"
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  lightingMode === 'sunset' ? 'bg-orange-500 text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sunset className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLightingMode('studio')}
                title="Studio Spotlight"
                className={`p-1.5 rounded-full text-xs transition-colors ${
                  lightingMode === 'studio' ? 'bg-indigo-500 text-white font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-4 w-px bg-slate-700" />

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen View'}
              className="p-2 rounded-full hover:bg-slate-800 text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Canvas Instructions Hint */}
          <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-sm text-gray-300 text-[11px] px-3 py-1 rounded-full border border-slate-700/40 pointer-events-none hidden sm:block">
            🖱️ Drag to rotate • Scroll to zoom
          </div>
        </div>

        {/* Artifact Metadata Details Panel */}
        {!isFullscreen && (
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4 bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-saffron-100 shadow-sm overflow-y-auto max-h-[500px]">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-saffron-600 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Cultural Heritage Overview
                </span>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="text-gray-500 hover:text-gray-700 lg:hidden"
                >
                  {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                {artifact.shortDescription}
              </p>

              <AnimatePresence initial={false}>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="border-t border-saffron-100 pt-3">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-peacock-600" /> Architectural Details
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {artifact.description}
                      </p>
                    </div>

                    <div className="border-t border-saffron-100 pt-3">
                      <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                        Historical Significance
                      </h4>
                      <p className="text-gray-600 text-xs leading-relaxed italic">
                        "{artifact.history}"
                      </p>
                    </div>

                    {artifact.highlights && artifact.highlights.length > 0 && (
                      <div className="border-t border-saffron-100 pt-3">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                          Key Heritage Highlights
                        </h4>
                        <ul className="space-y-2">
                          {artifact.highlights.map((item, idx) => (
                            <li key={idx} className="flex items-start text-xs text-gray-700 space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-saffron-500 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
