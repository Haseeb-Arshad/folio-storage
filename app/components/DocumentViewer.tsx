import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { useTheme } from '../context/theme-provider';

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
  
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [activeSection, setActiveSection] = useState<string>(safeSections[0]?.id || '');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const topMenuRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Function to truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

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

  // Smooth menu animation variants
  const menuVariants = {
    closed: {
      height: 0,
      transition: {
        duration: 0.25,
        ease: 'easeInOut'
      }
    },
    open: {
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.03
      }
    }
  } as const;

  const menuItemVariants = {
    closed: { y: -5, opacity: 0 },
    open: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.15,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div 
      ref={pageRef}
      className={cn(
        "relative w-full h-full min-h-screen overflow-hidden", 
        isDarkMode ? "bg-[#141414]" : "bg-[#f5f5f5]", 
        className
      )}
    >
      {/* Hide top navbar when document viewer is open */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .dashboard-top-navbar { display: none !important; }
          .document-viewer-fullscreen {
            height: 100vh !important;
            min-height: 100vh !important;
            padding-top: 0 !important;
          }
          body { padding-top: 0 !important; }
          .document-content p {
            color: #000000 !important; /* Ensure paragraph text is black */
          }
        `
      }} />
      
      {/* Background with theme-aware gradient */}
      <div className={cn(
        "absolute inset-0 pointer-events-none",
        isDarkMode 
          ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800" 
          : "bg-white"
      )}></div>
      
      {/* Orange dot cursor removed as requested */}
      
      {/* Collapsible/expandable menu bar - matches reference image exactly */}
      <div 
        ref={topMenuRef}
        className="absolute left-0 right-0 top-8 mx-auto shadow-xl z-30 transition-all duration-300 ease-in-out"
        style={{ 
          width: '370px', 
          maxWidth: '450px'
        }}
      >
        <motion.div 
          className={cn(
            "rounded-lg overflow-hidden relative shadow-lg",
            isDarkMode ? "bg-[#1f1f1f]" : "bg-[#2a2a2a]"
          )}
          initial={false}
          animate={{ 
            maxHeight: menuOpen ? 500 : 60 
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {/* Collapsed state shows only active section */}
          <div 
            className="px-4 py-3 flex items-center justify-between cursor-pointer min-h-[60px]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="text-orange-500 font-medium leading-snug mx-auto text-center w-[85%] truncate">
              {truncateText(currentSection?.title || "Select a section", 45)}
            </div>
            <motion.div 
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ duration: 0.15, type: "spring", stiffness: 500 }}
              className="text-orange-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.div>
          </div>
          
          {/* Expandable section list */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div 
                className="px-4 pb-4 pt-2 border-t border-gray-700/30"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 700,
                  damping: 30 
                }}
              >
                <div className="flex flex-col space-y-2 text-sm">
                  {safeSections.map((section, index) => (
                    <motion.div
                      key={section.id}
                      className={cn(
                        "px-3 py-2 cursor-pointer rounded-md transition-all",
                        activeSection === section.id 
                          ? "text-orange-500" 
                          : "text-gray-100 hover:text-white"
                      )}
                      onClick={() => {
                        changeSection(section.id);
                        setMenuOpen(false); // Close menu after selection
                      }}
                      whileHover={{ x: 8, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      custom={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.1, 
                        delay: index * 0.03,
                        type: "spring",
                        stiffness: 500,
                        damping: 20
                      }}
                    >
                      {section.title}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>



      {/* Content Area with Fixed Bottom Blur */}
      <div className="absolute left-0 right-0 top-0 bottom-0 overflow-hidden">
        {/* Fixed bottom fade effect - does not scroll with content */}
        <div className={cn(
          "absolute left-0 right-0 bottom-0 h-48 bg-gradient-to-t pointer-events-none z-10 opacity-90",
          isDarkMode 
            ? "from-black to-transparent" 
            : "from-white to-transparent"
        )}></div>
        
        {/* Scrollable Content Area */}
        <div className="absolute inset-0 overflow-y-auto pt-28 pb-32">
          <AnimatePresence mode="wait">
            {currentSection ? (
              <motion.div
                key={activeSection}
                ref={contentRef}
                className={cn(
                  "max-w-3xl mx-auto px-10 text-base leading-relaxed",
                  isDarkMode 
                    ? "prose-invert prose-headings:text-white prose-li:text-gray-200" 
                    : "prose prose-headings:text-black prose-li:text-gray-800 prose-strong:text-black prose-strong:font-semibold"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className={cn(
                  "text-4xl font-serif mb-10 tracking-tight font-medium",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
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
