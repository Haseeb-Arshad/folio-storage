import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaYoutube, FaPlayCircle, FaVolumeUp, FaVolumeMute, FaExpand, FaPause, FaTimes } from 'react-icons/fa';

// Videos data with actual YouTube embeds
const videos = [
  {
    id: 1,
    title: "Working on a portfolio, again...",
    author: "Design Daily",
    views: "10K views",
    date: "2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1812&auto=format&fit=crop&ixlib=rb-4.0.3",
    embedUrl: "https://www.youtube.com/embed/oOct0xszVV4?autoplay=1&mute=0",
    description: "Join me as I redesign my portfolio website using modern design principles and the latest web technologies."
  },
  {
    id: 2,
    title: "How I organize my design system",
    author: "Design Daily",
    views: "8.5K views",
    date: "1 week ago",
    thumbnail: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    embedUrl: "https://www.youtube.com/embed/nEHMNlCLfEc?autoplay=1&mute=0",
    description: "A deep dive into how I structure and maintain my design system for maximum efficiency and consistency."
  },
  {
    id: 3,
    title: "Coding a stunning 3D website",
    author: "Design Daily",
    views: "15K views",
    date: "3 weeks ago",
    thumbnail: "https://images.unsplash.com/photo-1508780709619-79562169bc64?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3",
    embedUrl: "https://www.youtube.com/embed/bSMZgXzC9AA?autoplay=1&mute=0",
    description: "Learn how to create impressive 3D effects using Three.js and modern CSS techniques."
  }
];

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  togglePlay: () => void;
  toggleMute: () => void;
  onProgressChange: (value: number) => void;
  onFullscreen: () => void;
}

