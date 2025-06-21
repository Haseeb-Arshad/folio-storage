import { useState } from 'react';
import {
  DocumentIcon as DocumentIconOutline,
  FolderIcon as FolderIconOutline,
  StarIcon as StarIconOutline,
  ShareIcon as ShareIconOutline,
  DocumentTextIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  TableCellsIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { ViewColumnsIcon, Bars3Icon } from '@heroicons/react/24/solid';

// Define types for our data and props
interface FileOrFolder {
  id: string;
  type: 'folder' | 'file';
  name: string;
  lastModified: string;
  isStarred?: boolean;
  isShared?: boolean;
  size?: string;
  fileType?: 'pdf' | 'video' | 'image' | 'audio' | 'spreadsheet' | 'other';
}

interface FileTypeIconProps {
  fileType: FileOrFolder['fileType'];
}

interface FileCardProps {
  item: FileOrFolder;
}

const filesAndFolders: FileOrFolder[] = [
    {
    id: '1',
    type: 'folder',
    name: 'Projects',
    lastModified: '2 days ago',
    isStarred: true,
  },
  {
    id: '2',
    type: 'folder',
    name: 'Documents',
    lastModified: '1 week ago',
    isShared: true,
  },
  {
    id: '3',
    type: 'file',
    name: 'Project Proposal.pdf',
    size: '2.4 MB',
    lastModified: '3 hours ago',
    fileType: 'pdf',
    isStarred: true,
  },
  {
    id: '4',
    type: 'file',
    name: 'Meeting Recording...',
    size: '145 MB',
    lastModified: '1 day ago',
    fileType: 'video',
    isShared: true,
  },
  {
    id: '5',
    type: 'file',
    name: 'Design Mockup.png',
    size: '8.2 MB',
    lastModified: '2 days ago',
    fileType: 'image',
  },
  {
    id: '6',
    type: 'file',
    name: 'Budget Spreadshee...',
    size: '892 KB',
    lastModified: '1 week ago',
    fileType: 'spreadsheet',
  },
  {
    id: '7',
    type: 'file',
    name: 'Presentation Audio...',
    size: '12 MB',
    lastModified: '3 days ago',
    fileType: 'audio',
    isStarred: true,
  },
  {
    id: '8',
    type: 'folder',
    name: 'Archive',
    lastModified: '2 weeks ago',
  },
];

const FileTypeIcon = ({ fileType }: FileTypeIconProps) => {
  switch (fileType) {
    case 'pdf':
      return <DocumentTextIcon className="w-12 h-12 text-red-500" />;
    case 'video':
      return <VideoCameraIcon className="w-12 h-12 text-purple-500" />;
    case 'image':
      return <PhotoIcon className="w-12 h-12 text-green-500" />;
    case 'audio':
      return <MusicalNoteIcon className="w-12 h-12 text-orange-500" />;
    case 'spreadsheet':
      return <TableCellsIcon className="w-12 h-12 text-gray-500" />;
    default:
      return <DocumentIconOutline className="w-12 h-12 text-gray-400" />;
  }
};

const FileCard = ({ item }: FileCardProps) => {
  return (
    <div className="relative group bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-transparent hover:border-blue-500 transition-all cursor-pointer">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          {item.type === 'folder' ? (
            <FolderIconOutline className="w-12 h-12 text-gray-500" />
          ) : (
            <FileTypeIcon fileType={item.fileType} />
          )}
        </div>
        <p className="font-semibold text-sm text-gray-800 dark:text-white truncate w-full">{item.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {item.size ? `${item.size} • ${item.lastModified}` : item.lastModified}
        </p>
      </div>
      {item.isStarred && <StarIconOutline className="absolute top-3 right-3 w-5 h-5 text-yellow-400" />}
      {item.isShared && <ShareIconOutline className="absolute top-3 right-3 w-5 h-5 text-green-500" />}
    </div>
  );
};

export default function MyFilesPage() {
  const [view, setView] = useState('grid');

  return (
    <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Files</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filesAndFolders.length} items • 0 selected</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors text-sm">
              New Folder
            </button>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors text-sm">
              Upload Files
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="relative flex-1 lg:max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search files and folders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm">
                <option>All Files</option>
                <option>Folders</option>
                <option>Documents</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm">
                <option>Name</option>
                <option>Date Modified</option>
                <option>Size</option>
              </select>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button onClick={() => setView('grid')} className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}>
                  <ViewColumnsIcon className="w-5 h-5" />
                </button>
                <button onClick={() => setView('list')} className={`p-1.5 rounded-md ${view === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}>
                  <Bars3Icon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filesAndFolders.map(item => (
            <FileCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
