import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

interface FolderCardProps {
  title: string;
  photoCount: number;
  imageUrls: string[]; // URLs for the photos peeking out
  stickerUrls: string[]; // URLs for sticker images on the folder [sticker1, sticker2]
}

export function FolderCard({ title, photoCount, imageUrls = [], stickerUrls = [] }: FolderCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Use only the provided images, maybe more are loaded in modal?
  const allImages = imageUrls; 

  const handleFolderClick = () => {
    setIsOpen(true);
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

  return (
    <>
      <div 
        className="flex flex-col items-center group" 
        onClick={handleFolderClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Perspective container */}
        <div className="relative w-full aspect-[4/3] cursor-pointer perspective">
          {/* Folder Back */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-md"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ 
              y: isHovered ? -5 : 0,
              rotateX: isHovered ? 3 : 0,
              rotateY: isHovered ? -3 : 0,
              transition: { duration: 0.2, ease: "easeOut" }
            }}
          >
            {/* Folder cut-out shape */}
            <div 
              className="absolute top-[20px] left-[20px] w-[120px] h-[60px] bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-md"
              style={{ 
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                transform: "translateZ(1px)"
              }}
            ></div>
          </motion.div>

          {/* Photos Peeking Out */}
          <div className="absolute inset-0 overflow-hidden rounded-lg" style={{ transformStyle: "preserve-3d", transform: "translateZ(1px)" }}>
            {imageUrls.map((url, index) => (
              <motion.div
                key={index}
                className="absolute bg-white p-0.5 rounded shadow-sm overflow-hidden"
                style={{
                  width: '38%', 
                  height: '38%',
                  top: '8%',
                  left: `${15 + index * 22}%`,
                  transformOrigin: 'bottom center',
                  transformStyle: 'preserve-3d',
                }}
                animate={{ 
                  rotate: index === 0 ? (isHovered ? -12 : -8) : index === 1 ? (isHovered ? 4 : 2) : (isHovered ? 15 : 10), 
                  y: isHovered ? -8 - (index * 2) : 0,
                  translateZ: isHovered ? `${(2 - index) * 6 + 10}px` : `${(2 - index) * 4}px`, // Lift up photos when folder hovered
                  transition: { type: 'spring', stiffness: 300, damping: 15 }
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -12 - (index * 3),
                  translateZ: `${(2 - index) * 8 + 15}px`,
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
              "absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm rounded-b-lg rounded-t-md shadow-inner-light overflow-hidden",
              "transition-all duration-300 ease-in-out"
            )}
            style={{ 
              transformStyle: "preserve-3d", 
              transformOrigin: 'bottom center',
              height: isHovered ? '70%' : '85%', // Shrink folder front when hovered to show envelope opening effect
              transform: 'translateZ(20px)' // Bring front forward
            }}
            animate={{ 
              y: isHovered ? -15 : 0, // Lift more significantly when hovered
              rotateX: isHovered ? 25 : 0, // Open like envelope flap
              transition: { duration: 0.3, ease: "easeOut" }
            }}
          >
            {/* Subtle gradient/shine */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent opacity-50"></div>
             
            {/* Embossed lines near bottom (as per design spec) */}
            <div className="absolute bottom-[30px] left-[15%] right-[15%] h-[1px] bg-white/25"></div>
            <div className="absolute bottom-[29px] left-[15%] right-[15%] h-[1px] bg-black/10"></div>
            
            {/* Front sheen highlight (as per design spec) */}
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
                className="absolute w-8 h-8 md:w-10 md:h-10 z-10"
                style={{
                  bottom: '15%',
                  left: '10%',
                  transform: 'rotate(-10deg) translateZ(5px)' // Tilt and lift sticker
                }}
                whileHover={{ rotate: -15, scale: 1.1, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              />
            )}
            {stickerUrls[1] && (
              <motion.img 
                src={stickerUrls[1]} 
                alt="sticker 2" 
                className="absolute w-8 h-8 md:w-10 md:h-10 z-10"
                style={{
                  bottom: '12%',
                  right: '10%',
                  transform: 'rotate(8deg) translateZ(5px)' // Tilt and lift sticker
                }}
                whileHover={{ rotate: 15, scale: 1.1, y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              />
            )}
          </motion.div>
          
          {/* Folder Tab (Visual Only) */}
          <motion.div 
            className="absolute top-0 left-[15px] w-[35%] h-[18px] bg-white/70 backdrop-blur-sm rounded-t-md shadow-sm"
            style={{ 
              transformOrigin: 'bottom left',
              transform: 'translateZ(10px)'
            }}
            animate={{
              skewX: isHovered ? '-15deg' : '-20deg',
              y: isHovered ? -2 : 0,
              transition: { duration: 0.2 }
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

       {/* Modal (Existing structure, potentially enhance later if needed) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 md:p-8 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div 
              className="relative bg-white rounded-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-lg md:text-xl font-semibold">{title}</h2>
                <button 
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                  onClick={handleClose}
                  aria-label="Close"
                >
                  {/* Using a simple X icon */}
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
              </div>
              
              {/* Image grid */}
              {/* TODO: Potentially load more images here dynamically */}
              <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {allImages.map((url, index) => (
                  <motion.div
                    key={index}
                    className="aspect-square rounded-md overflow-hidden cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200 bg-gray-100"
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleImageClick(index)}
                  >
                    <img 
                      src={url} 
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy" // Lazy load images in the modal
                    />
                  </motion.div>
                ))}
                 {/* Placeholder if few images */}
                 {allImages.length === 0 && <p className="text-gray-500 col-span-full text-center py-10">No photos available.</p>}
              </div>
            </motion.div>

            {/* Full image viewer (unchanged from original, consider library like PhotoSwipe later) */}
            <AnimatePresence>
              {selectedImage !== null && (
                <motion.div
                  className="fixed inset-0 bg-black/90 z-[110] flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                >
                   {/* Close Button */}
                   <button 
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-10"
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                    aria-label="Close image viewer"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                     </svg>
                   </button>
                  
                   {/* Prev Button */}
                   <button 
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    aria-label="Previous image"
                    disabled={allImages.length <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                     </svg>
                  </button>

                  {/* Image Display */}
                   <motion.div 
                    className="relative flex items-center justify-center w-full h-full px-16 sm:px-24"
                    key={selectedImage} // Allows animation on change
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                   >
                     <img
                      src={allImages[selectedImage]}
                      alt={`Photo ${selectedImage + 1}`}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
                      onClick={e => e.stopPropagation()} // Prevent clicks on image closing the viewer
                     />
                   </motion.div>

                  {/* Next Button */}
                   <button 
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors disabled:opacity-50"
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    aria-label="Next image"
                    disabled={allImages.length <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                     </svg>
                  </button>

                  {/* Counter */}
                   {allImages.length > 1 && (
                     <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                      {selectedImage + 1} / {allImages.length}
                    </div>
                   )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper class for shadow
// Add this to your global CSS or tailwind.config.js if needed:
/*
.shadow-inner-light {
  box-shadow: inset 0 1px 2px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.05);
}
.perspective {
  perspective: 1000px;
}
*/

// Also ensure tailwind.config.js enables perspective utilities if not already. 