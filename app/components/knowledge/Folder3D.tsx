import { useState } from "react";
import { motion } from "framer-motion";

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
      className={`relative cursor-pointer ${isActive ? 'z-10' : ''}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Folder back */}
      <motion.div
        className={`absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-lg shadow-md transform origin-bottom`}
        animate={{
          rotateX: isHovered ? "-5deg" : "0deg",
          y: isHovered ? -5 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ zIndex: 1, transformStyle: "preserve-3d" }}
      />
      
      {/* Folder main */}
      <motion.div
        className={`relative bg-gray-200 dark:bg-gray-700 rounded-lg p-5 shadow-lg transform origin-bottom
                   ${isActive ? 'ring-2 ring-blue-500' : ''}`}
        animate={{
          rotateX: isHovered ? "-10deg" : "0deg",
          y: isHovered ? -8 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ zIndex: 2, transformStyle: "preserve-3d" }}
      >
        {/* Folder tab */}
        <div className="absolute -top-2 left-4 right-4 h-2 bg-gray-400 dark:bg-gray-500 rounded-t-lg" />
        
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
                className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700"
              >
                {icon}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* "Files" inside folder - only visible on hover */}
      <motion.div
        className="absolute inset-x-4 top-6 bottom-4 bg-white dark:bg-gray-800 rounded-md"
        initial={{ opacity: 0, y: 0 }}
        animate={{ 
          opacity: isHovered ? 0.8 : 0,
          y: isHovered ? 4 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ zIndex: 0 }}
      >
        {/* Simulated file lines */}
        <div className="p-3 space-y-1">
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Folder3D;
