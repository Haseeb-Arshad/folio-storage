import { useState, useRef, useCallback } from "react";
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  PhotoIcon, 
  FilmIcon,
  MusicalNoteIcon,
  FolderIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  preview?: string;
}

export default function UploadPage() {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return PhotoIcon;
    if (type.startsWith('video/')) return FilmIcon;
    if (type.startsWith('audio/')) return MusicalNoteIcon;
    return DocumentIcon;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateFilePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const addFiles = useCallback(async (files: FileList) => {
    const newFiles: UploadFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const preview = await generateFilePreview(file);
      
      newFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        progress: 0,
        status: 'pending',
        preview
      });
    }
    
    setUploadFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
  }, [addFiles]);

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const simulateUpload = (id: string) => {
    setUploadFiles(prev => prev.map(f => 
      f.id === id ? { ...f, status: 'uploading' as const } : f
    ));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadFiles(prev => prev.map(f => {
        if (f.id === id) {
          const newProgress = f.progress + Math.random() * 20;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...f, progress: 100, status: 'success' as const };
          }
          return { ...f, progress: newProgress };
        }
        return f;
      }));
    }, 200);
  };

  const uploadAll = () => {
    uploadFiles.forEach(file => {
      if (file.status === 'pending') {
        simulateUpload(file.id);
      }
    });
  };

  const clearCompleted = () => {
    setUploadFiles(prev => prev.filter(f => f.status !== 'success'));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Upload Files
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Drag and drop files or click to browse. All file types supported.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Support for images, documents, videos, and more
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Choose Files
        </button>
      </div>

      {/* Destination Folder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upload Destination
        </h3>
        <div className="flex items-center space-x-4">
          <FolderIcon className="w-5 h-5 text-gray-400" />
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Root Folder</option>
            <option value="documents">Documents</option>
            <option value="images">Images</option>
            <option value="projects">Projects</option>
            <option value="archive">Archive</option>
          </select>
          <button className="px-4 py-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
            New Folder
          </button>
        </div>
      </div>

      {/* Upload Queue */}
      {uploadFiles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upload Queue ({uploadFiles.length} files)
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={clearCompleted}
                  className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear Completed
                </button>
                <button
                  onClick={uploadAll}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Upload All
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {uploadFiles.map((uploadFile) => {
              const FileIcon = getFileIcon(uploadFile.file);
              
              return (
                <div key={uploadFile.id} className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {uploadFile.preview ? (
                        <img src={uploadFile.preview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FileIcon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {uploadFile.file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      
                      {/* Progress Bar */}
                      {uploadFile.status === 'uploading' && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">Uploading...</span>
                            <span className="text-gray-900 dark:text-white">{Math.round(uploadFile.progress)}%</span>
                          </div>
                          <div className="mt-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Status & Actions */}
                    <div className="flex items-center space-x-2">
                      {uploadFile.status === 'success' && (
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      )}
                      {uploadFile.status === 'error' && (
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                      )}
                      {uploadFile.status === 'pending' && (
                        <button
                          onClick={() => simulateUpload(uploadFile.id)}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                        >
                          Upload
                        </button>
                      )}
                      <button
                        onClick={() => removeFile(uploadFile.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💡 Upload Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li>• Maximum file size: 100MB per file</li>
          <li>• Supported formats: All common file types (images, documents, videos, etc.)</li>
          <li>• Files are automatically organized and indexed for AI search</li>
          <li>• Batch upload multiple files at once for efficiency</li>
          <li>• Use folders to keep your files organized</li>
        </ul>
      </div>
    </div>
  );
}
