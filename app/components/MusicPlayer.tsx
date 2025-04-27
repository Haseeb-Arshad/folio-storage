import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpotify, FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { cn } from '../utils/cn';

interface AlbumCoverProps {
  coverImage: string;
  title: string;
  artist: string;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
}

const AlbumCover = ({ coverImage, title, artist, index, isActive, isPlaying, onClick }: AlbumCoverProps) => {
  return (
    <motion.div 
      className={cn(
        "relative cursor-pointer",
        isActive ? "z-20" : ""
      )}
      whileHover={{ 
        y: -8,
        scale: 1.05,
        rotateZ: 0,
        transition: { duration: 0.2 }
      }}
      animate={{
        scale: isActive ? 1.1 : 1,
        y: isActive ? -10 : 0,
        rotateZ: isActive ? 0 : (index % 2 === 0 ? -3 : 3),
        transition: { 
          duration: 0.3,
          type: "spring",
          stiffness: 300
        }
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ 
        zIndex: isActive ? 30 : 20 - index,
        transformOrigin: 'bottom center'
      }}
      title={`${title} by ${artist}`}
    >
      <motion.div 
        className={cn(
          "w-20 h-20 rounded-md overflow-hidden shadow-lg",
          isActive ? "ring-2 ring-green-500 ring-offset-2" : ""
        )}
        animate={{
          rotateY: isActive && isPlaying ? [0, 5, 0, -5, 0] : 0,
          transition: {
            duration: 2,
            repeat: isActive && isPlaying ? Infinity : 0,
            repeatType: "reverse"
          }
        }}
      >
        <img 
          src={coverImage} 
          alt={`${title} by ${artist}`}
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Album reflection/shadow for 3D effect */}
      <motion.div 
        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4/5 h-4 bg-black/20 filter blur-sm rounded-full"
        animate={{
          scaleX: isActive && isPlaying ? [1, 1.1, 1, 0.9, 1] : 1,
          opacity: isActive ? 0.6 : 0.2,
          transition: {
            duration: 2,
            repeat: isActive && isPlaying ? Infinity : 0,
            repeatType: "reverse"
          }
        }}
      ></motion.div>

      {/* Album info - only shown when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-2 w-40 text-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <p className="font-medium text-sm truncate">{title}</p>
            <p className="text-xs text-gray-600 truncate">{artist}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Vinyl record animation
const VinylRecord = ({ isPlaying, coverImage }: { isPlaying: boolean; coverImage: string }) => {
  return (
    <motion.div 
      className="relative w-36 h-36"
      animate={{ 
        rotate: isPlaying ? 360 : 0,
        transition: { 
          duration: 6,
          repeat: isPlaying ? Infinity : 0,
          ease: "linear"
        }
      }}
    >
      {/* Outer ring of record */}
      <div className="absolute inset-0 rounded-full bg-black/90 shadow-lg"></div>
      
      {/* Vinyl grooves - create concentric circles */}
      <div className="absolute inset-2 rounded-full bg-black/80 
                   border-[6px] border-black/40 opacity-70"></div>
      <div className="absolute inset-8 rounded-full bg-black/70 
                   border-[3px] border-black/30 opacity-60"></div>
      <div className="absolute inset-14 rounded-full bg-black/60 
                   border-[2px] border-black/20 opacity-50"></div>
      
      {/* Light reflection effect */}
      <div className="absolute top-1/4 left-1/4 w-1/4 h-1/10 bg-white/10 rounded-full 
                   transform rotate-45 blur-sm"></div>
      
      {/* Center hole */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   w-5 h-5 rounded-full bg-black/50 border-4 border-gray-500/30"></div>
      
      {/* Center label */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   w-16 h-16 rounded-full overflow-hidden shadow-inner">
        {/* Mini album art in center */}
        <img 
          src={coverImage} 
          alt="Album cover" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/90 text-[8px] font-bold">SPOTIFY</span>
        </div>
      </div>
    </motion.div>
  );
};

// Progress Bar with waveform visualization
const AudioProgressBar = ({ 
  progress, 
  duration, 
  currentTime,
  isPlaying,
  onSeek
}: { 
  progress: number; 
  duration: string;
  currentTime: string;
  isPlaying: boolean;
  onSeek: (value: number) => void;
}) => {
  const waveformBars = 30; // Number of bars in waveform visualization
  
  return (
    <div className="w-full space-y-1">
      <div className="relative h-8 w-full group">
        {/* Waveform visualization */}
        <div className="absolute inset-x-0 bottom-0 h-6 flex items-end justify-between px-0.5 space-x-0.5">
          {Array.from({ length: waveformBars }).map((_, i) => {
            // Generate a pseudo-random height based on position and time
            const randomHeight = 20 + Math.sin(i * 0.5 + Date.now() * 0.001) * 15;
            const height = isPlaying ? `${randomHeight}%` : '20%';
            
            // Determine if this bar is before or after the current playback position
            const isPlayed = (i / waveformBars) < progress;
            
            return (
              <motion.div
                key={i}
                className={`w-full rounded-t-sm ${isPlayed ? 'bg-green-500' : 'bg-gray-300'}`}
                initial={{ height: '20%' }}
                animate={{ height }}
                transition={{ 
                  duration: isPlaying ? 0.3 : 0.1, 
                  ease: "easeInOut" 
                }}
              ></motion.div>
            );
          })}
        </div>
        
        {/* Progress tracker */}
        <div 
          className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-r from-green-500/20 to-green-500/0 rounded-md"
          style={{ width: `${progress * 100}%` }}
        ></div>
        
        {/* Thumb */}
        <motion.div 
          className="absolute bottom-0 h-6 w-1 bg-green-500 rounded-full transform translate-x(-50%) opacity-0 group-hover:opacity-100"
          style={{ left: `${progress * 100}%` }}
          transition={{ duration: 0.1 }}
        ></motion.div>
        
        {/* Interactive slider */}
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.001"
          value={progress}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          aria-label="Audio playback position"
        />
      </div>
      
      {/* Time display */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>
    </div>
  );
};

// Audio player controls
const AudioControls = ({ 
  isPlaying, 
  onPlayPause, 
  onPrev, 
  onNext, 
  volume, 
  isMuted,
  onMuteToggle,
  onVolumeChange 
}: { 
  isPlaying: boolean; 
  onPlayPause: () => void; 
  onPrev: () => void; 
  onNext: () => void; 
  volume: number;
  isMuted: boolean;
  onMuteToggle: () => void;
  onVolumeChange: (value: number) => void;
}) => {
  return (
    <div className="flex items-center space-x-4 mb-2">
      <button 
        className="p-2 text-gray-800 hover:text-green-600 focus:outline-none"
        onClick={onPrev}
        aria-label="Previous track"
      >
        <FaBackward className="w-4 h-4" />
      </button>
      
      <motion.button 
        className="p-3 bg-green-500 rounded-full text-white hover:bg-green-600 focus:outline-none"
        onClick={onPlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
      >
        {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5 ml-0.5" />}
      </motion.button>
      
      <button 
        className="p-2 text-gray-800 hover:text-green-600 focus:outline-none"
        onClick={onNext}
        aria-label="Next track"
      >
        <FaForward className="w-4 h-4" />
      </button>
      
      <div className="flex items-center space-x-2 ml-2">
        <button
          className="text-gray-600 hover:text-green-600 focus:outline-none"
          onClick={onMuteToggle}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute className="w-4 h-4" /> : <FaVolumeUp className="w-4 h-4" />}
        </button>
        
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-20 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
          aria-label="Volume control"
          style={{
            background: `linear-gradient(to right, #10B981 0%, #10B981 ${isMuted ? 0 : volume * 100}%, #D1D5DB ${isMuted ? 0 : volume * 100}%, #D1D5DB 100%)`
          }}
        />
      </div>
    </div>
  );
};

export default function MusicPlayer() {
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState("0:00");
  const [currentTime, setCurrentTime] = useState("0:00");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const albums = [
    { 
      coverImage: "https://source.unsplash.com/random/300x300?album=1", 
      title: "Starlight Melodies",
      artist: "Cosmic Harmony",
      previewUrl: "https://p.scdn.co/mp3-preview/2f37da1d4221f50e3e3471b1125795e265ad2fd3"
    },
    { 
      coverImage: "https://source.unsplash.com/random/300x300?album=2", 
      title: "Electric Dreams",
      artist: "Synth Collective",
      previewUrl: "https://p.scdn.co/mp3-preview/f5bee41c1403ec9c2e3e175318625e592db57c1e"
    },
    { 
      coverImage: "https://source.unsplash.com/random/300x300?album=3", 
      title: "Ocean Waves",
      artist: "Ambient Flow",
      previewUrl: "https://p.scdn.co/mp3-preview/d8a1b13c4fdb56b80a51231afe901e0a00fe835d"
    },
    { 
      coverImage: "https://source.unsplash.com/random/300x300?album=4", 
      title: "Urban Jungle",
      artist: "Metro Beats",
      previewUrl: "https://p.scdn.co/mp3-preview/0409f5751f014ef4f16b0b7b6afb5785ef0596b2"
    },
    { 
      coverImage: "https://source.unsplash.com/random/300x300?album=5", 
      title: "Midnight Jazz",
      artist: "Smooth Quartet",
      previewUrl: "https://p.scdn.co/mp3-preview/3eb16018c2a700240e9dfb5c7673c8e8e76df732"
    },
  ];
  
  // Handle album change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = albums[activeAlbumIndex].previewUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      setProgress(0);
      setCurrentTime("0:00");
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Failed to play audio:", error);
          setIsPlaying(false);
        });
      }
    }
  }, [activeAlbumIndex, albums]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Track audio progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
        setCurrentTime(formatTime(audio.currentTime));
        setDuration(formatTime(audio.duration));
      }
    };
    
    const handleLoadedMetadata = () => {
      setDuration(formatTime(audio.duration));
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Failed to play audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handlePrevious = () => {
    setActiveAlbumIndex((prevIndex) => (prevIndex === 0 ? albums.length - 1 : prevIndex - 1));
  };
  
  const handleNext = () => {
    setActiveAlbumIndex((prevIndex) => (prevIndex === albums.length - 1 ? 0 : prevIndex + 1));
  };
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };
  
  const handleSeek = (value: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = value * audioRef.current.duration;
      setProgress(value);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Now Playing</h2>
        <a 
          href="https://open.spotify.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-green-600 hover:text-green-700"
        >
          <FaSpotify className="w-4 h-4" />
          <span className="text-sm font-medium">Spotify</span>
        </a>
      </div>
      
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
        {/* Left side - Vinyl player with record */}
        <div className="relative">
          <motion.div
            className="relative w-44 h-44 rounded-full bg-gray-100 shadow-inner flex items-center justify-center"
            animate={{
              rotate: isPlaying ? [-1, 1, -1] : 0,
              transition: {
                duration: 4,
                repeat: isPlaying ? Infinity : 0,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
          >
            <VinylRecord isPlaying={isPlaying} coverImage={albums[activeAlbumIndex].coverImage} />
          </motion.div>
          
          {/* Turntable arm */}
          <motion.div
            className="absolute top-12 -right-8 w-20 h-4"
            style={{ transformOrigin: 'left center' }}
            animate={{
              rotateZ: isPlaying ? 25 : 0,
              transition: { duration: 0.5 }
            }}
          >
            <div className="w-full h-1 bg-gradient-to-r from-gray-400 to-gray-300 rounded-full"></div>
            <div className="absolute right-0 -top-1 w-4 h-4 rounded-full bg-gray-300 border border-gray-400"></div>
          </motion.div>
        </div>
        
        {/* Right side - Album covers and controls */}
        <div className="flex-1 w-full flex flex-col space-y-4">
          {/* Album display */}
          <div className="relative py-3">
            <div className="flex justify-center items-end space-x-4 h-24">
              {albums.map((album, index) => (
                <AlbumCover
                  key={index}
                  coverImage={album.coverImage}
                  title={album.title}
                  artist={album.artist}
                  index={index}
                  isActive={index === activeAlbumIndex}
                  isPlaying={isPlaying && index === activeAlbumIndex}
                  onClick={() => setActiveAlbumIndex(index)}
                />
              ))}
            </div>
          </div>
          
          {/* Now Playing Info */}
          <div className="text-center">
            <h3 className="font-medium text-gray-900">{albums[activeAlbumIndex].title}</h3>
            <p className="text-sm text-gray-600">{albums[activeAlbumIndex].artist}</p>
          </div>
          
          {/* Audio Progress */}
          <AudioProgressBar 
            progress={progress} 
            duration={duration}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onSeek={handleSeek}
          />
          
          {/* Controls */}
          <AudioControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
            onPrev={handlePrevious}
            onNext={handleNext}
            volume={volume}
            isMuted={isMuted}
            onMuteToggle={handleMuteToggle}
            onVolumeChange={handleVolumeChange}
          />
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
} 