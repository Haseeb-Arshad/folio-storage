import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FileOrFolder } from '~/types';
import {
    DocumentTextIcon,
    PhotoIcon,
    VideoCameraIcon,
    MusicalNoteIcon,
    TableCellsIcon,
    ArchiveBoxIcon,
    CommandLineIcon,
    DocumentIcon,
} from '@heroicons/react/24/solid';
import { FiFilePlus } from 'react-icons/fi';

interface FilePreviewProps {
    item: FileOrFolder;
    onDoubleClick?: (item: FileOrFolder) => void;
}

interface FileTypeConfig {
    icon: React.ElementType;
    color: string;
    gradient: string;
    extension?: string;
    thumbnail?: string;
}

const getFileTypeConfig = (fileType: string | undefined, fileName: string): FileTypeConfig => {
    // Determine file extension from name
    let extension = '';
    const nameParts = fileName.split('.');
    if (nameParts.length > 1) {
        extension = nameParts[nameParts.length - 1].toLowerCase();
    }
    
    // Special mapping for files we know exist in public/data
    if (fileName === 'the_biology_of_aging.pdf') {
        return {
            icon: DocumentTextIcon,
            color: 'text-red-600',
            gradient: 'from-red-500 to-rose-600',
            extension: 'PDF',
            thumbnail: '/data/the_biology_of_aging.pdf'
        };
    } else if (fileName === 'main.webp') {
        return {
            icon: PhotoIcon,
            color: 'text-emerald-500',
            gradient: 'from-emerald-400 to-green-500',
            extension: 'WEBP',
            thumbnail: '/data/main.webp'
        };
    } else if (fileName === 'meme-video.mp4') {
        return {
            icon: VideoCameraIcon,
            color: 'text-blue-500',
            gradient: 'from-blue-500 to-indigo-600',
            extension: 'MP4',
            thumbnail: '/data/meme-video.mp4'
        };
    } else if (fileName === 'online-classes.xlsx') {
        return {
            icon: TableCellsIcon,
            color: 'text-emerald-600',
            gradient: 'from-emerald-500 to-teal-600',
            extension: 'XLSX'
        };
    } else if (fileName === 'Geist.zip') {
        return {
            icon: ArchiveBoxIcon,
            color: 'text-amber-600',
            gradient: 'from-amber-500 to-yellow-600',
            extension: 'ZIP'
        };
    } else if (fileName === 'Research.docx') {
        return {
            icon: DocumentIcon,
            color: 'text-blue-600',
            gradient: 'from-blue-500 to-indigo-500',
            extension: 'DOCX'
        };
    } else if (fileName === 'maps.rtf') {
        return {
            icon: DocumentTextIcon,
            color: 'text-indigo-500',
            gradient: 'from-indigo-400 to-purple-500',
            extension: 'RTF'
        };
    } else if (fileName === 'solflare-backup.txt') {
        return {
            icon: DocumentTextIcon,
            color: 'text-gray-600',
            gradient: 'from-gray-500 to-slate-600',
            extension: 'TXT'
        };
    }
    
    // Default configs for general file types based on extension
    if (extension) {
        // Image files
        if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
            return {
                icon: PhotoIcon, 
                color: 'text-emerald-500', 
                gradient: 'from-emerald-400 to-green-500',
                extension: extension.toUpperCase()
            };
        }
        
        // Video files
        if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
            return {
                icon: VideoCameraIcon, 
                color: 'text-indigo-500', 
                gradient: 'from-blue-500 to-indigo-600',
                extension: extension.toUpperCase()
            };
        }
        
        // Audio files
        if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
            return {
                icon: MusicalNoteIcon, 
                color: 'text-amber-500', 
                gradient: 'from-amber-400 to-orange-500',
                extension: extension.toUpperCase()
            };
        }
        
        // Spreadsheet files
        if (['xlsx', 'xls', 'csv', 'numbers'].includes(extension)) {
            return {
                icon: TableCellsIcon, 
                color: 'text-blue-500', 
                gradient: 'from-cyan-500 to-blue-500',
                extension: extension.toUpperCase()
            };
        }
        
        // Archive files
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
            return {
                icon: ArchiveBoxIcon, 
                color: 'text-amber-600', 
                gradient: 'from-amber-500 to-yellow-600',
                extension: extension.toUpperCase()
            };
        }
        
        // Code files
        if (['js', 'ts', 'py', 'java', 'cpp', 'c', 'php', 'html', 'css', 'go', 'rs', 'rb'].includes(extension)) {
            return {
                icon: CommandLineIcon, 
                color: 'text-violet-500', 
                gradient: 'from-violet-500 to-purple-600',
                extension: extension.toUpperCase()
            };
        }
        
        // Document files
        if (['doc', 'docx', 'txt', 'rtf', 'md'].includes(extension)) {
            return {
                icon: DocumentIcon, 
                color: 'text-gray-500', 
                gradient: 'from-gray-400 to-gray-600',
                extension: extension.toUpperCase()
            };
        }
        
        // PDF files
        if (extension === 'pdf') {
            return { 
                icon: DocumentTextIcon, 
                color: 'text-red-500', 
                gradient: 'from-rose-500 to-red-600',
                extension: 'PDF'
            };
        }
    }
    
    // Fall back to file type if provided
    if (fileType === 'pdf') {
        return { 
            icon: DocumentTextIcon, 
            color: 'text-red-500', 
            gradient: 'from-rose-500 to-red-600',
            extension: 'PDF'
        };
    } else if (fileType === 'image') {
        return {
            icon: PhotoIcon, 
            color: 'text-emerald-500', 
            gradient: 'from-emerald-400 to-green-500',
            extension: 'IMG'
        };
    } else if (fileType === 'video') {
        return {
            icon: VideoCameraIcon, 
            color: 'text-indigo-500', 
            gradient: 'from-blue-500 to-indigo-600',
            extension: 'VID'
        };
    } else if (fileType === 'audio') {
        return {
            icon: MusicalNoteIcon, 
            color: 'text-amber-500', 
            gradient: 'from-amber-400 to-orange-500',
            extension: 'AUD'
        };
    } else if (fileType === 'spreadsheet') {
        return {
            icon: TableCellsIcon, 
            color: 'text-blue-500', 
            gradient: 'from-cyan-500 to-blue-500',
            extension: 'XLS'
        };
    } else if (fileType === 'archive') {
        return {
            icon: ArchiveBoxIcon, 
            color: 'text-amber-600', 
            gradient: 'from-amber-500 to-yellow-600',
            extension: 'ZIP'
        };
    } else if (fileType === 'code') {
        return {
            icon: CommandLineIcon, 
            color: 'text-violet-500', 
            gradient: 'from-violet-500 to-purple-600',
            extension: 'CODE'
        };
    }
    
    // Default fallback
    return {
        icon: DocumentIcon,
        color: 'text-gray-500',
        gradient: 'from-gray-400 to-gray-600',
        extension: extension ? extension.toUpperCase() : 'DOC'
    };
};

