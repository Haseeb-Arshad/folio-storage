export interface FileOrFolder {
    id: string;
    type: 'folder' | 'file';
    name: string;
    lastModified: string;
    isStarred?: boolean;
    isShared?: boolean;
    size?: string;
    fileType?: 'pdf' | 'image' | 'video' | 'audio' | 'spreadsheet' | 'archive' | 'code' | 'other';
    color?: string;
    tags?: string[];
    sources?: ('gdrive' | 'notion')[];
    fileCount?: number;
}
