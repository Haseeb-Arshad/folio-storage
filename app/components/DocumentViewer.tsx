import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';

// Define TypeScript interfaces
interface BookSection {
  id: string;
  title: string;
  content: string;
}

interface DocumentViewerProps {
  title?: string;
  sections: BookSection[];
  className?: string;
}

export function DocumentViewer({ title = 'Document Viewer', sections = [], className }: DocumentViewerProps) {
  // Safely handle empty sections array
  const safeSections = Array.isArray(sections) && sections.length > 0 ? sections : [];
  
  const [activeSection, setActiveSection] = useState<string>(safeSections[0]?.id || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const topMenuRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Set initial active section when sections change
  useEffect(() => {
    if (safeSections.length > 0 && !safeSections.find(s => s.id === activeSection)) {
      setActiveSection(safeSections[0].id);
    }
  }, [safeSections, activeSection]);

  // Track cursor position for the orange dot throughout the entire page
  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPosition({
      x: e.clientX,
      y: e.clientY
    });
  };
  
  // Handle section change with smooth transitions
  const changeSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMenuOpen(false); // Close menu after selection
  };

  const getCurrentSection = () => {
    return safeSections.find(section => section.id === activeSection) || safeSections[0] || null;
  };

  const currentSection = getCurrentSection();

  // Menu toggle animation variants
  const menuVariants = {
    closed: {
      opacity: 0,
      x: -100,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.04,
        delayChildren: 0.1
      }
    }
  } as const;

  const menuItemVariants = {
    closed: { x: -20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <div 
      ref={pageRef}
      className={cn(
        "relative w-full h-full min-h-screen overflow-hidden bg-[#141414]", // Exact background color from reference
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background gradient for depth - exact match to reference image */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 pointer-events-none opacity-95"></div>
      <div className="absolute inset-0 bg-[#1a1a1a] opacity-50 pointer-events-none"></div>
      
      {/* Orange cursor dot for the entire page */}
      <AnimatePresence>
        {isHovering && (
          <motion.div
            className="fixed w-[10px] h-[10px] bg-orange-500 rounded-full pointer-events-none z-50 shadow-md shadow-orange-500/50"
            style={{
              left: cursorPosition.x - 5,
              top: cursorPosition.y - 5
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      
      {/* Collapsible/expandable menu bar - matches reference image */}
      <div 
        ref={topMenuRef}
        className="absolute left-0 right-0 top-8 mx-auto shadow-xl z-30 transition-all duration-300 ease-in-out"
        style={{ 
          width: menuOpen ? '90%' : '370px', 
          maxWidth: menuOpen ? '90%' : '450px'
        }}
      >
        <motion.div 
          className="bg-[#2a2a2a] rounded-lg overflow-hidden relative"
          animate={{ height: menuOpen ? 'auto' : '60px' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Collapsed state shows only active section */}
          <div 
            className="px-4 py-4 flex items-center justify-between cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="text-orange-500 font-medium">
              {currentSection?.title || "Select a section"}
            </div>
            <motion.div 
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.div>
          </div>
          
          {/* Expandable section list */}
          {menuOpen && (
            <div className="px-4 pb-4 pt-2 border-t border-gray-700/30">
              <div className="flex flex-col space-y-2 text-sm">
                {safeSections.map((section) => (
                  <motion.div
                    key={section.id}
                    className={cn(
                      "px-3 py-2 cursor-pointer rounded-md transition-all",
                      activeSection === section.id 
                        ? "text-orange-500" 
                        : "text-gray-400 hover:text-gray-200"
                    )}
                    onClick={() => {
                      changeSection(section.id);
                      setMenuOpen(false); // Close menu after selection
                    }}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {section.title}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>



      {/* Content Area with Fixed Bottom Blur */}
      <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden">
        {/* Fixed bottom fade effect - does not scroll with content */}
        <div className="absolute left-0 right-0 bottom-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none z-10 opacity-90"></div>
        
        {/* Scrollable Content Area */}
        <div className="absolute inset-0 overflow-y-auto pt-28 pb-32">
          <AnimatePresence mode="wait">
            {currentSection ? (
              <motion.div
                key={activeSection}
                ref={contentRef}
                className="prose prose-invert max-w-3xl mx-auto px-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl font-serif mb-10 text-white tracking-tight font-medium">
                  {currentSection.title.split(':')[1] || currentSection.title}
                </h2>
                <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400">No content available</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Additional styles for the document viewer */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Style the document content */
        .prose img {
          border-radius: 4px;
          margin: 1.5rem 0;
        }

        .prose p {
          line-height: 1.9;
          margin-bottom: 1.5rem;
          color: rgba(229, 231, 235, 0.8);
          font-size: 1.05rem;
          letter-spacing: 0.01em;
        }

        .prose h3 {
          letter-spacing: 0.05em;
          margin-bottom: 1.75rem;
          font-weight: 500;
          color: rgba(229, 231, 235, 0.9);
        }

        /* Custom transitions for page elements */
        .prose > * {
          transition: transform 0.3s ease-out, opacity 0.3s ease-out;
        }

        /* Enhance reader experience */
        .document-content {
          max-width: 42rem;
          margin: 0 auto;
        }
        
        /* Hide scrollbar but maintain functionality */
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.2);
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.4);
          border-radius: 2px;
        }
      `}} />
    </div>
  );
}
