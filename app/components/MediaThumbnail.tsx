import React from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, HeartIcon, ShareIcon, PlayCircleIcon } from '@heroicons/react/24/outline'; // Using outline for a lighter feel

export interface MediaItem {
  id: string;
  type: 'image' | 'video'; // Extend as needed
  name: string;
  thumbnailUrl: string;
  // Add other relevant properties like duration for video, dimensions for image, etc.
}

interface MediaThumbnailProps {
  item: MediaItem;
  onClick?: (itemId: string) => void; // Optional onClick handler
}

const MediaThumbnail: React.FC<MediaThumbnailProps> = ({ item, onClick }) => {
  const handleThumbnailClick = () => {
    if (onClick) {
      onClick(item.id);
    } else {
      console.log(`Open viewer for ${item.id} - (CreativeImageViewer not yet implemented)`);
    }
  };

  return (
    <motion.div
      className="group aspect-square rounded-xl overflow-hidden shadow-lg bg-slate-800 cursor-pointer relative border border-slate-700/50"
      onClick={handleThumbnailClick}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      layout // Enables smooth reordering if the grid changes
    >
      <motion.img
        src={item.thumbnailUrl}
        alt={item.name}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
          <PlayCircleIcon className="w-16 h-16 text-white/80 opacity-70 group-hover:opacity-100 transition-opacity" />
        </div>
      )}

      {/* Frosted glass overlay for name and actions - appears on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-3 pt-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <h3 className="text-white text-sm font-semibold truncate mb-1.5">{item.name}</h3>
        <div className="flex space-x-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100">
          <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors" title="Quick Look">
            <EyeIcon className="w-4 h-4 text-white/90" />
          </button>
          <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors" title="Favorite">
            <HeartIcon className="w-4 h-4 text-white/90" />
          </button>
          <button className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors" title="Share">
            <ShareIcon className="w-4 h-4 text-white/90" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MediaThumbnail;

