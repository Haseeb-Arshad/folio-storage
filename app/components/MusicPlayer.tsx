import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpotify, FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp } from 'react-icons/fa';

interface AlbumCoverProps {
  coverImage: string;
  title: string;
  artist: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const AlbumCover = ({ coverImage, title, artist, index, isActive, onClick }: AlbumCoverProps) => {
  return (
    <motion.div 
      className={`relative cursor-pointer ${isActive ? 'z-20' : ''}`}
      whileHover={{ 
        y: -8,
        scale: 1.05,
        rotateZ: 0,
        transition: { duration: 0.2 }
      }}
      animate={{
        scale: isActive ? 1.1 : 1,
        y: isActive ? -10 : 0,
        rotateZ: isActive ? 0 : (index % 2 === 0 ? -3 : 3)
      }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300
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
        className={`w-20 h-20 rounded-md overflow-hidden shadow-lg ${isActive ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
      >
        <img 
          src={coverImage} 
          alt={`${title} by ${artist}`}
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      {/* Album reflection/shadow for 3D effect */}
      <div 
        className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-4/5 h-4 bg-black/20 filter blur-sm rounded-full"
      ></div>

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
const VinylRecord = ({ isPlaying }: { isPlaying: boolean }) => {
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
                   w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/70 text-[8px] font-bold">SPOTIFY</span>
        </div>
      </div>
    </motion.div>
  );
};

// Audio player controls
const AudioControls = ({ 
  isPlaying, 
  onPlayPause, 
  onPrev, 
  onNext, 
  volume, 
  onVolumeChange 
}: { 
  isPlaying: boolean; 
  onPlayPause: () => void; 
  onPrev: () => void; 
  onNext: () => void; 
  volume: number;
  onVolumeChange: (value: number) => void;
}) => {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="flex items-center space-x-4">
        <button 
          className="p-2 text-gray-800 hover:text-green-600 focus:outline-none"
          onClick={onPrev}
          aria-label="Previous track"
        >
          <FaBackward className="w-4 h-4" />
        </button>
        <button 
          className="p-3 bg-green-500 rounded-full text-white hover:bg-green-600 focus:outline-none"
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5 ml-0.5" />}
        </button>
        <button 
          className="p-2 text-gray-800 hover:text-green-600 focus:outline-none"
          onClick={onNext}
          aria-label="Next track"
        >
          <FaForward className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center space-x-2 w-full">
        <FaVolumeUp className="w-3 h-3 text-gray-600" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
          aria-label="Volume control"
        />
      </div>
    </div>
  );
};

export default function MusicPlayer() {
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
      audioRef.current.volume = volume;
      
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
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
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
    setActiveAlbumIndex(prev => (prev === 0 ? albums.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveAlbumIndex(prev => (prev === albums.length - 1 ? 0 : prev + 1));
  };
  
  // Auto-rotate albums - uncomment to enable
  // useEffect(() => {
  //   if (isPlaying) {
  //     const interval = setInterval(() => {
  //       handleNext();
  //     }, 10000);
  //     return () => clearInterval(interval);
  //   }
  // }, [isPlaying]);
  
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">Listening to...</h2>
        <a 
          href="https://spotify.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <FaSpotify className="w-5 h-5 text-green-500 mr-2" />
          <span className="mr-1">My Spotify</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </a>
      </div>
      
      <div className="flex items-center justify-between gap-8">
        {/* Left side - Record animation */}
        <div className="relative flex-shrink-0">
          <motion.div
            animate={{
              x: isPlaying ? [0, -10, 0] : 0
            }}
            transition={{
              duration: 0.5,
              repeat: isPlaying ? Infinity : 0,
              repeatDelay: 5
            }}
          >
            <VinylRecord isPlaying={isPlaying} />
          </motion.div>
        </div>
        
        {/* Right side - Album covers & controls */}
        <div className="flex-1 flex flex-col items-center">
          {/* Album covers carousel */}
          <div className="relative h-32 w-full mb-6 flex items-center justify-center">
            {albums.map((album, index) => {
              // Calculate position for a circular arrangement
              const isActive = index === activeAlbumIndex;
              const position = index - activeAlbumIndex;
              const absPosition = Math.abs(position);
              const zIndex = 10 - absPosition;
              
              // Determine visual position
              let xPos = 0;
              
              if (position !== 0) {
                xPos = position * 40;
                
                // Pull albums at the edges more to the sides 
                if (absPosition > 1) {
                  xPos = position * 60;
                }
              }
              
              return (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={false}
                  animate={{
                    x: xPos,
                    opacity: absPosition <= 2 ? 1 : 0,
                    scale: 1 - absPosition * 0.15,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{ zIndex }}
                >
                  <AlbumCover
                    coverImage={album.coverImage}
                    title={album.title}
                    artist={album.artist}
                    index={index}
                    isActive={isActive}
                    onClick={() => setActiveAlbumIndex(index)}
                  />
                </motion.div>
              );
            })}
          </div>
          
          {/* Player controls */}
          <div className="w-full max-w-xs">
            <AudioControls 
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onPrev={handlePrevious}
              onNext={handleNext}
              volume={volume}
              onVolumeChange={setVolume}
            />
          </div>
        </div>
      </div>
      
      {/* Hidden audio element for Spotify preview */}
      <audio 
        ref={audioRef}
        src={albums[activeAlbumIndex].previewUrl}
        preload="none"
        onEnded={() => {
          handleNext();
          setIsPlaying(true);
        }}
      />
    </div>
  );
} 