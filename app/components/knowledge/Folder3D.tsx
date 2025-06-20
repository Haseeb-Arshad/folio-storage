import { useState } from "react";
import { motion } from "framer-motion";
import "~/styles/knowledge-base.css";

interface Folder3DProps {
  name: string;
  fileCount: number;
  icons?: React.ReactNode[];
  onClick?: () => void;
  isActive?: boolean;
}

const Folder3D: React.FC<Folder3DProps> = ({ 
  name, 
  fileCount, 
  icons = [], 
  onClick,
  isActive = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className={`folder-3d-container relative cursor-pointer ${isActive ? 'z-10' : ''}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="folder-3d">
        {/* Folder back */}
        <div className="folder-back" />
        
        {/* Folder main */}
        <div className={`folder-main ${isActive ? 'ring-1 ring-gray-300 bg-white dark:ring-gray-600 dark:bg-gray-800' : ''}`}>
          {/* Folder tab */}
          <div className="folder-tab" />
          
          {/* Content */}
          <div className="flex items-end justify-between mt-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">
                {name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {fileCount} Files
              </p>
            </div>
            
            {/* Icons */}
            <div className="flex -space-x-2">
              {icons.map((icon, index) => (
                <div 
                  key={index} 
                  className="folder-icon w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* "Files" inside folder - visible on hover */}
        <div className="folder-content">
          {/* Simulated file lines */}
          <div className="space-y-2 p-2">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Folder3D;
