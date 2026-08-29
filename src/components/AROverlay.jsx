import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import * as faceapi from 'face-api.js'

export const AROverlay = ({ selectedItem, isActive, onCapture, onClose }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const isStreamingRef = useRef(false)
  const [error, setError] = useState(null)
  const [filterImage, setFilterImage] = useState(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const animationRef = useRef(null)

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models'
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ])
        console.log('Face detection models loaded successfully')
        setIsModelLoaded(true)
      } catch (err) {
        console.error('Error loading face-api models:', err)
        setError('Failed to load face detection models. Using fallback detection.')
        setIsModelLoaded(false)
      }
    }
    loadModels()
  }, [])

  // Preload Filter PNG
  useEffect(() => {
    if (selectedItem && selectedItem.type) {
      console.log('Preloading filter for:', selectedItem.type)
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        console.log('Filter PNG loaded:', selectedItem.type, 'Dimensions:', img.width, 'x', img.height)
        setFilterImage(img)
        setError(null)
      }
      img.onerror = (e) => {
        console.error('Filter PNG failed to load:', selectedItem.type, e)
        setError(`Filter failed to load: ${selectedItem.type}`)
        setFilterImage(null)
      }
      img.src = `/assets/filters/${selectedItem.type}.png`
      console.log('Attempting to load:', img.src)
    } else {
      console.log('No filter selected')
      setFilterImage(null)
    }
  }, [selectedItem])

  useEffect(() => {
    if (isActive && isModelLoaded) {
      startCamera()
    } else if (isActive && !isModelLoaded) {
      startCamera() // Start with fallback detection
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isActive, isModelLoaded])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        isStreamingRef.current = true
        setIsStreaming(true)
        setError(null)
        startFaceDetection()
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    isStreamingRef.current = false
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsStreaming(false)
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const startFaceDetection = () => {
    const detectFaces = async () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current
        const video = videoRef.current
        const ctx = canvas.getContext('2d')
        
        // Set canvas size to match video display size
        const videoRect = video.getBoundingClientRect()
        canvas.width = videoRect.width
        canvas.height = videoRect.height
        
        // Continuously clear canvas each frame
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        try {
          let detection = null
          
          if (isModelLoaded) {
            // Use face-api.js for real face detection
            detection = await faceapi.detectSingleFace(video).withFaceLandmarks()
          } else {
            // Fallback: simulate face detection at center
            const faceWidth = canvas.width * 0.4
            const faceHeight = canvas.height * 0.5
            const faceX = canvas.width * 0.5 - faceWidth / 2
            const faceY = canvas.height * 0.4 - faceHeight / 2
            
            detection = {
              detection: {
                box: {
                  x: faceX,
                  y: faceY,
                  width: faceWidth,
                  height: faceHeight
                }
              }
            }
          }
          
          if (detection) {
            const { x, y, width, height } = detection.detection.box
            setFaceDetected(true)
            
            // Debug log for face box
            console.log("Face box:", x, y, width, height)
            
            // Always draw red rectangle for debugging
            ctx.strokeStyle = 'red'
            ctx.lineWidth = 3
            ctx.strokeRect(x, y, width, height)
            
            // Draw face landmarks if available
            if (detection.landmarks) {
              ctx.fillStyle = '#00ff00'
              detection.landmarks.positions.forEach(point => {
                ctx.beginPath()
                ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
                ctx.fill()
              })
            }
            
            // Draw Filter PNG if selected and loaded
            if (selectedItem && filterImage) {
              console.log('Drawing filter PNG:', selectedItem.type, 'at face box:', { x, y, width, height })
              
              // Scale coordinates from video dimensions to canvas dimensions
              const scaleX = canvas.width / video.videoWidth
              const scaleY = canvas.height / video.videoHeight
              
              const scaledX = x * scaleX
              const scaledY = y * scaleY
              const scaledWidth = width * scaleX
              const scaledHeight = height * scaleY
              
              // Draw filter PNG with the specified positioning
              const filterX = scaledX - scaledWidth * 0.25
              const filterY = scaledY - scaledHeight * 0.5
              const filterWidth = scaledWidth * 1.5
              const filterHeight = scaledHeight * 1.5
              
              console.log('Drawing PNG at:', { filterX, filterY, filterWidth, filterHeight })
              ctx.drawImage(filterImage, filterX, filterY, filterWidth, filterHeight)
            } else if (selectedItem && !filterImage) {
              console.log('Filter selected but PNG not loaded yet:', selectedItem.type)
            } else {
              console.log('No filter selected - only showing red bounding box')
            }
          } else {
            setFaceDetected(false)
            console.log('No face detected')
          }
        } catch (err) {
          console.error('Face detection error:', err)
          setFaceDetected(false)
        }
      }
      
      if (isStreamingRef.current) {
        animationRef.current = requestAnimationFrame(detectFaces)
      }
    }
    
    detectFaces()
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      // Create a temporary canvas for capture
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      const video = videoRef.current
      
      // Set temp canvas to video dimensions
      tempCanvas.width = video.videoWidth
      tempCanvas.height = video.videoHeight
      
      // Draw video frame
      tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height)
      
      // Draw filter overlay if selected
      if (filterImage && selectedItem) {
        // Simulate face detection for capture
        const faceWidth = tempCanvas.width * 0.4
        const faceHeight = tempCanvas.height * 0.5
        const faceX = tempCanvas.width * 0.5 - faceWidth / 2
        const faceY = tempCanvas.height * 0.4 - faceHeight / 2
        
        const filterX = faceX - faceWidth * 0.25
        const filterY = faceY - faceHeight * 0.5
        const filterWidth = faceWidth * 1.5
        const filterHeight = faceHeight * 1.5
        
        tempCtx.drawImage(filterImage, filterX, filterY, filterWidth, filterHeight)
      }
      
      // Convert to blob and download
      tempCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ar-tryon-${selectedItem?.name || 'heritage'}-${Date.now()}.png`
        a.click()
        URL.revokeObjectURL(url)
        onCapture && onCapture()
      }, 'image/png', 1.0)
    }
  }

  if (!isActive) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="relative w-full h-full max-w-4xl max-h-screen">
        {/* Video Feed */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
        
        {/* Canvas Overlay - Ensure it's above video with correct CSS */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            zIndex: 10 
          }}
        />
        
        {/* AR Overlay Instructions */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-black/70 text-white p-3 rounded-lg">
            <h3 className="font-semibold mb-1">AR Try-On Active</h3>
            <p className="text-sm opacity-90">
              {selectedItem ? `Trying on: ${selectedItem.name}` : 'No filter selected'}
            </p>
            {faceDetected && (
              <p className="text-sm text-green-300 mt-1">
                Face detected! {filterImage ? `Filter applied (${selectedItem?.type})` : 'Loading filter...'}
              </p>
            )}
            {!faceDetected && (
              <p className="text-sm text-yellow-300 mt-1">
                Position your face in the center
              </p>
            )}
            {selectedItem && !filterImage && (
              <p className="text-sm text-orange-300 mt-1">
                Loading {selectedItem.type} filter...
              </p>
            )}
            {!isModelLoaded && (
              <p className="text-sm text-blue-300 mt-1">
                Using fallback detection
              </p>
            )}
          </div>
          
          <button
            onClick={() => onClose && onClose()}
            className="bg-saffron-500 text-white p-3 rounded-full hover:bg-saffron-600 transition-colors"
          >
            ✕
          </button>
        </div>
        
        {/* Capture Button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={capturePhoto}
            disabled={!isStreaming}
            className="bg-white text-gray-900 p-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/>
            </svg>
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-4 rounded-lg max-w-sm text-center">
            {error}
          </div>
        )}
      </div>
    </motion.div>
  )
}