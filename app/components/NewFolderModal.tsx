import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderData: { name: string; imageUrl: string; stickers: string[] }) => void;
}

export default function NewFolderModal({ isOpen, onClose, onCreate }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [sticker1, setSticker1] = useState<File | null>(null);
  const [sticker2, setSticker2] = useState<File | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const resetState = () => {
    setFolderName('');
    setFeaturedImage(null);
    setSticker1(null);
    setSticker2(null);
    setIsInputFocused(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCreate = () => {
    if (isCreationDisabled()) return;

    const imageUrl = URL.createObjectURL(featuredImage!);
    const stickerUrls = [sticker1!, sticker2!].map(file => URL.createObjectURL(file));

    onCreate({ name: folderName.trim(), imageUrl, stickers: stickerUrls });
    handleClose();
  };

  const isCreationDisabled = (): boolean => {
    return !folderName.trim() || !featuredImage || !sticker1 || !sticker2;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') handleClose();
    if (event.key === 'Enter' && !isCreationDisabled()) {
      handleCreate();
    }
  };

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKeyDown as any);
    else document.removeEventListener('keydown', handleKeyDown as any);
    return () => document.removeEventListener('keydown', handleKeyDown as any);
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button onClick={handleClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 z-20" whileHover={{ scale: 1.2, rotate: 90 }}><X size={24} /></motion.button>
            
            <div className="p-8 pt-10 space-y-6">
              <div className="text-center">
                <motion.h2
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.1 } }}
                  className="text-3xl font-bold text-slate-800"
                >
                  New Collection
                </motion.h2>
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { duration: 0.4, delay: 0.2 } }}
                  className="text-slate-500 mt-1"
                >
                  A beautifully designed space for your ideas.
                </motion.p>
              </div>

              <div className="relative w-full pt-8 pb-14">
                {/* Sticker 1 */}
                <motion.div
                  className="absolute top-0 left-1/4 -translate-x-1/2 w-20 h-20 z-10"
                  initial={{ y: -20, scale: 0.8, opacity: 0, rotate: -25 }}
                  animate={{ y: 0, scale: 1, opacity: 1, rotate: 0, transition: { delay: 0.2, type: 'spring', stiffness: 150, damping: 15 } }}
                >
                  <ImageUpload label="" onFileSelect={setSticker1} isCircle />
                </motion.div>

                {/* Sticker 2 */}
                <motion.div
                  className="absolute top-8 right-1/4 translate-x-1/2 w-16 h-16 z-10"
                  initial={{ y: -20, scale: 0.8, opacity: 0, rotate: 25 }}
                  animate={{ y: 0, scale: 1, opacity: 0.8, rotate: 0, transition: { delay: 0.3, type: 'spring', stiffness: 150, damping: 15 } }}
                >
                  <ImageUpload label="" onFileSelect={setSticker2} isCircle />
                </motion.div>

                <ImageUpload label="Cover Image" onFileSelect={setFeaturedImage} />
                
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[90%]">
                  <div className="relative pt-2">
                    <input
                      id="collection-name"
                      type="text"
                      value={folderName}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onChange={(e) => setFolderName(e.target.value)}
                      className="peer w-full text-lg px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-300/50 focus:border-blue-500 transition-all duration-300 shadow-lg text-slate-800 placeholder-transparent"
                      placeholder="Collection Name"
                    />
                    <motion.label
                      htmlFor="collection-name"
                      className="absolute left-4 top-5 text-slate-400 pointer-events-none"
                      animate={{
                        y: isInputFocused || folderName ? -24 : 0,
                        scale: isInputFocused || folderName ? 0.85 : 1,
                        color: isInputFocused ? '#2563eb' : '#94a3b8',
                      }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    >
                      Collection Name
                    </motion.label>
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <motion.button
                  onClick={handleCreate}
                  disabled={isCreationDisabled()}
                  className="w-full py-4 rounded-xl text-white font-semibold bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                  animate={!isCreationDisabled() ? { 
                    scale: [1, 1.03, 1], 
                    boxShadow: ['0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', '0 10px 20px -5px rgba(59, 130, 246, 0.4)', '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'],
                  } : {}}
                  transition={!isCreationDisabled() ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                >
                  Create Collection
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
