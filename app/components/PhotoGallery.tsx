import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaFilm, FaTimes, FaChevronLeft, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import { GiJapan, GiEvilTower, GiWindmill } from 'react-icons/gi';

interface PhotoAlbumProps {
  title: string;
  photoCount: number;
  icon: React.ReactNode;
  flagIcon: React.ReactNode;
  thumbnails: string[];
  images: string[];
  onOpen: (album: string) => void;
}

interface ImageViewerProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onInfo: () => void;
}

const ImageViewer = ({ images, currentIndex, onClose, onPrev, onNext, onInfo }: ImageViewerProps) => {
  if (images.length === 0) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="relative max-w-4xl max-h-[80vh] w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Full view ${currentIndex}`}
          className="w-full h-full object-contain"
        />
        
        <div className="absolute top-4 right-4 flex space-x-4">
          <button 
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white"
            onClick={onInfo}
            aria-label="Image information"
            title="Image information"
          >
            <FaInfoCircle className="w-5 h-5" />
          </button>
          <button 
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white"
            onClick={onClose}
            aria-label="Close viewer"
            title="Close viewer"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full text-white"
          onClick={onPrev}
          aria-label="Previous image"
          title="Previous image"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-3 rounded-full text-white"
          onClick={onNext}
          aria-label="Next image"
          title="Next image"
        >
          <FaChevronRight className="w-5 h-5" />
        </button>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 px-4 py-2 rounded-full text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </motion.div>
  );
};

