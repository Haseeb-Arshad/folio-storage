import { useRef, useState, useEffect } from 'react';
import { Card } from './Card';
import { ExternalLinkIcon, SpotifyIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';

// Type for a single album
interface Album {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  previewUrl?: string; // Make previewUrl optional if some albums might not have it
}

// Album data (ensure it matches the Album type)
const albums: Album[] = [
  { 
    id: 1, 
    title: 'Hi Infidelity',
    artist: 'REO Speedwagon',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/43/REO_Speedwagon_Hi_Infidelity.jpg/220px-REO_Speedwagon_Hi_Infidelity.jpg',
    previewUrl: 'https://p.scdn.co/mp3-preview/d66ccf0d4da7a8b4c52d11558eb9e204a58d518d'
  },
  { 
    id: 2, 
    title: 'In Rainbows', 
    artist: 'Radiohead',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/14/Inrainbowscover.png',
    previewUrl: 'https://p.scdn.co/mp3-preview/3eb16018c2a700240e9dfb5c7673c8e8e76df732'
  },
  { 
    id: 3, 
    title: 'Sea Change', 
    artist: 'Beck',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/11/Beck_-_Sea_Change.jpg',
    previewUrl: 'https://p.scdn.co/mp3-preview/0409f5751f014ef4f16b0b7b6afb5785ef0596b2'
  },
  { 
    id: 4, 
    title: 'The Suburbs', 
    artist: 'Arcade Fire',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/8/81/Arcade_Fire_-_The_Suburbs.jpg',
    previewUrl: 'https://p.scdn.co/mp3-preview/2a75d5f933917b48c763ed5d63ee112093406e33'
  },
  { 
    id: 5, 
    title: 'Sleep Well Beast', 
    artist: 'The National',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/16/The_National_-_Sleep_Well_Beast.png',
    previewUrl: 'https://p.scdn.co/mp3-preview/c1c4d35d6aaeb55f16eaafbe3e3e73956c87ddcd'
  },
  { 
    id: 6, 
    title: 'Currents', 
    artist: 'Tame Impala',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9b/Tame_Impala_-_Currents.png',
    previewUrl: 'https://p.scdn.co/mp3-preview/894d8b6468ca4ca9f9a3b67d9caee7d4f2188088'
  },
  { 
    id: 7, 
    title: 'Shore', 
    artist: 'Fleet Foxes',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Fleet_Foxes_-_Shore.png',
    previewUrl: 'https://p.scdn.co/mp3-preview/d8a1b13c4fdb56b80a51231afe901e0a00fe835d'
  },
];

// Vinyl Record Component (Simplified, focuses on rotation and center label)
const VinylRecord = ({ isPlaying, activeAlbum }: { isPlaying: boolean, activeAlbum: Album }) => {
  return (
    <div className="relative w-36 h-36 md:w-40 md:h-40 perspective flex-shrink-0">
        {/* Spinning Vinyl */}
        <motion.div 
        className="absolute inset-0"
        animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ 
          duration: isPlaying ? 4 : 1, // Faster spin when playing
          repeat: isPlaying ? Infinity : 0, 
            ease: "linear",
          }}
        >
          {/* Main vinyl disc */}
          <div className="absolute inset-0 bg-black rounded-full shadow-lg"></div>
          
        {/* Vinyl grooves (simplified) */}
        {[...Array(5)].map((_, i) => (
             <div key={i} className="absolute rounded-full border border-gray-700/50" style={{ inset: `${(i+1)*6}px` }}></div>
        ))}
          
          {/* Center label */}
        <div className="absolute inset-0 m-auto w-14 h-14 rounded-full flex items-center justify-center transform-gpu shadow-inner overflow-hidden">
             {/* Use album art for label */}
             <img src={activeAlbum.imageUrl} alt={`${activeAlbum.title} label`} className="w-full h-full object-cover scale-110 blur-[1px]" />
             {/* Center hole */}
            <div className="absolute w-3 h-3 bg-black rounded-full border border-gray-600"></div> 
          </div>
          
        {/* Light reflections (Subtle) */}
        <div className="absolute top-2 left-5 w-10 h-2 bg-white/5 rounded-full transform rotate-45 opacity-80"></div>
        <div className="absolute bottom-8 right-4 w-6 h-1 bg-white/5 rounded-full transform rotate-45 opacity-80"></div>
        </motion.div>
    </div>
  );
};

// Album Stack Component Props Type
interface AlbumStackProps {
  albums: Album[];
  activeIndex: number;
  onAlbumClick: (index: number) => void;
}

