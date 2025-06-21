import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Sun, Star, Cloud, ImageIcon as ImageIconLucide, type LucideProps } from 'lucide-react';
import { useState, useEffect, type ElementType, type ForwardRefExoticComponent, type RefAttributes } from 'react';

// Define a specific type for Lucide icons
type IconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

// Define the shape of a folder
export interface Folder {
  id: string;
  name: string;
  count: number;
  featuredImageUrl: string | null;
  imageUrls: string[];
  icon1: IconComponent | null;
  icon2: IconComponent | null;
}

interface EditFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedFolder: Folder) => void;
  folder: Folder | null;
}

// List of available icons
const availableIcons: { name: string; component: IconComponent | null }[] = [
  { name: 'None', component: null },
  { name: 'Sun', component: Sun },
  { name: 'Star', component: Star },
  { name: 'Cloud', component: Cloud },
  { name: 'Image', component: ImageIconLucide },
];

const EditFolderModal = ({ isOpen, onClose, onSave, folder }: EditFolderModalProps) => {
  const [name, setName] = useState('');
  const [selectedIcon1, setSelectedIcon1] = useState<IconComponent | null>(null);
  const [selectedIcon2, setSelectedIcon2] = useState<IconComponent | null>(null);

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setSelectedIcon1(folder.icon1);
      setSelectedIcon2(folder.icon2);
    }
  }, [folder]);

  const handleSave = () => {
    if (folder) {
      onSave({
        ...folder,
        name,
        icon1: selectedIcon1,
        icon2: selectedIcon2,
      });
      onClose();
    }
  };

  const IconSelector = ({ selectedIcon, onSelect }: { selectedIcon: IconComponent | null, onSelect: (icon: IconComponent | null) => void }) => (
    <div className="flex space-x-2">
      {availableIcons.map(({ name: iconName, component: IconComponent }) => {
        const isSelected = selectedIcon === IconComponent;
        return (
          <button
            key={iconName}
            type="button"
            onClick={() => onSelect(IconComponent)}
            className={`p-2 rounded-lg border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-400'}`}
          >
            {IconComponent ? <IconComponent size={20} className="text-gray-600" /> : <span className="text-xs px-1">None</span>}
          </button>
        );
      })}
    </div>
  );


  return (
    <AnimatePresence>
      {isOpen && folder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Folder</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
                <input
                  type="text"
                  id="folderName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon 1</label>
                <IconSelector selectedIcon={selectedIcon1} onSelect={setSelectedIcon1} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon 2</label>
                <IconSelector selectedIcon={selectedIcon2} onSelect={setSelectedIcon2} />
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={onClose}
                type="button"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                type="button"
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditFolderModal;
