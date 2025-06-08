import { useState, useEffect } from 'react';
import { useParams } from '@remix-run/react';
import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '~/components/Card';

// Import data and data management functions
import { photoAlbums, photoAlbumsState, addPhotoToAlbum } from '../data/photo-albums';

export const meta: MetaFunction = ({ params }) => {
  const { folderId } = params;
  const decodedFolderId = decodeURIComponent(folderId || '');
  const title = decodedFolderId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return [
    { title: `${title} | Photography Portfolio` },
    { name: "description", content: `Browse photos from the ${title} collection` },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { folderId } = params;
  
  // In a real app, fetch folder data from a database
  // For now, we'll use mock data
  const folder = photoAlbums.find(
    (album: { title: string }) => album.title.toLowerCase().replace(/\s+/g, '-') === folderId
  );
  
  if (!folder) {
    throw new Response("Folder not found", { status: 404 });
  }

  return json({ folder });
}

export default function FolderDetail() {
  const { folderId } = useParams();
  const [data, setData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [newMediaUrl, setNewMediaUrl] = useState('');

  // Get data from the photo albums state
  useEffect(() => {
    const folder = photoAlbumsState.find(
      (album: { title: string }) => album.title.toLowerCase().replace(/\s+/g, '-') === folderId
    );
    setData({ folder });
  }, [folderId]);  // intentionally not depending on photoAlbumsState to avoid infinite re-render cycles

  if (!data?.folder) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const { title, photoCount, imageUrls, stickerUrls } = data.folder;
  
  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleAddMedia = () => {
    setIsAddingMedia(true);
  };

  const handleAddMediaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMediaUrl.trim() && folderId) {
      // Add the photo to the album using our data management function
      const updatedAlbums = addPhotoToAlbum(folderId, newMediaUrl);
      
      // Update the local state with the new data
      const updatedFolder = updatedAlbums.find(
        (album: { title: string }) => album.title.toLowerCase().replace(/\s+/g, '-') === folderId
      );
      
      if (updatedFolder) {
        setData({ folder: updatedFolder });
      }
      
      setNewMediaUrl('');
      setIsAddingMedia(false);
    }
  };

  const handlePrevImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => (prev !== null && prev === 0 ? imageUrls.length - 1 : (prev ?? 0) - 1));
  };

  const handleNextImage = () => {
    if (selectedImage === null) return;
    setSelectedImage((prev) => (prev !== null && prev === imageUrls.length - 1 ? 0 : (prev ?? 0) + 1));
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{photoCount} photos</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleAddMedia}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Photo
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back
          </a>
        </div>
      </div>

      {/* Folder stickers */}
      <div className="mb-6 flex gap-3">
        {stickerUrls?.map((url: string, idx: number) => (
          <motion.img 
            key={idx}
            src={url} 
            alt={`Sticker ${idx+1}`}
            className="w-10 h-10"
            whileHover={{ rotate: 15, scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          />
        ))}
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imageUrls.map((url: string, index: number) => (
          <motion.div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
            onClick={() => handleImageClick(index)}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img 
              src={url} 
              alt={`Photo ${index + 1}`} 
              className="w-full h-full object-cover transition-transform"
            />
            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-20 transition-opacity"></div>
          </motion.div>
        ))}
      </div>

      {/* Add media form */}
      <AnimatePresence>
        {isAddingMedia && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsAddingMedia(false)}
          >
            <motion.div
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-lg font-semibold mb-4">Add New Photo</h3>
              <form onSubmit={handleAddMediaSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input 
                    type="text" 
                    value={newMediaUrl}
                    onChange={e => setNewMediaUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-2 text-xs text-gray-500">Enter the URL of the image you want to add</p>
                </div>
                <div className="flex space-x-2 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingMedia(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add Photo
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen image viewer */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.img
                src={imageUrls[selectedImage]}
                alt={`Photo ${selectedImage + 1}`}
                className="max-w-[90%] max-h-[90vh] object-contain"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25 }}
              />
              
              <button
                onClick={e => { e.stopPropagation(); handlePrevImage(); }}
                className="absolute left-4 p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={e => { e.stopPropagation(); handleNextImage(); }}
                className="absolute right-4 p-3 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-6 left-0 right-0 text-center">
                <p className="text-white font-medium">
                  {selectedImage + 1} of {imageUrls.length}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
