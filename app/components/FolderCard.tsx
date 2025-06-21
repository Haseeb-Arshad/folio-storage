import React, { useState } from 'react';
import { Link } from '@remix-run/react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface FolderCardProps {
  title: string;
  photoCount: number;
  imageUrls: string[]; // URLs for the photos peeking out
  stickerUrls: string[]; // URLs for sticker images on the folder [sticker1, sticker2]
}

export function FolderCard({ title, photoCount, imageUrls = [], stickerUrls = [] }: FolderCardProps) {
  // Ensure we only use up to 3 images for the peeking effect, as in the reference image
  const displayImageUrls = imageUrls.slice(0, 3);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Link to={`/folders/${encodeURIComponent(title)}`} className="flex flex-col items-center group folder-container-hoverable" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
              transition: { duration: 0.2, ease: "easeOut" }
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
                  // Static rotations are now handled by photo-item-X classes
                  // Hover animations are also handled by photo-item-X classes via .folder-container-hoverable:hover
                  // Only apply subtle individual hover lift here if needed, or rely on CSS transitions
                  y: isHovered ? - (index * 1.5) : 0, // Minimal individual lift, main lift from CSS
                  transition: { type: 'spring', stiffness: 300, damping: 15 }
                }}
                whileHover={{ 
                  scale: 1.08, // Slightly more pronounced scale on direct photo hover
                  // y and translateZ for direct photo hover can be more aggressive if desired
                  // but ensure it complements the main folder hover animation
                  y: -10 - (index * 2),
                  z: (isHovered ? ((2-index) * 6 + 10) : ((2-index) * 4)) + 10, // Add to current Z
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
              transition: { duration: 0.2, ease: "easeOut" }
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
                className="absolute w-8 h-8 md:w-9 md:h-9 z-10 rounded-full object-cover" // Slightly smaller stickers
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
                className="absolute w-8 h-8 md:w-9 md:h-9 z-10 rounded-full object-cover"
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
        <div className="mt-2 text-center">
          <h3 className="text-sm md:text-base font-semibold text-gray-800">{title}</h3>
          <p className="text-xs md:text-sm text-gray-500">{photoCount} photos</p>
        </div>
      </Link>
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