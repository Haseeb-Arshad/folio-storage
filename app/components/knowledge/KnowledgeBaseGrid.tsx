import React, { useState } from 'react';
import Folder3D from './Folder3D';
import { 
  GoogleIcon, 
  MicrosoftIcon, 
  SlackIcon 
} from '../icons/ServiceIcons';

interface FolderItem {
  id: string;
  name: string;
  fileCount: number;
  services?: string[];
}

interface KnowledgeBaseGridProps {
  folders: FolderItem[];
  onFolderClick: (folder: FolderItem) => void;
  activeFolder?: string;
}

const KnowledgeBaseGrid: React.FC<KnowledgeBaseGridProps> = ({ 
  folders, 
  onFolderClick,
  activeFolder 
}) => {
  const getServiceIcons = (services: string[] = []) => {
    return services.map(service => {
      switch(service.toLowerCase()) {
        case 'google':
          return <GoogleIcon className="w-3 h-3" />;
        case 'microsoft':
          return <MicrosoftIcon className="w-3 h-3" />;
        case 'slack':
          return <SlackIcon className="w-3 h-3" />;
        default:
          return null;
      }
    }).filter(Boolean);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <div key={folder.id} className="transform-gpu">
          <Folder3D
            name={folder.name}
            fileCount={folder.fileCount}
            icons={getServiceIcons(folder.services)}
            onClick={() => onFolderClick(folder)}
            isActive={activeFolder === folder.id}
          />
        </div>
      ))}
    </div>
  );
};

export default KnowledgeBaseGrid;
