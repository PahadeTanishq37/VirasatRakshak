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
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const animationRef = useRef(null);
  const isStreamingRef = useRef(false);
  const isModelLoadedRef = useRef(false);

  // Smooth tracking ref for Linear Interpolation (Lerp)
  const smoothedFaceRef = useRef(null);

  // 1. Load Neural Models explicitly from local /models
  useEffect(() => {
    let isMounted = true;

    const loadNeuralModels = async () => {
      try {
        setCameraState('loading_models');
        console.log('Loading face detection models...');
        const MODEL_URL = '/models';

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);

        if (isMounted) {
          console.log('Models loaded successfully');
          isModelLoadedRef.current = true;
          startWebcamStream();
        }
      } catch (err) {
        console.error('Error loading face-api models:', err);
        if (isMounted) {
          setCameraState('error');
          setErrorMessage('Unable to load face detection models. Please refresh and try again.');
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

  // 2. Start Webcam Stream
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
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('permission_denied');
        setErrorMessage('Camera access was denied. Please allow camera access in your browser settings.');
      } else {
        setCameraState('error');
        setErrorMessage('Unable to access video camera. Please verify your camera device is connected.');
      }
    }
  };

  // 3. Stop Webcam & Cleanup Tracks
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

  // 4. Draw Programmatic Royal Indian Turban (Pagdi / Safa) on 2D Canvas
  const drawRoyalTurban = (ctx, centerX, topY, width, height, angle = 0) => {
    ctx.save();
    ctx.translate(centerX, topY + height * 0.45);
    ctx.rotate(angle);

    const w = width;
    const h = height;

    // 1. Base Curved Turban Structure Cushion
    const cushionGrad = ctx.createLinearGradient(0, -h * 0.5, 0, h * 0.5);
    cushionGrad.addColorStop(0, '#e11d48'); // Rich Royal Crimson
    cushionGrad.addColorStop(0.5, '#ea580c'); // Saffron Amber
    cushionGrad.addColorStop(1, '#b91c1c'); // Deep Ruby

    ctx.beginPath();
    ctx.ellipse(0, 0, w * 0.48, h * 0.42, 0, Math.PI, 0, true);
    ctx.bezierCurveTo(w * 0.5, h * 0.35, -w * 0.5, h * 0.35, -w * 0.48, 0);
    ctx.fillStyle = cushionGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fbbf24'; // Gold Trim
    ctx.stroke();

    // 2. Overlapping Diagonal Fabric Folds (Safa Layers)
    const bandColors = ['#f59e0b', '#fbbf24', '#e11d48', '#f59e0b', '#fde047'];
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      const yOffset = -h * 0.25 + i * (h * 0.12);
      ctx.moveTo(-w * 0.42, yOffset);
      ctx.quadraticCurveTo(0, yOffset + h * 0.2, w * 0.42, yOffset - h * 0.05);
      ctx.lineWidth = h * 0.12;
      ctx.strokeStyle = bandColors[i % bandColors.length];
      ctx.lineCap = 'round';
      ctx.stroke();

      // Golden seam line
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }

    // 3. Side Royal Palla (Hanging Golden Sash)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(w * 0.38, -h * 0.1);
    ctx.bezierCurveTo(w * 0.52, h * 0.3, w * 0.48, h * 0.7, w * 0.42, h * 0.95);
    ctx.bezierCurveTo(w * 0.35, h * 0.8, w * 0.32, h * 0.4, w * 0.34, 0);
    ctx.fillStyle = '#dc2626';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#facc15';
    ctx.stroke();
    ctx.restore();

    // 4. Center Royal Kalgi / Sarpech Medallion & Plume
    // Feather Plume
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.35);
    ctx.quadraticCurveTo(w * 0.1, -h * 0.75, w * 0.04, -h * 1.05);
    ctx.quadraticCurveTo(-w * 0.06, -h * 0.75, 0, -h * 0.35);
    ctx.fillStyle = '#facc15'; // Golden Plume
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Kalgi Outer Gold Medallion
    ctx.beginPath();
    ctx.arc(0, -h * 0.3, h * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Kalgi Center Emerald Jewel
    ctx.beginPath();
    ctx.arc(0, -h * 0.3, h * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = '#047857'; // Deep Emerald Green
    ctx.fill();

    // Jewel Highlight
    ctx.beginPath();
    ctx.arc(-h * 0.02, -h * 0.32, h * 0.025, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.restore();
  };

  // 5. Real-Time Detection Loop (100% Face-API Tracking)
  const startRealTimeDetectionLoop = () => {
    const detectAndRender = async () => {
      if (!isStreamingRef.current || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.paused || video.ended || video.readyState < 2) {
        animationRef.current = requestAnimationFrame(detectAndRender);
        return;
      }

      // Match internal canvas resolution to actual video stream resolution
      const vWidth = video.videoWidth || 1280;
      const vHeight = video.videoHeight || 720;

      if (canvas.width !== vWidth || canvas.height !== vHeight) {
        canvas.width = vWidth;
        canvas.height = vHeight;
      }

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        // REAL face-api detection (NO fake fallbacks)
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 });
        const detection = await faceapi.detectSingleFace(video, options).withFaceLandmarks();

        if (detection && detection.detection && detection.landmarks) {
          setFaceDetected(true);

          const box = detection.detection.box;
          const landmarks = detection.landmarks;

          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();

          const eyeCenterX = (leftEye[0].x + rightEye[3].x) / 2;
          const eyeCenterY = (leftEye[0].y + rightEye[3].y) / 2;

          // Head Roll Angle (tilt rotation in radians)
          const deltaX = rightEye[3].x - leftEye[0].x;
          const deltaY = rightEye[3].y - leftEye[0].y;
          const rollAngle = Math.atan2(deltaY, deltaX);

          // Target Turban Metrics calculated dynamically from face box
          const faceWidth = box.width;
          const faceHeight = box.height;

          const turbanWidth = faceWidth * 1.55;
          const turbanHeight = turbanWidth * 0.55;

          const targetMetrics = {
            centerX: eyeCenterX,
            topY: box.y - turbanHeight * 0.45,
            width: turbanWidth,
            height: turbanHeight,
            angle: rollAngle
          };

          // Lerp Smoothing: sm = prev * 0.65 + new * 0.35
          if (!smoothedFaceRef.current) {
            smoothedFaceRef.current = targetMetrics;
          } else {
            const lerp = (a, b, t = 0.35) => a + (b - a) * t;
            smoothedFaceRef.current = {
              centerX: lerp(smoothedFaceRef.current.centerX, targetMetrics.centerX),
              topY: lerp(smoothedFaceRef.current.topY, targetMetrics.topY),
              width: lerp(smoothedFaceRef.current.width, targetMetrics.width),
              height: lerp(smoothedFaceRef.current.height, targetMetrics.height),
              angle: lerp(smoothedFaceRef.current.angle, targetMetrics.angle)
            };
          }

          const sm = smoothedFaceRef.current;

          // Draw Programmatic Turban on Canvas
          // Mirror canvas drawing context to align with selfie video stream
          ctx.save();
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);

          drawRoyalTurban(ctx, sm.centerX, sm.topY, sm.width, sm.height, sm.angle);

          ctx.restore();
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

  // 6. Real Photo Capture & Offscreen Composition
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const vWidth = video.videoWidth || 1280;
    const vHeight = video.videoHeight || 720;

    tempCanvas.width = vWidth;
    tempCanvas.height = vHeight;

    // Draw mirrored video frame
    tempCtx.save();
    tempCtx.translate(vWidth, 0);
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(video, 0, 0, vWidth, vHeight);
    tempCtx.restore();

    // Draw programmatic turban overlay if face is detected
    if (faceDetected && smoothedFaceRef.current) {
      const sm = smoothedFaceRef.current;
      tempCtx.save();
      // Un-mirror coordinate for mirrored composite frame
      tempCtx.translate(vWidth, 0);
      tempCtx.scale(-1, 1);
      drawRoyalTurban(tempCtx, sm.centerX, sm.topY, sm.width, sm.height, sm.angle);
      tempCtx.restore();
    }

    const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
    setCapturedPhoto(dataUrl);
    if (onCapture) onCapture(dataUrl);
  };

  // Download captured PNG
  const handleDownloadPhoto = () => {
    if (!capturedPhoto) return;
    const a = document.createElement('a');
    a.href = capturedPhoto;
    a.download = `virasat-rakshak-ar-turban-${Date.now()}.png`;
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
        {/* Top Bar */}
        <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-slate-950/90 to-transparent z-30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-saffron-500 to-peacock-500 rounded-xl flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base sm:text-lg leading-tight">
                Virasat AR Cultural Try-On
              </h3>
              <p className="text-xs text-saffron-300">Active Filter: Royal Turban (Safa)</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopWebcamStream();
              if (onClose) onClose();
            }}
            className="p-2.5 bg-slate-800/80 hover:bg-red-600 text-white rounded-full transition-colors shadow-lg"
            title="Close AR Studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-black overflow-hidden">
          {/* Mirrored Video Stream */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain transform -scale-x-100"
            autoPlay
            muted
            playsInline
          />

          {/* Canvas Overlay for Turban AR */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Loading Overlay */}
          {(cameraState === 'loading_models' || cameraState === 'requesting_camera' || cameraState === 'initializing') && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center text-white z-20 space-y-4">
              <div className="w-14 h-14 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
              <p className="font-display text-base sm:text-lg text-saffron-200 animate-pulse">
                {cameraState === 'loading_models' && 'Loading face detection models...'}
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

          {/* Real Detection UI Status Badge */}
          {cameraState === 'active' && (
            <div className="absolute top-20 left-4 z-20">
              {faceDetected ? (
                <div className="bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 text-xs px-3.5 py-1.5 rounded-full flex items-center space-x-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>✓ Face detected • Turban AR Active</span>
                </div>
              ) : (
                <div className="bg-amber-950/85 backdrop-blur-md text-amber-300 border border-amber-500/30 text-xs px-3.5 py-1.5 rounded-full flex items-center space-x-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Position your face inside the frame</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Selector & Capture Bar */}
        <div className="relative z-30 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {arItems.map((item) => {
              const isTurban = item.type === 'turban';
              return (
                <button
                  key={item.id}
                  onClick={() => isTurban && onSelectFilter && onSelectFilter(item)}
                  disabled={!isTurban}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    isTurban
                      ? 'bg-gradient-to-r from-saffron-500 to-saffron-600 text-white shadow-md cursor-pointer'
                      : 'bg-slate-800/50 text-gray-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>{item.image}</span>
                  <span>{item.name}</span>
                  {!isTurban && <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-gray-400">Soon</span>}
                </button>
              );
            })}
          </div>

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

      {/* Photo Capture Preview Modal */}
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
                  <CheckCircle2 className="w-5 h-5 text-saffron-500" /> Turban Photo Captured
                </h3>
                <button onClick={() => setCapturedPhoto(null)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-black max-h-[350px]">
                <img src={capturedPhoto} alt="Captured Turban AR" className="w-full h-full object-contain" />
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