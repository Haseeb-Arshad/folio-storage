import React from 'react';
import { motion } from 'framer-motion';
import { ArrowsUpDownIcon, FunnelIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';

interface FolderHeaderProps {
  folderName: string;
  itemCount: number;
}

const IconButton: React.FC<{ children: React.ReactNode; tooltip: string }> = ({ children, tooltip }) => (
  <motion.button
    className="p-2.5 rounded-full bg-slate-700/50 hover:bg-slate-700/80 backdrop-blur-lg border border-slate-600/50 transition-colors duration-200 group relative"
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.95 }}
    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
  >
    {children}
    <span className="absolute bottom-full mb-2 w-max px-2 py-1 text-xs font-medium text-white bg-slate-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity delay-300 pointer-events-none">
      {tooltip}
    </span>
  </motion.button>
);

const FolderHeader: React.FC<FolderHeaderProps> = ({ folderName, itemCount }) => {
  return (
    <header className="py-4 px-4 md:px-6 sticky top-4 z-30">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4 rounded-2xl shadow-2xl shadow-black/20 bg-slate-800/60 backdrop-blur-xl border border-slate-700/50">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
            {folderName}
          </h1>
          <p className="text-sm text-slate-400 mt-1">{itemCount} items</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <IconButton tooltip="Sort Options">
            <ArrowsUpDownIcon className="w-5 h-5 text-slate-300" />
          </IconButton>
          <IconButton tooltip="Filter Media">
            <FunnelIcon className="w-5 h-5 text-slate-300" />
          </IconButton>
          <IconButton tooltip="Change View">
            <ViewColumnsIcon className="w-5 h-5 text-slate-300" />
          </IconButton>
        </div>
      </div>
    </header>
  );
};

export default FolderHeader;

