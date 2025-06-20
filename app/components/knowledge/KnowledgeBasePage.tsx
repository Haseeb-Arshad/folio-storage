import { useState } from "react";
import styles from "~/styles/KnowledgeBase.module.css";
import { 
  BookOpenIcon,
  TagIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FolderIcon,
  StarIcon,
  EyeIcon,
  PencilIcon,
  ShareIcon,
  ArchiveBoxIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import FolderTree from "./FolderTree";
import KnowledgeBaseGrid from "./KnowledgeBaseGrid";

// Tree structure for the sidebar navigation
const folderStructure = [
  {
    id: 'general-knowledge',
    name: 'General Knowledge',
    type: 'folder' as const,
    count: 10,
    children: [
      {
        id: 'onboarding',
        name: 'Onboarding',
        type: 'folder' as const,
        count: 3,
        children: [
          {
            id: 'subfolder-1',
            name: 'Subfolder 1',
            type: 'folder' as const,
            count: 5,
          },
          {
            id: 'subfolder-2',
            name: 'Subfolder 2',
            type: 'folder' as const,
            count: 10,
          }
        ]
      },
      {
        id: 'integrations',
        name: 'Integrations',
        type: 'folder' as const,
        count: 5,
      },
      {
        id: 'documents',
        name: 'Documents',
        type: 'folder' as const,
        count: 10,
      }
    ]
  },
  {
    id: 'onboarding-design',
    name: 'Onboarding Design',
    type: 'folder' as const,
  },
  {
    id: 'team-interviews',
    name: 'Team Interviews',
    type: 'folder' as const,
  }
];

// Folders for the grid display
const folders = [
  {
    id: 'onboarding',
    name: 'Onboarding',
    fileCount: 15,
    services: ['google', 'microsoft']
  },
  {
    id: 'integrations',
    name: 'Integrations',
    fileCount: 5,
    services: ['microsoft', 'slack', 'google']
  },
  {
    id: 'documents',
    name: 'Documents',
    fileCount: 10,
    services: ['microsoft', 'figma']
  }
];

// Files for the file list display
const files = [
  {
    id: "1",
    name: "Onboarding-Guide.pdf",
    addedBy: "kevin@mail.com",
    addedByAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    type: "pdf"
  },
  {
    id: "2",
    name: "Product-Roadmap.docx",
    addedBy: "antonwe@gmail.com",
    type: "docx"
  }
];

export default function KnowledgeBasePage() {
  const [activeFolder, setActiveFolder] = useState("onboarding");
  const [activePath, setActivePath] = useState<string[]>(['general-knowledge', 'onboarding']);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleFolderClick = (folder: { id: string, name: string }) => {
    setActiveFolder(folder.id);
  };
  
  const handleTreeItemSelect = (item: any) => {
    if (item.type === 'folder') {
      setActiveFolder(item.id);
      setActivePath(prev => {
        // Find path to this item
        const findPath = (items: any[], path: string[] = []): string[] | null => {
          for (const currItem of items) {
            if (currItem.id === item.id) {
              return [...path, item.id];
            }
            if (currItem.children) {
              const result = findPath(currItem.children, [...path, currItem.id]);
              if (result) return result;
            }
          }
          return null;
        };
        
        const newPath = findPath(folderStructure);
        return newPath || [item.id];
      });
    }
  };
  
  return (
    <div className={`${styles.knowledgeContainer} flex h-full overflow-hidden`}>
      {/* Sidebar - Knowledge Base Tree */}
      <div className={`${styles.sidebar} w-64 h-full overflow-y-auto`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            Knowledge Base
          </h2>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-accent)] text-sm"
            />
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 flex-1 text-center">
              Folders
            </button>
            <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 flex-1 text-center">
              Tags
            </button>
          </div>
          
          <div className="mt-4">
            <FolderTree
              items={folderStructure}
              onSelectItem={handleTreeItemSelect}
              activePath={activePath}
            />
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`${styles.contentArea} flex-1 overflow-y-auto`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Folders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse through your organized file collections
          </p>
        </div>
        
        {/* 3D Folder Grid */}
        <div className={`${styles.folderGrid} mb-10`}>
          <KnowledgeBaseGrid 
            folders={folders} 
            onFolderClick={handleFolderClick}
            activeFolder={activeFolder}
          />
        </div>
        
        {/* Files List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Files
          </h2>
          
          <div className={`${styles.folderItem} rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden`}>
            <div className="grid grid-cols-2 gap-4 p-4 text-sm font-medium text-[var(--color-accent)] dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <div>Name</div>
              <div>Added By</div>
            </div>
            
            <div>
              {files.map((file) => (
                <div 
                  key={file.id}
                  className="grid grid-cols-2 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <FolderIcon className="w-5 h-5 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        {file.addedByAvatar ? (
                          <img src={file.addedByAvatar} className="w-8 h-8 rounded-full" alt="User avatar" />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {file.addedBy.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.addedBy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
