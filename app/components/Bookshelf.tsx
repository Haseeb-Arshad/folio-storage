import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface BookshelfProps {
  children: ReactNode;
}

export function Bookshelf({ children }: BookshelfProps) {
  return (
    <div className="w-full relative pb-8">
      {/* Main Shelf - now white, minimalist with sharp edges */}
      <div className="relative w-full">
        <div className="absolute top-0 -left-4 -right-4 h-10 bg-white rounded-sm shadow-[0_5px_15px_rgba(0,0,0,0.08)]" 
          style={{ 
            boxShadow: '0 5px 15px rgba(0,0,0,0.08), 0 -1px 0 rgba(255,255,255,0.6) inset',
          }}>
          {/* Subtle highlight on the top edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-white/80"></div>
        </div>
        
        {/* Children (books) container */}
        <div className="relative flex items-end justify-center space-x-4 pt-4 pb-20">
          {children}
        </div>
        
        {/* Shadow under the bookshelf */}
        <div className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-b from-black/10 to-transparent"></div>
      </div>
    </div>
  );
} 