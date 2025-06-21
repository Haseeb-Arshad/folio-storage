import { Card } from './Card';
import { FolderCard } from './FolderCard';
import { ExternalLinkIcon, InstagramIcon } from './icons';
import { photoAlbums as initialPhotoAlbums } from '../data/photoAlbums';
import { FolderPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import NewFolderModal from './NewFolderModal';

export function PhotographySection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photoAlbums, setPhotoAlbums] = useState(initialPhotoAlbums);

  const handleCreateFolder = (folderData: { name: string; imageUrl: string; stickers: string[] }) => {
    const newAlbum = {
      title: folderData.name,
      photoCount: 0, // Default or can be updated later
      imageUrls: folderData.imageUrl ? [folderData.imageUrl] : [],
      stickerUrls: folderData.stickers,
    };
    setPhotoAlbums([newAlbum, ...photoAlbums]);
  };

  return (
    <>
      <Card>
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">My photography</h2>
        <div className="flex items-center gap-4">
          <a
            href="#" // Replace with actual Instagram link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <InstagramIcon className="w-4 h-4 text-gray-500" />
            My Instagram
            <ExternalLinkIcon className="w-3 h-3 text-gray-500" />
          </a>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </motion.button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {photoAlbums.map((album) => (
          <FolderCard
            key={album.title}
            title={album.title}
            photoCount={album.photoCount}
            imageUrls={album.imageUrls}
            stickerUrls={album.stickerUrls}
          />
        ))}
      </div>
    </Card>
    <NewFolderModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onCreate={handleCreateFolder} 
    />
  </>
  );
} 