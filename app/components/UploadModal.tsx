import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { X, UploadCloud, Trash2, FileImage, CheckCircle2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (files: (File & { preview: string })[]) => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    transition: { duration: 0.2 }
  },
};

export default function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] } 
  });

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  const handleUpload = () => {
    onUploadComplete(files);
    setFiles([]);
    onClose();
  };

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="p-5 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-800">Upload Media</h2>
              <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </header>

            <div className="flex-grow flex md:flex-row flex-col overflow-hidden">
              {/* Left Side - Dropzone */}
              <div className="md:w-1/2 w-full p-6 flex flex-col items-center justify-center border-r border-gray-200 bg-gray-50/50">
                <div {...getRootProps()} className={`w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-blue-500 bg-blue-50 scale-105' : 'border-gray-300 hover:border-blue-400'}`}>
                  <input {...getInputProps()} />
                  <motion.div animate={{ scale: isDragActive ? 1.2 : 1 }} transition={{ type: 'spring' }}>
                    <UploadCloud className={`w-16 h-16 transition-colors ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  </motion.div>
                  <p className="mt-4 text-lg font-semibold text-gray-700">Drag & drop files here</p>
                  <p className="text-sm text-gray-500">or click to browse</p>
                  <p className="mt-4 text-xs text-gray-400">Supports: JPG, PNG, GIF, WEBP</p>
                </div>
              </div>

              {/* Right Side - File List */}
              <div className="md:w-1/2 w-full flex flex-col overflow-hidden">
                {files.length > 0 ? (
                  <div className="flex-grow p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <AnimatePresence>
                      {files.map(file => (
                        <motion.div
                          key={file.name}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          className="flex items-center justify-between p-3 mb-3 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <img src={file.preview} alt={file.name} className="w-16 h-16 rounded-md object-cover" />
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button onClick={() => removeFile(file.name)} className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex-grow p-6 flex flex-col items-center justify-center text-center text-gray-400">
                    <FileImage className="w-20 h-20 mb-4" />
                    <h3 className="text-lg font-medium">Your uploads will appear here</h3>
                    <p className="text-sm">Select some files to get started</p>
                  </div>
                )}
              </div>
            </div>

            {files.length > 0 && (
              <footer className="p-5 border-t border-gray-200 flex justify-end items-center space-x-4 flex-shrink-0 bg-gray-50/80">
                <button
                  onClick={() => setFiles([])}
                  className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </button>
                <button
                  onClick={handleUpload}
                  className="flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transform"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Upload {files.length} file(s)
                </button>
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
