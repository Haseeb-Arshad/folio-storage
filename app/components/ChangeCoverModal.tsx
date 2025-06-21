import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Folder } from './EditFolderModal';

interface ChangeCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folderId: string, newCoverUrl: string, isNewUpload: boolean) => void;
  folder: Folder | null;
  imageUrls: string[];
}

const ChangeCoverModal = ({ isOpen, onClose, onSave, folder, imageUrls }: ChangeCoverModalProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalImageUrls, setModalImageUrls] = useState<string[]>([]);
  const [isNewUpload, setIsNewUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && folder) {
      setSelectedImage(folder.featuredImageUrl);
      setModalImageUrls(imageUrls);
      setIsNewUpload(false);
    } else {
      // Cleanup object URLs
      modalImageUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    }
  }, [isOpen, folder, imageUrls]);

  const handleSave = () => {
    if (folder && selectedImage) {
      onSave(folder.id, selectedImage, isNewUpload);
      onClose();
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setModalImageUrls(prev => [newImageUrl, ...prev]);
      setSelectedImage(newImageUrl);
      setIsNewUpload(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && folder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 flex flex-col" // Added flex-col
            style={{ maxHeight: '90vh' }} // Set max height
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-800">Change Cover for {folder.name}</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="overflow-y-auto mb-6 flex-grow">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {modalImageUrls.map((url) => (
                  <button 
                    key={url}
                    onClick={() => setSelectedImage(url)}
                    className={`relative w-full aspect-square rounded-lg overflow-hidden border-4 transition-all duration-200 ${selectedImage === url ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {selectedImage === url && (
                      <div className="absolute inset-0 bg-blue-500/50" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto flex-shrink-0 flex justify-between items-center">
                <button
                    onClick={handleUploadClick}
                    type="button"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                    <Upload size={16} className="mr-2" />
                    Upload New Cover
                </button>
                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        type="button"
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        type="button"
                        disabled={!selectedImage || selectedImage === folder.featuredImageUrl}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        <Save size={16} className="mr-2" />
                        Save Changes
                    </button>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangeCoverModal;