// Album Stack Component
const AlbumStack = ({ 
    albums, 
    activeIndex, 
    onAlbumClick 
}: AlbumStackProps) => { // Use the defined props type
    const displayCount = 7; // Max albums visible in stack

  return (
        <div className="relative flex-1 h-full flex items-center justify-center perspective ml-[-20px]">
            <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px]" style={{ transformStyle: 'preserve-3d' }}>
                {albums.slice(0, displayCount).map((album: Album, index: number) => { // Add types for map parameters
                    const isActive = index === activeIndex;
                    const stackIndex = index - activeIndex;
                    const maxOffset = 40; // Max Z offset for non-active albums
                    const offsetMultiplier = 0.6;

                    // Calculate position based on active index
                    let zIndex = albums.length - Math.abs(stackIndex);
                    let translateY = stackIndex * 4; // Vertical offset
                    let translateZ = -Math.abs(stackIndex) * 10; // Push back non-active
                    let rotateX = stackIndex * -2; // Slight tilt
                    let opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(stackIndex) * 0.15);
                    let scale = isActive ? 1 : Math.max(0.8, 1 - Math.abs(stackIndex) * 0.05);

                    if (isActive) {
                        zIndex = albums.length + 1;
                        translateY = 0;
                        translateZ = 15; // Bring active forward
                        rotateX = 0;
                    }

                    return (
                        <motion.div
                            key={album.id}
                            className="absolute w-full h-full cursor-pointer group rounded-md overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-out bg-gray-200"
            style={{
                                transformStyle: 'preserve-3d',
                                zIndex: zIndex, 
                            }}
                            initial={false} // Don't animate on initial load
                            animate={{
                                transform: `translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg)`,
                                scale: scale,
                                opacity: opacity,
                            }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            onClick={() => onAlbumClick(index)}
                            whileHover={ !isActive ? { 
                                translateY: translateY - 5,
                                translateZ: translateZ + 10,
                                rotateX: rotateX - 3,
                                scale: scale * 1.05, // Slightly enlarge on hover
                                zIndex: albums.length + 2, // Bring hovered to front
                            } : {}}
                        >
                            <img
                                src={album.imageUrl}
                                alt={`${album.title} by ${album.artist}`}
                                className="w-full h-full object-cover"
                            />
                             {/* Add a subtle inner border/edge */}
                             <div className="absolute inset-0 border border-black/10 rounded-md pointer-events-none"></div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
  );
};

export function ListeningToSection() {
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Effect to setup and control audio playback
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Optional: Add event listener for when track ends
      audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false); // Stop spinning vinyl when preview ends
          // Optionally play next: handleNext(); 
      });
    }

    const currentAudio = audioRef.current;
    const activeAlbum: Album = albums[activeAlbumIndex];

    if (activeAlbum && activeAlbum.previewUrl) {
        // Only change src if it's different or playback hasn't started
        if (currentAudio.src !== activeAlbum.previewUrl) {
             currentAudio.src = activeAlbum.previewUrl;
             currentAudio.load(); // Ensure new src is loaded
        }
       
        // Handle play/pause state
    if (isPlaying) {
          currentAudio.play().catch(error => {
            console.error("Audio play failed:", error);
            setIsPlaying(false); // Reset state if play fails
          });
        } else {
          currentAudio.pause();
        }
    } else {
        // If no preview URL, pause and maybe clear src
        currentAudio.pause();
        currentAudio.src = '';
        setIsPlaying(false);
    }
    
    // Cleanup: pause audio on component unmount or when activeAlbumIndex/isPlaying changes trigger re-run
    return () => {
        // Check required because ref might be null during cleanup on fast unmounts
        if (currentAudio) { 
            currentAudio.pause();
        }
    };
  }, [activeAlbumIndex, isPlaying]); // Dependencies: run effect when index or play state changes

  // Handler to change album and start playing
  const handleAlbumClick = (index: number) => {
    if (index === activeAlbumIndex) {
      // If clicking the already active album, toggle play/pause
      setIsPlaying(!isPlaying);
    } else {
      // If clicking a new album, set it as active and start playing
      setActiveAlbumIndex(index);
        setIsPlaying(true);
    }
  };

  // Function to get the currently active album data safely
  const getCurrentAlbum = (): Album => { // Add return type
      return albums[activeAlbumIndex] || albums[0]; // Fallback to first album
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">Listening to...</h2>
        <a
          href="https://open.spotify.com/" // Replace with your actual Spotify profile link
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <SpotifyIcon className="w-4 h-4 text-green-500" />
          My Spotify
          <ExternalLinkIcon className="w-3 h-3 text-gray-500" />
        </a>
      </div>
      
      <div className="relative h-48 md:h-52 flex items-center justify-start overflow-hidden px-4 md:px-6">
        {/* Vinyl Record on the left */} 
        <div className="w-2/5 flex justify-center items-center">
             <VinylRecord isPlaying={isPlaying} activeAlbum={getCurrentAlbum()} />
        </div>

        {/* Album Stack on the right */} 
         <div className="w-3/5 flex justify-center items-center pl-4 md:pl-8">
             <AlbumStack 
                albums={albums}
                activeIndex={activeAlbumIndex}
                onAlbumClick={handleAlbumClick}
            />
        </div>
        
         {/* Hidden Audio Element */}
         {/* <audio ref={audioRef} preload="auto"></audio>  Audio element is created programmatically now */}

         {/* Current Track Info (Optional Display) */}
         {/* 
         <div className="absolute bottom-2 left-4 text-xs text-gray-600">
             {getCurrentAlbum().title} - {getCurrentAlbum().artist}
             ({isPlaying ? 'Playing' : 'Paused'})
         </div> 
         */}
      </div>
    </Card>
  );
} 