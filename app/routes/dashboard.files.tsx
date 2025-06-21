import { useState, useMemo, MouseEvent } from 'react';
import type { FileOrFolder } from '~/types';
import ThreeDFolder from '~/components/dashboard/ThreeDFolder';
import FilePreview from '~/components/dashboard/FilePreview';
import ContextMenu from '~/components/dashboard/ContextMenu';
import {
  DocumentIcon as DocumentIconOutline,
  FolderIcon as FolderIconOutline,
  StarIcon as StarIconOutline,
  ShareIcon,
  TrashIcon,
  PencilSquareIcon,
  DocumentDuplicateIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  PhotoIcon,
  MusicalNoteIcon,
  TableCellsIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { ViewColumnsIcon, Bars3Icon, StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

// Define types for our data and props


interface FileTypeIconProps {
  fileType: FileOrFolder['fileType'];
}

const initialFiles: FileOrFolder[] = [
    {
        id: '1',
        type: 'folder',
        name: 'Onboarding',
        lastModified: '2 days ago',
        isStarred: true,
        color: 'bg-gray-600',
        fileCount: 15,
        sources: ['gdrive', 'notion']
    },
    {
        id: '2',
        type: 'folder',
        name: 'Client Work',
        lastModified: '1 week ago',
        isShared: true,
        color: 'bg-blue-500',
        fileCount: 8,
        sources: ['gdrive']
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
        name: 'Meeting Recording.mp4',
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
        name: 'Budget Spreadsheet.xlsx',
        size: '892 KB',
        lastModified: '1 week ago',
        fileType: 'spreadsheet',
    },
    {
        id: '7',
        type: 'file',
        name: 'Brand Assets.zip',
        size: '25.6 MB',
        lastModified: '4 days ago',
        fileType: 'archive',
    },
    {
        id: '8',
        type: 'file',
        name: 'api-setup.js',
        size: '12 KB',
        lastModified: '5 days ago',
        fileType: 'code',
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

export default function FilesPage() {
  const [files, setFiles] = useState<FileOrFolder[]>(initialFiles);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileOrFolder } | null>(null);

  const filteredAndSortedItems = useMemo(() => {
    let items = files.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterType !== 'all') {
        if (filterType === 'starred') {
            items = items.filter(item => item.isStarred);
        } else {
            items = items.filter(item => item.type === filterType);
        }
    }

    items.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'modified') {
        // This is a simplified sort, a real implementation would need to parse dates
        return a.lastModified.localeCompare(b.lastModified);
      }
      return 0;
    });

    return items;
  }, [files, searchQuery, filterType, sortBy]);

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>, item: FileOrFolder) => {
    event.preventDefault();
    setContextMenu({ x: event.pageX, y: event.pageY, item });
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleStar = (id: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, isStarred: !f.isStarred } : f));
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredAndSortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedItems.map(item => item.id));
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900" onContextMenu={(e) => e.preventDefault()}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Files</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredAndSortedItems.length} items • {selectedItems.length} selected
            </p>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files and folders..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm">
                <option value="all">All Files</option>
                <option value="folder">Folders</option>
                <option value="starred">Starred</option>
              </select>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm">
                <option value="name">Name</option>
                <option value="modified">Date Modified</option>
              </select>
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  aria-label="Grid view"
                >
                  <ViewColumnsIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  aria-label="List view"
                >
                  <Bars3Icon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-3">
                <button className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">Share</button>
                <button className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200">Download</button>
                <button className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">Delete</button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredAndSortedItems.map(item => (
              <div 
                key={item.id} 
                onClick={() => toggleItemSelection(item.id)}
                onContextMenu={(e) => handleContextMenu(e, item)}
                className={`relative group rounded-xl transition-all duration-200 ${selectedItems.includes(item.id) ? 'ring-2 ring-blue-500 bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}
              >
                <div className="p-4">
                    {item.type === 'folder' ? (
                      <ThreeDFolder item={item} />
                    ) : (
                      <FilePreview item={item} />
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                      checked={selectedItems.length === filteredAndSortedItems.length && filteredAndSortedItems.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Modified</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Size</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAndSortedItems.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => toggleItemSelection(item.id)}
                    onContextMenu={(e: any) => handleContextMenu(e, item)}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${selectedItems.includes(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => { e.stopPropagation(); toggleItemSelection(item.id); }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                          {item.type === 'folder' ? (
                            <FolderIconOutline className="h-8 w-8 text-gray-500" />
                          ) : (
                            <FileTypeIcon fileType={item.fileType} />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.lastModified}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {item.size || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-gray-400 hover:text-yellow-400"
                        onClick={(e) => { e.stopPropagation(); toggleStar(item.id); }}
                      >
                        {item.isStarred ? (
                          <StarIconSolid className="h-5 w-5 text-yellow-400" />
                        ) : (
                          <StarIconOutline className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {contextMenu && (
            <ContextMenu
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={() => setContextMenu(null)}
                actions={[
                    { label: 'Open', icon: <FolderIconOutline />, onClick: () => console.log('Open', contextMenu.item.name) },
                    { label: 'Share', icon: <ShareIcon />, onClick: () => console.log('Share', contextMenu.item.name) },
                    { label: 'Rename', icon: <PencilSquareIcon />, onClick: () => console.log('Rename', contextMenu.item.name) },
                    { label: 'Duplicate', icon: <DocumentDuplicateIcon />, onClick: () => console.log('Duplicate', contextMenu.item.name) },
                    { label: 'Delete', icon: <TrashIcon />, onClick: () => console.log('Delete', contextMenu.item.name), isDestructive: true },
                ]}
            />
        )}
      </div>
    </main>
  );
}
