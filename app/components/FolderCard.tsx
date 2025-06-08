import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface FolderCardProps {
  title: string;
  photoCount: number;
  imageUrls: string[]; // URLs for the photos peeking out
  stickerUrls: string[]; // URLs for sticker images on the folder [sticker1, sticker2]
  folderId?: string; // Optional ID for navigation
}

export function FolderCard({ title, photoCount, imageUrls = [], stickerUrls = [], folderId }: FolderCardProps) {
  // Ensure we only use up to 3 images for the peeking effect
  const displayImageUrls = imageUrls.slice(0, 3);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  // Animation control refs
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animatingRef = useRef(false);

  // Use only the provided images for the modal
  const allImages = imageUrls; 

  // Handle folder click - navigate to detail page instead of opening popup
  const handleFolderClick = () => {
    // Uncomment this for navigation and comment out the setIsOpen line
    window.location.href = `/folder/${folderId || encodeURIComponent(title.toLowerCase().replace(/\\s+/g, '-'))}`;
    
    // Comment this out when navigation is enabled
    // setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handlePrevImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => (prev === 0 ? allImages.length - 1 : prev! - 1));
  };

  const handleNextImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => (prev === allImages.length - 1 ? 0 : prev! + 1));
  };

  // Enhanced hover handling with proper animation completion
  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    animatingRef.current = true;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Set a timeout to ensure animation completes smoothly
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      animatingRef.current = false;
    }, 50); // Small delay to prevent immediate state change
  };

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div 
        className="flex flex-col items-center group folder-container-hoverable" 
        onClick={handleFolderClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Perspective container */}
        <div className="relative w-full aspect-[4/3] cursor-pointer perspective-container">
          {/* Folder Back */}
          <motion.div 
            className="absolute inset-0 folder-back-custom rounded-lg shadow-md"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ 
              y: isHovered ? -5 : 0,
              rotateX: isHovered ? -30 : 0,
              rotateY: isHovered ? -3 : 0,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            onAnimationStart={() => {
              animatingRef.current = true;
            }}
            onAnimationComplete={() => {
              setTimeout(() => {
                animatingRef.current = false;
              }, 50);
            }}
          >
            {/* Folder cut-out shape */}
          </motion.div>

          {/* Photos Peeking Out */}
          <div className="absolute inset-0 overflow-hidden rounded-lg" style={{ transformStyle: "preserve-3d", transform: "translateZ(1px)" }}>
            {displayImageUrls.map((url, index) => (
              <motion.div
                key={index}
                className={cn(
                  "absolute bg-white p-0.5 rounded shadow-sm overflow-hidden",
                  index === 0 && "photo-item-1",
                  index === 1 && "photo-item-2",
                  index === 2 && "photo-item-3"
                )}
                style={{
                  width: '36%', 
                  height: '36%',
                  // Adjusted top/left for better fan-out based on image
                  top: index === 1 ? '6%' : '9%', 
                  left: `${10 + index * 20 + (index === 2 ? 2 : 0)}%`, // Fine-tune spacing
                  transformOrigin: 'bottom center',
                  transformStyle: 'preserve-3d',
                }}
                animate={{ 
                  y: isHovered ? - (index * 1.5) : 0, // Minimal individual lift, main lift from CSS
                  transition: { type: 'spring', stiffness: 300, damping: 15, duration: 0.3 }
                }}
                whileHover={{ 
                  scale: 1.08, // Slightly more pronounced scale on direct photo hover
                  // y and translateZ for direct photo hover can be more aggressive
                  y: -10 - (index * 2),
                  translateZ: (isHovered ? ((2-index) * 6 + 10) : ((2-index) * 4)) + 10, // Add to current Z
                  transition: { duration: 0.15 }
                }}
              >
                <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover rounded-sm" />
              </motion.div>
            ))}
          </div>

          {/* Folder Front */}
          <motion.div 
            className={cn(
              "absolute bottom-0 left-0 right-0 folder-front-custom shadow-inner-light overflow-hidden",
              "transition-all duration-300 ease-in-out"
            )}
            style={{ 
              transformStyle: "preserve-3d", 
              transformOrigin: 'bottom center',
              height: '82%', // Static height to match image
              transform: 'translateZ(18px)' // Bring front forward, slightly less than original
            }}
            animate={{ 
              rotateX: isHovered ? -30 : 0,
              y: isHovered ? -2 : 0, // Minimal lift, main lift from parent group hover
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            {/* Subtle gradient/shine */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent opacity-50"></div>
             
            {/* Embossed lines near bottom (as per design spec) */}
            <div className="absolute bottom-[30px] left-[15%] right-[15%] h-[1px] bg-white/25"></div>
            <div className="absolute bottom-[29px] left-[15%] right-[15%] h-[1px] bg-black/10"></div>
            
            {/* Front sheen highlight */}
            <div 
              className="absolute top-[40%] left-[50%] w-[500px] h-[160px] rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            ></div>
             
            {/* Stickers */}
            {stickerUrls[0] && (
              <motion.img 
                src={stickerUrls[0]} 
                alt="sticker 1" 
                className="absolute w-8 h-8 md:w-9 md:h-9 z-10" // Slightly smaller stickers
                style={{
                  bottom: '18%', // Adjusted position
                  left: '12%',
                  transform: 'rotate(-12deg) translateZ(3px)'
                }}
                whileHover={{ rotate: -15, scale: 1.1, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              />
            )}
            {stickerUrls[1] && (
              <motion.img 
                src={stickerUrls[1]} 
                alt="sticker 2" 
                className="absolute w-8 h-8 md:w-9 md:h-9 z-10"
                style={{
                  bottom: '15%', // Adjusted position
                  right: '12%',
                  transform: 'rotate(10deg) translateZ(3px)'
                }}
                whileHover={{ rotate: 15, scale: 1.1, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              />
            )}
          </motion.div>
          
          {/* Folder Tab (Visual Only) */}
          <motion.div 
            className="absolute top-0 left-[12px] w-[30%] h-[20px] folder-tab-custom rounded-t-md shadow-sm"
            style={{ 
              transformOrigin: 'bottom left',
              transform: 'translateZ(0.5px)' // Should be almost flush with the back
            }}
            animate={{
              skewX: isHovered ? '-15deg' : '-20deg',
              y: isHovered ? -2 : 0,
              transition: { duration: 0.3 }
            }}
          ></motion.div>

          {/* Light noise texture overlay for realism */}
          <div 
            className="absolute inset-0 rounded-lg pointer-events-none z-20"
            style={{ 
              backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFZSURBVGhD7ZixSgNBFEXXIIKFhYWFjYKFhYWFhYWFhYVgYWFhYWFhYWFhYWFhYWEhiFjYiYWFhYVYWFj4A/n/E3wDy7qwUXAGzoXhwUs4CUlmsi0qiqIoiqIoiqKYG9p2edJ0O/tN2/VHbbcTUjYL2/hpRJCvTJCvTJCvTJCvTJCvTJCvTJCvTJAvGjtBwpcJ8pUJ8pUJ8pUJ8pUJ8pUJ8pUJ8kVjJ0j4MkG+MkG+MkG+MkG+MkG+MkG+MkG+aOwECV8myFcmyFcmyFcmyFcmyFcmyFcmyBeNsIQvE+QrE+QrE+QrE+QrE+QrE+QrE+SLRljClwnyP8dv9yZJ2Wx8lZdteT1Kq0e9n83xdX2e2nv1AXlFvvPP4y0kJbOwXfkzPw433VP3nCT8L7bxeXgdv59/cL3k+efzfn5WPMfR6GAwPkztKIqiKIqiKIpiLmi7P+S9Uk2PD3hyAAAAAElFTkSuQmCC")',
              backgroundSize: '10px',
              opacity: 0.02,
              mixBlendMode: 'overlay'
            }}
          ></div>
        </div>

        {/* Title and Photo Count */}
        <div className="mt-3 text-center">
          <h3 className="font-medium text-sm md:text-base text-gray-800 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 mt-0.5">
            {photoCount} photos
          </p>
        </div>
      </div>

      {/* Modal popup code - Commented out but preserved for future reference */}
      {/* 
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={handleClose}
          >
            <motion.div
              className="relative bg-white w-full max-w-5xl mx-4 rounded-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {selectedImage !== null ? (
                <div className="relative bg-black w-full aspect-video max-h-[70vh]">
                  <img
                    src={allImages[selectedImage]}
                    alt={`Photo ${selectedImage + 1}`}
                    className="w-full h-full object-contain"
                  />
                  <button
                    onClick={handlePrevImage}
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 p-2 rounded-full hover:bg-white/50 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {allImages.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(index)}
                    >
                      <img src={image} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      */}
    </>
  );
}
