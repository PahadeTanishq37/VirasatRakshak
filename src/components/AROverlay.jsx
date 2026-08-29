import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from 'face-api.js';
import { Camera, X, Download, RotateCcw, Sparkles, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export const AROverlay = ({ selectedItem, isActive, onCapture, onClose, onSelectFilter, arItems = [] }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [cameraState, setCameraState] = useState('initializing'); // 'initializing' | 'loading_models' | 'requesting_camera' | 'active' | 'permission_denied' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);

  const [faceDetected, setFaceDetected] = useState(false);
  const [filterImage, setFilterImage] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const animationRef = useRef(null);
  const isStreamingRef = useRef(false);
  const isModelLoadedRef = useRef(false);
  const filterImageRef = useRef(null);

  // Smooth tracking refs (Linear Interpolation)
  const smoothedFaceRef = useRef(null);

  // 1. Preload Neural Models from local /models
  useEffect(() => {
    let isMounted = true;

    const loadNeuralModels = async () => {
      try {
        setCameraState('loading_models');
        const MODEL_URL = '/models';

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);

        if (isMounted) {
          console.log('Face-API models loaded successfully from /models');
          isModelLoadedRef.current = true;
          startWebcamStream();
        }
      } catch (err) {
        console.error('Error loading face-api models:', err);
        if (isMounted) {
          setCameraState('error');
          setErrorMessage('Unable to load AR neural models. Please refresh and try again.');
        }
      }
    };

    if (isActive) {
      if (!isModelLoadedRef.current) {
        loadNeuralModels();
      } else {
        startWebcamStream();
      }
    } else {
      stopWebcamStream();
    }

    return () => {
      isMounted = false;
      stopWebcamStream();
    };
  }, [isActive]);

  // 2. Preload active filter PNG image
  useEffect(() => {
    if (selectedItem && selectedItem.type) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setFilterImage(img);
        filterImageRef.current = img;
      };
      img.onerror = () => {
        console.warn(`Filter image not found for type: ${selectedItem.type}`);
        setFilterImage(null);
        filterImageRef.current = null;
      };
      img.src = `/assets/filters/${selectedItem.type}.png`;
    } else {
      setFilterImage(null);
      filterImageRef.current = null;
    }
  }, [selectedItem]);

  // 3. Start Webcam Stream
  const startWebcamStream = async () => {
    try {
      setCameraState('requesting_camera');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          isStreamingRef.current = true;
          setCameraState('active');
          startRealTimeDetectionLoop();
        };
      }
    } catch (err) {
      console.error('Camera permission or access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('permission_denied');
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser bar.');
      } else {
        setCameraState('error');
        setErrorMessage('Unable to access video camera. Please ensure a working camera is connected.');
      }
    }
  };

  // 4. Stop Webcam & Cleanup Tracks
  const stopWebcamStream = () => {
    isStreamingRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    smoothedFaceRef.current = null;
    setFaceDetected(false);
  };

  // 5. Real-Time Face Detection & Landmark Tracking Loop
  const startRealTimeDetectionLoop = () => {
    const detectAndRender = async () => {
      if (!isStreamingRef.current || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.paused || video.ended || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detectAndRender);
        return;
      }

      const displayWidth = video.clientWidth || 640;
      const displayHeight = video.clientHeight || 480;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        // Real face-api detection with 68 landmarks
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 });
        const detection = await faceapi.detectSingleFace(video, options).withFaceLandmarks();

        if (detection && detection.landmarks) {
          setFaceDetected(true);

          // Resize landmarks to match displayed canvas size
          const resizedDetections = faceapi.resizeResults(detection, {
            width: displayWidth,
            height: displayHeight
          });

          const landmarks = resizedDetections.landmarks;
          const box = resizedDetections.detection.box;

          // Calculate facial anchor points
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();

          // Calculate Eye Center
          const eyeCenterX = (leftEye[0].x + rightEye[3].x) / 2;
          const eyeCenterY = (leftEye[0].y + rightEye[3].y) / 2;

          // Calculate Roll Angle (Head Tilt) in Radians
          const deltaX = rightEye[3].x - leftEye[0].x;
          const deltaY = rightEye[3].y - leftEye[0].y;
          const rollAngle = Math.atan2(deltaY, deltaX);

          // Calculate Face Width & Height
          const faceWidth = box.width;
          const faceHeight = box.height;

          const targetMetrics = {
            boxX: box.x,
            boxY: box.y,
            eyeX: eyeCenterX,
            eyeY: eyeCenterY,
            width: faceWidth,
            height: faceHeight,
            angle: rollAngle
          };

          // Smooth metrics using Linear Interpolation (Lerp factor = 0.35)
          if (!smoothedFaceRef.current) {
            smoothedFaceRef.current = targetMetrics;
          } else {
            const lerp = (a, b, t = 0.35) => a + (b - a) * t;
            smoothedFaceRef.current = {
              boxX: lerp(smoothedFaceRef.current.boxX, targetMetrics.boxX),
              boxY: lerp(smoothedFaceRef.current.boxY, targetMetrics.boxY),
              eyeX: lerp(smoothedFaceRef.current.eyeX, targetMetrics.eyeX),
              eyeY: lerp(smoothedFaceRef.current.eyeY, targetMetrics.eyeY),
              width: lerp(smoothedFaceRef.current.width, targetMetrics.width),
              height: lerp(smoothedFaceRef.current.height, targetMetrics.height),
              angle: lerp(smoothedFaceRef.current.angle, targetMetrics.angle)
            };
          }

          const sm = smoothedFaceRef.current;

          // Render AR Filter if image preloaded
          const currentFilterImg = filterImageRef.current;
          if (selectedItem && currentFilterImg) {
            ctx.save();

            // Transform canvas for head tilt & center positioning
            ctx.translate(sm.eyeX, sm.eyeY);
            ctx.rotate(sm.angle);

            // Filter Configuration based on type
            let drawWidth = sm.width * 1.5;
            let drawHeight = sm.height * 1.5;
            let offsetY = -sm.height * 0.45;
            let offsetX = -drawWidth / 2;

            const type = selectedItem.type;
            if (type === 'turban' || type === 'clothing') {
              drawWidth = sm.width * 1.6;
              drawHeight = sm.height * 1.2;
              offsetY = -sm.height * 0.95; // Position above eyes on head/forehead
            } else if (type === 'kathakali' || type === 'makeup') {
              drawWidth = sm.width * 1.45;
              drawHeight = sm.height * 1.55;
              offsetY = -sm.height * 0.55; // Full face mask placement
            } else if (type === 'saree') {
              drawWidth = sm.width * 1.7;
              drawHeight = sm.height * 1.4;
              offsetY = -sm.height * 0.85; // Crown / Mukut style placement
            } else if (type === 'jewelry') {
              drawWidth = sm.width * 1.35;
              drawHeight = sm.height * 1.1;
              offsetY = sm.height * 0.25; // Necklace placement under chin
            }

            offsetX = -drawWidth / 2;

            ctx.drawImage(currentFilterImg, offsetX, offsetY, drawWidth, drawHeight);
            ctx.restore();
          }
        } else {
          setFaceDetected(false);
          smoothedFaceRef.current = null;
        }
      } catch (err) {
        console.error('Frame detection error:', err);
        setFaceDetected(false);
      }

      if (isStreamingRef.current) {
        animationRef.current = requestAnimationFrame(detectAndRender);
      }
    };

    detectAndRender();
  };

  // 6. Photo Capture & Offscreen Composition
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const vWidth = video.videoWidth || 1280;
    const vHeight = video.videoHeight || 720;

    tempCanvas.width = vWidth;
    tempCanvas.height = vHeight;

    // Draw video frame
    tempCtx.drawImage(video, 0, 0, vWidth, vHeight);

    // Composite active AR Overlay canvas on top if face detected & filter applied
    if (canvasRef.current && faceDetected && filterImageRef.current) {
      tempCtx.drawImage(canvasRef.current, 0, 0, vWidth, vHeight);
    }

    const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
    setCapturedPhoto(dataUrl);
    if (onCapture) onCapture(dataUrl);
  };

  // Download captured image file
  const handleDownloadPhoto = () => {
    if (!capturedPhoto) return;
    const a = document.createElement('a');
    a.href = capturedPhoto;
    a.download = `virasat-rakshak-ar-${selectedItem?.type || 'filter'}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg z-50 flex items-center justify-center p-2 sm:p-6 overflow-hidden"
    >
      <div className="relative w-full h-full max-w-5xl max-h-[90vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col justify-between">
        {/* Top Header Bar */}
        <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-slate-950/90 to-transparent z-30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-peacock-500 rounded-xl flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base sm:text-lg leading-tight">
                Virasat AR Cultural Try-On
              </h3>
              <p className="text-xs text-saffron-300">
                {selectedItem ? `Filter: ${selectedItem.name}` : 'Select a filter'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopWebcamStream();
              if (onClose) onClose();
            }}
            className="p-2.5 bg-slate-800/80 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
            title="Close AR Experience"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Viewport Container */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
          {/* Video Stream */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover transform -scale-x-100"
            autoPlay
            muted
            playsInline
          />

          {/* Canvas Overlay for Face Tracking */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100"
          />

          {/* Loading Overlay */}
          {(cameraState === 'loading_models' || cameraState === 'requesting_camera' || cameraState === 'initializing') && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-white z-20 space-y-4">
              <div className="w-14 h-14 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-display text-base sm:text-lg text-saffron-200 animate-pulse">
                {cameraState === 'loading_models' && 'Loading Neural AI Models...'}
                {cameraState === 'requesting_camera' && 'Requesting Camera Access...'}
                {cameraState === 'initializing' && 'Initializing AR Studio...'}
              </p>
            </div>
          )}

          {/* Camera Permission / Error Overlay */}
          {(cameraState === 'permission_denied' || cameraState === 'error') && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white z-20 space-y-4">
              <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center border border-red-500/40">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-display font-bold text-red-200">Camera Access Required</h4>
              <p className="text-sm text-gray-300 max-w-md leading-relaxed">{errorMessage}</p>
              <button
                onClick={startWebcamStream}
                className="btn-primary text-xs px-6 py-2.5 flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Camera Permission</span>
              </button>
            </div>
          )}

          {/* Face Detection Status Badge */}
          {cameraState === 'active' && (
            <div className="absolute top-20 left-4 z-20">
              {faceDetected ? (
                <div className="bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-xs px-3.5 py-1.5 rounded-full flex items-center space-x-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Face Landmark Tracked</span>
                </div>
              ) : (
                <div className="bg-amber-950/85 backdrop-blur-md text-amber-300 border border-amber-500/30 text-xs px-3.5 py-1.5 rounded-full flex items-center space-x-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>🙂 Position face inside frame</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Filter Selector Bar & Capture Controls */}
        <div className="relative z-30 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quick Filter Switching Buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {arItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectFilter && onSelectFilter(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md'
                      : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <span>{item.image}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Capture Photo Button */}
          <button
            onClick={handleCapturePhoto}
            disabled={cameraState !== 'active'}
            className="w-14 h-14 bg-white hover:bg-saffron-100 rounded-full flex items-center justify-center text-slate-950 shadow-2xl hover:scale-110 active:scale-95 transition-transform shrink-0 disabled:opacity-40 disabled:cursor-not-allowed border-4 border-saffron-500"
            title="Capture Photo"
          >
            <div className="w-10 h-10 bg-saffron-500 rounded-full flex items-center justify-center text-white">
              <Camera className="w-5 h-5" />
            </div>
          </button>
        </div>
      </div>

      {/* Captured Photo Preview Modal */}
      <AnimatePresence>
        {capturedPhoto && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full text-center space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-saffron-500" /> AR Photo Captured
                </h3>
                <button
                  onClick={() => setCapturedPhoto(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-black max-h-[350px]">
                <img src={capturedPhoto} alt="Captured AR" className="w-full h-full object-contain" />
              </div>

              <div className="flex items-center justify-center space-x-3 pt-2">
                <button
                  onClick={() => setCapturedPhoto(null)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Photo</span>
                </button>

                <button
                  onClick={handleDownloadPhoto}
                  className="btn-primary text-xs px-6 py-2.5 flex items-center space-x-2 shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};