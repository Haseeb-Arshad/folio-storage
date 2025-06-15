import { useState } from "react";
import { 
  FolderIcon, 
  DocumentIcon, 
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon,
  ArchiveBoxIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  StarIcon,
  ShareIcon,
  TrashIcon,
  EyeIcon,
  PencilIcon,
  ArrowDownTrayIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  fileType?: 'pdf' | 'doc' | 'image' | 'video' | 'audio' | 'other';
  size?: string;
  modified: string;
  starred: boolean;
  shared: boolean;
  preview?: string;
}

export default function FilesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterType, setFilterType] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const files: FileItem[] = [
    { id: '1', name: 'Projects', type: 'folder', modified: '2 days ago', starred: true, shared: false },
    { id: '2', name: 'Documents', type: 'folder', modified: '1 week ago', starred: false, shared: true },
    { id: '3', name: 'Project Proposal.pdf', type: 'file', fileType: 'pdf', size: '2.4 MB', modified: '3 hours ago', starred: true, shared: false },
    { id: '4', name: 'Meeting Recording.mp4', type: 'file', fileType: 'video', size: '145 MB', modified: '1 day ago', starred: false, shared: true },
    { id: '5', name: 'Design Mockup.png', type: 'file', fileType: 'image', size: '8.2 MB', modified: '2 days ago', starred: false, shared: false },
    { id: '6', name: 'Budget Spreadsheet.xlsx', type: 'file', fileType: 'other', size: '892 KB', modified: '1 week ago', starred: false, shared: false },
    { id: '7', name: 'Presentation Audio.mp3', type: 'file', fileType: 'audio', size: '12 MB', modified: '3 days ago', starred: true, shared: false },
    { id: '8', name: 'Archive', type: 'folder', modified: '2 weeks ago', starred: false, shared: false },
  ];

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return FolderIcon;
    
    switch (file.fileType) {
      case 'image': return PhotoIcon;
      case 'video': return FilmIcon;
      case 'audio': return MusicalNoteIcon;
      case 'pdf':
      case 'doc':
      default: return DocumentIcon;
    }
  };

  const getFileTypeColor = (file: FileItem) => {
    if (file.type === 'folder') return 'text-blue-500';
    
    switch (file.fileType) {
      case 'image': return 'text-green-500';
      case 'video': return 'text-purple-500';
      case 'audio': return 'text-orange-500';
      case 'pdf': return 'text-red-500';
      case 'doc': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'folders' && file.type === 'folder') ||
                         (filterType === 'documents' && file.type === 'file' && ['pdf', 'doc'].includes(file.fileType || '')) ||
                         (filterType === 'images' && file.fileType === 'image') ||
                         (filterType === 'videos' && file.fileType === 'video') ||
                         (filterType === 'starred' && file.starred);
    
    return matchesSearch && matchesFilter;
  });

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleStar = (fileId: string) => {
    // In a real app, this would make an API call
    console.log('Toggle star for file:', fileId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Files</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            {filteredFiles.length} items • {selectedFiles.length} selected
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
            New Folder
          </button>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Upload Files
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files and folders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters and View */}
          <div className="flex items-center space-x-4">
            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Files</option>
              <option value="folders">Folders</option>
              <option value="documents">Documents</option>
              <option value="images">Images</option>
              <option value="videos">Videos</option>
              <option value="starred">Starred</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="name">Name</option>
              <option value="modified">Modified</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>

            {/* View Mode */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <Squares2X2Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
              >
                <ListBulletIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedFiles.length} item{selectedFiles.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-3">
              <button className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">
                Share
              </button>
              <button className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">
                Download
              </button>
              <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files Grid/List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file);
              const isSelected = selectedFiles.includes(file.id);
              
              return (
                <div
                  key={file.id}
                  onClick={() => toggleFileSelection(file.id)}
                  className={`relative group cursor-pointer rounded-lg border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="p-4 text-center">
                    <div className="relative mx-auto mb-3">
                      <FileIcon className={`w-12 h-12 mx-auto ${getFileTypeColor(file)}`} />
                      {file.starred && (
                        <StarIconSolid className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                      )}
                      {file.shared && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <ShareIcon className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate px-2">
                      {file.name}
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {file.size && <span>{file.size}</span>}
                      <span>{file.modified}</span>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(file.id);
                        }}
                        className="p-1 bg-white dark:bg-gray-800 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <StarIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button className="p-1 bg-white dark:bg-gray-800 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
                        <EllipsisVerticalIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file);
              const isSelected = selectedFiles.includes(file.id);
              
              return (
                <div
                  key={file.id}
                  onClick={() => toggleFileSelection(file.id)}
                  className={`flex items-center space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  
                  <div className="relative">
                    <FileIcon className={`w-8 h-8 ${getFileTypeColor(file)}`} />
                    {file.starred && (
                      <StarIconSolid className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      {file.size && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">{file.size}</span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">{file.modified}</span>
                      {file.shared && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                          Shared
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(file.id);
                      }}
                      className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
                    >
                      <StarIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <FolderIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No files found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery ? `No files match "${searchQuery}"` : 'This folder is empty'}
          </p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Upload Your First File
          </button>
        </div>
      )}
    </div>
  );
}
