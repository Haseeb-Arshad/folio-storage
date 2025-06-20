import React, { useState } from 'react';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  FolderIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';
import "~/styles/knowledge-base.css";

interface TreeItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  children?: TreeItem[];
  count?: number;
}

interface FolderTreeProps {
  items: TreeItem[];
  onSelectItem: (item: TreeItem) => void;
  activePath?: string[];
}

const FolderTree: React.FC<FolderTreeProps> = ({
  items,
  onSelectItem,
  activePath = []
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    // Default expand some folders
    "folder-1": true
  });
  
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const isActive = (itemId: string) => activePath.includes(itemId);
  
  const renderTreeItems = (treeItems: TreeItem[], level = 0) => {
    return treeItems.map(item => {
      const isFolder = item.type === "folder";
      const isExpanded = expandedFolders[item.id] || false;
      const isItemActive = isActive(item.id);
      
      return (
        <div key={item.id} style={{ paddingLeft: `${level * 16}px` }}>
          <div 
            className={`folder-tree-item flex items-center py-2 px-2 cursor-pointer transition-all duration-200 ${isItemActive ? 'active' : ''}`}
            onClick={() => onSelectItem(item)}
          >
            {isFolder ? (
              <button 
                className="mr-1 focus:outline-none transition-transform duration-150"
                onClick={(e) => toggleFolder(item.id, e)}
                aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
              >
                {isExpanded ? (
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            ) : (
              <span className="ml-5" />
            )}
            
            <span className={`mr-2 ${isItemActive ? 'text-[var(--color-accent)]' : 'text-gray-500 dark:text-gray-400'}`}>
              {isFolder ? (
                <FolderIcon className="w-5 h-5" />
              ) : (
                <DocumentIcon className="w-5 h-5" />
              )}
            </span>
            
            <span className={`text-sm ${isItemActive ? '' : 'text-gray-700 dark:text-gray-300'}`}>
              {item.name}
            </span>
            
            {item.count !== undefined && (
              <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                {item.count}
              </span>
            )}
          </div>
          
          {isFolder && isExpanded && item.children && (
            <div className="pl-4 overflow-hidden">
              {renderTreeItems(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };
  
  return (
    <div className="overflow-y-auto max-h-[70vh] pr-1">
      {renderTreeItems(items)}
    </div>
  );
};

export default FolderTree;
