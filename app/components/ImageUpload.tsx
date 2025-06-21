import React, { useState, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, UploadCloud, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  label: string;
  isCircle?: boolean;
}

export default function ImageUpload({ onFileSelect, label, isCircle = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setIsUploaded(true);
        setTimeout(() => setIsUploaded(false), 1200); // Reset after animation
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    } else {
      setPreview(null);
      onFileSelect(null);
    }
  }, [onFileSelect]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0] || null);
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0] || null);
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const baseClasses = 'relative w-full bg-slate-50/70 border border-slate-200/80 transition-all duration-300 ease-in-out cursor-pointer flex items-center justify-center group overflow-hidden';
  const shapeClasses = isCircle ? 'rounded-full aspect-square' : 'rounded-2xl aspect-[16/10]';
  const stateClasses = isDragging ? 'ring-4 ring-blue-300/70 ring-offset-2 border-blue-400 bg-blue-50 scale-105' : 'hover:border-slate-400 hover:bg-slate-100';

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1 },
  };

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-semibold text-slate-600 mb-2 text-center">{label}</label>}
      <div
        onClick={triggerFileInput}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${baseClasses} ${shapeClasses} ${stateClasses}`}
      >
        <AnimatePresence>
          {preview ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="w-full h-full">
              <img src={preview} alt="Preview" className={`w-full h-full object-cover shadow-inner ${isCircle ? 'rounded-full' : 'rounded-2xl'}`} />
              <motion.button
                onClick={handleRemoveImage}
                className="absolute top-1.5 right-1.5 bg-white/80 backdrop-blur-sm p-1.5 rounded-full text-slate-600 hover:text-red-500 hover:bg-white shadow-lg transition-all"
                whileHover={{ scale: 1.1, rotate: 90 }}
              >
                <X size={isCircle ? 14 : 18} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center p-2 flex flex-col items-center justify-center gap-2 text-slate-500">
              <div className={`p-3 rounded-full transition-all bg-slate-100 group-hover:bg-white ${isDragging && 'bg-blue-100'}`}>
                <UploadCloud size={isCircle ? 20 : 28} className={`transition-colors text-slate-400 group-hover:text-blue-500 ${isDragging && 'text-blue-600'}`} />
              </div>
              <p className="text-xs font-semibold">{isDragging ? 'Drop to upload' : 'Choose file'}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {isUploaded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-400/80 to-emerald-500/90"
          >
            <svg className="w-1/3 h-1/3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <motion.path
                variants={checkmarkVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, ease: 'easeOut' }}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      </div>
    </div>
  );
}