const FilePreview = ({ item, onDoubleClick }: FilePreviewProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const config = getFileTypeConfig(item.fileType, item.name);
    const Icon = config.icon;
    
    const handleDoubleClick = () => {
        if (onDoubleClick) {
            onDoubleClick(item);
        }
    };
    
    return (
        <div 
            className="relative w-full aspect-[4/3] cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onDoubleClick={handleDoubleClick}
        >
            <motion.div
                className="relative w-full h-full rounded-lg overflow-hidden shadow-sm"
                animate={{
                    scale: isHovered ? 1.02 : 1,
                    boxShadow: isHovered 
                        ? '0 10px 30px -10px rgba(0,0,0,0.3)' 
                        : '0 1px 3px rgba(0,0,0,0.1)',
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}></div>
                
                {/* Overlay with glass effect */}
                <motion.div 
                    className="absolute inset-0 backdrop-blur-[1px] bg-white/10"
                    animate={{ opacity: isHovered ? 0.15 : 0.2 }}
                    transition={{ duration: 0.2 }}
                ></motion.div>
                
                {/* Thumbnail or Document Icon */}
                {config.thumbnail && (config.thumbnail.endsWith('.webp') || config.thumbnail.endsWith('.jpg') || config.thumbnail.endsWith('.jpeg') || config.thumbnail.endsWith('.png')) ? (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <img 
                            src={config.thumbnail} 
                            alt={item.name}
                            className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
                    </div>
                ) : (
                    <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <Icon className={`w-16 h-16 ${config.color} text-white drop-shadow-md`} />
                    </div>
                )}
                
                {/* Extension Badge */}
                <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <div className="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-semibold text-white tracking-wider">
                            {config.extension}
                        </span>
                    </div>
                </div>
                
                {/* Hover Actions */}
                <motion.div 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-2 rounded-full shadow-lg"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: isHovered ? 1 : 0.8, opacity: isHovered ? 1 : 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.05 }}
                        role="button"
                        aria-label="Open file"
                    >
                        <FiFilePlus className="w-6 h-6 text-gray-800 dark:text-white" />
                    </motion.div>
                </motion.div>
            </motion.div>
            
            {/* File Info */}
            <div className="mt-3 text-center px-1">
                <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                    {item.name}
                </p>
                <motion.p 
                    className="text-xs text-gray-500 dark:text-gray-400 mt-0.5"
                    animate={{ opacity: isHovered ? 1 : 0.8 }}
                    transition={{ duration: 0.2 }}
                >
                    {item.size}
                </motion.p>
            </div>
        </div>
    );
};

export default FilePreview;