const PhotoAlbum = ({ title, photoCount, icon, flagIcon, thumbnails, images, onOpen }: PhotoAlbumProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="relative"
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onOpen(title)}
    >
      {/* Folder container */}
      <div className="relative cursor-pointer">
        {/* Main folder with macOS style */}
        <motion.div 
          className="relative h-32 w-44 rounded-md bg-gradient-to-b from-gray-100 to-gray-200 shadow-sm overflow-hidden"
          animate={{
            rotateX: isHovered ? 5 : 0,
            y: isHovered ? -3 : 0,
          }}
          transition={{ 
            duration: 0.2,
            ease: "easeOut"
          }}
        >
          {/* Top tab */}
          <div className="absolute -top-2 left-3 w-20 h-3 bg-gradient-to-b from-gray-100 to-gray-200 rounded-t-md"></div>
          
          {/* Thumbnails - exactly 3 photos peeking out as in the image */}
          {thumbnails.slice(0, 3).map((thumbnail, index) => (
            <motion.div 
              key={index}
              className="absolute rounded-sm shadow-sm overflow-hidden"
              style={{
                width: '28px',
                height: '28px',
                top: `${5 + index * 5}px`,
                left: `${5 + index * 5}px`,
                zIndex: 10 - index,
                transformOrigin: 'top left'
              }}
              animate={{
                rotate: isHovered ? `${-5 + index * 2}deg` : `${-3 + index * 2}deg`,
                y: isHovered ? -2 - index : 0,
                x: isHovered ? 2 + index : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={thumbnail}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
          
          {/* Stickers/icons on folder - exactly as in the image */}
          <div className="absolute top-10 right-4 flex flex-col space-y-2 z-20">
            <motion.div 
              className="bg-white p-1 rounded-full shadow-sm w-8 h-8 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {flagIcon}
            </motion.div>
            <motion.div 
              className="bg-white p-1 rounded-full shadow-sm w-8 h-8 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {icon}
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Label */}
      <div className="mt-2 text-center">
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-xs text-gray-500">{photoCount} photos</p>
      </div>
    </motion.div>
  );
};

// Expanded Album View
const ExpandedAlbum = ({ title, images, onClose }: { title: string, images: string[], onClose: () => void }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };
  
  const handlePrevious = () => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
  };
  
  const handleNext = () => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev! + 1));
  };
  
  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };
  
  const handleInfo = () => {
    // Show image details
    console.log("Show image details");
  };
  
  return (
    <motion.div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col relative"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={handleClose}
            aria-label="Close album"
            title="Close album"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <motion.div 
                key={index}
                className="aspect-square rounded-lg overflow-hidden cursor-pointer shadow-sm"
                whileHover={{ y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleImageClick(index)}
              >
                <img 
                  src={image} 
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {selectedImage !== null && (
          <ImageViewer 
            images={images}
            currentIndex={selectedImage}
            onClose={() => setSelectedImage(null)}
            onPrev={handlePrevious}
            onNext={handleNext}
            onInfo={handleInfo}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function PhotoGallery() {
  const [openAlbum, setOpenAlbum] = useState<string | null>(null);
  
  // Sample images - in a real app, you would use your own images
  const sampleImages = {
    "Japan 2024": [
      "https://source.unsplash.com/random/800x600?japan,tokyo",
      "https://source.unsplash.com/random/800x600?japan,kyoto",
      "https://source.unsplash.com/random/800x600?japan,osaka",
      "https://source.unsplash.com/random/800x600?japan,mount,fuji",
      "https://source.unsplash.com/random/800x600?japan,temple",
      "https://source.unsplash.com/random/800x600?japan,garden",
      "https://source.unsplash.com/random/800x600?japan,sushi",
      "https://source.unsplash.com/random/800x600?japan,shrine",
      "https://source.unsplash.com/random/800x600?japan,sakura",
      "https://source.unsplash.com/random/800x600?japan,architecture",
      "https://source.unsplash.com/random/800x600?japan,street",
      "https://source.unsplash.com/random/800x600?japan,night",
    ],
    "Paris 2024": [
      "https://source.unsplash.com/random/800x600?paris,eiffel",
      "https://source.unsplash.com/random/800x600?paris,louvre",
      "https://source.unsplash.com/random/800x600?paris,seine",
      "https://source.unsplash.com/random/800x600?paris,notre,dame",
      "https://source.unsplash.com/random/800x600?paris,montmartre",
      "https://source.unsplash.com/random/800x600?paris,cafe",
      "https://source.unsplash.com/random/800x600?paris,arc,triomphe",
      "https://source.unsplash.com/random/800x600?paris,sacre,coeur",
    ],
    "Amsterdam 2024": [
      "https://source.unsplash.com/random/800x600?amsterdam,canal",
      "https://source.unsplash.com/random/800x600?amsterdam,bicycle",
      "https://source.unsplash.com/random/800x600?amsterdam,windmill",
      "https://source.unsplash.com/random/800x600?amsterdam,museum",
      "https://source.unsplash.com/random/800x600?amsterdam,architecture",
      "https://source.unsplash.com/random/800x600?amsterdam,house",
      "https://source.unsplash.com/random/800x600?amsterdam,street",
      "https://source.unsplash.com/random/800x600?amsterdam,night",
    ],
    "Other photos": [
      "https://source.unsplash.com/random/800x600?landscape",
      "https://source.unsplash.com/random/800x600?portrait",
      "https://source.unsplash.com/random/800x600?architecture",
      "https://source.unsplash.com/random/800x600?nature",
      "https://source.unsplash.com/random/800x600?city",
      "https://source.unsplash.com/random/800x600?street",
      "https://source.unsplash.com/random/800x600?food",
      "https://source.unsplash.com/random/800x600?travel",
      "https://source.unsplash.com/random/800x600?animal",
      "https://source.unsplash.com/random/800x600?beach",
      "https://source.unsplash.com/random/800x600?mountain",
      "https://source.unsplash.com/random/800x600?forest",
    ]
  };
  
  const albums = [
    { 
      title: "Japan 2024", 
      photoCount: 83, 
      icon: <GiJapan className="text-red-500" />, 
      flagIcon: <span className="flex items-center justify-center rounded-full w-5 h-5 bg-red-100">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </span>,
      thumbnails: sampleImages["Japan 2024"].slice(0, 3),
      images: sampleImages["Japan 2024"]
    },
    { 
      title: "Paris 2024", 
      photoCount: 62, 
      icon: <GiEvilTower className="text-blue-500" />, 
      flagIcon: <div className="flex flex-col">
                  <div className="w-5 h-1.5 bg-blue-500"></div>
                  <div className="w-5 h-1.5 bg-white"></div>
                  <div className="w-5 h-1.5 bg-red-500"></div>
                </div>,
      thumbnails: sampleImages["Paris 2024"].slice(0, 3),
      images: sampleImages["Paris 2024"]
    },
    { 
      title: "Amsterdam 2024", 
      photoCount: 68, 
      icon: <GiWindmill className="text-orange-500" />, 
      flagIcon: <div className="flex flex-col">
                  <div className="w-5 h-1.5 bg-red-500"></div>
                  <div className="w-5 h-1.5 bg-white"></div>
                  <div className="w-5 h-1.5 bg-blue-500"></div>
                </div>,
      thumbnails: sampleImages["Amsterdam 2024"].slice(0, 3),
      images: sampleImages["Amsterdam 2024"]
    },
    { 
      title: "Other photos", 
      photoCount: 247, 
      icon: <FaCamera className="text-gray-700" />, 
      flagIcon: <FaFilm className="text-gray-700" />,
      thumbnails: sampleImages["Other photos"].slice(0, 3),
      images: sampleImages["Other photos"]
    },
  ];
  
  const handleOpenAlbum = (albumTitle: string) => {
    setOpenAlbum(albumTitle);
  };
  
  const handleCloseAlbum = () => {
    setOpenAlbum(null);
  };
  
  // Find the current album if one is open
  const currentAlbum = albums.find(album => album.title === openAlbum);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold">My photography</h2>
        <a 
          href="https://instagram.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <span className="mr-1">My Instagram</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {albums.map((album, index) => (
          <PhotoAlbum 
            key={index}
            title={album.title}
            photoCount={album.photoCount}
            icon={album.icon}
            flagIcon={album.flagIcon}
            thumbnails={album.thumbnails}
            images={album.images}
            onOpen={handleOpenAlbum}
          />
        ))}
      </div>
      
      <AnimatePresence>
        {openAlbum && currentAlbum && (
          <ExpandedAlbum 
            title={currentAlbum.title}
            images={currentAlbum.images}
            onClose={handleCloseAlbum}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 