const VideoControls = ({ 
  isPlaying, 
  isMuted,
  progress, 
  togglePlay, 
  toggleMute,
  onProgressChange,
  onFullscreen
}: VideoControlsProps) => {
  return (
    <motion.div 
      className="absolute inset-x-4 bottom-4 z-40 flex flex-col space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      {/* Progress bar */}
      <div className="relative w-full h-1 bg-gray-700 rounded-full overflow-hidden group cursor-pointer">
        <motion.div 
          className="h-full bg-red-600"
          style={{ width: `${progress * 100}%` }}
        ></motion.div>
        
        {/* Hover effect */}
        <div className="absolute inset-0 transform scale-y-0 group-hover:scale-y-3 origin-bottom transition-transform"></div>
        
        {/* Thumb */}
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100"
          style={{ left: `${progress * 100}%`, translateX: '-50%' }}
        ></motion.div>
        
        {/* Interactive area for clicking */}
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.001" 
          value={progress}
          onChange={(e) => onProgressChange(parseFloat(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Video progress"
        />
      </div>
      
      {/* Control buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            className="text-white p-1 rounded-full hover:bg-white/20 transition-colors"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? 
              <FaPause className="w-5 h-5" /> : 
              <FaPlayCircle className="w-5 h-5" />
            }
          </button>
          
          <button 
            className="text-white p-1 rounded-full hover:bg-white/20 transition-colors"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? 
              <FaVolumeMute className="w-5 h-5" /> : 
              <FaVolumeUp className="w-5 h-5" />
            }
          </button>
          
          <div className="text-white text-xs">
            4:13 / 8:47
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            className="text-white p-1 rounded-full hover:bg-white/20 transition-colors"
            onClick={onFullscreen}
            aria-label="Fullscreen"
          >
            <FaExpand className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function VideoPlayer() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0.45);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  // Progress simulation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying && !isExpanded) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 1) {
            clearInterval(interval);
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.001;
        });
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isExpanded]);
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // If in expanded mode with iframe
    if (isExpanded && iframeRef.current) {
      try {
        const src = iframeRef.current.src;
        if (src.includes('mute=0')) {
          iframeRef.current.src = src.replace('mute=0', 'mute=1');
        } else {
          iframeRef.current.src = src.replace('mute=1', 'mute=0');
        }
      } catch (error) {
        console.error('Failed to toggle mute on iframe:', error);
      }
    }
  };
  
  const handleFullscreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  const handleVideoContainerEnter = () => {
    setShowControls(true);
  };
  
  const handleVideoContainerLeave = () => {
    if (!isPlaying) return;
    setShowControls(false);
  };
  
  const handleProgressChange = (value: number) => {
    setProgress(value);
  };
  
  const handleExpandClick = () => {
    setIsExpanded(true);
    setShowControls(true);
    setIsPlaying(true);
  };
  
  const handleCloseExpanded = () => {
    setIsExpanded(false);
    setIsPlaying(false);
  };
  
  const handleNextVideo = () => {
    setActiveVideoIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    setProgress(0);
  };
  
  const handlePrevVideo = () => {
    setActiveVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    setProgress(0);
  };

  const activeVideo = videos[activeVideoIndex];

  return (
    <>
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">Design livestreams</h2>
          <a 
            href="https://youtube.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FaYoutube className="w-4 h-4 text-red-600" />
            My Youtube
            <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
        
        {/* Enhanced 3D TV/Monitor with stand */}
        <div className="relative flex flex-col items-center perspective">
          {/* TV Frame */}
          <motion.div 
            className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl transform-gpu"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: 'rotateX(2deg)',
            }}
            ref={videoContainerRef}
            onMouseEnter={handleVideoContainerEnter}
            onMouseLeave={handleVideoContainerLeave}
            whileHover={{ scale: 1.01, rotateX: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* TV Bezel */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black rounded-xl p-3 transform-gpu"
                 style={{ transformStyle: 'preserve-3d' }}>
              {/* Power LED */}
              <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 z-50 shadow-glow-red"></div>
              
              {/* Camera/sensor */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gray-900 ring-1 ring-gray-700 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-black"></div>
              </div>
              
              {/* TV Screen */}
              <div className="relative w-full h-full overflow-hidden rounded-md shadow-inner bg-black">
                {/* Video thumbnail */}
                <img 
                  src={activeVideo.thumbnail} 
                  alt={activeVideo.title}
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Screen overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent mix-blend-overlay pointer-events-none"></div>
                <div className="absolute top-0 w-full h-1/4 bg-gradient-to-b from-white/10 to-transparent blur-xl pointer-events-none"></div>
                
                {/* Scan lines effect */}
                <div className="absolute inset-0 bg-repeat opacity-10 pointer-events-none"
                     style={{
                       backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.1) 1px, transparent 1px, transparent 2px)',
                       backgroundSize: '100% 2px'
                     }}>
                </div>
                
                {/* Play button overlay */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-30"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: isPlaying ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    className="cursor-pointer p-8 rounded-full bg-red-600/30 backdrop-blur-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExpandClick}
                    aria-label="Play video"
                  >
                    <FaPlayCircle className="w-14 h-14 text-white" />
                  </motion.button>
                </motion.div>
                
                {/* Video info overlay */}
                <div className="absolute bottom-12 left-4 right-4 flex flex-col z-30">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 ring-2 ring-white/20 flex-shrink-0">
                      <img 
                        src="https://source.unsplash.com/random/100x100?profile" 
                        alt="Channel Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{activeVideo.title}</h3>
                      <p className="text-gray-300 text-xs">{activeVideo.author} • {activeVideo.views} • {activeVideo.date}</p>
                    </div>
                  </div>
                </div>
                
                {/* Video controls - visible on hover or when paused */}
                <AnimatePresence>
                  {showControls && (
                    <VideoControls 
                      isPlaying={isPlaying}
                      isMuted={isMuted}
                      progress={progress}
                      togglePlay={togglePlay}
                      toggleMute={toggleMute}
                      onProgressChange={handleProgressChange}
                      onFullscreen={handleFullscreen}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          {/* TV Stand with enhanced 3D effect */}
          <div className="relative mt-1 perspective transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
            {/* Stand Neck */}
            <div className="h-14 w-4 transform-gpu" 
                style={{ 
                  background: 'linear-gradient(to bottom, #4a5568, #2d3748)',
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(0) rotateX(-2deg)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
            ></div>
            
            {/* Stand Base */}
            <div className="h-3 w-48 transform-gpu rounded-full" 
                style={{ 
                  background: 'linear-gradient(to bottom, #4a5568, #2d3748)',
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(0) translateY(-4px)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
            >
              {/* Reflective surface */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-white/20 to-black/5 rounded-full"></div>
            </div>
            
            {/* Stand Shadow */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-4 rounded-full"
                style={{ 
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 70%)',
                  filter: 'blur(3px)'
                }}
            ></div>
          </div>
          
          {/* Video Selection Navigation */}
          <div className="absolute -bottom-10 left-0 right-0 flex justify-center space-x-2 z-10">
            {videos.map((video, index) => (
              <button 
                key={video.id}
                className={`w-2 h-2 rounded-full transition-all ${index === activeVideoIndex ? 'bg-red-600 w-4' : 'bg-gray-400'}`}
                onClick={() => {
                  setActiveVideoIndex(index);
                  setProgress(0);
                }}
                aria-label={`Select video ${index + 1}`}
              ></button>
            ))}
          </div>
          
          {/* Navigation Arrows */}
          <button 
            className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white shadow-md z-10"
            onClick={handlePrevVideo}
            aria-label="Previous video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-white/80 p-2 rounded-full text-gray-800 hover:bg-white shadow-md z-10"
            onClick={handleNextVideo}
            aria-label="Next video"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Fullscreen YouTube video modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              onClick={handleCloseExpanded}
              aria-label="Close video"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            
            {/* Video info */}
            <div className="absolute top-4 left-4 max-w-xs">
              <h2 className="text-white font-medium text-lg">{activeVideo.title}</h2>
              <p className="text-gray-300 text-sm">{activeVideo.author}</p>
              <p className="text-gray-400 text-xs mt-1">{activeVideo.views} • {activeVideo.date}</p>
            </div>
            
            {/* YouTube iframe */}
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <iframe
                ref={iframeRef}
                className="w-full h-full"
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Video description */}
            <div className="absolute bottom-4 left-4 max-w-md bg-black/50 backdrop-blur-sm p-3 rounded-lg">
              <p className="text-gray-200 text-sm">{activeVideo.description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 