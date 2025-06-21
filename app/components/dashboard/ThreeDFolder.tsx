import { useState } from 'react';
import type { FileOrFolder } from '~/types';
import { motion } from 'framer-motion';
import { SiGoogledrive, SiNotion } from 'react-icons/si';

interface ThreeDFolderProps {
    item: FileOrFolder;
    onDoubleClick?: (item: FileOrFolder) => void;
}

const SourceIcon = ({ source }: { source: string }) => {
    switch (source) {
        case 'gdrive':
            return <SiGoogledrive className="w-4 h-4 text-white" />;
        case 'notion':
            return <SiNotion className="w-4 h-4 text-white" />;
        default:
            return null;
    }
};

const ThreeDFolder = ({ item, onDoubleClick }: ThreeDFolderProps) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const handleDoubleClick = () => {
        if (onDoubleClick) {
            onDoubleClick(item);
        }
    };

    // Base folder color with a subtle gradient
    const folderColor = item.color || 'bg-gradient-to-br from-gray-600 to-gray-700';
    const folderHoverColor = item.color 
        ? `bg-gradient-to-br from-${item.color.split('-')[0]}-600 to-${item.color.split('-')[0]}-700` 
        : 'bg-gradient-to-br from-gray-700 to-gray-800';

    return (
        <div
            className="relative w-full aspect-[4/3] cursor-pointer group"
            style={{ perspective: '1000px' }}
            onDoubleClick={handleDoubleClick}
        >
            <div 
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Folder Back - document sleeve */}
                <div
                    className="absolute inset-0 rounded-lg bg-gray-800/90 shadow-lg"
                    style={{ 
                        transform: 'translateZ(-2px)', 
                        clipPath: 'polygon(0 14%, 100% 14%, 100% 100%, 0 100%)'
                    }}
                />

                {/* Single Document Inside - peeking out slightly */}
                <div
                    className="absolute w-[90%] h-[88%] top-[10%] left-[5%] bg-white dark:bg-gray-50 rounded-sm"
                    style={{ 
                        transform: 'translateZ(-1px)', 
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                        opacity: 0.8,
                        transformOrigin: 'center bottom'
                    }}
                />

                {/* Folder Front - with subtle shadow and highlight effects */}
                <div
                    className={`absolute inset-0 ${folderColor} rounded-lg shadow-lg overflow-hidden`}
                    style={{ 
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'bottom center',
                        transform: 'translateZ(0)'
                    }}
                >
                    {/* Top folder tab with curve */}
                    <div className="absolute top-0 left-0 w-[40%] h-[14%] bg-black/10 rounded-tl-lg"
                         style={{ 
                             borderTopRightRadius: '4px',
                             borderRight: '1px solid rgba(255,255,255,0.1)'
                         }}
                    ></div>

                    {/* Subtle highlight effect at the top */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20 z-10"></div>
                    
                    {/* Subtle inner shadow */}
                    <div className="absolute inset-0 shadow-inner opacity-60"></div>

                    {/* Source Icons */}
                    {item.sources && (
                        <div 
                            className="absolute bottom-2 left-2 flex items-center space-x-1.5"
                        >
                            {item.sources.map(source => (
                                <div key={source} className="p-1 bg-black/20 backdrop-blur-sm rounded-full">
                                    <SourceIcon source={source} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Folder Info */}
            <div 
                className="mt-3 text-center"
            >
                <p className="font-medium text-sm text-gray-800 dark:text-white truncate">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.fileCount || 0} Files</p>
            </div>
        </div>
    );
};

export default ThreeDFolder;
