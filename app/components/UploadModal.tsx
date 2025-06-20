import { XMarkIcon, DocumentArrowUpIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (files: (File & { preview: string })[]) => void;
}

export default function UploadModal({ isOpen, onClose, onUploadComplete }: UploadModalProps) {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const removeFile = (file: File & { preview: string }) => () => {
    const newFiles = [...files];
    newFiles.splice(newFiles.indexOf(file), 1);
    setFiles(newFiles);
  };

  const removeAll = () => {
    setFiles([]);
  };

  const handleUpload = () => {
    onUploadComplete(files);
    setFiles([]);
    onClose();
  };

  const thumbs = files.map(file => (
    <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-2 m-2 h-32 w-32 relative" key={file.name}>
      <div className="flex min-w-0 overflow-hidden">
        <img
          src={file.preview}
          className="block w-auto h-full object-cover"
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
       <button 
        onClick={removeFile(file)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
      >
        <XMarkIcon className="w-3 h-3" />
      </button>
    </div>
  ));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Upload Media</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <div className="p-8">
          <div {...getRootProps()} className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}`}>
            <input {...getInputProps()} />
            <p className="text-gray-500 dark:text-gray-400">Drag & drop files here, or click to select files</p>
          </div>
          <aside className="flex flex-wrap mt-4 max-h-60 overflow-y-auto">
            {thumbs}
          </aside>
        </div>
        {files.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end items-center space-x-4">
            <button
              onClick={removeAll}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowUturnLeftIcon className="w-5 h-5 mr-2" />
              Clear All
            </button>
            <button
              onClick={handleUpload}
              className="flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
              Upload {files.length} file(s)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
