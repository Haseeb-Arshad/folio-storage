import { useState } from 'react';
import { Card } from './Card';
import { FolderCard } from './FolderCard';
import { ExternalLinkIcon, InstagramIcon } from './icons';
import { motion, AnimatePresence } from 'framer-motion';
import { photoAlbums, photoAlbumsState, addPhotoAlbum } from '../data/photo-albums';




export function PhotographySection() {
  const [albums, setAlbums] = useState(photoAlbumsState);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderTitle, setNewFolderTitle] = useState('');
  const [newFolderImage, setNewFolderImage] = useState('https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=600&auto=format&fit=crop');
  const [newFolderSticker, setNewFolderSticker] = useState('https://img.icons8.com/fluency/48/camera.png');

  // Handler for adding new folder
  const handleAddFolder = () => {
    setIsAddingFolder(true);
  };

  // Handler for submitting a new folder
  const handleAddFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderTitle.trim()) {
      const newFolder = {
        title: newFolderTitle,
        photoCount: 1, // Start with one photo
        imageUrls: [newFolderImage], // Start with the cover image
        stickerUrls: [newFolderSticker] // Start with one sticker
      };
      
      // Add the new folder to the state
      const updatedAlbums = addPhotoAlbum(newFolder);
      setAlbums([...updatedAlbums]);
      
      // Reset form
      setNewFolderTitle('');
      setNewFolderImage('https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=600&auto=format&fit=crop');
      setNewFolderSticker('https://img.icons8.com/fluency/48/camera.png');
      setIsAddingFolder(false);
    }
  };
  return (
    <Card>
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">My photography</h2>
        <div className="flex space-x-2">
          {/* Add New Folder Button */}
          <button
            onClick={handleAddFolder}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Folder
          </button>

          {/* Instagram Link */}
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
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {albums.map((album) => (
          <FolderCard
            key={album.title}
            title={album.title}
            photoCount={album.photoCount}
            imageUrls={album.imageUrls}
            stickerUrls={album.stickerUrls}
            folderId={album.title.toLowerCase().replace(/\s+/g, '-')}
          />
        ))}
      </div>
      
      {/* Add New Folder Modal */}
      <AnimatePresence>
        {isAddingFolder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setIsAddingFolder(false)}
          >
            <motion.div
              className="bg-white w-full max-w-md mx-4 rounded-lg overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800">Create New Folder</h3>
              </div>
              
              <form onSubmit={handleAddFolderSubmit} className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Folder Title</label>
                  <input
                    type="text"
                    value={newFolderTitle}
                    onChange={(e) => setNewFolderTitle(e.target.value)}
                    placeholder="Summer Vacation 2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                  <input
                    type="url"
                    value={newFolderImage}
                    onChange={(e) => setNewFolderImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {newFolderImage && (
                    <div className="mt-2 p-2 border border-gray-200 rounded">
                      <img
                        src={newFolderImage}
                        alt="Cover preview"
                        className="h-24 w-auto mx-auto object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/150?text=Invalid+Image+URL';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sticker Icon URL</label>
                  <input
                    type="url"
                    value={newFolderSticker}
                    onChange={(e) => setNewFolderSticker(e.target.value)}
                    placeholder="https://example.com/sticker.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {newFolderSticker && (
                    <div className="mt-2 p-2 border border-gray-200 rounded flex justify-center">
                      <img
                        src={newFolderSticker}
                        alt="Sticker preview"
                        className="h-12 w-12 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/150?text=Invalid+Sticker+URL';
                        }}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsAddingFolder(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Create Folder
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
} 