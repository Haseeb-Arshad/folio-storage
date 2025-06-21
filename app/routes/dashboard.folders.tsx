import { Link } from "@remix-run/react";
import { useState, ElementType } from 'react';
import { MoreVertical, ImageIcon, Star, Sun, Cloud, Edit, Trash2, Image as ImageIconLucide } from 'lucide-react';
import EditFolderModal, { type Folder } from '~/components/EditFolderModal';
import ChangeCoverModal from '~/components/ChangeCoverModal';
import { photoAlbums as initialPhotoAlbums } from '~/data/photoAlbums';
import { motion, AnimatePresence } from 'framer-motion';


// Combine initial data into a single structure
const initialFoldersData: Folder[] = initialPhotoAlbums.map((album, index) => ({
  id: `${index + 1}`,
  name: album.title,
  count: album.photoCount,
  featuredImageUrl: album.imageUrls[0] || null,
  imageUrls: album.imageUrls,
  // Placeholder icons, can be customized or derived from data
  icon1: [Sun, Cloud, ImageIcon, null, ImageIcon, null][index] || null,
  icon2: [Star, Star, null, null, Star, null][index] || null,
}));

export default function FoldersPage() {
  const [folders, setFolders] = useState(initialFoldersData);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [changingCoverFolder, setChangingCoverFolder] = useState<Folder | null>(null);

  const handleMenuToggle = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenMenuId(prevId => (prevId === folderId ? null : folderId));
  };

  const handleEditClick = (e: React.MouseEvent, folder: Folder) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingFolder(folder);
    setOpenMenuId(null);
  };

  const handleSaveChanges = (updatedFolder: Folder) => {
    setFolders(prevFolders => 
      prevFolders.map(f => f.id === updatedFolder.id ? updatedFolder : f)
    );
    // In a real app, you'd also make an API call here to persist the changes.
  };

  const handleChangeCoverClick = (e: React.MouseEvent, folder: Folder) => {
    e.stopPropagation();
    e.preventDefault();
    setChangingCoverFolder(folder);
    setOpenMenuId(null);
  };

  const handleCoverSave = (folderId: string, newCoverUrl: string, isNewUpload: boolean) => {
    setFolders(prevFolders =>
      prevFolders.map(f => {
        if (f.id === folderId) {
          const updatedFolder = { ...f, featuredImageUrl: newCoverUrl };
          if (isNewUpload) {
            updatedFolder.imageUrls = [newCoverUrl, ...f.imageUrls];
            updatedFolder.count++;
          }
          return updatedFolder;
        }
        return f;
      })
    );
  };

  const handleDeleteFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    e.preventDefault();
    setFolders(prevFolders => prevFolders.filter(f => f.id !== folderId));
    setOpenMenuId(null); // Close the menu
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen" onClick={() => setOpenMenuId(null)}>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Folders</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <AnimatePresence>
          {folders.map((folder) => (
            <motion.div 
              key={folder.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out overflow-hidden"
            >
            <button 
              onClick={(e) => handleMenuToggle(e, folder.id)}
              className="absolute top-3 right-3 z-20 p-2 bg-white/70 backdrop-blur-sm rounded-full text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={20} />
            </button>

            <AnimatePresence>
              {openMenuId === folder.id && (
                <motion.div
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-12 right-3 z-30 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 origin-top-right"
                >
                  <button onClick={(e) => handleEditClick(e, folder)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors">
                    <Edit size={16} className="mr-3 text-gray-500" /> Edit Details
                  </button>
                  <button onClick={(e) => handleChangeCoverClick(e, folder)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors">
                    <ImageIconLucide size={16} className="mr-3 text-gray-500" /> Change Cover
                  </button>
                  <button onClick={(e) => handleDeleteFolder(e, folder.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors">
                    <Trash2 size={16} className="mr-3" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <Link to={`/folders/${encodeURIComponent(folder.name)}`} className="block">
              <div className="relative w-full h-48 bg-gray-200">
                {folder.featuredImageUrl ? (
                  <img src={folder.featuredImageUrl} alt={folder.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {(folder.icon1 || folder.icon2) && (
                  <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                    {folder.icon1 && <div className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md">{<folder.icon1 size={16} className="text-gray-700" />}</div>}
                    {folder.icon2 && <div className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-md">{<folder.icon2 size={16} className="text-gray-700" />}</div>}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">{folder.name}</h2>
                <p className="text-gray-500 mt-1">{folder.count} items</p>
              </div>
            </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <EditFolderModal 
        isOpen={!!editingFolder}
        onClose={() => setEditingFolder(null)}
        onSave={handleSaveChanges}
        folder={editingFolder}
      />

      <ChangeCoverModal
        isOpen={!!changingCoverFolder}
        onClose={() => setChangingCoverFolder(null)}
        onSave={handleCoverSave}
        folder={changingCoverFolder}
        imageUrls={folders.find(f => f.id === changingCoverFolder?.id)?.imageUrls || []}
      />
    </div>
  );
}
