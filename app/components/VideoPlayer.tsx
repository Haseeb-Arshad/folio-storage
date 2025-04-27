import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaYoutube, FaPlayCircle, FaVolumeUp, FaVolumeMute, FaExpand, FaPause, FaTimes } from 'react-icons/fa';
import { cn } from '../utils/cn';

// Videos data with actual YouTube embeds - using reliable YouTube preview thumbnails
const videos = [
  {
    id: 1,
    title: "Working on a portfolio, again...",
    author: "Design Daily",
    views: "10K views",
    date: "2 days ago",
    thumbnail: "https://i.ytimg.com/vi/oOct0xszVV4/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/oOct0xszVV4?autoplay=1&mute=0",
    description: "Join me as I redesign my portfolio website using modern design principles and the latest web technologies."
  },
  {
    id: 2,
    title: "How I organize my design system",
    author: "Design Daily",
    views: "8.5K views",
    date: "1 week ago",
    thumbnail: "https://i.ytimg.com/vi/nEHMNlCLfEc/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/nEHMNlCLfEc?autoplay=1&mute=0",
    description: "A deep dive into how I structure and maintain my design system for maximum efficiency and consistency."
  },
  {
    id: 3,
    title: "Coding a stunning 3D website",
    author: "Design Daily",
    views: "15K views",
    date: "3 weeks ago",
    thumbnail: "https://i.ytimg.com/vi/bSMZgXzC9AA/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/bSMZgXzC9AA?autoplay=1&mute=0",
    description: "Learn how to create impressive 3D effects using Three.js and modern CSS techniques."
  }
];

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  duration: string;
  currentTime: string;
  togglePlay: () => void;
  toggleMute: () => void;
  onProgressChange: (value: number) => void;
  onFullscreen: () => void;
}

const VideoControls = ({ 
  isPlaying, 
  isMuted,
  progress, 
  duration,
  currentTime,
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
            {currentTime} / {duration}
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
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Update progress when video plays
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video) return;
    
    const updateProgress = () => {
      if (video.duration) {
        setProgress(video.currentTime / video.duration);
        setCurrentTime(formatTime(video.currentTime));
        setDuration(formatTime(video.duration));
      }
    };
    
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', () => {
      setDuration(formatTime(video.duration));
    });
    
    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateProgress);
    };
  }, [activeVideoIndex]);
  
  // Handle play/pause state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.play().catch(error => {
        console.error('Failed to play video:', error);
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);
  
  // Handle mute state changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = isMuted;
  }, [isMuted]);
  
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
    
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = value * videoRef.current.duration;
    }
  };
  
  const handleExpandClick = () => {
    setIsExpanded(true);
    setShowControls(true);
    setIsPlaying(false); // Don't autoplay - let YouTube iframe handle it
  };
  
  const handleCloseExpanded = () => {
    setIsExpanded(false);
    setIsPlaying(false);
  };
  
  const handleNextVideo = () => {
    setActiveVideoIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    setProgress(0);
    setCurrentTime("0:00");
    
    // Reset video if switching
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };
  
  const handlePrevVideo = () => {
    setActiveVideoIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    setProgress(0);
    setCurrentTime("0:00");
    
    // Reset video if switching
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
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
            className="flex items-center text-red-600 font-medium text-sm hover:text-red-500 transition-colors gap-1"
          >
            <FaYoutube className="w-5 h-5" />
            <span>YouTube Channel</span>
          </a>
        </div>
        
        {/* Video Player */}
        <div className="mb-6 overflow-hidden">
          <div 
            ref={videoContainerRef}
            className={cn(
              "relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md",
              isFullscreen ? "fixed inset-0 z-[9999] rounded-none" : ""
            )}
            onMouseEnter={handleVideoContainerEnter}
            onMouseLeave={handleVideoContainerLeave}
          >
            {/* Video Element */}
            <video 
              ref={videoRef}
              src={`video-${activeVideoIndex + 1}.mp4`} // Will need to be replaced with actual video file paths
              poster={activeVideo.thumbnail}
              className="absolute inset-0 w-full h-full object-cover bg-black"
              onEnded={() => setIsPlaying(false)}
              playsInline
            />
            
            {/* Poster/Thumbnail layer with play button */}
            {!isPlaying && (
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
                onClick={togglePlay}
              >
                <motion.div 
                  className="bg-red-600 text-white rounded-full p-4 shadow-lg"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlayCircle className="w-12 h-12" />
                </motion.div>
              </div>
            )}
            
            {/* Video Controls - only shown when hovered or controls are visible */}
            <AnimatePresence>
              {(showControls || !isPlaying) && (
                <VideoControls 
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  progress={progress}
                  duration={duration}
                  currentTime={currentTime}
                  togglePlay={togglePlay}
                  toggleMute={toggleMute}
                  onProgressChange={handleProgressChange}
                  onFullscreen={handleFullscreen}
                />
              )}
            </AnimatePresence>
            
            {/* Video title overlay */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
              <h3 className="text-white font-medium text-lg">{activeVideo.title}</h3>
              <p className="text-white/80 text-sm">{activeVideo.author} • {activeVideo.views}</p>
            </div>
            
            {/* Watch on YouTube / Expand button */}
            <button
              className="absolute bottom-20 right-4 bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-red-700 transition-colors"
              onClick={handleExpandClick}
            >
              <FaYoutube className="w-4 h-4" />
              <span>Watch on YouTube</span>
            </button>
          </div>
          
          {/* Video navigation */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {videos.map((video, idx) => (
              <div 
                key={video.id}
                className={cn(
                  "relative rounded-md overflow-hidden cursor-pointer aspect-video",
                  activeVideoIndex === idx ? "ring-2 ring-red-500" : ""
                )}
                onClick={() => setActiveVideoIndex(idx)}
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="text-white">
                    <FaPlayCircle className="w-8 h-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Video info */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-medium text-gray-900 mb-1">{activeVideo.title}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <span>{activeVideo.author}</span>
            <span className="mx-2">•</span>
            <span>{activeVideo.views}</span>
            <span className="mx-2">•</span>
            <span>{activeVideo.date}</span>
          </div>
          <p className="text-gray-700 text-sm">{activeVideo.description}</p>
        </div>
      </div>
      
      {/* YouTube Expanded Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-full max-w-5xl aspect-video rounded-lg overflow-hidden shadow-2xl">
              <iframe
                ref={iframeRef}
                src={`${activeVideo.embedUrl}&autoplay=1&mute=${isMuted ? 1 : 0}`}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={activeVideo.title}
              ></iframe>
              
              <button
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                onClick={handleCloseExpanded}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 