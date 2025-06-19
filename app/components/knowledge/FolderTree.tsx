import React, { useState } from 'react';
import { 
  ChevronRightIcon, 
  ChevronDownIcon,
  FolderIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

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
  level?: number;
  isCollapsed?: boolean;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  items,
  onSelectItem,
  activePath = [],
  level = 0,
  isCollapsed = false
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  
  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };
  
  const isActive = (itemId: string) => activePath.includes(itemId);
  
  return (
    <div className="w-full">
      {items.map((item) => {
        const isExpanded = !!expandedFolders[item.id];
        const isItemActive = isActive(item.id);
        
        return (
          <div key={item.id}>
            <div 
              className={`flex items-center py-1.5 px-3 rounded-md text-sm cursor-pointer
                ${isItemActive ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 
                'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                ${level > 0 ? 'ml-' + level * 4 : ''}
              `}
              onClick={() => {
                if (item.type === 'folder') {
                  toggleFolder(item.id);
                }
                onSelectItem(item);
              }}
              style={{
                paddingLeft: isCollapsed ? '0.75rem' : `${level * 0.75 + 0.75}rem`
              }}
            >
              {item.type === 'folder' && (
                <button 
                  className="mr-1 p-0.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(item.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRightIcon className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
              
              {!isCollapsed && (
                <>
                  <div className="mr-2">
                    {item.type === 'folder' ? (
                      <FolderIcon className="w-4 h-4 text-blue-500" />
                    ) : (
                      <DocumentIcon className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <span className={isCollapsed ? 'hidden' : 'truncate flex-1'}>
                    {item.name}
                  </span>
                  {item.count !== undefined && (
                    <span className="ml-1.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5">
                      {item.count}
                    </span>
                  )}
                </>
              )}
              
              {isCollapsed && item.type === 'folder' && (
                <div className="mx-auto">
                  <FolderIcon className="w-5 h-5 text-blue-500" />
                </div>
              )}
              {isCollapsed && item.type === 'file' && (
                <div className="mx-auto">
                  <DocumentIcon className="w-5 h-5 text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Render children if this is a folder and it's expanded */}
            {item.type === 'folder' && isExpanded && item.children && !isCollapsed && (
              <FolderTree
                items={item.children}
                onSelectItem={onSelectItem}
                activePath={activePath}
                level={level + 1}
                isCollapsed={isCollapsed}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FolderTree;
